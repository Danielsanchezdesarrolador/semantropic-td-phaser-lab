import {createServer} from "node:http";
import {stat,readFile,mkdir} from "node:fs/promises";
import {resolve,join,extname,sep} from "node:path";
import {chromium} from "playwright";
const root=resolve("dist"),mime={".html":"text/html;charset=utf-8",".js":"text/javascript;charset=utf-8",
 ".mjs":"text/javascript;charset=utf-8",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".css":"text/css"};
const server=createServer(async(req,res)=>{try{
 const path=resolve(root,"."+decodeURIComponent(new URL(req.url,"http://localhost").pathname));
 if(path!==root&&!path.startsWith(root+sep))throw Error("bad path");
 const file=(await stat(path)).isDirectory()?join(path,"index.html"):path;
 res.writeHead(200,{"Content-Type":mime[extname(file)]||"application/octet-stream"});
 res.end(await readFile(file));
}catch(e){res.writeHead(404);res.end(String(e));}});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
const URL="http://127.0.0.1:"+server.address().port+
 (process.env.SEMANTROPIC_PLAYTEST_PATH||"/official/src/c1d8-b2-playable/");
const dir="artifacts/c1d8-b2-browser";
await mkdir(dir,{recursive:true});
let browser;const all=[];
try{
 browser=await chromium.launch({headless:true,args:["--use-gl=angle","--use-angle=swiftshader",
 "--enable-webgl","--enable-unsafe-swiftshader"]});
 for(const [name,w,h] of [["desktop",1280,768],["landscape844",844,390],["landscape932",932,430]]){
  for(const [level,socket] of [[1,0],[2,2]]){
   const page=await browser.newPage({viewport:{width:w,height:h},hasTouch:w<1000,isMobile:w<1000});
   const errs=[];page.on("pageerror",e=>errs.push(e.message));
   const result=await page.goto(URL,{waitUntil:"load",timeout:30000});
   if(result?.status()!==200)throw Error(name+" "+level+" HTTP "+result?.status());
   await page.waitForFunction(()=>!!window.__SEMANTROPIC_C1D7?.scene,null,{timeout:45000});
   const shot=await page.evaluate(({level,socket})=>{
    const g=window.__SEMANTROPIC_C1D7,scene=g.scene,w=g.world;
    const eco=w.economy;
    if(!eco.build(socket,"sniper").ok)throw Error("real sniper build failed");
    if(level===2&&!eco.upgrade(socket).ok)throw Error("real sniper level II upgrade failed");
    w.syncTowers();scene.drawTowers();
    const tower=eco.getTower(socket),mount=scene.towerMounts.get(tower.id);
    if(!mount||mount.meta.level!==level||mount.addedRifleLayers!==0)
     throw Error("original T04 single rifle violated");
    if(!scene.game.renderer.gl||!(scene.game.renderer.gl instanceof WebGL2RenderingContext))
     throw Error("No actual Chromium WebGL2");
    let matched=null,coreFires=0;
    const dt=1/60;
    for(let wave=1;wave<=5&&!w.ended&&!matched;wave++){
     if(!w.startWave())throw Error("Cannot start wave "+wave);
     for(let tick=0;tick<24000&&!w.ended&&w.active&&!matched;tick++){
      const events=w.tick(dt);
      scene.p08Animator.update(dt);
      scene.reactEvents(events);
      const fire=events.find(e=>e.type==="attack_fire"&&String(e.entityId)===String(tower.id));
      if(!fire)continue;
      coreFires++;
      const records=scene.t10FireOrigins.filter(e=>String(e.towerId)===String(tower.id));
      const newest=records.at(-1);
      const j=[...scene.shots.jobs.values()].find(j=>j.id===fire.eventId&&j.type==="attack_fire");
      if(!j||!newest)throw Error("core fire did not create presentation job");
      const circles=[...j.objects].filter(o=>o.type==="Arc"&&
        (Number.isFinite(o.radius)?o.radius<=6:(o.geom?.radius??20)<=6));
      const orb=circles.at(-1);
      if(!orb)throw Error("No bullet orb created at source");
      const canvas=scene.game.canvas.getBoundingClientRect();
      const cssDiff=Math.hypot((orb.x-newest.source.x)*canvas.width/1280,
       (orb.y-newest.source.y)*canvas.height/768);
      matched={level,socket,source:newest.source,old:newest.legacy,worldDelta:newest.worldDelta,
       orb:{x:orb.x,y:orb.y},cssDiff,canvas:{left:canvas.left,top:canvas.top,
        width:canvas.width,height:canvas.height},eventId:fire.eventId,tick:fire.tick,
       shotOriginOnly:true,coreFires,sourceSprite:{x:mount.sprite.x,y:mount.sprite.y,
        rotation:mount.sprite.rotation,scaleX:mount.sprite.scaleX,scaleY:mount.sprite.scaleY}};
      // Visible proof dots are QA screenshot-only (never shipped as gameplay assets).
      scene.add.circle(newest.source.x,newest.source.y,3,0x00ff00,.96)
       .setStrokeStyle(1,0xffffff).setDepth(56000);
      scene.add.circle(newest.legacy.x,newest.legacy.y,2,0xff00ff,.85).setDepth(55999);
      break;
     }
    }
    if(!matched)throw Error("Real core never fired level "+level+" socket "+socket);
    scene.drawEnemies();scene.drawSoldiers();scene.updateHud();
    return {shot:matched,art:g.art,health:w.lives,coreGold:eco.gold,
      ledger:eco.ledger.length,sniper:mount.meta.title,oneRifle:mount.addedRifleLayers===0};
   },{level,socket});
   if(!shot.oneRifle||shot.shot.cssDiff>6||shot.shot.worldDelta>3.1||
      !Number.isFinite(shot.shot.orb.x)||shot.shot.coreFires!==1)
    throw Error("Muzzle first-fire actual render misaligned "+name+" "+JSON.stringify(shot));
   await page.screenshot({path:dir+"/"+name+"-sniper-L"+level+"-pad"+socket+"-FIRE.png",fullPage:true});
   if(errs.length)throw Error("JS errors "+errs.join(" | "));
   all.push({viewport:name+" "+w+"x"+h,...shot});
   await page.close();
  }
 }
 console.log(JSON.stringify({status:"PASS_C1D8_B2_T10_REAL_SNIPER_MUZZLE_CHROMIUM_WEBGL2",
  levels:[1,2],sockets:[0,2],all,visualChangeOnly:true,
  note:"Green dot source actual SVG barrel; purple historical catalog point. Actual first-frame projectile origin measured."},null,2));
}catch(e){console.error("FAIL_C1D8_B2_CHROMIUM",e.stack||String(e));process.exitCode=1}
finally{await browser?.close();await new Promise(resolve=>server.close(resolve))}
