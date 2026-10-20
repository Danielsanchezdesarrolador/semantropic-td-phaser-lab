// SEMANTROPIC TD / C1-D0 — auditoría de contrato, NO combate implementado.
// Deriva los datos exclusivamente de los JSON V5 inyectados y del smoke PH01.
import {validateCampaign, MAP01_INITIAL, CAMPAIGN_WAVE_COUNTS, BASIC_ENEMIES} from '../m01-model.mjs';

export function inspectM01C1D(maps,campaign){
  const summary=validateCampaign(maps,campaign);
  const map=maps[0], c=campaign.maps[0];
  const counts=c.waves.map(w=>w.groups.reduce((n,g)=>n+g.count,0));
  const allGroups=c.waves.flatMap(w=>w.groups);
  const assert=(ok,message)=>{if(!ok)throw Error('[C1-D0] '+message);};
  assert(map.id===1,'M01 id');
  assert(map.path.length===133,'M01 requires all 133 waypoints');
  assert(map.spots.length===8,'M01 requires eight build sockets');
  assert(CAMPAIGN_WAVE_COUNTS.join(',')==='5,7,9,11,13,15,17,19,21,23','campaign counts');
  assert(counts.join(',')==='8,10,11,13,21','M01 five-wave campaign counts');
  assert(counts.reduce((a,b)=>a+b,0)===63,'63 canonical enemy spawns');
  assert(allGroups.every(g=>g.routeStart===0),'M01 single route');
  assert(allGroups.every(g=>g.type==='warrior'||g.type==='hound'),'M01 enemy class set');
  assert(BASIC_ENEMIES.warrior&&BASIC_ENEMIES.hound,'smoke enemy classes');
  assert(map.gold===365,'M01 Normal initial gold from map data');
  assert(map.scale===0.9,'M01 enemy scaling value');
  assert(map.lives===22,'legacy lives field must be documented, not used as actual game lives');
  assert(MAP01_INITIAL.lives===100&&MAP01_INITIAL.leakDamage===2&&MAP01_INITIAL.bossLeakDamage===30,'modern lives/leaks contract');
  assert(MAP01_INITIAL.tech.infantry===2&&MAP01_INITIAL.tech.sniper===2,'M01 tech cap from PH01');
  return Object.freeze({
    contract:'semantropic-c1d0-audit-v1',status:'SOURCE_CONTRACTS_ONLY_NOT_COMBAT',
    sourceMaps:summary.maps,sourceWaves:summary.waves,
    mapId:1,routePoints:map.path.length,sockets:map.spots.length,
    waves:c.waves.length,counts,totalSpawns:63,types:['warrior','hound'],
    initialGoldNormal:map.gold,initialLivesRuntime:MAP01_INITIAL.lives,
    legacyLivesData:map.lives,leakCommon:MAP01_INITIAL.leakDamage,
    tech:{infantry:2,sniper:2},
    remainingAudit:['effective V5 tower combat formulas','economy cost/upgrades/reward variations','Infantry blocking/respawn rules','real result/stars/saves and UI']
  });
}
