import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
const originals={
 'public/assets/torre_guardiana.png':'ae4e52f89440b4bd9fad0b0333996f11854d05bb',
 'public/assets/torre_bombardera.png':'eb60c20868815945cd807203c79a71dff6bc9958',
 'public/assets/torre_control.png':'1ece991301756000e8b1d1879698fb79f492875b',
 'public/official/art/actors/p03-rig.mjs':'1a4282e1652ff559b92e18f42db465d6bfb8e729'
};
for(const [path,hash] of Object.entries(originals)){
 assert.equal(execFileSync('git',['hash-object',path],{encoding:'utf8'}).trim(),hash,
  'U06 cannot modify historic original '+path);
}
const scene=readFileSync('public/official/src/c1d8-b2-playable/scene.mjs','utf8');
assert.match(scene,/width:1080,height:1260/,'U06 3x sniper vector raster missing');
assert.match(scene,/svgDensity=operatorPrimary\?3:tower\.family==="infantry"\?2:1/,'U06 scale compensation missing');
assert.match(scene,/meta\.worldScaleProposal\/svgDensity/,'U06 source 360x420 footprint changed');
assert.match(scene,/projectP03RifleMuzzle\(mount\.operator/,'P03 visible rifle origin lost');
assert.match(scene,/registerU04AllyHD\(this,P08_IMAGES\)/,'Allied HD improvement lost');
const prep=readFileSync('public/official/src/towers-visual/u06/legacy-hd.mjs','utf8');
for(const file of ['torre_guardiana.png','torre_bombardera.png','torre_control.png'])
 assert(prep.includes(file),'Missing legacy HD art '+file);
assert(prep.includes('ctx.imageSmoothingQuality=\'high\''),'Legacy PNG high quality resampling missing');
assert(prep.includes('return originalWorldScale/hd.density'),'Legacy PNG footprint contract missing');
const list=readFileSync('public/official/src/towers-visual/catalog.mjs','utf8');
assert(list.includes('Only four M01 towers I-II'),'Do not claim unsupported M01 gameplay towers');
console.log('PASS_U06_SNIPER_3X_AND_LEGACY_BCD_PREPARATION_SOURCE_LOCK');
