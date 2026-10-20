/**
 * M03 Q2 Contract QA — run from repository root:
 * node public/official/src/maps-visual/m01/m03/qa-m03.mjs
 *
 * Tests actual ESM source in Node with a Canvas/Phaser MOCK, not physical GPU.
 */
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateM01,visualSocketPreview} from "../renderer.mjs";
import {
 M03_PALETTES,M03_VERSION,M03_ROAD_WIDTH,M03_PAD_SOURCE,M03_SVGS,
 preloadM03Illustrations,makeM03ArtPlan,mountM01WorldV3
} from "./renderer-v3.mjs";
const map=(JSON.parse(readFileSync(new URL("../../../../data/maps.v5.json",import.meta.url),"utf8")))[0];
validateM01(map);
const CANON=JSON.stringify({path:map.path,spots:map.spots});
assert.equal(map.path.length,133);
assert.equal(map.spots.length,8);
assert.deepEqual(map.path[0],[-32,342]);
assert.deepEqual(map.path.at(-1),[1312,400]);
assert.equal(M03_ROAD_WIDTH,110);
assert.equal(M03_PAD_SOURCE.width,212);
assert.equal(M03_PAD_SOURCE.scale,.26);
assert.ok(Math.abs(M03_PAD_SOURCE.width*M03_PAD_SOURCE.dpr*M03_PAD_SOURCE.scale-110.24)<1e-6);
const sockets=visualSocketPreview(map);
assert.deepEqual(sockets.map(s=>[s.world.x,s.world.y]),[
 [96,480],[416,480],[672,544],[736,352],[992,224],[992,544],[1120,608],[1184,352]
]);
assert.equal(new Set(sockets.map(s=>s.socketId)).size,8);
assert.ok(sockets.every(s=>s.interactiveRadiusWorld===54));
const plan=makeM03ArtPlan(map);
assert.equal(plan.landmarks.length,3);
assert.equal(plan.sockets.length,8);
assert.equal(plan.canonicalPath.length,133);
assert.ok(plan.illustrations.length>=15);
for(const name of Object.values(M03_SVGS)){
 const svg=readFileSync(new URL("../../../../art/maps/m01/m03/svg/"+name,import.meta.url),"utf8");
 assert.match(svg,/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
 assert.match(svg,/<\/svg>/);
}
// Strict clearances: illustration feet and measured aesthetic footprint outside
// both route and socket protected zones. These are layout tests, not collisions.
function distanceToRoute(x,y,route){
 let out=Infinity;
 for(let i=1;i<route.length;i++){
  const a=route[i-1],b=route[i],dx=b[0]-a[0],dy=b[1]-a[1],n=dx*dx+dy*dy;
  const t=n?Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/n)):0;
  out=Math.min(out,Math.hypot(x-a[0]-dx*t,y-a[1]-dy*t));
 }
 return out;
}
for(const p of plan.illustrations){
 const padDistance=Math.min(...sockets.map(s=>Math.hypot(p.x-s.world.x,p.y-s.world.y)));
 assert.ok(distanceToRoute(p.x,p.y,map.path)>66+p.radiusWorld,"route clearance "+p.id);
 assert.ok(padDistance>58+p.radiusWorld,"pad clearance "+p.id);
}
// Fake 2D target: traverse all paint functions, not evaluate actual appearance.
const gradient=()=>({addColorStop(){}});
const ctx=new Proxy({},{
 get(o,k){if(k==="createLinearGradient"||k==="createRadialGradient")return gradient;
  if(!(k in o))o[k]=()=>{};return o[k];},
 set(o,k,v){o[k]=v;return true;}
});
globalThis.document={createElement(tag){
 assert.equal(tag,"canvas");return{width:0,height:0,getContext(type){assert.equal(type,"2d");return ctx;}};
}};
const textures=new Map(),objects=[];
function sprite(){
 let dead=false;return{
  setOrigin(){return this},setDepth(){return this},setScale(){return this},setDisplaySize(){return this},
  setAlpha(){return this},setVisible(){return this},setStrokeStyle(){return this},setTexture(name){assert.ok(textures.has(name),"unresolved texture "+name);return this},
  clear(){return this},lineStyle(){return this},beginPath(){return this},moveTo(){return this},
  lineTo(){return this},strokePath(){return this},fillStyle(){return this},fillCircle(){return this},
  strokeCircle(){return this},destroy(){dead=true;},get destroyed(){return dead;}
 };
}
const scene={
 textures:{
  exists:key=>textures.has(key),
  addCanvas:(key,e)=>{assert.ok(!textures.has(key));textures.set(key,{width:e.width,height:e.height,type:"Canvas"});},
  remove:key=>textures.delete(key)
 },
 load:{svg:(key,url)=>{assert.ok(url.endsWith(".svg"));textures.set(key,{url,type:"SVG"});}},
 add:{
  image:(x,y,key)=>{assert.ok(textures.has(key),"missing "+key);const s=sprite();objects.push(s);return s;},
  graphics:()=>{const s=sprite();objects.push(s);return s;},
  ellipse:()=>{const s=sprite();objects.push(s);return s;}
 }
};
preloadM03Illustrations(scene);
assert.equal([...textures.values()].filter(v=>v.type==="SVG").length,9);
const results=[];
for(const palette of M03_PALETTES){
 const root=mountM01WorldV3(scene,map,{palette});
 assert.equal(root.padObjects.length,8);
 assert.equal(root.propObjects.length,plan.illustrations.length);
 assert.equal(root.layerGroups.pads.length,8);
 assert.equal(root.getPadMetrics().hitRadiusWorld,54);
 assert.equal(root.getPadMetrics().apparentWorldWidth,110.24);
 const first=root.padObjects[0].socket.socketId;
 assert.equal(root.setSocketVisualState(first,"occupied"),true);
 assert.equal(root.padObjects[0].visualState,"occupied");
 assert.equal(root.setSocketVisualState(first,"selected"),true);
 assert.equal(root.setSocketVisualState(first,"ruins"),true);
 assert.equal(root.setSocketVisualState("missing-pad","occupied"),false);
 root.updateDebug({showRoute:true,showClearance:true,selectedSocket:first,showOcclusion:true});
 const base="maps/m01/aurora-v3/"+palette+"/";
 for(const name of ["ground","road"])assert.deepEqual(textures.get(base+name),{width:2560,height:1536,type:"Canvas"});
 const used=root.objects.slice();
 results.push({palette,objects:root.objects.length,pads:root.padObjects.length,props:root.propObjects.length,textureCount:[...textures.keys()].filter(k=>k.startsWith(base)).length});
 root.destroy();root.destroy();
 assert.ok(used.every(x=>x.destroyed),"destroy failed");
 assert.equal([...textures.keys()].filter(k=>k.startsWith(base)).length,0,"orphan cached generated texture");
}
assert.equal(JSON.stringify({path:map.path,spots:map.spots}),CANON,"source data mutation");
assert.equal(textures.size,9,"borrowed SVG textures persist for shared resource lifecycle");
console.log(JSON.stringify({
 status:"PASS",evidence:"NODE_WITH_MOCKS_NOT_BROWSER",module:M03_VERSION,map:1,route:133,sockets:8,roadWidth:110,
 pad:{priorApprox:232*2*.58,currentApprox:110.24,reductionPercent:+((1-110.24/(232*2*.58))*100).toFixed(1),hitRadius:54},
 landmarks:3,props:plan.illustrations.length,palettes:results,
 pending:["PC real WebGL2 screenshot","844x390 and 932x430 emulated QA","Actual T03 pad/tower footprint ratio","Real actor occlusion","Director art approval"]
},null,2));
