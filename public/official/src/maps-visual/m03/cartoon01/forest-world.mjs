import {makeM03ArtPlan} from '../forest-art.mjs';
import {forestAssets} from './assets.mjs';
import {makeForestSurfaces,clears,coastY} from './surfaces.mjs';
import {paintGeometricRoad,ROAD_WIDTH} from './road-geometry.mjs';
const KEY='maps/m03/cartoon01/';
export function mountCartoonForest(scene,map){
 const plan={...makeM03ArtPlan(map),props:[],rejected:[],roadWidth:ROAD_WIDTH},a=forestAssets(),art=makeForestSurfaces(plan,a),objects=[],keys=[];
 const add=(key,canvas)=>{if(scene.textures.exists(key))scene.textures.remove(key);scene.textures.addCanvas(key,canvas);keys.push(key);};
 // Contract keys survive; the panorama contains terrain only, never false pads/trees.
 const scenic=Object.assign(document.createElement('canvas'),{width:1280,height:768}),sc=scenic.getContext('2d');for(const name of['base','shelves','coast','stream']){const b=art.bounds[name]??{x:0,y:0,width:1280,height:768};sc.drawImage(art.layers[name],b.x,b.y,b.width,b.height);}
 add('maps/m03/whispering-forest/scenic/v1',scenic);
 for(const[name,depth]of[['base',-5000],['shelves',-4980],['coast',-4970],['stream',-4960],['route',-4900],['bridge',-4800]]){const key=name==='base'?'maps/m03/whispering-forest/v1':KEY+name;add(key,art.layers[name]);const b=art.bounds[name]??{x:0,y:0};objects.push(scene.add.image(b.x,b.y,key).setOrigin(0).setScale(.5).setDepth(depth));}
 add(KEY+'pad',art.pad);for(const p of plan.sockets)objects.push(scene.add.image(p.x,p.y,KEY+'pad').setOrigin(.5).setScale(.5).setDepth(-200));
 add(KEY+'atlas',a.canvas);for(const f of a.frames)scene.textures.get(KEY+'atlas').add(f.name,0,f.x,f.y,f.width,f.height);
 function prop(kind,x,y,w,flip=false,group=null){const im=a.sprites[kind],h=w*im.height/im.width,r={kind,x,y,w,h,flip,group,footY:y+h};if(!clears(r,plan)){plan.rejected.push(r);return false;}
  const shadow=scene.add.ellipse(x+w*.5,y+h-3,w*.65,Math.max(5,w*.09),0x254b32,.28).setDepth(-300),sprite=scene.add.image(x+w*.5,y+h,KEY+'atlas',kind).setOrigin(.5,1).setDisplaySize(w,h).setFlipX(flip).setDepth(y+h-8);objects.push(shadow,sprite);plan.props.push(r);return r;
 }
 // Forest edge and ancient oak, with a deliberately open tactical ribbon.
 prop('oak',420,10,205,false,'ancestral-oak');
 const trees=[[0,35,145],[65,-14,143],[182,10,128],[300,-40,145],[770,-35,140],[885,-15,150],[1020,-18,140],[1120,15,156],[15,105,118],[110,83,110],[335,75,115],[815,85,110],[1030,80,115],[1154,133,122],[8,472,118],[118,434,100],[205,552,85],[450,556,58],[518,521,82],[865,310,75],[1035,472,100],[1175,518,100],[850,581,65],[350,300,65],[550,260,70]];
 for(const[i,[x,y,w]]of trees.entries())prop('oak',x,y,w,i%2===0,'grove-'+i);
 for(const[k,x,y,w,flip]of[['arch',320,113,100],['arch',1056,105,105,true],['rune',590,239,55],['rune',860,135,66],['log',183,185,85],['log',1110,571,85,true],['rocks',25,510,60],['rocks',410,600,52]])prop(k,x,y,w,flip,'landmark-'+k+'-'+x);
 // Ground companions share each primary root; overlap is intentional within groups.
 const anchors=[...plan.props];for(const p of anchors){for(const[k,dx,dy,w]of[['fern',-18,-22,42],['rocks',p.w*.66,-19,32],['fern',p.w*.37,-9,32]]){const im=a.sprites[k];prop(k,p.x+dx,p.footY+dy-w*im.height/im.width,w,p.flip,p.group);}}
 // Low undergrowth in the remaining clearings; never crosses route, river or sockets.
 for(const[x,y,w]of[[45,330,45],[156,344,45],[395,342,45],[510,278,45],[570,331,48],[620,354,40],[833,225,50],[938,224,42],[898,366,45],[1170,234,46],[1200,450,40],[760,610,40],[550,604,42],[1050,556,38],[200,605,40],[365,575,36],[602,145,36],[750,170,40],[767,278,34],[820,562,35]])prop('fern',x,y,w,false,'clearing');
 plan.bridge=art.bridge;plan.canvasSize={width:2560,height:1536};plan.layers=['base','shelves','coast','stream','route','bridge','pads','props'];plan.biome='enchanted-deciduous-forest';
 return{plan,objects,metadata:{composition:'separate-Phaser-components',roadWidth:ROAD_WIDTH,roadContinuity:'C2-cubic-B-spline',atlasFrames:6,sourceAtlas:[a.canvas.width,a.canvas.height],coast:coastY(620)},
  paintGutters(ctx,r){ctx.save();ctx.translate(r.left,r.top);ctx.scale(r.width/1280,r.height/768);ctx.beginPath();const l=r.left/(r.width/1280),right=(r.canvasWidth-r.left-r.width)/(r.width/1280);ctx.rect(-l,0,l,768);ctx.rect(1280,0,right,768);ctx.clip();paintGeometricRoad(ctx,map.path);ctx.restore();},
  destroy(){objects.forEach(o=>o.destroy());for(const k of keys)if(scene.textures.exists(k))scene.textures.remove(k);}
 };
}
