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
export function isolateP03Atlas(atlas,actorId='sniper_operator'){
 if(actorId!=='sniper_operator')throw Error('U03 must only re-pack approved sniper frames');
 if(!atlas?.canvas||!atlas?.frames||!atlas?.atlasKey)throw Error('Missing original P03 atlas');
 if(typeof document==='undefined'||!document.createElement)throw Error('U03 requires browser Canvas2D');
 const sheet=document.createElement('canvas');
 sheet.width=atlas.canvas.width;sheet.height=atlas.canvas.height;
 const ctx=sheet.getContext('2d',{alpha:true});
 const cell=document.createElement('canvas');
 cell.width=FRAME_WIDTH;cell.height=FRAME_HEIGHT;
 const brush=cell.getContext('2d',{alpha:true});
 if(!ctx||!brush)throw Error('U03 Canvas2D unavailable');
 let painted=0;
 for(const [state,frames] of Object.entries(atlas.frames)){
  for(let frame=0;frame<frames.length;frame++){
   const spec=frames[frame];
   if(spec.w!==FRAME_WIDTH||spec.h!==FRAME_HEIGHT)throw Error('U03 frame geometry mismatch');
   brush.clearRect(0,0,FRAME_WIDTH,FRAME_HEIGHT);
   paintP03Frame(brush,actorId,state,frame);
   ctx.drawImage(cell,spec.x,spec.y);
   painted++;
  }
 }
 return {...atlas,canvas:sheet,isolatedFrameCount:painted,isolationVersion:U03_P03_ATLAS_ISOLATION};
}
