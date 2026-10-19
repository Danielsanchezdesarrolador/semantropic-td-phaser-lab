/* SEMANTROPIC TD Equipo P P-01: vitrina de sprites VISUAL, no gameplay. */
import {CAST,ANIMATIONS,FRAME_WIDTH,FRAME_HEIGHT,registerActorAtlases} from '../../art/actors/atlas-source.mjs';
const W=1280,H=768;
const $=id=>document.getElementById(id);
const slots=[{x:175,y:492},{x:472,y:492},{x:775,y:492},{x:1075,y:492}];
const cfg={state:'walk',facing:'E',paused:false,speed:1,zoom:1,showAnchors:false};
const ui=()=>{document.querySelectorAll('[data-state]').forEach(b=>b.classList.toggle('active',b.dataset.state===cfg.state));
 $('pause').textContent=cfg.paused?'▶ Continuar':'Ⅱ Pausar';
 $('facing').textContent='Dirección: '+cfg.facing;
 $('zoom').textContent='Zoom: '+cfg.zoom.toFixed(1)+'×';
 $('anchors').textContent=cfg.showAnchors?'Ocultar anclajes':'Mostrar anclajes';
};
function paintBackdrop(scene,map){
 const g=scene.add.graphics().setDepth(-100);
 g.fillGradientStyle(0x234a56,0x234a56,0x3b655b,0x3b655b,1,1,1,1);
 g.fillRect(0,0,W,H);
 for(let i=0;i<160;i++){
  const x=(i*127+29)%W,y=(i*223+79)%H;
  g.fillStyle(i%3===0?0x8bc1a0:0xa5b99b,.085);
  g.fillEllipse(x,y,22+i%7*6,3+i%5);
 }
 // La ruta oficial procede SOLO de maps.v5.json; fondo simplificado para vitrina.
 if(map&&Array.isArray(map.path)&&map.path.length>1){
  for(const [w,color,a] of [[113,0x2c4f55,.5],[100,0x9a9272,.51],[81,0xbda986,.50]]){
   g.lineStyle(w,color,a);g.beginPath();g.moveTo(map.path[0][0],map.path[0][1]);
   for(let j=1;j<map.path.length;j++)g.lineTo(map.path[j][0],map.path[j][1]);
   g.strokePath();
  }
 }
 const veil=scene.add.graphics().setDepth(4);
 veil.fillStyle(0x081e2b,.47).fillRoundedRect(45,148,1190,478,36);
 veil.lineStyle(3,0xb9a06b,.75).strokeRoundedRect(45,148,1190,478,36);
 for(let i=0;i<4;i++){
  const x=slots[i].x;
  veil.fillStyle(0x0a2631,.63).fillRoundedRect(x-125,194,250,392,19);
  veil.lineStyle(1,0x8caca2,.33).strokeRoundedRect(x-125,194,250,392,19);
  veil.fillStyle(0x83caba,.07).fillEllipse(x,491,178,35);
  veil.lineStyle(1,0xe3c48a,.28).strokeEllipse(x,498,185,41);
 }
}
class ActorGallery extends Phaser.Scene{
 constructor(){super('ActorsVisualP01');this.elapsed=0;this.cast=[];this.bundles=null;this.lastFrame=new Map();}
 create(){
  this.bundles=registerActorAtlases(this);
  paintBackdrop(this,window.__SEMANTROPIC_ACTOR_MAP01);
  const guide=this.add.graphics().setDepth(2200);
  this.guide=guide;
  for(let i=0;i<CAST.length;i++){
   const a=CAST[i],pos=slots[i],scale=a.heightWorld/(a.kind==='hound'?114:171);
   const shadow=this.add.ellipse(pos.x,pos.y+1,a.kind==='hound'?110:70,a.kind==='hound'?21:19,
    a.faction==='enemy'?0x11181f:0x0a3436,.58).setDepth(pos.y-4);
   const sprite=this.add.image(pos.x,pos.y,a.atlasKey,'idle-0')
     .setOrigin(a.footAnchor.x,a.footAnchor.y).setScale(scale).setDepth(pos.y+2);
   const index=this.add.text(pos.x,227,'0'+(i+1),{
     color:'#e7c98d',fontSize:'26px',fontFamily:'system-ui',fontStyle:'bold'
   }).setOrigin(.5).setDepth(1500);
   const label=this.add.text(pos.x,279,a.label,{
     color:'#fff0d0',fontSize:'20px',fontFamily:'system-ui',fontStyle:'bold',
     align:'center',wordWrap:{width:226}
   }).setOrigin(.5).setDepth(1500);
   const note=this.add.text(pos.x,323,a.faction==='enemy'?'ENEMIGO · '+a.role.toUpperCase():'ALIADO · '+a.role.toUpperCase(),{
     color:a.faction==='enemy'?'#ffc0a6':'#96f4e4',fontSize:'13px',fontFamily:'system-ui'
   }).setOrigin(.5).setDepth(1500);
   const foot=this.add.text(pos.x,pos.y+46,
     'Pies 0.50 / 0.92\nEscala provisional', {
      color:'#c2d5cb',fontSize:'13px',fontFamily:'system-ui',align:'center',lineSpacing:5
     }).setOrigin(.5).setDepth(1500);
   this.cast.push({actor:a,pos,sprite,shadow,scale});
  }
  this.timerText=this.add.text(W/2,672,'', {fontFamily:'system-ui',fontSize:'16px',color:'#e6ddc9'}).setOrigin(.5).setDepth(1700);
  this.add.text(W/2,110,'ESTUDIO DE ACTORES · P-01',{
   fontFamily:'system-ui',fontSize:'31px',fontStyle:'bold',color:'#fff0cf'
  }).setOrigin(.5).setDepth(1700);
  this.add.text(W/2,136,'Atlas originales · estados visuales · mismo mundo 1280 × 768 que M01',{
   fontFamily:'system-ui',fontSize:'14px',color:'#bed9d2'
  }).setOrigin(.5).setDepth(1700);
  $('status').textContent='4 actores · 128 frames · 4 atlases creados (Canvas 2D → Phaser) · SIN COMBATE REAL';
  $('runtime').textContent='Phaser '+Phaser.VERSION+' · '+(this.game.renderer?.gl?'Render WebGL disponible':'Render no WebGL')+' · ejecución local no certifica dispositivo físico';
  $('exportActor').disabled=false;
  $('exportAll').disabled=false;
  window.__SEMANTROPIC_P_GALLERY={scene:this,cast:CAST,animationDefs:ANIMATIONS,bundles:this.bundles,readonly:true};
  this.drawAnchors();
 }
 drawAnchors(){
  if(!this.guide)return;const g=this.guide;g.clear();
  if(!cfg.showAnchors)return;
  for(const {pos,actor} of this.cast){
   g.lineStyle(2,0x8cfff4,1).strokeCircle(pos.x,pos.y,5);
   g.lineBetween(pos.x-17,pos.y,pos.x+17,pos.y);
   g.lineBetween(pos.x,pos.y-17,pos.x,pos.y+17);
   g.lineStyle(1,0xeac38b,.76).strokeEllipse(pos.x,pos.y+1,actor.kind==='hound'?110:70,21);
  }
 }
 update(_time,delta){
  if(!cfg.paused)this.elapsed+=Math.min(.12,delta/1000)*cfg.speed;
  const def=ANIMATIONS[cfg.state];const current=this.elapsed*def.fps;
  const f=def.loop?Math.floor(current)%def.frames:Math.min(def.frames-1,Math.floor(current));
  this.timerText.setText('Estado: '+cfg.state+' · Frame '+(f+1)+' / '+def.frames+
   ' · '+def.fps+' fps · '+(cfg.paused?'PAUSADO':'VITRINA, SIN DAÑO'));
  for(const c of this.cast){
   const frameName=cfg.state+'-'+f;
   if(c.sprite.frame.name!==frameName)c.sprite.setFrame(frameName);
   c.sprite.setFlipX(cfg.facing==='W');
   c.sprite.setScale(c.scale*cfg.zoom);
  }
 }
}
function downloadCanvas(canvas,filename){
 const link=document.createElement('a');
 link.download=filename;link.href=canvas.toDataURL('image/png');
 document.body.appendChild(link);link.click();link.remove();
}
function binds(){
 for(const b of document.querySelectorAll('[data-state]'))b.addEventListener('click',()=>{
  cfg.state=b.dataset.state;window.__SEMANTROPIC_P_GALLERY?.scene&&(window.__SEMANTROPIC_P_GALLERY.scene.elapsed=0);ui();
 });
 $('facing').addEventListener('click',()=>{cfg.facing=cfg.facing==='E'?'W':'E';ui();});
 $('pause').addEventListener('click',()=>{cfg.paused=!cfg.paused;ui();});
 $('anchors').addEventListener('click',()=>{cfg.showAnchors=!cfg.showAnchors;window.__SEMANTROPIC_P_GALLERY?.scene?.drawAnchors();ui();});
 $('zoom').addEventListener('click',()=>{cfg.zoom=cfg.zoom===1?1.45:1;ui();});
 $('exportActor').addEventListener('click',()=>{
  const id=$('actorSelect').value,b=window.__SEMANTROPIC_P_GALLERY?.bundles.get(id);
  if(!b)return;downloadCanvas(b.canvas,'semantropic-p01-'+id+'-atlas.png');
 });
 $('exportAll').addEventListener('click',()=>{
  const b=window.__SEMANTROPIC_P_GALLERY?.bundles;
  if(!b)return;
  for(const [id,entry] of b)downloadCanvas(entry.canvas,'semantropic-p01-'+id+'-atlas.png');
 });
 document.addEventListener('visibilitychange',()=>{
  if(document.hidden){cfg.paused=true;ui();}
 });
 ui();
}
(async()=>{
 try{
  if(!window.Phaser||Phaser.VERSION!=='4.2.1')throw Error('Requiere el Phaser 4.2.1 empaquetado en /dependencias/phaser.min.js');
  const res=await fetch('../../data/maps.v5.json');
  if(!res.ok)throw Error('No se pudo consultar el mapa oficial para contexto visual.');
  const maps=await res.json();
  const map=Array.isArray(maps)?maps[0]:null;
  if(!map||map.id!==1||map.path.length!==133)throw Error('Fuente M01 inesperada; no dibujar camino inventado.');
  window.__SEMANTROPIC_ACTOR_MAP01=map;
  binds();
  new Phaser.Game({
   type:Phaser.AUTO,parent:'stage',width:W,height:H,
   backgroundColor:'#152e36',transparent:false,
   scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:W,height:H},
   scene:[ActorGallery],
   audio:{noAudio:true}
  });
 }catch(err){
  $('status').textContent='ERROR de vitrina: '+err.message;
  $('status').classList.add('error');
  console.error('Equipo P gallery startup failed',err);
 }
})();
