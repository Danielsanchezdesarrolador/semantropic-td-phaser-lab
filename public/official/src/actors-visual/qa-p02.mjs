/* SEMANTROPIC TD P-02 • Node-only mock QA; no browser, no WebGL. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {CAST,ANIMATIONS,FRAME_WIDTH,FRAME_HEIGHT,ATLAS_COLUMNS} from '../../art/actors/atlas-source.mjs';
import {P02_STUDIES,P02_ANIM,P02_ANCHORS,createP02Atlas,addP02Texture} from '../../art/actors/p02-painter.mjs';
const manifest=JSON.parse(readFileSync(new URL('../../art/actors/P02_MANIFEST.json',import.meta.url),'utf8'));
const gradient=()=>({addColorStop(){}});
const ctx=new Proxy({createRadialGradient:gradient,createLinearGradient:gradient},{
 get(t,p){return p in t?t[p]:()=>{};},set(t,p,v){t[p]=v;return true;}
});
const prev=globalThis.document;
globalThis.document={createElement:(tag)=>{
 assert.equal(tag,'canvas');
 return {width:0,height:0,getContext:(kind)=>{assert.equal(kind,'2d');return ctx;}};
}};
try{
 assert.deepEqual(Object.keys(P02_STUDIES),['A','B']);
 assert.equal(manifest.owner,'P');assert.equal(manifest.status,'prototype');
 assert.equal(manifest.assets.length,8);
 assert.equal(new Set(manifest.assets.map(x=>x.assetId)).size,8);
 let total=0;
 for(const actor of CAST){
  const anchor=P02_ANCHORS[actor.actorId];
  assert(anchor&&anchor.foot[0]===.5&&anchor.foot[1]===.92);
  for(const state of Object.keys(ANIMATIONS)){
   const fps=P02_ANIM[actor.actorId][state];
   assert(Number.isFinite(fps)&&fps>=4&&fps<=14);
  }
  const textures=new Map();
  const scene={textures:{
   addCanvas(key,canvas){assert(!textures.has(key));textures.set(key,{canvas,frames:new Map(),add(name,index,x,y,w,h){
    assert.equal(index,0);assert(!this.frames.has(name));this.frames.set(name,{x,y,w,h});
   }});},
   get(key){return textures.get(key);}
  }};
  for(const variant of ['A','B']){
   const atlas=createP02Atlas(actor.actorId,variant);
   assert.equal(atlas.atlasKey,actor.atlasKey+'/p02-'+variant.toLowerCase());
   assert.equal(atlas.framesTotal,32);
   assert.equal(atlas.canvas.width,FRAME_WIDTH*ATLAS_COLUMNS);
   assert.equal(atlas.canvas.height,FRAME_HEIGHT*4);
   const cells=new Set();
   for(const [state,frames] of Object.entries(atlas.frames)){
    assert.equal(frames.length,ANIMATIONS[state].frames);
    for(const f of frames){
     assert(f.x>=0&&f.y>=0&&f.x+f.w<=atlas.canvas.width&&f.y+f.h<=atlas.canvas.height);
     const cell=f.x+','+f.y;assert(!cells.has(cell));cells.add(cell);
    }
   }
   assert.equal(cells.size,32);total+=cells.size;
   addP02Texture(scene,atlas);
   assert.equal(textures.get(atlas.atlasKey).frames.size,32);
   assert(manifest.assets.some(x=>x.assetId===atlas.atlasKey&&x.canonicalId===actor.actorId&&x.variant===variant));
  }
  assert.equal(textures.size,2);
 }
 assert.equal(total,256);
 console.log('[P-02] PASS 4 actors × 2 variants × 32 frames = 256 frame metadata');
 console.log('[P-02] PASS 8 atlases registered with 32 non-overlapping frames each');
 console.log('[P-02] PASS unique keys, foot anchors 0.5/0.92, valid animation FPS');
 console.log('[P-02] PENDING browser WebGL2, real PNG exports, physical mobile QA, art review');
}finally{globalThis.document=prev;}
