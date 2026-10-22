/** R6 — Real Chromium/Phaser WebGL2 premium M02 visual integration.
 * The map is now PLAYABLE, old QA-only preview reports superseded.
 */
import {createServer} from 'node:http';
import {readFile,stat,mkdir} from 'node:fs/promises';
import {resolve,join,extname,sep} from 'node:path';
import {chromium} from 'playwright';
const root=resolve('dist'),out='artifacts/r6-m02-premium-browser';
await mkdir(out,{recursive:true});
const mime={'.html':'text/html;charset=utf-8','.mjs':'text/javascript;charset=utf-8',
 '.js':'text/javascript;charset=utf-8','.svg':'image/svg+xml','.png':'image/png',
 '.css':'text/css','.json':'application/json'};
const server=createServer(async(req,res)=>{try{
 const p=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
 if(p!==root&&!p.startsWith(root+sep))throw Error('Unsafe path');
 const file=(await stat(p)).isDirectory()?join(p,'index.html'):p;
 res.writeHead(200,{'Content-Type':mime[extname(file)]??'application/octet-stream'});
 res.end(await readFile(file));
}catch(e){res.writeHead(404);res.end(String(e))}});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
let browser;const cases=[];
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader',
 '--enable-webgl','--enable-unsafe-swiftshader']});
 for(const [viewport,width,height] of [
   ['desktop',1280,768],['android844',844,390],['android932',932,430]]){
  const page=await browser.newPage({viewport:{width,height},
   hasTouch:width<1000,isMobile:width<1000,deviceScaleFactor:width<1000?2:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const origin='http://127.0.0.1:'+server.address().port+'/official/src/live/';
  const response=await page.goto(origin+'?map=2',{waitUntil:'load',timeout:30000});
  if(response?.status()!==200)throw Error('Official game unavailable');
  await page.waitForFunction(()=>window.__SEMANTROPIC_C1D7?.world?.map?.id===2 &&
   !!window.__SEMANTROPIC_C1D7?.scene?.mapView,null,{timeout:50000});
  const result=await page.evaluate(async()=>{
   const g=window.__SEMANTROPIC_C1D7;
   const s=g.scene,w=g.world;
   if(!(s.game.renderer.gl instanceof WebGL2RenderingContext))
    throw Error('M02 not running in WebGL2');
   if(w.economy.gold!==395||w.campaign.waves.length!==7||w.route.points.length!==163)
    throw Error('Gameplay map changed');
   if(s.mapView.plan.sockets.length!==8)throw Error('Tower pads lost');
   const t=s.textures.get('maps/m02/farmland/r3-b2').getSourceImage();
   if(!t||t.width!==2560||t.height!==1536)throw Error('R6 not integrated 2x');
   const context=t.getContext('2d'),points=[
     [150,135],[520,122],[1020,140],[90,390],[320,612],
     [550,640],[790,687],[1100,705],[505,125]
   ];
   const seen=new Set();
   for(const [x,y] of points){
    const p=context.getImageData(x*2,y*2,1,1).data;
    if(p[3]!==255)throw Error('Map has transparent hole at '+x+','+y);
    seen.add([p[0]>>3,p[1]>>3,p[2]>>3].join(','));
   }
   if(seen.size<6)throw Error('Artwork still flat: insufficient palette variations');
   const mod=await import('/official/src/maps-visual/m02/farmland-art.mjs');
   const art=await import('/official/src/maps-visual/m02/premium-golden-valley-r6.mjs');
   if(mod.M02_ART_VERSION!=='r6-m02-golden-valley-v1' ||
     art.R6_MAP02_ART!=='r6-m02-golden-valley-paint-v1')throw Error('M02 old art loaded');
   const url=document.getElementById('mapPickerButton')?.textContent;
   if(!url?.includes('02'))throw Error('Map selector missing M02');
   // Gameplay continues to use actual build economy, not a static mockup.
   if(!w.economy.build(0,'infantry').ok)throw Error('Building blocked by visual redesign');
   w.syncTowers();s.drawTowers();s.drawSoldiers();
   if(w.economy.gold!==300)throw Error('Economy changed');
   const canvas=s.game.canvas.getBoundingClientRect(),stage=document.getElementById('stage').getBoundingClientRect();
   if(canvas.left<stage.left-2||canvas.right>stage.right+2||
      canvas.top<stage.top-2||canvas.bottom>stage.bottom+2)
     throw Error('Premium map clipped on mobile');
   return {mapId:w.map.id,route:w.route.points.length,pads:s.mapView.plan.sockets.length,
    texture:[t.width,t.height],visualDistinctSamples:seen.size,
    goldAfterInfantry:w.economy.gold,drawnMapVersion:mod.M02_ART_VERSION,
    gameplayStillLive:true};
  });
  await page.screenshot({path:out+'/'+viewport+'-R6-Campos-del-Molino.png',fullPage:true});
  if(errors.length)throw Error('Page errors '+errors.join(' | '));
  cases.push({viewport,width,height,...result});
  await page.close();
 }
 console.log(JSON.stringify({status:'PASS_R6_M02_PREMIUM_ART_REAL_CHROMIUM',cases,
  physicalAndroid:'PENDING',directorArtSignoff:'PENDING',humanBalance:'NOT_TESTED'},null,2));
}catch(e){console.error('FAIL_R6_M02_PREMIUM',e.stack||String(e));process.exitCode=1}
finally{await browser?.close();await new Promise(ok=>server.close(ok))}
