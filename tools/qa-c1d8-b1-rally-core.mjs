import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {M01CombatWithInfantryA3} from "../public/official/src/core-c1d/m01-infantry-combat-a3.mjs";
const map=JSON.parse(readFileSync(new URL("../public/official/data/maps.v5.json",import.meta.url)))[0];
const camp=JSON.parse(readFileSync(new URL("../public/official/data/campaign140.v5.json",import.meta.url))).maps[0];
const w=new M01CombatWithInfantryA3(map,camp);
assert.equal(w.wave,0);assert.equal(w.active,false);assert.equal(w.snapshot.navNodes,133);
assert(w.economy.build(0,"infantry").ok);assert(w.economy.upgrade(0).ok);
w.syncTowers();
const t=w.economy.getTower(0),home=w.rallyAt(t);
const valid=[...w.infantryNav.nodes].map(n=>({...n,dist:Math.hypot(t.x-n.x,t.y-n.y),
  delta:Math.hypot(home.x-n.x,home.y-n.y)}))
 .filter(n=>n.dist>30&&n.dist<=120&&n.delta>35).sort((a,b)=>b.delta-a.delta)[0];
assert(valid,"no distinct reachable rally candidate");
const out=w.setInfantryRally(0,valid.x,valid.y);
assert(out.ok);assert.equal(out.nodeId,valid.id);
const before=w.soldiers,initialDistance=before.reduce((v,u)=>v+Math.hypot(u.x-valid.x,u.y-valid.y),0);
const oldGold=w.economy.gold;
for(let i=0;i<240;i++)w.tick(1/60);
const after=w.soldiers,finalDistance=after.reduce((v,u)=>v+Math.hypot(u.x-valid.x,u.y-valid.y),0);
assert(finalDistance<initialDistance-50,JSON.stringify({initialDistance,finalDistance}));
assert(after.every(u=>Math.hypot(u.homeX-valid.x,u.homeY-valid.y)<28));
assert.equal(w.wave,0);assert.equal(w.active,false);assert.equal(w.economy.gold,oldGold);
assert.equal(w.totalSpawns,0);assert.equal(w.kills,0);
w.pause();
const fixed=w.soldiers,oldSec=w.seconds;
for(let i=0;i<100;i++)w.tick(1/60);
assert.deepEqual(w.soldiers,fixed,"paused soldier must freeze");
assert.equal(w.seconds,oldSec);
w.resume();assert(w.startWave());
let steps=0;while(w.active&&!w.ended&&steps++<30000)w.tick(1/60);
assert(steps<30000&&w.totalSpawns===8,"active wave core regression");
console.log(JSON.stringify({status:"PASS_C1D8_B1_A3_RALLY_DOWNTIME_MOVEMENT",pad:0,
 from:before.map(u=>[u.x,u.y]),to:after.map(u=>[u.x,u.y]),nodeId:valid.id,
 initialDistance,finalDistance,pausedNoMovement:true,activeWaveSpawns:8,noFakeGold:true},null,2));
