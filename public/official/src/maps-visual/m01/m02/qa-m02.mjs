/** M-02 art-only Node 20+ QA. Run from repository root:
 *   node public/official/src/maps-visual/m01/m02/qa-m02.mjs
 * Verifies authoritative data & visual modules with a simulated Canvas/Phaser
 * interface. Does NOT claim a real WebGL2 screenshot.
 */
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateM01,mountM01World,visualSocketPreview} from "../renderer.mjs";
import {
 M02_PALETTES,M02_WORLD,M02_ROAD_WIDTH,M02_SVGS,
 makeM02ArtPlan,preloadM02Illustrations,mountM01WorldV2,tonalGuide
} from "./renderer-v2.mjs";

const file=new URL("../../../../data/maps.v5.json",import.meta.url);
const maps=JSON.parse(readFileSync(file,"utf8")),map=maps[0];
const original=JSON.stringify({path:map.path,spots:map.spots});
validateM01(map);
assert.equal(map.path.length,133);assert.equal(map.spots.length,8);
assert.deepEqual(map.path[0],[-32,342]);assert.deepEqual(map.path.at(-1),[1312,400]);
assert.deepEqual(M02_WORLD,{width:1280,height:768});
assert.equal(M02_ROAD_WIDTH,110);
assert.equal(M02_PALETTES.length,3);
const svgDir=new URL("../../../../art/maps/m01/m02/svg/",import.meta.url);
for(const name of Object.values(M02_SVGS)){
 const svg=readFileSync(new URL(name,svgDir),"utf8");
 assert.match(svg,/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
 assert.match(svg,/<\/svg>/);
 assert.ok(svg.length>1700,"illustrated source unexpectedly small "+name);
}
const plan=makeM02ArtPlan(map);
const sockets=visualSocketPreview(map);
assert.equal(new Set(sockets.map(s=>s.socketId)).size,8);
assert.deepEqual(sockets.map(s=>[s.world.x,s.world.y]),[[96,480],[416,480],[672,544],[736,352],[992,224],[992,544],[1120,608],[1184,352]]);
assert.equal(plan.landmarks.length,3);
assert.ok(plan.illustrations.length>=16);
assert.equal(plan.canonicalRoute.length,133);
const guide=tonalGuide();
assert.equal(Object.keys(guide).length,3);
for(const v of M02_PALETTES)for(const material of ["grass","path","stone","wood","arcane"])
 assert.deepEqual(Object.keys(guide[v][material]),["dominant","light","shadow","edge","accent"]);

// Canvas2D mock runs actual JS scene generator but not the GPU renderer.
const grad=()=>({addColorStop(){}});
const ctx=new Proxy({},{
 get(o,key){if(key==="createLinearGradient"||key==="createRadialGradient")return grad;
   if(!(key in o))o[key]=()=>{};return o[key];},
 set(o,key,value){o[key]=value;return true;}
});
globalThis.document={createElement(name){
 assert.equal(name,"canvas");return{width:0,height:0,getContext(kind){assert.equal(kind,"2d");return ctx;}};
}};
const textureMap=new Map(),objects=[];
function mockObject(){
 let removed=false;return{
  setOrigin(){return this},setDisplaySize(){return this},setDepth(){return this},setScale(){return this},
  setAlpha(){return this},setVisible(){return this},clear(){return this},lineStyle(){return this},
  beginPath(){return this},moveTo(){return this},lineTo(){return this},strokePath(){return this},
  fillStyle(){return this},fillCircle(){return this},strokeCircle(){return this},
  destroy(){removed=true},get isRemoved(){return removed}
 };
}
const scene={
 textures:{
  exists:key=>textureMap.has(key),
  addCanvas:(key,img)=>{assert.ok(!textureMap.has(key));textureMap.set(key,{width:img.width,height:img.height,source:"generated"});},
  remove:key=>{textureMap.delete(key);}
 },
 add:{
  image:(x,y,key)=>{assert.ok(textureMap.has(key),"Missing texture "+key);const a=mockObject();objects.push(a);return a;},
  graphics:()=>{const a=mockObject();objects.push(a);return a;},
  circle:()=>{const a=mockObject();objects.push(a);return a;}
 },
 load:{svg:(key,file)=>{assert.match(file,/\.svg$/);textureMap.set(key,{source:"svg",width:null,height:null});}}
};
preloadM02Illustrations(scene);
assert.equal(Object.keys(M02_SVGS).length,7);
const output=[];
for(const palette of M02_PALETTES){
 const result=mountM01WorldV2(scene,map,{palette});
 assert.equal(result.padObjects.length,8);
 assert.ok(result.propObjects.length>=16);
 assert.equal(result.plan.canonicalRoute.length,133);
 assert.equal(result.plan.roadWidth,110);
 assert.equal(result.setSocketVisualState("m01-pad-01","selected"),true);
 assert.equal(result.setSocketVisualState("m01-pad-01","ruins"),true);
 result.updateDebug({showRoute:true,showClearance:true,showOcclusion:true});
 result.updateAmbient(.016);
 assert.deepEqual(textureMap.get("maps/m01/aurora-v2/"+palette+"/terrain"),{width:2560,height:1536,source:"generated"});
 assert.deepEqual(textureMap.get("maps/m01/aurora-v2/"+palette+"/path"),{width:2560,height:1536,source:"generated"});
 output.push({palette,pads:result.padObjects.length,illustrations:result.propObjects.length,objects:result.objects.length});
 const created=result.objects.slice();result.destroy();result.destroy();
 assert.ok(created.every(o=>o.isRemoved),"destroy must be idempotent and complete");
 assert.equal([...textureMap.keys()].filter(k=>k.includes("/"+palette+"/")).length,0,"generated textures should unload");
}
assert.equal(JSON.stringify({path:map.path,spots:map.spots}),original,"geometry mutated");
assert.equal(textureMap.size,7,"SVG assets cached exactly once");
console.log(JSON.stringify({status:"PASS",type:"STRUCTURAL_NODE_MOCK_NOT_BROWSER",world:M02_WORLD,routeVertices:133,sockets:8,svgAssets:7,variants:output,
 pending:["Real Phaser WebGL2 browser QA","Mobile visual QA 844x390 and 932x430","Director art approval","Integrator camera and layer mapping"]},null,2));