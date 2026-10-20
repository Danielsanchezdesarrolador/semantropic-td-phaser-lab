/**
 * T06 independent Phaser 4.2.1 art/VFX showroom — NO gameplay.
 * Draws T05 original and T06 official source SVGs at same camera/socket/scale.
 * SniperShotPresenter receives explicit SYNTHETIC visual envelopes.
 */
import {TOWER_ART_V2,validateTowerArtV2,projectSourceAnchor,getTowerVisualLayers,getSniperFireVisualAnchor} from './catalog.mjs';
import {SniperShotPresenter} from './sniper-vfx.mjs';
const W=1280,H=768,$=id=>document.getElementById(id);
const mx=[325,785],footY=536,tryTarget={x:1046,y:372};
const state={level:1,variant:'A',zoom:1,worldHeight:0,grass:'light',marks:true,paused:false,serial:0,scene:null};
function report(v){$('status').textContent=v;}
const smeta=level=>TOWER_ART_V2.find(m=>m.family==='sniper'&&m.level===level);
const colors={light:[0xa6c88d,0x628d72],dark:[0x719c87,0x335e62]};
class Showroom extends Phaser.Scene{
 constructor(){super('T06Sniper');this.errors=[];this.ops=[];this.visible=[];this.elapsed=0;}
 preload(){
  this.load.on('loaderror',file=>{this.errors.push(file.key);report('SVG faltante '+file.key);});
  [1,2].forEach(level=>{
   const m=smeta(level);
   this.load.svg('old'+level,m.t05SnapshotUrl,{width:360,height:420});
   this.load.svg('new'+level,m.url,{width:360,height:420});
   for(const k of ['shadowFoot','backStructure','frontRail']){
    this.load.svg(k+level,m.layerAssets[k],{width:360,height:420});
   }
  });
 }
 create(){
  if(this.errors.length)throw Error('T06 missing assets '+this.errors.join(','));
  this.ground=this.add.graphics().setDepth(-100);this.padG=this.add.graphics().setDepth(-10);
  this.drawGround();
  this.add.text(W/2,102,'T-06 · FRANCOTIRADOR PREMIUM / ANTES Y DESPUÉS',{fontFamily:'Georgia,serif',fontSize:'26px',color:'#fff0cb',fontStyle:'bold'}).setOrigin(.5);
  this.add.text(W/2,131,'BASELINE T05       →        VIGÍA T06 CON CAPAS REALES + VFX A/B',{fontFamily:'system-ui',fontSize:'15px',color:'#d0e7dd'}).setOrigin(.5);
  this.add.text(mx[0],192,'T05 · ORIGINAL',{fontFamily:'system-ui',fontSize:'23px',color:'#ffddaa',fontStyle:'bold'}).setOrigin(.5);
  this.add.text(mx[1],192,'T06 · REDISEÑO',{fontFamily:'system-ui',fontSize:'23px',color:'#c7f7e9',fontStyle:'bold'}).setOrigin(.5);
  this.add.text(mx[0],230,'MISMO PAD 110,24 wu · MISMO ZOOM',{fontFamily:'system-ui',fontSize:'14px',color:'#e1e6d8'}).setOrigin(.5);
  this.add.text(mx[1],230,'SOMBRA → ESTRUCTURA → SLOT P → BARANDA',{fontFamily:'system-ui',fontSize:'14px',color:'#d4e5df'}).setOrigin(.5);
  this.old=this.add.image(mx[0],footY,'old1').setOrigin(.5,.93).setDepth(footY+4);
  this.shadow=this.add.image(mx[1],footY,'shadowFoot1').setOrigin(.5,.93).setDepth(footY-8);
  this.back=this.add.image(mx[1],footY,'backStructure1').setOrigin(.5,.93).setDepth(footY+3);
  this.rail=this.add.image(mx[1],footY,'frontRail1').setOrigin(.5,.93).setDepth(footY+20);
  this.marker=this.add.graphics().setDepth(footY+12);
  this.targetMark=this.add.graphics().setDepth(footY-6);
  this.targetMark.lineStyle(3,0xb7f5dc,.75).strokeCircle(tryTarget.x,tryTarget.y,12);
  this.targetMark.lineStyle(1.5,0xf6dca5,.67).beginPath().moveTo(tryTarget.x-22,tryTarget.y).lineTo(tryTarget.x+22,tryTarget.y).moveTo(tryTarget.x,tryTarget.y-22).lineTo(tryTarget.x,tryTarget.y+22).strokePath();
  this.add.text(tryTarget.x,tryTarget.y+33,'OBJETIVO GEOMÉTRICO · DEMO',{fontFamily:'system-ui',fontSize:'11px',color:'#f2e8c6'}).setOrigin(.5);
  this.add.text(W/2,639,'Sin actores P, daño, cadencia, recompensas ni oleadas · Eventos SINTÉTICOS para ensayo visual',{fontFamily:'system-ui',fontSize:'13px',color:'#efe0b8'}).setOrigin(.5);
  const gl=this.game.renderer?.gl;
  if(!gl||typeof WebGL2RenderingContext==='undefined'||!(gl instanceof WebGL2RenderingContext))throw Error('No renderer WebGL2');
  this.onState=stateEvent=>{if(stateEvent.state)report('FASE '+stateEvent.state+' · T06 '+state.variant+' · Evento '+stateEvent.eventId+' · DEMO');};
  this.presenter=new SniperShotPresenter(this,{variant:state.variant,depth:footY+13,onVisualState:this.onState});
  this.events.once('shutdown',()=>this.presenter.destroy());
  state.scene=this;this.render();
  window.__SEMANTROPIC_T06={scene:this,gameplay:false,renderer:'Phaser-WebGL2',version:'T06-C1D2'};
  report('Galería Phaser '+Phaser.VERSION+' WebGL2 activa, render SÓLO VISUAL.');
 }
 scaleFor(){const m=smeta(state.level);return(state.worldHeight?state.worldHeight/420:m.worldScaleProposal)*state.zoom;}
 drawGround(){
  const cc=colors[state.grass];this.ground.clear().fillGradientStyle(cc[0],cc[0],cc[1],cc[1],1).fillRect(0,0,W,H);
  this.ground.lineStyle(3,0xead3a1,.38).strokeRoundedRect(18,148,1244,544,16);
  for(let i=0;i<34;i++){let x=30+(i*107)%1210,y=441+(i*47)%214;this.ground.lineStyle(2,0xe8ebaa,.13).beginPath().moveTo(x-3,y).lineTo(x+9,y-4).strokePath();}
 }
 render(){
  const m=smeta(state.level),s=this.scaleFor();
  this.old.setTexture('old'+state.level);this.shadow.setTexture('shadowFoot'+state.level);
  this.back.setTexture('backStructure'+state.level);this.rail.setTexture('frontRail'+state.level);
  for(const image of [this.old,this.shadow,this.back,this.rail])image.setOrigin(.5,.93).setScale(s);
  this.padG.clear();for(const x of mx){this.padG.fillStyle(0x2f5562,.35).fillEllipse(x,footY+7,121,29);this.padG.fillStyle(0x859b8b,.85).fillEllipse(x,footY,110.24,33);this.padG.lineStyle(3,0xe7cfa4,.79).strokeEllipse(x,footY,110.24,33);}
  this.marker.clear();
  if(state.marks){
   for(const [key,color] of [['operatorAnchorLocal',0x66faf3],['fireEffectOriginLocal',0xf8d989],['buildFoundationLocal',0xcc9fb0]]){
    const pos=projectSourceAnchor(this.back,m,key);
    if(!pos)continue;
    this.marker.lineStyle(2.2,color,.9).beginPath().moveTo(pos.x-8,pos.y).lineTo(pos.x+8,pos.y).moveTo(pos.x,pos.y-8).lineTo(pos.x,pos.y+8).strokePath();
    this.marker.fillStyle(color,.9).fillCircle(pos.x,pos.y,3);
   }
  }
  $('details').textContent=m.title+' · nivel '+m.level+' · escala '+s.toFixed(3)+' · foot(.5,.93) · VFX '+state.variant;
 }
 setLevel(level){this.presenter.clear();state.level=level;this.render();}
 variant(variant){state.variant=variant;this.presenter.variant=variant;report('Alternativa VFX '+variant+' seleccionada · no cambia el daño ni el arma canónica.');}
 event(name,variant=state.variant){
  if(state.paused)return;
  const m=smeta(state.level),entityId='demo-tower-'+state.level,targetId='demo-target';
  const from=getSniperFireVisualAnchor(this.back,m),to={...tryTarget};
  const eventId='T06-demo-'+(++state.serial);
  const e={contractVersion:'combat-events-v1',sessionId:'showroom',eventId,tick:state.serial,type:name,entityId,targetId,worldPosition:{x:mx[1],y:footY},
   payload:{muzzleWorld:from,targetWorld:to,visualVariant:variant}};
  if(!this.presenter.accept(e))report('Evento visual rechazado, sin alterar el juego: '+name);
  return e;
 }
 shot(){
  this.event('attack_windup');
  // Scene-time scheduling only. Both event IDs are unique, no simulated cooldown.
  this.time.delayedCall(160,()=>{if(!state.paused)this.event('attack_fire');});
 }
 rapid(){this.shot();this.time.delayedCall(70,()=>this.shot());}
 vanish(){
  this.event('attack_fire');
  this.time.delayedCall(65,()=>{this.presenter.accept({type:'despawn',entityId:'demo-target'});report('Objetivo demo desapareció; efectos visuales de ese target cancelados.');});
 }
 clearFX(){this.presenter.clear();report('VFX limpiados; sin efectos fantasma.');}
 shutdownDemo(){this.presenter.destroy();report('Presenter destruido y desconectado; recarga para nueva sesión.');}
}
try{
 validateTowerArtV2();
 if(!window.Phaser||Phaser.VERSION!=='4.2.1')throw Error('Se requiere Phaser 4.2.1 local');
 const test=document.createElement('canvas').getContext('webgl2');
 if(!test||typeof WebGL2RenderingContext==='undefined'||!(test instanceof WebGL2RenderingContext))throw Error('WebGL2 no disponible');
 new Phaser.Game({type:Phaser.WEBGL,width:W,height:H,parent:'stage',
  scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:W,height:H},audio:{noAudio:true},
  backgroundColor:'#345f5c',scene:[Showroom]});
 document.querySelectorAll('[data-level]').forEach(b=>b.addEventListener('click',()=>state.scene?.setLevel(Number(b.dataset.level))));
 document.querySelectorAll('[data-height]').forEach(b=>b.addEventListener('click',()=>{state.worldHeight=Number(b.dataset.height);state.scene?.render();}));
 $('actual').addEventListener('click',()=>{state.worldHeight=0;state.scene?.render();});
 $('zoom').addEventListener('click',()=>{state.zoom=state.zoom===1?1.3:1;state.scene?.render();$('zoom').textContent=state.zoom===1?'Zoom 1.30×':'Zoom 1.00×';});
 $('style').addEventListener('click',()=>{state.variant=state.variant==='A'?'B':'A';state.scene?.variant(state.variant);$('style').textContent='VFX '+state.variant;});
 $('grass').addEventListener('click',()=>{state.grass=state.grass==='light'?'dark':'light';state.scene?.drawGround();});
 $('marks').addEventListener('click',()=>{state.marks=!state.marks;state.scene?.render();});
 $('shot').addEventListener('click',()=>state.scene?.shot());
 $('rapid').addEventListener('click',()=>state.scene?.rapid());
 $('vanish').addEventListener('click',()=>state.scene?.vanish());
 $('clear').addEventListener('click',()=>state.scene?.clearFX());
 $('pause').addEventListener('click',()=>{
  const s=state.scene;if(!s)return;state.paused=!state.paused;
  state.paused?s.scene.pause():s.scene.resume();
  $('pause').textContent=state.paused?'▶ Seguir':'Ⅱ Pausar';
 });
}catch(e){report('BLOQUEANTE T06: '+e.message);console.error(e);}
