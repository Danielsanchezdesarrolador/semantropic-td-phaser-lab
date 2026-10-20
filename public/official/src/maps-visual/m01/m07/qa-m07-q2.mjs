/**
 * MAPAS M07-Q2 — Node >=20 source regression, REAL ES modules + MOCK Phaser Canvas.
 * Run: node public/official/src/maps-visual/m01/m07/qa-m07-q2.mjs
 * Uses source files checked out from this branch. No headless GPU or actual core.
 * Assertion failures exit 1. No tee wrappers masking nonzero status.
 */
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {performance} from "node:perf_hooks";
import {validateM01,visualSocketPreview} from "../renderer.mjs";
import {mountM01WorldV3,makeM03ArtPlan} from "../m03/renderer-v3.mjs";
import {makeM07ArtPlan,preloadM07Illustrations,mountM01WorldV7} from "./renderer-v7.mjs";
const raw=readFileSync(new URL("../../../../data/maps.v5.json",import.meta.url));
const maps=JSON.parse(raw),map=maps[0];
assert.equal(maps.length,10);
validateM01(map);
assert.equal(map.path.length,133);
assert.equal(map.spots.length,8);
const canonical=JSON.stringify({path:map.path,spots:map.spots});
const historical=makeM03ArtPlan(map),plan=makeM07ArtPlan(map);
assert.equal(plan.props.length,13);
assert.deepEqual(plan.props.map(p=>[p.id,p.world.x,p.world.y]),
 historical.illustrations.map(p=>[p.id,p.x,p.y]));
assert.deepEqual(plan.sockets.map(p=>p.socketId),
 visualSocketPreview(map).map(p=>p.socketId));
const gradient=()=>({addColorStop(){}});
const c=new Proxy({},{
 get(o,k){if(k==="createLinearGradient"||k==="createRadialGradient")return gradient;
  if(!(k in o))o[k]=()=>{};return o[k];},
 set(o,k,v){o[k]=v;return true;}
});
globalThis.document={createElement(type){assert.equal(type,"canvas");return{
 width:0,height:0,getContext(t){assert.equal(t,"2d");return c;}
}}};
const textures=new Map();
let textureCreated=0,textureRemoved=0,displayCreated=0,displayDestroyed=0;
function sprite(){
 displayCreated++;let dead=false;
 return{setOrigin(){return this},setDepth(){return this},setScale(){return this},
 setDisplaySize(){return this},setAlpha(){return this},setStrokeStyle(){return this},
 setVisible(v){this.visible=v;return this},setTexture(key){
  assert.ok(textures.has(key),"missing texture "+key);return this;},
 clear(){return this},lineStyle(){return this},beginPath(){return this},
 moveTo(){return this},lineTo(){return this},strokePath(){return this},
 strokeCircle(){return this},fillStyle(){return this},fillCircle(){return this},
 destroy(){if(!dead){dead=true;displayDestroyed++;}},
 get destroyed(){return dead;}}
}
const scene={
 textures:{exists:key=>textures.has(key),remove:key=>{
  if(textures.delete(key))textureRemoved++;
 },addCanvas:(key,el)=>{
  assert.ok(!textures.has(key),"duplicate canvas "+key);
  textures.set(key,{type:"canvas",width:el.width,height:el.height});textureCreated++;
 }},
 load:{svg:(key,uri)=>{assert.match(uri,/\.svg$/);textures.set(key,{type:"svg",uri});}},
 add:{image:(x,y,key)=>{assert.ok(textures.has(key),"missing sprite key "+key);return sprite()},
 ellipse:()=>sprite(),graphics:()=>sprite()}
};
preloadM07Illustrations(scene);
assert.equal(textures.size,9);
const cycles=50,mountDurationsMs=[],modes=["fiel","pulido"];
for(let i=0;i<cycles;i++){
 const mode=modes[i%2],start=performance.now();
 const world=mountM01WorldV7(scene,map,{treatment:mode});
 mountDurationsMs.push(performance.now()-start);
 assert.equal(world.padObjects.length,8);
 assert.equal(world.propObjects.length,13);
 assert.equal(world.objects.length,mode==="fiel"?53:54);
 const records=plan.sockets.map((s,n)=>({socketId:s.socketId,occupied:n%2===0}));
 assert.equal(world.applyVisualSnapshot({tick:20,sockets:records,selectedSocketId:records[0].socketId}),true);
 assert.equal(world.padObjects[0].visualState,"occupied");
 assert.equal(world.padObjects[0].selection.visible,true);
 assert.equal(world.setSocketVisualState(records[0].socketId,"selected"),true);
 assert.equal(world.padObjects[0].visualState,"occupied");
 assert.equal(world.projectEvent({type:"tower_sold",socketId:records[0].socketId,tick:22,eventId:"sale"}).consumed,true);
 assert.equal(world.projectEvent({type:"tower_built",socketId:records[0].socketId,tick:21,eventId:"older"}).consumed,false);
 assert.equal(world.padObjects[0].visualState,"neutral");
 assert.equal(world.applyVisualSnapshot({tick:21,sockets:records}),false);
 assert.equal(world.projectEvent({type:"tower_sold",socketId:records[0].socketId,tick:22,eventId:"sale"}).consumed,false);
 const objects=world.objects.slice();
 world.destroy();world.destroy();
 assert.ok(objects.every(x=>x.destroyed));
 assert.equal([...textures.keys()].filter(k=>k.startsWith("maps/m01/aurora-v3/viva/")).length,11);
 assert.equal([...textures.keys()].filter(k=>k.includes("grass-minimal")).length,0);
 assert.equal(textures.size,20,"M03 cache must be stable, 9 inherited SVG + 11 generated");
}
// Foreign M03 renderer mounts after an M07 and retains the historical texture
// when M07 closes first. The foreign direct M03 is configured NOT to dispose
// other people's resources; its default destructive lifecycle is an integrator risk.
const m07=mountM01WorldV7(scene,map,{treatment:"fiel"});
const m03=mountM01WorldV3(scene,map,{palette:"viva",disposeTextures:false});
m07.destroy();
assert.ok(textures.has("maps/m01/aurora-v3/viva/road"),"foreign M03 texture got deleted");
assert.equal(m03.setSocketVisualState("m01-pad-01","occupied"),true);
m03.destroy();
assert.ok(textures.has("maps/m01/aurora-v3/viva/road"));
// Concurrent M07 instances with optional polish share one resource, then release it.
const first=mountM01WorldV7(scene,map,{treatment:"pulido"});
const second=mountM01WorldV7(scene,map,{treatment:"pulido"});
const polish="maps/m01/continuidad-c1c/m07/viva/grass-minimal";
assert.ok(textures.has(polish));
first.destroy();assert.ok(textures.has(polish));
second.destroy();assert.equal(textures.has(polish),false);
// Frame-density DISPLAY-LIST fixture: no combat, no HP, no kill/escape events.
const beforeCount=textureCreated;
const mockActors=Array.from({length:63},()=>scene.add.ellipse(0,0,14,20,0x426a51,.8).setDepth(3000));
assert.equal(textureCreated,beforeCount,"63 display fixtures must not redraw canvas textures");
mockActors.forEach(o=>o.destroy());
assert.ok(mockActors.every(x=>x.destroyed));
assert.equal(JSON.stringify({path:map.path,spots:map.spots}),canonical);
const sorted=mountDurationsMs.toSorted((a,b)=>a-b);
const percentile=(a,p)=>a[Math.min(a.length-1,Math.ceil(a.length*p)-1)];
console.log(JSON.stringify({
 status:"PASS",testEnvironment:"NODE_ESM_WITH_MOCKS_NO_BROWSER",cycles,
 world:{waypoints:133,sockets:8,originalProps:13},
 textureKeys:{historicalSvg:9,historicalM03Canvas:11,optionalPolishAfterDestroy:0},
 runtimeCounters:{displayCreated,displayDestroyed,canvasCreated:textureCreated,canvasRemoved:textureRemoved},
 fixture:{syntheticShapes:63,realCoreSpawns:0,realFpsMeasured:false},
 mockMountTimingsMs:{p50:+percentile(sorted,.5).toFixed(3),p95:+percentile(sorted,.95).toFixed(3),
  warning:"Node mocked mounting only; NOT browser frame time/GPU performance"},
 knownBlocker:"Direct old M03 with default disposeTextures:true is unsafe in mixed scene; integrator must use shared M07 wrapper or explicit M03 disposeTextures:false."
},null,2));
