/** Semantropic C1-D5: Phaser WebGL2 actual Infantry + Sniper combat, visuals deliberately provisional. */
import {M01CombatWithInfantryA2 as M01CombatWithInfantry} from "../core-c1d/m01-infantry-combat-a2.mjs";
import {m01ReadRecord,m01SaveVictory,m01Result} from "../core-c1d/m01-results-phaser.mjs";
import {validateM01} from "../maps-visual/m01/renderer.mjs";
import {preloadM03Illustrations,mountM01WorldV3} from "../maps-visual/m01/m03/renderer-v3.mjs";
import {T04_VISUAL_REFERENCE as TOWER_ART_V2,t04ArtFor,projectT04Point} from "../c1d4r-combat/heritage/t04-catalog.mjs";
import {SniperShotPresenter} from "../towers-visual/sniper-vfx.mjs";
import {CAST,ANIMATIONS} from "../../art/actors/atlas-source.mjs";
import {createP03Atlas,registerP03Atlas} from "../../art/actors/p03-rig.mjs";

const $=id=>document.getElementById(id);
const assert=(c,m)=>{if(!c)throw Error("C1-D2: "+m);};
let MAP,CAMPAIGN,WORLD,SCENE,chosenSocket=0,resultShown=false,rallyMode=false;
function feedback(s){$("feedback").textContent=s;}
class CombatScene extends Phaser.Scene{
 constructor(){super("C1D3Combined");this.towerViews=[];this.towerMounts=new Map();this.enemyViews=new Map();this.soldierViews=new Map();this.accumulator=0;this.fxFires=0;this.p03Actors=new Map();}
 preload(){
  this.load.on("loaderror",file=>feedback("Error cargando patrimonio C1-C: "+file.key));
  preloadM03Illustrations(this);
  for(const meta of TOWER_ART_V2)this.load.svg(meta.assetId,
   "../c1d4r-combat/"+meta.url.replace(/^\.\//,""),{width:360,height:420});
 }
 create(){
  for(const info of CAST){
   const atlas=createP03Atlas(info.actorId);
   registerP03Atlas(this,atlas);
   this.p03Actors.set(info.actorId,{info,atlas,scale:Math.min(.83,
    (atlas.actor.heightWorld??info.heightWorld)/(info.kind==="hound"?114:171)*.70)});
  }
  this.mapView=mountM01WorldV3(this,MAP,{palette:"viva"});
  this.shots=new SniperShotPresenter(this,{variant:"A",depth:35000});
  assert(this.mapView.plan.sockets.length===8,"socket count");
  this.selection=this.add.circle(0,0,51,0,0).setStrokeStyle(4,0xf5d484).setDepth(45000);
  this.input.on("pointerdown",p=>{
   if(rallyMode){
    const result=WORLD.setInfantryRally(chosenSocket,p.x,p.y);
    feedback(result.ok?"Nueva posición del escuadrón: los soldados seguirán el camino.":"Punto fuera del alcance del cuartel.");
    rallyMode=false;updatePanel();return;
   }
   const nearest=this.mapView.plan.sockets.map((s,index)=>({index,d:Math.hypot(p.x-s.world.x,p.y-s.world.y)})).sort((a,b)=>a.d-b.d)[0];
   if(nearest&&nearest.d<=55){chosenSocket=nearest.index;this.drawTowers();updatePanel();}
  });
  this.drawTowers();this.updateHud();
  $("render").textContent=this.game.renderer?.gl instanceof WebGL2RenderingContext?"WebGL2 real":"ERROR: WebGL2";
  showBestScore();
  window.__SEMANTROPIC_C1D5={world:WORLD,economy:WORLD.economy,scene:this,
   stage:"G5_first_playable_M01",nav:"V5_133_nodes_Dijkstra",
   records:"isolated_Phaser_localStorage",
   art:{maps:"M03",towers:"T04",actors:"P03",source:"C1C_PR12",realCombat:true,originalSVG:true},
   diagnostics:()=>({towers:this.towerMounts.size,enemies:this.enemyViews.size,
    soldiers:this.soldierViews.size,fxFires:this.fxFires,shots:this.shots.diagnostics()})};
  this.events.once("shutdown",()=>{this.shots.destroy();this.mapView.destroy();});
  SCENE=this;wireControls();feedback("Construye Infantería y Francotiradores. Ambos combaten realmente en M01.");
 }


 drawTowers(){
  for(const mount of this.towerMounts.values())this.shots.accept({type:"tower_sold",entityId:mount.id});
  this.towerViews.forEach(x=>x.destroy());this.towerViews=[];this.towerMounts.clear();
  for(const [index,socket] of this.mapView.plan.sockets.entries()){
   const tower=WORLD.economy.getTower(index);
   this.mapView.setSocketVisualState(socket.socketId,tower?"occupied":"empty");
   if(!tower)continue;
   const meta=t04ArtFor(tower.family,tower.level);
   if(!meta)throw Error("C1-D5R protected T04 tower not found for "+tower.family+"/"+tower.level);
   const sprite=this.add.image(socket.world.x,socket.world.y,meta.assetId)
    .setOrigin(meta.footAnchor.x,meta.footAnchor.y).setScale(meta.worldScaleProposal).setDepth(socket.world.y-2);
   this.towerViews.push(sprite);
   const mount={id:tower.id,meta,sprite,source:"T04_PR12",operator:null,muzzleLocal:meta.muzzleLocal};
   if(tower.family==="sniper"){
    // Exactly C1-C: original P03 operator rig over the unchanged T04 composite.
    // NO extra T07 rifleMounted (the user's screenshot already defines the gun's appearance).
    const point=projectT04Point(sprite,meta,"operatorAnchorLocal");
    const a=this.p03Actors.get("sniper_operator");
    const operator=this.add.image(point.x,point.y,a.atlas.atlasKey,"idle-0")
     .setOrigin(a.info.footAnchor.x,a.info.footAnchor.y).setScale(a.scale).setDepth(point.y+3);
    this.towerViews.push(operator);
    mount.operator=operator;mount.operatorState="idle";mount.operatorUntil=0;
    mount.operatorAtlas="P03";mount.addedRifleLayers=0;
   }
   this.towerMounts.set(tower.id,mount);
  }
  this.selection.setPosition(this.mapView.plan.sockets[chosenSocket].world.x,
   this.mapView.plan.sockets[chosenSocket].world.y);
 }
 frame(state){
  const count=ANIMATIONS[state]?.frames??ANIMATIONS.idle.frames;
  return state+"-"+(Math.floor(WORLD.seconds*(ANIMATIONS[state]?.fps??5))%count);
 }
 makeActor(kind,x,y){
  const legacy=this.p03Actors.get(kind);
  if(!legacy)throw Error("C1-D5R unknown original P03 actor "+kind);
  const h=legacy.info.heightWorld;
  const sprite=this.add.image(0,0,legacy.atlas.atlasKey,"idle-0")
   .setOrigin(legacy.info.footAnchor.x,legacy.info.footAnchor.y).setScale(legacy.scale);
  const shadow=this.add.ellipse(0,1,legacy.info.kind==="hound"?38:33,9,0x183b3b,.38);
  const back=this.add.rectangle(0,-h-6,35,5,0x261d27);
  const hp=this.add.rectangle(-17.5,-h-6,35,5,0x7ce4a9).setOrigin(0,.5);
  const view=this.add.container(x,y,[shadow,sprite,back,hp]).setDepth(y+6);
  return {view,sprite,hp,hitUntil:0,artist:"P03_PR12"};
 }
 drawEnemies(){
  const ids=new Set();
  for(const e of WORLD.actors){
   ids.add(e.id);
   let v=this.enemyViews.get(e.id);
   if(!v){v=this.makeActor(e.type,e.x,e.y);this.enemyViews.set(e.id,v);}
   v.view.setPosition(e.x,e.y).setDepth(e.y+6);
   v.sprite.setFrame(this.frame(v.hitUntil>WORLD.seconds?"hit":e.blockedBy?"blocked":"walk"));
   v.sprite.setFlipX(Math.cos(e.heading)<0);
   v.hp.setScale(Math.max(0,e.life/e.maxLife),1);
  }
  for(const [id,v] of this.enemyViews)if(!ids.has(id)){v.view.destroy();this.enemyViews.delete(id);}
 }
 drawSoldiers(){
  const ids=new Set();
  for(const u of WORLD.soldiers){
   ids.add(u.id);let v=this.soldierViews.get(u.id);
   if(!v){v=this.makeActor("infantry_recruit",u.x,u.y);this.soldierViews.set(u.id,v);}
   v.view.setPosition(u.x,u.y).setDepth(u.y+6).setVisible(u.hp>0);
   const st=u.windup>0?"attackWindup":u.state==="moving"?"walk":"idle";
   v.sprite.setFrame(this.frame(st));v.hp.setScale(Math.max(0,u.hp/u.maxHp),1);
  }
  for(const [id,v] of this.soldierViews)if(!ids.has(id)){v.view.destroy();this.soldierViews.delete(id);}
  for(const mount of this.towerMounts.values())if(mount.operator)
   mount.operator.setFrame(this.frame(WORLD.seconds<mount.operatorUntil?mount.operatorState:"idle"));
 }
 adaptHistoricShot(ev){
  // Presentation-only translation. Gameplay bullet origin remains unchanged.
  if(!["attack_windup","attack_fire","hit_applied","entity_die","entity_escape","scene_reset"].includes(ev.type))return null;
  if(!["attack_windup","attack_fire"].includes(ev.type))return ev;
  const mount=this.towerMounts.get(ev.entityId);
  if(!mount||mount.meta.family!=="sniper")return null;
  const muzzle=projectT04Point(mount.sprite,mount.meta,"muzzleLocal");
  const target=WORLD.enemies.get(ev.targetId);
  const targetWorld=ev.payload?.targetWorld??(target?{x:target.x,y:target.y}:null);
  return {...ev,payload:{...(ev.payload??{}),muzzleWorld:muzzle,targetWorld}};
 }
 acceptVisualEvents(events){
  for(const ev of events){
   const visual=this.adaptHistoricShot(ev);
   if(visual&&this.shots.accept(visual)&&ev.type==="attack_fire")this.fxFires++;
   if(ev.type==="hit_applied"&&this.enemyViews.has(ev.entityId))
    this.enemyViews.get(ev.entityId).hitUntil=WORLD.seconds+.23;
   if(["attack_fire","attack_windup"].includes(ev.type)){
    const mount=this.towerMounts.get(ev.entityId);
    if(mount?.operator){
     mount.operatorState=ev.type==="attack_fire"?"attack":"attackWindup";
     mount.operatorUntil=WORLD.seconds+.25;
    }
   }
  }
 }
 updateHud(){
  const s=WORLD.snapshot;
  $("coins").textContent=String(s.gold);$("lives").textContent=String(s.lives);
  $("wave").textContent=s.wave+"/5";$("kills").textContent=String(s.kills);
  $("leaks").textContent=String(s.escaped);
  $("state").textContent=s.ended?(s.won?"VICTORIA":"DERROTA"):s.paused?"PAUSA":s.active?"OLEADA EN CURSO":"PREPARACIÓN";
  $("waveStart").disabled=s.active||s.paused||s.ended||s.wave>=5;
  $("pause").disabled=s.ended;$("pause").textContent=s.paused?"Reanudar":"Pausar";
 }
 reactEvents(events){
  this.acceptVisualEvents(events);
  for(const e of events){
   if(e.type==="hit_applied"&&e.worldPosition&&String(e.bulletId??"").startsWith("melee:")){
    const flash=this.add.circle(e.worldPosition.x,e.worldPosition.y,10,0xffd274,.7).setDepth(32000);
    this.tweens.add({targets:flash,alpha:0,scale:2.2,duration:160,onComplete:()=>flash.destroy()});
   }else if(e.type==="entity_die")feedback("Orco/Perro eliminado · recompensa única +"+e.bounty+" oro");
   else if(e.type==="entity_escape")feedback("Fuga: −2 vidas.");
   else if(e.type==="wave_clear")feedback("Oleada "+e.wave+" superada. Prepara la siguiente.");
   else if(e.type==="campaign_map_win")feedback("Victoria de prueba: las cinco oleadas terminadas.");
   else if(e.type==="defeat")feedback("Derrota: el núcleo quedó sin vidas.");
   else if(e.type==="soldier_attack_hit")feedback("Infantería: golpe cuerpo a cuerpo aplicado en el core.");
   else if(e.type==="soldier_die")feedback("Soldado caído temporalmente; respawn programado.");
   else if(e.type==="soldier_respawn")feedback("Soldado reingresó al combate.");
  }
 }
 update(_time,delta){
  if(!WORLD||WORLD.paused||WORLD.ended){
   if(WORLD?.ended)showEndResult();
   this.updateHud();return;
  }
  this.accumulator+=Math.min(delta/1000,.15);
  const step=1/60;let steps=0;
  while(this.accumulator+1e-9>=step&&steps<9){
   const events=WORLD.tick(step);this.reactEvents(events);this.accumulator-=step;steps++;
  }
  if(steps>=9)this.accumulator=0;
  this.drawEnemies();this.drawSoldiers();this.updateHud();
  if(WORLD.ended)showEndResult();
  if(WORLD.tickNumber%12===0)updatePanel();
 }
}
function updatePanel(){
 if(!WORLD)return;
 const economy=WORLD.economy,tower=economy.getTower(chosenSocket),spec=selectedFamily();
 $("slot").textContent=(chosenSocket+1)+"/8";
 const rally=$("rally");
 rally.hidden=!(tower?.family==="infantry");
 rally.disabled=!(tower?.family==="infantry")||WORLD.ended;
 rally.textContent=rallyMode?"Toca camino":"↗ Reunión";
 $("installed").textContent=tower?tower.family+" · nivel "+tower.level:"Plataforma vacía";
 const q=economy.quote(chosenSocket,spec),up=economy.quoteUpgrade(chosenSocket),sell=economy.quoteSell(chosenSocket);
 $("buy").disabled=!q.ok;$("buy").textContent=window.innerWidth<1000
  ?"Construir "+(spec==="sniper"?"140":"95")
  :"Construir "+(spec==="sniper"?"Francotirador 140":"Infantería 95");
 $("upgrade").disabled=!up.ok;$("upgrade").textContent=(window.innerWidth<1000?"↑ ":"Mejorar ")+(up.cost||"");
 $("sell").disabled=!sell.ok;$("sell").textContent=(window.innerWidth<1000?"$ ":"Vender ")+(sell.refund||"");
}
function showBestScore(){
 let best=null;try{best=m01ReadRecord(window.localStorage);}catch{}
 const el=$("record");if(el)el.textContent=best?"Récord: "+("★".repeat(best.stars))+" · "+best.escapes+" fugas":"Récord: sin completar";
}
function showEndResult(){
 if(resultShown||!WORLD?.ended)return;
 resultShown=true;
 const result=m01Result(WORLD.snapshot);
 let storage=null;try{storage=window.localStorage;}catch{}
 const saved=result.outcome==="victory"?m01SaveVictory(storage,result):
  {written:false,best:m01ReadRecord(storage)};
 $("resultTitle").textContent=result.outcome==="victory"?"¡Mapa 01 completado!":"Defensa derrotada";
 $("resultStars").textContent=result.outcome==="victory"?"★".repeat(result.stars)+"☆".repeat(3-result.stars):"Sin estrellas";
 $("resultDetail").textContent=result.outcome==="victory"?
  "Superaste las 5 oleadas · "+result.kills+" bajas · "+result.escapes+" fugas · "+result.lives+"/100 vidas.":
  "Oleada "+result.completedWaves+"/5 · "+result.kills+" bajas · "+result.escapes+" fugas.";
 $("resultSaved").textContent=result.outcome==="victory"?
  (saved.written?"Récord guardado únicamente para esta versión Phaser.":"Victoria válida. Almacenamiento local no disponible.")+
    " Regla: 3★ hasta 5 fugas; 2★ hasta 25 (provisional V5).":
    "No se registra progreso por derrota; vuelve a intentar otra estrategia.";
 $("results").hidden=false;showBestScore();
}
function selectedFamily(){return $("family").value;}
function trade(method,...args){
 const out=WORLD.economy[method](...args);
 feedback(out.ok?"Operación "+method+" correcta.":out.message);
 if(out.ok){WORLD.syncTowers();SCENE.drawTowers();}
 updatePanel();SCENE.updateHud();
}
function wireControls(){
 $("prev").onclick=()=>{chosenSocket=(chosenSocket+7)%8;SCENE.drawTowers();updatePanel();};
 $("next").onclick=()=>{chosenSocket=(chosenSocket+1)%8;SCENE.drawTowers();updatePanel();};
 $("family").onchange=updatePanel;
 $("buy").onclick=()=>trade("build",chosenSocket,selectedFamily());
 $("upgrade").onclick=()=>trade("upgrade",chosenSocket);
 $("sell").onclick=()=>trade("sell",chosenSocket);
 $("waveStart").onclick=()=>{if(WORLD.startWave())feedback("Oleada "+WORLD.wave+" iniciada: enemigos y disparos reales.");SCENE.updateHud();};
 $("pause").onclick=()=>{if(WORLD.paused)WORLD.resume();else WORLD.pause();SCENE.updateHud();};
 $("restart").onclick=()=>window.location.reload();
 $("rally").onclick=()=>{
  const t=WORLD.economy.getTower(chosenSocket);
  if(!t||t.family!=="infantry"||WORLD.ended){feedback("Selecciona primero un cuartel.");return;}
  rallyMode=!rallyMode;updatePanel();
  feedback(rallyMode?"Toca un punto del camino, dentro del alcance del cuartel.":"Cambio de punto de reunión cancelado.");
 };
 $("resultRestart").onclick=()=>window.location.reload();
 updatePanel();
}
async function start(){
 try{
  assert(window.Phaser?.VERSION==="4.2.1","Se requiere Phaser 4.2.1");
  if(TOWER_ART_V2.length!==4)throw Error("C1-D5 requires exactly four original T04 tower versions");
  const [m,c]=await Promise.all(["../../data/maps.v5.json","../../data/campaign140.v5.json"].map(async u=>{
   const res=await fetch(u,{cache:"no-store"});assert(res.ok,"Missing "+u);return res.json();
  }));
  MAP=m[0];validateM01(MAP);CAMPAIGN=c.maps[0];WORLD=new M01CombatWithInfantry(MAP,CAMPAIGN);
  const canvas=document.createElement("canvas"),gl=canvas.getContext("webgl2",{alpha:false,antialias:true});
  assert(gl&&gl instanceof WebGL2RenderingContext,"WebGL2 requerido");
  new Phaser.Game({type:Phaser.WEBGL,canvas,context:gl,parent:"stage",width:1280,height:768,
    backgroundColor:"#183b37",antialias:true,audio:{noAudio:true},
    scale:{mode:(window.innerWidth<1000&&window.innerWidth>window.innerHeight)
      ?Phaser.Scale.ENVELOP:Phaser.Scale.FIT,
      autoCenter:Phaser.Scale.CENTER_BOTH,width:1280,height:768},
    scene:[CombatScene]});
 }catch(error){console.error(error);feedback("BLOQUEANTE C1-D5: "+error.message);}
}
start();
