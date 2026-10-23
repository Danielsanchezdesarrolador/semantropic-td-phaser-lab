/**
 * SEMANTROPIC TD R7 — official Praderas del Amanecer painted terrain.
 *
 * All gameplay geometry is sourced exclusively from protected M01 JSON:
 * 133 route vertices, 8 authorized build pads and world 1280x768.
 * Original premium fantasy meadow, waterfalls, ruin, blue crystal, stone
 * gate/exit. Inspired by director's mockup, not copied or used as a texture.
 * Renders only once into 2560x1536 Phaser CanvasTexture, no per-frame work.
 */
export const R7_MAP01_ART_VERSION='r7-m01-dawn-plateau-premium-v1';
const W=1280,H=768,TWO=Math.PI*2;
const rng=n=>()=>((n=(Math.imul(n,1664525)+1013904223)>>>0)/4294967296);
const ellipse=(c,x,y,rx,ry,color)=>{c.beginPath();c.ellipse(x,y,rx,ry,0,0,TWO);c.fillStyle=color;c.fill()};
function poly(c,pts,color,edge=null,width=1){
 c.beginPath();c.moveTo(...pts[0]);for(const p of pts.slice(1))c.lineTo(...p);c.closePath();
 if(color){c.fillStyle=color;c.fill()}if(edge){c.lineWidth=width;c.strokeStyle=edge;c.stroke()}
}
function stroke(c,pts,color,width=2){
 c.beginPath();c.lineJoin='round';c.lineCap='round';c.moveTo(...pts[0]);
 for(let i=1;i<pts.length;i++)c.lineTo(...pts[i]);
 c.strokeStyle=color;c.lineWidth=width;c.stroke();
}
function distance(x,y,path){
 let best=Infinity;
 for(let i=1;i<path.length;i++){
  const a=path[i-1],b=path[i],dx=b[0]-a[0],dy=b[1]-a[1],len=dx*dx+dy*dy;
  const t=len?Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/len)):0;
  best=Math.min(best,Math.hypot(x-a[0]-dx*t,y-a[1]-dy*t));
 }return best;
}
function safe(x,y,plan,margin=0){
 return distance(x,y,plan.path)>72+margin&&
  plan.pads.every(p=>Math.hypot(x-p.x,y-p.y)>60+margin);
}
function distantWorld(c){
 const sky=c.createLinearGradient(0,0,0,280);
 sky.addColorStop(0,'#9fd2ed');sky.addColorStop(.44,'#e8f0d5');sky.addColorStop(1,'#a8c98c');
 c.fillStyle=sky;c.fillRect(0,0,W,H);
 poly(c,[[0,0],[0,65],[124,35],[251,58],[372,9],[488,36],[638,-5],[800,45],[945,2],[1101,41],[1240,15],[1280,36],[1280,0]],'#b3cfdc');
 poly(c,[[0,0],[0,102],[102,68],[225,78],[361,40],[452,74],[619,33],[759,86],[909,42],[1057,62],[1198,24],[1280,76],[1280,0]],'#83b4bc');
 poly(c,[[0,123],[157,113],[295,92],[442,126],[595,90],[724,114],[876,76],[1000,109],[1137,79],[1280,125],[1280,210],[0,210]],'#6f9fa3');
 // Sunlit river valley in the distant vista.
 poly(c,[[646,92],[800,113],[921,103],[1041,120],[1280,89],[1280,148],[1101,151],[924,138],[743,156]],'#a6d9d5');
 stroke(c,[[740,135],[870,128],[1031,137],[1160,120],[1280,119]],'#ecf8e5c4',4);
 // Distant crown-city silhouette and luminous summit on the far right.
 for(let i=0;i<14;i++){
  const x=1131+i*9,y=92-((i*7)%20);
  c.fillStyle=i%3?'#c7c0a1':'#e9e3c7';c.fillRect(x,y,7,35);
  poly(c,[[x-2,y],[x+3,y-10-i%3*3],[x+9,y]],i%2?'#837f81':'#9e8c83');
 }
 poly(c,[[0,190],[105,154],[232,177],[346,147],[493,174],[631,153],[766,190],[946,161],[1144,197],[1280,180],[1280,345],[0,345]],'#91bb84');
 const floor=c.createLinearGradient(0,160,W,H);
 floor.addColorStop(0,'#c1df90');floor.addColorStop(.45,'#91c77a');floor.addColorStop(1,'#599e7c');
 c.fillStyle=floor;c.fillRect(0,205,W,H-205);
 poly(c,[[0,210],[193,239],[344,207],[485,256],[647,215],[792,265],[959,222],[1102,269],[1280,230],[1280,463],[1111,413],[900,460],[704,405],[489,457],[279,410],[0,461]],'#a8d582');
 poly(c,[[0,448],[185,417],[350,477],[548,420],[732,489],[959,440],[1147,481],[1280,441],[1280,768],[0,768]],'#7fbc7a');
 const r=rng(19071);
 for(let i=0;i<360;i++){
  const x=r()*W,y=210+r()*555;
  ellipse(c,x,y,7+r()*24,2+r()*9,i%4===0?'#d7e59d60':'#3d8e6550');
 }
}
function cliffsAndWater(c,plan){
 const left=[[0,585],[155,603],[247,666],[347,646],[485,682],[616,677]];
 const right=[[698,679],[807,706],[972,650],[1093,706],[1280,629]];
 const g=c.createLinearGradient(0,599,0,768);
 g.addColorStop(0,'#66aab1');g.addColorStop(.4,'#2697af');g.addColorStop(1,'#1b6b98');
 c.fillStyle=g;c.fillRect(0,711,W,57);
 stroke(c,[[0,748],[132,713],[303,748],[471,712],[643,749],[837,720],[1030,740],[1250,703],[1280,700]],'#125c7c',78);
 stroke(c,[[0,746],[132,712],[303,748],[471,712],[643,749],[837,720],[1030,740],[1250,703],[1280,700]],'#3fa9bd',63);
 const rockRows=[
  [[0,655],[62,625],[122,638],[149,718],[108,768],[0,768]],
  [[257,688],[314,639],[368,669],[403,736],[376,768],[249,768]],
  [[532,675],[603,647],[649,706],[667,768],[514,768]],
  [[884,662],[942,624],[1004,675],[1028,768],[853,768]],
  [[1188,640],[1246,621],[1280,657],[1280,768],[1135,768]]
 ];
 for(const [i,shape] of rockRows.entries()){
  poly(c,shape,'#667c75','#bac6a7',3);
  poly(c,[shape[0],shape[1],[shape[1][0]+10,shape[1][1]+24],
    [shape[0][0]+15,shape[0][1]+37]],'#a8b3a0');
  if(i%2===0)stroke(c,[[shape[1][0]-15,shape[1][1]+30],
    [shape[1][0]-24,shape[1][1]+83]],'#4b666c',7);
 }
 const r=rng(245);
 for(const [cx,cy,width,height] of [[68,644,44,103],[291,653,59,92],
   [588,675,43,102],[931,652,65,110],[1224,644,57,111]]){
  // Decorative falls never replace the playable world road.
  const water=c.createLinearGradient(cx,cy,cx+13,cy+height);
  water.addColorStop(0,'#c9f7f2');water.addColorStop(.53,'#7fc5d9');water.addColorStop(1,'#2587aa');
  poly(c,[[cx-width*.46,cy],[cx+width*.44,cy],
   [cx+width*.60,cy+height],[cx-width*.57,cy+height]],water);
  for(let k=0;k<9;k++){
   const x=cx-width*.4+(k+.5)*width/9;
   stroke(c,[[x,cy+2],[x+(k%2?3:-3),cy+height*.55],
     [x+(k%3?4:-6),cy+height-5]],'#eefdf8ba',1+k%3*.6);
  }
  ellipse(c,cx,cy+height,width*.9,8,'#e6fffcdf');
  for(let i=0;i<12;i++)
   ellipse(c,cx+(r()-.5)*width*2,cy+height+(r()-.5)*16,1+r()*3,1+r()*2,'#d7f4f7c2');
 }
 const current=[[0,743],[155,722],[306,741],[476,722],[615,753],[770,728],
  [943,745],[1104,709],[1280,732]];
 const foam=rng(177);
 for(let i=0;i<110;i++){
  const a=current[Math.floor(foam()*(current.length-1))],x=a[0]+(foam()-.5)*100;
  const y=a[1]+(foam()-.5)*33;
  stroke(c,[[x,y],[x+5+foam()*13,y-foam()*3]],'#eaffff89',.8+foam()*1.4);
 }
 // Preserve parkland behind road and pads even near the lower cliff margin.
}
function rock(c,x,y,s=1){
 c.save();c.translate(x,y);c.scale(s,s);
 poly(c,[[-19,4],[-22,-9],[-7,-25],[12,-21],[24,-7],[18,13],[-7,14]],'#7d9286','#536d65',2);
 poly(c,[[-22,-9],[-7,-25],[12,-21],[2,-8]],'#d2d1b0');
 poly(c,[[2,-8],[12,-21],[24,-7],[18,13]],'#a2b3a3');c.restore();
}
function flower(c,x,y,kind=0){
 const palette=['#fff2d9','#eca8cf','#a9d8ec','#e7d895'];const color=palette[kind%4];
 for(let i=0;i<5;i++){const a=i*TWO/5;
  ellipse(c,x+Math.cos(a)*2.7,y+Math.sin(a)*2.7,2.2,1.8,color);}
 ellipse(c,x,y,1.3,1.3,'#f7c56d');
}
function tree(c,x,y,s=1){
 c.save();c.translate(x,y);c.scale(s,s);
 ellipse(c,9,14,31,10,'#34554e6b');
 stroke(c,[[0,5],[-2,-60]],'#6e503a',10);
 stroke(c,[[-2,-36],[-22,-53]],'#755d43',5);
 stroke(c,[[-2,-43],[24,-67]],'#755d43',5);
 const parts=[[-24,-60,29],[8,-78,35],[31,-54,29],[-3,-43,34]];
 const r=rng(Math.abs((x*59+y*113)|0));
 for(const [px,py,rad] of parts){
  ellipse(c,px+2,py+7,rad+2,rad*.73,'#28634a');
  ellipse(c,px,py,rad,rad*.72,r()>.4?'#458d57':'#3e8061');
  ellipse(c,px-7,py-9,rad*.73,rad*.4,r()>.35?'#94c46c':'#70b66b');
  for(let i=0;i<12;i++){
   ellipse(c,px+(r()-.5)*rad*1.1,py-8+(r()-.5)*rad*.7,
    1+r()*3,1+r()*2,'#c1e58c6b');
  }
 }c.restore();
}
function cypress(c,x,y,s=.8){
 c.save();c.translate(x,y);c.scale(s,s);
 ellipse(c,4,7,14,6,'#2e604e55');
 stroke(c,[[0,6],[0,-101]],'#765b49',6);
 poly(c,[[-21,-10],[-14,-52],[0,-120],[14,-52],[22,-10]],'#276951','#427d58',2.5);
 poly(c,[[-7,-13],[-5,-74],[0,-105],[6,-69],[10,-15]],'#4e966a');
 c.restore();
}
function fence(c,a,b){
 const d=Math.hypot(b[0]-a[0],b[1]-a[1]);
 c.save();c.translate(...a);c.rotate(Math.atan2(b[1]-a[1],b[0]-a[0]));
 stroke(c,[[0,-13],[d,-13]],'#876542',3.4);stroke(c,[[0,-2],[d,-2]],'#a67a51',3.1);
 for(let x=0;x<=d+3;x+=20){
  stroke(c,[[x,-20],[x,5]],'#654938',5);
  stroke(c,[[x-1,-19],[x-1,-3]],'#c39a5a',2);
 }c.restore();
}
function meadow(c,plan){
 const f=rng(71936);
 const patches=[[135,154,100,42],[382,137,130,68],[760,123,170,65],
  [1131,205,99,47],[169,653,115,69],[465,672,150,59],
  [799,645,126,50],[1173,687,90,50]];
 for(const [x,y,rx,ry] of patches){
  ellipse(c,x,y,rx,ry,'#c0d98560');
  for(let i=0;i<65;i++){
   const xx=x+(f()-.5)*rx*1.8,yy=y+(f()-.5)*ry*1.7;
   if(!safe(xx,yy,plan,5))continue;
   if(i%9===0)flower(c,xx,yy,i);
   else{stroke(c,[[xx,yy+2],[xx+f()*3-1,yy-3-f()*3]],i%3?'#559d5f':'#e4d78c',.8);}
  }
 }
 const planned=[[67,162,1.12],[222,172,.64],[353,151,.7],[532,169,.51],
  [778,166,.69],[932,137,.68],[1133,152,.68],
  [33,589,.57],[276,646,.49],[492,636,.6],[816,684,.45],[1230,651,.53]];
 for(const [x,y,s] of planned){if(safe(x,y,plan,35))tree(c,x,y,s);}
 for(let i=0;i<85;i++){
  const x=f()*W,y=145+f()*550;
  if(!safe(x,y,21))continue;
  if(i%5===0)cypress(c,x,y,.33+f()*.23);
  else if(i%3===0)rock(c,x,y,.36+f()*.5);
  else{
   ellipse(c,x,y+6,10+f()*10,4+f()*5,'#316f5288');
   ellipse(c,x,y,7+f()*10,6+f()*7,i%2?'#63ae65':'#8cbd6a');
  }
 }
 for(const seg of [
  [[25,249],[171,269]],[[252,163],[392,187]],[[673,170],[805,181]],
  [[962,169],[1107,186]],[[36,633],[181,649]],
  [[430,636],[572,653]],[[832,645],[939,670]],[[1063,658],[1221,667]]
 ])fence(c,...seg);
 for(let i=0;i<380;i++){
  const x=f()*W,y=142+f()*581;
  if(!safe(x,y,9)||y>700)continue;
  if(i%6===0)flower(c,x,y,i);
  else ellipse(c,x,y,1.5+f()*3,.6+f()*1.4,
   i%3===0?'#f4efbb':'#518d678c');
 }
}
function road(c,path){
 for(const [width,col] of [[120,'#476c51'],[114,'#788466'],[109,'#aa8564'],
   [103,'#d9ab77'],[96,'#f5d59a'],[79,'#edbf82'],[49,'#f6d9a4a0']]){
  stroke(c,path,col,width);
 }
 const r=rng(704);
 for(let i=2;i<path.length-2;i+=2){
  const a=path[i],b=path[i+1],dx=b[0]-a[0],dy=b[1]-a[1],
   norm=Math.hypot(dx,dy)||1;
  for(const sign of [-1,1]){
   if(r()<.18)continue;
   const nx=-dy/norm,ny=dx/norm,x=a[0]+nx*sign*(52+r()*8),
    y=a[1]+ny*sign*(52+r()*8);
   ellipse(c,x,y,2+r()*3,1+r()*2,i%4?'#e7d7b6':'#879a83');
  }
 }
 for(let i=3;i<path.length;i+=6){
  const p=path[i];ellipse(c,p[0]+(r()-.5)*45,p[1]+(r()-.5)*35,
   1+r()*2,.5+r(),'#b98e6075');
 }
}
function pads(c,plan){
 for(const [i,p] of plan.pads.entries()){
  const x=p.x,y=p.y;
  ellipse(c,x+4,y+15,43,22,'#335d567c');
  ellipse(c,x,y+8,44,23,'#506d65');
  ellipse(c,x,y+2,42,22,'#a1b1a3');
  ellipse(c,x,y-4,39,20,'#f4dca6');
  ellipse(c,x,y-5,32,16,'#e6ce98');
  c.beginPath();c.ellipse(x,y-5,34,17,0,0,TWO);
  c.lineWidth=1.5;c.strokeStyle='#806f58';c.stroke();
  const r=rng(35+i*51);
  for(let k=0;k<24;k++){
   const angle=r()*TWO,d=28+r()*11;
   ellipse(c,x+Math.cos(angle)*d,y-4+Math.sin(angle)*d*.49,
    1+r()*3,1+r()*2,k%3?'#f1e8ce':'#758f87');
  }
  poly(c,[[x,y-14],[x+10,y-5],[x,y+3],[x-10,y-5]],
   '#efe8ca','#85775e',1.2);
  ellipse(c,x,y-5,3.2,2.2,'#83c4c6');
 }
}
function entrance(c){
 c.save();c.translate(39,337);
 ellipse(c,-1,39,73,24,'#3b544b66');
 // Stone gate flanks the canonical left entry; all textures stay behind enemies.
 for(const sign of [-1,1]){
  const x=sign*49;
  poly(c,[[x-17,7],[x-15,-75],[x-7,-99],[x+12,-96],[x+20,-75],[x+22,10]],
   '#b0bbac','#596e68',3);
  poly(c,[[x-17,-75],[x-7,-99],[x+12,-96],[x+4,-73]],'#e8e0bc');
  poly(c,[[x-26,-88],[x-22,-103],[x+25,-104],[x+27,-90]],'#84918b','#506960',2);
  c.fillStyle='#34566e';c.fillRect(x-8,-53,17,37);
  poly(c,[[x-8,-16],[x,-8],[x+9,-16]],'#34566e');
  stroke(c,[[x,-50],[x,-13]],'#ecc86f',2);
 }
 // Overhead stone arch and blue flag: original fantasy emblem identity.
 stroke(c,[[-39,-63],[-39,-102],[-13,-126],[16,-124],[46,-103],[46,-66]],'#677b73',24);
 stroke(c,[[-39,-64],[-39,-99],[-13,-122],[15,-120],[45,-100],[45,-65]],'#dadac0',17);
 for(const x of [-53,53]){
  poly(c,[[x-12,-110],[x+12,-110],[x+14,-121],[x-14,-121]],'#c9bb99','#6e7970');
  ellipse(c,x,-124,7,5,'#ffbe65');
  ellipse(c,x,-131,3,9,'#ffd37d');
 }
 c.restore();
}
function archRuins(c){
 c.save();c.translate(458,300);
 ellipse(c,3,16,78,18,'#3b614e5f');
 const colors=['#a2b1a3','#d4d1b3','#7c8f86'];
 for(const x of [-45,45]){
  poly(c,[[x-13,5],[x-16,-72],[x-7,-94],[x+13,-91],[x+18,7]],
   '#9caf9d','#58796d',3);
  poly(c,[[x-16,-72],[x-7,-94],[x+13,-91],[x+2,-70]],'#e0ddbe');
  for(let j=0;j<4;j++)
   stroke(c,[[x-12,-55+j*16],[x+12,-58+j*16]],'#697e7680',1);
 }
 stroke(c,[[-46,-83],[-32,-110],[0,-119],[32,-110],[45,-83]],'#667c70',22);
 stroke(c,[[-46,-83],[-32,-110],[0,-119],[32,-110],[45,-83]],'#d5d3b3',15);
 for(let i=0;i<25;i++){
  const x=(rng(i*17+761)()-.5)*150,y=5-(i%8)*7;
  if(i%4===0)rock(c,x,y,.25+(i%3)*.1);
  else flower(c,x,y,i);
 }
 c.restore();
}
function shrine(c){
 c.save();c.translate(1116,113);
 ellipse(c,2,27,87,28,'#3d5c537c');
 for(let i=0;i<5;i++){
  poly(c,[[-64+i*4,22-i*8],[65-i*4,22-i*8],
    [55-i*4,28-i*8],[-54+i*4,28-i*8]],
    i%2?'#b2b7a6':'#ded7b4','#687c77',1.6);
 }
 for(const sign of [-1,1]){
  const x=sign*32;
  poly(c,[[x-14,-4],[x-11,-72],[x-3,-102],[x+9,-70],[x+12,-4]],
   '#93a99e','#587c7b',2.5);
  poly(c,[[x-11,-72],[x-3,-102],[x+9,-70],[x,-66]],'#d7d6bf');
  ellipse(c,x,-64,4,7,'#82cce6');
 }
 const glow=c.createRadialGradient(0,-61,1,0,-61,58);
 glow.addColorStop(0,'#c5ffffda');glow.addColorStop(.35,'#69d3f2a8');glow.addColorStop(1,'#56f9ef00');
 c.fillStyle=glow;c.fillRect(-60,-121,120,120);
 poly(c,[[0,-114],[19,-79],[16,-34],[0,-14],[-19,-36],[-19,-79]],
  '#50a8dc','#eafcf4',2.2);
 poly(c,[[0,-114],[0,-14],[-19,-36],[-19,-79]],'#95eff0');
 poly(c,[[0,-114],[19,-79],[16,-34],[0,-14]],'#2375bc');
 stroke(c,[[0,-107],[0,-27]],'#f4ffff',2);
 for(let i=0;i<5;i++){
  const xx=-50+i*25;
  ellipse(c,xx,12,3,2,'#fff5c0');
 }
 c.restore();
}
function exitBridge(c){
 c.save();c.translate(1255,410);
 // Directly on canonical road exit. No route coordinates modified.
 poly(c,[[-90,-55],[40,-41],[45,47],[-91,55]],'#bdb9a8','#6f827f',2);
 for(let i=-74;i<50;i+=13)
  stroke(c,[[i,-48],[i+1,47]],i%2?'#e9ddba':'#a7a69b',2);
 for(const y of [-64,61]){
  stroke(c,[[-94,y],[47,y+4]],'#718b82',8);
  stroke(c,[[-94,y-2],[47,y+2]],'#ded6b6',4);
  for(let x=-87;x<50;x+=31){
   poly(c,[[x-4,y-11],[x+5,y-11],[x+7,y+5],[x-6,y+5]],
    '#bbc9b9','#647e76',2);
  }
 }
 for(const x of [-88,31]){
  ellipse(c,x,-76,8,5,'#f7b960');ellipse(c,x,-84,4,11,'#ffdb7c');
  c.fillStyle='#355c7d';c.fillRect(x-5,-48,12,27);
 }
 c.restore();
}
export function makeR7MapPlan(map){
 if(map?.id!==1||map.path?.length!==133||map.spots?.length!==8||
   map.gold!==365||map.branches?.length!==0)
  throw Error('R7 M01 canonical gameplay geometry mismatch');
 return Object.freeze({
  version:R7_MAP01_ART_VERSION,mapId:1,width:W,height:H,
  path:Object.freeze(map.path.map(p=>Object.freeze([p[0],p[1]]))),
  pads:Object.freeze(map.spots.map((p,i)=>Object.freeze({
   index:i,x:p.cx*64+32,y:p.cy*64+32,kind:p.kind
  }))),roadWidth:110
 });
}
export function makeR7MapCanvas(map,{density=2}={}){
 if(typeof document==='undefined'||![1,2].includes(density))
  throw Error('R7 browser Canvas authoring requires density 1/2');
 const plan=makeR7MapPlan(map);
 const canvas=document.createElement('canvas');canvas.width=W*density;canvas.height=H*density;
 const c=canvas.getContext('2d',{alpha:false});
 if(!c)throw Error('R7 Canvas 2D unavailable');
 c.setTransform(density,0,0,density,0,0);
 distantWorld(c);cliffsAndWater(c,plan);meadow(c,plan);
 road(c,plan.path);entrance(c);archRuins(c);shrine(c);exitBridge(c);pads(c,plan);
 return Object.freeze({canvas,plan,qa:Object.freeze({
  version:R7_MAP01_ART_VERSION,mapId:1,routeVertices:plan.path.length,
  padsRendered:plan.pads.length,pixels:[canvas.width,canvas.height],
  features:Object.freeze(['fortified-entry','sandy-canonical-S-road','stone-arch',
   'blue-crystal-shrine','castle-vista','cliffs','river','waterfalls',
   'fortified-exit-bridge','meadow-flowers','forest','eight-build-pads'])
 })});
}
