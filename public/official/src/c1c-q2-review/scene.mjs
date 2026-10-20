/**
 * SEMANTROPIC TD — C1-C / NUEVA CAPA DE INSPECCIÓN ARTÍSTICA.
 * Escena de comparación: M02 Aurora v2 + T03 premium + P02 A/B.
 * No invoca IA, oleadas, estadísticas, compras, HP, rewards ni guardados.
 */
import {validateM01} from '../maps-visual/m01/renderer.mjs';
import {M03_PALETTES,preloadM03Illustrations,mountM01WorldV3} from '../maps-visual/m01/m03/renderer-v3.mjs';
import {TOWER_ART_V2,validateTowerArtV2,projectSourceAnchor} from '../towers-visual/catalog.mjs';
import {TowerVfxShowcase} from '../towers-visual/fx.mjs';
import {CAST,ANIMATIONS} from '../../art/actors/atlas-source.mjs';
import {P02_STUDIES,createP02Atlas,addP02Texture} from '../../art/actors/p02-painter.mjs';
import {createP03Atlas,registerP03Atlas} from '../../art/actors/p03-rig.mjs';
import {pathSegments,positionOnPath} from '../m01-model.mjs';

const W=1280,H=768,$=id=>document.getElementById(id);
const query=new URLSearchParams(location.search);
const settings={
 palette:M03_PALETTES.includes(query.get('palette'))?query.get('palette'):'viva',
 variant:['P03','A','B'].includes(query.get('actors'))?query.get('actors'):'P03',
 paused:false,sockets:false,tower:0
};
const routeModels=[1,3,4,5]; // índice de pads reales M01; visual únicamente
let seq=0,MAP=null;
const toast=x=>{$('status').textContent=x;};
function insist(check,message){if(!check)throw Error('C1-C: '+message);}
function p02Info(id){const a=CAST.find(x=>x.actorId===id);insist(a,'Actor no encontrado '+id);return a;}

class JointArtReview extends Phaser.Scene{
 constructor(){super('C1CReview');this.loadErrors=[];this.towers=[];this.actors=[];this.elapsed=0;this.mapView=null;this.fx=null;}
 preload(){
  this.load.on('loaderror',f=>{this.loadErrors.push(f.key);toast('Fallo de recurso '+f.key);});
  preloadM03Illustrations(this);
  for(const meta of TOWER_ART_V2)this.load.svg(meta.assetId,meta.url,{width:360,height:420});
 }
 create(){
  insist(this.loadErrors.length===0,'Errores de carga '+this.loadErrors.join(', '));
  this.mapView=mountM01WorldV3(this,MAP,{palette:settings.palette});
  insist(this.mapView.plan.sockets.length===8,'Se requieren ocho sockets');
  insist(MAP.path.length===133,'Ruta fuente invalida');
  this.route=pathSegments(MAP.path);
  this.atlases=new Map();
  for(const a of CAST){
   const asset=settings.variant==='P03'?createP03Atlas(a.actorId):createP02Atlas(a.actorId,settings.variant);
   if(settings.variant==='P03')registerP03Atlas(this,asset);else addP02Texture(this,asset);
   this.atlases.set(a.actorId,asset);
  }
  this.fx=new TowerVfxShowcase(this);
  this.createTowers();
  this.createActors();
  this.mapView.updateDebug({showClearance:settings.sockets});
  this.input.on('pointerdown',p=>{
   const t=this.towers.find(t=>Math.hypot(p.x-t.socket.world.x,p.y-t.socket.world.y+35)<69);
   if(t){settings.tower=this.towers.indexOf(t);this.showTower();}
  });
  const g=this.game.renderer?.gl;
  const isWebGL2=typeof WebGL2RenderingContext!=='undefined'&&g instanceof WebGL2RenderingContext;
  $('render').textContent=isWebGL2?'WebGL2 real':'NO VERIFICADO';
  toast(isWebGL2?'M03 + T04 + P03 en una escena Phaser (solo visual).':'No se pudo verificar WebGL2 del renderizador.');
  this.showTower();
  window.__SEMANTROPIC_C1C={scene:this,version:'C1C-art-review',gameplay:false,readonly:true};
 }
 createTowers(){
  TOWER_ART_V2.forEach((meta,i)=>{
   const socket=this.mapView.plan.sockets[routeModels[i]];
   insist(socket&&this.textures.exists(meta.assetId),'SVG o socket inexistente: '+meta.assetId);
   const scale=meta.worldScaleProposal,center=socket.world;
   const sprite=this.add.image(center.x,center.y,meta.assetId)
      .setOrigin(meta.footAnchor.x,meta.footAnchor.y).setScale(scale).setDepth(center.y-2);
   this.towers.push({meta,sprite,socket,scale});
   this.mapView.setSocketVisualState(socket.socketId,'occupied');
  });
 }
 addActor(actorId,x,y,{moving=false,speed=0,offset=0}={}){
  const data=this.atlases.get(actorId),info=p02Info(actorId);
  insist(data,'Atlas faltante '+actorId);
  const scale=Math.min(.83,(data.heightWorld??info.heightWorld)/(info.kind==='hound'?114:171)*.70);
  const shadow=this.add.ellipse(x,y+1,info.kind==='hound'?38:33,9,0x183b3b,.38).setDepth(y-4);
  const sprite=this.add.image(x,y,data.atlasKey,'idle-0')
      .setOrigin(info.footAnchor.x,info.footAnchor.y).setScale(scale).setDepth(y+3);
  const entry={info,data,sprite,shadow,offset,speed,moving,phase:offset*.01};this.actors.push(entry);
  return entry;
 }
 createActors(){
  for(let i=0;i<9;i++){
   const id=i%3===0?'hound':'warrior',offset=i*88;
   const pos=positionOnPath(this.route,offset);
   this.addActor(id,pos.x,pos.y,{moving:true,offset,speed:id==='hound'?80:41});
  }
  for(const tower of this.towers){
   const meta=tower.meta;
   const anchorName=meta.family==='sniper'?'operatorAnchorLocal':'spawnExitLocal';
   const local=projectSourceAnchor(tower.sprite,meta,anchorName);
   if(!local){throw Error('C1C missing '+anchorName+' on '+meta.assetId);}
   const id=meta.family==='sniper'?'sniper_operator':'infantry_recruit';
   this.addActor(id,local.x,local.y,{offset:13});
  }
 }
 showTower(){
  const t=this.towers[settings.tower];
  $('selection').textContent=t.meta.title+' · '+t.socket.socketId+' · nivel '+t.meta.level+' · escala PROVISIONAL';
 }
 fire(){
  if(settings.paused)return;
  const t=this.towers[settings.tower],meta=t.meta,kind=meta.attackType;
  const from=kind==='tracer'?projectSourceAnchor(t.sprite,meta,'muzzleLocal'):projectSourceAnchor(t.sprite,meta,'spawnExitLocal');
  const actor=this.actors.find(x=>x.moving&&x.info.actorId==='warrior')||this.actors.find(x=>x.moving);
  const to=actor?{x:actor.sprite.x,y:actor.sprite.y-20}:{x:t.socket.world.x+80,y:t.socket.world.y-40};
  this.fx.dispatch({eventId:'C1C-demo-'+(++seq),type:kind==='deploy'?'deploy_visual':'attack_visual',source:from,target:to,level:meta.level});
  toast('VFX '+meta.title+' · sin impacto de gameplay ni costes.');
 }
 switchPalette(value){
  insist(M03_PALETTES.includes(value),'Paleta no reconocida');
  if(value===settings.palette)return;
  this.mapView.destroy();
  settings.palette=value;
  this.mapView=mountM01WorldV3(this,MAP,{palette:value});
  for(const t of this.towers)this.mapView.setSocketVisualState(t.socket.socketId,'occupied');
  this.mapView.updateDebug({showClearance:settings.sockets});
  toast('Paleta '+value+' · topología original intacta');
 }
 toggleSockets(){
  settings.sockets=!settings.sockets;
  this.mapView.updateDebug({showClearance:settings.sockets,showRoute:settings.sockets,showOcclusion:settings.sockets});
 }
 update(_now,delta){
  if(settings.paused)return;
  const dt=Math.min(.10,delta/1000);this.elapsed+=dt;
  this.mapView?.updateAmbient(dt,false);
  for(const a of this.actors){
   if(a.moving){
    const pos=positionOnPath(this.route,(a.offset+this.elapsed*a.speed)%this.route.total);
    a.sprite.setPosition(pos.x,pos.y).setFlipX(Math.cos(pos.heading)<0).setDepth(pos.y+3);
    a.shadow.setPosition(pos.x,pos.y+1).setDepth(pos.y-4);
   }
   const anim=ANIMATIONS[a.moving?'walk':'idle'];
   const f=Math.floor((this.elapsed+a.phase)*anim.fps)%anim.frames;
   const key=(a.moving?'walk':'idle')+'-'+f;
   if(a.sprite.frame.name!==key)a.sprite.setFrame(key);
  }
 }
}

function connect(scene){
 $('palette').value=settings.palette;
 $('variant').value=settings.variant;
 $('palette').addEventListener('change',()=>scene.switchPalette($('palette').value));
 $('variant').addEventListener('change',()=>{const u=new URL(location.href);u.searchParams.set('palette',settings.palette);u.searchParams.set('actors',$('variant').value);location.assign(u.toString());});
 $('next').addEventListener('click',()=>{settings.tower=(settings.tower+1)%scene.towers.length;scene.showTower();});
 $('fx').addEventListener('click',()=>scene.fire());
 $('sockets').addEventListener('click',()=>scene.toggleSockets());
 $('pause').addEventListener('click',()=>{
  settings.paused=!settings.paused;
  if(settings.paused)scene.scene.pause();else scene.scene.resume();
  $('pause').textContent=settings.paused?'▶ Continuar':'Ⅱ Pausa';
  toast(settings.paused?'Escena detenida.':'Escena reanudada.');
 });
}
(async()=>{
 try{
  insist(window.Phaser&&Phaser.VERSION==='4.2.1','Phaser 4.2.1 obligatorio');
  validateTowerArtV2();
  insist(P02_STUDIES.A&&P02_STUDIES.B&&typeof createP03Atlas==='function','No están las variantes A/B de P02');
  const res=await fetch('../../data/maps.v5.json',{cache:'no-store'});
  insist(res.ok,'No se pudo cargar mapa canónico');
  MAP=(await res.json())[0];validateM01(MAP);
  const canvas=document.createElement('canvas');
  const gl=canvas.getContext('webgl2',{alpha:false,antialias:true});
  insist(gl&&typeof WebGL2RenderingContext!=='undefined'&&gl instanceof WebGL2RenderingContext,'WebGL2 no disponible para esta vitrina');
  const game=new Phaser.Game({type:Phaser.WEBGL,canvas,context:gl,parent:'stage',width:W,height:H,
    backgroundColor:'#173d3b',antialias:true,audio:{noAudio:true},
    scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:W,height:H},scene:[JointArtReview]});
  game.events.once(Phaser.Core.Events.READY,()=>connect(game.scene.getScene('C1CReview')));
 }catch(e){toast('BLOQUEANTE: '+e.message);console.error(e);}
})();
