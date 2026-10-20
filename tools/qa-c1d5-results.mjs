import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {M01CombatWithInfantry} from "../public/official/src/core-c1d/m01-infantry-combat.mjs";
import {M01_RESULT_SCHEMA,M01_RESULT_STORAGE_KEY,m01Stars,m01Result,m01BetterRecord,m01ReadRecord,m01SaveVictory,M01_STAR_LIMITS} from "../public/official/src/core-c1d/m01-results-phaser.mjs";
const map=JSON.parse(readFileSync(new URL("../public/official/data/maps.v5.json",import.meta.url),"utf8"))[0];
const camp=JSON.parse(readFileSync(new URL("../public/official/data/campaign140.v5.json",import.meta.url),"utf8")).maps[0];
const v5=readFileSync(new URL("../public/JUEGO_V5_CANVAS.html",import.meta.url),"utf8");
assert(v5.includes("maxLeaksThreeStars:5,maxLeaksTwoStars:25,twoStarsProvisional:true"));
assert.deepEqual(M01_STAR_LIMITS,{three:5,two:25,twoProvisional:true});
function snapshot(escaped,won=true){
 return {ended:true,won,lives:won?Math.max(1,100-escaped*2):0,escaped,wave:5,
  kills:won?63-escaped:0,gold:20,totalSpawns:63};
}
for(const [leaks,star] of [[0,3],[5,3],[6,2],[25,2],[26,1],[49,1]])
 assert.equal(m01Stars(snapshot(leaks)),star);
assert.equal(m01Stars({ended:false,won:false,escaped:0}),0);
assert.equal(m01Stars(snapshot(50,false)),0);
const database=new Map(),storage={getItem:k=>database.get(k)||null,
 setItem:(k,v)=>database.set(k,v)};
const r2=m01Result(snapshot(9)),r3=m01Result(snapshot(2));
assert.equal(r2.stars,2);assert.equal(r3.stars,3);
assert.equal(m01SaveVictory(storage,m01Result(snapshot(50,false))).written,false);
assert.equal(database.size,0);
assert.equal(m01SaveVictory(storage,r2).written,true);
assert.equal(m01ReadRecord(storage).stars,2);
m01SaveVictory(storage,r3);assert.equal(m01ReadRecord(storage).stars,3);
m01SaveVictory(storage,r2);assert.equal(m01ReadRecord(storage).stars,3);
assert.equal(database.size,1);
assert(database.has(M01_RESULT_STORAGE_KEY));
database.set(M01_RESULT_STORAGE_KEY,"garbled");
assert.equal(m01ReadRecord(storage),null);
const denied={getItem:()=>{throw Error("blocked")},setItem:()=>{throw Error("blocked")}};
assert.equal(m01SaveVictory(denied,r3).written,false);
assert.equal(m01BetterRecord(null,r2).stars,2);
assert.equal(r3.schema,M01_RESULT_SCHEMA);
const noDefense=new M01CombatWithInfantry(map,camp);
for(let wave=1;wave<=5&&!noDefense.ended;wave++){
 assert(noDefense.startWave());let n=0;
 while(noDefense.active&&!noDefense.ended&&n++<28000)noDefense.tick(1/60);
 assert(n<28000);
}
assert(noDefense.ended);assert(!noDefense.won);assert.equal(noDefense.escapedCount,50);
const defeated=m01Result(noDefense.snapshot);
assert.equal(defeated.outcome,"defeat");assert.equal(defeated.stars,0);
assert.equal(m01SaveVictory(storage,defeated).written,false);
console.log(JSON.stringify({status:"PASS_C1D5_RESULTS_AND_ISOLATED_RECORD",scoreLimits:M01_STAR_LIMITS,
 storageKey:M01_RESULT_STORAGE_KEY,defeat:{escapes:defeated.escapes,stars:0},
 confirmsSource:"Canvas V5 star thresholds 5/25 PROVISIONAL",realCore:true},null,2));
