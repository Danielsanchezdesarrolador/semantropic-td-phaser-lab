/** Static forest terrain, shelves, stream, route and bridge: separate GPU layers. */
import {paintGeometricRoad,makeRoadSpline,roadPoint} from './road-geometry.mjs';
export const STREAM=Object.freeze([[766,-30],[704,110],[720,240],[700,320],[640,390],[600,460],[575,550],[590,615],[620,680],[620,760]].map(Object.freeze));
export const coastY=x=>668+12*Math.sin(x/150)+6*Math.sin(x/57);
export const oval=(c,x,y,rx,ry,fill,edge=null,line=1)=>{c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=fill;c.fill();if(edge){c.strokeStyle=edge;c.lineWidth=line;c.stroke();}};
export const poly=(c,points,fill,edge=null,line=1)=>{c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();c.fillStyle=fill;c.fill();if(edge){c.strokeStyle=edge;c.lineWidth=line;c.stroke();}};
export function distanceToPath(x,y,path){let d=Infinity;for(let i=1;i<path.length;i++){const a=path[i-1],b=path[i],dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)));d=Math.min(d,Math.hypot(x-a[0]-dx*t,y-a[1]-dy*t));}return d;}
export function clears(r,plan){
 if(r.x<0||r.x+r.w>1280)return false;
 if(r.y+r.h>coastY(r.x+r.w/2)-6)return false;
 for(let y=r.y;y<=r.y+r.h+3;y+=4)for(let x=r.x;x<=r.x+r.w+3;x+=4)if(distanceToPath(x,y,plan.path)<50||distanceToPath(x,y,STREAM)<36)return false;
 return plan.sockets.every(p=>Math.hypot(Math.max(r.x-p.x,0,p.x-r.x-r.w),Math.max(r.y-p.y,0,p.y-r.y-r.h))>=58);
}
const rng=n=>()=>((n=(Math.imul(n,1664525)+1013904223)>>>0)/4294967296);
const trace=(c,path)=>{const s=makeRoadSpline(path);c.beginPath();c.moveTo(...s[0].start);for(const p of s)c.bezierCurveTo(...p.c1,...p.c2,...p.end);};
export function makeForestSurfaces(plan,a){
 const bounds={coast:{x:0,y:638,width:1280,height:130},stream:{x:534,y:0,width:268,height:748},bridge:{x:650,y:390,width:180,height:180}};
 const layer=(paint,b={x:0,y:0,width:1280,height:768})=>{const v=Object.assign(document.createElement('canvas'),{width:b.width*2,height:b.height*2}),c=v.getContext('2d');c.scale(2,2);c.translate(-b.x,-b.y);c.imageSmoothingQuality='high';paint(c);return v;};
 function grass(c){c.fillStyle='#9ed13c';c.fillRect(0,0,1280,768);
  const tile=Object.assign(document.createElement('canvas'),{width:2560,height:800}),t=tile.getContext('2d');t.scale(2,2);t.imageSmoothingQuality='high';t.drawImage(a.materials,0,260,1536,480,0,0,1280,400);t.globalCompositeOperation='destination-in';const g=t.createLinearGradient(0,0,0,400);for(const[p,color]of[[0,'#0000'],[.08,'#000'],[.92,'#000'],[1,'#0000']])g.addColorStop(p,color);t.fillStyle=g;t.fillRect(0,0,1280,400);for(const y of[-35,325,685])c.drawImage(tile,0,y,1280,400);
  // Clearings remain bright; dark under-canopy masses are terrain, not fog.
  const random=rng(304);for(let i=0;i<90;i++){const x=random()*1280,y=random()*630;if(distanceToPath(x,y,plan.path)>73&&plan.sockets.every(p=>Math.hypot(x-p.x,y-p.y)>80))oval(c,x,y,15+random()*30,6+random()*11,i%3?'#3e933826':'#e5ee6b28');}
 }
 function rockEdge(c,edge,height,taper=false){
  const heightAt=x=>taper?height*Math.sin(Math.PI*Math.max(.001,Math.min(.999,(x-edge[0][0])/(edge.at(-1)[0]-edge[0][0]))))**.65:height;
  poly(c,[...edge,...edge.slice().reverse().map(([x,y])=>[x,y+heightAt(x)])],'#6d7860','#364e40',2);
  const motif=a.cliffs.width/3,scale=height/390,span=motif*.76*scale;
  for(let start=edge[0][0],i=0;start<edge.at(-1)[0];start+=span,i++)for(let x=start;x<Math.min(start+span,edge.at(-1)[0]);x+=.5){const j=Math.max(0,edge.findIndex((p,k)=>k<edge.length-1&&p[0]<=x&&edge[k+1][0]>=x)),p=edge[j],q=edge[j+1],y=p[1]+(x-p[0])/(q[0]-p[0])*(q[1]-p[1]);c.drawImage(a.cliffs,(i%3)*motif+motif*.12+(x-start)/scale,145,.5/scale,390,x,y-3,.5,heightAt(x)+3);}
  c.beginPath();edge.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));for(const[color,w]of[['#345631',4],['#c0dd55',1.6]]){c.strokeStyle=color;c.lineWidth=w;c.stroke();}
 }
 const base=layer(grass),shelves=layer(c=>{
  // Small non-traversal ledges beneath authored forest groups, never under route/pads.
  for(const[x,y,w,h]of[[20,218,165,27],[355,224,260,34],[1000,201,270,35],[36,573,190,29],[460,609,90,28],[1130,593,140,30]]){const edge=[];for(let dx=0;dx<=w;dx+=10)edge.push([x+dx,y-12+12*Math.sin(Math.PI*dx/w)+2*Math.sin(dx/20)]);rockEdge(c,edge,h,true);}
 });
 const coast=layer(c=>{const edge=[];for(let x=-10;x<=1290;x+=10)edge.push([x,coastY(x)]);poly(c,[...edge,[1290,800],[-10,800]],'#10bddd');rockEdge(c,edge,61);c.save();poly(c,[...edge.map(([x,y])=>[x,y+61]),[1290,800],[-10,800]],'#0daed4');c.clip();c.drawImage(a.materials,0,752,1536,272,0,660,1280,227);c.restore();for(let x=0;x<1280;x+=30)oval(c,x,coastY(x)+63,18,2,'#d3fcf2');},bounds.coast);
 const stream=layer(c=>{c.save();poly(c,[[520,-40],[810,-40],[810,coastY(810)],[750,coastY(750)],[690,coastY(690)],[630,coastY(630)],[570,coastY(570)],[520,coastY(520)]],'#0000');c.clip();trace(c,STREAM);c.lineCap='round';for(const[color,w]of[['#436735',62],['#c4b87b',56],['#167ea3',47],['#1cc5df',42]]){c.strokeStyle=color;c.lineWidth=w;c.stroke();}
  const random=rng(85);for(let i=0;i<100;i++){const y=random()*660;let index=STREAM.findIndex((p,j)=>j<STREAM.length-1&&p[1]<=y&&STREAM[j+1][1]>=y);if(index<0)continue;const p=STREAM[index],q=STREAM[index+1],x=p[0]+(y-p[1])/(q[1]-p[1])*(q[0]-p[0]);oval(c,x+(random()-.5)*28,y,3+random()*5,.9,i%4?'#8aeaf0':'#e3ffff');}
  c.restore();const y=coastY(620);poly(c,[[600,y-6],[637,y-6],[642,y+61],[602,y+61]],'#40d7e9');for(const x of[605,615,629,636]){c.fillStyle='#d0fff7';c.fillRect(x,y-2,2,58);}oval(c,621,y+62,29,4,'#effff4');
 },bounds.stream);
 const route=layer(c=>paintGeometricRoad(c,plan.path));
 const cross=plan.path.reduce((best,p,i)=>{const d=distanceToPath(...p,STREAM);return d<best.d?{p,i,d}:best;},{d:Infinity}),prev=plan.path[cross.i-1],next=plan.path[cross.i+1],angle=Math.atan2(next[1]-prev[1],next[0]-prev[0]);
 bounds.bridge={x:Math.floor(cross.p[0]-90),y:Math.floor(cross.p[1]-90),width:180,height:180};
 // Curved bridge shares the road centerline and exact lane width. Offset rails
 // avoid the curve-cutting corner posts of a rigid rotated rectangle.
 const lane=[];for(const seg of makeRoadSpline(plan.path))for(let n=0;n<8;n++){const t=n/8,p=roadPoint(seg,t);if(Math.hypot(p[0]-cross.p[0],p[1]-cross.p[1])>60)continue;const a=roadPoint(seg,Math.max(0,t-.001)),b=roadPoint(seg,Math.min(1,t+.001)),length=Math.hypot(b[0]-a[0],b[1]-a[1]);lane.push({x:p[0],y:p[1],nx:-(b[1]-a[1])/length,ny:(b[0]-a[0])/length});}
 const bridge=layer(c=>{
  c.lineCap='butt';c.lineJoin='round';c.beginPath();lane.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));for(const[color,width]of[['#665033',62],['#dfa85c',59]]){c.strokeStyle=color;c.lineWidth=width;c.stroke();}
  let spacing=0;for(let i=1;i<lane.length;i++){const p=lane[i];spacing+=Math.hypot(p.x-lane[i-1].x,p.y-lane[i-1].y);if(spacing<8)continue;spacing=0;c.beginPath();c.moveTo(p.x-p.nx*29,p.y-p.ny*29);c.lineTo(p.x+p.nx*29,p.y+p.ny*29);c.strokeStyle='#795333';c.lineWidth=1.2;c.stroke();}
  for(const side of[-1,1]){
   for(const p of[lane[0],lane.at(-1)]){c.beginPath();c.moveTo(p.x+p.nx*30*side,p.y+p.ny*30*side);c.lineTo(p.x+p.nx*42*side,p.y+p.ny*42*side);c.strokeStyle='#775330';c.lineWidth=6;c.stroke();}
   c.beginPath();lane.forEach((p,i)=>i?c.lineTo(p.x+p.nx*42*side,p.y+p.ny*42*side):c.moveTo(p.x+p.nx*42*side,p.y+p.ny*42*side));for(const[color,width]of[['#514830',5],['#d99c4a',2.5]]){c.strokeStyle=color;c.lineWidth=width;c.stroke();}
   for(const p of[lane[0],lane.at(-1)]){const x=p.x+p.nx*42*side,y=p.y+p.ny*42*side;oval(c,x,y+1,5,3,'#6c6c4c');c.fillStyle='#d8c695';c.strokeStyle='#686346';c.lineWidth=1;c.fillRect(x-3,y-7,6,8);c.strokeRect(x-3,y-7,6,8);oval(c,x,y-7,4,2,'#f7e5b4','#686346',1);}
  }
 },bounds.bridge);
 const pad=layer(c=>{const x=52,y=40;oval(c,x+2,y+10,45,24,'#34553066');oval(c,x,y+5,41,24,'#6d7960','#354c3a',2);oval(c,x,y-2,41,23,'#a69a70','#5d6042',2);oval(c,x,y-6,39,21,'#f6dca4','#6f6342',1.8);oval(c,x,y-7,31,16,'#ffe8b6','#aa8e58',1);for(let i=0;i<10;i++){const a=i*Math.PI/5;c.beginPath();c.moveTo(x+Math.cos(a)*32,y-6+Math.sin(a)*16);c.lineTo(x+Math.cos(a)*38,y-6+Math.sin(a)*20);c.strokeStyle='#9e8451';c.lineWidth=1.3;c.stroke();}poly(c,[[x,y-14],[x+10,y-7],[x,y],[x-10,y-7]],'#ae8a51','#78613e',1.3);poly(c,[[x,y-11],[x+5,y-7],[x,y-3],[x-5,y-7]],'#fff3cf');},{x:0,y:0,width:104,height:80});
 return{layers:{base,shelves,coast,stream,route,bridge},bounds,pad,bridge:{x:cross.p[0],y:cross.p[1],angle,deckLength:120,deckWidth:62,railOffset:42,lane,bankDistance:cross.d}};
}
