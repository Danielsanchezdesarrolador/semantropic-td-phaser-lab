/**
 * SEMANTROPIC TD C1-D8/B3 — motion/impact presentation ONLY.
 * Sources of timing: P08AnimationController snapshots and actual CORE hit events.
 * NEVER calls a combat function, changes HP, awards gold, spawns a unit or invents a hit.
 */
const clamp=x=>Math.max(0,Math.min(1,Number.isFinite(x)?x:0));
const easeOut=x=>1-(1-x)*(1-x);
const smooth=x=>x*x*(3-2*x);
const key=id=>String(id);
const ZERO=Object.freeze({x:0,y:0,rotation:0,scaleX:1,scaleY:1,alpha:1,facing:1,phase:"idle"});
export function sampleC1D8CombatPose(snapshot,{facing=1,kind="soldier"}={}){
 if(!snapshot)return ZERO;
 const p=clamp(snapshot.progress),dir=facing<0?-1:1;
 const soldier=kind==="soldier",sign=soldier?1:-1;
 let x=0,y=0,rotation=0,sx=1,sy=1,alpha=1;
 switch(snapshot.state){
  case "attackWindup":{
   const t=easeOut(p);
   x=-dir*(soldier?6.3:5.4)*t;
   y=-2.6*t;rotation=-dir*sign*(soldier?.21:.17)*t;
   sx=1-.06*t;sy=1+.075*t;
   break;
  }
  case "attack":{
   // P08 frame 2 corresponds to the actual CORE contact; emphasize from it.
   const lunge=Math.max(0,1-Math.abs(p-.42)/.58);
   const t=smooth(clamp(lunge));
   x=dir*(soldier?13.5:10.5)*t;
   y=-5.6*t;
   rotation=dir*sign*(soldier?.26:.22)*t;
   sx=1+.13*t;sy=1+.06*t;break;
  }
  case "hit":{
   const kick=(1-p)*(1-p);
   x=-dir*(soldier?7:8)*kick;
   y=-2.8*kick;rotation=-dir*sign*.19*kick;
   sx=1+.075*kick;sy=1-.10*kick;
   alpha=1-.19*kick;break;
  }
  case "die":{
   const t=smooth(p);
   x=-dir*5.0*t;y=4*t;rotation=-dir*.34*t;
   sx=1+.10*t;sy=1-.20*t;alpha=1-.28*t;break;
  }
  case "blocked":{
   sx=1+.025*Math.sin(p*Math.PI*2);break;
  }
  case "walk":{
   y=-1.7*Math.abs(Math.sin(p*Math.PI*4));break;
  }
 }
 return {x,y,rotation,scaleX:sx,scaleY:sy,alpha,facing:dir,phase:snapshot.state};
}
export function contactEffectForActualEvent(ev){
 if(ev?.type!=="soldier_attack_hit"&&ev?.type!=="soldier_hit")return null;
 const p=ev.worldPosition;
 if(!p||!Number.isFinite(p.x)||!Number.isFinite(p.y))return null;
 const friendly=ev.type==="soldier_attack_hit";
 return Object.freeze({x:p.x,y:p.y-19,color:friendly?0xffeb9e:0xffa885,
  border:friendly?0xfff8da:0xffd4bf,impactType:friendly?"sword":"enemy",
  durationMs:165,size:friendly?27:22,coreEvent:ev.type});
}
export class C1D8CombatMotion{
 constructor(){this.directions=new Map();this.windups=0;this.swordContacts=0;this.enemyContacts=0;}
 observe(ev,lookup=()=>null){
  if(!ev||typeof ev.type!=="string")return null;
  if(ev.type==="scene_reset"){this.reset();return null;}
  if(ev.type==="soldier_removed"||ev.type==="entity_die"||ev.type==="entity_escape"){
   this.directions.delete(key(ev.entityId));
  }
  if(ev.type==="soldier_attack_windup"||ev.type==="enemy_attack_windup"){
   this.windups++;
   const src=lookup(ev.entityId),dst=lookup(ev.targetId);
   if(src&&dst&&Number.isFinite(src.x)&&Number.isFinite(dst.x))
    this.directions.set(key(ev.entityId),dst.x<src.x?-1:1);
  }
  if(ev.type==="soldier_hit"){
   this.enemyContacts++;
   const src=lookup(ev.sourceId),dst=lookup(ev.entityId);
   if(src&&dst)this.directions.set(key(ev.sourceId),dst.x<src.x?-1:1);
  }
  if(ev.type==="soldier_attack_hit")this.swordContacts++;
  return contactEffectForActualEvent(ev);
 }
 facingFor(id,fallback=1){return this.directions.get(key(id))??(fallback<0?-1:1);}
 sample(id,actorSnapshot,{fallbackFacing=1,kind="soldier"}={}){
  return sampleC1D8CombatPose(actorSnapshot,{facing:this.facingFor(id,fallbackFacing),kind});
 }
 forget(id){this.directions.delete(key(id));}
 reset(){this.directions.clear();this.windups=0;this.swordContacts=0;this.enemyContacts=0;}
 diagnostics(){return Object.freeze({tracked:this.directions.size,windups:this.windups,
  swordContacts:this.swordContacts,enemyContacts:this.enemyContacts,gameplayWrites:0});}
}
/** Apply a pose to a P08 sprite. Keep health bars and collision positions untouched. */
export function applyC1D8Pose(sprite,pose,baselineScale){
 if(!sprite||!pose)return;
 const scale=Number.isFinite(baselineScale)?baselineScale:1;
 sprite.setPosition(pose.x,pose.y);
 sprite.setRotation(pose.rotation);
 sprite.setScale(scale*pose.scaleX,scale*pose.scaleY);
 sprite.setAlpha(pose.alpha);
}
/** One short VFX per confirmed CORE contact; no animation-driven extra strike. */
export function spawnC1D8Impact(scene,effect){
 if(!effect||!scene?.add?.ellipse||!scene?.tweens)return false;
 const slash=scene.add.ellipse(effect.x,effect.y,effect.size,8,effect.color,.79)
  .setRotation(-.36).setDepth(33300);
 const ring=scene.add.circle(effect.x,effect.y,7,effect.border,.13)
  .setStrokeStyle(2,effect.border,.8).setDepth(33299);
 scene.tweens.add({targets:slash,alpha:0,scaleX:1.55,scaleY:.42,
  y:effect.y-7,duration:effect.durationMs,onComplete:()=>slash.destroy()});
 scene.tweens.add({targets:ring,alpha:0,scale:2.1,
  duration:effect.durationMs,onComplete:()=>ring.destroy()});
 return true;
}
