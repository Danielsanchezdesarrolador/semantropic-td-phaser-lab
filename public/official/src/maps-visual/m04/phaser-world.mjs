/** Art-only M04 adapter. Historical HF1 remains available in its own module. */
import{mountRiverArt,M04_ART_VERSION,makeM04ArtPlan,M04_SCENIC}from'./cartoon01/river-world.mjs';
import{projectMapSocket}from'../../core-c1d/map-sockets.mjs';
export{M04_ART_VERSION,makeM04ArtPlan};
export function mountM04World(scene,map){
 const art=mountRiverArt(scene,map),states=new Map();
 return{version:M04_ART_VERSION,textureKey:M04_SCENIC,qa:art.metadata,metadata:art.metadata,
 plan:{...art.plan,sockets:map.spots.map((_,i)=>projectMapSocket(map,i)),route:map.path,canvasSize:{width:2560,height:1536}},paintPanoramaGutters:art.paintGutters,
 setSocketVisualState(id,state){states.set(id,state);return true;},applyVisualSnapshot:()=>true,projectEvent:()=>false,
 update:()=>{},get snapshot(){return{mapId:4,states:[...states],ambientObjects:0};},destroy:()=>art.destroy()};
}
