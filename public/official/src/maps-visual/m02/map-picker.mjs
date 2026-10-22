/** R3-C. Select M01/M02 on same official LIVE pathname, with safe full navigation. */
export function mountR3CMapPicker(){
 const selected=new URLSearchParams(location.search).get('map')==='2'?2:1;
 const get=id=>document.getElementById(id);
 const trigger=get('mapPickerButton'),dialog=get('mapPicker'),close=get('mapPickerClose');
 if(!trigger||!dialog||!close)throw Error('Missing R3-C selector elements');
 const hide=()=>{dialog.hidden=true;trigger.setAttribute('aria-expanded','false');trigger.focus()};
 trigger.textContent='Mapa '+String(selected).padStart(2,'0')+' ▾';
 trigger.setAttribute('aria-expanded','false');
 trigger.addEventListener('click',()=>{dialog.hidden=false;trigger.setAttribute('aria-expanded','true');close.focus()});
 close.addEventListener('click',hide);
 dialog.addEventListener('click',e=>{if(e.target===dialog)hide()});
 dialog.addEventListener('keydown',e=>{
  if(e.key==='Escape'){e.preventDefault();hide()}
  if(e.key==='Tab'){
   const buttons=[...dialog.querySelectorAll('button')];
   if(e.shiftKey&&document.activeElement===buttons[0]){e.preventDefault();buttons.at(-1).focus()}
   else if(!e.shiftKey&&document.activeElement===buttons.at(-1)){e.preventDefault();buttons[0].focus()}
  }
 });
 for(const button of dialog.querySelectorAll('button[data-map-target]')){
  const id=Number(button.dataset.mapTarget);
  button.setAttribute('aria-current',String(id===selected));
  button.addEventListener('click',()=>{
   if(id===selected){hide();return}
   const u=new URL(location.href);
   if(id===1)u.searchParams.delete('map');else u.searchParams.set('map','2');
   u.searchParams.delete('operator');u.searchParams.delete('t10hf2');
   location.assign(u.pathname+u.search);
  });
 }
 if(selected===2){
  document.title='SEMANTROPIC TD — Mapa 02 | Campos del Molino';
  get('mapReleaseLabel').textContent='SEMANTROPIC TD · MAPA 02 CAMPOS DEL MOLINO';
  get('coins').textContent='395';get('lives').textContent='100';
  get('wave').textContent='0/7';
  get('feedback').textContent='Cargando Mapa 02 · Campos del Molino…';
  get('resultRestart').textContent='Volver a jugar Mapa 02';
 }
 return Object.freeze({selectedMap:selected,version:'r3-c-map-picker-live-v1'});
}
