import {createServer} from "node:http";
import {readFile,stat,mkdir} from "node:fs/promises";
import {resolve,join,extname,sep} from "node:path";
import {chromium} from "playwright";
const root=resolve("dist"),types={".html":"text/html;charset=utf-8",".mjs":"text/javascript;charset=utf-8",".js":"text/javascript;charset=utf-8",
 ".json":"application/json",".png":"image/png",".svg":"image/svg+xml",".css":"text/css;charset=utf-8"};
const srv=createServer(async(req,res)=>{try{const p=resolve(root,"."+decodeURIComponent(new URL(req.url,"http://localhost").pathname));
 if(!p.startsWith(root+sep)&&p!==root)throw Error("invalid request");
 const f=(await stat(p)).isDirectory()?join(p,"index.html"):p;
 res.writeHead(200,{"Content-Type":types[extname(f)]||"application/octet-stream"});res.end(await readFile(f));
 }catch(e){res.writeHead(404);res.end(String(e));}});
await new Promise(ok=>srv.listen(0,"127.0.0.1",ok));
const url="http://127.0.0.1:"+srv.address().port+(process.env.SEMANTROPIC_PLAYTEST_PATH||"/official/src/c1d8-b1-playable/");
const dir="artifacts/c1d8-b1-browser";await mkdir(dir,{recursive:true});
let browser;const all=[];
try{
 browser=await chromium.launch({headless:true,args:["--use-gl=angle","--use-angle=swiftshader","--enable-webgl","--enable-unsafe-swiftshader"]});
 for(const [name,w,h] of [["desktop",1280,768],["landscape844",844,390],["landscape932",932,430]]){
  const mobile=w<1000,page=await browser.newPage({viewport:{width:w,height:h},hasTouch:mobile,isMobile:mobile});
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  const response=await page.goto(url,{waitUntil:"load",timeout:30000});
  if(response?.status()!==200)throw Error(name+" HTTP "+response?.status());
  await page.waitForFunction(()=>!!window.__SEMANTROPIC_C1D7?.scene,null,{timeout:45000});
  const info=await page.evaluate(()=>{
   const g=window.__SEMANTROPIC_C1D7;
   return {gl2:g.scene.game.renderer.gl instanceof WebGL2RenderingContext,
    art:g.art,gold:g.economy.gold,sockets:g.scene.mapView.plan.sockets.length,route:g.world.route.points.length,
    p08Textures:["actors/allies/infantry-recruit/v1/p08","actors/allies/infantry-veteran/v1/p08",
    "actors/enemies/warrior/v1/p08-combat","actors/enemies/hound/v1/p08-combat"].map(k=>g.scene.textures.exists(k))};
  });
  if(!info.gl2||info.gold!==365||info.sockets!==8||info.route!==133||
   info.art.actors!=="P08_B1_HF1_CANDIDATE"||info.art.nodes!=="T09_HF0"||
   !info.p08Textures.every(Boolean))throw Error(name+" G2 baseline "+JSON.stringify(info));
  // Real landscape touch/click at a visible socket with no UI occlusion.
  const spot=await page.evaluate(()=>{
   const g=window.__SEMANTROPIC_C1D7,rect=g.scene.game.canvas.getBoundingClientRect();
   return g.scene.mapView.plan.sockets.map((s,i)=>({
    index:i,x:rect.left+s.world.x/1280*rect.width,y:rect.top+s.world.y/768*rect.height}))
    .filter(p=>p.x>120&&p.x<innerWidth-90&&p.y>100&&p.y<innerHeight-95)
    .sort((a,b)=>Math.abs(a.x-innerWidth*.60)+Math.abs(a.y-innerHeight*.55)-
     Math.abs(b.x-innerWidth*.60)-Math.abs(b.y-innerHeight*.55))[0]??null;
  });
  if(!spot)throw Error(name+" no visible socket");
  if(mobile)await page.touchscreen.tap(spot.x,spot.y);else await page.mouse.click(spot.x,spot.y);
  await page.waitForFunction(()=>document.querySelectorAll(".t09-node").length>=3,null,{timeout:5000});
  const menu=await page.evaluate(()=>window.__SEMANTROPIC_C1D7.menu.get());
  if(!menu.open||menu.index!==spot.index)throw Error(name+" wrong selected socket "+JSON.stringify({spot,menu}));
  await page.screenshot({path:dir+"/"+name+"-T09-empty.png",fullPage:true});
  await page.locator('[data-t09-id="infantry"]').click();
  const b=await page.evaluate(i=>{
   const g=window.__SEMANTROPIC_C1D7,t=g.economy.getTower(i);
   return {tower:t,ledger:g.economy.ledger.length,gold:g.economy.gold,soldiers:g.world.soldiers.length};
  },spot.index);
  if(b.tower?.family!=="infantry"||b.gold!==270||b.ledger!==1||b.soldiers!==1)
   throw Error(name+" infantry failed "+JSON.stringify(b));
  const first=await page.evaluate(()=>{
   const g=window.__SEMANTROPIC_C1D7;
   g.scene.drawSoldiers();
   return [...g.scene.soldierViews.values()].map(x=>({tex:x.sprite.texture.key,artist:x.artist}));
  });
  if(first.length!==1||first[0].tex!=="actors/allies/infantry-recruit/v1/p08")
   throw Error(name+" recruit not rendered "+JSON.stringify(first));
  await page.waitForTimeout(300);
  await page.locator('[data-t09-id="upgrade"]').click();
  const veterans=await page.evaluate(()=>{
   const g=window.__SEMANTROPIC_C1D7;g.scene.drawSoldiers();
   return {level:g.economy.getTower(g.menu.get().index).level,gold:g.economy.gold,
    roster:[...g.scene.soldierViews.values()].map(x=>({tex:x.sprite.texture.key,artist:x.artist}))};
  });
  if(veterans.level!==2||veterans.gold!==135||veterans.roster.length!==2||
   !veterans.roster.every(x=>x.tex==="actors/allies/infantry-veteran/v1/p08"))
   throw Error(name+" upgraded veterans not rendered "+JSON.stringify(veterans));
  await page.screenshot({path:dir+"/"+name+"-T09-2-veterans.png",fullPage:true});
  // B1 actual end-to-end T09 rally on touchscreen / mouse. Invalid target MUST keep mode.
  await page.waitForTimeout(320);
  await page.locator('[data-t09-id="rally"]').click();
  let mode=await page.evaluate(()=>window.__SEMANTROPIC_C1D7.rally.get());
  if(!mode.active||mode.spotIndex!==spot.index||!mode.rangeVisible)
   throw Error(name+" rally mode never enabled "+JSON.stringify(mode));
  const targets=await page.evaluate(index=>{
   const g=window.__SEMANTROPIC_C1D7,t=g.economy.getTower(index);
   const rect=g.scene.game.canvas.getBoundingClientRect(),home=g.world.rallyAt(t);
   const convert=v=>({x:rect.left+v.x*rect.width/1280,y:rect.top+v.y*rect.height/768});
   const visible=v=>v.x>45&&v.y>80&&v.x<innerWidth-35&&v.y<innerHeight-38;
   const candidates=g.world.infantryNav.nodes.map(n=>({
    ...n,screen:convert(n),d:Math.hypot(n.x-t.x,n.y-t.y),
    farFromHome:Math.hypot(n.x-home.x,n.y-home.y)}))
     .filter(n=>n.d>25&&n.d<=120&&n.farFromHome>=24&&visible(n.screen))
     .sort((a,b)=>b.farFromHome-a.farFromHome);
   const invalid=[{x:t.x+360,y:t.y},{x:t.x-360,y:t.y},{x:t.x,y:t.y+340},
    {x:t.x,y:t.y-340}].map(v=>({world:v,screen:convert(v)}))
    .find(v=>visible(v.screen));
   return {valid:candidates[0]??null,invalid,home:{x:home.x,y:home.y},tower:{x:t.x,y:t.y}};
  },spot.index);
  if(!targets.valid||!targets.invalid)throw Error(name+" no visible rally destinations "+JSON.stringify(targets));
  const touch=async p=>mobile?page.touchscreen.tap(p.x,p.y):page.mouse.click(p.x,p.y);
  await touch(targets.invalid.screen);
  mode=await page.evaluate(()=>window.__SEMANTROPIC_C1D7.rally.get());
  if(!mode.active||mode.attempts!==1||mode.successes!==0)
   throw Error(name+" invalid tap closed rally mode or moved soldier "+JSON.stringify(mode));
  await page.screenshot({path:dir+"/"+name+"-RALLY-visible-range-retry.png",fullPage:true});
  const before=await page.evaluate(()=>window.__SEMANTROPIC_C1D7.world.soldiers.map(s=>({id:s.id,x:s.x,y:s.y})));
  await touch(targets.valid.screen);
  mode=await page.evaluate(()=>window.__SEMANTROPIC_C1D7.rally.get());
  const changed=await page.evaluate(index=>{
   const g=window.__SEMANTROPIC_C1D7,w=g.world;
   return {navNode:w.rallyNodes.get(index),destination:g.scene.lastRally,
    soldierHome:w.soldiers.map(s=>({x:s.homeX,y:s.homeY}))};
  },spot.index);
  if(mode.active||!mode.destination||mode.successes!==1||
    changed.navNode!==targets.valid.id||mode.rangeVisible)
   throw Error(name+" accepted rally target wasn't committed "+JSON.stringify({mode,changed,targets}));
  const movement=await page.evaluate(({valid,before})=>{
   const g=window.__SEMANTROPIC_C1D7,w=g.world;
   for(let i=0;i<240;i++)w.tick(1/60);
   g.scene.drawSoldiers();
   const after=w.soldiers.map(s=>({id:s.id,x:s.x,y:s.y,homeX:s.homeX,homeY:s.homeY}));
   const initialDistance=before.reduce((v,s)=>v+Math.hypot(s.x-valid.x,s.y-valid.y),0);
   const finalDistance=after.reduce((v,s)=>v+Math.hypot(s.x-valid.x,s.y-valid.y),0);
   return {initialDistance,finalDistance,after,navRepaths:w.navigationRepaths};
  },{valid:targets.valid,before});
  if(movement.finalDistance>=movement.initialDistance-8||
    !movement.after.every(s=>Math.hypot(s.homeX-targets.valid.x,s.homeY-targets.valid.y)<28))
   throw Error(name+" soldiers did not really move towards rally "+JSON.stringify({targets,movement}));
  await page.screenshot({path:dir+"/"+name+"-RALLY-soldiers-moved.png",fullPage:true});
  // Reopen/cancel - does not change the authoritative rally node.
  if(mobile)await page.touchscreen.tap(spot.x,spot.y);else await page.mouse.click(spot.x,spot.y);
  await page.waitForFunction(()=>!!document.querySelector('.t09-node[data-t09-id="rally"]'),null,{timeout:5000});
  await page.waitForTimeout(310);await page.locator('[data-t09-id="rally"]').click();
  if(!(await page.evaluate(()=>window.__SEMANTROPIC_C1D7.rally.get().active)))throw Error(name+" cannot reenter rally");
  await page.locator("#cancelRally").click();
  if((await page.evaluate(()=>window.__SEMANTROPIC_C1D7.rally.get().active)))
   throw Error(name+" cancel rally did not cancel");
  // Force genuine CORE wave start, then present actual C1-D5 A2 combat events.
  await page.locator("#waveStart").click();
  const combat=await page.evaluate(()=>{
   const g=window.__SEMANTROPIC_C1D7,w=g.world;
   let soldiers=0,enemies=0,windups=0,attacks=0,confirmedContactFrame2=0;
   for(let i=0;i<1400&&!w.ended;i++){
    const ev=w.tick(1/60);
    g.scene.p08Animator.update(1/60);
    g.scene.reactEvents(ev);
    for(const e of ev){
     if(e.type==="soldier_attack_windup")windups++;
     if(e.type==="soldier_attack_hit"){
      attacks++;
      const frame=g.scene.p08Animator.snapshot(e.entityId);
      if(frame?.state==="attack"&&frame.frame===2)confirmedContactFrame2++;
     }
    }
    if(i%60===0){g.scene.drawEnemies();g.scene.drawSoldiers();}
   }
   soldiers=w.soldiers.length;enemies=w.actors.length;
   g.scene.drawEnemies();g.scene.drawSoldiers();g.scene.updateHud();
   return {windups,attacks,confirmedContactFrame2,soldiers,enemies,animated:g.scene.p08Animator.entities.size,
    damageAuthorityOnly:w.kills+w.escapedCount<=w.totalSpawns,
    frames:[...g.scene.soldierViews.values()].map(x=>x.sprite.frame.name)};
  });
  if(!combat.damageAuthorityOnly||combat.windups<1||combat.attacks<1||combat.confirmedContactFrame2<1)
   throw Error(name+" CORE P08 combat events not verified "+JSON.stringify(combat));
  await page.screenshot({path:dir+"/"+name+"-P08-combat.png",fullPage:true});
  if(errors.length)throw Error(name+" JS errors "+errors.join(" | "));
  all.push({name,viewport:w+"x"+h,t09:"real contextual transactions",rally:"invalid retry, valid destination, moved 2 soldiers, cancel",p08:"one recruit then two veterans",combat});
  await page.close();
 }
 // Complete five-wave victory with real CORE and real P08 event presenter, never fabricate a victory.
 const win=await browser.newPage({viewport:{width:1280,height:768}});
 const winErr=[];win.on("pageerror",e=>winErr.push(e.message));
 await win.goto(url,{waitUntil:"load"});await win.waitForFunction(()=>!!window.__SEMANTROPIC_C1D7,null,{timeout:45000});
 const victory=await win.evaluate(()=>{
  const g=window.__SEMANTROPIC_C1D7,w=g.world,order=[0,2,4,7,1,3,5,6];
  if(!w.economy.build(0,"infantry").ok||!w.economy.build(2,"sniper").ok)
   throw Error("Cannot buy initial authentic towers");
  w.syncTowers();g.scene.drawTowers();
  let ticks=0,melee=0;
  for(let wave=1;wave<=5&&!w.ended;wave++){
   if(!w.startWave())throw Error("Blocked wave "+wave);
   let steps=0;
   while(w.active&&!w.ended&&steps++<30000){
    const events=w.tick(1/60);g.scene.p08Animator.update(1/60);g.scene.reactEvents(events);
    ticks++;melee+=events.filter(e=>e.type==="soldier_attack_hit").length;
    if(steps%60===0)for(const pad of order){
     if(!w.economy.getTower(pad)&&w.economy.quote(pad,"sniper").ok){
      if(!w.economy.build(pad,"sniper").ok)throw Error("Purchase failed");break;
     }
    }
   }
   if(steps>=30000)throw Error("Timed out on wave "+wave);
  }
  g.scene.drawTowers();g.scene.drawSoldiers();g.scene.drawEnemies();
  return {ended:w.ended,won:w.won,wave:w.wave,kills:w.kills,escaped:w.escapedCount,
   lives:w.lives,spawns:w.totalSpawns,ticks,melee};
 });
 if(!victory.ended||!victory.won||victory.wave!==5||victory.kills!==63||
  victory.escaped!==0||victory.lives!==100||victory.spawns!==63)
  throw Error("G2 five-wave real victory not valid "+JSON.stringify(victory));
 await win.waitForFunction(()=>!document.getElementById("results").hidden,null,{timeout:8000});
 const stars=await win.locator("#resultStars").textContent();
 if(stars!=="★★★")throw Error("Victory stars wrong: "+stars);
 const saved=await win.evaluate(()=>JSON.parse(localStorage.getItem("semantropic_td_phaser_m01_normal_v1")||"null"));
 if(saved?.stars!==3||saved?.escapes!==0)throw Error("G2 real victory local record missing "+JSON.stringify(saved));
 await win.screenshot({path:dir+"/desktop-FULL-VICTORY-5WAVES.png",fullPage:true});
 await win.locator("#resultRestart").click();
 await win.waitForFunction(()=>window.__SEMANTROPIC_C1D7?.world?.wave===0,null,{timeout:45000});
 const rec=await win.locator("#record").textContent();
 if(!rec.includes("★★★"))throw Error("G2 record lost on restart "+rec);
 if(winErr.length)throw Error("G2 win JS errors "+winErr.join("|"));
 await win.close();
 // Authentic natural defeat with 50 leaks; no score or victory generated.
 const lose=await browser.newPage({viewport:{width:1280,height:768}}),loseErr=[];
 lose.on("pageerror",e=>loseErr.push(e.message));
 await lose.goto(url,{waitUntil:"load"});
 await lose.waitForFunction(()=>!!window.__SEMANTROPIC_C1D7,null,{timeout:45000});
 const defeat=await lose.evaluate(()=>{
  const g=window.__SEMANTROPIC_C1D7,w=g.world;
  let ticks=0;
  for(let wave=1;wave<=5&&!w.ended;wave++){
   if(!w.startWave())throw Error("Loss wave did not start "+wave);
   let steps=0;
   while(w.active&&!w.ended&&steps++<29000){
    const ev=w.tick(1/60);
    g.scene.p08Animator.update(1/60);g.scene.reactEvents(ev);ticks++;
   }
   if(steps>=29000)throw Error("Loss core timed out");
  }
  return {ended:w.ended,won:w.won,lives:w.lives,escaped:w.escapedCount,ticks};
 });
 if(!defeat.ended||defeat.won||defeat.lives!==0||defeat.escaped!==50)
  throw Error("G2 natural loss parity "+JSON.stringify(defeat));
 await lose.waitForFunction(()=>!document.getElementById("results").hidden,null,{timeout:8000});
 if((await lose.locator("#resultStars").textContent())!=="Sin estrellas")
  throw Error("G2 defeat must award no stars");
 if(await lose.evaluate(()=>!!localStorage.getItem("semantropic_td_phaser_m01_normal_v1")))
  throw Error("G2 defeat saved fake victory");
 await lose.screenshot({path:dir+"/desktop-FULL-DEFEAT.png",fullPage:true});
 if(loseErr.length)throw Error("G2 defeat JS errors "+loseErr.join("|"));
 await lose.close();
 console.log("PASS_C1D7_G2_FULL_M01_CORE_WIN_LOSS",JSON.stringify({victory,stars,recordAfterReload:rec,defeat}));
 // Verify that P08-B1-HF1 fixed the actual overlapping veteran titles in Phaser.
 const gallery=[];
 for(const [w,h] of [[1280,768],[844,390],[932,430]]){
  const pg=await browser.newPage({viewport:{width:w,height:h}});
  const err=[];pg.on("pageerror",e=>err.push(e.message));
  const response=await pg.goto(new URL("/official/src/actors-visual/p08/",url).href,{waitUntil:"load"});
  if(response?.status()!==200)throw Error("P08 HF1 gallery HTTP "+response?.status());
  await pg.waitForFunction(()=>!!window.__SEMANTROPIC_P08?.scene,null,{timeout:45000});
  const gap=await pg.evaluate(()=>{
   const s=window.__SEMANTROPIC_P08.scene;
   const vets=s.views.filter(v=>v.item.id==="infantry_veteran");
   const [a,b]=vets;
   return {count:vets.length,titlesGap:(b.title.x-b.title.displayWidth/2)-
      (a.title.x+a.title.displayWidth/2),
    cardsGap:(b.sprite.x-b.panelWidth/2)-(a.sprite.x+a.panelWidth/2),
    texts:vets.map(v=>v.title.text),texturesOK:vets.every(v=>s.textures.exists(v.sprite.texture.key))};
  });
  if(gap.count!==2||gap.titlesGap<8||gap.cardsGap<8||!gap.texturesOK)
   throw Error("P08-HF1 real gallery titles/panels overlap "+w+"x"+h+" "+JSON.stringify(gap));
  await pg.screenshot({path:dir+"/P08-HF1-gallery-"+w+"x"+h+".png",fullPage:true});
  if(err.length)throw Error("P08-HF1 Chromium "+err.join("|"));
  gallery.push({viewport:w+"x"+h,...gap});
  await pg.close();
 }
 console.log("PASS_P08_B1_HF1_REAL_GALLERY_3_VIEWPORTS",JSON.stringify(gallery));

 console.log(JSON.stringify({status:"PASS_C1D7_G2_REAL_WEBGL2_T09_P08_INTEGRATED",results:all,physicalMobile:"NOT_RUN",humanVisualApproval:"PENDING"},null,2));
}catch(e){console.error("C1D7_G2_BROWSER_FAIL",e.stack||String(e));process.exitCode=1}
finally{await browser?.close();await new Promise(ok=>srv.close(ok))}
