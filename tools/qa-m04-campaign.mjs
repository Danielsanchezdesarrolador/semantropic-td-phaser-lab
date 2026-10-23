/** Real-budget M04 completion plus focused support, armour, economy and records. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {M04CombatWorld,M04_ENEMY_SPECS,M04_WAVE_COUNTS,calculateM04Enemy} from '../public/official/src/core-c1d/m04-campaign.mjs';
import {resolveCampaignDamage} from '../public/official/src/core-c1d/campaign-combat-world.mjs';
import {m04Result,m04ReadRecord,m04SaveVictory,M04_RESULT_STORAGE_KEY} from '../public/official/src/core-c1d/m04-results-phaser.mjs';
import {getContextMenuVisualSpec} from '../public/official/src/towers-visual/t09/spec.mjs';
assert.equal(getContextMenuVisualSpec({socket:{index:8,count:9}}).selectedSocketIndex,8);
assert.throws(()=>getContextMenuVisualSpec({socket:{index:9,count:9}}));
assert.throws(()=>getContextMenuVisualSpec({socket:{index:8}}));
const map=JSON.parse(readFileSync('public/official/data/maps.v5.json')).find(m=>m.id===4),campaign=JSON.parse(readFileSync('public/official/data/campaign140.v5.json')).maps.find(m=>m.mapId===4);
const fresh=()=>new M04CombatWorld(map,campaign);
const pins=JSON.parse(readFileSync('docs/blocks/m04-game01/protected-blobs.json'));
for(const [p,h] of Object.entries(pins))assert.equal(execFileSync('git',['hash-object',p],{encoding:'utf8'}).trim(),h,'Protected source changed: '+p);
const w=fresh();assert.equal(w.lives,100);assert.equal(w.economy.gold,395);assert.deepEqual(w.route.points,map.path);assert.equal(w.infantryNav.nodes.length,262);assert.equal(w.economy.snapshot.sockets,9);
assert(!w.economy.build(9,'sniper').ok);assert(!w.economy.build(0,'guardian').ok);
assert(w.economy.build(8,'infantry').ok);assert(w.economy.upgrade(8).ok);assert(!w.economy.upgrade(8).ok);w.syncTowers();assert.equal(w.soldiers.length,2);
const u=w.activeSoldiers()[0];assert(w.setInfantryRally(8,u.x,u.y).ok);assert(!w.setInfantryRally(8,-900,-900).ok);
assert(w.economy.sell(8).ok);w.syncTowers();assert.equal(w.soldiers.length,0);assert(w.economy.assertEconomy());
// Nine simultaneous real towers, purchased from ordinary accumulated earnings below.
assert.equal(Object.keys(M04_ENEMY_SPECS).length,6);
const raw=Math.round((30+13)*map.scale*2.7*map.enemyHpMultiplier);assert.equal(calculateM04Enemy(1,'brute',map).hp,Math.round(raw*.77));
assert(Math.abs(resolveCampaignDamage(100,{armor:.1,resist:{ranged:1.13}}).dealt-101.7)<1e-8);
// Support lifecycle: explicit isolated damaged entities, not the victory scenario.
const heal=fresh();heal.startWave();heal.tick(.01);const target=[...heal.enemies.values()][0];
target.life-=50;target.hp=target.life;
const shaman={...target,id:900,type:'shaman',life:100,maxLife:100,hp:100,maxHp:100,specialCD:0,channel:0};heal.enemies.set(900,shaman);
const before=target.life;assert(heal.tryEnemySupport(shaman,.1));assert.equal(target.life,before);
for(let i=0;i<10;i++)heal.tryEnemySupport(shaman,.1);
assert.equal(target.life,Math.min(target.maxLife,before+32));assert.equal(target.hp,target.life);assert.equal(shaman.specialCD,7);
assert.equal(heal.tryEnemySupport(shaman,.1),false);assert(heal.drainEvents().some(e=>e.type==='enemy_heal'));
// Support cannot heal self, dead/escaped/out-of-range targets or tick when paused.
shaman.specialCD=0;target.life=target.maxLife;shaman.life=10;assert.equal(heal.tryEnemySupport(shaman,.1),false);
target.life-=20;assert(heal.tryEnemySupport(shaman,.1));target.x+=500;const hp=target.life;for(let i=0;i<10;i++)heal.tryEnemySupport(shaman,.1);assert.equal(target.life,hp);
heal.pause();const frozen=JSON.stringify(heal.snapshot),channel=shaman.channel;heal.tick(.2);assert.equal(JSON.stringify(heal.snapshot),frozen);assert.equal(shaman.channel,channel);assert(!heal.startWave());heal.resume();
const game=fresh(),order=[0,2,3,4,5,6,7,8,1],seen=new Set(),counts=[],events=[],perWave=[],crossedBridges=new Set();
for(let wave=1;wave<=11;wave++){
 for(const i of order)if(!game.economy.getTower(i))game.economy.build(i,'sniper');
 for(const i of order)if(game.economy.getTower(i)?.level===1)game.economy.upgrade(i);
 const before=game.totalSpawns;assert(game.startWave());assert(!game.startWave());let steps=0;
 while(game.active&&!game.ended&&steps++<60000)for(const e of game.tick(1/60)){events.push(e);if(e.type==='spawn'){seen.add(e.entity.type);if(e.entity.type==='brute')assert.equal(e.entity.armor,.1);}
  for(const actor of game.enemies.values())map.decor.bridge_centers.forEach((p,i)=>{if(Math.hypot(actor.x-p[0],actor.y-p[1])<12)crossedBridges.add(i);});}
 assert(steps<60000);counts.push(game.totalSpawns-before);assert.equal(counts.at(-1),M04_WAVE_COUNTS[wave-1]);assert(game.economy.assertEconomy());
 perWave.push({wave,kills:game.kills,escaped:game.escapedCount,gold:game.economy.gold});
}
assert(game.won&&game.ended);assert.equal(crossedBridges.size,2);assert.equal(game.totalSpawns,94);assert.equal(game.kills,80);assert.equal(game.escapedCount,14);assert.equal(game.lives,72);assert.equal(seen.size,6);assert.equal(game.economy.towers.size,9);
assert(events.some(e=>e.type==='enemy_heal'));assert.equal(events.filter(e=>e.type==='wave_bonus').length,10);assert.equal(events.filter(e=>e.type==='campaign_map_win').length,1);assert.equal(new Set(events.map(e=>e.eventId)).size,events.length);assert.equal(game.rewardKeys.size,game.kills+10);
const end=JSON.stringify(game.snapshot);for(let i=0;i<100;i++)game.tick(.1);assert.equal(JSON.stringify(game.snapshot),end);assert(!game.startWave());assert(!game.economy.sell(0).ok);
const cache=new Map([['semantropic_td_phaser_m03_normal_v1','preserved'],['semantropic_td_phaser_m02_normal_v1','preserved']]),storage={getItem:k=>cache.get(k)||null,setItem:(k,v)=>cache.set(k,v)};
const result=m04Result(game.snapshot);assert.equal(result.map,4);assert.equal(result.mode,'normal');assert.equal(result.stars,2);assert(m04SaveVictory(storage,result).written);assert.equal(m04ReadRecord(storage).totalSpawns,94);m04SaveVictory(storage,result);assert.equal(cache.size,3);assert.equal(cache.get('semantropic_td_phaser_m03_normal_v1'),'preserved');
const loss=fresh();let steps=0;while(!loss.ended&&steps++<100000){if(!loss.active)assert(loss.startWave());loss.tick(.1);}
assert(loss.ended&&!loss.won);assert.equal(loss.lives,0);assert.equal(loss.escapedCount,50);assert.equal(m04Result(loss.snapshot).stars,0);assert(!m04SaveVictory(storage,m04Result(loss.snapshot)).written);assert(!m04SaveVictory(null,result).written);
console.log(JSON.stringify({status:'PASS_M04_ELEVEN_CANONICAL_WAVES',counts,types:[...seen],victory:game.snapshot,defeat:loss.snapshot,heals:events.filter(e=>e.type==='enemy_heal').length,crossedBridges:[...crossedBridges],perWave},null,2));
