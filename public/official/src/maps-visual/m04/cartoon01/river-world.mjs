import{riverAssets}from'./assets.mjs';
import{makeRiverSurfaces,clears}from'./surfaces.mjs';
import{paintGeometricRoad,ROAD_WIDTH}from'./road-geometry.mjs';
export const M04_ART_VERSION='m04-cartoon01-ancient-river-v1';
export const M04_SCENIC='maps/m04/ancient-river/art-v1';
export function makeM04ArtPlan(map){
 if(map?.id!==4||map.path?.length!==262||map.spots?.length!==9||map.decor?.bridge_centers?.length!==2)throw Error('M04 canonical visual contract');
 return{version:M04_ART_VERSION,path:map.path.map(p=>[...p]),river:map.decor.river_path.map(p=>[...p]),bridgeCenters:map.decor.bridge_centers.map(p=>[...p]),pads:map.spots.map((p,index)=>({id:'m04-pad-'+String(index+1).padStart(2,'0'),index,x:p.cx*64+32,y:p.cy*64+32}))};
}
export function mountRiverArt(scene,map){
 const plan={...makeM04ArtPlan(map),props:[],rejected:[],roadWidth:ROAD_WIDTH},a=riverAssets(),art=makeRiverSurfaces(plan,a),objects=[],keys=[],prefix='maps/m04/cartoon01/';
 const add=(key,image)=>{if(scene.textures.exists(key))scene.textures.remove(key);scene.textures.addCanvas(key,image);keys.push(key);};
 const scenic=Object.assign(document.createElement('canvas'),{width:1280,height:768}),sc=scenic.getContext('2d');sc.imageSmoothingQuality='high';for(const name of['ground','relief','water']){const b=art.bounds[name]??{x:0,y:0,width:1280,height:768};sc.drawImage(art.layers[name],b.x,b.y,b.width,b.height);}add(M04_SCENIC,scenic);
 for(const[name,depth]of[['ground',-5000],['relief',-4980],['water',-4960],['route',-4900],['bridge0',-4800],['bridge1',-4800]]){const key=prefix+name;add(key,art.layers[name]);const b=art.bounds[name]??{x:0,y:0};objects.push(scene.add.image(b.x,b.y,key).setOrigin(0).setScale(.5).setDepth(depth));}
 add(prefix+'pad',art.pad);for(const p of plan.pads)objects.push(scene.add.image(p.x,p.y,prefix+'pad').setOrigin(.5).setScale(.5).setDepth(-200));
 add(prefix+'atlas',a.canvas);for(const f of a.frames)scene.textures.get(prefix+'atlas').add(f.name,0,f.x,f.y,f.width,f.height);
 function prop(kind,x,y,w,flip=false,group=null){const im=a.sprites[kind],h=w*im.height/im.width,r={kind,x,y,w,h,flip,group,footY:y+h};if(!clears(r,plan,{dock:kind==='dock'})){plan.rejected.push(r);return false;}const shadow=scene.add.ellipse(x+w*.5,y+h-3,w*.65,Math.max(5,w*.10),0x33543b,kind==='dock'?.18:.28).setDepth(-300),sprite=scene.add.image(x+w*.5,y+h,prefix+'atlas',kind).setOrigin(.5,1).setDisplaySize(w,h).setFlipX(flip).setDepth(y+h-8);objects.push(shadow,sprite);plan.props.push(r);return r;}
 prop('monument',495,10,155,false,'river-guardian');
 for(const[k,x,y,w,flip]of[['arch',550,215,70],['arch',1185,70,85,true],['columns',480,32,70],['columns',775,130,76],['columns',25,290,68],['columns',995,548,70],['rocks',500,448,42],['rocks',840,470,42],['rocks',270,627,45],['dock',1060,620,120]])prop(k,x,y,w,flip,'ruin-'+x);
 const trees=[[20,0,120],[140,-20,110],[420,-25,110],[780,0,120],[930,-10,120],[1200,0,76],[0,465,95],[280,550,75],[0,580,90],[1175,460,95],[1180,578,88],[80,30,100],[850,8,110],[600,-38,90],[1020,65,85],[20,80,85]];
 for(const[i,[x,y,w]]of trees.entries())prop('oak',x,y,w,i%2===0,'grove-'+i);
 const anchors=[...plan.props].filter(p=>p.kind!=='dock');for(const p of anchors)for(const[k,dx,dy,w]of[['shrub',-12,-18,35],['rocks',p.w*.68,-12,30],['shrub',p.w*.27,-7,28]]){const im=a.sprites[k];prop(k,p.x+dx,p.footY+dy-w*im.height/im.width,w,p.flip,p.group);}
 for(const[x,y,w]of[[62,318,35],[270,275,35],[330,295,32],[530,305,32],[575,305,30],[620,310,28],[800,295,34],[995,160,32],[1070,550,34],[525,500,30],[670,490,29],[805,500,28],[760,465,30],[460,665,30],[825,677,30],[1000,630,34]])prop('shrub',x,y,w,false,'clearing');
 plan.bridges=art.bridges;plan.layers=['ground','relief','water','route','bridge0','bridge1','pads','props'];plan.biome='ancient-river-ruins';plan.exclusions={route:51,pad:58,mainRiver:67,westOutflow:63,eastOutflow:65,source:29};
 return{plan,metadata:{version:M04_ART_VERSION,composition:'separate-Phaser-components',roadWidth:ROAD_WIDTH,roadContinuity:'C2-cubic-B-spline',atlasFrames:7,riverWidth:72,bridges:2,animatedNewObjects:0},
  paintGutters(c,r){const scale=r.width/1280,sy=r.height/768,left=r.left/scale,right=(r.canvasWidth-r.left-r.width)/scale;c.save();c.translate(r.left,r.top);c.scale(scale,sy);c.beginPath();c.rect(-left,0,left,768);c.rect(1280,0,right,768);c.clip();c.imageSmoothingQuality='high';if(left>0){c.save();c.scale(-1,1);c.drawImage(scenic,0,0,Math.min(left,768),768,0,0,left,768);c.restore();}if(right>0){c.save();c.translate(2560,0);c.scale(-1,1);c.drawImage(scenic,1280-Math.min(right,768),0,Math.min(right,768),768,1280-right,0,right,768);c.restore();}paintGeometricRoad(c,map.path);c.restore();},
  destroy(){objects.forEach(o=>o.destroy());for(const key of keys)if(scene.textures.exists(key))scene.textures.remove(key);}
 };
}
