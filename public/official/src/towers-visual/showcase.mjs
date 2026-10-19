// Equipo T T-03. Galería visual A/B independiente. Ningún módulo del core importa esto.
import {TOWER_ART_V2,validateTowerArtV2,projectSourceAnchor} from './catalog.mjs';
import {TowerVfxShowcase} from './fx.mjs';
const W=1280,H=768,XS=[157,480,803,1124],Y=543;
const state={scene:null,mode:'premium',zoom:1,view:'detail',fxMode:'A',anchors:false,paused:false,selected:0,serial:0};
const $=id=>document.getElementById(id),say=text=>$('status').textContent=text;
const baselines=['infantry-1','infantry-2','sniper-1','sniper-2'];
function asHex(h){return '#'+h.toString(16).padStart(6,'0');}
class PremiumGallery extends Phaser.Scene{
 constructor(){super('T03PremiumGallery');this.items=[];this.vfx=null;this.markers=[];this.idle=[];this.wipe=null;}
 preload(){
  this.load.on('loaderror',f=>{this._failed=true;say('ASSET FALTANTE '+f.key);});
  TOWER_ART_V2.forEach((m,i)=>{
   this.load.svg(m.assetId,m.url,{width:360,height:420});
   this.load.svg('baseline-T03-'+i,'../../art/towers/baseline/'+baselines[i]+'.svg',{width:360,height:420});
  });
 }
 create(){
  if(this._failed)throw Error('Carga SVG incompleta: vitrina detenida.');
  state.scene=this;this.vfx=new TowerVfxShowcase(this);
  const g=this.add.graphics().setDepth(-100);
  g.fillGradientStyle(0x152f3c,0x152f3c,0x497460,0x315750,1).fillRect(0,0,W,H);
  g.fillStyle(0x9cb17e,.28).fillRect(0,515,W,165);
  g.lineStyle(3,0xe6c78c,.55).strokeRoundedRect(14,103,1252,563,16);
  for(let x=0;x<W;x+=81){
   g.lineStyle(2,0xe5e9bb,.08).beginPath().moveTo(x,490).lineTo(x+50,680).strokePath();
  }
  this.add.text(W/2,125,'T-03 · REWORK PREMIUM DE ARQUITECTURA',{fontFamily:'Georgia,serif',fontStyle:'bold',fontSize:'23px',color:'#ffdf9f'}).setOrigin(.5);
  this.add.text(W/2,157,'4 torres originales · ambientación experimental · sin gameplay · escala provisional',{fontFamily:'system-ui',fontSize:'16px',color:'#c1e1d7'}).setOrigin(.5);
  TOWER_ART_V2.forEach((meta,i)=>{
   const x=XS[i],y=Y;
   const pad=this.add.ellipse(x,y+5,162,48,0x254a4c,.95).setStrokeStyle(4,0xd5bc88,.91).setDepth(10);
   const shadow=this.add.ellipse(x,y-1,129,30,0x1a353a,.34).setDepth(11);
   const sprite=this.add.image(x,y,meta.assetId).setOrigin(meta.footAnchor.x,meta.footAnchor.y).setDepth(y+25);
   const tag=this.add.text(x,591,meta.title.toUpperCase(),{fontFamily:'system-ui',fontStyle:'bold',fontSize:'16px',color:'#f1e0b4'}).setOrigin(.5);
   const sub=this.add.text(x,617,'ESCALA PROVISIONAL  |  '+meta.family.toUpperCase()+' '+(meta.level===1?'I':'II'),{fontFamily:'system-ui',fontSize:'12px',color:'#b3d2cd'}).setOrigin(.5);
   const target={x:x+(i<2?0:76),y:248};
   if(i>1){this.add.circle(target.x,target.y,11,0xe8db94,0).setStrokeStyle(2,0xf3d99e,.62);this.add.line(target.x,target.y,0,-15,0,15,0xdcefc7,.8);}
   const outline=this.add.ellipse(x,y,158,47,0xffd988,0).setStrokeStyle(4,0xffd988,0).setDepth(15);
   this.items.push({meta,x,y,pad,shadow,sprite,tag,sub,target,outline});
   this.idle.push(this.tweens.add({targets:sprite,alpha:.968,duration:1560+i*107,yoyo:true,repeat:-1,ease:'Sine.InOut'}));
  });
  this.add.text(W/2,656,'PULSA UNA TORRE O SUS BOTONES PARA PROBAR VFX · Los actores no pertenecen al Equipo T',{fontFamily:'system-ui',fontSize:'12px',color:'#e5e2c3'}).setOrigin(.5);
  this.input.on('pointerdown',p=>{
   const match=this.items.findIndex(t=>Math.abs(p.x-t.x)<120&&Math.abs(p.y-t.y+80)<175);
   if(match>=0&&!state.paused){this.choose(match);this.play(match);}
  });
  this.events.once('shutdown',()=>{this.vfx?.destroy();this.wipe?.remove(false);});
  this.redraw();
  const gl=this.game.renderer?.gl;
  say('Phaser '+Phaser.VERSION+' / '+(gl&&typeof WebGL2RenderingContext!=='undefined'&&gl instanceof WebGL2RenderingContext?'WebGL2 observado':'WebGL2 NO certificado')+' · galería experimental T-03.');
 }
 scaleFor(meta){
  return state.view==='world'?meta.worldScaleProposal*state.zoom:.65*state.zoom;
 }
 redraw(){
  for(let i=0;i<this.items.length;i++){
   const t=this.items[i],key=state.mode==='baseline'?'baseline-T03-'+i:t.meta.assetId;
   t.sprite.setTexture(key);t.sprite.setOrigin(t.meta.footAnchor.x,t.meta.footAnchor.y).setScale(this.scaleFor(t.meta));
   const selected=i===state.selected;
   t.outline.setStrokeStyle(selected?4:0,0xffd988,selected?1:0);
   t.sub.setText((state.mode==='baseline'?'T-01 ANTES':'T-03 DESPUÉS')+' · '+t.meta.worldHeightProposal+' world h*');
  }
  this.showMarkers();
 }
 showMarkers(){
  for(const dot of this.markers)dot.destroy();this.markers.length=0;
  if(!state.anchors)return;
  for(const t of this.items){
   for(const [key,color] of [['operatorAnchorLocal',0x70e6e5],['spawnExitLocal',0x8be28f],['muzzleLocal',0xf5b975],['shadowFootAnchor',0xffa0ba]]){
    const p=projectSourceAnchor(t.sprite,t.meta,key);if(!p)continue;
    const mark=this.add.circle(p.x,p.y,6,color,.92).setStrokeStyle(2,0x122b35).setDepth(4000);
    this.markers.push(mark);
   }
  }
 }
 choose(i){state.selected=i;this.redraw();}
 play(i){
  const t=this.items[i],meta=t.meta,which=meta.attackType==='deploy'?'spawnExitLocal':'muzzleLocal';
  const source=projectSourceAnchor(t.sprite,meta,which);
  const target=meta.attackType==='tracer'?t.target:source;
  this.choose(i);
  this.vfx.dispatch({eventId:'T03-gallery-'+(++state.serial),type:meta.attackType==='deploy'?'deploy_visual':'attack_visual',source,target,level:meta.level});
  this.tweens.add({targets:t.sprite,scaleX:t.sprite.scaleX*(meta.attackType==='tracer'?.988:1.018),duration:80,yoyo:true});
  say(meta.title+': secuencia VISUAL únicamente (sin daño, unidades ni cooldown).');
 }
 upgrade(method){
  const i=state.selected,t=this.items[i];
  state.fxMode=method;
  this.vfx.dispatch({eventId:'T03-upgrade-'+(++state.serial),type:'upgrade_visual',source:{x:t.x,y:t.y-20},method});
  say('Transición de obra '+method+' (estudio A/B): no cambia nivel de gameplay.');
 }
 resetFx(){this.vfx.clear();say('Todos los VFX cancelados y limpiados; nada de core afectado.');}
}
try{
 validateTowerArtV2();
 if(!window.Phaser||Phaser.VERSION!=='4.2.1')throw Error('Se requiere Phaser 4.2.1 local.');
 const ctx=document.createElement('canvas').getContext('webgl2');
 if(!ctx||!(ctx instanceof WebGL2RenderingContext))throw Error('El navegador no expone WebGL2.');
 const engine=Phaser;
 new engine.Game({type:engine.WEBGL,width:W,height:H,parent:'stage',backgroundColor:'#183942',
  scale:{mode:engine.Scale.FIT,autoCenter:engine.Scale.CENTER_BOTH,width:W,height:H},audio:{noAudio:true},scene:[PremiumGallery]});
 document.querySelectorAll('[data-tower]').forEach(b=>b.addEventListener('click',()=>{if(!state.paused&&state.scene)state.scene.play(Number(b.dataset.tower));}));
 $('variant').addEventListener('click',()=>{state.mode=state.mode==='premium'?'baseline':'premium';$('variant').textContent=state.mode==='premium'?'Ver antes (T-01)':'Ver después (T-03)';state.scene?.redraw();});
 $('zoom').addEventListener('click',()=>{state.zoom=state.zoom===1?1.35:1;$('zoom').textContent=state.zoom===1?'Zoom 1.35×':'Zoom 1.0×';state.scene?.redraw();});
 $('view').addEventListener('click',()=>{state.view=state.view==='detail'?'world':'detail';$('view').textContent=state.view==='detail'?'Escala mundo*':'Vista detalle';state.scene?.redraw();});
 $('anchors').addEventListener('click',()=>{state.anchors=!state.anchors;state.scene?.showMarkers();$('anchors').textContent=state.anchors?'Ocultar anclajes':'Ver anclajes';});
 $('upgradeA').addEventListener('click',()=>{if(state.scene&&!state.paused)state.scene.upgrade('A');});
 $('upgradeB').addEventListener('click',()=>{if(state.scene&&!state.paused)state.scene.upgrade('B');});
 $('pause').addEventListener('click',()=>{
  if(!state.scene)return;state.paused=!state.paused;
  if(state.paused)state.scene.scene.pause();else state.scene.scene.resume();
  $('pause').textContent=state.paused?'▶ Reanudar':'Ⅱ Pausa';
  say(state.paused?'Escena y eventos visuales pausados.':'Escena y eventos visuales reanudados.');
 });
 $('clean').addEventListener('click',()=>state.scene?.resetFx());
}catch(e){say('BLOQUEANTE T-03: '+e.message);console.error(e);}
