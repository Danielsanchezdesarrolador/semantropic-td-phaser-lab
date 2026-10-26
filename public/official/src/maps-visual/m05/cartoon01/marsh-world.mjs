/** M05 art only. This module has no combat, economy, waves or selector adapter. */
import{marshAssets}from'./assets.mjs';
import{ROOT_ANCHORS}from'./composition-cartoon02.mjs';
import{makeMarshSurfaces,channels,propClears}from'./surfaces.mjs';
import{ROAD_WIDTH,paintGeometricRoad}from'./road-geometry.mjs';
export const M05_ART_VERSION='m05-hf-cartoon02-clean-wetland-art-v1';
export function makeM05ArtPlan(map){
 if(map?.id!==5||map.path?.length!==307||map.spots?.length!==9||map.branches?.length)throw Error('M05 canonical art contract');
 return{mapId:5,version:M05_ART_VERSION,path:map.path.map(p=>[...p]),pads:map.spots.map((p,index)=>({id:'m05-pad-'+String(index+1).padStart(2,'0'),index,x:p.cx*64+32,y:p.cy*64+32})),channels:channels(map).map(p=>p.map(v=>[...v])),artOnly:true,gameplayImplemented:false};
}
export function mountM05Artwork(scene,map){
 const plan={...makeM05ArtPlan(map),props:[],rejected:[],roadWidth:ROAD_WIDTH},a=marshAssets(),art=makeMarshSurfaces(plan,a),objects=[],keys=[],prefix='maps/m05/cartoon01/';
 const add=(key,image)=>{if(scene.textures.exists(key))scene.textures.remove(key);scene.textures.addCanvas(key,image);keys.push(key);};
 for(const[name,depth]of[['water',-5000],['shadow',-4990],['relief',-4980],['ground',-4970],['cascade',-4960],['route',-4900]]){add(prefix+name,art.layers[name]);objects.push(scene.add.image(0,0,prefix+name).setOrigin(0).setScale(.5).setDepth(depth));}
 for(const b of art.bridges){add(prefix+'bridge'+b.id,b.image);objects.push(scene.add.image(b.bounds.x,b.bounds.y,prefix+'bridge'+b.id).setOrigin(0).setScale(.5).setDepth(-4800));}
 add(prefix+'pad',art.pad);for(const p of plan.pads)objects.push(scene.add.image(p.x,p.y,prefix+'pad').setOrigin(.5).setScale(.5).setDepth(-200));
 add(prefix+'atlas',a.canvas);for(const f of a.frames)scene.textures.get(prefix+'atlas').add(f.name,0,f.x,f.y,f.width,f.height);
 function prop(kind,x,y,w,flip=false,group=null){const im=a.sprites[kind],h=w*im.height/im.width,r={kind,x,y,w,h,flip,group,footY:y+h};if(!propClears(r,plan,art.support)){plan.rejected.push(r);return false;}const shadow=scene.add.ellipse(x+w*.5,y+h-2,w*.65,Math.max(5,w*.09),0x254d3d,.28).setDepth(-300),sprite=scene.add.image(x+w*.5,y+h,prefix+'atlas',kind).setOrigin(.5,1).setDisplaySize(w,h).setFlipX(flip).setDepth(y+h-8);objects.push(shadow,sprite);plan.props.push(r);return r;}
 // Use the same terrain and primary roots; reduce dispersed repeated undergrowth.
 for(const[k,x,foot,w,flip,group]of ROOT_ANCHORS){for(const factor of[1,.94,.88]){const width=w*factor,height=width*a.sprites[k].height/a.sprites[k].width;if(prop(k,x+(w-width)/2,foot-height,width,flip,group))break;}}
 const scenic=Object.assign(document.createElement('canvas'),{width:1280,height:768}),sc=scenic.getContext('2d');sc.imageSmoothingQuality='high';for(const name of['water','shadow','relief','ground'])sc.drawImage(art.layers[name],0,0,1280,768);
 // Static, subtle water mist. No animated environment objects are introduced.
 const mist=Object.assign(document.createElement('canvas'),{width:2560,height:1536}),mc=mist.getContext('2d');mc.scale(2,2);for(const[x,y,rx,ry]of[[100,400,150,30],[1150,705,160,30],[600,20,150,25],[720,300,110,22],[450,540,110,20]]){const g=mc.createRadialGradient(x,y,0,x,y,rx);g.addColorStop(0,'#bed3bf25');g.addColorStop(1,'#d4ead600');mc.save();mc.translate(x,y);mc.scale(1,ry/rx);mc.translate(-x,-y);mc.fillStyle=g;mc.fillRect(x-rx,y-rx,rx*2,rx*2);mc.restore();}mc.setTransform(1,0,0,1,0,0);mc.globalCompositeOperation='destination-out';mc.drawImage(art.mask,0,0);add(prefix+'mist',mist);objects.push(scene.add.image(0,0,prefix+'mist').setOrigin(0).setScale(.5).setDepth(-4950));
 plan.bridges=art.bridges.map(({image,...b})=>b);plan.falls=art.falls;plan.layers=['water','shadow','relief','ground','cascade','mist','route','bridges','pads','props'];
 return{version:M05_ART_VERSION,plan,objects,textureKeys:keys,metadata:{composition:'separate-Phaser-components',artOnly:true,gameplayImplemented:false,roadWidth:ROAD_WIDTH,roadContinuity:'C2-cubic-B-spline',arcStationSpacing:4,atlasFrames:6,animatedObjects:0,habitat:art.habitat,style:'clean-cel-masses-and-ink-contours',rootAnchors:ROOT_ANCHORS.length},support:art.support,
  paintMargins(c,r){const sx=r.width/1280,sy=r.height/768,left=r.left/sx,right=(r.canvasWidth-r.left-r.width)/sx;c.save();c.translate(r.left,r.top);c.scale(sx,sy);c.beginPath();c.rect(-left,0,left,768);c.rect(1280,0,right,768);c.clip();c.imageSmoothingQuality='high';if(left>0){c.save();c.scale(-1,1);c.drawImage(scenic,0,0,Math.min(left,768),768,0,0,left,768);c.restore();}if(right>0){c.save();c.translate(2560,0);c.scale(-1,1);c.drawImage(scenic,1280-Math.min(right,768),0,Math.min(right,768),768,1280-right,0,right,768);c.restore();}paintGeometricRoad(c,map.path);c.restore();},
  destroy(){objects.forEach(o=>o.destroy());for(const k of keys)if(scene.textures.exists(k))scene.textures.remove(k);}
 };
}
