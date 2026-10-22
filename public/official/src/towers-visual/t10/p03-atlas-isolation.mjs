/**
 * U03 · Isolate only the P03 sniper atlas by drawing every frame into its OWN
 * strictly clipped canvas before packing it. Source P03 rig stays byte-identical.
 *
 * Why: historical createP03Atlas draws tall helmet/visor pixels outside a frame
 * cell with no clip. Later rows can overpaint the lower part of earlier rows,
 * producing cyan visor-shaped "goggles" by the operator's BOOTS.
 * Drawing in independent cell canvases removes cross-cell contamination while
 * preserving each approved P03 frame, animation and underlying sprite pose.
 */
import {FRAME_WIDTH,FRAME_HEIGHT} from '../../../art/actors/atlas-source.mjs';
import {paintP03Frame} from '../../../art/actors/p03-rig.mjs';
export const U03_P03_ATLAS_ISOLATION='u03-isolate-sniper-frames-v1';
export function isolateP03Atlas(atlas,actorId='sniper_operator',{density=1}={}){
 if(actorId!=='sniper_operator')throw Error('U03 must only re-pack approved sniper frames');
 if(![1,2].includes(density))throw Error('U04 accepts only 1x/2x sniper source density');
 if(!atlas?.canvas||!atlas?.frames||!atlas?.atlasKey)throw Error('Missing original P03 atlas');
 if(typeof document==='undefined'||!document.createElement)throw Error('U03 requires browser Canvas2D');
 const sheet=document.createElement('canvas');
 sheet.width=atlas.canvas.width*density;sheet.height=atlas.canvas.height*density;
 const ctx=sheet.getContext('2d',{alpha:true});
 const cell=document.createElement('canvas');
 cell.width=FRAME_WIDTH*density;cell.height=FRAME_HEIGHT*density;
 const brush=cell.getContext('2d',{alpha:true});
 if(!ctx||!brush)throw Error('U03 Canvas2D unavailable');
 let painted=0;const frames={};
 for(const [state,sourceFrames] of Object.entries(atlas.frames)){
  frames[state]=[];
  for(let frame=0;frame<sourceFrames.length;frame++){
   const spec=sourceFrames[frame];
   if(spec.w!==FRAME_WIDTH||spec.h!==FRAME_HEIGHT)throw Error('U03 frame geometry mismatch');
   brush.setTransform(1,0,0,1,0,0);
   brush.clearRect(0,0,cell.width,cell.height);
   brush.setTransform(density,0,0,density,0,0);
   paintP03Frame(brush,actorId,state,frame);
   ctx.drawImage(cell,spec.x*density,spec.y*density);
   frames[state].push({...spec,x:spec.x*density,y:spec.y*density,w:spec.w*density,h:spec.h*density});
   painted++;
  }
 }
 return {...atlas,canvas:sheet,frames,frameWidth:FRAME_WIDTH*density,frameHeight:FRAME_HEIGHT*density,
  u04Density:density,isolatedFrameCount:painted,isolationVersion:U03_P03_ATLAS_ISOLATION};
}
