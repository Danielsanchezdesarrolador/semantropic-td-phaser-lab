/**
 * U07 · SEMANTROPIC TD — Gallery of inherited tower art, integrated in the
 * single canonical LIVE application. READ ONLY, no family unlock or combat.
 * It imports HD renderer U06, not a second game or alternate build.
 */
import {U06_LEGACY_TOWER_PRESETS,preloadLegacyTowerHD} from './legacy-hd.mjs';

export const U07_GALLERY_VERSION='u07-legacy-hd-showroom-live-v1';
const NAMES=Object.freeze({guardian:'GUARDIANA',artillery:'BOMBARDERA',control:'TORRE DE CONTROL'});
const make=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt)e.textContent=txt;return e};
function cardFor(name,meta){
 const card=make('article','tower-hd-card');
 const title=make('h3','tower-hd-card-title',NAMES[name]);
 const desc=make('p','tower-hd-caption','Arte original · Tratamiento HD · Sin mecánicas Phaser todavía');
 const comparison=make('div','tower-hd-comparison');
 const raw=make('div','tower-hd-frame'),hd=make('div','tower-hd-frame');
 const labelA=make('span','tower-hd-tag','ORIGINAL'),labelB=make('span','tower-hd-tag','HD 3×');
 const img=make('img','tower-hd-illustration');
 img.src=meta.url;img.alt=NAMES[name]+' · arte original conservado';img.draggable=false;img.loading='eager';
 const render=make('div','tower-hd-render');
 render.setAttribute('aria-label',NAMES[name]+' tratamiento HD');
 const status=make('small','tower-hd-status','Preparando renderizado…');
 raw.append(labelA,img);hd.append(labelB,render);comparison.append(raw,hd);
 card.append(title,desc,comparison,status);
 return {card,render,status};
}
export function mountU07HDGallery({buttonId='towerHDGalleryButton',rootId='towerHDGallery'}={}){
 const button=document.getElementById(buttonId),root=document.getElementById(rootId);
 if(!button||!root)throw Error('U07 gallery root/button missing');
 const closeButton=document.getElementById('towerHDGalleryClose');
 const grid=root.querySelector('.tower-hd-grid'),zoom=root.querySelector('#towerHDZoom');
 const count=root.querySelector('#towerHDZoomValue'),announce=root.querySelector('#towerHDGalleryStatus');
 if(!closeButton||!grid||!zoom||!count||!announce)throw Error('U07 gallery structure incomplete');
 const rendered=new Map();let isOpen=false,pausedByGallery=false,previousFocus=null,loading=null;
 const updateZoom=()=>{
  const val=Number(zoom.value);count.textContent=val+'%';
  grid.style.setProperty('--hd-image-height',Math.round(132*val/100)+'px');
 };
 const world=()=>window.__SEMANTROPIC_C1D7?.world;
 async function load(){
  if(loading)return loading;
  loading=(async()=>{
   announce.textContent='Preparando las tres torres HD…';
   grid.replaceChildren();
   const results=await Promise.allSettled(Object.entries(U06_LEGACY_TOWER_PRESETS).map(async([name,meta])=>{
    const ui=cardFor(name,meta);grid.appendChild(ui.card);
    try{
     const res=await preloadLegacyTowerHD(meta.url,{factor:3,sharpness:.21});
     res.canvas.className='tower-hd-illustration';
     res.canvas.setAttribute('role','img');
     res.canvas.setAttribute('aria-label',NAMES[name]+' HD procesada en Canvas');
     ui.render.replaceChildren(res.canvas);
     ui.status.textContent=res.sourceWidth+'×'+res.sourceHeight+' → '+res.width+'×'+res.height+
      ' píxeles · factor '+res.density.toFixed(1)+'×';
     rendered.set(name,res);
     return true;
    }catch(error){
     ui.status.textContent='No fue posible preparar la imagen: '+error.message;
     return false;
    }
   }));
   const count=results.filter(x=>x.status==='fulfilled'&&x.value).length;
   announce.textContent=count===3?'3 de 3 torres HD preparadas. Vista artística, aún no construibles en M01.':
    count+' de 3 imágenes disponibles; comprueba la conexión.';
   return count;
  })();
  return loading;
 }
 function open(){
  if(isOpen)return;
  isOpen=true;previousFocus=document.activeElement;
  root.hidden=false;button.setAttribute('aria-expanded','true');
  const gameWorld=world();
  pausedByGallery=!!(gameWorld&&!gameWorld.paused&&!gameWorld.ended&&gameWorld.pause());
  if(pausedByGallery)window.__SEMANTROPIC_C1D7?.scene?.updateHud?.();
  updateZoom();closeButton.focus();void load();
 }
 function close(){
  if(!isOpen)return;
  isOpen=false;root.hidden=true;button.setAttribute('aria-expanded','false');
  if(pausedByGallery){
   const gameWorld=world();
   if(gameWorld&&!gameWorld.ended&&gameWorld.paused)gameWorld.resume();
   window.__SEMANTROPIC_C1D7?.scene?.updateHud?.();
  }
  pausedByGallery=false;
  (previousFocus&&document.contains(previousFocus)?previousFocus:button).focus();
 }
 button.addEventListener('click',open);
 closeButton.addEventListener('click',close);
 zoom.addEventListener('input',updateZoom);
 root.addEventListener('click',event=>{if(event.target===root)close()});
 root.addEventListener('keydown',event=>{
  if(event.key==='Escape'){event.preventDefault();close();return}
  if(event.key!=='Tab')return;
  const interactive=[...root.querySelectorAll('button:not([disabled]),input:not([disabled])')];
  const first=interactive[0],last=interactive[interactive.length-1];
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
 });
 button.setAttribute('aria-expanded','false');
 return Object.freeze({open,close,get opened(){return isOpen},
  get processed(){return new Map(rendered)},get version(){return U07_GALLERY_VERSION}});
}
