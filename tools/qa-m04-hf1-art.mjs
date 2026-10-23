/** HF1: real geometry/registration constraints and protected runtime, no gameplay. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {makeM04ArtPlan,makeRegistrationMesh,samplePainting} from '../public/official/src/maps-visual/m04/hf1/integrated-river.mjs';
const authorized=JSON.parse(readFileSync('docs/blocks/m04-game01/authorized-runtime-blobs.json'));
// Historical art-only runtime freeze superseded by explicit M04-GAME-01 approval.
const expected=(p,h)=>authorized[p]?.before===h?authorized[p].after:h;
const pin=JSON.parse(readFileSync('docs/blocks/m04-hf1/protected-blobs.json'));
for(const [p,h] of Object.entries(pin.blobs))assert.equal(execFileSync('git',['hash-object',p],{encoding:'utf8'}).trim(),expected(p,h),'HF1 changed protected/archived file '+p);
const map=JSON.parse(readFileSync('public/official/data/maps.v5.json')).find(m=>m.id===4),plan=makeM04ArtPlan(map),mesh=makeRegistrationMesh();
assert.deepEqual(plan.path,map.path);assert.equal(plan.path.length,262);assert.equal(plan.pads.length,9);assert.deepEqual(plan.bridges,map.decor.bridge_centers);assert.deepEqual(plan.river,map.decor.river_path);
for(const a of mesh.anchors){
 if(a.id.startsWith('pad-')){const i=Number(a.id.slice(4)),p=plan.pads[i];assert.deepEqual(a.target,[p.x,p.y]);}
 if(a.id.startsWith('route-'))assert.deepEqual(a.target,map.path[Number(a.id.slice(6))]);
 if(a.id.startsWith('bridge-'))assert.deepEqual(a.target,map.decor.bridge_centers[Number(a.id.slice(7))]);
 assert.deepEqual(samplePainting(...a.target),a.source);assert(Math.hypot(a.target[0]-a.source[0],a.target[1]-a.source[1])<64);
}
assert(mesh.minimumAreaRatio>.2,'Painting registration must not fold');
for(let x=0;x<=1280;x+=20){assert.equal(samplePainting(x,0)[1],0);assert.equal(samplePainting(x,768)[1],768);}
for(let y=0;y<=768;y+=16){assert.equal(samplePainting(0,y)[0],0);assert.equal(samplePainting(1280,y)[0],1280);}
const active=readFileSync('public/official/src/maps-visual/m04/preview/preview.mjs','utf8');assert(active.includes("from '../hf1/integrated-river.mjs'"));assert(!/core-c1d|setInteractive\(|\.economy|map-picker/.test(active));
console.log('PASS_M04_HF1_SINGLE_PAINTING_262_NODES_9_ANCHORED_PADS_2_BRIDGES_NO_FOLDS_NO_GAMEPLAY');
