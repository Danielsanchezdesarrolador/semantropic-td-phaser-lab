/** B01 art-only contract: preserve runtime, route, pads and approved other maps. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {makeB01MapPlan,b01PropClearsGeometry} from '../public/official/src/maps-visual/m01/b01/pictoric-meadow.mjs';
const authorized=JSON.parse(readFileSync('docs/blocks/m04-game01/authorized-runtime-blobs.json'));
const expected=(p,h)=>authorized[p]?.before===h?authorized[p].after:h;
const baseline=JSON.parse(readFileSync('docs/blocks/b01/protected-blobs.json'));
for(const [path,hash] of Object.entries(baseline.blobs))assert.equal(execFileSync('git',['hash-object',path],{encoding:'utf8'}).trim(),expected(path,hash),'B01 changed protected runtime '+path);
const maps=JSON.parse(readFileSync('public/official/data/maps.v5.json')),map=maps.find(m=>m.id===1),plan=makeB01MapPlan(map);
assert.equal(plan.path.length,133);assert.equal(plan.pads.length,8);assert.deepEqual(plan.path,map.path);assert.equal(map.gold,365);
assert(!b01PropClearsGeometry({x:0,y:330,w:100,h:100},plan),'No prop may cover entrance');
for(const p of plan.pads)assert(!b01PropClearsGeometry({x:p.x-3,y:p.y-3,w:6,h:6},plan),'No prop may cover socket');
assert(b01PropClearsGeometry({x:350,y:180,w:30,h:30},plan),'Open meadow should allow art');
const old=readFileSync('public/official/src/maps-visual/m01/r7/dawn-plateau-art.mjs','utf8'),paint=readFileSync('public/official/src/maps-visual/m01/b01/pictoric-meadow.mjs','utf8');
assert.equal(paint.slice(paint.indexOf('function pads('),paint.indexOf('export function makeB01MapCanvas')),old.slice(old.indexOf('function pads('),old.indexOf('function archRuins(')),'B01 must preserve exact R7 pad drawing');
const waves=JSON.parse(readFileSync('public/official/data/campaign140.v5.json')).maps.find(m=>m.mapId===1).waves;
assert.equal(waves.length,5);assert.equal(waves.reduce((n,w)=>n+w.groups.reduce((m,g)=>m+g.count,0),0),63);
console.log('PASS_B01_ART_ONLY_133_NODES_8_PADS_5_WAVES_63_ENEMIES_RUNTIME_UNCHANGED');
