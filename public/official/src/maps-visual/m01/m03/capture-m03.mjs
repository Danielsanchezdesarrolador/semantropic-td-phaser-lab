/**
 * Equipo M - M03 screenshot collector (REAL browser only, never fake captures).
 * Prereqs: local HTTP server serving repo public/, Node 20+, Playwright + Chromium.
 * Invocation: node public/official/src/maps-visual/m01/m03/capture-m03.mjs http://localhost:8080
 * All output under docs/art/maps/evidencias/M03/. Requires authorized QA runner.
 */
import {mkdir,writeFile} from "node:fs/promises";
import {resolve} from "node:path";
const base=(process.argv[2]||"http://127.0.0.1:8080").replace(/\/$/,"");
const dir=resolve("docs/art/maps/evidencias/M03");
const uri=base+"/official/art/maps/m01/m03/index.html";
let pw;
try{pw=await import("playwright");}
catch(err){console.error("NOT_RUN: Playwright unavailable. Install it in QA environment; no screenshots generated.");process.exit(2);}
const browser=await pw.chromium.launch({headless:true,args:["--use-gl=angle","--use-angle=swiftshader","--enable-webgl","--ignore-gpu-blocklist"]});
await mkdir(dir,{recursive:true});
const variants={M01:"m01",M02:"m02",M03C:"equilibrada",M03V:"viva",M03A:"atmosferica"};
const sizes=[{width:1280,height:768},{width:844,height:390},{width:932,height:430}];
const index=[];
for(const size of sizes)for(const [tag,variant] of Object.entries(variants)){
 const context=await browser.newContext({viewport:size,deviceScaleFactor:1});
 const page=await context.newPage();
 const target=uri+"?variant="+encodeURIComponent(variant);
 await page.goto(target,{waitUntil:"networkidle",timeout:30000});
 await page.locator("#blocker").waitFor({state:"hidden",timeout:20000});
 const runtime=await page.locator("#engine").textContent();
 if(!/WebGL2 confirmado/.test(runtime||""))throw Error("WebGL2 NOT_VERIFIED "+target+" "+runtime);
 await page.waitForTimeout(250);
 const file=tag+"_"+size.width+"x"+size.height+"_real-chromium.png";
 await page.screenshot({path:resolve(dir,file),animations:"disabled"});
 index.push({path:"docs/art/maps/evidencias/M03/"+file,captureType:"real-runtime",viewport:size,renderer:runtime,url:target});
 console.log("CAPTURE_REAL_CHROMIUM",file,runtime);
 await context.close();
}
await browser.close();
await writeFile(resolve(dir,"capture-index.json"),JSON.stringify({schema:"m03-capture-index-v1",generatedAt:new Date().toISOString(),screenshots:index,hardware:"Chromium SwiftShader (NOT physical smartphone)",claim:"Actual browser capture only in executed environment"},null,2)+"\n");
console.log(JSON.stringify({status:"PASS_REAL_BROWSER_CAPTURE",count:index.length,output:dir},null,2));