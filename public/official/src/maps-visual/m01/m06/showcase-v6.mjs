/** M06 original Phaser 4.2.1 showcase. Real renderer, no game loop or fabricated kills. */
import {validateM01,visualSocketPreview} from "../renderer.mjs";
import {preloadM06Illustrations,mountM01WorldV6,M06_TREATMENTS,M06_VERSION} from "./renderer-v6.mjs";
import {mountM01WorldV5} from "../m05/renderer-v5.mjs";
import {mountM01WorldV4} from "../m04/renderer-v4.mjs";
const $=name=>document.getElementById(name),params=new URLSearchParams(location.search);
const MODES=new Set(["m04","m05a","m05b","atmosfera","relieve"]);
const PALETTES=new Set(["equilibrada","viva","atmosferica"]);
let map=null,scene=null,view=null,mode=MODES.has(params.get("mode"))?params.get("mode"):"atmosfera";
let palette=PALETTES.has(params.get("palette"))?params.get("palette"):"equilibrada";
let reduceMotion=true,selected=null,occupation=true,actorCount=0,debug={route:false,sockets:false,density:false},zoom=1;
let densityOverlay=null,actorMarkers=[];
const MODE_LABELS={
 m04:"M04 · Base previa",m05a:"M05 A · Bucólico",m05b:"M05 B · Contraste",
 atmosfera:"M06 A · Pintura atmosférica",relieve:"M06 B · Relieve estructural"
};
function updateUi(){
 $("modeLabel").textContent=MODE_LABELS[mode];
 $("runtimeType").textContent=mode.startsWith("m06")?"M06":mode.startsWith("m05")?"M05":mode;
 $("paintStyle").textContent=mode==="atmosfera"?"Pinceladas de suave mezcla":mode==="relieve"?"Estratos y sombras talladas":"Escena heredada";
 $("occupancy").textContent=occupation?"Bases ocupadas · muestra":"Bases libres · muestra";
 $("motion").textContent=reduceMotion?"Movimiento reducido: SÍ":"Movimiento reducido: NO";
 $("actorFixture").textContent=actorCount?"Marcadores ficticios: "+actorCount:"Sin marcadores";
 for(const b of document.querySelectorAll("[data-mode]"))b.classList.toggle("selected",b.dataset.mode===mode);
 for(const b of document.querySelectorAll("[data-palette]"))b.classList.toggle("selected",b.dataset.palette===palette);
 $("zoom").textContent=Math.round(zoom*100)+"%";
 $("textures").textContent=view?.painterlyProps?.length||0;
}
function setPadPreview(){
 if(!view)return;
 const sockets=visualSocketPreview(map);
 const snapshot={tick:100,selectedSocketId:selected,
  sockets:sockets.map(s=>({socketId:s.socketId,occupied:occupation&&[1,3,4,5].includes(s.legacySpotIndex)}))};
 if(view.applyVisualSnapshot)view.applyVisualSnapshot(snapshot);
 else for(const s of snapshot.sockets)view.setSocketVisualState?.(s.socketId,s.occupied?"occupied":"neutral");
 updateUi();
}
function clearMarkers(){for(const v of actorMarkers)v.destroy();actorMarkers=[];}
function positionsOnPath(count){
 const path=map.path,segments=[];let sum=0;
 for(let i=1;i<path.length;i++){const a=path[i-1],b=path[i],len=Math.hypot(b[0]-a[0],b[1]-a[1]);segments.push({a,b,len,cum:sum});sum+=len;}
 return Array.from({length:count},(_,i)=>{
  const target=sum*(.05+.9*i/Math.max(count-1,1));
  const seg=segments.find(s=>s.cum+s.len>=target)||segments.at(-1);
  const t=seg.len?(target-seg.cum)/seg.len:0;
  return [seg.a[0]+(seg.b[0]-seg.a[0])*t,seg.a[1]+(seg.b[1]-seg.a[1])*t];
 });
}
function markers(count){
 clearMarkers();actorCount=count;
 if(!scene||!count)return;
 for(const [i,[x,y]] of positionsOnPath(count).entries()){
  const marker=scene.add.container(x,y);
  const g=scene.add.graphics().setDepth(0);
  g.fillStyle(i%4===0?0x9dbab4:0xbb9d7e,.85).fillEllipse(0,0,i%4===0?16:14,12);
  g.lineStyle(1.4,0x143c41,.95).strokeEllipse(0,0,16,12);
  g.fillStyle(0x87d2a5,.9).fillRect(-8,-14,15,2);
  marker.add(g);marker.setDepth(2100);actorMarkers.push(marker);
 }
}
function refreshDebug(){
 view?.updateDebug?.({showRoute:debug.route,showClearance:debug.sockets,selectedSocket:selected});
 if(densityOverlay){
  densityOverlay.clear();
  if(debug.density)for(const [i,z] of [[150,160],[330,145],[530,650],[775,662],[974,663],[1160,150]].entries()){
   densityOverlay.lineStyle(2,0xffdda0,.65).strokeEllipse(z[0],z[1],250,155);
   densityOverlay.fillStyle(0x163d43,.45).fillCircle(z[0],z[1],5);
  }
 }
}
function setMode(next=mode,nextPalette=palette){
 if(!scene||!MODES.has(next)||!PALETTES.has(nextPalette))return;
 clearMarkers();
 if(densityOverlay){densityOverlay.destroy();densityOverlay=null;}
 if(view?.destroy)view.destroy();view=null;selected=null;
 try{
  if(next==="m04")view=mountM01WorldV4(scene,map,{palette:nextPalette});
  else if(next==="m05a"||next==="m05b")
   view=mountM01WorldV5(scene,map,{palette:nextPalette,treatment:next==="m05a"?"bucolico":"contraste"});
  else view=mountM01WorldV6(scene,map,{palette:nextPalette,treatment:next,reducedMotion:reduceMotion});
  if(view.missing?.length)throw Error("Missing source textures: "+JSON.stringify(view.missing));
  densityOverlay=scene.add.graphics().setDepth(2300);
  mode=next;palette=nextPalette;setPadPreview();markers(actorCount);refreshDebug();updateUi();
  $("blocker").hidden=true;
 }catch(e){$("blocker").hidden=false;$("blocker").textContent="Error M06: "+e.message;console.error(e);}
}
function bind(){
 for(const b of document.querySelectorAll("[data-mode]"))b.onclick=()=>setMode(b.dataset.mode);
 for(const b of document.querySelectorAll("[data-palette]"))b.onclick=()=>setMode(mode,b.dataset.palette);
 $("occupancy").onclick=()=>{occupation=!occupation;setPadPreview();};
 $("motion").onclick=()=>{reduceMotion=!reduceMotion;view?.setReducedMotion?.(reduceMotion);updateUi()};
 $("actorFixture").onclick=()=>{const next=actorCount===0?13:actorCount===13?24:0;markers(next);updateUi()};
 for(const k of Object.keys(debug))$(k).onclick=()=>{debug[k]=!debug[k];$(k).classList.toggle("selected",debug[k]);refreshDebug();};
 for(const b of document.querySelectorAll("[data-zoom]"))b.onclick=()=>{zoom=Number(b.dataset.zoom);scene?.cameras.main.setZoom(zoom);scene?.cameras.main.centerOn(640,384);updateUi();};
 $("close").onclick=()=>{selected=null;$("socketBox").hidden=true;refreshDebug()};
}
class ArtScene extends Phaser.Scene{
 constructor(){super("M06ArtScene")}
 preload(){preloadM06Illustrations(this)}
 create(){
  scene=this;
  const webgl2=typeof WebGL2RenderingContext!=="undefined"&&this.game.renderer?.gl instanceof WebGL2RenderingContext;
  $("engine").textContent="Phaser "+Phaser.VERSION+" / "+(webgl2?"WebGL2 real":"WebGL2 NO VERIFICADO");
  this.input.on("pointerdown",pointer=>{
   const w=this.cameras.main.getWorldPoint(pointer.x,pointer.y);
   const s=visualSocketPreview(map).find(s=>Math.hypot(s.world.x-w.x,s.world.y-w.y)<54);
   selected=s?.socketId||null;
   $("socketBox").hidden=!s;
   if(s)$("socketInfo").textContent=s.socketId+" / ("+s.world.x+","+s.world.y+") / radius 54 (vista)";
   setPadPreview();refreshDebug();
  });
  setMode(mode,palette);
 }
 update(now){view?.updateAmbient?.(now);}
}
(async()=>{
 try{
  bind();
  const r=await fetch(new URL("../../../../data/maps.v5.json",import.meta.url),{cache:"no-store"});
  if(!r.ok)throw Error("Fuente canónica 404/HTTP "+r.status);
  map=(await r.json())[0];validateM01(map);
  if(!window.Phaser||Phaser.VERSION!=="4.2.1")throw Error("Phaser 4.2.1 no cargado");
  const canvas=document.createElement("canvas"),gl=canvas.getContext("webgl2",{alpha:false,antialias:true});
  if(!gl||typeof WebGL2RenderingContext==="undefined"||!(gl instanceof WebGL2RenderingContext))throw Error("WebGL2 no disponible");
  new Phaser.Game({type:Phaser.WEBGL,canvas,context:gl,parent:"stage",
   width:1280,height:768,backgroundColor:"#7eaa7a",antialias:true,
   scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:1280,height:768},
   audio:{noAudio:true},scene:[ArtScene]});
 }catch(e){$("blocker").hidden=false;$("blocker").textContent="No arrancó M06: "+e.message;console.error(e);}
})();
