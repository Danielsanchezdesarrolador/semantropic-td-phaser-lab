/** Visual-only uniform cubic B-spline. Canonical waypoints are read, never edited.
 * Cubic segments share first AND second derivatives (C2); one stroke sets width. */
export const ROAD_WIDTH=62;
export function makeRoadSpline(path){
 // A single binomial pass conditions the visual control polygon for constant-width offsets.
 // Only the visual control polygon is filtered; path and travel remain canonical.
 const at=i=>i<0?path[0].map((v,k)=>v+i*(path[1][k]-v)):i>=path.length?path.at(-1).map((v,k)=>v+(i-path.length+1)*(v-path.at(-2)[k])):path[i];
 const visual=path.map((p,i)=>i===0||i===path.length-1?[...p]:[0,1].map(k=>[1,4,6,4,1].reduce((s,w,j)=>s+w*at(i+j-2)[k],0)/16));

 const extend=(a,b)=>[2*a[0]-b[0],2*a[1]-b[1]],pts=[extend(visual[0],visual[1]),...visual,extend(visual.at(-1),visual.at(-2))],segments=[];
 for(let i=0;i<pts.length-3;i++){
  const [a,b,c,d]=pts.slice(i,i+4),blend=(u,v,w)=>[0,1].map(k=>(u[k]+4*v[k]+w[k])/6);
  segments.push({start:blend(a,b,c),c1:[0,1].map(k=>(2*b[k]+c[k])/3),c2:[0,1].map(k=>(b[k]+2*c[k])/3),end:blend(b,c,d)});
 }
 return segments;
}
export function roadPoint(s,t){const u=1-t;return[0,1].map(k=>u*u*u*s.start[k]+3*u*u*t*s.c1[k]+3*u*t*t*s.c2[k]+t*t*t*s.end[k]);}
export function traceRoad(c,path){
 const segments=makeRoadSpline(path),first=segments[0],last=segments.at(-1),extend=(p,q)=>{const n=Math.hypot(p[0]-q[0],p[1]-q[1]);return[p[0]+(p[0]-q[0])*2200/n,p[1]+(p[1]-q[1])*2200/n];};
 c.beginPath();c.moveTo(...extend(first.start,first.c1));c.lineTo(...first.start);
 for(const s of segments)c.bezierCurveTo(...s.c1,...s.c2,...s.end);
 c.lineTo(...extend(last.end,last.c2));c.lineJoin='round';c.lineCap='round';
}
export function paintGeometricRoad(c,path){
 traceRoad(c,path);
 for(const [color,width] of [['#655037',ROAD_WIDTH],['#d49b55',ROAD_WIDTH-2],['#f5c777',ROAD_WIDTH-5]]){c.strokeStyle=color;c.lineWidth=width;c.stroke();}
 // Restrained ground accents stay well inside the fixed-width ribbon.
 for(let i=4;i<path.length-4;i+=5){const [x,y]=path[i],a=path[i-1],b=path[i+1],n=Math.hypot(b[0]-a[0],b[1]-a[1]),d=(i%3-1)*13;
  if(x<24||x>1256)continue; // FIT boundary has an uninterrupted, identical sand fill.
  c.beginPath();c.ellipse(x-(b[1]-a[1])/n*d,y+(b[0]-a[0])/n*d,2.5,1,Math.atan2(b[1]-a[1],b[0]-a[0]),0,Math.PI*2);c.fillStyle=i%2?'#d5a96532':'#ffe0a138';c.fill();
 }
}
/** Regular world-space arc stations; source waypoints remain immutable. */
export function resampleRoad(path,spacing=4){
 const dense=[];let length=0,previous;for(const seg of makeRoadSpline(path))for(let i=0;i<=16;i++){const t=i/16,p=roadPoint(seg,t),u=1-t,v=[0,1].map(k=>3*(u*u*(seg.c1[k]-seg.start[k])+2*u*t*(seg.c2[k]-seg.c1[k])+t*t*(seg.end[k]-seg.c2[k]))),n=Math.hypot(...v);if(previous)length+=Math.hypot(p[0]-previous[0],p[1]-previous[1]);dense.push({x:p[0],y:p[1],nx:-v[1]/n,ny:v[0]/n,distance:length});previous=p;}
 const out=[];let i=1;for(let d=0;d<length;d+=spacing){while(i<dense.length-1&&dense[i].distance<d)i++;const a=dense[i-1],b=dense[i],t=(d-a.distance)/(b.distance-a.distance||1),nx=a.nx+(b.nx-a.nx)*t,ny=a.ny+(b.ny-a.ny)*t,n=Math.hypot(nx,ny);out.push({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,nx:nx/n,ny:ny/n,distance:d});}out.push({...dense.at(-1)});return out;
}
export function distanceToPath(x,y,path){let d=Infinity;for(let i=1;i<path.length;i++){const a=path[i-1],b=path[i],dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)));d=Math.min(d,Math.hypot(x-a[0]-dx*t,y-a[1]-dy*t));}return d;}
