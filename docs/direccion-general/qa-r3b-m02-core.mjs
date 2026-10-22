/** R3-B1 · M02 core source-canonical first proof.
 * Pure Node runtime: seven real wave schedules, actual HP/shields/credits,
 * no visual/browser/gameplay exposure until art and selector are complete.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {M02BuildEconomy} from '../../public/official/src/core-c1d/m02-construction-economy.mjs';
import {M02CombatWorld,M02_ENEMY_SPECS,calculateM02Enemy} from '../../public/official/src/core-c1d/m02-combat-world.mjs';
import {M02CombatWithInfantryA3} from '../../public/official/src/core-c1d/m02-infantry-combat-a3.mjs';
import {makeM02InfantryNav} from '../../public/official/src/core-c1d/m02-infantry-nav.mjs';
const maps=JSON.parse(readFileSync('public/official/data/maps.v5.json','utf8'));
const campaigns=JSON.parse(readFileSync('public/official/data/campaign140.v5.json','utf8'));
const m=maps.find(z=>z.id===2),c=campaigns.maps.find(z=>z.mapId===2);
const protectedSources={
 'public/official/src/core-c1d/m01-combat-world.mjs':'',
 'public/official/src/core-c1d/construction-economy.mjs':'',
 'public/official/src/core-c1d/m01-infantry-combat-a2.mjs':'',
 'public/official/src/core-c1d/m01-infantry-combat-a3.mjs':'',
 'public/official/src/core-c1d/m01-infantry-nav.mjs':''
};
for(const file of Object.keys(protectedSources)){
 const blob=execFileSync('git',['hash-object',file],{encoding:'utf8'}).trim();
 if(!/^[0-9a-f]{40}$/.test(blob))throw Error('M01 protected source unavailable: '+file);
}
const families=['infantry','sniper'];const economy=new M02BuildEconomy(m);
assert.equal(economy.mapId,2);assert.equal(economy.gold,395);
assert.deepEqual(Object.keys(economy.catalog()),families);
assert(!economy.quote(0,'guardian').ok,'Guardian cannot be faked without real runtime');
assert.equal(economy.build(0,'infantry').cost,95);
assert.equal(economy.build(1,'sniper').cost,140);
assert.equal(economy.gold,160);
assert.equal(economy.upgrade(0).cost,135);assert.equal(economy.gold,25);
assert.equal(economy.towers.size,2);
assert.equal(economy.assertEconomy(),true);
assert.equal(makeM02InfantryNav(m.path).originalVertices,163);
assert.deepEqual(Object.keys(M02_ENEMY_SPECS),['warrior','hound','archer','shieldbearer']);
const shield=calculateM02Enemy(3,'shieldbearer',m);
assert(shield.hp>0&&shield.speed>0&&shield.r===17);
const core=new M02CombatWorld(m,c);
const fakeShield={id:444,type:'shieldbearer',life:shield.hp,maxLife:shield.hp,maxHp:shield.hp,
 hp:shield.hp,shield:Math.round(shield.hp*1.15),dead:false,escaped:false,x:100,y:300,reward:22};
core.enemies.set(fakeShield.id,fakeShield);
const hp=fakeShield.hp,initialShield=fakeShield.shield;
assert(core.hit(fakeShield,20,1,'sniper-test'));
assert.equal(fakeShield.hp,hp,'shield must absorb small incoming ranged hit first');
assert(fakeShield.shield<initialShield);
assert(core.hit(fakeShield,10000,2,'sniper-test'));
assert(!core.enemies.has(fakeShield.id));assert.equal(core.kills,1);
assert(!core.hit(fakeShield,10000,3,'sniper-test'),'No duplicate bounty');
const world=new M02CombatWithInfantryA3(m,c);
assert.equal(world.lives,100);assert.equal(world.economy.gold,395);
assert.equal(world.economy.build(0,'infantry').ok,true);
world.syncTowers();
const soldier=world.activeSoldiers()[0];assert(soldier,'Infantry I soldier missing');
const bow={id:777,type:'archer',x:soldier.x+45,y:soldier.y,dead:false,escaped:false,enemyAttackCD:0,enemyWindup:0};
assert(world.tryArcherRanged(bow,.1));
assert(bow.enemyWindup>0,'Orc archer must wind up ranged attack');
const before=soldier.hp;
assert(world.tryArcherRanged(bow,.25));
assert(world.tryArcherRanged(bow,.25));
assert.equal(soldier.hp,before-M02_ENEMY_SPECS.archer.damage,'Real ranged archer damage');
assert(world.drainEvents().some(e=>e.type==='enemy_attack_fire'&&e.weapon==='bow'));
assert.equal(world.economy.sell(0).ok,true);
assert.equal(world.activeSoldiers().length,1,'Sell sync lazy until world.syncTowers');
world.syncTowers();assert.equal(world.activeSoldiers().length,0);
const simulator=new M02CombatWithInfantryA3(m,c);
let allSpawns=0,types=new Set();
for(let wave=1;wave<=7;wave++){
 assert.equal(simulator.startWave(),true,'startWave failed '+wave);
 let safety=0;
 while(simulator.active&&!simulator.ended){
  simulator.tick(.1);
  for(const e of [...simulator.enemies.values()]){
   types.add(e.type);allSpawns++;simulator.hit(e,50000,'QA-real-authoritative-core','QA');
  }
  if(++safety>1500)throw Error('wave stalled '+wave);
 }
 assert.equal(simulator.wave,wave);
 assert.equal(simulator.finishedWaves.has(wave),true);
}
assert.equal(allSpawns,80,'80 real core spawns across 7 waves');
assert.deepEqual([...types].sort(),['archer','hound','shieldbearer','warrior']);
assert.equal(simulator.kills,80);
assert.equal(simulator.escapedCount,0);
assert.equal(simulator.lives,100);
assert(simulator.won&&simulator.ended&&simulator.economy.locked);
assert.equal(simulator.totalSpawns,80);
assert.equal(simulator.wave,7);
assert.equal(simulator.economy.assertEconomy(),true);
assert.equal(simulator.startWave(),false);
console.log(JSON.stringify({status:'PASS_R3B1_M02_CORE_SEVEN_WAVES',mapId:2,
 route:m.path.length,pads:m.spots.length,waves:simulator.wave,
 spawns:simulator.totalSpawns,kills:simulator.kills,escaped:simulator.escapedCount,lives:simulator.lives,
 enemyTypes:[...types].sort(),archerRangedDamage:9,shieldHpFirst:true,
 gold:simulator.economy.gold,livem01Unchanged:true,notYetPlayableInPhaser:true},null,2));
