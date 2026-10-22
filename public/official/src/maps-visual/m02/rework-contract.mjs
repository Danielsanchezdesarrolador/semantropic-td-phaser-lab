/** SEMANTROPIC TD · R3 M02 / REWORK CANÓNICO DE CINCO TORRES.
 * Fuentes: public/JUEGO_V5_CANVAS.html E1 SPECS.infantry/sniper/guardian/bomber/control;
 * protección de estilos aprobados M01 T04/P03/U04/U06. No portea habilidades
 * ni habilita torres antiguas pulse/cannon/prism/frost en Phaser.
 */
export const R3_M02_TOWER_REWORK_VERSION='r3-m02-five-rework-families-v1';
export const M02_REWORK_FAMILIES=Object.freeze([
 Object.freeze({id:'infantry',name:'Infantería',role:'Cuarteles y bloqueo',costV5:95,
  source:'SPECS.infantry',phases:Object.freeze(['Cuartel de reclutas','Cuartel veterano','Escuadrón de combate','Guardia de élite']),
  phaserStatus:'playable-I-II',approvedArt:'T04-P03-U04-U05'}),
 Object.freeze({id:'sniper',name:'Francotirador',role:'Prioridad y largo alcance',costV5:140,
  source:'SPECS.sniper',phases:Object.freeze(['Francotirador recluta','Tirador especializado','Francotirador de élite','Especialización avanzada']),
  phaserStatus:'playable-I-II',approvedArt:'T04-P03-U06-single-rifle'}),
 Object.freeze({id:'guardian',name:'Guardiana',role:'Ataque mágico y apoyo',costV5:110,
  source:'SPECS.guardian',phases:Object.freeze(['Guardiana Aprendiz','Guardiana Rúnica','Guardiana Ancestral','Especialización Guardiana']),
  phaserStatus:'requires-core-and-new-approved-art',approvedArt:null}),
 Object.freeze({id:'bomber',name:'Bombardera',role:'Artillería de área',costV5:135,
  source:'SPECS.bomber',phases:Object.freeze(['Mortero básico','Cañón de artillería','Batería de asedio','Especialización Bombardera']),
  phaserStatus:'requires-core-and-new-approved-art',approvedArt:null}),
 Object.freeze({id:'control',name:'Torre de Control',role:'Despliegue manual y apoyo',costV5:0,
  source:'SPECS.control',phases:Object.freeze(['Puesto de Mando','Centro Mecanizado','Centro de Apoyo','Mando Supremo']),
  phaserStatus:'requires-core-and-new-approved-art',approvedArt:null})
]);
export const OBSOLETE_CANVAS_RECOMMENDATIONS=Object.freeze(['pulse','cannon','prism','frost']);
export const M02_TOWER_EVOLUTION=Object.freeze({commonLevels:Object.freeze([1,2,3]),
 branchLevel:4,branchCount:2,skillsPerBranch:3,skillRanks:3,
 note:'Roadmap Canvas: nivel IV con dos ramas, tres habilidades por rama y tres rangos. Sin port automático.'});
export function validatedReworkForM02(map){
 if(map?.id!==2||map.spots?.length!==8)throw Error('Expected source M02, eight canonical pads');
 const families=new Set(M02_REWORK_FAMILIES.map(x=>x.id));
 if(families.size!==5||[...families].some(id=>OBSOLETE_CANVAS_RECOMMENDATIONS.includes(id)))
  throw Error('Obsolete towers leaked into M02 rework');
 // map.spots[].recommend is obsolete reference metadata; DO NOT interpret as a build menu.
 return Object.freeze({families:M02_REWORK_FAMILIES,slots:8,
  compatibleWithM01:families.has('infantry')&&families.has('sniper'),
  artGuideline:'M01 original approved C1-C / M07-Q2 landscape, T04/P03 with U06 HD'});
}
