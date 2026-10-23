/** M03 source parity, real-budget completion, defeat, combat, records and protection.
 * No forced HP edits or bonus gold in the nine-wave victory scenario. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {M03CombatWorld,M03_ENEMY_SPECS,M03_WAVE_COUNTS,calculateM03Enemy,m03WaveBonus} from '../public/official/src/core-c1d/m03-campaign.mjs';
import {resolveCampaignDamage} from '../public/official/src/core-c1d/campaign-combat-world.mjs';
import {m03Result,m03ReadRecord,m03SaveVictory,M03_RESULT_STORAGE_KEY} from '../public/official/src/core-c1d/m03-results-phaser.mjs';
const read=p=>JSON.parse(readFileSync(p));
const map=read('public/official/data/maps.v5.json').find(x=>x.id===3),campaign=read('public/official/data/campaign140.v5.json').maps.find(x=>x.mapId===3);
const fresh=()=>new M03CombatWorld(map,campaign);
// Guard actual previously approved sources, not just the existence of a SHA.
for(const path of ['public/JUEGO_V5_CANVAS.html','public/official/data/maps.v5.json','public/official/data/campaign140.v5.json','public/official/src/m01-model.mjs',
 'public/official/src/core-c1d/m02-combat-world.mjs','public/official/src/core-c1d/m02-infantry-combat-a2.mjs','public/official/src/core-c1d/m02-infantry-combat-a3.mjs',
 'public/official/src/core-c1d/m02-construction-economy.mjs','public/official/src/maps-visual/m02/premium-golden-valley-r6.mjs','public/official/src/maps-visual/m01/r7/dawn-plateau-art.mjs']){
 assert.equal(execFileSync('git',['hash-object',path],{encoding:'utf8'}).trim(),execFileSync('git',['rev-parse','0e85c3a:'+path],{encoding:'utf8'}).trim(),path+' changed outside M03');
}
const w=fresh();assert.equal(w.lives,100);assert.equal(w.economy.gold,410);assert.equal(w.route.points.length,188);assert.equal(w.airRoute.points.length,18);
assert.deepEqual(w.route.points,map.path);assert.equal(w.infantryNav.nodes.length,188);
assert.deepEqual(Object.keys(w.economy.catalog()),['infantry','sniper']);
for(const family of ['guardian','bomber','control'])assert(!w.economy.build(0,family).ok);
assert(w.economy.build(0,'infantry').ok);assert.equal(w.economy.gold,315);assert(w.economy.upgrade(0).ok);assert.equal(w.economy.gold,180);
assert(!w.economy.upgrade(0).ok);w.syncTowers();assert.equal(w.soldiers.length,2);
assert(w.economy.sell(0).ok);w.syncTowers();assert.equal(w.soldiers.length,0);assert.equal(w.economy.gold,329);assert(w.economy.assertEconomy());
// Seven source specs and nine canonical rosters, with Normal legacy multipliers.
assert.equal(Object.keys(M03_ENEMY_SPECS).length,7);
assert.equal(calculateM03Enemy(1,'foreststalker',map).hp,39);
assert.equal(calculateM03Enemy(1,'hunter',map).speed,76.35);
assert.equal(calculateM03Enemy(5,'bat',map).hp,89);
assert.equal(m03WaveBonus(1),52);assert.equal(m03WaveBonus(8),173);
assert.equal(resolveCampaignDamage(100,{resist:{ranged:.72}},'ranged').dealt,72);
assert.equal(resolveCampaignDamage(100,{resist:{melee:1.25}},'melee').dealt,125);
assert.deepEqual(resolveCampaignDamage(30,{shield:40}),{absorbed:30,dealt:0,total:30});
// Actual ranged hunter attack against an actual recruited soldier.
const melee=fresh();melee.economy.build(1,'infantry');melee.syncTowers();const unit=melee.activeSoldiers()[0];
const hunter={id:987,type:'hunter',x:unit.x+40,y:unit.y,dead:false,escaped:false,enemyAttackCD:0,enemyWindup:0};
assert(melee.tryArcherRanged(hunter,.1));const hp=unit.hp;melee.tryArcherRanged(hunter,.2);melee.tryArcherRanged(hunter,.2);assert.equal(unit.hp,hp-9);
assert(melee.drainEvents().some(e=>e.type==='enemy_attack_fire'&&e.entityId===987));
assert.equal(melee.tryBlock({type:'bat',flying:true,blockable:false,r:16},unit,{x:unit.x+1,y:unit.y},new Map()),null);
assert(melee.setInfantryRally(1,unit.x,unit.y).ok);assert(!melee.setInfantryRally(1,-1000,-1000).ok);
melee.pause();const frozen=JSON.stringify(melee.snapshot);melee.tick(.2);assert.equal(JSON.stringify(melee.snapshot),frozen);assert(!melee.startWave());melee.resume();
// Honest budget strategy: buy snipers only with starting/bounty/bonus funds, then upgrade I→II.
const game=fresh(),order=[1,3,4,5,6,7,2,0],seen=new Set(),counts=[],events=[],perWave=[];
for(let wave=1;wave<=9;wave++){
 for(const i of order)if(!game.economy.getTower(i))game.economy.build(i,'sniper');
 for(const i of order)if(game.economy.getTower(i)?.level===1)game.economy.upgrade(i);
 const before=game.totalSpawns;assert(game.startWave());assert(!game.startWave());let steps=0;
 while(game.active&&!game.ended&&steps++<60000){for(const e of game.tick(1/60)){events.push(e);if(e.type==='spawn')seen.add(e.entity.type);}}
 assert(steps<60000,'Wave stalled');assert.equal(game.totalSpawns-before,M03_WAVE_COUNTS[wave-1]);counts.push(game.totalSpawns-before);
 assert(game.economy.assertEconomy());perWave.push({wave,kills:game.kills,escaped:game.escapedCount,gold:game.economy.gold});
}
assert(game.won&&game.ended);assert.equal(game.totalSpawns,101);assert.equal(game.kills,93);assert.equal(game.escapedCount,8);assert.equal(game.lives,84);
assert.equal(seen.size,7);assert.equal(events.filter(e=>e.type==='wave_clear').length,9);assert.equal(events.filter(e=>e.type==='wave_bonus').length,8);assert.equal(events.filter(e=>e.type==='campaign_map_win').length,1);
assert.equal(new Set(events.map(e=>e.eventId)).size,events.length);assert.equal(game.rewardKeys.size,game.kills+8);
const end=JSON.stringify(game.snapshot);for(let i=0;i<100;i++)game.tick(.1);assert.equal(JSON.stringify(game.snapshot),end);assert(!game.startWave());assert(!game.economy.sell(1).ok);
const cache=new Map(),storage={getItem:k=>cache.get(k)||null,setItem:(k,v)=>cache.set(k,v)};
const result=m03Result(game.snapshot);assert.equal(result.stars,2);assert(m03SaveVictory(storage,result).written);assert.equal(m03ReadRecord(storage).map,3);assert.deepEqual([...cache.keys()],[M03_RESULT_STORAGE_KEY]);
// No-defense loss uses actual movement/fugues, never forced lives or fake result snapshots.
const loss=fresh();let iterations=0;while(!loss.ended&&iterations++<100000){if(!loss.active)assert(loss.startWave());loss.tick(.1);}
assert(loss.ended&&!loss.won);assert.equal(loss.lives,0);assert.equal(loss.escapedCount,50);assert.equal(m03Result(loss.snapshot).stars,0);assert(!m03SaveVictory(storage,m03Result(loss.snapshot)).written);
assert(!m03SaveVictory(null,result).written,'Unavailable Storage must not claim a save');
console.log(JSON.stringify({status:'PASS_M03_CANONICAL_NINE_WAVES',counts,types:[...seen],victory:game.snapshot,defeat:loss.snapshot,perWave},null,2));
