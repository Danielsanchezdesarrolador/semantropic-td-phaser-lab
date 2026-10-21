/** TORRES T10-B2 · geometry from original T04 composite sniper SVG.
 * SOURCE GEOMETRY ONLY: not verified on LIVE Chromium screenshot. No gameplay changes.
 */
import {projectSourceAnchor} from '../catalog.mjs';
export const T10_MUZZLE_VERSION='t10-b2-svg-face-v1';
const pt=(x,y)=>Object.freeze({x,y,units:'source-px'});
const frozen=(o)=>Object.freeze(o);
export const T10_SNIPER_MUZZLES=frozen({
 1:frozen({level:1,assetId:'towers/sniper/level-1',file:'public/official/art/towers/sniper/level-1.svg',
  blob:'52ec5b04b744a9583a9a07464a107c6b5f1cf293',group:'t04-sniper-i-functional',
  path:'M276 153l20-6 9 5-8 14-18 0Z',
  face:frozen({upper:pt(305,152),lower:pt(297,166)}),
  sourcePoint:pt(301,159),historical:pt(299,156),worldScale:.312,
  sourceSize:frozen({widthPx:360,heightPx:420}),footAnchor:frozen({x:.5,y:.93})}),
 2:frozen({level:2,assetId:'towers/sniper/level-2',file:'public/official/art/towers/sniper/level-2.svg',
  blob:'c1689a19e9467dd39c6c5af380d63b22176ead5d',group:'t04-sniper-ii-functional',
  path:'M287 143l21-6 14 9-13 13-23-2Z',
  face:frozen({upper:pt(322,146),lower:pt(309,159)}),
  sourcePoint:pt(315.5,152.5),historical:pt(307,149),worldScale:.319,
  sourceSize:frozen({widthPx:360,heightPx:420}),footAnchor:frozen({x:.5,y:.93})})
});
const near=(a,b)=>Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<1e-8;
const valid=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y);
export function validateT10Muzzle(meta){
 const r=T10_SNIPER_MUZZLES[meta?.level];
 if(!r||meta.assetId!==r.assetId||meta.family!=='sniper'||meta.level!==r.level)
  throw Error('T10-B2 only original T04 sniper I/II');
 if(meta.sourceSize?.widthPx!==360||meta.sourceSize?.heightPx!==420
  ||!near(meta.footAnchor?.x,.5)||!near(meta.footAnchor?.y,.93)
  ||!near(meta.worldScaleProposal,r.worldScale))
  throw Error('T10-B2 original SVG/foot/scale drift detected');
 if(!valid(meta.muzzleLocal)||!near(meta.muzzleLocal.x,r.historical.x)||!near(meta.muzzleLocal.y,r.historical.y))
  throw Error('T10-B2 legacy catalog muzzle drift detected');
 if(!near((r.face.upper.x+r.face.lower.x)/2,r.sourcePoint.x)
  ||!near((r.face.upper.y+r.face.lower.y)/2,r.sourcePoint.y))
  throw Error('T10-B2 face midpoint mismatch');
 return r;
}
/** C1-D8/B1 tower sprite: Phaser ROOT Image, no Container parent.
 * Uses projectSourceAnchor to handle actual sprite scale, flip, rotation and origin.
 */
export function projectT10MuzzleWorld(sprite,meta){
 const r=validateT10Muzzle(meta);
 if(!valid(sprite)||!Number.isFinite(sprite.scaleX)||!Number.isFinite(sprite.scaleY))
  throw Error('T10-B2 requires mounted tower sprite world coords and scale');
 const p=projectSourceAnchor(sprite,{...meta,muzzleLocal:r.sourcePoint},'muzzleLocal');
 if(!valid(p))throw Error('T10-B2 invalid muzzle projection');
 return frozen({x:p.x,y:p.y});
}
export function diagnoseT10Muzzle(sprite,meta){
 const r=validateT10Muzzle(meta);
 const proposed=projectT10MuzzleWorld(sprite,meta);
 const legacy=projectSourceAnchor(sprite,meta,'muzzleLocal');
 if(!valid(legacy))throw Error('T10-B2 legacy projection invalid');
 return {level:meta.level,sourceFaceCenter:r.sourcePoint,proposed,legacy,
  worldDelta:Math.hypot(proposed.x-legacy.x,proposed.y-legacy.y),
  sourceDelta:Math.hypot(r.sourcePoint.x-r.historical.x,r.sourcePoint.y-r.historical.y)};
}
