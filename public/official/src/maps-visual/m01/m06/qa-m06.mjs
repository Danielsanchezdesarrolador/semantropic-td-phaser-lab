/**
 * M06 / Equipo M — actual Node ESM source with Canvas2D + Phaser test DOUBLES.
 * Run from repository root: node public/official/src/maps-visual/m01/m06/qa-m06.mjs
 * Not a GPU, browser, visual approval or actual combat test.
 */
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {validateM01,visualSocketPreview} from "../renderer.mjs";
import {
 M06_VERSION,M06_ASSETS,M06_TREATMENTS,M06_SCENE,M06_TEX_DPR,
 makeM06ArtPlan,preloadM06Illustrations,mountM01WorldV6
} from "./renderer-v6.mjs";
const canonical=new URL("../../../../data/maps.v5.json",import.meta.url);
const bytes=readFileSync(canonical),digest=createHash("sha256").update(bytes).digest("hex");
const maps=JSON.parse(bytes),map=maps[0];
const initial=JSON.stringify({path:map.path,spots:map.spots});
assert.equal(maps.length,10);
validateM01(map);
assert.equal(map.path.length,133);
assert.equal(map.spots.length,8);
assert.deepEqual(map.path[0],[-32,342]);
assert.deepEqual(map.path.at(-1),[1312,400]);
assert.equal(M06_SCENE.visualRoadWidth,110);
assert.equal(M06_SCENE.interactiveRadiusWorld,54);
assert.equal(M06_TEX_DPR,1.25);
assert.deepEqual(M06_TREATMENTS,["atmosfera","relieve"]);
assert.equal(new Set(M06_ASSETS).size,6);
for(const id of M06_ASSETS){
 const data=readFileSync(new URL("../../../../art/maps/m01/m06/svg/"+id+".svg",import.meta.url),"utf8");
 assert.ok(data.startsWith('<svg xmlns="http://www.w3.org/2000/svg"'),"unexpected source "+id);
 assert.ok(data.includes("</svg>"),"SVG root not closed "+id);
 assert.ok(data.length>1700,"art source unexpectedly empty "+id);
 assert.ok(!/https?:\/\//.test(data.replace("http://www.w3.org/2000/svg","")),"external references "+id);
}
const plan=makeM06ArtPlan(map),sockets=visualSocketPreview(map);
assert.equal(plan.canonicalPath.length,133);
assert.equal(plan.sockets.length,8);
assert.deepEqual(plan.sockets.map(s=>s.socketId),sockets.map(s=>s.socketId));
assert.equal(plan.inheritedClusterCount,18);
assert.equal(plan.painterlyProps.length,6);
assert.ok(plan.zones.every(z=>z.clusterCount===3));
for(const p of plan.painterlyProps){
 assert.ok(p.safeDistanceToRoute>66+p.radiusWorld,"route clearance "+p.id);
 assert.ok(p.safeDistanceToSocket>70+p.radiusWorld,"socket clearance "+p.id);
 assert.equal(p.collision,false);
 assert.equal(p.buildable,false);
}
const fakeGrad=()=>({addColorStop(){}});
const c=new Proxy({},{
 get(o,k){if(k==="createLinearGradient"||k==="createRadialGradient")return fakeGrad;
  if(!(k in o))o[k]=()=>{};return o[k];},
 set(o,k,value){o[k]=value;return true;}
});
globalThis.document={
 createElement(name){assert.equal(name,"canvas");return{width:0,height:0,getContext(ty){assert.equal(ty,"2d");return c;}};}
};
const textures=new Map();
function sprite(){
 let dead=false;return{
  setOrigin(){return this},setDepth(){return this},setScale(){return this},setDisplaySize(){return this},
  setTint(){return this},setAlpha(){return this},setAngle(){return this},setStrokeStyle(){return this},setVisible(){return this},
  setTexture(k){assert.ok(textures.has(k),"texture missing "+k);return this},
  clear(){return this},lineStyle(){return this},beginPath(){return this},moveTo(){return this},lineTo(){return this},
  fillStyle(){return this},fillCircle(){return this},strokePath(){return this},strokeCircle(){return this},
  destroy(){dead=true;},get destroyed(){return dead;}
 };
}
const scene={
 textures:{exists:key=>textures.has(key),remove:key=>textures.delete(key),
  addCanvas:(key,canvas)=>{assert.ok(!textures.has(key));textures.set(key,{type:"canvas",size:[canvas.width,canvas.height]});}
 },
 load:{svg:(key,url)=>{assert.ok(url.endsWith(".svg"));textures.set(key,{type:"svg",url});}},
 add:{
  image:(x,y,key)=>{assert.ok(textures.has(key),"Missing resource "+key);return sprite()},
  ellipse:()=>sprite(),graphics:()=>sprite()
 }
};
preloadM06Illustrations(scene);
assert.equal([...textures.values()].filter(v=>v.type==="svg").length,48);
const tests=[];
for(const palette of ["equilibrada","viva","atmosferica"])for(const treatment of M06_TREATMENTS){
 const view=mountM01WorldV6(scene,map,{palette,treatment,reducedMotion:false});
 assert.equal(view.missing.length,0);
 assert.equal(view.painterlyProps.length,6);
 assert.equal(view.padObjects.length,8);
 assert.equal(view.propObjects.length,47);
 assert.equal(view.objects.length,122);
 assert.equal(view.presentationOnly,true);
 assert.equal(view.gameplayImplemented,false);
 const paintKey="maps/m01/painterly-m06/"+palette+"/"+treatment+"/ground-painterly";
 assert.deepEqual(textures.get(paintKey),{type:"canvas",size:[1600,960]});
 const baseTextures=[...textures.keys()].filter(k=>k.startsWith("maps/m01/illustrated-m04/"+palette+"/"));
 assert.equal(baseTextures.length,11);
 const occupied={tick:120,selectedSocketId:"m01-pad-03",sockets:sockets.map((s,i)=>({
  socketId:s.socketId,occupied:i===1,ruined:i===4,selected:i===2
 }))};
 const before=JSON.stringify(occupied);
 assert.equal(view.applyVisualSnapshot(occupied),true);
 assert.equal(JSON.stringify(occupied),before,"domain snapshot must not be mutated");
 assert.equal(view.projectEvent({type:"tower_sold",socketId:"m01-pad-02",tick:119}).reason,"snapshot-authoritative");
 assert.equal(view.projectEvent({type:"tower_sold",socketId:"m01-pad-02"}).reason,"snapshot-authoritative");
 const event={type:"tower_sold",socketId:"m01-pad-02",tick:121,eventId:"core-1"};
 assert.equal(view.projectEvent(event).consumed,true);
 assert.equal(view.projectEvent(event).reason,"duplicate-visual");
 assert.equal(view.resetVisuals(),true);
 assert.equal(view.projectEvent({type:"scene_reset"}).consumed,true);
 assert.equal(view.setReducedMotion(false),true);
 view.updateAmbient(1234);
 assert.equal(view.setReducedMotion(true),true);
 view.updateAmbient(1500);
 const objects=[...view.objects];
 view.destroy();view.destroy();
 assert.ok(objects.every(x=>x.destroyed),"owned display objects leaked");
 assert.equal(textures.has(paintKey),false,"M06 paint texture remains after destroy");
 assert.equal([...textures.keys()].filter(k=>k.startsWith("maps/m01/illustrated-m04/"+palette+"/")).length,0,"M04 inherited textures leaked");
 assert.equal(view.applyVisualSnapshot(occupied),false,"destroyed view must ignore snapshots");
 assert.equal(view.projectEvent(event).reason,"view-disposed");
 tests.push({palette,treatment,props:47,objects:122,paintTexture:[1600,960],clean:true});
}
assert.equal(textures.size,48);
assert.equal(JSON.stringify({path:map.path,spots:map.spots}),initial,"V5 map mutated");
assert.equal(createHash("sha256").update(readFileSync(canonical)).digest("hex"),digest);
const uncompressedMiB=(1600*960*4)/1048576;
console.log(JSON.stringify({
 status:"PASS",testType:"NODE_REAL_ESM_WITH_CANVAS_PHASER_MOCKS",
 sourceMapSha256:digest,canonical:{maps:10,route:133,pads:8,roadWidth:110},
 art:{editableSvg:6,retainedM05Clusters:18,sceneObjectsEach:122,textureAddedMiB:+uncompressedMiB.toFixed(2)},
 suites:tests,pending:["Browser Phaser WebGL2 authenticity","Mobile real 844x390 and 932x430","T06/P05 joint integration","Actual core C1-D2 hit and escape events","Art final approval"]
},null,2));
