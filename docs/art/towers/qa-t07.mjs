// SEMANTROPIC TD T07 test suite. Run from repo root: node docs/art/towers/qa-t07.mjs
// This suite exercises source files and a Phaser MOCK, not real WebGL2, hardware or combat.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {TOWER_ART_V2,validateTowerArtV2,getSniperSingleRifleLayers,projectSourceAnchor} from '../../../public/official/src/towers-visual/catalog.mjs';
import {adaptSniperCoreEvent} from '../../../public/official/src/towers-visual/t07-core-visual-adapter.mjs';
import {SniperShotPresenter} from '../../../public/official/src/towers-visual/sniper-vfx.mjs';
assert.equal(validateTowerArtV2(),true);
const manifest=JSON.parse(await readFile('docs/art/towers/ASSET_MANIFEST_T07.json','utf8'));
assert.equal(manifest.manifestRevision,'T07-rifle-unique-v2');
assert.equal(manifest.assets.length,2);
const svg=async p=>{const s=await readFile(p,'utf8');assert.ok(s.startsWith('<svg'));assert.ok(s.includes('viewBox="0 0 360 420"'));assert.ok(s.trim().endsWith('</svg>'));return s};
for(const item of manifest.assets){
 const m=TOWER_ART_V2.find(x=>x.assetId===item.assetId);
 assert.ok(m&&m.family==='sniper'&&m.level===item.level);
 assert.equal(m.rifleOwner,'T');assert.equal(m.operatorAssetId,'sniper_operator_unarmed');
 const layers=getSniperSingleRifleLayers(m);assert.ok(layers.singleRifle);
 const master=await svg(item.master),structure=await svg(item.files.structureNoRifle),rifle=await svg(item.files.rifleMounted);
 const legacyBack=await svg(item.files.backStructure),before=await svg(item.baselineT06),B=await svg(item.alternativeB);
 await svg(item.files.shadowFoot);await svg(item.files.frontRail);
 assert.notEqual(master,before);assert.notEqual(master,B);
 const token='id="t06-precision-rig-l'+item.level+'"';
 assert.equal(master.split(token).length-1,1,'exactly one installed master rifle');
 assert.equal(legacyBack.split(token).length-1,1,'legacy back retains a SINGLE rifle');
 assert.equal(structure.split(token).length-1,0,'advanced structure has NO rifle');
 assert.equal(rifle.split(token).length-1,1,'advanced rifle layer contains one original T rifle');
 for(const key of ['stockGripLocal','opticalFocusLocal','recoilPivotLocal','fireEffectOriginLocal','operatorAnchorLocal']){
  const a=m[key];assert.equal(a.units,'source-px');
  const world=projectSourceAnchor({x:300,y:400,scaleX:m.worldScaleProposal,scaleY:m.worldScaleProposal,rotation:0.45},m,key);
  assert.ok(Number.isFinite(world.x+world.y));
 }
}
const m=TOWER_ART_V2.find(x=>x.family==='sniper'&&x.level===1);
const sprite={x:340,y:500,scaleX:m.worldScaleProposal,scaleY:m.worldScaleProposal};
const look=id=>id==='TOWER-1'?{meta:m,sprite}:null;
const raw=(id,bid)=>({contractVersion:'combat-events-v1',eventId:id,tick:12,type:'attack_fire',
 entityId:'TOWER-1',targetId:'TARGET-1',payload:{originWorld:{x:340,y:500},targetWorld:{x:530,y:420},bulletId:bid}});
const adapted=adaptSniperCoreEvent(raw('fire-1',101),look);
assert.ok(adapted&&Number.isFinite(adapted.payload.muzzleWorld.x));
assert.deepEqual(adapted.payload.originWorld,{x:340,y:500});
assert.notDeepEqual(adapted.payload.muzzleWorld,adapted.payload.originWorld);
assert.equal(adaptSniperCoreEvent(raw('no-tower',2),()=>null),null);
const listeners={},objs=[],timers=[],tweens=[];
const obj=()=>{const o={active:true,x:3,y:4,destroy(){this.active=false},setDepth(){return this},setStrokeStyle(){return this},clear(){return this},lineStyle(){return this},beginPath(){return this},moveTo(){return this},lineTo(){return this},strokePath(){return this}};objs.push(o);return o;};
const scene={events:{once:(e,fn)=>listeners[e]=fn,off:(e,fn)=>{if(listeners[e]===fn)delete listeners[e]}},
 add:{circle:obj,graphics:obj},time:{delayedCall:(ms,fn)=>{const e={ms,fn,remove(){this.removed=true}};timers.push(e);return e}},
 tweens:{add:cfg=>{const e={...cfg,stop(){this.stopped=true}};tweens.push(e);return e}}};
const pres=new SniperShotPresenter(scene,{maxActive:4,maxSeen:32});
assert.equal(pres.accept({...adapted,payload:{originWorld:{x:1,y:1},targetWorld:{x:5,y:5}}}),false,'missing muzzle rejected');
assert.equal(pres.accept(adapted),true);
assert.equal(pres.accept(adapted),false,'same fire event must dedup');
assert.equal(pres.diagnostics().visualFireCount,1);
assert.equal(pres.diagnostics().visualHitCount,0,'fire MUST NOT produce hit');
const unrelated={eventId:'false-hit',type:'hit_applied',bulletId:202,entityId:'TARGET-1',targetId:'TARGET-1',towerId:'TOWER-1',worldPosition:{x:530,y:420}};
assert.equal(pres.accept(unrelated),false,'unrelated bullet cannot show impact');
const hit={...unrelated,eventId:'real-hit',bulletId:101};
assert.equal(pres.accept(hit),true);
assert.equal(pres.diagnostics().visualHitCount,1);
assert.equal(pres.accept(hit),false);
assert.equal(pres.accept({type:'entity_die',entityId:'TARGET-1'}),true);
assert.equal(pres.diagnostics().visualHitCount,1,'entity_die never creates another impact');
assert.equal(pres.accept(adaptSniperCoreEvent(raw('fire-2',102),look)),true);
assert.equal(pres.accept({type:'despawn',entityId:'TARGET-1'}),true);
assert.equal(pres.diagnostics().active,0,'target disappearance cleans jobs');
assert.equal(pres.accept(adaptSniperCoreEvent(raw('fire-3',103),look)),true);
assert.equal(pres.accept({type:'tower_sold',entityId:'TOWER-1'}),true);
assert.equal(pres.diagnostics().active,0,'tower sale cancels jobs');
pres.clear();assert.equal(pres.diagnostics().seen,0);
assert.ok(objs.every(o=>!o.active));
assert.ok(timers.every(t=>t.removed)&&tweens.every(t=>t.stopped));
listeners.shutdown();pres.destroy();assert.ok(pres.diagnostics().destroyed);
assert.ok(!listeners.shutdown&&!listeners.destroy);
assert.equal(pres.accept(adapted),false,'after shutdown NO new VFX');
const gallery=await readFile('public/official/src/towers-visual/t07-gallery.mjs','utf8');
const html=await readFile('public/official/src/towers-visual/t07-index.html','utf8');
assert.ok(gallery.includes('t07ArchitecturalBUrl')&&html.includes('t07-gallery.mjs'));
console.log('PASS T07 SOURCE+PHASER MOCK: rifle exactly one in every composition, no orphan impact, bulletId hit gating, tower sale, target disappear, shutdown.');
console.log('NOT_RUN here: npm build, Chromium WebGL2/844x390, P06 actor mount, actual core integration, GPU benchmarks.');
