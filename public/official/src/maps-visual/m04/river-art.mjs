/** B04 MAP-ART-04. Pure visual geometry, static original scenery. No gameplay. */
export const B04_ART_VERSION='b04-m04-ancient-river-pictoric-v1';
export const B04_ASSETS=Object.freeze({
 terrain:new URL('../../../art/maps/m04/river-terrain-original.png',import.meta.url).href,
 props:new URL('../../../art/maps/m04/ancient-river-props-original.png',import.meta.url).href,
 water:new URL('../../../art/maps/m04/river-water-original.png',import.meta.url).href,
 bridge:new URL('../../../art/maps/m04/stone-bridge-original.png',import.meta.url).href
});
const canvas=(w,h)=>Object.assign(document.createElement('canvas'),{width:w,height:h});
const rng=n=>()=>((n=(Math.imul(n,1664525)+1013904223)>>>0)/4294967296);
const TWO=Math.PI*2;
const ellipse=(c,x,y,rx,ry,color)=>{c.beginPath();c.ellipse(x,y,rx,ry,0,0,TWO);c.fillStyle=color;c.fill();};
function poly(c,pts,color,edge=null,width=1){c.beginPath();c.moveTo(...pts[0]);for(const p of pts.slice(1))c.lineTo(...p);c.closePath();if(color){c.fillStyle=color;c.fill();}if(edge){c.lineWidth=width;c.strokeStyle=edge;c.stroke();}}
const loadImage=url=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(Error('B04 missing original art: '+url));image.src=url;});
// Art-only loading barrier: no changes to combat scene/preloader/CORE are needed.
const sources=typeof document==='undefined'?null:await Promise.all(Object.values(B04_ASSETS).map(loadImage));
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
 if(groups.length!==6)throw Error('B04 requires six independent original props');
 const names=['arch','statue','oak','cascade','columns','shrine'],result={};
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
  const name=names[row*3+col];if(result[name])throw Error('B04 duplicate atlas slot '+name);result[name]=target;
 }
 propsCache=result;return result;
}
export function makeM04ArtPlan(map){
 if(map?.id!==4||map.name!=='Río de los Antiguos'||map.biome!=='ancient_river'||map.path?.length!==262||map.spots?.length!==9||map.decor?.river_path?.length<2||map.decor?.bridge_centers?.length!==2)throw Error('M04 canonical art contract invalid');
 return {version:B04_ART_VERSION,path:map.path.map(p=>[...p]),river:map.decor.river_path.map(p=>[...p]),bridges:map.decor.bridge_centers.map(p=>[...p]),pads:map.spots.map((p,i)=>({index:i,id:'m04-pad-'+String(i+1).padStart(2,'0'),x:p.cx*64+32,y:p.cy*64+32})),scenicChannels:[[[235,389],[245,470],[235,570],[210,665],[210,735]],[[1090,335],[1115,460],[1135,560],[1150,650],[1180,735]]],props:[],rejected:[]};
}
export function b04PropClearsGeometry(r,plan){
 const clearLine=line=>{for(let i=1;i<line.length;i++){const a=line[i-1],b=line[i];if(Math.max(a[0],b[0])>=r.x-60&&Math.min(a[0],b[0])<=r.x+r.w+60&&Math.max(a[1],b[1])>=r.y-60&&Math.min(a[1],b[1])<=r.y+r.h+60)return false;}return true;};
 const foot=[r.x+r.w/2,r.y+r.h];
 const onWater=r.kind!=='cascade'&&[plan.river,...plan.scenicChannels].some(line=>line.some((p,i)=>{if(!i)return false;const a=line[i-1],dx=p[0]-a[0],dy=p[1]-a[1],t=Math.max(0,Math.min(1,((foot[0]-a[0])*dx+(foot[1]-a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(foot[0]-a[0]-dx*t,foot[1]-a[1]-dy*t)<64;}));
 return !onWater&&clearLine(plan.path)&&plan.pads.every(p=>Math.hypot(Math.max(r.x-p.x,0,p.x-r.x-r.w),Math.max(r.y-p.y,0,p.y-r.y-r.h))>=62);
}
function roadContour(path,halfWidth=42,extend=true){
 const pts=path.map((p,i)=>i&&i<path.length-1?[(path[i-1][0]+p[0]*6+path[i+1][0])/8,(path[i-1][1]+p[1]*6+path[i+1][1])/8]:[...p]);
 // Extend the same tangent into non-interactive gutters; identical world-space paint at each seam.
 if(extend)for(const side of [-1,1]){const a=side<0?pts[0]:pts.at(-1),b=side<0?pts[1]:pts.at(-2),len=Math.hypot(a[0]-b[0],a[1]-b[1]);
  const end=[a[0]+(a[0]-b[0])/len*2400,a[1]+(a[1]-b[1])/len*2400];if(side<0)pts.unshift(end);else pts.push(end);}
 const center=[];
 for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/4);for(let k=0;k<n;k++)center.push([a[0]+(b[0]-a[0])*k/n,a[1]+(b[1]-a[1])*k/n]);}center.push(pts.at(-1));
 const edges=[[],[]];
 for(let i=0;i<center.length;i++){const p=center[i],a=center[Math.max(0,i-2)],b=center[Math.min(center.length-1,i+2)],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy)||1;
  for(let side=0;side<2;side++){const d=(side?1:-1)*(halfWidth+2*Math.sin(p[0]*.031+p[1]*.019+side*2)+Math.sin(p[0]*.11-p[1]*.07));edges[side].push([p[0]-dy/len*d,p[1]+dx/len*d]);}}
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
export function paintB04Road(c,path){
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
// These are painted platform markers, no construction or input implementation.
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
 c.drawImage(sources[0],0,0,1536,800,0,0,1280,690);
 c.drawImage(sources[0],0,800,1536,224,0,690,1280,78);
}
function trace(c,path,width,fill){c.beginPath();c.lineJoin='round';c.lineCap='round';path.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.lineWidth=width;c.strokeStyle=fill;c.stroke();}
let waterTile,bankTile;
function river(c,plan){
 if(!waterTile){waterTile=canvas(768,768);const wc=waterTile.getContext('2d');for(const x of [0,1])for(const y of [0,1]){wc.save();wc.translate(x?768:0,y?768:0);wc.scale(x?-1:1,y?-1:1);wc.drawImage(sources[2],0,0,384,384);wc.restore();}bankTile=canvas(1280,60);bankTile.getContext('2d').drawImage(sources[0],0,795,1536,65,0,0,1280,60);}
 poly(c,roadContour(plan.river,71,false),'#416d5860');poly(c,roadContour(plan.river,66,false),c.createPattern(bankTile,'repeat'));poly(c,roadContour(plan.river,55,false),'#44898a');poly(c,roadContour(plan.river,52,false),c.createPattern(waterTile,'repeat'));
 const r=rng(4104);
 for(let i=1;i<plan.river.length-1;i+=2){const p=plan.river[i],q=plan.river[i+1],dx=q[0]-p[0],dy=q[1]-p[1],len=Math.hypot(dx,dy)||1;
  for(const side of [-1,1]){const x=p[0]-dy/len*58*side,y=p[1]+dx/len*58*side,box={x:x-8,y:y-7,w:16,h:14};if(!b04PropClearsGeometry(box,plan))continue;
   ellipse(c,x+2,y+2,7+r()*5,3+r()*2,'#415c5760');poly(c,[[x-7,y],[x-3,y-6],[x+6,y-5],[x+8,y+1],[x,y+4]],'#b3b79a','#687a6a',.7);
   if(i%3){c.strokeStyle='#5d8d5a';c.lineWidth=1;for(let k=0;k<3;k++){c.beginPath();c.moveTo(x+k*2,y-3);c.quadraticCurveTo(x-1+k*2,y-10,x-3+k*3,y-13-r()*3);c.stroke();}}
  }
 }
}
let bridgeCrop;
function bridgeSprite(){
 if(bridgeCrop)return bridgeCrop;const image=sources[3],cv=canvas(image.width,image.height),c=cv.getContext('2d',{willReadFrequently:true});c.drawImage(image,0,0);const data=c.getImageData(0,0,cv.width,cv.height).data;let x0=cv.width,y0=cv.height,x1=0,y1=0;
 for(let y=0;y<cv.height;y++)for(let x=0;x<cv.width;x++)if(data[(y*cv.width+x)*4+3]>32){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
 bridgeCrop={image,x:x0,y:y0,w:x1-x0+1,h:y1-y0+1};return bridgeCrop;
}
function bridges(c,plan){
 const result=[],sprite=bridgeSprite();
 for(const center of plan.bridges){
  const near=plan.path.reduce((best,p,i)=>Math.hypot(p[0]-center[0],p[1]-center[1])<best.d?{i,d:Math.hypot(p[0]-center[0],p[1]-center[1])}:best,{d:Infinity,i:0});
  const a=plan.path[Math.max(0,near.i-2)],b=plan.path[Math.min(plan.path.length-1,near.i+2)];let angle=Math.atan2(b[1]-a[1],b[0]-a[0]);if(angle<0)angle+=Math.PI;
  c.save();c.translate(...center);c.rotate(angle-Math.PI/2);c.drawImage(sprite.image,sprite.x,sprite.y,sprite.w,sprite.h,-58,-91,116,182);c.restore();
  result.push({center:[...center],angle,length:182,width:116,clearCenter:60});
 }
 return result;
}
export function makeM04ArtCanvas(map,{density=2,scenic=false,baseline=false}={}){
 if(!sources||![1,2].includes(density))throw Error('M04 art requires browser sources');
 const plan=makeM04ArtPlan(map),cvs=canvas(1280*density,768*density),c=cvs.getContext('2d',{alpha:false});c.scale(density,density);
 if(baseline){c.fillStyle='#a8bf98';c.fillRect(0,0,1280,768);trace(c,plan.river,104,'#5299ad');trace(c,plan.path,84,'#d7bc8e');pads(c,plan);return {canvas:cvs,plan,qa:{baseline:'canonical geometry diagram, not prior Phaser art'}};}
 terrain(c);for(const channel of plan.scenicChannels)river(c,{...plan,river:channel});river(c,plan);const atlas=extractProps(sources[1]);
 const prop=(kind,x,y,w,flip=false)=>{const image=atlas[kind],r={kind,x,y,w,h:w*image.height/image.width,flip};if(!b04PropClearsGeometry(r,plan)){plan.rejected.push(r);return;}c.save();if(flip){c.translate(x+w,y);c.scale(-1,1);c.drawImage(image,0,0,w,r.h);}else c.drawImage(image,x,y,w,r.h);c.restore();plan.props.push(r);};
 if(!scenic){
  prop('arch',40,5,100);prop('statue',1180,420,90);prop('shrine',620,105,140);prop('columns',40,500,110);
  for(const [x,y,w] of [[8,430,130],[490,80,115],[730,80,120],[1120,540,135],[30,580,115]])prop('oak',x,y,w);
  prop('cascade',80,665,95);prop('cascade',975,665,100);
 }
 paintB04Road(c,plan.path);const bridgePlan=bridges(c,plan);if(!scenic){padGrounding(c,plan);pads(c,plan);padGrass(c,plan);}
 return {canvas:cvs,plan,qa:{version:B04_ART_VERSION,routeVertices:262,padsRendered:scenic?0:9,roadWidth:84,bridges:bridgePlan,props:plan.props,rejected:plan.rejected,gameplayImplemented:false}};
}
export function mountM04Artwork(scene,map,{baseline=false}={}){
 const art=makeM04ArtCanvas(map,{baseline}),key='maps/m04/ancient-river/art-v1';scene.textures.addCanvas(key,art.canvas);
 const image=scene.add.image(0,0,key).setOrigin(0,0).setDisplaySize(1280,768);
 return {version:B04_ART_VERSION,plan:art.plan,qa:art.qa,textureKey:key,destroy(){image.destroy();scene.textures.remove(key);}};
}
