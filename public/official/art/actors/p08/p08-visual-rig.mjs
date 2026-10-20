/**
 * SEMANTROPIC TD / Equipo P / P08.
 * C1-C APPROVED P03 poses and outlines always painted first.
 * Only soldiers receive incremental armored silhouettes; enemies retain identical
 * P03 idle/walk/hit/die, with combat anticipation/impact accents only.
 * No damage, gameplay entity spawning, target changes or core imports.
 */
import {paintP03Frame,getP03Pose} from '../p07-p03-continuity-rig.mjs';
import {ANIMATIONS} from '../atlas-source.mjs';
export const P08_ACTORS=Object.freeze(['infantry_recruit','infantry_veteran','warrior','hound']);
export const P08_STATES=Object.freeze(Object.fromEntries(Object.entries(ANIMATIONS).map(([key,v])=>[key,v.frames])));
const FILL={
 navy:'#344c60',deep:'#233a47',silver:'#becbd0',pale:'#e8d9b1',blue:'#527f96',
 accent:'#e1c68b',bronze:'#a48d65',leather:'#59626b',steel:'#708894',sky:'#c4eff1'
};
function polygon(c,points,color,outline=FILL.deep,w=2.5){
 c.beginPath();c.moveTo(points[0][0],points[0][1]);
 for(let i=1;i<points.length;i++)c.lineTo(points[i][0],points[i][1]);
 c.closePath();c.fillStyle=color;c.fill();
 if(w){c.lineWidth=w;c.strokeStyle=outline;c.stroke();}
}
function oval(c,x,y,rx,ry,fill,outline=FILL.deep,w=2){
 c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=fill;c.fill();
 if(w){c.lineWidth=w;c.strokeStyle=outline;c.stroke();}
}
function path(c,points,color,width=2){
 c.beginPath();c.moveTo(points[0][0],points[0][1]);
 for(let i=1;i<points.length;i++)c.lineTo(points[i][0],points[i][1]);
 c.strokeStyle=color;c.lineWidth=width;c.stroke();
}
function combatGlow(c,points,level=1){
 c.save();c.globalAlpha=.8;c.lineCap='round';
 path(c,points,'#244954',6.2);
 path(c,points,level===2?'#f3dd9b':'#d0f0e1',3.5);
 c.restore();
}
// Extra armor is distinctly SHAPED, not a recolor. Shares original P03 gait.
// No extra actor gets drawn for level II: a single atlas instance per core soldier.
function soldierEquipment(c,pose,veteran){
 c.save();c.translate(88,191);
 // Guards visually follow the alternating P03 leg/weight gesture.
 for(const sign of [-1,1]){
  const px=sign*(veteran?17:16)+sign*pose.stride*.47;
  polygon(c,[[px-9,-40],[px+8,-39],[px+11,-18],[px-7,-16]],
   veteran?FILL.steel:FILL.leather,FILL.deep,veteran?2.8:2);
  oval(c,px,-20,7.4,4.5,veteran?FILL.pale:'#819a9f',FILL.deep,1.2);
 }
 c.translate(0,-93);c.rotate(pose.shoulder);
 // Core breastplate/armor with original P03 shoulder proportions.
 polygon(c,[[-26,-12],[-5,-19],[23,-13],[27,11],[13,29],[-19,23]],
  veteran?'#657c8a':'#54899d',FILL.deep,3.4);
 polygon(c,[[-14,-9],[9,-14],[16,5],[4,21],[-14,11]],
  veteran?'#bcc8c5':'#bbd3d1','#47626c',2);
 polygon(c,[[-5,21],[12,18],[4,32],[-10,28]],veteran?FILL.bronze:'#89a99e',FILL.deep,1.9);
 // Shoulders are visibly upgraded in tier II, creating a wider armor profile.
 const shoulderW=veteran?21:15,shoulderX=veteran?32:26;
 for(const sign of [-1,1]){
  const x=sign*shoulderX;
  polygon(c,[[x-sign*shoulderW,-22],[x+sign*6,-26],[x+sign*9,-9],
   [x+sign*(veteran?12:8),4],[x-sign*shoulderW,0]],
   veteran?'#8ea2ab':'#789ca6',FILL.deep,veteran?3.5:2.7);
  if(veteran)path(c,[[x-sign*13,-20],[x+sign*4,-13],[x+sign*10,-8]],FILL.pale,2.5);
 }
 // Forearm/fist guard follows P03 arm swing, but does not replace anatomy.
 const handX=39+pose.arm*12,handY=-28-pose.arm*24;
 polygon(c,[[handX-6,handY-5],[handX+5,handY-8],[handX+11,handY+2],
  [handX+2,handY+10]],veteran?FILL.steel:'#8ca9ad',FILL.deep,2);
 // Shield rank geometry, independent of weapon.
 const shieldX=-37+pose.shieldArm,shieldY=-32-pose.wind*5;
 if(veteran){
  polygon(c,[[shieldX-15,shieldY-24],[shieldX+14,shieldY-23],
   [shieldX+20,shieldY+7],[shieldX,shieldY+32],[shieldX-20,shieldY+5]],
   '#617c8a',FILL.deep,3.6);
  polygon(c,[[shieldX-9,shieldY-17],[shieldX+8,shieldY-15],[shieldX+11,shieldY+5],
   [shieldX,shieldY+18],[shieldX-10,shieldY+4]],'#b0c4c5',FILL.deep,1.4);
  path(c,[[shieldX-10,shieldY-4],[shieldX+9,shieldY-4]],FILL.pale,4.2);
 }else{
  oval(c,shieldX,shieldY+3,17,22,'#60828c',FILL.deep,3);
  path(c,[[shieldX,shieldY-10],[shieldX,shieldY+17]],'#e1d8b5',3.5);
 }
 // Original P03 helmet kept; veteran upgrades its readable outline.
 polygon(c,[[-24,-28],[-26,-44],[-15,-61],[4,-67],[20,-58],[27,-42],[25,-28]],
  veteran?'#758b94':'#8799a0',FILL.deep,3.2);
 polygon(c,[[-22,-39],[2,-46],[27,-35],[23,-28],[-23,-30]],
  veteran?'#384b5a':'#617b82',FILL.deep,2.2);
 if(veteran){
  polygon(c,[[-6,-67],[-2,-78],[8,-79],[11,-65]],FILL.pale,FILL.deep,2.5);
  path(c,[[-16,-41],[18,-42]],'#e6c990',4.6);
  polygon(c,[[-12,-55],[13,-59],[18,-46],[-13,-44]],'#526875','#2d424e',2);
  path(c,[[-9,-52],[9,-54]],'#d0e5de',2.6);
  // Upgraded cuirass rank only, no extra sprite spawned.
  polygon(c,[[-1,-9],[10,0],[0,13],[-11,0]],FILL.accent,FILL.deep,2);
 }else{
  oval(c,2,3,5.5,5.5,'#d7d7aa',FILL.deep,1.4);
 }
 c.restore();
}
// Attacks add clear silhouette arcs but NEVER create a gameplay hit.
function accent(c,id,state,frame){
 if(state!=='attack'&&state!=='attackWindup')return;
 const attack=state==='attack',n=frame;
 c.save();c.translate(88,191);
 if(id==='warrior'){
  if(attack&&n>=1&&n<=3){
   c.globalAlpha=n===2?.95:.5;
   combatGlow(c,[[35,-149],[51,-136],[65,-114],[63,-91]],1);
  }else if(!attack&&n===2){
   c.globalAlpha=.52;path(c,[[39,-145],[53,-140]],'#e8d4a9',4);
  }
 }else if(id==='hound'){
  if(attack&&n>=1&&n<=3){
   c.globalAlpha=n===2?.94:.55;
   combatGlow(c,[[54,-77],[66,-65],[76,-51]],1);
   path(c,[[43,-14],[56,-19],[64,-15]],'#f1ddb9',3);
  }else if(!attack&&n===2){
   path(c,[[45,-28],[59,-30]],'#eddeb4',3.5);
  }
 }else{
  const veteran=id==='infantry_veteran';
  if(attack&&n>=1&&n<=3){
   c.globalAlpha=n===2?.90:.55;
   const dx=veteran?10:0;
   combatGlow(c,[[39+dx,-149],[53+dx,-132],[64+dx,-112],[62+dx,-93]],veteran?2:1);
  }else if(!attack&&n===2){
   c.globalAlpha=.65;path(c,[[43,-133],[57,-139]],veteran?'#e8ce8c':'#a9d0d5',3);
  }
 }
 c.restore();
}
export function paintP08Frame(c,actorId,state,frame){
 if(!P08_ACTORS.includes(actorId))throw Error('P08 unknown actor '+actorId);
 const base=actorId==='infantry_veteran'?'infantry_recruit':actorId;
 const pose=getP03Pose(base,state,frame);
 paintP03Frame(c,base,state,frame);
 if(actorId==='infantry_recruit'||actorId==='infantry_veteran')
  soldierEquipment(c,pose,actorId==='infantry_veteran');
 accent(c,actorId,state,frame);
}
