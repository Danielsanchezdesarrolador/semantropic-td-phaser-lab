// T06/Q2 read-only source + Phaser-MOCK regression. Run from repo root in Node 20+.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {TOWER_ART_V2,validateTowerArtV2,projectSourceAnchor,getSniperFireVisualAnchor} from '../../../public/official/src/towers-visual/catalog.mjs';
import {SniperShotPresenter} from '../../../public/official/src/towers-visual/sniper-vfx.mjs';
assert.equal(validateTowerArtV2(),true);
const m=JSON.parse(await readFile('docs/art/towers/ASSET_MANIFEST_T06_C1D2.json','utf8'));
assert.equal(m.manifestRevision,'T06-C1D2-sniper-vfx-v1');
assert.equal(m.assets.length,2);
for(const a of m.assets){
 const meta=TOWER_ART_V2.find(x=>x.assetId===a.assetId);
 assert.ok(meta&&meta.level===a.level&&meta.family==='sniper');
 assert.equal(meta.footAnchor.x,.5);assert.equal(meta.footAnchor.y,.93);
 for(const p of [a.files[0].path,a.baseline.path,...Object.values(a.layers).map(x=>x.path)]){
  const svg=await readFile(p,'utf8');
  assert.ok(svg.startsWith('<svg'));assert.ok(svg.includes('viewBox="0 0 360 420"'));assert.ok(svg.trim().endsWith('</svg>'));
 }
 const currentT08=await readFile(a.files[0].path,'utf8');
 const historicalT06=await readFile('public/official/art/towers/t06-snapshot/sniper-'+a.level+'.svg','utf8');
 const originalT04=await readFile('public/official/art/towers/t04-snapshot/sniper-'+a.level+'.svg','utf8');
 assert.equal(currentT08,originalT04,'C1-C approved visual source restored');
 const newMaster=historicalT06;
 assert.ok(newMaster.includes('tower-shadow')&&newMaster.includes('t06-sniper-backstructure')&&newMaster.includes('t06-sniper-front-rail'));
 const before=await readFile(a.baseline.path,'utf8');
 assert.notEqual(newMaster,before,'T06 must be materially different from T05');
 const pos=getSniperFireVisualAnchor({x:420,y:480,scaleX:meta.worldScaleProposal,scaleY:meta.worldScaleProposal,rotation:.5},meta);
 assert.ok(pos&&Number.isFinite(pos.x+pos.y));
 for(const key of ['operatorAnchorLocal','muzzleLocal','fireEffectOriginLocal']){
  const p=meta[key];assert.equal(p.units,'source-px');
  assert.ok(p.x>=0&&p.x<=360&&p.y>=0&&p.y<=420);
 }
}
const events={},allObjects=[],allTimers=[],allTweens=[];
const fake=()=>{const o={active:true,x:10,y:10,destroy(){this.active=false},setDepth(){return this},setStrokeStyle(){return this},clear(){return this},lineStyle(){return this},beginPath(){return this},moveTo(){return this},lineTo(){return this},strokePath(){return this}};allObjects.push(o);return o;};
const scene={
 events:{once:(n,f)=>{events[n]=f},off:(n,f)=>{if(events[n]===f)delete events[n]}},
 add:{circle:fake,ellipse:fake,graphics:fake},
 time:{delayedCall:(ms,fn)=>{const t={ms,fn,remove(){this.removed=true}};allTimers.push(t);return t}},
 tweens:{add:c=>{const t={...c,stop(){this.stopped=true}};allTweens.push(t);return t}}
};
const p=new SniperShotPresenter(scene,{maxActive:4});
const e=(id,type='attack_fire',target='enemy1',style='A')=>({contractVersion:'combat-events-v1',eventId:id,type,entityId:'sniper-tower1',targetId:target,tick:123,payload:{muzzleWorld:{x:10,y:20},targetWorld:{x:250,y:210},visualVariant:style}});
assert.equal(p.accept({...e('invalid'),payload:{muzzleWorld:{x:1,y:2}}}),false);
assert.equal(p.accept(e('one')),true);assert.equal(p.accept(e('one')),false);
assert.equal(p.diagnostics().visualFireCount,1);
assert.equal(p.accept(e('second','attack_fire','enemy2','B')),true);
assert.equal(p.diagnostics().visualFireCount,2);
assert.equal(p.accept({type:'despawn',entityId:'enemy1'}),true);
assert.ok([...p.jobs.values()].every(j=>j.targetId!=='enemy1'));
p.clear();assert.equal(p.jobs.size,0);assert.equal(p.seen.size,0);
assert.ok(allObjects.every(o=>!o.active));
assert.ok(allTimers.every(t=>t.removed));assert.ok(allTweens.every(t=>t.stopped));
assert.equal(p.accept(e('after-clear')),true);
events.shutdown();assert.equal(p.diagnostics().destroyed,true);
assert.equal(p.accept(e('post-shutdown')),false);
assert.ok(!events.shutdown&&!events.destroy);
const gal=await readFile('public/official/src/towers-visual/t06-gallery.mjs','utf8');
assert.ok(gal.includes('SniperShotPresenter')&&gal.includes('getSniperFireVisualAnchor'));
const html=await readFile('public/official/src/towers-visual/t06-index.html','utf8');
assert.ok(html.includes('t06-gallery.mjs')&&html.includes('phaser.min.js'));
console.log('PASS T06 Node static + Phaser mock: 2 sniper masters, 6 split layers, 2 T05 snapshots, FX A/B, idempotence, target despawn, shutdown cleanup.');
console.log('NOT TESTED: real Phaser 4.2.1 WebGL2, 844x390, physical mobile, gameplay.');
