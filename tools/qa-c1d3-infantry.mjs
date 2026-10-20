/**
 * C1-D3 first gameplay gate: infantry I/II truly intercept and hit warrior/hound.
 * No actor art nor save-state certification. Phaser browser QA is separate.
 */
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {M01CombatWithInfantry,INFANTRY_LVLS,M01_INFANTRY_BLOCK_CAPACITY,M01_ENEMY_MELEE} from "../public/official/src/core-c1d/m01-infantry-combat.mjs";
const src=readFileSync(new URL("../public/JUEGO_V5_CANVAS.html",import.meta.url),"utf8");
for(const expected of ["const INFANTRY_LEVELS=[","{hp:110,damage:8,interval:1.2,radius:130,respawn:10,count:1,speed:82}",
"{hp:165,damage:12,interval:1.1,radius:130,respawn:9,count:2,speed:88}",
"const DEFENSA_VIVA_BLOCK_CAPACITY=Object.freeze({soldier:2","hound:{name:","damage:7,range:26,interval:1.12,windup:.21","damage:11,range:35,interval:1.35,windup:.32"])assert(src.includes(expected),expected+" missing in protected V5");
const map=JSON.parse(readFileSync(new URL("../public/official/data/maps.v5.json",import.meta.url)))[0];
const camp=JSON.parse(readFileSync(new URL("../public/official/data/campaign140.v5.json",import.meta.url))).maps[0];
assert.equal(M01_INFANTRY_BLOCK_CAPACITY,2);assert.equal(INFANTRY_LVLS[1].count,1);
assert.equal(INFANTRY_LVLS[2].count,2);assert.equal(M01_ENEMY_MELEE.warrior.damage,11);
function advance(w,condition,max=16000){
 const events=[];let ticks=0;
 while(!condition()&&ticks++<max)events.push(...w.tick(1/60));
 assert(ticks<max,"core did not resolve combat in bounded time");
 return events;
}
const one=new M01CombatWithInfantry(map,camp);
assert(one.economy.build(0,"infantry").ok);
one.syncTowers();
assert.equal(one.soldiers.length,1);
assert.equal(one.soldiers[0].maxHp,110);
assert.equal(one.snapshot.infantryCombatImplemented,true);
assert(one.startWave());
const first=advance(one,()=>!one.active||one.ended);
const types=type=>first.filter(e=>e.type===type);
assert(types("enemy_blocked").length>0,"one Infantry soldier must actually block an enemy");
assert(types("soldier_attack_windup").length>0,"melee attack must be prepared");
assert(types("soldier_attack_hit").length>0,"core must actually apply soldier melee hit");
assert(types("soldier_hit").length>0,"warrior/hound must harm soldier");
assert(types("hit_applied").length>0,"HP changed due to real infantry melee");
assert.equal(one.economy.assertEconomy(),true);
assert.equal(one.totalSpawns,8);
assert.equal(one.kills+one.escapedCount,8);
const blockCount=new Map();
for(const ev of types("enemy_blocked"))blockCount.set(ev.entityId,(blockCount.get(ev.entityId)||0)+1);
assert(one.snapshot.soldiers>=0);
const upgrades=new M01CombatWithInfantry(map,camp);
assert(upgrades.economy.build(0,"infantry").ok);
upgrades.syncTowers();assert.equal(upgrades.soldiers.length,1);
assert(upgrades.economy.upgrade(0).ok);
upgrades.syncTowers();assert.equal(upgrades.soldiers.length,2);
assert(upgrades.soldiers.every(u=>u.maxHp===165),"soldier level II HP");
assert.equal(upgrades.economy.gold,135);
const u=upgrades.soldiers[0];
upgrades.startWave();
const pauses=upgrades.tick(1/60);
assert(upgrades.pause());
const before=upgrades.snapshot;
assert.deepEqual(upgrades.tick(1/60),[]);assert.deepEqual(upgrades.snapshot,before);
assert(upgrades.resume());
const mut=upgrades.squads.values().next().value.units[0];
mut.hp=0;mut.respawn=1/120;
const res=upgrades.tick(1/60);
assert(res.some(e=>e.type==="soldier_respawn"),"actual respawn state-machine tick");
assert(upgrades.economy.sell(0).ok);
upgrades.syncTowers();assert.equal(upgrades.soldiers.length,0);
assert.equal(upgrades.squads.size,0);
assert.equal(upgrades.economy.assertEconomy(),true);

const mixed=new M01CombatWithInfantry(map,camp);
assert(mixed.economy.build(0,"infantry").ok);
assert(mixed.economy.build(2,"sniper").ok);
const purchaseOrder=[4,7,1,5,3,6];const fullEvents=[];
let totalTicks=0;
for(let wave=1;wave<=5&&!mixed.ended;wave++){
 assert(mixed.startWave());
 let n=0;
 while(mixed.active&&!mixed.ended&&n++<25000){
  fullEvents.push(...mixed.tick(1/60));totalTicks++;
  if(n%60===0){
   for(const pad of purchaseOrder){
    if(mixed.economy.getTower(pad))continue;
    const q=mixed.economy.quote(pad,"sniper");
    if(q.ok){assert(mixed.economy.build(pad,"sniper").ok);mixed.syncTowers();}
    break;
   }
   assert(mixed.economy.assertEconomy());
  }
 }
 assert(n<25000,"mixed infantry+sniper wave timed out");
}
assert(mixed.ended,"five waves must terminate with true result");
assert.equal(mixed.kills+mixed.escapedCount+mixed.enemies.size,mixed.totalSpawns);
assert.equal(mixed.economy.ledger.filter(x=>x.source==="enemigos").length,mixed.kills);
assert.equal(new Set(fullEvents.filter(x=>x.type==="entity_die").map(x=>x.entityId)).size,mixed.kills);
assert.equal(mixed.economy.assertEconomy(),true);
console.log(JSON.stringify({status:"PASS_C1D3_NODE_INFANTRY_INITIAL",independentEvents:{block:types("enemy_blocked").length,
 infantryMelee:types("soldier_attack_hit").length,soldierHurt:types("soldier_hit").length},
 levelI:INFANTRY_LVLS[1],levelII:INFANTRY_LVLS[2],
 upgradesVerified:true,respawnFixtureVerified:true,sellRemovesSoldiers:true,
 mixedCampaign:{result:mixed.won?"VICTORY":"DEFEAT",wave:mixed.wave,
 spawns:mixed.totalSpawns,kills:mixed.kills,escapes:mixed.escapedCount,
 lives:mixed.lives,gold:mixed.economy.gold,ticks:totalTicks},
 limitations:["simplified M01 waypoint rally, Canvas V5 navigation mesh NOT yet ported",
 "art P05/P06 not integrated","results/stars/save not implemented","not physical mobile"]},null,2));
