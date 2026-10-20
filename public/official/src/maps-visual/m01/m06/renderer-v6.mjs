/**
 * SEMANTROPIC TD — Equipo M, M06 Painterly Combat Scenography.
 * World M01 1280x768; canonical V5 source route and eight pads are untouched.
 * M05 mounts M04 ONCE; this module adds ONE modest transparent scenery canvas,
 * six original authored SVG props and an optional read-only adapter.
 * Two authored treatments use DIFFERENT stroke and volume geometry (not tint).
 * This is a VISUAL PROTOTYPE, not gameplay and not a claim of QA in Chromium.
 */
import {validateM01,visualSocketPreview} from "../renderer.mjs";
import {makeM05ArtPlan,preloadM05Illustrations,mountM01WorldV5} from "../m05/renderer-v5.mjs";
export const M06_VERSION="maps/m01/painterly-combat-m06/v1";
export const M06_TREATMENTS=Object.freeze(["atmosfera","relieve"]);
export const M06_SCENE=Object.freeze({worldWidth:1280,worldHeight:768,visualRoadWidth:110,interactiveRadiusWorld:54});
export const M06_TEX_DPR=1.25;
export const M06_ASSETS=Object.freeze(["sentinel-oak","wind-sapling","schist-terrace","meadow-tuft","guard-ruin","fortress-gate"]);
export const M06_SVG_BASE="/official/art/maps/m01/m06/svg/";
const PLAN_POS=Object.freeze([
 {asset:"sentinel-oak",zone:"entrada",x:110,y:215,scale:.39,layer:"background"},
 {asset:"wind-sapling",zone:"recodo",x:370,y:113,scale:.36,layer:"background"},
 {asset:"schist-terrace",zone:"valle",x:553,y:699,scale:.38,layer:"low"},
 {asset:"meadow-tuft",zone:"meseta",x:760,y:704,scale:.37,layer:"low"},
 {asset:"guard-ruin",zone:"regreso",x:900,y:690,scale:.33,layer:"low"},
 {asset:"fortress-gate",zone:"puerta",x:1230,y:174,scale:.35,layer:"background"}
]);
const COLOR={
 atmosfera:{
  meadow:"#a8c889",meadowDeep:"#598b6d",meadowLight:"#d6dba0",
  stone:"#b7bba8",rockDark:"#647f7a",wind:"#f2dfb3",loam:"#b6a17b",
  rim:"#406d62",shade:"#295b58",dry:"#c6b086",wood:"#ba8b61"
 },
 relieve:{
  meadow:"#7ba86a",meadowDeep:"#447d60",meadowLight:"#bcd18a",
  stone:"#c5bc9f",rockDark:"#4c6b72",wind:"#e9ce9c",loam:"#9e805e",
  rim:"#315c60",shade:"#234e54",dry:"#c5a077",wood:"#a67852"
 }
};
const TWO=2*Math.PI;
const PAINT_LEASES=new WeakMap(); // texture manager -> owned textures with live view count
function acquirePaint(scene,key,makeTexture){
 const tm=scene.textures;
 let cache=PAINT_LEASES.get(tm);if(!cache){cache=new Map();PAINT_LEASES.set(tm,cache);}
 const existing=cache.get(key);
 if(existing){existing.refs++;return;}
 const authored=!tm.exists(key);
 if(authored)tm.addCanvas(key,makeTexture());
 cache.set(key,{refs:1,authored});
}
function releasePaint(scene,key){
 const tm=scene.textures,cache=PAINT_LEASES.get(tm),item=cache?.get(key);
 if(!item)return;
 item.refs--;
 if(item.refs===0){
  if(item.authored&&tm.exists(key))tm.remove(key);
  cache.delete(key);
 }
}

const requireM06=(yes,what)=>{if(!yes)throw Error("[M06] "+what)};
function rng(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
function routeDistance(x,y,path){
 let shortest=Infinity;
 for(let i=1;i<path.length;i++){
  const a=path[i-1],b=path[i],dx=b[0]-a[0],dy=b[1]-a[1],l=dx*dx+dy*dy;
  const t=l?Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/l)):0;
  shortest=Math.min(shortest,Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy));
 }
 return shortest;
}
function socketDistance(x,y,sockets){
 return Math.min(...sockets.map(s=>Math.hypot(x-s.world.x,y-s.world.y)));
}
function canPaint(x,y,rad,map,sockets){
 // Never cover road center/shoulders nor any tactical input zone.
 return x>16+rad&&x<1264-rad&&y>9+rad&&y<759-rad
  &&routeDistance(x,y,map.path)>62+rad
  &&socketDistance(x,y,sockets)>75+rad;
}
function brush(c,x,y,a,b,color,opacity,rot){
 c.save();c.translate(x,y);c.rotate(rot);c.globalAlpha=opacity;
 c.beginPath();c.moveTo(-a*.93,0);
 c.bezierCurveTo(-a*.86,-b*.56,-a*.24,-b*1.15,a*.3,-b*.68);
 c.bezierCurveTo(a*.76,-b*.36,a*1.06,b*.10,a*.89,b*.29);
 c.bezierCurveTo(a*.4,b*.6,-a*.53,b*.87,-a*.93,0);
 c.fillStyle=color;c.fill();c.restore();
}
function facet(c,x,y,r,color,opacity,angle){
 c.save();c.translate(x,y);c.rotate(angle);c.globalAlpha=opacity;
 c.beginPath();c.moveTo(-r,-r*.21);c.lineTo(-r*.42,-r*.72);
 c.lineTo(r*.36,-r*.45);c.lineTo(r,r*.07);
 c.lineTo(r*.29,r*.48);c.lineTo(-r*.64,r*.42);c.closePath();
 c.fillStyle=color;c.fill();c.restore();
}
function ridge(c,points,width,color,opacity){
 if(points.length<2)return;c.save();c.globalAlpha=opacity;c.strokeStyle=color;
 c.lineCap="round";c.lineJoin="round";c.lineWidth=width;c.beginPath();c.moveTo(...points[0]);
 for(const pt of points.slice(1))c.lineTo(...pt);c.stroke();c.restore();
}
const ZONES=[
 {id:"entrada",x:151,y:159,rx:168,ry:100,seed:31,angle:-.3},
 {id:"recodo",x:331,y:155,rx:177,ry:92,seed:37,angle:.1},
 {id:"valle",x:535,y:635,rx:170,ry:99,seed:41,angle:.2},
 {id:"meseta",x:765,y:665,rx:178,ry:88,seed:43,angle:-.17},
 {id:"regreso",x:970,y:663,rx:170,ry:96,seed:47,angle:.32},
 {id:"puerta",x:1164,y:145,rx:161,ry:97,seed:53,angle:-.28}
];
// authored directional terrain patches are distributed around original six chapters;
// random is deterministic WITHIN each zone, not a uniform scatter over the whole map.
function makePaintTexture(map,sockets,treatment){
 const width=1280,height=768,dpr=M06_TEX_DPR;
 const el=document.createElement("canvas");el.width=Math.round(width*dpr);el.height=Math.round(height*dpr);
 const c=el.getContext("2d");requireM06(c,"Canvas texture baking unavailable");
 c.setTransform(dpr,0,0,dpr,0,0);c.lineCap="round";c.lineJoin="round";
 const P=COLOR[treatment];
 for(const zone of ZONES){
  const rand=rng(zone.seed+(treatment==="relieve"?1009:0));
  const count=treatment==="atmosfera"?185:155;
  // A: broad translucent interlocking brush masses with feathered color.
  // B: planar angular silhouettes with hardened mineral edges.
  for(let i=0;i<count;i++){
   const phi=rand()*TWO,rad=Math.sqrt(rand());
   const x=zone.x+Math.cos(phi)*zone.rx*rad;
   const y=zone.y+Math.sin(phi)*zone.ry*rad;
   const radius=treatment==="atmosfera"?(7+rand()*18):(8+rand()*17);
   if(!canPaint(x,y,radius,map,sockets))continue;
   const col=(i%11===0?P.loam:i%5===0?P.meadowLight:i%3===0?P.meadowDeep:P.meadow);
   if(treatment==="atmosfera"){
    brush(c,x,y,radius*(1.8+rand()),radius*(.3+rand()*.25),col,.085+rand()*.115,zone.angle+(rand()-.5)*.56);
    if(i%8===0)brush(c,x+3,y-2,radius*.83,radius*.21,P.wind,.09,zone.angle);
   }else{
    facet(c,x,y,radius*1.12,col,.11+rand()*.21,zone.angle+(rand()-.5)*.32);
    if(i%9===0)ridge(c,[[x-radius*.72,y+2],[x+radius*.07,y-radius*.28],[x+radius*.81,y+1]],
      1.5,P.rockDark,.14);
   }
  }
  // Six authored terrain highlights: A = curving grass folds, B = readable ridges.
  for(let k=0;k<16;k++){
   const x=zone.x-zone.rx*.8+(k%8)*zone.rx*.23;
   const y=zone.y-zone.ry*.42+Math.floor(k/8)*zone.ry*.76;
   const rad=treatment==="atmosfera"?13:10;
   if(!canPaint(x,y,rad,map,sockets))continue;
   if(treatment==="atmosfera"){
    brush(c,x,y,19,5,P.meadowLight,.13,zone.angle);
    brush(c,x+4,y+5,24,2,P.shade,.065,zone.angle);
   }else{
    facet(c,x,y,13,P.stone,.16,zone.angle);
    ridge(c,[[x-10,y+5],[x+3,y+9],[x+12,y+4]],1.8,P.rockDark,.28);
   }
  }
  // Material landmarks shadow underneath pre-existing props; low contrast only.
  for(let k=0;k<12;k++){
   const x=zone.x+(rand()-.5)*zone.rx*1.5;
   const y=zone.y+(rand()-.5)*zone.ry;
   if(!canPaint(x,y,6,map,sockets))continue;
   const len=4+rand()*7;
   ridge(c,[[x-2,y+1],[x,y-len],[x+3,y+1]],1.25,P.rim,.22);
  }
 }
 // Pads remain empty artwork-compatible. Only contact scuffs OUTSIDE visual ring.
 for(const socket of sockets){
  const x=socket.world.x,y=socket.world.y,rand=rng(Math.round(x*11+y*7));
  for(let j=0;j<12;j++){
   const a=j*TWO/12,r=63+rand()*11,px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;
   // Scuffs limited to grass; not another ring, not an input zone.
   if(!canPaint(px,py,3,map,sockets))continue;
   brush(c,px,py,6,2,P.loam,.075,a);
  }
 }
 return el;
}
export function makeM06ArtPlan(map){
 validateM01(map);
 const v5=makeM05ArtPlan(map),sockets=visualSocketPreview(map);
 const props=PLAN_POS.map((p,i)=>{
  const radiusWorld=360*p.scale*.35;
  const dr=routeDistance(p.x,p.y,map.path),ds=socketDistance(p.x,p.y,sockets);
  requireM06(dr>66+radiusWorld,"new prop intrudes route: "+p.asset);
  requireM06(ds>70+radiusWorld,"new prop intrudes socket: "+p.asset);
  return {id:"m06-"+p.asset,key:"maps/m01/painterly-m06/svg/"+p.asset,
   world:{x:p.x,y:p.y},footWorld:{x:p.x,y:p.y},zone:p.zone,
   scale:p.scale,anchor:{x:.5,y:.88},radiusWorld,maxHeightWorld:270*p.scale,
   layer:p.layer,occlusionRule:"behind-actors",collision:false,buildable:false,
   safeDistanceToRoute:dr,safeDistanceToSocket:ds};
 });
 return {
  contractVersion:"map-visual-m06-v1",mapId:1,world:M06_SCENE,
  canonicalPath:map.path.map(p=>[...p]),sockets,
  inheritedClusterCount:v5.props.length,zones:v5.zones.map(z=>({...z})),
  painterlyProps:props,authoringTreatments:M06_TREATMENTS,
  collisionAuthority:"Integrator/core-only",readOnly:true
 };
}
export function preloadM06Illustrations(scene){
 preloadM05Illustrations(scene);
 for(const id of M06_ASSETS){
  const key="maps/m01/painterly-m06/svg/"+id;
  if(!scene.textures.exists(key))scene.load.svg(key,M06_SVG_BASE+id+".svg");
 }
}
export function mountM01WorldV6(scene,map,options={}){
 validateM01(map);
 const treatment=options.treatment||"atmosfera";
 requireM06(M06_TREATMENTS.includes(treatment),"treatment must be atmosfera/relieve");
 const palette=options.palette||"equilibrada";
 const base=mountM01WorldV5(scene,map,{
  palette,treatment:treatment==="atmosfera"?"bucolico":"contraste",
  disposeTextures:options.disposeTextures!==false
 });
 const plan=makeM06ArtPlan(map),objects=[],props=[],missing=[];
 const prefix="maps/m01/painterly-m06/"+palette+"/"+treatment+"/";
 const paintKey=prefix+"ground-painterly";
 let disposed=false,reducedMotion=options.reducedMotion!==false,windTick=0,ground=null;
 try{
  acquirePaint(scene,paintKey,()=>makePaintTexture(map,plan.sockets,treatment));
  ground=scene.add.image(0,0,paintKey).setOrigin(0).setDisplaySize(1280,768).setDepth(-4500);
  objects.push(ground);
  for(const m of plan.painterlyProps){
   if(!scene.textures.exists(m.key)){missing.push(m.key);continue;}
   const depth=m.layer==="background"?-1745:-1195;
   const shadow=scene.add.ellipse(m.world.x+3,m.world.y+3,
    Math.max(25,m.radiusWorld*1.8),Math.max(7,m.radiusWorld*.32),
    0x174d44,.20).setDepth(depth-1);
   const sprite=scene.add.image(m.world.x,m.world.y,m.key)
    .setOrigin(m.anchor.x,m.anchor.y).setScale(m.scale).setDepth(depth);
   objects.push(shadow,sprite);
   props.push({...m,shadow,sprite});
  }
 }catch(error){
  for(const o of objects)if(o?.destroy)o.destroy();
  releasePaint(scene,paintKey);
  base.destroy();
  throw error;
 }
 let lastAuthoritativeTick=null,snapshotSeen=false;
 function applyVisualSnapshot(snapshot){
  if(disposed)return false;
  const ok=base.applyVisualSnapshot(snapshot);
  if(ok){
   snapshotSeen=true;
   lastAuthoritativeTick=Number.isInteger(snapshot?.tick)?snapshot.tick:null;
  }
  return ok;
 }
 function projectEvent(event){
  if(disposed)return {consumed:false,reason:"view-disposed"};
  // In case out-of-order events are received after a snapshot, never let an
  // unversioned/stale visual event overwrite the authoritative occupied state.
  if(snapshotSeen&&(!Number.isInteger(event?.tick)||lastAuthoritativeTick===null||event.tick<=lastAuthoritativeTick))
   return {consumed:false,reason:"snapshot-authoritative"};
  return base.projectEvent(event); // candidate API only, not a registered bridge.
 }
 function resetVisuals(){
  if(disposed)return false;
  snapshotSeen=false;lastAuthoritativeTick=null;
  return base.resetVisuals();
 }
 function setReducedMotion(next){
  if(disposed)return false;
  reducedMotion=!!next;
  if(reducedMotion)for(const p of props)p.sprite.setAngle(0);
  return true;
 }
 function updateAmbient(timeMs=0){
  if(disposed||reducedMotion)return;
  // Whole-game update clock from Phaser scene only. No window timer/listener.
  windTick=timeMs*.0005;
  for(let i=0;i<props.length;i++){
   const a=props[i];
   if(a.id.endsWith("fortress-gate")||a.id.endsWith("guard-ruin"))continue;
   a.sprite.setAngle(Math.sin(windTick+i*2.1)*.30);
  }
 }
 function destroy(){
  if(disposed)return;disposed=true;
  for(const o of objects)if(o?.destroy)o.destroy();
  releasePaint(scene,paintKey);
  base.destroy();
 }
 return {
  artVersion:M06_VERSION,contractVersion:"map-visual-m06-v1",
  palette,treatment,plan,baseView:base,
  objects:[...base.objects,...objects],padObjects:base.padObjects,
  propObjects:[...base.propObjects,...props],
  painterlyProps:props,painterlyCanvas:ground,missing,
  occlusionMetadata:[...base.occlusionMetadata,...props.map(m=>({
   id:m.id,footWorld:m.footWorld,radiusWorld:m.radiusWorld,maxHeightWorld:m.maxHeightWorld,
   occlusionRule:m.occlusionRule,zone:m.zone,layer:m.layer,noCollider:true
  }))],
  getPadMetrics:base.getPadMetrics,setSocketVisualState:base.setSocketVisualState,
  applyVisualSnapshot,projectEvent,resetVisuals,
  updateDebug:base.updateDebug,setReducedMotion,updateAmbient,destroy,
  authoredEffectSource:"deterministic-Canvas-texture-baked-on-mount",
  gameplayImplemented:false,presentationOnly:true
 };
}
