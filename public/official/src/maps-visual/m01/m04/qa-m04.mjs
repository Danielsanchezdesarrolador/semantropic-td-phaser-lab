/** M04 / C1D — reproducible Node 20+ structural QA, not browser/WebGL2.
 * Run: node public/official/src/maps-visual/m01/m04/qa-m04.mjs
 * Exit non-zero for any geometry/source/asset/texture/cleanup regressions.
 */
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {validateM01,visualSocketPreview} from "../renderer.mjs";
import {
 M04_VERSION,M04_PALETTES,M04_ASSETS,M04_WORLD,M04_PAD,
 M04_GROUND_DPR,M04_ROAD_DPR,makeM04ArtPlan,preloadM04Illustrations,
 mountM01WorldV4
} from "./renderer-v4.mjs";
const url=new URL("../../../../data/maps.v5.json",import.meta.url);
const raw=readFileSync(url),hash=createHash("sha256").update(raw).digest("hex");
const maps=JSON.parse(raw),map=maps[0];
assert.equal(maps.length,10);
const frozen=JSON.stringify({path:map.path,spots:map.spots});
validateM01(map);
assert.equal(map.path.length,133);
assert.equal(map.spots.length,8);
assert.deepEqual(map.path[0],[-32,342]);
assert.deepEqual(map.path.at(-1),[1312,400]);
assert.equal(M04_WORLD.visualRoadWidth,110);
assert.equal(M04_WORLD.hitRadiusWorld,54);
assert.ok(Math.abs(M04_PAD.logical[0]*M04_PAD.dpr*M04_PAD.scale-110.24)<1e-8);
assert.deepEqual(M04_PALETTES,["equilibrada","viva","atmosferica"]);
assert.equal(M04_ASSETS.length,15);
assert.equal(new Set(M04_ASSETS).size,15);
for(const a of M04_ASSETS){
 const str=readFileSync(new URL("../../../../art/maps/m01/m04/svg/"+a+".svg",import.meta.url),"utf8");
 assert.ok(str.startsWith('<svg xmlns="http://www.w3.org/2000/svg"'),"bad SVG root: "+a);
 assert.ok(str.includes("</svg>"),"unterminated svg: "+a);
 assert.ok(str.length>=1300,"too small unexpected SVG: "+a);
 assert.ok(!/https?:\/\//.test(str.replace("http://www.w3.org/2000/svg","")),"external SVG resource: "+a);
}
const sheet=readFileSync(new URL("../../../../art/maps/m01/m04/M04_PLANCHA_12_PROPS.svg",import.meta.url),"utf8");
assert.ok(sheet.includes("BIBLIOTECA ILUSTRADA"));
const sockets=visualSocketPreview(map);
assert.deepEqual(sockets.map(s=>[s.world.x,s.world.y]),[[96,480],[416,480],[672,544],[736,352],[992,224],[992,544],[1120,608],[1184,352]]);
assert.ok(sockets.every(s=>s.interactiveRadiusWorld===54));
const plan=makeM04ArtPlan(map);
assert.equal(plan.canonicalRoute.length,133);
assert.equal(plan.props.length,20);
assert.equal(plan.landmarks.length,3);
assert.equal(plan.rejected.length,2);
assert.deepEqual(plan.landmarks.map(x=>x.type),["acueducto-guardia","santuario-refugio","puesto-alba"]);
const roadDist=(x,y,route)=>{
 let smallest=Infinity;
 for(let i=1;i<route.length;i++){
  const a=route[i-1],b=route[i],dx=b[0]-a[0],dy=b[1]-a[1],q=dx*dx+dy*dy;
  const t=q?Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/q)):0;
  smallest=Math.min(smallest,Math.hypot(x-a[0]-dx*t,y-a[1]-dy*t));
 }
 return smallest;
};
for(const p of plan.props){
 assert.ok(roadDist(p.x,p.y,map.path)>66+p.visualRadiusWorld,"route occlusion violation "+p.id);
 assert.ok(Math.min(...sockets.map(s=>Math.hypot(s.world.x-p.x,s.world.y-p.y)))>69+p.visualRadiusWorld,"pad occlusion violation "+p.id);
}
const grad=()=>({addColorStop(){}});
const ctx=new Proxy({},{
 get(o,k){if(k==="createLinearGradient"||k==="createRadialGradient")return grad;if(!(k in o))o[k]=()=>{};return o[k];},
 set(o,k,v){o[k]=v;return true;}
});
globalThis.document={createElement(type){
 assert.equal(type,"canvas");return{width:0,height:0,getContext(what){assert.equal(what,"2d");return ctx;}};
}};
const textures=new Map();
function stub(){
 let dead=false;
 return{
  setOrigin(){return this},setScale(){return this},setDepth(){return this},setDisplaySize(){return this},
  setVisible(){return this},setAlpha(){return this},setStrokeStyle(){return this},
  setTexture(key){assert.ok(textures.has(key),"setTexture missing "+key);return this},
  lineStyle(){return this},beginPath(){return this},moveTo(){return this},lineTo(){return this},
  strokePath(){return this},strokeCircle(){return this},fillStyle(){return this},fillCircle(){return this},
  clear(){return this},destroy(){dead=true;},get destroyed(){return dead;}
 };
}
const scene={
 textures:{
  exists:key=>textures.has(key),remove:key=>textures.delete(key),
  addCanvas:(key,e)=>{assert.ok(!textures.has(key));textures.set(key,{type:"canvas",width:e.width,height:e.height});}
 },load:{svg:(key,path)=>{assert.match(path,/\.svg$/);textures.set(key,{type:"svg",url:path});}},
 add:{
  image:(x,y,key)=>{assert.ok(textures.has(key),"image texture missing "+key);return stub();},
  ellipse:()=>stub(),graphics:()=>stub()
 }};
preloadM04Illustrations(scene);
assert.equal([...textures.values()].filter(v=>v.type==="svg").length,24);
const results=[];
for(const palette of M04_PALETTES){
 const result=mountM01WorldV4(scene,map,{palette});
 assert.equal(result.missing.length,0,"all 23 props need real registered image textures");
 assert.equal(result.padObjects.length,8);
 assert.equal(result.propObjects.length,23);
 assert.equal(result.objects.length,73);
 const first=result.padObjects[0].socket.socketId;
 for(const status of ["empty","occupied","selected","ruins","neutral"])
  assert.equal(result.setSocketVisualState(first,status),true);
 assert.equal(result.setSocketVisualState("not-a-socket","occupied"),false);
 result.updateDebug({showRoute:true,showClearance:true,showOcclusion:true,selectedSocket:first});
 const prefix="maps/m01/illustrated-m04/"+palette+"/";
 assert.deepEqual(textures.get(prefix+"ground"),{type:"canvas",width:1920,height:1152});
 assert.deepEqual(textures.get(prefix+"road"),{type:"canvas",width:2560,height:1536});
 assert.deepEqual(textures.get(prefix+"pad/tempo/occupied"),{type:"canvas",width:424,height:304});
 const created=[...result.objects];
 const count=[...textures.keys()].filter(k=>k.startsWith(prefix)).length;
 assert.equal(count,11,"11 generated textures: 2 terrain+road + 9 pad states");
 results.push({palette,objects:result.objects.length,props:result.propObjects.length,pads:result.padObjects.length,generatedTextureKeys:count});
 result.destroy();result.destroy();
 assert.ok(created.every(o=>o.destroyed),"destroy must remove every object");
 assert.equal([...textures.keys()].filter(k=>k.startsWith(prefix)).length,0,"orphan generated texture");
}
assert.equal(textures.size,24,"original reusable SVGs remain in shared cache");
assert.equal(JSON.stringify({path:map.path,spots:map.spots}),frozen,"canonical data mutated");
assert.equal(createHash("sha256").update(readFileSync(url)).digest("hex"),hash,"canonical map file changed");
const rgbaMiB=(1920*1152+2560*1536+9*424*304)*4/1048576;
console.log(JSON.stringify({
 status:"PASS",category:"NODE_WITH_CANVAS_PHASER_MOCKS_NOT_BROWSER",
 version:M04_VERSION,sourceMapsSha256:hash,allMaps:10,
 canonical:{pathVertices:133,spots:8,roadVisualWidth:110,hitRadiusWorld:54},
 art:{uniqueM04EditableSvg:15,props:20,redesignedLandmarks:3,rejectedForSafety:2,sheet:"M04_PLANCHA_12_PROPS.svg"},
 paletteTests:results,theoreticalUncompressedActivePaletteRGBA_MiB:+rgbaMiB.toFixed(2),
 pending:["Real browser WebGL2 snapshots","844x390 & 932x430 emulated touch review","Actual T04/P03 occlusion review","Art director acceptance","Smartphone hardware performance"]
},null,2));
