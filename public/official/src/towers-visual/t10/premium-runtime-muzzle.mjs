/**
 * TORRES T10 PREMIUM — optical muzzle projected from the actual mounted Phaser Image.
 * Reads the exact approved T04 face center via T10 contract. VISUAL ONLY.
 * This complements the legacy metadata-only projector and never touches core originWorld.
 */
import {T10_SNIPER_MUZZLES,validateT10Muzzle,projectT10MuzzleWorld} from './sniper-muzzle-contract.mjs';
const finite=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y);
const val=(x,f)=>Number.isFinite(x)?x:f;
export function projectMountedT10Muzzle(sprite,meta){
 const source=validateT10Muzzle(meta);
 if(!finite(sprite))throw Error('T10 PREMIUM: mounted tower sprite position unavailable');
 const width=val(sprite.width,360),height=val(sprite.height,420);
 if(!(width>0&&height>0))throw Error('T10 PREMIUM: sprite frame dimensions invalid');
 const ox=val(sprite.displayOriginX,width*meta.footAnchor.x);
 const oy=val(sprite.displayOriginY,height*meta.footAnchor.y);
 const px=source.sourcePoint.x*width/360,py=source.sourcePoint.y*height/420;
 // Phaser Image flip mirrors the texture; its transform matrix does not include the UV flip.
 const localX=(sprite.flipX?width-px:px)-ox;
 const localY=(sprite.flipY?height-py:py)-oy;
 let world=null,method='root-affine';
 if(typeof sprite.getWorldTransformMatrix==='function'){
  const matrix=sprite.getWorldTransformMatrix();
  if(matrix&&typeof matrix.transformPoint==='function'){
   const p=matrix.transformPoint(localX,localY);
   if(finite(p)){world={x:p.x,y:p.y};method='phaser-world-matrix';}
  }
 }
 if(!world){
  if(sprite.parentContainer)throw Error('T10 PREMIUM: nested sprite requires Phaser world matrix');
  const sx=val(sprite.scaleX,NaN),sy=val(sprite.scaleY,NaN);
  const rotation=val(sprite.rotation,0);
  if(!Number.isFinite(sx)||!Number.isFinite(sy))throw Error('T10 PREMIUM: sprite scale unavailable');
  const dx=localX*sx,dy=localY*sy,c=Math.cos(rotation),s=Math.sin(rotation);
  world={x:sprite.x+dx*c-dy*s,y:sprite.y+dx*s+dy*c};
 }
 if(!finite(world))throw Error('T10 PREMIUM: world point unavailable');
 return Object.freeze({x:world.x,y:world.y});
}
/** Diagnostics expose real-origin/frame mismatch, not fictitious pixel-match approval. */
export function diagnoseMountedT10Muzzle(sprite,meta){
 const actual=projectMountedT10Muzzle(sprite,meta);
 const nominal=projectT10MuzzleWorld(sprite,meta);
 const face=T10_SNIPER_MUZZLES[meta.level].sourcePoint;
 return Object.freeze({actual,nominal,face:{x:face.x,y:face.y},
  displayOrigin:{x:val(sprite.displayOriginX,NaN),y:val(sprite.displayOriginY,NaN)},
  frame:{width:val(sprite.width,NaN),height:val(sprite.height,NaN)},
  flipX:!!sprite.flipX,flipY:!!sprite.flipY,
  scaleX:sprite.scaleX,scaleY:sprite.scaleY,rotation:val(sprite.rotation,0),
  parentContainer:!!sprite.parentContainer,
  discrepancyWorld:Math.hypot(actual.x-nominal.x,actual.y-nominal.y)});
}
