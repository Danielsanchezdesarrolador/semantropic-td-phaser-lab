/**
 * SEMANTROPIC TD / Equipo M — M04 Illustrated Terrain Pass.
 * New independent renderer, NOT an overlay of M03 (avoids retaining 34MiB underneath).
 * Phaser 4.2.1 artwork only. Canonical map geometry never written to / substituted.
 * Illustrations: hand-editable original SVGs, not hand-painted final production assets.
 * High objects expose authoring foot/occlusion metadata; global z-sort belongs to integrator.
 */
import {validateM01,visualSocketPreview} from "../renderer.mjs";
import {preloadM03Illustrations,makeM03ArtPlan} from "../m03/renderer-v3.mjs";
export const M04_VERSION="maps/m01/illustrated-m04/1.0.0";
export const M04_PALETTES=Object.freeze(["equilibrada","viva","atmosferica"]);
export const M04_WORLD=Object.freeze({width:1280,height:768,visualRoadWidth:110,hitRadiusWorld:54});
export const M04_PAD=Object.freeze({logical:[212,152],dpr:2,scale:.26,widthWorld:110.24});
export const M04_GROUND_DPR=1.5,M04_ROAD_DPR=2;
export const M04_SVG_BASE="/official/art/maps/m01/m04/svg/";
export const M04_ASSETS=Object.freeze([
 "grama-punta","grama-pluma","helecho-abanico","arbusto-tres-masas",
 "flor-miel","flor-celeste","piedra-estrato","piedra-cuarzo",
 "tronco-caido","caja-guardia","placa-alarma","helecho-rizo",
 "acueducto-guardia","santuario-refugio","puesto-alba"
]);
const TWO=2*Math.PI;
const THEMES={
 equilibrada:{top:"#b7d497",mid:"#89bd79",deep:"#427f69",cold:"#326f6a",sun:"#c6d58d",green:"#5e9875",mist:"#d9e9b5",roadEdge:"#816b58",roadEarth:"#b08b60",road:"#c6a575",roadLight:"#e4cb94",rockTop:"#ddd8bd",rockSide:"#9eaa9b",rockDark:"#435b60",wood:"#a67751",steel:"#476c73",arcane:"#79d8ce",shadow:"#234c4e"},
 viva:{top:"#c9df8d",mid:"#91c77a",deep:"#3d8661",cold:"#2f7670",sun:"#d5dc85",green:"#59a16d",mist:"#edf0a4",roadEdge:"#8e7156",roadEarth:"#c49360",road:"#d1ad76",roadLight:"#f1d49b",rockTop:"#efdfbc",rockSide:"#a8ba9d",rockDark:"#496668",wood:"#b47e50",steel:"#4d7481",arcane:"#7de0cb",shadow:"#24544b"},
 atmosferica:{top:"#b3d7b2",mid:"#83b69a",deep:"#477e74",cold:"#376e75",sun:"#c7d5a1",green:"#629784",mist:"#d5e4c4",roadEdge:"#7b6b60",roadEarth:"#a59078",road:"#c5b093",roadLight:"#e4d8bd",rockTop:"#e1e5d6",rockSide:"#a3b5b6",rockDark:"#506b76",wood:"#a28968",steel:"#547584",arcane:"#91d4d4",shadow:"#2e515a"}
};
const must=(condition,label)=>{if(!condition)throw Error("[M04] "+label)};
const rng=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
function layer(w,h,dpr){
 const el=document.createElement("canvas");el.width=Math.round(w*dpr);el.height=Math.round(h*dpr);
 const c=el.getContext("2d");must(c,"Canvas 2D texture baking not available");
 c.setTransform(dpr,0,0,dpr,0,0);c.lineJoin="round";c.lineCap="round";return {el,c};
}
function shape(c,pts,fill,outline=null,width=1,alpha=1){
 if(pts.length<3)return;c.save();c.globalAlpha=alpha;c.beginPath();c.moveTo(...pts[0]);for(const p of pts.slice(1))c.lineTo(...p);c.closePath();c.fillStyle=fill;c.fill();
 if(outline){c.lineWidth=width;c.strokeStyle=outline;c.stroke();}c.restore();
}
function line(c,pts,col,w=2,alpha=1){
 if(pts.length<2)return;c.save();c.globalAlpha=alpha;c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(...pts[0]);for(const p of pts.slice(1))c.lineTo(...p);c.stroke();c.restore();
}
function ellipse(c,x,y,rx,ry,fill,alpha=1){
 c.save();c.globalAlpha=alpha;c.beginPath();c.ellipse(x,y,rx,ry,0,0,TWO);c.fillStyle=fill;c.fill();c.restore();
}
function dRoute(x,y,route){
 let best=Infinity;
 for(let i=1;i<route.length;i++){const a=route[i-1],b=route[i],dx=b[0]-a[0],dy=b[1]-a[1],z=dx*dx+dy*dy;
  const t=z?Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/z)):0;
  best=Math.min(best,Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy));
 }return best;
}
const dPad=(x,y,sockets)=>Math.min(...sockets.map(s=>Math.hypot(x-s.world.x,y-s.world.y)));
function safe(x,y,r,map,sockets,{road=65,pad=61}={}){
 return dRoute(x,y,map.path)>road+r && dPad(x,y,sockets)>pad+r;
}
function patch(c,x,y,w,h,fill,rand,opacity=.14,forms=13){
 const pts=[];for(let i=0;i<forms;i++){const ang=TWO*i/forms,q=.82+.24*rand();pts.push([x+Math.cos(ang)*w*q,y+Math.sin(ang)*h*q]);}
 shape(c,pts,fill,null,1,opacity);
}
function paintTerrain(map,sockets,p){
 const {el,c}=layer(1280,768,M04_GROUND_DPR),r=rng(492004);
 const g=c.createLinearGradient(0,0,1180,700);
 g.addColorStop(0,p.top);g.addColorStop(.46,p.mid);g.addColorStop(1,p.deep);
 c.fillStyle=g;c.fillRect(0,0,1280,768);
 // A — open guardland (west). B — sheltering steppe (center). C — fortified verge (east).
 const terraces=[
  [[-30,0],[1310,0],[1280,127],[1185,114],[1108,93],[974,123],[823,96],[694,127],[532,99],[404,144],[268,111],[106,131],[-30,104]],
  [[-30,768],[1310,768],[1280,637],[1151,675],[1017,630],[870,660],[751,624],[605,648],[475,620],[325,670],[173,633],[-30,678]]
 ];
 terraces.forEach((poly,i)=>{shape(c,poly,i?p.cold:p.mist,null,1,i?.18:.13);
  line(c,poly.slice(3,-1),i?p.shadow:p.sun,4,i?.19:.28);});
 // Contour bands cast nuanced contact shadows on large grass shelves.
 for(const sector of [
  {x:140,y:128,w:226,h:113},{x:422,y:142,w:214,h:130},{x:726,y:118,w:221,h:136},{x:1085,y:145,w:207,h:121},
  {x:160,y:666,w:241,h:121},{x:449,y:692,w:213,h:123},{x:755,y:676,w:206,h:103},{x:1088,y:683,w:235,h:120},
  {x:611,y:374,w:136,h:90},{x:928,y:443,w:166,h:108}
 ]){
  patch(c,sector.x,sector.y+10,sector.w,sector.h,p.shadow,r,.065);
  patch(c,sector.x,sector.y,sector.w*.97,sector.h*.91,p.sun,r,.10);
  patch(c,sector.x-sector.w*.14,sector.y-sector.h*.12,sector.w*.69,sector.h*.55,p.mist,r,.15);
  line(c,[[sector.x-sector.w*.59,sector.y+4],[sector.x-sector.w*.19,sector.y-sector.h*.15],[sector.x+sector.w*.17,sector.y-sector.h*.21]],p.top,2.5,.33);
 }
 // Compact foot tracks outside main road around historic guard outposts (not new routes).
 for(const [x,y,s] of [[132,190,.78],[584,135,.65],[1125,677,.6]]){
  if(dRoute(x,y,map.path)<82)continue;
  ellipse(c,x,y,68*s,27*s,p.roadEarth,.15);
  for(let k=0;k<7;k++){
   const off=(k-3)*14*s;ellipse(c,x+off,y+(k%2)*5*s,5*s,2.4*s,p.roadEdge,.17);
  }
 }
 // Layered grass shelves are authored in clusters, not filled with uniform random noise.
 const islands=[
  [128,62,104,46],[315,118,130,65],[531,86,126,51],[761,101,108,59],[1013,102,122,63],[1181,86,112,47],
  [96,670,128,73],[319,691,133,66],[552,692,110,69],[816,692,132,72],[1073,669,141,59],[1205,716,71,45]
 ];
 for(const [cx,cy,rx,ry] of islands){
  for(let i=0;i<52;i++){
   const x=cx+(r()-.5)*2*rx,y=cy+(r()-.5)*2*ry;
   if(!safe(x,y,3,map,sockets,{road:65,pad:65}))continue;
   const w=4+r()*11,h=1.4+r()*5;
   ellipse(c,x+2,y+2,w,h,p.shadow,.09);
   ellipse(c,x,y,w,h,i%4===0?p.sun:p.green,.19+r()*.21);
   if(i%12===0){line(c,[[x-3,y+1],[x,y-7],[x+4,y]],p.deep,1.8,.22);}
  }
 }
 // Low-density large enough accent microdetail; reserved tactical negative space.
 for(let i=0;i<560;i++){
  const x=r()*1280,y=r()*768;
  if(!safe(x,y,4,map,sockets,{road:72,pad:75}))continue;
  const h=2+r()*6;line(c,[[x-2,y+1],[x,y-h],[x+2,y]],i%3?p.green:p.mist,1+r()*.4,.25);
  if(i%42===0)ellipse(c,x+3,y-3,2,1.8,p.sun,.64);
 }
 // Subtle directional sun glazes limited to environmental corners (HUD has no color overlay).
 const glow=c.createRadialGradient(180,-40,0,180,-40,600);
 glow.addColorStop(0,"#fff5ba37");glow.addColorStop(1,"#fff5ba00");c.fillStyle=glow;c.fillRect(0,0,750,640);
 return el;
}
function paintRoad(map,sockets,p){
 const {el,c}=layer(1280,768,M04_ROAD_DPR),P=map.path,rand=rng(1964);
 // All five stroke widths share exact V5 centerline; outer contour max=110.
 for(const [width,color,alpha] of [[110,p.shadow,.69],[106,p.roadEdge,.92],[102,p.roadEarth,1],[92,p.road,1],[82,p.roadLight,.93]])line(c,P,color,width,alpha);
 let traveled=0;
 for(let i=1;i<P.length;i++){
  const a=P[i-1],b=P[i],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);if(!len)continue;
  const ux=dx/len,uy=dy/len,nx=-uy,ny=ux;
  for(let marker=Math.ceil(traveled/31)*31;marker<traveled+len;marker+=31){
   const d=marker-traveled,x=a[0]+ux*d,y=a[1]+uy*d,k=Math.floor(marker/31);
   if(k%3===0){
    for(const dir of [-1,1])line(c,[[x+nx*dir*18-ux*6,y+ny*dir*18-uy*6],[x+nx*dir*18+ux*8,y+ny*dir*18+uy*8]],p.roadEarth,1.7,.24);
   }
   if(k%4===1){const side=k%2?1:-1;
    ellipse(c,x+nx*side*47,y+ny*side*47,2.3,1.2,p.rockTop,.64);
    ellipse(c,x+nx*side*48+2,y+ny*side*48+2,3.1,1.3,p.roadEdge,.22);
   }
  }
  traveled+=len;
 }
 for(let i=0;i<630;i++){
  const x=rand()*1280,y=rand()*768,z=dRoute(x,y,P);
  if(z<36&&i%4===0)line(c,[[x,y],[x+2+rand()*5,y-1]],i%2?p.roadEarth:p.roadLight,.8+rand(),.20);
  if(z>56&&z<65&&dPad(x,y,sockets)>66&&i%9===0)line(c,[[x,y],[x+2,y-4]],p.green,1.4,.37);
 }
 return el;
}
function paintPad(p,kind,state){
 const {el,c}=layer(212,152,2),x=106,y=91;
 const accent=kind==="tempo"?p.arcane:kind==="power"?p.metal:p.sun;
 ellipse(c,x+2,y+34,97,14,p.shadow,.31);
 shape(c,[[14,93],[41,79],[94,70],[155,76],[196,91],[192,111],[148,131],[91,138],[30,120]],p.rockDark,p.shadow,3);
 shape(c,[[14,84],[44,68],[95,59],[154,65],[196,82],[185,99],[143,116],[92,122],[31,103]],p.rockSide,p.rockDark,2.1);
 shape(c,[[29,84],[56,72],[100,65],[150,73],[180,84],[169,96],[142,108],[94,112],[43,99]],p.rockTop,p.rockSide,1.6);
 shape(c,[[42,85],[66,77],[99,72],[143,78],[170,86],[147,101],[98,106],[48,96]],state==="occupied"?p.rockSide:p.rockTop,p.rockDark,1.5);
 for(const [xx,yy] of [[48,99],[73,111],[125,110],[160,102]]){
  line(c,[[xx,yy],[xx+7,yy+3]],p.rockDark,1.3,.55);
 }
 if(state==="empty"){
  line(c,[[x-11,y-3],[x+11,y-3]],accent,2,.46);line(c,[[x,y-12],[x,y+5]],accent,2,.44);
 }else if(state==="occupied"){
  for(const dx of [-22,22])ellipse(c,x+dx,y+1,2.6,1.6,p.metal,.68);
 }else{
  line(c,[[71,75],[86,87],[80,102]],p.rockDark,2.9,.77);
  line(c,[[123,77],[134,94],[125,105]],p.roadEarth,2.2,.73);
  shape(c,[[151,108],[167,101],[179,104],[168,116]],p.rockDark);
 }
 return el;
}
const M04_DENSITY=Object.freeze({
 entrance:{label:"guardland",purpose:"wide meadows, abandoned guard supplies"},
 middle:{label:"refuge",purpose:"wind shelter, alarm device, cut stones"},
 exit:{label:"defended verge",purpose:"watch-post, intentional military supply clusters"}
});
const CASES=[
 // Each entry is deliberate, world-foot based; image width=200 logical pixels.
 ["grama-punta",76,78,.42,"entrance"],["flor-miel",233,88,.33,"entrance"],["piedra-estrato",287,131,.42,"entrance"],
 ["arbusto-tres-masas",154,680,.43,"entrance"],["tronco-caido",276,706,.38,"entrance"],
 ["grama-pluma",441,116,.43,"middle"],["helecho-abanico",545,671,.40,"middle"],
 ["caja-guardia",579,121,.40,"middle"],["placa-alarma",689,93,.32,"middle"],
 ["piedra-cuarzo",775,692,.38,"middle"],["flor-celeste",897,675,.35,"middle"],
 ["helecho-rizo",1160,157,.38,"exit"],["arbusto-tres-masas",1120,682,.44,"exit"],
 ["piedra-estrato",1191,670,.34,"exit"],["caja-guardia",1181,737,.37,"exit"],
 ["flor-miel",1036,111,.32,"exit"],["grama-punta",1026,697,.40,"exit"],
 // Alternate different rhythm and masses
 ["arbusto-tres-masas",61,200,.38,"entrance"],["flor-celeste",349,694,.33,"entrance"],
 ["helecho-rizo",915,109,.36,"middle"],["piedra-cuarzo",473,75,.40,"middle"],["grama-pluma",1224,628,.35,"exit"]
];
export function makeM04ArtPlan(map){
 validateM01(map);
 const sockets=visualSocketPreview(map),m03=makeM03ArtPlan(map);
 const landmarkType={aqueduct:"acueducto-guardia",shrine:"santuario-refugio",lookout:"puesto-alba"};
 const narrative=m03.illustrations.filter(x=>["aqueduct","shrine","lookout"].includes(x.type)).map(o=>({
  type:landmarkType[o.type],originalM03Type:o.type,scale:o.type==="shrine"?.34:o.type==="lookout"?.49:.46,
  ...o,id:"m04-"+o.type,sector:o.type==="aqueduct"?"entrance":o.type==="shrine"?"middle":"exit",
  source:"M04 original illustrated landmark SVG replacing M02 silhouette",category:"landmark",layer:"propsHigh",
  visualRadiusWorld:o.radiusWorld??30,occlusionRule:o.occlusion==="foreground-fade-candidate"?"foreground-fade-candidate":"background",
  foot:{x:o.x,y:o.footY??o.y}
 }));
 const props=[],rejected=[];
 for(const [type,x,y,scale,sector] of CASES){
  const r=200*scale*.39; // conservative sprite silhouette envelope, not just foot
  const ok=safe(x,y,r,map,sockets,{road:66,pad:69});
  const candidate={id:"m04-"+type+"-"+String(props.length+1).padStart(2,"0"),type,x,y,scale,sector,
   foot:{x,y},layer:"propsLow",category:/flor|grama|helecho|arbusto/.test(type)?"vegetation":/piedra/.test(type)?"rock":"human-trace",
   visualRadiusWorld:r,occlusionRule:"none",provisionalOccludedAlpha:1};
  if(ok)props.push(candidate);else rejected.push({type,x,y,reason:"route-or-socket-visual-safety"});
 }
 // Ground details do not cover the moving path or pickup areas.
 return {sockets,canonicalRoute:map.path.map(p=>[...p]),visualRoadWidth:110,props,landmarks:narrative,rejected,
  densityPlan:M04_DENSITY,footprintAuthority:"integrator",collisionAuthority:"integrator"};
}
export function preloadM04Illustrations(scene){
 preloadM03Illustrations(scene);
 for(const key of M04_ASSETS){
  const name="maps/m01/illustrated-m04/svg/"+key;
  if(!scene.textures.exists(name))scene.load.svg(name,M04_SVG_BASE+key+".svg");
 }
}
function register(scene,key,bitmap,generated){
 if(!scene.textures.exists(key)){scene.textures.addCanvas(key,bitmap);generated.push(key);}
}
export function mountM01WorldV4(scene,map,{palette="equilibrada",disposeTextures=true}={}){
 validateM01(map);must(M04_PALETTES.includes(palette),"unsupported palette");
 const plan=makeM04ArtPlan(map),p=THEMES[palette],root="maps/m01/illustrated-m04/"+palette+"/";
 const generated=[],objects=[],groups={terrain:[],path:[],propsLow:[],pads:[],propsHigh:[],shadow:[],dev:[]};
 const own=(sprite,type)=>{objects.push(sprite);groups[type].push(sprite);return sprite;};
 register(scene,root+"ground",paintTerrain(map,plan.sockets,p),generated);
 register(scene,root+"road",paintRoad(map,plan.sockets,p),generated);
 for(const kind of ["tempo","power","focus"])for(const state of ["empty","occupied","ruins"])
  register(scene,root+"pad/"+kind+"/"+state,paintPad(p,kind,state),generated);
 own(scene.add.image(0,0,root+"ground").setOrigin(0).setDisplaySize(1280,768).setDepth(-5000),"terrain");
 own(scene.add.image(0,0,root+"road").setOrigin(0).setDisplaySize(1280,768).setDepth(-3800),"path");
 const layerProps=[],missing=[];
 const putProp=(m,key)=>{
  if(!scene.textures.exists(key)){missing.push({id:m.id,key});return;}
  const high=m.layer==="propsHigh",depth=high?-1700:-1210;
  const shadow=own(scene.add.ellipse(m.x+3,m.y+2,Math.max(13,m.visualRadiusWorld*1.65),Math.max(5,m.visualRadiusWorld*.37),0x184a43,.29).setDepth(depth-1),"shadow");
  const sprite=own(scene.add.image(m.x,m.y,key).setOrigin(.5,.92).setScale(m.scale).setDepth(depth),high?"propsHigh":"propsLow");
  layerProps.push({id:m.id,category:m.category,sector:m.sector,foot:m.foot,visualRadiusWorld:m.visualRadiusWorld,
   occlusionRule:m.occlusionRule,provisionalOccludedAlpha:m.provisionalOccludedAlpha??.67,
   suggestedDepth:depth,sprite,shadow,noCollision:true});
 };
 for(const prop of plan.props)putProp(prop,"maps/m01/illustrated-m04/svg/"+prop.type);
 for(const prop of plan.landmarks)putProp(prop,"maps/m01/illustrated-m04/svg/"+prop.type);
 const pads=[];
 for(const s of plan.sockets){
  const spot=map.spots[s.legacySpotIndex],kind=["tempo","power","focus"].includes(spot.kind)?spot.kind:"tempo";
  const shadow=own(scene.add.ellipse(s.world.x,s.world.y+9,85,21,0x194944,.37).setDepth(-1040),"shadow");
  const sprite=own(scene.add.image(s.world.x,s.world.y,root+"pad/"+kind+"/empty").setOrigin(.5,.72).setScale(M04_PAD.scale).setDepth(-1000),"pads");
  const selection=own(scene.add.ellipse(s.world.x,s.world.y+4,93,29,0xffdfa4,.04).setStrokeStyle(2,0xf6e1a9,.88).setVisible(false).setDepth(-991),"pads");
  pads.push({socket:s,kind,visualState:"neutral",sprite,shadow,selection,footWorld:{...s.world}});
 }
 const overlay=own(scene.add.graphics().setDepth(2300),"dev");
 let disposed=false;
 function setSocketVisualState(socketId,status){
  if(disposed)return false;must(["neutral","empty","selected","occupied","ruins"].includes(status),"unknown visual pad status");
  const item=pads.find(x=>x.socket.socketId===socketId);if(!item)return false;
  item.visualState=status;item.sprite.setTexture(root+"pad/"+item.kind+"/"+(status==="occupied"?"occupied":status==="ruins"?"ruins":"empty"));
  item.selection.setVisible(status==="selected");
  return true;
 }
 function updateDebug({showRoute=false,showClearance=false,showOcclusion=false,selectedSocket=null}={}){
  if(disposed)return;overlay.clear();
  if(showRoute){
   overlay.lineStyle(2,0x8ce9d8,.85).beginPath().moveTo(...map.path[0]);
   for(const point of map.path.slice(1))overlay.lineTo(...point);
   overlay.strokePath();
  }
  for(const pad of pads){
   const selected=pad.visualState==="selected"||pad.socket.socketId===selectedSocket;
   if(selected||showClearance){
    overlay.lineStyle(selected?2.4:1.1,selected?0xffe0a9:0xa6dfd0,selected?1:.45);
    overlay.strokeCircle(pad.socket.world.x,pad.socket.world.y,54);
   }
  }
  if(showOcclusion)for(const prop of layerProps){
   if(prop.occlusionRule==="foreground-fade-candidate")overlay.lineStyle(1.4,0xffd68d,.7).strokeCircle(prop.foot.x,prop.foot.y,prop.visualRadiusWorld);
  }
 }
 function destroy(){
  if(disposed)return;disposed=true;
  for(const o of objects)if(o?.destroy)o.destroy();
  if(disposeTextures)for(const key of generated)if(scene.textures.exists(key))scene.textures.remove(key);
 }
 return {contractVersion:"map-visual-m04-v1",artVersion:M04_VERSION,palette,plan,objects,layerGroups:groups,
  padObjects:pads,propObjects:layerProps,missing,
  occlusionMetadata:layerProps.map(({id,foot,category,sector,visualRadiusWorld,occlusionRule,provisionalOccludedAlpha,suggestedDepth})=>({
   id,foot,category,sector,visualRadiusWorld,occlusionRule,provisionalOccludedAlpha,suggestedDepth})),
  getPadMetrics:()=>({textureWorldWidth:M04_PAD.widthWorld,interactiveRadiusWorld:54,ratioToT04:"UNVERIFIED_IN_REAL_INTEGRATION"}),
  setSocketVisualState,updateDebug,updateAmbient(){},destroy};
}
export function getM04PaletteGuide(){return Object.fromEntries(M04_PALETTES.map(name=>[name,{...THEMES[name]}]));}
