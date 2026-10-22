/**
 * SEMANTROPIC TD R6 — Campos del Molino / Golden Valley
 * Hand-authored deterministic Canvas illustration, based on the director's
 * PREMIUM rural mockup as style reference, not a copy.
 *
 * WORLD SPACE: 1280 x 768, protected path centerline and eight pads unchanged.
 * Layering: alpine vista, agricultural terraces, river / waterfall scenery,
 * vineyards and wheat, premium winding dirt road, bridges, mill and farm,
 * 3/4 painted trees, rocks, flowers, pads. Every gameplay path/pad clear.
 * Only paints ONCE to the existing 2x scene CanvasTexture. No WebGL readback.
 */
export const R6_MAP02_ART='r6-m02-golden-valley-paint-v1';
const W=1280,H=768,TAU=Math.PI*2;
const C=Object.freeze({
 sky:'#c8edff',gold:'#efd17c',wheat:'#e6b858',wheatShade:'#bd8748',
 turf:'#9bc76b',turfDeep:'#4e9271',pine:'#2c705d',mint:'#bedb8b',
 road:'#edc68e',roadShade:'#a5784c',stone:'#a2aca4',
 dark:'#315c58',river:'#368bac',spray:'#e9fcfa',wood:'#785438'
});
const seed=(n)=>()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296};
const lerp=(a,b,t)=>a+(b-a)*t;
const polygon=(ctx,pts,fill,stroke=null,width=1)=>{
 ctx.beginPath();ctx.moveTo(...pts[0]);for(let i=1;i<pts.length;i++)ctx.lineTo(...pts[i]);ctx.closePath();
 if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}
};
const ellipse=(ctx,x,y,rx,ry,fill,rotation=0)=>{
 ctx.beginPath();ctx.ellipse(x,y,Math.max(.5,rx),Math.max(.5,ry),rotation,0,TAU);ctx.fillStyle=fill;ctx.fill();
};
function roadDistance(x,y,path){
 let best=1e6;for(let i=1;i<path.length;i++){
  const a=path[i-1],b=path[i],dx=b[0]-a[0],dy=b[1]-a[1],v=dx*dx+dy*dy;
  const t=v?Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/v)):0;
  best=Math.min(best,Math.hypot(x-a[0]-dx*t,y-a[1]-dy*t));
 }return best;
}
function clear(x,y,plan,range=0){
 if(roadDistance(x,y,plan.path)<75+range)return false;
 if(plan.pads.some(p=>Math.hypot(x-p.x,y-p.y)<61+range))return false;
 return true;
}
function traced(ctx,points,color,width){
 ctx.beginPath();ctx.lineCap='round';ctx.lineJoin='round';
 ctx.moveTo(points[0][0],points[0][1]);
 for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);
 ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();
}
function hills(ctx){
 const sky=ctx.createLinearGradient(0,0,0,205);
 sky.addColorStop(0,'#a6d7f2');sky.addColorStop(.4,'#ecf5d9');sky.addColorStop(1,'#c3db9d');
 ctx.fillStyle=sky;ctx.fillRect(0,0,W,245);
 // Misty blue ridges: bespoke rural depth, away from enemy path.
 polygon(ctx,[[0,0],[0,96],[95,60],[220,82],[347,40],[475,65],[590,31],[695,78],[831,35],[952,58],[1056,16],[1200,42],[1280,25],[1280,0]],'#a2c4cc');
 polygon(ctx,[[0,0],[0,75],[85,24],[175,41],[266,13],[380,49],[490,7],[590,53],[718,16],[816,40],[935,3],[1019,37],[1120,13],[1280,40],[1280,0]],'#bed2db');
 polygon(ctx,[[0,132],[133,107],[229,113],[370,81],[477,120],[589,75],[730,105],[858,65],[1044,95],[1146,50],[1280,78],[1280,177],[0,177]],'#86ac92');
 polygon(ctx,[[0,172],[142,124],[271,143],[427,105],[558,144],[671,107],[842,154],[980,119],[1126,131],[1280,105],[1280,265],[0,265]],'#8ab479');
 // Lakeside in the far-right distance, scenic only.
 const water=ctx.createLinearGradient(960,92,1130,180);
 water.addColorStop(0,'#9ac6c6');water.addColorStop(.6,'#72afbf');water.addColorStop(1,'#e4ebd5');
 polygon(ctx,[[995,88],[1107,90],[1280,70],[1280,165],[1170,137],[1070,131]],water);
 const r=seed(42);
 for(let i=0;i<100;i++){
  const x=955+r()*325,y=95+r()*50;
  traced(ctx,[[x,y],[x+4+r()*17,y-.5]],'#e5f4e9aa',.6+r());
 }
 // Distant village + rooflets. Horizon silhouette: deliberately small.
 for(let i=0;i<17;i++){
  const x=697+i*15+(i%3)*4,y=82+(i%4)*2;
  ctx.fillStyle='#e8ddb6';ctx.fillRect(x,y-7,11,11);
  polygon(ctx,[[x-2,y-7],[x+5,y-15],[x+14,y-7]],i%3?'#a66d4d':'#d19456');
  if(i%4===1){ctx.fillStyle='#e7e2c8';ctx.fillRect(x+3,y-23,6,16);
   polygon(ctx,[[x+1,y-23],[x+6,y-31],[x+11,y-23]],'#a96548')}
 }
 // Foreground rolling, warm country palette.
 const floor=ctx.createLinearGradient(0,170,1280,768);
 floor.addColorStop(0,'#b8d789');floor.addColorStop(.45,'#9bc574');
 floor.addColorStop(1,'#6da97e');ctx.fillStyle=floor;ctx.fillRect(0,175,W,593);
 polygon(ctx,[[0,172],[185,195],[390,157],[606,225],[848,165],[1020,216],[1280,170],[1280,369],[1104,335],[940,364],[721,311],[503,374],[260,330],[0,370]],'#a6d27b');
 polygon(ctx,[[0,393],[250,339],[432,403],[650,350],[837,407],[1017,338],[1280,411],[1280,624],[1014,570],[790,613],[560,542],[360,616],[0,558]],'#88bd7d');
 polygon(ctx,[[0,564],[230,527],[451,611],[735,539],[933,615],[1219,557],[1280,584],[1280,768],[0,768]],'#75a67d');
 const grass=seed(911);
 for(let i=0;i<280;i++){
  const x=grass()*W,y=180+grass()*570,rr=6+grass()*24;
  ellipse(ctx,x,y,rr,3+grass()*9,i%3?'#aed17a52':'#538e5d35',grass()*.8);
 }
}
function river(ctx){
 // River occupies the lower terrain and never changes the route polyline.
 const course=[[0,657],[131,659],[263,677],[343,703],[437,721],[562,714],
  [712,750],[868,743],[1024,700],[1138,710],[1280,675]];
 traced(ctx,course,'#385d61',104);
 traced(ctx,course,'#648883',94);
 traced(ctx,course,'#dbd2b2',83);
 const grad=ctx.createLinearGradient(0,637,0,778);
 grad.addColorStop(0,'#52b1be');grad.addColorStop(.48,'#2587a8');
 grad.addColorStop(1,'#115f82');
 traced(ctx,course,grad,70);
 traced(ctx,course,'#6ec3d055',48);
 const r=seed(791);
 for(let i=0;i<155;i++){
  const p=course[Math.floor(r()*(course.length-1))],q=course[course.indexOf(p)+1];
  const t=r(),x=lerp(p[0],q[0],t)+(r()-.5)*36,y=lerp(p[1],q[1],t)+(r()-.5)*28;
  traced(ctx,[[x,y],[x+4+r()*17,y-2-r()*2]],i%4===0?'#f4ffffae':'#98e7ed65',.7+r()*2);
 }
 // Broken cliff terraces below playable route; cascading lower foreground.
 const drops=[
  [[139,612],[191,632],[226,687],[188,749],[96,756],[70,693]],
  [[457,641],[509,665],[546,726],[489,770],[394,766],[386,715]],
  [[908,629],[978,644],[1032,704],[989,762],[886,768],[872,706]],
  [[1171,612],[1216,645],[1280,696],[1280,768],[1159,748],[1138,685]]
 ];
 for(let i=0;i<drops.length;i++){
  const pts=drops[i];polygon(ctx,pts,'#556b69','#b9ae8c',3);
  for(let j=0;j<10;j++){
   const x=pts[0][0]+(j+1)*(pts[1][0]-pts[0][0])/11,y=pts[0][1]+j*.6;
   traced(ctx,[[x,y],[x+(j%2?4:-2),y+38+(j%3)*7]],
    j%3?'#9ac0b7':'#e6d3a6',1.5+j%2);
  }
 }
 for(const [x,y,width,height] of [[198,628,46,65],[510,656,44,72],[990,660,62,71],[1242,650,44,65]]){
  ctx.save();
  const fall=ctx.createLinearGradient(x,y,x,y+height);
  fall.addColorStop(0,'#dffefa');fall.addColorStop(.35,'#76c7dc');
  fall.addColorStop(1,'#3b9ab7');
  ctx.fillStyle=fall;ctx.beginPath();ctx.moveTo(x-width/2,y);
  ctx.bezierCurveTo(x+width/4,y+8,x-width/4,y+32,x-width/2,y+height);
  ctx.lineTo(x+width/2,y+height);ctx.bezierCurveTo(x+width/4,y+22,x+width/2,y+10,x+width/2,y);
  ctx.closePath();ctx.fill();
  for(let j=0;j<8;j++){
   const xx=x-width/2+6+j*(width-12)/7;
   traced(ctx,[[xx,y+3],[xx-2,y+height*.55],[xx+(j%2?3:-4),y+height-6]],
    '#e9ffffad',1+j%3*.5);
  }
  ellipse(ctx,x,y+height,width*.72,6,'#efffffe3');
  for(let k=0;k<13;k++)ellipse(ctx,x+(r()-.5)*width*1.5,y+height+(r()-.5)*10,1+r()*3,1+r()*2,'#e8f7f5bd');
  ctx.restore();
 }
 // Tributary emerges in the wheat terraces; scenic stream behind the road.
 const tributary=[[581,183],[602,225],[610,281],[609,346],[605,412],[572,480],[566,575],[566,697]];
 traced(ctx,tributary,'#5d8b86',44);
 traced(ctx,tributary,'#f2e7c0',36);
 traced(ctx,tributary,'#3b9eb4',29);
 traced(ctx,tributary,'#b6f5ed80',8);
}
function floweringBush(ctx,x,y,s=1,bright=false){
 ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 ellipse(ctx,0,8,21,10,'#375c4f3c');
 const leaves=[[-14,-2,9,8],[0,-9,13,12],[11,0,11,10],[-3,3,13,10]];
 for(const [xx,yy,rx,ry] of leaves){ellipse(ctx,xx,yy+3,rx,ry,'#306e50');
  ellipse(ctx,xx-2,yy-2,rx*.85,ry*.8,bright?'#8cca72':'#529661')}
 const r=seed((x*161+y*37+745)>>>0);
 for(let i=0;i<11;i++){
  const xx=(r()-.5)*39,yy=(r()-.5)*19-3;
  ellipse(ctx,xx,yy,1.7+r()*2,1.3+r()*1.5,i%4?'#ffeac9':'#e799bb');
 }ctx.restore();
}
function tree(ctx,x,y,s=1,autumn=false){
 ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 ellipse(ctx,8,9,35,9,'#385c4b55');
 ctx.strokeStyle='#72503e';ctx.lineWidth=10;ctx.lineCap='round';
 traced(ctx,[[0,5],[-1,-49]],'#72503e',10);
 traced(ctx,[[-1,-28],[-24,-48]],'#705442',5);
 traced(ctx,[[0,-38],[23,-64]],'#705442',5);
 const centers=[[-23,-51,26],[-2,-71,32],[27,-52,27],[-8,-40,28]];
 const base=autumn?['#a47a43','#c18e43','#e0b756']:['#2c775e','#4c9460','#7cba6b'];
 for(const [k,[xx,yy,rad]] of centers.entries()){
  ellipse(ctx,xx+2,yy+5,rad+2,rad*.72,'#26584f');
  ellipse(ctx,xx,yy-2,rad,rad*.75,base[k%2]);
  ellipse(ctx,xx-6,yy-11,rad*.75,rad*.39,base[(k+1)%3]);
  const light=seed((x*11+y*7+k*113)>>>0);
  for(let n=0;n<12;n++){
   const rx=xx+(light()-.5)*rad*1.2,ry=yy-3+(light()-.5)*rad*.6;
   ellipse(ctx,rx,ry,2+light()*3,1+light()*2,'#d7ed9e4d');
  }
 }ctx.restore();
}
function cypress(ctx,x,y,s=1){
 ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 ellipse(ctx,4,4,16,6,'#1a57483e');
 traced(ctx,[[0,0],[1,-92]],'#4b5546',7);
 polygon(ctx,[[-21,-9],[-13,-50],[-7,-80],[0,-118],[8,-79],[17,-51],[21,-11]],
  '#1c6856','#4e8864',2);
 polygon(ctx,[[-11,-16],[-7,-65],[0,-106],[4,-61],[11,-18]],'#397e63');
 ctx.restore();
}
function rock(ctx,x,y,s=1){
 ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 polygon(ctx,[[-16,4],[-21,-7],[-5,-21],[13,-16],[22,-2],[16,10],[-8,13]],
  '#718983','#526d69',2);
 polygon(ctx,[[-21,-7],[-5,-21],[13,-16],[0,-5]],'#bec4a2');
 polygon(ctx,[[0,-5],[13,-16],[22,-2],[16,10]],'#8c9f93');
 ctx.restore();
}
function wheat(ctx,plan){
 const patches=[
  [[0,130],[265,129],[346,174],[282,239],[38,247]],
  [[355,123],[534,108],[667,146],[680,188],[457,199]],
  [[790,115],[984,122],[1133,168],[1098,226],[877,188]],
  [[0,502],[209,528],[247,607],[201,665],[0,626]],
  [[247,697],[489,702],[618,768],[223,768]],
  [[671,677],[851,682],[952,750],[742,768]],
  [[1054,521],[1240,503],[1280,582],[1150,643],[1026,600]]
 ];
 const r=seed(2205);
 for(let i=0;i<patches.length;i++){
  const pts=patches[i];ctx.save();
  ctx.beginPath();ctx.moveTo(...pts[0]);for(const p of pts.slice(1))ctx.lineTo(...p);ctx.closePath();ctx.clip();
  const grad=ctx.createLinearGradient(0,pts[0][1],40,pts[2][1]+40);
  grad.addColorStop(0,'#eeca75');grad.addColorStop(.5,'#d6ad57');grad.addColorStop(1,'#a77a39');
  ctx.fillStyle=grad;ctx.fillRect(0,50,W,718);
  // Furrows and individual golden ears generate color/noise at game zoom.
  for(let j=0;j<390;j++){
   const x=pts[0][0]-25+r()*(Math.max(...pts.map(z=>z[0]))-pts[0][0]+75);
   const y=Math.min(...pts.map(z=>z[1]))+r()*(Math.max(...pts.map(z=>z[1]))-Math.min(...pts.map(z=>z[1])));
   if(!clear(x,y,plan,12))continue;
   const length=5+r()*8;const tilt=(r()-.5)*5;
   traced(ctx,[[x,y+4],[x+tilt,y-length]],j%5===0?'#8b813eaa':'#f3d27daa',.8+r()*1.4);
   ellipse(ctx,x+tilt,y-length,1.4,3.5,j%3?'#fff0b3':'#bb8f45',-.2);
  }
  ctx.restore();
  polygon(ctx,pts,null,'#866b3caa',2.5);
 }
 return patches.length;
}
function fence(ctx,x1,y1,x2,y2,step=20){
 const len=Math.hypot(x2-x1,y2-y1),rungs=Math.ceil(len/step),ang=Math.atan2(y2-y1,x2-x1);
 ctx.save();ctx.translate(x1,y1);ctx.rotate(ang);
 traced(ctx,[[0,-10],[len,-10]],'#654b34',3.7);
 traced(ctx,[[0,0],[len,0]],'#9b7344',3.5);
 for(let i=0;i<=rungs;i++){
  const x=i*len/rungs;
  traced(ctx,[[x,-17],[x,7]],'#4f4637',5);
  traced(ctx,[[x,-16],[x,-2]],'#c79a60',2.5);
 }ctx.restore();
}
function wheatFences(ctx){
 for(const row of [
 [[25,249],[265,242]],[[282,246],[340,199]],[[348,202],[516,221]],
 [[740,186],[864,199]],[[1080,224],[1250,253]],[[20,512],[196,524]],
 [[245,709],[437,712]],[[681,673],[808,681]],[[1051,519],[1210,496]]
 ])fence(ctx,...row[0],...row[1],20);
}
function road(ctx,plan){
 const path=plan.path;
 // Flatten earth, mineral edging and four paint passes for warm illustrative road.
 traced(ctx,path,'#4b735b',116);
 traced(ctx,path,'#776b4c',109);
 traced(ctx,path,'#c19564',103);
 traced(ctx,path,'#f2d69c',95);
 traced(ctx,path,'#f1c888',84);
 traced(ctx,path,'#e9bd7e',70);
 traced(ctx,path,'#f2d29683',40);
 // Hand-placed border rocks & earth flecks following ORIGINAL polyline.
 const r=seed(947);
 for(let i=1;i<path.length;i+=3){
  const a=path[i-1],b=path[i],v=[b[0]-a[0],b[1]-a[1]],l=Math.hypot(...v)||1;
  const nx=-v[1]/l,ny=v[0]/l;
  for(const side of [-1,1]){
   if(r()<.21)continue;
   const x=a[0]+nx*side*(51+r()*7),y=a[1]+ny*side*(51+r()*7);
   ellipse(ctx,x,y,2+r()*4,1+r()*2,
    side===1?'#e9d8aa':'#a2a28a',r()*.7);
  }
 }
 // Shallow wagon traces, not road route nor collisions.
 ctx.save();ctx.setLineDash([7,30]);traced(ctx,path,'#af925850',1.5);ctx.restore();
 for(let i=4;i<path.length-3;i+=5){
  const p=path[i],q=path[i+1];const angle=Math.atan2(q[1]-p[1],q[0]-p[0]);
  for(let j=0;j<3;j++){
   const x=p[0]+(r()-.5)*48,y=p[1]+(r()-.5)*45;
   ellipse(ctx,x,y,.5+r()*1.4,1+r()*2.5,i%2?'#c19d67a0':'#e8d3a3b0',angle);
  }
 }
}
function bridge(ctx){
 // Tributary goes UNDER the actual lower-turn road, near x=566/y=642.
 // Bridge planking overlays only the existing road texture. No new path.
 const x=564,y=642;ctx.save();ctx.translate(x,y);
 const r=seed(324);
 ctx.save();ctx.beginPath();ctx.rect(-42,-43,84,84);ctx.clip();
 ctx.fillStyle='#af875eaf';ctx.fillRect(-41,-41,82,82);
 for(let i=-39;i<=39;i+=9){
  ctx.fillStyle=i%2?'#ddb989':'#e7cb98';ctx.fillRect(-41,i,82,7);
  traced(ctx,[[-41,i+7],[41,i+7]],'#74563e95',1.3);
 }
 for(const xx of [-38,38]){
  ctx.fillStyle='#765b45';ctx.fillRect(xx-2,-41,4,82);
  ctx.fillStyle='#cda878';for(let yy=-35;yy<40;yy+=16)ctx.fillRect(xx-3,yy,6,5);
 }
 ctx.restore();
 for(const xx of [-43,43]){
  ctx.strokeStyle='#66503f';ctx.lineWidth=4;
  traced(ctx,[[xx,-44],[xx,-30]],'#8a6444',5);
  traced(ctx,[[xx,30],[xx,44]],'#8a6444',5);
 }
 ctx.restore();
}
function scenicFootbridge(ctx,x,y,angle=0,scale=1){
 // Secondary farm footbridges across the lower river; visual props only.
 ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(scale,scale);
 ellipse(ctx,4,17,42,13,'#294b4b79');
 polygon(ctx,[[-38,0],[-35,-15],[35,-15],[39,0]],'#c9a879','#6b5543',2);
 for(let j=-33;j<35;j+=8){
  polygon(ctx,[[j,-14],[j+6,-14],[j+7,2],[j+1,3]],
   j%3?'#e2c18b':'#b99365','#73583b',.65);
 }
 for(const sign of [-1,1]){
  traced(ctx,[[-38,sign*20],[38,sign*20]],'#695344',2.6);
  for(let j=-36;j<40;j+=14)
   traced(ctx,[[j,sign*20],[j,sign*8]],'#805f47',3);
 }
 ctx.restore();
}
function mill(ctx,x,y){
 ctx.save();ctx.translate(x,y);
 ellipse(ctx,8,30,78,22,'#294d4770');
 // Cobbled base: asymmetric stone brick texture and teal copper trim.
 polygon(ctx,[[-38,22],[-42,-49],[-30,-93],[25,-94],[42,-51],[43,22]],
  '#d4ccb2','#526e68',3.2);
 polygon(ctx,[[-42,-49],[-30,-93],[25,-94],[16,-48]],'#f0e3b8');
 polygon(ctx,[[16,-48],[25,-94],[42,-51],[43,22],[27,22]],'#a8aa9c');
 for(let row=0;row<7;row++){
  const y0=18-row*14;
  traced(ctx,[[-35+row*.6,y0],[34-row*.5,y0]],'#7f8a81aa',1.2);
  for(let i=0;i<3;i++){
   const xx=-24+i*20+(row%2)*9;
   traced(ctx,[[xx,y0-12],[xx+1,y0]],'#8a999284',1);
  }
 }
 polygon(ctx,[[-54,-92],[-22,-145],[0,-155],[25,-145],[57,-92]],
  '#aa5d39','#744532',3);
 for(let i=0;i<8;i++){
  const yy=-97-i*6;
  traced(ctx,[[-45+i*3,yy],[45-i*3,yy]],i%2?'#d98b4d':'#814b34',2.3);
 }
 ctx.fillStyle='#684d36';ctx.fillRect(-12,-34,25,54);
 ctx.fillStyle='#c29f71';ctx.fillRect(-9,-31,18,51);
 traced(ctx,[[-9,-1],[9,-1]],'#7d5d43',2);
 ctx.fillStyle='#435f68';ctx.fillRect(-26,-77,18,23);
 ctx.fillStyle='#bbdbce';ctx.fillRect(-23,-74,12,17);
 traced(ctx,[[-17,-75],[-17,-57]],'#526769',2);
 traced(ctx,[[-24,-65],[-10,-65]],'#526769',2);
 // Windwheel perpendicular to player; cream sail cloths and wooden axes.
 ctx.save();ctx.translate(2,-96);ctx.rotate(.24);
 const r=seed(157);for(let k=0;k<4;k++){
  ctx.save();ctx.rotate(k*Math.PI/2);
  traced(ctx,[[0,0],[0,-98]],'#603e30',8);
  polygon(ctx,[[7,-22],[14,-30],[33,-92],[9,-102]],
   '#f4e7bf','#855d3c',2.4);
  for(let q=0;q<5;q++)traced(ctx,[[11,-30-q*13],[29-q*3,-32-q*13]],'#b48b6d',1);
  ctx.restore();
 }
 ellipse(ctx,0,0,11,11,'#6f5139');ellipse(ctx,0,-2,6,6,'#efc985');
 ctx.restore();ctx.restore();
}
function farmhouse(ctx,x,y){
 ctx.save();ctx.translate(x,y);
 ellipse(ctx,5,35,78,23,'#355a4d70');
 ctx.fillStyle='#ddcb9d';ctx.fillRect(-64,-22,125,61);
 polygon(ctx,[[-76,-27],[-8,-72],[69,-28]],'#9e5940','#784836',3);
 polygon(ctx,[[-65,-29],[-9,-66],[47,-31]],'#c4744b');
 for(let i=0;i<10;i++)
  traced(ctx,[[-65+i*12,-29],[Math.min(56,-9+i*12),-47]],'#834a3680',1);
 for(const xx of [-49,34]){
  ctx.fillStyle='#365d62';ctx.fillRect(xx,-5,20,19);
  ctx.fillStyle='#eac98c';ctx.fillRect(xx+3,-2,14,13);
  traced(ctx,[[xx+10,-2],[xx+10,11]],'#5c706d',2);
 }
 ctx.fillStyle='#755139';ctx.fillRect(-6,2,23,37);
 ctx.fillStyle='#deb481';ctx.fillRect(-3,5,17,34);
 ctx.fillStyle='#cfb36e';ctx.fillRect(-72,34,147,5);
 ctx.restore();
}
function pads(ctx,plan){
 for(const [i,pad] of plan.pads.entries()){
  const {x,y}=pad;
  ellipse(ctx,x+4,y+15,44,22,'#35554a80');
  ellipse(ctx,x,y+8,43,24,'#516e68');
  ellipse(ctx,x,y+1,42,23,'#9baca0');
  ellipse(ctx,x,y-4,39,21,'#efdda9');
  ellipse(ctx,x,y-5,32,16,'#ddca98');
  ctx.strokeStyle='#856f57';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y-5,33,16,0,0,TAU);ctx.stroke();
  const r=seed(i*83+11);
  for(let k=0;k<15;k++){
   const ang=r()*TAU,rad=28+r()*10;
   ellipse(ctx,x+Math.cos(ang)*rad,y-4+Math.sin(ang)*rad*.47,1+r()*3,
    1+r()*2,k%2?'#fbebc8':'#a9aea1');
  }
  polygon(ctx,[[x,y-13],[x+10,y-5],[x,y+2],[x-10,y-5]],
   '#f2e4bc','#777459',1.5);
  ellipse(ctx,x,y-5,3.5,2.5,'#6eb0b1');
 }
}
function flowers(ctx,plan){
 const r=seed(10936);
 for(let i=0;i<480;i++){
  const x=r()*W,y=120+r()*610;
  if(!clear(x,y,14))continue;
  if(y>650&&x>210&&x<1250)continue; // unobstructed waterway
  if(i%11===0){floweringBush(ctx,x,y,.3+r()*.35,true);continue}
  const blade=1+r()*2;
  traced(ctx,[[x,y+2],[x-1,y-4]],'#356f4e',.8);
  for(let j=0;j<4;j++){
   const ang=j*TAU/4,xx=x+Math.cos(ang)*2,yy=y-4+Math.sin(ang)*2;
   ellipse(ctx,xx,yy,blade,blade*.75,i%3?'#fff0d8':'#e3abd6');
  }
  ellipse(ctx,x,y-4,1,1,'#ecc775');
 }
}
function foregroundProps(ctx,plan){
 const props=[
  [28,508,'barrel'],[85,520,'hay'],[302,700,'barrel'],
  [787,649,'hay'],[1090,584,'cart'],[1208,582,'hay'],
  [448,194,'barrel'],[666,177,'barrel'],[1044,174,'barrel']
 ];
 for(const [x,y,kind] of props){
  if(!clear(x,y,16))continue;
  ctx.save();ctx.translate(x,y);
  if(kind==='barrel'){
   ellipse(ctx,0,9,14,5,'#415b4b55');
   ctx.fillStyle='#8e603e';ctx.fillRect(-9,-10,18,20);
   ellipse(ctx,0,-10,9,4,'#cb9d64');ellipse(ctx,0,9,9,4,'#765137');
   for(const yy of [-5,5])traced(ctx,[[-9,yy],[9,yy]],'#5f5140',2.5);
  }else if(kind==='hay'){
   ellipse(ctx,0,10,21,7,'#5d714258');
   ctx.fillStyle='#d6b765';ctx.fillRect(-17,-10,34,21);
   ellipse(ctx,0,-10,17,8,'#efd187');
   for(let z=0;z<8;z++)
    traced(ctx,[[-15+z*4,-11],[-11+z*4,9]],'#9c7c36',.7);
  }else{
   ellipse(ctx,0,13,37,8,'#355c4a4b');
   ctx.fillStyle='#8f623f';ctx.fillRect(-24,-14,51,20);
   traced(ctx,[[-26,6],[34,6]],'#5b4538',4);
   ellipse(ctx,-16,12,8,8,'#5a5042');ellipse(ctx,19,12,8,8,'#5a5042');
   ctx.fillStyle='#d7b466';ctx.fillRect(-18,-23,38,12);
  }ctx.restore();
 }
}
function distributeWoodland(ctx,plan){
 const r=seed(333);
 // Planned clusters, away from roads/pads, to frame the environment.
 const groves=[
  [25,195,7],[145,197,5],[352,192,4],[748,195,7],
  [1056,155,8],[1231,185,8],[38,431,6],[117,744,10],
  [425,756,8],[1024,759,5],[1250,613,6]
 ];
 for(const [xx,yy,count] of groves){
  for(let j=0;j<count;j++){
   const x=xx+(r()-.5)*95,y=yy+(r()-.5)*68;
   if(!clear(x,y,28))continue;
   if(j%4===1){cypress(ctx,x,y,.50+r()*.27);continue}
   tree(ctx,x,y,.34+r()*.34,j%9===0);
  }
 }
 for(let i=0;i<130;i++){
  const x=r()*W,y=200+r()*550;
  if(!clear(x,y,15)||y>660)continue;
  if(r()<.64)rock(ctx,x,y,.28+r()*.45);
  else floweringBush(ctx,x,y,.28+r()*.36);
 }
}
export function paintPremiumM02(ctx,plan,{density=2}={}){
 if(!ctx||plan?.path?.length!==163||plan?.pads?.length!==8||
  (density!==1&&density!==2))throw Error('R6 M02 source geometry/density invalid');
 ctx.save();ctx.setTransform(density,0,0,density,0,0);
 hills(ctx);
 river(ctx);
 const wheatPatches=wheat(ctx,plan);
 wheatFences(ctx);
 distributeWoodland(ctx,plan);
 // River should remain scenery behind route, not a new obstacle.
 road(ctx,plan);
 bridge(ctx);
 scenicFootbridge(ctx,348,711,-.12,.82);
 scenicFootbridge(ctx,1095,704,.23,.94);
 // Strictly preserve landmark anchors and eight authoritative build sockets.
 for(const l of plan.landmarks){
  if(l.kind==='mill')mill(ctx,l.x,l.y);
  else if(l.kind==='farm')farmhouse(ctx,l.x,l.y);
  else if(l.kind==='supplies'){
   for(let k=0;k<4;k++)rock(ctx,l.x-36+k*22,l.y+12+k%2*8,.65);
   foregroundProps(ctx,plan);
  }
 }
 pads(ctx,plan);
 flowers(ctx,plan);
 ctx.restore();
 return Object.freeze({source:'R6 Golden Valley procedural paint',
  density,width:W*density,height:H*density,routeVertices:plan.path.length,
  padsRendered:plan.pads.length,wheatPatches,
  featureTypes:Object.freeze(['windmill','wheat','terraces','river','cascades',
   'bridges','stone','fences','farmhouse','flowers','trees','construction-pads'])});
}
