/**
 * M05 C1-D2 · structural QA for Node 20+ with actual ESM source and Phaser/Canvas MOCKS.
 * Run: node public/official/src/maps-visual/m01/m05/qa-m05.mjs
 * This is NOT an authentic WebGL2 rendering test.
 */
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {validateM01,visualSocketPreview} from "../renderer.mjs";
import {M04_PAD} from "../m04/renderer-v4.mjs";
import {
 M05_ASSETS,M05_WORLD,M05_PALETTES,M05_TREATMENTS,M05_VERSION,M05_ZONES,
 makeM05ArtPlan,preloadM05Illustrations,mountM01WorldV5,projectSocketVisualState
} from "./renderer-v5.mjs";
const mapURL=new URL("../../../../data/maps.v5.json",import.meta.url);
const raw=readFileSync(mapURL),digest=createHash("sha256").update(raw).digest("hex");
const maps=JSON.parse(raw),map=maps[0],snapshot=JSON.stringify({path:map.path,spots:map.spots});
assert.equal(maps.length,10);
validateM01(map);
assert.equal(map.path.length,133);
assert.equal(map.spots.length,8);
assert.deepEqual(map.path[0],[-32,342]);
assert.deepEqual(map.path.at(-1),[1312,400]);
assert.equal(M05_WORLD.visualRoadWidth,110);
assert.equal(M05_WORLD.hitRadiusWorld,54);
assert.ok(Math.abs(M04_PAD.widthWorld-110.24)<1e-8);
assert.deepEqual(M05_TREATMENTS,["bucolico","contraste"]);
assert.equal(M05_ASSETS.length,18);
assert.equal(new Set(M05_ASSETS).size,18);
assert.equal(M05_ZONES.length,6);
const preview=visualSocketPreview(map);
assert.equal(new Set(preview.map(x=>x.socketId)).size,8);
assert.deepEqual(preview.map(x=>[x.world.x,x.world.y]),[[96,480],[416,480],[672,544],[736,352],[992,224],[992,544],[1120,608],[1184,352]]);
for(const name of M05_ASSETS){
 const svg=readFileSync(new URL("../../../../art/maps/m01/m05/svg/"+name+".svg",import.meta.url),"utf8");
 assert.ok(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"'),"invalid SVG root "+name);
 assert.ok(svg.includes("</svg>"),"SVG unterminated "+name);
 assert.ok(svg.length>2000,"too little artwork "+name);
 assert.ok(!/https?:\/\//.test(svg.replace('http://www.w3.org/2000/svg',"")),"external resource "+name);
}
const artPlan=makeM05ArtPlan(map);
assert.equal(artPlan.props.length,18);
assert.equal(artPlan.canonicalRoute.length,133);
assert.equal(artPlan.sockets.length,8);
for(const zone of artPlan.zones)assert.equal(zone.clusterCount,3);
for(const p of artPlan.props){
 assert.ok(p.safeDistances.route>69+p.aestheticRadiusWorld);
 assert.ok(p.safeDistances.socket>69+p.aestheticRadiusWorld);
 assert.ok(p.safeDistances.landmark>59+p.aestheticRadiusWorld);
 assert.equal(p.combatCollider,false);
}
assert.equal(projectSocketVisualState({occupied:true}),"occupied");
assert.equal(projectSocketVisualState({ruined:true,occupied:true}),"ruins");
assert.equal(projectSocketVisualState({selected:true}),"selected");
assert.equal(projectSocketVisualState({}),"neutral");

const grad=()=>({addColorStop(){}});
const ctx=new Proxy({},{
 get(o,k){if(k==="createLinearGradient"||k==="createRadialGradient")return grad;if(!(k in o))o[k]=()=>{};return o[k];},
 set(o,k,v){o[k]=v;return true;}
});
globalThis.document={createElement(name){assert.equal(name,"canvas");return{
 width:0,height:0,getContext(type){assert.equal(type,"2d");return ctx;}
};}};
const tex=new Map();
function sprite(){
 let dead=false;return{
  setOrigin(){return this},setScale(){return this},setDepth(){return this},setDisplaySize(){return this},
  setAlpha(){return this},setTint(){return this},setVisible(){return this},setStrokeStyle(){return this},
  setTexture(k){assert.ok(tex.has(k),"missing sprite key "+k);return this},
  clear(){return this},lineStyle(){return this},beginPath(){return this},moveTo(){return this},
  lineTo(){return this},strokePath(){return this},strokeCircle(){return this},
  fillStyle(){return this},fillCircle(){return this},
  destroy(){dead=true;},get destroyed(){return dead;}
 };
}
const scene={
 textures:{exists:k=>tex.has(k),remove:k=>tex.delete(k),
  addCanvas:(k,e)=>{assert.ok(!tex.has(k));tex.set(k,{type:"canvas",width:e.width,height:e.height});}
 },
 load:{svg:(k,u)=>{assert.match(u,/\.svg$/);tex.set(k,{type:"svg",url:u});}},
 add:{
  image:(x,y,k)=>{assert.ok(tex.has(k),"unresolved texture "+k);return sprite();},
  ellipse:()=>sprite(),graphics:()=>sprite()
 }
};
preloadM05Illustrations(scene);
assert.equal([...tex.values()].filter(x=>x.type==="svg").length,42);
const tested=[];
for(const palette of M05_PALETTES)for(const treatment of M05_TREATMENTS){
 const view=mountM01WorldV5(scene,map,{palette,treatment});
 assert.equal(view.plan.sockets.length,8);
 assert.equal(view.clusterObjects.length,18);
 assert.equal(view.baseView.propObjects.length,23);
 assert.equal(view.padObjects.length,8);
 assert.equal(view.objects.length,109);
 assert.equal(view.missing.length,0);
 assert.equal(view.presentationOnly,true);
 assert.equal(view.gameplayImplemented,false);
 const snap={
  sockets:preview.map((s,i)=>({socketId:s.socketId,occupied:i%2===0,selected:i===2})),
  selectedSocketId:"m01-pad-03"
 };
 const sourceJSON=JSON.stringify(snap);
 assert.equal(view.applyVisualSnapshot(snap),true);
 assert.equal(JSON.stringify(snap),sourceJSON,"snapshot must be read-only");
 const event={eventId:"evt-1",type:"tower_built",socketId:"m01-pad-02"};
 assert.equal(view.projectEvent(event).consumed,true);
 assert.equal(view.projectEvent(event).reason,"duplicate-visual");
 assert.equal(view.projectEvent({type:"tower_sold",socketId:"m01-pad-02"}).consumed,true);
 assert.equal(view.projectEvent({type:"tower_upgraded",socketId:"m01-pad-04"}).consumed,true);
 assert.equal(view.projectEvent({type:"invalid",socketId:"m01-pad-04"}).consumed,false);
 assert.equal(view.projectEvent({type:"scene_reset"}).consumed,true);
 assert.equal(view.resetVisuals(),true);
 assert.equal(view.applyTreatment(treatment==="bucolico"?"contraste":"bucolico"),true);
 view.updateDebug({showRoute:true,showClearance:true,showOcclusion:true,selectedSocket:"m01-pad-01"});
 const keys=[...tex.keys()].filter(k=>k.startsWith("maps/m01/illustrated-m04/"+palette+"/"));
 assert.equal(keys.length,11,"M05 must not create a duplicate terrain texture");
 const owned=view.objects.slice();view.destroy();view.destroy();
 assert.ok(owned.every(o=>o.destroyed),"all owned objects must be destroyed");
 assert.equal([...tex.keys()].filter(k=>k.startsWith("maps/m01/illustrated-m04/"+palette+"/")).length,0,"no leaked generated textures");
 tested.push({palette,treatment,clusters:18,pads:8,objects:109,generatedTexturesSharedWithM04:11});
}
assert.equal(tex.size,42,"SVGs cached once, NOT recreated per frame or palette");
assert.equal(JSON.stringify({path:map.path,spots:map.spots}),snapshot,"source topology mutated");
assert.equal(createHash("sha256").update(readFileSync(mapURL)).digest("hex"),digest,"data file digest changed");
console.log(JSON.stringify({
 status:"PASS",environment:"NODE_WITH_CANVAS_PHASER_MOCKS_NOT_BROWSER",module:M05_VERSION,mapSourceSha256:digest,
 invariants:{maps:10,waypoints:133,sockets:8,hitRadius:54,visualRoadWidth:110},
 originalSvgClusters:18,zones:M05_ZONES.length,renderers:tested,
 knownPending:["Browser true WebGL2","A/B screenshots 1280x768 and 844x390","Joint C1-D2 4 T05 towers and 13 P04 actors","Mobile physical touch QA","Art director acceptance"]
},null,2));
