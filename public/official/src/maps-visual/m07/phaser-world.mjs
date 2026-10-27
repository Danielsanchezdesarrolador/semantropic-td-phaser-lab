/** Campaign socket adapter. Approved M07 surfaces and composition are untouched. */
import{mountM07Artwork,makeM07ArtPlan,M07_ART_VERSION}from'./cartoon01/frost-world.mjs';
import{projectMapSocket}from'../../core-c1d/map-sockets.mjs';
export{makeM07ArtPlan,M07_ART_VERSION};
export function mountM07World(scene,map){
 const art=mountM07Artwork(scene,map),states=new Map();
 return{version:M07_ART_VERSION,qa:art.metadata,metadata:art.metadata,
 plan:{...art.plan,sockets:map.spots.map((_,i)=>projectMapSocket(map,i)),route:map.path,canvasSize:{width:2560,height:1536}},
 paintPanoramaGutters(c,r){c.fillStyle='#b4d9ed';c.fillRect(0,0,r.canvasWidth,r.canvasHeight);},setSocketVisualState(id,state){states.set(id,state);return true;},applyVisualSnapshot:()=>true,projectEvent:()=>false,update:()=>{},
 get snapshot(){return{mapId:7,states:[...states],ambientObjects:0};},destroy:()=>art.destroy()};
}
