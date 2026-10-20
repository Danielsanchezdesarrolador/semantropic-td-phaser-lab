/**
 * TORRES T08 — source-based continuity diagnostic, NOT C1C reconstructed gameplay.
 * 4 identical proxies compare approved T04 historical SVG, current T08 master,
 * T08 split layers with ONE rifle, and superseded T07 before-state.
 * True M03/P03 scene and P07 hand grips remain Integrator/P ownership.
 */
import {TOWER_ART_V2,validateTowerArtV2,projectSourceAnchor,getSniperSingleRifleLayers} from './catalog.mjs';
import {adaptSniperCoreEvent} from './t07-core-visual-adapter.mjs';
import {SniperShotPresenter} from './sniper-vfx.mjs';
const W=1280,H=768,XX=[160,480,800,1120],FY=522;
const $=id=>document.getElementById(id),ui=s=>{$('status').textContent=s};
const state={index:2,scene:null,mode:'A',height:null,zoom:1,markers:true,rails:true,shadow:true,silhouette:false,dark:false,paused:false,seq:0,bullet:null};
class C1CContinuity extends Phaser.Scene {
 constructor(){super('T08Continuity');this.errors=[]}
 preload(){
  this.load.on('loaderror',file=>this.errors.push(file.key));
  TOWER_ART_V2.forEach((m,i)=>{
   const base='../../art/towers/',slug=m.family+'-'+m.level;
   this.load.svg('t04-'+i,base+'t04-snapshot/'+slug+'.svg',{width:360,height:420});
   this.load.svg('now-'+i,m.url,{width:360,height:420});
   this.load.svg('t07-'+i,m.t07SnapshotUrl,{width:360,height:420});
   const layers=m.layerAssets;
   for(const [key,url] of Object.entries({shadow:layers.shadowFoot,back:layers.backStructure,front:layers.frontRail,...(m.family==='sniper'?{structure:layers.structureNoRifle,rifle:layers.rifleMounted}:{})})){
    this.load.svg(key+'-'+i,url,{width:360,height:420});
   }
  });
 }
 create(){
  if(this.errors.length)throw Error('SVG faltante '+this.errors.join(','));
  const rendererGL=this.game.renderer?.gl;
  if(!rendererGL||typeof WebGL2RenderingContext==='undefined'||!(rendererGL instanceof WebGL2RenderingContext))throw Error('Phaser renderer no es WebGL2 real');
  this.bg=this.add.graphics().setDepth(-100);this.pads=this.add.graphics().setDepth(-5);
  this.guide=this.add.graphics().setDepth(950);
  this.add.text(W/2,91,'TORRES T08 · CONTINUIDAD VISUAL C1-C / T04',{fontFamily:'Georgia,serif',fontSize:'24px',fontStyle:'bold',color:'#fff1d0'}).setOrigin(.5);
  this.add.text(W/2,117,'MISMA ESCALA, MISMO PAD PROXY · DIAGNÓSTICO AISLADO, NO COMBATE REAL',{fontFamily:'system-ui',fontSize:'13px',color:'#d6e5d9'}).setOrigin(.5);
  ['APROBADO T04','MASTER T08','CAPAS T08 / RIFLE ÚNICO','T07 SUPERADO'].forEach((name,i)=>
   this.add.text(XX[i],200,name,{fontFamily:'system-ui',fontSize:'15px',fontStyle:'bold',color:'#f9e2b1'}).setOrigin(.5));
  this.arr=[];
  for(let i=0;i<4;i++){
   const types=i===2?['shadow','back','front']:i===0?['t04']:i===1?['now']:['t07'];
   const objs=types.map((t,j)=>this.add.image(XX[i],FY,t+'-'+state.index).setOrigin(.5,.93).setDepth(FY+([-12,8,24][j]??0)));
   this.arr.push({types,objs});
  }
  this.add.text(640,615,'OPERADOR P07 NO CARGADO: SOLO ANCLAJE GEOMÉTRICO · ANTES HISTÓRICO T04 / AFTER T08 EN PAD PROXY',{fontFamily:'system-ui',fontSize:'11px',color:'#eadbb9'}).setOrigin(.5);
  this.effects=new SniperShotPresenter(this,{onVisualState:x=>ui('VFX sintético '+x.state+' / '+x.eventId),depth:FY+35});
  this.events.once('shutdown',()=>this.effects.destroy());
  state.scene=this;this.updateView();
  window.__SEMANTROPIC_T08={scene:this,source:'TORRES',comparison:'PROXY T04/T08/T07',operatorP07:false,gameplay:false};
  ui('Phaser '+Phaser.VERSION+' WebGL2 · T04 y T08 master iguales en fuente Git. No equivale a la foto completa C1-C.');
 }
 updateView(){
  const m=TOWER_ART_V2[state.index],scale=(state.height?state.height/420:m.worldScaleProposal)*state.zoom;
  this.bg.clear().fillGradientStyle(state.dark?0x678981:0xb0d394,state.dark?0x678981:0xb0d394,state.dark?0x315b65:0x78a580,state.dark?0x315b65:0x78a580,1).fillRect(0,0,W,H);
  this.pads.clear();this.guide.clear();
  for(let i=0;i<4;i++){
   const proxyX=XX[i];
   this.pads.fillStyle(0x264858,.3).fillEllipse(proxyX,FY+8,118,32);
   this.pads.fillStyle(0xa7baa8,.88).fillEllipse(proxyX,FY,110.24,34);
   this.pads.lineStyle(2,0xf3d6a3,.7).strokeEllipse(proxyX,FY,110.24,34);
   const c=this.arr[i];
   if(i===2){
    const types=m.family==='sniper'?['shadow','structure','rifle','front']:['shadow','back','front'];
    while(c.objs.length<types.length)c.objs.push(this.add.image(proxyX,FY,types[c.objs.length]+'-'+state.index).setOrigin(.5,.93));
    for(let j=0;j<c.objs.length;j++){
     const key=types[j];const sprite=c.objs[j];
     if(key){sprite.setTexture(key+'-'+state.index).setScale(scale).setDepth(FY+[-10,3,15,28][j]).setVisible(!((key==='front'&&!state.rails)||(key==='shadow'&&!state.shadow)));}
     else sprite.setVisible(false);
    }
   } else {
    const sprite=c.objs[0];sprite.setTexture(c.types[0]+'-'+state.index).setScale(scale).setVisible(true);
   }
   for(const sprite of c.objs){if(state.silhouette)sprite.setTintFill(0x163744);else sprite.clearTint()}
  }
  if(state.markers){
   const marker=this.arr[2].objs[1];
   const keys=m.family==='sniper'?['operatorAnchorLocal','stockGripLocal','fireEffectOriginLocal']:['spawnExitLocal','buildFoundationLocal'];
   for(const [i,key] of keys.entries()){
    const a=projectSourceAnchor(marker,m,key);
    if(!a)continue;const color=[0x80f6e8,0xf2d8aa,0xffb4a0][i];
    this.guide.lineStyle(2,color,.95).beginPath().moveTo(a.x-8,a.y).lineTo(a.x+8,a.y).moveTo(a.x,a.y-8).lineTo(a.x,a.y+8).strokePath();
   }
  }
  $('current').textContent=m.title+' · nivel '+m.level+' · escala '+scale.toFixed(3)+' · arte T04 EXACTO · '+(m.family==='sniper'?'P07 DESARMADO PENDIENTE':'salida recluta histórica');
 }
 select(i){this.effects.clear();state.bullet=null;state.index=i;this.updateView()}
 fire(){
  const m=TOWER_ART_V2[state.index];
  if(m.family!=='sniper')return ui('Solo Francotirador tiene VFX en este hito.');
  const host=this.arr[2].objs[1],seq=++state.seq,bullet=seq+100;
  const event={eventId:'T08-demo-fire-'+seq,sessionId:'T08-showroom',type:'attack_fire',tick:seq,
   entityId:'demo-sniper',targetId:'demo-enemy',payload:{originWorld:{x:XX[2]+20,y:FY-30},targetWorld:{x:1000,y:371},bulletId:bullet,visualVariant:state.mode}};
  const normalized=adaptSniperCoreEvent(event,id=>id==='demo-sniper'?{sprite:host,meta:m}:null);
  if(normalized&&this.effects.accept(normalized)){state.bullet=bullet;ui('attack_fire sintético: traza sin HIT');}
  else ui('Evento visual rechazado (muzzle no válido)');
 }
 hit(){
  if(state.bullet===null)return ui('No existe disparo correlacionado');
  const accepted=this.effects.accept({eventId:'T08-demo-hit-'+(++state.seq),type:'hit_applied',bulletId:state.bullet,towerId:'demo-sniper',entityId:'demo-enemy',targetId:'demo-enemy',worldPosition:{x:1000,y:371}});
  ui(accepted?'HIT sintético correlacionado: 1 destello':'hit_applied rechazado');
 }
 reset(){this.effects.clear();state.bullet=null;ui('Efectos limpiados');}
}
try{
 validateTowerArtV2();
 if(!window.Phaser||Phaser.VERSION!=='4.2.1')throw Error('Falta Phaser 4.2.1');
 new Phaser.Game({parent:'stage',type:Phaser.WEBGL,width:W,height:H,
  scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:W,height:H},
  audio:{noAudio:true},scene:[C1CContinuity]});
 document.querySelectorAll('[data-tower]').forEach(b=>b.addEventListener('click',()=>state.scene?.select(Number(b.dataset.tower))));
 document.querySelectorAll('[data-height]').forEach(b=>b.addEventListener('click',()=>{state.height=Number(b.dataset.height);state.scene?.updateView()}));
 const call=(id,fn)=>$(id).addEventListener('click',fn);
 call('world',()=>{state.height=null;state.zoom=1;state.scene?.updateView()});
 call('rail',()=>{state.rails=!state.rails;state.scene?.updateView()});
 call('shadow',()=>{state.shadow=!state.shadow;state.scene?.updateView()});
 call('markers',()=>{state.markers=!state.markers;state.scene?.updateView()});
 call('silhouette',()=>{state.silhouette=!state.silhouette;state.scene?.updateView()});
 call('grass',()=>{state.dark=!state.dark;state.scene?.updateView()});
 call('zoom',()=>{state.zoom=state.zoom===1?1.4:1;state.scene?.updateView()});
 call('mode',()=>{state.mode=state.mode==='A'?'B':'A';$('mode').textContent='VFX '+state.mode});
 call('fire',()=>state.scene?.fire());
 call('hit',()=>state.scene?.hit());
 call('clean',()=>state.scene?.reset());
 call('pause',()=>{const s=state.scene;if(!s)return;state.paused=!state.paused;state.paused?s.scene.pause():s.scene.resume();$('pause').textContent=state.paused?'Reanudar':'Pausa';});
}catch(e){ui('ERROR SHOWROOM T08: '+e.message);console.error(e)}
