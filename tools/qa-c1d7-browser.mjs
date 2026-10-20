import {createServer} from "node:http";
import {readFile,stat,mkdir} from "node:fs/promises";
import {resolve,join,extname,sep} from "node:path";
import {chromium} from "playwright";
const ROOT=resolve("dist"),MIME={".html":"text/html;charset=utf-8",".js":"text/javascript;charset=utf-8",
 ".mjs":"text/javascript;charset=utf-8",".json":"application/json",".svg":"image/svg+xml",".png":"image/png"};
const server=createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,"http://localhost"),file=resolve(ROOT,"."+decodeURIComponent(url.pathname));
  if(file!==ROOT&&!file.startsWith(ROOT+sep))throw Error("bad path");
  const chosen=(await stat(file)).isDirectory()?join(file,"index.html"):file;
  res.writeHead(200,{"Content-Type":MIME[extname(chosen)]||"application/octet-stream"});res.end(await readFile(chosen));
 }catch(e){res.writeHead(404);res.end("not found "+String(e));}
});
await new Promise(r=>server.listen(0,"127.0.0.1",r));
const TEST_URL="http://127.0.0.1:"+server.address().port+"/official/src/c1d7-playable/index.html";
await mkdir("artifacts/c1d7-browser",{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let browser;
try{
 browser=await chromium.launch({headless:true,args:[
  "--use-gl=angle","--use-angle=swiftshader","--enable-webgl","--enable-unsafe-swiftshader"]});
 const results=[];
 for(const [tag,width,height] of [["desktop",1280,768],["landscape844",844,390],
   ["landscape932",932,430],["androidWide",1536,709]]){
  const page=await browser.newPage({viewport:{width,height},isMobile:width<1000,hasTouch:width<1000});
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  const response=await page.goto(TEST_URL,{waitUntil:"load",timeout:30000});
  if(response?.status()!==200)throw Error(tag+" HTTP bad "+response?.status());
  await page.waitForFunction(()=>!!window.__SEMANTROPIC_C1D7?.scene,null,{timeout:45000});
  const start=await page.evaluate(()=>{
   const g=window.__SEMANTROPIC_C1D7;
   return {webgl:g.scene.game.renderer.gl instanceof WebGL2RenderingContext,gold:g.economy.gold,
    route:g.world.map.path.length,sockets:g.scene.mapView.plan.sockets.length};
  });
  if(!start.webgl||start.gold!==365||start.route!==133||start.sockets!==8)
   throw Error(tag+" baseline changed "+JSON.stringify(start));
  const clickPad=async(exclude=[])=>{
   const loc=await page.evaluate(exclude=>{
    const g=window.__SEMANTROPIC_C1D7,c=g.scene.game.canvas.getBoundingClientRect();
    return g.scene.mapView.plan.sockets.map((s,index)=>({
     index,x:c.left+s.world.x/1280*c.width,y:c.top+s.world.y/768*c.height}))
     .filter(p=>!exclude.includes(p.index)&&p.x>85&&p.x<innerWidth-85&&p.y>86&&p.y<innerHeight-76)
     .sort((a,b)=>Math.abs(a.x-innerWidth/2)+Math.abs(a.y-innerHeight/2)-
       Math.abs(b.x-innerWidth/2)-Math.abs(b.y-innerHeight/2))[0]??null;
   },exclude);
   if(!loc)throw Error(tag+" no visible unblocked pad");
   if(width<1000)await page.touchscreen.tap(loc.x,loc.y);
   else await page.mouse.click(loc.x,loc.y);
   await page.waitForFunction(()=>!document.getElementById("contextMenu").hidden);
   const state=await page.evaluate(()=>window.__SEMANTROPIC_C1D7.menu.get());
   if(!state.open||state.index!==loc.index)throw Error(tag+" pad touch selected other pad "+JSON.stringify({loc,state}));
   return loc;
  };
  const a=await clickPad();
  const menuBox=await page.locator("#contextMenu").boundingBox();
  if(!menuBox||menuBox.x<0||menuBox.y<0||menuBox.x+menuBox.width>width+1||
   menuBox.y+menuBox.height>height+1)throw Error(tag+" menu clipped "+JSON.stringify(menuBox));
  await page.screenshot({path:"artifacts/c1d7-browser/"+tag+"-menu-empty.png",fullPage:true});
  await page.locator('button[data-intent="build_infantry"]').click();
  let snap=await page.evaluate(i=>{
   const g=window.__SEMANTROPIC_C1D7;return {t:g.economy.getTower(i),
    ledger:g.economy.ledger.length,gold:g.economy.gold,soldiers:g.world.soldiers.length};
  },a.index);
  if(snap.t?.family!=="infantry"||snap.ledger!==1||snap.gold!==270||snap.soldiers!==1)
   throw Error(tag+" infantry economy invalid "+JSON.stringify(snap));
  await sleep(300);
  await page.locator('button[data-intent="upgrade"]').click();
  snap=await page.evaluate(i=>{
   const g=window.__SEMANTROPIC_C1D7;return{tower:g.economy.getTower(i),gold:g.economy.gold,
    soldiers:g.world.soldiers.length,ledger:g.economy.ledger.length};
  },a.index);
  if(snap.tower?.level!==2||snap.gold!==135||snap.soldiers!==2||snap.ledger!==2)
   throw Error(tag+" upgrade I -> II failed "+JSON.stringify(snap));
  await page.screenshot({path:"artifacts/c1d7-browser/"+tag+"-menu-upgraded.png",fullPage:true});
  await sleep(300);
  await page.locator('button[data-intent="sell"]').click();
  const postSell=await page.evaluate(i=>{
   const g=window.__SEMANTROPIC_C1D7;return{tower:g.economy.getTower(i),
    gold:g.economy.gold,ledger:g.economy.ledger.length,soldiers:g.world.soldiers.length};
  },a.index);
  if(postSell.tower||postSell.gold!==284||postSell.ledger!==3||postSell.soldiers!==0)
   throw Error(tag+" sell/refund invalid "+JSON.stringify(postSell));
  await sleep(300);
  await page.locator('button[data-intent="build_sniper"]').click();
  const sniper=await page.evaluate(i=>{
   const g=window.__SEMANTROPIC_C1D7;return{t:g.economy.getTower(i),gold:g.economy.gold,
    ledger:g.economy.ledger.length};
  },a.index);
  if(sniper.t?.family!=="sniper"||sniper.gold!==144||sniper.ledger!==4)
   throw Error(tag+" sniper real construction failed "+JSON.stringify(sniper));
  await page.locator("#menuClose").click();
  if(!(await page.locator("#contextMenu").isHidden()))throw Error(tag+" menu close failed");
  await page.locator("#pause").click();
  const paused=await page.evaluate(()=>window.__SEMANTROPIC_C1D7.world.paused);
  if(!paused)throw Error(tag+" pause failed");
  await page.locator("#pause").click();
  await page.screenshot({path:"artifacts/c1d7-browser/"+tag+"-combat-ready.png",fullPage:true});
  if(errors.length)throw Error(tag+" JS page errors "+errors.join("|"));
  results.push({tag,width,height,webgl2:true,nodal:true,infantryI:true,infantryII:true,
   sniperI:true,sellRefund:true,paused:true,screenshots:3});
  await page.close();
 }
 const portrait=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 await portrait.goto(URL,{waitUntil:"load"});
 const block=await portrait.locator("#portrait").evaluate(el=>getComputedStyle(el).display);
 if(block!=="flex")throw Error("Portrait overlay missing "+block);
 await portrait.close();
 console.log(JSON.stringify({status:"PASS_C1D7_G1_CHROMIUM_WEBGL2_CONTEXTUAL_NODES",
  results,portraitOverlay:true,note:"T09 visuals and P08 actor animations NOT yet integrated"},null,2));
}catch(e){console.error("C1D7_G1_BROWSER_FAIL",e.stack||String(e));process.exitCode=1;}
finally{await browser?.close();await new Promise(r=>server.close(r));}
