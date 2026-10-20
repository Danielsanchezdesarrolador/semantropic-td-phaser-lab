/**
 * SEMANTROPIC TD P-05 / C1-D2 / ART-ONLY REACTIVITY.
 * Pure deterministic state machine; no Phaser, no DOM, no gameplay mutation.
 * The *integrator* forwards actual core event envelopes to dispatch(event).
 * All event names here are candidates until central bridge is certified.
 */
import {P04_STATE_FRAMES,P04_FPS,P04_META,P04_CANON} from './p04-poses.mjs';
export const P05_VERSION='p05-reactivity-v1';
export const P05_EVENT_NAMES=Object.freeze([
 'spawn','move_state','attack_windup','attack_fire','hit_applied','blocked',
 'status_applied','status_removed','entity_die','entity_escape','despawn',
 'game_paused','game_resumed','scene_reset'
]);
export const P05_STATES=Object.freeze({
 idle:{atlasState:'idle',loop:true},walk:{atlasState:'walk',loop:true},
 attackWindup:{atlasState:'attackWindup',loop:false},
 attack:{atlasState:'attack',loop:false},
 hit:{atlasState:'hit',loop:false},
 blocked:{atlasState:'blocked',loop:false},
 die:{atlasState:'die',loop:false,terminal:true},
 escape:{atlasState:'walk',loop:false,terminal:true,fade:true},
});
const terminalStates=new Set(['die','escape']);
const ATLAS_STATES=P04_STATE_FRAMES;
const byId=new Map(P04_META.map(a=>[a.id,a]));
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
export function getP05AnimationMetadata(actorId){
 if(!byId.has(actorId))throw Error('P05 invalid actorId: '+actorId);
 const fps=P04_FPS[actorId];
 return Object.freeze(Object.fromEntries(Object.entries(P05_STATES).map(([state,cfg])=>{
  const frames=ATLAS_STATES[cfg.atlasState],rate=fps[cfg.atlasState];
  const durationMs=state==='escape'?300:frames/rate*1000;
  return [state,Object.freeze({state,atlasState:cfg.atlasState,frames, fps:rate,
   durationMs,loop:cfg.loop,terminal:Boolean(cfg.terminal),
   fallback:state==='escape'?'walk':'idle'})];
 })));
}
/**
 * Options are direct visual callbacks, NOT core mutation hooks:
 * onVisualDone({entityId,terminalState}) may be used by integrator to release
 * view/sprite only. It MUST NEVER grant reward, remove health or decrement lives.
 */
export function createP05Reactivity({actorId,entityId,onVisualDone=()=>{},maxHistory=128}={}){
 if(!byId.has(actorId))throw Error('P05 unsupported actorId: '+actorId);
 if(typeof entityId!=='string'||!entityId.trim())throw Error('P05 entityId from core required');
 if(typeof onVisualDone!=='function')throw Error('P05 onVisualDone must be function');
 const defs=getP05AnimationMetadata(actorId);
 const seen=new Set(),fifo=[];
 let disposed=false,paused=false,terminal=null,complete=false;
 let state='idle',ageMs=0,phaseMs={idle:0,walk:0},facing='E',lastTick=-Infinity;
 let overlay={hpCurrent:null,hpMax:null,shieldCurrent:null,shieldMax:null};
 let eventCount=0;
 function setState(next,{keepPhase=false}={}){
  if(!defs[next])throw Error('Unknown visual state: '+next);
  if(state===next){
   if(next==='idle'||next==='walk')return false;
   if(keepPhase)return false;
  }
  if(state==='idle'||state==='walk')phaseMs[state]=ageMs;
  state=next;ageMs=keepPhase?(phaseMs[next]||0):0;return true;
 }
 function finishOnce(reason){
  if(complete)return;
  complete=true;onVisualDone(Object.freeze({entityId,actorId,terminalState:terminal,reason}));
 }
 function dispatch(e){
  if(disposed||!e||typeof e.type!=='string')return false;
  // Pause/resume/reset events may be session-level without entityId.
  const globalEvent=e.type==='game_paused'||e.type==='game_resumed'||e.type==='scene_reset';
  if(!globalEvent&&e.entityId!==entityId)return false;
  if(!P05_EVENT_NAMES.includes(e.type))return false;
  const key=e.eventId;
  if(typeof key==='string'&&key){
   if(seen.has(key))return false;
   seen.add(key);fifo.push(key);
   while(fifo.length>clamp(maxHistory,16,2048))seen.delete(fifo.shift());
  }
  if(e.type==='game_paused'){paused=true;return true}
  if(e.type==='game_resumed'){paused=false;return true}
  if(e.type==='scene_reset'){dispose();return true}
  if(e.type==='despawn'){dispose();return true}
  if(terminal)return false; // prevents die->escape, escape->die and late attack.
  if(Number.isFinite(e.tick)){lastTick=Math.max(lastTick,e.tick)}
  if(e.type==='spawn'){setState('idle');eventCount++;return true}
  if(e.type==='move_state'){
   const direction=e.payload?.facing;
   if(direction==='E'||direction==='W')facing=direction;
   const moving=e.payload?.moving===true||e.payload?.state==='walk';
   setState(moving?'walk':'idle');
   eventCount++;return true;
  }
  if(e.type==='attack_windup'){setState('attackWindup');eventCount++;return true}
  if(e.type==='attack_fire'){setState('attack');eventCount++;return true}
  if(e.type==='hit_applied'){setState('hit');eventCount++;return true}
  if(e.type==='blocked'){setState('blocked');eventCount++;return true}
  if(e.type==='status_applied'){
   if(e.payload?.status==='stun'||e.payload?.status==='blocked')setState('blocked');
   eventCount++;return true;
  }
  if(e.type==='status_removed'){setState('idle');eventCount++;return true}
  if(e.type==='entity_die'||e.type==='entity_escape'){
   terminal=e.type==='entity_die'?'die':'escape';setState(terminal);
   eventCount++;return true;
  }
  return false;
 }
 function advance(deltaMs){
  if(disposed||paused||complete)return snapshot();
  const dt=Number.isFinite(deltaMs)?clamp(deltaMs,0,2000):0;
  ageMs+=dt;
  const d=defs[state];
  if(!d.loop&&ageMs>=d.durationMs){
   ageMs=d.durationMs;
   if(terminal)finishOnce('visual-complete');
   else setState('idle');
  }
  return snapshot();
 }
 function snapshot(){
  const d=defs[state],progress=clamp(ageMs/d.durationMs,0,1);
  const step=d.loop?Math.floor(ageMs*d.fps/1000)%d.frames:
   Math.min(d.frames-1,Math.floor(ageMs*d.fps/1000));
  const hit=state==='hit',blocked=state==='blocked',fade=state==='escape',death=state==='die';
  const ease=t=>t*t*(3-2*t);
  // Visual alpha/tint only. Real HP/shield core owns.
  const opacity=fade?1-ease(progress):death?1-ease(Math.max(0,(progress-.65)/.35))*.7:1;
  const flash=hit?Math.sin(progress*Math.PI)*.20:blocked?Math.sin(progress*Math.PI)*.08:0;
  const recoil=hit?Math.sin(progress*Math.PI)*6:blocked?Math.sin(progress*Math.PI)*3:0;
  return Object.freeze({
   actorId,entityId,state,atlasState:d.atlasState,frame:d.atlasState+'-'+step,
   frameIndex:step,phase:progress,facing,opacity,shadowOpacity:opacity*.56,
   materialFlash:flash,visualRecoilPx:recoil,visualSquash:hit?1-.07*Math.sin(progress*Math.PI):1,
   eyeFocus:state==='attackWindup'||state==='attack',
   isPaused:paused,isTerminal:Boolean(terminal),isComplete:complete,isDisposed:disposed,
   worldHeight:byId.get(actorId).worldHeight,footAnchor:P04_CANON.footAnchor,
   shadowAnchor:P04_CANON.shadowAnchor,overlay:Object.freeze({...overlay}),
   eventCount,lastTick
  });
 }
 function setOverlayFromCore(values){
  if(disposed||terminal||!values||typeof values!=='object')return false;
  const next={...overlay};
  for(const k of Object.keys(next)){
   if(Object.hasOwn(values,k) && (values[k]===null||(Number.isFinite(values[k])&&values[k]>=0)))
    next[k]=values[k];
  }
  overlay=next;return true;
 }
 function dispose(){
  if(disposed)return false;
  disposed=true;seen.clear();fifo.length=0;
  if(terminal&&!complete)finishOnce('view-dispose');
  return true;
 }
 return Object.freeze({dispatch,advance,snapshot,setOverlayFromCore,dispose,metadata:defs});
}
