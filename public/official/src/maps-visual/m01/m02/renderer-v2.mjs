/**
 * SEMANTROPIC TD · M-02, Aurora v2 — visual-only world renderer.
 * Team M / ownership. Three curated SVG landmarks, individually drawn reusable SVG
 * assets and painterly Canvas2D terrain decals baked to Phaser textures ONCE.
 * Paths and socket positions are never duplicated or mutated.
 *
 * This module does NOT implement buildability, combat, collisions, HP or economics.
 * Canonical adapters and scene integration remain Integrator-owned.
 */
import {validateM01,makeArtPlan,visualSocketPreview} from "../renderer.mjs";
export const M02_VERSION="maps/m01/aurora-v2/1.0.0";
export const M02_WORLD=Object.freeze({width:1280,height:768});
export const M02_ROAD_WIDTH=110;
export const M02_PALETTES=Object.freeze(["equilibrada","viva","atmosferica"]);
export const M02_DRAW_DPR=2;
export const M02_SVG_PREFIX="/official/art/maps/m01/m02/svg/";
export const M02_SVGS=Object.freeze({
 lookout:"watch-post.svg",shrine:"signal-shrine.svg",aqueduct:"aqueduct-remnant.svg",
 oak:"oak-illustrated.svg",waymarker:"waymarker.svg",fence:"fence-remnant.svg",wagon:"wagon-crate.svg"
});
const TWO=Math.PI*2;
const THEMES={
 equilibrada:{light:"#cfe6a0",mid:"#8fbd7a",dark:"#3d8066",meadow:"#75aa6e",leaf:"#529569",leafLight:"#c0d889",soil:"#ddba82",roadLight:"#efd4a1",roadMid:"#cba371",roadShadow:"#906a4c",border:"#5e7754",stone:"#aab9a4",stoneLight:"#e2dac1",stoneDark:"#546c71",gold:"#e4ba75",arcane:"#79cbbd",ink:"#264d52",ambient:"#fff3b9",translucent:"#e9f1dc"},
 viva:{light:"#d9ef9a",mid:"#9dcc73",dark:"#398e64",meadow:"#7dbb69",leaf:"#43a05e",leafLight:"#d3e58a",soil:"#e7bc76",roadLight:"#f5d79a",roadMid:"#dbad6a",roadShadow:"#956947",border:"#567953",stone:"#b4bca0",stoneLight:"#f4e1b5",stoneDark:"#4d7074",gold:"#f0c079",arcane:"#78dcc8",ink:"#245450",ambient:"#fff0a1",translucent:"#edf1d2"},
 atmosferica:{light:"#bfd9b1",mid:"#7cb395",dark:"#387f76",meadow:"#76a991",leaf:"#488b75",leafLight:"#b3d4ad",soil:"#d3bb9c",roadLight:"#e7d5b4",roadMid:"#c6aa8d",roadShadow:"#806f5d",border:"#52716a",stone:"#a3b8b4",stoneLight:"#dfdfd0",stoneDark:"#526e79",gold:"#dbc092",arcane:"#91d7d4",ink:"#2d5860",ambient:"#eef9d7",translucent:"#e1eeed"}
};
const assert=(ok,msg)=>{if(!ok)throw Error("[M02] "+msg)};
const rng=(seed)=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
function canvas(w=1280,h=768,dpr=M02_DRAW_DPR){
 const el=document.createElement("canvas");el.width=w*dpr;el.height=h*dpr;
 const ctx=el.getContext("2d");assert(ctx,"Canvas2D bake unavailable");
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.lineJoin="round";ctx.lineCap="round";
 return {el,c:ctx};
}
function poly(c,pts,fill,stroke="",width=2){
 c.beginPath();c.moveTo(...pts[0]);for(const p of pts.slice(1))c.lineTo(...p);c.closePath();
 if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.lineWidth=width;c.strokeStyle=stroke;c.stroke();}
}
function line(c,pts,color,width=2,alpha=1){
 c.save();c.globalAlpha=alpha;c.lineWidth=width;c.strokeStyle=color;c.beginPath();c.moveTo(...pts[0]);for(const p of pts.slice(1))c.lineTo(...p);c.stroke();c.restore();
}
function ellipse(c,x,y,rx,ry,fill,alpha=1,angle=0){
 c.save();c.globalAlpha=alpha;c.beginPath();c.ellipse(x,y,rx,ry,angle,0,TWO);c.fillStyle=fill;c.fill();c.restore();
}
function routePointDistance(x,y,path){
 let best=Infinity;
 for(let i=1;i<path.length;i++){
  const a=path[i-1],b=path[i],dx=b[0]-a[0],dy=b[1]-a[1],l=dx*dx+dy*dy;
  const t=l?Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/l)):0;
  best=Math.min(best,Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy));
 }
 return best;
}
function socketDistance(x,y,sockets){return Math.min(...sockets.map(p=>Math.hypot(x-p.world.x,y-p.world.y)));}
function drawOrganic(c,x,y,rx,ry,fill,r,alpha){
 const pts=[];for(let i=0;i<18;i++){const a=i*TWO/18,d=.81+.27*r();pts.push([x+rx*d*Math.cos(a),y+ry*d*Math.sin(a)])}
 c.save();c.globalAlpha=alpha;poly(c,pts,fill);c.restore();
}
function drawHills(c,colors){
 const bands=[
 [[-20,142],[56,106],[151,122],[242,93],[341,118],[428,91],[514,118],[607,94],[690,111],[784,85],[896,109],[1012,79],[1129,101],[1300,76]],
 [[-20,636],[96,611],[186,639],[283,599],[401,614],[533,594],[652,629],[774,600],[897,635],[1025,605],[1130,639],[1296,615]]
 ];
 for(const [n,points] of bands.entries()){
  const polygon=n===0?[...points,[1300,0],[-20,0]]:[...points,[1300,780],[-20,780]];
  c.save();c.globalAlpha=n===0?.12:.11;poly(c,polygon,n===0?colors.light:colors.dark);c.restore();
  line(c,points,colors.light,4,n===0?.32:.15);
 }
 // Warm morning light from northwest; long soft shadow toward southeast.
 const ambient=c.createRadialGradient(150,25,0,150,25,650);
 ambient.addColorStop(0,"#fff4b84f");ambient.addColorStop(1,"#fff4b800");
 c.fillStyle=ambient;c.fillRect(0,0,800,700);
}
function drawGround(map,sockets,colors,variant){
 const {el,c}=canvas(),r=rng(20261019);
 const base=c.createLinearGradient(0,0,1020,768);
 base.addColorStop(0,colors.light);base.addColorStop(.36,colors.mid);base.addColorStop(1,colors.dark);
 c.fillStyle=base;c.fillRect(0,0,1280,768);
 drawHills(c,colors);
 // Eleven composed meadow basins — terrain storytelling, not noise blanket.
 const masses=[
 [96,131,240,155],[396,130,209,116],[689,81,226,135],[1027,119,249,139],
 [161,651,235,119],[455,719,221,121],[779,684,205,119],[1124,693,248,111],
 [383,350,122,82],[796,397,164,115],[1125,469,113,84]];
 for(let i=0;i<masses.length;i++){
  const [x,y,rx,ry]=masses[i];
  drawOrganic(c,x,y,rx,ry,i%2?colors.meadow:colors.light,r,i%2?.17:.16);
  line(c,[[x-rx*.68,y+ry*.1],[x-rx*.3,y-ry*.22],[x+rx*.37,y-ry*.16]],colors.light,2.4,.29);
 }
 const patches=[
 [112,72,95,51],[329,101,138,67],[633,90,146,58],[1062,71,131,59],
 [69,637,102,74],[351,699,134,75],[732,673,140,66],[1039,668,158,88]];
 for(const [cx,cy,rx,ry] of patches){
  for(let i=0;i<66;i++){
   const x=cx+(r()-.5)*rx*1.8,y=cy+(r()-.5)*ry*1.6;
   if(routePointDistance(x,y,map.path)<72||socketDistance(x,y,sockets)<67)continue;
   ellipse(c,x,y,2+r()*9,1.7+r()*4,i%4===0?colors.leafLight:colors.leaf,.13+r()*.25);
   if(i%16===0){
    for(let k=0;k<5;k++){const a=k*TWO/5;ellipse(c,x+4*Math.cos(a),y+4*Math.sin(a),2,2,colors.ambient,.75);}
   }
  }
 }
 // Deliberate grass clusters in reserved-free zones; bake as a SINGLE texture.
 for(let i=0;i<1820;i++){
  const x=r()*1280,y=r()*768;if(routePointDistance(x,y,map.path)<65||socketDistance(x,y,sockets)<66)continue;
  const ht=2+r()*7,a=r()*4;line(c,[[x-2,y+2],[x-a,y-ht],[x+1,y+1]],i%3===0?colors.light:colors.leaf,1+r()*.6,.2+r()*.27);
  if(i%34===0)ellipse(c,x,y-4,2.1,1.5,colors.ambient,.65);
 }
 // Material texture: strategic softly shaded rock outcrops and streaks, not obstacles.
 for(const [x,y,size] of [[241,53,27],[601,112,15],[906,665,21],[1180,712,24],[55,685,17],[1115,77,18]]){
  if(routePointDistance(x,y,map.path)<81||socketDistance(x,y,sockets)<71)continue;
  ellipse(c,x+3,y+5,size*1.1,size*.35,colors.ink,.13);
  poly(c,[[x-size,y],[x-size*.6,y-size*.55],[x+size*.23,y-size*.72],[x+size,y-size*.1],[x+size*.6,y+size*.31],[x-size*.5,y+size*.29]],colors.stone,colors.stoneDark,2);
  poly(c,[[x-size*.6,y-size*.55],[x+size*.23,y-size*.72],[x+size,y-size*.1],[x+size*.17,y-size*.27]],colors.stoneLight);
 }
 return el;
}
function roadTexture(map,sockets,colors){
 const {el,c}=canvas(),path=map.path,r=rng(1937701);
 // The center follows EXACTLY the 133 V5 vertices. Only the painterly border is irregular.
 for(const [width,color] of [[110,colors.ink],[106,colors.border],[100,colors.roadShadow],[93,colors.roadMid],[86,colors.roadLight]]){
  line(c,path,color,width,width===110?.39:1);
 }
 // Hand-tuned periodic bank stones spaced by arc length; deterministic coordinate projection.
 let distance=0,marker=0;
 for(let i=1;i<path.length;i++){
  const a=path[i-1],b=path[i],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);
  if(len<.01)continue;
  const ux=dx/len,uy=dy/len,nx=-uy,ny=ux;
  let offset=(Math.ceil(distance/32)*32)-distance;
  while(offset<len){
   const f=offset/len,s=distance+offset,variant=Math.floor(s/32);
   const x=a[0]+dx*f,y=a[1]+dy*f,flip=variant%2?1:-1;
   // Soft worn wheel track at ±19 from center, not a second path.
   if(variant%3===0)line(c,[[x+nx*19-ux*5,y+ny*19-uy*5],[x+nx*19+ux*8,y+ny*19+uy*8]],colors.roadShadow,1.8,.19);
   if(variant%4===0)line(c,[[x-nx*19-ux*6,y-ny*19-uy*6],[x-nx*19+ux*9,y-ny*19+uy*9]],colors.roadShadow,1.8,.18);
   // Perspective pebble beside the outer bank. Does not look like a collider.
   if(variant%3===1)ellipse(c,x+nx*flip*48,y+ny*flip*48,2.7+(variant%4),1.6,colors.stoneLight,.58);
   offset+=32;
  }
  distance+=len;
 }
 for(let i=0;i<760;i++){
  const x=r()*1280,y=r()*768,d=routePointDistance(x,y,path);
  if(d<=36){if(i%6===0)ellipse(c,x,y,1+r()*3,.8+r(),colors.roadShadow,.27);
   else line(c,[[x,y],[x+2+r()*5,y-.8]],i%2===0?colors.roadShadow:colors.ambient,.7+r()*.9,.13+r()*.16);}
  if(d>57&&d<63&&socketDistance(x,y,sockets)>63&&i%8===0){
   line(c,[[x,y+2],[x+1,y-3]],colors.leaf,1.3,.37);}
 }
 return el;
}
function platformTexture(colors,kind){
 const {el,c}=canvas(232,184),x=116,y=118;
 const rune=kind==="tempo"?colors.arcane:kind==="power"?colors.gold:colors.translucent;
 ellipse(c,x,y+31,103,16,colors.ink,.25);
 poly(c,[[12,105],[42,80],[102,64],[162,76],[220,100],[196,132],[125,165],[55,145]],colors.stoneDark,colors.ink,4);
 poly(c,[[12,96],[45,70],[102,55],[163,67],[220,94],[195,125],[125,151],[55,135]],colors.stone,colors.stoneDark,4);
 poly(c,[[28,95],[57,77],[106,64],[161,77],[200,97],[127,137],[57,123]],colors.stoneLight,colors.stoneDark,2.4);
 poly(c,[[37,97],[70,88],[110,76],[154,85],[188,101],[127,127],[65,116]],colors.stone,colors.stoneDark,2);
 for(const [a,b] of [[51,116],[78,126],[147,132],[183,114]])line(c,[[a,b],[a+10,b+4]],colors.stoneLight,2,.82);
 // Chiseled radial joints, mild arcane filigree, no false build state.
 for(let k=0;k<8;k++){const t=k*TWO/8;line(c,[[x+Math.cos(t)*47,y-12+Math.sin(t)*20],[x+Math.cos(t)*74,y-12+Math.sin(t)*29]],colors.stoneDark,2.2,.75);}
 ellipse(c,x,y-13,38,16,colors.ink,.64);
 ellipse(c,x,y-16,32,11,rune,.34);
 c.save();c.translate(x,y-16);c.scale(1,.5);c.beginPath();c.arc(0,0,33,.22,5.95);c.strokeStyle=rune;c.lineWidth=3.1;c.stroke();c.restore();
 line(c,[[x-12,y-16],[x+12,y-16]],rune,3,.85);line(c,[[x,y-27],[x,y-5]],rune,3,.86);
 for(const dir of [-1,1]){
  const xx=x+dir*68;
  poly(c,[[xx-7,y-8],[xx-2,y-35],[xx+5,y-39],[xx+12,y-11],[xx+4,y+1]],colors.stoneDark,colors.ink,2);
  ellipse(c,xx,y-33,4,4,rune,.92);
 }
 return el;
}
function texture(scene,key,cv,owned){
 if(scene.textures.exists(key))return false;
 scene.textures.addCanvas(key,cv);owned.push(key);return true;
}
function release(scene,keys){
 for(const key of keys)if(scene.textures.exists(key))scene.textures.remove(key);
}
export function preloadM02Illustrations(scene,base=M02_SVG_PREFIX){
 for(const [id,file] of Object.entries(M02_SVGS)){
  const key="maps/m01/aurora-v2/svg/"+id;
  if(!scene.textures.exists(key))scene.load.svg(key,base+file);
 }
}
export function makeM02ArtPlan(map){
 validateM01(map);const plan=makeArtPlan(map);
 const landmarks=[
  {id:"m01-m02-aqueduct",type:"aqueduct",x:102,y:113,scale:.47,footY:113,occlusion:"background",semantic:"Antiguo acueducto defensivo fragmentado"},
  {id:"m01-m02-shrine",type:"shrine",x:1106,y:88,scale:.32,footY:88,occlusion:"background",semantic:"Baliza arcana de alarma temprana"},
  {id:"m01-m02-lookout",type:"lookout",x:1119,y:725,scale:.52,footY:725,occlusion:"foreground-fade-candidate",semantic:"Puesto de vigilancia de la Guardia del Amanecer"}
 ];
 const backgroundTrees=plan.props.filter(p=>p.type==="oak");
 const waymarkers=plan.props.filter(p=>p.type==="banner").map(p=>({...p,type:"waymarker",scale:.42}));
 const others=plan.props.filter(p=>["lantern","stone","flowers","bush"].includes(p.type));
 const illustrations=[
  ...backgroundTrees.map(p=>({...p,type:"oak",scale:Math.min(.45,p.scale*.60),footY:p.y,occlusion:"background"})),
  ...waymarkers.map(p=>({...p,footY:p.y,occlusion:"low"})),
  {id:"m01-m02-fence-01",type:"fence",x:444,y:126,scale:.38,footY:126,occlusion:"low"},
  {id:"m01-m02-wagon-01",type:"wagon",x:824,y:698,scale:.36,footY:698,occlusion:"low"},
  ...landmarks
 ];
 return {sockets:plan.sockets,canonicalRoute:map.path.map(p=>[...p]),landmarks,illustrations,otherDecor:others,basePlan:plan,roadWidth:M02_ROAD_WIDTH};
}
function registerDecoration(scene,model,owned,objects,{debug=false}={}){
 const key="maps/m01/aurora-v2/svg/"+model.type;
 if(!scene.textures.exists(key))return {missing:key};
 const sprite=scene.add.image(model.x,model.y,key)
  .setOrigin(.5,.92).setScale(model.scale);
 // Background anchors should remain behind future towers/actors; integrator will remap layers.
 sprite.setDepth(model.occlusion==="background"?-1800:-1120);
 objects.push(sprite);
 return {sprite,sourceKey:key,foot:{x:model.x,y:model.footY},visualOcclusion:model.occlusion,id:model.id,
  alphaWhenOccluded:model.occlusion==="foreground-fade-candidate"?.47:1,noCollision:true};
}
/** Consumer-facing visual adapter; NOT the core MAP_SOCKET API. */
export function mountM01WorldV2(scene,map,opts={}){
 validateM01(map);
 const palette=opts.palette||"equilibrada";assert(M02_PALETTES.includes(palette),"Unknown palette");
 const artPlan=makeM02ArtPlan(map),colors=THEMES[palette],owned=[],objects=[],decorations=[];
 const base="maps/m01/aurora-v2/"+palette+"/";
 texture(scene,base+"terrain",drawGround(map,artPlan.sockets,colors,palette),owned);
 texture(scene,base+"path",roadTexture(map,artPlan.sockets,colors),owned);
 for(const k of ["tempo","power","focus"])
  texture(scene,base+"pad-"+k,platformTexture(colors,k),owned);
 objects.push(scene.add.image(0,0,base+"terrain").setOrigin(0).setDisplaySize(1280,768).setDepth(-5000));
 objects.push(scene.add.image(0,0,base+"path").setOrigin(0).setDisplaySize(1280,768).setDepth(-3800));
 for(const model of artPlan.illustrations){
  const d=registerDecoration(scene,model,owned,objects);
  if(!d.missing)decorations.push(d);
 }
 const pads=[];
 for(const socket of artPlan.sockets){
  const pad=map.spots[socket.legacySpotIndex];
  const key=base+"pad-"+(pad.kind in {tempo:1,power:1,focus:1}?pad.kind:"tempo");
  const sprite=scene.add.image(socket.world.x,socket.world.y,key).setOrigin(.5,.76).setScale(.58).setDepth(-1000);
  objects.push(sprite);pads.push({socket,sprite,visualState:"neutral"});
 }
 const ambient=[];
 for(const [x,y,kind] of [[1106,21,"shrine"],[1119,650,"lookout"],[102,59,"aqueduct"]]){
  const circle=scene.add.circle(x,y,4,0xc4f8db,.35).setDepth(-1200);objects.push(circle);
  ambient.push({circle,x,y,phase:ambient.length*2.3,kind});
 }
 const overlay=scene.add.graphics().setDepth(2900);objects.push(overlay);
 let time=0,disposed=false;
 function setSocketVisualState(socketId,state){
  // Not a game-state change, only receives a read-only visual state.
  assert(["neutral","selected","occupied","ruins"].includes(state),"Invalid visual state");
  const pad=pads.find(p=>p.socket.socketId===socketId);if(!pad)return false;
  pad.visualState=state;
  pad.sprite.setAlpha(state==="ruins"?.50:state==="occupied"?.78:1);
  return true;
 }
 function redraw({showRoute=false,showClearance=false,selectedSocket=null,showOcclusion=false}={}){
  overlay.clear();
  if(showRoute){
   overlay.lineStyle(2,0x73eedd,.9).beginPath().moveTo(...map.path[0]);
   for(const p of map.path.slice(1))overlay.lineTo(...p);
   overlay.strokePath();
   overlay.fillStyle(0xfbf5de,.9);
   map.path.forEach(([x,y],i)=>{if(i%5===0)overlay.fillCircle(x,y,2.5);});
  }
  for(const s of artPlan.sockets){
   if(!showClearance&&s.socketId!==selectedSocket)continue;
   overlay.lineStyle(s.socketId===selectedSocket?3:1.5,s.socketId===selectedSocket?0xffdf8e:0xa4e0dc,s.socketId===selectedSocket?1:.45);
   overlay.strokeCircle(s.world.x,s.world.y,54);
  }
  if(showOcclusion)for(const d of decorations)if(d.visualOcclusion==="foreground-fade-candidate"){
   overlay.lineStyle(2,0xf3c489,.7).strokeCircle(d.foot.x,d.foot.y,32);
  }
 }
 function updateAmbient(deltaSeconds,paused=false){
  if(disposed||paused)return;
  time+=Math.min(Math.max(deltaSeconds,0),.1);
  for(const a of ambient){
   a.circle.setAlpha(.19+Math.sin(time*.8+a.phase)*.13);
   a.circle.setScale(1+Math.sin(time*.72+a.phase)*.15);
  }
 }
 function destroy(){
  if(disposed)return;disposed=true;
  for(const o of objects){if(o?.destroy)o.destroy();}
  if(opts.disposeTextures!==false)release(scene,owned);
 }
 redraw({});
 return {
  contractVersion:"map-visual-m02-v1",artVersion:M02_VERSION,palette,plan:artPlan,
  objects,padObjects:pads,propObjects:decorations,occlusionMetadata:decorations.map(d=>({id:d.id,foot:d.foot,rule:d.visualOcclusion,alphaWhenOccluded:d.alphaWhenOccluded})),
  setSocketVisualState,updateDebug:redraw,updateAmbient,destroy
 };
}
export function tonalGuide(){
 return Object.fromEntries(Object.entries(THEMES).map(([k,t])=>[k,{grass:{dominant:t.mid,light:t.light,shadow:t.dark,edge:t.leaf,accent:t.meadow},
 path:{dominant:t.roadMid,light:t.roadLight,shadow:t.roadShadow,edge:t.border,accent:t.soil},
 stone:{dominant:t.stone,light:t.stoneLight,shadow:t.stoneDark,edge:t.ink,accent:t.arcane},
 wood:{dominant:"#986e4e",light:"#ddaa65",shadow:"#614d42",edge:"#485451",accent:t.gold},
 arcane:{dominant:t.arcane,light:"#c8fff0",shadow:"#3c7f98",edge:t.ink,accent:t.gold}}]));
}
