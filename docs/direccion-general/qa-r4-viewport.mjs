/** R4 permanent Node QA — viewport-only changes preserve M01/M02 gameplay.
 * Phaser source world stays logical 1280x768. Fullscreen must be explicit gesture.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const read=p=>readFileSync(p,'utf8');
const h=p=>execFileSync('git',['hash-object',p],{encoding:'utf8'}).trim();
const m01='public/official/src/c1d8-b2-playable/scene.mjs';
const m02='public/official/src/c1d8-b2-playable/scene-m02.mjs';
const a=read(m01),b=read(m02),page=read('public/official/src/live/index.html');
const script=read('public/official/src/mobile/viewport-r4.mjs');
const css=read('public/official/src/mobile/viewport-r4.css');
assert.equal(h(m01),'7ab7c08bcc9244a302f4c0c4bfdd704c3df4239f','Unexpected M01 gameplay changes');
assert.equal(h(m02),'0489edf223a7b772a083df690515b7eb3749fa86','Unexpected M02 gameplay changes');
for(const [id,scene] of [['M01',a],['M02',b]]){
 assert(scene.includes('scale:{mode:Phaser.Scale.FIT,'),id+' canonical geometry cropped');
 assert(!scene.includes('Phaser.Scale.ENVELOP'),id+' may crop map landscape');
 assert(scene.includes("matchMedia?.('(pointer:coarse)').matches?80:55"),id+' touch hit radius missing');
 assert(scene.includes('width:1280,height:768'),'Do not mutate logical world geometry '+id);
}
assert(page.includes('id="fullscreenButton"')&&page.includes('id="portraitFullscreen"'),
 'Fullscreen controls missing');
assert(page.includes('id="viewportStatus"')&&page.includes('role="status"'),
 'Accessible fullscreen fallback missing');
assert(page.includes('viewport-r4.css')&&page.includes('viewport-r4.mjs'),
 'Responsive controller not imported');
assert(page.includes('id="mapPickerButton"')&&page.includes('towerHDGalleryButton'),
 'Previous map chooser/gallery lost');
assert(script.includes('host.requestFullscreen||host.webkitRequestFullscreen'),
 'Explicit real fullscreen API required');
assert(script.includes("screen.orientation.lock('landscape')"),
 'Landscape assistance missing');
assert(script.includes('fullscreenchange')&&script.includes("scale?.refresh?.()"),
 'Fullscreen exit/resize not handled');
assert(script.includes("if(!enter){")&&script.includes('Añadir a pantalla de inicio'),
 'Unsupported browser fallback absent');
assert(css.includes('env(safe-area-inset')&&css.includes('orientation:portrait'),
 'Notch safe-area or portrait guidance missing');
console.log('PASS_R4_M01_M02_FIT_FULLSCREEN_SAFE_AREA_TOUCH_VIEWPORT_ONLY');
