/**
 * SEMANTROPIC TD P08 / PURE presentation only.
 * Consumes actual C1-D6/C1-D5 A2 flat core events. NEVER calls core/hit,
 * never spawns or counts extra soldiers, does not generate gameplay events.
 * A separate integrator must install this controller.
 */
export const P08_CLIPS=Object.freeze({
 idle:{frames:4,seconds:.72,loop:true},walk:{frames:8,seconds:.68,loop:true},
 attackWindup:{frames:3,seconds:.29,loop:false},
 attack:{frames:5,seconds:.24,loop:false,contactFrame:2},
 hit:{frames:3,seconds:.21,loop:false},die:{frames:6,seconds:.66,loop:false},
 blocked:{frames:3,seconds:.42,loop:true}
});
export const P08_CORE_EVENTS=Object.freeze([
 'soldier_spawn','soldier_respawn','soldier_removed','soldier_die',
 'soldier_attack_windup','soldier_attack_hit','soldier_hit',
 'enemy_attack_windup','enemy_blocked','enemy_unblocked',
 'spawn','hit_applied','entity_die','entity_escape',
 'game_paused','game_resumed','scene_reset','wave_clear'
]);
const real=(n,fallback)=>Number.isFinite(n)?n:fallback;
const clipSeconds=(state,duration)=>duration||P08_CLIPS[state]?.seconds||.5;
function seededAnimation(id,kind,level){
 return {entityId:id,kind,level,clip:'idle',age:0,duration:P08_CLIPS.idle.seconds,
   pendingTarget:null,windupUntil:null,lastTarget:null,
   dead:false,escaping:false,blocked:false,paused:false,locomotion:false,
   generation:0,hitConfirmed:false,visualContactOnly:false,
   lastEventTick:null,sourceId:null};
}
function transition(m,clip,time=undefined){
 m.clip=clip;m.age=0;m.duration=clipSeconds(clip,time);
 if(clip==='die'){m.dead=true;m.blocked=false;m.pendingTarget=null;m.windupUntil=null;}
}
export class P08AnimationController{
 constructor({onVisualState=null}={}){
  this.entities=new Map();this.seen=new Set();this.seenQueue=[];this.paused=false;
  this.disposed=false;this.onVisualState=onVisualState;
  this.emittedVisualOnly=0; // intentionally always zero: never create core hits
 }
 ensure(id,{kind='infantry_recruit',level=1}={}){
  if(this.disposed||id===null||id===undefined)throw Error('P08 invalid visual entity');
  if(!this.entities.has(id))this.entities.set(id,seededAnimation(id,kind,level));
  const m=this.entities.get(id);m.kind=kind||m.kind;m.level=level||m.level;
  return m;
 }
 // Caller passes core snapshot to choose idle/walk and level, never on-screen
 // animation to derive entity count, hit points or positions.
 presentEntity(id,{kind='infantry_recruit',level=1,moving=false}={}){
  const m=this.ensure(id,{kind,level});
  m.locomotion=!!moving;return this.snapshot(id);
 }
 consumeCoreEvent(e,visualEntityLookup=undefined){
  if(this.disposed||!e||!P08_CORE_EVENTS.includes(e.type))return false;
  const t=e.type;
  if(t==='scene_reset'){this.entities.clear();this.seen.clear();this.seenQueue.length=0;this.paused=false;return true;}
  if(t==='game_paused'){this.paused=true;return true}
  if(t==='game_resumed'){this.paused=false;return true}
  if(t==='wave_clear')return true;
  const id=e.entityId;if(id===null||id===undefined)return false;
  // Dedup per core event; events without IDs retain distinct frame/tick keys.
  const eventKey=e.eventId!=null?'id:'+e.eventId:
   e.tick!=null?'tick:'+e.tick+':'+t+':'+id+':'+(e.targetId??e.sourceId??''):
   null;
  if(eventKey&&this.seen.has(eventKey))return false;
  if(eventKey){this.seen.add(eventKey);this.seenQueue.push(eventKey);
   if(this.seenQueue.length>4096)this.seen.delete(this.seenQueue.shift());
  }
  if(t==='soldier_removed'){this.entities.delete(id);return true;}
  let info=typeof visualEntityLookup==='function'?visualEntityLookup(id):null;
  if(!info||typeof info!=='object')info={};
  const isSoldier=t.startsWith('soldier_'),prior=this.entities.get(id);
  // Events like soldier_die/respawn do not carry level: preserve level II!
  const m=this.ensure(id,{kind:info.kind||prior?.kind||
    (isSoldier?'infantry_recruit':t.startsWith('enemy_')?'warrior':undefined),
   level:info.level||e.level||prior?.level||1});
  m.lastEventTick=e.tick??m.lastEventTick;
  if(t==='soldier_spawn'||t==='soldier_respawn'||t==='spawn'){
   m.generation++;m.dead=false;m.escaping=false;m.pendingTarget=null;m.blocked=false;
   m.hitConfirmed=false;transition(m,'idle');
  }else if(t==='soldier_die'||t==='entity_die'){
   transition(m,'die');
  }else if(t==='entity_escape'){
   m.escaping=true;m.dead=true;m.pendingTarget=null;transition(m,'die');
   m.escaping=true;
  }else if(t==='soldier_attack_windup'||t==='enemy_attack_windup'){
   if(m.dead)return false;
   m.pendingTarget=e.targetId??null;m.lastTarget=m.pendingTarget;
   m.windupUntil=real(e.windup,t==='enemy_attack_windup'?(m.kind==='hound'?.21:.32):.29);
   m.hitConfirmed=false;transition(m,'attackWindup',m.windupUntil);
  }else if(t==='soldier_attack_hit'){
   // CONFIRMED authoritative core hit; never create a hit on frame 2.
   if(m.dead||!m.pendingTarget||String(m.pendingTarget)!==String(e.targetId))return false;
   m.pendingTarget=null;m.hitConfirmed=true;transition(m,'attack',.25);
   // The REAL core hit has already occurred. Show contact keyframe 2 NOW,
   // not .1s later, then proceed into recovery (visual only).
   m.age=m.duration*2/P08_CLIPS.attack.frames;
  }else if(t==='soldier_hit'){
   if(!m.dead){m.sourceId=e.sourceId??null;transition(m,'hit',.21);}
   // Enemy attack impact has NO standalone event. This is the proven core
   // contact, correlated by sourceId, never an invented enemy_attack_hit.
   if(e.sourceId!==undefined&&e.sourceId!==null){
    const src=this.entities.get(e.sourceId);
    if(src&&!src.dead&&String(src.pendingTarget)===String(id)){
     src.pendingTarget=null;src.hitConfirmed=true;transition(src,'attack',.25);
     src.age=src.duration*2/P08_CLIPS.attack.frames;
    }
   }
  }else if(t==='enemy_blocked'){
   m.blocked=true;if(!m.dead&&m.clip!=='attackWindup'&&m.clip!=='attack')transition(m,'blocked');
  }else if(t==='enemy_unblocked'){
   m.blocked=false;if(!m.dead&&m.clip==='blocked')transition(m,'idle');
  }else if(t==='hit_applied'){
   if(!m.dead)transition(m,'hit',.20);
  }
  this.onVisualState?.(this.snapshot(id),e);
  return true;
 }
 update(dtSeconds){
  if(this.disposed||this.paused)return;
  const dt=Math.max(0,Math.min(real(dtSeconds,0),.1));
  for(const m of this.entities.values()){
   m.age+=dt;
   if(m.age<m.duration)continue;
   if(m.dead){m.age=m.duration;continue;}
   if(m.clip==='attackWindup'){
    // Anticipation MUST NOT infer actual strike or damage; holds at final
    // anticipatory frame until matching authoritative hit event arrives.
    // Interrupted/out-of-range attack: never synthesize impact.
    // Hold final anticipation for a short event grace period, then cancel.
    if(m.age<m.duration+.18)continue;
    m.pendingTarget=null;transition(m,m.blocked?'blocked':m.locomotion?'walk':'idle');continue;
   }
   if(m.clip==='hit'||m.clip==='attack'||m.clip==='die'){
    transition(m,m.blocked?'blocked':m.locomotion?'walk':'idle');continue;
   }
   if(m.clip==='blocked'&&!m.blocked){transition(m,m.locomotion?'walk':'idle');continue;}
   if(m.clip!=='walk'&&m.clip!=='idle'&&m.clip!=='blocked')transition(m,'idle');
   m.age=m.duration>0?m.age%m.duration:0;
   if(m.clip==='idle'&&m.locomotion)transition(m,'walk');
   else if(m.clip==='walk'&&!m.locomotion)transition(m,'idle');
  }
 }
 snapshot(id){
  const m=this.entities.get(id);if(!m)return null;
  const clip=P08_CLIPS[m.clip],duration=m.duration||.001;
  const normalized=Math.max(0,Math.min(1,m.age/duration));
  const frame=clip.loop?Math.floor((m.age%duration)/duration*clip.frames):
   Math.min(clip.frames-1,Math.floor(normalized*clip.frames));
  return Object.freeze({entityId:id,actorId:m.kind,level:m.level,state:m.clip,frame,
   frameName:m.clip+'-'+frame,progress:normalized,dead:m.dead,blocked:m.blocked,
   pendingTarget:m.pendingTarget,hitConfirmed:m.hitConfirmed,paused:this.paused,generation:m.generation});
 }
 destroy(){this.entities.clear();this.seen.clear();this.seenQueue=[];this.paused=false;this.disposed=true;}
}
