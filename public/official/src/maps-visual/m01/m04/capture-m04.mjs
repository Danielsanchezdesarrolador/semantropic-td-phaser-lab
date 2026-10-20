/** Q2 M04 Chromium captures — REAL actual Phaser WebGL2, never synthesize output.
 * Requires local static HTTP server rooted at ./public, Playwright and Chromium.
 * node public/official/src/maps-visual/m01/m04/capture-m04.mjs http://127.0.0.1:8080
 * No browser tooling available? Exit with NOT_RUN and no fake screenshots.
 */
import {mkdir,writeFile} from "node:fs/promises";
import {resolve} from "node:path";
const base=(process.argv[2]||"http://127.0.0.1:8080").replace(/\/$/,"");
const path=base+"/official/art/maps/m01/m04/index.html";
const output=resolve("docs/art/maps/evidencias/M04");
let chromium;
try{({chromium}=await import("playwright"));}
catch(e){console.error("NOT_RUN: npm Playwright unavailable; authorized Integrator QA must install it.");process.exit(2);}
await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,args:["--use-gl=angle","--use-angle=swiftshader","--enable-webgl","--ignore-gpu-blocklist"]});
const shots=[];
const viewports=[{width:1280,height:768},{width:844,height:390},{width:932,height:430}];
try{
 for(const viewport of viewports)for(const variant of ["m03","equilibrada","viva","atmosferica"]){
  const context=await browser.newContext({viewport,deviceScaleFactor:1});
  const page=await context.newPage();
  const logs=[];
  page.on("pageerror",e=>logs.push("PAGEERROR: "+e.message));
  page.on("response",r=>{if(r.status()>=400)logs.push("HTTP "+r.status()+" "+r.url())});
  const url=path+"?variant="+encodeURIComponent(variant);
  await page.goto(url,{waitUntil:"networkidle",timeout:60000});
  await page.locator("#blocker").waitFor({state:"hidden",timeout:30000});
  const runtime=await page.locator("#engine").textContent();
  if(!/WebGL2 real/.test(runtime||""))throw Error("No verified WebGL2: "+url+" / "+runtime);
  if(logs.length)throw Error("Browser errors "+url+": "+logs.join("; "));
  const filename=variant+"_"+viewport.width+"x"+viewport.height+"_PHASER-REAL.png";
  await page.screenshot({path:resolve(output,filename),animations:"disabled"});
  shots.push({path:"docs/art/maps/evidencias/M04/"+filename,viewport,variant,
   captureType:"real-runtime",renderer:runtime,url,
   environment:"Chromium/SwiftShader emulated landscape viewport, NOT physical smartphone"});
  await context.close();
 }
 await writeFile(resolve(output,"capture-index.json"),JSON.stringify({
  schema:"m04-capture-index-v1",generatedAt:new Date().toISOString(),
  browser:"Chromium/SwiftShader WebGL2",physicalDevice:false,screenshots:shots
 },null,2)+"\n");
 console.log(JSON.stringify({status:"PASS_REAL_CHROMIUM_ONLY",count:shots.length,captureIndex:resolve(output,"capture-index.json")},null,2));
}finally{await browser.close();}
