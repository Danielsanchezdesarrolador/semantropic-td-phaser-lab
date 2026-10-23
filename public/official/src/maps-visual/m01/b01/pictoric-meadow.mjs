/** B01 MAP-ART-01: original painted scenery, no gameplay or environmental simulation.
 * Protected R7 plan and pads remain authoritative; the reference layout is never used.
 */
import {makeR7MapPlan} from '../r7/dawn-plateau-art.mjs';
export const B01_ART_VERSION='b01-m01-pictoric-dawn-meadow-v1';
export const B01_ASSETS=Object.freeze({
 terrain:new URL('../../../../art/maps/m01/b01/meadow-terrain-original.png',import.meta.url).href,
 props:new URL('../../../../art/maps/m01/b01/meadow-props-original.png',import.meta.url).href
});
const canvas=(w,h)=>Object.assign(document.createElement('canvas'),{width:w,height:h});
const rng=n=>()=>((n=(Math.imul(n,1664525)+1013904223)>>>0)/4294967296);
const TWO=Math.PI*2;
const ellipse=(c,x,y,rx,ry,color)=>{c.beginPath();c.ellipse(x,y,rx,ry,0,0,TWO);c.fillStyle=color;c.fill();};
function poly(c,pts,color,edge=null,width=1){c.beginPath();c.moveTo(...pts[0]);for(const p of pts.slice(1))c.lineTo(...p);c.closePath();if(color){c.fillStyle=color;c.fill();}if(edge){c.lineWidth=width;c.strokeStyle=edge;c.stroke();}}
function stroke(c,path,color,width){c.beginPath();c.lineCap='round';c.lineJoin='round';path.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.strokeStyle=color;c.lineWidth=width;c.stroke();}
const loadImage=url=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(Error('B01 missing original art: '+url));image.src=url;});
// Art-only loading barrier: no changes to combat scene/preloader/CORE are needed.
const sources=typeof document==='undefined'?null:await Promise.all(Object.values(B01_ASSETS).map(loadImage));
let propsCache;
function extractProps(image){
 if(propsCache)return propsCache;
 const w=image.width,h=image.height,c=canvas(w,h),ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0);
 const a=ctx.getImageData(0,0,w,h).data,labels=new Int32Array(w*h),queue=new Int32Array(w*h),groups=[];let label=0;
 // Reuses the connected-alpha extraction approach proven in M03, without changing its assets or modules.
 for(let p=0;p<w*h;p++){
  if(labels[p]||a[p*4+3]<32)continue;label++;let head=0,tail=1;queue[0]=p;labels[p]=label;
  let left=w,right=0,top=h,bottom=0;
  while(head<tail){const q=queue[head++],x=q%w,y=Math.floor(q/w);left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);
   for(const n of [x?q-1:-1,x<w-1?q+1:-1,y?q-w:-1,y<h-1?q+w:-1])if(n>=0&&!labels[n]&&a[n*4+3]>=32){labels[n]=label;queue[tail++]=n;}
  }
  if(tail>10000)groups.push({label,left,right,top,bottom});
 }
 if(groups.length!==6)throw Error('B01 requires six independent original props');
 const names=['oak','cypress','arch','waterfall','flowers','shrine'],result={};
 for(const g of groups){
  const left=Math.max(0,g.left-2),top=Math.max(0,g.top-2),pw=Math.min(w-1,g.right+2)-left+1,ph=Math.min(h-1,g.bottom+2)-top+1;
  const target=canvas(pw,ph),t=target.getContext('2d'),data=t.createImageData(pw,ph);
  for(let y=0;y<ph;y++)for(let x=0;x<pw;x++){
   const sx=left+x,sy=top+y,p=sy*w+sx;let own=labels[p]===g.label;
   if(!own&&!labels[p])for(let dy=-2;dy<=2&&!own;dy++)for(let dx=-2;dx<=2;dx++){const nx=sx+dx,ny=sy+dy;if(nx>=0&&nx<w&&ny>=0&&ny<h&&labels[ny*w+nx]===g.label){own=true;break;}}
   if(own)for(let k=0;k<4;k++)data.data[(y*pw+x)*4+k]=a[p*4+k];
  }
  t.putImageData(data,0,0);
  const col=Math.min(2,Math.floor((g.left+g.right)/2/(w/3))),row=(g.top+g.bottom)/2>h/2?1:0;
  const name=names[row*3+col];if(result[name])throw Error('B01 duplicate atlas slot '+name);result[name]=target;
 }
 propsCache=result;return result;
}
export function makeB01MapPlan(map){const p=makeR7MapPlan(map);return {...p,version:B01_ART_VERSION,props:[],rejected:[]};}
export function b01PropClearsGeometry(r,plan){
 // Conservative segment bounds ensure the entire prop rectangle is outside the road capsule.
 for(let i=1;i<plan.path.length;i++){
  const a=plan.path[i-1],b=plan.path[i];
  if(Math.max(a[0],b[0])>=r.x-68&&Math.min(a[0],b[0])<=r.x+r.w+68&&Math.max(a[1],b[1])>=r.y-68&&Math.min(a[1],b[1])<=r.y+r.h+68)return false;
 }
 return plan.pads.every(p=>Math.hypot(Math.max(r.x-p.x,0,p.x-r.x-r.w),Math.max(r.y-p.y,0,p.y-r.y-r.h))>=70);
}
export function paintB01Road(c,path){
 const earth=c.createLinearGradient(0,150,180,650);earth.addColorStop(0,'#f1d6a3');earth.addColorStop(.5,'#e9c38e');earth.addColorStop(1,'#dcb07b');
 for(const [width,color] of [[120,'#476c51'],[114,'#788466'],[109,'#aa8564'],[103,'#d9ab77'],[96,earth],[78,'#f6dbad38'],[56,'#fff0cd18']])stroke(c,path,color,width);
}
function paintRoadDetails(c,path){
 const r=rng(704);
 for(let i=1;i<path.length-1;i+=2){const p=path[i],q=path[i+1],dx=q[0]-p[0],dy=q[1]-p[1],len=Math.hypot(dx,dy)||1;
  for(const side of [-1,1]){const d=53+r()*6,x=p[0]-dy/len*d*side,y=p[1]+dx/len*d*side;
   c.save();c.translate(x,y);c.rotate(Math.atan2(dy,dx));c.fillStyle=i%4?'#d2c7a1':'#8d977c';c.strokeStyle='#65765a';c.lineWidth=.7;c.beginPath();c.roundRect(-3,-2,5+r()*4,3+r()*2,1.4);c.fill();c.stroke();c.restore();}
 }
 for(let i=0;i<2100;i++){const k=Math.floor(r()*(path.length-1)),p=path[k],q=path[k+1],dx=q[0]-p[0],dy=q[1]-p[1],len=Math.hypot(dx,dy)||1,d=(r()-.5)*87;
  ellipse(c,p[0]-dy/len*d,p[1]+dx/len*d,1+r()*4,.4+r(),i%3?'#a5814d27':'#fff1c73a');
 }
}
// Retains the exact R7 pad drawing, including seeds, dimensions and local decoration.
function pads(c,plan){
 for(const [i,p] of plan.pads.entries()){
  const x=p.x,y=p.y;
  ellipse(c,x+4,y+15,43,22,'#335d567c');
  ellipse(c,x,y+8,44,23,'#506d65');
  ellipse(c,x,y+2,42,22,'#a1b1a3');
  ellipse(c,x,y-4,39,20,'#f4dca6');
  ellipse(c,x,y-5,32,16,'#e6ce98');
  c.beginPath();c.ellipse(x,y-5,34,17,0,0,TWO);
  c.lineWidth=1.5;c.strokeStyle='#806f58';c.stroke();
  const r=rng(35+i*51);
  for(let k=0;k<24;k++){
   const angle=r()*TWO,d=28+r()*11;
   ellipse(c,x+Math.cos(angle)*d,y-4+Math.sin(angle)*d*.49,
    1+r()*3,1+r()*2,k%3?'#f1e8ce':'#758f87');
  }
  poly(c,[[x,y-14],[x+10,y-5],[x,y+3],[x-10,y-5]],
   '#efe8ca','#85775e',1.2);
  ellipse(c,x,y-5,3.2,2.2,'#83c4c6');
 }
}
export function makeB01MapCanvas(map,{density=2,scenic=false,terrainOnly=false}={}){
 if(!sources||![1,2].includes(density))throw Error('B01 browser art sources unavailable');
 const plan=makeB01MapPlan(map),cvs=canvas(1280*density,768*density),c=cvs.getContext('2d',{alpha:false});c.scale(density,density);
 const [terrain,atlas]=sources,props=extractProps(atlas);
 // Canonical lower pads remain on grass: rocky river bank begins below y=650.
 c.drawImage(terrain,0,0,terrain.width,680,0,0,1280,650);
 c.drawImage(terrain,0,680,terrain.width,terrain.height-680,0,650,1280,118);
 const prop=(kind,x,y,w,flip=false)=>{
  const image=props[kind],h=w*image.height/image.width,r={kind,x,y,w,h,flip};
  if(!b01PropClearsGeometry(r,plan)){plan.rejected.push(r);return;}
  c.save();if(flip){c.translate(x+w,y);c.scale(-1,1);c.drawImage(image,0,0,w,h);}else c.drawImage(image,x,y,w,h);c.restore();plan.props.push(r);
 };
 if(!scenic&&!terrainOnly){
  for(const [x,y,w,flip] of [[-15,15,155,false],[75,82,178,false],[275,34,145,true],[468,112,108,false]])prop('oak',x,y,w,flip);
  prop('cypress',0,541,42);prop('cypress',437,126,39);
  prop('arch',365,245,145);prop('shrine',1070,75,150);
  prop('waterfall',40,663,95);prop('waterfall',780,662,100);
  for(const [x,y,w] of [[180,280,70],[330,220,60],[492,306,60],[753,455,70],[210,615,75],[485,630,65],[850,570,70],[1218,570,55]])prop('flowers',x,y,w);
 }
 if(!terrainOnly){paintB01Road(c,plan.path);paintRoadDetails(c,plan.path);if(!scenic)pads(c,plan);}
 return {canvas:cvs,plan,qa:{version:B01_ART_VERSION,pathVertices:133,padsRendered:scenic||terrainOnly?0:8,ambientObjects:0,source:'original-terrain-plus-independent-props',props:plan.props}};
}
export function makeB01ScenicPanoramaCanvas(map){return makeB01MapCanvas(map,{density:1,terrainOnly:true}).canvas;}
export function paintB01PanoramaGutters(ctx,r,map){
 const edge=x=>{const i=map.path.findIndex((p,i)=>i<map.path.length-1&&p[0]<=x&&map.path[i+1][0]>=x),a=map.path[i],b=map.path[i+1],slope=(b[1]-a[1])/(b[0]-a[0]);return {y:a[1]+(x-a[0])*slope,slope};};
 const sx=r.width/1280,sy=r.height/768;
 for(const [side,x,extent] of [['left',0,r.left/sx],['right',1280,(r.canvasWidth-r.left-r.width)/sx]]){
  if(extent<=0)continue;const p=edge(x),end=x+(side==='left'?-extent:extent);
  ctx.save();ctx.beginPath();if(side==='left')ctx.rect(0,r.top,r.left,r.height);else ctx.rect(r.left+r.width,r.top,r.canvasWidth-r.left-r.width,r.height);ctx.clip();ctx.translate(r.left,r.top);ctx.scale(sx,sy);
  paintB01Road(ctx,[[x,p.y],[end,p.y+(end-x)*p.slope]]);ctx.restore();
 }
}
