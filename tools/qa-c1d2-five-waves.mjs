/**
 * C1-D2 G3 E2E — M01 Normal complete 5-wave gameplay characterization.
 * This is a deterministic fast-forward of THE REAL core, not a fake result.
 * A scripted purchasing policy is NOT a human playtest or balanced strategy.
 * Protected Canvas V5 and campaign JSON are read-only.
 */
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {M01CombatWorld} from "../public/official/src/core-c1d/m01-combat-world.mjs";
const maps=JSON.parse(readFileSync(new URL("../public/official/data/maps.v5.json",import.meta.url),"utf8"));
const table=JSON.parse(readFileSync(new URL("../public/official/data/campaign140.v5.json",import.meta.url),"utf8"));
const map=maps[0],campaign=table.maps[0],EXPECTED=[8,10,11,13,21];
assert.equal(map.id,1);assert.equal(map.path.length,133);assert.equal(map.spots.length,8);
assert.deepEqual(campaign.waves.map(w=>w.groups.reduce((n,g)=>n+g.count,0)),EXPECTED);

function scenario(label,orders=[],{buyDuringWave=false,upgradeAfterBuying=false}={}){
 const world=new M01CombatWorld(map,campaign),eventLog=[],purchases=[],steps=[];
 const indexOrder=orders.slice();let clockTicks=0;
 function buyWhenPossible(){
  if(world.ended||world.economy.locked)return;
  for(const pad of indexOrder){
   if(world.economy.getTower(pad))continue;
   const q=world.economy.quote(pad,"sniper");
   if(!q.ok)return;
   const b=world.economy.build(pad,"sniper");assert(b.ok);
   world.syncTowers();purchases.push({wave:world.wave,tick:clockTicks,kind:"build",pad,gold:world.economy.gold});
  }
  if(!upgradeAfterBuying)return;
  for(const pad of indexOrder){
   const q=world.economy.quoteUpgrade(pad);
   if(!q.ok)continue;
   const up=world.economy.upgrade(pad);assert(up.ok);
   world.syncTowers();purchases.push({wave:world.wave,tick:clockTicks,kind:"upgrade",pad,gold:world.economy.gold});
  }
 }
 for(let wave=1;wave<=5&&!world.ended;wave++){
  buyWhenPossible();
  assert.equal(world.startWave(),true,"wave "+wave+" must start");
  assert.equal(world.wave,wave);
  let localTicks=0;
  while(world.active&&!world.ended){
   const emitted=world.tick(1/60);eventLog.push(...emitted);
   localTicks++;clockTicks++;
   if(buyDuringWave&&clockTicks%30===0)buyWhenPossible();
   if(localTicks%180===0){
    assert.equal(world.economy.assertEconomy(),true,label+" invalid ledger");
    assert.equal(world.totalSpawns,world.kills+world.escapedCount+world.enemies.size,label+" missing enemy");
    assert(world.economy.gold>=0,label+" negative gold");
   }
   assert(localTicks<30000,label+" wave "+wave+" exceeded five minutes at 60 fps");
  }
  steps.push({wave,ticks:localTicks,spawns:world.totalSpawns,leaks:world.escapedCount,kills:world.kills,
   lives:world.lives,gold:world.economy.gold,outcome:world.ended?(world.won?"victory":"defeat"):"wave_clear"});
 }
 const byType=type=>eventLog.filter(x=>x.type===type);
 const kills=byType("entity_die"),escaped=byType("entity_escape");
 assert.equal(kills.length,world.kills,label+" death event count");
 assert.equal(escaped.length,world.escapedCount,label+" escape event count");
 assert.equal(new Set(kills.map(x=>x.entityId)).size,kills.length,label+" duplicate death");
 assert.equal(new Set(escaped.map(x=>x.entityId)).size,escaped.length,label+" duplicate escape");
 assert(kills.every(k=>!escaped.some(e=>e.entityId===k.entityId)),label+" death and escape same enemy");
 const bounty=world.economy.ledger.filter(tx=>tx.type==="credit"&&tx.source==="enemigos");
 const waveCredits=world.economy.ledger.filter(tx=>tx.type==="credit"&&tx.source==="bonos");
 assert.equal(bounty.length,kills.length,label+" bounty count must equal kills");
 assert.equal(new Set(bounty.map(x=>x.towerId)).size,bounty.length,label+" duplicate reward keys");
 assert.equal(waveCredits.length,byType("wave_bonus").length,label+" bonus per wave event");
 assert.equal(new Set(waveCredits.map(tx=>tx.towerId)).size,waveCredits.length,label+" double wave reward");
 assert.equal(world.economy.assertEconomy(),true);
 assert.equal(world.totalSpawns,world.kills+world.escapedCount+world.enemies.size);
 assert(world.ended,label+" must end naturally (win or loss)");
 if(world.won){
  assert.equal(world.wave,5);assert.equal(world.totalSpawns,63);assert.equal(world.enemies.size,0);
  assert.equal(world.kills+world.escapedCount,63);assert(world.lives>0);
  assert.deepEqual(byType("wave_start").map(e=>e.spawnTotal),EXPECTED);
  assert.equal(byType("campaign_map_win").length,1);assert.equal(byType("defeat").length,0);
  assert.equal(waveCredits.length,4,"four wave clear bonuses, none on last");
 }else{
  assert.equal(world.lives,0);assert.equal(byType("defeat").length,1);
  assert.equal(byType("campaign_map_win").length,0);
  assert.equal(world.won,false);
 }
 const snap={label,status:world.won?"VICTORY":"DEFEAT",scriptedNotHuman:true,turns:steps.length,
  waves:steps,spawns:world.totalSpawns,kills:world.kills,escapes:world.escapedCount,
  lives:world.lives,gold:world.economy.gold,bountyTransactions:bounty.length,
  waveBonusTransactions:waveCredits.length,coinsFromKills:bounty.reduce((a,b)=>a+b.amount,0),
  purchased:purchases.length,steps:clockTicks,events:eventLog.length};
 console.log("C1D2_SCENARIO",JSON.stringify(snap));
 return snap;
}
const noDefense=scenario("no_defense");
assert.equal(noDefense.status,"DEFEAT");
assert.equal(noDefense.escapes,50);
assert.equal(noDefense.kills,0);
assert.equal(noDefense.lives,0);
const single=scenario("one_sniper",[0]);
const policies=[
 {name:"coverage_early_mid_late",pads:[0,2,4,7,1,3,5,6]},
 {name:"coverage_mid_first",pads:[2,0,4,7,3,1,5,6]},
 {name:"coverage_power",pads:[1,5,7,0,2,4,3,6]},
 {name:"coverage_tempos",pads:[0,3,6,2,4,1,5,7]}
];
const explored=policies.map(p=>scenario(p.name,p.pads,{buyDuringWave:true,upgradeAfterBuying:true}));
const wins=explored.filter(x=>x.status==="VICTORY");
const result={test:"C1D2_M01_FULL_SESSION_CHARACTERIZATION",canonicWaveSpawns:EXPECTED,
 noDefense:{status:noDefense.status,escapes:noDefense.escapes},oneSniper:{status:single.status,kills:single.kills},
 strategyTrials:explored.map(s=>({name:s.label,outcome:s.status,kills:s.kills,leaks:s.escapes,lives:s.lives,waves:s.turns})),
 demonstratedFiveWaveWin:wins.length>0,passesCoreIntegrity:true,visualMTPIntegrated:false,physicalMobileNotRun:true};
console.log("C1D2_FULL_SESSION_RESULT",JSON.stringify(result,null,2));
if(!wins.length)console.error("C1D2_BLOCKER: None of four tested purchasing policies wins. A real playable victory is not yet established. Do not promote staging.");
