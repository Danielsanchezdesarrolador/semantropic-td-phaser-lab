// T04-Q2 static Node QA. Ejecutar desde raíz. NO prueba WebGL2 ni móvil.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {TOWER_ART_V2,validateTowerArtV2,projectSourceAnchor,towerFootprintPresentation} from '../../../public/official/src/towers-visual/catalog.mjs';
assert.equal(validateTowerArtV2(),true);
const m=JSON.parse(await readFile('docs/art/towers/ASSET_MANIFEST_T04_Q2.json','utf8'));
assert.equal(m.manifestRevision,'T04-Q2-v1');
assert.equal(m.assets.length,4);
assert.equal(new Set(m.assets.map(a=>a.assetId)).size,4);
for(let i=0;i<4;i++){
 const a=m.assets[i],t=TOWER_ART_V2[i];
 assert.equal(a.assetId,t.assetId);
 assert.ok(['infantry','sniper'].includes(t.family)&&[1,2].includes(t.level));
 const svg=await readFile(a.files[0].path,'utf8');
 const before=await readFile(a.baselineT03,'utf8');
 assert.ok(svg.startsWith('<svg')&&svg.trimEnd().endsWith('</svg>'));
 assert.ok(svg.includes('viewBox="0 0 360 420"'));
 assert.ok(svg.length>before.length);
 assert.ok(svg.includes('t04-fund-top')&&svg.includes('t04-painted-microvolume'));
 for(const key of ['buildFoundationLocal','shadowFootAnchor','operatorAnchorLocal','muzzleLocal','spawnExitLocal']){
   const p=t[key];if(!p)continue;
   assert.equal(p.units,'source-px');assert.ok(p.x>=0&&p.x<=360&&p.y>=0&&p.y<=420);
   const z=projectSourceAnchor({x:300,y:500,scaleX:t.worldScaleProposal,scaleY:t.worldScaleProposal,rotation:Math.PI/4},t,key);
   assert.ok(Number.isFinite(z.x)&&Number.isFinite(z.y));
 }
 const footprint=towerFootprintPresentation(t);
 assert.ok(footprint.visiblePadPercent>=0&&footprint.visiblePadPercent<30);
}
for(const file of ['t04-index.html','t04-gallery.mjs','fx.mjs']){
 assert.ok((await readFile('public/official/src/towers-visual/'+file,'utf8')).length>1000);
}
const fx=await readFile('public/official/src/towers-visual/fx.mjs','utf8');
assert.ok(fx.includes('maxJobs=24'));assert.ok(fx.includes('cancelEvent'));
assert.ok(!fx.includes('applyDamage('));
const gallery=await readFile('public/official/src/towers-visual/t04-gallery.mjs','utf8');
assert.ok(gallery.includes('t03SnapshotUrl')&&gallery.includes('getContext(\'webgl2\')'));
console.log('PASS static T04: 4 SVG, snapshot, catalog, world anchors, FX and gallery.');
console.log('Browser Phaser/WebGL2, screenshots 1280/844/932 and actor P NOT_RUN.');
