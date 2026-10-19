/**
 * Team M showcase — isolated art inspection scene. NOT a campaign build.
 * Uses canonical read-only maps.v5.json and locally packaged Phaser 4.2.1.
 * No global assets, balance, core, save, actors or combat events are changed.
 */
import {
 MAPS_M01_ART_VERSION,M01_PALETTE_NAMES,validateM01,
 visualSocketPreview,mountM01World
} from "./renderer.mjs";
import {installDeluxeArt} from "../../m01-deluxe-art.mjs";
import {pathSegments,positionOnPath} from "../../m01-model.mjs";

const $=id=>document.getElementById(id);
const q=new URLSearchParams(location.search);
const VALID_MODES=["ph02b",...M01_PALETTE_NAMES];
let mode=VALID_MODES.includes(q.get("mode"))?q.get("mode"):"equilibrada";
const state={scene:null,map:null,selected:null,debug:false,clearance:false,marker:false,paused:false,zoom:1,world:null};
const log=msg=>{$("status").textContent=msg;};
function updateAddress(next){const u=new URL(location.href);u.searchParams.set("mode",next);location.assign(u.toString());}
function checkSource(renderer){
 const gl=renderer?.gl;
 return typeof WebGL2RenderingContext!=="undefined"&&gl instanceof WebGL2RenderingContext;
}
async function canonicalMap(){
 const url=new URL("../../../data/maps.v5.json",import.meta.url);
 const reply=await fetch(url,{cache:"no-store"});
 if(!reply.ok)throw Error("No se pudo cargar el JSON oficial ("+reply.status+")");
 const maps=await reply.json(),map=maps[0];
 validateM01(map);
 return map;
}
function mountButtons(){
 for(const b of document.querySelectorAll("[data-mode]")){
  b.classList.toggle("selected",b.dataset.mode===mode);
  b.onclick=()=>{if(b.dataset.mode!==mode)updateAddress(b.dataset.mode);};
 }
 $("baseline").onclick=()=>updateAddress(mode==="ph02b"?"equilibrada":"ph02b");
 $("baseline").textContent=mode==="ph02b"?"Regresar a M-01":"Comparar PH-02B";
 $("debug").onclick=()=>{state.debug=!state.debug;$("debug").classList.toggle("selected",state.debug);redraw();};
 $("safe").onclick=()=>{state.clearance=!state.clearance;$("safe").classList.toggle("selected",state.clearance);redraw();};
 $("route").onclick=()=>{state.marker=!state.marker;$("route").classList.toggle("selected",state.marker);redraw();};
 $("zoomIn").onclick=()=>zoomTo(Math.min(1.5,state.zoom+.15));
 $("zoomOut").onclick=()=>zoomTo(Math.max(1,state.zoom-.15));
 $("zoomReset").onclick=()=>zoomTo(1);
 $("closeSocket").onclick=closeSocket;
 $("resetScene").onclick=()=>location.reload();
 $("map-title").textContent="M01 · PRADERAS DEL AMANECER";
 $("variant").textContent=mode==="ph02b"?"Referencia PH-02B":"M-01 Aurora · "+mode;
 document.body.addEventListener("keydown",e=>{if(e.key==="Escape")closeSocket();});
}
function zoomTo(z){
 state.zoom=z;
 if(!state.scene)return;
 const cam=state.scene.cameras.main;
 cam.setZoom(z);
 cam.centerOn(640,384);
 $("zoomValue").textContent=Math.round(z*100)+"%";
 log(z===1?"Mapa completo visible":"Zoom de inspección, no altera coordenadas del mundo");
}
function closeSocket(){
 state.selected=null;$("socketPanel").hidden=true;redraw();
}
function showSocket(s){
 state.selected=s.socketId;
 $("socketDescription").textContent=s.socketId+" · coordenadas mundo "+s.world.x+", "+s.world.y+" · papel: "+s.metadata.role+" · tipo visual: "+s.metadata.kind+".";
 $("socketPanel").hidden=false;redraw();
}
function redraw(){
 if(!state.scene)return;
 const {scene,world,selected,debug,clearance}=state;
 if(world?.updateDebug){
  world.updateDebug({showRoute:debug,showClearance:clearance,selectedSocket:selected});
 }else{
  scene.overlay.clear();
  if(debug){
   const a=state.map.path;
   scene.overlay.lineStyle(2,0x58ecdc,.92);
   scene.overlay.beginPath();scene.overlay.moveTo(...a[0]);for(const p of a.slice(1))scene.overlay.lineTo(...p);scene.overlay.strokePath();
   scene.overlay.fillStyle(0xffffe6,.85);a.forEach(([x,y],i)=>{if(i%5===0)scene.overlay.fillCircle(x,y,3);});
  }
  if(clearance||selected)for(const s of visualSocketPreview(state.map)){
   scene.overlay.lineStyle(2,s.socketId===selected?0xffe8a0:0x98d7f8,s.socketId===selected?1:.53);
   scene.overlay.strokeCircle(s.world.x,s.world.y,54);
  }
 }
}
class MapOnlyScene extends Phaser.Scene{
 constructor(){super({key:"MapOnlyScene"});this.elapsed=0;this.routeBead=null;}
 create(){
  state.scene=this;
  const map=state.map;
  try{
   if(mode==="ph02b"){
    installDeluxeArt(this,map);
    this.overlay=this.add.graphics().setDepth(6000);
    state.world=null;
   }else{
    state.world=mountM01World(this,map,{palette:mode});
    this.overlay=state.world.objects.at(-1);
   }
  }catch(e){$("blocker").hidden=false;$("blocker").textContent="No fue posible dibujar el escenario: "+e.message;console.error(e);return;}
  // Route inspection marker ONLY, not an enemy or simulated gameplay.
  this.routeBead=this.add.circle(-50,-50,8,0xeed6ff,.92).setStrokeStyle(3,0x4f5378);
  this.routeBead.setDepth(5500).setVisible(false);
  const sockets=visualSocketPreview(map);
  this.input.on("pointerdown",pointer=>{
   const world=this.cameras.main.getWorldPoint(pointer.x,pointer.y);
   const pick=sockets.find(s=>Math.hypot(world.x-s.world.x,world.y-s.world.y)<=54);
   if(pick)showSocket(pick);else closeSocket();
  });
  $("blocker").hidden=true;
  $("socketCount").textContent=String(sockets.length);
  $("pathCount").textContent=String(map.path.length);
  $("propCount").textContent=mode==="ph02b"?"PH02B":String(state.world.plan.props.length);
  $("pathWidth").textContent="110";
  const gl2=checkSource(this.game.renderer);
  $("engine").textContent="Phaser "+Phaser.VERSION+" · "+(gl2?"WebGL2 verificado":"WebGL2 no confirmado");
  $("proof").textContent="Mapa oficial de referencia · SIN gameplay de torres";
  log("Mapa completo disponible. Toca uno de los ocho sockets para inspeccionarlo.");
  redraw();
 }
 update(_time,delta){
  if(!this.routeBead)return;
  this.routeBead.setVisible(state.marker);
  if(!state.marker||document.hidden||state.paused)return;
  this.elapsed+=Math.min(delta,100)/1000;
  const route=state._route,dist=(this.elapsed*63)%route.total;
  const p=positionOnPath(route,dist);
  this.routeBead.setPosition(p.x,p.y);
 }
}
(async()=>{
 try{
  mountButtons();
  if(!window.Phaser||window.Phaser.VERSION!=="4.2.1")throw Error("Se requiere la biblioteca Phaser 4.2.1 local");
  state.map=await canonicalMap();
  state._route=pathSegments(state.map.path);
  const canvas=document.createElement("canvas");
  const gl=canvas.getContext("webgl2",{alpha:false,antialias:true});
  if(!gl||typeof WebGL2RenderingContext==="undefined"||!(gl instanceof WebGL2RenderingContext))throw Error("Tu navegador no ha proporcionado WebGL2; se detiene la vitrina, sin falsificar el motor");
  window.__teamMShowcase=new Phaser.Game({
   type:Phaser.WEBGL,canvas,context:gl,parent:"stage",width:1280,height:768,
   backgroundColor:"#628b75",antialias:true,
   scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:1280,height:768},
   audio:{noAudio:true},scene:[MapOnlyScene]
  });
  document.addEventListener("visibilitychange",()=>{state.paused=document.hidden;});
 }catch(e){$("blocker").hidden=false;$("blocker").textContent="No se pudo iniciar la vitrina M-01: "+e.message;console.error(e);}
})();