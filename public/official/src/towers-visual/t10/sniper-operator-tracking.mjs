/** U02 A+B: purely visual sniper target-tracking and elevated platform depth. */
export const U02_SNIPER_OPERATOR_VERSION="u02-ab-facing-deck-v1";
export function sniperOperatorLayers(buildingDepth){
 if(!Number.isFinite(buildingDepth))throw Error("U02 invalid building depth");
 return Object.freeze({building:buildingDepth,shadow:buildingDepth+.5,operator:buildingDepth+1,frontRail:buildingDepth+2});
}
export function trackedSniperEnemy(mount,world){
 if(!mount||!world?.enemies||!world?.towers)return null;
 const aimId=world.towers.get(mount.id)?.aim?.targetId;
 for(const id of [aimId,mount.operatorTargetId]){
  const e=world.enemies.get(id);
  if(e&&!e.dead&&!e.escaped&&Number.isFinite(e.x)&&Number.isFinite(e.y))return e;
 }
 return null;
}
/* Target comes from real core aim or the same enemy's current position.
 * P03 rifle draws toward right; flip mirrors actor+rifle+muzzle coherently.
 * A subtle body lean communicates vertical pursuit, without changing gameplay. */
export function orientSniperOperator(mount,world,targetOverride=null){
 const op=mount?.operator;
 if(!op||typeof op.setFlipX!=="function"||typeof op.setRotation!=="function")return null;
 const target=targetOverride??trackedSniperEnemy(mount,world);
 if(!target||!Number.isFinite(target.x)||!Number.isFinite(target.y))return null;
 const dx=target.x-op.x,dy=target.y-op.y;
 const flip=dx<-2?true:dx>2?false:!!op.flipX;
 op.setFlipX(flip);
 const slope=Math.atan2(dy,Math.max(Math.abs(dx),75));
 const rotation=Math.max(-.055,Math.min(.055,slope*.18))*(flip?-1:1);
 op.setRotation(rotation);
 if(target.id!==undefined&&target.id!==null)mount.operatorTargetId=target.id;
 mount.operatorFacing=flip?"left":"right";
 return Object.freeze({targetId:target.id??null,flipX:flip,rotation,dx,dy});
}
