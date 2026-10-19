/* SEMANTROPIC TD T3-B — original painted procedural assets.
   Editable source; experimental art, NOT final hand-painted production masters.
   Composites within the isolated Phaser demo; no protected third-party assets. */
(function(){
'use strict';
const src=window.SemantropicT2CArt;
if(!src)throw Error('T3-B requires the preexisting T2-C art engine.');
const old=src.add;
const TAU=Math.PI*2, clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
function rnd(seed){return()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
function sheet(w,h,s=2){const node=document.createElement('canvas');node.width=Math.round(w*s);node.height=Math.round(h*s);const c=node.getContext('2d');c.setTransform(s,0,0,s,0,0);c.lineJoin='round';c.lineCap='round';return {node,c};}
function ellipse(c,x,y,rx,ry,fill,stroke='',sw=2){c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=sw;c.stroke();}}
function path(c,points,fill,stroke='',line=2){c.beginPath();points.forEach(([x,y],i)=>{if(i)c.lineTo(x,y);else c.moveTo(x,y)});c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=line;c.stroke();}}
function stroke(c,points,color,w=3){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.lineWidth=w;c.strokeStyle=color;c.stroke();}
function rect(c,x,y,w,h,color,r=0,border=''){c.beginPath();c.roundRect(x,y,w,h,r);c.fillStyle=color;c.fill();if(border){c.strokeStyle=border;c.lineWidth=2;c.stroke();}}
function glow(c,x,y,r,color){const g=c.createRadialGradient(x,y,1,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'#ffffff00');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}
function block(c,x,y,w,h,palette){
  path(c,[[x,y],[x+w,y-8],[x+w+7,y+h-7],[x+8,y+h]],palette[1],palette[3],3);
  path(c,[[x,y],[x+w,y-8],[x+w-4,y+9],[x+4,y+16]],palette[0],palette[3],1.8);
  stroke(c,[[x+w*.22,y+22],[x+w*.7,y+18]],palette[2],2);
}
const PALETTES={
  infantry:['#e5dbb6','#92aaa8','#506d7b','#2a4453'],
  sniper:['#e8cf91','#83a899','#3e665b','#283b43'],
  guardian:['#e4eff1','#8eacbd','#496a95','#2a465b'],
  bombard:['#f7d9a3','#b2a49c','#6d6571','#353c49']
};
function tower(type) {
 const {node,c}=sheet(340,360,2),p=PALETTES[type],R=rnd(type.length*1597);
 ellipse(c,172,311,124,29,'#112e3388');
 glow(c,170,220,145,type==='guardian'?'#5deeff3c':'#ffe0aa20');
 // A visible three-quarter stepped plinth; cast-shadow and kerf linework
 for(let k=0;k<3;k++){const y=280+k*12,s=k*12;
  path(c,[[37+s,y],[170,y-41+k*3],[306-s,y],[173,y+46-k*2]],['#334957','#49636a','#72888a'][k],'#1b3744',4);
  stroke(c,[[55+s,y-1],[173,y+31-k*2],[291-s,y-1]],'#d6c5a25c',3);}
 const side=c.createLinearGradient(80,70,260,290);side.addColorStop(0,p[0]);side.addColorStop(.35,p[1]);side.addColorStop(.7,p[2]);side.addColorStop(1,p[3]);
 path(c,[[74,147],[169,103],[270,150],[262,275],[175,312],[73,274]],side,p[3],7);
 path(c,[[74,148],[170,105],[270,150],[173,195]],'#c9c7ac','#2a4b56',6);
 path(c,[[74,153],[171,197],[175,311],[76,273]],'#7e9390','#263f4d',3);
 path(c,[[173,197],[266,154],[262,273],[176,311]],'#526775','#2a4558',3);
 for(let j=0;j<5;j++){
  const xx=83+j*34;
  stroke(c,[[xx,213+j*.05],[xx+12,217]],'#dfd7b372',1.4);
  stroke(c,[[xx+4,232],[xx+10,230]],'#29444e',1.5);
 }
 // Ornamental slabs, seams, inset lamps
 for(const x of [94,127,202,235]){block(c,x,195,12,46,p);}
 ellipse(c,170,296,19,9,'#efcb865c');
 if(type==='infantry'){
  path(c,[[59,147],[82,87],[170,55],[257,93],[286,151],[167,192]],'#718896','#263f4a',7);
  path(c,[[76,119],[91,91],[169,63],[249,95],[266,123],[170,167]],'#d4c29d','#375768',4);
  for(const x of [76,111,150,188,229,262]){
   block(c,x-5,89+(Math.abs(x-170)*.15),26,45,p);
   rect(c,x+1,82+(Math.abs(x-170)*.15),15,13,'#bcb99c',3,'#42606a');
  }
  path(c,[[142,196],[172,177],[204,194],[204,275],[145,275]],'#1f3542','#dcbf83',4);
  path(c,[[154,204],[172,192],[192,206],[191,261],[155,264]],'#3c7183','#bcebe8',3);
  path(c,[[165,212],[177,217],[171,255],[159,240]],'#f5d794');
  for(const [x,b] of [[62,'#60c9b8'],[263,'#d9ab79']]){
   stroke(c,[[x,113],[x,42]],'#e4d2a0',5);
   path(c,[[x,45],[x+39,52],[x+31,82],[x,77]],b,'#35545b',3);
   stroke(c,[[x+8,57],[x+29,60]],'#fff3bc88',3);
  }
 }else if(type==='sniper'){
  for(const x of [102,230]){stroke(c,[[x,173],[x+9,80]],'#293f42',13);stroke(c,[[x-1,172],[x+8,81]],'#ad9879',6);}
  path(c,[[58,120],[174,36],[291,118],[278,141],[170,67],[75,143]],'#486d59','#29443e',7);
  path(c,[[81,112],[172,42],[266,112],[171,87]],'#a1b98c','#43674f',4);
  for(let i=0;i<7;i++){stroke(c,[[87+i*25,151],[94+i*25,170]],'#e4c994',5);}
  path(c,[[96,155],[172,117],[254,151],[169,193]],'#9c805b','#344b45',5);
  // Upper body of visible operator and lengthy recognisable weapon
  ellipse(c,170,91,21,26,'#d9ba8e','#314b51',4);
  path(c,[[151,83],[162,62],[180,59],[190,88]],'#304e47','#172f3e',3);
  rect(c,157,89,32,8,'#f0d4a0',4,'#435662');
  path(c,[[146,114],[183,109],[201,154],[142,154]],'#526f56','#28454e',4);
  stroke(c,[[182,124],[230,110],[278,104]],'#d8bd87',8);
  stroke(c,[[228,104],[286,98]],'#263b42',6);
  rect(c,263,92,31,10,'#e7cfa5',2,'#2d4349');
  ellipse(c,285,96,3,3,'#b6f3e6');
 }else if(type==='guardian'){
  // Monumental arcane stone leaves and central levitating prism
  for(const flip of [-1,1]){
   const x=170+flip*87;
   path(c,[[x,167],[x+flip*8,104],[x+flip*37,58],[x+flip*54,114],[x+flip*29,158]],'#678da8','#2a485f',6);
   path(c,[[x+flip*10,148],[x+flip*19,100],[x+flip*33,84]],'#d1e7e8',null,2);
   block(c,x-16,184,32,83,p);
  }
  glow(c,171,114,91,'#56fcfca6');
  path(c,[[170,36],[223,104],[173,189],[115,106]],'#3bafd0','#e1ffff',7);
  path(c,[[170,43],[205,108],[173,177]],'#2668a2','#abfcff',2);
  path(c,[[166,48],[125,108],[169,158]],'#98f3e5','#ceffff',2);
  stroke(c,[[160,94],[150,116],[169,127]],'#faffff',4);
  for(let i=0;i<8;i++){const a=i*TAU/8;ellipse(c,170+77*Math.cos(a),118+48*Math.sin(a),5,5,'#c4ffef');}
  path(c,[[143,249],[170,223],[198,251],[170,271]],'#c7a976','#31576b',4);
 }else{
  // Heavy-duty mechanical bombardment platform with carefully beveled rims
  path(c,[[70,171],[115,119],[239,121],[282,170],[258,262],[101,269]],'#ae7758','#414955',7);
  path(c,[[85,165],[120,130],[233,133],[265,169],[251,186],[92,184]],'#dfbd8d','#42535a',4);
  for(let i=0;i<7;i++){rect(c,105+i*20,181,11,45,'#cc9367',3,'#794b43');}
  stroke(c,[[162,174],[215,79]],'#384b56',55);
  stroke(c,[[158,170],[211,79]],'#d69265',43);
  stroke(c,[[174,136],[201,81]],'#ffe1a8',13);
  ellipse(c,221,64,32,24,'#354852','#fbd28b',9);
  ellipse(c,222,65,18,14,'#182d3a','#647982',4);
  for(const x of [114,236]){
   ellipse(c,x,253,31,30,'#424f57','#d49f69',9);
   ellipse(c,x,253,15,15,'#7f8890','#2c4650',4);
   for(let a=0;a<6;a++){let v=a*TAU/6;stroke(c,[[x,253],[x+23*Math.cos(v),253+23*Math.sin(v)]],'#e8c28a',2);}
  }
 }
 // Selective painterly chips, not uniform texture noise
 for(let k=0;k<26;k++){const xx=84+R()*170,yy=194+R()*91;stroke(c,[[xx,yy],[xx+3+R()*5,yy-1]],k%4===0?'#e9ddbe77':'#263e4850',.7+R()*1.5);}
 return node;
}
function enemy(type,frame) {
 const {node,c}=sheet(250,268,2);const heavy=type==='brute',caster=type==='seer',r=rnd(4242+frame*31+type.length*19);
 const stride=Math.sin(frame*TAU/8),bob=Math.cos(frame*TAU/8)*(heavy?3:5);
 const green=heavy?'#899f80':caster?'#8f9da7':'#90bd7c',dark=heavy?'#3e4d50':caster?'#414862':'#44664f';
 ellipse(c,126,247,78,14,'#11272d82');
 if(caster){glow(c,130,133,94,'#ac9af85a');}
 // Legs not just positional bob: opposing knee and foot arcs
 const shin1=12*stride,shin2=-13*stride;
 stroke(c,[[104,174],[91+shin1,209],[82+shin1,243]],'#304550',heavy?29:20);
 stroke(c,[[145,173],[157+shin2,211],[164+shin2,243]],'#33434d',heavy?30:20);
 ellipse(c,82+shin1,242,23,10,'#43505a','#203743',3);
 ellipse(c,164+shin2,242,25,10,'#48555a','#203743',3);
 // body variants use DIFFERENT forms and proportions
 if(heavy){
  path(c,[[76,110],[96,81],[174,81],[208,116],[195,190],[72,192]],'#6a7376','#293d48',7);
  path(c,[[88,112],[113,95],[158,93],[183,118],[176,156],[96,158]],'#b5ad8d','#425460',4);
  for(const x of [76,185]){ellipse(c,x,117,29,33,'#5c717c','#d4c391',6);stroke(c,[[x-13,101],[x+9,126]],'#ede1b0',4);}
 }else if(caster){
  path(c,[[85,102],[112,80],[146,81],[173,101],[188,196],[128,220],[66,196]],'#524a83','#2f3854',5);
  path(c,[[104,111],[133,102],[160,112],[157,195],[126,205],[96,194]],'#786fb0','#a7b9d1',3);
  for(const x of [79,176]){stroke(c,[[x,122],[x+(x<125?-13:16),175]],'#62709d',17);}
 }else{
  path(c,[[92,105],[126,89],[161,103],[176,176],[130,202],[83,174]],'#708e62','#294b4f',6);
  path(c,[[96,111],[132,101],[165,120],[157,174],[129,185],[95,163]],'#a3bb80','#456852',3);
  stroke(c,[[88,118],[63-4*stride,168]],green,19);
 }
 // Individually expressive faces, cheeks and muzzle
 ellipse(c,127,72+bob,heavy?48:40,heavy?47:42,green,'#304c51',6);
 if(!caster){
  path(c,[[88,55],[58,43],[73,78]],'#688c68','#304c51',3);
  path(c,[[168,54],[198,40],[178,81]],'#789969','#304c51',3);
 }
 if(heavy){
  path(c,[[80,51],[81,19],[112,5],[146,6],[176,25],[176,56]],'#657482','#2a4452',6);
  for(const [x,y] of [[95,22],[156,22]])ellipse(c,x,y,8,7,'#cfcaac');
 }else if(caster){
  path(c,[[80,54],[96,2],[135,-4],[175,22],[185,63]],'#635b95','#2f3958',6);
  path(c,[[99,38],[141,14],[165,40]],'#9883bd','#4a5477',3);
  glow(c,127,59,48,'#bfc0ff79');
 }else{
  path(c,[[92,44],[105,18],[142,13],[169,40]],'#4b6856','#304b46',4);
 }
 // asymmetric brows and bright directional eyes
 stroke(c,[[100,64+bob],[121,62+bob]],'#284b4b',5);
 stroke(c,[[135,62+bob],[158,58+bob]],'#284b4b',5);
 ellipse(c,109,72+bob,10,7,caster?'#b3f7ff':'#fae6a0','#273d43',2);
 ellipse(c,147,71+bob,10,7,caster?'#b3f7ff':'#fae6a0','#273d43',2);
 ellipse(c,111,70+bob,3,3,'#233c43');ellipse(c,146,69+bob,3,3,'#233c43');
 path(c,[[113,91+bob],[126,95+bob],[141,90+bob],[136,104+bob],[121,108+bob]],'#465652','#32494e',2);
 if(!caster){path(c,[[108,93+bob],[111,84+bob],[120,97+bob]],'#fff1c3');path(c,[[137,95+bob],[145,83+bob],[148,91+bob]],'#fff1c3');}
 // arm + weapon variants
 if(heavy){
  stroke(c,[[175,121],[207,151+stride*5]],'#6c7970',28);
  path(c,[[181,129],[226,119],[246,151],[225,199],[185,189]],'#758c97','#f0d89b',6);
  path(c,[[198,138],[218,143],[230,161],[218,184],[195,181]],'#c2c9be','#536d75',3);
  stroke(c,[[211,149],[216,184]],'#637f82',3);
 }else if(caster){
  stroke(c,[[169,122],[205,158+stride*6]],'#6a6ca0',18);
  stroke(c,[[206,183],[214,31]],'#d8b578',8);
  path(c,[[214,12],[232,28],[216,50],[198,28]],'#8fdbea','#d8c6fd',4);
  glow(c,215,25,35,'#a3e9f68f');
 }else{
  stroke(c,[[157,121],[186,160+stride*7]],green,19);
  stroke(c,[[195,180],[208,78]],'#866645',10);
  path(c,[[199,80],[208,51],[224,71],[219,91]],'#c1d3c9','#49575a',3);
 }
 // readable armor/material chips
 for(let k=0;k<5;k++){let x=110+r()*47,y=127+r()*36;stroke(c,[[x,y],[x+4,y+1]],'#e8d8b16c',1.7);}
 return node;
}
function soldier(frame){
 const {node,c}=sheet(240,265,2);const step=Math.sin(frame*TAU/8)*15,bob=Math.cos(frame*TAU/8)*3;
 ellipse(c,125,247,69,15,'#172f3580');
 stroke(c,[[107,170],[99+step,211],[86+step,243]],'#354c65',19);
 stroke(c,[[143,170],[148-step,213],[158-step,242]],'#304d6d',19);
 ellipse(c,86+step,245,23,10,'#34495b','#1e3645',3);
 ellipse(c,158-step,245,24,10,'#34495b','#1e3645',3);
 path(c,[[85,116],[126,96],[164,116],[174,180],[128,206],[77,177]],'#5b92a6','#233e55',5);
 path(c,[[94,128],[126,114],[159,128],[157,167],[127,185],[93,168]],'#d2d4c9','#456778',4);
 path(c,[[108,142],[127,131],[144,142],[142,165],[127,175],[111,164]],'#79bdc1','#eae4af',3);
 stroke(c,[[163,129],[195,156-step*.3]],'#62889a',19);
 stroke(c,[[195,153-step*.3],[214,94-step*.4]],'#a9885c',9);
 stroke(c,[[215,92-step*.4],[219,51-step*.4]],'#eaf5ed',8);
 stroke(c,[[204,92-step*.4],[222,95-step*.4]],'#e5d69f',5);
 stroke(c,[[89,132],[57,176+step*.28]],'#517e92',19);
 path(c,[[23,156],[62,142],[80,180],[66,220],[28,217],[13,185]],'#3c84a2','#e6d7a1',6);
 path(c,[[34,164],[55,161],[68,181],[58,201],[32,197]],'#7cbdc4','#dcead4',2);
 // eyes, nose and helm: legible face even at mobile scale
 ellipse(c,125,72+bob,39,42,'#ddc79d','#304858',5);
 path(c,[[84,71],[92,35],[110,17],[137,16],[158,33],[164,75]],'#7c97a4','#2b4755',6);
 path(c,[[88,63],[125,53],[164,63],[160,79],[91,81]],'#d9d0aa','#395c6d',4);
 rect(c,107,70,43,11,'#2a4c5a',3,'#e4dcb5');
 ellipse(c,115,75,5,5,'#e0eee0');ellipse(c,139,75,5,5,'#e0eee0');
 path(c,[[126,20],[135,1],[143,20]],'#ebc475','#314d5b',3);
 return node;
}
const PTS=[[-60,322],[46,341],[130,379],[211,449],[309,521],[404,552],[496,530],[576,468],[630,390],[637,316],[682,252],[755,226],[835,244],[922,304],[1009,391],[1087,467],[1145,487],[1204,455],[1260,396],[1340,348]];
function distRoad(x,y){let min=1e6;for(let i=1;i<PTS.length;i++){const a=PTS[i-1],b=PTS[i],dx=b[0]-a[0],dy=b[1]-a[1];const t=clamp(((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy),0,1);min=Math.min(min,Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy));}return min;}
function landscape(){
 const {node,c}=sheet(1280,768,2),r=rnd(20261019);
 // Painted ground all over source scene, not a screenshot baked from external references
 const grass=c.createLinearGradient(0,0,0,768);grass.addColorStop(0,'#709776');grass.addColorStop(.4,'#527d61');grass.addColorStop(1,'#466959');c.fillStyle=grass;c.fillRect(0,0,1280,768);
 const grain=['#9bbb7d','#577d65','#315d57','#b0bc86','#608a76'];
 for(let i=0;i<5800;i++){let x=r()*1280,y=r()*768,d=distRoad(x,y);if(d<63)continue;c.globalAlpha=.15+r()*.3;ellipse(c,x,y,1+r()*8,.9+r()*3,grain[Math.floor(r()*grain.length)]);}
 c.globalAlpha=1;
 // broad painterly shadow ribbons and road shape use path shared with simulation
 for(let j=0;j<4;j++){c.beginPath();PTS.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.lineCap='round';c.lineJoin='round';
  c.lineWidth=[146,132,108,92][j];c.strokeStyle=['#284c48a3','#8e865d','#cbb289','#bba17e'][j];c.stroke();}
 // slight topography/rim-hatching, never a competing second road
 for(let i=0;i<480;i++){
  const x=r()*1280,y=r()*768,d=distRoad(x,y),a=r()*TAU;
  if(d<43||d>92)continue;
  const size=1+r()*4;ellipse(c,x,y,size,size*.45,r()>.55?'#e4d1a2':'#736c54');
 }
 for(let i=0;i<800;i++){
  const x=r()*1280,y=r()*768,d=distRoad(x,y);if(d>43)continue;
  stroke(c,[[x,y],[x+3+r()*6,y-1]],r()>.5?'#ead3ac45':'#80654a5c',.7+r()*1.8);
 }
 // reeds, painted shrubs and flowers around road, varied aggregate silhouettes
 for(let i=0;i<630;i++){let x=r()*1280,y=r()*768,d=distRoad(x,y);if(d<77)continue;
  const a=2+r()*13;ellipse(c,x,y+2,a*1.5,a*.38,'#214e4980');
  for(let k=0;k<3;k++){const xx=x+(k-1)*a*.8,yy=y-k*a*.23;
   ellipse(c,xx,yy,a*.7,a*.7,['#598d5e','#7da76c','#9ec37b','#4c806e'][Math.floor(r()*4)]);}
  if(i%8===0)ellipse(c,x+2,y-3,2.4,2.1,i%2?'#e9c998':'#d0c8ec');
 }
 function tree(x,y,s,style) {
  ellipse(c,x,y+8,53*s,14*s,'#183f3c80');
  stroke(c,[[x,y],[x-8*s,y-60*s],[x+4*s,y-111*s]],'#4d5445',14*s);
  stroke(c,[[x-7*s,y-57*s],[x-28*s,y-77*s]],'#6c6248',8*s);
  const canopy=style===0?[[-27,-108,45,33],[22,-110,44,37],[0,-145,50,42]]:style===1?[[-27,-110,34,45],[21,-122,39,40],[2,-154,43,47]]:[[0,-116,52,32],[-32,-139,34,29],[24,-153,37,35]];
  for(const [xx,yy,rx,ry] of canopy){
   ellipse(c,x+xx*s+5*s,y+yy*s+10*s,rx*s,ry*s,'#294b4b');
   ellipse(c,x+xx*s,y+yy*s,rx*s,ry*s,style===1?'#35695d':'#4d845b','#274e54',3*s);
   ellipse(c,x+(xx-10)*s,y+(yy-11)*s,rx*.57*s,ry*.43*s,'#8db17b6e');
   ellipse(c,x+(xx+16)*s,y+(yy+10)*s,rx*.39*s,ry*.31*s,'#306a6477');
  }
 }
 for(const [x,y,s,st] of [[130,197,.85,2],[340,215,.8,0],[525,155,.76,1],[898,172,.68,2],[1034,610,.84,1],[198,717,.78,0],[796,681,.65,2],[1160,250,.58,1]]){if(distRoad(x,y)>85)tree(x,y,s,st);}
 // Glazed stones and ruins
 for(let i=0;i<34;i++){let x=r()*1280,y=r()*768;if(distRoad(x,y)<81)continue;const w=10+r()*25,h=8+r()*16;
   ellipse(c,x,y+h*.6,w*.9,h*.35,'#22484470');
   path(c,[[x-w,y],[x-w*.5,y-h],[x+w*.4,y-h*1.15],[x+w,y-h*.2],[x+w*.7,y+h*.45],[x-w*.65,y+h*.3]],'#89998e','#405d60',2);
   stroke(c,[[x-w*.4,y-h*.72],[x+w*.3,y-h*.85]],'#e6d9b577',1.8);}
 // Lanterns: identifiable fantasy technology without imitating reference images
 for(const [x,y] of [[233,174],[573,666],[1187,657],[836,101]]) {
  ellipse(c,x,y+19,29,8,'#213c3e8f');
  rect(c,x-5,y-5,10,28,'#536574',2,'#d8bd81');
  path(c,[[x-13,y-4],[x-10,y-23],[x+9,y-23],[x+14,y-4]],'#b2b7a5','#4d6870',3);
  glow(c,x,y-19,34,'#ffeabf85');ellipse(c,x,y-18,4,7,'#fff6bb');
 }
 // warm diffuse light with cool framing
 glow(c,1070,25,240,'#eff8af26');glow(c,358,210,240,'#d9e99f0f');
 const shade=c.createLinearGradient(0,0,0,768);shade.addColorStop(0,'#faf6dd16');shade.addColorStop(.5,'#ffffff00');shade.addColorStop(1,'#0a293c32');c.fillStyle=shade;c.fillRect(0,0,1280,768);
 return node;
}
function replace(scene,id,canvas){
 if(scene.textures.exists(id))scene.textures.remove(id);
 scene.textures.addCanvas(id,canvas);
}
src.add=function(scene){
 old(scene);
 replace(scene,'t2c-land',landscape());
 for(const type of Object.keys(PALETTES))replace(scene,'t2c-tower-'+type,tower(type));
 for(let f=0;f<8;f++){
  replace(scene,'t2c-soldier-'+f,soldier(f));
  for(const type of ['scout','brute','seer'])replace(scene,'t2c-'+type+'-'+f,enemy(type,f));
 }
 window.__T3B_ASSET_MANIFEST={
  landscape:'2560×1536 procedural painterly PNG-equivalent canvas master',
  towers:'4 × 680×720 source textures / original, edible in art-c.js',
  enemies:'3 × 8 × 500×536 source textures / original',
  soldier:'8 × 480×530 source textures / original',
  licence:'Original laboratory procedural artwork produced for Semantropic TD; placeholders pending hand-painted production masters.'
 };
};
})();