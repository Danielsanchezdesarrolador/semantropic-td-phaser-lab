/** MAP-STYLE-01: original component scene; no full-map raster or gameplay writes. */
import {mountM01WorldV7} from '../m07/renderer-v7.mjs';
import {makeR7MapPlan} from '../r7/dawn-plateau-art.mjs';
export const STYLE01_VERSION='m01-hf-cartoon-01-polished-v2';
export const TERRAIN_KEY='maps/m01/r7/dawn-plateau/v1';
export const SCENIC_KEY='maps/m01/r7/dawn-plateau/scenic-gutters/hf2';
export const ASSETS=Object.freeze({terrain:new URL('../../../../art/maps/m01/style01/empty-terrain-original.png',import.meta.url).href,nature:new URL('../../../../art/maps/m01/style01/nature-atlas-original.png',import.meta.url).href,details:new URL('../../../../art/maps/m01/style01/details-atlas-original.png',import.meta.url).href,structures:new URL('../../../../art/maps/m01/style01/structures-atlas-original.png',import.meta.url).href});
const canvas=(w,h)=>Object.assign(document.createElement('canvas'),{width:w,height:h});
const load=u=>new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=()=>no(Error('STYLE01 missing original asset '+u));i.src=u;});
const sources=typeof document==='undefined'?null:await Promise.all(Object.values(ASSETS).map(load));
const rng=seed=>()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296),TAU=Math.PI*2;
function ellipse(c,x,y,rx,ry,fill,stroke=null,width=1){c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}}
function poly(c,points,color,edge=null,width=1){c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();c.fillStyle=color;c.fill();if(edge){c.strokeStyle=edge;c.lineWidth=width;c.stroke();}}
export function routeDistance(x,y,path){let best=Infinity;for(let i=1;i<path.length;i++){const a=path[i-1],b=path[i],dx=b[0]-a[0],dy=b[1]-a[1],l=dx*dx+dy*dy,t=l?Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/l)):0;best=Math.min(best,Math.hypot(x-a[0]-dx*t,y-a[1]-dy*t));}return best;}
export function propClears(r,plan){
 // Entire art footprint, including canopy, stays outside route and real sockets.
 for(let y=r.y;y<=r.y+r.h;y+=8)for(let x=r.x;x<=r.x+r.w;x+=8)if(routeDistance(x,y,plan.path)<54)return false;
 return plan.pads.every(p=>Math.hypot(Math.max(r.x-p.x,0,p.x-r.x-r.w),Math.max(r.y-p.y,0,p.y-r.y-r.h))>57);
}
/** Same world-space brush for the WebGL texture and FIT extension. */
export function paintStyle01Road(c,path){
 const pts=path.map(p=>[...p]);
 for(const side of [-1,1]){const a=side<0?pts[0]:pts.at(-1),b=side<0?pts[1]:pts.at(-2),len=Math.hypot(a[0]-b[0],a[1]-b[1]);const p=[a[0]+(a[0]-b[0])/len*2200,a[1]+(a[1]-b[1])/len*2200];side<0?pts.unshift(p):pts.push(p);}
 // Midpoint quadratic joins remove the scalloped offset polygon. The authoritative
 // waypoints are untouched; the visual center differs by less than a route sample.
 const stroke=(color,width)=>{c.beginPath();c.moveTo(...pts[0]);for(let i=1;i<pts.length-1;i++)c.quadraticCurveTo(...pts[i],(pts[i][0]+pts[i+1][0])/2,(pts[i][1]+pts[i+1][1])/2);c.lineTo(...pts.at(-1));c.lineJoin='round';c.lineCap='round';c.strokeStyle=color;c.lineWidth=width;c.stroke();};
 stroke('#637344',88);stroke('#a28b53',84);stroke('#d6ad70',80);stroke('#edcc8e',74);
 // Low contrast grain, broad warm patches, deliberately sparse edge stones.
 const r=rng(101);
 for(let i=1;i<path.length-1;i++){
  const p=path[i],a=path[i-1],b=path[i+1],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy)||1;
  if(i%3===0){const d=(r()-.5)*44,x=p[0]-dy/len*d,y=p[1]+dx/len*d;ellipse(c,x,y,4+r()*5,1.1+r(),i%2?'#e3bd7b65':'#f8dda265');}
  if(i%4===0)for(const side of [-1,1]){const d=side*40,x=p[0]-dy/len*d,y=p[1]+dx/len*d;if(r()<.7){ellipse(c,x,y+1,2.9,1.8,'#8f7d54');ellipse(c,x,y,2.8,1.35,'#ddceaa','#9f906b',.5);}else{poly(c,[[x-3,y+1],[x-1,y-3],[x,y],[x+2,y-2],[x+3,y+1]],'#8ba34e');}}
  for(let k=0;k<2;k++){const d=(r()-.5)*58,x=p[0]-dy/len*d+(r()-.5)*7,y=p[1]+dx/len*d;ellipse(c,x,y,.5+r()*.7,.35,'#bd995d35');}
 }
}
function makePad(){const v=canvas(192,192),c=v.getContext('2d');c.scale(2,2);c.translate(48,60);
 ellipse(c,2,4,44,19,'#294d3e55');ellipse(c,0,0,43,20,'#415c5b','#364b46',2);
 ellipse(c,0,-5,43,21,'#90a898','#485b50',1.5);ellipse(c,0,-10,43,20,'#e7ce91','#665d42',1.5);
 ellipse(c,0,-11,34,15,'#f4dfaa','#ad9665',1);
 for(let i=0;i<10;i++){const a=i/10*TAU;c.beginPath();c.moveTo(Math.cos(a)*35,-10+Math.sin(a)*16);c.lineTo(Math.cos(a)*42,-10+Math.sin(a)*20);c.strokeStyle='#8e805b';c.lineWidth=1;c.stroke();}
 poly(c,[[0,-19],[10,-13],[6,-5],[-5,-5],[-11,-13]],'#d7b76f','#7f7049',1.5);poly(c,[[-6,-13],[0,-17],[6,-13],[0,-9]],'#f7e7bc','#a58c58',.8);
 return v;
}
let cachedAtlas;
function registerAtlas(scene){
 if(cachedAtlas){for(const [key,v] of Object.entries(cachedAtlas))if(!scene.textures.exists(key))scene.textures.addCanvas(key,v);return cachedAtlas;}
 cachedAtlas={};
 for(const [slot,source] of [[0,sources[1]],[1,sources[3]],[2,sources[2]]]){
  const cv=canvas(source.width,source.height),c=cv.getContext('2d',{willReadFrequently:true});c.drawImage(source,0,0);const data=c.getImageData(0,0,cv.width,cv.height),w=cv.width,h=cv.height,labels=new Int32Array(w*h),queue=new Int32Array(w*h),groups=[];let label=0;
  for(let p=0;p<w*h;p++){if(labels[p]||data.data[p*4+3]<100)continue;label++;let start=0,end=1;queue[0]=p;labels[p]=label;let left=w,right=0,top=h,bottom=0;
   while(start<end){const q=queue[start++],x=q%w,y=Math.floor(q/w);left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);for(const n of [x?q-1:-1,x<w-1?q+1:-1,y?q-w:-1,y<h-1?q+w:-1])if(n>=0&&!labels[n]&&data.data[n*4+3]>=100){labels[n]=label;queue[end++]=n;}}
   if(end>7000)groups.push({label,left,right,top,bottom,pixels:end});
  }
  const names=slot===2?['youngOak','shrub','pillar','timber','wheat','ivyRock']:slot===1?['gate','bridge','supply','fence']:['oak','cypress','arch','rocks','shrine','flowers'],cols=slot===1?2:3;
  // A floating crystal is intentionally detached from its pedestal; combine
  // connected components belonging to the same authored atlas cell.
  const cells=new Map();for(const g of groups){const row=(g.top+g.bottom)/2>h/2?1:0,col=Math.min(cols-1,Math.floor((g.left+g.right)/2/(w/cols))),id=row*cols+col,old=cells.get(id);if(old){old.left=Math.min(old.left,g.left);old.right=Math.max(old.right,g.right);old.top=Math.min(old.top,g.top);old.bottom=Math.max(old.bottom,g.bottom);}else cells.set(id,{...g});}
  groups.splice(0,groups.length,...cells.values());
  if(groups.length!==names.length)throw Error('STYLE01 atlas requires '+names.length+' complete sprite cells');
  for(const g of groups){const row=(g.top+g.bottom)/2>h/2?1:0,col=Math.min(cols-1,Math.floor((g.left+g.right)/2/(w/cols))),name=names[row*cols+col],key='maps/m01/style01/'+name;if(cachedAtlas[key])throw Error('STYLE01 duplicate sprite '+name);
   // Transparent atlas source is authored separately, never sampled from a map mockup.
   const left=Math.max(0,g.left-4),top=Math.max(0,g.top-4),pw=Math.min(w-left,g.right-left+5),ph=Math.min(h-top,g.bottom-top+5),v=canvas(pw,ph),ctx=v.getContext('2d');ctx.drawImage(source,left,top,pw,ph,0,0,pw,ph);cachedAtlas[key]=v;scene.textures.addCanvas(key,v);
  }
 }
 return cachedAtlas;
}
export function mountStyle01World(scene,map,options={}){
 const base=mountM01WorldV7(scene,map,options),p=makeR7MapPlan(map),plan={...p,props:[],rejected:[]},objects=[],atlas=registerAtlas(scene);
 const terrain=canvas(2560,1536),tc=terrain.getContext('2d',{alpha:false}),src=sources[0],cut=Math.round(src.height*.72);tc.scale(2,2);const horizon=Math.round(src.height*.27);tc.drawImage(src,0,0,src.width,horizon,0,0,1280,145);tc.drawImage(src,0,horizon,src.width,cut-horizon,0,145,1280,505);tc.drawImage(src,0,cut,src.width,src.height-cut,0,650,1280,118);
 scene.textures.addCanvas(TERRAIN_KEY,terrain);const scenic=canvas(1280,768);scenic.getContext('2d').drawImage(terrain,0,0,1280,768);scene.textures.addCanvas(SCENIC_KEY,scenic);
 // Actual separate display layers; the substrate contains no path, pads or foreground props.
 objects.push(scene.add.image(0,0,TERRAIN_KEY).setOrigin(0).setScale(.5).setCrop(0,0,2560,290).setDepth(-5000));
 objects.push(scene.add.image(0,0,TERRAIN_KEY).setOrigin(0).setScale(.5).setCrop(0,290,2560,1246).setDepth(-4900));
 const road=canvas(2560,1536);const rc=road.getContext('2d');rc.scale(2,2);paintStyle01Road(rc,map.path);scene.textures.addCanvas('maps/m01/style01/route',road);objects.push(scene.add.image(0,0,'maps/m01/style01/route').setOrigin(0).setScale(.5).setDepth(-4700));
 scene.textures.addCanvas('maps/m01/style01/pad',makePad());const pads=plan.pads.map(p=>{const v=scene.add.image(p.x,p.y,'maps/m01/style01/pad').setOrigin(.5,60/96).setScale(.5).setDepth(-150);objects.push(v);return v;});
 for(const layer of ['terrain','path'])for(const o of base.layerGroups[layer]||[])o.setVisible(false);
 for(const o of base.propObjects||[]){o.sprite?.setVisible(false);o.shadow?.setVisible(false);}
 for(const o of base.padObjects){o.sprite.setVisible(false);o.shadow.setVisible(false);}
 const prop=(kind,x,y,w,flip=false)=>{const key='maps/m01/style01/'+kind,im=atlas[key],h=w*im.height/im.width,r={kind,x,y,w,h,flip,footY:y+h};if(x<4||x+w>1276||!propClears(r,plan)){plan.rejected.push(r);return false;}
  const shadow=scene.add.ellipse(x+w*.5,y+h-3,w*.66,Math.max(5,w*.12),0x244c32,.23).setDepth(-300);
  const v=scene.add.image(x+w/2,y+h,key).setOrigin(.5,1).setDisplaySize(w,h).setFlipX(flip).setDepth(y+h-8);objects.push(shadow,v);plan.props.push(r);return true;};
 // Deliberate landscape pockets, with room around every tactical surface.
 for(const [x,y,w,f] of [[10,85,132,false],[150,90,125,true],[290,65,112,false],[430,90,100,true],[15,530,105,false],[185,570,90,true],[800,560,95,false],[1138,90,112,true]])prop('oak',x,y,w,f);
 prop('arch',395,250,125);prop('shrine',1080,83,135);prop('cypress',525,105,38);prop('cypress',1235,525,36);
 prop('supply',242,300,86);prop('fence',300,215,90);prop('fence',835,145,93);prop('gate',65,210,115);
 for(const [x,y,w] of [[20,235,65],[305,300,55],[520,245,50],[860,410,60],[755,600,58],[1090,275,52],[1110,650,65]])prop('rocks',x,y,w);
 for(const [x,y,w] of [[185,270,47],[330,230,43],[465,390,35],[630,150,40],[830,385,44],[965,615,39],[270,610,44],[60,575,43],[1190,560,37]])prop('flowers',x,y,w);
 // Additional hand-drawn motifs; each complete silhouette is clearance checked.
 for(const [kind,x,y,w,flip] of [
  ['youngOak',25,130,82],['youngOak',590,120,85,true],['youngOak',1130,170,90],['youngOak',515,595,83],
  ['shrub',165,235,62],['shrub',350,200,64],['shrub',755,375,57],['shrub',930,605,65],['shrub',1150,650,65],['shrub',100,625,61],
  ['pillar',365,290,46],['pillar',1155,260,48],['pillar',715,595,45],
  ['timber',285,235,52],['timber',900,385,48],['timber',205,625,48],
  ['wheat',230,190,82],['wheat',320,160,90],['wheat',550,165,70],
  ['ivyRock',470,235,64],['ivyRock',1050,145,65],['ivyRock',40,610,66],['ivyRock',1170,615,65],
  ['shrub',15,290,48],['shrub',570,320,48],['shrub',1130,360,48],['shrub',720,375,50],
 ])prop(kind,x,y,w,flip);
 function preserve(){for(const [i,p] of base.padObjects.entries()){pads[i].setVisible(p.visualState!=='ruins');p.sprite.setVisible(p.visualState==='ruins');p.shadow.setVisible(p.visualState==='ruins');}}
 const setSocketVisualState=(...args)=>{const ok=base.setSocketVisualState(...args);preserve();return ok;};
 const applyVisualSnapshot=s=>{const ok=base.applyVisualSnapshot(s);preserve();return ok;};
 const projectEvent=e=>{const result=base.projectEvent(e);preserve();return result;};
 const resetVisuals=()=>{const ok=base.resetVisuals();preserve();return ok;};
 let disposed=false;
 return {...base,artVersion:STYLE01_VERSION,landscapePlan:plan,objects:[...base.objects,...objects],styleObjects:objects,
  premiumArt:{version:STYLE01_VERSION,width:2560,height:1536,geometricalPads:8,pathVertices:133,composition:'separate-Phaser-components',foregroundSprites:plan.props.length},
  paintPanoramaGutters(ctx,r){const sx=r.width/1280,sy=r.height/768;for(const [side,extent] of [['left',r.left/sx],['right',(r.canvasWidth-r.left-r.width)/sx]]){if(extent<=0)continue;ctx.save();ctx.beginPath();side==='left'?ctx.rect(0,r.top,r.left,r.height):ctx.rect(r.left+r.width,r.top,r.canvasWidth-r.left-r.width,r.height);ctx.clip();ctx.translate(r.left,r.top);ctx.scale(sx,sy);paintStyle01Road(ctx,map.path);ctx.restore();}},
  setSocketVisualState,applyVisualSnapshot,projectEvent,resetVisuals,
  destroy(){if(disposed)return;disposed=true;objects.forEach(o=>o.destroy());base.destroy();for(const key of [TERRAIN_KEY,SCENIC_KEY,'maps/m01/style01/route','maps/m01/style01/pad',...Object.keys(atlas)])if(scene.textures.exists(key))scene.textures.remove(key);},
  getMapPerformanceInfo:()=>({...base.getMapPerformanceInfo(),styleVersion:STYLE01_VERSION,foregroundSprites:plan.props.length,extraDisplayObjects:objects.length,physicalDeviceFPS:'NOT_MEASURED'})};
}
