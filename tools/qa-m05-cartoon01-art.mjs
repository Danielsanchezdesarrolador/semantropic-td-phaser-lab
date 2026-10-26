import assert from'node:assert/strict';
import{readFileSync,mkdirSync,writeFileSync,existsSync}from'node:fs';
import{execFileSync}from'node:child_process';
import{makeM05ArtPlan}from'../public/official/src/maps-visual/m05/cartoon01/marsh-world.mjs';
const base='46163f313b6f0abc08ca59a466cdbf1da62d6087';
const changed=execFileSync('git',['diff','--name-only',base,'--','public'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
for(const p of changed)assert(p.startsWith('public/official/src/maps-visual/m05/')||p.startsWith('public/official/art/maps/m05/'),'Outside isolated M05 art '+p);
assert(!existsSync('public/official/src/c1d8-b2-playable/scene-m05.mjs'),'M05 campaign is not authorized');
const map=JSON.parse(readFileSync('public/official/data/maps.v5.json')).find(m=>m.id===5),campaign=JSON.parse(readFileSync('public/official/data/campaign140.v5.json')).maps.find(m=>m.mapId===5),plan=makeM05ArtPlan(map);
assert.equal(map.path.length,307);assert.equal(map.spots.length,9);assert.equal(map.gold,430);assert.deepEqual(plan.path,map.path);assert.equal(plan.pads.length,9);assert(plan.artOnly&&!plan.gameplayImplemented);assert.deepEqual(campaign.waves.map(w=>w.groups.reduce((n,g)=>n+g.count,0)),[6,6,8,8,11,7,8,8,9,10,10,9,10]);assert.equal(campaign.waves.at(-1).bossSlot,'map05_wave13');
for(const p of ['public/official/data/maps.v5.json','public/official/data/campaign140.v5.json','public/official/src/live/index.html','public/official/src/maps-visual/m02/map-picker.mjs'])assert.equal(execFileSync('git',['hash-object',p],{encoding:'utf8'}).trim(),execFileSync('git',['rev-parse',base+':'+p],{encoding:'utf8'}).trim(),'Protected data/selector changed');
for(const f of ['cartoon01/assets.mjs','cartoon01/marsh-world.mjs','cartoon01/surfaces.mjs','preview/preview.mjs']){const s=readFileSync('public/official/src/maps-visual/m05/'+f,'utf8');assert(!/core-c1d|campaign140|localStorage|setInteractive\(|CombatWorld|\.economy|startWave\(/.test(s),'Art imports or creates gameplay '+f);}
mkdirSync('artifacts/m05-cartoon01',{recursive:true});writeFileSync('artifacts/m05-cartoon01/scope.json',JSON.stringify({status:'PASS_M05_ISOLATED_ART_SCOPE_NO_GAMEPLAY',base,changed,routePoints:307,padPositions:9,campaignDataOnly:{waves:13,enemies:110,bossSlot:'map05_wave13'},baseline:'NO_PREVIOUS_PHASER_M05_ART'},null,2));console.log('PASS_M05_ISOLATED_PREVIEW_AND_CANONICAL_DATA');
