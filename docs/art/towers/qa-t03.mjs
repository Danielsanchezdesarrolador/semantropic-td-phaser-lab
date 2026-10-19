// SOLO PRUEBA ESTATICA. Ejecutar desde la raiz: node docs/art/towers/qa-t03.mjs
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {TOWER_ART_V2,validateTowerArtV2,projectSourceAnchor} from '../../../public/official/src/towers-visual/catalog.mjs';
assert.equal(validateTowerArtV2(),true);
const manifest=JSON.parse(await readFile('docs/art/towers/ASSET_MANIFEST_T03_V2.json','utf8'));
assert.equal(manifest.manifestRevision,'T-03-premium-v2');
assert.equal(manifest.assets.length,4);
assert.equal(new Set(manifest.assets.map(x=>x.assetId)).size,4);
for(const [i,m] of manifest.assets.entries()){
 const t=TOWER_ART_V2[i];
 assert.equal(m.assetId,t.assetId);
 const path=m.files[0].path;
 assert.ok(path.startsWith('public/official/art/towers/'));
 const current=await readFile(path,'utf8');
 const baseline=await readFile(m.baseline,'utf8');
 assert.ok(current.startsWith('<svg'));
 assert.ok(current.trim().endsWith('</svg>'));
 assert.ok(current.includes('viewBox="0 0 360 420"'));
 assert.ok(current.length>baseline.length*1.5);
 assert.equal(t.muzzleLocal.units,'source-px');
 assert.equal(t.shadowFootAnchor.units,'source-px');
 assert.ok(t.worldScaleProposal>.2&&t.worldScaleProposal<.4);
 const projection=projectSourceAnchor({x:500,y:350,scaleX:t.worldScaleProposal,scaleY:t.worldScaleProposal},t,'muzzleLocal');
 assert.ok(Number.isFinite(projection.x)&&Number.isFinite(projection.y));
}
const fx=await readFile('public/official/src/towers-visual/fx.mjs','utf8');
for(const name of ['attack_visual','deploy_visual','upgrade_visual','cancelEvent'])assert.ok(fx.includes(name));
assert.ok(!fx.includes('applyDamage('));
const showcase=await readFile('public/official/src/towers-visual/showcase.mjs','utf8');
assert.ok(showcase.includes('baseline-T03'));
console.log('T-03 PASS: contenido SVG, anchors, catalogo y manifest. Navegador PENDIENTE.');
