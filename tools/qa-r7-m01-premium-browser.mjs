/** SEMANTROPIC TD R7: actual Phaser WebGL2 / responsive render QA.
 * M01 premium scenic texture must be an in-game source, not a concept image.
 */
import {createServer} from 'node:http';
import {readFile,stat,mkdir} from 'node:fs/promises';
import {resolve,join,extname,sep} from 'node:path';
import {chromium} from 'playwright';
const root=resolve('dist'),out='artifacts/r7-m01-premium-browser';
await mkdir(out,{recursive:true});
const type={'.html':'text/html;charset=utf-8','.mjs':'text/javascript;charset=utf-8',
 '.js':'text/javascript;charset=utf-8','.png':'image/png','.svg':'image/svg+xml',
 '.css':'text/css','.json':'application/json'};
const server=createServer(async(req,res)=>{try{
 const p=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
 if(p!==root&&!p.startsWith(root+sep))throw Error('Unsafe path');
 const f=(await stat(p)).isDirectory()?join(p,'index.html'):p;
 res.writeHead(200,{'Content-Type':type[extname(f)]??'application/octet-stream'});
 res.end(await readFile(f));
}catch(e){res.writeHead(404);res.end(String(e))}});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
let browser;const results=[];
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader',
  '--enable-webgl','--enable-unsafe-swiftshader']});
 for(const [profile,width,height] of [['desktop',1280,768],['android844',844,390],['android932',932,430]]){
  const page=await browser.newPage({viewport:{width,height},hasTouch:width<1000,
   isMobile:width<1000,deviceScaleFactor:width<1000?2:1});
  const errors=[];page.on('pageerror',err=>errors.push(err.message));
  const base='http://127.0.0.1:'+server.address().port+'/official/src/live/';
  const res=await page.goto(base,{waitUntil:'load',timeout:30000});
  if(res?.status()!==200)throw Error('Official page HTTP failed '+res?.status());
  await page.waitForFunction(()=>window.__SEMANTROPIC_C1D7?.world?.map?.id===1 &&
   window.__SEMANTROPIC_C1D7?.scene?.mapView?.premiumArt &&
   window.__SEMANTROPIC_VIEWPORT?.panorama?.mapId===1,null,{timeout:50000});
  const result=await page.evaluate(async()=>{
   const g=window.__SEMANTROPIC_C1D7,w=g.world,scene=g.scene;
   if(!(scene.game.renderer.gl instanceof WebGL2RenderingContext))throw Error('Not WebGL2');
   if(w.route.points.length!==133||w.economy.gold!==365||w.campaign.waves.length!==5)
    throw Error('M01 source/campaign modified');
   if(scene.mapView.plan.sockets.length!==8||scene.mapView.premiumArt.width!==2560||
    scene.mapView.premiumArt.height!==1536)throw Error('R7 premium source not mounted');
   const art=scene.textures.get('maps/m01/r7/dawn-plateau/v1')?.getSourceImage();
   if(!art||art.width!==2560||art.height!==1536)throw Error('R7 source texture not 2x');
   const painter=await import('/official/src/maps-visual/m01/r7/dawn-plateau-art.mjs');
   if(painter.R7_MAP01_ART_VERSION!=='r7-m01-dawn-plateau-premium-v1')throw Error('Old R7 source');
   const scenic=scene.textures.get('maps/m01/r7/dawn-plateau/scenic-gutters/hf2')?.getSourceImage();
   if(!scenic||scenic.width!==1280||scenic.height!==768)
    throw Error('HF2 1280x768 scenic plate missing');
   const fullCtx=art.getContext('2d'),scenicCtx=scenic.getContext('2d');
   const delta=(x,y)=>{
    const a=fullCtx.getImageData(x*2,y*2,1,1).data,b=scenicCtx.getImageData(x,y,1,1).data;
    return Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])+Math.abs(a[2]-b[2]);
   };
   if(delta(57,345)<45||delta(1116,55)<45)
    throw Error('HF2 landmark present in terrain-only panorama');
   if(delta(325,405)>30)
    throw Error('HF2 mismatch in seamless clear meadow');
   const ctx=art.getContext('2d'),points=[[50,70],[230,165],[450,235],[725,175],
    [1090,95],[150,610],[760,705],[1140,610],[1200,300],[620,490]];
   const colors=new Set();
   for(const [x,y] of points){
    const v=ctx.getImageData(x*2,y*2,1,1).data;
    if(v[3]!==255)throw Error('Transparent hole in scene '+x+','+y);
    colors.add([v[0]>>3,v[1]>>3,v[2]>>3].join(','));
   }
   if(colors.size<7)throw Error('No premium landscape detail; too few sampled colors');
   const stage=document.getElementById('stage').getBoundingClientRect(),
     game=scene.game.canvas.getBoundingClientRect();
   if(game.left<stage.left-2||game.right>stage.right+2||
      game.top<stage.top-2||game.bottom>stage.bottom+2)
    throw Error('R7 clipped at '+window.innerWidth);
   const pan=window.__SEMANTROPIC_VIEWPORT.panorama;
   if(pan.sourceCount!==1||pan.mapId!==1||!pan.painted||pan.scenicOnlyGutters!==true)
    throw Error('HF2 panorama is mirroring duplicated landmarks');
   if(!w.economy.build(0,'infantry').ok)throw Error('M01 build broken');
   w.syncTowers();scene.drawTowers();scene.drawSoldiers();
   if(w.economy.gold!==270)throw Error('M01 economy modified');
   return {mapId:w.map.id,route:w.route.points.length,
    sockets:scene.mapView.plan.sockets.length,waves:w.campaign.waves.length,
    art:[art.width,art.height],colorSamples:colors.size,gold:w.economy.gold,
    premiumFullscreenBackdrop:pan.sourceCount===1};
  });
  await page.screenshot({path:out+'/'+profile+'-Praderas-del-Amanecer-R7.png',fullPage:true});
  // Recheck that Map02 still works from the same LIVE URL.
  await page.locator('#mapPickerButton').click();
  await page.locator('#mapPicker [data-map-target="2"]').click();
  await page.waitForFunction(()=>window.__SEMANTROPIC_C1D7?.world?.map?.id===2,null,{timeout:50000});
  const m02=await page.evaluate(()=>({
   route:window.__SEMANTROPIC_C1D7.world.route.points.length,
   pads:window.__SEMANTROPIC_C1D7.scene.mapView.plan.sockets.length
  }));
  if(m02.route!==163||m02.pads!==8)throw Error('R7 modified Map02');
  if(errors.length)throw Error('Page JS errors '+errors.join(' | '));
  results.push({profile,width,height,...result,map02StillPlayable:true});
  await page.close();
 }
 console.log(JSON.stringify({status:'PASS_R7_M01_PREMIUM_IN_GAME_WEBGL2',results,
  physicalAndroid:'PENDING',artApproval:'PENDING',balanceUnchanged:true},null,2));
}catch(e){console.error('FAIL_R7_M01_BROWSER',e.stack||String(e));process.exitCode=1}
finally{await browser?.close();await new Promise(ok=>server.close(ok))}
