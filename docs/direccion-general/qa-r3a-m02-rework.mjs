/** R3-A: confirm canonical M02 source + five approved rework families.
 * Never mutate M01, legacy master or LIVE entrypoint.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {makeM02ArtPlan,M02_ART_PALETTE} from '../../public/official/src/maps-visual/m02/farmland-art.mjs';
import {M02_REWORK_FAMILIES,validatedReworkForM02,OBSOLETE_CANVAS_RECOMMENDATIONS} from '../../public/official/src/maps-visual/m02/rework-contract.mjs';
const data=JSON.parse(readFileSync('public/official/data/maps.v5.json','utf8'));
const waves=JSON.parse(readFileSync('public/official/data/campaign140.v5.json','utf8'));
const map=data.find(x=>x.id===2),campaign=waves.maps.find(x=>x.mapId===2);
const original={
 'public/JUEGO_V5_CANVAS.html':'9b800007bd7a6b591b01a11c5e1344cbee2a7df2',
 'public/official/data/maps.v5.json':'1da0e20145e1312f3d75443debabea17e3db507c',
 'public/official/data/campaign140.v5.json':'794cf43f9b172a39dd88f02e2a89ea11455064c3',
 'public/official/src/m01-model.mjs':'0792c46bbb3d82baa4edd9aa9203b2021b3d69eb',
 'public/official/src/c1d8-b2-playable/scene.mjs':'950c7ce85796932a40b23be421d1e4e9126087c5'
};
for(const [file,sha] of Object.entries(original)){
 const actual=execFileSync('git',['hash-object',file],{encoding:'utf8'}).trim();
 assert.equal(actual,sha,'Protected source modified: '+file);
}
const plan=makeM02ArtPlan(map),families=validatedReworkForM02(map);
assert.equal(plan.path.length,163);
assert.equal(plan.pads.length,8);
assert.equal(plan.landmarks.length,3);
assert.equal(plan.fields.length,8);
assert.equal(campaign.waves.length,7);
assert.deepEqual(campaign.waves.map(w=>w.groups.reduce((n,g)=>n+g.count,0)),[7,9,7,11,15,11,20]);
assert.deepEqual(M02_REWORK_FAMILIES.map(x=>x.id),['infantry','sniper','guardian','bomber','control']);
assert.deepEqual(families.slots,8);
assert(M02_REWORK_FAMILIES.every(x=>x.phases.length===4));
assert(OBSOLETE_CANVAS_RECOMMENDATIONS.every(x=>!M02_REWORK_FAMILIES.some(f=>f.id===x)));
const html=readFileSync('public/JUEGO_V5_CANVAS.html','utf8');
for(const spec of ['SPECS.infantry=','SPECS.sniper=','SPECS.guardian=','SPECS.bomber=','SPECS.control=']){
 assert(html.includes(spec),'Rework not grounded in protected Canvas source: '+spec);
}
assert.equal(M02_ART_PALETTE.pasture,'#8eba79');
const live=readFileSync('public/official/src/live/index.html','utf8');
assert(!live.includes('M02_ART_VERSION'),'Unplayable M02 art must not replace released M01');
console.log('PASS_R3A_M02_ORIGINAL_163_WAYPOINTS_8_PADS_7_WAVES_80_ENEMIES_AND_FIVE_REWORK_FAMILIES');
console.log('M02 art is authored but NOT yet playable: archer/shieldbearer runtime and 7-wave core/UI pending.');
