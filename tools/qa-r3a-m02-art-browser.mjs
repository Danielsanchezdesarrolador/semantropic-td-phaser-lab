/**
 * R3-A M02 visual gate in real Chromium WebGL2 on the single existing LIVE
 * page. QA-only overlay; production UI/scene remains M01 until gameplay ready.
 */
import {createServer} from 'node:http';
import {readFile,stat,mkdir} from 'node:fs/promises';
import {resolve,join,extname,sep} from 'node:path';
import {chromium} from 'playwright';
const root=resolve('dist'),out='artifacts/r3a-m02-farmland-browser';
await mkdir(out,{recursive:true});
const mime={'.html':'text/html;charset=utf-8','.mjs':'text/javascript;charset=utf-8',
 '.js':'text/javascript;charset=utf-8','.css':'text/css','.json':'application/json',
 '.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{
 const p=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
 if(p!==root&&!p.startsWith(root+sep))throw Error('unsafe path');
 const f=(await stat(p)).isDirectory()?join(p,'index.html'):p;
 res.writeHead(200,{'Content-Type':mime[extname(f)]??'application/octet-stream'});
 res.end(await readFile(f));
}catch(error){res.writeHead(404);res.end(String(error))}});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
let browser;const records=[];
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader',
 '--enable-webgl','--enable-unsafe-swiftshader']});
 for(const [name,width,height] of [['desktop',1280,768],['android844',844,390],['android932',932,430]]){
  const page=await browser.newPage({viewport:{width,height},
    hasTouch:width<1000,isMobile:width<1000});
  const errors=[],consoleErrors=[],requests=[];
  page.on('pageerror',e=>errors.push(e.stack||e.message));
  page.on('console',e=>{if(e.type()==='error')consoleErrors.push(e.text())});
  page.on('requestfailed',r=>requests.push(r.url()+':'+r.failure()?.errorText));
  const origin='http://127.0.0.1:'+server.address().port;
  const response=await page.goto(origin+'/official/src/live/',{waitUntil:'load',timeout:30000});
  if(response?.status()!==200)throw Error('LIVE route broken');
  try{
   await page.waitForFunction(()=>!!window.__SEMANTROPIC_C1D7?.scene,null,{timeout:16000});
  }catch(e){
   const state=await page.evaluate(()=>({
    feedback:document.querySelector('#feedback')?.textContent,
    render:document.querySelector('#render')?.textContent,
    selectedMap:new URLSearchParams(location.search).get('map'),
    gameState:!!window.__SEMANTROPIC_C1D7?.scene,
    title:document.title
   }));
   throw Error('R7 STARTUP_DIAGNOSTIC '+JSON.stringify({viewport:name,state,
    errors:errors.slice(-5),consoleErrors:consoleErrors.slice(-8),
    requests:requests.slice(-10)})+'; '+e.message);
  }
  const result=await page.evaluate(async()=>{
   const original=window.__SEMANTROPIC_C1D7,game=original.scene.game;
   if(!(game.renderer.gl instanceof WebGL2RenderingContext))throw Error('M01 WebGL2 missing');
   if(original.world.economy.gold!==365||original.world.wave!==0)throw Error('Live M01 gameplay changed');
   const mod=await import('/official/src/maps-visual/m02/farmland-art.mjs');
   const tower=await import('/official/src/maps-visual/m02/rework-contract.mjs');
   const m=await (await fetch('/official/data/maps.v5.json')).json();
   const map=m.find(x=>x.id===2),art=mod.makeM02ArtCanvas(map);
   if(art.canvas.width!==2560||art.canvas.height!==1536)throw Error('M02 texture not 2x');
   if(art.qa.routeVertices!==163||art.qa.padsRendered!==8)throw Error('Canonical M02 geometry lost');
   if(tower.validatedReworkForM02(map).families.length!==5)throw Error('Only five rework tower families supported');
   const screen=document.createElement('section');
   screen.style.cssText='position:fixed;inset:0;z-index:99999;display:grid;place-items:center;background:#112e32';
   const stage=document.createElement('div');stage.style.cssText='max-width:100vw;max-height:100vh;position:relative';
   art.canvas.style.cssText='display:block;max-width:100vw;max-height:100vh;width:auto;height:auto';
   stage.appendChild(art.canvas);
   const caption=document.createElement('aside');
   caption.style.cssText='position:absolute;left:10px;top:10px;background:#10343edd;color:#fff4ce;padding:8px;font:14px sans-serif;border-radius:6px';
   caption.textContent='MAPA 02 · CAMPOS DEL MOLINO · R6 Valle Dorado · visual premium integrado al mapa jugable · T04/P03 + 5 torres rework';
   stage.appendChild(caption);screen.appendChild(stage);document.body.appendChild(screen);
   return {source:'M02 V5',pathNodes:art.qa.routeVertices,pads:art.qa.padsRendered,
    waves:7,towerRework:tower.M02_REWORK_FAMILIES.map(f=>f.id),
    canvas:[art.canvas.width,art.canvas.height],m01Untouched:original.world.economy.gold===365};
  });
  await page.screenshot({path:out+'/'+name+'-m02-source-art.png',fullPage:true});
  if(errors.length)throw Error(errors.join(' | '));
  records.push({viewport:name,width,height,...result});await page.close();
 }
 console.log(JSON.stringify({status:'PASS_R3A_M02_CANONICAL_ART_BROWSER',records,
  playableMap02:true,m01Playable:true,androidPhysical:false},null,2));
}catch(e){console.error('FAIL_R3A_M02_ART',e.stack||String(e));process.exitCode=1}
finally{await browser?.close();await new Promise(ok=>server.close(ok))}
