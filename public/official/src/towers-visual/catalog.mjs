// T-01 — Datos de PRESENTACIÓN. No son estadísticas de daño ni desbloqueos de juego.
export const TOWER_ART = Object.freeze([
  {assetId:'towers/infantry/level-1',family:'infantry',level:1,title:'Cuartel de Reclutas',url:'../../art/towers/infantry/level-1.svg',socketId:'fixture-01',footAnchor:{x:.5,y:.93},muzzleLocal:{x:0,y:-90},type:'deploy'},
  {assetId:'towers/infantry/level-2',family:'infantry',level:2,title:'Cuartel Veterano',url:'../../art/towers/infantry/level-2.svg',socketId:'fixture-02',footAnchor:{x:.5,y:.93},muzzleLocal:{x:0,y:-92},type:'deploy'},
  {assetId:'towers/sniper/level-1',family:'sniper',level:1,title:'Vigía Recluta',url:'../../art/towers/sniper/level-1.svg',socketId:'fixture-03',footAnchor:{x:.5,y:.93},muzzleLocal:{x:96,y:-246},type:'tracer'},
  {assetId:'towers/sniper/level-2',family:'sniper',level:2,title:'Vigía Veterano',url:'../../art/towers/sniper/level-2.svg',socketId:'fixture-04',footAnchor:{x:.5,y:.93},muzzleLocal:{x:126,y:-259},type:'tracer'}
]);
export function validateTowerArt(list=TOWER_ART) {
 if(list.length!==4)throw Error('T-01 requiere exactamente 4 variantes I–II');
 const ids=new Set();
 for(const x of list){
  if(!['infantry','sniper'].includes(x.family)||![1,2].includes(x.level))throw Error('Nivel/familia fuera de T-01');
  if(ids.has(x.assetId))throw Error('Asset ID duplicado');
  if(x.footAnchor.x!==.5||x.footAnchor.y!==.93)throw Error('Pivote de suelo incompatible');
  if(!x.url.startsWith('../../art/towers/'))throw Error('Arte fuera de ownership T');
  ids.add(x.assetId);
 }
 return true;
}
