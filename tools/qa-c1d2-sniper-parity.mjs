import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {sniperNominalStats,pickSniperFirst,SNIPER_NORMAL_LEVELS,CANONICAL_SPOT_BONUS} from "../public/official/src/core-c1d/sniper-parity.mjs";
import {M01BuildEconomy} from "../public/official/src/core-c1d/construction-economy.mjs";
const source=readFileSync(new URL("../public/JUEGO_V5_CANVAS.html",import.meta.url),"utf8");
const maps=JSON.parse(readFileSync(new URL("../public/official/data/maps.v5.json",import.meta.url),"utf8"));
for(const sourceSnippet of ["const SNIPER_LEVELS=[","{damage:40,interval:1.65,range:230,windup:.26}","{damage:66,interval:1.55,range:246,windup:.25}","power:{name:","damage:1.18,range:1,rate:1","range:1.16,rate:1","rate:.84","const sniperStats=t=>","function sniperRange(t)","function sniperInterval(t)","function sniperPick(t)"]){
 assert(source.includes(sourceSnippet),"protected V5 source drift: "+sourceSnippet);
}
const e=new M01BuildEconomy(maps[0]);const built=e.build(2,"sniper");assert(built.ok);assert.equal(built.tower.level,1);
let st=sniperNominalStats(1,"focus");assert.equal(st.effectiveRange,267);assert.equal(st.nominalDamage,40);assert.equal(st.scheduledInterval,1.65);
assert.equal(e.upgrade(2).ok,true);st=sniperNominalStats(2,"focus");assert.equal(st.effectiveRange,285);assert.equal(st.nominalDamage,66);assert.equal(st.scheduledInterval,1.55);

const power=sniperNominalStats(1,"power");
assert.equal(power.nominalDamage,47.2);assert.equal(power.effectiveDamagePendingAudit,true);
const tempo=sniperNominalStats(1,"tempo");
assert.equal(tempo.scheduledInterval,1.386);
assert.throws(()=>sniperNominalStats(3,"power"),/unknown level/);
assert.throws(()=>sniperNominalStats(1,"invalid"),/unknown level/);
assert.deepEqual(Object.keys(CANONICAL_SPOT_BONUS),["power","focus","tempo"]);
assert.equal(Object.keys(SNIPER_NORMAL_LEVELS).length,2);
const candidates=[
 {id:2,x:50,y:0,progress:22,routeLength:100,dead:false,escaped:false},
 {id:1,x:60,y:0,progress:93,routeLength:100,dead:false,escaped:false},
 {id:3,x:10,y:0,progress:99,routeLength:100,dead:true,escaped:false},
 {id:4,x:80,y:0,progress:95,routeLength:100,dead:false,escaped:true},
 {id:5,x:200,y:0,progress:96,routeLength:100,dead:false,escaped:false}
];
const b=pickSniperFirst(candidates,{x:0,y:0},100);
assert.equal(b.id,1);
assert.equal(pickSniperFirst(candidates,{x:0,y:0},40),null);
assert.equal(pickSniperFirst([], {x:0,y:0},100),null);
assert.equal(e.gold,40);
assert.equal(e.snapshot.combatImplemented,false);
console.log(JSON.stringify({result:"PASS_C1D2_SNIPER_SOURCE_PARITY_ONLY",focusI:sniperNominalStats(1,"focus"),focusII:sniperNominalStats(2,"focus"),tempoI:sniperNominalStats(1,"tempo"),powerI:power,targetSelected:b.id,combatImplemented:false},null,2));
