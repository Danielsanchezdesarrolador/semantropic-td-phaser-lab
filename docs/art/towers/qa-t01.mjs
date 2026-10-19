// Ejecutar desde raíz: node docs/art/towers/qa-t01.mjs
// Solo QA ESTÁTICO; no equivale a ejecución de Phaser, WebGL2 ni móvil real.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {TOWER_ART,validateTowerArt} from '../../../public/official/src/towers-visual/catalog.mjs';
assert.equal(validateTowerArt(),true);
const manifest=JSON.parse(await readFile('docs/art/towers/ASSET_MANIFEST_T01.json','utf8'));
assert.equal(manifest.owner,'T');assert.equal(manifest.assets.length,4);
assert.equal(manifest.manifestVersion,'semantropic-assets-v1');
for(const a of manifest.assets){
 const path=a.files[0].path;
 assert.ok(path.startsWith('public/official/art/towers/'));
 const svg=await readFile(path,'utf8');
 assert.match(svg,/^<svg/);assert.match(svg,/<\/svg>$/);assert.match(svg,/<defs>/);
 assert.match(svg,/viewBox="0 0 360 420"/);
 assert.ok(svg.length>3500);
 assert.equal(a.status,'prototype');
 assert.equal(a.anchors.foot.y,.93);
}
assert.equal(new Set(TOWER_ART.map(a=>a.assetId)).size,4);
for(const filename of ['index.html','fx.mjs','showcase.mjs']){
 const data=await readFile('public/official/src/towers-visual/'+filename,'utf8');
 assert.ok(data.length>300);
}
const vfx=await readFile('public/official/src/towers-visual/fx.mjs','utf8');
assert.doesNotMatch(vfx,/\bhurt\s*\(|\bhealth\s*[+*/-]?=|\bgold\s*[+*/-]?=/);
console.log('T-01/T-02: PASS estático de arte, catálogo, manifiesto y archivos. QA de navegador PENDIENTE.');