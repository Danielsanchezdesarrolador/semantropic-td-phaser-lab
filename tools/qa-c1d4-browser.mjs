import {createServer} from "node:http";
import {readFile,stat,mkdir} from "node:fs/promises";
import {resolve,join,extname,sep} from "node:path";
import {chromium} from "playwright";
const ROOT=resolve("dist");
const MIME={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".mjs":"text/javascript; charset=utf-8",".json":"application/json",".svg":"image/svg+xml",".png":"image/png"};
console.log("C1D4_DIAG",ROOT,"exists=",await stat(join(ROOT,"official/src/c1d4-combat/index.html")).then(x=>x.isFile()).catch(e=>String(e)));
const srv=createServer(async(req,res)=>{
 try{const url=new URL(req.url||"/","http://localhost"),file=resolve(ROOT,"."+decodeURIComponent(url.pathname));
  if(file!==ROOT&&!file.startsWith(ROOT+sep))throw Error("bad path");
  const chosen=(await stat(file)).isDirectory()?join(file,"index.html"):file;
  res.writeHead(200,{"Content-Type":MIME[extname(chosen)]||"application/octet-stream"});res.end(await readFile(chosen));
 }catch(e){console.error("C1D4_SERVER_404",req.url,String(e));res.writeHead(404);res.end("not found");}
});
await new Promise(resolve=>srv.listen(0,"127.0.0.1",resolve));
const TEST_URL="http://127.0.0.1:"+srv.address().port+"/official/src/c1d4-combat/index.html";
await mkdir("artifacts/c1d4-browser",{recursive:true});
let browser;
try{
 browser=await chromium.launch({headless:true,args:["--use-gl=angle","--use-angle=swiftshader","--enable-webgl","--enable-unsafe-swiftshader"]});
 const results=[];
 for(const [tag,width,height] of [["desktop",1280,768],["landscape844",844,390],["landscape932",932,430]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,isMobile:width<950});
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  const response=await page.goto(TEST_URL,{waitUntil:"load",timeout:30000});
  if(!response||response.status()!==200)throw Error(tag+" HTTP "+response?.status()+" "+TEST_URL+" content="+(await page.content()).slice(0,500));
  try{await page.waitForFunction(()=>!!window.__SEMANTROPIC_C1D4?.scene,null,{timeout:45000});}
  catch{throw Error(tag+" initialization failed url="+page.url()+" html="+(await page.content()).slice(0,500)+" errors="+errors.join(","));}
  const initial=await page.evaluate(()=>{
   const g=window.__SEMANTROPIC_C1D4;
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
  await page.screenshot({path:"artifacts/c1d4-browser/"+tag+"-before.png",fullPage:true});
  await page.locator("#family").selectOption("infantry");
  await page.locator("#buy").click();
  await page.locator("#next").click();
  await page.locator("#next").click();
  await page.locator("#family").selectOption("sniper");
  await page.locator("#buy").click();
  const bought=await page.evaluate(()=>window.__SEMANTROPIC_C1D4.economy.snapshot);
  if(bought.gold!==130||bought.towers.length!==2||bought.towers[0]?.family!=="infantry"||bought.towers[1]?.family!=="sniper")throw Error(tag+" dual tower buy failed "+JSON.stringify(bought));
  const visuals=await page.evaluate(()=>{
   const s=window.__SEMANTROPIC_C1D4;
   const diag=s.diagnostics(),t=s.scene;
   return {art:s.art,environment:t.mapView.artVersion,assets:{
    warrior:t.textures.exists("actors/enemies/warrior/v1/p06"),
    hound:t.textures.exists("actors/enemies/hound/v1/p06"),
    recruit:t.textures.exists("actors/allies/infantry-recruit/v1/p06"),
    sniperOperator:t.textures.exists("actors/allies/sniper-operator/v1/p06-unarmed")},
    diag,sniperMounted:[...t.towerMounts.values()].filter(m=>m.meta.family==="sniper")
     .map(m=>({weaponLayers:m.rifleCount,operatorTexture:m.operator?.texture?.key}))};
  });
  if(!visuals.environment?.includes("m06")||!Object.values(visuals.assets).every(Boolean)||
      visuals.sniperMounted.length!==1||visuals.sniperMounted[0].weaponLayers!==1||
      visuals.sniperMounted[0].operatorTexture!=="actors/allies/sniper-operator/v1/p06-unarmed")
    throw Error(tag+" M06/T07/P06 integration invalid "+JSON.stringify(visuals));
  const activeSoldiers=await page.evaluate(()=>window.__SEMANTROPIC_C1D4.world.soldiers.length);
  if(activeSoldiers!==1)throw Error(tag+" Infantry did not spawn actual soldier");
  await page.locator("#waveStart").click();
  await page.waitForFunction(()=>window.__SEMANTROPIC_C1D4.world.kills>0,null,{timeout:90000});
  const after=await page.evaluate(()=>{
   const g=window.__SEMANTROPIC_C1D4;
   return {kills:g.world.kills,gold:g.economy.gold,lives:g.world.lives,wave:g.world.wave,
    ledger:g.economy.ledger.length,realActors:g.world.actors.length,eventIds:g.world.nextEventId};
  });
  if(after.gold<=130||after.kills<1||after.wave!==1||after.ledger<2)throw Error(tag+" no actual hit/reward "+JSON.stringify(after));
  await page.screenshot({path:"artifacts/c1d4-browser/"+tag+"-first-kill.png",fullPage:true});
  await page.locator("#pause").click();
  const prior=await page.evaluate(()=>window.__SEMANTROPIC_C1D4.world.snapshot);
  await page.waitForTimeout(300);
  const paused=await page.evaluate(()=>window.__SEMANTROPIC_C1D4.world.snapshot);
  if(!paused.paused||paused.kills!==prior.kills||paused.lives!==prior.lives)throw Error(tag+" pause failed");
  if(errors.length)throw Error(tag+" page errors "+errors.join(" // "));
  results.push({tag,viewport:width+"x"+height,webgl2:true,m06:true,t07RifleUnique:true,p06Png:true,builtInfantry:true,builtSniper:true,realKill:true,
   reward:true,paused:true,kills:after.kills});
  await page.locator("#restart").click();
  await page.waitForFunction(()=>window.__SEMANTROPIC_C1D4?.economy?.gold===365&&window.__SEMANTROPIC_C1D4?.world?.wave===0,null,{timeout:45000});
  await page.screenshot({path:"artifacts/c1d4-browser/"+tag+"-restarted.png",fullPage:true});
  await page.close();
 }
 console.log(JSON.stringify({status:"PASS_C1D4_REAL_CHROMIUM_WEBGL2",results},null,2));
}catch(e){console.error("C1D4_BROWSER_FAIL",e.stack||String(e));process.exitCode=1;}
finally{await browser?.close();await new Promise(resolve=>srv.close(resolve));}
