/**
 * SEMANTROPIC TD · PH-02B M01 DELUXE · Original 2D level-art pass
 * Canvas used only once for generating bespoke art textures; gameplay renderer is Phaser.
 * Source: approved V5 M01 waypoints + eight construction pad coordinates.
 * No third-party graphics, no geometry/logic modifications.
 * Reproducible artwork: MASTER_DPR=2; seed=20261019; no visual random() at runtime.
 */
export const ART_VERSION="PH-02B Deluxe · 2026-10-19";
export const ART_SEED=20261019;
export const VISUAL_PATH_WIDTH=110; // legacy outer 126: -12.70%
export const SOURCE_PATH_WIDTH=126;
const W=1280,H=768,DPR=2,TAU=Math.PI*2;
const green=["#6c9c6d","#82b37b","#588a68","#93bf7e","#427b69"];
function random(seed){return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
function surface(w,h){const el=document.createElement("canvas");el.width=w*DPR;el.height=h*DPR;const c=el.getContext("2d");if(!c)throw Error("Canvas 2D texture generator unavailable");c.setTransform(DPR,0,0,DPR,0,0);c.lineJoin="round";c.lineCap="round";return {el,c};}
function ellipse(c,x,y,rx,ry,fill,opacity=1){c.save();c.globalAlpha*=opacity;c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fillStyle=fill;c.fill();c.restore();}
function stroke(c,points,color,width=2,opacity=1){if(!points.length)return;c.save();c.globalAlpha*=opacity;c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)c.lineTo(points[i][0],points[i][1]);c.stroke();c.restore();}
function poly(c,points,fill,border=null,width=1){c.beginPath();c.moveTo(...points[0]);for(const p of points.slice(1))c.lineTo(...p);c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(border){c.lineWidth=width;c.strokeStyle=border;c.stroke();}}
function radial(c,x,y,r,inner,outer="rgba(0,0,0,0)"){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,inner);g.addColorStop(1,outer);ellipse(c,x,y,r,r,g);}
function trace(c,pts){c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)c.lineTo(...pts[i]);}
function paintRoad(c,points,width,color){c.lineJoin="round";c.lineCap="round";c.lineWidth=width;c.strokeStyle=color;trace(c,points);c.stroke();}
function routeDistance(x,y,pts){let best=Infinity;for(let i=1;i<pts.length;i++){
 const a=pts[i-1],b=pts[i],dx=b[0]-a[0],dy=b[1]-a[1],den=dx*dx+dy*dy;
 const t=den?Math.min(1,Math.max(0,((x-a[0])*dx+(y-a[1])*dy)/den)):0;
 best=Math.min(best,Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy));}return best;}
function padDistance(x,y,spots){let best=Infinity;for(const s of spots)best=Math.min(best,Math.hypot(x-(s.cx*64+32),y-(s.cy*64+32)));return best;}
function organicPatch(c,x,y,rx,ry,fill,seed){const r=random(seed),n=11,ps=[];for(let i=0;i<n;i++){const a=i*TAU/n,d=.79+r()*.37;ps.push([x+rx*Math.cos(a)*d,y+ry*Math.sin(a)*d]);}c.save();c.globalAlpha=.45;poly(c,ps,fill);c.restore();}
function bush(c,x,y,scale,tone){
 ellipse(c,x,y+4,20*scale,6*scale,"#1a544b",.4);
 for(let k=0;k<5;k++){const a=k*TAU/5;ellipse(c,x+11*scale*Math.cos(a),y-9*scale+7*scale*Math.sin(a),11*scale,8*scale,tone); }
 ellipse(c,x-7*scale,y-16*scale,12*scale,6*scale,"#d4e4a8",.22);
}
function stone(c,x,y,w,h){
 ellipse(c,x,y+h*.23,w*.95,h*.31,"#154e48",.25);
 poly(c,[[x-w,y],[x-w*.69,y-h*.74],[x-w*.14,y-h],[x+w*.6,y-h*.65],[x+w,y-h*.08],[x+w*.64,y+h*.17],[x-w*.57,y+h*.2]],"#849d90","#385d61",1.6);
 poly(c,[[x-w*.69,y-h*.74],[x-w*.14,y-h],[x+w*.6,y-h*.65],[x+w*.15,y-h*.46]],"#d9d3b0",null);
 stroke(c,[[x-w*.35,y-h*.1],[x-w*.24,y+h*.1]],"#435f5d",1.5);
}
function paintedTree(c,x,y,s,variant){
 // No texture copy/stamping; each designed foliage mass preserves coherent light direction.
 ellipse(c,x,y+7,48*s,12*s,"#1e5144",.4);
 stroke(c,[[x,y],[x-3*s,y-57*s],[x+9*s,y-100*s]],"#645a44",12*s);
 stroke(c,[[x-3*s,y-60*s],[x-24*s,y-78*s]],"#7d6846",5*s);
 const forms=[
 [[-27,-103,35,27],[20,-111,40,28],[0,-136,41,30]],
 [[0,-138,35,43],[-24,-111,29,31],[27,-105,31,37]],
 [[-29,-125,32,26],[22,-131,38,27],[-1,-157,40,31]]
 ][variant];
 for(const [xx,yy,rx,ry] of forms){
  ellipse(c,x+(xx+4)*s,y+(yy+5)*s,rx*s,ry*s,"#284f49");
  ellipse(c,x+xx*s,y+yy*s,rx*s,ry*s,["#4f9164","#4a806a","#629b6b"][variant]);
  ellipse(c,x+(xx-10)*s,y+(yy-12)*s,rx*.62*s,ry*.45*s,"#aed398",.48);
  ellipse(c,x+(xx+13)*s,y+(yy+12)*s,rx*.43*s,ry*.26*s,"#245b53",.35);
 }
}
function ruins(c,x,y,s){
 ellipse(c,x,y+7,53*s,13*s,"#1c5549",.28);
 for(const [xx,yy,w,h] of [[-31,-39,22,42],[-9,-54,21,52],[17,-31,25,28]]){
  poly(c,[[x+xx*s,y+yy*s],[x+(xx+w)*s,y+(yy-6)*s],[x+(xx+w+3)*s,y+(yy+h)*s],[x+(xx+3)*s,y+(yy+h+5)*s]],"#8b9f91","#385b5f",2);
  stroke(c,[[x+(xx+4)*s,y+(yy+8)*s],[x+(xx+w-6)*s,y+(yy+4)*s]],"#d5d9b1",2*s);
 }
 ellipse(c,x,y+4,19*s,5*s,"#d9c69b",.35);
}
function banner(c,x,y,s=1){
 ellipse(c,x,y+6,20*s,6*s,"#284d45",.5);
 stroke(c,[[x,y],[x,y-58*s]],"#7d6b51",4*s);
 poly(c,[[x,y-53*s],[x+28*s,y-48*s],[x+20*s,y-29*s],[x,y-30*s]],"#368c85","#d8cc8d",2*s);
 stroke(c,[[x+6*s,y-44*s],[x+17*s,y-41*s]],"#e6ecd1",2*s);
}
function lantern(c,x,y,s=1){
 ellipse(c,x,y+10,20*s,6*s,"#214a47",.35);
 stroke(c,[[x,y+3*s],[x,y-29*s]],"#677782",5*s);
 poly(c,[[x-10*s,y-24*s],[x-6*s,y-43*s],[x+7*s,y-43*s],[x+10*s,y-24*s]],"#5b7676","#d7cb91",2*s);
 radial(c,x,y-32*s,30*s,"rgba(255,230,151,.46)");
 ellipse(c,x,y-32*s,4*s,7*s,"#ffeda5");
}
function paintLand(map){
 const pts=map.path,spots=map.spots,r=random(ART_SEED),{el,c}=surface(W,H);
 const grass=c.createLinearGradient(0,0,W,H);
 grass.addColorStop(0,"#91ba83");grass.addColorStop(.41,"#78ab75");grass.addColorStop(.78,"#58946c");grass.addColorStop(1,"#6a9b70");
 c.fillStyle=grass;c.fillRect(0,0,W,H);
 // Large intentional tonal clusters, not uniform noise.
 const fields=[
 [95,126,235,169,"#b4c78a"],[368,146,246,152,"#679e7c"],
 [703,120,244,148,"#9cbd86"],[1089,143,219,159,"#6c9f78"],
 [166,629,236,168,"#6d9e65"],[533,673,210,145,"#a4bc77"],
 [936,658,267,176,"#44866e"],[1218,663,174,148,"#9dbb83"],
 [1106,378,140,125,"#8cb477"],[707,450,173,137,"#448369"]];
 for(let i=0;i<fields.length;i++){const [x,y,rx,ry,col]=fields[i];organicPatch(c,x,y,rx,ry,col,i*313+23);}
 // Sloping hill-banks distant from road: broad contours make relief visible at mobile scale.
 for(const [x,y,rx,ry] of [[115,62,172,46],[750,81,225,37],[1044,733,213,42],[160,729,171,29]]){
  ellipse(c,x,y,rx,ry,"#bed39c",.19);stroke(c,[[x-rx*.83,y+3],[x,y-8],[x+rx*.82,y+7]],"#325e50",2,.21);}
 // Early organic meadow vegetation, with clumped (not random) distribution
 const bushAreas=[[142,75,121,52],[313,190,145,100],[550,91,175,61],[924,135,115,91],[1165,114,82,82],[96,619,109,78],[434,651,155,66],[777,649,121,77],[1054,651,139,63],[1204,718,58,56]];
 for(const [cx,cy,rx,ry] of bushAreas)for(let i=0;i<22;i++){
   const x=cx+(r()-.5)*rx*1.8,y=cy+(r()-.5)*ry*1.8;
   if(routeDistance(x,y,pts)<71||padDistance(x,y,spots)<70)continue;
   bush(c,x,y,.2+r()*.4,green[Math.floor(r()*green.length)]);
 }
 // Lower frequency illustrated foliage and fine grass; road and pads are excluded
 for(let i=0;i<1750;i++){
  const x=r()*W,y=r()*H,near=routeDistance(x,y,pts),close=padDistance(x,y,spots);
  if(near<63||close<67)continue;
  const h=1+r()*4;
  stroke(c,[[x,y+3],[x-1-r()*3,y-h],[x,y-1]],i%4===0?"#e1d69a":"#346f5b",.8+r(),.27+r()*.22);
  if(i%18===0){ellipse(c,x,y-1,1.8,1.5,i%3?"#fff2b4":"#cad2f1",.78);}
 }
 // Path: preserve ALL 133 vertices; shrink only its visible paint width 126→110.
 paintRoad(c,pts,VISUAL_PATH_WIDTH,"#315a4c"); // dark soil edge / contact shadow
 paintRoad(c,pts,103,"#637454");
 paintRoad(c,pts,96,"#a58c63");
 const pathFill=c.createLinearGradient(0,200,0,580);pathFill.addColorStop(0,"#efd6a3");pathFill.addColorStop(.65,"#d9b98b");pathFill.addColorStop(1,"#cbb080");
 paintRoad(c,pts,85,pathFill);
 paintRoad(c,pts,78,"rgba(246,221,175,.18)");
 // Texture strictly clipped inside the path: gravel + soft wheel-worn strokes.
 c.save();trace(c,pts);c.lineWidth=79;c.strokeStyle="#ffffff"; // construct region with stroke then clip via mask
 c.restore();
 for(let i=0;i<900;i++){
  const x=r()*W,y=r()*H,d=routeDistance(x,y,pts);
  if(d>36)continue;
  if(i%5===0){ellipse(c,x,y,1+r()*3,.7+r()*1.4,"#896b4b",.24);}
  else stroke(c,[[x,y],[x+2+r()*5,y-1]],i%3===0?"#fff2cf":"#a88762",.7+r(),.21+r()*.2);
 }
 // Edge bloom: tiny intentional strip of wildflowers, no second fake route.
 for(let i=0;i<180;i++){
  const x=r()*W,y=r()*H,d=routeDistance(x,y,pts);
  if(d<57||d>83||padDistance(x,y,spots)<70)continue;
  ellipse(c,x,y,2.8,2,"#ffe4b9",.7);
  ellipse(c,x-3,y+2,4,2.2,"#3c8b65",.6);
 }
 // Medium rocks positioned as ambient regions, never path obstruction
 const rockZones=[[224,92,124,75],[830,80,110,67],[1083,65,106,50],[150,675,130,70],[701,658,118,83],[1155,654,118,76]];
 for(const [cx,cy,rx,ry] of rockZones)for(let j=0;j<11;j++){
  const x=cx+(r()-.5)*rx*2,y=cy+(r()-.5)*ry*2;
  if(routeDistance(x,y,pts)>76&&padDistance(x,y,spots)>71)stone(c,x,y,5+r()*9,5+r()*10);
 }
 // Signature set dressing, placed after road and safely in usable scenery
 for(const [x,y,s,v] of [[46,137,.45,0],[288,127,.5,1],[555,178,.39,2],[1140,165,.36,0],[113,737,.47,2],[383,720,.33,0],[842,746,.48,1],[1212,750,.4,2]]){
  if(routeDistance(x,y,pts)>83&&padDistance(x,y,spots)>76)paintedTree(c,x,y,s,v);
 }
 for(const [x,y,s] of [[222,637,.62],[762,727,.65],[1076,140,.49]]){
  if(routeDistance(x,y,pts)>79&&padDistance(x,y,spots)>68)ruins(c,x,y,s);
 }
 for(const [x,y] of [[225,85],[586,698],[1141,680]]){
  if(routeDistance(x,y,pts)>66&&padDistance(x,y,spots)>66)banner(c,x,y,.71);
 }
 for(const [x,y] of [[65,260],[322,697],[1086,694],[1178,223]]){
  if(routeDistance(x,y,pts)>60&&padDistance(x,y,spots)>60)lantern(c,x,y,.83);
 }
 // Subtle warm sunrise, shadows fall toward southeast
 radial(c,1100,70,400,"rgba(252,235,159,.15)");
 const v=c.createLinearGradient(0,0,0,H);v.addColorStop(0,"rgba(247,240,185,.12)");v.addColorStop(.5,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(19,61,61,.12)");c.fillStyle=v;c.fillRect(0,0,W,H);
 return el;
}
function paintPad(kind){
 const {el,c}=surface(188,156),cx=94,cy=102;
 const glow=kind==="focus"?"#a1e6e5":kind==="power"?"#eac387":"#94e0ca";
 ellipse(c,cx,132,84,18,"#143d41",.36);
 // Terraced eight-facet masonry foundation integrated with meadow
 poly(c,[[13,107],[47,82],[89,72],[134,80],[175,105],[157,126],[100,145],[38,128]],"#3b5c61","#274b54",4);
 poly(c,[[13,100],[47,75],[89,64],[134,73],[175,99],[158,113],[100,130],[38,117]],"#839b95","#345660",3);
 poly(c,[[24,99],[52,82],[95,71],[131,81],[164,101],[100,123],[43,112]],"#c1bb9e","#576d73",3);
 poly(c,[[37,98],[60,85],[96,80],[126,87],[150,101],[97,118]],"#647e7b","#2e525a",2);
 // Radial embossed stone seams: actual architectural joints, not a circle prototype
 for(let j=0;j<7;j++){let a=j*TAU/7;
  stroke(c,[[cx+Math.cos(a)*37,cy+Math.sin(a)*12],[cx+Math.cos(a)*54,cy+Math.sin(a)*22]],"#405f64",2);
 }
 ellipse(c,cx,99,38,17,"#365d5e");ellipse(c,cx,96,33,13,glow,.22);
 c.save();c.translate(cx,96);c.scale(1,.48);c.strokeStyle=glow;c.lineWidth=3;c.beginPath();c.arc(0,0,29,.19,Math.PI*1.85);c.stroke();c.restore();
 // Distinctive but canon-neutral build sigil: emerging architectural projections
 for(const dx of [-51,51]){
  poly(c,[[cx+dx-8,96],[cx+dx-4,82],[cx+dx+5,78],[cx+dx+10,92],[cx+dx+3,103]],"#779a9a","#2a515d",2);
  ellipse(c,cx+dx,84,3,3,glow);
 }
 stroke(c,[[cx-10,96],[cx+10,96]],glow,3);stroke(c,[[cx,87],[cx,104]],glow,3);
 // Lithic feet with highlights establish material and volume.
 for(const x of [36,60,121,147])stroke(c,[[x,110],[x+7,117]],"#f3deb3",1.6,.65);
 return el;
}
export function installDeluxeArt(scene,map){
 if(!Array.isArray(map.path)||map.path.length!==133||map.spots.length!==8)throw Error("M01 route/platform contract changed; do not proceed with visual art on incompatible geometry.");
 const ground=paintLand(map);
 const name="ph02b-m01-ground-2560";
 if(!scene.textures.exists(name))scene.textures.addCanvas(name,ground);
 scene.add.image(0,0,name).setOrigin(0).setDisplaySize(W,H).setDepth(-5000);
 const roleKeys=["tempo","power","focus"];
 for(const role of roleKeys){const key="ph02b-pad-"+role;if(!scene.textures.exists(key))scene.textures.addCanvas(key,paintPad(role));}
 for(const [index,pad] of map.spots.entries()){
  const x=pad.cx*64+32,y=pad.cy*64+32;
  const role=roleKeys.includes(pad.kind)?pad.kind:"tempo";
  const image=scene.add.image(x,y,"ph02b-pad-"+role).setOrigin(.5,.62).setScale(.57).setDepth(y-28);
  image.setInteractive({useHandCursor:true});
  image.setData("officialSpotIndex",index);
 }
 const pathDebug=scene.add.graphics().setDepth(4500);
 return pathDebug;
}
export function artInfo(){return {version:ART_VERSION,seed:ART_SEED,pathOuterOriginal:SOURCE_PATH_WIDTH,pathOuterDeluxe:VISUAL_PATH_WIDTH,changePercent:+(100*(VISUAL_PATH_WIDTH/SOURCE_PATH_WIDTH-1)).toFixed(2),world:[W,H],master:[W*DPR,H*DPR],spots:8,artSource:"original procedural illustration - not approved hand-painted production art"};}
