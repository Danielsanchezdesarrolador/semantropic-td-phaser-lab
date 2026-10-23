/** MAP-STYLE-01: actual modular Phaser M01, three viewports and brief combat.
 * No accelerated campaign; art-only smoke, real input and CORE attacks. */
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,stat,mkdir,writeFile} from 'node:fs/promises';
import {resolve,join,extname,sep} from 'node:path';
import {chromium} from 'playwright';
const root=resolve('dist'),out=process.env.STYLE01_QA_OUT||'artifacts/map-style01';await mkdir(out,{recursive:true});
const mime={'.html':'text/html','.mjs':'text/javascript','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.css':'text/css'};
const server=createServer(async(req,res)=>{try{const p=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(p!==root&&!p.startsWith(root+sep))throw Error('invalid path');const f=(await stat(p)).isDirectory()?join(p,'index.html'):p;res.writeHead(200,{'Content-Type':mime[extname(f)]||'application/octet-stream'});res.end(await readFile(f));}catch{res.writeHead(404);res.end();}});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const base='http://127.0.0.1:'+server.address().port+'/official/src/live/';
let browser,lastPage;let step="startup";const results=[];
try{
 browser=await chromium.launch({headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});

 for(const [profile,width,height] of [['desktop',1280,768],['touch844',844,390],['touch932',932,430]]){
  step=profile+' load';console.log('STYLE01 '+profile);
  const page=await browser.newPage({viewport:{width,height},isMobile:width<1000,hasTouch:width<1000});const errors=[];lastPage=page;page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);await page.waitForFunction(()=>window.__SEMANTROPIC_C1D7?.scene.mapView.artVersion==='m01-style01-modular-cartoon-v1'&&window.__SEMANTROPIC_VIEWPORT?.panorama?.mapId===1,null,{timeout:60000});
  const initial=await page.evaluate(async()=>{
   const g=window.__SEMANTROPIC_C1D7,w=g.world,s=g.scene,v=s.mapView;
   if(!(s.game.renderer.gl instanceof WebGL2RenderingContext))throw Error('WebGL2 required');
   if(w.route.points.length!==133||w.economy.gold!==365||w.lives!==100||w.campaign.waves.length!==5||w.campaign.waves.reduce((n,w)=>n+w.groups.reduce((s,g)=>s+g.count,0),0)!==63||v.plan.sockets.length!==8)throw Error('M01 canonical data changed');
   const mod=await import('/official/src/maps-visual/m01/style01/cartoon-world.mjs');
   if(v.premiumArt.composition!=='separate-Phaser-components'||v.styleObjects.filter(o=>o.texture?.key==='maps/m01/style01/pad').length!==8||v.landscapePlan.props.length<20)throw Error('Not a modular component scene');
   for(const p of v.landscapePlan.props)if(!mod.propClears(p,v.landscapePlan))throw Error('Prop covers route/pad '+p.kind);
   if(JSON.stringify(v.landscapePlan.path)!==JSON.stringify(w.map.path))throw Error('Route moved');
   const road=s.textures.get('maps/m01/style01/route').getSourceImage().getContext('2d');if(road.getImageData(20,20,1,1).data[3]!==0)throw Error('Route texture includes flattened background');
   let samples=0;for(let i=1;i<w.map.path.length;i++){const a=w.map.path[i-1],b=w.map.path[i],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/8);for(let k=0;k<=n;k++){const x=Math.round(a[0]+(b[0]-a[0])*k/n),y=Math.round(a[1]+(b[1]-a[1])*k/n);if(x<0||x>=1280||y<0||y>=768)continue;const p=road.getImageData(x*2,y*2,1,1).data;if(p[3]!==255||p[0]<180||p[1]<130||p[2]>200)throw Error('Route not dry/clear');samples++;}}
   return {snapshot:w.snapshot,composition:v.premiumArt,props:v.landscapePlan.props,rejected:v.landscapePlan.rejected,routeSamples:samples,displayObjects:v.styleObjects.length};
  });
  await page.screenshot({path:out+'/'+profile+'-after.png'});
  for(let i=0;i<8;i++){step=profile+' pad '+i;
   const p=await page.evaluate(i=>{const g=window.__SEMANTROPIC_C1D7,r=g.scene.game.canvas.getBoundingClientRect(),p=g.economy.getSocket(i);return{x:r.left+p.x/1280*r.width,y:r.top+p.y/768*r.height};},i);
   if(width<1000)await page.touchscreen.tap(p.x,p.y);else await page.mouse.click(p.x,p.y);
   await page.waitForFunction(i=>window.__SEMANTROPIC_C1D7.menu.get().index===i,i,{timeout:5000});await page.evaluate(()=>window.__SEMANTROPIC_C1D7.menu.close());
  }
  step=profile+' buy infantry';await page.evaluate(()=>window.__SEMANTROPIC_C1D7.menu.open(0));await page.locator('[data-t09-id="infantry"]').click();await page.waitForFunction(()=>window.__SEMANTROPIC_C1D7.economy.getTower(0)?.family==='infantry');
  step=profile+' buy sniper';await page.evaluate(()=>window.__SEMANTROPIC_C1D7.menu.open(1));await page.locator('[data-t09-id="sniper"]').click();await page.waitForFunction(()=>window.__SEMANTROPIC_C1D7.economy.getTower(1)?.family==='sniper');
  assert.equal(await page.evaluate(()=>window.__SEMANTROPIC_C1D7.economy.gold),130);
  step=profile+' first real attack';await page.locator('#waveStart').click();await page.waitForFunction(()=>window.__SEMANTROPIC_C1D7.scene.fxFires>0&&window.__SEMANTROPIC_C1D7.world.kills>0,null,{timeout:70000});await page.locator('#pause').click();
  const combat=await page.evaluate(()=>{const g=window.__SEMANTROPIC_C1D7;return {snapshot:g.world.snapshot,diagnostics:g.diagnostics()};});assert(combat.diagnostics.towers===2);assert(combat.snapshot.totalSpawns>0);
  await page.screenshot({path:out+'/'+profile+'-combat.png'});const seconds=await page.evaluate(()=>window.__SEMANTROPIC_C1D7.world.seconds);await page.waitForTimeout(200);assert.equal(await page.evaluate(()=>window.__SEMANTROPIC_C1D7.world.seconds),seconds);
  if(profile==='desktop'){
   // Show actual independent terrain layer; no route/pads/props embedded in it.
   await page.evaluate(()=>{const s=window.__SEMANTROPIC_C1D7.scene;for(const o of s.mapView.styleObjects.slice(2))o.setVisible(false);});await page.screenshot({path:out+'/desktop-substrate-only.png'});
   for(const id of [2,3,4]){step='desktop regression navigation '+id;await page.locator('#mapPickerButton').click();await page.locator('[data-map-target="'+id+'"]').click();await page.waitForFunction(id=>window.__SEMANTROPIC_C1D7?.world.map.id===id,id,{timeout:60000});}
   assert.equal(await page.locator('[data-map-target="5"]').count(),0);
  }
  assert.deepEqual(errors,[]);results.push({profile,width,height,initial,combat,errors});await page.close();
 }
 await writeFile(out+'/report.json',JSON.stringify({status:'PASS_MAP_STYLE01_MODULAR_CARTOON_SMOKE',results,physicalMobile:'NOT_RUN',artApproval:'PENDING_DIRECTOR',fullCampaign:'NOT_RUN_ART_ONLY_BLOCK'},null,2));console.log('PASS_MAP_STYLE01_MODULAR_CARTOON_SMOKE');
}catch(error){
 let state;try{state=await lastPage?.evaluate(()=>({ready:Boolean(window.__SEMANTROPIC_C1D7),snapshot:window.__SEMANTROPIC_C1D7?.world.snapshot,menu:window.__SEMANTROPIC_C1D7?.menu.get(),fires:window.__SEMANTROPIC_C1D7?.scene.fxFires,feedback:document.getElementById('feedback')?.textContent}));}catch{}
 const report={step,error:String(error.stack||error),state};await writeFile(out+'/failure.json',JSON.stringify(report,null,2));
 console.error('::error title=MAP_STYLE01_BROWSER::'+JSON.stringify(report).replaceAll('%','%25').replaceAll('\n','%0A').replaceAll('\r','%0D'));throw error;
}finally{await browser?.close();server.close();}
