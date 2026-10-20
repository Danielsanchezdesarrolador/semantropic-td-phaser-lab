/** SEMANTROPIC TD P06: load ONLY the four persisted PNG RGBA atlases.
 * Source atlas keys and frames are ABI compatible with P04/P05.
 * Use during Phaser.Scene.preload(), register during Scene.create().
 * NO drawCanvas re-bake; NO new sprites or simulated core state here.
 */
export const P06_IMAGES=Object.freeze([
 {canonicalId:'warrior',atlasKey:'actors/enemies/warrior/v1/p06',
  file:'../../art/actors/p06/png/warrior.png',worldHeight:91},
 {canonicalId:'hound',atlasKey:'actors/enemies/hound/v1/p06',
  file:'../../art/actors/p06/png/hound.png',worldHeight:67},
 {canonicalId:'infantry_recruit',atlasKey:'actors/allies/infantry-recruit/v1/p06',
  file:'../../art/actors/p06/png/infantry_recruit.png',worldHeight:88},
 {canonicalId:'sniper_operator',variantId:'sniper_operator_unarmed',
  atlasKey:'actors/allies/sniper-operator/v1/p06-unarmed',
  file:'../../art/actors/p06/png/sniper_operator_unarmed.png',worldHeight:80,
  containsRifle:false,gunOwner:'T07',integrationAllowed:'pending-montage'}
]);
export const P06_STATES=Object.freeze({idle:4,walk:8,attackWindup:3,attack:5,hit:3,die:6,blocked:3});
const COLS=8,CW=176,CH=208;
export function preloadP06(scene){
 for(const item of P06_IMAGES)scene.load.image(item.atlasKey,item.file);
}
export function registerP06(scene){
 const out=[];
 for(const item of P06_IMAGES){
  if(!scene.textures.exists(item.atlasKey))
   throw Error('Missing P06 image: '+item.atlasKey+' ('+item.file+')');
  const tex=scene.textures.get(item.atlasKey);
  // Do not re-register on scene restarts when TextureManager is shared.
  if(tex.has('idle-0')){out.push(item);continue;}
  let n=0;
  for(const [state,frames] of Object.entries(P06_STATES))
   for(let i=0;i<frames;i++,n++)
    tex.add(state+'-'+i,0,(n%COLS)*CW,Math.floor(n/COLS)*CH,CW,CH);
  out.push(item);
 }
 return out;
}
export function p06ItemFor(actorId){
 const item=P06_IMAGES.find(x=>x.canonicalId===actorId);
 if(!item)throw Error('P06 unknown canonical actor: '+actorId);
 return item;
}
