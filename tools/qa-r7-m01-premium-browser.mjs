/** SEMANTROPIC TD B01: actual Phaser WebGL2 / responsive MAP-ART-01 QA.
 * Updates the R7 LIVE visual expectations for the approved pictorial rework; protected R7 art remains archived.
 */
import {createServer} from 'node:http';
import {readFile,stat,mkdir} from 'node:fs/promises';
import {resolve,join,extname,sep} from 'node:path';
import {chromium} from 'playwright';
const root=resolve('dist'),out=process.env.B01_QA_OUT||'artifacts/r7-m01-premium-browser';
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
   const painter=await import('/official/src/maps-visual/m01/b01/pictoric-meadow.mjs');
   if(painter.B01_ART_VERSION!=='b01-m01-pictoric-dawn-meadow-v1')throw Error('Old R7 source');
   const scenic=scene.textures.get('maps/m01/r7/dawn-plateau/scenic-gutters/hf2')?.getSourceImage();
   if(!scenic||scenic.width!==1280||scenic.height!==768)
    throw Error('HF2 1280x768 scenic plate missing');
   if(scene.mapView.artVersion!==painter.B01_ART_VERSION)throw Error('B01 art not active');
   const maps=await (await fetch('/official/data/maps.v5.json')).json();
   const map=maps.find(m=>m.id===1);
   const clearCanvas=painter.makeB01MapCanvas(map,{density:1,scenic:true}).canvas;
   const fullCtx=art.getContext('2d'),scenicCtx=clearCanvas.getContext('2d');
   const landscape=scene.mapView.landscapePlan;
   if(!landscape||!landscape.props.some(p=>p.kind==='arch')||!landscape.props.some(p=>p.kind==='shrine'))throw Error('B01 landmarks missing');
   if(landscape.props.filter(p=>p.kind==='waterfall').length!==2)throw Error('B01 waterfall bank composition');
   for(const prop of landscape.props)if(!painter.b01PropClearsGeometry(prop,landscape))throw Error('Prop obscures route or pad');
   if(JSON.stringify(landscape.path)!==JSON.stringify(map.path))throw Error('B01 mutated route');
   for(let i=0;i<8;i++){const a=landscape.pads[i],b=map.spots[i];if(a.x!==b.cx*64+32||a.y!==b.cy*64+32)throw Error('B01 moved socket');}

   const delta=(x,y)=>{
    const a=fullCtx.getImageData(x*2,y*2,1,1).data,b=scenicCtx.getImageData(x,y,1,1).data;
    return Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])+Math.abs(a[2]-b[2]);
   };
   if(delta(1145,140)<45)
    throw Error('HF3 shrine missing from main art or duplicated in panorama');
   const mainOne=painter.makeB01MapCanvas(map,{density:1}).canvas.getContext('2d');
   let roadSamples=0;
   for(let i=1;i<map.path.length;i++){
    const a=map.path[i-1],b=map.path[i],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);
    if(!len)continue;
    for(let step=0;step<=Math.ceil(len/8);step++){
     const t=step/Math.ceil(len/8);
     for(const offset of [-20,0,20]){
      const x=Math.round(a[0]+dx*t-dy/len*offset),y=Math.round(a[1]+dy*t+dx/len*offset);
      if(x<0||x>=1280||y<0||y>=768)continue;
      const actual=mainOne.getImageData(x,y,1,1).data,expected=scenicCtx.getImageData(x,y,1,1).data;
      if(actual.some((v,k)=>v!==expected[k]))
       throw Error('HF3 scenery obstructs canonical road at '+x+','+y);
      roadSamples++;
     }
    }
   }
   if(roadSamples<800)throw Error('HF3 road coverage insufficient');
   for(const [x,y] of [[57,345],[1240,400]])
    if(delta(x,y)>25)throw Error('HF3 old gate/bridge remains on live road');
   if(scene.mapView.landscapePlan.props.some(p=>!painter.b01PropClearsGeometry(p,landscape)))throw Error('B01 scenery violates clearance');
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
   return {mapId:w.map.id,route:w.route.points.length,
    sockets:scene.mapView.plan.sockets.length,waves:w.campaign.waves.length,
    art:[art.width,art.height],colorSamples:colors.size,roadSamples,gold:w.economy.gold,
    premiumFullscreenBackdrop:pan.sourceCount===1,artVersion:scene.mapView.artVersion,props:landscape.props,rejected:landscape.rejected};
  });
  for(let i=0;i<8;i++){
   const p=await page.evaluate(i=>{const g=window.__SEMANTROPIC_C1D7,r=g.scene.game.canvas.getBoundingClientRect(),p=g.economy.getSocket(i);return {x:r.left+p.x*r.width/1280,y:r.top+p.y*r.height/768};},i);
   if(width<1000)await page.touchscreen.tap(p.x,p.y);else await page.mouse.click(p.x,p.y);
   if((await page.evaluate(()=>window.__SEMANTROPIC_C1D7.menu.get().index))!==i)throw Error('B01 pad input '+i);
   await page.evaluate(()=>window.__SEMANTROPIC_C1D7.menu.close());
  }
  await page.screenshot({path:out+'/'+profile+'-Praderas-del-Amanecer-R7.png',fullPage:true});
  await page.evaluate(()=>window.__SEMANTROPIC_C1D7.menu.open(1));
  await page.locator('[data-t09-id="infantry"]').click();
  await page.evaluate(()=>{const g=window.__SEMANTROPIC_C1D7;if(g.economy.gold!==270||g.economy.getTower(1)?.family!=='infantry')throw Error('B01 changed construction economy');g.menu.close();});

  if(profile==='desktop'){
   await page.evaluate(()=>{const g=window.__SEMANTROPIC_C1D7;if(!g.economy.build(0,'sniper').ok)throw Error('Sniper build');g.world.syncTowers();g.scene.drawTowers();});
   await page.locator('#waveStart').click();await page.waitForTimeout(7500);await page.locator('#pause').click();
   const frozen=await page.evaluate(()=>window.__SEMANTROPIC_C1D7.world.seconds);await page.waitForTimeout(250);
   if((await page.evaluate(()=>window.__SEMANTROPIC_C1D7.world.seconds))!==frozen)throw Error('Pause regression');
   const real=await page.evaluate(()=>{const g=window.__SEMANTROPIC_C1D7;return {fires:g.scene.fxFires,spawns:g.world.totalSpawns,gold:g.economy.gold};});
   if(real.fires<1||real.spawns<1)throw Error('B01 real battle smoke '+JSON.stringify(real));
   await page.screenshot({path:out+'/desktop-real-combat.png',fullPage:true});
  }

  // Recheck that Map02 still works from the same LIVE URL.
  await page.locator('#mapPickerButton').click();
  await page.locator('#mapPicker [data-map-target="2"]').click();
  await page.waitForFunction(()=>window.__SEMANTROPIC_C1D7?.world?.map?.id===2,null,{timeout:50000});
  const m02=await page.evaluate(()=>({
   route:window.__SEMANTROPIC_C1D7.world.route.points.length,
   pads:window.__SEMANTROPIC_C1D7.scene.mapView.plan.sockets.length
  }));
  if(m02.route!==163||m02.pads!==8)throw Error('R7 modified Map02');
  await page.locator('#mapPickerButton').click();await page.locator('[data-map-target="3"]').click();
  await page.waitForFunction(()=>window.__SEMANTROPIC_C1D7?.world?.map?.id===3,null,{timeout:50000});
  const m03=await page.evaluate(()=>({route:window.__SEMANTROPIC_C1D7.world.route.points.length,pads:window.__SEMANTROPIC_C1D7.scene.mapView.plan.sockets.length}));
  if(m03.route!==188||m03.pads!==8)throw Error('B01 modified M03');
  if(errors.length)throw Error('Page JS errors '+errors.join(' | '));
  results.push({profile,width,height,...result,map02StillPlayable:true});
  await page.close();
 }
 console.log(JSON.stringify({status:'PASS_B01_PICTORIC_MEADOW_WEBGL2',results,
  physicalAndroid:'PENDING',artApproval:'PENDING',balanceUnchanged:true},null,2));
}catch(e){console.error('FAIL_B01_M01_BROWSER',e.stack||String(e));process.exitCode=1}
finally{await browser?.close();await new Promise(ok=>server.close(ok))}
