/* SEMANTROPIC TD P05 browser QA, MUST be run in real checkout:
 * npm install && npm run build
 * npm install --no-save playwright && npx playwright install chromium
 * node public/official/src/actors-visual/qa-p05-browser.mjs
 * Saves actual Chromium WebGL2 captures + raw atlas PNG only AFTER run.
 */
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile,stat,mkdir,writeFile} from 'node:fs/promises';
import {resolve,extname,join,sep} from 'node:path';
import {createHash} from 'node:crypto';
const ROOT=resolve('dist'),OUT=resolve('docs/art/actors/evidencias/P05');
const types={'.html':'text/html','.mjs':'application/javascript','.js':'application/javascript',
 '.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.css':'text/css'};
const server=createServer(async(req,res)=>{
 try{
  const uri=decodeURIComponent(new URL(req.url||'/', 'http://127.0.0.1').pathname);
  const source=resolve(ROOT,'.'+uri);
  if(source!==ROOT&&!source.startsWith(ROOT+sep))throw Error('Path blocked');
  const target=(await stat(source)).isDirectory()?join(source,'index.html'):source;
  const data=await readFile(target);res.writeHead(200,{'Content-Type':types[extname(target)]||'application/octet-stream'});
  res.end(data);
 }catch(e){res.writeHead(404);res.end('Not found');}
});
await new Promise(done=>server.listen(0,'127.0.0.1',done));
await mkdir(OUT,{recursive:true});
const href='http://127.0.0.1:'+server.address().port+'/official/src/actors-visual/p05-index.html';
const report={schemaVersion:'p05-browser-real-v1',createdAt:new Date().toISOString(),
 method:'Playwright Chromium SwiftShader (emulated viewport, NOT physical phone)',
 success:false,cases:[],actualScreenshots:[],actualPngs:[],errors:[],gameplayImplemented:false};
let browser;
try{
 browser=await chromium.launch({headless:true,
  args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader']});
 for(const [width,height,tag] of [[1280,768,'desktop'],[844,390,'landscape844'],[932,430,'landscape932']]){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,
   isMobile:width<950,hasTouch:width<950});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(href,{waitUntil:'load',timeout:45000});
  await page.waitForFunction(()=>Boolean(window.__SEMANTROPIC_P05?.scene),null,{timeout:50000});
  const startup=await page.evaluate(()=>{
   const s=window.__SEMANTROPIC_P05.scene;
   return {phaser:Phaser.VERSION,webgl2:s.game.renderer?.gl instanceof WebGL2RenderingContext,
    atlases:s.bundles.length,sprites:s.childrenActors.length};
  });
  if(startup.phaser!=='4.2.1'||!startup.webgl2||startup.atlases!==2||startup.sprites!==3)
   throw Error(tag+': bad runtime '+JSON.stringify(startup));
  for(const actor of ['warrior','hound','infantry_recruit','sniper_operator']){
   await page.locator('[data-actor="'+actor+'"]').click();
   await page.locator('[data-event="hit_applied"]').click();
   await page.waitForTimeout(90);
   await page.locator('#reset').click();
  }
  await page.locator('[data-event="entity_escape"]').click();
  await page.waitForTimeout(360);
  const escaped=await page.evaluate(()=>{
   const x=window.__SEMANTROPIC_P05.controller.snapshot();
   return {state:x.state,complete:x.isComplete,opacity:x.opacity};
  });
  if(escaped.state!=='escape'||!escaped.complete||escaped.opacity!==0)
   throw Error(tag+': escape animation incomplete '+JSON.stringify(escaped));
  await page.locator('#reset').click();
  await page.locator('#crowd').click();
  const copies=await page.evaluate(()=>window.__SEMANTROPIC_P05.scene.copies.length);
  if(copies!==24)throw Error(tag+': expected 24 visual clones');
  await page.locator('[data-event="hit_applied"]').click();
  await page.waitForTimeout(100);
  const filename='p05-'+tag+'-P04-vs-P05-real-webgl2.png';
  await page.screenshot({path:join(OUT,filename),fullPage:true});
  report.actualScreenshots.push({path:'docs/art/actors/evidencias/P05/'+filename,
   captureType:'REAL Chromium Phaser WebGL2',viewport:width+'x'+height});
  report.cases.push({tag,startup,copies,escapeVerified:escaped.complete,pageErrors:errors});
  if(errors.length)throw Error(tag+': '+errors.join(' / '));
  if(tag==='desktop'){
   for(const actor of ['warrior','hound','infantry_recruit','sniper_operator']){
    await page.locator('[data-actor="'+actor+'"]').click();
    const png=await page.evaluate(()=>{
     const canvas=window.__SEMANTROPIC_P05.scene.bundles[1].canvas;
     const g=canvas.getContext('2d',{willReadFrequently:true});
     const data=g.getImageData(0,0,canvas.width,canvas.height).data;
     let opaque=0,nonzero=0;
     for(let i=3;i<data.length;i+=4){if(data[i]===255)opaque++;if(data[i]>0)nonzero++;}
     return {uri:canvas.toDataURL('image/png'),width:canvas.width,height:canvas.height,
      nonzeroAlphaPixels:nonzero,opaqueAlphaPixels:opaque};
    });
    if(png.width!==1408||png.height!==832||png.nonzeroAlphaPixels<100)
     throw Error('P05 no readable pixels '+actor);
    const raw=Buffer.from(png.uri.split(',')[1],'base64');
    const name='p05-'+actor+'-draft-atlas.png';
    await writeFile(join(OUT,name),raw);
    report.actualPngs.push({path:'docs/art/actors/evidencias/P05/'+name,
      sha256:createHash('sha256').update(raw).digest('hex'),bytes:raw.length,
      width:png.width,height:png.height,nonzeroAlphaPixels:png.nonzeroAlphaPixels,
      opaqueAlphaPixels:png.opaqueAlphaPixels,alphaInspected:true});
   }
  }
  await context.close();
 }
 report.success=true;
}catch(e){report.errors.push(String(e));process.exitCode=1;
}finally{
 if(browser)await browser.close();
 server.close();
 await writeFile(join(OUT,'RUN_P05_BROWSER.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify(report,null,2));
}
