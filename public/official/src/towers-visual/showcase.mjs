// SEMANTROPIC TD Equipo T — escenario visual independiente, NO combate.
import {TOWER_ART,validateTowerArt} from './catalog.mjs';
import {TowerVfxShowcase} from './fx.mjs';
const W=1280,H=768,footY=546,scale=.72,xs=[164,480,796,1112];
const $=x=>document.getElementById(x);
let scene=null,paused=false,serial=0;
const status=s=>$('status').textContent=s;
class Gallery extends Phaser.Scene{
 constructor(){super('TowerGalleryT');this.entries=[];this.vfx=null;this.assetFailed=false;}
 preload(){
  this.load.on('loaderror',file=>{this.assetFailed=true;status('ERROR SVG: '+file.key);});
  for(const t of TOWER_ART)this.load.svg(t.assetId,t.url,{width:360,height:420});
 }
 create(){
  if(this.assetFailed)throw Error('Faltan SVG, vitrina bloqueada.');
  scene=this;this.vfx=new TowerVfxShowcase(this);
  const g=this.add.graphics().setDepth(-100);
  g.fillGradientStyle(0x17363e,0x17363e,0x32564d,0x32564d,1).fillRect(0,0,W,H);
  g.lineStyle(3,0xd2b979,.55).strokeRoundedRect(24,112,1232,547,14);
  for(let n=0;n<18;n++){
   g.lineStyle(1,0xc2d2bd,.065).beginPath().moveTo(n*72,170).lineTo(n*72,650).strokePath();
  }
  this.add.text(640,144,'TORRES DEL AMANECER · ESTUDIO DE ARTE',{fontFamily:'system-ui',fontSize:'21px',fontStyle:'bold',color:'#f4dfad'}).setOrigin(.5);
  this.add.text(640,177,'SOLO PRESENTACIÓN — sin soldados, HP, disparos efectivos ni economía',{fontFamily:'system-ui',fontSize:'15px',color:'#add4cb'}).setOrigin(.5);
  for(let i=0;i<TOWER_ART.length;i++){
   const meta=TOWER_ART[i],x=xs[i],y=footY;
   this.add.ellipse(x,y+7,185,61,0x152d38,.89).setStrokeStyle(4,0xd7bf83,.93).setDepth(120);
   this.add.ellipse(x,y,170,47,0x56736c,.52).setStrokeStyle(1,0xe4d395).setDepth(121);
   const sprite=this.add.image(x,y,meta.assetId).setOrigin(meta.footAnchor.x,meta.footAnchor.y).setScale(scale).setDepth(850);
   this.add.text(x,596,meta.title.toUpperCase(),{fontFamily:'system-ui',fontSize:'16px',fontStyle:'bold',color:'#f5e4b8'}).setOrigin(.5);
   this.add.text(x,620,(meta.family==='infantry'?'INFANTERÍA':'FRANCOTIRADORES')+' · '+(meta.level===1?'I':'II'),{fontFamily:'system-ui',fontSize:'13px',color:'#abd6c8'}).setOrigin(.5);
   const target={x:Math.min(W-35,x+87),y:235};
   if(meta.type==='tracer'){
    this.add.circle(target.x,target.y,14,0x92dad2,.18).setStrokeStyle(3,0xe5d390,.94);
    this.add.line(target.x,target.y,0,-20,0,20,0xf1dab2,.65);
   }
   this.entries.push({meta,x,y,sprite,target});
  }
  this.input.on('pointerdown',p=>{
   if(paused)return;
   const t=this.entries.find(t=>Math.abs(p.x-t.x)<90&&Math.abs(p.y-t.y+110)<130);
   if(t)this.play(t);
  });
  const gl=this.game.renderer?.gl;
  status('Phaser '+Phaser.VERSION+' · '+(gl instanceof WebGL2RenderingContext?'WebGL2 verificado':'renderer WebGL2 pendiente')+' · 4 SVG.');
 }
 play(t){
  if(paused)return;
  const {meta,x,y,target}=t;
  const source=meta.type==='deploy'?{x,y}:{x:x+meta.muzzleLocal.x*scale,y:y+meta.muzzleLocal.y*scale};
  this.vfx.dispatch({eventId:'T-demo-'+(++serial),kind:meta.type,source,target,level:meta.level});
  this.tweens.add({targets:t.sprite,angle:meta.type==='tracer'?-1.4:1.4,duration:78,yoyo:true});
  status(meta.title+' · VFX demostrativo (no aplica daño ni genera unidades).');
 }
 shutdown(){this.vfx?.clear();}
}
try{
 validateTowerArt();
 if(!window.Phaser||Phaser.VERSION!=='4.2.1')throw Error('Phaser 4.2.1 local no disponible.');
 const check=document.createElement('canvas').getContext('webgl2');
 if(!check||!(check instanceof WebGL2RenderingContext))throw Error('WebGL2 real no disponible.');
 const engine=Phaser;
 new engine.Game({type:engine.WEBGL,parent:'stage',width:W,height:H,backgroundColor:'#14343b',antialias:true,
  scale:{mode:engine.Scale.FIT,autoCenter:engine.Scale.CENTER_BOTH,width:W,height:H},audio:{noAudio:true},scene:[Gallery]});
 document.querySelectorAll('[data-shot]').forEach(b=>b.addEventListener('click',()=>{if(scene&&!paused)scene.play(scene.entries[Number(b.dataset.shot)]);}));
 $('pause').addEventListener('click',()=>{
  if(!scene)return;paused=!paused;
  if(paused)scene.scene.pause();else scene.scene.resume();
  $('pause').textContent=paused?'▶ Reanudar':'Ⅱ Pausar';
  status(paused?'Escena en pausa':'Escena reanudada');
 });
 $('reset').addEventListener('click',()=>{
  if(!scene)return;
  if(paused){paused=false;scene.scene.resume();$('pause').textContent='Ⅱ Pausar';}
  scene.vfx.clear();status('FX limpios. Sin modificar estado de gameplay.');
 });
}catch(e){status('BLOQUEANTE DE VITRINA: '+e.message);console.error(e);}
