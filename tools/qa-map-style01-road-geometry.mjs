import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {makeRoadSpline,roadPoint,ROAD_WIDTH} from '../public/official/src/maps-visual/m01/style01/road-geometry.mjs';
import {routeDistance} from '../public/official/src/maps-visual/m01/style01/cartoon-world.mjs';
const path=JSON.parse(readFileSync('public/official/data/maps.v5.json')).find(m=>m.id===1).path,before=JSON.stringify(path),segments=makeRoadSpline(path);
const derivatives=(s,t)=>{const u=1-t;return [
 [0,1].map(k=>3*(u*u*(s.c1[k]-s.start[k])+2*u*t*(s.c2[k]-s.c1[k])+t*t*(s.end[k]-s.c2[k]))),
 [0,1].map(k=>6*(u*(s.c2[k]-2*s.c1[k]+s.start[k])+t*(s.end[k]-2*s.c2[k]+s.c1[k])))];};
let minRadius=Infinity,maxDeviation=0,samples=0;
for(const [i,s]of segments.entries()){
 if(i){const prev=segments[i-1];for(const [a,b]of [[prev.end,s.start],...derivatives(prev,1).map((v,k)=>[v,derivatives(s,0)[k]])])assert(Math.hypot(a[0]-b[0],a[1]-b[1])<1e-8,'C2 discontinuity');}
 for(let n=0;n<=50;n++){const t=n/50,p=roadPoint(s,t),[v,a]=derivatives(s,t),radius=Math.hypot(...v)**3/Math.abs(v[0]*a[1]-v[1]*a[0]);minRadius=Math.min(minRadius,radius);maxDeviation=Math.max(maxDeviation,routeDistance(...p,path));samples++;}
}
assert.equal(JSON.stringify(path),before);assert.equal(segments.length,132);assert.equal(ROAD_WIDTH,64);assert(maxDeviation<.5);assert(minRadius>ROAD_WIDTH/2+10,'Inner offset can fold');
mkdirSync('artifacts/map-style01',{recursive:true});writeFileSync('artifacts/map-style01/road-geometry.json',JSON.stringify({status:'PASS_C2_WIDTH_CURVATURE_ROUTE_ALIGNMENT',segments:segments.length,samples,width:ROAD_WIDTH,previousWidth:79,minRadius,maxDeviation,canonicalPoints:133},null,2));
console.log('PASS_M01_ROAD_C2_CURVATURE_AND_CANONICAL_ALIGNMENT');
