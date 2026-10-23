/** Gameplay adapter of the frozen HF1 artwork; no repaint or new scenery. */
import {mountM04Artwork,makeM04ArtPlan,HF1_ART_VERSION} from './hf1/integrated-river.mjs';
import {projectMapSocket} from '../../core-c1d/map-sockets.mjs';
export function mountM04World(scene,map){
 const art=mountM04Artwork(scene,map),states=new Map();
 // Existing image is scenery: entities retain their usual world-Y depths above it.
 const image=scene.children.list.find(o=>o.texture?.key===art.textureKey);image.setDepth(-5000);
 return {version:HF1_ART_VERSION,textureKey:art.textureKey,qa:art.qa,
 plan:{...makeM04ArtPlan(map),sockets:map.spots.map((_,i)=>projectMapSocket(map,i)),route:map.path,canvasSize:{width:2560,height:1536}},
 setSocketVisualState(id,state){states.set(id,state);return true;},applyVisualSnapshot:()=>true,projectEvent:()=>false,
 update:()=>{},get snapshot(){return {mapId:4,states:[...states],ambientObjects:0};},destroy:()=>art.destroy()};
}
