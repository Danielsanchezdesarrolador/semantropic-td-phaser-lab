/**
 * SEMANTROPIC TD · M05 Combat Readiness / Map visual team ownership.
 * Six authored tactical microenvironments, 3 original SVG clusters per zone.
 * New module mounts M04 ONCE; NO fork or overlay of a second 2560px road texture.
 * Contracts map-socket-v1/combat-events-v1: read-only ART PROJECTION, NOT gameplay.
 */
import {validateM01,visualSocketPreview} from "../renderer.mjs";
import {preloadM04Illustrations,mountM01WorldV4,M04_PALETTES,M04_PAD} from "../m04/renderer-v4.mjs";

export const M05_VERSION="maps/m01/combat-readiness-m05/1.0.0";
export const M05_WORLD=Object.freeze({width:1280,height:768,visualRoadWidth:110,hitRadiusWorld:54});
export const M05_TREATMENTS=Object.freeze(["bucolico","contraste"]);
export const M05_PALETTES=M04_PALETTES;
export const M05_ART_PREFIX="/official/art/maps/m01/m05/svg/";
export const M05_ZONES=Object.freeze([
 {id:"entrada",description:"aberturas de pastizal y restos de guardianes"},
 {id:"recodo",description:"pisadas, juncos y piedras de tránsito"},
 {id:"valle",description:"refugio central y vegetación que abraza el santuario"},
 {id:"meseta",description:"claros elevados, pizarra y hierba de viento"},
 {id:"regreso",description:"follaje del regreso y ocres cercanos al sendero"},
 {id:"puerta",description:"suministros humanos y la última línea de vegetación"}
]);
export const M05_ASSETS=Object.freeze([
 "entrada-01-centinela-de-brezos","entrada-02-rocales-miel","entrada-03-retoño-de-guardia",
 "recodo-01-juncos-cobrizos","recodo-02-piedras-pisadas","recodo-03-bosquecillo-de-viento",
 "valle-01-helechal-cobertizo","valle-02-claros-azules","valle-03-raices-del-refugio",
 "meseta-01-pizarra-y-hebras","meseta-02-retamas-del-alto","meseta-03-rocas-con-musgo",
 "regreso-01-rosal-de-regreso","regreso-02-troncos-ribera","regreso-03-vigias-silvestres",
 "puerta-01-barrera-floral","puerta-02-arboleda-de-puerta","puerta-03-suministros-ocultos"
]);
// x,y are ONLY decorative feet for M05 SVG clusters. Never socket/path/spawn points.
// Ordered deliberately by six mini-zones, three unique illustrations per zone.
const ART_LAYOUT=Object.freeze([
 {x:200,y:70,scale:.28,layer:"background"}, {x:180,y:214,scale:.33,layer:"low"}, {x:83,y:700,scale:.30,layer:"low"},
 {x:340,y:90,scale:.32,layer:"background"}, {x:340,y:204,scale:.30,layer:"low"}, {x:270,y:686,scale:.33,layer:"low"},
 {x:483,y:105,scale:.30,layer:"background"}, {x:521,y:710,scale:.30,layer:"low"}, {x:605,y:650,scale:.27,layer:"low"},
 {x:745,y:58,scale:.29,layer:"background"}, {x:745,y:708,scale:.32,layer:"low"}, {x:831,y:626,scale:.33,layer:"low"},
 {x:927,y:71,scale:.30,layer:"background"}, {x:888,y:695,scale:.31,layer:"low"}, {x:1030,y:677,scale:.25,layer:"low"},
 {x:1238,y:56,scale:.31,layer:"background"}, {x:1240,y:200,scale:.30,layer:"low"}, {x:1251,y:660,scale:.28,layer:"low"}
]);
const assert=(ok,message)=>{if(!ok)throw Error("[M05] "+message);};
const distance=(x,y,route)=>{
 let best=Infinity;
 for(let i=1;i<route.length;i++){
  const a=route[i-1],b=route[i],dx=b[0]-a[0],dy=b[1]-a[1],l=dx*dx+dy*dy;
  const t=l?Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/l)):0;
  best=Math.min(best,Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy));
 }
 return best;
};
const padDist=(x,y,sockets)=>Math.min(...sockets.map(s=>Math.hypot(x-s.world.x,y-s.world.y)));
export function makeM05ArtPlan(map){
 validateM01(map);
 const pads=visualSocketPreview(map);
 const landmarks=[{x:102,y:113},{x:625,y:92},{x:1119,y:725}]; // visual anchors from M04 approved source, NOT navigation.
 const props=M05_ASSETS.map((id,i)=>{
  const spec=ART_LAYOUT[i],zone=M05_ZONES[Math.floor(i/3)].id;
  const aestheticRadiusWorld=440*spec.scale*.30; // graphic-canopy envelope, not collider
  const routeDistance=distance(spec.x,spec.y,map.path),socketDistance=padDist(spec.x,spec.y,pads);
  const landmarkDistance=Math.min(...landmarks.map(a=>Math.hypot(a.x-spec.x,a.y-spec.y)));
  assert(routeDistance>69+aestheticRadiusWorld,"visual occlusion risk near route "+id);
  assert(socketDistance>69+aestheticRadiusWorld,"visual occlusion risk near socket "+id);
  assert(landmarkDistance>59+aestheticRadiusWorld,"large landmark overlap "+id);
  return {assetId:"maps/m01/combat-m05/svg/"+id,key:"maps/m01/combat-m05/svg/"+id,
   id,zone,x:spec.x,y:spec.y,scale:spec.scale,
   foot:{x:spec.x,y:spec.y},layer:spec.layer,
   anchor:{x:.5,y:.88},aestheticRadiusWorld,
   category:spec.layer==="background"?"canopy/background":"vegetation/low",
   occlusionRule:"behind-actors",combatCollider:false,readsHitbox:false,
   safeDistances:{route:routeDistance,socket:socketDistance,landmark:landmarkDistance}};
 });
 return {
  contractVersion:"map-visual-m05-v1",canonicalRoute:map.path.map(p=>[...p]),
  sockets:pads,zones:M05_ZONES.map((v,i)=>({...v,clusterCount:props.filter(p=>p.zone===v.id).length})),
  props,readOnly:true,visibleRoadWidth:110,source:"V5 maps.v5.json / visual offsets only",
  sourceMapId:1,forbidden:"No combat pathfinding, collision, spawn or purchase logic"
 };
}
export function preloadM05Illustrations(scene){
 preloadM04Illustrations(scene);
 for(const id of M05_ASSETS){
  const key="maps/m01/combat-m05/svg/"+id;
  if(!scene.textures.exists(key))scene.load.svg(key,M05_ART_PREFIX+id+".svg");
 }
}
export function projectSocketVisualState(model){
 // Pure projection from a CORE snapshot, never changes core domain data.
 if(!model||typeof model!=="object")return "neutral";
 if(model.ruined===true||model.ruins===true)return "ruins";
 if(model.occupied===true)return "occupied";
 if(model.selected===true)return "selected";
 return "neutral";
}
export function mountM01WorldV5(scene,map,options={}){
 validateM01(map);
 const palette=options.palette||"equilibrada",treatment=options.treatment||"bucolico";
 assert(M05_PALETTES.includes(palette),"unknown palette");
 assert(M05_TREATMENTS.includes(treatment),"unknown treatment");
 const plan=makeM05ArtPlan(map);
 const base=mountM01WorldV4(scene,map,{palette,disposeTextures:options.disposeTextures!==false});
 const own=[],clusters=[],missing=[];
 const socketIds=new Set(plan.sockets.map(s=>s.socketId));
 const recentIds=new Set(); // bounded duplicate-event projection guard only
 let disposed=false,style=treatment,overlayFlags={};
 function makeCluster(meta){
  if(!scene.textures.exists(meta.key)){missing.push(meta.key);return;}
  const depth=meta.layer==="background"?-1750:-1190;
  // A local source shadow deliberately sits underneath the sprite but never
  // above moving actors or HP bars. Shadow is not a collision region.
  const shadow=scene.add.ellipse(meta.x+4,meta.y+2,
   meta.aestheticRadiusWorld*2.15,meta.aestheticRadiusWorld*.60,
   0x174744,style==="bucolico"?.17:.32).setDepth(depth-1);
  const sprite=scene.add.image(meta.x,meta.y,meta.key)
   .setOrigin(meta.anchor.x,meta.anchor.y).setScale(meta.scale).setDepth(depth);
  own.push(shadow,sprite);
  clusters.push({...meta,sprite,shadow});
 }
 for(const m of plan.props)makeCluster(m);
 function applyTreatment(next){
  if(disposed)return false;
  assert(M05_TREATMENTS.includes(next),"invalid contrast treatment");
  style=next;
  for(const p of clusters){
   // Only the illustration changes; no global map tint, gameplay, HUD overlay or
   // texture regeneration. Both A/B use SAME canonical M04 base palette & camera.
   p.sprite.setTint(next==="bucolico"?0xf3ffe0:0xb6d9d0);
   p.shadow.setAlpha(next==="bucolico"?.19:.36);
  }
  return true;
 }
 function setSocketVisualState(id,value){
  if(disposed||!socketIds.has(id))return false;
  const normalized=value==="empty"?"neutral":value==="ruined"?"ruins":value;
  if(!["neutral","occupied","selected","ruins"].includes(normalized))return false;
  return base.setSocketVisualState(id,normalized);
 }
 function applyVisualSnapshot(snapshot){
  // Snapshot is an integrator-provided read-only domain projection.
  // Omitted pads default to neutral; no local purchase/sell/HP calculations.
  if(disposed)return false;
  if(!snapshot||!Array.isArray(snapshot.sockets))return false;
  const records=new Map(snapshot.sockets.filter(r=>socketIds.has(r?.socketId)).map(r=>[r.socketId,r]));
  for(const s of plan.sockets){
   const state=projectSocketVisualState(records.get(s.socketId));
   setSocketVisualState(s.socketId,state);
  }
  return true;
 }
 function projectEvent(event){
  // Candidate event names, NOT a claim the bridge already emits these.
  // Direct consumption must be wired, version-checked and ordered by Integrator.
  if(disposed||!event||typeof event!=="object")return {consumed:false,reason:"invalid"};
  const {type,eventId}=event;
  if(eventId&&recentIds.has(eventId))return {consumed:false,reason:"duplicate-visual"};
  if(type==="scene_reset"){
   recentIds.clear();
   for(const s of plan.sockets)setSocketVisualState(s.socketId,"neutral");
   return {consumed:true,displayOnly:true};
  }
  const ids=event.payload?.socketId||event.socketId;
  if(!socketIds.has(ids))return {consumed:false,reason:"unknown-socket"};
  const mapping={tower_built:"occupied",tower_upgraded:"occupied",tower_sold:"neutral",
   tower_ruined:"ruins",tower_rebuilt:"occupied"};
  if(!(type in mapping))return {consumed:false,reason:"unhandled-event"};
  setSocketVisualState(ids,mapping[type]);
  if(eventId){
   recentIds.add(eventId);
   if(recentIds.size>128)recentIds.delete(recentIds.values().next().value);
  }
  return {consumed:true,displayOnly:true};
 }
 function updateDebug(flags={}){
  overlayFlags={...flags};base.updateDebug(flags);
 }
 function resetVisuals(){
  if(disposed)return false;
  recentIds.clear();for(const s of plan.sockets)setSocketVisualState(s.socketId,"neutral");
  updateDebug({});return true;
 }
 function destroy(){
  if(disposed)return;disposed=true;
  for(const o of own)if(o?.destroy)o.destroy();
  base.destroy();recentIds.clear();
 }
 applyTreatment(treatment);
 return {
  artVersion:M05_VERSION,contractVersion:"map-visual-m05-v1",palette,
  treatment:()=>style,plan,
  baseView:base,objects:[...base.objects,...own],clusterObjects:clusters,
  padObjects:base.padObjects,propObjects:[...base.propObjects,...clusters],
  missing,
  occlusionMetadata:[
   ...base.occlusionMetadata,
   ...clusters.map(({id,zone,foot,layer,aestheticRadiusWorld})=>({
    id,zone,foot,layer,visualRadiusWorld:aestheticRadiusWorld,
    occlusionRule:"behind-actors",fadeWhenActorOverlaps:false,noCollider:true
   }))
  ],
  getPadMetrics:base.getPadMetrics,
  setSocketVisualState,applyVisualSnapshot,projectEvent,resetVisuals,
  applyTreatment,updateDebug,updateAmbient:base.updateAmbient,destroy,
  presentationOnly:true,gameplayImplemented:false
 };
}
