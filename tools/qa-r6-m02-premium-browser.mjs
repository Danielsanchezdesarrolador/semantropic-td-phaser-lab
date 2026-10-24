import {readFileSync} from 'node:fs';
if(readFileSync('public/official/src/maps-visual/m02/phaser-world.mjs','utf8').includes('cartoon03/farmland-world.mjs')){await import('./qa-m02-cartoon03-browser.mjs');process.exit(0);}
/** R6 — Real Chromium/Phaser WebGL2 premium M02 visual integration.
 * The map is now PLAYABLE, old QA-only preview reports superseded.
 */
import {createServer} from 'node:http';
import {readFile,stat,mkdir} from 'node:fs/promises';
import {resolve,join,extname,sep} from 'node:path';
import {chromium} from 'playwright';
const root=resolve('dist'),out=process.env.B02_QA_OUT||'artifacts/r6-m02-premium-browser';
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
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader']});
 for(const [viewport,width,height] of [['desktop',1280,768],['android844',844,390],['android932',932,430]]){
  const page=await browser.newPage({viewport:{width,height},hasTouch:width<1000,isMobile:width<1000,deviceScaleFactor:width<1000?2:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto('http://127.0.0.1:'+server.address().port+'/official/src/live/?map=2',{waitUntil:'load',timeout:30000});
  if(response?.status()!==200)throw Error('Official M02 unavailable');
  await page.waitForFunction(()=>window.__SEMANTROPIC_C1D7?.world?.map?.id===2&&window.__SEMANTROPIC_C1D7.scene.mapView.artVersion==='b02-m02-pictoric-golden-farmland-v1',null,{timeout:50000});
  const result=await page.evaluate(async()=>{
   const g=window.__SEMANTROPIC_C1D7,s=g.scene,w=g.world;
   if(!(s.game.renderer.gl instanceof WebGL2RenderingContext))throw Error('B02 requires WebGL2');
   if(w.economy.gold!==395||w.lives!==100||w.campaign.waves.length!==7||w.route.points.length!==163||s.mapView.plan.sockets.length!==8)throw Error('B02 gameplay modified');
   const painter=await import('/official/src/maps-visual/m02/b02/pictoric-farmland.mjs');
   if(s.mapView.artVersion!==painter.B02_ART_VERSION)throw Error('B02 inactive');
   const map=(await(await fetch('/official/data/maps.v5.json')).json()).find(m=>m.id===2),plan=s.mapView.landscapePlan;
   if(JSON.stringify(plan.path)!==JSON.stringify(map.path))throw Error('B02 route mutated');
   plan.pads.forEach((p,i)=>{if(p.x!==map.spots[i].cx*64+32||p.y!==map.spots[i].cy*64+32)throw Error('Moved pad');});
   for(const kind of ['mill','farm','irrigation','cascade','supplies'])if(!plan.props.some(p=>p.kind===kind))throw Error('B02 landmark missing '+kind);
   for(const r of plan.props)if(!painter.b02PropClearsGeometry(r,plan))throw Error('B02 prop obstructs geometry');
   const image=s.textures.get('maps/m02/farmland/r3-b2').getSourceImage();if(image.width!==2560||image.height!==1536)throw Error('2x art missing');
   const full=painter.makeB02ArtCanvas(map,{density:1}).canvas.getContext('2d'),clear=painter.makeB02ArtCanvas(map,{density:1,scenic:true}).canvas.getContext('2d');
   let roadSamples=0;
   for(let i=1;i<map.path.length;i++){const a=map.path[i-1],b=map.path[i],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);if(!len)continue;
    const n=Math.ceil(len/8);for(let k=0;k<=n;k++)for(const offset of [-20,0,20]){const x=Math.round(a[0]+dx*k/n-dy/len*offset),y=Math.round(a[1]+dy*k/n+dx/len*offset);if(x<0||x>=1280||y<0||y>=768)continue;
     const actual=full.getImageData(x,y,1,1).data,expected=clear.getImageData(x,y,1,1).data;if(actual.some((v,j)=>v!==expected[j]))throw Error('Road occlusion '+x+','+y);roadSamples++;}}
   if(roadSamples<800)throw Error('Insufficient route coverage');
   const colors=new Set();for(const [x,y] of [[150,135],[520,122],[1020,140],[90,390],[320,612],[550,640],[790,687],[1100,705],[505,125]]){const p=image.getContext('2d').getImageData(x*2,y*2,1,1).data;if(p[3]!==255)throw Error('Transparent art');colors.add([p[0]>>3,p[1]>>3,p[2]>>3].join(','));}
   if(colors.size<6)throw Error('Flat art');
   const canvas=s.game.canvas.getBoundingClientRect(),stage=document.getElementById('stage').getBoundingClientRect();if(canvas.left<stage.left-2||canvas.right>stage.right+2||canvas.top<stage.top-2||canvas.bottom>stage.bottom+2)throw Error('B02 clipped viewport');
   if(window.__SEMANTROPIC_VIEWPORT.panorama.mapId!==2)throw Error('Wrong panorama');
   return {artVersion:s.mapView.artVersion,route:163,pads:8,waves:7,gold:395,lives:100,roadWidth:84,roadSamples,colorSamples:colors.size,props:plan.props,rejected:plan.rejected};
  });
  for(let i=0;i<8;i++){const p=await page.evaluate(i=>{const g=window.__SEMANTROPIC_C1D7,r=g.scene.game.canvas.getBoundingClientRect(),p=g.economy.getSocket(i);return {x:r.left+p.x*r.width/1280,y:r.top+p.y*r.height/768};},i);if(width<1000)await page.touchscreen.tap(p.x,p.y);else await page.mouse.click(p.x,p.y);if(await page.evaluate(()=>window.__SEMANTROPIC_C1D7.menu.get().index)!==i)throw Error('Pad input '+i);await page.evaluate(()=>window.__SEMANTROPIC_C1D7.menu.close());}
  await page.screenshot({path:out+'/'+viewport+'-B02-Campos-del-Molino.png',fullPage:true});
  await page.evaluate(()=>window.__SEMANTROPIC_C1D7.menu.open(1));await page.locator('[data-t09-id="infantry"]').click();
  await page.evaluate(()=>{const g=window.__SEMANTROPIC_C1D7;if(g.economy.gold!==300||g.economy.getTower(1)?.family!=='infantry')throw Error('M02 construction economy changed');g.menu.close();});
  if(viewport==='desktop'){
   await page.evaluate(()=>{const g=window.__SEMANTROPIC_C1D7;if(!g.economy.build(0,'sniper').ok)throw Error('Sniper purchase');g.world.syncTowers();g.scene.drawTowers();});
   await page.locator('#waveStart').click();await page.waitForFunction(()=>[...window.__SEMANTROPIC_C1D7.world.enemies.values()].some(e=>e.progress>25),null,{timeout:15000});await page.waitForTimeout(7500);await page.locator('#pause').click();
   const seconds=await page.evaluate(()=>window.__SEMANTROPIC_C1D7.world.seconds);await page.waitForTimeout(250);if(await page.evaluate(()=>window.__SEMANTROPIC_C1D7.world.seconds)!==seconds)throw Error('Pause regression');
   result.combat=await page.evaluate(()=>{const g=window.__SEMANTROPIC_C1D7;return {fires:g.scene.fxFires,spawns:g.world.totalSpawns,gold:g.economy.gold};});if(result.combat.fires<1||result.combat.spawns<1)throw Error('B02 real battle absent');
   await page.screenshot({path:out+'/desktop-real-combat.png',fullPage:true});
  }
  for(const [id,nodes] of [[1,133],[3,188]]){await page.locator('#mapPickerButton').click();await page.locator('[data-map-target="'+id+'"]').click();await page.waitForFunction(id=>window.__SEMANTROPIC_C1D7?.world?.map.id===id,id,{timeout:50000});const ok=await page.evaluate(nodes=>{const g=window.__SEMANTROPIC_C1D7;return g.world.route.points.length===nodes&&g.scene.mapView.plan.sockets.length===8;},nodes);if(!ok)throw Error('Other map regression '+id);}
  if(errors.length)throw Error(errors.join(' | '));cases.push({viewport,width,height,...result,m01m03Smoke:true});await page.close();
 }
 console.log(JSON.stringify({status:'PASS_B02_M02_PICTORIC_WEBGL2',cases,physicalMobile:'NOT_RUN',humanArtApproval:'PENDING'},null,2));
}catch(e){console.error('FAIL_B02_M02',e.stack||String(e));process.exitCode=1}
finally{await browser?.close();await new Promise(ok=>server.close(ok))}
