/** B02 art-only contract: protected code/art and canonical M02 geometry. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {makeB02ArtPlan,b02PropClearsGeometry} from '../public/official/src/maps-visual/m02/b02/pictoric-farmland.mjs';
const pinned=JSON.parse(readFileSync('docs/blocks/b02/protected-blobs.json'));
for(const [p,hash] of Object.entries(pinned.blobs))assert.equal(execFileSync('git',['hash-object',p],{encoding:'utf8'}).trim(),hash,'B02 changed protected source '+p);
const map=JSON.parse(readFileSync('public/official/data/maps.v5.json')).find(m=>m.id===2),plan=makeB02ArtPlan(map);
assert.equal(plan.path.length,163);assert.deepEqual(plan.path,map.path);assert.equal(plan.pads.length,8);assert.equal(map.gold,395);
plan.pads.forEach((p,i)=>{assert.equal(p.x,map.spots[i].cx*64+32);assert.equal(p.y,map.spots[i].cy*64+32);assert(!b02PropClearsGeometry({x:p.x-2,y:p.y-2,w:4,h:4},plan));});
assert(!b02PropClearsGeometry({x:0,y:280,w:100,h:50},plan));
const waves=JSON.parse(readFileSync('public/official/data/campaign140.v5.json')).maps.find(m=>m.mapId===2).waves;
assert.equal(waves.length,7);assert.equal(waves.reduce((s,w)=>s+w.groups.reduce((n,g)=>n+g.count,0),0),80);
const legacy=readFileSync('public/official/src/maps-visual/m02/premium-golden-valley-r6.mjs','utf8'),current=readFileSync('public/official/src/maps-visual/m02/b02/pictoric-farmland.mjs','utf8');
assert.equal(current.slice(current.indexOf('function pads('),current.indexOf('function terrain(')),legacy.slice(legacy.indexOf('function pads('),legacy.indexOf('function flowers(')),'R6 pad drawing must stay exact');
console.log('PASS_B02_ART_ONLY_163_NODES_8_PADS_7_WAVES_80_ENEMIES_395_GOLD_PROTECTED_RUNTIME');
