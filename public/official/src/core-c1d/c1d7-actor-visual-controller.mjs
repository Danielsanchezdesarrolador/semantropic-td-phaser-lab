/**
 * SEMANTROPIC TD C1-D7/G2 contract: deterministic *visual-only* event bridge.
 * Source of truth is M01CombatWithInfantryA2. Never applies HP/damage/gold.
 * P08 may supply atlas mappings/skins; the integrator owns state transitions.
 */
export const C1D7_VISUAL_PHASES=Object.freeze(["idle","walk","blocked","attackWindup","attack","hit","die"]);
const priority=Object.freeze({idle:0,walk:0,blocked:1,attackWindup:2,attack:3,hit:4,die:5});
const key=(kind,id)=>kind+":"+String(id);
export class C1D7ActorVisualController{
 constructor(){this.units=new Map();this.seen=new Map();this.accepted=0;}
 reset(){this.units.clear();this.seen.clear();this.accepted=0;}
 transition(kind,id,phase,now,duration){
  if(id===undefined||id===null)return;
  const k=key(kind,id),old=this.units.get(k);
  const expires=phase==="die"?Infinity:now+Math.max(0,duration);
  if(old&&old.until>now&&priority[old.phase]>priority[phase]&&phase!=="die")return;
  this.units.set(k,{kind,id,phase,since:now,until:expires});
 }
 accept(events,seconds){
  if(!Array.isArray(events)||!Number.isFinite(seconds))throw Error("Visual event stream invalid");
  for(const event of events){
   if(!event||typeof event.type!=="string")continue;
   const dedupe=event.eventId?String(event.eventId):null;
   if(dedupe&&this.seen.has(dedupe))continue;
   if(dedupe)this.seen.set(dedupe,seconds);
   this.accepted++;
   switch(event.type){
    case "soldier_attack_windup":
     this.transition("soldier",event.entityId,"attackWindup",seconds,event.windup??.29);break;
    case "soldier_attack_hit":
     this.transition("soldier",event.entityId,"attack",seconds,.36);break;
    case "enemy_attack_windup":
     this.transition("enemy",event.entityId,"attackWindup",seconds,event.windup??.25);break;
    case "soldier_hit":
     this.transition("enemy",event.sourceId,"attack",seconds,.33);
     this.transition("soldier",event.entityId,"hit",seconds,.21);break;
    case "hit_applied":
     this.transition("enemy",event.entityId,"hit",seconds,.21);break;
    case "soldier_die":
     this.transition("soldier",event.entityId,"die",seconds,Infinity);break;
    case "soldier_respawn":
     this.units.delete(key("soldier",event.entityId));break;
    case "entity_die":
     this.transition("enemy",event.entityId,"die",seconds,Infinity);break;
    case "entity_escape":
     this.units.delete(key("enemy",event.entityId));break;
    case "scene_reset":this.reset();break;
   }
  }
  // Bounded deduplication. Prevents unbounded Maps in 140-wave future campaigns.
  if(this.seen.size>4000)for(const [k,t] of this.seen)
   if(seconds-t>30)this.seen.delete(k);
 }
 sample(kind,id,seconds,base="idle"){
  const data=this.units.get(key(kind,id));
  if(!data)return {phase:base,since:seconds,elapsed:0,eventDriven:false};
  if(seconds>=data.until){
   this.units.delete(key(kind,id));
   return {phase:base,since:seconds,elapsed:0,eventDriven:false};
  }
  return {phase:data.phase,since:data.since,elapsed:Math.max(0,seconds-data.since),eventDriven:true};
 }
 frame(kind,id,seconds,base,meta){
  const visual=this.sample(kind,id,seconds,base);
  const cfg=meta?.[visual.phase]??meta?.idle??{frames:1,fps:1};
  const frames=cfg.frames??1,fps=cfg.fps??1,elapsed=visual.eventDriven?
   visual.elapsed:seconds;
  const frame=cfg.loop?Math.floor(elapsed*fps)%frames:
   Math.min(frames-1,Math.floor(elapsed*fps)%frames);
  return {state:visual.phase,frame,frameKey:visual.phase+"-"+frame,...visual};
 }
 diagnostics(){return Object.freeze({states:this.units.size,seen:this.seen.size,accepted:this.accepted});}
}
