// PH-01 P0: reliable contract QA for immutable extracted V5 data and first smoke model.
// Usage: node tools/qa-ph01.mjs
import {readFileSync} from 'node:fs';
import {strict as assert} from 'node:assert';
import {validateCampaign,pathSegments,M01PathSmokeModel,CAMPAIGN_WAVE_COUNTS} from '../public/official/src/m01-model.mjs';
const maps=JSON.parse(readFileSync('public/official/data/maps.v5.json','utf8'));
const campaign=JSON.parse(readFileSync('public/official/data/campaign140.v5.json','utf8'));
const report=validateCampaign(maps,campaign);
assert.deepEqual(CAMPAIGN_WAVE_COUNTS,[5,7,9,11,13,15,17,19,21,23]);
assert.deepEqual(report.map01Counts,[8,10,11,13,21]);
assert.equal(maps[0].path.length,133);
assert.equal(maps[0].spots.length,8);
assert.equal(maps[0].gold,365);
assert.equal(pathSegments(maps[0].path).points.length,133);
const model=new M01PathSmokeModel(maps[0],campaign.maps[0]);
assert.equal(model.lives,100);
assert.equal(model.gold,365);
assert.equal(model.startWave(),true);
assert.equal(model.startWave(),false,'no overlapping wave allowed in Normal model');
let spawns=0,escapeEvents=0,wavesStarted=1,iterations=0;
while(!model.ended&&iterations++<40000){
 if(!model.active){if(model.startWave())wavesStarted++;else break;}
 const events=model.tick(.1);
 spawns+=events.filter(e=>e.type==='spawn').length;
 escapeEvents+=events.filter(e=>e.type==='escape').length;
 assert.ok(model.lives>=0&&model.lives<=100,'health bounds');
 assert.equal(model.escapedCount,model.escaped.size,'deduplicated escape events');
}
assert.ok(iterations<40000,'simulation must converge');
assert.equal(model.lives,0,'no defenses must naturally lose all 100 lives');
assert.equal(model.ended,true);
assert.equal(model.won,false,'cannot award a victory without defenders');
assert.equal(model.escapedCount,50);
assert.equal(escapeEvents,50);
assert.equal(model.wave,5,'defeat from fifth wave as defined by source group counts');
assert.ok(spawns>=50);
const result={status:'PASS',scope:'P0 canonical contract and M01 route no-defense smoke ONLY',report,
 tests:{mode:'Normal',waveReach:model.wave,livesFinal:model.lives,escaped:model.escapedCount,spawnsObserved:spawns,wavesStarted,iterations},
 excluded:['Tower building','Damage and blocking','Victory/stars','Saves','Physical mobile/WebGL2 QA','Other 9 maps gameplay']};
console.log(JSON.stringify(result,null,2));