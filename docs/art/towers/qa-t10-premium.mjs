/** TORRES T10 PREMIUM: node docs/art/towers/qa-t10-premium.mjs
 * SOURCE and Phaser MOCK only; browser visible alignment not covered.
 */
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {TOWER_ART_V2} from '../../../public/official/src/towers-visual/catalog.mjs';
import {T10_SNIPER_MUZZLES} from '../../../public/official/src/towers-visual/t10/sniper-muzzle-contract.mjs';
import {projectMountedT10Muzzle,diagnoseMountedT10Muzzle} from '../../../public/official/src/towers-visual/t10/premium-runtime-muzzle.mjs';
import {SniperShotPresenter} from '../../../public/official/src/towers-visual/sniper-vfx.mjs';
for(const m of TOWER_ART_V2.filter(m=>m.family==='sniper')){
 const ref=T10_SNIPER_MUZZLES[m.level];
 assert.equal(execFileSync('git',['hash-object',ref.file],{encoding:'utf8'}).trim(),ref.blob);
 for(const [x,y] of [[155,230],[1125,355],[750,535]]){
  const sprite={x,y,width:360,height:420,displayOriginX:180,displayOriginY:390.6,
   scaleX:m.worldScaleProposal,scaleY:m.worldScaleProposal,rotation:0,
   getWorldTransformMatrix(){
    return {transformPoint:(u,v)=>({x:this.x+u*this.scaleX,y:this.y+v*this.scaleY})};
   }};
  const p=projectMountedT10Muzzle(sprite,m);
  assert.ok(Math.hypot(p.x-x-(ref.sourcePoint.x-180)*m.worldScaleProposal,
   p.y-y-(ref.sourcePoint.y-390.6)*m.worldScaleProposal)<1e-8);
  assert.ok(diagnoseMountedT10Muzzle(sprite,m).discrepancyWorld<1e-8);
  const shifted={...sprite,displayOriginX:195,getWorldTransformMatrix:undefined};
  assert.ok(Math.abs(projectMountedT10Muzzle(shifted,m).x-p.x+15*m.worldScaleProposal)<1e-8);
 }
}
const objects=[],timers=[],tweens=[],hooks={};
const obj=(type,x=0,y=0,radius=0)=>{
 const a={type,x,y,radius,active:true,setDepth(){return this},setStrokeStyle(){return this},
  lineStyle(){return this},beginPath(){return this},moveTo(){return this},lineTo(){return this},
  strokePath(){return this},clear(){return this},setPosition(x,y){this.x=x;this.y=y;return this},
  destroy(){this.active=false}};objects.push(a);return a;
};
const scene={add:{circle:(x,y,r)=>obj('Arc',x,y,r),graphics:()=>obj('Graphics')},
 events:{once:(n,f)=>hooks[n]=f,off:(n,f)=>{if(hooks[n]===f)delete hooks[n]}},
 time:{delayedCall:(ms,fn)=>{const a={remove(){this.removed=true}};timers.push(a);return a}},
 tweens:{add:a=>{const t={...a,stop(){this.stopped=true}};tweens.push(t);return t}}};
const fx=new SniperShotPresenter(scene,{premium:true,depth:35000});
const fire={type:'attack_fire',eventId:'fire-A',entityId:'sniper-1',targetId:'hound-1',tick:10,
 payload:{muzzleWorld:{x:120,y:220},originWorld:{x:120,y:300},targetWorld:{x:500,y:450},bulletId:51}};
assert.equal(fx.accept(fire),true);
const j=fx.jobs.get('fire-A');
assert.ok(j?.premiumProjectile&&j?.premiumGlow);
assert.deepEqual(j.premiumFirstFrame,fire.payload.muzzleWorld);
assert.deepEqual({x:j.premiumProjectile.x,y:j.premiumProjectile.y},fire.payload.muzzleWorld);
assert.deepEqual({x:j.premiumGlow.x,y:j.premiumGlow.y},fire.payload.muzzleWorld);
assert.equal(fx.diagnostics().visualHitCount,0);
assert.equal(fx.accept(fire),false);
const wrong={type:'hit_applied',eventId:'bad',towerId:'sniper-1',targetId:'hound-1',
 bulletId:999,worldPosition:{x:500,y:450}};
assert.equal(fx.accept(wrong),false);
assert.equal(fx.accept({...wrong,eventId:'real',bulletId:51}),true);
assert.equal(fx.accept({...wrong,eventId:'real',bulletId:51}),false);
assert.equal(fx.diagnostics().visualHitCount,1);
fx.clear();
assert.equal(fx.diagnostics().active,0);
assert.ok(objects.every(a=>!a.active));
assert.ok(timers.every(a=>a.removed));
assert.ok(tweens.every(a=>a.stopped));
fx.destroy();assert.equal(fx.destroyed,true);
const classic=new SniperShotPresenter(scene,{premium:false});
assert.equal(classic.accept({...fire,eventId:'fire-classic',payload:{...fire.payload,bulletId:52}}),true);
assert.equal(classic.diagnostics().premium,false);
classic.destroy();
console.log('PASS T10 PREMIUM: 2 T04 original hashes, sprite matrices, same first-frame origin, core-only hits and cleanup. Browser NOT_RUN.');
