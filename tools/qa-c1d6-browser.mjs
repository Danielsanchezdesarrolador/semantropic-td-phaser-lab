import {createServer} from "node:http";
import {readFile,stat,mkdir} from "node:fs/promises";
import {resolve,join,extname,sep} from "node:path";
import {chromium} from "playwright";
const ROOT=resolve("dist");
const MIME={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".mjs":"text/javascript; charset=utf-8",".json":"application/json",".svg":"image/svg+xml",".png":"image/png"};
console.log("C1D6_DIAG",ROOT,"exists=",await stat(join(ROOT,"official/src/c1d6-playable/index.html")).then(x=>x.isFile()).catch(e=>String(e)));
const srv=createServer(async(req,res)=>{
 try{const url=new URL(req.url||"/","http://localhost"),file=resolve(ROOT,"."+decodeURIComponent(url.pathname));
  if(file!==ROOT&&!file.startsWith(ROOT+sep))throw Error("bad path");
  const chosen=(await stat(file)).isDirectory()?join(file,"index.html"):file;
  res.writeHead(200,{"Content-Type":MIME[extname(chosen)]||"application/octet-stream"});res.end(await readFile(chosen));
 }catch(e){console.error("C1D6_SERVER_404",req.url,String(e));res.writeHead(404);res.end("not found");}
});
await new Promise(resolve=>srv.listen(0,"127.0.0.1",resolve));
const TEST_URL="http://127.0.0.1:"+srv.address().port+(process.env.SEMANTROPIC_PLAYTEST_PATH||"/official/src/c1d6-playable/index.html");
await mkdir("artifacts/c1d6-browser",{recursive:true});
let browser;
try{
 browser=await chromium.launch({headless:true,args:["--use-gl=angle","--use-angle=swiftshader","--enable-webgl","--enable-unsafe-swiftshader"]});
 const results=[];
 for(const [tag,width,height] of [["desktop",1280,768],["landscape844",844,390],["landscape932",932,430]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,isMobile:width<950,hasTouch:width<950});
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  const response=await page.goto(TEST_URL,{waitUntil:"load",timeout:30000});
  if(!response||response.status()!==200)throw Error(tag+" HTTP "+response?.status()+" "+TEST_URL+" content="+(await page.content()).slice(0,500));
  try{await page.waitForFunction(()=>!!window.__SEMANTROPIC_C1D6?.scene,null,{timeout:45000});}
  catch{throw Error(tag+" initialization failed url="+page.url()+" html="+(await page.content()).slice(0,500)+" errors="+errors.join(","));}
  const initial=await page.evaluate(()=>{
   const g=window.__SEMANTROPIC_C1D6;
   return {webgl2:g.scene.game.renderer.gl instanceof WebGL2RenderingContext,
    route:g.world.map.path.length,sockets:g.world.map.spots.length,gold:g.world.economy.gold,lives:g.world.lives};
  });
  if(width<1000){
   const screen=await page.evaluate(()=>{
    const canvas=document.querySelector("#stage canvas"),r=canvas.getBoundingClientRect();
    const ids=["prev","next","family","buy","upgrade","sell","waveStart","pause","restart"];
    const rects=ids.map(id=>{const b=document.getElementById(id).getBoundingClientRect();
      return{id,left:b.left,right:b.right,top:b.top,bottom:b.bottom,height:b.height,width:b.width};});
    return {screenWidth:innerWidth,screenHeight:innerHeight,canvas:{left:r.left,right:r.right,
      top:r.top,bottom:r.bottom},controls:rects};
   });
   if(screen.canvas.left>1||screen.canvas.right<width-1||screen.canvas.top>1||
     screen.canvas.bottom<height-1)throw Error(tag+" letterbox still present "+JSON.stringify(screen));
   if(screen.controls.some(x=>x.left<0||x.right>width+1||x.top<0||x.bottom>height+1||
     x.height<40))throw Error(tag+" controls out of safe viewport "+JSON.stringify(screen));
   for(let i=1;i<screen.controls.length;i++)if(screen.controls[i].top>screen.controls[0].top+8)
     throw Error(tag+" controls wrap into second line "+JSON.stringify(screen.controls));
  }
  if(!initial.webgl2||initial.gold!==365||initial.lives!==100||initial.route!==133||initial.sockets!==8)
   throw Error(tag+" invalid initial scene "+JSON.stringify(initial));
  await page.screenshot({path:"artifacts/c1d6-browser/"+tag+"-before.png",fullPage:true});
  const tapTarget=await page.evaluate(()=>{
   const c=document.querySelector("#stage canvas").getBoundingClientRect();
   const sockets=window.__SEMANTROPIC_C1D6.scene.mapView.plan.sockets;
   return sockets.map((s,index)=>({index,
    x:c.left+c.width*s.world.x/1280,y:c.top+c.height*s.world.y/768}))
    .find(s=>s.index>0&&s.x>70&&s.x<innerWidth-70&&s.y>90&&s.y<innerHeight-100)||null;
  });
  if(!tapTarget)throw Error(tag+" no tappable in-scene socket candidate");
  if(width<950)await page.touchscreen.tap(tapTarget.x,tapTarget.y);
  else await page.mouse.click(tapTarget.x,tapTarget.y);
  const selected=await page.locator("#slot").textContent();
  if(selected!==String(tapTarget.index+1)+"/8")
   throw Error(tag+" screen-to-world touch selected wrong platform "+JSON.stringify({tapTarget,selected}));
  for(let step=0;step<tapTarget.index;step++)await page.locator("#prev").click();
  const restored=await page.locator("#slot").textContent();
  if(restored!=="1/8")throw Error(tag+" restored selection wrong "+restored);

  await page.locator("#family").selectOption("infantry");
  await page.locator("#buy").click();
  // User-visible rally is real CORE state, not a map presentation mock.
  const rally=await page.evaluate(()=>{
   const s=window.__SEMANTROPIC_C1D6, t=s.economy.getTower(0);
   const n=s.world.rallyAt(t),c=document.querySelector("#stage canvas").getBoundingClientRect();
   return {x:c.left+c.width*n.x/1280,y:c.top+c.height*n.y/768,nodeId:n.nodeId};
  });
  await page.locator("#rally").click();
  if(width<950)await page.touchscreen.tap(rally.x,rally.y);
  else await page.mouse.click(rally.x,rally.y);
  const afterRally=await page.evaluate(()=>window.__SEMANTROPIC_C1D6.world.rallyNodes.get(0));
  if(afterRally!==rally.nodeId)throw Error(tag+" infantry rally invalid "+JSON.stringify({rally,afterRally}));
  await page.locator("#next").click();
  await page.locator("#next").click();
  await page.locator("#family").selectOption("sniper");
  await page.locator("#buy").click();
  const bought=await page.evaluate(()=>window.__SEMANTROPIC_C1D6.economy.snapshot);
  if(bought.gold!==130||bought.towers.length!==2||bought.towers[0]?.family!=="infantry"||bought.towers[1]?.family!=="sniper")throw Error(tag+" dual tower buy failed "+JSON.stringify(bought));
  const visuals=await page.evaluate(()=>{
   const s=window.__SEMANTROPIC_C1D6;
   const diag=s.diagnostics(),t=s.scene;
   return {art:s.art,environment:t.mapView.artVersion,assets:{
    warrior:t.textures.exists("actors/enemies/warrior/v1/p07-c1c"),
    hound:t.textures.exists("actors/enemies/hound/v1/p07-c1c"),
    recruit:t.textures.exists("actors/allies/infantry-recruit/v1/p07-c1c"),
    sniperOperator:t.textures.exists("actors/allies/sniper-operator/v1/p03-q2")},
    diag,sniperMounted:[...t.towerMounts.values()].filter(m=>m.meta.family==="sniper")
     .map(m=>({historicSource:m.source,addedRifleLayers:m.addedRifleLayers,
       operatorTexture:m.operator?.texture?.key,buildingTexture:m.sprite?.texture?.key}))};
  });
  if(!visuals.environment?.includes("m07")||
      visuals.art.maps!=="M07-Q2-FIEL"||visuals.art.towers!=="T08-HF1-T04"||
      visuals.art.actors!=="P03_APPROVED_P07_LOADED"||
      !Object.values(visuals.assets).every(Boolean)||
      visuals.sniperMounted.length!==1||
      visuals.sniperMounted[0].historicSource!=="T08_T04_APPROVED"||
      visuals.sniperMounted[0].addedRifleLayers!==0||
      visuals.sniperMounted[0].operatorTexture!=="actors/allies/sniper-operator/v1/p03-q2"||
      visuals.sniperMounted[0].buildingTexture!=="towers/sniper/level-1")
    throw Error(tag+" M07-Q2/T08-HF1/P07-HF1 visual integration rejected "+JSON.stringify(visuals));
  const mapPerf=await page.evaluate(()=>window.__SEMANTROPIC_C1D6.scene.mapView.getMapPerformanceInfo());
  if(mapPerf.canonicalPads!==8||mapPerf.originalProps!==13||mapPerf.gpuMemoryMiB!==null)
    throw Error(tag+" map performance contract invalid "+JSON.stringify(mapPerf));
  const activeSoldiers=await page.evaluate(()=>window.__SEMANTROPIC_C1D6.world.soldiers.length);
  if(activeSoldiers!==1)throw Error(tag+" Infantry did not spawn actual soldier");
  await page.locator("#waveStart").click();
  await page.waitForFunction(()=>window.__SEMANTROPIC_C1D6.world.kills>0,null,{timeout:90000});
  const after=await page.evaluate(()=>{
   const g=window.__SEMANTROPIC_C1D6;
   return {kills:g.world.kills,gold:g.economy.gold,lives:g.world.lives,wave:g.world.wave,
    ledger:g.economy.ledger.length,realActors:g.world.actors.length,eventIds:g.world.nextEventId};
  });
  const activeVisual=await page.evaluate(()=>{
    const t=window.__SEMANTROPIC_C1D6.scene;
    return [...t.enemyViews.values(),...t.soldierViews.values()].map(v=>v.artist);
  });
  if(!activeVisual.length||!activeVisual.every(x=>x==="P03_ORIGINAL"))
    throw Error(tag+" P07 artwork activated despite known alpha QA BLOCKER "+JSON.stringify(activeVisual));
  if(after.gold<=130||after.kills<1||after.wave!==1||after.ledger<2)throw Error(tag+" no actual hit/reward "+JSON.stringify(after));
  await page.screenshot({path:"artifacts/c1d6-browser/"+tag+"-first-kill.png",fullPage:true});
  await page.locator("#pause").click();
  const prior=await page.evaluate(()=>window.__SEMANTROPIC_C1D6.world.snapshot);
  await page.waitForTimeout(300);
  const paused=await page.evaluate(()=>window.__SEMANTROPIC_C1D6.world.snapshot);
  if(!paused.paused||paused.kills!==prior.kills||paused.lives!==prior.lives)throw Error(tag+" pause failed");
  if(errors.length)throw Error(tag+" page errors "+errors.join(" // "));
  const currentRecord=await page.locator("#record").textContent();
  if(!currentRecord.includes("sin completar"))throw Error(tag+" unexpectedly wrote score during combat");
  results.push({tag,viewport:width+"x"+height,webgl2:true,m07Q2:true,t08HF1:true,p07HF1:true,operatorP03Fallback:true,navA2:true,rallyActual:true,builtInfantry:true,builtSniper:true,realKill:true,
   reward:true,paused:true,kills:after.kills});
  await page.locator("#restart").click();
  await page.waitForFunction(()=>window.__SEMANTROPIC_C1D6?.economy?.gold===365&&window.__SEMANTROPIC_C1D6?.world?.wave===0,null,{timeout:45000});
  await page.screenshot({path:"artifacts/c1d6-browser/"+tag+"-restarted.png",fullPage:true});
  await page.close();
 }
 // Natural full terminal LOSS executed by the real CORE in-browser; no fake outcome event.
 const page=await browser.newPage({viewport:{width:1280,height:768}});
 const pageErrors=[];page.on("pageerror",e=>pageErrors.push(e.message));
 await page.goto(TEST_URL,{waitUntil:"load"});
 await page.waitForFunction(()=>!!window.__SEMANTROPIC_C1D6?.world,null,{timeout:45000});
 const outcome=await page.evaluate(()=>{
  const w=window.__SEMANTROPIC_C1D6.world;
  let steps=0;
  for(let wave=1;wave<=5&&!w.ended;wave++){
   if(!w.startWave())throw Error("wave refused "+wave);
   let ticks=0;
   while(w.active&&!w.ended&&ticks++<30000){w.tick(1/60);steps++;}
   if(ticks>=30000)throw Error("natural defeat core stuck "+wave);
  }
  return {ended:w.ended,won:w.won,lives:w.lives,escapes:w.escapedCount,steps};
 });
 if(!outcome.ended||outcome.won||outcome.lives!==0||outcome.escapes!==50)
  throw Error("C1D6 natural loss wrong "+JSON.stringify(outcome));
 await page.waitForFunction(()=>!document.querySelector("#results").hidden,null,{timeout:8000});
 if((await page.locator("#resultStars").textContent())!=="Sin estrellas")
  throw Error("Loss incorrectly grants stars");
 const record=await page.evaluate(()=>localStorage.getItem("semantropic_td_phaser_m01_normal_v1"));
 if(record)throw Error("Defeat persisted fake victory");
 await page.screenshot({path:"artifacts/c1d6-browser/desktop-natural-defeat.png",fullPage:true});
 if(pageErrors.length)throw Error("Natural defeat page errors "+pageErrors.join("|"));
 await page.close();
 console.log("C1D6_REAL_BROWSER_NATURAL_DEFEAT",JSON.stringify(outcome));
 // Verified real WIN core accelerated only inside browser QA (no invented victory flag).
 const winningPage=await browser.newPage({viewport:{width:1280,height:768}});
 const winErrors=[];winningPage.on("pageerror",e=>winErrors.push(e.message));
 await winningPage.goto(TEST_URL,{waitUntil:"load"});
 await winningPage.waitForFunction(()=>!!window.__SEMANTROPIC_C1D6?.world,null,{timeout:45000});
 const victory=await winningPage.evaluate(()=>{
  const c=window.__SEMANTROPIC_C1D6,w=c.world,order=[0,2,4,7,1,3,5,6];
  if(!w.economy.build(0,"infantry").ok||!w.economy.build(2,"sniper").ok)
   throw Error("Could not create real winning strategy");
  w.syncTowers();
  let turns=0;
  for(let wave=1;wave<=5&&!w.ended;wave++){
   if(!w.startWave())throw Error("wave blocked "+wave);
   let steps=0;
   while(w.active&&!w.ended&&steps++<30000){
    w.tick(1/60);turns++;
    if(steps%60===0)for(const pad of order)if(!w.economy.getTower(pad)){
     if(w.economy.quote(pad,"sniper").ok){
      if(!w.economy.build(pad,"sniper").ok)throw Error("purchase inconsistent");break;
     }
    }
   }
   if(steps>=30000)throw Error("wave timeout "+wave);
  }
  c.scene.drawTowers();
  return {ended:w.ended,won:w.won,wave:w.wave,kills:w.kills,
   escaped:w.escapedCount,spawns:w.totalSpawns,lives:w.lives,turns};
 });
 if(!victory.ended||!victory.won||victory.wave!==5||victory.spawns!==63||
    victory.kills!==63||victory.escaped!==0||victory.lives!==100)
  throw Error("Real full core victory parity invalid "+JSON.stringify(victory));
 await winningPage.waitForFunction(()=>!document.querySelector("#results").hidden,null,{timeout:8000});
 const wonStars=await winningPage.locator("#resultStars").textContent();
 if(wonStars!=="★★★")throw Error("Real victory wrong stars "+wonStars);
 const persisted=await winningPage.evaluate(()=>JSON.parse(
  localStorage.getItem("semantropic_td_phaser_m01_normal_v1")||"null"));
 if(!persisted||persisted.stars!==3||persisted.outcome!=="victory"||
   persisted.escapes!==0)throw Error("Real core victory record missing "+JSON.stringify(persisted));
 await winningPage.screenshot({path:"artifacts/c1d6-browser/desktop-real-victory-3stars.png",fullPage:true});
 await winningPage.locator("#resultRestart").click();
 await winningPage.waitForFunction(()=>window.__SEMANTROPIC_C1D6?.world?.wave===0,null,{timeout:45000});
 const bestAfter=await winningPage.locator("#record").textContent();
 if(!bestAfter.includes("★★★"))throw Error("Record lost on fresh session "+bestAfter);
 if(winErrors.length)throw Error("Winning browser errors "+winErrors.join("|"));
 console.log("C1D6_REAL_BROWSER_VICTORY_AND_PERSISTENCE",JSON.stringify({victory,stars:wonStars,
  record:bestAfter,humanPlaytest:false,execution:"scripted real core in Chromium WebGL2"}));
 await winningPage.close();

 console.log(JSON.stringify({status:"PASS_C1D6_REAL_CHROMIUM_WEBGL2",results},null,2));
}catch(e){console.error("C1D6_BROWSER_FAIL",e.stack||String(e));process.exitCode=1;}
finally{await browser?.close();await new Promise(resolve=>srv.close(resolve));}
