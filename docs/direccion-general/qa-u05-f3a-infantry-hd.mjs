import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
for(const [path,hash] of Object.entries({
'public/official/art/towers/infantry/level-1.svg':'66e85f802e696d662d14b9154bf6924dbb6ba4b6',
'public/official/art/towers/infantry/level-2.svg':'25884d1754950f8d764c0f03b797e10e7ecac212'
})){
 assert.equal(execFileSync('git',['hash-object',path],{encoding:'utf8'}).trim(),hash,'master changed '+path);
 const art=readFileSync(path,'utf8');
 assert.match(art,/viewBox="0 0 360 420"/);
 assert(!art.includes('<image'),'Original artwork must be vector');
}
const scene=readFileSync('public/official/src/c1d8-b2-playable/scene.mjs','utf8');
assert(scene.includes('meta.family==="infantry"?2:1'),'Only infantry may change raster density');
assert(scene.includes('width:360*rasterDensity,height:420*rasterDensity'),'2x SVG not loaded');
assert(scene.includes('operatorPrimary?3:tower.family==="infantry"?2:1'),'density-specific tower display scale missing');
assert(scene.includes('meta.worldScaleProposal/svgDensity'),'footprint compensation lost');
assert(scene.includes('registerU04AllyHD(this,P08_IMAGES)'),'U04 soldiers changed');
assert(scene.includes('orientSniperOperator(mount,WORLD'),'U02 sniper tracking lost');
console.log('PASS_U05_F3A_HD_BARRACKS_SOURCE_LOCK_AND_WORLD_SCALE');
