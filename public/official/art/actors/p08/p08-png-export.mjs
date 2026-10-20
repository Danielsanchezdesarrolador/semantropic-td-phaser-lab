/**
 * P08 new genuine PNG RGBA atlas exporter, P03 visual source guaranteed.
 * P07 pipeline remains in project; ONLY new P08 variants use this exporter.
 * Each render fully clears transparent RGB and checks frames.
 */
import {ANIMATIONS,FRAME_WIDTH,FRAME_HEIGHT,ATLAS_COLUMNS} from '../atlas-source.mjs';
import {createP07RasterCanvas} from '../p07-raster-canvas.mjs';
import {encodeP06Png} from '../p06-png-generator.mjs';
import {sha256P06} from '../p06-hash.mjs';
import {P08_ACTORS,paintP08Frame} from './p08-visual-rig.mjs';
export const P08_FRAME=Object.freeze({width:176,height:208,columns:8,rows:4,count:32,atlasWidth:1408,atlasHeight:832});
export const P08_KEYS=Object.freeze({
 infantry_recruit:'actors/allies/infantry-recruit/v1/p08',
 infantry_veteran:'actors/allies/infantry-veteran/v1/p08',
 warrior:'actors/enemies/warrior/v1/p08-combat',
 hound:'actors/enemies/hound/v1/p08-combat'
});
export function buildP08Atlas(actorId){
 if(!P08_ACTORS.includes(actorId))throw Error('P08 unknown actor: '+actorId);
 const {atlasWidth:width,atlasHeight:height}=P08_FRAME;
 const source=createP07RasterCanvas(width,height,{cellWidth:FRAME_WIDTH,cellHeight:FRAME_HEIGHT});
 let n=0,frameChecks=[],partial=0,transparentRGB=0;
 for(const [state,info] of Object.entries(ANIMATIONS))for(let frame=0;frame<info.frames;frame++,n++){
  const x=(n%ATLAS_COLUMNS)*FRAME_WIDTH,y=Math.floor(n/ATLAS_COLUMNS)*FRAME_HEIGHT;
  source.withCell(x,y,()=>{
   source.ctx.save();source.ctx.translate(x,y);
   paintP08Frame(source.ctx,actorId,state,frame);
   source.ctx.restore();
  });
  frameChecks.push({name:state+'-'+frame,ordinal:n,...source.inspectFrame(x,y)});
 }
 if(n!==32)throw Error('P08 ABI demands 32 frames');
 const rgba=source.canvas.data;
 for(let i=0;i<rgba.length;i+=4){
  if(rgba[i+3]===0){
   if(rgba[i]||rgba[i+1]||rgba[i+2])transparentRGB++;
   rgba[i]=0;rgba[i+1]=0;rgba[i+2]=0;
  }else if(rgba[i+3]<255)partial++;
 }
 if(frameChecks.some(x=>x.border!==0||x.visible===0))throw Error('P08 frame alpha edges/empty '+actorId);
 // Zero RGB for alpha 0 is HARD required; the count records the pre-cleanup debt.
 const png=encodeP06Png(source.canvas);
 return Object.freeze({
  actorId,atlasKey:P08_KEYS[actorId],png,sha256:sha256P06(png),
  rgbaSha256:sha256P06(rgba),rgbaBytes:rgba.length,
  width,height,frames:frameChecks,frameCount:n,partialPixels:partial,
  preCleanupTransparentRGBCount:transparentRGB,postCleanupTransparentRGBCount:0,
  source:'P03 official rig + level-specific P08 equipment and combat-only effects'
 });
}
