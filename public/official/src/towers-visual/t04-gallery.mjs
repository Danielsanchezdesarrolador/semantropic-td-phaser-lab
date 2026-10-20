/**
 * SEMANTROPIC TD · T-04/Q2 visual gallery. OWNERSHIP T.
 * REAL Phaser client, if opened in browser after npm build; NOT battle gameplay.
 * Left T03 / right T04 at SAME camera scale on 119.48wu M02-size proxy (NOT map asset).
 * No P actor textures; cyan marker = P-owned operator anchor request.
 */
import {TOWER_ART_V2,validateTowerArtV2,projectSourceAnchor,towerFootprintPresentation} from './catalog.mjs';
import {TowerVfxShowcase} from './fx.mjs';
const W=1280,H=768, X=[158,478,798,1118], FOOT=457, BEFORE='t03-q2-', AFTER='t04-q2-';
const P=['infantry-1','infantry-2','sniper-1','sniper-2'];
const state={scene:null,zoom:1,pad:'m02',grass:'light',anchors:false,paused:false,selected:0,seq:0};
const $=id=>document.getElementById(id),status=s=>{$('status').textContent=s};
const PALETTE={light:{bg:0x719a72,ground:0x94bf83,shadow:0x396866},dark:{bg:0x3c615b,ground:0x5a8a73,shadow:0x21454e}};
class T04Review extends Phaser.Scene {
 constructor(){super('T04Review');this.pairs=[];this.marks=[];this.padGfx=null;this.fx=null;this.failures=[];}
 preload(){
  this.load.on('loaderror',f=>{this.failures.push(f.key);status('SVG no cargado: '+f.key);});
  TOWER_ART_V2.forEach((m,i)=>{
   this.load.svg(BEFORE+i,m.t03SnapshotUrl,{width:360,height:420});
   this.load.svg(AFTER+i,m.url,{width:360,height:420});
  });
 }
 create(){
  if(this.failures.length)throw Error('Faltan ocho SVG T03/T04: '+this.failures.join(','));
  state.scene=this;this.fx=new TowerVfxShowcase(this);
  this.land=this.add.graphics().setDepth(-150);this.drawGround();
  this.padGfx=this.add.graphics().setDepth(-10);
  const heading=this.add.text(W/2,126,'T04/Q2 · ANTES T03 / DESPUÉS T04',{fontFamily:'Georgia,serif',fontSize:'23px',fontStyle:'bold',color:'#fff0c6'}).setOrigin(.5).setDepth(900);
  this.add.text(W/2,160,'MISMO SOCKET FICTICIO · MISMA CÁMARA · SIN COMBATE · PAD M02 SOLO PROXY',{fontFamily:'system-ui',fontSize:'13px',color:'#e2eecf'}).setOrigin(.5).setDepth(900);
  for(let i=0;i<4;i++){
   const meta=TOWER_ART_V2[i],left=X[i]-63,right=X[i]+63;
   const old=this.add.image(left,FOOT,BEFORE+i).setOrigin(meta.footAnchor.x,meta.footAnchor.y).setDepth(FOOT+25);
   const next=this.add.image(right,FOOT,AFTER+i).setOrigin(meta.footAnchor.x,meta.footAnchor.y).setDepth(FOOT+25);
   this.add.text(X[i],535,meta.title.toUpperCase(),{fontFamily:'system-ui',fontSize:'16px',fontStyle:'bold',color:'#fff1c5'}).setOrigin(.5);
   this.add.text(X[i],561,'T03 · ANTES              T04 · DESPUÉS',{fontFamily:'system-ui',fontSize:'12px',color:'#d2e9db'}).setOrigin(.5);
   this.add.text(X[i],591,meta.worldScaleProposal.toFixed(3)+'× · '+meta.worldHeightProposal.toFixed(1)+' alto wu',{fontFamily:'system-ui',fontSize:'12px',color:'#f4dbac'}).setOrigin(.5);
   const p=towerFootprintPresentation(meta);
   this.add.text(X[i],615,p.visiblePadPercent+'% pad visible*',{fontFamily:'system-ui',fontSize:'11px',color:'#e4e4d4'}).setOrigin(.5);
   this.pairs.push({meta,old,next,x:X[i],left,right});
  }
  this.input.on('pointerdown',pointer=>{
   const idx=this.pairs.findIndex(x=>Math.abs(pointer.x-x.right)<67&&Math.abs(pointer.y-FOOT+85)<118);
   if(idx>=0&&!state.paused){state.selected=idx;this.fire(idx);}
  });
  this.events.once('shutdown',()=>{this.fx.destroy();this.destroyMarks();});
  this.updateArt();
  const gl=this.game.renderer?.gl;
  status('T04 · Phaser '+Phaser.VERSION+' · '+(gl&&typeof WebGL2RenderingContext!=='undefined'&&gl instanceof WebGL2RenderingContext?'WebGL2 runtime detectado':'WebGL2 sin verificar')+' · ESTUDIO, no core.');
  window.__SEMANTROPIC_T04_Q2={scene:this,readonly:true,gameplayImplemented:false};
 }
 drawGround(){
  const pal=PALETTE[state.grass];
  this.land.clear().fillGradientStyle(pal.bg,pal.bg,pal.ground,pal.ground,1).fillRect(0,0,W,H);
  this.land.fillStyle(pal.shadow,.16);
  for(let y=240;y<700;y+=74)this.land.fillEllipse(W/2,y,1220,36);
  this.land.lineStyle(3,0xf0d89a,.4).strokeRoundedRect(14,108,1252,552,15);
 }
 drawPads(){
  this.padGfx.clear();
  const diameter=state.pad==='m02'?119.48:103.0;
  const half=diameter/2;
  for(const [idx,entry] of this.pairs.entries()){
   for(const x of [entry.left,entry.right]){
    this.padGfx.fillStyle(0x193b43,.33).fillEllipse(x,FOOT+7,diameter+10,32);
    this.padGfx.fillStyle(0x839c8c,.86).fillEllipse(x,FOOT,diameter,38);
    this.padGfx.lineStyle(3,0xe9d4a0,.76).strokeEllipse(x,FOOT,diameter,38);
    this.padGfx.lineStyle(2,0x49646a,.6).strokeEllipse(x,FOOT,Math.max(10,diameter-14),28);
   }
  }
 }
 updateArt(){
  this.drawPads();
  for(const [i,p] of this.pairs.entries()){
   const s=p.meta.worldScaleProposal*state.zoom;
   // IMPORTANT: both before & after use the SAME new proposed world scale for FAIR comparison.
   p.old.setScale(s);p.next.setScale(s);
   p.old.setAlpha(i===state.selected?1:.94);p.next.setAlpha(i===state.selected?1:.94);
  }
  this.drawMarkers();
 }
 destroyMarks(){for(const obj of this.marks)obj.destroy();this.marks=[];}
 drawMarkers(){
  this.destroyMarks();
  if(!state.anchors)return;
  const colors={buildFoundationLocal:0xf2ce8b,operatorAnchorLocal:0x58dfef,spawnExitLocal:0x89ec85,muzzleLocal:0xf6a767,shadowFootAnchor:0xe8a6ca};
  for(const pair of this.pairs){
   for(const [name,color] of Object.entries(colors)){
    const pos=projectSourceAnchor(pair.next,pair.meta,name);
    if(!pos)continue;
    this.marks.push(this.add.circle(pos.x,pos.y,4.5,color,1).setStrokeStyle(1.5,0x1b343e).setDepth(2000));
    // Dotted tether to foundation marker is visual QA; not a route, footprint or collider.
   }
  }
 }
 select(index){state.selected=index;this.updateArt();}
 fire(index){
  const p=this.pairs[index],m=p.meta;
  const source=projectSourceAnchor(p.next,m,m.family==='sniper'?'muzzleLocal':'spawnExitLocal');
  const target={x:Math.min(W-28,p.right+73),y:FOOT-150};
  this.fx.dispatch({eventId:'t04-shot-'+(++state.seq),type:m.family==='sniper'?'attack_visual':'deploy_visual',source,target,level:m.level});
  status('VFX T04 '+m.title+' → demo sin daño, soldado real o cooldown.');
 }
 upgrade(method){
  const p=this.pairs[state.selected];
  this.fx.dispatch({eventId:'t04-upgrade-'+(++state.seq),type:'upgrade_visual',source:{x:p.right,y:FOOT-25},method});
  status('Upgrade '+method+' solo VFX (nivel real inalterado).');
 }
 reset(){this.fx.clear();status('VFX, tweens y timers visuales limpiados.');}
}
try{
 validateTowerArtV2();
 if(!window.Phaser||Phaser.VERSION!=='4.2.1')throw Error('Se requiere Phaser 4.2.1 local.');
 const glProbe=document.createElement('canvas').getContext('webgl2');
 if(!glProbe||typeof WebGL2RenderingContext==='undefined'||!(glProbe instanceof WebGL2RenderingContext))throw Error('WebGL2 no disponible.');
 const engine=Phaser;
 new engine.Game({type:engine.WEBGL,width:W,height:H,parent:'stage',backgroundColor:'#315a59',
  scale:{mode:engine.Scale.FIT,autoCenter:engine.Scale.CENTER_BOTH,width:W,height:H},audio:{noAudio:true},scene:[T04Review]});
 document.querySelectorAll('[data-tower]').forEach(b=>b.addEventListener('click',()=>{if(state.scene&&!state.paused){const i=Number(b.dataset.tower);state.scene.select(i);state.scene.fire(i);}}));
 $('zoom').addEventListener('click',()=>{state.zoom=state.zoom===1?1.35:1;$('zoom').textContent=state.zoom===1?'Zoom 1.35×':'Zoom 1×';state.scene?.updateArt();});
 $('pad').addEventListener('click',()=>{state.pad=state.pad==='m02'?'proposal':'m02';$('pad').textContent=state.pad==='m02'?'Pad propuesto 103':'Pad M02 proxy 119';state.scene?.updateArt();});
 $('grass').addEventListener('click',()=>{state.grass=state.grass==='light'?'dark':'light';state.scene?.drawGround();});
 $('anchors').addEventListener('click',()=>{state.anchors=!state.anchors;$('anchors').textContent=state.anchors?'Ocultar anclajes':'Ver anclajes';state.scene?.drawMarkers();});
 $('upgradeA').addEventListener('click',()=>{if(state.scene&&!state.paused)state.scene.upgrade('A');});
 $('upgradeB').addEventListener('click',()=>{if(state.scene&&!state.paused)state.scene.upgrade('B');});
 $('pause').addEventListener('click',()=>{if(!state.scene)return;state.paused=!state.paused;
  state.paused?state.scene.scene.pause():state.scene.scene.resume();$('pause').textContent=state.paused?'▶ Reanudar':'Ⅱ Pausa';});
 $('clean').addEventListener('click',()=>state.scene?.reset());
}catch(e){status('BLOQUEANTE DE VITRINA T04: '+e.message);console.error(e);}
