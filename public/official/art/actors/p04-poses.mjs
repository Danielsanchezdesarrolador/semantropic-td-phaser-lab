/** SEMANTROPIC TD • P04 animation authoring.
 * Pure joint/key-pose math: no Phaser, no DOM, NO GAMEPLAY.
 * Logical core controls movement, blockers, damage and rewards.
 */
export const P04_STATE_FRAMES=Object.freeze({idle:4,walk:8,attackWindup:3,attack:5,hit:3,die:6,blocked:3});
export const P04_FPS=Object.freeze({
 warrior:Object.freeze({idle:5,walk:8.8,attackWindup:9,attack:12.5,hit:13,die:10,blocked:10}),
 hound:Object.freeze({idle:5,walk:12,attackWindup:10,attack:13,hit:13,die:10,blocked:10}),
 infantry_recruit:Object.freeze({idle:5,walk:9,attackWindup:9,attack:12,hit:12,die:9,blocked:9}),
 sniper_operator:Object.freeze({idle:5,walk:7.5,attackWindup:9,attack:11,hit:11,die:8,blocked:8})
});
export const P04_META=Object.freeze([
 Object.freeze({id:'warrior',key:'actors/enemies/warrior/v1/p04',worldHeight:91,role:'ground-melee',faceTop:154,muzzle:null}),
 Object.freeze({id:'hound',key:'actors/enemies/hound/v1/p04',worldHeight:67,role:'ground-quadruped',faceTop:87,muzzle:null}),
 Object.freeze({id:'infantry_recruit',key:'actors/allies/infantry-recruit/v1/p04',worldHeight:88,role:'ground-guard',faceTop:150,muzzle:null}),
 Object.freeze({id:'sniper_operator',key:'actors/allies/sniper-operator/v1/p04',worldHeight:80,role:'tower-operator',faceTop:146,muzzle:{x:79,y:-102}})
]);
export const P04_CANON=Object.freeze({
 frameWidth:176,frameHeight:208,columns:8,rows:4,totalFrames:32,
 footAnchor:Object.freeze({x:.5,y:.92}),shadowAnchor:Object.freeze({x:.5,y:1}),
 activeFacings:Object.freeze(['E','W-mirrored']),
 noActualCombat:true
});
const TWOPI=Math.PI*2;
const sm=t=>t*t*(3-2*t);
const mix=(a,b,t)=>a+(b-a)*t;
function cubic(a,b,c,d,t){const q=1-t;return a*q*q*q+3*b*q*q*t+3*c*q*t*t+d*t*t*t;}
function interpolate(points,t){
 const n=points.length-1,scaled=Math.max(0,Math.min(n,t*n)),k=Math.min(n-1,Math.floor(scaled));
 return mix(points[k],points[k+1],sm(scaled-k));
}
function gait(frame){
 // Eight clear keyposes: left strike, accept weight, passing, push-off,
 // right strike, weight accept, passing, push-off.
 const p=frame/8,step=Math.sin(TWOPI*p),lift=Math.max(0,-Math.cos(TWOPI*p));
 const op=Math.sin(TWOPI*(p+.5));
 return {
  leftX:step*14,leftY:-Math.max(0,lift*7),
  rightX:op*14,rightY:-Math.max(0,Math.max(0,Math.cos(TWOPI*p))*7),
  leftPlant:frame===0||frame===1||frame===7,
  rightPlant:frame===4||frame===5||frame===3,
  pelvicRock:Math.cos(TWOPI*p)*2.6,
  counterTorso:Math.sin(TWOPI*p)*.12
 };
}
function dogGait(frame){
 const phase=frame*TWOPI/8;
 // Actual diagonal pairs: left-front and right-back together,
 // right-front and left-back delayed HALF cycle, not 4 synchronized sticks.
 const labels=['frontNear','frontFar','hindNear','hindFar'],phases=[0,Math.PI,Math.PI,0];
 const paws={};
 for(let j=0;j<4;j++){
  const v=phase+phases[j],s=Math.sin(v);
  paws[labels[j]]={x:s*(j<2?13:11),y:-Math.max(0,Math.cos(v))*(j<2?10:8),
   onGround:Math.cos(v)<=0};
 }
 return {paws,spineCurve:Math.sin(phase)*2.7,bodyBounce:Math.cos(phase*2)*1.8,
  earLag:Math.sin(phase-.35)*6,tailLag:Math.sin(phase-1.1)*10,
  hipAngle:Math.cos(phase)*.045,shoulderAngle:Math.cos(phase+Math.PI)*.045};
}
export function describeP04Pose(actorId,state,frame){
 if(!P04_META.some(a=>a.id===actorId))throw new Error('P04 actor ID inválido: '+actorId);
 const n=P04_STATE_FRAMES[state];
 if(!n)throw new Error('P04 state inválido: '+state);
 if(!Number.isInteger(frame)||frame<0||frame>=n)throw new Error('P04 frame inválido');
 const q=n>1?frame/(n-1):0;
 const attack=[-.64,-.27,1.15,.48,0][frame]??0;
 const windup=[0,-.38,-.78][frame]??0;
 const shield=[-1.05,-.8,-.63][frame]??0;
 const stateK={
 idle:{breath:Math.sin((frame+.2)*TWOPI/4)*1.7+Math.cos((frame+.1)*TWOPI/4)*.55,
   blink:frame===3,chin:Math.sin(frame*TWOPI/4)*.018,torso:Math.cos(frame*TWOPI/4)*.025,
   arm:Math.sin(frame*TWOPI/4)*.045,compression:0,fall:0,attackPhase:0},
 walk:{breath:0,blink:false,chin:Math.sin(frame*TWOPI/8)*.045,torso:gait(frame).counterTorso,
   arm:Math.sin(frame*TWOPI/8)*.31,compression:Math.cos(frame*TWOPI/4)*2,fall:0,attackPhase:0},
 attackWindup:{breath:0,blink:false,chin:-.11*q,torso:-.15*q,
   arm:windup,compression:q*5,fall:0,attackPhase:0},
 attack:{breath:0,blink:false,chin:[-.1,-.02,.12,.05,0][frame],
   torso:[-.18,-.12,.29,.14,0][frame],arm:attack,
   compression:[4,6,2,3,0][frame],fall:0,attackPhase:frame},
 hit:{breath:0,blink:frame===1,chin:[-.11,.08,0][frame],torso:[-.18,.09,0][frame],
   arm:[-.28,.13,0][frame],compression:[7,4,0][frame],fall:0,attackPhase:0},
 blocked:{breath:0,blink:false,chin:[-.09,-.06,-.02][frame],
   torso:[-.12,-.20,-.13][frame],arm:shield,compression:[4,6,2][frame],fall:0,attackPhase:0},
 die:{breath:0,blink:frame>=4,chin:interpolate([-.04,-.35,-.70],q),
   torso:interpolate([0,-.33,-.84],q),arm:interpolate([0,-.42,-.95],q),
   compression:8*q,fall:sm(q),attackPhase:0}
 };
 const s=stateK[state];
 const walk=state==='walk'?gait(frame):null;
 const dog=state==='walk'?dogGait(frame):null;
 const grav=state==='die'?sm(q):0;
 const pose={
  actorId,state,frame,frames:n,normalized:q,...s,
  walk,quad:actorId==='hound'?dog:null,
  hipRoll:walk?walk.pelvicRock:0,
  bodyStretch:actorId==='hound'?
   (state==='walk'?1+Math.sin(frame*TWOPI/8)*.07:state==='attack'?1+(.08*Math.sin(q*Math.PI)):1):1,
  bodyHeight:actorId==='hound'&&dog?dog.bodyBounce:s.breath,
  headFocus:actorId==='hound'? state==='attack'?14*Math.sin(q*Math.PI):state==='hit'?-8:0:0,
  gaze:state==='attack'?1:0,
  footBase:Object.freeze({x:0,y:0}),fall:grav,
  // Exposure: weapon cues only. No damage or projectile dispatched by this model.
  weaponAngle:actorId==='warrior'?-0.25+s.arm*.72:
    actorId==='infantry_recruit'?-.13+s.arm*.75:
    actorId==='sniper_operator'?s.arm*.11:0,
  shadowScale:actorId==='hound'&&state==='attack'?1.08:1,
  predictedContactMarkers:state==='attack'?[2]:[],
  loop:state==='idle'||state==='walk',
  fps:P04_FPS[actorId][state],
 };
 return Object.freeze(pose);
}
export function allP04KeyPoses(actorId){
 const poses=[];
 for(const [state,n] of Object.entries(P04_STATE_FRAMES)){
  for(let f=0;f<n;f++)poses.push(describeP04Pose(actorId,state,f));
 }
 return poses;
}
