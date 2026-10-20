// TORRES T08: run from repository root: node docs/art/towers/qa-t08.mjs
// Tests HISTORICAL source exactness, single-rifle ownership, VFX via Phaser MOCK.
// NEVER reports real browser/mobile/P07 integration success.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {TOWER_ART_V2,validateTowerArtV2,getSniperSingleRifleLayers,projectSourceAnchor} from '../../../public/official/src/towers-visual/catalog.mjs';
import {adaptSniperCoreEvent,T07_VISUAL_CORE_CONTRACT,T08_VISUAL_CORE_CONTRACT} from '../../../public/official/src/towers-visual/t07-core-visual-adapter.mjs';
import {SniperShotPresenter} from '../../../public/official/src/towers-visual/sniper-vfx.mjs';
const m=JSON.parse(await readFile('docs/art/towers/ASSET_MANIFEST_T08.json','utf8'));
assert.equal(m.manifestRevision,'TORRES-T08-C1C-CONTINUITY');
assert.equal(m.assets.length,4);
assert.equal(m.approvedC1CReference.sha256,'24103e45a0e1249fa4b89d4e65ea16d9e147bdf1e2462e5c4063469a931842ef');
assert.equal(validateTowerArtV2(),true);
assert.equal(T07_VISUAL_CORE_CONTRACT.operatorOwner,'P06','T07 legacy alias must not be mutated');
assert.equal(T08_VISUAL_CORE_CONTRACT.operatorOwner,'P07','T08 adapter contract requires P07');
assert.deepEqual(TOWER_ART_V2.map(x=>x.assetId),[
 'towers/infantry/level-1','towers/infantry/level-2','towers/sniper/level-1','towers/sniper/level-2']);
const scales=[.296,.308,.312,.319];
for(const [i,a] of m.assets.entries()){
 const meta=TOWER_ART_V2[i];
 assert.equal(meta.worldScaleProposal,scales[i]);
 assert.equal(meta.footAnchor.x,.5);assert.equal(meta.footAnchor.y,.93);
 const current=await readFile(a.canonicalMaster,'utf8');
 const historic=await readFile(a.historicalT04Snapshot,'utf8');
 const rejected=await readFile(a.archivedT07Before,'utf8');
 assert.equal(current,historic,'Current T08 MASTER must equal T04 baseline exactly');
 assert.notEqual(current,rejected,'Do not reactivate T07 silhouette');
 assert.ok(current.startsWith('<svg')&&current.includes('viewBox="0 0 360 420"'));
 assert.ok(current.includes('t04-fund-top')&&current.includes('t04-painted-microvolume'));
 assert.equal(a.exactHistoricalGitBlobSHA1.length,40);
 for(const [layer,filename] of Object.entries(a.layers)){
  const content=await readFile(filename,'utf8');
  assert.ok(content.startsWith('<svg')&&content.includes('viewBox="0 0 360 420"')&&content.trimEnd().endsWith('</svg>'),layer);
 }
 const anch=meta.family==='sniper'?'operatorAnchorLocal':'spawnExitLocal';
 const point=projectSourceAnchor({x:400,y:300,scaleX:meta.worldScaleProposal,scaleY:meta.worldScaleProposal},meta,anch);
 assert.ok(point&&Number.isFinite(point.x+point.y));
 if(meta.family==='sniper'){
  const layers=getSniperSingleRifleLayers(meta);
  assert.ok(layers.singleRifle&&layers.rifleOwner==='T'&&layers.operatorOwner==='P07');
  assert.equal(layers.operatorOwner,meta.operatorOwner,'Composition must respect metadata stage');
  assert.equal(layers.operatorAssetId,'sniper_operator_unarmed');
  assert.equal(meta.operatorOwner,'P07','T08 metadata must use approved P07');
  assert.equal(a.ownerPolicy.operatorOwner,'P07','T08 manifest must agree with metadata');
  assert.equal(a.ownerPolicy.rifleOwner,'TORRES','Rifle ownership belongs to TORRES');
  assert.notEqual(layers.backStructure,a.layers.legacyBack,
    'Advanced unarmed structure must never be legacy rifle-bearing layer');
  assert.equal(layers.rifleMounted.replace('../../art/towers/','public/official/art/towers/'),
    a.layers.singleMountedRifle,'Exactly one dedicated mounted rifle layer');
  const legacyP06=getSniperSingleRifleLayers({...meta,operatorOwner:'P06',artVersion:'T07-RIFLE-UNICO'});
  assert.equal(legacyP06.operatorOwner,'P06','Legacy P06 stage remains supported');
  const plain=await readFile(a.layers.noRifleStructure,'utf8');
  const rifle=await readFile(a.layers.singleMountedRifle,'utf8');
  const legacy=await readFile(a.layers.legacyBack,'utf8');
  assert.ok(!plain.includes('id="t08-one-mounted-rifle"'));
  assert.equal(rifle.split('id="t08-one-mounted-rifle"').length-1,1);
  assert.equal(legacy.split('id="t08-one-mounted-rifle"').length-1,1);
 }
}
const objs=[],timers=[],tweens=[],listeners={};
const obj=()=>{const o={active:true,x:0,y:0,destroy(){this.active=false},setDepth(){return this},setStrokeStyle(){return this},clear(){return this},lineStyle(){return this},beginPath(){return this},moveTo(){return this},lineTo(){return this},strokePath(){return this}};objs.push(o);return o};
const scene={add:{circle:obj,graphics:obj},events:{once:(n,f)=>listeners[n]=f,off:(n,f)=>{if(listeners[n]===f)delete listeners[n]}},
 time:{delayedCall:(ms,fn)=>{const t={ms,fn,remove(){this.removed=true}};timers.push(t);return t}},
 tweens:{add:c=>{const t={...c,stop(){this.stopped=true}};tweens.push(t);return t}}};
const presenter=new SniperShotPresenter(scene,{maxActive:4});
const meta=TOWER_ART_V2[2],sprite={x:520,y:530,scaleX:meta.worldScaleProposal,scaleY:meta.worldScaleProposal};
const raw={type:'attack_fire',eventId:'T08-F1',entityId:'SN1',targetId:'EN1',tick:11,payload:{
 originWorld:{x:532,y:497},targetWorld:{x:770,y:410},bulletId:41}};
const n=adaptSniperCoreEvent(raw,id=>id==='SN1'?{sprite,meta}:null);
assert.ok(n&&Number.isFinite(n.payload.muzzleWorld.x));
assert.deepEqual(n.payload.originWorld,raw.payload.originWorld);
assert.notDeepEqual(n.payload.muzzleWorld,n.payload.originWorld);
assert.equal(presenter.accept({...n,payload:{...n.payload,muzzleWorld:null}}),false);
assert.equal(presenter.accept(n),true);assert.equal(presenter.accept(n),false);
assert.equal(presenter.diagnostics().visualHitCount,0,'core hit must authorize impact');
const wrong={eventId:'T08-H0',type:'hit_applied',towerId:'SN1',entityId:'EN1',targetId:'EN1',bulletId:42,worldPosition:{x:770,y:410}};
assert.equal(presenter.accept(wrong),false);
assert.equal(presenter.accept({...wrong,eventId:'T08-H1',bulletId:41}),true);
assert.equal(presenter.diagnostics().visualHitCount,1);
presenter.accept({type:'entity_die',entityId:'EN1'});
assert.equal(presenter.diagnostics().visualHitCount,1);
presenter.accept({type:'despawn',entityId:'EN1'});
presenter.clear();
assert.equal(presenter.diagnostics().active,0);
assert.ok(objs.every(o=>!o.active)&&timers.every(t=>t.removed)&&tweens.every(t=>t.stopped));
listeners.shutdown();assert.ok(presenter.diagnostics().destroyed);
const page=await readFile('public/official/src/towers-visual/t08-index.html','utf8');
const gallery=await readFile('public/official/src/towers-visual/t08-gallery.mjs','utf8');
assert.ok(page.includes('t08-gallery.mjs')&&gallery.includes('C1CContinuity'));
console.log('TORRES T08 PASS Node source: 4 T04 masters exact, one sniper rifle per split, VFX mock core-gated.');
console.log('NOT_RUN by this script: real Phaser WebGL2, C1-D4 core/P07 mount, screenshots and mobile.');
