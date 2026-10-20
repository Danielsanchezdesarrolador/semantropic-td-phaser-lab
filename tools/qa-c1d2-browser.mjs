import {createServer} from "node:http";
import {readFile,stat,mkdir} from "node:fs/promises";
import {resolve,join,extname,sep} from "node:path";
import {chromium} from "playwright";
const ROOT=resolve("dist");
const MIME={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".mjs":"text/javascript; charset=utf-8",".json":"application/json",".svg":"image/svg+xml",".png":"image/png"};
console.log("C1D2_DIAG",ROOT,"exists=",await stat(join(ROOT,"official/src/c1d2-combat/index.html")).then(x=>x.isFile()).catch(e=>String(e)));
const srv=createServer(async(req,res)=>{
 try{const url=new URL(req.url||"/","http://localhost"),file=resolve(ROOT,"."+decodeURIComponent(url.pathname));
  if(file!==ROOT&&!file.startsWith(ROOT+sep))throw Error("bad path");
  const chosen=(await stat(file)).isDirectory()?join(file,"index.html"):file;
  res.writeHead(200,{"Content-Type":MIME[extname(chosen)]||"application/octet-stream"});res.end(await readFile(chosen));
 }catch(e){console.error("C1D2_SERVER_404",req.url,String(e));res.writeHead(404);res.end("not found");}
});
await new Promise(resolve=>srv.listen(0,"127.0.0.1",resolve));
const TEST_URL="http://127.0.0.1:"+srv.address().port+"/official/src/c1d2-combat/index.html";
await mkdir("artifacts/c1d2-browser",{recursive:true});
let browser;
try{
 browser=await chromium.launch({headless:true,args:["--use-gl=angle","--use-angle=swiftshader","--enable-webgl","--enable-unsafe-swiftshader"]});
 const results=[];
 for(const [tag,width,height] of [["desktop",1280,768],["landscape844",844,390],["landscape932",932,430]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,isMobile:width<950});
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  const response=await page.goto(TEST_URL,{waitUntil:"load",timeout:30000});
  if(!response||response.status()!==200)throw Error(tag+" HTTP "+response?.status()+" "+TEST_URL+" content="+(await page.content()).slice(0,500));
  try{await page.waitForFunction(()=>!!window.__SEMANTROPIC_C1D2?.scene,{timeout:45000});}
  catch{throw Error(tag+" initialization failed url="+page.url()+" html="+(await page.content()).slice(0,500)+" errors="+errors.join(","));}
  const initial=await page.evaluate(()=>{
   const g=window.__SEMANTROPIC_C1D2;
   return {webgl2:g.scene.game.renderer.gl instanceof WebGL2RenderingContext,
    route:g.world.map.path.length,sockets:g.world.map.spots.length,gold:g.world.economy.gold,lives:g.world.lives};
  });
  if(!initial.webgl2||initial.gold!==365||initial.lives!==100||initial.route!==133||initial.sockets!==8)
   throw Error(tag+" invalid initial scene "+JSON.stringify(initial));
  await page.screenshot({path:"artifacts/c1d2-browser/"+tag+"-before.png",fullPage:true});
  await page.locator("#buy").click();
  const bought=await page.evaluate(()=>window.__SEMANTROPIC_C1D2.economy.snapshot);
  if(bought.gold!==225||bought.towers[0]?.family!=="sniper")throw Error(tag+" buy failed");
  await page.locator("#waveStart").click();
  await page.waitForFunction(()=>window.__SEMANTROPIC_C1D2.world.kills>0,{timeout:90000});
  const after=await page.evaluate(()=>{
   const g=window.__SEMANTROPIC_C1D2;
   return {kills:g.world.kills,gold:g.economy.gold,lives:g.world.lives,wave:g.world.wave,
    ledger:g.economy.ledger.length,realActors:g.world.actors.length,eventIds:g.world.nextEventId};
  });
  if(after.gold<=225||after.kills<1||after.wave!==1||after.ledger<2)throw Error(tag+" no actual hit/reward "+JSON.stringify(after));
  await page.screenshot({path:"artifacts/c1d2-browser/"+tag+"-first-kill.png",fullPage:true});
  await page.locator("#pause").click();
  const prior=await page.evaluate(()=>window.__SEMANTROPIC_C1D2.world.snapshot);
  await page.waitForTimeout(300);
  const paused=await page.evaluate(()=>window.__SEMANTROPIC_C1D2.world.snapshot);
  if(!paused.paused||paused.kills!==prior.kills||paused.lives!==prior.lives)throw Error(tag+" pause failed");
  if(errors.length)throw Error(tag+" page errors "+errors.join(" // "));
  results.push({tag,viewport:width+"x"+height,webgl2:true,builtSniper:true,realKill:true,
   reward:true,paused:true,kills:after.kills});
  await page.close();
 }
 console.log(JSON.stringify({status:"PASS_C1D2_REAL_CHROMIUM_WEBGL2",results},null,2));
}catch(e){console.error("C1D2_BROWSER_FAIL",e.stack||String(e));process.exitCode=1;}
finally{await browser?.close();await new Promise(resolve=>srv.close(resolve));}
