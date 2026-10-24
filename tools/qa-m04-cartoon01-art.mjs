import assert from'node:assert/strict';
import{readFileSync,mkdirSync,writeFileSync}from'node:fs';
import{execFileSync}from'node:child_process';
const base='ea34a3797dfceb647354d311a9f06fb82743890c',scene='public/official/src/c1d8-b2-playable/scene-m04.mjs';
const changed=execFileSync('git',['diff','--name-only',base,'--','public'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
for(const p of changed)assert(p===scene||p==='public/official/src/maps-visual/m04/phaser-world.mjs'||p.startsWith('public/official/src/maps-visual/m04/cartoon01/')||p.startsWith('public/official/art/maps/m04/cartoon01/'),'Outside M04 art scope '+p);
const before=execFileSync('git',['show',base+':'+scene],{encoding:'utf8'}),after=readFileSync(scene,'utf8');assert.equal(after,before.replace('/** M04-GAME-01: narrow campaign adapter; approved HF1 painting unchanged. */','/** M04-GAME-01 campaign adapter; art swap is MAP-ART-04-CARTOON-V1 only. */').replace("import {HF1_ART_VERSION,makeM04ArtPlan} from '../maps-visual/m04/hf1/integrated-river.mjs';\nimport {mountM04World} from '../maps-visual/m04/phaser-world.mjs';","import {M04_ART_VERSION,makeM04ArtPlan,mountM04World} from '../maps-visual/m04/phaser-world.mjs';").replace('artVersion:HF1_ART_VERSION','artVersion:M04_ART_VERSION'),'Scene changed beyond visual imports/version');
const map=JSON.parse(readFileSync('public/official/data/maps.v5.json')).find(m=>m.id===4);assert.equal(map.path.length,262);assert.equal(map.spots.length,9);assert.equal(map.gold,395);
mkdirSync('artifacts/m04-cartoon01',{recursive:true});writeFileSync('artifacts/m04-cartoon01/scope.json',JSON.stringify({status:'PASS_M04_ART_ONLY_RUNTIME_PROTECTED',base,changed},null,2));console.log('PASS_M04_ART_ONLY_SCOPE_AND_VISUAL_SCENE_ADAPTER');
