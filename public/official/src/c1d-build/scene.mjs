/**
 * C1-D1 — Phaser 4.2.1: compras, mejoras y ventas M01 reales.
 * No incluye oleadas, ataques, HP de enemigos, estrellas o guardados.
 */
import {M01BuildEconomy,M01_BUILD_FAMILIES} from "../core-c1d/construction-economy.mjs";
import {validateM01} from "../maps-visual/m01/renderer.mjs";
import {preloadM03Illustrations,mountM01WorldV3} from "../maps-visual/m01/m03/renderer-v3.mjs";
import {TOWER_ART_V2,validateTowerArtV2} from "../towers-visual/catalog.mjs";
const $=id=>document.getElementById(id);
const W=1280,H=768;
let ECONOMY,MAP,SCENE,chosenSocket=0;
const message=s=>{$("feedback").textContent=s;};
const assert=(c,s)=>{if(!c)throw Error("C1-D1: "+s);};
function selectedFamily(){return $("family").value;}
class BuildScene extends Phaser.Scene{
 constructor(){super("C1D1Economy");this.towers=[];this.mapView=null;}
 preload(){
  this.load.on("loaderror",f=>message("ERROR cargando "+f.key));
  preloadM03Illustrations(this);
  for(const item of TOWER_ART_V2)this.load.svg(item.assetId,item.url,{width:360,height:420});
 }
 create(){
  this.mapView=mountM01WorldV3(this,MAP,{palette:"viva"});
  assert(this.mapView.plan.sockets.length===8,"8 puntos");
  this.selection=this.add.circle(0,0,51,0x000000,0).setStrokeStyle(4,0xf7d68e,1).setDepth(45000);
  this.input.on("pointerdown",p=>{
   const nearest=this.mapView.plan.sockets.map((s,index)=>({index,dist:Math.hypot(p.x-s.world.x,p.y-s.world.y)}))
     .sort((a,b)=>a.dist-b.dist)[0];
   if(nearest&&nearest.dist<=55){chosenSocket=nearest.index;this.updateVisuals();updatePanel();}
  });
  this.updateVisuals();
  $("render").textContent=this.game.renderer?.gl instanceof WebGL2RenderingContext?"WebGL2":"WebGL2 no confirmado";
  window.__SEMANTROPIC_C1D1={economy:ECONOMY,scene:this,scope:"REAL_ECONOMY_NOT_COMBAT"};
  updatePanel();
 }
 updateVisuals(){
  for(const obj of this.towers)obj.destroy();
  this.towers.length=0;
  for(const [index,spot] of this.mapView.plan.sockets.entries()){
   const tower=ECONOMY.getTower(index);
   this.mapView.setSocketVisualState(spot.socketId,tower?"occupied":"empty");
   if(!tower)continue;
   const meta=TOWER_ART_V2.find(t=>t.family===tower.family&&t.level===tower.level);
   assert(meta,"missing tower visual "+tower.family+" level "+tower.level);
   const {x,y}=spot.world;
   this.towers.push(this.add.image(x,y,meta.assetId).setOrigin(meta.footAnchor.x,meta.footAnchor.y)
      .setScale(meta.worldScaleProposal).setDepth(y-1));
  }
  const socket=this.mapView.plan.sockets[chosenSocket];
  this.selection.setPosition(socket.world.x,socket.world.y);
 }
}
function updatePanel(){
 $("coins").textContent=String(ECONOMY.gold);
 $("slot").textContent=String(chosenSocket+1)+" / 8";
 const tower=ECONOMY.getTower(chosenSocket);
 $("installed").textContent=tower?M01_BUILD_FAMILIES[tower.family].name+" · nivel "+tower.level+" · invertido "+tower.spent:"Plataforma vacía";
 const type=selectedFamily(),spec=M01_BUILD_FAMILIES[type];
 const build=ECONOMY.quote(chosenSocket,type),up=ECONOMY.quoteUpgrade(chosenSocket),sell=ECONOMY.quoteSell(chosenSocket);
 $("buy").disabled=!build.ok;$("buy").textContent="Construir ("+spec.baseCost+")";
 $("upgrade").disabled=!up.ok;$("upgrade").textContent=tower?.level===2?"Nivel II (máximo)":"Mejorar a II ("+(up.cost??(tower?M01_BUILD_FAMILIES[tower.family].upgradeIToII:0))+")";
 $("sell").disabled=!sell.ok;$("sell").textContent="Vender ("+(sell.refund??0)+")";
 $("log").textContent=ECONOMY.ledger.slice(-3).map(tx=>(tx.type==="credit"?"+":"−")+tx.amount+" "+tx.source).join(" · ")||"Sin transacciones";
}
function transact(method,...args){
 const out=ECONOMY[method](...args);
 message(out.ok?method==="build"?"Torre construida y monedas descontadas.":method==="upgrade"?"Mejora a nivel II comprada.":"Venta realizada.":out.message);
 if(out.ok)SCENE.updateVisuals();
 updatePanel();
}
async function start(){
 try{
  assert(window.Phaser?.VERSION==="4.2.1","Phaser 4.2.1 required");
  validateTowerArtV2();
  const response=await fetch("../../data/maps.v5.json",{cache:"no-store"});
  assert(response.ok,"maps.v5.json not found");
  const all=await response.json();MAP=all[0];validateM01(MAP);
  ECONOMY=new M01BuildEconomy(MAP);
  const canvas=document.createElement("canvas");
  const gl=canvas.getContext("webgl2",{alpha:false,antialias:true});
  assert(gl&&gl instanceof WebGL2RenderingContext,"WebGL2 required");
  const game=new Phaser.Game({type:Phaser.WEBGL,canvas,context:gl,parent:"stage",width:W,height:H,
    backgroundColor:"#183b37",antialias:true,audio:{noAudio:true},
    scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:W,height:H},scene:[BuildScene]});
  game.events.once(Phaser.Core.Events.READY,()=>{
   SCENE=game.scene.getScene("C1D1Economy");
   $("prev").addEventListener("click",()=>{chosenSocket=(chosenSocket+7)%8;SCENE.updateVisuals();updatePanel();});
   $("next").addEventListener("click",()=>{chosenSocket=(chosenSocket+1)%8;SCENE.updateVisuals();updatePanel();});
   $("family").addEventListener("change",updatePanel);
   $("buy").addEventListener("click",()=>transact("build",chosenSocket,selectedFamily()));
   $("upgrade").addEventListener("click",()=>transact("upgrade",chosenSocket));
   $("sell").addEventListener("click",()=>transact("sell",chosenSocket));
  });
 }catch(e){console.error(e);message("BLOQUEANTE: "+e.message);}
}
start();
