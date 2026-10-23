import {makeM03ArtCanvas,M03_ART_VERSION} from './forest-art.mjs';
export const M03_TEXTURE='maps/m03/whispering-forest/v1';
export const M03_SCENIC='maps/m03/whispering-forest/scenic/v1';
export function mountM03World(scene,map){
 const terrainImage=scene.textures.get('m03-original-terrain').getSourceImage();
 const art=makeM03ArtCanvas(map,scene.textures.get('m03-original-props').getSourceImage(),{terrainImage});
 const scenic=makeM03ArtCanvas(map,scene.textures.get('m03-original-props').getSourceImage(),{density:1,scenic:true,terrainImage});
 scene.textures.addCanvas(M03_TEXTURE,art.canvas);scene.textures.addCanvas(M03_SCENIC,scenic.canvas);
 const objects=[scene.add.image(0,0,M03_TEXTURE).setOrigin(0).setDisplaySize(1280,768).setDepth(-5000)],states=new Map();
 const rings=art.plan.sockets.map(p=>{states.set(p.socketId,'empty');const ring=scene.add.ellipse(p.world.x,p.world.y-3,82,55).setStrokeStyle(3,0xffe6a2).setDepth(-114).setVisible(false);objects.push(ring);return {id:p.socketId,ring};});
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const motes=Array.from({length:reduced.matches?0:12},(_,i)=>{const o=scene.add.circle(170+i*83,140+(i%3)*25,1.5,0xb8fff0,.5).setDepth(-100);objects.push(o);return {o,i};});
 const ripples=Array.from({length:reduced.matches?0:5},(_,i)=>{const o=scene.add.ellipse(135+i*225,731+(i%2)*15,26,3).setStrokeStyle(1,0xb8eee1,.45).setDepth(-100);objects.push(o);return {o,i};});
 let lastSeconds=0,disposed=false;
 return {version:M03_ART_VERSION,plan:{...art.plan,route:map.path,canvasSize:{width:2560,height:1536}},
  setSocketVisualState(id,state){if(!states.has(id))return false;if(state!=='selected')states.set(id,state);rings.find(r=>r.id===id)?.ring.setVisible(state==='selected');return true;},
  applyVisualSnapshot:()=>true,projectEvent:()=>false,
  update(seconds){if(disposed||seconds===lastSeconds)return;lastSeconds=seconds;for(const {o,i} of motes){o.setVisible(!reduced.matches);o.y=150+(i%3)*25+Math.sin(seconds*.35+i)*8;o.alpha=.25+Math.sin(seconds*.8+i)*.16;}for(const {o,i} of ripples){o.setVisible(!reduced.matches);o.x=135+i*225+Math.sin(seconds*.4+i)*8;o.alpha=.23+Math.sin(seconds+i)*.16;}},
  get snapshot(){return {mapId:3,states:[...states],ambientObjects:motes.length+ripples.length,ambientSeconds:lastSeconds,reducedMotion:reduced.matches};},
  destroy(){disposed=true;objects.forEach(o=>o.destroy());scene.textures.remove(M03_TEXTURE);scene.textures.remove(M03_SCENIC);}
 };
}
