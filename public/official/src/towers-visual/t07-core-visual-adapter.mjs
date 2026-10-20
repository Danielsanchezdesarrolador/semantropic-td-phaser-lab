/**
 * T07: pure read-only visual adapter proposal for Core C1-D2.
 * Core attack_fire.payload.originWorld is NOT the mounted tower muzzle.
 * Integrator must call adaptSniperCoreEvent(event, lookup) from central bridge.
 * No auto-subscription, gameplay state, cooldown, damage or bullet creation.
 */
import {getSniperFireVisualAnchor} from './catalog.mjs';
const point=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y);
export function adaptSniperCoreEvent(event, lookup){
 if(!event||typeof event.type!=='string'||typeof lookup!=='function')return null;
 const allowed=['attack_windup','attack_fire','hit_applied','entity_die','entity_escape','despawn','scene_reset'];
 if(!allowed.includes(event.type))return null;
 if(event.type==='scene_reset')return {...event};
 if(['entity_die','entity_escape','despawn','hit_applied'].includes(event.type)){
  return {...event};
 }
 if(typeof event.entityId!=='string'||!event.entityId)return null;
 const mount=lookup(event.entityId);
 if(!mount||mount.meta?.family!=='sniper'||!mount.sprite)return null;
 const muzzle=getSniperFireVisualAnchor(mount.sprite,mount.meta);
 if(!point(muzzle))return null;
 const target=event.payload?.targetWorld;
 if(event.type==='attack_fire'&&!point(target))return null;
 const payload={...event.payload,muzzleWorld:{x:muzzle.x,y:muzzle.y}};
 return {...event,payload};
}
export const T07_VISUAL_CORE_CONTRACT=Object.freeze({
 status:'candidate-read-only-adapter',owner:'Integrator',
 originFromCore:'attack_fire.payload.originWorld',
 muzzleFromTower:'projectSourceAnchor(sprite,meta,fireEffectOriginLocal)',
 targetFromCore:'attack_fire.payload.targetWorld',
 hitSource:'hit_applied.bulletId',
 projectileVisualId:'optional RFC bulletId with eventId',
 damageOwnedBy:'core',rifleOwner:'T',operatorOwner:'P06',operatorAsset:'sniper_operator_unarmed'
});

/** T08 CURRENT adapter contract; keep T07_VISUAL_CORE_CONTRACT immutable as legacy P06 alias. */
export const T08_VISUAL_CORE_CONTRACT=Object.freeze({
 ...T07_VISUAL_CORE_CONTRACT,
 status:'candidate-read-only-adapter-t08',
 operatorOwner:'P07',
 operatorAsset:'sniper_operator_unarmed',
 rifleOwner:'T'
});
