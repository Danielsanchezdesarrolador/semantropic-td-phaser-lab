import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const src=p=>readFileSync(p,'utf8');
const hashes={
 'public/assets/torre_guardiana.png':'ae4e52f89440b4bd9fad0b0333996f11854d05bb',
 'public/assets/torre_bombardera.png':'eb60c20868815945cd807203c79a71dff6bc9958',
 'public/assets/torre_control.png':'1ece991301756000e8b1d1879698fb79f492875b',
 'public/official/art/actors/p03-rig.mjs':'1a4282e1652ff559b92e18f42db465d6bfb8e729'
};
for(const [p,sha] of Object.entries(hashes))
 assert.equal(execFileSync('git',['hash-object',p],{encoding:'utf8'}).trim(),sha,
  'U07 protected original changed: '+p);
const page=src('public/official/src/live/index.html');
const module=src('public/official/src/towers-visual/u06/hd-gallery-ui.mjs');
const core=src('public/official/src/core-c1d/construction-economy.mjs');
const renderer=src('public/official/src/towers-visual/u06/legacy-hd.mjs');
assert(page.includes('id="towerHDGallery"')&&page.includes('GALERÍA HD'),'U07 preserved within single LIVE campaign');
assert(page.includes('id="towerHDGalleryButton"'),'Art button absent from LIVE');
assert(page.includes('id="towerHDGallery" hidden role="dialog"'),'Accessible gallery absent');
assert(page.includes("mountU07HDGallery()"),'HD renderer not wired');
assert(module.includes("preloadLegacyTowerHD(meta.url,{factor:3,sharpness:.21})"),'On-demand HD processing not wired');
assert(module.includes("gameWorld.pause()")&&module.includes("gameWorld.resume()"),
 'Gallery must preserve game pause state');
assert(renderer.includes("U06_LEGACY_TOWER_PRESETS"),'Protected assets HD renderer missing');
assert(core.includes('id:"infantry"')&&core.includes('id:"sniper"'),'Known M01 towers lost');
assert(!core.includes('id:"guardian"')&&!core.includes('id:"artillery"')&&!core.includes('id:"control"'),
 'Unapproved gameplay family added');
assert(page.includes('todavía no están habilitadas'),'Do not misrepresent gameplay availability');
console.log('PASS_U07_READONLY_LIVE_GALLERY_PRESERVED_TOWERS_AND_PAUSE');
