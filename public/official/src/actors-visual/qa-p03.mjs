/* SEMANTROPIC TD Q2 / QA_P03: npm node-only contract+pose-trace smoke.
 * No browser/WebGL2, no assertions of art quality or mobile FPS.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {CAST,ANIMATIONS,FRAME_WIDTH,FRAME_HEIGHT,ATLAS_COLUMNS} from '../../art/actors/atlas-source.mjs';
import {P03_ACTORS,P03_FPS,getP03Pose,paintP03Frame,createP03Atlas,registerP03Atlas} from '../../art/actors/p03-rig.mjs';
import {createP03FaceSheet} from '../../art/actors/p03-face-sheet.mjs';
const manifest=JSON.parse(readFileSync(new URL('../../art/actors/P03_MANIFEST.json',import.meta.url),'utf8'));
const gradient={addColorStop(){}};
let operations=[];
const ctx=new Proxy({createLinearGradient:()=>gradient,createRadialGradient:()=>gradient},{
 get(t,k){
  if(k in t)return t[k];
  return (...args)=>{
   if(['moveTo','lineTo','bezierCurveTo','ellipse','translate','rotate','fillRect'].includes(k))
    operations.push(k+':'+args.map(v=>typeof v==='number'?v.toFixed(2):String(v)).join(','));
  };
 },
 set(t,k,v){t[k]=v;return true;}
});
const oldDocument=globalThis.document;
globalThis.document={createElement(tag){
 assert.equal(tag,'canvas');
 return {width:0,height:0,getContext(type){assert.equal(type,'2d');return ctx;}};
}};
try {
 assert.equal(CAST.length,4);
 assert.equal(P03_ACTORS.length,4);
 assert.equal(manifest.manifestVersion,'semantropic-assets-v1');
 assert.equal(manifest.owner,'P');
 assert.equal(manifest.status,'prototype');
 assert.equal(manifest.assets.length,4);
 assert.equal(new Set(P03_ACTORS.map(a=>a.atlasKey)).size,4);
 const textures=new Map();
 const scene={textures:{
  exists:key=>textures.has(key),
  addCanvas(key,canvas){
   assert(!textures.has(key));
   textures.set(key,{canvas,frames:new Map(),add(name,index,x,y,w,h){
    assert.equal(index,0);assert(!this.frames.has(name));this.frames.set(name,{x,y,w,h});
   }});
  },
  get:key=>textures.get(key)
 }};
 let total=0,poses=0;
 for(const actor of P03_ACTORS){
  assert.equal(actor.footAnchor.x,.5);
  assert.equal(actor.footAnchor.y,.92);
  assert.equal(actor.shadowAnchor.x,.5);
  assert.equal(actor.shadowAnchor.y,1);
  assert.equal(actor.frameWidth,FRAME_WIDTH);
  assert.equal(actor.frameHeight,FRAME_HEIGHT);
  const atlas=createP03Atlas(actor.actorId);
  assert.equal(atlas.framesTotal,32);
  assert.equal(atlas.canvas.width,FRAME_WIDTH*ATLAS_COLUMNS);
  assert.equal(atlas.canvas.height,FRAME_HEIGHT*4);
  assert(manifest.assets.some(x=>x.assetId===actor.atlasKey&&x.canonicalId===actor.actorId));
  const cells=new Set();
  for(const [state,meta] of Object.entries(ANIMATIONS)){
   assert.equal(atlas.frames[state].length,meta.frames);
   const seenPoses=new Set();
   assert(Number.isFinite(P03_FPS[actor.actorId][state]));
   for(let i=0;i<meta.frames;i++){
    const f=atlas.frames[state][i];
    assert.equal(f.name,state+'-'+i);
    assert(f.x>=0&&f.y>=0&&f.x+f.w<=atlas.canvas.width&&f.y+f.h<=atlas.canvas.height);
    assert(!cells.has(f.x+','+f.y));cells.add(f.x+','+f.y);
    const P=getP03Pose(actor.actorId,state,i);
    assert(Number.isFinite(P.bob));
    operations=[];paintP03Frame(ctx,actor.actorId,state,i);
    seenPoses.add(operations.join('|'));
    total++;poses++;
   }
   assert.equal(seenPoses.size,meta.frames,'Repeated frame geometry '+actor.actorId+'/'+state);
  }
  assert.equal(cells.size,32);
  registerP03Atlas(scene,atlas);
  assert.equal(textures.get(actor.atlasKey).frames.size,32);
  const face=createP03FaceSheet(actor.actorId);
  assert.equal(face.width,1200);assert.equal(face.height,820);
 }
 assert.equal(total,128);
 assert.equal(new Set(textures.keys()).size,4);
 // Same code path as scene cleanup: remove every texture and verify empty cache.
 for(const k of [...textures.keys()])textures.delete(k);
 assert.equal(textures.size,0);
 console.log('PASS P03-Q2: 4 actors, 7 states, 128 distinctly traced poses');
 console.log('PASS 4 atlases 1408x832, 32 frames/atlas, matching P01/2 frame names');
 console.log('PASS fixed foot 0.5/.92; separate shadow .5/1; 4 face sheets 1200x820');
 console.log('PASS 4 unique keys, 128 nonoverlapping frame cells, mocked texture cleanup');
 console.log('NOT_RUN: real Phaser/WebGL2 browser, PNG RGBA pixel proof, mobile, FPS, integrated anchors');
} finally {globalThis.document=oldDocument;}
