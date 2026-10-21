/**
 * SEMANTROPIC TD · R3-0 · Read-only M02 canonical source gate.
 * Does NOT activate M02 gameplay, does NOT mutate Canvas/Phaser data,
 * and does NOT imply archer/shieldbearer runtime support.
 * Run: node tools/qa-r3-m02-canonical.mjs
 */
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const maps=JSON.parse(readFileSync(new URL("../public/official/data/maps.v5.json",import.meta.url),"utf8"));
const campaign=JSON.parse(readFileSync(new URL("../public/official/data/campaign140.v5.json",import.meta.url),"utf8"));
const m01=maps.find(m=>m.id===1),c01=campaign.maps.find(m=>m.mapId===1);
const m02=maps.find(m=>m.id===2),c02=campaign.maps.find(m=>m.mapId===2);
assert.ok(m01&&c01&&m02&&c02,"M01 and M02 must exist");

const waveTotals=c=>c.waves.map(w=>w.groups.reduce((n,g)=>n+g.count,0));
assert.equal(m01.path.length,133,"M01 canonical route regression");
assert.equal(m01.spots.length,8,"M01 build spots regression");
assert.deepEqual(waveTotals(c01),[8,10,11,13,21],"M01 five-wave regression");

assert.equal(m02.name,"Campos del Molino");
assert.equal(m02.biome,"farmland");
assert.equal(m02.gold,395,"M02 source gold; not an implemented Phaser economy");
assert.equal(m02.path.length,163,"M02 163 canonical waypoints");
assert.equal(m02.spots.length,8,"M02 canonical platforms");
assert.equal(m02.design?.routes,1,"M02 has exactly one route");
assert.deepEqual(m02.branches,[],"M02 has no side branches");
assert.deepEqual(m02.path[0],[-36,296],"M02 canonical entry");
assert.deepEqual(m02.path.at(-1),[1315,377],"M02 canonical exit");
for(let i=0;i<m02.path.length;i++){
 const p=m02.path[i];
 assert.ok(Array.isArray(p)&&p.length===2&&p.every(Number.isFinite),"invalid M02 waypoint "+i);
 if(i>0){
  const prev=m02.path[i-1];
  assert.ok(Math.hypot(p[0]-prev[0],p[1]-prev[1])>0,"zero-length segment "+i);
 }
}
for(let i=0;i<m02.spots.length;i++){
 const s=m02.spots[i],x=s.cx*64+32,y=s.cy*64+32;
 assert.ok(Number.isInteger(s.cx)&&Number.isInteger(s.cy),"non-integer M02 socket "+i);
 assert.ok(x>=0&&x<=1280&&y>=0&&y<=768,"socket off-canvas "+i);
 assert.ok(["tempo","power","focus"].includes(s.kind),"unknown socket kind "+i);
}
assert.equal(c02.entries,1,"M02 route count in campaign");
assert.equal(c02.waves.length,7,"M02 seven waves");
assert.deepEqual(waveTotals(c02),[7,9,7,11,15,11,20],"M02 wave source counts");
const types=new Set();
c02.waves.forEach((w,i)=>{
 assert.equal(w.wave,i+1,"noncanonical M02 wave number");
 for(const g of w.groups){
  assert.ok(Number.isInteger(g.count)&&g.count>0,"spawn count");
  assert.ok(Number.isFinite(g.spawnInterval)&&g.spawnInterval>0,"spawn interval");
  assert.ok(Number.isFinite(g.startOffset)&&g.startOffset>=0,"spawn offset");
  assert.equal(g.routeStart,0,"M02 must use its sole route");
  types.add(g.type);
 }
});
assert.deepEqual([...types].sort(),["archer","hound","shieldbearer","warrior"],"M02 enemy catalog");
const total=waveTotals(c02).reduce((a,b)=>a+b,0);
assert.equal(total,80,"M02 80 canonically scheduled enemies");
console.log("[PASS] R3-0 source gate: M01 protected; M02 163 nodes, 8 sockets, 1 route, 7 waves, 80 scheduled enemies.");
console.log("[NOT TESTED] M02 combat/art/UI/Android. Archer and shieldbearer are NOT implemented in Phaser live.");
