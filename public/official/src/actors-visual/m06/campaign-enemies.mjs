/** Functional provisional actors: reuse original P08 warrior and M03 bat. No new art/VFX. */
import{registerM03Actors}from'../m03/forest-enemies.mjs';
const types=['brute','shaman','aliengunner','demolisher'];
export function registerM06Actors(scene){
 const bat=registerM03Actors(scene),deaths=new Set();
 return{owns:type=>type==='bat'||types.includes(type),
 make(type,x,y){
  if(type==='bat')return bat.make(type,x,y);
  if(!types.includes(type))return null;
  const v=scene.makeActor('warrior',x,y);v.custom=true;v.actorId=type;v.provisional=true;v.artist='PROVISIONAL_ORIGINAL_REUSE_'+type.toUpperCase();
  v.baseScale*=({brute:1.22,shaman:.92,aliengunner:1,demolisher:1.25}[type]||1);v.sprite.setScale(v.baseScale);
  if(type!=='brute')v.sprite.setTint({shaman:0xa8e5d6,aliengunner:0xa4badd,demolisher:0xdbb390}[type]);
  if(['aliengunner','demolisher'].includes(type)){v.label=scene.add.text(0,-115,type==='aliengunner'?'Tirador Alienígena':'Demoledor de Asedio',{fontSize:'13px',color:'#f8ecc1',backgroundColor:'#163e35',align:'center'}).setOrigin(.5,1);v.view.add(v.label);}
  return v;
 },event(ev,seconds){bat.event(ev,seconds);if(ev.type==='entity_die')deaths.add(ev.entityId);if(ev.type==='entity_revive')deaths.delete(ev.entityId);},isDead:id=>deaths.has(id)||bat.isDead(id),
 present(v,e,seconds,{dead=false}={}){
  if(e.type==='bat')return bat.present(v,e,seconds,{dead});
  const state=dead?'death':e.ai==='windup'||e.channel>0||e.enemyWindup>0||e.bossCast?'windup':e.blockedBy?'attack':'walk';
  const frames=v.sprite.texture.getFrameNames().filter(n=>n.startsWith(state+'-'));v.sprite.setFrame(frames[Math.floor(seconds*8)%frames.length]||'idle-0');
  v.sprite.setFlipX(Math.cos(e.heading)<0);v.sprite.setScale(v.baseScale);v.hp.setVisible(!dead);v.lastEntity={...e};
  if(v.label)v.label.setVisible(!dead);
 },forget(id){deaths.delete(id);bat.forget(id);},destroy(){deaths.clear();bat.destroy();}};
}
