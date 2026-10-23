/** B01 MAP-ART-01: original painted scenery, no gameplay or environmental simulation.
 * Protected R7 plan and pads remain authoritative; the reference layout is never used.
 */
import {makeR7MapPlan} from '../r7/dawn-plateau-art.mjs';
export const B01_ART_VERSION='m01-path01-integrated-meadow-v1';
export const B01_ASSETS=Object.freeze({
 terrain:new URL('../../../../art/maps/m01/b01/meadow-terrain-original.png',import.meta.url).href,
 props:new URL('../../../../art/maps/m01/b01/meadow-props-original.png',import.meta.url).href
});
const canvas=(w,h)=>Object.assign(document.createElement('canvas'),{width:w,height:h});
const rng=n=>()=>((n=(Math.imul(n,1664525)+1013904223)>>>0)/4294967296);
const TWO=Math.PI*2;
const ellipse=(c,x,y,rx,ry,color)=>{c.beginPath();c.ellipse(x,y,rx,ry,0,0,TWO);c.fillStyle=color;c.fill();};
function poly(c,pts,color,edge=null,width=1){c.beginPath();c.moveTo(...pts[0]);for(const p of pts.slice(1))c.lineTo(...p);c.closePath();if(color){c.fillStyle=color;c.fill();}if(edge){c.lineWidth=width;c.strokeStyle=edge;c.stroke();}}
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
// MAP-PATH-01: visual contour only. The canonical plan/navigation never changes.
export const M01_PATH_FINISH=Object.freeze({previousWidth:120,nominalWidth:84,widthRange:[78,90],clearCenter:52});
function roadContour(path){
 const pts=path.map((p,i)=>i&&i<path.length-1?[(path[i-1][0]+p[0]*6+path[i+1][0])/8,(path[i-1][1]+p[1]*6+path[i+1][1])/8]:[...p]);
 // Extend the same tangent into non-interactive gutters; identical world-space paint at each seam.
 for(const side of [-1,1]){const a=side<0?pts[0]:pts.at(-1),b=side<0?pts[1]:pts.at(-2),len=Math.hypot(a[0]-b[0],a[1]-b[1]);
  const end=[a[0]+(a[0]-b[0])/len*2400,a[1]+(a[1]-b[1])/len*2400];if(side<0)pts.unshift(end);else pts.push(end);}
 const center=[];
 for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/4);for(let k=0;k<n;k++)center.push([a[0]+(b[0]-a[0])*k/n,a[1]+(b[1]-a[1])*k/n]);}center.push(pts.at(-1));
 const edges=[[],[]];
 for(let i=0;i<center.length;i++){const p=center[i],a=center[Math.max(0,i-2)],b=center[Math.min(center.length-1,i+2)],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy)||1;
  for(let side=0;side<2;side++){const d=(side?1:-1)*(42+2*Math.sin(p[0]*.031+p[1]*.019+side*2)+Math.sin(p[0]*.11-p[1]*.07));edges[side].push([p[0]-dy/len*d,p[1]+dx/len*d]);}}
 return [...edges[0],...edges[1].reverse()];
}
let soilPattern;
function soilTile(){
 if(soilPattern)return soilPattern;const tile=canvas(256,256),c=tile.getContext('2d'),r=rng(1701);
 // Multiscale, irregular grain: no dashed lane or regularly repeated kerbstones.
 for(let i=0;i<420;i++){const x=r()*256,y=r()*256,rad=3+r()*19,g=c.createRadialGradient(x,y,0,x,y,rad);g.addColorStop(0,i%2?'#815c3310':'#fff0bd18');g.addColorStop(1,'#ba965f00');c.fillStyle=g;c.fillRect(x-rad,y-rad,rad*2,rad*2);}
 for(let i=0;i<3800;i++)ellipse(c,r()*256,r()*256,.25+r()*1.25,.2+r()*.7,i%3?'#785c3b25':'#fff1c34a');
 for(let i=0;i<95;i++){const x=r()*256,y=r()*256;ellipse(c,x,y+1,1+r()*2,.8,'#795e4339');ellipse(c,x,y,1+r()*2,.7,i%2?'#dcccaa99':'#a28c6870');}
 soilPattern=tile;return tile;
}
export function paintB01Road(c,path){
 const contour=roadContour(path),earth=c.createLinearGradient(0,160,80,650);earth.addColorStop(0,'#dfbe88');earth.addColorStop(.5,'#d2b07e');earth.addColorStop(1,'#d8b481');
 c.save();c.shadowColor='#4c4d2e55';c.shadowBlur=5;c.shadowOffsetY=2;poly(c,contour,earth);c.restore();
 c.save();poly(c,contour,null);c.clip();
 if(sources){c.globalAlpha=.16;
  for(const offset of [0,2560]){c.save();c.translate(offset,0);if(offset)c.scale(-1,1);c.drawImage(sources[0],0,0,1536,680,0,0,1280,650);c.restore();}
  c.save();c.scale(-1,1);c.drawImage(sources[0],0,0,1536,680,0,0,1280,650);c.restore();c.globalAlpha=1;}

 c.fillStyle=c.createPattern(soilTile(),'repeat');c.fillRect(-3000,-3000,7500,7500);c.restore();
 // Broken low grass and embedded stones soften the edge, staying outside the clear center.
 const r=rng(8001);
 for(let i=0;i<contour.length;i+=3){const p=contour[i];if(p[0]<-500||p[0]>1780||p[1]<0||p[1]>768)continue;
  if(r()<.55){const x=p[0]+(r()-.5)*4,y=p[1]+(r()-.5)*4;ellipse(c,x,y,2+r()*3,.5+r()*1.2,'#66744150');
   for(let k=0;k<4;k++){const h=2+r()*5,bx=x+(r()-.5)*7;c.beginPath();c.moveTo(bx-1,y+1);c.quadraticCurveTo(bx-1,y-h/2,bx+(r()-.5)*6,y-h);c.quadraticCurveTo(bx+2,y-h/3,bx+1,y+1);c.fillStyle=k%2?'#a4ac63ae':'#687c4990';c.fill();}}
  else if(r()<.3){ellipse(c,p[0],p[1]+1,2+r()*2,1.1,'#665f4240');ellipse(c,p[0],p[1],2+r()*3,1.2,'#c9be9dbb');}
 }
}
function padGrounding(c,plan){
 // Superficial contact only; the original R7 pad drawing/centres/IDs remain intact.
 for(const p of plan.pads){
  const g=c.createRadialGradient(p.x+3,p.y+7,18,p.x+3,p.y+7,52);g.addColorStop(0,'#78684355');g.addColorStop(.65,'#9d8b5540');g.addColorStop(1,'#9d8b5500');
  c.save();c.beginPath();c.ellipse(p.x+3,p.y+7,52,30,0,0,TWO);c.clip();c.fillStyle=g;c.fillRect(p.x-52,p.y-25,110,64);c.restore();
 }
}
function padGrass(c,plan){
 for(const [i,p] of plan.pads.entries()){const r=rng(910+i);
  for(const side of [-1,1])for(let k=0;k<6;k++){const x=p.x+side*(32+r()*11),y=p.y+12+r()*6,h=2+r()*4;
   c.beginPath();c.moveTo(x-1,y);c.quadraticCurveTo(x-2,y-2,x+(r()-.5)*5,y-h);c.lineTo(x+1,y);c.fillStyle=k%2?'#84915cbb':'#63764bb0';c.fill();}
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
 if(!terrainOnly){paintB01Road(c,plan.path);if(!scenic){padGrounding(c,plan);pads(c,plan);padGrass(c,plan);}}
 return {canvas:cvs,plan,qa:{version:B01_ART_VERSION,pathVertices:133,padsRendered:scenic||terrainOnly?0:8,ambientObjects:0,source:'original-terrain-plus-independent-props',props:plan.props}};
}
export function makeB01ScenicPanoramaCanvas(map){return makeB01MapCanvas(map,{density:1,terrainOnly:true}).canvas;}
export function paintB01PanoramaGutters(ctx,r,map){
 const sx=r.width/1280,sy=r.height/768;
 for(const [side,extent] of [['left',r.left/sx],['right',(r.canvasWidth-r.left-r.width)/sx]]){
  if(extent<=0)continue;
  ctx.save();ctx.beginPath();if(side==='left')ctx.rect(0,r.top,r.left,r.height);else ctx.rect(r.left+r.width,r.top,r.canvasWidth-r.left-r.width,r.height);ctx.clip();ctx.translate(r.left,r.top);ctx.scale(sx,sy);
  paintB01Road(ctx,map.path);ctx.restore();
 }
}
