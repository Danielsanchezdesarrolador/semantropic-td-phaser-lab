/** B02 MAP-ART-02: original layered farmland. No gameplay/ambient simulation. */
import {makeM02ArtPlan} from '../farmland-art.mjs';
export const B02_ART_VERSION='b02-m02-pictoric-golden-farmland-v1';
export const B02_ASSETS=Object.freeze({
 terrain:new URL('../../../../art/maps/m02/b02/farmland-terrain-original.png',import.meta.url).href,
 props:new URL('../../../../art/maps/m02/b02/farmland-props-original.png',import.meta.url).href
});
const canvas=(w,h)=>Object.assign(document.createElement('canvas'),{width:w,height:h});
const rng=n=>()=>((n=(Math.imul(n,1664525)+1013904223)>>>0)/4294967296);
const TWO=Math.PI*2;
const ellipse=(c,x,y,rx,ry,color)=>{c.beginPath();c.ellipse(x,y,rx,ry,0,0,TWO);c.fillStyle=color;c.fill();};
function poly(c,pts,color,edge=null,width=1){c.beginPath();c.moveTo(...pts[0]);for(const p of pts.slice(1))c.lineTo(...p);c.closePath();if(color){c.fillStyle=color;c.fill();}if(edge){c.lineWidth=width;c.strokeStyle=edge;c.stroke();}}
const loadImage=url=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(Error('B02 missing original art: '+url));image.src=url;});
// Art-only loading barrier: no changes to combat scene/preloader/CORE are needed.
// M03 imports the M02 scene factory; only the canonical M02 URL needs this art.
const needsM02Art=typeof document!=='undefined'&&new URL(location.href).searchParams.get('map')==='2';
const sources=needsM02Art?await Promise.all(Object.values(B02_ASSETS).map(loadImage)):null;
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
 if(groups.length!==6)throw Error('B02 requires six independent original props');
 const names=['mill','farm','oak','irrigation','cascade','supplies'],result={};
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
  const name=names[row*3+col];if(result[name])throw Error('B02 duplicate atlas slot '+name);result[name]=target;
 }
 propsCache=result;return result;
}
export function makeB02ArtPlan(map){const p=makeM02ArtPlan(map);return {...p,version:B02_ART_VERSION,props:[],rejected:[]};}
export function b02PropClearsGeometry(r,plan){
 for(let i=1;i<plan.path.length;i++){const a=plan.path[i-1],b=plan.path[i];
  if(Math.max(a[0],b[0])>=r.x-62&&Math.min(a[0],b[0])<=r.x+r.w+62&&Math.max(a[1],b[1])>=r.y-62&&Math.min(a[1],b[1])<=r.y+r.h+62)return false;}
 return plan.pads.every(p=>Math.hypot(Math.max(r.x-p.x,0,p.x-r.x-r.w),Math.max(r.y-p.y,0,p.y-r.y-r.h))>=68);
}
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
export function paintB02Road(c,path){
 const contour=roadContour(path),earth=c.createLinearGradient(0,160,80,650);earth.addColorStop(0,'#dfbe88');earth.addColorStop(.5,'#d2b07e');earth.addColorStop(1,'#d8b481');
 c.save();c.shadowColor='#4c4d2e55';c.shadowBlur=5;c.shadowOffsetY=2;poly(c,contour,earth);c.restore();
 c.save();poly(c,contour,null);c.clip();
 if(sources){c.globalAlpha=.16;
  for(const offset of [0,2560]){c.save();c.translate(offset,0);if(offset)c.scale(-1,1);c.drawImage(sources[0],0,0,1536,240,0,0,1280,90);
 c.drawImage(sources[0],0,240,1536,600,0,90,1280,610);c.restore();}
  c.save();c.scale(-1,1);c.drawImage(sources[0],0,0,1536,240,0,0,1280,90);
 c.drawImage(sources[0],0,240,1536,600,0,90,1280,610);c.restore();c.globalAlpha=1;}

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
 // Superficial contact only; the original R6 pad drawing/centres/IDs remain intact.
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
// Original R6 pad drawing, with superficial soil/grass contact only.
const seed=rng,TAU=TWO,polygon=poly;
function pads(ctx,plan){
 for(const [i,pad] of plan.pads.entries()){
  const {x,y}=pad;
  ellipse(ctx,x+4,y+15,44,22,'#35554a80');
  ellipse(ctx,x,y+8,43,24,'#516e68');
  ellipse(ctx,x,y+1,42,23,'#9baca0');
  ellipse(ctx,x,y-4,39,21,'#efdda9');
  ellipse(ctx,x,y-5,32,16,'#ddca98');
  ctx.strokeStyle='#856f57';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y-5,33,16,0,0,TAU);ctx.stroke();
  const r=seed(i*83+11);
  for(let k=0;k<15;k++){
   const ang=r()*TAU,rad=28+r()*10;
   ellipse(ctx,x+Math.cos(ang)*rad,y-4+Math.sin(ang)*rad*.47,1+r()*3,
    1+r()*2,k%2?'#fbebc8':'#a9aea1');
  }
  polygon(ctx,[[x,y-13],[x+10,y-5],[x,y+2],[x-10,y-5]],
   '#f2e4bc','#777459',1.5);
  ellipse(ctx,x,y-5,3.5,2.5,'#6eb0b1');
 }
}
function terrain(c){
 c.drawImage(sources[0],0,0,1536,240,0,0,1280,90);
 c.drawImage(sources[0],0,240,1536,600,0,90,1280,610);
 c.drawImage(sources[0],0,840,1536,184,0,700,1280,68);
}
function farmFences(c,plan){
 for(const [x,y,n] of [[108,170,7],[340,205,6],[1020,654,8]])for(let i=0;i<n;i++){
  const r={kind:'fence',x:x+i*20,y:y+i*.7-14,w:22,h:20};if(!b02PropClearsGeometry(r,plan)){plan.rejected.push(r);continue;}
  c.lineCap='round';c.strokeStyle='#665036';c.lineWidth=3;c.beginPath();c.moveTo(r.x,r.y+18);c.lineTo(r.x,r.y);c.moveTo(r.x,r.y+6);c.lineTo(r.x+20,r.y+6.7);c.moveTo(r.x,r.y+13);c.lineTo(r.x+20,r.y+13.7);c.stroke();
  c.strokeStyle='#cfb782';c.lineWidth=1;c.beginPath();c.moveTo(r.x-1,r.y+16);c.lineTo(r.x-1,r.y);c.moveTo(r.x,r.y+5);c.lineTo(r.x+20,r.y+5.7);c.stroke();plan.props.push(r);
 }
}
export function makeB02ArtCanvas(map,{density=2,scenic=false,terrainOnly=false}={}){
 if(!sources||![1,2].includes(density))throw Error('B02 requires loaded browser sources');
 const plan=makeB02ArtPlan(map),cvs=canvas(1280*density,768*density),c=cvs.getContext('2d',{alpha:false});c.scale(density,density);terrain(c);
 const props=extractProps(sources[1]);
 const prop=(kind,x,y,w,flip=false)=>{const image=props[kind],r={kind,x,y,w,h:w*image.height/image.width,flip};
  if(!b02PropClearsGeometry(r,plan)){plan.rejected.push(r);return;}c.save();if(flip){c.translate(x+w,y);c.scale(-1,1);c.drawImage(image,0,0,w,r.h);}else c.drawImage(image,x,y,w,r.h);c.restore();plan.props.push(r);};
 if(!scenic&&!terrainOnly){
  prop('mill',395,20,230);prop('farm',1130,45,125);
  for(const [x,y,w] of [[10,35,140],[220,18,140],[340,180,110],[745,38,110],[1090,475,130],[25,600,100]])prop('oak',x,y,w);
  prop('irrigation',530,265,140);prop('cascade',1010,687,88);prop('supplies',1090,600,140);
  farmFences(c,plan);
 }
 if(!terrainOnly){paintB02Road(c,plan.path);if(!scenic){padGrounding(c,plan);pads(c,plan);padGrass(c,plan);}}
 return {canvas:cvs,plan,qa:{version:B02_ART_VERSION,width:cvs.width,height:cvs.height,padsRendered:scenic||terrainOnly?0:8,routeVertices:163,roadWidth:84,props:plan.props,rejected:plan.rejected}};
}
export function paintB02Gutters(ctx,r,map){
 const sx=r.width/1280,sy=r.height/768;
 for(const side of ['left','right']){
  const width=side==='left'?r.left:r.canvasWidth-r.left-r.width;if(width<=0)continue;
  ctx.save();ctx.beginPath();ctx.rect(side==='left'?0:r.left+r.width,r.top,width,r.height);ctx.clip();ctx.translate(r.left,r.top);ctx.scale(sx,sy);
  ctx.save();if(side==='right')ctx.translate(2560,0);ctx.scale(-1,1);terrain(ctx);ctx.restore();paintB02Road(ctx,map.path);ctx.restore();
 }
}
