'use strict';
/* T2-C: Original procedural art painted once into textures, rendered during play by Phaser/WebGL2.
   No external IP, no replacement of Campaign V5 artwork. */
(function(){
const A={};
const C=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
const rand=(s)=>()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t^=t+Math.imul(t^t>>>7,61|t);return ((t^t>>>14)>>>0)/4294967296};
const E=(c,x,y,rx,ry,color,stroke=null,sw=1)=>{c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);if(color){c.fillStyle=color;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=sw;c.stroke();}};
const P=(c,pts,fill,stroke='#183340',sw=3)=>{c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.lineJoin='round';c.lineWidth=sw;c.strokeStyle=stroke;c.stroke();}};
const L=(c,pts,color,w=3)=>{c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle=color;c.lineWidth=w;c.lineCap='round';c.lineJoin='round';c.stroke();};
const R=(c,x,y,w,h,r,fill,stroke=null,sw=2)=>{c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.lineWidth=sw;c.strokeStyle=stroke;c.stroke();}};
const GR=(c,x,y,r,color)=>{const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'#ffffff00');c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r)};
const steel=(c,x,y,w,h,up,down)=>{const g=c.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,up);g.addColorStop(.52,'#456375');g.addColorStop(1,down);R(c,x,y,w,h,5,g,'#18343a',3)};
function tower(kind){
 const can=C(260,260),c=can.getContext('2d');c.lineJoin='round';
 const palettes={infantry:['#e7d194','#627d8c','#2c4c5b'],sniper:['#dcc895','#718a73','#344a3c'],guardian:['#93f9e4','#3e8da6','#3f4e9a'],bombard:['#f3c077','#bd7954','#4d475b']};const a=palettes[kind];
 GR(c,130,193,108,kind==='guardian'?'#5eedff40':'#dec37d15');E(c,130,218,86,20,'#071e24a6');
 // A coherent beveled stone base: front edge, top, engraved rim
 P(c,[[46,185],[128,155],[214,187],[133,224]],'#203a44','#11272e',5);
 P(c,[[46,172],[126,141],[215,174],[133,207]],'#9aa5a1','#24424b',5);
 P(c,[[59,170],[126,145],[200,172],[133,197]],'#536f72','#d2d6bf',2);
 L(c,[[70,174],[132,197],[194,174]],'#354c51',4);
 // structural body
 P(c,[[69,90],[124,76],[184,93],[184,181],[128,199],[68,180]],'#476574','#1d3641',6);
 P(c,[[70,89],[128,69],[187,91],[130,114]],'#b5aca2','#1a3b49',5);
 P(c,[[68,94],[127,115],[128,198],[68,177]],'#627983','#304b59',3);
 P(c,[[128,114],[186,93],[185,179],[128,198]],'#354b5a','#263849',3);
 for(let i=0;i<5;i++){R(c,79+i*18,135,8,25,2,i%2?'#9b9990':'#708188','#233945',1);}
 if(kind==='infantry'){
  P(c,[[61,92],[78,66],[178,66],[195,93],[132,113]],'#606773','#223b46',5);
  for(let x=73;x<=174;x+=22){R(c,x,54,19,30,3,'#a5aeb0','#304657',4);}
  P(c,[[113,95],[145,96],[151,155],[107,155]],'#1d333d','#caa762',4);
  P(c,[[104,135],[150,135],[146,178],[110,178]],'#334c56','#d8bc7e',4);
  // crest + pennons
  P(c,[[130,112],[151,125],[144,154],[130,168],[114,155],[109,126]],'#347d8a','#edd491',3);
  L(c,[[130,119],[130,157]],'#ffedb4',5);
  L(c,[[120,139],[139,139]],'#ffedb4',4);
  L(c,[[76,65],[71,26]],'#e5d69d',4);P(c,[[70,27],[108,33],[87,54],[70,49]],'#b46e57','#513f3b',2);
  L(c,[[182,69],[189,25]],'#d8cca6',4);P(c,[[187,28],[226,36],[205,51],[190,46]],'#3f9c9e','#29474b',2);
 }else if(kind==='sniper'){
  // elevated timber watch-post with dark green canopy, thick struts
  L(c,[[88,172],[99,91],[116,102],[107,180]],'#3a312f',13);
  L(c,[[170,174],[161,91],[145,102],[155,184]],'#3a312f',13);
  P(c,[[58,100],[127,61],[200,99],[127,125]],'#5c7f66','#24483e',6);
  P(c,[[57,93],[128,39],[204,93],[188,111],[127,73],[72,111]],'#466856','#26473c',6);
  L(c,[[57,94],[128,39],[202,94]],'#deb97c',5);
  R(c,82,100,100,25,4,'#b5a16d','#3f4f43',4);
  for(let i=0;i<6;i++)L(c,[[89+i*15,101],[89+i*15,123]],'#554d37',4);
  // operator head, visor and long bow / rifle pointing right
  E(c,128,96,16,17,'#d9bc8e','#243c46',4);
  P(c,[[112,87],[122,73],[140,80],[145,96],[115,97]],'#304d45','#1d363a',3);
  R(c,118,93,26,8,3,'#d5d8b3','#274955',2);
  L(c,[[130,114],[175,94],[207,92]],'#e0b96a',7);
  L(c,[[174,91],[211,86]],'#345660',4);E(c,208,89,5,5,'#a0f5db');
 }else if(kind==='guardian'){
  // opposing gilded prongs and crystal focus
  P(c,[[76,95],[61,65],[82,44],[109,90]],'#658ead','#21405f',5);
  P(c,[[151,92],[178,40],[201,59],[181,99]],'#6684a9','#21435b',5);
  L(c,[[96,99],[94,170]],'#f4cf83',7);L(c,[[166,101],[165,174]],'#f4cf83',7);
  GR(c,130,92,85,'#61eaf080');
  P(c,[[128,36],[167,92],[129,153],[91,94]],'#47d9d2','#c3ffff',6);
  P(c,[[128,43],[157,94],[128,140]],'#227d9d',null);
  P(c,[[126,46],[102,96],[130,128]],'#9dfaf2',null);
  L(c,[[121,73],[111,92],[120,106]],'#e8ffff',5);
  E(c,129,91,61,32,null,'#72ede9aa',4);
  for(let i=0;i<8;i++){const angle=i*Math.PI/4;E(c,129+57*Math.cos(angle),91+30*Math.sin(angle),4,4,'#d1ffff');}
  P(c,[[99,166],[127,152],[160,168],[130,182]],'#c8a76b','#1c4655',4);
 }else if(kind==='bombard'){
  // massive cannon drum and reinforced armored casing
  P(c,[[74,127],[96,91],[170,91],[191,127],[180,169],[80,169]],'#a26e50','#3b3d48',5);
  R(c,85,121,89,40,9,'#dfaa6c','#423d43',5);
  for(let i=0;i<5;i++)L(c,[[98+i*17,123],[98+i*17,162]],'#765341',3);
  L(c,[[129,121],[167,65]],'#213e4b',29);
  L(c,[[129,118],[168,64]],'#c27f58',24);
  L(c,[[135,105],[162,67]],'#f7d597',7);
  E(c,171,61,20,14,'#283742','#f4c083',7);
  E(c,171,61,11,8,'#0e2837','#1b2029',3);
  E(c,97,158,20,21,'#4f5960','#d7a56a',6);E(c,161,158,20,21,'#4f5960','#d7a56a',6);
  for(let a0=0;a0<6;a0++){const an=a0*Math.PI/3;L(c,[[97,158],[97+15*Math.cos(an),158+16*Math.sin(an)]],'#e3bd7c',3);L(c,[[161,158],[161+15*Math.cos(an),158+16*Math.sin(an)]],'#e3bd7c',3);}
 }
 for(let i=0;i<7;i++){const x=74+i*18;E(c,x,183+(i%2)*3,2,2,'#e2c89b77');}
 return can;
}
function warrior(frame=0){
 const can=C(130,148),c=can.getContext('2d');const b=Math.sin(frame*Math.PI/2)*5;
 E(c,63,137,43,8,'#13282b78');GR(c,64,77,60,'#e1da8a22');
 // legs moving, leather boots
 L(c,[[56,98],[48-b,133]],'#243e4e',16);L(c,[[75,98],[83+b,132]],'#2a4654',16);
 L(c,[[48-b,133],[38-b,138]],'#3b444b',10);L(c,[[83+b,132],[92+b,137]],'#3b444b',10);
 P(c,[[47,68],[81,68],[88,104],[61,114],[41,103]],'#639ba0','#183f4a',5);
 P(c,[[53,73],[73,70],[77,95],[62,105],[48,95]],'#d1b984','#446472',3);
 // animated sword arm
 L(c,[[78,78],[96,94+b]],'#376173',14);L(c,[[96,94+b],[112,64+b]],'#d6a66b',8);L(c,[[110,60+b],[119,27+b]],'#e7f0df',7);L(c,[[102,62+b],[121,67+b]],'#efbd70',5);
 L(c,[[46,79],[26,98-b]],'#295261',13);
 P(c,[[10,82],[35,79],[43,106],[23,126],[8,105]],'#448fa1','#dcbf7a',5);
 L(c,[[23,91],[26,116]],'#dafbf3',3);
 // expressive face and knight helmet
 E(c,63,48+b*.2,23,27,'#e5c39c','#223d50',5);
 P(c,[[38,43],[44,18],[65,10],[87,22],[89,48]],'#6c93a5','#1b3c4c',5);
 P(c,[[47,38],[85,34],[82,49],[46,50]],'#2a4f60','#ead8a3',2);
 R(c,56,43,24,8,2,'#e7e8cc','#375361',2);
 P(c,[[62,13],[70,4],[75,17],[69,21]],'#e9d28a','#314350',2);
 return can;
}
function enemy(type,frame=0){
 const can=C(140,146),c=can.getContext('2d'),j=Math.sin(frame*Math.PI/2)*6;
 const brute=type==='brute',seer=type==='seer',clr=brute?'#b4ad82':seer?'#9c7bc3':'#79ad7b';
 E(c,69,136,44,9,'#09262b83');
 if(seer){GR(c,70,77,77,'#a578ec5a');for(let i=0;i<5;i++){const a=i*1.25+frame*.3;E(c,70+39*Math.cos(a),77+22*Math.sin(a),4,4,'#ccb6ff');}}
 L(c,[[57,99],[47-j,133]],seer?'#4c496d':'#3e4140',brute?19:13);
 L(c,[[81,98],[89+j,132]],seer?'#464069':'#444849',brute?20:13);
 P(c,[[40,67],[91,67],[102,107],[66,122],[32,104]],seer?'#725389':brute?'#64685e':'#667456','#243641',5);
 P(c,[[46,80],[87,81],[81,105],[58,111]],seer?'#b484c4':brute?'#999885':'#91a86d','#364d53',3);
 if(brute){P(c,[[38,63],[20,58],[9,82],[38,98]],'#777f83','#293c48',5);P(c,[[89,62],[112,56],[123,78],[101,96]],'#777f83','#293c48',5);}
 else {L(c,[[41,75],[23,91-j]],clr,15);L(c,[[95,76],[114,92+j]],clr,15);}
 if(!seer&&!brute){L(c,[[111,94],[125,57]],'#684b38',7);P(c,[[118,56],[132,35],[136,61]],'#bfcaca','#384d57',3);}
 if(seer){L(c,[[106,77],[121,46]],'#e9b878',7);GR(c,121,38,31,'#d6a9ff99');E(c,122,38,10,13,'#9ce9ef','#d9c4ff',3);}
 if(brute){P(c,[[8,69],[37,60],[48,92],[20,118]],'#78929c','#ddc695',5);L(c,[[27,78],[29,101]],'#ecddaa',5);}
 E(c,67,48+j*.13,brute?29:25,brute?30:27,clr,'#283e47',5);
 if(!seer){P(c,[[39,38],[27,30],[35,53]],'#789068','#304847',3);P(c,[[90,38],[105,30],[94,53]],'#779773','#304847',3);}
 P(c,[[43,39],[49,17],[80,14],[91,41]],seer?'#54457f':brute?'#53606b':'#4c6755','#263943',4);
 if(brute){P(c,[[44,30],[63,8],[83,10],[93,31]],'#c2ab84','#37444d',4);L(c,[[65,10],[67,31]],'#f5dda8',4);}
 if(seer){P(c,[[41,30],[69,0],[94,28]],'#7860b2','#4e376b',4);GR(c,68,32,33,'#d8b0ff7e');}
 // readable glowing eyes, tusks and mouth
 R(c,49,45,14,7,3,seer?'#f5beff':'#f4cc70','#2b3740',2);
 R(c,74,45,14,7,3,seer?'#f5beff':'#f4cc70','#2b3740',2);
 L(c,[[58,63],[79,63]],'#273a3e',4);
 if(!seer){P(c,[[53,63],[55,55],[61,63]],'#eee1b8','#273a3e',1);P(c,[[77,63],[81,55],[84,63]],'#eee1b8','#273a3e',1);}
 return can;
}
function scenery(){
 const can=C(1280,768),c=can.getContext('2d'),r=rand(20261019); 
 // cinematic atmosphere, transparent over original M01: no change to official image
 let v=c.createLinearGradient(0,0,0,768);v.addColorStop(0,'#e4e6a512');v.addColorStop(.48,'#0f4b4611');v.addColorStop(1,'#06232b51');c.fillStyle=v;c.fillRect(0,0,1280,768);
 GR(c,900,25,520,'#c6f9cf34');GR(c,1060,152,250,'#86fff137');GR(c,500,680,400,'#e8b37516');
 const pts=[[0,350],[110,388],[220,468],[320,530],[436,558],[546,508],[625,419],[635,317],[677,241],[781,228],[885,249],[1010,365],[1104,481],[1192,455],[1280,379]];
 const road=(x,y)=>pts.slice(1).some((p,i)=>{const a=pts[i],dx=p[0]-a[0],dy=p[1]-a[1];let t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy)<76;});
 // dense miniature flowers and clumps arranged without obscuring road
 for(let i=0;i<720;i++){let x=r()*1280,y=r()*768;if(road(x,y))continue;const sz=1+r()*4;
  if(i%9===0){E(c,x,y,sz+2,sz*.65,'#0c4b4860');E(c,x-1,y-2,sz*.45,sz*.45,r()>.5?'#ffe3ad':'#98e2d9');}
  else{L(c,[[x,y+sz],[x-2,y-sz],[x,y],[x+3,y-sz*1.6]],r()>.5?'#b5d89c70':'#154b4677',.8+r());}}
 // grand ruined field stones and ornamented rock beds
 const stone=(x,y,w,h)=>{E(c,x+2,y+h*.5,w*.7,h*.3,'#123a4088');P(c,[[x-w/2,y],[x-w*.25,y-h*.7],[x+w*.25,y-h*.8],[x+w*.58,y-h*.1],[x+w*.4,y+h*.35],[x-w*.36,y+h*.25]],'#799c94','#35545b',3);L(c,[[x-w*.16,y-h*.52],[x+w*.1,y-h*.25]],'#d4cdaa77',2)};
 for(let i=0;i<32;i++){const x=r()*1280,y=r()*768;if(!road(x,y))stone(x,y,13+r()*24,8+r()*16);}
 // lantern platforms: bronze posts / cyan-flame enchantment
 for(const [x,y] of [[238,174],[579,643],[1196,653],[848,112]]){
  E(c,x,y+29,29,8,'#183e4399');R(c,x-5,y-4,10,32,2,'#526970','#263941',2);P(c,[[x-15,y+3],[x-8,y-15],[x+9,y-15],[x+17,y+3]],'#d2a76e','#315664',3);
  GR(c,x,y-17,53,'#7dfcf453');E(c,x,y-15,6,10,'#9df5e6','#e8d998',2);
 }
 // pond ripples at right top, leave crystal architecture visible
 for(let i=0;i<5;i++){c.beginPath();c.ellipse(1007,131,64+i*28,23+i*10,-.12,0,Math.PI*2);c.strokeStyle=i%2?'#b2e6e526':'#42bbb74a';c.lineWidth=2;c.stroke();}
 // hand-painted leaf silhouettes in near foreground
 for(let i=0;i<48;i++){const x=r()*1280,y=610+r()*180;if(road(x,y))continue;const sc=.5+r();
 E(c,x,y+8,22*sc,5*sc,'#123e4077');for(let a=0;a<3;a++){E(c,x+(a-1)*8*sc,y+(a%2)*4,11*sc,6*sc,['#376f5e','#498b68','#63a477'][a]);}}
 return can;
}
A.add=function(scene){const put=(name,canvas)=>{if(!scene.textures.exists(name))scene.textures.addCanvas(name,canvas)};
 put('t2c-land',scenery());
 for(const type of ['infantry','sniper','guardian','bombard'])put('t2c-tower-'+type,tower(type));
 for(let f=0;f<4;f++){put('t2c-soldier-'+f,warrior(f));for(const t of ['scout','brute','seer'])put('t2c-'+t+'-'+f,enemy(t,f));}
 const orb=C(50,50),c=orb.getContext('2d');GR(c,25,25,24,'#a9fffab0');E(c,25,25,9,9,'#c7ffff','#dbfaf9',3);put('t2c-orb',orb);
 const shell=C(54,54),s=shell.getContext('2d');GR(s,27,27,26,'#f9ca6b92');E(s,27,27,14,14,'#d98953','#ffe0a1',5);put('t2c-shell',shell);
};
window.SemantropicT2CArt=A;
})();
