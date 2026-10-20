/**
 * MAPAS M07 / Node >=20 ESM QA with real M03 & M07 sources and Phaser/Canvas test doubles.
 * Run from project root: node public/official/src/maps-visual/m01/m07/qa-m07.mjs [optional-approved-PNG]
 * This does not render actual Chromium pixels or play C1-D4 combat.
 */
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {validateM01,visualSocketPreview} from "../renderer.mjs";
import {M03_PALETTES,makeM03ArtPlan,M03_PAD_SOURCE} from "../m03/renderer-v3.mjs";
import {
 M07_SOURCE,M07_WORLD,M07_TREATMENTS,M07_CANONICAL_PALETTE,
 makeM07ArtPlan,preloadM07Illustrations,mountM01WorldV7
} from "./renderer-v7.mjs";
const source=new URL("../../../../data/maps.v5.json",import.meta.url);
const raw=readFileSync(source),sha=createHash("sha256").update(raw).digest("hex"),maps=JSON.parse(raw),map=maps[0];
const original=JSON.stringify({path:map.path,spots:map.spots});
assert.equal(maps.length,10);
validateM01(map);
assert.equal(map.path.length,133);
assert.equal(map.spots.length,8);
assert.deepEqual(map.path[0],[-32,342]);
assert.deepEqual(map.path.at(-1),[1312,400]);
assert.deepEqual(M07_WORLD,{width:1280,height:768,pathVertices:133,sockets:8,roadWidth:110,hitRadiusWorld:54});
assert.equal(M07_CANONICAL_PALETTE,"viva","C1C historical scene uses Viva");
assert.equal(M07_SOURCE.palette,"viva");
assert.equal(M07_SOURCE.screenshotSha256,"24103e45a0e1249fa4b89d4e65ea16d9e147bdf1e2462e5c4063469a931842ef");
assert.deepEqual(M07_SOURCE.screenshotDimensions,[1280,768]);
assert.deepEqual(M07_TREATMENTS,["fiel","pulido"]);
assert.ok(M03_PALETTES.includes(M07_CANONICAL_PALETTE));
assert.equal(M03_PAD_SOURCE.approxWorldWidth,110.24);
const before=makeM03ArtPlan(map),after=makeM07ArtPlan(map);
assert.deepEqual(after.canonicalRoute,before.canonicalPath,"no waypoint changes");
assert.deepEqual(after.sockets.map(s=>s.socketId),before.sockets.map(s=>s.socketId));
assert.deepEqual(after.props.map(p=>p.id),before.illustrations.map(p=>p.id),"no asset adds/replacements");
assert.equal(after.props.length,13);
assert.equal(after.props.filter(p=>p.type==="oak").length,7);
assert.ok(after.props.every((p,i)=>p.world.x===before.illustrations[i].x&&p.world.y===before.illustrations[i].y));
assert.equal(new Set(after.props.map(p=>p.id)).size,13);
assert.deepEqual(visualSocketPreview(map).map(s=>[s.world.x,s.world.y]),[
 [96,480],[416,480],[672,544],[736,352],[992,224],[992,544],[1120,608],[1184,352]
]);
assert.ok(after.disabledDivergences.some(x=>x.includes("M06 painterly")));
const screenshot=process.argv[2];
let pngStatus="NOT_PROVIDED";
if(screenshot){
 const bytes=readFileSync(screenshot),digest=createHash("sha256").update(bytes).digest("hex");
 assert.equal(digest,M07_SOURCE.screenshotSha256,"reference MUST be original approved C1C image");
 pngStatus="PASS_EXACT_BINARY_SHA256";
}
const grad=()=>({addColorStop(){}});
const ctx=new Proxy({},{
 get(o,k){if(k==="createLinearGradient"||k==="createRadialGradient")return grad;if(!(k in o))o[k]=()=>{};return o[k];},
 set(o,k,v){o[k]=v;return true;}
});
globalThis.document={createElement(kind){assert.equal(kind,"canvas");return{width:0,height:0,getContext(which){assert.equal(which,"2d");return ctx;}};}};
const tex=new Map();
const stub=()=>{
 let dead=false;
 return{
  setOrigin(){return this},setDisplaySize(){return this},setScale(){return this},setDepth(){return this},
  setAlpha(){return this},setStrokeStyle(){return this},setVisible(value){this.visible=value;return this},
  setTexture(k){assert.ok(tex.has(k),"missing texture "+k);return this},
  clear(){return this},lineStyle(){return this},beginPath(){return this},moveTo(){return this},
  lineTo(){return this},strokePath(){return this},strokeCircle(){return this},
  fillStyle(){return this},fillCircle(){return this},
  destroy(){dead=true},get destroyed(){return dead;}
 };
};
const scene={
 textures:{exists:k=>tex.has(k),remove:k=>tex.delete(k),addCanvas:(k,el)=>{
   assert.ok(!tex.has(k));tex.set(k,{kind:"canvas",size:[el.width,el.height]});
 }},
 load:{svg:(k,url)=>{assert.ok(url.endsWith(".svg"));tex.set(k,{kind:"svg",url})}},
 add:{
  image:(x,y,key)=>{assert.ok(tex.has(key),"unresolved resource "+key);return stub()},
  ellipse:()=>stub(),graphics:()=>stub()
 }
};
preloadM07Illustrations(scene);
assert.equal([...tex.values()].filter(x=>x.kind==="svg").length,9,
 "M07 MUST load original M02/M03 resources only (not the M06 48-SVG chain)");
const tests=[];
for(const treatment of M07_TREATMENTS){
 const view=mountM01WorldV7(scene,map,{treatment});
 assert.equal(view.palette,"viva");
 assert.equal(view.padObjects.length,8);
 assert.equal(view.propObjects.length,13);
 assert.equal(view.objects.length,treatment==="fiel"?53:54);
 assert.equal(view.presentationOnly,true);
 assert.equal(view.changesOriginalSilhouettes,false);
 assert.equal(view.gameplayImplemented,false);
 const keys=[...tex.keys()].filter(k=>k.startsWith("maps/m01/aurora-v3/viva/"));
 assert.equal(keys.length,11);
 const record={tick:89,selectedSocketId:"m01-pad-01",sockets:
  after.sockets.map((s,i)=>({socketId:s.socketId,occupied:i===0||i===2,ruined:i===4}))};
 const recordBefore=JSON.stringify(record);
 assert.equal(view.applyVisualSnapshot(record),true);
 assert.equal(JSON.stringify(record),recordBefore,"snapshot must not be mutated");
 assert.equal(view.padObjects[0].visualState,"occupied","selection cannot erase occupied base");
 assert.equal(view.padObjects[0].selection.visible,true,"selected occupied pad must retain indicator");
 assert.equal(view.projectEvent({type:"tower_sold",socketId:"m01-pad-01",tick:88}).reason,"snapshot-authoritative");
 assert.equal(view.setSocketVisualState("m01-pad-01","selected"),true);
 assert.equal(view.padObjects[0].visualState,"occupied","selection may never empty an occupied pad");
 const v={type:"tower_built",socketId:"m01-pad-02",eventId:"c1d4-a",tick:90};
 assert.equal(view.projectEvent(v).consumed,true);
 assert.equal(view.projectEvent(v).reason,"duplicate-visual");
 assert.equal(view.projectEvent({type:"tower_sold",socketId:"m01-pad-01",tick:91,eventId:"sold-91"}).consumed,true);
 assert.equal(view.projectEvent({type:"tower_built",socketId:"m01-pad-01",tick:90,eventId:"old-90"}).consumed,false);
 assert.equal(view.applyVisualSnapshot({tick:90,sockets:record.sockets}),false,"stale snapshot cannot revive sold pad");
 view.updateDebug({showRoute:true,showClearance:true});
 assert.equal(view.resetVisuals(),true);
 assert.equal(view.padObjects[0].visualState,"neutral");
 const own=[...view.objects];view.destroy();view.destroy();
 assert.ok(own.every(o=>o.destroyed));
 assert.equal([...tex.keys()].filter(k=>k.includes("/aurora-v3/viva/")).length,11,"M03 shared historical cache must be bounded & retained");
 assert.equal([...tex.keys()].filter(k=>k.includes("/m07/viva/")).length,0,"Optional M07 polish texture must be released");
 tests.push({treatment,objects:own.length,props:13,pads:8,cleanup:"PASS"});
}
// Two concurrent M07 owners: a global M03 texture must outlive destruction of the first.
for(const treatment of M07_TREATMENTS){
 const first=mountM01WorldV7(scene,map,{treatment});
 const second=mountM01WorldV7(scene,map,{treatment});
 const pathKey="maps/m01/aurora-v3/viva/road";
 const polishKey="maps/m01/continuidad-c1c/m07/viva/grass-minimal";
 first.destroy();
 assert.equal(tex.has(pathKey),true);
 if(treatment==="pulido")assert.equal(tex.has(polishKey),true);
 second.destroy();
 assert.equal(tex.has(pathKey),true,"Do not delete historical M03 textures that foreign scenes can consume");
 if(treatment==="pulido")assert.equal(tex.has(polishKey),false);
}
assert.equal(tex.size,20,"Fixed shared cache: 9 M02/M03 SVG + 11 historical M03 generated textures");
assert.equal(JSON.stringify({path:map.path,spots:map.spots}),original);
assert.equal(createHash("sha256").update(readFileSync(source)).digest("hex"),sha);
console.log(JSON.stringify({
 status:"PASS",environment:"NODE_ESM_REAL_MODULES_WITH_CANVAS_AND_PHASER_TEST_DOUBLES_NOT_CHROMIUM",
 screenshotBinarySha256Check:pngStatus,world:[1280,768],routeVertices:133,sockets:8,
 M03VisualResources:9,M03HistoricalCanvasKeysBounded:11,M03Props:13,M03Oaks:7,
 variants:tests,referencePhotoHash:M07_SOURCE.screenshotSha256,
 notRun:["Real WebGL2 same-frame screenshot","C1-D4 with T/P and real combat","physical iOS/Android QA","GPU FPS"]
},null,2));
