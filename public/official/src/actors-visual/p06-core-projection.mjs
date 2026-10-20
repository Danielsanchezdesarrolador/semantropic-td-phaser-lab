/** SEMANTROPIC TD P06: read-only adapter candidate for PR#22 M01CombatWorld.
 * PR22 event envelope is FLAT (type,entityId,eventId,tick, hp/maxHp at top).
 * This module doesn't hook into world, drainEvents or mutate model snapshots.
 * The Integrator owns subscriptions, world positions and authoritative teardown.
 */
import {createP05Reactivity} from '../../art/actors/p05-reactivity.mjs';
export const P06_SUPPORTED_EVENTS=Object.freeze([
 'spawn','attack_windup','attack_fire','hit_applied','hp_changed',
 'entity_die','entity_escape','game_paused','game_resumed'
]);
export function createP06CoreProjection({actorId,entityId,onVisualDone}={}){
 const model=createP05Reactivity({actorId,entityId,onVisualDone});
 let lastWorld=null,readOnlyHp={hpCurrent:null,hpMax:null,shieldCurrent:null,shieldMax:null};
 let destroyed=false;
 function acceptCoreEvent(e){
  if(destroyed||!e||!P06_SUPPORTED_EVENTS.includes(e.type))return false;
  if(!['game_paused','game_resumed'].includes(e.type)&&e.entityId!==entityId)return false;
  // These are actual PR22 names. P05 FSM uses same candidate state names.
  if(e.type==='hp_changed'){
   const hp=Number.isFinite(e.hp)?e.hp:null,max=Number.isFinite(e.maxHp)?e.maxHp:null;
   if(hp!==null&&max!==null&&max>0){
    readOnlyHp={...readOnlyHp,hpCurrent:hp,hpMax:max};model.setOverlayFromCore(readOnlyHp);
   }
   return true;
  }
  if(e.type==='spawn'){
   if(e.worldPosition&&Number.isFinite(e.worldPosition.x)&&Number.isFinite(e.worldPosition.y))
    lastWorld={...e.worldPosition};
   const max=e.entity?.maxLife;
   const hp=e.entity?.life;
   if(Number.isFinite(max)&&max>0&&Number.isFinite(hp)){
    readOnlyHp={...readOnlyHp,hpCurrent:hp,hpMax:max};
    model.setOverlayFromCore(readOnlyHp);
   }
  }
  if(e.worldPosition&&Number.isFinite(e.worldPosition.x)&&Number.isFinite(e.worldPosition.y))
   lastWorld={x:e.worldPosition.x,y:e.worldPosition.y};
  // attack_fire is a tower event in C1-D2. Do not make an ENEMY attack
  // from the sniper projectile. T07/core handle weapon and tracer visuals.
  if(e.type==='attack_fire'||e.type==='attack_windup'){
   if(actorId==='sniper_operator')return model.dispatch({...e,entityId});
   return false;
  }
  const event={contractVersion:'combat-events-v1',type:e.type,
   eventId:e.eventId,entityId,tick:e.tick,payload:e.payload||{}};
  return model.dispatch(event);
 }
 function setWorldPoseFromCore(world){
  if(destroyed||!world||!Number.isFinite(world.x)||!Number.isFinite(world.y))return false;
  lastWorld={x:world.x,y:world.y};return true;
 }
 function snapshot(){return Object.freeze({visual:model.snapshot(),
  worldPosition:lastWorld?Object.freeze({...lastWorld}):null,
  overlay:Object.freeze({...readOnlyHp}),destroyed});}
 function advance(dt){if(!destroyed)model.advance(dt);return snapshot();}
 function dispose(){if(destroyed)return false;destroyed=true;model.dispose();return true;}
 return Object.freeze({acceptCoreEvent,setWorldPoseFromCore,snapshot,advance,dispose,
  producer:'PR22 M01CombatWorld',installedInCore:false,sourceOfTruth:'core'});
}
