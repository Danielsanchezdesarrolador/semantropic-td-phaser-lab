/* SEMANTROPIC TD P-02 • vitrina de COMPARACIÓN (no IA, no ataque real). */
import {CAST,ANIMATIONS,createActorAtlas,FRAME_WIDTH,FRAME_HEIGHT} from '../../art/actors/atlas-source.mjs';
import {P02_STUDIES,P02_ANIM,createP02Atlas,addP02Texture} from '../../art/actors/p02-painter.mjs';

const W=1280,H=768,$=id=>document.getElementById(id);
const slotX=[245,638,1031],slotY=522;
const config={actorId:'warrior',state:'walk',facing:'E',paused:false,showAnchors:false,zoom:2};
const frameNames={idle:'Reposo',walk:'Caminar',attackWindup:'Anticipar',attack:'Atacar',
  hit:'Reacción',blocked:'Bloqueo',die:'Caída'};
let pScene=null;
function status(message){$('status').textContent=message;}
function setControls(){
 document.querySelectorAll('[data-state]').forEach(el=>el.classList.toggle('active',el.dataset.state===config.state));
 document.querySelectorAll('[data-actor]').forEach(el=>el.classList.toggle('active',el.dataset.actor===config.actorId));
 $('facing').textContent='Dirección: '+config.facing;
 $('pause').textContent=config.paused?'▶ Reanudar':'Ⅱ Pausar';
 $('anchors').textContent=config.showAnchors?'Anclajes: ON':'Anclajes: OFF';
 $('zoom').textContent='Escala: '+(config.zoom===1?'M01 1×':'detalle 2×');
}
function atlasToTexture(scene,key,bundle){
 scene.textures.addCanvas(key,bundle.canvas);
 const tx=scene.textures.get(key);
 for(const fs of Object.values(bundle.frames))for(const f of fs)
  tx.add(f.name,0,f.x,f.y,f.w,f.h);
 return key;
}
function drawBackdrop(scene,map){
 const g=scene.add.graphics().setDepth(-90);
 g.fillGradientStyle(0x1e454a,0x264b50,0x2a5748,0x35514c);
 g.fillRect(0,0,W,H);
 if(map && map.path?.length===133){
  const path=map.path;
  for(const [w,col,a] of [[115,0x284c4c,.58],[110,0xa69570,.65],[80,0xc9b68f,.5]]){
   g.lineStyle(w,col,a);g.beginPath();g.moveTo(path[0][0],path[0][1]);
   for(let i=1;i<path.length;i++)g.lineTo(path[i][0],path[i][1]);
   g.strokePath();
  }
 }
 for(let i=0;i<95;i++){
  const x=(i*199+33)%W,y=(i*127+51)%H;
  g.fillStyle(i%4===0?0xa5cba7:0x233f42,.20).fillEllipse(x,y,23+(i%7)*9,3+i%5);
 }
 const p=scene.add.graphics().setDepth(30);
 p.fillStyle(0x091f2e,.83).fillRoundedRect(35,180,1210,435,28);
 p.lineStyle(2,0xb5a377,.75).strokeRoundedRect(35,180,1210,435,28);
 for(let i=0;i<3;i++){
  const x=slotX[i],cx=x-176;
  p.fillStyle(i===0?0x263c46:i===1?0x173f4a:0x3d353b,.78).fillRoundedRect(cx,207,352,376,18);
  p.lineStyle(2,i===0?0x7c9a9d:i===1?0x77d9b4:0xe7c58e,.62).strokeRoundedRect(cx,207,352,376,18);
  p.fillStyle(0x56bcb0,.09).fillEllipse(x,slotY,250,43);
 }
}
class P02Gallery extends Phaser.Scene{
 constructor(){super('P02Gallery');this.entries=[];this.bundles=[];this.elapsed=0;}
 create(){
  drawBackdrop(this,window.__P02_M01_READONLY);
  this.add.text(W/2,126,'SEMANTROPIC TD · EQUIPO P / P-02',{
   color:'#fff1cc',fontFamily:'system-ui',fontStyle:'bold',fontSize:'32px'
  }).setOrigin(.5).setDepth(50);
  this.add.text(W/2,156,'ESTUDIO ANIMADO · VITRINA SIN COMBATE NI IA REAL',{
   color:'#c8dcd2',fontFamily:'system-ui',fontSize:'14px'
  }).setOrigin(.5).setDepth(50);
  const titles=[['P-01 · ANTES','#bbcbd0'],['P-02 · A TÁCTICA','#77ebca'],['P-02 · B ILUSTRADA','#e7c98c']];
  for(let i=0;i<3;i++){
   this.add.text(slotX[i],250,titles[i][0],{
    color:titles[i][1],fontSize:'22px',fontStyle:'bold',fontFamily:'system-ui'
   }).setOrigin(.5).setDepth(51);
   this.add.text(slotX[i],283,i===0?'Baseline preservado':i===1?'Compacta / menos ruido':'Más volumen y equipamiento',{
    color:'#bdc9c3',fontSize:'14px',fontFamily:'system-ui'
   }).setOrigin(.5).setDepth(51);
  }
  this.readout=this.add.text(W/2,678,'',{fontFamily:'system-ui',fontSize:'16px',color:'#e7dbba'})
    .setOrigin(.5).setDepth(61);
  this.anchors=this.add.graphics().setDepth(65);
  pScene=this;this.loadActor(config.actorId);
 }
 loadActor(actorId){
  for(const e of this.entries){e.sprite.destroy();e.shadow.destroy();}
  this.entries=[];
  for(const e of this.bundles){this.textures.remove(e.key);}
  this.bundles=[];
  const actor=CAST.find(a=>a.actorId===actorId);
  if(!actor)throw Error('No existe este actor visual: '+actorId);
  const baseline=createActorAtlas(actorId);
  const keys=[
   atlasToTexture(this,'p02/base/'+actorId,baseline),
   addP02Texture(this,createP02Atlas(actorId,'A')),
   addP02Texture(this,createP02Atlas(actorId,'B'))
  ];
  this.bundles=[
   {key:keys[0],canvas:baseline.canvas,variant:'P-01'},
   {key:keys[1],canvas:this.textures.get(keys[1]).source[0].image,variant:'A'},
   {key:keys[2],canvas:this.textures.get(keys[2]).source[0].image,variant:'B'}
  ];
  for(let i=0;i<3;i++){
   const x=slotX[i],worldHeight=actor.heightWorld*(i===0?1:i===1?P02_STUDIES.A.heightFactor:P02_STUDIES.B.heightFactor);
   const baseH=actorId==='hound'?114:171,scale=worldHeight/baseH;
   const shadow=this.add.ellipse(x,slotY,actorId==='hound'?132:93,24,0x03191f,.64).setDepth(slotY-5);
   const sprite=this.add.image(x,slotY,keys[i],'idle-0')
    .setOrigin(.5,.92).setScale(scale*config.zoom).setDepth(slotY+2);
   this.entries.push({x,y:slotY,shadow,sprite,scale,worldHeight});
  }
  this.elapsed=0;this.drawAnchors();
  status(actor.label+' · 3 comparativas / 32 frames por atlas / 96 frames disponibles · arte P02 experimental');
 }
 drawAnchors(){
  this.anchors.clear();if(!config.showAnchors)return;
  for(const e of this.entries){
   this.anchors.lineStyle(2,0x78ffe5,.9).strokeCircle(e.x,e.y,5);
   this.anchors.lineBetween(e.x-22,e.y,e.x+22,e.y);
   this.anchors.lineBetween(e.x,e.y-22,e.x,e.y+22);
   this.anchors.lineStyle(1,0xe3c89c,.6).strokeEllipse(e.x,e.y,95,23);
  }
 }
 update(_time,delta){
  if(!config.paused)this.elapsed+=Math.min(.06,delta/1000);
  const anim=ANIMATIONS[config.state],fps=P02_ANIM[config.actorId][config.state]||anim.fps;
  const p=this.elapsed*fps;
  // Únicamente galería: estados no loop regresan visualmente a idle tras hold breve.
  if(!anim.loop && p>=anim.frames+.5){config.state='idle';this.elapsed=0;setControls();}
  const animNow=ANIMATIONS[config.state];
  const fpsNow=P02_ANIM[config.actorId][config.state]||animNow.fps;
  const raw=Math.floor(this.elapsed*fpsNow);
  const f=animNow.loop?raw%animNow.frames:Math.min(animNow.frames-1,raw);
  for(const e of this.entries){
   const frame=config.state+'-'+f;
   if(e.sprite.frame.name!==frame)e.sprite.setFrame(frame);
   e.sprite.setFlipX(config.facing==='W');
   e.sprite.setScale(e.scale*config.zoom);
  }
  this.readout.setText(frameNames[config.state]+' · cuadro '+(f+1)+'/'+animNow.frames+
   ' · '+fpsNow+' fps · '+config.facing+' · '+(config.paused?'PAUSA':'SOLO VISUAL'));
 }
}
function downloadSelected(variant){
 const scene=pScene;if(!scene)return;
 const b=scene.bundles.find(x=>x.variant===variant);
 if(!b||typeof b.canvas?.toDataURL!=='function')return status('Exportación PNG no disponible');
 const a=document.createElement('a');
 a.href=b.canvas.toDataURL('image/png');
 a.download='semantropic-p02-'+config.actorId+'-'+variant.toLowerCase()+'.png';
 document.body.appendChild(a);a.click();a.remove();
}
function bindControls(){
 for(const el of document.querySelectorAll('[data-actor]'))el.addEventListener('click',()=>{
  config.actorId=el.dataset.actor;config.state='walk';pScene?.loadActor(config.actorId);setControls();
 });
 for(const el of document.querySelectorAll('[data-state]'))el.addEventListener('click',()=>{
  config.state=el.dataset.state;if(pScene)pScene.elapsed=0;setControls();
 });
 $('facing').addEventListener('click',()=>{config.facing=config.facing==='E'?'W':'E';setControls();});
 $('pause').addEventListener('click',()=>{config.paused=!config.paused;setControls();});
 $('anchors').addEventListener('click',()=>{config.showAnchors=!config.showAnchors;pScene?.drawAnchors();setControls();});
 $('zoom').addEventListener('click',()=>{config.zoom=config.zoom===1?2:1;setControls();});
 $('exportA').addEventListener('click',()=>downloadSelected('A'));
 $('exportB').addEventListener('click',()=>downloadSelected('B'));
 document.addEventListener('visibilitychange',()=>{if(document.hidden){config.paused=true;setControls();}});
 setControls();
}
(async()=>{
 try{
  if(!window.Phaser||Phaser.VERSION!=='4.2.1')throw Error('Phaser 4.2.1 empaquetado requerido');
  const res=await fetch('../../data/maps.v5.json');
  if(!res.ok)throw Error('Fuente M01 no disponible');
  const maps=await res.json(),map=maps.find(m=>m.id===1);
  if(map?.path?.length!==133||map?.spots?.length!==8)throw Error('M01 no validado: no dibujar geometría sintética');
  window.__P02_M01_READONLY=map;bindControls();
  new Phaser.Game({
   type:Phaser.AUTO,parent:'stage',width:W,height:H,backgroundColor:'#133842',
   scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:W,height:H},
   scene:[P02Gallery],audio:{noAudio:true}
  });
 }catch(e){status('ERROR P02: '+e.message);console.error(e);}
})();
