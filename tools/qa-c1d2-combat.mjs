import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {M01CombatWorld,calculateM01Enemy,m01WaveBonus,resolveM01RangedDamage} from "../public/official/src/core-c1d/m01-combat-world.mjs";
const maps=JSON.parse(readFileSync(new URL("../public/official/data/maps.v5.json",import.meta.url)));
const campaign=JSON.parse(readFileSync(new URL("../public/official/data/campaign140.v5.json",import.meta.url))).maps[0];
const source=readFileSync(new URL("../public/JUEGO_V5_CANVAS.html",import.meta.url),"utf8");
for(const s of ["function sniperDamage(t,e,shot)","function sniperReleaseShot(t)","function sniperProjectileHit(b,e)","function hurt(e,value,meta={})","function campaign140Bounty(amount)","speed:840","function spawnE1Enemy(type,routeIndex=0,override={})"])
 assert(source.includes(s),"protected Canvas V5 drift: "+s);
assert.equal(maps[0].path.length,133);assert.equal(maps[0].spots.length,8);
assert.equal(campaign.waves.reduce((n,w)=>n+w.groups.reduce((v,g)=>v+g.count,0),0),63);
assert.equal(calculateM01Enemy(1,"warrior",maps[0]).hp,39);
assert.equal(calculateM01Enemy(1,"warrior",maps[0]).reward,16);
assert.equal(calculateM01Enemy(2,"hound",maps[0]).reward,13);
assert.equal(m01WaveBonus(1),110);
assert.equal(resolveM01RangedDamage(47.2,{armor:0,shield:0}).dealt,47.2);

function iterateUntil(world,condition,max=150000){
 const events=[];let i=0;
 while(!condition()&&i++<max)events.push(...world.tick(1/60));
 assert(i<max,"simulation exceeded tick budget");
 return events;
}
const sniper=new M01CombatWorld(maps[0],campaign);
const purchase=sniper.economy.build(0,"sniper");assert(purchase.ok);
assert.equal(sniper.economy.gold,225);
assert(sniper.startWave());
const first=sniper.tick(1/60);assert(first.some(e=>e.type==="wave_start"));assert(first.some(e=>e.type==="spawn"));
sniper.pause();const before=sniper.snapshot;assert.deepEqual(sniper.tick(1/60),[]);assert.deepEqual(sniper.snapshot,before);
sniper.resume();
const shotEvents=iterateUntil(sniper,()=>sniper.finishedWaves.has(1)||sniper.ended);
assert(shotEvents.some(e=>e.type==="attack_windup"),"real windup");
assert(shotEvents.some(e=>e.type==="attack_fire"),"real shot");
assert(shotEvents.some(e=>e.type==="hit_applied"),"real damage");
assert(shotEvents.some(e=>e.type==="entity_die"),"real kill");
assert(sniper.kills>0);assert(sniper.economy.gold>225,"bounties and/or wave bonus credit");
assert.equal(sniper.economy.assertEconomy(),true);
assert.equal(new Set(shotEvents.map(e=>e.eventId)).size,shotEvents.length,"unique combat event IDs");
assert.equal(new Set(shotEvents.filter(e=>e.type==="entity_die").map(e=>e.entityId)).size,shotEvents.filter(e=>e.type==="entity_die").length,"death once");
const oneKill=shotEvents.find(e=>e.type==="entity_die");
assert.equal(sniper.credit(16,"enemigos","kill:"+oneKill.entityId,oneKill.entityId),false,"no double bounty");
const beforeDuplicate=sniper.economy.gold;
assert.equal(sniper.credit(16,"enemigos","kill:"+oneKill.entityId,oneKill.entityId),false);
assert.equal(sniper.economy.gold,beforeDuplicate);

const leveled=new M01CombatWorld(maps[0],campaign);assert(leveled.economy.build(0,"sniper").ok);
assert(leveled.economy.upgrade(0).ok);assert.equal(leveled.economy.gold,40);
assert(leveled.startWave());const leveledEvents=iterateUntil(leveled,()=>leveled.finishedWaves.has(1)||leveled.ended);
assert(leveledEvents.some(e=>e.type==="hit_applied"),"sniper II real impact");
assert(leveled.economy.assertEconomy());

const undefended=new M01CombatWorld(maps[0],campaign);let escapedEvents=[],waveStarts=0;
while(!undefended.ended&&waveStarts<5){
 assert(undefended.startWave());waveStarts++;
 escapedEvents.push(...iterateUntil(undefended,()=>!undefended.active||undefended.ended));
}
assert(undefended.ended&&!undefended.won,"no tower naturally loses");
assert.equal(undefended.lives,0);assert.equal(undefended.escapedCount,50);
assert.equal(undefended.kills,0);
assert.equal(escapedEvents.filter(e=>e.type==="entity_escape").length,50);
assert.equal(escapedEvents.filter(e=>e.type==="defeat").length,1);
assert.equal(undefended.tick(1/60).length,0,"no events after defeat");
assert.equal(undefended.economy.assertEconomy(),true);
const sold=new M01CombatWorld(maps[0],campaign);assert(sold.economy.build(2,"sniper").ok);
sold.startWave();for(let i=0;i<120;i++)sold.tick(1/60);
assert(sold.economy.sell(2).ok);
sold.syncTowers();assert.equal(sold.towers.size,0);assert.equal(sold.bullets.length,0);
console.log(JSON.stringify({status:"PASS_C1D2_NODE_REAL_COMBAT",canvasV5Parity:"M01 Normal only",sniperLevelI:{kills:sniper.kills,shots:shotEvents.filter(e=>e.type==="attack_fire").length},
sniperLevelII:{kills:leveled.kills},noDefense:{wavesStarted:waveStarts,escaped:undefended.escapedCount,defeatEvents:1},
economyLedger:sniper.economy.ledger.length,realDamage:true,phase:"NODE_VERIFIED_NOT_BROWSER_APPROVED"},null,2));
