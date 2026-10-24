import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {makeRoadSpline,roadPoint,ROAD_WIDTH} from '../public/official/src/maps-visual/m04/cartoon01/road-geometry.mjs';
import {distanceToPath as routeDistance} from '../public/official/src/maps-visual/m04/cartoon01/surfaces.mjs';
const path=JSON.parse(readFileSync('public/official/data/maps.v5.json')).find(m=>m.id===4).path,before=JSON.stringify(path),segments=makeRoadSpline(path);
const derivatives=(s,t)=>{const u=1-t;return [
 [0,1].map(k=>3*(u*u*(s.c1[k]-s.start[k])+2*u*t*(s.c2[k]-s.c1[k])+t*t*(s.end[k]-s.c2[k]))),
 [0,1].map(k=>6*(u*(s.c2[k]-2*s.c1[k]+s.start[k])+t*(s.end[k]-2*s.c2[k]+s.c1[k])))];};
let minRadius=Infinity,maxDeviation=0,samples=0;
for(const [i,s]of segments.entries()){
 if(i){const prev=segments[i-1];for(const [a,b]of [[prev.end,s.start],...derivatives(prev,1).map((v,k)=>[v,derivatives(s,0)[k]])])assert(Math.hypot(a[0]-b[0],a[1]-b[1])<1e-8,'C2 discontinuity');}
 for(let n=0;n<=50;n++){const t=n/50,p=roadPoint(s,t),[v,a]=derivatives(s,t),radius=Math.hypot(...v)**3/Math.abs(v[0]*a[1]-v[1]*a[0]);minRadius=Math.min(minRadius,radius);maxDeviation=Math.max(maxDeviation,routeDistance(...p,path));samples++;}
}
assert.equal(JSON.stringify(path),before);assert.equal(segments.length,261);assert.equal(ROAD_WIDTH,62);assert(maxDeviation<1.1);assert(minRadius>ROAD_WIDTH/2+10,'Inner offset can fold');
mkdirSync('artifacts/m04-cartoon01',{recursive:true});writeFileSync('artifacts/m04-cartoon01/road-geometry.json',JSON.stringify({status:'PASS_C2_WIDTH_CURVATURE_ROUTE_ALIGNMENT',segments:segments.length,samples,width:ROAD_WIDTH,previousDiagnosticWidth:84,previousActivePaintingWidth:"NOT_UNIFORM_NOT_MEASURED",minRadius,maxDeviation,canonicalPoints:262},null,2));
console.log('PASS_M04_ROAD_C2_CURVATURE_AND_CANONICAL_ALIGNMENT');
// Non-local fold test of both offsets, in addition to the local curvature bound.
const sides=[[],[]];for(const s of segments)for(const t of[0,.5]){const p=roadPoint(s,t),[v]=derivatives(s,t),n=Math.hypot(...v);for(let side=0;side<2;side++){const d=(side?1:-1)*ROAD_WIDTH/2;sides[side].push([p[0]-v[1]/n*d,p[1]+v[0]/n*d]);}}
const orient=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
const crosses=(a,b,c,d)=>orient(a,b,c)*orient(a,b,d)<-1e-8&&orient(c,d,a)*orient(c,d,b)<-1e-8;
for(let side=0;side<2;side++)for(let i=1;i<sides[side].length;i++)for(let j=i+2;j<sides[side].length;j++)assert(!crosses(sides[side][i-1],sides[side][i],sides[side][j-1],sides[side][j]),'Offset self intersection');
for(let i=1;i<sides[0].length;i++)for(let j=1;j<sides[1].length;j++)assert(!crosses(sides[0][i-1],sides[0][i],sides[1][j-1],sides[1][j]),'Opposite offsets intersect');
console.log('PASS_M04_BOTH_OFFSETS_WITHOUT_SELF_INTERSECTIONS');
const report=JSON.parse(readFileSync('artifacts/m04-cartoon01/road-geometry.json'));Object.assign(report,{offsetSelfIntersections:0,offsetSamplesPerSide:sides[0].length,maxCanonicalEnemyRadius:23,minimumHalfLaneMargin:ROAD_WIDTH/2-23-maxDeviation});writeFileSync('artifacts/m04-cartoon01/road-geometry.json',JSON.stringify(report,null,2));
