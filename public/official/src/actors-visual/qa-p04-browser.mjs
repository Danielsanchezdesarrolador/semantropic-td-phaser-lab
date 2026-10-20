/**
 * SEMANTROPIC TD P04: real browser QA, run only after building dist.
 * Pre-req: npm install && npm run build && npm install --no-save playwright
 * node public/official/src/actors-visual/qa-p04-browser.mjs
 * Saves screenshots into docs/art/actors/evidencias/P04/. No fake images.
 */
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile,stat,mkdir,writeFile} from 'node:fs/promises';
import {extname,resolve,join,sep} from 'node:path';
const ROOT=resolve('dist'),OUT=resolve('docs/art/actors/evidencias/P04');
const mime={'.html':'text/html','.mjs':'application/javascript','.js':'application/javascript','.json':'application/json','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url||'/', 'http://127.0.0.1').pathname);
  const p=resolve(ROOT,'.'+pathname);
  if(p!==ROOT&&!p.startsWith(ROOT+sep))throw Error('outside root');
  const path=(await stat(p)).isDirectory()?join(p,'index.html'):p;
  const data=await readFile(path);
  res.writeHead(200,{'Content-Type':mime[extname(path)]||'application/octet-stream'});res.end(data);
 }catch(err){res.writeHead(404);res.end('Not found');}
});
await new Promise(done=>server.listen(0,'127.0.0.1',done));
const url='http://127.0.0.1:'+server.address().port+'/official/src/actors-visual/p04-index.html';
await mkdir(OUT,{recursive:true});
const report={source:'real chromium only',cases:[],errors:[],success:false,gameplayImplemented:false};
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader']});
 for(const [width,height,tag] of [[1280,768,'desktop'],[844,390,'mobile844'],[932,430,'mobile932']]){
  const context=await browser.newContext({viewport:{width,height},isMobile:width<950,hasTouch:width<950});
  const page=await context.newPage();
  const errs=[];page.on('pageerror',e=>errs.push(e.message));
  await page.goto(url,{waitUntil:'load',timeout:45000});
  await page.waitForFunction(()=>Boolean(window.__SEMANTROPIC_P04?.scene),{timeout:45000});
  const info=await page.evaluate(()=>{
   const scene=window.__SEMANTROPIC_P04.scene;
   return {version:Phaser.VERSION,gl2:scene.game.renderer.gl instanceof WebGL2RenderingContext,
    comparators:scene.bundles.length,actors:scene.pieces.length};
  });
  if(info.version!=='4.2.1'||!info.gl2||info.comparators!==5||info.actors!==5)
   throw Error('invalid runtime '+tag+' '+JSON.stringify(info));
  for(const actor of ['warrior','hound','infantry_recruit','sniper_operator']){
   await page.locator('[data-actor="'+actor+'"]').click();
   await page.locator('[data-state="walk"]').click();
  }
  await page.locator('#stress').click();
  const clones=await page.evaluate(()=>window.__SEMANTROPIC_P04.scene.stressSprites.length);
  if(clones!==24)throw Error('stress expected 24, got '+clones);
  await page.locator('#step').click();
  await page.locator('#facing').click();
  await page.locator('#guides').click();
  const out='P04-'+tag+'-real-webgl2.png';
  await page.screenshot({path:join(OUT,out)});
  if(errs.length)throw Error('browser exception '+errs.join('; '));
  report.cases.push({viewport:width+'x'+height,renderer:'Chromium SwiftShader WebGL2',actors:4,clones,
   screenshot:'docs/art/actors/evidencias/P04/'+out});
  await context.close();
 }
 report.success=true;
}catch(e){report.errors.push(String(e));process.exitCode=1;
}finally{
 if(browser)await browser.close();
 server.close();
 await writeFile(join(OUT,'RUN_P04_BROWSER.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify(report,null,2));
}
