/**
 * T09 isolated DOM presenter. Owns ONLY its overlay and listeners on that overlay.
 * No Phaser input, economy calls, document listeners or background click interception.
 * DG owns open/close/selection/quote refresh/worldToScreen/onIntent confirmation.
 */
import {layoutContextNodes} from './layout.mjs';
export const T09_ICONS=Object.freeze(Object.fromEntries(
 ['build-infantry','build-sniper','upgrade','sell','rally','close','inspect','cost','blocked']
 .map(id=>[id,new URL('../../../art/towers/t09/icons/'+id+'.svg',import.meta.url).href])));
export function mountT09Presenter(host,{onIntent=()=>{},onLayout=null}={}){
 if(!host||typeof host.appendChild!=='function'||typeof onIntent!=='function')throw Error('T09 needs DOM host/onIntent');
 const doc=host.ownerDocument;
 const el=(tag,cls)=>{const x=doc.createElement(tag);if(cls)x.className=cls;return x};
 const root=el('div','t09-overlay');root.setAttribute('aria-label','Menú contextual de torres');
 const focus=el('div','t09-focus');focus.setAttribute('aria-hidden','true');
 const wires=doc.createElementNS('http://www.w3.org/2000/svg','svg');wires.setAttribute('class','t09-wires');wires.setAttribute('aria-hidden','true');
 const items=el('div','t09-items');
 const live=el('div','t09-feedback');live.setAttribute('role','status');live.setAttribute('aria-live','polite');
 root.append(focus,wires,items,live);host.append(root);
 let current=null,layout=null,disposed=false;
 function stop(event){event.stopPropagation();}
 function trigger(event){
  if(disposed||!current)return;
  const button=event.target?.closest?.('button[data-t09-id]');
  if(!button||!items.contains(button))return;
  event.stopPropagation();event.preventDefault();
  const node=current.nodes.find(n=>n.id===button.dataset.t09Id);
  if(!node||!node.enabled||button.disabled)return;
  // Never mutate GOLD or tower; onIntent is a suggestion, integrator re-quotes.
  onIntent({...node.intent}, {nodeId:node.id,specVersion:current.version,revision:current.revision});
 }
 root.addEventListener('pointerdown',stop);root.addEventListener('pointerup',stop);
 root.addEventListener('click',trigger);
 function onKeyDown(e){if(e.key==='Escape'&&current){e.stopPropagation();onIntent({action:'close',socketIndex:current.selectedSocketIndex,revision:current.revision},{nodeId:'escape',specVersion:current.version});}}
 root.addEventListener('keydown',onKeyDown);
 // IMPORTANT: overlay has pointer-events:none; only buttons consume pointer events.
 function clear(){
  if(disposed)return;
  current=null;layout=null;items.replaceChildren();wires.replaceChildren();focus.hidden=true;live.textContent='';root.hidden=true;
 }
 function update(spec,{anchorScreen,viewportSafeRect,nodeDiameter=54,preferredOrientation='auto'}={}){
  if(disposed)throw Error('T09 presenter destroyed');
  if(!spec||spec.closed){clear();return null}
  const result=layoutContextNodes({anchorScreen,viewportSafeRect,nodeSpecs:spec.nodes,nodeDiameter,preferredOrientation});
  current=spec;layout=result;root.hidden=false;items.replaceChildren();wires.replaceChildren();
  const center=result.anchorScreen;
  focus.hidden=false;focus.style.left=center.x+'px';focus.style.top=center.y+'px';
  focus.classList.toggle('t09-focus--readonly',!!spec.readonly);
  if(!result.fits){
   live.textContent='Espacio insuficiente para controles táctiles. Cierra otros paneles.';
   onLayout?.(result);return result;
  }
  for(const line of result.lines){
   const item=doc.createElementNS('http://www.w3.org/2000/svg','line');
   item.setAttribute('x1',String(line.x1));item.setAttribute('y1',String(line.y1));
   item.setAttribute('x2',String(line.x2));item.setAttribute('y2',String(line.y2));
   item.setAttribute('stroke','#d2c297');item.setAttribute('stroke-width','2');item.setAttribute('stroke-opacity','.75');
   wires.append(item);
  }
  for(const b of result.nodes){
   const node=spec.nodes.find(n=>n.id===b.id);
   const button=el('button','t09-node');button.type='button';button.dataset.t09Id=node.id;
   button.disabled=!node.enabled;button.setAttribute('aria-label',node.ariaLabel);button.title=node.ariaLabel;
   button.style.left=b.x+'px';button.style.top=b.y+'px';button.style.width=b.width+'px';button.style.height=b.height+'px';
   if(node.id==='close')button.classList.add('t09-node--close');
   if(!node.enabled)button.classList.add('t09-node--disabled');
   if(node.highlight)button.classList.add('t09-node--selected');
   const img=el('img','t09-node__icon');img.src=T09_ICONS[node.icon]??T09_ICONS.blocked;img.alt='';img.draggable=false;
   button.append(img);
   if(node.price!==null){
    const amount=el('span','t09-node__price');amount.textContent=(node.action==='sell'?'+':'')+String(node.price);
    button.append(amount);
   }
   items.append(button);
  }
  const labels={ 'open-empty-socket':'Elegir torre','paused-read-only':'Pausa · solo lectura',
   'awaiting-rally-selection':'Selecciona punto de reunión','unavailable-over-game':'Partida terminada'};
  live.textContent=labels[spec.status]??'Torre '+(spec.tower?.family??'')+' · nivel '+(spec.tower?.level??'');
  onLayout?.(result);return result;
 }
 function destroy(){
  if(disposed)return;clear();disposed=true;
  root.removeEventListener('pointerdown',stop);root.removeEventListener('pointerup',stop);
  root.removeEventListener('click',trigger);root.removeEventListener('keydown',onKeyDown);root.remove();current=null;layout=null;
 }
 return Object.freeze({update,clear,destroy,get current(){return current},get layout(){return layout},get destroyed(){return disposed},root});
}
