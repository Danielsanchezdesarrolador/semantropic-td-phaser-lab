/** SEMANTROPIC TD U04 · Approved P08 infantry PNG visibility enhancement.
 * This is NOT new source detail; it crisps moderate edge contrast and packs a
 * 2x presentation atlas without touching original actor PNG or core animation.
 * Only infantry_recruit and infantry_veteran, enemies never modified.
 */
const FRAME_W=176,FRAME_H=208,COLS=8,ROWS=4,DENSITY=2;
const states=Object.freeze({idle:4,walk:8,attackWindup:3,attack:5,hit:3,die:6,blocked:3});
export const U04_ALLY_HD_VERSION='u04-ally-p08-hd2-crisp-v1';
export function u04AllyTextureKey(key){return key+'/u04hd2';}
export function registerU04AllyHD(scene,items,{density=DENSITY}={}){
 if(density!==2)throw Error('U04 supports only 2x PNG presentation');
 const out=new Map();
 for(const art of items){
  if(!['infantry_recruit','infantry_veteran'].includes(art.actorId))continue;
  const hdKey=u04AllyTextureKey(art.atlasKey);
  if(scene.textures.exists(hdKey)){out.set(art.atlasKey,hdKey);continue;}
  const source=scene.textures.get(art.atlasKey)?.getSourceImage?.();
  if(!source||source.width!==FRAME_W*COLS||source.height!==FRAME_H*ROWS)
   throw Error('U04 P08 source PNG dimensions mismatch '+art.actorId);
  const canvas=document.createElement('canvas');
  canvas.width=source.width*density;canvas.height=source.height*density;
  const ctx=canvas.getContext('2d',{alpha:true});
  const cell=document.createElement('canvas');cell.width=FRAME_W;cell.height=FRAME_H;
  const cc=cell.getContext('2d',{willReadFrequently:true});
  const up=document.createElement('canvas');up.width=FRAME_W*density;up.height=FRAME_H*density;
  const uc=up.getContext('2d',{alpha:true});
  if(!ctx||!cc||!uc)throw Error('U04 Canvas2D unavailable');
  const count=Object.values(states).reduce((sum,n)=>sum+n,0);
  for(let i=0;i<count;i++){
   const sx=(i%COLS)*FRAME_W,sy=Math.floor(i/COLS)*FRAME_H;
   cc.clearRect(0,0,FRAME_W,FRAME_H);
   cc.drawImage(source,sx,sy,FRAME_W,FRAME_H,0,0,FRAME_W,FRAME_H);
   const picture=cc.getImageData(0,0,FRAME_W,FRAME_H),data=picture.data;
   const copy=new Uint8ClampedArray(data);
   // Conservative unsharp mask, opaque interiors only. Preserve transparency
   // and avoid edge halos/accidental body silhouette changes.
   for(let y=1;y<FRAME_H-1;y++)for(let x=1;x<FRAME_W-1;x++){
    const p=(y*FRAME_W+x)*4;
    if(copy[p+3]<200)continue;
    const offsets=[-4,4,-FRAME_W*4,FRAME_W*4];
    if(offsets.some(d=>copy[p+d+3]<190))continue;
    for(let channel=0;channel<3;channel++){
     const k=p+channel;
     const mean=(copy[k-4]+copy[k+4]+copy[k-FRAME_W*4]+copy[k+FRAME_W*4])/4;
     data[k]=Math.max(0,Math.min(255,copy[k]+.28*(copy[k]-mean)));
    }
   }
   cc.putImageData(picture,0,0);
   uc.clearRect(0,0,up.width,up.height);uc.imageSmoothingEnabled=true;uc.imageSmoothingQuality='high';
   uc.drawImage(cell,0,0,up.width,up.height);
   ctx.drawImage(up,sx*density,sy*density);
  }
  scene.textures.addCanvas(hdKey,canvas);
  const texture=scene.textures.get(hdKey);
  let index=0;
  for(const [state,frames] of Object.entries(states))for(let j=0;j<frames;j++,index++)
   texture.add(state+'-'+j,0,(index%COLS)*FRAME_W*density,
    Math.floor(index/COLS)*FRAME_H*density,FRAME_W*density,FRAME_H*density);
  out.set(art.atlasKey,hdKey);
 }
 return out;
}
