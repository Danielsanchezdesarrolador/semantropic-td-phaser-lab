// SEMANTROPIC TD T05-C1D Node regression (run from repository ROOT).
// This script validates SOURCES and transforms only, not real Phaser browser rendering.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {TOWER_ART_V2,validateTowerArtV2,projectSourceAnchor,getTowerVisualLayers,towerFootprintPresentation} from '../../../public/official/src/towers-visual/catalog.mjs';
assert.equal(validateTowerArtV2(),true);
const manifest=JSON.parse(await readFile('docs/art/towers/ASSET_MANIFEST_T05_C1D.json','utf8'));
assert.equal(manifest.manifestRevision,'T05-C1D-deep-v1');
assert.equal(manifest.assets.length,4);
assert.equal(new Set(manifest.assets.map(x=>x.assetId)).size,4);
const allFiles=new Set();
for(const [i,item] of manifest.assets.entries()){
 const meta=TOWER_ART_V2[i];assert.equal(item.assetId,meta.assetId);
 for(const info of [item.compositeA,item.compositeB,item.beforeT04,...Object.values(item.layers)]){
  const path=info.path;assert.ok(path.startsWith('public/official/art/towers/'));
  const svg=await readFile(path,'utf8');assert.match(svg,/^<svg/);
  assert.ok(svg.includes('viewBox="0 0 360 420"')&&svg.trimEnd().endsWith('</svg>'));
  assert.ok(!allFiles.has(path));allFiles.add(path);
 }
 const full=await readFile(item.compositeA.path,'utf8'),alt=await readFile(item.compositeB.path,'utf8');
 // Historically correct T05 image lives in versioned snapshot; T08 current is T04 identity.
 const T05snapshot='public/official/art/towers/'+(meta.family==='sniper'
   ?'t05-snapshot/sniper-'+meta.level+'.svg'
   :'t07-snapshot/infantry-'+meta.level+'.svg');
 const archivedT05=await readFile(T05snapshot,'utf8');
 assert.ok(archivedT05.includes('tower-shadow')&&archivedT05.includes(meta.family==='sniper'?'sniper-back':'barracks-back'));
 const restoredT04=await readFile(item.beforeT04.path,'utf8');
 assert.equal(full,restoredT04,'T08 must restore T04 identity, not T05 alternative');
 assert.notEqual(full,alt,'A/B must be structurally different');
 const old=await readFile(item.beforeT04.path,'utf8');assert.ok(old.includes('t04-fund-top'));
 const c=getTowerVisualLayers(meta,'A');assert.equal(c.split,true);
 assert.ok(c.frontRail.includes('/layers/')&&c.backStructure.includes('/layers/'));
 for(const key of ['buildFoundationLocal','shadowFootAnchor','operatorAnchorLocal','muzzleLocal','spawnExitLocal']){
  const p=meta[key];if(!p)continue;assert.equal(p.units,'source-px');
  assert.ok(p.x>=0&&p.x<=360&&p.y>=0&&p.y<=420);
  for(const rot of [0,Math.PI/4]){
   const q=projectSourceAnchor({x:250,y:300,scaleX:meta.worldScaleProposal,scaleY:meta.worldScaleProposal,rotation:rot},meta,key);
   assert.ok(Number.isFinite(q.x)&&Number.isFinite(q.y));
  }
 }
 const pad=towerFootprintPresentation(meta,110.24);assert.ok(pad.visiblePadPercent>=0&&pad.visiblePadPercent<=35);
}
for(const name of ['T05_SHEET_INFANTERIA_A_B.svg','T05_SHEET_SNIPER_A_B.svg']){
 const text=await readFile('public/official/art/towers/concepts/'+name,'utf8');
 assert.ok(text.includes('1600')&&text.includes('DIRECCIÓN A')&&text.includes('DIRECCIÓN B'));
}
const fx=await readFile('public/official/src/towers-visual/fx.mjs','utf8');
assert.ok(fx.includes('cancelEvent')&&fx.includes('maxJobs=24')&&!fx.includes('applyDamage('));
const gallery=await readFile('public/official/src/towers-visual/t05-gallery.mjs','utf8');
assert.ok(gallery.includes('getTowerVisualLayers')&&gallery.includes('shadow-')&&gallery.includes('rail-'));
const html=await readFile('public/official/src/towers-visual/t05-index.html','utf8');
assert.ok(html.includes('t05-gallery.mjs')&&html.includes('phaser.min.js'));
console.log('T05: PASS source-static, assets 4 A/4 B, 12 layers, 4 T04 snapshots, 2 sheets, anchors, VFX and gallery.');
console.log('Browser runtime/real WebGL2, mobile and integrated M04/P04: NOT VERIFIED BY THIS SCRIPT.');
