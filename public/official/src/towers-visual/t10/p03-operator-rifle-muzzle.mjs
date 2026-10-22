/**
 * TORRES T10 R1-HF2 · Real P03 operator's own rifle lip (not T04 facade muzzle).
 * Read-only mathematical projection of P03 rig: no edits to PERSONAJES assets.
 * Source p03-rig.mjs: rifle(c,[-17,-26],null,P.arm*.075)
 * rifle barrel ends at x=79 (upper highlight) in rifle's LOCAL coordinates.
 * Source affine stack: frameTranslate(88,208*.92), biped translate
 * (-reaction*.46,fall*53-bob+compress), biped rotate(-fall*1.05),
 * torso translate(0,-93), torso rotate(P.shoulder), rifle stock
 * translate(-17,-26), rotate(P.arm*.075), tip (79,-7).
 */
import {FRAME_WIDTH,FRAME_HEIGHT,ANIMATIONS} from '../../../art/actors/atlas-source.mjs';
import {getP03Pose,P03_VERSION} from '../../../art/actors/p03-rig.mjs';
const finite=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y);
const at=(p,x,y)=>({x:p.x+x,y:p.y+y});
const turn=(p,a)=>({x:p.x*Math.cos(a)-p.y*Math.sin(a),y:p.x*Math.sin(a)+p.y*Math.cos(a)});
export const T10_HF2_OPERATOR_MUZZLE_VERSION='t10-r1-hf2-p03-rig-rifle-geometry-v1';
export const P03_RIFLE_LIP_LOCAL=Object.freeze({x:79,y:-7});
export function getP03RifleMuzzleFramePoint(state,frame){
 const anim=ANIMATIONS[state];
 if(!anim||!Number.isInteger(frame)||frame<0||frame>=anim.frames)throw Error('Invalid P03 sniper state/frame');
 const pose=getP03Pose('sniper_operator',state,frame);
 let p=turn(P03_RIFLE_LIP_LOCAL,pose.arm*.075);
 p=at(p,-17,-26);
 p=turn(p,pose.shoulder);p=at(p,0,-93);
 p=turn(p,-pose.fall*1.05);p=at(p,-pose.reaction*.46,pose.fall*53-pose.bob+pose.compress);
 return Object.freeze({x:FRAME_WIDTH*.5+p.x,y:FRAME_HEIGHT*.92+p.y});
}
export function projectP03RifleMuzzle(operator,{state,frame}){
 if(!operator||!finite(operator)||!operator.frame?.name)throw Error('P03 operator sprite/frame missing');
 const frameName=String(operator.frame?.name??operator.texture.frame?.name??'');
 if(frameName!==state+'-'+frame)throw Error('Operator displayed frame mismatch: '+frameName+' != '+state+'-'+frame);
 const native=getP03RifleMuzzleFramePoint(state,frame);
 const width=operator.width,height=operator.height;
 if(!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0)throw Error('P03 operator texture dimensions unavailable');
 const density=width/FRAME_WIDTH;
 if(![1,2].some(d=>Math.abs(density-d)<1e-7)||Math.abs(height-FRAME_HEIGHT*density)>1e-7)
  throw Error('P03 operator texture dimensions changed unexpectedly; inspect rig before projection');
 // U04: source rig coords are unchanged, only the approved atlas texture raster is denser.
 const local={x:native.x*density,y:native.y*density};
 const originX=operator.displayOriginX,originY=operator.displayOriginY;
 if(!Number.isFinite(originX)||!Number.isFinite(originY))throw Error('Operator display origin unavailable');
 const x=(operator.flipX?width-local.x:local.x)-originX;
 const y=(operator.flipY?height-local.y:local.y)-originY;
 let out=null;
 const m=operator.getWorldTransformMatrix?.();
 if(m&&typeof m.transformPoint==='function')out=m.transformPoint(x,y);
 if(!finite(out)){
  if(operator.parentContainer)throw Error('Nested operator without real world transform');
  const sx=operator.scaleX,sy=operator.scaleY,theta=operator.rotation??0;
  if(!Number.isFinite(sx)||!Number.isFinite(sy))throw Error('Operator scale missing');
  const a=turn({x:x*sx,y:y*sy},theta);
  out=at(a,operator.x,operator.y);
 }
 if(!finite(out))throw Error('Invalid P03 rifle muzzle world projection');
 return Object.freeze({x:out.x,y:out.y});
}
/**
 * A/B/C independent diagnosis: T04 geometric face; P03 rig rifle;
 * R1 flash optical root. Returns source / world positions only,
 * CSS coordinates must be computed with the ACTUAL Phaser canvas and camera.
 */
export function diagnoseP03VersusT04Muzzles({operator,t04Muzzle,root,state,frame}){
 const p03=projectP03RifleMuzzle(operator,{state,frame});
 return Object.freeze({rig:P03_VERSION,state,frame,p03,t04:t04Muzzle,
  flash:root??null,distanceP03T04:Math.hypot(p03.x-t04Muzzle.x,p03.y-t04Muzzle.y),
  distanceP03Flash:root?Math.hypot(p03.x-root.x,p03.y-root.y):null});
}
