/** P08 isolated Phaser TextureManager loader; optional integrator import only.
 * Paths relative to /official/src/<entrypoint>/index.html, not module URL.
 * No creation of gameplay soldiers (level II has TWO only from core).
 */
import {P08_CLIPS,P08AnimationController} from './p08-controller.mjs';
export const P08_IMAGES=Object.freeze([
 Object.freeze({actorId:'infantry_recruit',level:1,atlasKey:'actors/allies/infantry-recruit/v1/p08',
  file:'../../art/actors/p08/png/infantry_recruit.png',worldHeight:88,footAnchor:{x:.5,y:.92},weaponSemantics:'short blade + round shield'}),
 Object.freeze({actorId:'infantry_veteran',level:2,atlasKey:'actors/allies/infantry-veteran/v1/p08',
  file:'../../art/actors/p08/png/infantry_veteran.png',worldHeight:88,footAnchor:{x:.5,y:.92},weaponSemantics:'ranked blade + reinforced shield'}),
 Object.freeze({actorId:'warrior',atlasKey:'actors/enemies/warrior/v1/p08-combat',
  file:'../../art/actors/p08/png/warrior.png',worldHeight:91,footAnchor:{x:.5,y:.92},weaponSemantics:'P03 original axe, melee-only VFX'}),
 Object.freeze({actorId:'hound',atlasKey:'actors/enemies/hound/v1/p08-combat',
  file:'../../art/actors/p08/png/hound.png',worldHeight:67,footAnchor:{x:.5,y:.92},weaponSemantics:'P03 original jaws/paws, melee-only VFX'})
]);
const COUNTS=Object.freeze({idle:4,walk:8,attackWindup:3,attack:5,hit:3,die:6,blocked:3});
export const P08_STATES=COUNTS;
export function preloadP08(scene){
 for(const art of P08_IMAGES)scene.load.image(art.atlasKey,art.file);
}
export function registerP08(scene){
 for(const art of P08_IMAGES){
  if(!scene.textures.exists(art.atlasKey))throw Error('P08 missing PNG '+art.atlasKey);
  const texture=scene.textures.get(art.atlasKey);
  if(texture.has('blocked-2'))continue;
  let n=0;
  for(const [state,total] of Object.entries(COUNTS))for(let i=0;i<total;i++,n++)
   texture.add(state+'-'+i,0,n%8*176,Math.floor(n/8)*208,176,208);
  if(n!==32)throw Error('P08 atlas contract '+art.actorId);
 }
 return P08_IMAGES;
}
export function p08VisualForSoldierLevel(level){
 if(!Number.isInteger(level)||!(level===1||level===2))
  throw Error('P08 current M01 supports infantry visual levels 1/2 only');
 return P08_IMAGES[level-1];
}
export function p08VisualForEnemy(type){
 if(!['warrior','hound'].includes(type))return null;
 return P08_IMAGES.find(x=>x.actorId===type);
}
export {P08_CLIPS,P08AnimationController};
