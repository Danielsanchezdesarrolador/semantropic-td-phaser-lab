/** Semantropic C1-D7: Phaser WebGL2 actual Infantry + Sniper combat, visuals deliberately provisional. */
import {M01CombatWithInfantryA3 as M01CombatWithInfantry,INFANTRY_LVLS} from "../core-c1d/m01-infantry-combat-a3.mjs";
import {c1d7MenuDTO,c1d7ApplyIntent,c1d7WorldToClient,c1d7NodePlacement} from "../core-c1d/c1d7-contextual-intents.mjs";
import {m01ReadRecord,m01SaveVictory,m01Result} from "../core-c1d/m01-results-phaser.mjs";
import {validateM01} from "../maps-visual/m01/renderer.mjs";
import {preloadM07Illustrations} from "../maps-visual/m01/m07/renderer-v7.mjs";
import {mountM01WorldR7} from "../maps-visual/m01/r7/renderer-r7.mjs?layout=hf1";
import {TOWER_ART_V2,validateTowerArtV2,projectSourceAnchor} from "../towers-visual/catalog.mjs";
import {SniperShotPresenter} from "../towers-visual/sniper-vfx.mjs";
import {diagnoseT10Muzzle} from "../towers-visual/t10/sniper-muzzle-contract.mjs";
import {projectMountedT10Muzzle,diagnoseMountedT10Muzzle} from "../towers-visual/t10/premium-runtime-muzzle.mjs";
import {projectP03RifleMuzzle,diagnoseP03VersusT04Muzzles} from "../towers-visual/t10/p03-operator-rifle-muzzle.mjs";
import {sniperOperatorLayers,orientSniperOperator} from "../towers-visual/t10/sniper-operator-tracking.mjs";
import {CAST,ANIMATIONS} from "../../art/actors/atlas-source.mjs";
import {createP03Atlas,registerP03Atlas} from "../../art/actors/p03-rig.mjs";
import {isolateP03Atlas} from "../towers-visual/t10/p03-atlas-isolation.mjs";
import {preloadP07,registerP07,p07ItemFor,P07_STATES} from "../actors-visual/p07-atlas-loader.mjs";
import {preloadP08,registerP08,p08VisualForSoldierLevel,p08VisualForEnemy,P08AnimationController,P08_IMAGES} from "../actors-visual/p08/p08-loader.mjs";
import {registerU04AllyHD} from "../actors-visual/u04-ally-hd.mjs";
import {getContextMenuVisualSpec} from "../towers-visual/t09/spec.mjs";
import {mountT09Presenter} from "../towers-visual/t09/presenter.mjs";
import {C1D8CombatMotion,applyC1D8Pose,spawnC1D8Impact} from "../c1d8-b3-combat/motion.mjs";
const REVIEW=new URLSearchParams(location.search);
const USE_P08_ACTORS=REVIEW.get("actors")!=="p03";
const USE_P03_ACTORS=!USE_P08_ACTORS;
const USE_T09_NODES=REVIEW.get("menu")!=="g1";
const USE_EXPERIMENTAL_OPERATOR=REVIEW.get("operator")==="p07";  // opt-in ONLY until approved

const $=id=>document.getElementById(id);
const assert=(c,m)=>{if(!c)throw Error("C1-D2: "+m);};
let MAP,CAMPAIGN,WORLD,SCENE,chosenSocket=0,resultShown=false,rallyMode=false;
let rallySocket=null,rallyAttempts=0,rallySuccesses=0;
let contextIndex=null,contextKey="",menuBusy=false,lastIntentMs=0;
let t09Presenter=null,t09Revision=0;
function feedback(s){$("feedback").textContent=s;}
class CombatScene extends Phaser.Scene{
 constructor(){super("C1D7Nodal");this.towerViews=[];this.towerMounts=new Map();this.enemyViews=new Map();this.soldierViews=new Map();this.accumulator=0;this.fxFires=0;this.p03Actors=new Map();this.p08Animator=new P08AnimationController();this.combatMotion=new C1D8CombatMotion();this.contactFx=0;this.lastRally=null;this.t10FireOrigins=[];this.t10GhostDeaths=new Map();this.t10HeldKills=0;}
 preload(){
  this.load.on("loaderror",file=>feedback("Recurso visual M07/T08/P07 ausente: "+file.key));
  preloadM07Illustrations(this);
  preloadP07(this);
  preloadP08(this);
  // U05: Rasterize original vector Infantry I/II at 2x without changing art or gameplay.
  for(const meta of TOWER_ART_V2){
   const rasterDensity=meta.family==="infantry"?2:1;
   this.load.svg(meta.assetId,meta.url,{width:360*rasterDensity,height:420*rasterDensity});
  }
   // Existing original T08 structural master, T04 architecture WITHOUT its second rifle.
   // Only used for candidate P03 operator-primary option; original T04 stays unchanged.
   for(const level of [1,2]){
    this.load.svg('t10-hf2-sniper-structure-'+level,
     new URL('../../art/towers/layers/sniper-'+level+'-structure.svg',import.meta.url).href+(level===1?'?u02ab=hf1':''),{width:1080,height:1260});
    this.load.svg('u02-sniper-front-'+level,
     new URL('../../art/towers/layers/sniper-'+level+'-front.svg',import.meta.url).href,{width:1080,height:1260});
   }
 }
 create(){
  // Keep original P03 as user-approved exact fallback. P07 PNG atlases are loaded
  // and used for warrior/hound/infantry; P07 sniper operator is opt-in ONLY.
  registerP07(this);
  registerP08(this);
  this.u04AllyHD=registerU04AllyHD(this,P08_IMAGES);
  for(const info of CAST){
   const rawAtlas=createP03Atlas(info.actorId);
   // U03: correct P03 sprite-sheet cross-frame visor bleed without editing locked P03 art.
   const atlas=info.actorId==="sniper_operator"?
    isolateP03Atlas(rawAtlas,info.actorId,{density:2}):rawAtlas;
   registerP03Atlas(this,atlas);
   this.p03Actors.set(info.actorId,{info,atlas,scale:Math.min(.83,
    (atlas.actor.heightWorld??info.heightWorld)/(info.kind==="hound"?114:171)*.70)/(atlas.u04Density??1)});
  }
  this.mapView=mountM01WorldR7(this,MAP,{palette:"viva",treatment:"fiel"});
  window.__SEMANTROPIC_VIEWPORT?.bindScene?.(this,1);
  this.shots=new SniperShotPresenter(this,{variant:"A",depth:35000,premium:true});
  assert(this.mapView.plan.sockets.length===8,"socket count");
  this.selection=this.add.circle(0,0,51,0,0).setStrokeStyle(4,0xf5d484).setDepth(45000);
  this.selection.setVisible(false);
  this.rallyRadius=this.add.circle(0,0,130,0x3dd5b1,.09)
   .setStrokeStyle(3,0x60f3d0,.87).setDepth(42000).setVisible(false);
  this.rallyDestination=this.add.circle(0,0,8,0xffeab6,.22)
   .setStrokeStyle(3,0x74ffce).setDepth(46000).setVisible(false);
  this.input.on("pointerdown",p=>{
   if(WORLD?.ended)return;
   const x=p.worldX??p.x,y=p.worldY??p.y;
   if(rallyMode){
    rallyAttempts++;
    const outcome=WORLD.setInfantryRally(rallySocket,x,y);
    if(outcome.ok){
     rallySuccesses++;
     this.lastRally={spotIndex:rallySocket,x:outcome.x,y:outcome.y,nodeId:outcome.nodeId};
     this.rallyDestination.setPosition(outcome.x,outcome.y).setVisible(true);
     feedback("¡Orden confirmada! El escuadrón avanza al punto verde.");
     stopRallySelection(); // keep destination marker, not the input targeting overlay
    }else{
     // Allow another touch: the old implementation always closed after an invalid point.
     feedback(outcome.reason==="out-of-range"?
      "Fuera del círculo verde. Toca otra zona dentro del alcance.":"No se pudo mover. Elige un punto válido.");
     $("rallyStatus").textContent="Destino inválido: vuelve a tocar dentro del círculo.";
    }
    return;
   }
   const nearest=this.mapView.plan.sockets.map((socket,index)=>({
    index,d:Math.hypot(x-socket.world.x,y-socket.world.y)})).sort((a,b)=>a.d-b.d)[0];
   // R4: 80-world-unit coarse-pointer target ~= 40 CSS px in mobile landscape FIT.
   // Nearest socket wins; never changes game collision, routing or tower economy.
   const hitRadius=window.matchMedia?.('(pointer:coarse)').matches?80:55;
   if(nearest&&nearest.d<=hitRadius)openMenu(nearest.index);
   else closeMenu();
  });
  this.drawTowers();this.updateHud();
  $("render").textContent=this.game.renderer?.gl instanceof WebGL2RenderingContext?"WebGL2 real":"ERROR: WebGL2";
  showBestScore();
  window.__SEMANTROPIC_C1D7={world:WORLD,economy:WORLD.economy,scene:this,
   menu:{open:index=>openMenu(index),close:()=>closeMenu(),
    get:()=>({open:contextIndex!==null,index:contextIndex,busy:menuBusy})},
   rally:{get:()=>({active:rallyMode,spotIndex:rallySocket,attempts:rallyAttempts,successes:rallySuccesses,
    destination:this.lastRally,rangeVisible:this.rallyRadius.visible})},
   stage:"G5_first_playable_M01",nav:"V5_133_nodes_Dijkstra",
   records:"isolated_Phaser_localStorage",
   art:{maps:"M07-Q2-FIEL",towers:"T08-HF1-T04",
     actors:USE_P08_ACTORS?"P08_B1_HF1_CANDIDATE":"P03_APPROVED_ROLLBACK",
     nodes:USE_T09_NODES?"T09_HF0":"G1_ROLLBACK",
    source:"C1C_APPROVED",realCombat:true,realPng:true,
    activeOperator:USE_EXPERIMENTAL_OPERATOR?"P07_EXPERIMENTAL":"P03_APPROVED_U04_HD2",
    treatment:"fiel",noVisualRework:true},
   diagnostics:()=>({towers:this.towerMounts.size,enemies:this.enemyViews.size,
     p08Entities:this.p08Animator.entities.size,t09Nodes:t09Presenter?.current?.nodes?.length??0,
     b3:this.combatMotion.diagnostics(),confirmedVisualContacts:this.contactFx,
     t10Fires:this.t10FireOrigins.length,t10PremiumOpticalMuzzle:true,t10RifleAuthority:REVIEW.get("t10hf2")==="legacy"?"T04_LEGACY_COMPARISON":"P03_OPERATOR",
      t10BuildingRifleSuppressed:[...this.towerMounts.values()].filter(m=>m.operatorPrimary).length,
      t10Ghosts:this.t10GhostDeaths.size,t10HeldKills:this.t10HeldKills,
      u02Facing:[...this.towerMounts.values()].filter(m=>m.operatorPrimary).map(m=>({towerId:m.id,facing:m.operatorFacing??"right",targetId:m.operatorTargetId??null,operatorDepth:m.operator?.depth,structureDepth:m.sprite?.depth,frontRailDepth:m.frontRail?.depth})),
    soldiers:this.soldierViews.size,fxFires:this.fxFires,shots:this.shots.diagnostics()})};
  this.events.once("shutdown",()=>{
   stopRallySelection();closeMenu();t09Presenter?.destroy();this.p08Animator.destroy();this.combatMotion.reset();
   for(const g of this.t10GhostDeaths.values())g.timer?.remove?.(false);
    this.t10GhostDeaths.clear();this.shots.destroy();this.mapView.destroy();
  });
  SCENE=this;
  if(USE_T09_NODES)t09Presenter=mountT09Presenter($("app"),{onIntent:intent=>{
   if(contextIndex===null||intent.socketIndex!==contextIndex||intent.revision!==t09Revision)return;
   if(intent.action==="close"){closeMenu();return;}
   if(intent.action==="inspect"){feedback("Consulta de alcance, sin afectar combate.");return;}
   runMenuIntent(intent.action==="set_rally"?"rally":intent.action);
  }});
  wireControls();feedback("U02 A/B: el francotirador sigue objetivos desde la plataforma.");
 }


 drawTowers(){
  for(const mount of this.towerMounts.values())this.shots.accept({type:"tower_sold",entityId:mount.id});
  this.towerViews.forEach(x=>x.destroy());this.towerViews=[];this.towerMounts.clear();
  for(const [index,socket] of this.mapView.plan.sockets.entries()){
   const tower=WORLD.economy.getTower(index);
   this.mapView.setSocketVisualState(socket.socketId,tower?"occupied":"empty");
   if(!tower)continue;
   const meta=TOWER_ART_V2.find(m=>m.family===tower.family&&m.level===tower.level);
   if(!meta)throw Error("C1-D7R protected T04 tower not found for "+tower.family+"/"+tower.level);
   const operatorPrimary=tower.family==="sniper"&&!USE_EXPERIMENTAL_OPERATOR
     &&REVIEW.get("t10hf2")!=="legacy";
    const renderAsset=operatorPrimary?'t10-hf2-sniper-structure-'+tower.level:meta.assetId;
    // Same footprint: raster 720x840 at one-half world scale.
    const svgDensity=operatorPrimary?3:tower.family==="infantry"?2:1;
    const sprite=this.add.image(socket.world.x,socket.world.y,renderAsset)
    .setOrigin(meta.footAnchor.x,meta.footAnchor.y)
    .setScale(meta.worldScaleProposal/svgDensity).setDepth(socket.world.y-2);
   this.towerViews.push(sprite);
   const mount={id:tower.id,meta,sprite,source:operatorPrimary?"T08_T04_STRUCTURE_NO_EMBEDDED_RIFLE":"T08_T04_APPROVED",
     operator:null,muzzleLocal:meta.muzzleLocal,operatorPrimary,renderAsset};
   if(tower.family==="sniper"){
    // Exactly C1-C: original P03 operator rig over the unchanged T04 composite.
    // NO extra T07 rifleMounted (the user's screenshot already defines the gun's appearance).
    const proxy=svgDensity===1?sprite:{x:sprite.x,y:sprite.y,flipX:sprite.flipX,
     flipY:sprite.flipY,scaleX:sprite.scaleX*svgDensity,scaleY:sprite.scaleY*svgDensity};
    const point=projectSourceAnchor(proxy,meta,"operatorAnchorLocal");
    const historic=this.p03Actors.get("sniper_operator"),candidate=p07ItemFor("sniper_operator");
    // The operator was behind the WHOLE tower because depth was point.y.
    // Overlay body above the deck, and only the frontal rail above its boots.
    const layers=sniperOperatorLayers(sprite.depth);
    const shadow=operatorPrimary?this.add.ellipse(point.x,point.y+1,23,7,0x213e3d,.28)
     .setDepth(layers.shadow):null;
    const operator=this.add.image(point.x,point.y,
     USE_EXPERIMENTAL_OPERATOR?candidate.atlasKey:historic.atlas.atlasKey,"idle-0")
     .setOrigin(historic.info.footAnchor.x,historic.info.footAnchor.y).setScale(historic.scale)
     .setDepth(operatorPrimary?layers.operator:point.y+3);
    if(shadow)this.towerViews.push(shadow);
    this.towerViews.push(operator);
    const frontRail=operatorPrimary?this.add.image(socket.world.x,socket.world.y,
      'u02-sniper-front-'+tower.level).setOrigin(meta.footAnchor.x,meta.footAnchor.y)
      .setScale(meta.worldScaleProposal/svgDensity).setDepth(layers.frontRail):null;
    if(frontRail)this.towerViews.push(frontRail);
    mount.operator=operator;mount.frontRail=frontRail;mount.operatorShadow=shadow;
    mount.operatorTargetId=null;mount.operatorFacing="right";
    mount.operatorState="idle";mount.operatorUntil=0;
    mount.operatorAtlas=USE_EXPERIMENTAL_OPERATOR?"P07_UNAPPROVED":"P03_APPROVED";
    mount.addedRifleLayers=0;
   }
   this.towerMounts.set(tower.id,mount);
  }
  this.selection.setPosition(this.mapView.plan.sockets[chosenSocket].world.x,
   this.mapView.plan.sockets[chosenSocket].world.y);
 }
 sniperOperatorFrame(state){
  const a=ANIMATIONS[state]??ANIMATIONS.idle;
  return state+"-"+(Math.floor(WORLD.seconds*a.fps)%a.frames);
 }
 frame(state){
  if(USE_P03_ACTORS)return state+"-"+(Math.floor(WORLD.seconds*(ANIMATIONS[state]?.fps??5))%(ANIMATIONS[state]?.frames??ANIMATIONS.idle.frames));
  const count=P07_STATES[state]??P07_STATES.idle;
  return state+"-"+(Math.floor(WORLD.seconds*(state==="walk"?9:state==="attack"?12:5))%count);
 }
 makeActor(kind,x,y){
  const legacy=this.p03Actors.get(kind),candidate=p07ItemFor(kind);
  const p08=kind==="infantry_recruit"?p08VisualForSoldierLevel(1):p08VisualForEnemy(kind);
  if(!legacy)throw Error("C1-D7 missing original actor "+kind);
  const h=legacy.info.heightWorld;
  const scale=USE_P08_ACTORS&&p08?p08.worldHeight/(kind==="hound"?114:171):
   USE_P03_ACTORS?legacy.scale:Math.min(.83,candidate.worldHeight/(kind==="hound"?114:171)*.70);
  const sourceKey=USE_P08_ACTORS&&p08?p08.atlasKey:USE_P03_ACTORS?legacy.atlas.atlasKey:candidate.atlasKey;
  const hdAlly=USE_P08_ACTORS&&kind==="infantry_recruit";
  const atlasKey=hdAlly?(this.u04AllyHD.get(sourceKey)??sourceKey):sourceKey;
  const renderScale=hdAlly&&atlasKey!==sourceKey?scale/2:scale;
  const origin=USE_P08_ACTORS&&p08?p08.footAnchor:legacy.info.footAnchor;
  const sprite=this.add.image(0,0,atlasKey,"idle-0").setOrigin(origin.x,origin.y).setScale(renderScale);
  const shadow=this.add.ellipse(0,1,legacy.info.kind==="hound"?38:33,9,0x183b3b,.38);
  const back=this.add.rectangle(0,-h-6,35,5,0x261d27);
  const hp=this.add.rectangle(-17.5,-h-6,35,5,0x7ce4a9).setOrigin(0,.5);
  const view=this.add.container(x,y,[shadow,sprite,back,hp]).setDepth(y+6);
  return {view,sprite,hp,hitUntil:0,artist:hdAlly?"P08_U04_HD":"P08_B1_HF1_PNG",actorId:kind,baseScale:renderScale};
 }
 drawEnemies(){
  const ids=new Set();
  for(const e of WORLD.actors){
   ids.add(e.id);
   let v=this.enemyViews.get(e.id);
   if(!v){v=this.makeActor(e.type,e.x,e.y);this.enemyViews.set(e.id,v);}
   v.view.setPosition(e.x,e.y).setDepth(e.y+6);
   if(USE_P08_ACTORS){
    this.p08Animator.presentEntity(e.id,{kind:e.type,level:1,moving:!e.blockedBy});
    const phase=this.p08Animator.snapshot(e.id);
    v.sprite.setFrame(phase?.frameName??"walk-0");
    const pose=this.combatMotion.sample(e.id,phase,{kind:"enemy",
      fallbackFacing:Math.cos(e.heading)<0?-1:1});
    applyC1D8Pose(v.sprite,pose,v.baseScale);
    v.sprite.setFlipX(pose.facing<0);
   }else{
    v.sprite.setFrame(this.frame(v.hitUntil>WORLD.seconds?"hit":e.blockedBy?"blocked":"walk"));
    v.sprite.setFlipX(Math.cos(e.heading)<0);
   }
   v.hp.setScale(Math.max(0,e.life/e.maxLife),1);
  }
  for(const [id,v] of this.enemyViews)if(!ids.has(id)){
   // Only a recent core-confirmed fatal SNIPER impact may retain a visual ghost.
   if(this.t10GhostDeaths.has(id))continue;
   v.view.destroy();this.enemyViews.delete(id);this.p08Animator.entities.delete(id);this.combatMotion.forget(id);
  }
 }
 drawSoldiers(){
  const ids=new Set();
  for(const u of WORLD.soldiers){
   ids.add(u.id);let v=this.soldierViews.get(u.id);
   if(!v){v=this.makeActor("infantry_recruit",u.x,u.y);this.soldierViews.set(u.id,v);}
   if(USE_P08_ACTORS){
    const art=p08VisualForSoldierLevel(u.level);
    const hdKey=this.u04AllyHD.get(art.atlasKey)??art.atlasKey;
    if(v.sprite.texture.key!==hdKey){
     v.baseScale=art.worldHeight/171/(hdKey===art.atlasKey?1:2);
     v.sprite.setTexture(hdKey,"idle-0")
      .setOrigin(art.footAnchor.x,art.footAnchor.y).setScale(v.baseScale);
     v.actorId=art.actorId;
    }
    this.p08Animator.presentEntity(u.id,{kind:art.actorId,level:u.level,moving:u.state==="moving"});
   }
   const phase=USE_P08_ACTORS?this.p08Animator.snapshot(u.id):null;
   v.view.setPosition(u.x,u.y).setDepth(u.y+6)
    .setVisible(u.hp>0||(phase?.state==="die"&&phase.progress<1));
   const st=u.windup>0?"attackWindup":u.state==="moving"?"walk":"idle";
   v.sprite.setFrame(USE_P08_ACTORS?(phase?.frameName??"idle-0"):this.frame(st));
   if(USE_P08_ACTORS){
    const pose=this.combatMotion.sample(u.id,phase,{kind:"soldier"});
    applyC1D8Pose(v.sprite,pose,v.baseScale);
    v.sprite.setFlipX(pose.facing<0);
   }
   v.hp.setScale(Math.max(0,u.hp/u.maxHp),1);
  }
  for(const [id,v] of this.soldierViews)if(!ids.has(id)){
   v.view.destroy();this.soldierViews.delete(id);this.p08Animator.entities.delete(id);this.combatMotion.forget(id);
  }
  for(const mount of this.towerMounts.values())if(mount.operator){
   orientSniperOperator(mount,WORLD);
   const state=WORLD.seconds<mount.operatorUntil?mount.operatorState:"idle";
   mount.operator.setFrame(mount.operatorAtlas==="P03_APPROVED"?
     this.sniperOperatorFrame(state):this.frame(state));
  }
 }
 adaptHistoricShot(ev){
  // Presentation-only translation. Gameplay bullet origin remains unchanged.
  if(!["attack_windup","attack_fire","hit_applied","entity_die","entity_escape","scene_reset"].includes(ev.type))return null;
  if(!["attack_windup","attack_fire"].includes(ev.type))return ev;
  const mount=this.towerMounts.get(ev.entityId);
  if(!mount||mount.meta.family!=="sniper")return null;
  // T10/B2: verified original T04 rifle barrel face (levels I/II).
  // Changes VFX origin ONLY; no alteration of core bullets, damage or targeting.
  // R1-HF2: P03 operator atlas has its OWN rendered rifle. Project that
  // visible upper barrel rather than the embedded T04 building mechanism.
  // Move to the frame actually displayed on the render after this core event.
  const t04Muzzle=projectMountedT10Muzzle(mount.sprite,mount.meta);
  const p03Ready=mount.operator&&mount.operatorAtlas==="P03_APPROVED";
  // First face the authenticated target, THEN project the mouth of that same P03 rifle.
  const trackingTarget=WORLD.enemies.get(ev.targetId)??ev.payload?.targetWorld??null;
  if(mount.operator)orientSniperOperator(mount,WORLD,trackingTarget);
  const phase=ev.type==="attack_fire"?"attack":"attackWindup";
  const frameName=p03Ready?this.sniperOperatorFrame(phase):null;
  if(p03Ready)mount.operator.setFrame(frameName);
  const frameIndex=frameName?Number(frameName.slice(frameName.lastIndexOf("-")+1)):null;
  // Opt-in baseline comparison only in feature QA, NOT the production default.
  const useP03=p03Ready&&REVIEW.get("t10hf2")!=="legacy";
  const muzzle=useP03?projectP03RifleMuzzle(mount.operator,{state:phase,frame:frameIndex}):t04Muzzle;
  if(ev.type==="attack_fire"&&this.t10FireOrigins.length<48){
   const diagnosis=diagnoseT10Muzzle(mount.sprite,mount.meta);
   const arms=p03Ready?diagnoseP03VersusT04Muzzles({
    operator:mount.operator,t04Muzzle,root:muzzle,state:phase,frame:frameIndex}):null;
   this.t10FireOrigins.push({eventId:ev.eventId,tick:ev.tick,level:mount.meta.level,
    towerId:ev.entityId,source:muzzle,t04Source:t04Muzzle,operatorSource:arms?.p03??null,
    operatorFrame:frameName,sourceAuthority:useP03?"P03_OPERATOR_RIFLE":"T04_LEGACY",
    arms,legacy:diagnosis.legacy,worldDelta:diagnosis.worldDelta,
    runtime:diagnoseMountedT10Muzzle(mount.sprite,mount.meta)});
  }
  const target=WORLD.enemies.get(ev.targetId);
  const targetWorld=ev.payload?.targetWorld??(target?{x:target.x,y:target.y}:null);
  return {...ev,payload:{...(ev.payload??{}),muzzleWorld:muzzle,targetWorld,visualLevel:mount.meta.level}};
 }
 acceptVisualEvents(events){
  const lookup=id=>{
   const unit=WORLD.soldiers.find(s=>String(s.id)===String(id));
   if(unit)return {x:unit.x,y:unit.y};
   const enemy=WORLD.actors.find(e=>String(e.id)===String(id));
   return enemy?{x:enemy.x,y:enemy.y}:null;
  };
  for(const ev of events){
   // Only CORE-approved contacts produce VFX. Sprite frames never generate damage.
   const impact=USE_P08_ACTORS?this.combatMotion.observe(ev,lookup):null;
   if(impact&&spawnC1D8Impact(this,impact))this.contactFx++;
   if(USE_P08_ACTORS)this.p08Animator.consumeCoreEvent(ev,id=>{
    const u=WORLD.soldiers.find(x=>String(x.id)===String(id));
    if(u)return {kind:u.level===2?"infantry_veteran":"infantry_recruit",level:u.level};
    const e=WORLD.actors.find(x=>String(x.id)===String(id));
    return e?{kind:e.type,level:1}:null;
   });
   const visual=this.adaptHistoricShot(ev);
   if(visual&&this.shots.accept(visual)&&ev.type==="attack_fire")this.fxFires++;
   if(ev.type==="hit_applied"&&this.enemyViews.has(ev.entityId)){
    const victim=this.enemyViews.get(ev.entityId);
    victim.hitUntil=WORLD.seconds+.23;
    // Core has already applied HP/kill/reward. Hold ONLY its presentation
    // 125ms after the verified sniper hit to show the premium pop before fade.
    const isLethalSniper=ev.hp===0
     &&this.towerMounts.get(ev.towerId)?.meta?.family==="sniper";
    if(isLethalSniper&&!this.t10GhostDeaths.has(ev.entityId)){
     const id=ev.entityId,ms=125;
     const timer=this.time.delayedCall(ms,()=>{
      const v=this.enemyViews.get(id);
      if(v&&!WORLD.enemies.has(id)){
       v.view.destroy();this.enemyViews.delete(id);
       this.p08Animator.entities.delete(id);this.combatMotion.forget(id);
      }
      this.t10GhostDeaths.delete(id);
     });
     this.t10GhostDeaths.set(id,{timer,confirmed:true,lifetime:ms});
     this.t10HeldKills++;
     this.tweens.add({targets:victim.view,alpha:0,duration:ms,ease:"Cubic.In"});
    }
   }
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
   const events=WORLD.tick(step);
   if(USE_P08_ACTORS)this.p08Animator.update(step);
   this.reactEvents(events);this.accumulator-=step;steps++;
  }
  if(steps>=9)this.accumulator=0;
  this.drawEnemies();this.drawSoldiers();this.updateHud();
  if(WORLD.ended)showEndResult();
  if(WORLD.tickNumber%12===0&&contextIndex!==null)updatePanel();
 }
}

function placeMenu(){
 if(USE_T09_NODES)return;
 if(contextIndex===null||!SCENE?.game?.canvas)return;
 const r=SCENE.game.canvas.getBoundingClientRect(),app=$("app").getBoundingClientRect();
 const pos=c1d7WorldToClient(SCENE.mapView.plan.sockets[contextIndex].world,r);
 const el=$("contextMenu");
 const n=c1d7NodePlacement({x:pos.x-app.left,y:pos.y-app.top},
  {width:app.width,height:app.height,menuWidth:208,menuHeight:el.offsetHeight||180});
 el.style.left=n.left+"px";el.style.top=n.top+"px";
}
function closeMenu(){
 if(t09Presenter)t09Presenter.clear();
 t09Revision++;
 contextIndex=null;contextKey="";
 $("contextMenu").hidden=true;$("menuActions").replaceChildren();
 SCENE?.selection?.setVisible(false);
}
function openMenu(index){
 if(!WORLD||WORLD.ended||!WORLD.economy.getSocket(index))return false;
 contextIndex=index;chosenSocket=index;contextKey="";
 const socket=SCENE.mapView.plan.sockets[index].world;
 SCENE.selection.setPosition(socket.x,socket.y).setVisible(true);
 $("contextMenu").hidden=USE_T09_NODES;
 updatePanel(true);return true;
}
function actionLabel(action,level){
 const k=action.intent;
 if(k==="build_infantry")return "⚔ Infantería · "+action.cost+" oro";
 if(k==="build_sniper")return "◎ Francotirador · "+action.cost+" oro";
 if(k==="upgrade")return "↑ Nivel "+(level+1)+" · "+action.cost+" oro";
 if(k==="sell")return "Vender · +"+action.refund+" oro";
 if(k==="rally")return "↗ Punto de reunión";
 return k;
}
function updatePanel(force=false){
 if(contextIndex===null||!WORLD)return;
 if(USE_T09_NODES&&t09Presenter){
  if(WORLD.ended){closeMenu();return;}
  const index=contextIndex,eco=WORLD.economy,raw=eco.getTower(index),sock=eco.getSocket(index);
  const quotes={buildInfantry:eco.quote(index,"infantry"),buildSniper:eco.quote(index,"sniper"),
   upgrade:eco.quoteUpgrade(index),sell:eco.quoteSell(index)};
  const mode=WORLD.paused?"paused":WORLD.active?"wave":"preparation";
  const stateKey=JSON.stringify({index,raw,quotes,mode,gold:eco.gold});
  if(!force&&stateKey===contextKey)return;
  contextKey=stateKey;
  const world=SCENE.mapView.plan.sockets[index].world;
  const rect=SCENE.game.canvas.getBoundingClientRect(),host=$("app").getBoundingClientRect();
  const p=c1d7WorldToClient(world,rect);
  const anchorScreen={x:p.x-host.left,y:p.y-host.top};
  const header=$("hud").getBoundingClientRect(),ctrl=$("hudControls").getBoundingClientRect();
  const feedbackRect=$("feedback").getBoundingClientRect();
  // Keep a compact safe region; no DOM popover and no input outside the Phaser view.
  const safe={left:Math.max(8,rect.left-host.left+8),
   top:Math.max(8,header.bottom-host.top+6,ctrl.bottom-host.top+6),
   right:Math.min(host.width-8,rect.right-host.left-8),
   bottom:Math.min(host.height-8,feedbackRect.top-host.top-5)};
  // If header/feedback take too much space, fall back to the whole game viewport.
  if(safe.right-safe.left<210||safe.bottom-safe.top<175){
   safe.left=8;safe.right=host.width-8;safe.top=8;safe.bottom=host.height-8;
  }
  const tower=raw?{id:String(raw.id),family:raw.family,level:raw.level}:null;
  const spec=getContextMenuVisualSpec({socket:{index,socketId:sock?.socketId??null},
   tower,quotes,mode,permissions:{canRally:raw?.family==="infantry",canInspect:false},
   worldPoint:world,revision:++t09Revision});
  t09Presenter.update(spec,{anchorScreen,viewportSafeRect:safe,
   nodeDiameter:host.height<=430?46:54});
  $("contextMenu").hidden=true;
  return;
 }

 if(WORLD.ended){closeMenu();return;}
 const d=c1d7MenuDTO(WORLD.economy,contextIndex,{paused:WORLD.paused,ended:WORLD.ended});
 if(!d){closeMenu();return;}
 const key=JSON.stringify([d.family,d.level,d.gold,d.paused,d.actions]);
 if(!force&&key===contextKey){placeMenu();return;}
 contextKey=key;
 $("menuTitle").textContent="Plataforma "+(contextIndex+1)+"/8";
 $("menuInfo").textContent=d.hasTower?
  (d.family==="infantry"?"Cuartel de Infantería":"Francotirador")+" · nivel "+d.level:
  "Plataforma vacía · "+d.gold+" oro";
 const area=$("menuActions");area.replaceChildren();
 for(const action of d.actions){
  if(action.intent==="close")continue;
  const button=document.createElement("button");
  button.type="button";button.dataset.intent=action.intent;
  button.textContent=actionLabel(action,d.level);
  button.disabled=!action.enabled;button.title=action.disabledReason||"";
  area.append(button);
 }
 $("menuReason").textContent=d.actions.filter(a=>!a.enabled).map(a=>a.disabledReason).filter(Boolean)[0]||"";
 placeMenu();
}
function stopRallySelection(){
 rallyMode=false;rallySocket=null;
 $("rallyHint").hidden=true;
 SCENE?.rallyRadius?.setVisible(false);
}
function startRallySelection(index){
 const t=WORLD.economy.getTower(index);
 if(!t||t.family!=="infantry"||WORLD.ended||WORLD.paused)return false;
 rallyMode=true;rallySocket=index;
 closeMenu();
 SCENE.rallyRadius.setPosition(t.x,t.y).setRadius(INFANTRY_LVLS[t.level].radius).setVisible(true);
 $("rallyHint").hidden=false;
 $("rallyStatus").textContent="Toca una zona del camino dentro del círculo verde.";
 feedback("Modo reunión activo: toca dentro del círculo; puedes cancelar.");
 return true;
}
function runMenuIntent(intent){
 if(contextIndex===null||menuBusy)return;
 const now=performance.now();if(now-lastIntentMs<250)return;
 lastIntentMs=now;menuBusy=true;
 try{
  const outcome=c1d7ApplyIntent(WORLD,contextIndex,intent);
  if(outcome.ok&&outcome.reason==="SELECT_RALLY"){
   startRallySelection(contextIndex);return;
  }
  if(outcome.ok){
   SCENE.drawTowers();SCENE.updateHud();
   feedback(intent.startsWith("build_")?"Construcción completada.":intent==="upgrade"?
    "Torre mejorada.":"Torre vendida.");
  }else feedback(outcome.message||"Acción no disponible.");
  updatePanel(true);
 }finally{menuBusy=false;}
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
 stopRallySelection();closeMenu();
 $("results").hidden=false;showBestScore();
}
function wireControls(){
 $("waveStart").onclick=()=>{
  closeMenu();stopRallySelection();
  if(WORLD.startWave())feedback("Oleada "+WORLD.wave+" iniciada.");
  SCENE.updateHud();
 };
 $("pause").onclick=()=>{
  if(WORLD.paused)WORLD.resume();else WORLD.pause();
  SCENE.updateHud();updatePanel(true);
 };
 $("restart").onclick=()=>location.reload();
 $("resultRestart").onclick=()=>location.reload();
 const menu=$("contextMenu");
 menu.addEventListener("pointerdown",e=>e.stopPropagation());
 menu.addEventListener("pointerup",e=>e.stopPropagation());
 menu.addEventListener("click",e=>e.stopPropagation());
 $("menuClose").onclick=()=>closeMenu();
 $("cancelRally").onclick=()=>{stopRallySelection();feedback("Movimiento cancelado.");};
 $("menuActions").addEventListener("click",e=>{
  const btn=e.target.closest("button[data-intent]");
  if(btn&&!btn.disabled)runMenuIntent(btn.dataset.intent);
 });
 document.addEventListener("keydown",e=>{
  if(e.key==="Escape"||e.key==="Backspace"){
   stopRallySelection();closeMenu();
  }
 });
 window.addEventListener("resize",()=>{if(contextIndex!==null)placeMenu();});
 window.visualViewport?.addEventListener("resize",()=>{if(contextIndex!==null)placeMenu();});
}
async function start(){
 try{
  assert(window.Phaser?.VERSION==="4.2.1","Se requiere Phaser 4.2.1");
  validateTowerArtV2();
  if(TOWER_ART_V2.length!==4)throw Error("C1-D7 requires original T04 master tower quartet");
  const [m,c]=await Promise.all(["../../data/maps.v5.json","../../data/campaign140.v5.json"].map(async u=>{
   const res=await fetch(u,{cache:"no-store"});assert(res.ok,"Missing "+u);return res.json();
  }));
  MAP=m[0];validateM01(MAP);CAMPAIGN=c.maps[0];WORLD=new M01CombatWithInfantry(MAP,CAMPAIGN);
  const canvas=document.createElement("canvas"),gl=canvas.getContext("webgl2",{alpha:false,antialias:true});
  assert(gl&&gl instanceof WebGL2RenderingContext,"WebGL2 requerido");
  new Phaser.Game({type:Phaser.WEBGL,canvas,context:gl,parent:"stage",width:1280,height:768,
    backgroundColor:"#183b37",antialias:true,audio:{noAudio:true},
    scale:{mode:Phaser.Scale.FIT, // R4: never crop canonical paths on mobile
      autoCenter:Phaser.Scale.CENTER_BOTH,width:1280,height:768},
    scene:[CombatScene]});
 }catch(error){console.error(error);feedback("BLOQUEANTE C1-D7: "+error.message);}
}
start();
