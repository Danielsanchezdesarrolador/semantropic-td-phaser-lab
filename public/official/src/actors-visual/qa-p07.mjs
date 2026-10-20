/** PERSONAJES P07 binary PNG and P03 lineage QA — ACTUAL Node after checkout:
 * node public/official/src/actors-visual/qa-p07.mjs
 * No browser or core gameplay changes. Exit nonzero on failed assertions.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {inflateSync} from 'node:zlib';
import {P07_ACTORS,P07_STATES,buildP07Atlas} from '../../art/actors/p07-png-export.mjs';
import {sha256P06} from '../../art/actors/p06-hash.mjs';
import {P03_ACTORS} from '../../art/actors/p03-rig.mjs';
import {readP07Png,reportP07Mismatch} from './p07-hf1-png-diagnostics.mjs';
const mf=JSON.parse(readFileSync(new URL('../../art/actors/P07_MANIFEST.json',import.meta.url),'utf8'));
const u32=(b,i)=>b.readUInt32BE(i),totals={bytes:0,frames:0,actors:0};
function inspectPNG(bytes,expected){
 assert(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])));
 let i=8,chunks=[],types=[],width=0,height=0,depth=0,color=0;
 while(i<bytes.length){
  const n=u32(bytes,i),tag=bytes.toString('ascii',i+4,i+8),data=bytes.subarray(i+8,i+8+n);
  if(tag==='IHDR'){width=u32(data,0);height=u32(data,4);depth=data[8];color=data[9]}
  types.push(tag);if(tag==='IDAT')chunks.push(data);i+=12+n;
 }
 assert.equal(i,bytes.length);assert.equal(width,1408);assert.equal(height,832);
 assert.equal(depth,8);assert.equal(color,6);assert.equal(types.at(-1),'IEND');
 const raw=inflateSync(Buffer.concat(chunks)),stride=width*4;
 assert.equal(raw.length,(stride+1)*height);
 let borders=0,partial=0,visible=0;
 const count=new Array(32).fill(0);
 for(let y=0;y<height;y++){
  const o=y*(stride+1);assert.equal(raw[o],0,'P07 uses PNG filter NONE');
  for(let x=0;x<width;x++){
   const a=raw[o+1+x*4+3],cell=(Math.floor(y/208)*8+Math.floor(x/176));
   if(a){count[cell]++;visible++;if(a<255)partial++;
    if(x%176<=0||x%176>=175||y%208<=0||y%208>=207)borders++;
   }
  }
 }
 assert.equal(count.filter(x=>x===0).length,0);
 assert.equal(borders,0,'P07 edge/border bleed detected for '+expected.canonicalId);
 assert(partial>100,'P07 needs antialiased nonbinary alpha');
 return {width,height,frames:count.length,visible,partial,borders};
}
assert.equal(mf.assets.length,4);
assert.equal(new Set(mf.assets.map(a=>a.atlasKey)).size,4);
assert.equal(Object.values(P07_STATES).reduce((a,b)=>a+b,0),32);
assert.equal(mf.approvedVisualReference.sha256,'24103e45a0e1249fa4b89d4e65ea16d9e147bdf1e2462e5c4063469a931842ef');
assert.equal(mf.visualSource.originalBlobSha,'1a4282e1652ff559b92e18f42db465d6bfb8e729');
for(const asset of mf.assets){
 const file=asset.file.split('/').at(-1);
 const data=readFileSync(new URL('../../art/actors/p07/png/'+file,import.meta.url));
 const sha=createHash('sha256').update(data).digest('hex');
 assert.equal(sha,asset.sha256);
 assert.equal(sha256P06(data),sha);
 assert.equal(data.length,asset.sizeBytes);
 const parsed=inspectPNG(data,asset);
 const regen=buildP07Atlas(asset.canonicalId);
 // HF1: the original strict byte equality assertion remains a HARD GATE.
 // Record exact compressed/decompressed SHA, first byte/pixel, and affected frames.
 const diagnostic=reportP07Mismatch(data,regen.png,asset.canonicalId);
 console.log('[P07-HF1] '+asset.canonicalId+' compressed='+diagnostic.stored.pngSha256+
  ' regenerated='+diagnostic.regenerated.pngSha256+
  ' RGBA stored='+diagnostic.stored.rgbaSha256+
  ' RGBA regenerated='+diagnostic.regenerated.rgbaSha256+
  ' classification='+diagnostic.classification);
 if(diagnostic.classification!=='BYTE_IDENTICAL')
  console.error('[P07-HF1] FULL MISMATCH DIAGNOSTIC '+JSON.stringify(diagnostic));
 assert.equal(diagnostic.stored.rgbaSha256,asset.rgbaSha256,
  'Persisted PNG RGBA differs from P07-HF1 manifest');
 assert.equal(diagnostic.regenerated.rgbaSha256,asset.rgbaSha256,
  'Regenerated P07 RGBA differs from committed P07-HF1 pixel payload');
 assert.equal(regen.rgbaSha256,asset.rgbaSha256,
  'Canvas source RGBA does not match canonical expected payload');
 assert.equal(diagnostic.stored.transparentNonzeroRgbPixels,0,
  'PNG RGB fringe inside fully transparent areas');
 assert.equal(diagnostic.stored.gamma,null,
  'Unexpected gAMA: P07 RGBA export deliberately carries no gamma chunk');
 assert(Buffer.from(regen.png).equals(data),
  'P07 raster source was NOT byte-for-byte reproducible: '+diagnostic.classification);
 assert.equal(regen.atlasKey,asset.atlasKey);
 assert.equal(regen.frameCount,32);
 assert(P03_ACTORS.some(x=>x.actorId===asset.canonicalId));
 totals.actors++;totals.frames+=regen.frameCount;totals.bytes+=data.length;
 console.log('[P07] PASS real exported PNG '+asset.canonicalId+
  ' '+sha.slice(0,12)+' '+data.length+'B 32 frames zero borders');
}
assert.equal(totals.frames,128);
assert.equal(totals.bytes,mf.memory.totalCompressedPngBytes);
const p07rig=readFileSync(new URL('../../art/actors/p07-p03-continuity-rig.mjs',import.meta.url),'utf8');
assert(p07rig.includes('Mane segmented intentionally to show spine compression.'));
assert(p07rig.includes('head'));
assert(!p07rig.includes('rifle(c,[-17,-26],null,P.arm*.075)'),
 'The duplicate sniper actor rifle must never be reinstated in P07');
console.log('PASS PERSONAJES P07',JSON.stringify(totals));
console.log('[P07-HF1] Node environment '+JSON.stringify({node:process.version,v8:process.versions.v8,
 platform:process.platform,arch:process.arch,gitSha:process.env.GITHUB_SHA||null}));
console.log('NOT_RUN: Chromium/WebGL2 M07/T08 mounted, real core C1-D4, physical phone, art approval');
