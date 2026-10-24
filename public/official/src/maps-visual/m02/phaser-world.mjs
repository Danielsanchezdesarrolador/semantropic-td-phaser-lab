/** M02 WorldView: Cartoon03 modular surfaces and original rural sprites.
 * Canonical sockets/state API unchanged; art is prepared once per scene. */
import {mountCartoon02Art,CARTOON02_VERSION} from './cartoon03/farmland-world.mjs';
export const R3_M02_SCENE_ART='r3b2-m02-farmland-gameplay-v1';
export function mountM02World(scene,map){
 const art=mountCartoon02Art(scene,map);
 const objects=[];
 const sockets=map.spots.map((p,index)=>Object.freeze({
  socketId:'m02-pad-'+String(index+1).padStart(2,'0'),index,
  kind:p.kind,metadata:Object.freeze({kind:p.kind,role:p.role}),
  world:Object.freeze({x:p.cx*64+32,y:p.cy*64+32}),
  interactiveRadiusWorld:54}));
 const states=new Map(sockets.map(s=>[s.socketId,'empty']));
 const crowns=[];
 for(const pad of sockets){
  const ring=scene.add.circle(pad.world.x,pad.world.y-7,31,0x163b43,.02)
   .setStrokeStyle(2,0xe3d4af,.48).setDepth(-115);
  const select=scene.add.circle(pad.world.x,pad.world.y-7,41,0xffdf8a,0)
   .setStrokeStyle(3,0xffdf8a,.85).setDepth(-114).setVisible(false);
  objects.push(ring,select);crowns.push({pad,ring,select});
 }
 function setSocketVisualState(id,state){
  if(!states.has(id))return false;
  if(!['empty','occupied','selected','neutral','ruins','ruined'].includes(state))return false;
  const next=state==='ruined'?'ruins':state;
  if(next!=='selected')states.set(id,next);
  const x=crowns.find(c=>c.pad.socketId===id);
  if(x){
   x.select.setVisible(next==='selected');
   const occupied=states.get(id)==='occupied';
   x.ring.setStrokeStyle(occupied?2.7:2,occupied?0x66dacc:0xe3d4af,occupied?.74:.48);
  }
  return true;
 }
 return Object.freeze({version:R3_M02_SCENE_ART,artVersion:CARTOON02_VERSION,premiumArt:art.metadata,styleObjects:art.objects,landscapePlan:art.plan,
  paintPanoramaGutters:(ctx,r)=>art.paintGutters(ctx,r),plan:Object.freeze({sockets,route:art.plan.path,
  props:art.plan.landmarks,rejected:[],canvasSize:Object.freeze({width:2560,height:1536})}),
  setSocketVisualState,applyVisualSnapshot:()=>true,projectEvent:()=>false,
  get snapshot(){return {mapId:2,states:[...states.entries()]};},
  destroy(){for(const object of objects)object.destroy();art.destroy();}
 });
}
