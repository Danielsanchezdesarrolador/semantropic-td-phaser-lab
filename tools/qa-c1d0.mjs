// C1-D0 Node smoke/parity scaffolding, no claim of playable combat.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {inspectM01C1D} from '../public/official/src/core-c1d/contract-audit.mjs';
import {M01PathSmokeModel} from '../public/official/src/m01-model.mjs';
const root=new URL('../public/official/data/',import.meta.url);
const maps=JSON.parse(readFileSync(new URL('maps.v5.json',root),'utf8'));
const campaign=JSON.parse(readFileSync(new URL('campaign140.v5.json',root),'utf8'));
const summary=inspectM01C1D(maps,campaign);
assert.equal(summary.initialLivesRuntime,100);
assert.equal(summary.initialGoldNormal,365);
assert.deepEqual(summary.counts,[8,10,11,13,21]);
const smoke=new M01PathSmokeModel(maps[0],campaign.maps[0]);
let waveCleared=0,defeatEvents=0,leakEvents=0,spawnEvents=0,iterations=0;
assert.equal(smoke.lives,100);assert.equal(smoke.gold,365);
assert.equal(smoke.startWave(),true);
while(!smoke.ended&&iterations<25000){
  iterations++;
  const events=smoke.tick(0.05);
  for(const e of events){
    if(e.type==='spawn')spawnEvents++;
    if(e.type==='escape'){leakEvents++;assert.equal(e.loss,2);}
    if(e.type==='defeat')defeatEvents++;
    if(e.type==='wave_clear')waveCleared++;
  }
  if(!smoke.active&&!smoke.ended)assert.equal(smoke.startWave(),true);
}
assert(smoke.ended,'no-defense PH01 smoke must end');
assert.equal(smoke.lives,0,'no-defense smoke ends by 100 lives exhausted');
assert.equal(defeatEvents,1,'single defeat emitted');
assert.equal(leakEvents,50,'50 ordinary leaks eliminate 100 lives');
assert.equal(smoke.won,false,'do not mislabel no-defense test as game victory');
assert(spawnEvents>=50&&spawnEvents<=63,'spawns occur from canonical schedule');
console.log(JSON.stringify({status:'PASS_C1D0_SOURCE_AND_SMOKE_ONLY',...summary,smoke:{iterations,waveCleared,defeatEvents,leakEvents,spawnEvents}},null,2));
