/**
 * SEMANTROPIC TD / P-03 Q2
 * Dibujo ORIGINAL, independiente de las sobrepinturas P-02. Esqueleto articulado
 * frame por frame: pies/rodillas, hombros, brazos, cabeza, arma y cuatro patas.
 * Fuente editable Canvas 2D. No simula gameplay ni altera autoridad del core.
 */
import {CAST,ANIMATIONS,FRAME_WIDTH,FRAME_HEIGHT,ATLAS_COLUMNS} from './atlas-source.mjs';

export const P03_VERSION='P03-Q2-rig-v1';
export const P03_STATES=Object.freeze(Object.keys(ANIMATIONS));
export const P03_FPS=Object.freeze({
 warrior:{idle:5,walk:9,attackWindup:8,attack:12,hit:12,blocked:9,die:9},
 hound:{idle:6,walk:12,attackWindup:10,attack:13,hit:13,blocked:9,die:10},
 infantry_recruit:{idle:5,walk:9,attackWindup:9,attack:12,hit:12,blocked:9,die:9},
 sniper_operator:{idle:5,walk:8,attackWindup:9,attack:11,hit:10,blocked:7,die:8}
});
export const P03_ACTORS=Object.freeze(CAST.map(a=>Object.freeze({
 actorId:a.actorId,atlasKey:a.atlasKey+'/p03-q2',faction:a.faction,
 footAnchor:Object.freeze({x:.5,y:.92}),shadowAnchor:Object.freeze({x:.5,y:1}),
 heightWorld:a.heightWorld,frameWidth:FRAME_WIDTH,frameHeight:FRAME_HEIGHT,
 stateIds:P03_STATES
})));
const TAU=Math.PI*2,PI=Math.PI;
const clamp=(x,lo,hi)=>Math.max(lo,Math.min(hi,x));
const lerp=(a,b,t)=>a+(b-a)*t;
const ease=t=>t*t*(3-2*t);
const mix=(a,b,t)=>a.map((v,i)=>lerp(v,b[i],t));
function at(c,pts){c.beginPath();for(let i=0;i<pts.length;i++)i?c.lineTo(pts[i][0],pts[i][1]):c.moveTo(pts[i][0],pts[i][1]);}
function shape(c,pts,fill,stroke='#21343b',width=3){
 at(c,pts);c.closePath();c.fillStyle=fill;c.fill();
 if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}
}
function oval(c,x,y,rx,ry,fill,edge='#243a43',width=2){
 c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fillStyle=fill;c.fill();
 if(edge){c.strokeStyle=edge;c.lineWidth=width;c.stroke();}
}
function path(c,pts,stroke,width=3){
 at(c,pts);c.strokeStyle=stroke;c.lineWidth=width;c.stroke();
}
function bez(c,from,c1,c2,to,stroke,width){
 c.beginPath();c.moveTo(...from);c.bezierCurveTo(...c1,...c2,...to);
 c.strokeStyle=stroke;c.lineWidth=width;c.stroke();
}
function grad(c,x1,y1,x2,y2,a,b,middle){
 const g=c.createLinearGradient(x1,y1,x2,y2);
 g.addColorStop(0,a);if(middle)g.addColorStop(.54,middle);g.addColorStop(1,b);return g;
}
function link(c,a,b,w,dark,light){
 path(c,[a,b],dark,w+5);path(c,[a,b],light,w);
 oval(c,...b,w*.5,w*.45,light,dark,2);
}
function gem(c,x,y,s,color){
 shape(c,[[x,y-s],[x+s*.56,y-s*.16],[x+s*.27,y+s],[x-s*.58,y+s*.07]],color,'#183642',2);
 path(c,[[x,y-s],[x,y+s*.6]],'#b8f1e6',1.8);
}
function armor(c,x,y,rx,ry,fill,trim='#c5a37a'){
 oval(c,x,y,rx,ry,grad(c,x-rx,y-ry,x+rx,y+ry,'#f7e0ad',fill,'#73888a'),'#293b46',3);
 bez(c,[x-rx*.62,y+ry*.28],[x-rx*.2,y+ry*.65],[x+rx*.3,y+ry*.61],[x+rx*.67,y+ry*.13],trim,2);
}
function pointedBoot(c,x,y,width,color){
 shape(c,[[x-width*.48,y-16],[x+width*.5,y-16],[x+width*.65,y-3],[x+width*.48,y+1],[x-width*.65,y+1],[x-width*.79,y-4]],color,'#223743',3);
 path(c,[[x-width*.5,y-5],[x+width*.46,y-5]],'#d6b68d',2);
}
function rifle(c,stock,barrel,angle=0){
 c.save();c.translate(...stock);c.rotate(angle);
 // Clear long rigid weapon; never fire projectile or muzzle VFX here.
 shape(c,[[-18,-2],[7,-7],[54,-7],[60,0],[4,7],[-21,8]],'#534c4a','#253845',3);
 path(c,[[0,-2],[62,-2]],'#d2ab70',7);
 path(c,[[28,-5],[78,-5]],'#3a4b54',8);
 path(c,[[40,-9],[79,-9]],'#a2b3ab',2);
 shape(c,[[11,-8],[24,-16],[38,-16],[41,-9]],'#315e6c','#273b49',2);
 oval(c,36,-16,4,5,'#9fe4db','#264654',2);
 shape(c,[[12,6],[27,6],[20,21],[13,16]],'#445967','#293b46',2);
 path(c,[[-18,9],[0,11],[10,6]],'#caa476',3);
 c.restore();
}
function axe(c,hand,angle){
 c.save();c.translate(...hand);c.rotate(angle);
 path(c,[[0,7],[0,-62]],'#253946',13);
 path(c,[[1,8],[1,-62]],'#a7855a',7);
 shape(c,[[-4,-57],[-20,-69],[-41,-73],[-37,-48],[-19,-34],[-3,-39]],
  grad(c,-42,-72,2,-30,'#eff1db','#748d91','#b5c6bf'),'#293e4b',3);
 shape(c,[[-8,-58],[10,-73],[18,-48],[5,-35]],'#55626c','#303d47',3);
 path(c,[[-30,-66],[-24,-42]],'#f9ebd7',2);
 gem(c,3,-50,6,'#d48254');
 c.restore();
}
function sword(c,hand,angle){
 c.save();c.translate(...hand);c.rotate(angle);
 path(c,[[0,12],[0,-45]],'#9c8459',7);
 shape(c,[[-6,-39],[0,-82],[9,-39],[2,-22]],
  grad(c,-7,-78,10,-25,'#eaf6ee','#a7b9b9'),'#3b5663',2.7);
 path(c,[[0,-79],[0,-26]],'#ffffff',2);
 path(c,[[-13,-27],[15,-27]],'#e0bc79',6);oval(c,0,-27,4,4,'#76dad6','#3e565e',1.5);
 c.restore();
}
function shield(c,center,roll=0){
 c.save();c.translate(...center);c.rotate(roll);
 shape(c,[[-21,-25],[13,-29],[25,-12],[20,20],[0,37],[-23,14]],
  '#276780','#283f56',4);
 shape(c,[[-16,-20],[11,-23],[19,-10],[15,17],[0,27],[-17,9]],
  grad(c,-16,-21,21,27,'#96ddd2','#36779a','#52899a'),'#d8b883',2.8);
 shape(c,[[-2,-12],[5,-3],[15,-3],[7,4],[10,16],[0,9],[-9,15],[-5,2],[-14,-4],[-3,-4]],
  '#efd9a0','#526d72',1.7);
 oval(c,0,0,6,6,'#d1b778','#304c55',2);
 c.restore();
}
function helmet(c,isSniper=false){
 shape(c,[[-23,-127],[-25,-147],[-15,-160],[4,-170],[20,-163],[27,-149],[22,-127]],
  isSniper?'#3c5861':'#728c95','#304653',3.5);
 shape(c,[[-21,-139],[8,-149],[28,-138],[25,-130],[-24,-129]],isSniper?'#2e4d59':'#c4b591','#243f4c',2.5);
 if(isSniper){
  shape(c,[[-24,-137],[-8,-146],[19,-141],[27,-132],[18,-125],[-16,-126]],'#243f50','#659f9b',2);
  for(const x of [-8,11]){oval(c,x,-132,8.5,7.5,'#6bd7d4','#1d3c4c',2);oval(c,x-2,-134,2,2,'#effffc','',0);}
 }else{
  shape(c,[[-7,-168],[-3,-188],[6,-179],[13,-171]],'#447e98','#243e52',2);
  path(c,[[-3,-182],[7,-168]],'#94d4cb',2);
 }
}
function pose(actor,state,index,total){
 const p=total<=1?0:index/(total-1),phase=TAU*index/total;
 const walk=state==='walk',attack=state==='attack',wind=state==='attackWindup';
 const hit=state==='hit',blocked=state==='blocked',die=state==='die';
 const sin=Math.sin(phase),cos=Math.cos(phase);
 const strike=attack?[ -.5,.25,1.0,.65,0][index] ?? 0:0;
 const end=die?ease(p):0;
 const tension=wind?ease(p):blocked?.45:0;
 return {
  phase,p,walk,
  stride:walk?(actor==='hound'?14:13)*sin:0,
  stepLift:walk?Math.max(0,cos)*7:0,
  weight:walk?Math.sin(phase+PI*.55)*3:0,
  bob:walk?Math.cos(2*phase)*2.5:(Math.sin(phase)*.8+Math.cos(phase)*.35),
  shoulder:walk?sin*.09:wind?-.22*tension:attack?-.35+strike*.23:hit?-.16*(1-p):blocked?-.1:0,
  arm:walk?sin*.29:wind?-.8*tension:attack?[-.75,.6,1.3,.6,.1][index]??0:hit?-.36:blocked?-.6:0,
  shieldArm:blocked?-12:attack?-5:walk?cos*4:0,
  reaction:hit?(1-p)*9:0,
  compress:blocked?5:attack?2:0,
  tail:Math.sin(phase+.55)*12,
  jaw:attack?Math.sin(p*PI)*10:hit?7:0,
  fall:end,fade:die?clamp(1-(p-.77)*1.2,.6,1):1,
  contact:walk&&cos>0,
  blink:state==='idle'&&index===total-1,
  strike,wind:tension
 };
}
function armSegment(c,shoulder,elbow,hand,dark,light,size=15){
 link(c,shoulder,elbow,size,dark,light);
 link(c,elbow,hand,size*.77,dark,light);
 oval(c,...hand,size*.52,size*.46,light,dark,2.2);
}
function biped(c,id,P){
 const orc=id==='warrior',sniper=id==='sniper_operator';
 const faction=orc?'enemy':'ally';
 const skin=orc?'#759d65':'#d7ab83',dark=orc?'#334d44':'#334b55';
 const pants=orc?'#4a5354':sniper?'#586e67':'#506f83';
 // Pose rig: feet anchored in shared world foot-plane, alternating support.
 const down=P.fall;
 const stance=orc?20:16;
 const xL=-stance-P.stride*.65,xR=stance+P.stride*.65;
 const feet=[{x:xL,y:-Math.max(0,P.stepLift*(P.stride<0?1:0))},
             {x:xR,y:-Math.max(0,P.stepLift*(P.stride>0?1:0))}];
 c.save();c.globalAlpha=P.fade;
 c.translate(-P.reaction*.46,down*53-P.bob+P.compress);
 c.rotate(-down*(orc?.92:1.05));
 // Back cloth with readable 3/4 fall; body stays attached to pelvis.
 if(sniper)shape(c,[[-30,-102],[-46,-79],[-48,-26],[-13,-40],[22,-28],[34,-89]],
  grad(c,-46,-103,34,-25,'#8d8d6c','#293f43','#4d6961'),'#2b4045',3);
 else if(orc)shape(c,[[-26,-100],[-39,-73],[-36,-41],[-8,-48],[29,-41],[31,-103]],'#754c4f','#3b3b45',3);
 // Legs articulated rather than whole-image stickers.
 for(const [side,foot] of [[-1,feet[0]],[1,feet[1]]]){
  const hip=[side*13,-67-P.weight*.2],knee=[side*16+(foot.x-hip[0])*.45,-35];
  armSegment(c,hip,knee,[foot.x,-16+foot.y],dark,pants,orc?19:15);
  pointedBoot(c,foot.x,foot.y,orc?31:25,sniper?'#4d554e':'#425866');
 }
 // pelvis and cloth panel
 shape(c,[[-27,-84],[27,-84],[24,-62],[8,-55],[-12,-59],[-28,-69]],orc?'#4e5550':'#536e6a','#2b414a',3);
 shape(c,[[-8,-72],[13,-72],[8,-37],[-2,-45],[-13,-37]],orc?'#996344':'#e2cda2','#3f5657',2);
 // Torso rotated independently from legs.
 c.save();c.translate(0,-93);c.rotate(P.shoulder);
 const torso=orc?[[[-39,-16],[18,-30],[42,-8],[37,27],[6,41],[-35,23]],'#617468']:
               [[[-29,-17],[13,-23],[29,-6],[25,29],[2,38],[-26,25]],sniper?'#658177':'#488395'];
 shape(c,torso[0],grad(c,-45,-22,42,40,orc?'#a9ad80':'#cad4bb',torso[1],orc?'#566c5f':'#75959d'),'#283f4a',4);
 shape(c,[[-14,-6],[13,-12],[19,25],[-3,31],[-18,22]],orc?'#4f6866':sniper?'#6e7e65':'#dae0c2','#395158',2.4);
 // Asymmetric shoulder plating, silhouette distinguishable.
 armor(c,-(orc?30:23),-13,orc?25:18,orc?14:12,orc?'#737d76':'#708a90');
 armor(c,orc?30:25,-19,orc?20:15,orc?14:10,orc?'#957e65':'#b1ada0');
 if(orc){
  gem(c,29,-21,8,'#b5b4a2');
  for(let i=0;i<3;i++)shape(c,[[-45+i*9,-20],[-42+i*9,-35],[-33+i*9,-17]],'#d5c7a3','#34444a',1.6);
 }else{gem(c,-1,5,6,'#75dcd9');}
 const leftShoulder=[-25,-12],rightShoulder=[orc?34:24,-11];
 let handL,handR;
 if(orc){
  handL=[-46+P.shieldArm,-(36+P.wind*10)];
  const sx=P.arm*19,sy=P.arm*21;
  handR=[46+sx,-30-sy];
 }else if(sniper){
  handL=[-2,-33+P.shieldArm*.3];handR=[31+P.arm*4,-24-P.arm*5];
 }else{
  handL=[-37+P.shieldArm,-32-P.wind*5];
  handR=[39+P.arm*12,-28-P.arm*24];
 }
 // Draw back arm before face/equipment
 armSegment(c,leftShoulder,mix(leftShoulder,handL,.55).map((v,i)=>v+(i===1?-4:0)),handL,dark,skin,orc?18:13);
 armSegment(c,rightShoulder,mix(rightShoulder,handR,.56).map((v,i)=>v+(i===1?6:0)),handR,dark,skin,orc?20:13);
 if(orc){
  oval(c,-5,-37,29,25,skin,'#315343',3); // short broad neck and heavy head
  oval(c,3,-48,29,25,grad(c,-26,-65,30,-30,'#acc582','#4f8569'),'#294638',4);
  shape(c,[[-11,-37],[17,-37],[13,-26],[-11,-27]],'#466946','#2f5348',2);
  for(const e of [[-9,-47],[13,-49]]){
   oval(c,e[0],e[1],5,4,P.blink?'#314b40':'#f9d18b','#32443e',1.5);
   path(c,[[e[0]-6,e[1]-8],[e[0]+4,e[1]-7]],'#31463f',4);
  }
  shape(c,[[11,-26],[14,-37],[19,-27]],'#fbecd6','#2c5246',1.2);
  shape(c,[[-13,-27],[-9,-38],[-5,-27]],'#fbecd6','#2c5246',1.2);
  for(let i=0;i<3;i++)shape(c,[[i*7-21,-66],[i*8-17,-81-(i===1?6:0)],[i*8-12,-68]],'#bc674b','#494445',2);
  // Axe follows palm rotation across discrete attack keyposes.
  axe(c,handR,-.45+P.arm*.69);
 }else{
  // Human facial mask with brow and guard visor.
  oval(c,0,-38,21,26,skin,'#59615e',2);
  if(sniper){
   helmet(c,true);
   rifle(c,[-17,-26],null,P.arm*.075);
   path(c,[[11,-17],[22,-11]],'#d7c5a5',3);
  }else{
   oval(c,-6,-43,3.5,3,'#253f4c','',0);
   oval(c,11,-43,3.5,3,'#253f4c','',0);
   helmet(c,false);
   shield(c,[handL[0]+2,handL[1]+13],P.wind*.14-P.shieldArm*.015);
   sword(c,handR,-.12+P.arm*.7);
  }
 }
 c.restore();c.restore();
}
function hound(c,P){
 c.save();c.globalAlpha=P.fade;
 c.translate(-P.reaction*.5,P.fall*28-P.bob*.6+P.compress);
 c.rotate(-P.fall*.4);
 const neck=-58,faceX=55;
 // Rear tail lives BEHIND pelvis, with momentum.
 bez(c,[-46,-61],[-63,-82-P.tail*.4],[-71,-102+P.tail],[-87,-73+P.tail*.6],
  '#2e3a43',18);
 bez(c,[-46,-61],[-63,-82-P.tail*.4],[-71,-102+P.tail],[-87,-73+P.tail*.6],
  '#bc8259',12);
 // Paws: front+back not in phase; diagonal pairs alternate and touch ground.
 // Hind far, front far first (visually occluded by torso).
 const legs=[
  {root:[-36,-43],x:-47,phase:0,size:13,near:false},
  {root:[30,-47],x:35,phase:PI,size:12,near:false},
  {root:[-22,-46],x:-18,phase:PI,size:16,near:true},
  {root:[42,-49],x:48,phase:0,size:15,near:true}
 ];
 function leg(l){
  const angle=P.walk?Math.sin(P.phase+l.phase):0;
  const travel=P.walk?angle*14:0,lift=P.walk?Math.max(0,Math.cos(P.phase+l.phase))*13:0;
  const paw=[l.x+travel,-lift],knee=[lerp(l.root[0],paw[0],.55)+(l.root[0]<0?-8:8),-24-lift*.55];
  armSegment(c,l.root,knee,[paw[0],paw[1]-7],'#403d3f',l.near?'#b58a69':'#7f695e',l.size);
  shape(c,[[paw[0]-10,paw[1]-8],[paw[0]+8,paw[1]-8],[paw[0]+15,paw[1]-2],[paw[0]-10,paw[1]+1]],
   l.near?'#8b6254':'#625459','#3d4247',2);
  for(const k of [-6,1,8])path(c,[[paw[0]+k,paw[1]-2],[paw[0]+k+3,paw[1]]],'#e2b98d',1.5);
 }
 legs.filter(x=>!x.near).forEach(leg);
 // Lithe quadruped spine, abdomen, pelvis and scapula masses.
 shape(c,[[-58,-73],[-37,-92],[-4,-82],[25,-87],[48,-72],[40,-42],[-29,-39],[-50,-45]],
  grad(c,-51,-89,50,-33,'#d1a27e','#735854','#a27760'),'#34434a',4);
 oval(c,-38,-53,24,19,'#a27a60','#51474a',2.5);
 oval(c,26,-59,27,25,grad(c,1,-83,48,-44,'#9c796d','#584b55'),'#31454d',3);
 // Mane segmented intentionally to show spine compression.
 for(let j=0;j<5;j++){
  const x=-33+j*16;
  shape(c,[[x-8,-78],[x-1,-104+(j%2?4:0)],[x+10,-79]],j%2?'#423b46':'#63606a','#31434c',2.1);
 }
 // Armored technological harness is clearly separate from animal anatomy.
 path(c,[[-20,-81],[-5,-45],[32,-76]],'#263943',12);
 path(c,[[-20,-81],[-5,-45],[32,-76]],'#a57852',6.5);
 oval(c,2,-63,11,11,'#455862','#d0b17f',2);
 gem(c,3,-63,7,'#91d5ce');
 legs.filter(x=>x.near).forEach(leg);
 // Head/hocico projection 3/4.
 c.save();c.translate(P.wind*-5,P.jaw*.3);
 oval(c,49,neck-4,26,24,'#98715b','#32444a',3.2);
 shape(c,[[56,-68],[81,-65],[87,-52],[73,-43],[56,-51]],
  grad(c,56,-69,83,-44,'#ead0a6','#9c6957'),'#31424a',3);
 oval(c,83,-56,7,6,'#283940','#253c42',1.5);
 shape(c,[[51,-49],[74,-44],[64,-34],[49,-40]],P.jaw>1?'#70474c':'#55494c','#36454d',2);
 for(const x of [57,68])shape(c,[[x,-43],[x+2,-34],[x+7,-43]],'#f4e3c2','#5a5b56',1.5);
 shape(c,[[35,-74],[26,-106],[48,-91],[51,-71]],'#6e5556','#38434a',2.5);
 shape(c,[[52,-78],[70,-101],[75,-74]],'#996a5c','#38434a',2.5);
 oval(c,58,-73,5,4,P.blink?'#3c4243':'#f9c975','#3c4549',1.4);
 path(c,[[53,-79],[63,-79]],'#493f40',3);
 c.restore();c.restore();
}
export function getP03Pose(actorId,state,frame){
 const actor=P03_ACTORS.find(x=>x.actorId===actorId);
 if(!actor)throw Error('P03 actor desconocido '+actorId);
 const anim=ANIMATIONS[state];if(!anim)throw Error('Estado P03 desconocido '+state);
 if(!Number.isInteger(frame)||frame<0||frame>=anim.frames)throw Error('Índice P03 inválido '+frame);
 return pose(actorId,state,frame,anim.frames);
}
export function paintP03Frame(c,actorId,state,frame,{silhouette=false}={}){
 const P=getP03Pose(actorId,state,frame);
 c.save();c.lineJoin='round';c.lineCap='round';
 c.translate(FRAME_WIDTH*.5,FRAME_HEIGHT*.92);
 if(actorId==='hound')hound(c,P);
 else biped(c,actorId,P);
 if(silhouette){
  // Clip overlay only onto non-transparent painted pixels: black silhouette sheet.
  c.globalCompositeOperation='source-in';c.fillStyle='#17262f';
  c.fillRect(-FRAME_WIDTH/2,-FRAME_HEIGHT*.92,FRAME_WIDTH,FRAME_HEIGHT);
 }
 c.restore();
}
export function createP03Atlas(actorId,options={}){
 const a=P03_ACTORS.find(x=>x.actorId===actorId);
 if(!a)throw Error('Actor P03 desconocido '+actorId);
 const count=Object.values(ANIMATIONS).reduce((s,x)=>s+x.frames,0);
 const canvas=document.createElement('canvas');
 canvas.width=FRAME_WIDTH*ATLAS_COLUMNS;
 canvas.height=FRAME_HEIGHT*Math.ceil(count/ATLAS_COLUMNS);
 const ctx=canvas.getContext('2d',{alpha:true});
 if(!ctx)throw Error('Canvas2D no disponible para bake P03');
 const frames={};let i=0;
 for(const [state,spec] of Object.entries(ANIMATIONS)){
  frames[state]=[];
  for(let j=0;j<spec.frames;j++,i++){
   const x=i%ATLAS_COLUMNS*FRAME_WIDTH;
   const y=Math.floor(i/ATLAS_COLUMNS)*FRAME_HEIGHT;
   ctx.save();ctx.translate(x,y);
   paintP03Frame(ctx,actorId,state,j,options);
   ctx.restore();
   frames[state].push({name:state+'-'+j,x,y,w:FRAME_WIDTH,h:FRAME_HEIGHT});
  }
 }
 return {actor:a,atlasKey:a.atlasKey,canvas,frames,framesTotal:i,
  footAnchor:a.footAnchor,shadowAnchor:a.shadowAnchor,
  frameWidth:FRAME_WIDTH,frameHeight:FRAME_HEIGHT,sourceVersion:P03_VERSION};
}
export function registerP03Atlas(scene,asset){
 if(!asset||!asset.atlasKey)throw Error('Atlas P03 inválido');
 if(scene.textures.exists?.(asset.atlasKey))throw Error('Clave P03 ya registrada '+asset.atlasKey);
 scene.textures.addCanvas(asset.atlasKey,asset.canvas);
 const tx=scene.textures.get(asset.atlasKey);
 for(const ff of Object.values(asset.frames))for(const frame of ff)
  tx.add(frame.name,0,frame.x,frame.y,frame.w,frame.h);
 return asset.atlasKey;
}
