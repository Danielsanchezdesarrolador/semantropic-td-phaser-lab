/**
 * SEMANTROPIC TD — EQUIPO M / M-03 Q2 (visual only)
 * New bespoke illustrated M01 render pass. Canonical V5 133-point route unchanged.
 * Uses original M02 editorial landmarks and 2 new hand-editable SVG masters.
 * GAMEPLAY OWNERSHIP: NONE. Runtime sockets/footprints still belong to integrator.
 */
import {validateM01,visualSocketPreview,mountM01World} from "../renderer.mjs";
import {makeM02ArtPlan,preloadM02Illustrations,M02_SVG_PREFIX,M02_SVGS} from "../m02/renderer-v2.mjs";
export const M03_VERSION="maps/m01/aurora-v3/q2-1";
export const M03_ROAD_WIDTH=110;
export const M03_WORLD=Object.freeze({width:1280,height:768});
export const M03_PALETTES=Object.freeze(["equilibrada","viva","atmosferica"]);
export const M03_PAD_SOURCE=Object.freeze({width:212,height:152,dpr:2,scale:.26,textureWidthPx:424,approxWorldWidth:110.24});
export const M03_PROTOTYPE_HIT_RADIUS=54;
export const M03_SVG_BASE="/official/art/maps/m01/m03/svg/";
export const M03_SVGS=Object.freeze({supply:"dawn-cache.svg",fern:"dawn-fern.svg"});
const TAU=Math.PI*2;
const P={
 equilibrada:{grass1:"#c0d990",grass2:"#83b67b",grass3:"#467d67",vale:"#74a66e",leaf:"#4d9769",rim:"#d8e1a3",warm:"#f8e2af",loam:"#cfab79",soil:"#aa835c",bank:"#667a57",granite:"#a9b6a5",slate:"#576c6e",light:"#efe5bf",metal:"#b09c73",aether:"#7ebcb5",shade:"#254f50"},
 viva:{grass1:"#d1e78e",grass2:"#8cc879",grass3:"#428967",vale:"#78b971",leaf:"#3f9d63",rim:"#e2ef9b",warm:"#ffdf9b",loam:"#dfb478",soil:"#b38054",bank:"#687b4a",granite:"#b4c0a1",slate:"#5b726c",light:"#fff0c7",metal:"#c9a46b",aether:"#72d4c1",shade:"#24544e"},
 atmosferica:{grass1:"#bed9a4",grass2:"#7fb69b",grass3:"#407e73",vale:"#72a995",leaf:"#538e7a",rim:"#c2ddaf",warm:"#f4e2c6",loam:"#ccb397",soil:"#a38a73",bank:"#61766b",granite:"#afbeb8",slate:"#586f75",light:"#e9e8d7",metal:"#bcb39b",aether:"#95d3d0",shade:"#31565a"}
};
const must=(ok,msg)=>{if(!ok)throw Error("[M03] "+msg)};
function rng(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
function canvas(w,h,dpr=2){const e=document.createElement("canvas");e.width=w*dpr;e.height=h*dpr;const c=e.getContext("2d");must(c,"Canvas source unavailable");c.setTransform(dpr,0,0,dpr,0,0);c.lineJoin="round";c.lineCap="round";return {e,c};}
function stroke(c,pts,col,width=2,opacity=1){
 if(pts.length<2)return;c.save();c.globalAlpha=opacity;c.beginPath();c.moveTo(...pts[0]);
 for(const p of pts.slice(1))c.lineTo(...p);c.strokeStyle=col;c.lineWidth=width;c.stroke();c.restore();
}
function poly(c,pts,color,outline=null,width=1,alpha=1){
 c.save();c.globalAlpha=alpha;c.beginPath();c.moveTo(...pts[0]);for(const p of pts.slice(1))c.lineTo(...p);c.closePath();c.fillStyle=color;c.fill();if(outline){c.lineWidth=width;c.strokeStyle=outline;c.stroke();}c.restore();
}
function oval(c,x,y,rx,ry,color,a=1){c.save();c.globalAlpha=a;c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fillStyle=color;c.fill();c.restore();}
function dist(x,y,path){
 let smallest=Infinity;
 for(let i=1;i<path.length;i++){
  const a=path[i-1],b=path[i],dx=b[0]-a[0],dy=b[1]-a[1],k=dx*dx+dy*dy;
  const t=k?Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/k)):0;
  smallest=Math.min(smallest,Math.hypot(x-a[0]-dx*t,y-a[1]-dy*t));
 }
 return smallest;
}
function nearest(x,y,sockets){return Math.min(...sockets.map(s=>Math.hypot(x-s.world.x,y-s.world.y)));}
function exclusion(x,y,map,sockets,road=76,pad=75){return dist(x,y,map.path)>road&&nearest(x,y,sockets)>pad;}
function layerMass(c,points,fill,edge){poly(c,points,fill);stroke(c,points.slice(0,-2),edge,2,.18);}
function terrain(map,sockets,theme){
 const {e,c}=canvas(1280,768),r=rng(192038);
 // LEVEL 1 — broad sunlit plains and varied value, with far darker corners.
 const g=c.createLinearGradient(0,0,1240,768);
 g.addColorStop(0,theme.grass1);g.addColorStop(.47,theme.grass2);g.addColorStop(1,theme.grass3);
 c.fillStyle=g;c.fillRect(0,0,1280,768);
 // LEVEL 2 — originally authored rolling terrain bands; no fake blocking cliffs.
 const hillsets=[
  {pts:[[-40,0],[1314,0],[1285,109],[1110,90],[936,130],[800,99],[633,129],[481,102],[319,139],[181,100],[-40,127]],col:theme.rim},
  {pts:[[-20,768],[1310,768],[1285,653],[1120,678],[982,621],[813,655],[640,631],[488,660],[321,624],[164,678],[-20,651]],col:theme.shade}
 ];
 hillsets.forEach((h,i)=>layerMass(c,h.pts,h.col,i?theme.grass3:theme.grass1));
 c.save();c.globalAlpha=.17;c.fillStyle=theme.vale;
 // Contour bands subtly align with terrain; no uniform noise.
 for(const group of [
  [[0,245],[120,216],[280,248],[408,225],[510,244],[669,217],[792,236],[942,206],[1081,226],[1280,207]],
  [[0,579],[119,551],[255,564],[383,535],[533,559],[713,523],[844,555],[1004,532],[1162,543],[1280,520]]
 ]){c.beginPath();c.moveTo(...group[0]);for(const [x,y] of group.slice(1))c.lineTo(x,y);c.strokeStyle=theme.rim;c.lineWidth=17;c.stroke();}
 c.restore();
 // LEVEL 3 — composed meadow islands, not evenly scattered circles.
 const clearings=[
  [138,150,222,104],[372,107,202,116],[672,111,171,95],[1028,132,241,125],
  [183,641,222,109],[454,694,203,82],[759,658,208,112],[1125,687,217,106],
  [600,349,166,81],[875,409,154,106]];
 for(let i=0;i<clearings.length;i++){
  const [x,y,w,h]=clearings[i],pieces=[];
  for(let j=0;j<16;j++){const a=j*TAU/16,k=.85+.15*r();pieces.push([x+Math.cos(a)*w*k,y+Math.sin(a)*h*k]);}
  poly(c,pieces,i%3===0?theme.rim:theme.vale,null,1,i%2?.11:.16);
  if(i%2===0)stroke(c,[[x-w*.65,y+17],[x-w*.21,y-14],[x+w*.23,y-11],[x+w*.62,y+13]],theme.warm,3,.14);
 }
 // LEVEL 4 — clusters of intentionally located leaves with hatching, not single-dot pixel noise.
 const clusters=[
  [148,76,122,44],[344,104,143,62],[528,83,165,40],[885,118,148,76],[1147,76,126,49],
  [68,667,122,63],[340,719,177,58],[683,683,139,55],[996,697,151,63],[1194,630,111,75]];
 for(const [cx,cy,rx,ry] of clusters){
  for(let i=0;i<53;i++){
   const x=cx+(r()-.5)*rx*1.8,y=cy+(r()-.5)*ry*1.5;if(!exclusion(x,y,map,sockets,67,67))continue;
   const a=(.85+r()*.35),len=3+r()*7;
   oval(c,x,y,2+r()*8,1+r()*2.5,i%4===0?theme.rim:theme.leaf,.13+r()*.24);
   if(i%9===0)stroke(c,[[x-len*.5,y+1],[x,y-len],[x+len*.3,y+.5]],theme.shade,1.8,.27);
   if(i%16===0){
    for(let k=0;k<5;k++){const th=k*TAU/5;oval(c,x+4*Math.cos(th),y+4*Math.sin(th),1.8,1.7,theme.warm,.72);}
   }
  }
 }
 // LEVEL 5 — short hand-shaped grass blades and local stone glints (large enough at logical 1x).
 for(let i=0;i<540;i++){
  const x=r()*1280,y=r()*768;if(!exclusion(x,y,map,sockets,66,70))continue;
  const len=3+r()*5;
  stroke(c,[[x-2,y+2],[x-1,y-len],[x+2,y+1]],i%2?theme.leaf:theme.rim,1.1,.3);
 }
 // Three narrative light pools, restrained so towers and HP remain brightest.
 for(const [x,y,rad] of [[101,112,115],[1106,87,109],[1119,700,135]]){
  const rg=c.createRadialGradient(x,y,1,x,y,rad);
  rg.addColorStop(0,"#fff2c130");rg.addColorStop(1,"#fff2c100");
  c.fillStyle=rg;c.fillRect(x-rad,y-rad,rad*2,rad*2);
 }
 return e;
}
function road(map,sockets,t){
 const {e,c}=canvas(1280,768),P=map.path,r=rng(162810);
 // Original 133 vertices and identical center. Max outer stroke 110.
 for(const [w,color,opacity] of [[110,t.bank,.94],[106,t.shade,.28],[102,t.soil,.90],[93,t.loam,1],[84,t.warm,.90]]){
  stroke(c,P,color,w,opacity);
 }
 // Sympathetic riverstone bands and compacted cart-tracks in world-space tangent direction.
 let cumulative=0;
 for(let i=1;i<P.length;i++){
  const a=P[i-1],b=P[i],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);if(!len)continue;
  const nx=-dy/len,ny=dx/len,ux=dx/len,uy=dy/len;
  for(let s=Math.ceil(cumulative/26)*26;s<cumulative+len;s+=26){
   const q=s-cumulative,x=a[0]+ux*q,y=a[1]+uy*q,k=Math.floor(s/26);
   if(k%3===0){
    stroke(c,[[x+nx*20-ux*6,y+ny*20-uy*6],[x+nx*20+ux*7,y+ny*20+uy*7]],t.soil,1.7,.25);
    stroke(c,[[x-nx*20-ux*8,y-ny*20-uy*8],[x-nx*20+ux*9,y-ny*20+uy*9]],t.soil,1.7,.19);
   }
   if(k%5===1){
    const side=k%2?1:-1;
    oval(c,x+nx*side*46,y+ny*side*46,2.6,1.5,t.granite,.54);
    stroke(c,[[x+nx*side*43,y+ny*side*43],[x+nx*side*48,y+ny*side*48]],t.light,1,.43);
   }
  }
  cumulative+=len;
 }
 for(let i=0;i<700;i++){
  const x=r()*1280,y=r()*768,d=dist(x,y,P);
  if(d<36&&i%3===0)stroke(c,[[x,y],[x+3+r()*5,y-1]],i%2?t.soil:t.light,1,.21);
  if(d>56&&d<63&&nearest(x,y,sockets)>64&&i%6===0){
   stroke(c,[[x-2,y+2],[x,y-3]],t.leaf,1.2,.3);
  }
 }
 return e;
}
function padArt(theme,kind,status){
 // Eight-sided stone footprint / low vertical slab. Top is for towers, NOT a luminous disc.
 const {e,c}=canvas(M03_PAD_SOURCE.width,M03_PAD_SOURCE.height),x=106,y=91;
 const rune=kind==="tempo"?theme.aether:kind==="power"?theme.metal:theme.light;
 oval(c,x+1,y+34,96,14,theme.shade,.34); // local contact shadow
 // FRONT BEVEL — three quarter octagon, chunky outline only at contact silhouette.
 poly(c,[[13,95],[43,80],[93,71],[154,75],[197,90],[195,111],[151,132],[94,139],[29,120]],theme.slate,theme.shade,3.2);
 poly(c,[[13,86],[44,69],[93,60],[153,65],[197,83],[185,99],[146,117],[92,122],[31,104]],theme.granite,theme.slate,2.5);
 poly(c,[[28,85],[52,71],[97,67],[150,72],[182,83],[171,95],[143,109],[94,113],[40,100]],theme.light,theme.granite,1.5);
 // shaded upper deck and irregular wear; no concentric neon rosette
 poly(c,[[36,87],[58,78],[99,72],[143,76],[174,87],[152,104],[99,109],[46,99]],status==="occupied"?theme.granite:theme.light,theme.slate,1.8);
 for(const [xx,yy,ww] of [[46,97,10],[67,111,10],[125,113,9],[167,97,6]]){
  stroke(c,[[xx,yy],[xx+ww,yy+3]],theme.slate,1.3,.56);
 }
 for(const [xx,yy] of [[41,86],[62,73],[151,76],[172,90]])oval(c,xx,yy,3,1.3,theme.light,.54);
 if(status==="empty"){
  // Deliberately subdued build affordance: small sigil, not a giant magic plate
  stroke(c,[[x-12,y-3],[x+12,y-3]],rune,2.6,.62);
  stroke(c,[[x,y-12],[x,y+5]],rune,2,.58);
  for(const dx of [-12,12])oval(c,x+dx,y-3,2.4,2.4,rune,.54);
 }else if(status==="occupied"){
  // Only foundation bolts visible around building base; insignia eliminated.
  for(const dx of [-26,26])oval(c,x+dx,y+2,3,2,theme.metal,.7);
 }else if(status==="ruins"){
  // Readably broken slab, not an empty build spot; NO gameplay change.
  poly(c,[[65,78],[77,72],[86,78],[79,89],[67,92]],theme.slate);
  stroke(c,[[81,73],[104,94],[96,111]],theme.slate,2.9,.85);
  stroke(c,[[120,76],[133,88],[125,105]],theme.soil,2.6,.88);
  poly(c,[[151,112],[170,98],[182,101],[166,122]],theme.slate,theme.shade,2);
 }
 return e;
}
export function preloadM03Illustrations(scene){
 preloadM02Illustrations(scene);
 for(const [id,file] of Object.entries(M03_SVGS)){
  const key="maps/m01/aurora-v3/svg/"+id;
  if(!scene.textures.exists(key))scene.load.svg(key,M03_SVG_BASE+file);
 }
}
export function makeM03ArtPlan(map){
 validateM01(map);
 const src=makeM02ArtPlan(map),sockets=visualSocketPreview(map);
 const extra=[
  {id:"m01-m03-supply",type:"supply",x:824,y:698,scale:.34,footY:698,occlusion:"low",category:"human-trace",radiusWorld:15},
  {id:"m01-m03-fern",type:"fern",x:545,y:683,scale:.28,footY:683,occlusion:"low",category:"vegetation",radiusWorld:14}
 ];
 const semanticRadius={oak:24,waymarker:13,fence:22,wagon:21,lookout:29,shrine:24,aqueduct:28};
 // Curate three distinct story zones rather than crowd the entry with tree and aqueduct.
 const landmarkSet=src.landmarks.map(v=>v.type==="shrine"?{...v,x:625,y:92,footY:92}:({...v}));
 const illustrations=src.illustrations.filter(v=>!["wagon","waymarker"].includes(v.type))
  .filter(v=>v.type!=="oak"||landmarkSet.every(l=>Math.hypot(v.x-l.x,v.y-l.y)>109))
  .map(v=>v.type==="shrine"?{...v,x:625,y:92,footY:92}:v).map(v=>({
  ...v,category:["oak"].includes(v.type)?"vegetation":"narrative",
  radiusWorld:semanticRadius[v.type]||21,
  footY:v.footY??v.y
 }));
 // Keep existing three original M02 landmarks, extra human details sit in safe clearings.
 for(const p of extra)illustrations.push(p);
 const exclusions=illustrations.filter(v=>!exclusion(v.x,v.y,map,sockets,66+(v.radiusWorld||0),58+(v.radiusWorld||0)));
 must(exclusions.length===0,"authored prop violates route/socket reserve: "+exclusions.map(x=>x.id).join(","));
 return {
  canonicalPath:map.path.map(p=>[...p]),sockets,illustrations,
  landmarks:landmarkSet,
  excludedFromPrevious:["wagon","waymarker"],
  visualWidth:M03_ROAD_WIDTH,collisionAuthority:"integrator-only",
  protagonist:"path > towers/actors > pads > terrain"
 };
}
function addTexture(scene,key,bitmap,created){
 if(!scene.textures.exists(key)){scene.textures.addCanvas(key,bitmap);created.push(key);}
}
export function mountM01WorldV3(scene,map,options={}){
 validateM01(map);
 const palette=options.palette||"equilibrada";must(M03_PALETTES.includes(palette),"palette invalid");
 const P3=makeM03ArtPlan(map),t=P[palette],prefix="maps/m01/aurora-v3/"+palette+"/";
 const resources=[],objects=[],namedLayers={terrain:[],path:[],propsLow:[],pads:[],propsHigh:[],debug:[],shadows:[]};
 const put=(o,layer)=>{objects.push(o);namedLayers[layer].push(o);return o};
 addTexture(scene,prefix+"ground",terrain(map,P3.sockets,t),resources);
 addTexture(scene,prefix+"road",road(map,P3.sockets,t),resources);
 for(const kind of ["tempo","power","focus"])for(const state of ["empty","occupied","ruins"]){
  addTexture(scene,prefix+"pad/"+kind+"/"+state,padArt(t,kind,state),resources);
 }
 put(scene.add.image(0,0,prefix+"ground").setOrigin(0).setDisplaySize(1280,768).setDepth(-5000),"terrain");
 put(scene.add.image(0,0,prefix+"road").setOrigin(0).setDisplaySize(1280,768).setDepth(-3800),"path");
 const props=[],extraKeys={supply:"maps/m01/aurora-v3/svg/supply",fern:"maps/m01/aurora-v3/svg/fern"};
 for(const model of P3.illustrations){
  const key=extraKeys[model.type]||"maps/m01/aurora-v2/svg/"+model.type;
  if(!scene.textures.exists(key))continue;
  const back=model.occlusion==="background",z=back?-1700:-1190;
  // Separate foot shadows make perspective read even on small phone.
  const shadow=put(scene.add.ellipse(model.x+3,model.y+2,Math.max(10,model.radiusWorld*1.7),Math.max(4,model.radiusWorld*.45),0x184b42,.25).setDepth(z-1),"shadows");
  const sprite=put(scene.add.image(model.x,model.y,key).setOrigin(.5,.92).setScale(model.scale).setDepth(z),back?"propsHigh":"propsLow");
  props.push({id:model.id,category:model.category,foot:{x:model.x,y:model.footY},occlusionRule:model.occlusion,
   suggestedDepth:z,visualRadiusWorld:model.radiusWorld,provisionalOccludedAlpha:back?.67:.88,
   sprite,shadow,collision:false});
 }
 const pads=[];
 for(const socket of P3.sockets){
  const source=map.spots[socket.legacySpotIndex];
  const kind=["tempo","power","focus"].includes(source.kind)?source.kind:"tempo";
  const x=socket.world.x,y=socket.world.y;
  const shadow=put(scene.add.ellipse(x,y+10,88,24,0x1a4548,.38).setDepth(-1040),"shadows");
  const sprite=put(scene.add.image(x,y,prefix+"pad/"+kind+"/empty").setOrigin(.5,.72).setScale(M03_PAD_SOURCE.scale).setDepth(-1000),"pads");
  const selection=put(scene.add.ellipse(x,y+5,94,32,0xffe1a4,.055)
   .setStrokeStyle(2.5,0xf7d78e,.95).setVisible(false).setDepth(-990),"pads");
  pads.push({socket,kind,visualState:"neutral",sprite,shadow,selection,sourcePx:M03_PAD_SOURCE,footWorld:{x,y}});
 }
 const overlay=put(scene.add.graphics().setDepth(2500),"debug");
 let disposed=false;
 function setSocketVisualState(id,state){
  if(disposed)return false;
  must(["neutral","empty","selected","occupied","ruins"].includes(state),"visual state invalid");
  const pad=pads.find(p=>p.socket.socketId===id);if(!pad)return false;
  const glyph=state==="occupied"?"occupied":state==="ruins"?"ruins":"empty";
  pad.visualState=state;
  pad.sprite.setTexture(prefix+"pad/"+pad.kind+"/"+glyph);
  pad.selection.setVisible(state==="selected");
  // The selected indicator is rendered in the debug overlay, not a global gameplay event.
  return true;
 }
 function updateDebug({showRoute=false,showClearance=false,selectedSocket=null,showOcclusion=false}={}){
  if(disposed)return;overlay.clear();
  if(showRoute){
   overlay.lineStyle(1.5,0x9af3d6,.88).beginPath().moveTo(...map.path[0]);
   for(const p of map.path.slice(1))overlay.lineTo(...p);overlay.strokePath();
   overlay.fillStyle(0xf1e7c1,.78);
   map.path.forEach(([x,y],i)=>{if(i%5===0)overlay.fillCircle(x,y,2.7);});
  }
  for(const p of pads){
   const selected=p.visualState==="selected"||p.socket.socketId===selectedSocket;
   if(!selected&&!showClearance)continue;
   overlay.lineStyle(selected?3:1.5,selected?0xf4d58e:0x8bdfdf,selected?1:.42);
   overlay.strokeCircle(p.socket.world.x,p.socket.world.y,M03_PROTOTYPE_HIT_RADIUS);
  }
  if(showOcclusion)for(const v of props)if(v.occlusionRule==="foreground-fade-candidate"){
   overlay.lineStyle(1.4,0xffdeae,.8).strokeCircle(v.foot.x,v.foot.y,v.visualRadiusWorld);
  }
 }
 function destroy(){
  if(disposed)return;disposed=true;
  for(const o of objects)if(o?.destroy)o.destroy();
  if(options.disposeTextures!==false)for(const key of resources)if(scene.textures.exists(key))scene.textures.remove(key);
 }
 return {contractVersion:"map-visual-m03-q2",artVersion:M03_VERSION,palette,
  plan:P3,objects,padObjects:pads,propObjects:props,layerGroups:namedLayers,
  occlusionMetadata:props.map(({id,foot,category,suggestedDepth,occlusionRule,visualRadiusWorld,provisionalOccludedAlpha})=>({
    id,foot,category,suggestedDepth,occlusionRule,visualRadiusWorld,provisionalOccludedAlpha
  })),
  getPadMetrics:()=>({sourceWidth:M03_PAD_SOURCE.width,visualScale:M03_PAD_SOURCE.scale,apparentWorldWidth:M03_PAD_SOURCE.approxWorldWidth,legacyM02ApproxWorldWidth:232*2*.58,hitRadiusWorld:M03_PROTOTYPE_HIT_RADIUS,ratioToTower:"NOT VERIFIED UNTIL REAL C1B SCREENSHOT"}),
  setSocketVisualState,updateDebug,updateAmbient(){},destroy};
}
