/** P08 genuine Node22 QA: run in checkout, never simulate PASS.
 * node public/official/src/actors-visual/p08/qa-p08.mjs
 * Includes P07 inherited alpha-debt regression, new 4 PNG and core-event FSM.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {readP07Png,reportP07Mismatch} from '../p07-hf1-png-diagnostics.mjs';
import {buildP07Atlas} from '../../../art/actors/p07-png-export.mjs';
import {buildP08Atlas} from '../../../art/actors/p08/p08-png-export.mjs';
import {paintP08Frame} from '../../../art/actors/p08/p08-visual-rig.mjs';
import {paintP03Frame} from '../../../art/actors/p07-p03-continuity-rig.mjs';
import {createP07RasterCanvas} from '../../../art/actors/p07-raster-canvas.mjs';
import {P08AnimationController} from './p08-controller.mjs';
import {P08_IMAGES,P08_STATES,p08VisualForSoldierLevel,registerP08} from './p08-loader.mjs';
const manifest=JSON.parse(readFileSync(new URL('../../../art/actors/P08_MANIFEST.json',import.meta.url),'utf8'));
const legacy=JSON.parse(readFileSync(new URL('../../../art/actors/P07_MANIFEST.json',import.meta.url),'utf8'));
const sha=b=>createHash('sha256').update(b).digest('hex');
let tested=0;const all=[];
for(const [tag,registry,builder] of [['P07 alpha prerequisite',legacy.assets,buildP07Atlas],['P08',manifest.assets,buildP08Atlas]]){
 for(const spec of registry){
  const binary=readFileSync(new URL('../../../art/actors/'+(tag==='P08'?'p08':'p07')+'/png/'+spec.file.split('/').at(-1),import.meta.url));
  const rebuilt=builder(spec.canonicalId);
  const decode=readP07Png(binary),diff=reportP07Mismatch(binary,rebuilt.png,spec.canonicalId);
  assert.equal(decode.summary.pngSha256,spec.sha256,tag+' persisted PNG SHA '+spec.canonicalId);
  assert.equal(decode.summary.rgbaSha256,spec.rgbaSha256,tag+' pixel SHA '+spec.canonicalId);
  assert.equal(decode.summary.rgbaBytes,1408*832*4);
  assert.equal(sha(binary),spec.sha256);
  assert.equal(binary.length,spec.sizeBytes);
  assert.equal(diff.classification,'BYTE_IDENTICAL',
   tag+' generator differs: '+JSON.stringify({first:diff.firstPixel,changed:diff.affectedFrames,hash:diff.regenerated.pngSha256}));
  assert(Buffer.from(rebuilt.png).equals(binary),'HARD BYTE-EQUALITY required '+spec.canonicalId);
  assert.equal(decode.summary.transparentNonzeroRgbPixels,0,'RGB halo under alpha=0 '+spec.canonicalId);
  assert.equal(decode.summary.alphaBorderContacts,0,'Border bleed '+spec.canonicalId);
  assert.equal(decode.summary.emptyFrames,0,'Blank frame '+spec.canonicalId);
  assert(decode.summary.alphaPartialPixels>100,'No antialias '+spec.canonicalId);
  assert.equal(decode.summary.gamma,null,'Unexpected gamma chunk');
  tested++;all.push({tag,actorId:spec.canonicalId,bytes:spec.sizeBytes,
   PNG:spec.sha256,RGBA:spec.rgbaSha256,emptyFrames:decode.summary.emptyFrames,
   transparentRGB:decode.summary.transparentNonzeroRgbPixels});
  console.log('[P08] PASS_NODE_RGBA '+spec.canonicalId+' '+tag);
 }
}
assert.equal(tested,8);
assert.equal(manifest.assets.length,4);
assert.equal(Object.values(P08_STATES).reduce((s,v)=>s+v,0),32);
assert.equal(new Set(P08_IMAGES.map(x=>x.atlasKey)).size,4);
assert.equal(p08VisualForSoldierLevel(1).actorId,'infantry_recruit');
assert.equal(p08VisualForSoldierLevel(2).actorId,'infantry_veteran');
assert.throws(()=>p08VisualForSoldierLevel(3));
// Neutral and walk enemy illustrations must be SOURCE-byte identical to P03.
for(const id of ['warrior','hound']){
 for(const state of ['idle','walk','hit','die','blocked']){
  for(const frame of [0,1]){
   const old=createP07RasterCanvas(176,208),next=createP07RasterCanvas(176,208);
   old.withCell(0,0,()=>paintP03Frame(old.ctx,id,state,frame));
   next.withCell(0,0,()=>paintP08Frame(next.ctx,id,state,frame));
   assert(Buffer.from(old.canvas.data).equals(Buffer.from(next.canvas.data)),
    'P03 protected neutral regression '+id+' '+state+' '+frame);
  }
 }
}
// Soldier level II must not be a recolor of level I, and all attack artwork
// must differ from neutral in genuine source pixels.
for(const id of ['infantry_recruit','infantry_veteran','warrior','hound']){
 const idle=createP07RasterCanvas(176,208),attack=createP07RasterCanvas(176,208);
 idle.withCell(0,0,()=>paintP08Frame(idle.ctx,id,'idle',0));
 attack.withCell(0,0,()=>paintP08Frame(attack.ctx,id,'attack',2));
 assert(!Buffer.from(idle.canvas.data).equals(Buffer.from(attack.canvas.data)),
  'P08 attack frame indistinguishable from idle '+id);
}
const recruit=createP07RasterCanvas(176,208),veteran=createP07RasterCanvas(176,208);
recruit.withCell(0,0,()=>paintP08Frame(recruit.ctx,'infantry_recruit','idle',0));
veteran.withCell(0,0,()=>paintP08Frame(veteran.ctx,'infantry_veteran','idle',0));
assert(!Buffer.from(recruit.canvas.data).equals(Buffer.from(veteran.canvas.data)),'Visual levels must differ');
// Mock Phaser manager registers all 32 frames, repeats zero atlas recreations.
const textures=new Map(P08_IMAGES.map(x=>[x.atlasKey,{frames:new Map(),has(n){return this.frames.has(n)},add(n,_source,x,y,w,h){this.frames.set(n,{x,y,w,h})}}]));
const scene={textures:{exists:k=>textures.has(k),get:k=>textures.get(k)}};
registerP08(scene);registerP08(scene);
for(const art of P08_IMAGES)assert.equal(textures.get(art.atlasKey).frames.size,32);
const c=new P08AnimationController();
const s='m01-soldier-1',e='enemy-1';
c.presentEntity(s,{kind:'infantry_veteran',level:2});
c.presentEntity(e,{kind:'warrior',level:1});
assert(c.consumeCoreEvent({type:'soldier_attack_windup',entityId:s,targetId:e,windup:.29,tick:10,eventId:'windup'}));
c.update(.1);c.update(.1);c.update(.1);c.update(.1);
assert.equal(c.snapshot(s).hitConfirmed,false);
assert.equal(c.emittedVisualOnly,0);
assert(c.consumeCoreEvent({type:'soldier_attack_hit',entityId:s,targetId:e,tick:11,eventId:'contact',damage:12}));
assert.equal(c.snapshot(s).state,'attack');
assert.equal(c.snapshot(s).frame,2,'visual impact must start on real hit tick');
assert(!c.consumeCoreEvent({type:'soldier_attack_hit',entityId:s,targetId:e,tick:11,eventId:'contact'}));
assert(c.consumeCoreEvent({type:'enemy_attack_windup',entityId:e,targetId:s,windup:.32,tick:12,eventId:'enemy-wind'}));
assert(c.consumeCoreEvent({type:'soldier_hit',entityId:s,sourceId:e,damage:11,hp:140,tick:13,eventId:'soldier-hit'}));
assert.equal(c.snapshot(e).frame,2,'enemy attack marker from real soldier_hit.sourceId');
assert.equal(c.snapshot(s).state,'hit');
assert(c.consumeCoreEvent({type:'soldier_die',entityId:s,eventId:'soldier-die'}));
assert.equal(c.snapshot(s).level,2,'death event without level must preserve veteran');
c.update(.1);assert.equal(c.snapshot(s).dead,true);
assert(c.consumeCoreEvent({type:'soldier_respawn',entityId:s,eventId:'soldier-respawn'}));
assert.equal(c.snapshot(s).level,2);assert.equal(c.snapshot(s).state,'idle');
c.consumeCoreEvent({type:'game_paused'});const frame=c.snapshot(s).frame;
c.update(.1);assert.equal(c.snapshot(s).frame,frame);
c.consumeCoreEvent({type:'game_resumed'});
assert(c.consumeCoreEvent({type:'soldier_removed',entityId:s,eventId:'unit-sold'}));
assert.equal(c.snapshot(s),null);c.destroy();
// No permission granted to install sprites in real C1-D6/C1-D7.
console.log(JSON.stringify({status:'PASS_NODE',env:{node:process.version,v8:process.versions.v8},
 PNGs:tested,frames:8*32,checks:'byte-exact RGBA alpha-clean, 32 frames, P03 neutral, veteran identity, real event-only contact, pause/respawn/removal',
 reports:all,NOT_RUN:['actual Chromium WebGL2','mobile FPS','T08 mounted','C1-D6 integration','art acceptance']},null,2));
