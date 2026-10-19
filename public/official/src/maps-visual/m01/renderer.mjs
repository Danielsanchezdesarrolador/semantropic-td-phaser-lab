/**
 * [M] SEMANTROPIC TD — M01 / Amanecer · art module 1.0
 * Ownership: map visual ONLY. Phaser-facing; no tower/actor/combat imports.
 * Geometry always arrives from canonical data/maps.v5.json; source waypoints untouched.
 * Raster illustrations are original and reproducible from editable JS/Canvas.
 * Does not register runtime map socket API; mapping here is LOCAL to the art showcase.
 */
export const MAPS_M01_ART_VERSION="m01-aurora-v1";
export const M01_WORLD=Object.freeze({width:1280,height:768});
export const M01_RENDER_DPR=2;
export const M01_PATH_WIDTH=110;
export const M01_PALETTE_NAMES=Object.freeze(["equilibrada","viva","atmosferica"]);
const TWO=Math.PI*2;
const PALETTES={
 equilibrada:{grassTop:"#a2cd89",grassBottom:"#548d6c",grass:"#7fb57b",grassShade:"#4d896f",meadow:"#bcd595",bush:"#4d9769",bushLight:"#a5d38a",path:"#e5c394",pathShade:"#a48361",pathRim:"#516e56",stone:"#849e9b",stoneLight:"#ded4b6",wood:"#986e4e",arcane:"#8bded0",flower:"#f8da9c",fog:0},
 viva:{grassTop:"#b4d887",grassBottom:"#58a26b",grass:"#82c783",grassShade:"#438c66",meadow:"#d4dd92",bush:"#3d9c61",bushLight:"#b8df77",path:"#f0c995",pathShade:"#a9805b",pathRim:"#527557",stone:"#86a6a0",stoneLight:"#e7d9ac",wood:"#a97a52",arcane:"#87ecdd",flower:"#ffe5a5",fog:0},
 atmosferica:{grassTop:"#a2c69a",grassBottom:"#528978",grass:"#79aa81",grassShade:"#477d72",meadow:"#b3c8a0",bush:"#468b76",bushLight:"#9ccbb2",path:"#ddbe9c",pathShade:"#987e6b",pathRim:"#557267",stone:"#879da7",stoneLight:"#d1dac7",wood:"#96775d",arcane:"#a2dfe0",flower:"#f6d9ae",fog:1}
};
const TERRAIN_KEY="maps/m01/aurora/terrain",ROAD_KEY="maps/m01/aurora/path";
function assert(c,m){if(!c)throw Error("[M01-Art] "+m);}
export function validateM01(map){
 assert(map?.id===1,"Expected canonical map ID 1");
 assert(Array.isArray(map.path)&&map.path.length===133,"133 path vertices required");
 assert(Array.isArray(map.spots)&&map.spots.length===8,"8 build spots required");
 assert(map.path.every(p=>p.length===2&&p.every(Number.isFinite)),"Malformed canonical coordinates");
 assert(map.spots.every(p=>Number.isInteger(p.cx)&&Number.isInteger(p.cy)),"Malformed build spots");
 return {mapId:1,waypoints:map.path.length,pads:map.spots.length,start:[...map.path[0]],end:[...map.path.at(-1)]};
}
function pointDist(x,y,arr){let best=Infinity;for(let i=1;i<arr.length;i++){const a=arr[i-1],b=arr[i],dx=b[0]-a[0],dy=b[1]-a[1],d2=dx*dx+dy*dy,t=d2?Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/d2)):0;best=Math.min(best,Math.hypot(x-a[0]-dx*t,y-a[1]-dy*t));}return best;}
export function visualSocketPreview(map) {
 validateM01(map);
 // Local presentation fixture only. Core/integrator will implement authoritative adapter.
 return map.spots.map((p,i)=>Object.freeze({
  contractVersion:"map-socket-v1",
  socketId:"m01-pad-"+String(i+1).padStart(2,"0"),
  legacySpotIndex:i,
  mapId:1,world:Object.freeze({x:p.cx*64+32,y:p.cy*64+32}),
  footAnchor:Object.freeze({x:.5,y:1}),
  interactiveRadiusWorld:54,
  footprint:{radiusWorld:null},
  blockedForBuild:false,
  metadata:{kind:p.kind,role:p.role},
  status:"art-preview-only"
 }));
}
function nearestSocket(x,y,sockets){let b=Infinity;for(const s of sockets)b=Math.min(b,Math.hypot(x-s.world.x,y-s.world.y));return b;}
export function verifyClearance(x,y,radius,map,sockets,roadMargin=57,padMargin=61){
 return pointDist(x,y,map.path)>=roadMargin+radius && nearestSocket(x,y,sockets)>=padMargin+radius;
}
export function makeArtPlan(map){
 const sockets=visualSocketPreview(map);
 const specs=[
  ["oak",84,137,.7],["oak",346,140,.7],["oak",515,99,.58],["oak",834,115,.66],["oak",1192,137,.66],
  ["oak",69,724,.75],["oak",314,744,.55],["oak",752,731,.6],["oak",1208,737,.72],
  ["shrine",102,113,.84],["shrine",1106,88,.75],["shrine",1119,725,.72],
  ["banner",205,98,.85],["banner",545,683,.83],["banner",1184,666,.82],
  ["lantern",84,252,.75],["lantern",566,117,.8],["lantern",1159,681,.76],
  ["stone",155,706,.67],["stone",824,698,.75],["stone",1126,205,.6],
  ["flowers",385,97,.75],["flowers",647,665,.68],["flowers",925,696,.8],
  ["bush",245,154,.75],["bush",444,126,.71],["bush",706,108,.68],["bush",1241,634,.74]
 ];
 const radius={oak:42,shrine:30,banner:16,lantern:14,stone:22,flowers:13,bush:26};
 const placed=[],rejected=[];
 for(const [type,x,y,s] of specs){
  const r=radius[type]*s;
  if(verifyClearance(x,y,r,map,sockets,64,64))placed.push({id:"m01-prop-"+String(placed.length+1).padStart(2,"0"),type,x,y,scale:s,worldFootprintRadius:r,layer:type==="oak"?"worldPropsBack":"worldPropsFront",provenance:"M-owned"});
  else rejected.push({type,x,y,reason:"road-or-pad-reserved-zone"});
 }
 return {sockets,props:placed,rejected,route:Array.from(map.path,p=>[...p]),visualRoadWidth:M01_PATH_WIDTH};
}
function rng(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};}
function canvas(w,h,dpr=M01_RENDER_DPR){const e=document.createElement("canvas");e.width=w*dpr;e.height=h*dpr;const c=e.getContext("2d");if(!c)throw Error("Canvas texture authoring unavailable");c.scale(dpr,dpr);c.lineCap="round";c.lineJoin="round";return {e,c};}
function path(c,pts,fill,outline=null,lw=1){c.beginPath();c.moveTo(...pts[0]);for(const pt of pts.slice(1))c.lineTo(...pt);c.closePath();if(fill){c.fillStyle=fill;c.fill()}if(outline){c.strokeStyle=outline;c.lineWidth=lw;c.stroke()}}
function line(c,pts,color,width=2,alpha=1){c.save();c.globalAlpha=alpha;c.beginPath();c.moveTo(...pts[0]);for(const p of pts.slice(1))c.lineTo(...p);c.lineWidth=width;c.strokeStyle=color;c.stroke();c.restore()}
function el(c,x,y,rx,ry,fill,alpha=1){c.save();c.globalAlpha=alpha;c.beginPath();c.ellipse(x,y,rx,ry,0,0,TWO);c.fillStyle=fill;c.fill();c.restore()}
function halo(c,x,y,r,color){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,"#ffffff00");c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2)}
function patch(c,x,y,rx,ry,fill,seed,opacity=.48){const rr=rng(seed),vertices=[];for(let i=0;i<15;i++){const a=i*TWO/15,d=.72+rr()*.5;vertices.push([x+rx*d*Math.cos(a),y+ry*d*Math.sin(a)]);}c.save();c.globalAlpha=opacity;path(c,vertices,fill);c.restore();}
function buildTerrain(map,plan,p){
 const {e,c}=canvas(1280,768),r=rng(20261019);
 const g=c.createLinearGradient(0,0,1170,768);g.addColorStop(0,p.grassTop);g.addColorStop(.46,p.grass);g.addColorStop(1,p.grassBottom);c.fillStyle=g;c.fillRect(0,0,1280,768);
 const patches=[
 [116,94,219,147,0],[419,99,239,156,1],[761,95,202,137,2],[1104,121,210,153,3],
 [98,650,189,170,4],[350,704,223,118,5],[734,671,252,155,6],[1077,681,267,165,7],
 [120,325,110,125,8],[560,373,148,141,9],[976,428,193,139,10]
 ];
 patches.forEach(([x,y,rx,ry,i])=>patch(c,x,y,rx,ry,i%3===0?p.meadow:i%3===1?p.grassShade:p.bushLight,409+i*127,i%2?.22:.3));
 // Three depth bands: painterly ridge, grass dapple, ambient colour shadows.
 for(const [x,y,rx,ry] of [[125,57,149,31],[609,45,243,48],[1068,53,185,35],[267,748,220,53],[962,730,179,46]]) {
  el(c,x,y,rx,ry,p.meadow,.16);line(c,[[x-rx*.75,y+5],[x,y-10],[x+rx*.75,y+4]],p.grassShade,2.3,.24);}
 const zones=[
 [102,163,116,91],[327,127,135,100],[509,100,148,82],[811,121,135,97],[1114,124,134,102],
 [89,634,116,113],[340,669,153,99],[693,671,126,88],[970,675,141,87],[1193,635,100,121]
 ];
 for(const [cx,cy,rx,ry] of zones)for(let j=0;j<68;j++){
  const x=cx+(r()-.5)*rx*2,y=cy+(r()-.5)*ry*2;
  if(!verifyClearance(x,y,3,map,plan.sockets,60,54))continue;
  const a=r()*.8,cl=r()>.48?p.grassShade:p.bushLight;
  el(c,x,y,3+r()*9,2+r()*4,cl,.1+r()*.24);
  if(j%13===0){for(let k=0;k<5;k++){const theta=TWO*k/5;el(c,x+4*Math.cos(theta),y+4*Math.sin(theta),2.4,2,p.flower,.72)}}
 }
 for(let i=0;i<2800;i++){
  const x=r()*1280,y=r()*768;
  if(!verifyClearance(x,y,1,map,plan.sockets,53,58))continue;
  const v=r(),h=2+r()*6;
  line(c,[[x-1.5,y+2],[x,y-h],[x+2,y+1]],v>.5?p.grassShade:p.bushLight,.75+r()*.65,.25+r()*.32);
  if(i%38===0){el(c,x,y-3,1.6,1.5,p.flower,.65)}
 }
 // broad directional sunrise, deliberately away from road center
 halo(c,1019,40,400,"#ffedac31");
 if(p.fog){const f=c.createLinearGradient(0,0,0,768);f.addColorStop(0,"#c7eee427");f.addColorStop(.5,"#ffffff00");f.addColorStop(1,"#1746521c");c.fillStyle=f;c.fillRect(0,0,1280,768);}
 return e;
}
function buildRoad(map,plan,p){
 const {e,c}=canvas(1280,768),pts=map.path,r=rng(41148);
 // Straight lineTo follows ALL the original route vertices; rounded stroke joins.
 line(c,pts,p.pathRim,110);
 line(c,pts,p.grassShade,105);
 line(c,pts,p.pathShade,99);
 line(c,pts,p.path,89);
 line(c,pts,"#fff4d0",78,.17);
 // Cracks and compaction marks stay INSIDE the 78px interior.
 for(let i=0;i<1300;i++){const x=r()*1280,y=r()*768;if(pointDist(x,y,pts)>37)continue;
  if(i%6===0)el(c,x,y,1+r()*3,1+r(),p.pathShade,.22);
  else line(c,[[x,y],[x+1+r()*5,y+(r()-.5)*1.4]],i%3===0?"#fff3da":p.pathShade,.7+r(),.14+r()*.26);
 }
 // A subtle capillary vegetation border on OUTSIDE edge; excluded near pads.
 for(let i=0;i<520;i++){const x=r()*1280,y=r()*768,d=pointDist(x,y,pts);
  if(d<57||d>70||nearestSocket(x,y,plan.sockets)<68)continue;
  line(c,[[x-2,y+2],[x,y-4]],p.bush,1.5,.35);
  if(i%9===0)el(c,x,y-5,1.5,1.7,p.flower,.83);
 }
 return e;
}
function paintPad(p,kind){
 const {e,c}=canvas(232,182),x=116,y=118;
 const rune=kind==="tempo"?p.arcane:kind==="power"?"#e4c080":"#a9d6e6";
 // A modular eight-sided load-bearing cut-stone platform, not a flat circle.
 el(c,x+2,y+32,97,19,"#173f45",.32);
 path(c,[[13,111],[38,84],[94,66],[160,74],[215,104],[192,136],[125,162],[56,148]],"#405b63","#203c49",5);
 path(c,[[13,100],[41,75],[96,57],[158,68],[213,97],[187,126],[123,151],[54,137]],p.stone,"#3a5d66",4);
 path(c,[[28,99],[55,81],[103,65],[152,77],[197,99],[126,138],[56,124]],p.stoneLight,"#637a7b",2);
 path(c,[[37,100],[64,89],[107,79],[151,86],[183,103],[125,125],[61,115]],p.stone,"#526f73",2);
 for(let a=0;a<8;a++){const theta=TWO*a/8,rx=80,ry=32;
  line(c,[[x+Math.cos(theta)*rx*.7,y-10+Math.sin(theta)*ry*.75],
          [x+Math.cos(theta)*rx,y-10+Math.sin(theta)*ry]],"#365c66",2.5);}
 el(c,x,y-9,42,18,"#2b5562");
 el(c,x,y-12,35,12,rune,.19);
 c.save();c.translate(x,y-12);c.scale(1,.5);c.beginPath();c.arc(0,0,33,.13,5.92);c.strokeStyle=rune;c.lineWidth=3.2;c.stroke();c.restore();
 line(c,[[x-12,y-12],[x+12,y-12]],rune,3);
 line(c,[[x,y-23],[x,y-1]],rune,3);
 for(const dir of [-1,1]){
  const ax=x+dir*66;
  path(c,[[ax-8,y-4],[ax-4,y-33],[ax+5,y-39],[ax+12,y-7],[ax+1,y+2]],"#628994","#284f5d",2);
  el(c,ax,y-34,4,4,rune);
 }
 // Wear and individual masonry joints at the frontal edge.
 for(const [xx,yy] of [[50,120],[74,131],[144,136],[182,115]]){
  line(c,[[xx,yy],[xx+8,yy+4]],"#fff2d1",2,.56);
 }
 return e;
}
function propArt(p,type){
 const {e,c}=canvas(194,205),x=97,y=184;
 if(type==="oak"){
  el(c,x,y,76,14,"#164f47",.35);
  line(c,[[x,y],[x-5,116],[x+6,82]],p.wood,15);
  line(c,[[x-2,137],[x-31,109]],p.wood,7);
  line(c,[[x+2,115],[x+27,99]],p.wood,7);
  const crowns=[[-26,81,39,31],[30,79,41,32],[0,55,49,39],[-5,32,31,22]];
  for(const [dx,dy,rx,ry] of crowns){
   el(c,x+dx+6,dy+9,rx,ry,p.grassShade);
   el(c,x+dx,dy,rx,ry,p.bush);
   el(c,x+dx-12,dy-12,rx*.6,ry*.43,p.bushLight,.68);
   el(c,x+dx+12,dy+8,rx*.37,ry*.23,"#2a665e",.32);
  }
 } else if(type==="shrine"){
  el(c,x,y+1,55,14,"#1e4f4c",.38);
  path(c,[[45,167],[55,149],[143,148],[160,166],[142,185],[59,189]],p.stone,"#365b62",3);
  for(const [ax,h] of [[58,64],[122,73]]){
   path(c,[[ax,165],[ax-5,h+36],[ax+10,h],[ax+25,h+31],[ax+23,165]],p.stone,"#395a60",3);
   line(c,[[ax+9,h+9],[ax+14,h+25]],p.stoneLight,3,.6);
  }
  path(c,[[51,111],[96,84],[148,111],[136,121],[93,102],[61,123]],p.stoneLight,"#3c6670",3);
  halo(c,x,113,39,"#b8fbea70");el(c,x,114,10,16,p.arcane,.86);
  line(c,[[x-6,109],[x+5,102]],"#effff0",2);
 } else if(type==="banner"){
  el(c,x,y+2,30,9,"#1c5247",.36);
  line(c,[[x,y],[x,41]],p.wood,7);
  path(c,[[x,48],[x+49,60],[x+40,107],[x,96]],"#348f89","#d9c789",3);
  path(c,[[x+4,55],[x+36,64],[x+31,90],[x+4,85]],"#70c4b4");
  line(c,[[x+13,66],[x+24,75]],"#f5e5a2",4);
 } else if(type==="lantern"){
  el(c,x,y,27,9,"#154e49",.4);
  line(c,[[x,y],[x,91]],p.stone,9);
  path(c,[[x-15,102],[x-11,62],[x+12,62],[x+16,101]],p.stoneLight,"#466675",3);
  halo(c,x,80,40,"#ffeba765");el(c,x,78,7,12,"#ffedaa");
  path(c,[[x-18,63],[x,48],[x+18,63]],p.wood,"#544b3c",3);
 } else if(type==="stone"){
  el(c,x,y+3,47,12,"#1d554a",.34);
  path(c,[[x-53,y-4],[x-35,y-51],[x+10,y-65],[x+53,y-23],[x+39,y+8],[x-31,y+9]],p.stone,"#446b6b",3);
  path(c,[[x-35,y-51],[x+10,y-65],[x+37,y-44],[x,y-32]],p.stoneLight);
  line(c,[[x-17,y-28],[x-7,y-15],[x-13,y+2]],"#526f73",2.6);
 } else if(type==="flowers"){
  el(c,x,y+2,34,9,p.grassShade,.48);
  for(let i=0;i<11;i++){
   const tx=x+(i%4-1.6)*13,ty=y-4-Math.floor(i/4)*8;
   line(c,[[tx,ty+8],[tx,ty-6]],p.bush,2);
   for(let k=0;k<5;k++){const a=k*TWO/5;el(c,tx+3*Math.cos(a),ty-6+3*Math.sin(a),2.4,2.2,p.flower);}
   el(c,tx,ty-6,2,2,"#c68c51");
  }
 } else if(type==="bush"){
  el(c,x,y+2,48,12,"#215b48",.34);
  for(const [dx,dy,rx,ry] of [[-26,-21,30,23],[27,-22,29,21],[0,-38,35,26]]){
   el(c,x+dx,y+dy,rx,ry,p.bush);
   el(c,x+dx-9,y+dy-8,rx*.53,ry*.36,p.bushLight,.68);
  }
 }
 return e;
}
function ensure(scene,key,cv){if(scene.textures.exists(key))scene.textures.remove(key);scene.textures.addCanvas(key,cv);}
function killAll(list){for(const obj of list)if(obj?.destroy)obj.destroy();list.length=0;}
/**
 * Draw an isolated map-only showcase. NO spawns, tower builds, events, saves or economy.
 * Ownership of created GameObjects belongs to the caller; destroy() is required.
 */
export function mountM01World(scene,map,{palette="equilibrada",showReserved=false}={}){
 validateM01(map);
 assert(PALETTES[palette],"Unknown palette "+palette);
 const p=PALETTES[palette],plan=makeArtPlan(map),objects=[];
 const prefix="maps/m01/aurora/"+palette+"/";
 const terrainKey=prefix+"terrain",roadKey=prefix+"path";
 ensure(scene,terrainKey,buildTerrain(map,plan,p));
 ensure(scene,roadKey,buildRoad(map,plan,p));
 objects.push(scene.add.image(0,0,terrainKey).setOrigin(0).setDisplaySize(1280,768).setDepth(-5000));
 objects.push(scene.add.image(0,0,roadKey).setOrigin(0).setDisplaySize(1280,768).setDepth(-3800));
 const padKeys={};
 for(const kind of ["tempo","power","focus"]){const key=prefix+"socket-"+kind;ensure(scene,key,paintPad(p,kind));padKeys[kind]=key;}
 const propKeys={};
 for(const type of ["oak","shrine","banner","lantern","stone","flowers","bush"]){const key=prefix+"prop-"+type;ensure(scene,key,propArt(p,type));propKeys[type]=key;}
 const propObjects=[];
 for(const prop of plan.props){
  const image=scene.add.image(prop.x,prop.y,propKeys[prop.type]).setOrigin(.5,.89).setScale(prop.scale*.56).setDepth(prop.layer==="worldPropsBack"?-1300:-1050);
  objects.push(image);propObjects.push({prop,image});
 }
 const padObjects=[];
 for(const socket of plan.sockets){
  const p1=map.spots[socket.legacySpotIndex],key=padKeys[p1.kind]||padKeys.tempo;
  const image=scene.add.image(socket.world.x,socket.world.y,key).setOrigin(.5,.76).setScale(.58).setDepth(-1000+socket.world.y*.001);
  objects.push(image);padObjects.push({socket,image});
 }
 const overlay=scene.add.graphics().setDepth(1900);objects.push(overlay);
 function updateDebug({showRoute=false,showClearance=false,selectedSocket=null}={}){
  overlay.clear();
  if(showRoute){
   overlay.lineStyle(2,0x6ef5d9,.9);overlay.beginPath();overlay.moveTo(...map.path[0]);for(const a of map.path.slice(1))overlay.lineTo(...a);overlay.strokePath();
   overlay.fillStyle(0xffffff,.85);map.path.forEach(([x,y],i)=>{if(i%5===0)overlay.fillCircle(x,y,2.8);});
  }
  if(showClearance||selectedSocket){
   for(const s of plan.sockets){
    overlay.lineStyle(2,s.socketId===selectedSocket?0xffe9a2:0x95d9e9,s.socketId===selectedSocket?1:.42);
    overlay.strokeCircle(s.world.x,s.world.y,s.interactiveRadiusWorld);
    if(showClearance){overlay.lineStyle(1,0xc1a0df,.45);overlay.strokeCircle(s.world.x,s.world.y,64);}
   }
  }
 }
 updateDebug({showClearance:showReserved});
 return {plan,artVersion:MAPS_M01_ART_VERSION,palette,objects,padObjects,propObjects,updateDebug,destroy(){killAll(objects)}};
}