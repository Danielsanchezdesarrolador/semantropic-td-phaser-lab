/** Visual-only uniform cubic B-spline. Canonical waypoints are read, never edited.
 * Cubic segments share first AND second derivatives (C2); one stroke sets width. */
export const ROAD_WIDTH=62;
export function makeRoadSpline(path){
 const extend=(a,b)=>[2*a[0]-b[0],2*a[1]-b[1]],pts=[extend(path[0],path[1]),...path,extend(path.at(-1),path.at(-2))],segments=[];
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
