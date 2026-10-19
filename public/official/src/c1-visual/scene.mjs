/**
 * SEMANTROPIC TD · C1-A · INTEGRACIÓN VISUAL (NO GAMEPLAY).
 * Combina fuentes reales de los PR M-01, T-01/T-02, P-01 con Phaser 4.2.1.
 * No cambia HP, oro, derrotas, spawns canónicos, compras ni datos de campaña.
 * La ruta sirve para un desfile VISUAL que no participa de las cinco oleadas.
 */
import {mountM01World,validateM01,M01_PALETTE_NAMES} from '../maps-visual/m01/renderer.mjs';
import {TOWER_ART,validateTowerArt} from '../towers-visual/catalog.mjs';
import {TowerVfxShowcase} from '../towers-visual/fx.mjs';
import {CAST,ANIMATIONS,FRAME_HEIGHT,registerActorAtlases} from '../../art/actors/atlas-source.mjs';
import {pathSegments,positionOnPath} from '../m01-model.mjs';

const W=1280,H=768,$=(id)=>document.getElementById(id);
const config={palette:'equilibrada',paused:false,showSockets:false,selectedIndex:0};
let serial=0;
const SOURCE={map:null};
function note(s){$('status').textContent=s;}
function requireValid(condition,message){if(!condition)throw new Error('[C1-A] '+message);}
function actorInfo(id){const value=CAST.find(a=>a.actorId===id);requireValid(value,'Actor '+id+' unavailable');return value;}
function directionFlip(r){return Math.cos(r.heading)<0;}
const towerPads=[1,3,4,5]; // índices de ocho sockets REALES M01; solo presentaciones, no construcciones

class C1VisualScene extends Phaser.Scene{
 constructor(){super('C1JointVisual');this.actors=[];this.towers=[];this.elapsed=0;this.fx=null;this.mapArt=null;this.errors=[];}
 preload(){
  this.load.on('loaderror',file=>{this.errors.push(file.key);note('Recurso sin cargar: '+file.key);});
  for(const meta of TOWER_ART)this.load.svg(meta.assetId,meta.url,{width:360,height:420});
 }
 create(){
  requireValid(this.errors.length===0,'No se pudieron cargar SVG de torre: '+this.errors.join(', '));
  this.route=pathSegments(SOURCE.map.path);
  this.mapArt=mountM01World(this,SOURCE.map,{palette:config.palette});
  this.atlases=registerActorAtlases(this);
  requireValid(this.mapArt.plan.sockets.length===8,'8 sockets canónicos requeridos');
  requireValid(this.route.points.length===133,'133 nodos canónicos requeridos');
  this.fx=new TowerVfxShowcase(this);
  this.mountTowers();
  this.mountActors();
  this.mapArt.updateDebug({showClearance:config.showSockets});
  this.input.on('pointerdown',p=>{
   const choice=this.towers.find(t=>Math.hypot(p.x-t.x,p.y-t.y+65)<73);
   if(choice){config.selectedIndex=this.towers.indexOf(choice);this.selectTower();}
  });
  const gl=this.game.renderer&&this.game.renderer.gl;
  const webgl2=typeof WebGL2RenderingContext!=='undefined'&&gl instanceof WebGL2RenderingContext;
  $('backend').textContent=webgl2?'WebGL2 REAL':'WebGL2 NO confirmado';
  if(!webgl2)note('Aviso: renderizador no confirmado como WebGL2, no declarar cumplimiento.');
  else note('C1-A: 133 waypoints, 8 sockets, 4 torres, 4 tipos de actor. Escena visual sin combate.');
  this.selectTower();
  window.__SEMANTROPIC_C1_VISUAL={scene:this,readOnly:true,mapId:1,gameplay:false};
 }
 mountTowers(){
  TOWER_ART.forEach((meta,i)=>{
   const socket=this.mapArt.plan.sockets[towerPads[i]];
   requireValid(socket&&this.textures.exists(meta.assetId),'Socket o imagen de torre faltante');
   const {x,y}=socket.world, scale=.275;
   const sprite=this.add.image(x,y,meta.assetId)
    .setOrigin(meta.footAnchor.x,meta.footAnchor.y).setScale(scale).setDepth(y-1);
   this.towers.push({meta,socket,x,y,scale,sprite});
  });
 }
 placeActor(actorId,x,y,{moving=false,distance=0,speed=0,baseAngle=0}={}){
  const info=actorInfo(actorId),scale=(info.heightWorld/(info.kind==='hound'?114:171))*.68;
  const shadow=this.add.ellipse(x,y+1,Math.max(20,info.heightWorld*.48),11,0x163e3b,.33).setDepth(y-2);
  const sprite=this.add.image(x,y,info.atlasKey,'idle-0')
    .setOrigin(info.footAnchor.x,info.footAnchor.y).setScale(scale).setDepth(y+2);
  const item={info,sprite,shadow,moving,distance,speed,phase:baseAngle};
  this.actors.push(item);return item;
 }
 mountActors(){
  // 10 unidades que siguen los waypoints de M01; no son entidades canónicas de combate.
  for(let i=0;i<10;i++){
   const id=i%4===0?'hound':'warrior',start=i*67;
   const p=positionOnPath(this.route,start);
   this.placeActor(id,p.x,p.y,{moving:true,distance:start,speed:id==='hound'?78:40,baseAngle:i*.3});
  }
  // Soldados y operadores de P junto a edificios T en sockets M, vista únicamente.
  for(const t of this.towers){
   if(t.meta.family==='infantry')this.placeActor('infantry_recruit',t.x+29,t.y+4,{baseAngle:1});
   else this.placeActor('sniper_operator',t.x+5,t.y-70,{baseAngle:2});
  }
 }
 selectTower(){
  const t=this.towers[config.selectedIndex];
  $('selection').textContent=t.meta.title+' · '+t.socket.socketId+' · nivel '+t.meta.level+' · prototipo visual';
 }
 switchPalette(next){
  requireValid(M01_PALETTE_NAMES.includes(next),'Paleta no admitida');
  config.palette=next;
  const old=this.mapArt;if(old)old.destroy();
  this.mapArt=mountM01World(this,SOURCE.map,{palette:config.palette,showReserved:config.showSockets});
  note('Paleta '+next+' · mismo mapa, ruta y sockets. Solo cambió arte.');
 }
 fireSelected(){
  if(config.paused)return;
  const t=this.towers[config.selectedIndex],s=t.scale,meta=t.meta;
  const source=meta.type==='deploy'?{x:t.x,y:t.y-20}:{x:t.x+meta.muzzleLocal.x*s,y:t.y+meta.muzzleLocal.y*s};
  const enemy=this.actors.find(a=>a.moving&&a.info.actorId==='warrior');
  const target=enemy?{x:enemy.sprite.x,y:enemy.sprite.y-28}:{x:t.x+100,y:t.y-40};
  this.fx.dispatch({eventId:'C1-visual-'+(++serial),kind:meta.type,source,target,level:meta.level});
  this.tweens.add({targets:t.sprite,angle:meta.type==='tracer'?-1.4:1.4,duration:70,yoyo:true});
  note(meta.title+' — FX de presentación, sin daño, compra ni recompensa.');
 }
 toggleSockets(){
  config.showSockets=!config.showSockets;
  this.mapArt.updateDebug({showClearance:config.showSockets,showRoute:config.showSockets});
 }
 update(_time,delta){
  if(config.paused)return;
  const dt=Math.min(delta/1000,.1);this.elapsed+=dt;
  for(const a of this.actors){
   let frameKey='idle-0',pos={x:a.sprite.x,y:a.sprite.y,heading:0};
   if(a.moving){
    const d=(a.distance+this.elapsed*a.speed)%this.route.total;
    pos=positionOnPath(this.route,d);
    const anim=ANIMATIONS.walk;
    frameKey='walk-'+(Math.floor((this.elapsed+a.phase)*anim.fps)%anim.frames);
    a.sprite.setPosition(pos.x,pos.y).setFlipX(directionFlip(pos)).setDepth(pos.y+2);
    a.shadow.setPosition(pos.x,pos.y+1).setDepth(pos.y-2);
   }else{
    const anim=ANIMATIONS.idle;
    frameKey='idle-'+(Math.floor((this.elapsed+a.phase)*anim.fps)%anim.frames);
   }
   if(a.sprite.frame.name!==frameKey)a.sprite.setFrame(frameKey);
  }
 }
}

function bindControls(scene){
 $('palette').addEventListener('change',()=>scene.switchPalette($('palette').value));
 $('nextTower').addEventListener('click',()=>{config.selectedIndex=(config.selectedIndex+1)%scene.towers.length;scene.selectTower();});
 $('effect').addEventListener('click',()=>scene.fireSelected());
 $('sockets').addEventListener('click',()=>scene.toggleSockets());
 $('pause').addEventListener('click',()=>{
  config.paused=!config.paused;
  if(config.paused)scene.scene.pause();else scene.scene.resume();
  $('pause').textContent=config.paused?'▶ Reanudar':'Ⅱ Pausa';
  note(config.paused?'Vista pausada.':'Vista reanudada.');
 });
}
async function bootstrap(){
 try{
  validateTowerArt();
  requireValid(window.Phaser&&Phaser.VERSION==='4.2.1','Phaser 4.2.1 local requerido');
  const response=await fetch('../../data/maps.v5.json',{cache:'no-store'});
  requireValid(response.ok,'No se puede leer maps.v5.json');
  const maps=await response.json();SOURCE.map=maps[0];validateM01(SOURCE.map);
  requireValid(SOURCE.map.path.length===133&&SOURCE.map.spots.length===8,'Fuente de ruta/pads no canónica');
  const surface=document.createElement('canvas');
  const gl=surface.getContext('webgl2',{alpha:false,antialias:true});
  requireValid(gl&&typeof WebGL2RenderingContext!=='undefined'&&gl instanceof WebGL2RenderingContext,'WebGL2 no disponible: prueba visual detenida');
  const game=new Phaser.Game({
   type:Phaser.WEBGL,canvas:surface,context:gl,parent:'stage',width:W,height:H,
   backgroundColor:'#173b3b',antialias:true,audio:{noAudio:true},
   scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:W,height:H},
   scene:[C1VisualScene]
  });
  game.events.once(Phaser.Core.Events.READY,()=>{
   const scene=game.scene.getScene('C1JointVisual');
   bindControls(scene);
  });
 }catch(e){note('BLOQUEANTE C1-A: '+e.message);console.error(e);}
}
bootstrap();
