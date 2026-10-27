/** M05 GAME-01 authorization: frozen art/data, explicit narrow integration surface. */
import assert from'node:assert/strict';import{readFileSync,existsSync}from'node:fs';import{execFileSync}from'node:child_process';
if(existsSync('public/official/src/c1d8-b2-playable/scene-m06.mjs')){await import('./qa-m06-game01-scope.mjs');}else{
const base='3227b720b89e34a8c6828e1bee80b644767ae101';
const allowed=new Set(['public/official/src/core-c1d/m05-boss.mjs','public/official/src/core-c1d/m05-campaign.mjs','public/official/src/core-c1d/m05-results-phaser.mjs','public/official/src/c1d8-b2-playable/scene-m05.mjs','public/official/src/actors-visual/m05/campaign-enemies.mjs','public/official/src/maps-visual/m05/phaser-world.mjs','public/official/src/maps-visual/m05/cartoon01/assets.mjs','public/official/src/c1d8-b2-playable/scene-m02.mjs','public/official/src/live/index.html','public/official/src/mobile/viewport-panorama-r5.mjs','public/official/src/maps-visual/m02/map-picker.mjs']);
const changed=execFileSync('git',['diff','--name-only',base,'--','public'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);for(const p of changed)assert(allowed.has(p),'Outside M05 GAME-01 '+p);
const paths=execFileSync('git',['ls-tree','-r','--name-only',base,'public/official/src/maps-visual/m05','public/official/art/maps/m05','public/official/data','public/official/src/m01-model.mjs','public/JUEGO_V5_CANVAS.html','public/official/src/core-c1d'],{encoding:'utf8'}).trim().split('\n');
for(const p of paths){if(p.endsWith('/assets.mjs')&&p.includes('/maps-visual/m05/'))continue;assert.equal(execFileSync('git',['hash-object',p],{encoding:'utf8'}).trim(),execFileSync('git',['rev-parse',base+':'+p],{encoding:'utf8'}).trim(),'Frozen art/data/core changed '+p);}
const asset='public/official/src/maps-visual/m05/cartoon01/assets.mjs',old=execFileSync('git',['show',base+':'+asset],{encoding:'utf8'}),now=readFileSync(asset,'utf8');
const oldGate="location.pathname.includes('/maps-visual/m05/preview/')",newGate="(location.pathname.includes('/maps-visual/m05/preview/')||(location.pathname.includes('/src/live/')&&new URLSearchParams(location.search).get('map')==='5'))";
assert.equal(now,old.replace(oldGate,newGate),'Only M05 asset load gate may change');
console.log('PASS_M05_GAME01_FROZEN_ART_DATA_EXISTING_CORES_AND_SCOPED_WIRING');

}
