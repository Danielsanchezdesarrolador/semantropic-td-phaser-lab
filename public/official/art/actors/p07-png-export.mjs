/**
 * PERSONAJES P07 / C1-C approved visual continuity PNG builder.
 * Executes P03 historic actor painter verbatim (except missing duplicate sniper rifle)
 * over deterministic cell-isolated RGBA raster; PNG DEFLATE from P06 preserved.
 * No sprites from C1-C screenshot extracted or reconstructed.
 * Node users can compare this raster with real Chromium Canvas2D export.
 */
import {ANIMATIONS,FRAME_WIDTH,FRAME_HEIGHT,ATLAS_COLUMNS} from './atlas-source.mjs';
import {paintP03Frame,P03_ACTORS} from './p07-p03-continuity-rig.mjs';
import {createP07RasterCanvas} from './p07-raster-canvas.mjs';
import {encodeP06Png} from './p06-png-generator.mjs';
import {sha256P06} from './p06-hash.mjs';
const W=FRAME_WIDTH*ATLAS_COLUMNS,H=FRAME_HEIGHT*4;
export const P07_VERSION='P07-P03-C1C-CONTINUITY-v1';
export const P07_STATES=Object.freeze(Object.fromEntries(
 Object.entries(ANIMATIONS).map(([key,value])=>[key,value.frames])));
export const P07_ACTORS=Object.freeze(P03_ACTORS.map(x=>Object.freeze({
 actorId:x.actorId,atlasKey:x.atlasKey,
 heightWorld:x.heightWorld,footAnchor:{x:.5,y:.92},shadowAnchor:{x:.5,y:1},
 equippedWeapon:x.actorId==='sniper_operator'?false:undefined,
 source:'P03 historic vector rig, no weapon for sniper'
})));
export function buildP07Atlas(actorId){
 if(!P07_ACTORS.some(x=>x.actorId===actorId))throw Error('Unknown P07 actor '+actorId);
 const c=createP07RasterCanvas(W,H,{cellWidth:FRAME_WIDTH,cellHeight:FRAME_HEIGHT});
 const frames={};let n=0;
 for(const [state,animation] of Object.entries(ANIMATIONS)){
  frames[state]=[];
  for(let i=0;i<animation.frames;i++,n++){
   const x=n%ATLAS_COLUMNS*FRAME_WIDTH,y=Math.floor(n/ATLAS_COLUMNS)*FRAME_HEIGHT;
   c.withCell(x,y,()=>{
    c.ctx.save();c.ctx.translate(x,y);
    paintP03Frame(c.ctx,actorId,state,i);
    c.ctx.restore();
   });
   frames[state].push({name:state+'-'+i,x,y,w:FRAME_WIDTH,h:FRAME_HEIGHT,...c.inspectFrame(x,y)});
  }
 }
 if(n!==32)throw Error('P07 expected 32 frames, got '+n);
 const png=encodeP06Png(c.canvas),sha256=sha256P06(png);
 const rgbaSha256=sha256P06(c.canvas.data),rgbaBytes=c.canvas.data.byteLength;
 const borderFrames=Object.values(frames).flat().filter(x=>x.border>0);
 const emptyFrames=Object.values(frames).flat().filter(x=>x.visible===0);
 if(borderFrames.length||emptyFrames.length)throw Error('P07 alpha frame QA failed '+actorId);
 return Object.freeze({actorId,version:P07_VERSION,png,sha256,rgbaSha256,rgbaBytes,width:W,height:H,
  atlasKey:P07_ACTORS.find(x=>x.actorId===actorId).atlasKey,frames,
  frameCount:n,sourcePaint:'p07-p03-continuity-rig.mjs',rasterMethod:'P07 software Canvas-like fallback',
  sourceScreenshotSha256:'24103e45a0e1249fa4b89d4e65ea16d9e147bdf1e2462e5c4063469a931842ef'});
}
