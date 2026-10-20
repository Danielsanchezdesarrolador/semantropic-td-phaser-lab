/**
 * P06 real PNG bytes check: run in repository checkout with Node 22.
 * node public/official/src/actors-visual/qa-p06.mjs
 * Uses Node zlib + crypto. No browser or art-quality certification.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {inflateSync} from 'node:zlib';
import {P06_FRAME,P06_STATES,generateP06Atlas} from '../../art/actors/p06-png-generator.mjs';
import {sha256P06} from '../../art/actors/p06-hash.mjs';
import {createP06CoreProjection} from './p06-core-projection.mjs';
const manifest=JSON.parse(readFileSync(new URL('../../art/actors/P06_MANIFEST.json',import.meta.url),'utf8'));
const uint32=(b,i)=>b.readUInt32BE(i);
function checkPng(b){
 const sig=Buffer.from([137,80,78,71,13,10,26,10]);
 assert(b.subarray(0,8).equals(sig));
 const chunks=[];let at=8;
 while(at<b.length){
  const n=uint32(b,at),type=b.toString('ascii',at+4,at+8);
  const d=b.subarray(at+8,at+8+n);chunks.push({type,data:d});at+=n+12;
 }
 assert.equal(at,b.length);assert.equal(chunks.at(-1).type,'IEND');
 const h=chunks.find(x=>x.type==='IHDR').data;
 const w=uint32(h,0),ht=uint32(h,4);
 assert.equal(w,1408);assert.equal(ht,832);
 assert.equal(h[8],8);assert.equal(h[9],6);assert.equal(h[10],0);assert.equal(h[11],0);
 const z=Buffer.concat(chunks.filter(x=>x.type==='IDAT').map(x=>x.data));
 const filtered=inflateSync(z),stride=w*4;
 assert.equal(filtered.length,ht*(stride+1));
 // Our generator writes PNG filter 0 only, permitting direct pixel inspection.
 let nonzero=0,partial=0,frameBorders=0,empty=0;
 const frameVisible=new Array(32).fill(0);
 for(let y=0;y<ht;y++){
  const row=y*(stride+1);assert.equal(filtered[row],0);
  for(let x=0;x<w;x++){
   const alpha=filtered[row+1+x*4+3];
   const n=Math.floor(y/208)*8+Math.floor(x/176);
   if(alpha){nonzero++;frameVisible[n]++;if(alpha<255)partial++;
    if(x%176===0||x%176===175||y%208===0||y%208===207)frameBorders++;
   }
  }
 }
 empty=frameVisible.filter(n=>n===0).length;
 return {w,ht,nonzero,partial,frameBorders,empty,bytes:b.length};
}
assert.equal(manifest.assets.length,4);
assert.equal(new Set(manifest.assets.map(a=>a.atlasKey)).size,4);
assert.equal(Object.values(P06_STATES).reduce((a,b)=>a+b,0),32);
let verified=0,totalBytes=0;
for(const actor of manifest.assets){
 const file=actor.file.split('/').at(-1);
 const binary=readFileSync(new URL('../../art/actors/p06/png/'+file,import.meta.url));
 const digest=createHash('sha256').update(binary).digest('hex');
 assert.equal(digest,actor.sha256);
 assert.equal(sha256P06(binary),digest,'Independent JS SHA256 mismatch');
 assert.equal(binary.length,actor.bytes);
 const info=checkPng(binary);
 assert.equal(info.nonzero,actor.alphaNonzeroPixelCount);
 assert.equal(info.partial,actor.alphaPartialPixelCount);
 assert.equal(info.frameBorders,0,'Clipping/frame bleed detected '+actor.canonicalId);
 assert.equal(info.empty,0,'Unexpected blank sprite '+actor.canonicalId);
 const regenerated=generateP06Atlas(actor.canonicalId);
 assert(Buffer.from(regenerated.png).equals(binary),'Generator not byte-reproducible');
 assert.equal(regenerated.atlasKey,actor.atlasKey);
 verified++;totalBytes+=binary.length;
 console.log('[P06] PASS exported PNG '+actor.canonicalId+': '+digest.slice(0,12)+
  ' / '+binary.length+' bytes / 32 valid frames / zero border bleed');
}
assert.equal(verified,4);
let completed=0;
const spawn={
 entityId:'enemy-1',type:'spawn',eventId:'evt-1',tick:1,
 worldPosition:{x:340,y:420},entity:{life:15,maxLife:20}
};
const project=createP06CoreProjection({actorId:'warrior',entityId:'enemy-1',
 onVisualDone:()=>completed++});
assert(project.acceptCoreEvent(spawn));
assert.equal(project.snapshot().overlay.hpCurrent,15);
assert(project.acceptCoreEvent({type:'hp_changed',entityId:'enemy-1',hp:10,maxHp:20,eventId:'evt-2'}));
assert.equal(project.snapshot().overlay.hpCurrent,10);
assert(project.acceptCoreEvent({type:'hit_applied',entityId:'enemy-1',eventId:'evt-3'}));
assert(!project.acceptCoreEvent({type:'hit_applied',entityId:'enemy-1',eventId:'evt-3'}));
project.acceptCoreEvent({type:'game_paused',eventId:'pause'});
const paused=project.snapshot().visual.frame;project.advance(900);
assert.equal(project.snapshot().visual.frame,paused);
project.acceptCoreEvent({type:'game_resumed',eventId:'resume'});
assert(project.acceptCoreEvent({type:'entity_die',entityId:'enemy-1',eventId:'evt-4'}));
project.advance(2000);project.advance(2000);
assert.equal(completed,1);
assert(!project.acceptCoreEvent({type:'entity_escape',entityId:'enemy-1',eventId:'evt-5'}));
assert(project.dispose());
assert(!project.dispose());assert.equal(completed,1);
const exit=createP06CoreProjection({actorId:'hound',entityId:'enemy-2'});
exit.acceptCoreEvent({type:'entity_escape',entityId:'enemy-2',eventId:'escape'});
exit.advance(400);assert.equal(exit.snapshot().visual.opacity,0);exit.dispose();
const unarmed=manifest.namedVariants.sniper_operator_unarmed;
assert.equal(unarmed.containsRifle,false);
assert.equal(unarmed.canonicalId,'sniper_operator');
assert.equal(unarmed.integrationAllowed,'pending visual montage');
console.log('[P06] PASS 4 real RGBA PNG files / 128 frames, total bytes='+totalBytes);
console.log('[P06] PASS event/HP/read-only/terminal/escape tests; T07 mounting remains NOT_RUN');
console.log('[P06] NOT_RUN Chromium/WebGL2, integrated M/T/P, phone FPS, pixel art-director review');
