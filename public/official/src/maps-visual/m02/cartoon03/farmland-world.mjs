import {makeM02ArtPlan} from '../farmland-art.mjs';
import {ruralAtlas} from './atlas.mjs';
import {makeSurfaces,propClears,oval,poly,shoreY,FIELD_BEDS} from './surfaces.mjs';
import {paintGeometricRoad} from './road-geometry.mjs';
export const CARTOON02_VERSION='m02-cartoon03-bold-rural-v1';
const KEY='maps/m02/cartoon03/';
export function mountCartoon02Art(scene,map){
 const baseline=makeM02ArtPlan(map),plan={...baseline,version:CARTOON02_VERSION,roadWidth:62,fields:FIELD_BEDS.map((rect,id)=>({id,rect:[...rect]})),props:[],rejected:[]},atlas=ruralAtlas(),art=makeSurfaces(plan,atlas.sprites,atlas),objects=[],keys=[];
 const addTexture=(key,image)=>{if(scene.textures.exists(key))scene.textures.remove(key);scene.textures.addCanvas(key,image);keys.push(key);};
 // The old key is preserved for the shared panorama, but contains scenic terrain
 // only: no false pads, landmarks or duplicated actors in the FIT margins.
 const scenic=Object.assign(document.createElement('canvas'),{width:1280,height:768}),sc=scenic.getContext('2d');for(const k of['base','relief']){const b=art.bounds[k]??{x:0,y:0,width:1280,height:768};sc.drawImage(art.layers[k],b.x,b.y,b.width,b.height)};addTexture('maps/m02/farmland/r3-b2',scenic);
 for(const [name,depth]of[['base',-5000],['relief',-4980],['river',-4960],['fields',-4940],['route',-4900],['bridge',-4800]]){const key=KEY+name;addTexture(key,art.layers[name]);const b=art.bounds[name]??{x:0,y:0};objects.push(scene.add.image(b.x,b.y,key).setOrigin(0).setScale(.5).setDepth(depth));}
 const padKey=KEY+'pad';addTexture(padKey,art.padTile);for(const p of plan.pads)objects.push(scene.add.image(p.x,p.y,padKey).setOrigin(.5).setScale(.5).setDepth(-200));
 const atlasKey=KEY+'rural-atlas';addTexture(atlasKey,atlas.canvas);const texture=scene.textures.get(atlasKey);for(const f of atlas.frames)texture.add(f.name,0,f.x,f.y,f.width,f.height);
 function prop(kind,x,y,w,flip=false){const im=atlas.sprites[kind],h=w*im.height/im.width,r={kind,x,y,w,h,flip,footY:y+h};if(!propClears(r,plan)){plan.rejected.push(r);return false;}const shadow=scene.add.ellipse(x+w/2,y+h-2,w*.67,Math.max(6,w*.10),0x36582a,.25).setDepth(-300);const image=scene.add.image(x+w/2,y+h,atlasKey,kind).setOrigin(.5,1).setDisplaySize(w,h).setFlipX(flip).setDepth(y+h-8);objects.push(shadow,image);plan.props.push(r);return true;}
 prop('mill',435,80,218);prop('farm',1110,80,140);prop('supplies',1030,540,98);
 for(const [x,y,w,flip]of[[8,90,110],[176,65,115,true],[345,142,85],[650,45,90,true],[775,30,85],[1038,174,90],[1110,190,95,true],[1130,530,68],[20,530,65],[200,160,80],[400,390,80],[570,365,65,true],[660,365,60],[1080,480,70],[1170,575,60]])prop('oak',x,y,w,flip);
 // A second small crossing is scenic: its deck is above the foreground water.
 const im=atlas.sprites.bridge,bridgeWidth=110;const scenicBridge=scene.add.image(1050,shoreY(1050)+39,atlasKey,'bridge').setOrigin(.5,.5).setDisplaySize(bridgeWidth,bridgeWidth*im.height/im.width).setDepth(750);objects.push(scenicBridge);
 // Readable fence rails and small flowers stay clear of the tactical corridor.
 const details=Object.assign(document.createElement('canvas'),{width:2560,height:1536}),dc=details.getContext('2d');dc.scale(2,2);let decorations=0;
 for(const [x,y,n]of[[85,240,8],[340,224,4],[675,230,4],[1050,230,5],[60,640,3],[1025,646,5]])for(let i=0;i<n;i++){const r={x:x+i*20,y,w:22,h:21};if(!propClears(r,plan))continue;dc.lineCap='round';for(const [color,width]of[['#4e5630',5],['#b37e37',3]]){dc.strokeStyle=color;dc.lineWidth=width;dc.beginPath();dc.moveTo(r.x,r.y+19);dc.lineTo(r.x,r.y-1);for(const h of[6,14]){dc.moveTo(r.x,r.y+h);dc.lineTo(r.x+20,r.y+h+1);}dc.stroke();}decorations++;}
 const rand=n=>()=>((n=(Math.imul(n,1664525)+1013904223)>>>0)/4294967296),r=rand(777);
 for(let i=0;i<85;i++){const x=15+r()*1250,y=130+r()*500,box={x:x-9,y:y-8,w:18,h:15};if(!propClears(box,plan)||plan.props.some(p=>x>p.x-10&&x<p.x+p.w+10&&y>p.y-10&&y<p.y+p.h+10))continue;oval(dc,x,y+2,10,5,'#3d8438');for(const [dx,dy]of[[-5,0],[2,-4],[6,2]]){oval(dc,x+dx,y+dy,3,2,'#fff3bf','#467b32',.5);oval(dc,x+dx,y+dy,1,1,'#edb62b');}decorations++;}
 addTexture(KEY+'details',details);objects.push(scene.add.image(0,0,KEY+'details').setOrigin(0).setScale(.5).setDepth(-250));
 plan.bridge=art.bridge;plan.decorations=decorations;
 return{plan,objects,metadata:{version:CARTOON02_VERSION,composition:'separate-Phaser-components',roadWidth:art.roadWidth,roadContinuity:'C2-cubic-B-spline',atlasFrames:6,pads:8,routeVertices:163},
  paintGutters(ctx,r){ctx.save();ctx.translate(r.left,r.top);ctx.scale(r.width/1280,r.height/768);ctx.beginPath();const l=r.left/(r.width/1280),rr=(r.canvasWidth-r.left-r.width)/(r.width/1280);ctx.rect(-l,0,l,768);ctx.rect(1280,0,rr,768);ctx.clip();paintGeometricRoad(ctx,map.path);ctx.restore();},
  destroy(){objects.forEach(o=>o.destroy());for(const key of keys)if(scene.textures.exists(key))scene.textures.remove(key);}
 };
}
