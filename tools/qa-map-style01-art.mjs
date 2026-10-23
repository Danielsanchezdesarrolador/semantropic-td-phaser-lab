import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {makeR7MapPlan} from '../public/official/src/maps-visual/m01/r7/dawn-plateau-art.mjs';
import {propClears,STYLE01_VERSION} from '../public/official/src/maps-visual/m01/style01/cartoon-world.mjs';
const hash=p=>execFileSync('git',['hash-object',p],{encoding:'utf8'}).trim();
for(const [p,h] of Object.entries(JSON.parse(readFileSync('docs/blocks/map-style01/protected-blobs.json'))))assert.equal(hash(p),h,'Protected source changed '+p);
const visual=JSON.parse(readFileSync('docs/blocks/map-style01/authorized-visual-blobs.json'));for(const [p,h] of Object.entries(visual))assert.equal(hash(p),h.after);
assert.equal(hash('public/official/src/maps-visual/m01/r7/renderer-r7-b01-archived.mjs'),visual['public/official/src/maps-visual/m01/r7/renderer-r7.mjs'].before,'Exact previous renderer must be preserved');
const map=JSON.parse(readFileSync('public/official/data/maps.v5.json')).find(m=>m.id===1),plan=makeR7MapPlan(map);assert.deepEqual(plan.path,map.path);assert.equal(plan.pads.length,8);assert.equal(plan.path.length,133);assert.equal(map.gold,365);
assert(!propClears({x:map.path[30][0]-2,y:map.path[30][1]-2,w:4,h:4},plan));for(const p of plan.pads)assert(!propClears({x:p.x-2,y:p.y-2,w:4,h:4},plan));
assert.equal(STYLE01_VERSION,'m01-style01-modular-cartoon-v1');
const source=readFileSync('public/official/src/maps-visual/m01/style01/cartoon-world.mjs','utf8');assert(source.includes('mountM01WorldV7(scene,map,options)'));assert(source.includes('separate-Phaser-components'));assert(!/\.gold\s*[+\-]?=|\.lives\s*=|startWave\(|\.hit\(/.test(source),'Art cannot mutate gameplay');
// No public source or asset outside the M01 visual boundary can change.
const changed=execFileSync('git',['diff','--name-only','579f421b36d408dc0ddc6a5457615f05b949a9c0','--','public/'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
for(const p of changed)assert(p.startsWith('public/official/src/maps-visual/m01/')||p.startsWith('public/official/art/maps/m01/'),'Out of scope public edit '+p);
console.log('PASS_MAP_STYLE01_ART_ONLY_CANONICAL_GEOMETRY_COMPONENTS_AND_PROTECTED_SYSTEMS');
