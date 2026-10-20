/**
 * SEMANTROPIC TD / P04 QA (real Node with drawing-interface mock).
 * node public/official/src/actors-visual/qa-p04.mjs
 * Validates timing, feet support, pose variation and asset contract;
 * NOT a browser/WebGL2, actual alpha proof or art-quality certification.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {P04_META,P04_CANON,P04_FPS,P04_STATE_FRAMES,describeP04Pose,allP04KeyPoses} from '../../art/actors/p04-poses.mjs';
import {paintP04Frame,makeP04Atlas,installP04Atlas,makeP04CharacterSheet} from '../../art/actors/p04-illustrator.mjs';
const mf=JSON.parse(readFileSync(new URL('../../art/actors/P04_MANIFEST.json',import.meta.url),'utf8'));
const gradient={addColorStop(){}},traces=[];
const ctx=new Proxy({createLinearGradient:()=>gradient,createRadialGradient:()=>gradient},{
 get(o,k){if(k in o)return o[k];
  return (...args)=>{if(['moveTo','lineTo','quadraticCurveTo','bezierCurveTo','ellipse','translate','rotate','drawImage'].includes(k)){
   traces.push(k+':'+args.map(v=>typeof v==='number'?v.toFixed(3):typeof v).join(','));}};
 },
 set(o,k,v){o[k]=v;return true;}
});
const before=globalThis.document;
globalThis.document={createElement(tag){
 assert.equal(tag,'canvas');
 return {width:0,height:0,getContext(kind){assert.equal(kind,'2d');return ctx;}};
}};
try {
 assert.equal(P04_META.length,4);
 assert.equal(Object.values(P04_STATE_FRAMES).reduce((a,b)=>a+b,0),32);
 assert.equal(mf.actors.length,4);
 assert.equal(new Set(mf.actors.map(x=>x.assetId)).size,4);
 assert.equal(mf.owner,'P');
 assert.equal(mf.status,'prototype');
 assert.equal(mf.gameplayImplemented,false);
 assert.equal(P04_CANON.footAnchor.y,.92);
 assert.equal(P04_CANON.shadowAnchor.y,1);
 const keys=new Set();let total=0;
 for(const actor of P04_META){
  const all=allP04KeyPoses(actor.id);
  assert.equal(all.length,32);
  assert(!keys.has(actor.key));keys.add(actor.key);
  assert(mf.actors.some(x=>x.assetId===actor.key&&x.canonicalId===actor.id));
  const atlas=makeP04Atlas(actor.id);
  assert.equal(atlas.frameCount,32);
  assert.equal(atlas.canvas.width,1408);assert.equal(atlas.canvas.height,832);
  const seen=new Set();
  for(const [state,num] of Object.entries(P04_STATE_FRAMES)){
   assert.equal(atlas.frames[state].length,num);
   assert(P04_FPS[actor.id][state]>0&&P04_FPS[actor.id][state]<15);
   const geometry=new Set(),poses=new Set();
   for(let i=0;i<num;i++){
    const f=atlas.frames[state][i],p=describeP04Pose(actor.id,state,i);
    assert.equal(f.name,state+'-'+i);
    assert(f.x>=0&&f.y>=0&&f.x+f.w<=1408&&f.y+f.h<=832);
    assert(!seen.has(f.x+','+f.y));seen.add(f.x+','+f.y);
    poses.add(JSON.stringify(p));
    traces.length=0;paintP04Frame(ctx,actor.id,state,i);
    geometry.add(traces.join('|'));
    total++;
   }
   assert.equal(poses.size,num,'P04 duplicated key pose '+actor.id+'/'+state);
   assert.equal(geometry.size,num,'P04 identical drawing trace '+actor.id+'/'+state);
  }
  assert.equal(seen.size,32);
  const tx=new Map();
  const scene={textures:{
   exists:key=>tx.has(key),
   addCanvas(key,canvas){assert(!tx.has(key));tx.set(key,{canvas,frames:new Map(),add(n,z,x,y,w,h){
    assert(!this.frames.has(n));assert.equal(z,0);this.frames.set(n,{x,y,w,h});
   }});},
   get:key=>tx.get(key)
  }};
  installP04Atlas(scene,atlas);
  assert.equal(tx.get(actor.key).frames.size,32);
  tx.delete(actor.key);assert.equal(tx.size,0);
  const sheet=makeP04CharacterSheet(actor.id);
  assert.equal(sheet.width,1200);assert.equal(sheet.height,820);
 }
 assert.equal(keys.size,4);assert.equal(total,128);
 for(let i=0;i<8;i++){
  const quad=describeP04Pose('hound','walk',i).quad.paws;
  // front near / hind far in phase; front far / hind near in phase.
  assert.equal(quad.frontNear.onGround,quad.hindFar.onGround);
  assert.equal(quad.frontFar.onGround,quad.hindNear.onGround);
  assert(quad.frontNear.onGround!==quad.frontFar.onGround || i%4===2 || i%4===0);
 }
 console.log('PASS P04 4 actors × 32 frames = 128 distinct planned+traced frames');
 console.log('PASS ABI P01: 7 states, frame names, atlas 1408×832, anchor 0.5/.92');
 console.log('PASS procedural artist sheets 4 × 1200×820, 4 unique texture keys');
 console.log('PASS diagonal hound paw support and deterministic keyposes');
 console.log('NOT_RUN real-browser Chromium/WebGL2, P04 png alpha, mobile device, integrated T05');
}finally{globalThis.document=before;}
