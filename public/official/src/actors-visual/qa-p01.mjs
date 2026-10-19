/* Ejecutar desde la raíz del repo:
 * node public/official/src/actors-visual/qa-p01.mjs
 * Smoke de metadata y dibujo con context stub; NO es QA visual o WebGL.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {CAST,ANIMATIONS,FRAME_WIDTH,FRAME_HEIGHT,ATLAS_COLUMNS,
 createActorAtlas,registerActorAtlases} from '../../art/actors/atlas-source.mjs';
const manifest=JSON.parse(readFileSync(new URL('../../art/actors/ASSET_MANIFEST_P01.json',import.meta.url),'utf8'));
assert.equal(manifest.manifestVersion,'semantropic-assets-v1');
assert.equal(manifest.actors.length,4);
assert.equal(new Set(CAST.map(a=>a.atlasKey)).size,4);
assert.equal(manifest.contracts.includes('actor-visual-v1'),true);
const context=new Proxy({createRadialGradient:()=>({addColorStop(){}})},{
 get(target,key){return key in target?target[key]:()=>{};},
 set(target,key,value){target[key]=value;return true;}
});
const oldDoc=globalThis.document;
globalThis.document={createElement:(tag)=>{
 assert.equal(tag,'canvas');
 return {width:0,height:0,getContext:(kind)=>{
  assert.equal(kind,'2d');return context;
 }};
}};
try{
 const atlasTotal=Object.values(ANIMATIONS).reduce((s,v)=>s+v.frames,0);
 assert.equal(atlasTotal,32);
 for(const actor of CAST){
  const atlas=createActorAtlas(actor.actorId);
  assert.equal(atlas.framesTotal,32);
  assert.equal(atlas.canvas.width,FRAME_WIDTH*ATLAS_COLUMNS);
  assert.equal(atlas.canvas.height,FRAME_HEIGHT*4);
  assert.equal(actor.footAnchor.y,.92);
  const coords=new Set();
  for(const [state,frames] of Object.entries(atlas.frames)){
   assert.equal(frames.length,ANIMATIONS[state].frames);
   for(const f of frames){
    assert(f.x>=0&&f.y>=0);
    assert(f.x+f.w<=atlas.canvas.width);
    assert(f.y+f.h<=atlas.canvas.height);
    assert(!coords.has(f.x+','+f.y));
    coords.add(f.x+','+f.y);
   }
  }
  assert.equal(coords.size,32);
 }
 const recorded=new Map();
 const scene={textures:{
  addCanvas:(key,canvas)=>{assert(!recorded.has(key));
   recorded.set(key,{canvas,frames:new Map(),add(name,sourceIndex,x,y,w,h){
    assert.equal(sourceIndex,0);
    assert(!this.frames.has(name));this.frames.set(name,{x,y,w,h});
   }});
  },
  get:key=>recorded.get(key)
 }};
 assert.equal(registerActorAtlases(scene).size,4);
 for(const t of recorded.values())assert.equal(t.frames.size,32);
 for(const a of manifest.actors){
  assert(CAST.some(x=>x.actorId===a.canonicalId&&x.atlasKey===a.atlasKey));
  assert.equal(a.status,'prototype');
 }
 console.log('[P] PASS: 4 actores, 128 frames, 4 texturas y 32 frames únicos por textura.');
 console.log('[P] PASS: pivotes, claves, manifest, cuadros atlas y pipeline de dibujo stub.');
 console.log('[P] PENDIENTE: render real Canvas/Phaser, capturas, WebGL2, QA táctil/físico, gameplay.');
}finally{globalThis.document=oldDoc;}
