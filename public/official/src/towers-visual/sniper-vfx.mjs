/**
 * SEMANTROPIC TD T07 — SniperShotPresenter, visual-only event adapter.
 * CANDIDATE CombatEventBridge v1; never edits HP, target, cooldown, kill, rewards.
 * Runtime must supply real source + target world coordinates and unique eventId.
 * Phaser Scene clock owns timers and tweens; no setTimeout/RAF.
 */
const PT=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y);
const ALLOWED=new Set(['attack_windup','attack_fire','hit_applied','tower_sold','tower_upgraded','entity_die','entity_escape','despawn','scene_reset']);
const copy=p=>({x:p.x,y:p.y});
export class SniperShotPresenter {
 constructor(scene,{variant='A',depth=510,onVisualState=null,maxActive=16,maxSeen=512,premium=false}={}){
  if(!scene?.time?.delayedCall||!scene?.tweens?.add||!scene?.add)throw Error('Sniper T06 requires Phaser.Scene');
  this.scene=scene;this.variant=variant==='B'?'B':'A';this.depth=depth;this.premium=!!premium;
  this.onVisualState=onVisualState;
  this.maxActive=Math.max(1,Math.min(24,Number(maxActive)||16));
  this.maxSeen=Math.max(32,Math.min(2048,Number(maxSeen)||512));
  this.seen=new Set();this.seenOrder=[];this.jobs=new Map();
  this.destroyed=false;this.fireCount=0;this.hitVisualCount=0;this.fireByBullet=new Map();
  this.shutdown=()=>this.destroy();
  this.scene.events?.once?.('shutdown',this.shutdown);
  this.scene.events?.once?.('destroy',this.shutdown);
 }
 _seen(id){this.seen.add(id);this.seenOrder.push(id);if(this.seenOrder.length>this.maxSeen){const ev=this.seenOrder.shift();this.seen.delete(ev);}}
 _job(id,{entityId,targetId,type}={}){
  if(this.jobs.size>=this.maxActive)this.cancel(this.jobs.keys().next().value);
  const job={id,entityId,targetId,type,alive:true,objects:new Set(),tweens:new Set(),timers:new Set()};
  this.jobs.set(id,job);return job;
 }
 _obj(job,o){job.objects.add(o);o.setDepth?.(this.depth);return o;}
 _free(job,o){if(o?.active)o.destroy();job.objects.delete(o);}
 _tween(job,obj,config){
  const onComplete=config.onComplete;
  let tween;
  tween=this.scene.tweens.add({...config,targets:obj,onComplete:(...args)=>{job.tweens.delete(tween);if(job.alive)onComplete?.(...args);}});
  job.tweens.add(tween);return tween;
 }
 _later(job,ms,fn){
  let ev;
  ev=this.scene.time.delayedCall(ms,()=>{job.timers.delete(ev);if(job.alive)fn();});
  job.timers.add(ev);return ev;
 }
 _state(job,name){if(job.alive)this.onVisualState?.({eventId:job.id,entityId:job.entityId,targetId:job.targetId,state:name});}
 _ring(job,p,color,size=13,duration=145){
  const o=this._obj(job,this.scene.add.circle(p.x,p.y,size,color,.04).setStrokeStyle(2,color,.66));
  this._tween(job,o,{scale:1.35,alpha:0,duration,onComplete:()=>this._free(job,o)});
 }
 _light(job,p,color,r=10){
  const o=this._obj(job,this.scene.add.circle(p.x,p.y,r,color,.68));
  this._tween(job,o,{alpha:0,scale:2.2,duration:120,onComplete:()=>this._free(job,o)});
 }
 _hit(job,p,color){
  // Target arrival is a graphics cue, NEVER a gameplay hit event or HP modification.
  this._ring(job,p,color,10,160);
  for(let i=0;i<3;i++){
   const a=(i*2.09)+.18;
   const q=this._obj(job,this.scene.add.circle(p.x,p.y,2.2,color,.78));
   this._tween(job,q,{x:p.x+Math.cos(a)*13,y:p.y+Math.sin(a)*11,alpha:0,duration:165,onComplete:()=>this._free(job,q)});
  }
 }
 _windup(job,source,target){
  this._state(job,'target_acquire');
  if(target)this._ring(job,target,0x9ddedb,12,120);
  this._later(job,105,()=>{
   this._state(job,'windup');
   this._light(job,source,0x9debd6,7);
  });
  // Visual windup never synthesizes attack_fire. A long visual-only failsafe returns to idle.
  this._later(job,1500,()=>{this._state(job,'idle');this.cancel(job.id);});
 }
 _fire(job,from,to,variant){
  if(this.premium)return this._firePremium(job,from,to,variant);
  const mode=variant==='B'?'B':'A',color=mode==='A'?0xcafbf1:0xe5b6ff;
  this.fireCount++;
  this._state(job,'fire');
  this._light(job,from,color,mode==='A'?9:11);
  const orb=this._obj(job,this.scene.add.circle(from.x,from.y,mode==='A'?3.2:5.3,0xf8ffff,.93).setStrokeStyle(1.8,color,.86));
  const lines=this._obj(job,this.scene.add.graphics());
  const distance=Math.hypot(to.x-from.x,to.y-from.y);
  const travel=Math.max(110,Math.min(310,distance*(mode==='A'?1.2:1.8)));
  this._state(job,'recoil');
  this._later(job,65,()=>this._state(job,'recover'));
  this._tween(job,orb,{x:to.x,y:to.y,ease:'Cubic.In',duration:travel,
   onUpdate:()=>{
    lines.clear();
    const dx=orb.x-from.x,dy=orb.y-from.y,ratio=Math.min(1,(mode==='A'?62:42)/Math.max(1,Math.hypot(dx,dy)));
    const ax=orb.x-dx*ratio,ay=orb.y-dy*ratio;
    lines.lineStyle(mode==='A'?5:6,color,.13).beginPath().moveTo(ax,ay).lineTo(orb.x,orb.y).strokePath();
    lines.lineStyle(mode==='A'?2.5:3.7,color,.62).beginPath().moveTo(ax,ay).lineTo(orb.x,orb.y).strokePath();
    if(mode==='A')lines.lineStyle(1.1,0xf9fff8,.9).beginPath().moveTo(ax,ay).lineTo(orb.x,orb.y).strokePath();
   },
   onComplete:()=>{
    this._free(job,orb);this._free(job,lines);
    // NEVER draw hit from tracer arrival: only an authenticated hit_applied from core.
    this._state(job,'recover');
   }
  });
  this._later(job,1000,()=>this.cancel(job.id));
 }
 /** Premium path is opt-in; all effects derive from the ONE core-authorized muzzle. */
 _firePremium(job,from,to,variant){
  const vx=to.x-from.x,vy=to.y-from.y,length=Math.max(.001,Math.hypot(vx,vy));
  const ux=vx/length,uy=vy/length,nx=-uy,ny=ux;
  const color=variant==='B'?0xe4c6f6:0xc6eee2;
  this.fireCount++;job.premiumSource=copy(from);job.premiumFirstFrame=copy(from);
  this._state(job,'fire');
  const flash=this._obj(job,this.scene.add.graphics());
  // Fixed-world root at the exact same from point as projectile, not operator/tower center.
  flash.lineStyle(3,0xfafff5,.91).beginPath().moveTo(from.x,from.y)
   .lineTo(from.x+ux*14,from.y+uy*14).strokePath();
  flash.lineStyle(1.8,0xf0dcae,.75).beginPath().moveTo(from.x,from.y)
   .lineTo(from.x+ux*8+nx*5,from.y+uy*8+ny*5)
   .moveTo(from.x,from.y).lineTo(from.x+ux*8-nx*5,from.y+uy*8-ny*5).strokePath();
  this._tween(job,flash,{alpha:0,duration:75,onComplete:()=>this._free(job,flash)});
  const pulse=this._obj(job,this.scene.add.circle(from.x,from.y,7,0xf5e1af,.33));
  this._tween(job,pulse,{alpha:0,scale:1.6,duration:95,onComplete:()=>this._free(job,pulse)});
  const glow=this._obj(job,this.scene.add.circle(from.x,from.y,7,color,.2));
  const orb=this._obj(job,this.scene.add.circle(from.x,from.y,3.5,0xfafff6,.99)
   .setStrokeStyle(1.2,color,.92));
  const trail=this._obj(job,this.scene.add.graphics());
  job.premiumProjectile=orb;job.premiumGlow=glow;
  const duration=Math.max(115,Math.min(310,length*1.24));
  this._state(job,'recoil');this._later(job,65,()=>this._state(job,'recover'));
  this._tween(job,orb,{x:to.x,y:to.y,ease:'Cubic.In',duration,onUpdate:()=>{
   glow.setPosition(orb.x,orb.y);
   const traveled=Math.hypot(orb.x-from.x,orb.y-from.y),tail=Math.min(24,traveled);
   trail.clear();if(tail<.75)return;
   trail.lineStyle(4.2,color,.16).beginPath()
    .moveTo(orb.x-ux*tail,orb.y-uy*tail).lineTo(orb.x,orb.y).strokePath();
   trail.lineStyle(1.6,0xf7fff3,.72).beginPath()
    .moveTo(orb.x-ux*tail*.76,orb.y-uy*tail*.76).lineTo(orb.x,orb.y).strokePath();
  },onComplete:()=>{
   this._free(job,orb);this._free(job,glow);this._free(job,trail);
   this._state(job,'recover'); // NO artificial hit on tracer arrival
  }});
  this._later(job,1000,()=>this.cancel(job.id));
 }
 _hitPremium(job,p){
  // Only reached through real correlated hit_applied event.
  const color=job.visualColor??0xc6eee2;
  this._ring(job,p,color,11,155);
  const pop=this._obj(job,this.scene.add.circle(p.x,p.y,4.2,0xfdf4d6,.76));
  this._tween(job,pop,{alpha:0,scale:1.4,duration:100,onComplete:()=>this._free(job,pop)});
  const star=this._obj(job,this.scene.add.graphics());
  for(const angle of [0,2.094,4.188]){
   const ux=Math.cos(angle),uy=Math.sin(angle);
   star.lineStyle(1.8,color,.72).beginPath().moveTo(p.x+ux*3,p.y+uy*3)
    .lineTo(p.x+ux*10,p.y+uy*10).strokePath();
  }
  this._tween(job,star,{alpha:0,duration:140,onComplete:()=>this._free(job,star)});
 }
 /**
  * accept({eventId, type, tick, entityId, targetId, worldPosition, payload})
  * attack_fire requires payload.muzzleWorld and payload.targetWorld (explicit);
  * target position is a frozen presentation snapshot, not a gameplay prediction.
  */
 accept(e){
  if(this.destroyed||!e||!ALLOWED.has(e.type))return false;
  if(e.type==='scene_reset'){this.clear();return true;}
  if(e.type==='tower_sold'||e.type==='tower_upgraded'){
   if(e.entityId!==undefined&&e.entityId!==null)this.cancelEntity(e.entityId);
   return true;
  }
  if(e.type==='entity_die'||e.type==='entity_escape'||e.type==='despawn'){
   if(e.entityId!==undefined&&e.entityId!==null){this.cancelTarget(e.entityId,e.type==='entity_die');this.cancelEntity(e.entityId);}
   return true;
  }
  // Correlate a REAL hit to an earlier fire by bulletId; reject phantom FX.
  if(e.type==='hit_applied'){
   if(typeof e.eventId!=='string'||!e.eventId||this.seen.has(e.eventId))return false;
   const bulletId=e.bulletId??e.payload?.bulletId;
   const key=typeof bulletId==='number'||typeof bulletId==='string'?String(bulletId):null;
   const originKey=key?this.fireByBullet.get(key):null;
   const fireJob=originKey?this.jobs.get(originKey):null;
   if(!fireJob||!fireJob.alive||fireJob.hitShown||!PT(e.worldPosition))return false;
   if(e.targetId!==undefined&&e.targetId!==null&&String(fireJob.targetId)!==String(e.targetId))return false;
   if(e.towerId!==undefined&&e.towerId!==null&&String(fireJob.entityId)!==String(e.towerId))return false;
   fireJob.hitShown=true;this.hitVisualCount++;
   this._seen(e.eventId);this.fireByBullet.delete(key);
   if(this.premium)this._hitPremium(fireJob,e.worldPosition);
    else this._hit(fireJob,e.worldPosition,fireJob.visualColor??0xcafbf1);
   this._later(fireJob,200,()=>this.cancel(fireJob.id));
   return true;
  }
  if(typeof e.eventId!=='string'||!e.eventId.length||this.seen.has(e.eventId))return false;
  if(typeof e.entityId!=='string'||!e.entityId)return false;
  if(e.tick!==undefined&&(!Number.isFinite(e.tick)||e.tick<0))return false;
  const from=e.payload?.muzzleWorld;
  const to=e.payload?.targetWorld;
  if(!PT(from))return false;
  if(e.type==='attack_fire'&&!PT(to))return false;
  const bulletId=e.type==='attack_fire'?(e.payload?.bulletId??null):null;
  const bulletKey=(typeof bulletId==='number'||typeof bulletId==='string')?String(bulletId):null;
  if(bulletKey&&this.fireByBullet.has(bulletKey))return false;
  if(e.type==='attack_fire'){
   // Core is authoritative; stop optical windup job for this shooter/target.
   for(const [id,j] of [...this.jobs])if(j.type==='attack_windup'&&j.entityId===e.entityId&&j.targetId===e.targetId)this.cancel(id);
  }
  const job=this._job(e.eventId,{entityId:e.entityId,targetId:e.targetId??null,type:e.type});
  if(bulletKey){job.bulletKey=bulletKey;this.fireByBullet.set(bulletKey,job.id);}
  job.visualColor=(e.payload?.visualVariant??this.variant)==='B'?0xe5b6ff:0xcafbf1;
  this._seen(e.eventId);
  if(e.type==='attack_windup')this._windup(job,copy(from),PT(to)?copy(to):null);
  else this._fire(job,copy(from),copy(to),e.payload?.visualVariant??this.variant);
  return true;
 }
 cancelEntity(entityId){
  let count=0;
  for(const [id,j] of [...this.jobs])if(j.entityId===entityId){this.cancel(id);count++;}
  return count;
 }
 cancelTarget(targetId,preserveConfirmedHit=false){
  let count=0;
  for(const [id,j] of [...this.jobs])if(j.targetId===targetId&&!(preserveConfirmedHit&&j.hitShown)){this.cancel(id);count++;}
  return count;
 }
 cancel(id){
  const j=this.jobs.get(id);if(!j)return false;
  j.alive=false;
  if(j.bulletKey&&this.fireByBullet.get(j.bulletKey)===id)this.fireByBullet.delete(j.bulletKey);
  for(const t of j.timers)t.remove(false);
  for(const t of j.tweens)t.stop();
  for(const obj of [...j.objects])this._free(j,obj);
  j.timers.clear();j.tweens.clear();this.jobs.delete(id);
  return true;
 }
 clear(){for(const id of [...this.jobs.keys()])this.cancel(id);this.seen.clear();this.seenOrder=[];this.fireByBullet.clear();}
 destroy(){
  if(this.destroyed)return;
  this.destroyed=true;this.clear();
  this.scene.events?.off?.('shutdown',this.shutdown);
  this.scene.events?.off?.('destroy',this.shutdown);
 }
 diagnostics(){return {active:this.jobs.size,seen:this.seen.size,visualFireCount:this.fireCount,visualHitCount:this.hitVisualCount,correlatedBullets:this.fireByBullet.size,variant:this.variant,premium:this.premium,destroyed:this.destroyed};}
}
