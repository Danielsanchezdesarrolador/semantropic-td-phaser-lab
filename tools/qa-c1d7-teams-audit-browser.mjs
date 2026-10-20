import {createServer} from "node:http";
import {readFile,stat,mkdir} from "node:fs/promises";
import {resolve,join,extname,sep} from "node:path";
import {chromium} from "playwright";
const ROOT=resolve("dist"),mime={".html":"text/html;charset=utf-8",".js":"text/javascript;charset=utf-8",
 ".mjs":"text/javascript;charset=utf-8",".json":"application/json",".png":"image/png",".svg":"image/svg+xml",".css":"text/css"};
const server=createServer(async(req,res)=>{try{
 const u=new URL(req.url,"http://localhost"),p=resolve(ROOT,"."+decodeURIComponent(u.pathname));
 if(p!==ROOT&&!p.startsWith(ROOT+sep))throw Error("forbidden");
 const resolved=(await stat(p)).isDirectory()?join(p,"index.html"):p;
 res.writeHead(200,{"Content-Type":mime[extname(resolved)]||"application/octet-stream"});
 res.end(await readFile(resolved));
}catch(e){res.writeHead(404);res.end("missing "+String(e))}});
await new Promise(ok=>server.listen(0,"127.0.0.1",ok));
const host="http://127.0.0.1:"+server.address().port,dir="artifacts/c1d7-team-audit";
await mkdir(dir,{recursive:true});let browser;
const outcomes=[];
try{
 browser=await chromium.launch({headless:true,args:[
  "--use-gl=angle","--use-angle=swiftshader","--enable-webgl","--enable-unsafe-swiftshader"]});
 for(const team of ["p08","t09"]){
  const path=team==="p08"?"/official/src/actors-visual/p08/index.html":
   "/official/src/towers-visual/t09/index.html";
  for(const [w,h] of [[1280,768],[844,390],[932,430]]){
   const page=await browser.newPage({viewport:{width:w,height:h},isMobile:w<1000,hasTouch:w<1000});
   const errors=[];page.on("pageerror",e=>errors.push(e.message));
   const response=await page.goto(host+path,{waitUntil:"load",timeout:30000});
   if(response?.status()!==200)throw Error(team+" "+w+" HTTP "+response?.status());
   await page.waitForFunction((k)=>k==="p08"?!!window.__SEMANTROPIC_P08?.scene:
    !!window.__SEMANTROPIC_T09,k=team,{timeout:40000});
   const state=await page.evaluate(team=>{
    if(team==="p08"){
     const s=window.__SEMANTROPIC_P08.scene;
     return {type:"P08",gl2:s.game.renderer.gl instanceof WebGL2RenderingContext,
      version:Phaser.VERSION,actors:s.views.length,
      veterans:s.views.filter(v=>v.item.id==="infantry_veteran").length,
      allAtlas:s.views.every(v=>s.textures.get(v.sprite.texture.key).has("attack-2"))};
    }
    return {...window.__SEMANTROPIC_T09.getVisualState(),type:"T09",version:Phaser.VERSION};
   },team);
   if(state.version!=="4.2.1")throw Error("Wrong Phaser version "+JSON.stringify(state));
   if(team==="p08"&&(!state.gl2||state.actors!==5||state.veterans!==2||!state.allAtlas))
    throw Error("P08 invalid art gallery "+JSON.stringify(state));
   if(team==="t09"&&state.status!=="COMPONENT_DEMO_NOT_GAMEPLAY")
    throw Error("T09 showcase invalid "+JSON.stringify(state));
   if(team==="p08"){
    for(const phase of ["idle","attackWindup","attack"]){
     await page.locator('[data-state="'+phase+'"]').click();await page.waitForTimeout(100);
     await page.screenshot({path:dir+"/"+team+"-"+w+"x"+h+"-"+phase+".png"});
    }
   }else{
    await page.screenshot({path:dir+"/"+team+"-"+w+"x"+h+"-showcase.png"});
    await page.locator("#low").click();
    await page.screenshot({path:dir+"/"+team+"-"+w+"x"+h+"-insufficient-gold.png"});
   }
   if(errors.length)throw Error(team+" "+w+" JS error: "+errors.join("|"));
   outcomes.push({team,viewport:w+"x"+h,status:"PASS_COMPONENT_BROWSER",meta:state});
   await page.close();
  }
 }
 console.log(JSON.stringify({status:"PASS_TEAM_SOURCE_GALLERY_CHROMIUM",outcomes,note:"NOT integrated gameplay/physical phone"},null,2));
}catch(e){console.error("TEAM_AUDIT_BROWSER_FAIL",e.stack||String(e));process.exitCode=1}
finally{await browser?.close();await new Promise(ok=>server.close(ok))}
