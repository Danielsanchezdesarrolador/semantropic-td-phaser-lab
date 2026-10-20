/** M03 Q2 — map-only A/B/C staging. NOT a campaign scene. */
import {validateM01,visualSocketPreview,mountM01World} from "../renderer.mjs";
import {preloadM02Illustrations,mountM01WorldV2} from "../m02/renderer-v2.mjs";
import {preloadM03Illustrations,mountM01WorldV3,M03_PALETTES,M03_VERSION} from "./renderer-v3.mjs";
const $=id=>document.getElementById(id);
const MODES=new Set(["m01","m02","equilibrada","viva","atmosferica"]);
const initial=new URLSearchParams(location.search).get("variant");
let mode=MODES.has(initial)?initial:"equilibrada",scene=null,world=null,map=null,zoom=1,viewFlags={path:false,hit:false,occlusion:false};
let selected=null,showOccupied=true,visualStates=new Map(),evidenceReady=false;
const label={m01:"A · Aurora v1",m02:"B · Aurora v2",equilibrada:"C · M03 Equilibrada",viva:"D · M03 Viva",atmosferica:"E · M03 Atmosférica"};
function status(msg){$("message").textContent=msg;}
function setUI(){
 $("variantName").textContent=label[mode];
 for(const b of document.querySelectorAll("[data-variant]"))b.classList.toggle("active",b.dataset.variant===mode);
 for(const b of document.querySelectorAll("[data-zoom]"))b.classList.toggle("active",Math.abs(Number(b.dataset.zoom)-zoom)<.0001);
 $("zoomText").textContent=Math.round(zoom*100)+"%";
 $("padWidth").textContent=mode==="m01"?"M01 v1":mode==="m02"?"~135":"~93";
 $("socketCount").textContent=world?.padObjects?.length||8;
 $("propsCount").textContent=world?.propObjects?.length||"—";
 $("occupiedBtn").textContent=showOccupied?"Alternar base ocupada":"Alternar base libre";
 $("occupiedBtn").disabled=!(mode in {m02:1,equilibrada:1,viva:1,atmosferica:1});
}
function releaseV1Textures(){
 // v1 mounts texture keys but does not delete them; do not retain two large
 // background texture masters when switching to another palette.
 for(const key of Object.keys(scene?.textures?.list||{}))
  if(key.startsWith("maps/m01/aurora/equilibrada/"))scene.textures.remove(key);
}
function mountVariant(next){
 if(!scene||!MODES.has(next))return;
 const prev=mode;
 if(world?.destroy)world.destroy();
 if(prev==="m01")releaseV1Textures();
 selected=null;
 $("inspection").hidden=true;
 try{
  if(next==="m01")world=mountM01World(scene,map,{palette:"equilibrada"});
  else if(next==="m02")world=mountM01WorldV2(scene,map,{palette:"equilibrada",disposeTextures:true});
  else world=mountM01WorldV3(scene,map,{palette:next,disposeTextures:true});
  mode=next;
  applyOccupation();
  setUI();updateOverlay();
  status("Comparación "+label[next]+". Misma geometría, cámara y posiciones.");
  // no success claim of final mobile quality; browser status label below is factual
 }catch(err){$("blocker").hidden=false;$("blocker").textContent="Error al dibujar "+label[next]+": "+err.message;console.error(err);}
}
function applyOccupation(){
 if(!world?.setSocketVisualState)return;
 for(const s of visualSocketPreview(map))world.setSocketVisualState(s.socketId,showOccupied&&[1,3,4,5].includes(s.legacySpotIndex)?"occupied":"neutral");
}
function cameraZoom(z){
 zoom=z;const cam=scene?.cameras?.main;
 if(cam){cam.setZoom(z);cam.centerOn(640,384);}
 setUI();
}
function updateOverlay(){
 if(!world?.updateDebug)return;
 world.updateDebug({
  showRoute:viewFlags.path,showClearance:viewFlags.hit,
  showOcclusion:viewFlags.occlusion,selectedSocket:selected
 });
}
function onPick(s){
 selected=s?.socketId||null;
 $("inspection").hidden=!s;
 if(s){
  $("socketText").textContent=s.socketId+" · ("+s.world.x+","+s.world.y+") · "+s.metadata.kind+" · hit 54 (intacto).";
  $("stateText").textContent=world?.padObjects?.find(p=>p.socket.socketId===s.socketId)?.visualState||"referencia";
 }
 updateOverlay();
}
function bindUI(){
 for(const b of document.querySelectorAll("[data-variant]"))b.onclick=()=>mountVariant(b.dataset.variant);
 for(const b of document.querySelectorAll("[data-zoom]"))b.onclick=()=>cameraZoom(Number(b.dataset.zoom));
 for(const key of ["path","hit","occlusion"]){
  const el=$(key+"Toggle");el.onclick=()=>{viewFlags[key]=!viewFlags[key];el.classList.toggle("active",viewFlags[key]);updateOverlay();};
 }
 $("occupiedBtn").onclick=()=>{showOccupied=!showOccupied;applyOccupation();setUI();updateOverlay();};
 $("close").onclick=()=>onPick(null);
 $("reset").onclick=()=>location.reload();
 window.addEventListener("keydown",e=>{if(e.key==="Escape")onPick(null);});
}
class M03Artwork extends Phaser.Scene{
 constructor(){super("M03Artwork")}
 preload(){preloadM03Illustrations(this);}
 create(){
  scene=this;
  const gl2=typeof WebGL2RenderingContext!=="undefined"&&this.game.renderer?.gl instanceof WebGL2RenderingContext;
  $("engine").textContent="Phaser "+Phaser.VERSION+" / "+(gl2?"WebGL2 confirmado en navegador":"WebGL2 NO VERIFICADO");
  this.input.on("pointerdown",pointer=>{
   const at=this.cameras.main.getWorldPoint(pointer.x,pointer.y);
   const pad=visualSocketPreview(map).find(s=>Math.hypot(at.x-s.world.x,at.y-s.world.y)<54);
   onPick(pad||null);
  });
  cameraZoom(1);mountVariant(mode);
  $("blocker").hidden=true;
 }
 update(){ /* Static map art only; no timers or gameplay events. */ }
}
(async()=>{
 try{
  bindUI();
  const reply=await fetch(new URL("../../../../data/maps.v5.json",import.meta.url),{cache:"no-store"});
  if(!reply.ok)throw Error("Fuente canónica 404/HTTP "+reply.status);
  map=(await reply.json())[0];validateM01(map);
  if(!window.Phaser||Phaser.VERSION!=="4.2.1")throw Error("Se requiere Phaser 4.2.1");
  const canvas=document.createElement("canvas"),gl=canvas.getContext("webgl2",{alpha:false,antialias:true});
  if(!gl||typeof WebGL2RenderingContext==="undefined"||!(gl instanceof WebGL2RenderingContext))throw Error("WebGL2 real no disponible");
  new Phaser.Game({
   type:Phaser.WEBGL,canvas,context:gl,parent:"stage",width:1280,height:768,backgroundColor:"#51876d",
   antialias:true,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:1280,height:768},
   audio:{noAudio:true},scene:[M03Artwork]
  });
 }catch(err){$("blocker").hidden=false;$("blocker").textContent="M03 detenido: "+err.message;console.error(err);}
})();
