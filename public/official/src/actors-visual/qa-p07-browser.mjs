/* P07 Chromium/Phaser/WebGL2 visual QA (NOT_RUN unless explicitly executed).
 * After checkout: npm install && npm run build
 * npm install --no-save playwright && npx playwright install chromium
 * node public/official/src/actors-visual/qa-p07-browser.mjs
 * Generates TRUE screenshots and filmstrips, not artificial images.
 */
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile,stat,mkdir,writeFile} from 'node:fs/promises';
import {join,resolve,sep,extname} from 'node:path';
const ROOT=resolve('dist'),OUT=resolve('docs/art/actors/evidencias/P07');
const mime={'.html':'text/html','.mjs':'application/javascript','.js':'application/javascript',
 '.svg':'image/svg+xml','.png':'image/png','.json':'application/json','.css':'text/css'};
const server=createServer(async(req,res)=>{
 try{
  const uri=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  const path=resolve(ROOT,'.'+uri);if(path!==ROOT&&!path.startsWith(ROOT+sep))throw Error('outside root');
  const file=(await stat(path)).isDirectory()?join(path,'index.html'):path;
  const bytes=await readFile(file);
  res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream'});res.end(bytes);
 }catch(e){res.writeHead(404);res.end('not found');}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
await mkdir(OUT,{recursive:true});
const URL='http://127.0.0.1:'+server.address().port+'/official/src/actors-visual/p07-index.html';
const report={schemaVersion:'p07-browser-v1',runtime:'Chromium+SwiftShader (not iPhone)',
 success:false,screenshots:[],filmstrips:[],cases:[],errors:[],gameplayImplemented:false};
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader',
  '--enable-webgl','--enable-unsafe-swiftshader']});
 for(const [width,height,name] of [[1280,768,'desktop'],[844,390,'landscape844'],[932,430,'landscape932']]){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,
   isMobile:width<950,hasTouch:width<950});
  const page=await context.newPage(),pageErrors=[];
  page.on('pageerror',e=>pageErrors.push(e.message));
  await page.goto(URL,{waitUntil:'load',timeout:45000});
  await page.waitForFunction(()=>!!window.__SEMANTROPIC_P07?.scene,null,{timeout:45000});
  const start=await page.evaluate(()=>{
   const s=window.__SEMANTROPIC_P07.scene;
   return {phaser:Phaser.VERSION,gl2:s.game.renderer.gl instanceof WebGL2RenderingContext,
    textures:s.activeKeys.length,sprites:s.sprites.length};
  });
  if(start.phaser!=='4.2.1'||!start.gl2||start.textures!==3||start.sprites!==3)
   throw Error('invalid P07 runtime '+name+' '+JSON.stringify(start));
  for(const actor of ['warrior','hound','infantry_recruit','sniper_operator']){
   await page.locator('[data-actor="'+actor+'"]').click();
   await page.locator('[data-state="walk"]').click();
   await page.waitForTimeout(80);
   const info=await page.evaluate(()=>{
    const s=window.__SEMANTROPIC_P07.scene;
    return {actors:s.sprites.length,source:s.activeKeys[2],all32:s.textures.get(s.activeKeys[2]).has('blocked-2')};
   });
   if(!info.all32||info.actors!==3)throw Error('actor '+actor+' registration invalid');
  }
  await page.locator('[data-actor="sniper_operator"]').click();
  await page.locator('#background').click();
  await page.locator('#guides').click();
  await page.locator('#pause').click();
  await page.locator('#step').click();
  await page.locator('#stress').click();
  const clones=await page.evaluate(()=>window.__SEMANTROPIC_P07.scene.copies.length);
  if(clones!==24)throw Error('P07 clone count '+clones);
  await page.waitForTimeout(120);
  const screenshot='p07-'+name+'-real-webgl2.png';
  await page.screenshot({path:join(OUT,screenshot),fullPage:true});
  report.screenshots.push({path:'docs/art/actors/evidencias/P07/'+screenshot,viewport:width+'x'+height,source:'REAL Chromium/Phaser WebGL2'});
  report.cases.push({name,start,clones,pageErrors});
  if(pageErrors.length)throw Error(name+': page exceptions '+pageErrors.join(' | '));
  if(name==='desktop'){
   for(const actor of ['warrior','hound','infantry_recruit','sniper_operator']){
    await page.locator('[data-actor="'+actor+'"]').click();
    const raw=await page.evaluate(()=>{
     const s=window.__SEMANTROPIC_P07.scene;
     const img=s.textures.get(s.activeKeys[2]).getSourceImage();
     const cv=document.createElement('canvas');cv.width=704;cv.height=416;
     const c=cv.getContext('2d',{alpha:true});
     for(const [i,n] of [0,4,6,12,14,17,21,27].entries())
      c.drawImage(img,n%8*176,Math.floor(n/8)*208,176,208,i%4*176,Math.floor(i/4)*208,176,208);
     return cv.toDataURL('image/png');
    });
    const path='P07-'+actor+'-real-filmstrip.png';
    await writeFile(join(OUT,path),Buffer.from(raw.split(',')[1],'base64'));
    report.filmstrips.push('docs/art/actors/evidencias/P07/'+path);
   }
  }
  await context.close();
 }
 report.success=true;
}catch(e){report.errors.push(String(e));process.exitCode=1;
}finally{
 if(browser)await browser.close();
 server.close();
 await writeFile(join(OUT,'RUN_P07_BROWSER.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify(report,null,2));
}
