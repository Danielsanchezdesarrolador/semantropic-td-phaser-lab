/**
 * SEMANTROPIC TD · T05 Deep Architecture Review · Phaser 4.2.1
 * THIS IS AN ISOLATED VISUAL STUDY; not the M01 playable map or combat.
 * T04 vs A vs B: identical source pixels 360×420, pad, footY, camera and scale.
 * A renders truly separate backStructure, shadowFoot and frontRail layers.
 * Operator marker is a GEOMETRIC POSITION CROSS only; no P actor asset is created.
 */
import {TOWER_ART_V2,validateTowerArtV2,projectSourceAnchor,getTowerVisualLayers} from './catalog.mjs';
import {TowerVfxShowcase} from './fx.mjs';
const WIDTH=1280,HEIGHT=768,FOOT_Y=514,POS=[218,640,1062],TITLES=['T04 · ANTES','T05 · A (RECOMENDADA)','T05 · B (ALTERNATIVA)'];
const $=id=>document.getElementById(id);
const state={index:0,zoom:1,worldHeight:0,background:'light',readability:'painting',operator:true,anchors:false,paused:false,serial:0,scene:null};
const label=s=>{const el=$('status');if(el)el.textContent=s;};
const tones={light:{grass:0xa8c889,deep:0x6a9c77},dark:{grass:0x6c9a82,deep:0x376974}};
class DeepTowers extends Phaser.Scene {
 constructor(){super('T05DeepTowers');this.slots=[];this.dots=[];this.fx=null;}
 preload(){
  this.missing=[];
  this.load.on('loaderror',f=>{this.missing.push(f.key);label('SVG no cargado '+f.key);});
  TOWER_ART_V2.forEach((m,i)=>{
   this.load.svg('old-'+i,m.t04SnapshotUrl,{width:360,height:420});
   this.load.svg('new-'+i,m.url,{width:360,height:420});
   this.load.svg('alt-'+i,m.t05AlternativeBUrl,{width:360,height:420});
   this.load.svg('shadow-'+i,m.layerAssets.shadowFoot,{width:360,height:420});
   this.load.svg('back-'+i,m.layerAssets.backStructure,{width:360,height:420});
   this.load.svg('rail-'+i,m.layerAssets.frontRail,{width:360,height:420});
  });
 }
 create(){
  if(this.missing.length)throw Error('T05 missing assets: '+this.missing.join(','));
  state.scene=this;this.fx=new TowerVfxShowcase(this);
  // Ambient life: a single slowly breathing marker light; NEVER oscillate the building/socket.
  this.lampPulse=this.add.circle(POS[1],FOOT_Y-80,3,0xe6f8da,.42).setDepth(FOOT_Y+35);
  this.tweens.add({targets:this.lampPulse,alpha:.12,scaleX:1.25,scaleY:.85,duration:1350,ease:'Sine.InOut',yoyo:true,repeat:-1});
  this.grass=this.add.graphics().setDepth(-100);
  this.pads=this.add.graphics().setDepth(-5);
  this.drawGround();
  this.add.text(WIDTH/2,102,'T05 · TRES ARQUITECTURAS, MISMO SOCKET Y CÁMARA',{fontFamily:'Georgia,serif',fontStyle:'bold',fontSize:'22px',color:'#ffedbb'}).setOrigin(.5);
  this.add.text(WIDTH/2,129,'T04 ANTES  /  T05 A CUARTEL–VIGÍA  /  T05 B REFUGIO–OBSERVATORIO',{fontFamily:'system-ui',fontSize:'14px',color:'#d7ead8'}).setOrigin(.5);
  POS.forEach((x,i)=>{
   this.add.text(x,212,TITLES[i],{fontFamily:'system-ui',fontSize:'20px',fontStyle:'bold',color:'#fff3d3'}).setOrigin(.5);
   this.add.text(x,240,'PAD M03 PROXY · 110.24 WU',{fontFamily:'system-ui',fontSize:'12px',color:'#dde8d8'}).setOrigin(.5);
   this.add.text(x,600,i===0?'SOURCE T04':i===1?'T05: CAPAS REALES':'T05: VOLUMEN ALTERNATIVO',{fontFamily:'system-ui',fontSize:'14px',fontStyle:'bold',color:'#f7ddaa'}).setOrigin(.5);
  });
  for(let i=0;i<3;i++){
   const x=POS[i],image=this.add.image(x,FOOT_Y,i===0?'old-0':i===1?'new-0':'alt-0')
     .setOrigin(.5,.93).setDepth(FOOT_Y+15);
   const shadow=this.add.image(x,FOOT_Y,'shadow-0').setOrigin(.5,.93).setDepth(10);
   const back=this.add.image(x,FOOT_Y,'back-0').setOrigin(.5,.93).setDepth(FOOT_Y+10);
   const rail=this.add.image(x,FOOT_Y,'rail-0').setOrigin(.5,.93).setDepth(FOOT_Y+32);
   const marker=this.add.graphics().setDepth(FOOT_Y+20);
   const badge=this.add.text(x,630,'',{fontFamily:'system-ui',fontSize:'12px',color:'#dde9d2'}).setOrigin(.5);
   this.slots.push({x,image,shadow,back,rail,marker,badge});
  }
  const gl=this.game.renderer?.gl;
  if(typeof WebGL2RenderingContext==='undefined'||!(gl instanceof WebGL2RenderingContext))throw Error('Phaser renderer is not verified WebGL2');
  this.events.once('shutdown',()=>{this.fx?.destroy();this.cleanDots();});
  this.input.on('pointerdown',p=>{
   if(state.paused)return;
   if(Math.abs(p.x-POS[1])<135 && p.y>290&&p.y<560)this.demo('attack');
  });
  this.draw();
  window.__SEMANTROPIC_T05={scene:this,source:'T',gameplayImplemented:false,version:'T05-C1D'};
  label('Phaser '+Phaser.VERSION+' / WebGL2 · ESTUDIO visual solamente; no actores P ni reglas core.');
 }
 current(){return TOWER_ART_V2[state.index];}
 artScale(){
  return (state.worldHeight?state.worldHeight/420:this.current().worldScaleProposal)*state.zoom;
 }
 drawGround(){
  const c=tones[state.background];this.grass.clear().fillGradientStyle(c.grass,c.grass,c.deep,c.deep,1).fillRect(0,0,WIDTH,HEIGHT);
  this.grass.lineStyle(2,0xf9dba5,.27).strokeRoundedRect(16,155,1248,523,16);
  for(let i=0;i<28;i++){
   const x=38+(i*83)%1220,y=440+(i*29)%200;
   this.grass.lineStyle(1.6,0xf2dfac,.09).beginPath().moveTo(x-6,y).lineTo(x+4,y-3).strokePath();
  }
 }
 cleanDots(){for(const x of this.dots)x.destroy();this.dots.length=0;}
 draw(){
  const m=this.current(),scale=this.artScale();
  this.pads.clear();
  this.cleanDots();
  for(let i=0;i<3;i++){
   const t=this.slots[i],x=t.x;
   const width=110.24;
   this.pads.fillStyle(0x21414b,.25).fillEllipse(x,FOOT_Y+10,width+9,30);
   this.pads.fillStyle(0x9ab6a2,.85).fillEllipse(x,FOOT_Y,width,34);
   this.pads.lineStyle(2,0xf5d7a0,.75).strokeEllipse(x,FOOT_Y,width,34);
   t.image.setTexture((i===0?'old-':i===1?'new-':'alt-')+state.index);
   t.shadow.setTexture('shadow-'+state.index);
   t.back.setTexture('back-'+state.index);
   t.rail.setTexture('rail-'+state.index);
   for(const obj of [t.image,t.shadow,t.back,t.rail])obj.setScale(scale).setOrigin(.5,.93);
   const isLayers=i===1;
   t.image.setVisible(!isLayers);
   t.shadow.setVisible(isLayers);
   t.back.setVisible(isLayers);
   t.rail.setVisible(isLayers);
   t.marker.clear();
   if(isLayers&&state.operator){
    const anchor=projectSourceAnchor(t.back,m,m.family==='sniper'?'operatorAnchorLocal':'spawnExitLocal');
    // Draw crosshair as placement guide, NOT new actor body/atlas.
    if(anchor){
     t.marker.lineStyle(2,0x82fff1,.96).beginPath().moveTo(anchor.x-9,anchor.y).lineTo(anchor.x+9,anchor.y).moveTo(anchor.x,anchor.y-12).lineTo(anchor.x,anchor.y+9).strokePath();
     t.marker.fillStyle(0xf8e1a7,.92).fillCircle(anchor.x,anchor.y,2.5);
    }
   }
   const sil=state.readability==='silhouette';
   for(const obj of [t.image,t.shadow,t.back,t.rail]){if(sil)obj.setTintFill(0x1b3340);else obj.clearTint();}
   t.badge.setText('ALTURA: '+(scale*420).toFixed(0)+' world px'+(sil?'  · SILUETA':''));
   if(isLayers&&state.anchors){
    for(const [key,color] of [['buildFoundationLocal',0xf2dd95],['muzzleLocal',0xffbd7e],['operatorAnchorLocal',0x85eaf2],['spawnExitLocal',0x8bee8a]]){
     const at=projectSourceAnchor(t.back,m,key);
     if(!at)continue;
     this.dots.push(this.add.circle(at.x,at.y,3.5,color).setStrokeStyle(1,0x253d47).setDepth(FOOT_Y+60));
    }
   }
  }
  const lit=projectSourceAnchor(this.slots[1].back,m,m.family==='sniper'?'muzzleLocal':'spawnExitLocal');
  if(lit)this.lampPulse.setPosition(lit.x,lit.y).setVisible(state.readability!=='silhouette');
  $('towerTitle').textContent=m.title.toUpperCase()+' · A/B · nivel '+m.level;
 }
 choose(index){state.index=index;this.fx.clear();this.draw();}
 demo(kind,method='A'){
  if(state.paused)return;
  const t=this.slots[1],meta=this.current();
  const from=projectSourceAnchor(t.back,meta,meta.family==='sniper'?'muzzleLocal':'spawnExitLocal');
  const target={x:Math.min(WIDTH-30,t.x+106),y:FOOT_Y-145};
  if(kind==='upgrade')this.fx.dispatch({eventId:'T05-'+(++state.serial),type:'upgrade_visual',source:{x:t.x,y:FOOT_Y-34},method,level:meta.level});
  else this.fx.dispatch({eventId:'T05-'+(++state.serial),type:meta.family==='sniper'?'attack_visual':'deploy_visual',source:from,target,level:meta.level,targetId:'DEMO-ONLY'});
  label(kind==='upgrade'?'Obra '+method+' · ESTUDIO sin subir nivel':'VFX de '+meta.title+' · visual, no damage, spawn ni cooldown.');
 }
 reset(){this.fx.clear();label('Efectos cancelados y limpiados; escena de revisión sin gameplay.');}
}
try{
 validateTowerArtV2();
 if(!window.Phaser||Phaser.VERSION!=='4.2.1')throw Error('Phaser 4.2.1 local no disponible');
 const gl=document.createElement('canvas').getContext('webgl2');
 if(!gl||typeof WebGL2RenderingContext==='undefined'||!(gl instanceof WebGL2RenderingContext))throw Error('WebGL2 no disponible');
 const game=new Phaser.Game({type:Phaser.WEBGL,width:WIDTH,height:HEIGHT,parent:'stage',backgroundColor:'#315b58',
  scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:WIDTH,height:HEIGHT},audio:{noAudio:true},scene:[DeepTowers]});
 document.querySelectorAll('[data-tower]').forEach(el=>el.addEventListener('click',()=>state.scene?.choose(Number(el.dataset.tower))));
 document.querySelectorAll('[data-height]').forEach(el=>el.addEventListener('click',()=>{state.worldHeight=Number(el.dataset.height);state.scene?.draw();}));
 $('auto').addEventListener('click',()=>{state.worldHeight=0;state.scene?.draw();});
 $('zoom').addEventListener('click',()=>{state.zoom=state.zoom===1?1.35:1;state.scene?.draw();$('zoom').textContent=state.zoom===1?'Zoom +35%':'Zoom normal';});
 $('silhouette').addEventListener('click',()=>{state.readability=state.readability==='painting'?'silhouette':'painting';state.scene?.draw();$('silhouette').textContent=state.readability==='painting'?'Ver silueta':'Ver ilustración';});
 $('grass').addEventListener('click',()=>{state.background=state.background==='light'?'dark':'light';state.scene?.drawGround();});
 $('operator').addEventListener('click',()=>{state.operator=!state.operator;state.scene?.draw();$('operator').textContent=state.operator?'Ocultar marcador P':'Mostrar marcador P';});
 $('anchors').addEventListener('click',()=>{state.anchors=!state.anchors;state.scene?.draw();});
 $('fire').addEventListener('click',()=>state.scene?.demo('attack'));
 $('upgradeA').addEventListener('click',()=>state.scene?.demo('upgrade','A'));
 $('upgradeB').addEventListener('click',()=>state.scene?.demo('upgrade','B'));
 $('pause').addEventListener('click',()=>{if(!state.scene)return;state.paused=!state.paused;
   state.paused?state.scene.scene.pause():state.scene.scene.resume();$('pause').textContent=state.paused?'▶ Continuar':'Ⅱ Pausa';
 });
 $('reset').addEventListener('click',()=>state.scene?.reset());
}catch(e){label('BLOQUEANTE T05: '+e.message);console.error(e);}
