/** Explicit provisional presentation only: original P08/P03 warrior art reused.
 * CORE types remain brute/shaman with their own canonical stats and support AI.
 * No new enemy art is generated or asserted approved by this functional block. */
export const M04_PROVISIONAL_TYPES=Object.freeze(['brute','shaman']);
export function registerM04Actors(scene){
 const deaths=new Set();
 return {
 owns:type=>M04_PROVISIONAL_TYPES.includes(type),
 make(type,x,y){
  if(!M04_PROVISIONAL_TYPES.includes(type))return null;
  const v=scene.makeActor('warrior',x,y);v.custom=true;v.actorId=type;v.provisional=true;
  v.artist='PROVISIONAL_ORIGINAL_WARRIOR_REUSE_'+type.toUpperCase();
  v.baseScale*=type==='brute'?1.22:.92;v.sprite.setScale(v.baseScale);
  if(type==='shaman')v.sprite.setTint(0xa8e5d6);
  return v;
 },
 event(ev){if(ev.type==='entity_die')deaths.add(ev.entityId);},isDead:id=>deaths.has(id),
 present(v,e,seconds,{dead=false}={}){
  const state=dead?'death':e.channel>0||e.enemyWindup>0?'windup':e.blockedBy?'attack':'walk';
  const frames=v.sprite.texture.getFrameNames().filter(n=>n.startsWith(state+'-'));
  v.sprite.setFrame(frames[Math.floor(seconds*8)%frames.length]||'idle-0');
  v.sprite.setFlipX(Math.cos(e.heading)<0);v.sprite.setScale(v.baseScale);
  v.hp.setVisible(!dead);v.lastEntity={...e};
 },forget(id){deaths.delete(id);},destroy(){deaths.clear();}
 };
}
