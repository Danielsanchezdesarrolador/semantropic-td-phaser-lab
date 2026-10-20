/**
 * MAPAS M07 — authentic real browser/Phaser 4.2.1 WebGL2 screenshots.
 * Serve public/ from THIS checkout over HTTP.
 * Run: node public/official/src/maps-visual/m01/m07/capture-m07.mjs http://127.0.0.1:8080 [optional-original-C1C.png]
 * Requires Playwright and Chromium. No dependencies added to shared package.json.
 * If unavailable: NOT_RUN, nonzero exit, no fake screenshots.
 */
import {mkdir,writeFile,readFile,copyFile} from "node:fs/promises";
import {createHash} from "node:crypto";
import {resolve} from "node:path";
const base=(process.argv[2]||"http://127.0.0.1:8080").replace(/\/$/,"");
const optionalBefore=process.argv[3]||null;
const target=base+"/official/art/maps/m01/m07/index.html";
const output=resolve("docs/art/maps/evidencias/M07");
const expected="24103e45a0e1249fa4b89d4e65ea16d9e147bdf1e2462e5c4063469a931842ef";
let chromium;
try{({chromium}=await import("playwright"));}
catch(e){console.error("NOT_RUN: playwright/Chromium not available for real browser QA.");process.exit(2);}
await mkdir(output,{recursive:true});
let verifiedBefore=null;
if(optionalBefore){
 const data=await readFile(optionalBefore),sha=createHash("sha256").update(data).digest("hex");
 if(sha!==expected)throw Error("C1-C approved photo SHA256 mismatch; refuse altered baseline");
 const copy=resolve(output,"BEFORE_C1C_APPROVED_ORIGINAL_VERIFIED.png");
 await copyFile(optionalBefore,copy);
 verifiedBefore={path:"docs/art/maps/evidencias/M07/BEFORE_C1C_APPROVED_ORIGINAL_VERIFIED.png",sha256:sha,source:"original exact director PNG, NOT rendered or edited by M07"};
}
const browser=await chromium.launch({headless:true,args:["--use-gl=angle","--use-angle=swiftshader","--enable-webgl","--ignore-gpu-blocklist"]});
const records=[];
try{
 for(const viewport of [{width:1280,height:768},{width:844,height:390},{width:932,height:430}]){
  for(const mode of ["fiel","pulido"]){
   for(const markers of [0,13,24]){
    const context=await browser.newContext({viewport,deviceScaleFactor:1});
    const page=await context.newPage(),errors=[];
    page.on("pageerror",err=>errors.push("JS: "+err.message));
    page.on("response",r=>{if(r.status()>=400)errors.push("HTTP "+r.status()+" "+r.url())});
    const url=target+"?mode="+mode;
    await page.goto(url,{waitUntil:"networkidle",timeout:60000});
    await page.locator("#blocker").waitFor({state:"hidden",timeout:30000});
    const renderer=await page.locator("#runtime").textContent();
    if(!renderer?.includes("WebGL2 comprobado"))throw Error("WebGL2 not proven: "+renderer);
    const metrics=await page.locator("#runtimeCounts").textContent();
    if(!metrics?.includes("8 pads")||!metrics?.includes("13 props"))throw Error("Unexpected art objects "+metrics);
    if(markers===13)await page.locator("#markers").click();
    if(markers===24){await page.locator("#markers").click();await page.locator("#markers").click();}
    if(errors.length)throw Error("Browser errors: "+errors.join(" ; "));
    const file=mode+"_"+viewport.width+"x"+viewport.height+"_"+markers+"synthetic-PHASER-WEBGL2.png";
    await page.screenshot({path:resolve(output,file),animations:"disabled"});
    records.push({
     path:"docs/art/maps/evidencias/M07/"+file,
     mode,viewport,syntheticMarkers:markers,
     engine:renderer,evidenceType:"REAL_CHROMIUM_WEBGL2_MAP_ONLY",
     integratedCombat:false,physicalDevice:false,
     browser:"Chromium SwiftShader emulated viewport",url
    });
    await context.close();
   }
  }
 }
 const index={schema:"mapas-m07-capture-v1",generatedAt:new Date().toISOString(),commit:process.env.GITHUB_SHA||"UNVERIFIED_CURRENT_CHECKOUT",
  originalScreenshot:verifiedBefore,
  source:"M03 C1-C Viva selected by restored M07; no T/P/HUD/gameplay in this isolated viewer",
  screenshots:records};
 await writeFile(resolve(output,"capture-index.json"),JSON.stringify(index,null,2)+"\n");
 console.log(JSON.stringify({status:"PASS_REAL_BROWSER_MAP_ONLY",count:records.length,index:"docs/art/maps/evidencias/M07/capture-index.json"},null,2));
}finally{await browser.close();}
