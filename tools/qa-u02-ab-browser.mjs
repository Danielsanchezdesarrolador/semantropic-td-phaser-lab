/** Real Chromium WebGL2: U02 platform order, P03 left/right muzzle; controlled visual-only fixture.
 * The actual core/gameplay is tested separately on the unmodified M01 full game.
 */
import {createServer} from "node:http";
import {stat,readFile,mkdir} from "node:fs/promises";
import {resolve,join,extname,sep} from "node:path";
import {chromium} from "playwright";
const root=resolve("dist"),mime={".html":"text/html;charset=utf-8",".mjs":"text/javascript;charset=utf-8",".js":"text/javascript;charset=utf-8",".svg":"image/svg+xml",".png":"image/png",".json":"application/json",".css":"text/css"};
const server=createServer(async(req,res)=>{try{
 const path=resolve(root,"."+decodeURIComponent(new URL(req.url,"http://localhost").pathname));
 if(path!==root&&!path.startsWith(root+sep))throw Error("bad path");
 const file=(await stat(path)).isDirectory()?join(path,"index.html"):path;
 res.writeHead(200,{"Content-Type":mime[extname(file)]??"application/octet-stream"});res.end(await readFile(file));
}catch(e){res.writeHead(404);res.end(String(e));}});
await new Promise(ok=>server.listen(0,"127.0.0.1",ok));
const url="http://127.0.0.1:"+server.address().port+(process.env.SEMANTROPIC_PLAYTEST_PATH||"/official/src/live/");
const dir="artifacts/u02-ab-browser";await mkdir(dir,{recursive:true});
let browser;const results=[];
try{
 browser=await chromium.launch({headless:true,args:["--use-gl=angle","--use-angle=swiftshader","--enable-webgl","--enable-unsafe-swiftshader"]});
 for(const [view,w,h] of [["desktop",1280,768],["android844",844,390],["android932",932,430]]){
  for(const [level,socket] of [[1,0],[2,2]]){
   const page=await browser.newPage({viewport:{width:w,height:h},hasTouch:w<1000,isMobile:w<1000});
   const errors=[];page.on("pageerror",e=>errors.push(e.message));
   const response=await page.goto(url,{waitUntil:"load",timeout:30000});
   if(response?.status()!==200)throw Error("missing LIVE "+response?.status());
   await page.waitForFunction(()=>!!window.__SEMANTROPIC_C1D7?.scene,null,{timeout:45000});
   const resultsBySide={};
   for(const side of ["left","right"]){
    resultsBySide[side]=await page.evaluate(async({level,socket,side})=>{
     const app=window.__SEMANTROPIC_C1D7,s=app.scene,w=app.world;
     const {orientSniperOperator}=await import("/official/src/towers-visual/t10/sniper-operator-tracking.mjs");
     const {projectP03RifleMuzzle}=await import("/official/src/towers-visual/t10/p03-operator-rifle-muzzle.mjs");
     if(!(s.game.renderer.gl instanceof WebGL2RenderingContext))throw Error("WebGL2 required");
     let mount=[...s.towerMounts.values()].find(m=>m.meta?.family==="sniper");
     if(!mount){
      if(!w.economy.build(socket,"sniper").ok)throw Error("cannot build");
      if(level===2&&!w.economy.upgrade(socket).ok)throw Error("cannot upgrade");
      w.syncTowers();s.drawTowers();
      mount=[...s.towerMounts.values()].find(m=>m.meta?.family==="sniper");
     }
     if(!mount?.operatorPrimary||!mount.frontRail||!mount.operatorShadow)throw Error("missing operator/deck assembly");
     if(!(mount.sprite.depth<mount.operatorShadow.depth&&mount.operatorShadow.depth<mount.operator.depth&&mount.operator.depth<mount.frontRail.depth))
      throw Error("operator occluded by tower or foreground rail wrong");
     if(mount.sprite.texture.key!=="t10-hf2-sniper-structure-"+level)throw Error("wrong structure/rifle duplication");
     if(mount.operatorAtlas!=="P03_APPROVED")throw Error("wrong gun source");
     const aim=orientSniperOperator(mount,w,{x:mount.operator.x+(side==="left"?-150:150),y:mount.operator.y+12});
     mount.operator.setFrame("attack-0");
     const lip=projectP03RifleMuzzle(mount.operator,{state:"attack",frame:0});
     if((side==="left")!==mount.operator.flipX)throw Error("operator is looking away from "+side);
     if((side==="left"&&lip.x>=mount.operator.x)||(side==="right"&&lip.x<=mount.operator.x))
      throw Error("visible P03 rifle is looking away from "+side);
     // Freeze game logic only for this visual pose screenshot; renderer still runs.
     w.paused=true;
     return {side,level,flipX:mount.operator.flipX,muzzle:lip,operatorX:mount.operator.x,rotation:aim.rotation,
      depths:{building:mount.sprite.depth,shadow:mount.operatorShadow.depth,operator:mount.operator.depth,rail:mount.frontRail.depth}};
    },{level,socket,side});
    await page.screenshot({path:dir+"/"+view+"-L"+level+"-"+side+".png",fullPage:true});
   }
   if(errors.length)throw Error("JS errors "+errors.join(" | "));
   results.push({viewport:view,width:w,height:h,level,poses:resultsBySide,qaOnlyForcedFacing:true});
   await page.close();
  }
 }
 console.log(JSON.stringify({status:"PASS_U02_AB_REAL_CHROMIUM_WEBGL2",count:results.length,records:results,physicalAndroid:false,humanArtApproval:"PENDING"},null,2));
}catch(e){console.error("FAIL_U02_AB_BROWSER",e.stack||String(e));process.exitCode=1}
finally{await browser?.close();await new Promise(ok=>server.close(ok))}