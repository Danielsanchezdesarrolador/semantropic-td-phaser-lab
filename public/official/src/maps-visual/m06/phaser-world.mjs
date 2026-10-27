/** Campaign socket adapter. Approved M06 surfaces and composition are untouched. */
import{mountM06Artwork,makeM06ArtPlan,M06_ART_VERSION}from'./cartoon01/canyon-world.mjs';
import{projectMapSocket}from'../../core-c1d/map-sockets.mjs';
export{makeM06ArtPlan,M06_ART_VERSION};
export function mountM06World(scene,map){
 const art=mountM06Artwork(scene,map),states=new Map();
 return{version:M06_ART_VERSION,qa:art.metadata,metadata:art.metadata,
 plan:{...art.plan,sockets:map.spots.map((_,i)=>projectMapSocket(map,i)),route:map.path,canvasSize:{width:2560,height:1536}},
 paintPanoramaGutters:art.paintMargins,setSocketVisualState(id,state){states.set(id,state);return true;},applyVisualSnapshot:()=>true,projectEvent:()=>false,update:()=>{},
 get snapshot(){return{mapId:6,states:[...states],ambientObjects:0};},destroy:()=>art.destroy()};
}
