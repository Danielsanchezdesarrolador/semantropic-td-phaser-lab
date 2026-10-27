/** M06 gameplay authorization: no approved artwork or earlier cores may change. */
import assert from'node:assert/strict';import{execFileSync}from'node:child_process';
const base='8abaa92a640ce810b299453dcc41f92a0c76d594',shared=new Set(['public/official/src/c1d8-b2-playable/scene-m02.mjs','public/official/src/live/index.html','public/official/src/maps-visual/m02/map-picker.mjs','public/official/src/mobile/viewport-panorama-r5.mjs']),added=new Set(['public/official/src/core-c1d/m06-campaign.mjs','public/official/src/core-c1d/m06-dual-route-world.mjs','public/official/src/core-c1d/m06-results-phaser.mjs','public/official/src/c1d8-b2-playable/scene-m06.mjs','public/official/src/maps-visual/m06/phaser-world.mjs','public/official/src/actors-visual/m06/campaign-enemies.mjs']);
const git=args=>execFileSync('git',args,{encoding:'utf8'});
for(const p of git(['diff','--name-only',base,'--','public']).trim().split('\n').filter(Boolean))assert(shared.has(p)||added.has(p),'Outside M06 gameplay '+p);
for(const p of git(['ls-tree','-r','-z','--name-only',base,'public']).split('\0').filter(Boolean)){if(shared.has(p))continue;assert.equal(git(['hash-object',p]).trim(),git(['rev-parse',base+':'+p]).trim(),'Protected art/data/previous core changed '+p);}
console.log('PASS_M06_GAME01_FROZEN_ART_AND_OLD_CORES_SCOPED_SHARED_WIRING');
