/**
 * Equipo M · Aurora V2 interactive art showcase only.
 * Read-only maps.v5.json; original M01 v1 view A, M02 balanced B, live C.
 * No gameplay, no simulated damage. Runtime: Phaser 4.2.1 WebGL2.
 */
import {validateM01,mountM01World,visualSocketPreview} from "../renderer.mjs";
import {M02_PALETTES,preloadM02Illustrations,mountM01WorldV2,M02_VERSION} from "./renderer-v2.mjs";
const $=id=>document.getElementById(id);
const q=new URLSearchParams(location.search);
const allowedModes=["v1",...M02_PALETTES];
const MODE=allowedModes.includes(q.get("variant"))?q.get("variant"):"equilibrada";
let data=null,scene=null,world=null,selectedSocket=null,variant=MODE,zoom=1,routeDebug=false,clearance=false,occlusion=false,ambientPaused=false;
const showStatus=s=>{$("message").textContent=s};
async function readMap(){
 const src=new URL("../../../../data/maps.v5.json",import.meta.url);
 const response=await fetch(src,{cache:"no-store"});
 if(!response.ok)throw Error("Datos de mapa no disponibles HTTP "+response.status);
 const maps=await response.json();validateM01(maps[0]);return maps[0];
}
function statusUI(){
 $("currentVariant").textContent=variant==="v1"?"A · Aurora v1 (intacto)":variant==="equilibrada"?"B · Aurora v2 Equilibrada":variant==="viva"?"C · Aurora v2 Viva":"D · Aurora v2 Atmosférica";
 for(const b of document.querySelectorAll("[data-variant]"))b.classList.toggle("on",b.dataset.variant===variant);
 $("zoomLabel").textContent=Math.round(zoom*100)+"%";
 for(const b of document.querySelectorAll("[data-zoom]"))b.classList.toggle("on",Math.abs(Number(b.dataset.zoom)-zoom)<.001);
 $("socketsCount").textContent="8";
 $("pathCount").textContent="133";
 $("propCount").textContent=variant==="v1"?String(world?.plan?.props?.length||0):String(world?.plan?.illustrations?.length||0);
}
function selectSocket(s){
 selectedSocket=s?.socketId||null;
 $("socket").hidden=!s;
 if(s)$("socketData").textContent=s.socketId+" · "+s.world.x+", "+s.world.y+" · "+s.metadata.kind+" · lectura visual; sin construcción.";
 updateOverlays();
}
function updateOverlays(){
 if(!world)return;
 world.updateDebug?.({showRoute:routeDebug,showClearance:clearance,selectedSocket,showOcclusion:occlusion});
}
function selectVariant(next){
 if(!scene||!allowedModes.includes(next))return;
 const previous=variant;
 if(world?.destroy)world.destroy();
 // The v1 baseline is used ONLY by this independent showcase; release its
 // once-baked textures on comparison to avoid retaining three palettes in VRAM.
 if(previous==="v1")for(const key of Object.keys(scene.textures.list||{}))
  if(key.startsWith("maps/m01/aurora/equilibrada/"))scene.textures.remove(key);
 world=null;selectedSocket=null;$("socket").hidden=true;
 try{
  world=next==="v1" ? mountM01World(scene,data,{palette:"equilibrada"}) :
    mountM01WorldV2(scene,data,{palette:next,disposeTextures:true});
  variant=next;statusUI();updateOverlays();
  showStatus(next==="v1"?"Comparación con Aurora v1: mismo mapa y cámara":"Aurora v2 "+next+": assets ilustrados, hitos y camino canónico");
 }catch(e){$("blocker").hidden=false;$("blocker").textContent="Error al montar el arte: "+e.message;console.error(e);}
}
function setCameraZoom(z){
 zoom=z;if(scene){scene.cameras.main.setZoom(z);scene.cameras.main.centerOn(640,384);}
 statusUI();
}
function listeners(){
 for(const b of document.querySelectorAll("[data-variant]"))b.addEventListener("click",()=>selectVariant(b.dataset.variant));
 for(const b of document.querySelectorAll("[data-zoom]"))b.addEventListener("click",()=>setCameraZoom(Number(b.dataset.zoom)));
 $("routeDebug").addEventListener("click",e=>{routeDebug=!routeDebug;e.currentTarget.classList.toggle("on",routeDebug);updateOverlays()});
 $("clearance").addEventListener("click",e=>{clearance=!clearance;e.currentTarget.classList.toggle("on",clearance);updateOverlays()});
 $("occlusion").addEventListener("click",e=>{occlusion=!occlusion;e.currentTarget.classList.toggle("on",occlusion);updateOverlays()});
 $("closeSocket").addEventListener("click",()=>selectSocket(null));
 window.addEventListener("keydown",e=>{if(e.key==="Escape")selectSocket(null)});
 document.addEventListener("visibilitychange",()=>{ambientPaused=document.hidden});
}
class MapArtOnly extends Phaser.Scene{
 constructor(){super("M02ArtOnly")}
 preload(){preloadM02Illustrations(this);}
 create(){
  scene=this;
  const gl2=typeof WebGL2RenderingContext!=="undefined"&&this.game.renderer?.gl instanceof WebGL2RenderingContext;
  $("runtime").textContent="Phaser "+Phaser.VERSION+" · "+(gl2?"WebGL2":"WebGL2 NO VERIFICADO");
  this.input.on("pointerdown",pointer=>{
   const p=this.cameras.main.getWorldPoint(pointer.x,pointer.y);
   const sockets=visualSocketPreview(data);
   const s=sockets.find(s=>Math.hypot(s.world.x-p.x,s.world.y-p.y)<54);
   selectSocket(s||null);
  });
  setCameraZoom(1);
  selectVariant(MODE);
  $("blocker").hidden=true;
  showStatus("Escenario listo. Comparar A/B/C/D con misma cámara y mismo mapa.");
 }
 update(_time,delta){
  if(world?.updateAmbient)world.updateAmbient(Math.min(delta,100)/1000,ambientPaused);
 }
}
(async()=>{
 try{
  listeners();
  data=await readMap();
  if(!window.Phaser||Phaser.VERSION!=="4.2.1")throw Error("Phaser 4.2.1 no empaquetado en este sitio");
  const canvas=document.createElement("canvas");
  const gl=canvas.getContext("webgl2",{alpha:false,antialias:true});
  if(!gl||typeof WebGL2RenderingContext==="undefined"||!(gl instanceof WebGL2RenderingContext))throw Error("WebGL2 auténtico no disponible; no se ejecuta fallback no declarado");
  new Phaser.Game({type:Phaser.WEBGL,canvas,context:gl,parent:"stage",width:1280,height:768,backgroundColor:"#487b65",antialias:true,
   scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:1280,height:768},
   audio:{noAudio:true},scene:[MapArtOnly]});
 }catch(e){$("blocker").hidden=false;$("blocker").textContent="M-02 no inició: "+e.message;console.error(e);}
})();