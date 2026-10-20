/**
 * M06 true browser QA collector. Must serve public/ from actual branch via HTTP.
 * Run: node public/official/src/maps-visual/m01/m06/capture-m06.mjs http://127.0.0.1:8080
 * Playwright/Chromium absent -> NOT_RUN nonzero; never invent screenshot.
 */
import {mkdir,writeFile} from "node:fs/promises";
import {resolve} from "node:path";
const base=(process.argv[2]||"http://127.0.0.1:8080").replace(/\/$/,"");
const url=base+"/official/art/maps/m01/m06/index.html",output=resolve("docs/art/maps/evidencias/M06");
let chromium;
try{({chromium}=await import("playwright"));}
catch(err){console.error("NOT_RUN: Playwright unavailable; no screenshot captured.");process.exit(2);}
const browser=await chromium.launch({headless:true,args:["--use-gl=angle","--use-angle=swiftshader","--enable-webgl","--ignore-gpu-blocklist"]});
const shots=[];
await mkdir(output,{recursive:true});
try{
 for(const viewport of [{width:1280,height:768},{width:844,height:390},{width:932,height:430}]){
  for(const mode of ["m04","m05a","m05b","atmosfera","relieve"]){
   for(const density of [0,13,24]){
    if(density===24&&mode==="m04")continue;
    const context=await browser.newContext({viewport,deviceScaleFactor:1});
    const page=await context.newPage(),errors=[];
    page.on("pageerror",e=>errors.push("JS "+e.message));
    page.on("response",r=>{if(r.status()>=400)errors.push("HTTP "+r.status()+" "+r.url())});
    const target=url+"?mode="+mode+"&palette=equilibrada";
    await page.goto(target,{waitUntil:"networkidle",timeout:60000});
    await page.locator("#blocker").waitFor({state:"hidden",timeout:30000});
    const runtime=await page.locator("#engine").textContent();
    if(!/WebGL2 real/.test(runtime||""))throw Error("NOT_REAL_WEBGL2 "+target+" engine:"+runtime);
    if(density===13)await page.locator("#actorFixture").click();
    if(density===24){await page.locator("#actorFixture").click();await page.locator("#actorFixture").click();}
    if(errors.length)throw Error("BROWSER_ERRORS "+errors.join("; "));
    const file=mode+"-"+viewport.width+"x"+viewport.height+"-"+density+"synthetic-PHASER-REAL.png";
    await page.screenshot({path:resolve(output,file),animations:"disabled"});
    shots.push({path:"docs/art/maps/evidencias/M06/"+file,viewport,mode,syntheticActorMarkers:density,
     evidenceType:"GENUINE_CHROMIUM_WEBGL2_SCREENSHOT_OF_SYNTHETIC_VISUAL_FIXTURE",
     integratedCoreCombat:false,physicalDevice:false,renderer:runtime,url:target});
    console.log("CHROMIUM_CAPTURE",file);
    await context.close();
   }
  }
 }
 await writeFile(resolve(output,"capture-index.json"),JSON.stringify({
  schema:"m06-capture-index-v1",generatedAt:new Date().toISOString(),screenshots:shots,
  scope:"isolated M-team scene, NOT core C1-D2, NOT P/T actor/art integration",
  device:"Chromium SwiftShader viewport emulation, not iOS/Android hardware"},null,2)+"\n");
 console.log(JSON.stringify({status:"PASS_REAL_BROWSER_VIEW",count:shots.length,captureIndex:resolve(output,"capture-index.json")},null,2));
}finally{await browser.close();}
