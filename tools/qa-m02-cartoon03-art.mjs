import assert from 'node:assert/strict';
import{readFileSync,mkdirSync,writeFileSync}from'node:fs';
import{execFileSync}from'node:child_process';
import{makeRoadSpline,roadPoint,ROAD_WIDTH}from'../public/official/src/maps-visual/m02/cartoon03/road-geometry.mjs';
import{distanceToPath}from'../public/official/src/maps-visual/m02/cartoon03/surfaces.mjs';
const base='7fbec3b616ebb35a400767cb15d8c53b8f377aef',map=JSON.parse(readFileSync('public/official/data/maps.v5.json')).find(m=>m.id===2),path=map.path;
for(const p of execFileSync('git',['diff','--name-only',base,'--','public'],{encoding:'utf8'}).trim().split('\n').filter(Boolean))assert(p==='public/official/src/maps-visual/m02/phaser-world.mjs'||p.startsWith('public/official/src/maps-visual/m02/cartoon03/')||p.startsWith('public/official/art/maps/m02/cartoon03/'),'Outside M02 art scope '+p);
const segments=makeRoadSpline(path),derive=(s,t)=>{const u=1-t;return[[0,1].map(k=>3*(u*u*(s.c1[k]-s.start[k])+2*u*t*(s.c2[k]-s.c1[k])+t*t*(s.end[k]-s.c2[k]))),[0,1].map(k=>6*(u*(s.c2[k]-2*s.c1[k]+s.start[k])+t*(s.end[k]-2*s.c2[k]+s.c1[k])))];};
let minRadius=Infinity,maxDeviation=0,samples=0;
for(const[i,s]of segments.entries()){
 if(i)for(const[a,b]of[[segments[i-1].end,s.start],...derive(segments[i-1],1).map((a,k)=>[a,derive(s,0)[k]])])assert(Math.hypot(a[0]-b[0],a[1]-b[1])<1e-8,'C2 discontinuity');
 for(let n=0;n<=50;n++){const t=n/50,p=roadPoint(s,t),[v,a]=derive(s,t);minRadius=Math.min(minRadius,Math.hypot(...v)**3/Math.abs(v[0]*a[1]-v[1]*a[0]));maxDeviation=Math.max(maxDeviation,distanceToPath(...p,path));samples++;}
}
assert.equal(path.length,163);assert.equal(map.spots.length,8);assert.equal(map.gold,395);assert.equal(ROAD_WIDTH,62);assert(maxDeviation<.5);assert(minRadius>ROAD_WIDTH/2+10);
mkdirSync('artifacts/m02-cartoon03',{recursive:true});writeFileSync('artifacts/m02-cartoon03/geometry.json',JSON.stringify({status:'PASS_M02_C2_GEOMETRY_AND_ART_SCOPE',base,segments:segments.length,samples,width:ROAD_WIDTH,previousWidth:84,minRadius,maxDeviation,routeVertices:163,pads:8},null,2));console.log('PASS_M02_CARTOON03_SCOPE_C2_ALIGNMENT_AND_WIDTH');
