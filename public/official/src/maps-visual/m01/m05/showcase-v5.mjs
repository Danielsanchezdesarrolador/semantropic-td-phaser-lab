/** Equipo M — M05 showroom. M04/M05 from REAL source; ZERO gameplay implemented. */
import {validateM01,visualSocketPreview} from "../renderer.mjs";
import {preloadM05Illustrations,mountM01WorldV5,M05_PALETTES,M05_TREATMENTS} from "./renderer-v5.mjs";
import {mountM01WorldV4} from "../m04/renderer-v4.mjs";
const $=id=>document.getElementById(id);
const params=new URLSearchParams(location.search);
const ALLOWED=new Set(["m04","bucolico","contraste"]);
let scene=null,map=null,view=null;
let mode=ALLOWED.has(params.get("mode"))?params.get("mode"):"bucolico";
let palette=M05_PALETTES.includes(params.get("palette"))?params.get("palette"):"equilibrada";
let zoom=1,fixture=true,selection=null,flags={route:false,sockets:false,occlusion:false};
const socketFixture=()=>visualSocketPreview(map).map(s=>({socketId:s.socketId,occupied:fixture&&[1,3,4,5].includes(s.legacySpotIndex),selected:false,ruined:false}));
function updateUI(){
 $("mode").textContent=mode==="m04"?"M-04 · antes":mode==="bucolico"?"M-05 A · Pradera luminosa":"M-05 B · Contraste orgánico";
 $("clusters").textContent=mode==="m04"?"0 añadidos":view?.clusterObjects?.length+" clústeres ilustrados";
 $("pads").textContent=String(view?.padObjects?.length||8);
 $("zoom").textContent=Math.round(zoom*100)+"%";
 $("fixture").textContent=fixture?"Bases ocupadas (muestra)":"Bases libres (muestra)";
 for(const b of document.querySelectorAll("[data-mode]"))b.classList.toggle("active",b.dataset.mode===mode);
 for(const b of document.querySelectorAll("[data-palette]"))b.classList.toggle("active",b.dataset.palette===palette);
 for(const b of document.querySelectorAll("[data-zoom]"))b.classList.toggle("active",Math.abs(Number(b.dataset.zoom)-zoom)<.001);
}
function applyFixture(){
 if(!view||!map)return;
 if(view.applyVisualSnapshot)view.applyVisualSnapshot({sockets:socketFixture()});
 else for(const s of socketFixture())view.setSocketVisualState(s.socketId,s.occupied?"occupied":"neutral");
 refreshDebug();
}
function refreshDebug(){
 view?.updateDebug?.({showRoute:flags.route,showClearance:flags.sockets,showOcclusion:flags.occlusion,selectedSocket:selection});
}
function changeMode(next=mode,nextPalette=palette){
 if(!scene||!ALLOWED.has(next)||!M05_PALETTES.includes(nextPalette))return;
 view?.destroy();view=null;selection=null;$("socketPanel").hidden=true;
 try{
  view=next==="m04"?mountM01WorldV4(scene,map,{palette:nextPalette,disposeTextures:true}):
   mountM01WorldV5(scene,map,{palette:nextPalette,treatment:next,disposeTextures:true});
  const missing=view.missing||[];
  if(missing.length)throw Error("Faltan recursos SVG: "+missing.map(x=>typeof x==="string"?x:x.id).join(", "));
  mode=next;palette=nextPalette;
  applyFixture();updateUI();
  $("status").textContent="Mundo M01 original · comparación artística, NO hay combate ni compras.";
  $("blocker").hidden=true;
 }catch(err){$("blocker").hidden=false;$("blocker").textContent="Montaje M05 falló: "+err.message;console.error(err);}
}
function setZoom(z){zoom=z;if(scene){scene.cameras.main.setZoom(z);scene.cameras.main.centerOn(640,384)}updateUI()}
function selectPad(s){
 selection=s?.socketId||null;
 $("socketPanel").hidden=!s;
 if(s)$("socketInfo").textContent=s.socketId+" · "+s.world.x+","+s.world.y+" · hit radius 54 (no es collider de combate)";
 refreshDebug();
}
function bindControls(){
 for(const b of document.querySelectorAll("[data-mode]"))b.onclick=()=>changeMode(b.dataset.mode);
 for(const b of document.querySelectorAll("[data-palette]"))b.onclick=()=>changeMode(mode,b.dataset.palette);
 for(const b of document.querySelectorAll("[data-zoom]"))b.onclick=()=>setZoom(Number(b.dataset.zoom));
 for(const name of Object.keys(flags))$(name).onclick=()=>{
  flags[name]=!flags[name];$(name).classList.toggle("active",flags[name]);refreshDebug();
 };
 $("fixture").onclick=()=>{fixture=!fixture;applyFixture();updateUI()};
 $("closeSocket").onclick=()=>selectPad(null);
 document.addEventListener("visibilitychange",()=>{/* no custom timers to leak */});
 window.addEventListener("keydown",e=>{if(e.key==="Escape")selectPad(null)});
}
class M05Gallery extends Phaser.Scene{
 constructor(){super("M05MapOnly")}
 preload(){preloadM05Illustrations(this)}
 create(){
  scene=this;
  const is2=typeof WebGL2RenderingContext!=="undefined"&&this.game.renderer?.gl instanceof WebGL2RenderingContext;
  $("runtime").textContent="Phaser "+Phaser.VERSION+" / "+(is2?"WebGL2 real":"WebGL2 no verificado");
  this.input.on("pointerdown",pointer=>{
   const p=this.cameras.main.getWorldPoint(pointer.x,pointer.y);
   selectPad(visualSocketPreview(map).find(s=>Math.hypot(s.world.x-p.x,s.world.y-p.y)<54)||null);
  });
  setZoom(1);changeMode(mode,palette);
 }
}
(async()=>{
 try{
  bindControls();
  const response=await fetch(new URL("../../../../data/maps.v5.json",import.meta.url),{cache:"no-store"});
  if(!response.ok)throw Error("Fuente de mapa V5 HTTP "+response.status);
  map=(await response.json())[0];validateM01(map);
  if(!window.Phaser||Phaser.VERSION!=="4.2.1")throw Error("Phaser 4.2.1 requerido");
  const canvas=document.createElement("canvas");
  const gl=canvas.getContext("webgl2",{alpha:false,antialias:true});
  if(!gl||typeof WebGL2RenderingContext==="undefined"||!(gl instanceof WebGL2RenderingContext))throw Error("WebGL2 no disponible");
  new Phaser.Game({type:Phaser.WEBGL,canvas,context:gl,parent:"stage",width:1280,height:768,
   backgroundColor:"#669b7c",antialias:true,
   scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:1280,height:768},
   audio:{noAudio:true},scene:[M05Gallery]});
 }catch(err){$("blocker").hidden=false;$("blocker").textContent="M05 no pudo iniciar: "+err.message;console.error(err)}
})();
