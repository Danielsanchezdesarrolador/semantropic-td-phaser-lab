/** M05 art only. This module has no combat, economy, waves or selector adapter. */
import{marshAssets}from'./assets.mjs';
import{makeMarshSurfaces,channels,propClears}from'./surfaces.mjs';
import{ROAD_WIDTH,paintGeometricRoad}from'./road-geometry.mjs';
export const M05_ART_VERSION='m05-hf-align-ref01-wetland-art-v1';
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
 prop('hut',1045,-2,155,false,'marsh-lookout');prop('arch',435,48,130,false,'sunken-sanctuary');prop('bones',145,566,90,false,'ancient-bones');
 for(const[k,x,y,w,flip]of[['log',132,300,75],['log',535,370,75,true],['log',929,620,70],['arch',1190,160,75,true]])prop(k,x,y,w,flip,'landmark-'+x);
 for(const[i,[x,y,w]]of[[0,-55,122],[128,-70,125],[270,-45,115],[10,445,105],[20,600,95],[500,345,110],[868,475,98],[1185,120,80],[770,-45,115],[1110,-40,110]].entries())prop('tree',x,y,w,i%2===0,'marsh-tree-'+i);
 for(const[i,[x,y,w]]of[[365,-35,105],[570,-35,95],[825,-15,100],[25,490,80],[885,520,80],[1130,160,70],[350,60,70]].entries())prop('tree',x,y,w,i%2===0,'wetland-grove-'+i);
 const anchors=[...plan.props];for(const p of anchors)for(const[k,dx,dy,w]of[['reeds',-10,-20,34],['reeds',p.w*.66,-10,29]]){const im=a.sprites[k];prop(k,p.x+dx,p.footY+dy-w*im.height/im.width,w,p.flip,p.group);}
 for(const[x,y,w]of[[70,245,35],[238,270,32],[165,480,36],[380,465,36],[430,520,35],[510,515,32],[555,445,40],[608,500,34],[710,480,34],[875,280,35],[930,300,35],[998,320,30],[1020,500,35],[1015,600,35],[1170,250,30],[510,690,28],[380,700,30],[100,680,34]])prop('reeds',x,y,w,false,'clearing');
 // Bank groves and grouped wetland plants, constrained by actual route/pad bounds.
 for(const [i,[x,y,w]]of[[65,-55,145],[300,-50,140],[660,-60,140],[865,-45,135],[1140,5,120],[5,505,115],[35,625,100],[895,485,105],[535,340,95],[1060,525,95]].entries())prop('tree',x,y,w,i%2===0,'flooded-grove-'+i);
 for(let y=20;y<740;y+=43)for(let x=15;x<1260;x+=59){const w=34+((x+y)%19),im=a.sprites.reeds,h=w*im.height/im.width;if(plan.props.some(p=>Math.hypot(x+w/2-p.x-p.w/2,y+h-p.footY)<34))continue;prop('reeds',x,y,w,(x+y)%2===0,'wetland-understory');}
 const scenic=Object.assign(document.createElement('canvas'),{width:1280,height:768}),sc=scenic.getContext('2d');sc.imageSmoothingQuality='high';for(const name of['water','shadow','relief','ground'])sc.drawImage(art.layers[name],0,0,1280,768);
 // Static, subtle water mist. No animated environment objects are introduced.
 const mist=Object.assign(document.createElement('canvas'),{width:2560,height:1536}),mc=mist.getContext('2d');mc.scale(2,2);for(const[x,y,rx,ry]of[[100,400,150,30],[1150,705,160,30],[600,20,150,25],[720,300,110,22],[450,540,110,20]]){const g=mc.createRadialGradient(x,y,0,x,y,rx);g.addColorStop(0,'#bed3bf25');g.addColorStop(1,'#d4ead600');mc.save();mc.translate(x,y);mc.scale(1,ry/rx);mc.translate(-x,-y);mc.fillStyle=g;mc.fillRect(x-rx,y-rx,rx*2,rx*2);mc.restore();}mc.setTransform(1,0,0,1,0,0);mc.globalCompositeOperation='destination-out';mc.drawImage(art.mask,0,0);add(prefix+'mist',mist);objects.push(scene.add.image(0,0,prefix+'mist').setOrigin(0).setScale(.5).setDepth(-4950));
 plan.bridges=art.bridges.map(({image,...b})=>b);plan.falls=art.falls;plan.layers=['water','shadow','relief','ground','cascade','mist','route','bridges','pads','props'];
 return{version:M05_ART_VERSION,plan,objects,textureKeys:keys,metadata:{composition:'separate-Phaser-components',artOnly:true,gameplayImplemented:false,roadWidth:ROAD_WIDTH,roadContinuity:'C2-cubic-B-spline',arcStationSpacing:4,atlasFrames:6,animatedObjects:0,habitat:art.habitat},support:art.support,
  paintMargins(c,r){const sx=r.width/1280,sy=r.height/768,left=r.left/sx,right=(r.canvasWidth-r.left-r.width)/sx;c.save();c.translate(r.left,r.top);c.scale(sx,sy);c.beginPath();c.rect(-left,0,left,768);c.rect(1280,0,right,768);c.clip();c.imageSmoothingQuality='high';if(left>0){c.save();c.scale(-1,1);c.drawImage(scenic,0,0,Math.min(left,768),768,0,0,left,768);c.restore();}if(right>0){c.save();c.translate(2560,0);c.scale(-1,1);c.drawImage(scenic,1280-Math.min(right,768),0,Math.min(right,768),768,1280-right,0,right,768);c.restore();}paintGeometricRoad(c,map.path);c.restore();},
  destroy(){objects.forEach(o=>o.destroy());for(const k of keys)if(scene.textures.exists(k))scene.textures.remove(k);}
 };
}
