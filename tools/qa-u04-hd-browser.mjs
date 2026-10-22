/** U04 HD runtime actual Phaser Chromium/WebGL2 acceptance.
 * Asserts 2x texture bytes, preserved displayed size, real P03 barrel and ally assets.
 * Cannot claim extra painted source detail for the P08 originals.
 */
import {createServer} from "node:http";
import {stat,readFile,mkdir} from "node:fs/promises";
import {resolve,join,extname,sep} from "node:path";
import {chromium} from "playwright";
const root=resolve("dist"),mime={".html":"text/html;charset=utf-8",".mjs":"text/javascript;charset=utf-8",".js":"text/javascript;charset=utf-8",".svg":"image/svg+xml",".png":"image/png",".json":"application/json",".css":"text/css"};
const server=createServer(async(req,res)=>{try{const f=resolve(root,"."+decodeURIComponent(new URL(req.url,"http://localhost").pathname));
if(f!==root&&!f.startsWith(root+sep))throw Error("bad path");
const file=(await stat(f)).isDirectory()?join(f,"index.html"):f;
res.writeHead(200,{"Content-Type":mime[extname(file)]??"application/octet-stream"});res.end(await readFile(file));}
catch(e){res.writeHead(404);res.end(String(e));}});
await new Promise(ok=>server.listen(0,"127.0.0.1",ok));
const url="http://127.0.0.1:"+server.address().port+(process.env.SEMANTROPIC_PLAYTEST_PATH||"/official/src/live/");
const dir="artifacts/u04-hd-browser";await mkdir(dir,{recursive:true});
let browser;const results=[];
try{
 browser=await chromium.launch({headless:true,args:["--use-gl=angle","--use-angle=swiftshader","--enable-webgl","--enable-unsafe-swiftshader"]});
 for(const [label,width,height] of [["desktop",1280,768],["android844",844,390],["android932",932,430]]){
  for(const [level,socket] of [[1,0],[2,2]]){
   const page=await browser.newPage({viewport:{width,height},hasTouch:width<1000,isMobile:width<1000});
   const errors=[];page.on("pageerror",e=>errors.push(e.message));
   const response=await page.goto(url,{waitUntil:"load",timeout:30000});
   if(response?.status()!==200)throw Error("HTTP "+response?.status());
   await page.waitForFunction(()=>!!window.__SEMANTROPIC_C1D7?.scene,null,{timeout:45000});
   const info=await page.evaluate(async({level,socket})=>{
    const a=window.__SEMANTROPIC_C1D7,s=a.scene,w=a.world;
    if(!(s.game.renderer.gl instanceof WebGL2RenderingContext))throw Error("Not Phaser WebGL2");
    const old={};
    for(const kind of ["infantry_recruit","infantry_veteran"]){
     const art=(await import("/official/src/actors-visual/p08/p08-loader.mjs")).P08_IMAGES.find(a=>a.actorId===kind);
     const hdKey=s.u04AllyHD.get(art.atlasKey);
     const src=s.textures.get(art.atlasKey),hd=s.textures.get(hdKey);
     if(!hd||hd.get("idle-0").width!==352||hd.get("idle-0").height!==416)
      throw Error("Ally "+kind+" not 2x");
     if(src.get("idle-0").width!==176)throw Error("P08 original modified");
     old[kind]={sourceFrame:176,hdFrame:352,sourceKey:art.atlasKey,hdKey};
    }
    if(!w.economy.build(socket,"sniper").ok)throw Error("Sniper build");
    if(level===2&&!w.economy.upgrade(socket).ok)throw Error("Sniper II upgrade");
    w.syncTowers();s.drawTowers();
    const mount=[...s.towerMounts.values()].find(m=>m.operatorPrimary);
    if(!mount)throw Error("No approved sniper");
    const m=mount.meta;
    if(mount.sprite.width!==1080||mount.sprite.height!==1260)throw Error("Sniper structure not 2x");
    if(mount.frontRail.width!==1080)throw Error("Front rail not 3x");
    if(Math.abs(mount.sprite.displayWidth-m.sourceSize.widthPx*m.worldScaleProposal)>.05)
      throw Error("Tower art geometry changed");
    if(mount.operator.width!==352||mount.operator.height!==416)throw Error("P03 not 2x");
    const expected={x:mount.sprite.x+(m.operatorAnchorLocal.x-360*m.footAnchor.x)*m.worldScaleProposal,
      y:mount.sprite.y+(m.operatorAnchorLocal.y-420*m.footAnchor.y)*m.worldScaleProposal};
    if(Math.hypot(mount.operator.x-expected.x,mount.operator.y-expected.y)>.05)
      throw Error("Operator moved on platform");
    const mod=await import("/official/src/towers-visual/t10/p03-operator-rifle-muzzle.mjs");
    const muzzle=mod.projectP03RifleMuzzle(mount.operator,{state:"idle",frame:0});
    if(!Number.isFinite(muzzle.x)||!Number.isFinite(muzzle.y))throw Error("P03 gun muzzle invalid");
    return {level,tower:{texture:[mount.sprite.width,mount.sprite.height],display:[mount.sprite.displayWidth,mount.sprite.displayHeight]},
      sniper:{texture:[mount.operator.width,mount.operator.height],scale:mount.operator.scaleX,originalAnchorError:Math.hypot(mount.operator.x-expected.x,mount.operator.y-expected.y),muzzle},
      allies:old,protectedGameplay:true};
   },{level,socket});
   await page.screenshot({path:dir+"/"+label+"-L"+level+"-HD.png",fullPage:true});
   if(errors.length)throw Error(errors.join(" | "));
   results.push({label,width,height,...info});await page.close();
  }
 }
 console.log(JSON.stringify({status:"PASS_U04_HD_F1_F2_CHROMIUM_WEBGL2",cases:results.length,
   results,physicalAndroid:"PENDING",artisticApproval:"PENDING"},null,2));
}catch(e){console.error("FAIL_U04_HD",e.stack||String(e));process.exitCode=1}
finally{await browser?.close();await new Promise(ok=>server.close(ok))}