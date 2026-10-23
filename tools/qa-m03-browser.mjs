/** Actual Phaser M03, three viewport/input profiles, real-budget nine waves.
 * Time advances through fixed CORE steps; no forced damage, gold, HP or result.
 * Does not certify physical mobile performance or artistic approval. */
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,stat,mkdir,writeFile} from 'node:fs/promises';
import {resolve,join,extname,sep} from 'node:path';
import {chromium} from 'playwright';
const root=resolve('dist'),out=process.env.M03_QA_OUT||'artifacts/m03-browser';await mkdir(out,{recursive:true});
const mime={'.html':'text/html','.mjs':'text/javascript','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.css':'text/css'};
const server=createServer(async(req,res)=>{try{const p=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(p!==root&&!p.startsWith(root+sep))throw Error('invalid path');const f=(await stat(p)).isDirectory()?join(p,'index.html'):p;res.writeHead(200,{'Content-Type':mime[extname(f)]||'application/octet-stream'});res.end(await readFile(f));}catch{res.writeHead(404);res.end();}});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
let browser;const results=[];
try{
 browser=await chromium.launch({headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const base='http://127.0.0.1:'+server.address().port+'/official/src/live/';
 for(const [profile,width,height] of [['desktop',1280,768],['touch844',844,390],['touch932',932,430]]){
  console.log('M03 profile '+profile);
  const page=await browser.newPage({viewport:{width,height},isMobile:width<1000,hasTouch:width<1000});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const ready=async()=>page.waitForFunction(()=>window.__SEMANTROPIC_C1D7?.world.map.id===3&&window.__SEMANTROPIC_VIEWPORT?.panorama?.mapId===3,null,{timeout:60000});
  await page.goto(base+'?map=3');await ready();
  const initial=await page.evaluate(()=>{
   const g=window.__SEMANTROPIC_C1D7,w=g.world,s=g.scene,plan=s.mapView.plan;
   if(!(s.game.renderer.gl instanceof WebGL2RenderingContext))throw Error('WebGL2 unavailable');
   if(w.lives!==100||w.economy.gold!==410||w.route.points.length!==188||w.campaign.waves.length!==9||plan.sockets.length!==8)throw Error('M03 canonical data');
   for(const r of plan.props){
    const near=(p,m)=>Math.hypot(Math.max(r.x-p[0],0,p[0]-r.x-r.w),Math.max(r.y-p[1],0,p[1]-r.y-r.h))<m-1e-8;
    if(w.map.path.some(p=>near(p,43))||plan.sockets.some(p=>near([p.world.x,p.world.y],51)))throw Error('Decor crosses route or pad '+r.kind);
   }
   if(!plan.props.some(p=>p.kind==='oak'))throw Error('Hero oak missing');
   return {snapshot:w.snapshot,props:plan.props.length,rejected:plan.rejected.length,ambient:s.mapView.snapshot,texture:[s.textures.get('maps/m03/whispering-forest/v1').getSourceImage().width,s.textures.get('maps/m03/whispering-forest/v1').getSourceImage().height],renderer:s.game.renderer.type};
  });
  await page.screenshot({path:out+'/'+profile+'-forest-empty.png'});
  // Every real pad must select its own index through mouse/touch coordinates.
  for(let i=0;i<8;i++){
   const p=await page.evaluate(i=>{const s=window.__SEMANTROPIC_C1D7.scene,r=s.game.canvas.getBoundingClientRect(),p=s.mapView.plan.sockets[i].world;return {x:r.left+p.x/1280*r.width,y:r.top+p.y/768*r.height};},i);
   if(width<1000)await page.touchscreen.tap(p.x,p.y);else await page.mouse.click(p.x,p.y);
   await page.waitForFunction(i=>window.__SEMANTROPIC_C1D7.menu.get().index===i,i,{timeout:5000});
   await page.evaluate(()=>window.__SEMANTROPIC_C1D7.menu.close());
  }
  // Actual T09 purchase/upgrade/rally/sell controls and real soldier navigation.
  await page.evaluate(()=>window.__SEMANTROPIC_C1D7.menu.open(1));
  await page.locator('[data-t09-id="infantry"]').click();
  await page.waitForFunction(()=>window.__SEMANTROPIC_C1D7.economy.getTower(1)?.family==='infantry');
  await page.waitForTimeout(320);await page.locator('[data-t09-id="upgrade"]').click();
  await page.waitForFunction(()=>window.__SEMANTROPIC_C1D7.world.soldiers.length===2);
  await page.waitForTimeout(320);await page.locator('[data-t09-id="rally"]').click();
  assert(await page.evaluate(()=>window.__SEMANTROPIC_C1D7.rally.get().active));
  const targets=await page.evaluate(()=>{const g=window.__SEMANTROPIC_C1D7,t=g.economy.getTower(1),node=g.world.infantryNav.nodes.filter(p=>Math.hypot(p.x-t.x,p.y-t.y)<120).at(-1),r=g.scene.game.canvas.getBoundingClientRect();return {x:r.left+node.x/1280*r.width,y:r.top+node.y/768*r.height};});
  if(width<1000)await page.touchscreen.tap(targets.x,targets.y);else await page.mouse.click(targets.x,targets.y);
  await page.waitForFunction(()=>window.__SEMANTROPIC_C1D7.rally.get().successes===1);
  await page.waitForTimeout(600);await page.screenshot({path:out+'/'+profile+'-infantry-rally.png'});
  await page.locator('#waveStart').click();await page.waitForTimeout(6500);
  await page.screenshot({path:out+'/'+profile+'-real-forest-combat.png'});
  assert((await page.evaluate(()=>window.__SEMANTROPIC_C1D7.scene.enemyViews.size))>0);
  const beforeSale=await page.evaluate(()=>window.__SEMANTROPIC_C1D7.economy.gold);
  await page.evaluate(()=>window.__SEMANTROPIC_C1D7.menu.open(1));await page.locator('[data-t09-id="sell"]').click();
  assert.equal(await page.evaluate(()=>window.__SEMANTROPIC_C1D7.economy.gold),beforeSale+149);
  await page.locator('#restart').click();await ready();
  // CORE time and ambient freeze through the real pause button.
  await page.locator('#waveStart').click();await page.waitForTimeout(600);await page.locator('#pause').click();
  const freeze=await page.evaluate(()=>({w:window.__SEMANTROPIC_C1D7.world.seconds,env:window.__SEMANTROPIC_C1D7.scene.mapView.snapshot.ambientSeconds}));
  await page.waitForTimeout(350);
  assert.deepEqual(await page.evaluate(()=>({w:window.__SEMANTROPIC_C1D7.world.seconds,env:window.__SEMANTROPIC_C1D7.scene.mapView.snapshot.ambientSeconds})),freeze);
  await page.screenshot({path:out+'/'+profile+'-ambient-a.png'});await page.locator('#pause').click();await page.waitForTimeout(600);await page.locator('#pause').click();await page.screenshot({path:out+'/'+profile+'-ambient-b.png'});
  assert((await page.evaluate(()=>window.__SEMANTROPIC_C1D7.scene.mapView.snapshot.ambientSeconds))>freeze.env);
  await page.locator('#restart').click();await ready();
  // Real purchases/bounties/bonuses only. Fixed-step acceleration is not an FPS claim.
  await page.exposeFunction('m03CaptureCheckpoint',async wave=>{await page.waitForTimeout(180);await page.screenshot({path:out+'/'+profile+'-wave-'+wave+'-combat.png'});});
  const completed=await page.evaluate(async()=>{
   const g=window.__SEMANTROPIC_C1D7,w=g.world,order=[1,3,4,5,6,7,2,0],counts=[],types=new Set(),fires={};
   for(let wave=1;wave<=9;wave++){
    for(const i of order)if(!g.economy.getTower(i))g.economy.build(i,'sniper');
    for(const i of order)if(g.economy.getTower(i)?.level===1)g.economy.upgrade(i);
    const before=w.totalSpawns;if(!w.startWave())throw Error('Wave cannot start '+wave);let steps=0;
    let captured=false;
    while(w.active&&!w.ended&&steps++<60000){const events=w.tick(1/60);for(const ev of events){if(ev.type==='spawn')types.add(ev.entity.type);fires[ev.type]=(fires[ev.type]||0)+1;}
     if([5,9].includes(wave)&&steps>=600&&!captured){
      captured=true;g.scene.drawTowers();g.scene.drawEnemies();g.scene.drawSoldiers();g.scene.updateHud();w.pause();
      await window.m03CaptureCheckpoint(wave);w.resume();
     }
    }
    if(steps>=60000)throw Error('Wave stalled');counts.push(w.totalSpawns-before);
   }
   g.scene.drawTowers();g.scene.updateHud();return {snapshot:w.snapshot,counts,types:[...types],events:fires,ledger:g.economy.ledger.length};
  });
  assert(completed.snapshot.won);assert.equal(completed.snapshot.totalSpawns,101);assert.deepEqual(completed.counts,[8,8,10,8,8,9,15,14,21]);assert.equal(completed.types.length,7);
  await page.waitForFunction(()=>!document.getElementById('results').hidden);
  assert((await page.locator('#resultTitle').textContent()).includes('Mapa 03'));assert((await page.locator('#resultDetail').textContent()).includes('9 oleadas'));
  await page.screenshot({path:out+'/'+profile+'-nine-wave-victory.png'});
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('semantropic_td_phaser_m03_normal_v1')).map),3);
  await page.locator('#resultRestart').click();await ready();assert((await page.locator('#record').textContent()).includes('★★'));
  // Actual no-defense defeat and isolated record stays intact.
  await page.evaluate(()=>{const w=window.__SEMANTROPIC_C1D7.world;let steps=0;while(!w.ended&&steps++<100000){if(!w.active)w.startWave();w.tick(.1);}if(w.won||w.lives!==0||w.escapedCount!==50)throw Error('Invalid defeat');});
  await page.waitForFunction(()=>!document.getElementById('results').hidden);assert.equal(await page.locator('#resultStars').textContent(),'Sin estrellas');await page.screenshot({path:out+'/'+profile+'-defeat.png'});
  // Navigate through selector twice; full navigation deliberately destroys the old scene.
  for(const id of [2,3,1,3]){
   await page.locator(id===2?'#resultMapPicker':'#mapPickerButton').click();await page.locator('[data-map-target="'+id+'"]').click();
   await page.waitForFunction(id=>window.__SEMANTROPIC_C1D7?.world.map.id===id,id,{timeout:60000});assert.equal(new URL(page.url()).pathname,'/official/src/live/');
  }
  if(width<1000){await page.setViewportSize({width:390,height:844});assert(await page.locator('#portrait').isVisible());await page.setViewportSize({width,height});await ready();}
  // Distinct real M03 rigs and pause-respecting death presentation, without any visual damage.
  const rigs=await page.evaluate(()=>{
   const g=window.__SEMANTROPIC_C1D7,s=g.scene;return ['foreststalker','hunter','bat'].map((kind,i)=>{const v=s.customActors.make(kind,500+i*100,400);s.customActors.present(v,{id:900+i,type:kind,heading:0},2);const key=v.sprite.texture.key;v.view.destroy();return key;});
  });assert.equal(new Set(rigs).size,3);
  const diagnostics=await page.evaluate(()=>{const g=window.__SEMANTROPIC_C1D7;return {softwareDesktopFps:g.scene.game.loop.actualFps,jsHeapBytes:performance.memory?.usedJSHeapSize??null,drawCalls:typeof g.scene.game.renderer.drawCount==='number'?g.scene.game.renderer.drawCount:'NOT_INSTRUMENTED',displayObjects:g.scene.children.length};});
  assert.deepEqual(errors,[]);results.push({profile,viewport:{width,height},initial,completed,diagnostics,errors});await page.close();
 }
 // Reduced motion at startup must allocate no environmental particles.
 const page=await browser.newPage({viewport:{width:844,height:390},reducedMotion:'reduce'});await page.goto(base+'?map=3');await page.waitForFunction(()=>window.__SEMANTROPIC_C1D7?.world.map.id===3,null,{timeout:60000});assert.equal(await page.evaluate(()=>window.__SEMANTROPIC_C1D7.scene.mapView.snapshot.ambientObjects),0);await page.close();
 await writeFile(out+'/report.json',JSON.stringify({status:'PASS_M03_WEBGL2_THREE_VIEWPORTS',results,physicalMobile:'NOT_RUN',artisticApproval:'PENDING'},null,2));console.log('PASS_M03_WEBGL2_THREE_VIEWPORTS '+out+'/report.json');
}finally{await browser?.close();server.close();}
