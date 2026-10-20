
import {TOWER_ART_V2,validateTowerArtV2,getSniperSingleRifleLayers,projectSourceAnchor} from './catalog.mjs';
import {adaptSniperCoreEvent} from './t07-core-visual-adapter.mjs';
import {SniperShotPresenter} from './sniper-vfx.mjs';
// Independent four-socket T05/T06/T07 visual study; NO actor P06 and NO core gameplay.
const W=1280,H=768,XX=[164,478,791,1102],Y=529;
const $=x=>document.getElementById(x),notify=s=>{$('status').textContent=s};
const M=l=>TOWER_ART_V2.find(x=>x.family==='sniper'&&x.level===l);
const settings={level:1,style:'A',scale:null,rail:true,shadow:true,markers:true,silhouette:false,dark:false,paused:false,scene:null,n:0,last:null};
class T07Scene extends Phaser.Scene{
 constructor(){super('T07');this.errors=[];}
 preload(){
  this.load.on('loaderror',f=>this.errors.push(f.key));
  for(const lv of [1,2]){
   const m=M(lv),a=getSniperSingleRifleLayers(m);
   for(const [key,url] of [['t05',m.t05SnapshotUrl],['t06',m.t06SnapshotUrl],['t07b',m.t07ArchitecturalBUrl],
    ['shadow',a.shadowFoot],['structure',a.backStructure],['rifle',a.rifleMounted],['rail',a.frontRail]]){
    this.load.svg(key+lv,url,{width:360,height:420});
   }
  }
 }
 create(){
  if(this.errors.length)throw Error('Missing asset: '+this.errors.join(','));
  const realGL=this.game.renderer?.gl;
  if(!realGL||typeof WebGL2RenderingContext==='undefined'||!(realGL instanceof WebGL2RenderingContext))throw Error('Phaser renderer WebGL2 NOT VERIFIED');
  this.land=this.add.graphics().setDepth(-50);
  this.pads=this.add.graphics().setDepth(-10);
  this.guide=this.add.graphics().setDepth(990);
  this.samples=[];
  const names=['T05 BASELINE','T06 BASELINE','T07 A / RIFLE ÚNICO','T07 B / CONTRAPESO'];
  this.add.text(640,102,'SEMANTROPIC TD · FRANCOTIRADOR T07',{fontFamily:'Georgia,serif',fontSize:'24px',fontStyle:'bold',color:'#fff1d0'}).setOrigin(.5);
  this.add.text(640,129,'COMPARACIÓN MISMA CÁMARA / PAD PROXY 110.24 wu / SIN OPERADOR P06',{fontFamily:'system-ui',fontSize:'12px',color:'#e2eedb'}).setOrigin(.5);
  for(let i=0;i<4;i++){
   this.add.text(XX[i],205,names[i],{fontFamily:'system-ui',fontSize:'16px',fontStyle:'bold',color:'#ffe4ad'}).setOrigin(.5);
   const items=i===2?['shadow','structure','rifle','rail']:i===0?['t05']:i===1?['t06']:['t07b'];
   const sprites=items.map((name,j)=>this.add.image(XX[i],Y,name+'1').setOrigin(.5,.93).setDepth(Y+(i===2?[-8,2,17,25][j]:8)));
   this.samples.push({items,sprites});
  }
  this.targets=this.add.graphics().setDepth(100);
  for(let i=0;i<13;i++)this.targets.fillStyle(0x325a59,.3).fillCircle(45+(i*101)%1170,300+(i*41)%185,3);
  this.add.text(640,625,'13 MARCADORES GEOMÉTRICOS · NO SON ENEMIGOS CORE NI ACTORES P06',{fontFamily:'system-ui',fontSize:'12px',color:'#edd9b0'}).setOrigin(.5);
  this.presenter=new SniperShotPresenter(this,{onVisualState:event=>{
   if(event.state==='recoil'){
    const rifle=this.samples[2].sprites[2];
    this.tweens.add({targets:rifle,x:XX[2]-2,duration:45,yoyo:true});
   }
   notify('Estado visual '+event.state+' · '+event.eventId);
  }});
  this.events.once('shutdown',()=>this.presenter.destroy());
  settings.scene=this;this.draw();
  window.__SEMANTROPIC_T07={scene:this,showroom:true,coreCombat:false,operatorP06Installed:false};
  notify('Vitrina sintética Phaser '+Phaser.VERSION+' · disparo e impacto separados');
 }
 draw(){
  const m=M(settings.level),scale=settings.scale===null?m.worldScaleProposal:settings.scale;
  this.land.clear().fillGradientStyle(settings.dark?0x607f80:0xa7c894,settings.dark?0x607f80:0xa7c894,settings.dark?0x2b5561:0x6f9c7c,settings.dark?0x2b5561:0x6f9c7c,1).fillRect(0,0,W,H);
  this.pads.clear();this.guide.clear();
  for(let i=0;i<4;i++){
   this.pads.fillStyle(0x385c62,.4).fillEllipse(XX[i],Y+7,120,30);
   this.pads.fillStyle(0xa1ada1,.8).fillEllipse(XX[i],Y,110.24,34);
   this.pads.lineStyle(2,0xf1d3a3,.8).strokeEllipse(XX[i],Y,110.24,34);
   for(const [j,sprite] of this.samples[i].sprites.entries()){
    const name=this.samples[i].items[j];
    sprite.setTexture(name+settings.level).setScale(scale).setOrigin(.5,.93);
    sprite.setVisible(!(i===2&&((name==='shadow'&&!settings.shadow)||(name==='rail'&&!settings.rail))));
    if(settings.silhouette)sprite.setTintFill(0x172e39);else sprite.clearTint();
   }
  }
  if(settings.markers){
   const ref=this.samples[2].sprites[1];
   for(const [key,color] of [['operatorAnchorLocal',0x5eede1],['stockGripLocal',0xe6c9a1],['recoilPivotLocal',0xe2d5ba],['fireEffectOriginLocal',0xffaa87]]){
    const at=projectSourceAnchor(ref,m,key);
    if(!at)continue;
    this.guide.lineStyle(2,color,1).beginPath().moveTo(at.x-7,at.y).lineTo(at.x+7,at.y).moveTo(at.x,at.y-7).lineTo(at.x,at.y+7).strokePath();
   }
  }
 }
 choose(lv){this.presenter.clear();settings.level=lv;settings.last=null;this.draw();}
 event(type,bulletId=null){
  return {contractVersion:'combat-events-v1',sessionId:'T07-showroom',eventId:'t07-'+(++settings.n),
   tick:settings.n,type,entityId:'tower-demo',targetId:'enemy-demo',worldPosition:{x:XX[2],y:Y},
   payload:{originWorld:{x:XX[2],y:Y-23},targetWorld:{x:1027,y:383},bulletId,visualVariant:settings.style}};
 }
 fire(duplicate=false){
  const id=100+settings.n+1;
  const norm=adaptSniperCoreEvent(this.event('attack_fire',id),name=>name==='tower-demo'?{meta:M(settings.level),sprite:this.samples[2].sprites[1]}:null);
  const yes=norm&&this.presenter.accept(norm);
  if(yes)settings.last={bulletId:id};
  const second=duplicate&&norm?this.presenter.accept(norm):false;
  notify('attack_fire '+(yes?'visualizado':'rechazado')+(duplicate?' · duplicado '+(second?'ERROR':'RECHAZADO'):'')+' · SIN IMPACTO');
 }
 hit(){
  const id=settings.last?.bulletId;
  if(id===undefined)return notify('Sin bulletId correlacionable');
  const ok=this.presenter.accept({eventId:'t07-hit-'+(++settings.n),type:'hit_applied',towerId:'tower-demo',
   entityId:'enemy-demo',targetId:'enemy-demo',bulletId:id,worldPosition:{x:1027,y:383}});
  notify('hit_applied sintético '+(ok?'autorizó destello':'fue rechazado'));
 }
 disappear(){this.presenter.accept({type:'despawn',entityId:'enemy-demo'});settings.last=null;notify('Objetivo desaparecido: efectos cancelados');}
}
try{
 validateTowerArtV2();
 if(!window.Phaser||Phaser.VERSION!=='4.2.1'||!document.createElement('canvas').getContext('webgl2'))throw Error('Phaser 4.2.1 y WebGL2 requeridos');
 new Phaser.Game({type:Phaser.WEBGL,parent:'stage',width:W,height:H,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:W,height:H},audio:{noAudio:true},scene:[T07Scene]});
 document.querySelectorAll('[data-level]').forEach(b=>b.addEventListener('click',()=>settings.scene?.choose(Number(b.dataset.level))));
 document.querySelectorAll('[data-height]').forEach(b=>b.addEventListener('click',()=>{settings.scale=Number(b.dataset.height)/420;settings.scene?.draw()}));
 const click=(id,cb)=>$(id).addEventListener('click',cb);
 click('world',()=>{settings.scale=null;settings.scene?.draw()});
 click('style',()=>{settings.style=settings.style==='A'?'B':'A';$('style').textContent='VFX '+settings.style});
 click('rail',()=>{settings.rail=!settings.rail;settings.scene?.draw()});
 click('shadow',()=>{settings.shadow=!settings.shadow;settings.scene?.draw()});
 click('markers',()=>{settings.markers=!settings.markers;settings.scene?.draw()});
 click('silhouette',()=>{settings.silhouette=!settings.silhouette;settings.scene?.draw()});
 click('grass',()=>{settings.dark=!settings.dark;settings.scene?.draw()});
 click('fire',()=>settings.scene?.fire());
 click('duplicate',()=>settings.scene?.fire(true));
 click('hit',()=>settings.scene?.hit());
 click('vanish',()=>settings.scene?.disappear());
 click('clear',()=>{settings.scene?.presenter.clear();notify('VFX limpiados')});
 click('pause',()=>{const s=settings.scene;if(!s)return;settings.paused=!settings.paused;settings.paused?s.scene.pause():s.scene.resume();$('pause').textContent=settings.paused?'Reanudar':'Pausa'});
}catch(e){notify('Error T07: '+e.message);console.error(e)}
