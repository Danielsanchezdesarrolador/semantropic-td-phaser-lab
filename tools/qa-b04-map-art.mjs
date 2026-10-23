/** B04 art-only: immutable geometry, no gameplay/selector integration. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {makeM04ArtPlan,b04PropClearsGeometry} from '../public/official/src/maps-visual/m04/river-art.mjs';
const authorized=JSON.parse(readFileSync('docs/blocks/m04-game01/authorized-runtime-blobs.json'));
// Historical art-only runtime freeze superseded by explicit M04-GAME-01 approval.
const visual=JSON.parse(readFileSync('docs/blocks/map-style01/authorized-visual-blobs.json'));
const expected=(p,h)=>visual[p]?.before===h?visual[p].after:authorized[p]?.before===h?authorized[p].after:h;
const pinned=JSON.parse(readFileSync('docs/blocks/b04/protected-blobs.json'));
for(const [p,hash] of Object.entries(pinned.blobs))assert.equal(execFileSync('git',['hash-object',p],{encoding:'utf8'}).trim(),expected(p,hash),'B04 changed protected source '+p);
const map=JSON.parse(readFileSync('public/official/data/maps.v5.json')).find(m=>m.id===4),plan=makeM04ArtPlan(map);
assert.equal(plan.path.length,262);assert.deepEqual(plan.path,map.path);assert.equal(plan.pads.length,9);assert.deepEqual(plan.bridges,map.decor.bridge_centers);assert.deepEqual(plan.river,map.decor.river_path);
plan.pads.forEach((p,i)=>{assert.equal(p.x,map.spots[i].cx*64+32);assert.equal(p.y,map.spots[i].cy*64+32);assert(!b04PropClearsGeometry({x:p.x-1,y:p.y-1,w:2,h:2},plan));});
function distance(p,line){return Math.min(...line.slice(1).map((b,i)=>{const a=line[i],dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(p[0]-a[0]-dx*t,p[1]-a[1]-dy*t);}));}
for(const channel of plan.scenicChannels)for(const p of plan.path)assert(distance(p,channel)>94,'New channel must not cross the route');
for(const p of plan.pads)for(let i=0;i<32;i++){const t=i*Math.PI/16,edge=[p.x+42*Math.cos(t),p.y+24*Math.sin(t)];for(const water of [plan.river,...plan.scenicChannels])assert(distance(edge,water)>52,'Pad surface must remain on land');}
const campaign=JSON.parse(readFileSync('public/official/data/campaign140.v5.json')).maps.find(m=>m.mapId===4);assert.equal(campaign.waves.length,11);
const preview=readFileSync('public/official/src/maps-visual/m04/preview/preview.mjs','utf8');assert(!/core-c1d|setInteractive\(|\.economy|map-picker/.test(preview));
console.log('PASS_B04_ART_ONLY_262_NODES_9_PAINTED_PADS_2_CANONICAL_BRIDGES_NO_GAMEPLAY');
