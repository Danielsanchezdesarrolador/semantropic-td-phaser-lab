/**
 * SEMANTROPIC TD — Equipo MAPAS M07 · visual-lock of approved C1-C screenshot.
 * A C1-C-approved MAP appearance is obtained by mounting historical M03 with
 * palette=viva, NOT by piling M04/M05/M06 graphics over the original scene.
 *
 * No gameplay (economy, targeting, damage, waves), no event-bus subscription,
 * no shared T/P files, no global camera changes. Core C1-D4 integration is DG-owned.
 * Visual polish is an explicitly optional low-opacity under-path grass pass.
 */
import {validateM01,visualSocketPreview} from "../renderer.mjs";
import {
  M03_PALETTES,M03_PAD_SOURCE,M03_PROTOTYPE_HIT_RADIUS,M03_VERSION,
  preloadM03Illustrations,makeM03ArtPlan,mountM01WorldV3
} from "../m03/renderer-v3.mjs";

export const M07_VERSION="maps/m01/continuidad-c1c/m07-v1";
export const M07_TREATMENTS=Object.freeze(["fiel","pulido"]);
export const M07_CANONICAL_PALETTE="viva";
export const M07_WORLD=Object.freeze({width:1280,height:768,pathVertices:133,sockets:8,roadWidth:110,hitRadiusWorld:54});
export const M07_SOURCE=Object.freeze({
 screenshotSha256:"24103e45a0e1249fa4b89d4e65ea16d9e147bdf1e2462e5c4063469a931842ef",
 screenshotDimensions:[1280,768],
 integrationBranch:"integration/c1c-q2-review",
 reviewScene:"public/official/src/c1c-q2-review/scene.mjs",
 artworkSource:"public/official/src/maps-visual/m01/m03/renderer-v3.mjs",
 palette:"viva",historicalVersion:M03_VERSION
});
const assert=(v,s)=>{if(!v)throw Error("[M07] "+s)};
const tau=Math.PI*2;
const rng=(seed)=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
function distanceToPath(x,y,path){
 let nearest=Infinity;
 for(let i=1;i<path.length;i++){
  const a=path[i-1],b=path[i],dx=b[0]-a[0],dy=b[1]-a[1],d=dx*dx+dy*dy;
  const t=d?Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/d)):0;
  nearest=Math.min(nearest,Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy));
 }
 return nearest;
}
function safeGrass(x,y,map,pads){
 return distanceToPath(x,y,map.path)>80
  &&pads.every(p=>Math.hypot(x-p.world.x,y-p.world.y)>82);
}
/** Deliberately tiny marks on EXISTING open turf, never a new biome or landmark. */
function bakeOptionalPolish(map,pads){
 const canvas=document.createElement("canvas");canvas.width=1280;canvas.height=768;
 const c=canvas.getContext("2d");assert(c,"Canvas 2D unavailable for optional polish");
 const r=rng(17032026);
 const islands=[
  [170,95,115,55],[354,158,122,66],[502,116,120,60],[749,93,123,55],
  [947,105,135,57],[1140,93,113,50],
  [110,671,113,69],[328,671,130,73],[543,685,118,53],
  [760,666,119,72],[962,689,109,59],[1180,668,90,54]
 ];
 for(const [cx,cy,rx,ry] of islands){
  for(let j=0;j<37;j++){
   const a=r()*tau,s=Math.sqrt(r());
   const x=cx+Math.cos(a)*rx*s,y=cy+Math.sin(a)*ry*s;
   if(!safeGrass(x,y,map,pads))continue;
   const w=2.2+r()*6,h=1+r()*2.8;
   c.fillStyle=j%6===0?"rgba(228,237,163,.085)":j%4===0?"rgba(49,112,81,.09)":"rgba(160,201,123,.07)";
   c.beginPath();c.ellipse(x,y,w,h,-.17,0,tau);c.fill();
   if(j%13===0){
    c.strokeStyle="rgba(62,135,91,.15)";c.lineWidth=1.1;
    c.beginPath();c.moveTo(x-2,y+1);c.quadraticCurveTo(x,y-4,x+3,y);c.stroke();
   }
  }
 }
 return canvas;
}
const M03_KEYS=palette=>{
 const prefix="maps/m01/aurora-v3/"+palette+"/";
 return [prefix+"ground",prefix+"road",
  ...["tempo","power","focus"].flatMap(kind=>
    ["empty","occupied","ruins"].map(status=>prefix+"pad/"+kind+"/"+status))];
};
// M03 original renderer lacks cross-view texture refcount. M07 owns its refcounts
// only for views created THROUGH this M07 wrapper and never removes foreign keys.
const LEASE=new WeakMap();
const POLISH_LEASE=new WeakMap();
function acquirePolish(scene,key,make){
 const tm=scene.textures;
 let cache=POLISH_LEASE.get(tm);if(!cache){cache=new Map();POLISH_LEASE.set(tm,cache);}
 let item=cache.get(key);
 if(!item){
  const authored=!tm.exists(key);
  if(authored)tm.addCanvas(key,make());
  item={users:0,authored};cache.set(key,item);
 }
 item.users++;
}
function releasePolish(scene,key){
 if(!key)return;
 const tm=scene.textures,cache=POLISH_LEASE.get(tm),item=cache?.get(key);
 if(!item)return;
 item.users--;
 if(item.users===0){
  if(item.authored&&tm.exists(key))tm.remove(key);
  cache.delete(key);
 }
}
function leaseM03(scene,palette,map){
 const tm=scene.textures,keys=M03_KEYS(palette);
 let state=LEASE.get(tm);
 if(!state){state=new Map();LEASE.set(tm,state);}
 let entry=state.get(palette);
 if(!entry){
  const owned=new Set(keys.filter(k=>!tm.exists(k)));
  entry={users:0,owned};state.set(palette,entry);
 }
 entry.users++;
 try{
  const view=mountM01WorldV3(scene,map,{palette,disposeTextures:false});
  return {view,release(){
   entry.users--;
   if(entry.users===0){
    // M07-Q2: a direct M03 consumer may have started AFTER this view.
    // Never delete historical Phaser-global textures from M07. Eleven
    // stable keys remain bounded in manager cache until the manager dies.
    state.delete(palette);
   }
  }};
 }catch(error){
  entry.users--;
  if(entry.users===0)state.delete(palette);
  throw error;
 }
}
export function preloadM07Illustrations(scene){
 // Intentional: don't load/render the divergent M04/M05/M06 SVGs for M07's default identity.
 preloadM03Illustrations(scene);
}
export function makeM07ArtPlan(map){
 validateM01(map);
 const original=makeM03ArtPlan(map),pads=visualSocketPreview(map);
 assert(map.path.length===M07_WORLD.pathVertices,"M01 133 points changed");
 assert(pads.length===M07_WORLD.sockets,"M01 eight pads changed");
 const props=original.illustrations.map(p=>{
  const type=p.type;
  return {
   id:p.id,type,assetKey:type==="supply"?"maps/m01/aurora-v3/svg/supply":
    type==="fern"?"maps/m01/aurora-v3/svg/fern":"maps/m01/aurora-v2/svg/"+type,
   sourceTeam:"M03",world:{x:p.x,y:p.y},footWorld:{x:p.x,y:p.footY??p.y},
   scale:p.scale,occlusionRule:p.occlusion,visualRadiusWorld:p.radiusWorld,
   category:p.category||"M03-original",status:"MANTIENE",collision:false
  };
 });
 return {
  version:M07_VERSION,source:M07_SOURCE,
  canonicalRoute:map.path.map(([x,y])=>[x,y]),sockets:pads,props,
  roadWidth:110,padTextureWidthWorld:M03_PAD_SOURCE.approxWorldWidth,
  treatments:M07_TREATMENTS,
  disabledDivergences:["M04 replacement terrain","M05 eighteen added clusters",
    "M06 painterly canvas","M06 six alternate structures","M06 altered gate/oaks"],
  identityGuard:"M03 Viva exact baseline by default, optional low-impact polish only",
  gameplayOwnedBy:"Integrator / C1-D4"
 };
}
const projectState=(v)=>{
 if(!v||typeof v!=="object")return "neutral";
 if(v.ruins===true||v.ruined===true)return "ruins";
 if(v.occupied===true)return "occupied";
 if(v.selected===true)return "selected";
 return "neutral";
};
export function mountM01WorldV7(scene,map,options={}){
 validateM01(map);
 const palette=options.palette||M07_CANONICAL_PALETTE;
 assert(M03_PALETTES.includes(palette),"palette invalid");
 const treatment=options.treatment||"fiel";
 assert(M07_TREATMENTS.includes(treatment),"treatment invalid");
 const plan=makeM07ArtPlan(map);
 const {view:base,release}=leaseM03(scene,palette,map);
 let paint=null,paintKey=null,paintLeased=false,disposed=false,latestTick=null,snapshotSeen=false;
 const extras=[],knownIds=new Set(plan.sockets.map(s=>s.socketId));
 const observedEvents=new Set();
 const selectedFlags=new Set();
 const socketTick=new Map();
 let lastAppliedTick=null;
 function forgetExtras(){
  for(const object of extras)if(object?.destroy)object.destroy();
  if(paintLeased)releasePolish(scene,paintKey);
  paint=null;paintKey=null;paintLeased=false;
 }
 try{
  if(treatment==="pulido"){
   // One transparent 1280x768 RGBA8 mask; not part of baseline and NEVER per frame.
   paintKey="maps/m01/continuidad-c1c/m07/"+palette+"/grass-minimal";
   acquirePolish(scene,paintKey,()=>bakeOptionalPolish(map,plan.sockets));
   paintLeased=true;
   paint=scene.add.image(0,0,paintKey).setOrigin(0).setDisplaySize(1280,768).setDepth(-4700);
   extras.push(paint);
  }
 }catch(e){forgetExtras();base.destroy();release();throw e;}
 function setSocketVisualState(socketId,state){
  if(disposed||!knownIds.has(socketId))return false;
  if(!["neutral","empty","occupied","selected","ruins","ruined"].includes(state))return false;
  const next=state==="ruined"?"ruins":state;
  const ok=base.setSocketVisualState(socketId,next);
  if(ok){if(next==="selected")selectedFlags.add(socketId);else selectedFlags.delete(socketId);}
  return ok;
 }
 function applyVisualSnapshot(snapshot){
  if(disposed||!snapshot||!Array.isArray(snapshot.sockets))return false;
  const tick=Number.isInteger(snapshot.tick)?snapshot.tick:null;
  // A snapshot older than a visual sale cannot resurrect the old tower.
  if(snapshotSeen&&lastAppliedTick!==null&&(tick===null||tick<lastAppliedTick))return false;
  const records=new Map(snapshot.sockets.filter(s=>knownIds.has(s?.socketId)).map(s=>[s.socketId,s]));
  selectedFlags.clear();
  const selectedSocket=knownIds.has(snapshot.selectedSocketId)?snapshot.selectedSocketId:null;
  const padById=new Map(base.padObjects.map(p=>[p.socket.socketId,p]));
  for(const s of plan.sockets){
   const record=records.get(s.socketId),state=projectState(record);
   setSocketVisualState(s.socketId,state);
   const chosen=selectedSocket===s.socketId||record?.selected===true;
   const pad=padById.get(s.socketId);
   if(chosen&&pad){pad.selection.setVisible(true);selectedFlags.add(s.socketId);}
   if(tick!==null)socketTick.set(s.socketId,tick);
  }
  snapshotSeen=true;latestTick=tick;
  if(tick!==null)lastAppliedTick=Math.max(lastAppliedTick??tick,tick);
  return true;
 }
 function projectEvent(event){
  if(disposed)return {consumed:false,reason:"view-disposed"};
  if(!event||typeof event!=="object")return {consumed:false,reason:"invalid"};
  if(event.type==="scene_reset"){
   if(lastAppliedTick!==null&&Number.isInteger(event.tick)&&event.tick<lastAppliedTick)
    return {consumed:false,reason:"stale-reset"};
   resetVisuals();return {consumed:true,displayOnly:true};
  }
  const mapType={
   tower_built:"occupied",tower_upgraded:"occupied",tower_sold:"neutral",
   tower_ruined:"ruins",tower_rebuilt:"occupied"
  };
  const state=mapType[event.type],id=event.payload?.socketId||event.socketId;
  if(!state||!knownIds.has(id))return {consumed:false,reason:"unhandled-type-or-socket"};
  if(event.eventId&&observedEvents.has(event.eventId))return {consumed:false,reason:"duplicate-visual"};
  const tick=Number.isInteger(event.tick)?event.tick:null;
  if(snapshotSeen&&(tick===null||latestTick===null||tick<=latestTick))
   return {consumed:false,reason:"snapshot-authoritative"};
  const prev=socketTick.get(id);
  if(prev!==undefined&&(tick===null||tick<=prev))
   return {consumed:false,reason:"stale-socket-event"};
  if(lastAppliedTick!==null&&(tick===null||tick<lastAppliedTick))
   return {consumed:false,reason:"stale-event"};
  const ok=setSocketVisualState(id,state);
  if(ok){
   if(tick!==null){
    socketTick.set(id,tick);
    lastAppliedTick=Math.max(lastAppliedTick??tick,tick);
   }
   if(event.eventId){
    observedEvents.add(event.eventId);
    if(observedEvents.size>128)observedEvents.delete(observedEvents.values().next().value);
   }
  }
  return {consumed:ok,displayOnly:true};
 }
 function resetVisuals(){
  if(disposed)return false;
  snapshotSeen=false;latestTick=null;lastAppliedTick=null;
  socketTick.clear();selectedFlags.clear();observedEvents.clear();
  for(const p of plan.sockets)setSocketVisualState(p.socketId,"neutral");
  return true;
 }
 function updateDebug(opts={}){
  if(disposed)return;
  base.updateDebug({...opts,selectedSocket:opts.selectedSocket||[...selectedFlags][0]||null});
 }
 function destroy(){
  if(disposed)return;disposed=true;
  forgetExtras();base.destroy();release();observedEvents.clear();selectedFlags.clear();
 }
 return {
  contractVersion:"map-visual-m07-v1",artVersion:M07_VERSION,palette,treatment,plan,
  baseView:base,padObjects:base.padObjects,propObjects:base.propObjects,
  objects:[...base.objects,...extras],layerGroups:base.layerGroups,
  occlusionMetadata:base.occlusionMetadata.map(p=>({
   ...p,footWorld:p.foot,visualLock:"M03-C1C",collision:false
  })),
  getPadMetrics:base.getPadMetrics,
  setSocketVisualState,applyVisualSnapshot,projectEvent,resetVisuals,updateDebug,
  updateAmbient(){},setReducedMotion(){return !disposed;},
  getMapPerformanceInfo:()=>({
   treatment,palette,sceneObjects:base.objects.length+extras.length,
   canonicalPads:base.padObjects.length,originalProps:base.propObjects.length,
   preloadedSvgKeysExpected:9,
   originalM03GeneratedTexturesPresent:M03_KEYS(palette).filter(k=>scene.textures.exists(k)).length,
   additionalPolishTextures:paintLeased?1:0,
   optionalPolishCanvasPixels:paintLeased?1280*768:0,
   cachePolicy:"11 historical M03 texture keys retained in Phaser manager; optional polish leased and released",
   gpuMemoryMiB:null,fpsP50:null,fpsP95:null,renderedCoreEnemies:null
  }),
  destroy,gameplayImplemented:false,presentationOnly:true,
  changesOriginalSilhouettes:false,syntheticEnemyCount:0,
  sourceScreenshotSha256:M07_SOURCE.screenshotSha256
 };
}
