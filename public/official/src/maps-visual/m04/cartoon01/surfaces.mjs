/** Static river canyon built from independent terrain/relief/water/road/bridges. */
import{makeRoadSpline,roadPoint,paintGeometricRoad,ROAD_WIDTH}from'./road-geometry.mjs';
export const WEST=Object.freeze([[200,402],[155,470],[210,540],[170,620],[205,700],[190,800]].map(Object.freeze));
export const EAST=Object.freeze([[1100,340],[1130,410],[1115,490],[1160,570],[1140,650],[1190,800]].map(Object.freeze));
export const SOURCE=Object.freeze([[690,-30],[720,90],[690,180],[710,260],[704,360]].map(Object.freeze));
export const mainHalfWidth=x=>36+5*Math.sin(x/52)+3*Math.sin(x/29);
export const coastY=x=>715+5*Math.sin(x/140);
export const oval=(c,x,y,rx,ry,fill,edge=null,line=1)=>{c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=fill;c.fill();if(edge){c.strokeStyle=edge;c.lineWidth=line;c.stroke();}};
export const poly=(c,p,fill,edge=null,line=1)=>{c.beginPath();p.forEach((v,i)=>i?c.lineTo(...v):c.moveTo(...v));c.closePath();c.fillStyle=fill;c.fill();if(edge){c.strokeStyle=edge;c.lineWidth=line;c.stroke();}};
export function distanceToPath(x,y,path){let d=Infinity;for(let i=1;i<path.length;i++){const a=path[i-1],b=path[i],dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)));d=Math.min(d,Math.hypot(x-a[0]-dx*t,y-a[1]-dy*t));}return d;}
export const riverY=(x,path)=>{const i=path.findIndex((p,i)=>i<path.length-1&&p[0]<=x&&path[i+1][0]>=x);const a=path[Math.max(0,i)],b=path[Math.max(1,i+1)];return a[1]+(x-a[0])*(b[1]-a[1])/(b[0]-a[0]);};
export function clears(r,plan,{dock=false}={}){
 if(r.x<0||r.x+r.w>1280||r.y+r.h>768)return false;
 for(let y=r.y;y<=r.y+r.h+2;y+=4)for(let x=r.x;x<=r.x+r.w+2;x+=4){if(distanceToPath(x,y,plan.path)<51)return false;if(!dock&&(distanceToPath(x,y,plan.river)<67||distanceToPath(x,y,WEST)<63||distanceToPath(x,y,EAST)<65||distanceToPath(x,y,SOURCE)<29))return false;}
 return plan.pads.every(p=>Math.hypot(Math.max(r.x-p.x,0,p.x-r.x-r.w),Math.max(r.y-p.y,0,p.y-r.y-r.h))>=58);
}
const random=seed=>()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
const trace=(c,path)=>{const s=makeRoadSpline(path);c.beginPath();c.moveTo(...s[0].start);for(const p of s)c.bezierCurveTo(...p.c1,...p.c2,...p.end);};
export function makeRiverSurfaces(plan,a){
 const bounds={relief:{x:0,y:240,width:1280,height:528},water:{x:0,y:0,width:1280,height:768}},layer=(paint,b={x:0,y:0,width:1280,height:768})=>{const v=Object.assign(document.createElement('canvas'),{width:b.width*2,height:b.height*2}),c=v.getContext('2d');c.scale(2,2);c.translate(-b.x,-b.y);c.imageSmoothingQuality='high';paint(c);return v;};
 const ground=layer(c=>{c.fillStyle='#a4d83d';c.fillRect(0,0,1280,768);const tile=Object.assign(document.createElement('canvas'),{width:2560,height:800}),t=tile.getContext('2d');t.scale(2,2);t.imageSmoothingQuality='high';t.drawImage(a.materials,0,260,1536,480,0,0,1280,400);t.globalCompositeOperation='destination-in';const g=t.createLinearGradient(0,0,0,400);for(const[p,col]of[[0,'#0000'],[.08,'#000'],[.92,'#000'],[1,'#0000']])g.addColorStop(p,col);t.fillStyle=g;t.fillRect(0,0,1280,400);for(const y of[-30,330,690])c.drawImage(tile,0,y,1280,400);});
 function face(c,edge,height,heightAt=()=>height){poly(c,[...edge,...edge.slice().reverse().map(([x,y])=>[x,y+heightAt(x)])],'#777b63','#3c5747',2);const motif=a.cliffs.width/3,scale=height/390,span=motif*.76*scale;for(let start=edge[0][0],i=0;start<edge.at(-1)[0];start+=span,i++)for(let x=start;x<Math.min(start+span,edge.at(-1)[0]);x+=.5){const j=Math.max(0,edge.findIndex((p,k)=>k<edge.length-1&&p[0]<=x&&edge[k+1][0]>=x)),p=edge[j],q=edge[j+1],y=p[1]+(x-p[0])/(q[0]-p[0])*(q[1]-p[1]);c.drawImage(a.cliffs,(i%3)*motif+motif*.12+(x-start)/scale,145,.5/scale,390,x,y-4,.5,heightAt(x)+4);}c.beginPath();edge.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.strokeStyle='#3a5d35';c.lineWidth=4;c.stroke();c.strokeStyle='#c4de65';c.lineWidth=1.5;c.stroke();}
 const rimY=x=>{const river=riverY(x,plan.river),base=river-95;let y=base;for(const p of plan.pads){if(p.y>=river)continue;const d=Math.abs(x-p.x),u=Math.max(0,Math.min(1,(d-48)/42)),blend=1-u*u*(3-2*u);y=Math.max(y,base+(p.y+36-base)*blend);}for(const p of plan.path){if(p[1]>=river)continue;const d=Math.abs(x-p[0]),u=Math.max(0,Math.min(1,(d-16)/32)),blend=1-u*u*(3-2*u);y=Math.max(y,base+(p[1]+38-base)*blend);}return Math.min(river-mainHalfWidth(x),y);};
 const relief=layer(c=>{const upper=[],coast=[];for(let x=-30;x<=1310;x+=5){upper.push([x,rimY(x)]);coast.push([x,coastY(x)]);}face(c,upper,60,x=>riverY(x,plan.river)-mainHalfWidth(x)+1-rimY(x));face(c,coast,39);},bounds.relief);
 const water=layer(c=>{
  // Canonical main river and two scenic outflows. Only main river crosses route.
  const channels=[[WEST,96],[EAST,108],[SOURCE,32],[plan.river,72]];
  function corridor(path,w,extra){const left=[],right=[];for(const seg of makeRoadSpline(path))for(let i=0;i<16;i++){const t=i/16,p=roadPoint(seg,t),a=roadPoint(seg,Math.max(0,t-.001)),b=roadPoint(seg,Math.min(1,t+.001)),d=Math.hypot(b[0]-a[0],b[1]-a[1]),half=(path===plan.river?mainHalfWidth(p[0]):w/2+4*Math.sin(p[1]/46)+2*Math.sin(p[1]/23))+extra;left.push([p[0]-(b[1]-a[1])/d*half,p[1]+(b[0]-a[0])/d*half]);right.push([p[0]+(b[1]-a[1])/d*half,p[1]-(b[0]-a[0])/d*half]);}return[...left,...right.reverse()];}
  // Organic banks vary softly in width; only the tactical road has fixed width.
  // Fill every bank before the interiors, so confluences have no end-cap seams.
  for(const[path,w]of channels)for(const[col,extra]of[['#476b3d',5],['#cabd83',2]])poly(c,corridor(path,w,extra),col);
  for(const[path,w]of channels)for(const[col,extra]of[['#147c9d',0],['#12bcdb',-2]])poly(c,corridor(path,w,extra),col);
  // Lower river plane receives the foreground falls, never hides a tactical pad.
  const edge=[];for(let x=-10;x<=1290;x+=10)edge.push([x,coastY(x)+39]);poly(c,[...edge,[1290,800],[-10,800]],'#18bfdf');
  c.save();poly(c,[...edge,[1290,800],[-10,800]],'#0000');c.clip();c.drawImage(a.materials,0,752,1536,272,0,680,1280,227);c.restore();
  const rand=random(404);for(const[path,w]of channels)for(let i=1;i<path.length;i++){const p=path[i],prev=path[i-1];for(let n=0;n<3;n++){const t=rand(),x=prev[0]+(p[0]-prev[0])*t,y=prev[1]+(p[1]-prev[1])*t;const len=Math.hypot(p[0]-prev[0],p[1]-prev[1]),d=(rand()-.5)*w*.65;oval(c,x-(p[1]-prev[1])/len*d,y+(p[0]-prev[0])/len*d,3+rand()*6,1,'#adf3ef');}}
  // Lily pads and half-submerged stones are scenery, excluded from bridges/route.
  for(const x of[65,135,275,540,620,800,1030,1200]){const y=riverY(x,plan.river),box={x:x-12,y:y-8,w:24,h:16};if(distanceToPath(x,y,plan.path)<90)continue;oval(c,x+1,y+4,12,3,'#087f9d77');oval(c,x,y,10,4,'#7ac84b','#287d58',1);poly(c,[[x,y],[x+9,y-3],[x+8,y+2]],'#14bad8');if(x%3)oval(c,x-3,y-3,3,2,'#f6e8d2');}
  function fall(x,y,w,h){poly(c,[[x-w/2,y],[x+w/2,y],[x+w*.6,y+h],[x-w*.55,y+h]],'#36d1e6');for(let n=0;n<5;n++){c.fillStyle=n%2?'#e4fff3':'#7eeaf0';c.fillRect(x-w*.4+n*w*.18,y+2,1.5,h-4);}oval(c,x,y+h,w*.8,4,'#d9fff5');}
  // Tributary descends from upper land over the north bank into the main river.
  fall(704,rimY(704)-2,27,riverY(704,plan.river)-mainHalfWidth(704)+3-rimY(704));
  for(const x of[198,1167])fall(x,coastY(x)-2,34,41);
 });
 const route=layer(c=>paintGeometricRoad(c,plan.path));
 const bridges=plan.bridgeCenters.map((center,id)=>{
  const extent=id?91:76,lane=[];for(const s of makeRoadSpline(plan.path))for(let n=0;n<8;n++){const t=n/8,p=roadPoint(s,t);if(Math.hypot(p[0]-center[0],p[1]-center[1])>extent)continue;const a=roadPoint(s,Math.max(0,t-.001)),b=roadPoint(s,Math.min(1,t+.001)),len=Math.hypot(b[0]-a[0],b[1]-a[1]);lane.push({x:p[0],y:p[1],nx:-(b[1]-a[1])/len,ny:(b[0]-a[0])/len});}
  const rails=[-1,1].map(side=>{const groups=[];let group=[];for(const p of lane){const x=p.x+p.nx*42*side,y=p.y+p.ny*42*side;if(plan.pads.every(p=>Math.hypot(x-p.x,y-p.y)>=68)){group.push({x,y});}else if(group.length){if(group.length>2)groups.push(group);group=[];}}if(group.length>2)groups.push(group);return{side,groups};});
  const b={x:Math.floor(center[0]-125),y:Math.floor(center[1]-125),width:250,height:250};bounds['bridge'+id]=b;
  const image=layer(c=>{c.lineJoin='round';c.lineCap='butt';c.beginPath();lane.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));for(const[col,w]of[['#695136',62],['#dfa65b',59]]){c.strokeStyle=col;c.lineWidth=w;c.stroke();}let spacing=0;for(let i=1;i<lane.length;i++){const p=lane[i];spacing+=Math.hypot(p.x-lane[i-1].x,p.y-lane[i-1].y);if(spacing<8)continue;spacing=0;c.beginPath();c.moveTo(p.x-p.nx*29,p.y-p.ny*29);c.lineTo(p.x+p.nx*29,p.y+p.ny*29);c.strokeStyle='#805a36';c.lineWidth=1.2;c.stroke();}
   for(const rail of rails)for(const group of rail.groups){for(const p of[group[0],group.at(-1)]){const nearest=lane.reduce((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)<Math.hypot(b.x-p.x,b.y-p.y)?a:b);c.beginPath();c.moveTo(nearest.x+nearest.nx*30*rail.side,nearest.y+nearest.ny*30*rail.side);c.lineTo(p.x,p.y);c.strokeStyle='#7e5c36';c.lineWidth=5;c.stroke();}c.beginPath();group.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));for(const[col,w]of[['#534d37',5],['#d59c4d',2.5]]){c.strokeStyle=col;c.lineWidth=w;c.stroke();}for(const p of[group[0],group.at(-1)]){const{x,y}=p;oval(c,x,y+2,6,4,'#717963');c.fillStyle='#d5cda8';c.strokeStyle='#666f59';c.lineWidth=1.2;c.fillRect(x-4,y-8,8,10);c.strokeRect(x-4,y-8,8,10);oval(c,x,y-8,5,3,'#f3e4b8','#6c725a',1);}}

  },b);return{image,id,center:[...center],lane,rails,extent,deckWidth:ROAD_WIDTH,railOffset:42};
 });
 const pad=layer(c=>{const x=52,y=40;oval(c,x+2,y+10,45,24,'#34553066');oval(c,x,y+5,41,24,'#74816a','#3b5543',2);oval(c,x,y-2,41,23,'#b2ab84','#687157',2);oval(c,x,y-6,39,21,'#f2dfb4','#747657',1.8);oval(c,x,y-7,31,16,'#fff0c8','#aa986e',1);for(let i=0;i<10;i++){const a=i*Math.PI/5;c.beginPath();c.moveTo(x+Math.cos(a)*32,y-6+Math.sin(a)*16);c.lineTo(x+Math.cos(a)*38,y-6+Math.sin(a)*20);c.strokeStyle='#a09164';c.lineWidth=1.3;c.stroke();}poly(c,[[x,y-14],[x+10,y-7],[x,y],[x-10,y-7]],'#b69c66','#7f744e',1.3);poly(c,[[x,y-11],[x+5,y-7],[x,y-3],[x-5,y-7]],'#fff6d9');},{x:0,y:0,width:104,height:80});
 return{layers:{ground,relief,water,route,...Object.fromEntries(bridges.map(b=>['bridge'+b.id,b.image]))},bounds,pad,bridges:bridges.map(({image,...b})=>b)};
}
