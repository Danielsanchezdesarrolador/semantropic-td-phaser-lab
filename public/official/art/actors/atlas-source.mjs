/* SEMANTROPIC TD · Equipo P · P-01
 * Ilustración vectorial original, atlas 2D generados UNA VEZ al arrancar.
 * Solo vista: sin HP, daño, velocidad, colisiones, monedas ni IA.
 * Arte de PROTOTIPO sujeto a aprobación de Dirección Artística.
 */
export const FRAME_WIDTH=176, FRAME_HEIGHT=208, ATLAS_COLUMNS=8;
export const ANIMATIONS=Object.freeze({
 idle:{frames:4,fps:4,loop:true},
 walk:{frames:8,fps:9,loop:true},
 attackWindup:{frames:3,fps:8,loop:false},
 attack:{frames:5,fps:12,loop:false},
 hit:{frames:3,fps:12,loop:false},
 die:{frames:6,fps:9,loop:false},
 blocked:{frames:3,fps:8,loop:false}
});
export const CAST=Object.freeze([
 {actorId:'warrior',label:'Orco Guerrero',faction:'enemy',role:'melee',kind:'orc',atlasKey:'actors/enemies/warrior/v1',heightWorld:91,footAnchor:{x:.5,y:.92},shadowAnchor:{x:.5,y:1}},
 {actorId:'hound',label:'Perro de Caza',faction:'enemy',role:'melee',kind:'hound',atlasKey:'actors/enemies/hound/v1',heightWorld:67,footAnchor:{x:.5,y:.92},shadowAnchor:{x:.5,y:1}},
 {actorId:'infantry_recruit',label:'Soldado Recluta',faction:'ally',role:'melee',kind:'recruit',atlasKey:'actors/allies/infantry-recruit/v1',heightWorld:88,footAnchor:{x:.5,y:.92},shadowAnchor:{x:.5,y:1}},
 {actorId:'sniper_operator',label:'Operador Francotirador',faction:'ally',role:'operator',kind:'sniper',atlasKey:'actors/allies/sniper-operator/v1',heightWorld:80,footAnchor:{x:.5,y:.92},shadowAnchor:{x:.5,y:1}}
]);
const TAU=Math.PI*2;
function fill(c,points,color,stroke='#203241',width=3) {
 c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();
 c.fillStyle=color;c.fill();
 if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}
}
function oval(c,x,y,rx,ry,color,stroke='',width=2) {
 c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fillStyle=color;c.fill();
 if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}
}
function line(c,points,color,w=4) {
 c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));
 c.strokeStyle=color;c.lineWidth=w;c.stroke();
}
function glow(c,x,y,r,a,b) {
 const g=c.createRadialGradient(x,y,0,x,y,r);
 g.addColorStop(0,a);g.addColorStop(1,b);oval(c,x,y,r,r,g);
}
function badge(c,x,y,color){
 oval(c,x,y,5.5,5.5,color,'#e6d6a4',1.5);oval(c,x-1,y-1,1.8,1.8,'#fbf4d8');
}
function limb(c,x1,y1,x2,y2,metal,thick=13){
 line(c,[[x1,y1],[x2,y2]],'#203343',thick+6);
 line(c,[[x1,y1],[x2,y2]],metal,thick);
 oval(c,x2,y2,thick*.61,thick*.48,metal,'#253644',2);
}
function boot(c,x,y,color){
 fill(c,[[x-9,y-14],[x+9,y-14],[x+14,y-3],[x+13,y+1],[x-13,y+1],[x-16,y-4]],color,'#192e38',3);
 line(c,[[x-7,y-6],[x+7,y-6]],'#cab786',2);
}
function sword(c,angle=0){
 c.save();c.rotate(angle);
 line(c,[[0,0],[2,-57]],'#d2bf89',7);
 fill(c,[[-5,-53],[0,-95],[8,-58],[6,-32]],'#c0e7e7','#314f60',2.5);
 fill(c,[[-5,-55],[0,-90],[0,-34]],'#f2ffff','',0);
 line(c,[[-14,-34],[17,-34]],'#e1c17e',7);
 badge(c,1,-34,'#5ecfdb');c.restore();
}
function axe(c,angle=0){
 c.save();c.rotate(angle);
 line(c,[[1,7],[-2,-77]],'#263543',11);
 line(c,[[0,5],[-2,-76]],'#b49363',6);
 fill(c,[[-5,-73],[-23,-89],[-42,-90],[-37,-64],[-21,-55],[-5,-59]],'#dbe5d9','#283f49',3);
 fill(c,[[-21,-87],[-34,-87],[-29,-65],[-18,-58]],'#86a6ad','',0);
 line(c,[[-27,-83],[-24,-62]],'#ffffff88',2);
 c.restore();
}
function motion(state,index,total) {
 const p=index/Math.max(1,total), cyc=p*TAU;
 const walk=state==='walk', attacking=state==='attack',windup=state==='attackWindup';
 return {
 stride:walk?Math.sin(cyc)*16:0,
 bob:walk?Math.cos(cyc*2)*2.4:state==='idle'?Math.sin(cyc)*1.5:0,
 swing:attacking?(-.78+Math.sin(p*Math.PI)*1.75):windup?(-.35-p*.55):0,
 recoil:state==='hit'?(1-p)*8:0,
 fall:state==='die'?Math.min(1,p*1.33):0,
 stagger:state==='blocked'?Math.sin(p*Math.PI)*6:0,
 tail:p
 };
}
function orc(c,m){
 c.save();
 // Contact points anchored to same world position; walk leg opposition.
 for(const side of [-1,1]){
  const stride=side*m.stride*.77;
  limb(c,side*17,-62,side*18+stride,-25,'#516b55',18);
  boot(c,side*18+stride,-4,'#555d58');
 }
 c.translate(-m.recoil*.5, -m.bob+m.fall*39);
 c.rotate(-m.fall*.65);
 // Back cape and quiver ornament
 fill(c,[[-31,-104],[-43,-82],[-49,-38],[-23,-49],[17,-57],[38,-104]],'#50364c','#392f40',4);
 fill(c,[[-15,-56],[15,-56],[28,-84],[25,-110],[-24,-109],[-29,-81]],'#4f6867','#263f47',4);
 // plated chest
 fill(c,[[-31,-106],[3,-125],[31,-104],[29,-72],[4,-61],[-28,-75]],'#697777','#263840',4);
 fill(c,[[-24,-98],[0,-113],[17,-99],[16,-78],[1,-70],[-21,-81]],'#899a8e','#c9ae77',2);
 fill(c,[[-4,-109],[10,-102],[6,-77],[-5,-74]],'#3b5b59','',0);
 badge(c,3,-86,'#efbd72');
 for(const x of [-22,23]){fill(c,[[x-6,-110],[x+6,-114],[x+14,-96],[x-4,-94]],'#b7a783','#3f4c53',3);}
 // Right hand weapon, left spiked gauntlet
 c.save();c.translate(27,-99);c.rotate(m.swing+.08);
 limb(c,0,0,24,21,'#66876d',15);
 oval(c,27,22,10,10,'#668a6e','#284c41',3);
 c.translate(28,20);axe(c,-.1);c.restore();
 limb(c,-25,-100,-42,-69,'#63846d',15);
 oval(c,-42,-67,11,12,'#465f59','#2b4650',3);
 for(const x of [-45,-39])fill(c,[[x,-77],[x+4,-91],[x+7,-76]],'#d2c6a2','#314650',1.5);
 // Head behind brow
 oval(c,2,-127,30,26,'#648b68','#29473b',4);
 fill(c,[[-24,-132],[-29,-126],[-39,-126],[-34,-142],[-21,-146]],'#719b73','#2d5344',3);
 fill(c,[[26,-131],[35,-136],[39,-128],[34,-119],[23,-120]],'#719b73','#2d5344',3);
 // Hair/helmet crest and bronze brow plate
 fill(c,[[-26,-148],[-13,-161],[8,-163],[25,-152],[21,-139],[-27,-140]],'#4a4650','#293840',3.4);
 fill(c,[[-24,-139],[29,-139],[22,-133],[-24,-132]],'#c5a06a','#394650',2);
 oval(c,-10,-128,4.2,3,'#ffde91');oval(c,15,-128,4.2,3,'#ffde91');
 line(c,[[-15,-134],[-5,-132]],'#294b3c',3);
 line(c,[[10,-132],[20,-135]],'#294b3c',3);
 fill(c,[[-9,-115],[10,-116],[7,-108],[-9,-109]],'#2a4c3d','',0);
 fill(c,[[-11,-114],[-6,-121],[-3,-114]],'#eee2bc','',0);
 fill(c,[[5,-114],[9,-121],[12,-114]],'#eee2bc','',0);
 c.restore();
}
function hound(c,m){
 c.save();
 for(const [dx,dy,s] of [[-39,-28,1],[-16,-20,-1],[21,-23,1],[47,-18,-1]]){
  const step=m.stride*s*.65;
  limb(c,dx,dy,dx+step,-7,'#845f4d',11);
  boot(c,dx+step,-4,'#473f43');
 }
 c.translate(-m.recoil*.3,-m.bob+m.fall*21);
 c.rotate(-m.fall*.33);
 // Tail and coarse mane
 line(c,[[-45,-51],[-67,-65+Math.sin(m.tail*TAU)*9],[-74,-48]],'#2a373c',21);
 line(c,[[-45,-51],[-67,-65+Math.sin(m.tail*TAU)*9],[-74,-48]],'#bc7951',15);
 fill(c,[[-52,-68],[-38,-83],[-8,-78],[25,-76],[49,-58],[43,-31],[-46,-34]],'#a36a51','#36464a',4);
 fill(c,[[-30,-77],[-13,-91],[-5,-74],[9,-91],[19,-72],[37,-82],[49,-55],[20,-45],[-40,-51]],'#493b45','#273844',3);
 fill(c,[[-22,-61],[32,-61],[42,-49],[29,-40],[-22,-44]],'#c29369','',0);
 // Chest harness
 line(c,[[-19,-76],[-9,-35]],'#2b4042',13);
 line(c,[[-18,-75],[-9,-36]],'#ba9b6b',7);
 oval(c,-14,-55,11,13,'#3a5660','#e9be77',3);badge(c,-14,-55,'#e4b86a');
 // Neck and formidable muzzle
 oval(c,47,-68,28,26,'#8b604f','#253e44',4);
 fill(c,[[49,-69],[72,-66],[81,-56],[73,-43],[48,-45]],'#c48b65','#304247',3);
 oval(c,78,-54,7,6,'#293940','#172b38',2);
 fill(c,[[46,-49],[70,-46],[60,-39],[47,-40]],'#543c3c','',0);
 for(const x of [52,62])fill(c,[[x,-44],[x+3,-35],[x+7,-44]],'#efe8cf','',0);
 // Oversized upright ears
 fill(c,[[32,-86],[22,-112],[44,-101],[52,-85]],'#714d4a','#273842',3);
 fill(c,[[53,-86],[69,-109],[72,-79],[63,-76]],'#85534a','#273842',3);
 fill(c,[[36,-90],[30,-105],[42,-95]],'#d18d75','',0);
 oval(c,56,-73,5,5,'#f4d37d','#283d43',2);
 oval(c,57,-73,2,2,'#2c3643');
 // shoulder spikes
 for(const x of [-33,-6,19])fill(c,[[x,-80],[x+3,-97],[x+13,-78]],'#dfcfb1','#3f4b4c',2);
 if(m.swing!==0)line(c,[[63,-40],[80+m.swing*7,-35]],'#f1d9ab',3);
 c.restore();
}
function recruit(c,m){
 c.save();
 for(const side of [-1,1]){
  const s=m.stride*side*.75;
  limb(c,side*15,-63,side*18+s,-29,'#4e7283',16);
  boot(c,side*18+s,-4,'#4b5d65');
 }
 c.translate(-m.recoil*.4,-m.bob+m.fall*38);c.rotate(-m.fall*.56);
 // White/tabard field with teal split mantle
 fill(c,[[-27,-116],[5,-124],[29,-113],[25,-61],[18,-34],[2,-44],[-11,-36],[-30,-57]],'#477b80','#304958',4);
 fill(c,[[-15,-108],[20,-109],[12,-46],[0,-55],[-13,-44]],'#e7d6b1','#586c69',2);
 fill(c,[[-9,-98],[10,-98],[7,-72],[-8,-69]],'#d3b685','',0);
 badge(c,1,-90,'#57d7dc');
 line(c,[[-25,-73],[26,-72]],'#e5c48d',6);
 // sword arm
 c.save();c.translate(25,-101);c.rotate(m.swing*.65);
 limb(c,0,0,19,22,'#d3c6a0',12);
 oval(c,20,22,10,10,'#d7b58f','#40505b',2);
 c.translate(19,21);sword(c,-.05);c.restore();
 // held shield
 limb(c,-25,-100,-36,-69,'#cfc69f',13);
 fill(c,[[-53,-80],[-24,-82],[-17,-58],[-23,-28],[-42,-38],[-55,-56]],'#356f82','#2c465b',4);
 fill(c,[[-44,-75],[-30,-75],[-23,-55],[-37,-40],[-49,-56]],'#79b0ac','#e5d4a3',2);
 fill(c,[[-40,-64],[-33,-61],[-35,-50],[-44,-57]],'#e5bf75','',0);
 // helmet and face
 oval(c,0,-127,24,25,'#d4a77c','#485561',4);
 oval(c,-8,-123,3.6,3.4,'#2e3b49');oval(c,11,-123,3.6,3.4,'#2e3b49');
 line(c,[[-2,-110],[9,-110]],'#8f665c',2);
 fill(c,[[-27,-138],[-22,-157],[-6,-166],[19,-159],[27,-140],[25,-128],[-25,-128]],'#78969a','#324b5d',4);
 fill(c,[[-30,-138],[-3,-145],[28,-138],[25,-131],[-27,-131]],'#e5c998','#405766',2);
 fill(c,[[-7,-167],[3,-181],[13,-166]],'#e4c78a','#455f6c',2.5);
 line(c,[[1,-176],[2,-139]],'#b8e4d6',3);
 c.restore();
}
function sniper(c,m){
 c.save();
 for(const side of [-1,1]){
  limb(c,side*15,-60,side*16+side*m.stride*.65,-27,'#4b6a61',15);
  boot(c,side*16+side*m.stride*.65,-4,'#485450');
 }
 c.translate(-m.recoil*.5,-m.bob+m.fall*39);c.rotate(-m.fall*.55);
 // Coat, scarf and small radio
 fill(c,[[-28,-112],[-40,-48],[-20,-34],[0,-52],[20,-38],[34,-49],[27,-108]],'#50655e','#263f46',4);
 fill(c,[[-21,-110],[22,-107],[15,-72],[3,-65],[-14,-75]],'#7f8a76','#2f5051',3);
 line(c,[[-24,-85],[23,-83]],'#d1b78c',7);
 fill(c,[[-30,-114],[-40,-118],[-38,-91],[-26,-90]],'#333f4b','#e4ba78',2);
 oval(c,-31,-106,4,4,'#7ee0ca');badge(c,1,-82,'#79ddcb');
 // Gloves, aiming rifle kept as ACTOR visual; T owns mounting and actual shots
 c.save();c.translate(0,-106);c.rotate(m.swing*.16);
 limb(c,-22,-4,2,13,'#72927b',13);
 limb(c,21,-4,37,9,'#77917c',13);
 line(c,[[-38,13],[70,0]],'#2d3d48',15);
 line(c,[[-36,9],[62,-4]],'#9c7957',8);
 line(c,[[17,-10],[45,-14]],'#dae3d0',5);
 line(c,[[62,-4],[82,-6]],'#2b3a42',5);
 oval(c,29,-10,13,4,'#374653','#dbc599',2);
 fill(c,[[7,10],[22,10],[18,23],[10,22]],'#283d40','#9c805b',2);
 c.restore();
 oval(c,1,-127,25,25,'#bf9272','#34464a',4);
 fill(c,[[-26,-141],[-23,-158],[-9,-170],[15,-169],[28,-151],[25,-136]],'#526e65','#2b4448',4);
 fill(c,[[-28,-140],[27,-141],[31,-132],[-30,-131]],'#b5ad83','#344949',3);
 fill(c,[[-23,-133],[-5,-139],[18,-137],[24,-125],[11,-121],[-19,-125]],'#304b4c','#99cbbb',3);
 for(const x of [-9,10]){oval(c,x,-130,8,7,'#7de1cd','#263f4a',2);oval(c,x-2,-131,3,2,'#e5ffff');}
 fill(c,[[-10,-115],[11,-115],[9,-106],[-10,-106]],'#e0c5a0','#586a63',2);
 c.restore();
}
function drawFrame(ctx,kind,state,index,count){
 ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
 ctx.translate(FRAME_WIDTH*.5,FRAME_HEIGHT*.92);
 const m=motion(state,index,count);
 if(state==='die')ctx.globalAlpha=1-Math.max(0,(index/(count-1)-.62)*.58);
 if(kind==='orc')orc(ctx,m);else if(kind==='hound')hound(ctx,m);
 else if(kind==='recruit')recruit(ctx,m);else sniper(ctx,m);
 if(state==='hit'||state==='blocked'){
  ctx.globalCompositeOperation='source-atop';
  ctx.fillStyle=state==='hit'?'rgba(255,244,210,.19)':'rgba(107,217,238,.13)';
  ctx.fillRect(-88,-190,176,208);ctx.globalCompositeOperation='source-over';
 }
 ctx.restore();
}
export function createActorAtlas(actorId){
 const actor=CAST.find(a=>a.actorId===actorId);
 if(!actor)throw Error('Actor desconocido: '+actorId);
 const total=Object.values(ANIMATIONS).reduce((s,a)=>s+a.frames,0);
 const canvas=document.createElement('canvas');
 canvas.width=FRAME_WIDTH*ATLAS_COLUMNS;canvas.height=FRAME_HEIGHT*Math.ceil(total/ATLAS_COLUMNS);
 const context=canvas.getContext('2d',{alpha:true});
 if(!context)throw Error('Canvas 2D requerido solo para HORNEAR atlas');
 const frames={};let count=0;
 for(const [state,anim] of Object.entries(ANIMATIONS)){
  frames[state]=[];
  for(let i=0;i<anim.frames;i++,count++){
   const x=(count%ATLAS_COLUMNS)*FRAME_WIDTH,y=Math.floor(count/ATLAS_COLUMNS)*FRAME_HEIGHT;
   context.save();context.translate(x,y);drawFrame(context,actor.kind,state,i,anim.frames);context.restore();
   frames[state].push({name:state+'-'+i,x,y,w:FRAME_WIDTH,h:FRAME_HEIGHT});
  }
 }
 return {canvas,frames,actor,framesTotal:count,columns:ATLAS_COLUMNS,
  frameWidth:FRAME_WIDTH,frameHeight:FRAME_HEIGHT};
}
export function registerActorAtlases(scene){
 const all=new Map();
 for(const actor of CAST){
  const bundle=createActorAtlas(actor.actorId);
  scene.textures.addCanvas(actor.atlasKey,bundle.canvas);
  const texture=scene.textures.get(actor.atlasKey);
  for(const frames of Object.values(bundle.frames))
   for(const f of frames)texture.add(f.name,0,f.x,f.y,f.w,f.h);
  all.set(actor.actorId,bundle);
 }
 return all;
}
