/** M03 original layered forest. World coordinates remain the protected V5 route/pads.
 * Original generated prop source is segmented once at load, never a flattened map.
 */
import {projectMapSocket} from '../../core-c1d/map-sockets.mjs';
import {validateM03Map} from '../../core-c1d/m03-campaign.mjs';
export const M03_ART_VERSION='m03-cartoon01-enchanted-forest-v1';
export const M03_TERRAIN_URL=new URL('../../../art/maps/m03/forest-terrain-original.png',import.meta.url).href;
export const M03_PROP_URL=new URL('../../../art/maps/m03/forest-props-original.png',import.meta.url).href;
const canvas=(w,h)=>Object.assign(document.createElement('canvas'),{width:w,height:h});
let propCache;
export function extractForestProps(image){
 if(propCache)return propCache;
 const c=canvas(image.width,image.height),ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0);
 const source=ctx.getImageData(0,0,c.width,c.height),a=source.data,w=c.width,h=c.height;
 const labels=new Int32Array(w*h),queue=new Int32Array(w*h),groups=[];let label=0;
 for(let p=0;p<labels.length;p++){
  if(labels[p]||a[p*4+3]<32)continue;
  label++;let head=0,tail=1;queue[0]=p;labels[p]=label;
  let left=w,right=0,top=h,bottom=0;
  while(head<tail){const q=queue[head++],x=q%w,y=Math.floor(q/w);
   left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);
   for(const n of [x>0?q-1:-1,x<w-1?q+1:-1,y>0?q-w:-1,y<h-1?q+w:-1]){
    if(n>=0&&!labels[n]&&a[n*4+3]>=32){labels[n]=label;queue[tail++]=n;}
   }
  }
  if(tail>10000)groups.push({label,left,right,top,bottom,count:tail});
 }
 if(groups.length!==6)throw Error('M03 original atlas: expected six independent props');
 const out={};
 for(const g of groups){
  const left=Math.max(0,g.left-2),top=Math.max(0,g.top-2),pw=Math.min(w-1,g.right+2)-left+1,ph=Math.min(h-1,g.bottom+2)-top+1;
  const target=canvas(pw,ph),t=target.getContext('2d'),pixels=t.createImageData(pw,ph);
  for(let y=0;y<ph;y++)for(let x=0;x<pw;x++){
   const sx=left+x,sy=top+y,p=sy*w+sx;let own=labels[p]===g.label;
   if(!own&&!labels[p])for(let dy=-2;dy<=2&&!own;dy++)for(let dx=-2;dx<=2;dx++){
    const nx=sx+dx,ny=sy+dy;if(nx>=0&&nx<w&&ny>=0&&ny<h&&labels[ny*w+nx]===g.label){own=true;break;}
   }
   if(own)for(let k=0;k<4;k++)pixels.data[(y*pw+x)*4+k]=a[p*4+k];
  }
  t.putImageData(pixels,0,0);
  const col=Math.min(2,Math.floor(((g.left+g.right)/2)/512)),row=g.top>550?1:0;
  out[['oak','tree','ruins','waterfall','undergrowth','beacon'][row*3+col]]=target;
 }
 propCache=out;return out;
}
export function makeM03ArtPlan(map){
 validateM03Map(map);return Object.freeze({mapId:3,version:M03_ART_VERSION,path:map.path,
  sockets:map.spots.map((_,i)=>projectMapSocket(map,i)),landmarks:[{id:'ancestral-oak',x:622,y:288}],
  geometry:'canonical-188-points-eight-pads',width:1280,height:768});
}
function seedRandom(seed){return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
function trace(ctx,path){ctx.beginPath();path.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));}
export function paintM03Road(ctx,path){
 ctx.lineCap='round';ctx.lineJoin='round';
 for(const [width,color] of [[83,'#385741'],[77,'#8c8752'],[71,'#c6aa70'],[61,'#dfc18a'],[49,'#e8cb94']]){trace(ctx,path);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
}
function rectNearPoint(r,x,y,margin){return Math.hypot(Math.max(r.x-x,0,x-r.x-r.w),Math.max(r.y-y,0,y-r.y-r.h))<margin;}
export function makeM03ArtCanvas(map,image,{density=2,scenic=false,terrainImage}={}){
 const plan=makeM03ArtPlan(map),props=extractForestProps(image),c=canvas(1280*density,768*density),ctx=c.getContext('2d');
 ctx.scale(density,density);const rand=seedRandom(31023);const placed=[],rejected=[];
 const safe=(r)=>!map.path.some(p=>rectNearPoint(r,p[0],p[1],43))&&!plan.sockets.some(p=>rectNearPoint(r,p.world.x,p.world.y,51));
 const prop=(kind,x,y,w,flip=false)=>{
  const img=props[kind],h=w*img.height/img.width,r={x,y,w,h};
  if(!safe(r)){rejected.push({kind,...r});return false;}
  ctx.save();if(flip){ctx.translate(x+w,y);ctx.scale(-1,1);ctx.drawImage(img,0,0,w,h);}else ctx.drawImage(img,x,y,w,h);ctx.restore();placed.push({kind,...r,flip});return true;
 };
 if(!terrainImage)throw Error('M03 original terrain layer missing');
 // Keep the rocky bank below every canonical socket. Source is a ground-only
 // painting, without route/pads/landmarks; those remain independent layers.
 ctx.drawImage(terrainImage,0,0,terrainImage.width,740,0,0,1280,650);
 ctx.drawImage(terrainImage,0,740,terrainImage.width,terrainImage.height-740,0,650,1280,118);
 // Distant forest and multiple original tree instances, all excluded from gameplay.
 if(!scenic){
  for(let x=-65;x<1320;x+=86+rand()*61)prop('tree',x,-119+rand()*62,139+rand()*59,rand()>.5);
  prop('oak',462,-40,320); // focal roots above the route/pad exclusion zone
  prop('ruins',1060,86,137);prop('ruins',118,107,105);
  prop('beacon',838,132,100);prop('beacon',313,127,83);
  prop('tree',-48,396,114);prop('tree',1165,492,130);
  prop('waterfall',510,649,132);
  for(const [x,y,w] of [[197,355,85],[385,310,65],[760,271,75],[893,362,64],[531,548,65],[1098,574,64],[70,572,70],[800,606,57]])prop('undergrowth',x,y,w);
 }
 if(!scenic){
  // A continuous warm trail from exactly the authoritative path samples.
  paintM03Road(ctx,map.path);
  for(let i=0;i<2000;i++){
   const idx=Math.floor(rand()*(map.path.length-1)),p=map.path[idx],q=map.path[idx+1],d=Math.hypot(q[0]-p[0],q[1]-p[1])||1,offset=(rand()-.5)*53;
   const x=p[0]-(q[1]-p[1])/d*offset,y=p[1]+(q[0]-p[0])/d*offset;
   ctx.fillStyle=i%3?'#a2814b24':'#fff1bf40';ctx.beginPath();ctx.ellipse(x,y,1+rand()*4,.4+rand(),-.2,0,Math.PI*2);ctx.fill();
  }
  for(let i=0;i<map.path.length;i+=3){const p=map.path[i],prev=map.path[Math.max(0,i-1)],next=map.path[Math.min(map.path.length-1,i+1)],dx=next[0]-prev[0],dy=next[1]-prev[1],len=Math.hypot(dx,dy)||1;
   for(const side of [-1,1]){const x=p[0]-dy/len*37*side,y=p[1]+dx/len*37*side;ctx.fillStyle=i%2?'#ded7a1':'#aaa77a';ctx.beginPath();ctx.ellipse(x,y,3+rand()*2,2.3,rand(),0,Math.PI*2);ctx.fill();}
   ctx.fillStyle='#b49a642e';ctx.fillRect(p[0]-5,p[1]+4,8,1.2);
  }
  for(const p of plan.sockets){const {x,y}=p.world;
   ctx.fillStyle='#163f4366';ctx.beginPath();ctx.ellipse(x,y+9,40,24,0,0,Math.PI*2);ctx.fill();
   ctx.fillStyle='#657b67';ctx.beginPath();ctx.ellipse(x,y+3,36,25,0,0,Math.PI*2);ctx.fill();
   ctx.fillStyle='#d9c99a';ctx.strokeStyle='#ece3b8';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y-3,35,23,0,0,Math.PI*2);ctx.fill();ctx.stroke();
   ctx.fillStyle='#baa978';ctx.beginPath();ctx.ellipse(x,y-3,29,18,0,0,Math.PI*2);ctx.fill();
   for(let i=0;i<12;i++){const a=i*Math.PI/6;ctx.save();ctx.translate(x+Math.cos(a)*32,y-3+Math.sin(a)*21);ctx.rotate(a);ctx.fillStyle=i%2?'#f1e5ba':'#9d9e7a';ctx.fillRect(-3,-2,6,3);ctx.restore();}
   ctx.strokeStyle='#f2e6b5';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y-11);ctx.lineTo(x+11,y-4);ctx.lineTo(x,y+3);ctx.lineTo(x-11,y-4);ctx.closePath();ctx.stroke();
  }
 }
 // Dappled canopy light and cool mist are baked, not per-frame filters.
 const light=ctx.createRadialGradient(840,185,30,730,260,610);light.addColorStop(0,'#fff3ad27');light.addColorStop(1,'#1b425a00');ctx.fillStyle=light;ctx.fillRect(0,0,1280,768);
 return {canvas:c,plan:{...plan,props:placed,rejected},props};
}
