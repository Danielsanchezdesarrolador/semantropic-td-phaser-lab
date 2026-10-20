/** Semantropic C1-D4: Phaser WebGL2 actual Infantry + Sniper combat, visuals deliberately provisional. */
import {M01CombatWithInfantry} from "../core-c1d/m01-infantry-combat.mjs";
import {validateM01} from "../maps-visual/m01/renderer.mjs";
import {preloadM06Illustrations,mountM01WorldV6} from "../maps-visual/m01/m06/renderer-v6.mjs";
import {TOWER_ART_V2,validateTowerArtV2,getSniperSingleRifleLayers,projectSourceAnchor} from "../towers-visual/catalog.mjs";
import {SniperShotPresenter} from "../towers-visual/sniper-vfx.mjs";
import {adaptSniperCoreEvent} from "../towers-visual/t07-core-visual-adapter.mjs";
import {preloadP06,registerP06,p06ItemFor,P06_STATES} from "../actors-visual/p06-atlas-loader.mjs";
const $=id=>document.getElementById(id);
const assert=(c,m)=>{if(!c)throw Error("C1-D2: "+m);};
let MAP,CAMPAIGN,WORLD,SCENE,chosenSocket=0;
function feedback(s){$("feedback").textContent=s;}
class CombatScene extends Phaser.Scene{
 constructor(){super("C1D3Combined");this.towerViews=[];this.towerMounts=new Map();this.enemyViews=new Map();this.soldierViews=new Map();this.accumulator=0;this.fxFires=0;}
 preload(){
  this.load.on("loaderror",f=>feedback("Error cargando "+f.key));
  preloadM06Illustrations(this);preloadP06(this);
  for(const meta of TOWER_ART_V2){
   this.load.svg(meta.assetId,meta.url,{width:360,height:420});
   if(meta.family==="sniper"){
    const a=getSniperSingleRifleLayers(meta);
    for(const [layer,url] of Object.entries({shadow:a.shadowFoot,back:a.backStructure,rifle:a.rifleMounted,front:a.frontRail}))
      this.load.svg("d4/"+meta.level+"/"+layer,url,{width:360,height:420});
   }
  }
 }
 create(){
  registerP06(this);
  this.mapView=mountM01WorldV6(this,MAP,{palette:"viva",treatment:"atmosfera",reducedMotion:true});
  this.shots=new SniperShotPresenter(this,{variant:"A",depth:35000});
  assert(this.mapView.plan.sockets.length===8,"socket count");
  this.selection=this.add.circle(0,0,51,0,0).setStrokeStyle(4,0xf5d484).setDepth(45000);
  this.input.on("pointerdown",p=>{
   const nearest=this.mapView.plan.sockets.map((s,index)=>({index,d:Math.hypot(p.x-s.world.x,p.y-s.world.y)})).sort((a,b)=>a.d-b.d)[0];
   if(nearest&&nearest.d<=55){chosenSocket=nearest.index;this.drawTowers();updatePanel();}
  });
  this.drawTowers();this.updateHud();
  $("render").textContent=this.game.renderer?.gl instanceof WebGL2RenderingContext?"WebGL2 real":"ERROR: WebGL2";
  window.__SEMANTROPIC_C1D4={world:WORLD,economy:WORLD.economy,scene:this,
   art:{maps:"M06",towers:"T07",actors:"P06",realPng:true,weaponOwner:"TORRES"},
   diagnostics:()=>({towers:this.towerMounts.size,enemies:this.enemyViews.size,
    soldiers:this.soldierViews.size,fxFires:this.fxFires,shots:this.shots.diagnostics()})};
  this.events.once("shutdown",()=>{this.shots.destroy();this.mapView.destroy();});
  SCENE=this;wireControls();feedback("Construye Infantería y Francotiradores. Ambos combaten realmente en M01.");
 }

 drawTowers(){
  for(const mount of this.towerMounts.values())this.shots.accept({type:"tower_sold",entityId:mount.id});
  this.towerViews.forEach(o=>o.destroy());this.towerViews=[];this.towerMounts.clear();
  for(const [index,socket] of this.mapView.plan.sockets.entries()){
   const t=WORLD.economy.getTower(index);
   this.mapView.setSocketVisualState(socket.socketId,t?"occupied":"empty");
   if(!t)continue;
   const meta=TOWER_ART_V2.find(m=>m.family===t.family&&m.level===t.level);
   if(!meta)continue;
   if(meta.family!=="sniper"){
    const o=this.add.image(socket.world.x,socket.world.y,meta.assetId)
     .setOrigin(meta.footAnchor.x,meta.footAnchor.y).setScale(meta.worldScaleProposal).setDepth(socket.world.y-4);
    this.towerViews.push(o);this.towerMounts.set(t.id,{id:t.id,meta,sprite:o});continue;
   }
   const layers=getSniperSingleRifleLayers(meta),parts={};
   if(!layers.singleRifle)throw Error("Double rifle blocked");
   for(const [name,depth] of [["shadow",-7],["back",-5],["rifle",2],["front",3]]){
    const o=this.add.image(socket.world.x,socket.world.y,"d4/"+meta.level+"/"+name)
     .setOrigin(meta.footAnchor.x,meta.footAnchor.y).setScale(meta.worldScaleProposal).setDepth(socket.world.y+depth);
    this.towerViews.push(o);parts[name]=o;
   }
   const slot=projectSourceAnchor(parts.back,meta,"operatorAnchorLocal");
   const actor=p06ItemFor("sniper_operator");
   const op=this.add.sprite(slot.x,slot.y,actor.atlasKey,"idle-0")
    .setOrigin(.5,.92).setScale(80/208).setDepth(socket.world.y-1);
   this.towerViews.push(op);
   this.towerMounts.set(t.id,{id:t.id,meta,sprite:parts.back,operator:op,operatorState:"idle",
    operatorUntil:0,rifleCount:1});
  }
  this.selection.setPosition(this.mapView.plan.sockets[chosenSocket].world.x,this.mapView.plan.sockets[chosenSocket].world.y);
 }
 frame(state){const count=P06_STATES[state]||4;return state+"-"+(Math.floor(WORLD.seconds*9)%count);}
 makeActor(kind,x,y){
  const item=p06ItemFor(kind),h=item.worldHeight;
  const sprite=this.add.sprite(0,0,item.atlasKey,"idle-0").setOrigin(.5,.92).setScale(h/208);
  const bar=this.add.rectangle(0,-h-6,35,5,0x261d27);
  const hp=this.add.rectangle(-17.5,-h-6,35,5,0x7ce4a9).setOrigin(0,.5);
  return {view:this.add.container(x,y,[sprite,bar,hp]).setDepth(y+6),sprite,hp,hitUntil:0};
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
 acceptVisualEvents(events){
  for(const ev of events){
   const presentation=adaptSniperCoreEvent(ev,id=>this.towerMounts.get(id)||null);
   if(presentation&&this.shots.accept(presentation)&&ev.type==="attack_fire")this.fxFires++;
   if(ev.type==="hit_applied"&&this.enemyViews.has(ev.entityId))this.enemyViews.get(ev.entityId).hitUntil=WORLD.seconds+.23;
   if((ev.type==="attack_fire"||ev.type==="attack_windup")&&this.towerMounts.has(ev.entityId)){
    const mount=this.towerMounts.get(ev.entityId);
    if(mount.operator){mount.operatorState=ev.type==="attack_fire"?"attack":"attackWindup";mount.operatorUntil=WORLD.seconds+.25;}
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
  if(!WORLD||WORLD.paused||WORLD.ended){this.updateHud();return;}
  this.accumulator+=Math.min(delta/1000,.15);
  const step=1/60;let steps=0;
  while(this.accumulator+1e-9>=step&&steps<9){
   const events=WORLD.tick(step);this.reactEvents(events);this.accumulator-=step;steps++;
  }
  if(steps>=9)this.accumulator=0;
  this.drawEnemies();this.drawSoldiers();this.updateHud();
  if(WORLD.tickNumber%12===0)updatePanel();
 }
}
function updatePanel(){
 if(!WORLD)return;
 const economy=WORLD.economy,tower=economy.getTower(chosenSocket),spec=selectedFamily();
 $("slot").textContent=(chosenSocket+1)+"/8";
 $("installed").textContent=tower?tower.family+" · nivel "+tower.level:"Plataforma vacía";
 const q=economy.quote(chosenSocket,spec),up=economy.quoteUpgrade(chosenSocket),sell=economy.quoteSell(chosenSocket);
 $("buy").disabled=!q.ok;$("buy").textContent=window.innerWidth<1000
  ?"Construir "+(spec==="sniper"?"140":"95")
  :"Construir "+(spec==="sniper"?"Francotirador 140":"Infantería 95");
 $("upgrade").disabled=!up.ok;$("upgrade").textContent=(window.innerWidth<1000?"↑ ":"Mejorar ")+(up.cost||"");
 $("sell").disabled=!sell.ok;$("sell").textContent=(window.innerWidth<1000?"$ ":"Vender ")+(sell.refund||"");
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
 updatePanel();
}
async function start(){
 try{
  assert(window.Phaser?.VERSION==="4.2.1","Se requiere Phaser 4.2.1");
  validateTowerArtV2();
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
 }catch(error){console.error(error);feedback("BLOQUEANTE: "+error.message);}
}
start();
