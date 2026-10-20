/** Semantropic C1-D2: Phaser WebGL2 actual Sniper combat, visuals deliberately provisional. */
import {M01CombatWorld} from "../core-c1d/m01-combat-world.mjs";
import {validateM01} from "../maps-visual/m01/renderer.mjs";
import {preloadM03Illustrations,mountM01WorldV3} from "../maps-visual/m01/m03/renderer-v3.mjs";
import {TOWER_ART_V2,validateTowerArtV2} from "../towers-visual/catalog.mjs";
const $=id=>document.getElementById(id);
const assert=(c,m)=>{if(!c)throw Error("C1-D2: "+m);};
let MAP,CAMPAIGN,WORLD,SCENE,chosenSocket=0;
function feedback(s){$("feedback").textContent=s;}
class CombatScene extends Phaser.Scene{
 constructor(){super("C1D2Combat");this.towerViews=[];this.enemyViews=new Map();this.accumulator=0;}
 preload(){
  this.load.on("loaderror",f=>feedback("Error cargando "+f.key));
  preloadM03Illustrations(this);
  for(const meta of TOWER_ART_V2)this.load.svg(meta.assetId,meta.url,{width:360,height:420});
 }
 create(){
  this.mapView=mountM01WorldV3(this,MAP,{palette:"viva"});
  assert(this.mapView.plan.sockets.length===8,"socket count");
  this.selection=this.add.circle(0,0,51,0,0).setStrokeStyle(4,0xf5d484).setDepth(45000);
  this.input.on("pointerdown",p=>{
   const nearest=this.mapView.plan.sockets.map((s,index)=>({index,d:Math.hypot(p.x-s.world.x,p.y-s.world.y)})).sort((a,b)=>a.d-b.d)[0];
   if(nearest&&nearest.d<=55){chosenSocket=nearest.index;this.drawTowers();updatePanel();}
  });
  this.drawTowers();this.updateHud();
  $("render").textContent=this.game.renderer?.gl instanceof WebGL2RenderingContext?"WebGL2 real":"ERROR: WebGL2";
  window.__SEMANTROPIC_C1D2={world:WORLD,economy:WORLD.economy,scene:this,scope:"REAL_SNIPER_COMBAT_M01_ONLY"};
  SCENE=this;wireControls();feedback("Construye Francotiradores y comienza la oleada 1/5. La Infantería todavía no combate.");
 }
 drawTowers(){
  for(const v of this.towerViews)v.destroy();
  this.towerViews.length=0;
  for(const [index,socket] of this.mapView.plan.sockets.entries()){
   const tower=WORLD.economy.getTower(index);
   this.mapView.setSocketVisualState(socket.socketId,tower?"occupied":"empty");
   if(!tower)continue;
   const meta=TOWER_ART_V2.find(m=>m.family===tower.family&&m.level===tower.level);
   if(!meta)continue;
   this.towerViews.push(this.add.image(socket.world.x,socket.world.y,meta.assetId)
     .setOrigin(meta.footAnchor.x,meta.footAnchor.y).setScale(meta.worldScaleProposal)
     .setDepth(socket.world.y-1));
  }
  this.selection.setPosition(this.mapView.plan.sockets[chosenSocket].world.x,this.mapView.plan.sockets[chosenSocket].world.y);
 }
 drawEnemies(){
  const ids=new Set();
  for(const e of WORLD.actors){
   ids.add(e.id);let view=this.enemyViews.get(e.id);
   if(!view){
    const body=this.add.ellipse(0,0,e.type==="hound"?32:28,e.type==="hound"?18:42,
      e.type==="hound"?0xbc8254:0x64775d).setStrokeStyle(2,0xead5a8);
    const hpBack=this.add.rectangle(0,-35,38,6,0x321718);
    const hp=this.add.rectangle(-19,-35,38,6,0x71d48d).setOrigin(0,.5);
    const label=this.add.text(0,e.type==="hound"?-5:-9,e.type==="hound"?"H":"O",
      {font:"bold 13px Arial",color:"#fff4d1"}).setOrigin(.5);
    view=this.add.container(e.x,e.y,[body,hpBack,hp,label]).setDepth(e.y+5);
    this.enemyViews.set(e.id,view);view.hpBar=hp;
   }
   view.setPosition(e.x,e.y).setDepth(e.y+5);
   view.hpBar.setScale(Math.max(0,e.life/e.maxLife),1);
  }
  for(const [id,v] of this.enemyViews)if(!ids.has(id)){v.destroy();this.enemyViews.delete(id);}
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
  for(const e of events){
   if(e.type==="hit_applied"&&e.worldPosition){
    const flash=this.add.circle(e.worldPosition.x,e.worldPosition.y,10,0xffd274,.7).setDepth(32000);
    this.tweens.add({targets:flash,alpha:0,scale:2.2,duration:160,onComplete:()=>flash.destroy()});
   }else if(e.type==="entity_die")feedback("Orco/Perro eliminado · recompensa única +"+e.bounty+" oro");
   else if(e.type==="entity_escape")feedback("Fuga: −2 vidas.");
   else if(e.type==="wave_clear")feedback("Oleada "+e.wave+" superada. Prepara la siguiente.");
   else if(e.type==="campaign_map_win")feedback("Victoria de prueba: las cinco oleadas terminadas.");
   else if(e.type==="defeat")feedback("Derrota: el núcleo quedó sin vidas.");
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
  this.drawEnemies();this.updateHud();
  if(WORLD.tickNumber%12===0)updatePanel();
 }
}
function updatePanel(){
 if(!WORLD)return;
 const economy=WORLD.economy,tower=economy.getTower(chosenSocket),spec=selectedFamily();
 $("slot").textContent=(chosenSocket+1)+"/8";
 $("installed").textContent=tower?tower.family+" · nivel "+tower.level:"Plataforma vacía";
 const q=economy.quote(chosenSocket,spec),up=economy.quoteUpgrade(chosenSocket),sell=economy.quoteSell(chosenSocket);
 $("buy").disabled=!q.ok;$("buy").textContent="Construir "+(spec==="sniper"?"Francotirador 140":"Infantería 95");
 $("upgrade").disabled=!up.ok;$("upgrade").textContent="Mejorar "+(up.cost||"");
 $("sell").disabled=!sell.ok;$("sell").textContent="Vender "+(sell.refund||"");
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
 updatePanel();
}
async function start(){
 try{
  assert(window.Phaser?.VERSION==="4.2.1","Se requiere Phaser 4.2.1");
  validateTowerArtV2();
  const [m,c]=await Promise.all(["../../data/maps.v5.json","../../data/campaign140.v5.json"].map(async u=>{
   const res=await fetch(u,{cache:"no-store"});assert(res.ok,"Missing "+u);return res.json();
  }));
  MAP=m[0];validateM01(MAP);CAMPAIGN=c.maps[0];WORLD=new M01CombatWorld(MAP,CAMPAIGN);
  const canvas=document.createElement("canvas"),gl=canvas.getContext("webgl2",{alpha:false,antialias:true});
  assert(gl&&gl instanceof WebGL2RenderingContext,"WebGL2 requerido");
  new Phaser.Game({type:Phaser.WEBGL,canvas,context:gl,parent:"stage",width:1280,height:768,
    backgroundColor:"#183b37",antialias:true,audio:{noAudio:true},
    scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:1280,height:768},
    scene:[CombatScene]});
 }catch(error){console.error(error);feedback("BLOQUEANTE: "+error.message);}
}
start();
