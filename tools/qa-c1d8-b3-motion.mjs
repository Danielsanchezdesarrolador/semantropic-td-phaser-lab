import assert from "node:assert/strict";
import {sampleC1D8CombatPose,contactEffectForActualEvent,C1D8CombatMotion}
 from "../public/official/src/c1d8-b3-combat/motion.mjs";
const snap=(state,progress)=>({state,progress});
const neutral=sampleC1D8CombatPose(snap("idle",0));
assert.deepEqual([neutral.x,neutral.y,neutral.rotation,neutral.scaleX],[0,0,0,1]);
const windup=sampleC1D8CombatPose(snap("attackWindup",1),{facing:1,kind:"soldier"});
assert(windup.x<-5&&windup.rotation<-.15&&windup.scaleY>1.05);
const slash=sampleC1D8CombatPose(snap("attack",.42),{facing:1,kind:"soldier"});
assert(slash.x>=12&&slash.rotation>.18&&slash.y<0&&slash.scaleX>1.1);
const enemySwing=sampleC1D8CombatPose(snap("attack",.42),{facing:-1,kind:"enemy"});
assert(enemySwing.x< -9&&enemySwing.scaleX>1.1);
const soldierHurt=sampleC1D8CombatPose(snap("hit",.05),{facing:-1,kind:"soldier"});
assert(soldierHurt.x>5&&soldierHurt.alpha<1);
const dying=sampleC1D8CombatPose(snap("die",.9),{facing:1,kind:"enemy"});
assert(dying.rotation<-.25&&dying.scaleY<.9);
assert.equal(contactEffectForActualEvent({type:"soldier_attack_windup",worldPosition:{x:1,y:2}}),null);
assert.equal(contactEffectForActualEvent({type:"enemy_attack_windup",worldPosition:{x:1,y:2}}),null);
assert.equal(contactEffectForActualEvent({type:"hit_applied",worldPosition:{x:1,y:2}}),null);
assert.equal(contactEffectForActualEvent({type:"soldier_attack_hit",worldPosition:null}),null);
const motion=new C1D8CombatMotion(),actors=new Map([["u",{x:10,y:10}],[9,{x:30,y:10}]]);
const lookup=id=>actors.get(id)||null;
assert.equal(motion.observe({type:"soldier_attack_windup",entityId:"u",targetId:9},lookup),null);
assert.equal(motion.facingFor("u"),1);
assert.equal(motion.diagnostics().swordContacts,0);
const a=motion.observe({type:"soldier_attack_hit",entityId:"u",targetId:9,
 worldPosition:{x:30,y:10}},lookup);
assert.equal(a.impactType,"sword");
const pose=motion.sample("u",snap("attack",.42),{kind:"soldier"});
assert(pose.x>12);
assert.equal(motion.observe({type:"enemy_attack_windup",entityId:9,targetId:"u"},lookup),null);
assert.equal(motion.facingFor(9),-1);
const b=motion.observe({type:"soldier_hit",entityId:"u",sourceId:9,
 worldPosition:{x:10,y:10}},lookup);
assert.equal(b.impactType,"enemy");
assert.deepEqual([motion.diagnostics().windups,motion.diagnostics().swordContacts,
 motion.diagnostics().enemyContacts,motion.diagnostics().gameplayWrites],[2,1,1,0]);
motion.forget("u");motion.reset();assert.equal(motion.diagnostics().tracked,0);
console.log(JSON.stringify({status:"PASS_C1D8_B3_MOTION_PURE_NO_EXTRA_DAMAGE",
 swordWindupRetreat:true,swordCoreContactLunge:true,enemyCoreContactLunge:true,
 hitRecoil:true,actualCoreEventsOnly:true,noGameWrites:true},null,2));
