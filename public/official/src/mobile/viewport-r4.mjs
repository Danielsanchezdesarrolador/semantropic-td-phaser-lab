/** SEMANTROPIC TD R4: fullscreen, orientation assistance, safe-area viewport
 * and Phaser scale manager refresh. The 1280x768 gameplay geometry never changes.
 */
import {attachR5Panorama} from './viewport-panorama-r5.mjs';
export const R4_VIEWPORT_VERSION='r5-immersive-landscape-panorama-v1';
export function mountR4Viewport({host=document.getElementById('app')}={}){
 if(!host)throw Error('R4: app root missing');
 const get=id=>document.getElementById(id);
 const trigger=get('fullscreenButton'),portraitTrigger=get('portraitFullscreen'),
  status=get('viewportStatus');
 if(!trigger||!portraitTrigger||!status)throw Error('R4: controls missing');
 const panorama=attachR5Panorama({stage:get('stage')});
 let statusTimeout=null,frame=0;
 const isFull=()=>document.fullscreenElement===host||document.webkitFullscreenElement===host;
 function message(value){
  status.textContent=value;status.hidden=false;
  if(statusTimeout)clearTimeout(statusTimeout);
  statusTimeout=setTimeout(()=>status.hidden=true,4700);
 }
 function sync(){
  const active=isFull();
  trigger.setAttribute('aria-pressed',String(active));
  trigger.setAttribute('aria-label',active?'Salir de pantalla completa':'Activar pantalla completa');
  portraitTrigger.setAttribute('aria-pressed',String(active));
  trigger.querySelector('.fullscreen-text').textContent=active?'Salir de pantalla completa':'Pantalla completa';
  trigger.querySelector('.fullscreen-glyph').textContent=active?'⤢':'⛶';
  document.documentElement.classList.toggle('r4-fullscreen',active);
  scheduleResize();
 }
 function scheduleResize(){
  if(frame)cancelAnimationFrame(frame);
  frame=requestAnimationFrame(()=>{
   frame=0;
   // Scene managers may not exist until after async module loading.
   const scale=window.__SEMANTROPIC_C1D7?.scene?.game?.scale;
   scale?.refresh?.();
   panorama.refresh();
  });
 }
 async function toggle(){
  if(isFull()){
   try{const exit=document.exitFullscreen||document.webkitExitFullscreen;
    if(exit)await exit.call(document);
   }catch{message('Usa Esc para salir del modo de pantalla completa.')}
   sync();return;
  }
  const enter=host.requestFullscreen||host.webkitRequestFullscreen;
  if(!enter){
   message('Tu navegador no permite pantalla completa. Puedes usar «Añadir a pantalla de inicio».');
   return;
  }
  try{
   await enter.call(host,{navigationUI:'hide'});
   // Browsers are allowed to reject orientation lock; preserve fullscreen on error.
   if(window.matchMedia('(pointer:coarse)').matches&&screen.orientation?.lock){
    try{await screen.orientation.lock('landscape')}catch{}
   }
   sync();
  }catch{
   message('Pantalla completa no disponible. Prueba abrir el juego en el navegador o añadirlo a inicio.');
  }
 }
 trigger.addEventListener('click',toggle);
 portraitTrigger.addEventListener('click',toggle);
 document.addEventListener('fullscreenchange',sync);
 document.addEventListener('webkitfullscreenchange',sync);
 window.addEventListener('resize',scheduleResize,{passive:true});
 window.addEventListener('orientationchange',scheduleResize,{passive:true});
 window.visualViewport?.addEventListener('resize',scheduleResize,{passive:true});
 const observer=typeof ResizeObserver!=='undefined'?new ResizeObserver(scheduleResize):null;
 observer?.observe(host);
 sync();
 return Object.freeze({version:R4_VIEWPORT_VERSION,toggle,refresh:scheduleResize,
  bindScene:(scene,mapId)=>panorama.bind(scene,mapId),
  get panorama(){return panorama.report},
  get fullscreen(){return isFull()},get supported(){return !!(host.requestFullscreen||host.webkitRequestFullscreen)}});
}
