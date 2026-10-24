/** Actual Phaser M04, three viewport/input profiles, real-budget eleven waves.
 * Time advances through fixed CORE steps; no forced damage, gold, HP or result.
 * Does not certify physical mobile performance or human gameplay balance. */
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,stat,mkdir,writeFile} from 'node:fs/promises';
import {resolve,join,extname,sep} from 'node:path';
import {chromium} from 'playwright';
const root=resolve('dist'),out=process.env.M04_QA_OUT||'artifacts/m04-browser';await mkdir(out,{recursive:true});
const mime={'.html':'text/html','.mjs':'text/javascript','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.css':'text/css'};
const server=createServer(async(req,res)=>{try{const p=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(p!==root&&!p.startsWith(root+sep))throw Error('invalid path');const f=(await stat(p)).isDirectory()?join(p,'index.html'):p;res.writeHead(200,{'Content-Type':mime[extname(f)]||'application/octet-stream'});res.end(await readFile(f));}catch{res.writeHead(404);res.end();}});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
let browser;const results=[];
try{
 browser=await chromium.launch({headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const base='http://127.0.0.1:'+server.address().port+'/official/src/live/';
 for(const [profile,width,height] of [['desktop',1280,768],['touch844',844,390],['touch932',932,430]]){
  console.log('M04 profile '+profile);
  const page=await browser.newPage({viewport:{width,height},isMobile:width<1000,hasTouch:width<1000});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const ready=async()=>page.waitForFunction(()=>window.__SEMANTROPIC_C1D7?.world.map.id===4&&window.__SEMANTROPIC_VIEWPORT?.panorama?.mapId===4,null,{timeout:60000});
  await page.goto(base+'?map=4');await ready();
  const initial=await page.evaluate(()=>{
   const g=window.__SEMANTROPIC_C1D7,w=g.world,s=g.scene,plan=s.mapView.plan;
   if(!(s.game.renderer.gl instanceof WebGL2RenderingContext))throw Error('WebGL2 unavailable');
   if(w.lives!==100||w.economy.gold!==395||w.route.points.length!==262||w.campaign.waves.length!==11||plan.sockets.length!==9)throw Error('M04 canonical data');
   const cartoon=g.art.maps==='m04-cartoon01-ancient-river-v1';if(!cartoon&&g.art.maps!=='m04-hf1-structural-integrated-v1')throw Error('Unknown M04 art version');
   const backdrop=document.getElementById('viewportBackdrop'),panorama=window.__SEMANTROPIC_VIEWPORT.panorama;
   if(!cartoon&&panorama.gutterLeft>5){const pixel=[...backdrop.getContext('2d').getImageData(2,Math.floor(backdrop.height/2),1,1).data];if(pixel.join(',')!=='25,63,69,255')throw Error('Mirrored false M04 pads');}
   let c;if(cartoon){const cv=Object.assign(document.createElement('canvas'),{width:2560,height:1536});c=cv.getContext('2d',{willReadFrequently:true});c.scale(2,2);for(const name of['ground','relief','water','route','bridge0','bridge1']){const o=s.children.list.find(o=>o.texture?.key==='maps/m04/cartoon01/'+name),im=o.texture.getSourceImage();if(!o)throw Error('Missing modular layer '+name);c.drawImage(im,o.x,o.y,im.width*o.scaleX,im.height*o.scaleY);}}else c=s.textures.get('maps/m04/ancient-river/art-v1').getSourceImage().getContext('2d');let routeSamples=0,waterHits=0;
   for(let i=1;i<w.map.path.length;i++){const a=w.map.path[i-1],b=w.map.path[i],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);if(!len)continue;const n=Math.ceil(len/8);
    for(let k=0;k<=n;k++)for(const offset of [-10,0,10]){const x=Math.round(a[0]+dx*k/n-dy/len*offset),y=Math.round(a[1]+dy*k/n+dx/len*offset);if(x<0||x>=1280||y<0||y>=768)continue;const v=c.getImageData(x*2,y*2,1,1).data;if(v[1]>v[0]*1.12&&v[2]>v[0]*1.04&&v[1]>90)waterHits++;routeSamples++;}}
   if(waterHits||routeSamples<1000)throw Error('M04 route/bridge crosses water');
   return {snapshot:w.snapshot,art:s.mapView.qa,ambient:s.mapView.snapshot,routeSamples,waterHits,renderer:s.game.renderer.type};
  });
  await page.screenshot({path:out+'/'+profile+'-river-empty.png'});
  // Every real pad must select its own index through mouse/touch coordinates.
  for(let i=0;i<9;i++){
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
  await page.screenshot({path:out+'/'+profile+'-real-river-combat.png'});
  assert((await page.evaluate(()=>window.__SEMANTROPIC_C1D7.scene.enemyViews.size))>0);
  const beforeSale=await page.evaluate(()=>window.__SEMANTROPIC_C1D7.economy.gold);
  await page.evaluate(()=>window.__SEMANTROPIC_C1D7.menu.open(1));await page.locator('[data-t09-id="sell"]').click();
  assert.equal(await page.evaluate(()=>window.__SEMANTROPIC_C1D7.economy.gold),beforeSale+149);
  await page.locator('#restart').click();await ready();
  // Pause through actual controls; no forced lives, damage or gold.
  await page.locator('#waveStart').click();await page.waitForTimeout(600);await page.locator('#pause').click();
  const freeze=await page.evaluate(()=>window.__SEMANTROPIC_C1D7.world.seconds);await page.waitForTimeout(350);
  assert.equal(await page.evaluate(()=>window.__SEMANTROPIC_C1D7.world.seconds),freeze);
  await page.locator('#pause').click();await page.locator('#restart').click();await ready();
  // Real purchases/bounties/bonuses only. Fixed-step acceleration is not an FPS claim.
  await page.exposeFunction('m04CaptureCheckpoint',async wave=>{await page.waitForTimeout(180);await page.screenshot({path:out+'/'+profile+'-wave-'+wave+'-combat.png'});});
  const completed=await page.evaluate(async()=>{
   const g=window.__SEMANTROPIC_C1D7,w=g.world,order=[0,2,3,4,5,6,7,8,1],counts=[],types=new Set(),fires={};
   for(let wave=1;wave<=11;wave++){
    for(const i of order)if(!g.economy.getTower(i))g.economy.build(i,'sniper');
    for(const i of order)if(g.economy.getTower(i)?.level===1)g.economy.upgrade(i);
    const before=w.totalSpawns;if(!w.startWave())throw Error('Wave cannot start '+wave);let steps=0;
    let captured=false;
    while(w.active&&!w.ended&&steps++<60000){const events=w.tick(1/60);for(const ev of events){if(ev.type==='spawn')types.add(ev.entity.type);fires[ev.type]=(fires[ev.type]||0)+1;}
     if([4,11].includes(wave)&&steps>=600&&!captured){
      captured=true;g.scene.drawTowers();g.scene.drawEnemies();g.scene.drawSoldiers();g.scene.updateHud();w.pause();
      await window.m04CaptureCheckpoint(wave);w.resume();
     }
    }
    if(steps>=60000)throw Error('Wave stalled');counts.push(w.totalSpawns-before);
   }
   g.scene.drawTowers();g.scene.updateHud();return {snapshot:w.snapshot,counts,types:[...types],events:fires,ledger:g.economy.ledger.length};
  });
  assert(completed.snapshot.won);assert.equal(completed.snapshot.totalSpawns,94);assert.deepEqual(completed.counts,[6,5,7,5,10,10,9,6,9,12,15]);assert.equal(completed.types.length,6);
  await page.waitForFunction(()=>!document.getElementById('results').hidden);
  assert((await page.locator('#resultTitle').textContent()).includes('Mapa 04'));assert((await page.locator('#resultDetail').textContent()).includes('11 oleadas'));
  await page.screenshot({path:out+'/'+profile+'-eleven-wave-victory.png'});
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('semantropic_td_phaser_m04_normal_v1')).map),4);
  await page.locator('#resultRestart').click();await ready();assert((await page.locator('#record').textContent()).includes('★★'));
  // Actual no-defense defeat and isolated record stays intact.
  await page.evaluate(()=>{const w=window.__SEMANTROPIC_C1D7.world;let steps=0;while(!w.ended&&steps++<100000){if(!w.active)w.startWave();w.tick(.1);}if(w.won||w.lives!==0||w.escapedCount!==50)throw Error('Invalid defeat');});
  await page.waitForFunction(()=>!document.getElementById('results').hidden);assert.equal(await page.locator('#resultStars').textContent(),'Sin estrellas');await page.screenshot({path:out+'/'+profile+'-defeat.png'});
  // Navigate through selector twice; full navigation deliberately destroys the old scene.
  for(const id of [2,3,1,4]){
   await page.locator(id===2?'#resultMapPicker':'#mapPickerButton').click();await page.locator('[data-map-target="'+id+'"]').click();
   await page.waitForFunction(id=>window.__SEMANTROPIC_C1D7?.world.map.id===id,id,{timeout:60000});assert.equal(new URL(page.url()).pathname,'/official/src/live/');
  }
  if(width<1000){await page.setViewportSize({width:390,height:844});assert(await page.locator('#portrait').isVisible());await page.setViewportSize({width,height});await ready();}
  const rigs=await page.evaluate(()=>{const s=window.__SEMANTROPIC_C1D7.scene;return ['brute','shaman'].map((kind,i)=>{const v=s.customActors.make(kind,500+i*100,400);const out={kind,provisional:v.provisional,artist:v.artist};v.view.destroy();return out;});});assert(rigs.every(r=>r.provisional));
  const diagnostics=await page.evaluate(()=>{const g=window.__SEMANTROPIC_C1D7;return {softwareDesktopFps:g.scene.game.loop.actualFps,jsHeapBytes:performance.memory?.usedJSHeapSize??null,drawCalls:typeof g.scene.game.renderer.drawCount==='number'?g.scene.game.renderer.drawCount:'NOT_INSTRUMENTED',displayObjects:g.scene.children.length};});
  assert.deepEqual(errors,[]);results.push({profile,viewport:{width,height},initial,completed,diagnostics,errors});await page.close();
 }
 // Reduced motion at startup must allocate no environmental particles.
 const page=await browser.newPage({viewport:{width:844,height:390},reducedMotion:'reduce'});await page.goto(base+'?map=4');await page.waitForFunction(()=>window.__SEMANTROPIC_C1D7?.world.map.id===4,null,{timeout:60000});assert.equal(await page.evaluate(()=>window.__SEMANTROPIC_C1D7.scene.mapView.snapshot.ambientObjects),0);await page.close();
 await writeFile(out+'/report.json',JSON.stringify({status:'PASS_M04_WEBGL2_THREE_VIEWPORTS',results,physicalMobile:'NOT_RUN',artisticApproval:'APPROVED_BY_DIRECTOR_2026_10_23',humanGameplayBalance:'PENDING'},null,2));console.log('PASS_M04_WEBGL2_THREE_VIEWPORTS '+out+'/report.json');
}finally{await browser?.close();server.close();}
