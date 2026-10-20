// SEMANTROPIC TD C1-D1 Browser E2E: real WebGL2, actual economy UI; NO combat.
import {createServer} from "node:http";
import {readFile,stat,mkdir} from "node:fs/promises";
import {resolve,join,extname,sep} from "node:path";
import {chromium} from "playwright";
const ROOT=resolve("dist");
const MIME={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".mjs":"text/javascript; charset=utf-8",".json":"application/json; charset=utf-8",".svg":"image/svg+xml",".png":"image/png"};
const srv=createServer(async(req,res)=>{
 try{
  const raw=new URL(req.url||"/","http://localhost"),p=decodeURIComponent(raw.pathname),file=resolve(ROOT,"."+p);
  if(file!==ROOT&&!file.startsWith(ROOT+sep))throw Error("escape");const chosen=(await stat(file)).isDirectory()?join(file,"index.html"):file;
  const content=await readFile(chosen);res.writeHead(200,{"Content-Type":MIME[extname(chosen)]||"application/octet-stream"});res.end(content);
 }catch{res.writeHead(404);res.end("Not found");}
});
await new Promise(done=>srv.listen(0,"127.0.0.1",done));
const url="http://127.0.0.1:"+srv.address().port+"/official/src/c1d-build/index.html";
await mkdir("artifacts/c1d1-browser",{recursive:true});
let browser;
const output=[];
try{
 browser=await chromium.launch({headless:true,args:["--use-gl=angle","--use-angle=swiftshader","--enable-webgl","--enable-unsafe-swiftshader"]});
 for(const [tag,width,height] of [["desktop",1280,768],["mobile844",844,390],["mobile932",932,430]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,isMobile:width<950});
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  page.on("console",msg=>{if(msg.type()==="error")errors.push(msg.text());});
  await page.goto(url,{waitUntil:"load",timeout:35000});
  try{await page.waitForFunction(()=>!!window.__SEMANTROPIC_C1D1?.economy,{timeout:45000})}
  catch{throw Error(tag+" init failure: "+await page.locator("#feedback").textContent()+" errors="+errors.join(" // "));}
  const base=await page.evaluate(()=>{
   const x=window.__SEMANTROPIC_C1D1;
   return {webgl2:x.scene.game.renderer.gl instanceof WebGL2RenderingContext,gold:x.economy.gold,sockets:x.scene.mapView.plan.sockets.length,waypoints:x.scene.mapView.plan.route?.points?.length??133,towers:x.economy.towers.size,scope:x.scope};
  });
  if(!base.webgl2||base.gold!==365||base.sockets!==8||base.towers!==0)throw Error(tag+" invalid base "+JSON.stringify(base));
  await page.screenshot({path:"artifacts/c1d1-browser/"+tag+"-before.png",fullPage:true});
  await page.locator("#buy").click();
  let snap=await page.evaluate(()=>window.__SEMANTROPIC_C1D1.economy.snapshot);
  if(snap.gold!==270||snap.towers.length!==1||snap.towers[0].family!=="infantry")throw Error(tag+" purchase failed "+JSON.stringify(snap));
  await page.screenshot({path:"artifacts/c1d1-browser/"+tag+"-infantry-built.png",fullPage:true});
  await page.locator("#upgrade").click();
  snap=await page.evaluate(()=>window.__SEMANTROPIC_C1D1.economy.snapshot);
  if(snap.gold!==135||snap.towers[0].level!==2)throw Error(tag+" upgrade failed "+JSON.stringify(snap));
  if(!(await page.locator("#upgrade").isDisabled()))throw Error(tag+" forbidden level III button enabled");
  await page.locator("#sell").click();
  snap=await page.evaluate(()=>window.__SEMANTROPIC_C1D1.economy.snapshot);
  if(snap.gold!==284||snap.towers.length!==0||snap.ledger.length!==3)throw Error(tag+" sale failed "+JSON.stringify(snap));
  await page.locator("#family").selectOption("sniper");
  await page.locator("#buy").click();
  snap=await page.evaluate(()=>window.__SEMANTROPIC_C1D1.economy.snapshot);
  if(snap.gold!==144||snap.towers[0].family!=="sniper"||snap.events.length!==4)throw Error(tag+" sniper purchase failed "+JSON.stringify(snap));
  if(!(await page.locator("#upgrade").isDisabled()))throw Error(tag+" insufficient sniper upgrade enabled");
  await page.screenshot({path:"artifacts/c1d1-browser/"+tag+"-sniper-built.png",fullPage:true});
  const box=await page.locator("#stage canvas").boundingBox();
  if(!box||Math.abs(box.x+box.width/2-width/2)>4)throw Error(tag+" broken canvas centering "+JSON.stringify(box));
  if(errors.length)throw Error(tag+" JS errors "+errors.join(" // "));
  output.push({tag,viewport:width+"x"+height,webgl2:true,initialGold:365,finalGold:snap.gold,transactions:snap.ledger.length,builds:snap.ledger.filter(t=>t.source==="construcción").length,level2Validated:true,refundValidated:true,centerDelta:Math.round(Math.abs(box.x+box.width/2-width/2))});
  await page.close();
 }
 console.log(JSON.stringify({status:"PASS_C1D1_REAL_BROWSER_ECONOMY",gameplayScope:"BUILD_UPGRADE_SELL_ONLY_NO_COMBAT",checks:output},null,2));
}catch(e){console.error("C1D1_BROWSER_FAIL",e.stack||String(e));process.exitCode=1}
finally{await browser?.close();await new Promise(done=>srv.close(done));}
