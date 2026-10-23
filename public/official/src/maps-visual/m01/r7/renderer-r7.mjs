/**
 * SEMANTROPIC TD R7 Map 01 premium visual mount.
 * Adapts (never edits) M07 original protected art+pad state machine.
 * Game rules, route, targeting and soldiers remain unchanged.
 */
import {mountM01WorldV7} from '../m07/renderer-v7.mjs';
import {makeR7MapCanvas,makeR7ScenicPanoramaCanvas,R7_MAP01_ART_VERSION} from './dawn-plateau-art.mjs?layout=hf2';
export const R7_M01_TEXTURE='maps/m01/r7/dawn-plateau/v1';
export const R7_M01_SCENIC_TEXTURE='maps/m01/r7/dawn-plateau/scenic-gutters/hf2';
export function mountM01WorldR7(scene,map,options={}){
 const base=mountM01WorldV7(scene,map,options);
 let canvas=null,image=null,disposed=false;
 try{
  const art=makeR7MapCanvas(map,{density:2});
  if(!scene.textures.exists(R7_M01_TEXTURE))
   scene.textures.addCanvas(R7_M01_TEXTURE,art.canvas);
  canvas=art.canvas;
  // One-time 1x scenic plate for non-playable FIT lateral gutters.
  if(!scene.textures.exists(R7_M01_SCENIC_TEXTURE))
   scene.textures.addCanvas(R7_M01_SCENIC_TEXTURE,makeR7ScenicPanoramaCanvas(map));
  image=scene.add.image(0,0,R7_M01_TEXTURE)
   .setOrigin(0,0).setDisplaySize(1280,768).setDepth(-3600);
  // Replaced ART layers are archived in M07; no deletion of original source,
  // pad logic/state or registry. Only their visibility changes at runtime.
  for(const layer of ['terrain','path']){
   for(const obj of base.layerGroups[layer]||[])obj.setVisible(false);
  }
  for(const prop of base.propObjects||[]){
   prop.sprite?.setVisible(false);prop.shadow?.setVisible(false);
  }
  // R7 paint itself contains one elegant stone pad per REAL source pad.
  // Keep old selection ring / state machine functioning above premium art.
  for(const pad of base.padObjects){
   pad.sprite.setVisible(false);
   pad.shadow.setVisible(false);
  }
  const objects=[...base.objects,image];
  function preservePads(){
   // Never hide the selection indicator. Ruins require distinct footprint.
   for(const pad of base.padObjects){
    pad.sprite.setVisible(pad.visualState==='ruins');
    pad.shadow.setVisible(pad.visualState==='ruins');
   }
  }
  function setSocketVisualState(id,state){
   const ok=base.setSocketVisualState(id,state);
   if(ok)preservePads();
   return ok;
  }
  function applyVisualSnapshot(snap){
   const ok=base.applyVisualSnapshot(snap);
   if(ok)preservePads();
   return ok;
  }
  function projectEvent(evt){
   const result=base.projectEvent(evt);
   if(result?.consumed)preservePads();
   return result;
  }
  function resetVisuals(){const ok=base.resetVisuals();preservePads();return ok}
  function destroy(){
   if(disposed)return;disposed=true;
   image?.destroy();base.destroy();
   // Scene owns all its textures; no unwanted mutation of original M03 keys.
   if(scene.textures.exists(R7_M01_TEXTURE))scene.textures.remove(R7_M01_TEXTURE);
   if(scene.textures.exists(R7_M01_SCENIC_TEXTURE))
    scene.textures.remove(R7_M01_SCENIC_TEXTURE);
  }
  return Object.freeze({...base,
   artVersion:R7_MAP01_ART_VERSION,contractVersion:'map-visual-r7-m01-premium-v1',
   premiumArt:Object.freeze({version:R7_MAP01_ART_VERSION,
    width:canvas.width,height:canvas.height,
    geometricalPads:art.plan.pads.length,pathVertices:art.plan.path.length}),
   objects,paintObject:image,
   setSocketVisualState,applyVisualSnapshot,projectEvent,resetVisuals,destroy,
   getMapPerformanceInfo:()=>{
    const old=base.getMapPerformanceInfo();
    return {...old,premiumArtVersion:R7_MAP01_ART_VERSION,extraPixels:canvas.width*canvas.height,
     originalM07SourcesRetained:true,premiumBuildPadCount:art.plan.pads.length};
   }});
 }catch(err){
  image?.destroy();
  base.destroy();
  if(scene.textures.exists(R7_M01_TEXTURE))scene.textures.remove(R7_M01_TEXTURE);
  if(scene.textures.exists(R7_M01_SCENIC_TEXTURE))
   scene.textures.remove(R7_M01_SCENIC_TEXTURE);
  throw err;
 }
}
