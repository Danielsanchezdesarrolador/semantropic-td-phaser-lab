/** TORRES T10 R1-HF2 — Node22 source-accurate P03 rifle projection.
 * node docs/art/towers/qa-t10-r1-hf2.mjs
 * This is NOT a raster-edge test, browser capture, or human visual approval.
 */
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {getP03Pose,P03_VERSION} from '../../../public/official/art/actors/p03-rig.mjs';
import {FRAME_WIDTH,FRAME_HEIGHT,ANIMATIONS} from '../../../public/official/art/actors/atlas-source.mjs';
import {TOWER_ART_V2,projectSourceAnchor} from '../../../public/official/src/towers-visual/catalog.mjs';
import {T10_SNIPER_MUZZLES} from '../../../public/official/src/towers-visual/t10/sniper-muzzle-contract.mjs';
import {getP03RifleMuzzleFramePoint,projectP03RifleMuzzle} from '../../../public/official/src/towers-visual/t10/p03-operator-rifle-muzzle.mjs';
assert.equal(P03_VERSION,'P03-Q2-rig-v1');
const rig=await readFile('public/official/art/actors/p03-rig.mjs','utf8');
assert.ok(rig.includes('rifle(c,[-17,-26],null,P.arm*.075)'));
assert.ok(rig.includes('path(c,[[40,-9],[79,-9]]'));
assert.ok(rig.includes('c.translate(0,-93);c.rotate(P.shoulder)'));
const source=await readFile('public/official/src/c1d8-b2-playable/scene.mjs','utf8');
assert.ok(source.includes('projectP03RifleMuzzle(mount.operator'));
assert.ok(source.includes('mount.operator.setFrame(frameName)'));
assert.ok(source.includes('t10GhostDeaths'));
for(const ref of [1,2]){
 const m=TOWER_ART_V2.find(x=>x.family==='sniper'&&x.level===ref),T=T10_SNIPER_MUZZLES[ref];
 assert.equal(execFileSync('git',['hash-object',T.file],{encoding:'utf8'}).trim(),T.blob);
 const tower={x:500,y:400,scaleX:m.worldScaleProposal,scaleY:m.worldScaleProposal,rotation:0};
 const anchor=projectSourceAnchor(tower,m,'operatorAnchorLocal');
 const frameScale=(80/171)*.70;
 const t04=projectSourceAnchor(tower,m,'muzzleLocal');
 const seen=[];
 for(const [state,max] of [['idle',ANIMATIONS.idle.frames],['attackWindup',ANIMATIONS.attackWindup.frames],['attack',ANIMATIONS.attack.frames]]){
  for(let i=0;i<max;i++){
   const a=getP03RifleMuzzleFramePoint(state,i);
   assert.ok(a.x>0&&a.x<FRAME_WIDTH&&a.y>0&&a.y<FRAME_HEIGHT);
   const o={x:anchor.x,y:anchor.y,width:FRAME_WIDTH,height:FRAME_HEIGHT,
    frame:{name:state+'-'+i},displayOriginX:FRAME_WIDTH*.5,
    displayOriginY:FRAME_HEIGHT*.92,scaleX:frameScale,scaleY:frameScale,rotation:0,flipX:false,flipY:false,
    getWorldTransformMatrix(){return {transformPoint:(x,y)=>({x:this.x+x*this.scaleX,y:this.y+y*this.scaleY})}}};
   const expected={x:anchor.x+(a.x-88)*frameScale,y:anchor.y+(a.y-191.36)*frameScale};
   const point=projectP03RifleMuzzle(o,{state,frame:i});
   assert.ok(Math.hypot(point.x-expected.x,point.y-expected.y)<1e-8);
   seen.push(point);
   assert.throws(()=>projectP03RifleMuzzle(o,{state,frame:(i+1)%max}),/frame mismatch/);
   const mirrored={...o,flipX:true,getWorldTransformMatrix:undefined};
   const flipped=projectP03RifleMuzzle(mirrored,{state,frame:i});
   assert.ok(Math.abs(flipped.x-(anchor.x+(FRAME_WIDTH-a.x-88)*frameScale))<1e-8);
  }
 }
 assert.ok(Math.hypot(seen.at(-1).x-t04.x,seen.at(-1).y-t04.y)>10,
  'Muzzle P03 and historical T04 are distinct graphical sources');
}
console.log(JSON.stringify({status:'PASS_T10_R1_HF2_P03_REAL_RIG_SOURCE',
 protectedT04Assets:2,states:['idle','attackWindup','attack'],frames:24,
 p03AssetEdited:false,scope:'Source and transform math only. Browser independent A/B/C and mobile visual approval still required.'}));
