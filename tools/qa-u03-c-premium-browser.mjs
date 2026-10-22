/** SEMANTROPIC TD U03: authentic Chromium/WebGL2 test.
 * Validate no inter-frame P03 visor leak and actual premium shots in sniper I/II.
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
const dir="artifacts/u03-c-premium-browser";await mkdir(dir,{recursive:true});
let browser;const results=[];
try{
 browser=await chromium.launch({headless:true,args:["--use-gl=angle","--use-angle=swiftshader","--enable-webgl","--enable-unsafe-swiftshader"]});
 for(const [name,width,height] of [["desktop",1280,768],["android844",844,390],["android932",932,430]]){
  for(const [level,socket] of [[1,0],[2,2]]){
   const page=await browser.newPage({viewport:{width,height},hasTouch:width<1000,isMobile:width<1000});
   const errors=[];page.on("pageerror",e=>errors.push(e.message));
   const resp=await page.goto(url,{waitUntil:"load",timeout:30000});
   if(resp?.status()!==200)throw Error("HTTP "+resp?.status());
   await page.waitForFunction(()=>!!window.__SEMANTROPIC_C1D7?.scene,null,{timeout:45000});
   const record=await page.evaluate(async({level,socket})=>{
    const g=window.__SEMANTROPIC_C1D7,scene=g.scene,world=g.world;
    if(!(scene.game.renderer.gl instanceof WebGL2RenderingContext))throw Error("not WebGL2");
    const {createP03Atlas,paintP03Frame}=await import("/official/art/actors/p03-rig.mjs");
    const {isolateP03Atlas}=await import("/official/src/towers-visual/t10/p03-atlas-isolation.mjs");
    const original=createP03Atlas("sniper_operator"),clean=isolateP03Atlas(original);
    if(clean.isolatedFrameCount<20)throw Error("not enough repacked frames");
    const ctx=clean.canvas.getContext("2d"),sample=document.createElement("canvas");
    const frames=["idle-0","idle-3","walk-0","walk-7","attackWindup-0","attack-0","attack-4","blocked-2"];
    sample.width=176;sample.height=208;
    const scratch=sample.getContext("2d");
    // Compare like with like: Canvas2D paint -> drawImage copy -> packed atlas.
    // Raw paint bytes differ significantly from post-drawImage pixels due to
    // browser premultiplied-alpha compositing, especially sniper's translucent visor.
    const expected=document.createElement("canvas");
    expected.width=176;expected.height=208;
    const expectedBrush=expected.getContext("2d");
    let compared=0;
    for(const name of frames){
     const k=name.lastIndexOf("-"),state=name.slice(0,k),frame=Number(name.slice(k+1));
     const f=clean.frames[state]?.[frame];
     if(!f)throw Error("missing P03 frame "+name);
     scratch.clearRect(0,0,176,208);paintP03Frame(scratch,"sniper_operator",state,frame);
     expectedBrush.clearRect(0,0,176,208);
     expectedBrush.drawImage(sample,0,0);
     const a=expectedBrush.getImageData(0,0,176,208).data;
     const b=ctx.getImageData(f.x,f.y,176,208).data;
     // Canvas drawImage round-trips semi-transparent pixels through the browser's
     // premultiplied-alpha pipeline. Compare visible premultiplied colour and
     // coverage with small raster rounding tolerance, never byte-for-byte RGB.
     let mismatches=0;
     for(let i=0;i<a.length;i+=4){
      const alphaA=a[i+3],alphaB=b[i+3];
      if(Math.abs(alphaA-alphaB)>3){mismatches++;continue;}
      for(let k=0;k<3;k++)if(Math.abs(a[i+k]*alphaA/255-b[i+k]*alphaB/255)>4){mismatches++;break;}
     }
     if(mismatches>Math.ceil(176*208*.003))
      throw Error("P03 isolated frame raster differs visibly "+name+" pixels "+mismatches);
     compared++;
    }
    if(!world.economy.build(socket,"sniper").ok)throw Error("build failed");
    if(level===2&&!world.economy.upgrade(socket).ok)throw Error("upgrade failed");
    world.syncTowers();scene.drawTowers();
    if(!world.startWave())throw Error("start wave failed");
    let shot=null;
    for(let tick=0;tick<20000&&!world.ended&&world.active&&!shot;tick++){
     const events=world.tick(1/60);
     scene.reactEvents(events);
     const fire=events.find(e=>e.type==="attack_fire"&&scene.towerMounts.get(e.entityId)?.meta.level===level);
     if(!fire)continue;
     const job=scene.shots.jobs.get(fire.eventId);
     if(!job||job.visualLevel!==level||!job.premiumProjectile||!job.premiumGlow||!job.premiumTrail)
      throw Error("level visual premium assets missing");
     if(job.hitShown)throw Error("hit before tracer started");
     shot={eventId:fire.eventId,source:job.premiumSource,firstFrame:job.premiumFirstFrame,
      travelMs:job.premiumTravelDuration,visualLevel:job.visualLevel,emittedCoreBullet:fire.payload.bulletId,
      renderer:"WebGL2",samples:compared};
    }
    if(!shot)throw Error("real core never fired");
    scene.drawEnemies();scene.drawSoldiers();scene.updateHud();
    return shot;
   },{level,socket});
   await page.screenshot({path:dir+"/"+name+"-sniper-L"+level+"-premium.png",fullPage:true});
   if(errors.length)throw Error("Browser JS "+errors.join(" | "));
   results.push({viewport:name,width,height,level,...record});
   await page.close();
  }
 }
 console.log(JSON.stringify({status:"PASS_U03_P03_ATLAS_ISOLATION_AND_PREMIUM_WEBGL2",n:results.length,results,
  userAndroidPhysical:"PENDING",cinematicArtApproval:"PENDING"},null,2));
}catch(err){console.error("FAIL_U03_BROWSER",err.stack||String(err));process.exitCode=1}
finally{await browser?.close();await new Promise(ok=>server.close(ok));}