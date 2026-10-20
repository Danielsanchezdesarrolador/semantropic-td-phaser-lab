/**
 * MAPAS M07-Q2 — real Chromium WebGL2 browser/perf/screenshot collector.
 * Run after CHECKING OUT THIS BRANCH and serving public/ over HTTP:
 *   node public/official/src/maps-visual/m01/m07/capture-m07-q2.mjs http://127.0.0.1:8080
 * Optional baseline branch served separately: BEFORE_BASE=http://127.0.0.1:8081
 * Requires Playwright/Chromium. Missing provider exits nonzero with NOT_RUN.
 * C1-D5 real combat is NOT implemented here; 13/63 are synthetic display fixtures.
 */
import {mkdir,writeFile,readFile} from "node:fs/promises";
import {createHash} from "node:crypto";
import {resolve} from "node:path";
import {performance} from "node:perf_hooks";
const base=(process.argv[2]||"http://127.0.0.1:8080").replace(/\/$/,"");
const target="/official/art/maps/m01/m07/index.html?mode=fiel&qa=1";
const output=resolve("docs/art/maps/evidencias/M07-Q2");
const beforeBase=(process.env.BEFORE_BASE||"").replace(/\/$/,"");
let chromium;
try{({chromium}=await import("playwright"));}
catch(err){console.error("NOT_RUN: playwright/Chromium unavailable; no frame data or screenshots generated.");process.exit(2);}
const sizeList=[{width:1280,height:768},{width:844,height:390},{width:932,height:430}];
const runs=[],baselineStaticCaptures=[];
await mkdir(output,{recursive:true});
const browser=await chromium.launch({
 headless:true,args:["--use-gl=angle","--use-angle=swiftshader","--enable-webgl","--ignore-gpu-blocklist"]
});
const quantile=(values,q)=>{const a=[...values].sort((x,y)=>x-y);return a[Math.min(a.length-1,Math.max(0,Math.ceil(a.length*q)-1))];};
try{
 for(const viewport of sizeList){
  for(const source of [{label:"q2",url:base},...(beforeBase?[{label:"original-m07",url:beforeBase}]:[])]){
   const context=await browser.newContext({viewport,deviceScaleFactor:1});
   const page=await context.newPage(),errors=[];
   page.on("pageerror",e=>errors.push("JS "+e.message));
   page.on("response",r=>{if(r.status()>=400)errors.push("HTTP "+r.status()+" "+r.url())});
   const started=performance.now();
   await page.goto(source.url+target,{waitUntil:"networkidle",timeout:60000});
   await page.locator("#blocker").waitFor({state:"hidden",timeout:30000});
   const hasHooks=await page.evaluate(()=>Boolean(window.__SEMANTROPIC_MAPAS_M07_Q2_QA__));
   if(!hasHooks&&source.label==="original-m07"){
    // Prior M07 has no Q2 diagnostic hook: preserve an ACTUAL screenshot,
    // but NEVER invent synthetic density, frame stats, or texture counts.
    const filename="original-m07_"+viewport.width+"x"+viewport.height+"_map-only-REAL.png";
    const absolute=resolve(output,filename);
    await page.screenshot({path:absolute,animations:"disabled"});
    baselineStaticCaptures.push({source:"original-m07",viewport,density:0,
     status:"PASS_REAL_BASELINE_IMAGE_ONLY_METRICS_NOT_RUN",
     screenshot:"docs/art/maps/evidencias/M07-Q2/"+filename,
     screenshotSha256:createHash("sha256").update(await readFile(absolute)).digest("hex")});
    await context.close();continue;
   }
   if(!hasHooks)throw Error("M07-Q2 QA hooks unavailable on "+source.label);
   await page.waitForFunction(()=>window.__SEMANTROPIC_MAPAS_M07_Q2_QA__?.metrics?.()?.webgl2Real===true,null,{timeout:30000});
   const readyMs=performance.now()-started;
   for(const density of [0,13,63]){
    const data=await page.evaluate(async count=>{
     const api=window.__SEMANTROPIC_MAPAS_M07_Q2_QA__;
     if(!api)throw Error("M07 Q2 QA interface not exposed");
     api.setSyntheticDensity(count);
     // Real frames, same camera, no altered renderer/game rules.
     const deltas=[],frames=121;let last=null;
     for(let i=0;i<frames;i++){
      const t=await new Promise(resolve=>requestAnimationFrame(resolve));
      if(last!==null)deltas.push(t-last);last=t;
     }
     return {deltas,metrics:api.metrics()};
    },density);
    if(errors.length)throw Error("Browser failed: "+errors.join("; "));
    if(data.metrics.map?.canonicalPads!==8||data.metrics.map?.originalProps!==13)
     throw Error("Canonical M07 map object count failed "+JSON.stringify(data.metrics.map));
    if(data.metrics.map.additionalPolishTextures!==0)
     throw Error("Fiel treatment loaded forbidden polish canvas");
    const fname=source.label+"_"+viewport.width+"x"+viewport.height+"_density-"+density+"-synthetic.png";
    const absolute=resolve(output,fname);
    await page.screenshot({path:absolute,animations:"disabled"});
    const sha256=createHash("sha256").update(await readFile(absolute)).digest("hex");
    runs.push({
     source:source.label,viewport,syntheticVisualActors:density,
     realCoreActors:0,realCoreSpawns:0,frameSample:120,
     frameTimeMsP50:+quantile(data.deltas,.5).toFixed(3),
     frameTimeMsP95:+quantile(data.deltas,.95).toFixed(3),
     initMs:+readyMs.toFixed(2),
     rendererWebGL2:data.metrics.webgl2Real,
     glVersion:data.metrics.glVersion,glRenderer:data.metrics.glRenderer,
     displayObjects:data.metrics.sceneDisplayObjects,
     textureManagerKeys:data.metrics.textureManagerTotalKeys,
     originalM03CanvasKeys:data.metrics.map.originalM03GeneratedTexturesPresent,
     inheritedSvgExpected:data.metrics.map.preloadedSvgKeysExpected,
     additionalPolishTextures:data.metrics.map.additionalPolishTextures,
     gpuMemoryMiB:null,drawCalls:null,physicalDevice:false,
     note:"Chromium SwiftShader/headless emulation, real RAF data; 63 markers are SYNTHETIC, not combat waves",
     screenshot:"docs/art/maps/evidencias/M07-Q2/"+fname,
     screenshotSha256:sha256
    });
    console.log("REAL_CHROMIUM_WEBGL2_QA",source.label,viewport.width,viewport.height,density,sha256);
   }
   await context.close();
  }
 }
 const originalPresent=runs.some(x=>x.source==="original-m07");
 const compare=originalPresent?runs.filter(x=>x.source==="q2").map(after=>{
  const before=runs.find(x=>x.source==="original-m07"&&x.viewport.width===after.viewport.width&&x.syntheticVisualActors===after.syntheticVisualActors);
  return {viewport:after.viewport,syntheticVisualActors:after.syntheticVisualActors,
   deltaFrameP50Ms:+(after.frameTimeMsP50-before.frameTimeMsP50).toFixed(3),
   deltaFrameP95Ms:+(after.frameTimeMsP95-before.frameTimeMsP95).toFixed(3),
   caveat:"SwiftShader emulated browser variation; not direct mobile physical benchmark"};
 }):[];
 const summary={
  status:"PASS_REAL_CHROMIUM_WEBGL2_MAP_ONLY",generatedAt:new Date().toISOString(),
  browser:"Chromium headless with SwiftShader WebGL2",physicalAndroidOrIPhone:false,
  genuineCoreCombat:false,expectedWaves:5,expectedCumulativeSpawns:63,
  sourceBeforeAvailable:originalPresent||baselineStaticCaptures.length>0,
  baselineStaticCaptures,
  baselineResult:originalPresent?"M07_FIEL_WITH_REAL_PERF_METRICS":baselineStaticCaptures.length?"M07_FIEL_REAL_IMAGES_ONLY_PERF_NOT_RUN":"NOT_RUN_NO_BEFORE_BASE",
  snapshots:runs.length+baselineStaticCaptures.length,renderPerf:runs,comparisons:compare,
  integrationBlocked:"C1-D5 real 5 waves, hit/death/escape/economy HUD belong exclusively to Integrator; no such actions are asserted"
 };
 await writeFile(resolve(output,"PERF_CHROMIUM_M07_Q2.json"),JSON.stringify(summary,null,2)+"\n");
 console.log(JSON.stringify({status:summary.status,runs:runs.length,baseline:summary.baselineResult},null,2));
}finally{await browser.close();}
