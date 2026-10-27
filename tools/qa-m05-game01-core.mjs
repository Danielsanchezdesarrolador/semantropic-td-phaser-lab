/** Source-derived parity + real-budget campaign; fixtures isolated from completion. */
import assert from'node:assert/strict';import{readFileSync,mkdirSync,writeFileSync}from'node:fs';import vm from'node:vm';
import{M05CombatWorld,M05_ENEMY_SPECS,M05_WAVE_COUNTS,calculateM05Enemy,m05WaveBonus}from'../public/official/src/core-c1d/m05-campaign.mjs';
import{M05_BOSS}from'../public/official/src/core-c1d/m05-boss.mjs';
import{m05Result,m05Stars,m05SaveVictory,m05ReadRecord,M05_RESULT_STORAGE_KEY}from'../public/official/src/core-c1d/m05-results-phaser.mjs';
const maps=JSON.parse(readFileSync('public/official/data/maps.v5.json')),map=maps.find(m=>m.id===5),campaign=JSON.parse(readFileSync('public/official/data/campaign140.v5.json')).maps.find(m=>m.mapId===5),fresh=()=>new M05CombatWorld(map,campaign);
const canvas=readFileSync('public/JUEGO_V5_CANVAS.html','utf8'),literal=name=>canvas.match(new RegExp('const '+name+'\\s*=([\\s\\S]*?);\\n'))[1];
const e1=literal('E1_ENEMIES'),offset=canvas.indexOf('Object.assign(E1_ENEMIES,{',canvas.indexOf('const E1_ENEMIES=')),e3=canvas.slice(offset,canvas.indexOf('});',offset)+3),boss=JSON.parse(JSON.stringify(vm.runInNewContext('('+literal('E4_BOSSES')+')'))).mistlord;
const defs=JSON.parse(JSON.stringify(vm.runInNewContext('var E1_ENEMIES='+e1+';'+e3+';E1_ENEMIES;')));
assert.equal(boss.hp,M05_BOSS.hp);assert.equal(boss.escapeLives,30);assert.deepEqual(boss.skillCd,M05_BOSS.cooldowns);assert.deepEqual(boss.windup,M05_BOSS.windup);assert.deepEqual(boss.phaseThresholds,M05_BOSS.thresholds);
const hpLocal=JSON.parse(JSON.stringify(vm.runInNewContext('('+literal('QA16_HP_BALANCE')+')')))[5].normal;
const shieldLocal=JSON.parse(JSON.stringify(vm.runInNewContext('('+literal('QA16_SHIELD_BALANCE')+')')))[5].normal;
assert.equal(shieldLocal,.4);assert.equal(hpLocal.brute,.9);
const bounty=Function('MAX_WAVES','amount',canvas.match(/function campaign140Bounty\(amount\)\{([^}]*)\}/)[1]).bind(null,13);
const types=[...new Set(campaign.waves.flatMap(w=>w.groups.map(g=>g.type)))];assert.equal(types.length,8);assert.equal(campaign.waves.flatMap(w=>w.groups).reduce((n,g)=>n+g.count,0),110);
for(let wave=1;wave<=13;wave++)for(const type of types){
 const spec=defs[type],actual=calculateM05Enemy(wave,type,map),raw=Math.round((30+wave*13)*map.scale*(1+Math.max(0,wave-3)*(.095+5*.009))*spec.hpFactor*map.enemyHpMultiplier);
 assert.equal(actual.hp,Math.round(raw*(hpLocal[type]||1)));assert.equal(actual.speed,spec.speed+Math.min(wave*1.5,18)+4.75);assert.equal(actual.reward,bounty(spec.reward));assert.equal(actual.r,spec.size);
 for(const key of['damage','interval','windup','blockable'])assert.equal(M05_ENEMY_SPECS[type][key],spec[key]);
}
const w=fresh(),order=[0,3,4,5,2,7,6,8,1],events=[],waveCounts=[];
function spend(){for(const i of order)if(!w.economy.getTower(i))w.economy.build(i,'sniper');for(const i of order)if(w.economy.getTower(i)?.level===1)w.economy.upgrade(i);}
for(let wave=1;wave<=13;wave++){
 spend();assert(w.startWave());assert(!w.startWave());const groupBefore=w.groupSpawns;let n=0;
 const expected=campaign.waves[wave-1].groups.flatMap((g,group)=>Array.from({length:g.count},(_,i)=>({type:g.type,at:g.startOffset+i*g.spawnInterval,group}))).sort((a,b)=>a.at-b.at||a.group-b.group);
 assert.deepEqual(w.spawnQueue.filter(s=>s.type!=='mistlord').map(({type,at,group})=>({type,at,group})),expected);
 if(wave===13)assert.equal(w.spawnQueue.at(-1).at,Math.max(...expected.map(e=>e.at))+3.5);
 while(w.active&&!w.ended&&n++<20000){events.push(...w.tick(.05));spend();}assert(n<20000);assert(w.economy.assertEconomy());waveCounts.push(w.groupSpawns-groupBefore);assert.equal(waveCounts.at(-1),M05_WAVE_COUNTS[wave-1]);
}
assert(w.won&&w.ended&&w.bossEncounter.defeated&&!w.bossEncounter.escaped);assert.equal(w.groupSpawns,110);assert.equal(w.bossSpawns,1);assert(w.summonedSpawns<=6);assert.equal(w.totalSpawns,111+w.summonedSpawns);
assert.deepEqual(new Set(events.filter(e=>e.type==='spawn'&&e.spawnSource==='group').map(e=>e.entity.type)),new Set(types));assert(events.some(e=>e.type==='entity_revive'));assert(events.some(e=>e.type==='enemy_heal'));assert.deepEqual(events.filter(e=>e.type==='boss_phase').map(e=>e.phase),[2,3]);assert.equal(events.filter(e=>e.type==='campaign_map_win').length,1);assert.equal(events.filter(e=>e.type==='wave_bonus').length,12);
for(const e of events.filter(e=>e.type==='spawn'&&e.entity.type==='shieldbearer'))assert.equal(e.entity.shield,Math.round(e.entity.maxLife*1.15*shieldLocal));
// Focused E4 fixtures; not the real-budget completion above.
const f=fresh();f.wave=12;f.startWave();for(let i=0;i<1000&&!f.bossEncounter.spawned;i++){
 for(const e of [...f.enemies.values()])if(!e.isBoss)f.hit(e,1e8,'fixture',null);f.tick(.05);if(!f.bossEncounter.spawned)assert(!f.ended,'Must await scheduled boss');
}
const b=f.enemies.get(f.bossEncounter.id);assert(b&&b.maxLife===boss.hp&&b.speed===boss.speed&&b.reward===bounty(boss.reward));
const spawn=(type,x=b.x,y=b.y)=>{const id=f.nextEnemyId++;f.spawnQueue.push({id,type,at:f.waveSeconds,group:999});f.spawnReady();const e=f.enemies.get(id);e.x=x;e.y=y;return e;};
const ally=spawn('warrior');const original=ally.life;f.executeBoss('mist',b,f.bossEncounter);assert.equal(ally.bossBlessing,6.8);f.hit(ally,10,'fixture',null);assert(Math.abs(ally.life-(original-8.8))<1e-8);
ally.life=1;ally.hp=1;const before=ally.life;f.executeBoss('heal',b,f.bossEncounter);assert.equal(ally.life-before,Math.min(55,ally.maxLife-before));assert(f.bossEncounter.healLeft<210);
ally.bossBlessing=0;f.hit(ally,1e8,'fixture',null);const paid=f.economy.gold;const corpse=f.corpses.find(c=>c.entity===ally);assert(corpse);f.corpses=[corpse];f.executeBoss('revive',b,f.bossEncounter);assert.equal(ally.life,Math.round(ally.maxLife*.38));assert.equal(f.bossEncounter.reviveLeft,0);f.hit(ally,1e8,'fixture',null);assert.equal(f.economy.gold,paid);assert(!f.corpses.some(c=>c.entity===ally));
const weaver=spawn('weaver'),victim=spawn('warrior');f.hit(victim,1e8,'fixture',null);const gold=f.economy.gold;assert(f.tryEnemySupport(weaver,.1));for(let i=0;i<27;i++)f.tryEnemySupport(weaver,.05);assert(!victim.dead);assert.equal(victim.life,Math.round(victim.maxLife*.42));f.hit(victim,1e8,'fixture',null);assert.equal(f.economy.gold,gold);
f.executeBoss('summon',b,f.bossEncounter);assert(f.summonedSpawns>=2);assert([...f.enemies.values()].filter(e=>e.e4Summoned).every(e=>e.reward===0&&e.rewardPaid));
assert(f.economy.build(0,'infantry').ok);f.syncTowers();const soldier=f.activeSoldiers()[0];soldier.x=b.x;soldier.y=b.y;const hp=soldier.hp;f.executeBoss('veil',b,f.bossEncounter);assert.equal(soldier.hp,hp-22);
const oldProgress=b.progress;f.bossEncounter.cast={id:'mist',time:1};f.moveEnemies(.05);assert.equal(b.progress,oldProgress);f.pause();const frozen=JSON.stringify(f.snapshot);f.tick(.2);assert.equal(JSON.stringify(f.snapshot),frozen);f.resume();
const esc=fresh();esc.wave=12;esc.startWave();esc.waveSeconds=100;esc.spawnReady();const eb=esc.enemies.get(esc.bossEncounter.id);assert(esc.escape(eb));assert.equal(esc.lives,70);assert(!esc.escape(eb));assert.equal(esc.escapedCount,1);assert(esc.bossEncounter.escaped);
// W13-only unarmed traversal fixture: scheduled boss really walks and escapes.
const bossLeak=fresh();bossLeak.wave=12;bossLeak.startWave();let leakTicks=0;while(!bossLeak.ended&&leakTicks++<12000)bossLeak.tick(.05);
assert(bossLeak.ended&&bossLeak.won&&bossLeak.bossEncounter.escaped&&!bossLeak.bossEncounter.defeated);assert.equal(bossLeak.bossSpawns,1);assert.equal(bossLeak.groupSpawns,10);assert.equal(bossLeak.lives,100-30-2*(bossLeak.escapedCount-1));assert.equal(m05Stars(bossLeak.snapshot),1);
const starsBase={...w.snapshot,boss:{defeated:true,escaped:false}};for(const[escaped,stars]of[[0,3],[5,3],[6,2],[25,2],[26,1]])assert.equal(m05Stars({...starsBase,escaped}),stars);assert.equal(m05Stars({...starsBase,boss:{escaped:true,defeated:false},escaped:1}),1);
const cache=new Map([['semantropic_td_phaser_m04_normal_v1','protected']]),storage={getItem:k=>cache.get(k),setItem:(k,v)=>cache.set(k,v)},result=m05Result(w.snapshot);
assert(m05SaveVictory(storage,result).written);assert(m05ReadRecord(storage));assert.equal(cache.get('semantropic_td_phaser_m04_normal_v1'),'protected');assert.equal(cache.size,2);m05SaveVictory(storage,result);assert.equal(cache.size,2);assert(!m05SaveVictory({getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}},result).written);
assert(!m05SaveVictory(storage,{...result,outcome:'defeat'}).written);assert(!m05SaveVictory(storage,{...result,completedWaves:12}).written);assert(!m05SaveVictory(storage,{...result,bossResolved:false}).written);
const lost=fresh();let n=0;while(!lost.ended&&n++<30000){if(!lost.active)lost.startWave();lost.tick(.1);}assert(lost.ended&&!lost.won&&lost.lives===0);assert.equal(m05Result(lost.snapshot).stars,0);
mkdirSync('artifacts/m05-game01',{recursive:true});writeFileSync('artifacts/m05-game01/core.json',JSON.stringify({status:'PASS_M05_CANONICAL_13_WAVES_110_GROUPS_PLUS_BOSS_SOURCE_PARITY',types,waveCounts,canonicalBoss:boss,victory:w.snapshot,defeat:lost.snapshot,result,provisionalActors:['brute','shaman','weaver','mistlord'],source:'protected Canvas E1/E2/E3/E4/E5 and QA16 M05 Normal',tests:'Parity, real budget completion, pending boss gate, all five skills, revive no bounty, pause, boss escape, stars and isolated/blocked storage'},null,2));console.log('PASS_M05_CANONICAL_13_WAVES_110_GROUPS_PLUS_BOSS_SOURCE_PARITY');
