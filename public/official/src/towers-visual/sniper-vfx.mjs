/**
 * SEMANTROPIC TD T06 — SniperShotPresenter, visual-only event adapter.
 * CANDIDATE CombatEventBridge v1; never edits HP, target, cooldown, kill, rewards.
 * Runtime must supply real source + target world coordinates and unique eventId.
 * Phaser Scene clock owns timers and tweens; no setTimeout/RAF.
 */
const PT=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y);
const ALLOWED=new Set(['attack_windup','attack_fire','entity_die','despawn','scene_reset']);
const copy=p=>({x:p.x,y:p.y});
export class SniperShotPresenter {
 constructor(scene,{variant='A',depth=510,onVisualState=null,maxActive=16,maxSeen=512}={}){
  if(!scene?.time?.delayedCall||!scene?.tweens?.add||!scene?.add)throw Error('Sniper T06 requires Phaser.Scene');
  this.scene=scene;this.variant=variant==='B'?'B':'A';this.depth=depth;
  this.onVisualState=onVisualState;
  this.maxActive=Math.max(1,Math.min(24,Number(maxActive)||16));
  this.maxSeen=Math.max(32,Math.min(2048,Number(maxSeen)||512));
  this.seen=new Set();this.seenOrder=[];this.jobs=new Map();
  this.destroyed=false;this.fireCount=0;
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
  this._later(job,240,()=>{this._state(job,'idle');this.cancel(job.id);});
 }
 _fire(job,from,to,variant){
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
    this._hit(job,to,color);this._state(job,'recover');
    this._later(job,200,()=>this.cancel(job.id));
   }
  });
  this._later(job,900,()=>this.cancel(job.id));
 }
 /**
  * accept({eventId, type, tick, entityId, targetId, worldPosition, payload})
  * attack_fire requires payload.muzzleWorld and payload.targetWorld (explicit);
  * target position is a frozen presentation snapshot, not a gameplay prediction.
  */
 accept(e){
  if(this.destroyed||!e||!ALLOWED.has(e.type))return false;
  if(e.type==='scene_reset'){this.clear();return true;}
  if(e.type==='entity_die'||e.type==='despawn'){
   if(e.entityId!==undefined&&e.entityId!==null){this.cancelTarget(e.entityId);this.cancelEntity(e.entityId);}
   return true;
  }
  if(typeof e.eventId!=='string'||!e.eventId.length||this.seen.has(e.eventId))return false;
  if(typeof e.entityId!=='string'||!e.entityId)return false;
  if(e.tick!==undefined&&(!Number.isFinite(e.tick)||e.tick<0))return false;
  const from=e.payload?.muzzleWorld;
  const to=e.payload?.targetWorld;
  if(!PT(from))return false;
  if(e.type==='attack_fire'&&!PT(to))return false;
  const job=this._job(e.eventId,{entityId:e.entityId,targetId:e.targetId??null,type:e.type});
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
 cancelTarget(targetId){
  let count=0;
  for(const [id,j] of [...this.jobs])if(j.targetId===targetId){this.cancel(id);count++;}
  return count;
 }
 cancel(id){
  const j=this.jobs.get(id);if(!j)return false;
  j.alive=false;
  for(const t of j.timers)t.remove(false);
  for(const t of j.tweens)t.stop();
  for(const obj of [...j.objects])this._free(j,obj);
  j.timers.clear();j.tweens.clear();this.jobs.delete(id);
  return true;
 }
 clear(){for(const id of [...this.jobs.keys()])this.cancel(id);this.seen.clear();this.seenOrder=[];}
 destroy(){
  if(this.destroyed)return;
  this.destroyed=true;this.clear();
  this.scene.events?.off?.('shutdown',this.shutdown);
  this.scene.events?.off?.('destroy',this.shutdown);
 }
 diagnostics(){return {active:this.jobs.size,seen:this.seen.size,visualFireCount:this.fireCount,variant:this.variant,destroyed:this.destroyed};}
}
