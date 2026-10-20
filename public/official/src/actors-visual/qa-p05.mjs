/**
 * SEMANTROPIC TD / P-05
 * node public/official/src/actors-visual/qa-p05.mjs
 * Real Node unit test with mocked Canvas2D and Phaser textures.
 * NOT a raster/Chromium/WebGL2 or device test.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {P04_CANON,P04_META,P04_STATE_FRAMES} from '../../art/actors/p04-poses.mjs';
import {createP05Reactivity,getP05AnimationMetadata} from '../../art/actors/p05-reactivity.mjs';
import {createP05Atlas,registerP05Atlas,makeP05ExpressionSheet,paintP05Frame} from '../../art/actors/p05-painter.mjs';
import {createP05ViewAdapter} from './p05-view-adapter.mjs';
const manifest=JSON.parse(readFileSync(new URL('../../art/actors/P05_MANIFEST.json',import.meta.url),'utf8'));
const grad={addColorStop(){}};
const commands=[];
const ctx=new Proxy({createLinearGradient:()=>grad,createRadialGradient:()=>grad},{
 get(o,k){if(k in o)return o[k];return (...args)=>{
  if(['moveTo','lineTo','ellipse','bezierCurveTo','quadraticCurveTo','translate','rotate','scale','drawImage'].includes(k))
   commands.push(k+':'+args.map(v=>typeof v==='number'?v.toFixed(2):typeof v).join(','));
 };},
 set(o,k,v){o[k]=v;return true;}
});
const before=globalThis.document;
globalThis.document={createElement(tag){
 assert.equal(tag,'canvas');
 return {width:0,height:0,getContext(kind){assert.equal(kind,'2d');return ctx;}};
}};
const ev=(entityId,type,eventId,payload={})=>({contractVersion:'combat-events-v1',entityId,type,eventId,payload});
try{
 assert.equal(manifest.assets.length,4);
 assert.equal(manifest.gameplayImplemented??false,false);
 assert.equal(Object.values(P04_STATE_FRAMES).reduce((s,v)=>s+v,0),32);
 let frames=0,uniqueIds=new Set();
 for(const actor of P04_META){
  const bundle=createP05Atlas(actor.id);
  assert.equal(bundle.framesTotal,32);frames+=bundle.framesTotal;
  assert.equal(bundle.canvas.width,1408);
  assert.equal(bundle.canvas.height,832);
  assert.equal(bundle.footAnchor.x,.5);assert.equal(bundle.footAnchor.y,.92);
  assert.equal(bundle.shadowAnchor.y,1);
  assert(!uniqueIds.has(bundle.atlasKey));uniqueIds.add(bundle.atlasKey);
  const positions=new Set();
  for(const [state,count] of Object.entries(P04_STATE_FRAMES)){
   assert.equal(bundle.frames[state].length,count);
   const frameDraws=new Set();
   for(let i=0;i<count;i++){
    const f=bundle.frames[state][i];
    assert.equal(f.name,state+'-'+i);
    assert(f.x>=0&&f.x+f.w<=1408&&f.y>=0&&f.y+f.h<=832);
    const k=f.x+','+f.y;assert(!positions.has(k));positions.add(k);
    commands.length=0;paintP05Frame(ctx,actor.id,state,i);
    frameDraws.add(commands.join('|'));
   }
   assert.equal(frameDraws.size,count,'Identical draw traces in '+actor.id+'/'+state);
  }
  assert.equal(positions.size,32);
  const face=makeP05ExpressionSheet(actor.id);
  assert.equal(face.width,1200);assert.equal(face.height,820);
  const entries=new Map();
  const scene={textures:{
   exists:key=>entries.has(key),
   addCanvas(key,canvas){assert(!entries.has(key));
    entries.set(key,{canvas,frames:new Map(),add(name,index,x,y,w,h){
     assert.equal(index,0);this.frames.set(name,{x,y,w,h});
    }});},
   get:key=>entries.get(key)
  }};
  registerP05Atlas(scene,bundle);
  assert.equal(entries.get(bundle.atlasKey).frames.size,32);
 }
 assert.equal(frames,128);
 for(const actor of P04_META){
  const metadata=getP05AnimationMetadata(actor.id);
  assert.equal(metadata.escape.atlasState,'walk');
  assert.equal(metadata.escape.durationMs,300);
  assert.equal(metadata.die.terminal,true);
  const done=[];
  const controller=createP05Reactivity({actorId:actor.id,entityId:'enemy/1',
   onVisualDone:x=>done.push(x)});
  assert(controller.dispatch(ev('enemy/1','move_state','move',{moving:true,facing:'E'})));
  const walk1=controller.advance(80);
  controller.dispatch(ev('enemy/1','move_state','dir',{moving:true,facing:'W'}));
  const walk2=controller.snapshot();
  assert.equal(walk1.frameIndex,walk2.frameIndex,'Walk restarts on orientation change');
  assert.equal(walk2.facing,'W');
  assert(controller.dispatch(ev('enemy/1','hit_applied','hit1')));
  assert(!controller.dispatch(ev('enemy/1','hit_applied','hit1')),'duplicate hit must drop');
  controller.dispatch(ev('enemy/1','game_paused','pause'));
  const prior=controller.snapshot();
  controller.advance(300);
  assert.equal(controller.snapshot().frame,prior.frame);
  controller.dispatch(ev('enemy/1','game_resumed','resume'));
  controller.advance(300);
  assert.equal(controller.snapshot().state,'idle');
  assert(controller.dispatch(ev('enemy/1','entity_die','die1')));
  controller.advance(3000);
  assert.equal(controller.snapshot().isComplete,true);
  assert.equal(done.length,1);
  assert(!controller.dispatch(ev('enemy/1','entity_escape','late-escape')));
  assert.equal(done.length,1);
  controller.dispose();assert.equal(done.length,1);
  const leave=[];
  const escape=createP05Reactivity({actorId:actor.id,entityId:'enemy/2',
   onVisualDone:x=>leave.push(x)});
  assert(escape.dispatch(ev('enemy/2','entity_escape','exit1')));
  assert(!escape.dispatch(ev('enemy/2','entity_escape','exit1')));
  assert.equal(escape.snapshot().atlasState,'walk');
  escape.advance(150);assert(escape.snapshot().opacity<1);
  escape.advance(200);assert.equal(escape.snapshot().isComplete,true);
  assert.equal(leave.length,1);assert.equal(leave[0].terminalState,'escape');
  assert(!escape.dispatch(ev('enemy/2','entity_die','late-die')));
  escape.dispose();
  const mockSprite={setFrame(){return this},setOrigin(){return this},setPosition(){return this},
   setScale(){return this},setFlipX(){return this},setAlpha(){return this},
   setDepth(){return this},setTint(){return this},clearTint(){return this}};
  const mockShadow={setOrigin(){},setPosition(){},setAlpha(){},setDepth(){}};
  const model=createP05Reactivity({actorId:actor.id,entityId:'visual/1'});
  model.setOverlayFromCore({hpCurrent:9,hpMax:12,shieldCurrent:3,shieldMax:6});
  const view=createP05ViewAdapter({sprite:mockSprite,shadow:mockShadow,reactivity:model});
  assert(view.setWorldPoseFromCore({x:300,y:500}));
  assert(view.render());
  assert(view.dispose());assert(!view.dispose());assert.equal(view.render(),null);
 }
 console.log('PASS P05: 4 actors, 4 atlases, 128 non-overlapping/differently traced frames');
 console.log('PASS 4 expression sheets 1200×820, foot anchor .5/.92, shadow .5/1');
 console.log('PASS duplicate event dedup, pause, walk-phase direction, hit recovery, die/escape once');
 console.log('PASS view cleanup once, read-only overlay-from-core and texture metadata');
 console.log('NOT_RUN: real Phaser WebGL2, PNG alpha/clipping, phone, T06 operator mounting');
}finally{globalThis.document=before;}
