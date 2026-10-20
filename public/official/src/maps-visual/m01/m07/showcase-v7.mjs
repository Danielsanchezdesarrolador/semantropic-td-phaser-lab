/**
 * MAPAS M07 — real Phaser art-only single-scene viewer.
 * C1C screenshot is NEVER synthesized. It is selected by user in gallery.html.
 * M06 is a comparison reference ONLY; we never blend it with the restored M03.
 */
import {validateM01,visualSocketPreview} from "../renderer.mjs";
import {preloadM07Illustrations,mountM01WorldV7,M07_CANONICAL_PALETTE} from "./renderer-v7.mjs";
const $=id=>document.getElementById(id),params=new URLSearchParams(location.search);
const MODES=new Set(["fiel","pulido"]);
let mode=MODES.has(params.get("mode"))?params.get("mode"):"fiel";
let map=null,scene=null,view=null,showPads=false,showRoute=false,selected=null;
let motionReduced=true,markers=[],markerCount=0;
const modeNames={
 fiel:"M07 • Fiel a M03/C1-C",pulido:"M07 • Pulido conservador"
};
function clearMarkers(){markers.forEach(x=>x.destroy());markers=[];}
function pathMarkers(n){
 clearMarkers();markerCount=n;
 if(!scene||!n)return;
 // Markers are small neutral geometry and DO NOT represent P05 actors or hits.
 const P=map.path,segments=[];let distance=0;
 for(let i=1;i<P.length;i++){const len=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);
  segments.push({a:P[i-1],b:P[i],start:distance,len});distance+=len;}
 for(let i=0;i<n;i++){
  const at=distance*(.065+i*.86/Math.max(1,n-1));
  const seg=segments.find(s=>s.start+s.len>=at)||segments.at(-1),t=seg.len?(at-seg.start)/seg.len:0;
  const x=seg.a[0]+(seg.b[0]-seg.a[0])*t,y=seg.a[1]+(seg.b[1]-seg.a[1])*t;
  const g=scene.add.graphics().setDepth(2200);
  g.fillStyle(0x395f55,.8).fillEllipse(x,y-10,13,16);
  g.lineStyle(1.6,0xf1e1aa,.8).strokeEllipse(x,y-10,13,16);
  g.fillStyle(0x70bb90,.95).fillRect(x-7,y-24,14,2);
  markers.push(g);
 }
}
function showDebug(){
 view?.updateDebug?.({showRoute,showClearance:showPads,selectedSocket:selected});
}
function syncPads(){
 if(!view)return;
 const sockets=visualSocketPreview(map);
 view.applyVisualSnapshot?.({
  tick:100,
  selectedSocketId:selected,
  sockets:sockets.map(s=>({socketId:s.socketId,occupied:[1,3,4,5].includes(s.legacySpotIndex)}))
 });
 showDebug();
}
function setMode(next){
 if(!scene||!MODES.has(next))return;
 clearMarkers();
 view?.destroy();view=null;
 try{
  view=mountM01WorldV7(scene,map,{palette:M07_CANONICAL_PALETTE,treatment:next});
  if(view.missing?.length)throw Error("SVG faltantes: "+JSON.stringify(view.missing));
  mode=next;syncPads();pathMarkers(markerCount);updateLabels();$("blocker").hidden=true;
 }catch(err){$("blocker").hidden=false;$("blocker").textContent="No se pudo montar: "+err.message;console.error(err);}
}
function updateLabels(){
 $("modeName").textContent=modeNames[mode];
 $("snapshot").textContent="M07: terreno M03 Viva preservado";
 $("markers").textContent=markerCount?"Marcadores sintéticos: "+markerCount:"Sin marcadores";
 $("runtimeCounts").textContent=(view?.padObjects?.length||0)+" pads · "+(view?.propObjects?.length||0)+" props";
 for(const el of document.querySelectorAll("[data-mode]"))el.classList.toggle("selected",el.dataset.mode===mode);
 $("padDebug").classList.toggle("selected",showPads);
 $("roadDebug").classList.toggle("selected",showRoute);
}
function controls(){
 for(const b of document.querySelectorAll("[data-mode]"))b.onclick=()=>setMode(b.dataset.mode);
 $("padDebug").onclick=()=>{showPads=!showPads;showDebug();updateLabels()};
 $("roadDebug").onclick=()=>{showRoute=!showRoute;showDebug();updateLabels()};
 $("markers").onclick=()=>{pathMarkers(markerCount===0?13:markerCount===13?24:0);updateLabels()};
 $("resetView").onclick=()=>{scene.cameras.main.setZoom(1);scene.cameras.main.centerOn(640,384);selected=null;syncPads()};
 $("closePanel").onclick=()=>{selected=null;$("padPanel").hidden=true;syncPads()};
 $("motion").onclick=()=>{motionReduced=!motionReduced;view?.setReducedMotion?.(motionReduced);$("motion").textContent=motionReduced?"Movimiento reducido":"Movimiento normal"};
}
class M07Review extends Phaser.Scene{
 constructor(){super("M07Review")}
 preload(){preloadM07Illustrations(this)}
 create(){
  scene=this;
  const real=typeof WebGL2RenderingContext!=="undefined"&&this.game.renderer?.gl instanceof WebGL2RenderingContext;
  $("runtime").textContent="Phaser "+Phaser.VERSION+" / "+(real?"WebGL2 comprobado":"WebGL2 NO confirmado");
  this.input.on("pointerdown",point=>{
   const w=this.cameras.main.getWorldPoint(point.x,point.y);
   const sock=visualSocketPreview(map).find(s=>Math.hypot(s.world.x-w.x,s.world.y-w.y)<=54);
   selected=sock?.socketId||null;$("padPanel").hidden=!sock;
   if(sock)$("padInfo").textContent=sock.socketId+" · "+sock.world.x+","+sock.world.y+" · radius 54 (vista, no collider)";
   syncPads();
  });
  setMode(mode);
 }
 update(time){view?.updateAmbient?.(time);}
}
(async()=>{
 try{
  controls();const response=await fetch(new URL("../../../../data/maps.v5.json",import.meta.url),{cache:"no-store"});
  if(!response.ok)throw Error("Error HTTP "+response.status+" en maps.v5.json");
  map=(await response.json())[0];validateM01(map);
  if(!window.Phaser||Phaser.VERSION!=="4.2.1")throw Error("Phaser 4.2.1 no disponible");
  const canvas=document.createElement("canvas"),gl=canvas.getContext("webgl2",{alpha:false,antialias:true});
  if(!gl||typeof WebGL2RenderingContext==="undefined"||!(gl instanceof WebGL2RenderingContext))throw Error("WebGL2 requerido");
  new Phaser.Game({type:Phaser.WEBGL,canvas,context:gl,parent:"stage",
   width:1280,height:768,backgroundColor:"#8dbb78",antialias:true,
   scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:1280,height:768},
   audio:{noAudio:true},scene:[M07Review]});
 }catch(err){$("blocker").hidden=false;$("blocker").textContent="Error de inicio M07: "+err.message;console.error(err);}
})();
