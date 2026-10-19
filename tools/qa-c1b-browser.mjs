/**
 * C1-B real Chromium + Phaser WebGL2 smoke.
 * Run after build: npm install --no-save playwright && npx playwright install chromium
 * Reports real screenshots + UI actions; gameplay logic remains out of scope.
 */
import {createServer} from 'node:http';
import {readFile,stat,mkdir} from 'node:fs/promises';
import {resolve,join,extname,sep} from 'node:path';
import {chromium} from 'playwright';
const ROOT=resolve('dist');
const TYPE={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.css':'text/css; charset=utf-8'};
const server=createServer(async(req,res)=>{
 try{
  const url=new URL(req.url||'/', 'http://localhost');
  const p=decodeURIComponent(url.pathname);
  const file=resolve(ROOT,'.'+p);
  if(file!==ROOT&&!file.startsWith(ROOT+sep))throw Error('Path outside static root');
  let chosen=file;if((await stat(file)).isDirectory())chosen=join(file,'index.html');
  const content=await readFile(chosen);
  res.writeHead(200,{'Content-Type':TYPE[extname(chosen)]||'application/octet-stream','Access-Control-Allow-Origin':'*','Cache-Control':'no-store'});res.end(content);
 }catch(e){res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const port=server.address().port;
const origin='http://127.0.0.1:'+port;
const href=origin+'/official/src/c1b-art-review/index.html';
await mkdir('artifacts/c1b-browser',{recursive:true});
let browser;
const failures=[],reports=[];
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader']});
 async function inspect({tag,width,height,variant,palette}){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,isMobile:width<950});
  const errors=[];
  page.on('pageerror',e=>errors.push('pageerror '+e.message));
  page.on('console',msg=>{if(msg.type()==='error')errors.push('console '+msg.text());});
  await page.goto(href+'?actors='+variant+'&palette='+palette,{waitUntil:'load',timeout:40000});
  try{await page.waitForFunction(()=>!!window.__SEMANTROPIC_C1B?.scene,{timeout:50000});}catch(e){
   const reason=await page.locator('#status').textContent().catch(()=>'missing status');
   throw Error(tag+': viewport '+width+'x'+height+' initialization failed: '+reason+' '+errors.join(' | '));
  }
  await page.waitForTimeout(500);
  const values=await page.evaluate(()=>{
   const {scene}=window.__SEMANTROPIC_C1B;
   const g=scene.game.renderer?.gl;
   return {webgl2:g instanceof WebGL2RenderingContext,actors:scene.actors?.length,towers:scene.towers?.length,sockets:scene.mapView?.plan?.sockets?.length,waypoints:scene.route?.points?.length,textureKeys:scene.atlases?.size,artVersion:scene.mapView?.artVersion,sceneActive:scene.scene.isActive()};
  });
  if(values.actors!==13||values.towers!==4||values.sockets!==8||values.waypoints!==133||values.textureKeys!==4||!values.webgl2)throw Error(tag+' invalid scene: '+JSON.stringify(values));
  await page.screenshot({path:'artifacts/c1b-browser/'+tag+'.png',fullPage:true});
  if(tag==='desktop-B'){
   await page.locator('#fx').click();await page.waitForTimeout(120);
   const activeFx=await page.evaluate(()=>window.__SEMANTROPIC_C1B.scene.fx.jobs.size);
   if(activeFx<1)throw Error('T03 FX did not dispatch to C1B');
   await page.locator('#pause').click();
   await page.waitForTimeout(120); // Phaser changes scene status at its next game tick.
   const paused=await page.evaluate(()=>window.__SEMANTROPIC_C1B.scene.scene.isPaused());
   if(!paused)throw Error('Pause failed: scene status did not become PAUSED after tick');
   await page.locator('#pause').click();
   await page.waitForTimeout(120);
   await page.locator('#sockets').click();
   await page.locator('#palette').selectOption('equilibrada');
   await page.waitForTimeout(200);
   const pal=await page.evaluate(()=>window.__SEMANTROPIC_C1B.scene.mapView.palette);
   if(pal!=='equilibrada')throw Error('Map palette did not switch');
   await page.screenshot({path:'artifacts/c1b-browser/desktop-after-controls.png',fullPage:true});
   values.fxTriggered=activeFx;values.pauseWorks=paused;values.paletteUpdated=pal;
  }
  const fatalErrors=errors.filter(s=>!s.includes('WebGL: INVALID_ENUM')); // browser GPU logs can include driver diagnostics
  if(fatalErrors.length)throw Error(tag+' browser JS console errors: '+fatalErrors.slice(0,5).join(' | '));
  reports.push({tag,size:width+'x'+height,variant,palette,...values});
  await page.close();
 }
 await inspect({tag:'desktop-B',width:1280,height:768,variant:'B',palette:'viva'});
 await inspect({tag:'mobile-landscape-A',width:844,height:390,variant:'A',palette:'equilibrada'});
 await inspect({tag:'mobile-landscape-B',width:932,height:430,variant:'B',palette:'viva'});
 console.log(JSON.stringify({status:'BROWSER_PASS',renderer:'Phaser WebGL2 Chromium SwiftShader',scope:'VISUAL_SCENE_NO_GAMEPLAY',reports},null,2));
}catch(e){console.error('C1B_BROWSER_FAIL '+(e?.stack||String(e)));process.exitCode=1;
}finally{await browser?.close();await new Promise(r=>server.close(r));}
