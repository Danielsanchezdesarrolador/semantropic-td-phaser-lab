/** M04 art-only visual comparison: M03/M04 under one canonical camera. NOT gameplay. */
import {validateM01,visualSocketPreview} from "../renderer.mjs";
import {preloadM04Illustrations,mountM01WorldV4,M04_PALETTES,M04_VERSION} from "./renderer-v4.mjs";
import {mountM01WorldV3} from "../m03/renderer-v3.mjs";
const $=id=>document.getElementById(id);
const query=new URLSearchParams(location.search),allowed=new Set(["m03",...M04_PALETTES]);
let map=null,scene=null,world=null,mode=allowed.has(query.get("variant"))?query.get("variant"):"equilibrada";
let zoom=1,occupied=true,selected=null,debug={path:false,sockets:false,occlusion:false};
const status=msg=>{$("status").textContent=msg};
function updateUi(){
 $("versionLabel").textContent=mode==="m03"?"M-03 · baseline original":"M-04 · "+mode;
 $("terrainLabel").textContent=mode==="m03"?"M03 tradicional":"M04 paisaje ilustrado";
 $("density").textContent=mode==="m03"?"13 (M03)":String(world?.plan?.props?.length||0)+" + 3 hitos";
 $("socketCount").textContent=world?.padObjects?.length||"8";
 $("occupied").textContent=occupied?"Alternar libres":"Alternar ocupadas";
 for(const b of document.querySelectorAll("[data-variant]"))b.classList.toggle("on",b.dataset.variant===mode);
 for(const b of document.querySelectorAll("[data-zoom]"))b.classList.toggle("on",Number(b.dataset.zoom)===zoom);
 $("zoomLabel").textContent=Math.round(100*zoom)+"%";
}
function stateOccupied(){
 if(!world)return;
 for(const socket of visualSocketPreview(map)){
  const status=occupied&&[1,3,4,5].includes(socket.legacySpotIndex)?"occupied":"neutral";
  world.setSocketVisualState?.(socket.socketId,status);
 }
}
function refreshDebug(){
 world?.updateDebug?.({showRoute:debug.path,showClearance:debug.sockets,showOcclusion:debug.occlusion,selectedSocket:selected});
}
function mount(which){
 if(!scene||!allowed.has(which))return;
 if(world?.destroy)world.destroy();
 world=null;selected=null;$("info").hidden=true;
 try{
  world=which==="m03"?mountM01WorldV3(scene,map,{palette:"equilibrada",disposeTextures:true}):
   mountM01WorldV4(scene,map,{palette:which,disposeTextures:true});
  mode=which;stateOccupied();updateUi();refreshDebug();
  status("Comparación artística únicamente. Geometría M01 original: 133 puntos, 8 sockets y ancho 110.");
 }catch(err){$("blocker").hidden=false;$("blocker").textContent="Falló el montaje artístico: "+err.message;console.error(err);}
}
function select(socket){
 selected=socket?.socketId||null;
 $("info").hidden=!socket;
 if(socket)$("socketMeta").textContent=socket.socketId+" · ("+socket.world.x+", "+socket.world.y+") · hit radio 54 sin cambios.";
 refreshDebug();
}
function setZoom(value){
 zoom=value;
 if(scene){scene.cameras.main.setZoom(value);scene.cameras.main.centerOn(640,384);}
 updateUi();
}
function controls(){
 for(const b of document.querySelectorAll("[data-variant]"))b.onclick=()=>mount(b.dataset.variant);
 for(const b of document.querySelectorAll("[data-zoom]"))b.onclick=()=>setZoom(Number(b.dataset.zoom));
 $("occupied").onclick=()=>{occupied=!occupied;stateOccupied();updateUi();refreshDebug()};
 for(const item of Object.keys(debug)){
  const el=$(item);el.onclick=()=>{debug[item]=!debug[item];el.classList.toggle("on",debug[item]);refreshDebug()};
 }
 $("close").onclick=()=>select(null);
 $("reload").onclick=()=>location.reload();
 window.addEventListener("keydown",e=>{if(e.key==="Escape")select(null)});
}
class ArtReviewScene extends Phaser.Scene{
 constructor(){super({key:"M04ArtReview"})}
 preload(){preloadM04Illustrations(this)}
 create(){
  scene=this;
  const gl=this.game.renderer?.gl;
  const webgl2=typeof WebGL2RenderingContext!=="undefined"&&gl instanceof WebGL2RenderingContext;
  $("engine").textContent="Phaser "+Phaser.VERSION+" · "+(webgl2?"WebGL2 real":"WebGL2 no verificado");
  this.input.on("pointerdown",pointer=>{
   const a=this.cameras.main.getWorldPoint(pointer.x,pointer.y);
   select(visualSocketPreview(map).find(s=>Math.hypot(a.x-s.world.x,a.y-s.world.y)<=54)||null);
  });
  setZoom(1);mount(mode);$("blocker").hidden=true;
 }
}
(async()=>{
 try{
  controls();
  const url=new URL("../../../../data/maps.v5.json",import.meta.url);
  const r=await fetch(url,{cache:"no-store"});if(!r.ok)throw Error("HTTP "+r.status+" mapa canónico");
  map=(await r.json())[0];validateM01(map);
  if(!window.Phaser||Phaser.VERSION!=="4.2.1")throw Error("Phaser 4.2.1 local ausente");
  const canvas=document.createElement("canvas"),gl=canvas.getContext("webgl2",{alpha:false,antialias:true});
  if(!gl||typeof WebGL2RenderingContext==="undefined"||!(gl instanceof WebGL2RenderingContext))throw Error("WebGL2 requerido para arte M04");
  new Phaser.Game({type:Phaser.WEBGL,canvas,context:gl,parent:"stage",width:1280,height:768,backgroundColor:"#649b79",antialias:true,
   scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:1280,height:768},audio:{noAudio:true},scene:[ArtReviewScene]});
 }catch(e){$("blocker").hidden=false;$("blocker").textContent="No se pudo iniciar M04: "+e.message;console.error(e);}
})();