/**
 * SEMANTROPIC TD P05 actor assets: graphical reaction pass on the actual P04
 * editable painter. No P04 source is modified; 32-frame legacy ABI preserved.
 * Clear impact recoil, planted blocked stance and non-graphic fade pose.
 * New 7-state atlas is a visual candidate, not certified commercial art.
 */
import {P04_CANON,P04_META,P04_STATE_FRAMES} from './p04-poses.mjs';
import {paintP04Frame} from './p04-illustrator.mjs';
export const P05_ASSET_PREFIX='p05-reactivity';
const CW=P04_CANON.frameWidth,CH=P04_CANON.frameHeight,TAU=Math.PI*2;
const P05_PALETTE=Object.freeze({
 warrior:{bright:'#ead5a8',shadow:'#3f5b52',signal:'#99d1c3',icon:'axes'},
 hound:{bright:'#f0c69b',shadow:'#5a514d',signal:'#d4aa7c',icon:'ears'},
 infantry_recruit:{bright:'#f5d9a4',shadow:'#315e71',signal:'#92d7d9',icon:'shield'},
 sniper_operator:{bright:'#e1d6b1',shadow:'#3a646b',signal:'#b1e8dd',icon:'scope'}
});
const REACT=Object.freeze({
 hit:[{rotate:-.085,x:-4,squash:.94,head:-2},{rotate:.052,x:3,squash:.90,head:3},
      {rotate:-.012,x:0,squash:.985,head:0}],
 blocked:[{rotate:-.05,x:-3,squash:.96,head:0},{rotate:-.028,x:-2,squash:.93,head:0},
          {rotate:0,x:0,squash:1,head:0}],
 attackWindup:[{rotate:0,x:0,squash:1,head:0},{rotate:-.045,x:-2,squash:.98,head:0},
               {rotate:-.072,x:-3,squash:.965,head:0}],
 attack:[{rotate:-.070,x:-3,squash:.98,head:0},{rotate:-.018,x:0,squash:.98,head:0},
         {rotate:.065,x:6,squash:1.035,head:0},{rotate:.027,x:3,squash:.97,head:0},
         {rotate:0,x:0,squash:1,head:0}],
 die:[{rotate:0,x:0,squash:1,head:0},{rotate:-.08,x:-3,squash:.94,head:0},
      {rotate:-.13,x:-6,squash:.87,head:0},{rotate:-.15,x:-8,squash:.81,head:0},
      {rotate:-.16,x:-10,squash:.76,head:0},{rotate:-.16,x:-10,squash:.72,head:0}]
});
function alphaCurve(state,frame){
 if(state!=='die')return 1;
 return [1,1,1,.90,.72,.56][frame];
}
function ell(c,x,y,rx,ry,color,stroke='',width=2){
 c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fillStyle=color;c.fill();
 if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}
}
function line(c,x1,y1,x2,y2,color,w=2){
 c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.lineWidth=w;c.strokeStyle=color;c.stroke();
}
function accent(c,actor,state,index){
 const p=P05_PALETTE[actor],foot=CH*.92,head=actor==='hound'?116:53;
 c.save();c.translate(CW/2,0);c.lineCap='round';
 if(state==='hit'){
  // Pale impact-response strokes, deliberately not blood, injury or damage logic.
  const strength=[1,.7,.28][index];
  c.globalAlpha=.76*strength;
  for(const [dx,dy] of [[-37,-10],[33,10],[20,-29]]){
   line(c,dx,head+dy,dx+Math.sign(dx)*12,head+dy-7,p.bright,3.3*strength);
  }
  ell(c,-13,head-3,2.6*strength,2.6*strength,p.signal,'',0);
 }else if(state==='blocked'){
  c.globalAlpha=.68*[.42,.83,.23][index];
  c.beginPath();
  c.arc(actor==='hound'?23:-27,head+38,actor==='hound'?27:34,
    Math.PI*.75,Math.PI*1.43);
  c.lineWidth=4;c.strokeStyle=p.signal;c.stroke();
  line(c,-31,head+59,-42,head+67,p.bright,2.4);
 }else if(state==='walk' && (index===0||index===4)){
  // Foot contact dust is baked into art; no particle emitter or footprint in core.
  c.globalAlpha=.28;
  ell(c,-17,foot-2,17,3.7,p.bright,'',0);
  ell(c,20,foot-3,11,2.4,p.signal,'',0);
 }else if(state==='attackWindup'&&index===2){
  c.globalAlpha=.37;
  line(c,-36,head+38,-49,head+28,p.signal,3);
  line(c,30,head-14,39,head-30,p.bright,2);
 }else if(state==='die'&&index>=3){
  // Simplified cartoon dust/soft energy return, no graphic depiction.
  c.globalAlpha=.16+(index-3)*.11;
  for(let i=0;i<3;i++)ell(c,-27+i*24,foot-2-i*2,8+i*2,3,p.signal,'',0);
 }
 c.restore();
}
function transformOf(actorId,state,index){
 const t=REACT[state]?.[index]||{x:0,rotate:0,squash:1,head:0};
 const actor=actorId==='hound';
 const gait=state==='walk'?Math.sin(TAU*index/8):0;
 // The foot-space pivot is constant across states; only interior mass moves.
 return {
  translateX:t.x+(actor?gait*1.1:gait*.65),
  rotate:t.rotate*(actor?.62:1),
  scaleY:t.squash,
  scaleX:state==='hit'&&actor?1.055:1,
  opacity:alphaCurve(state,index)
 };
}
export function paintP05Frame(ctx,actorId,state,index,{silhouette=false}={}){
 if(!P05_PALETTE[actorId])throw Error('Actor P05 inválido: '+actorId);
 const count=P04_STATE_FRAMES[state];
 if(!count||!Number.isInteger(index)||index<0||index>=count)throw Error('P05 invalid state/frame');
 if(silhouette){
  const off=document.createElement('canvas');off.width=CW;off.height=CH;
  const o=off.getContext('2d',{alpha:true});
  paintP05Frame(o,actorId,state,index,{silhouette:false});
  o.globalCompositeOperation='source-in';o.fillStyle='#162a31';o.fillRect(0,0,CW,CH);
  ctx.drawImage(off,0,0);
  return;
 }
 const t=transformOf(actorId,state,index);
 ctx.save();
 const footY=CH*.92;
 ctx.translate(CW*.5+t.translateX,footY);
 ctx.rotate(t.rotate);
 ctx.scale(t.scaleX,t.scaleY);
 ctx.translate(-CW*.5,-footY);
 ctx.globalAlpha=t.opacity;
 // New pose reaction based on source P04 geometry: no raster screenshot reuse.
 paintP04Frame(ctx,actorId,state,index);
 ctx.restore();
 accent(ctx,actorId,state,index);
}
export function createP05Atlas(actorId){
 const entry=P04_META.find(x=>x.id===actorId);
 if(!entry)throw Error('P05 unknown actor '+actorId);
 const canvas=document.createElement('canvas');
 canvas.width=CW*P04_CANON.columns;canvas.height=CH*P04_CANON.rows;
 const c=canvas.getContext('2d',{alpha:true});
 if(!c)throw Error('P05 Canvas2D required once when baking atlas');
 const frames={};let count=0;
 for(const [state,n] of Object.entries(P04_STATE_FRAMES)){
  frames[state]=[];
  for(let i=0;i<n;i++,count++){
   const x=count%P04_CANON.columns*CW,y=Math.floor(count/P04_CANON.columns)*CH;
   c.save();c.translate(x,y);paintP05Frame(c,actorId,state,i);c.restore();
   frames[state].push({name:state+'-'+i,x,y,w:CW,h:CH});
  }
 }
 return {actorId,atlasKey:entry.key.replace('/p04','/p05'),frames,canvas,framesTotal:count,
  footAnchor:P04_CANON.footAnchor,shadowAnchor:P04_CANON.shadowAnchor,
  worldHeight:entry.worldHeight,source:'P04 editable painter + authored P05 reaction poses'};
}
export function registerP05Atlas(scene,asset){
 if(scene.textures.exists?.(asset.atlasKey))throw Error('P05 duplicate atlas '+asset.atlasKey);
 scene.textures.addCanvas(asset.atlasKey,asset.canvas);
 const tx=scene.textures.get(asset.atlasKey);
 for(const fs of Object.values(asset.frames))for(const f of fs)
  tx.add(f.name,0,f.x,f.y,f.w,f.h);
 return asset.atlasKey;
}
export function makeP05ExpressionSheet(actorId){
 if(!P05_PALETTE[actorId])throw Error('P05 unsupported face sheet actor');
 const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=820;
 const c=canvas.getContext('2d',{alpha:true});
 c.fillStyle='#14333f';c.fillRect(0,0,1200,820);
 const txt=(v,x,y,s=16)=>{c.font='bold '+s+'px system-ui';c.fillStyle='#f1dfbb';c.fillText(v,x,y)};
 txt('SEMANTROPIC TD · P05 · '+actorId.toUpperCase(),27,46,29);
 txt('6 POSES EXTRAÍDAS DEL MISMO DIBUJADOR DE ATLAS (no concept art externo)',29,72,15);
 const poses=[['IDLE','idle',0],['CONTACTO','walk',0],['PASO','walk',2],
  ['PREPARAR','attackWindup',2],['HIT','hit',1],['SALIDA','die',4]];
 poses.forEach(([label,state,frame],i)=>{
  const col=i%3,row=Math.floor(i/3),x=27+col*393,y=94+row*260;
  c.fillStyle='#234b55';c.fillRect(x,y,373,245);
  c.strokeStyle='#8bb3a9';c.lineWidth=2;c.strokeRect(x,y,373,245);
  txt(label+' · '+state+'-'+frame,x+10,y+23,17);
  c.save();c.translate(x+102,y+30);paintP05Frame(c,actorId,state,frame);c.restore();
 });
 txt('SILUETA/ESCALA DE LECTURA · 44 / 64 / 80 px (ancho de celda)',28,645,19);
 [44,64,80].forEach((size,i)=>{
  const x=46+i*388;
  c.fillStyle='#1a4048';c.fillRect(x,670,344,132);
  c.save();c.translate(x+149-size/2,686);c.scale(size/176,size/176);
  paintP05Frame(c,actorId,'walk',i*2);c.restore();
  txt(size+'px',x+10,784,15);
 });
 txt('Pivote fijo (.5,.92) · estados hit/die solo visuales · 176×208 / 32 cuadros',27,816,13);
 return canvas;
}
