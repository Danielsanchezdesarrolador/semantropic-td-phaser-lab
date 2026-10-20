import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {M01CombatWithInfantryA2} from "../public/official/src/core-c1d/m01-infantry-combat-a2.mjs";
import {makeM01InfantryNav,nearestM01Nav,shortestM01Nav,m01NavFormation} from "../public/official/src/core-c1d/m01-infantry-nav.mjs";
const map=JSON.parse(readFileSync(new URL("../public/official/data/maps.v5.json",import.meta.url)))[0];
const camp=JSON.parse(readFileSync(new URL("../public/official/data/campaign140.v5.json",import.meta.url))).maps[0];
const nav=makeM01InfantryNav(map.path);
assert.equal(nav.originalVertices,133);
assert.equal(nav.nodes.length,133);
assert.deepEqual(shortestM01Nav(nav,0,0),[0]);
for(const [from,to] of [[0,20],[20,0],[47,97],[132,0]]){
 const route=shortestM01Nav(nav,from,to);
 assert(route&&route[0]===from&&route.at(-1)===to);
 for(let i=1;i<route.length;i++)assert(nav.nodes[route[i-1]].edges.some(e=>e.to===route[i]));
}
const loc=nearestM01Nav(nav,nav.nodes[47].x,nav.nodes[47].y);
assert.equal(loc.id,47);
const left=m01NavFormation(nav,47,2,0),right=m01NavFormation(nav,47,2,1);
assert(Math.abs(Math.hypot(left.x-right.x,left.y-right.y)-34)<.1);
const one=new M01CombatWithInfantryA2(map,camp);
const bought=one.economy.build(0,"infantry");
assert(bought.ok);one.syncTowers();
assert.equal(one.soldiers.length,1);
assert.equal(one.snapshot.navNodes,133);
let out=one.setInfantryRally(0,99999,99999);assert.equal(out.ok,false);
const pad=one.economy.getTower(0),start=nearestM01Nav(nav,pad.x,pad.y);
out=one.setInfantryRally(0,start.x,start.y);
assert(out.ok);assert.equal(out.nodeId,start.id);
assert(one.startWave());
const events=[];let ticks=0;
while(one.active&&!one.ended&&ticks++<27000)events.push(...one.tick(1/60));
assert(ticks<27000,"A2 real first wave timeout");
assert.equal(one.totalSpawns,8);
assert.equal(one.kills+one.escapedCount,8);
assert(events.some(x=>x.type==="enemy_blocked"),"A2 real Infantry interception required");
assert(events.some(x=>x.type==="soldier_attack_hit"),"A2 Infantry melee required");
assert(events.some(x=>x.type==="infantry_rally_changed"));
assert(one.navigationRepaths>0);
const upgraded=new M01CombatWithInfantryA2(map,camp);
assert(upgraded.economy.build(0,"infantry").ok);
assert(upgraded.economy.upgrade(0).ok);
upgraded.syncTowers();assert.equal(upgraded.soldiers.length,2);
assert.equal(upgraded.soldiers[0].maxHp,165);
assert.equal(upgraded.economy.assertEconomy(),true);
const losing=new M01CombatWithInfantryA2(map,camp);
for(let wave=1;wave<=5&&!losing.ended;wave++){
 assert(losing.startWave());let j=0;
 while(losing.active&&!losing.ended&&j++<29000)losing.tick(1/60);
 assert(j<29000);
}
assert(!losing.won);assert.equal(losing.lives,0);assert.equal(losing.escapedCount,50);
const game=new M01CombatWithInfantryA2(map,camp),order=[0,2,4,7,1,3,5,6];
assert(game.economy.build(0,"infantry").ok);assert(game.economy.build(2,"sniper").ok);
let allTicks=0;
for(let wave=1;wave<=5&&!game.ended;wave++){
 assert(game.startWave());let j=0;
 while(game.active&&!game.ended&&j++<30000){
  game.tick(1/60);allTicks++;
  if(j%60===0)for(const spot of order)if(!game.economy.getTower(spot)){
   if(game.economy.quote(spot,"sniper").ok){assert(game.economy.build(spot,"sniper").ok);break;}
  }
 }
 assert(j<30000);
}
assert(game.ended,"natural end");
assert.equal(game.kills+game.escapedCount,game.totalSpawns);
assert.equal(game.economy.assertEconomy(),true);
console.log(JSON.stringify({status:"PASS_C1D5_A2_INFANTRY_NAV_AND_M01_SESSION",navNodes:nav.nodes.length,
 shortestPaths:"deterministic",formationSpacing:34,firstWaveEvents:events.length,
 blocked:events.filter(x=>x.type==="enemy_blocked").length,melee:events.filter(x=>x.type==="soldier_attack_hit").length,
 rally:"interactive canonical graph",mixed:{win:game.won,wave:game.wave,kills:game.kills,escapes:game.escapedCount,lives:game.lives,spawns:game.totalSpawns},ticks:allTicks,
 limitations:["parity V5 branch skills III/IV out of M01 scope","artistic unchanged","browser still pending"]},null,2));
