/**
 * R1 browser regression: four targeted REAL core sniper fires, two enemy types,
 * strict one-hit fixture to inspect lethal presentation. This fixture is NOT
 * an unmodified full-wave campaign. Full M01 runs independently in B1 QA.
 * Run after npm build + Playwright: node tools/qa-t10-r1-sync-browser.mjs
 */
import {createServer} from 'node:http';
import {readFile,stat,mkdir} from 'node:fs/promises';
import {resolve,join,extname,sep} from 'node:path';
import {chromium} from 'playwright';
const root=resolve('dist');
const mime={'.html':'text/html;charset=utf-8','.js':'text/javascript;charset=utf-8',
 '.mjs':'text/javascript;charset=utf-8','.json':'application/json','.svg':'image/svg+xml',
 '.png':'image/png','.css':'text/css;charset=utf-8'};
const srv=createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://localhost');
 const path=resolve(root,'.'+decodeURIComponent(url.pathname));
 if(path!==root&&!path.startsWith(root+sep))throw Error('blocked traversal');
 const file=(await stat(path)).isDirectory()?join(path,'index.html'):path;
 res.writeHead(200,{'Content-Type':mime[extname(file)]??'application/octet-stream'});
 res.end(await readFile(file));
}catch(e){res.writeHead(404);res.end(String(e))}});
await new Promise(ok=>srv.listen(0,'127.0.0.1',ok));
const url='http://127.0.0.1:'+srv.address().port+'/official/src/c1d8-b2-playable/';
const dir='artifacts/t10-r1-sync-browser';await mkdir(dir,{recursive:true});
let browser;const results=[];
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader',
 '--enable-webgl','--enable-unsafe-swiftshader']});
 for(const [name,w,h] of [['desktop',1280,768],['android844',844,390],['android932',932,430]]){
  for(const [level,type,socket] of [[1,'warrior',0],[1,'hound',0],[2,'warrior',2],[2,'hound',2]]){
   const page=await browser.newPage({viewport:{width:w,height:h},isMobile:w<1000,hasTouch:w<1000});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto(url,{waitUntil:'load',timeout:30000});
   if(response?.status()!==200)throw Error('R1 response '+response?.status());
   await page.waitForFunction(()=>!!window.__SEMANTROPIC_C1D7?.scene,null,{timeout:45000});
   const fire=await page.evaluate(({level,type,socket})=>{
    const g=window.__SEMANTROPIC_C1D7,s=g.scene,world=g.world,eco=world.economy;
    // Freeze ONLY automatic core advancement during deterministic QA stepping.
    // Phaser renderer, tweens and timers keep running for real screenshots.
    s.update=()=>{};
    if(!s.game.renderer.gl||!(s.game.renderer.gl instanceof WebGL2RenderingContext))
     throw Error('R1 Chromium WebGL2 unavailable');
    if(!eco.build(socket,'sniper').ok)throw Error('build sniper failed');
    if(level===2&&!eco.upgrade(socket).ok)throw Error('upgrade sniper II failed');
    world.syncTowers();s.drawTowers();
    const t=eco.getTower(socket),mount=s.towerMounts.get(t.id);
    if(!mount||mount.addedRifleLayers!==0)throw Error('exact T04 one-rifle breached');
    if(!world.startWave())throw Error('cannot start M01');
    // Targeted QA-only fixture: one canonical enemy type with core-generated
    // stats, route, armor, collision and bullet; 1 HP forces lethal-case coverage.
    world.spawnQueue=[{id:world.nextEnemyId++,type,at:0,group:0}];
    let fire=null,actorId=null,alreadyHit=null,alreadyDied=false;
    for(let i=0;i<28000&&!fire&&world.active&&!world.ended;i++){
     const ev=world.tick(1/60);
     if(actorId===null&&world.enemies.size){
      const a=[...world.enemies.values()][0];actorId=a.id;
      a.life=1;a.hp=1; // lethal visual QA fixture, NO production gameplay change
      s.drawEnemies();
     }
     s.reactEvents(ev);
     fire=ev.find(e=>e.type==='attack_fire'&&String(e.entityId)===String(t.id));
     if(fire){
      alreadyHit=ev.find(e=>e.type==='hit_applied'&&String(e.bulletId)===String(fire.payload.bulletId))??null;
      alreadyDied=!!alreadyHit&&ev.some(e=>e.type==='entity_die'&&e.entityId===alreadyHit.entityId);
     }
    }
    if(!fire)throw Error('R1 did not produce a real core attack_fire '+type);
    const job=s.shots.jobs.get(fire.eventId),diag=s.t10FireOrigins.at(-1);
    if(!job?.premiumProjectile||!diag)throw Error('R1 missing presented shot');
    const direction={x:fire.payload.targetWorld.x-diag.source.x,
      y:fire.payload.targetWorld.y-diag.source.y};
    const length=Math.hypot(direction.x,direction.y);
    const root={x:diag.source.x-direction.x/length*3.25,
      y:diag.source.y-direction.y/length*3.25};
    const delta=Math.hypot(job.premiumFirstFrame.x-root.x,job.premiumFirstFrame.y-root.y);
    if(delta>1e-5)throw Error('R1 initial core bullet not tucked into barrel '+delta);
    return {actorId,fireId:fire.eventId,bulletId:fire.payload.bulletId,
      shooter:t.id,level,type,root,mouth:diag.source,travelMs:job.premiumTravelDuration,
      shotCount:s.shots.fireCount,alreadyHit,alreadyDied};
   },{level,type,socket});
   await page.screenshot({path:dir+'/'+name+'-L'+level+'-'+type+'-01-FIRE.png',fullPage:true});
   const hit=await page.evaluate(({fire})=>{
    const g=window.__SEMANTROPIC_C1D7,s=g.scene,world=g.world;
    let applied=fire.alreadyHit,died=fire.alreadyDied,observed=[];
    for(let i=0;i<14000&&!applied&&world.active&&!world.ended;i++){
     const events=world.tick(1/60);s.reactEvents(events);
     if(events.length&&observed.length<15)observed.push(...events.map(e=>({type:e.type,bulletId:e.bulletId,entityId:e.entityId})));
     const e=events.find(x=>x.type==='hit_applied'&&String(x.bulletId)===String(fire.bulletId));
     if(e){applied=e;died=events.some(x=>x.type==='entity_die'&&x.entityId===e.entityId)}
    }
    if(!applied||!died||applied.hp!==0)throw Error('R1 core lethal hit missing '+JSON.stringify({
      applied,died,observed,active:world.active,ended:world.ended,
      enemy:[...world.enemies.values()].map(x=>({id:x.id,life:x.life,dead:x.dead,progress:x.progress})),
      bullets:world.bullets.map(x=>({id:x.id,targetId:x.targetId,x:x.x,y:x.y})),
      events:world.events?.slice(-6).map(x=>x.type),snapshot:world.snapshot
     }).slice(0,1800));
    s.drawEnemies();
    const job=s.shots.jobs.get(fire.fireId);
    if(!job||!job.hitShown||job.premiumProjectile?.active||job.premiumGlow?.active)
     throw Error('R1 projectile travelled after logical contact');
    if(world.enemies.has(applied.entityId))throw Error('R1 core HP/death not authoritative');
    const view=s.enemyViews.get(applied.entityId),ghost=s.t10GhostDeaths.get(applied.entityId);
    if(!view||!ghost?.confirmed)throw Error('R1 enemy disappeared before hit visual fade');
    if(s.shots.hitVisualCount<1)throw Error('R1 premium hit visual missing');
    const mism=Math.hypot(job.premiumContactWorld.x-applied.worldPosition.x,
      job.premiumContactWorld.y-applied.worldPosition.y);
    if(mism>1e-6)throw Error('R1 contact position mismatches real core');
    return {hitId:applied.eventId,enemyId:applied.entityId,coreHp:applied.hp,
      renderedVictimPresent:!!view,ghostLifetimeMs:ghost.lifetime,
      noBulletFlying:!job.premiumProjectile?.active,logicalDeath:true,contactError:mism,
      credits:world.economy.gold,heldKills:s.t10HeldKills};
   },{fire});
   await page.screenshot({path:dir+'/'+name+'-L'+level+'-'+type+'-02-HIT.png',fullPage:true});
   await page.waitForTimeout(250);
   const after=await page.evaluate(({hit})=>{
    const g=window.__SEMANTROPIC_C1D7,s=g.scene;
    return {ghostPresent:s.t10GhostDeaths.has(hit.enemyId),
      enemySpritePresent:s.enemyViews.has(hit.enemyId),
      held:s.t10HeldKills,fxHits:s.shots.hitVisualCount};
   },{hit});
   if(after.ghostPresent||after.enemySpritePresent)
    throw Error('R1 ghost leaked after 250ms '+JSON.stringify(after));
   await page.screenshot({path:dir+'/'+name+'-L'+level+'-'+type+'-03-AFTER.png',fullPage:true});
   if(errors.length)throw Error('R1 pageerror: '+errors.join(' / '));
   results.push({viewport:name+' '+w+'x'+h,level,type,fire,hit,after,qaFixture:'single core-spawned enemy with 1 HP'});
   await page.close();
  }
 }
 console.log(JSON.stringify({status:'PASS_T10_R1_REAL_WEBGL2_SYNC_12_CASES',
  actualCore:true,qaOnlyFixture:true,
  cases:results.length,records:results,physicalAndroid:false,
  humanArtApproval:'PENDING'},null,2));
}catch(e){console.error('FAIL_T10_R1_SYNC_BROWSER',e.stack||String(e));process.exitCode=1}
finally{await browser?.close();await new Promise(ok=>srv.close(ok))}
