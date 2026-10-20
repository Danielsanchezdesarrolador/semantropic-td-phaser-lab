/**
 * SEMANTROPIC TD C1-D2 / FIRST VERIFIED NOMINAL SNIPER CONTRACT.
 * Parity basis: protected Canvas V5 source constants SNIPER_LEVELS,
 * SPOT_BONUS, sniperRange, sniperInterval and sniperPick.
 * CAUTION: nominal damage is not effective damage until QA17–QA19
 * multipliers, shields/resistances and hit/kill rules are audited.
 * This module does NOT spawn enemies or apply damage.
 */
export const C1D2_SNIPER_CONTRACT="c1d2-nominal-sniper-v1";
export const SNIPER_NORMAL_LEVELS=Object.freeze({
  1:Object.freeze({damage:40,interval:1.65,range:230,windup:0.26}),
  2:Object.freeze({damage:66,interval:1.55,range:246,windup:0.25})
});
export const CANONICAL_SPOT_BONUS=Object.freeze({
  power:Object.freeze({damage:1.18,range:1,rate:1}),
  focus:Object.freeze({damage:1,range:1.16,rate:1}),
  tempo:Object.freeze({damage:1,range:1,rate:0.84})
});
function assert(ok,msg){if(!ok)throw new Error("C1-D2 parity: "+msg)}
export function sniperNominalStats(level,spotKind){
  const base=SNIPER_NORMAL_LEVELS[level],bonus=CANONICAL_SPOT_BONUS[spotKind];
  assert(base&&bonus,"unknown level or socket bonus: only M01 sniper I/II and 3 official spots");
  return Object.freeze({
    level,spotKind,
    effectiveRange:Math.round(base.range*bonus.range),
    scheduledInterval:base.interval*bonus.rate,
    nominalDamage:base.damage*bonus.damage,
    windup:base.windup,
    effectiveDamagePendingAudit:true
  });
}
export function pickSniperFirst(entities,tower,range){
  assert(Array.isArray(entities)&&tower&&Number.isFinite(tower.x)&&Number.isFinite(tower.y)&&Number.isFinite(range)&&range>0,"invalid pick inputs");
  const eligible=entities.filter(e=>
    e&&!e.dead&&!e.escaped&&Number.isFinite(e.x)&&Number.isFinite(e.y)&&
    Number.isFinite(e.progress)&&Number.isFinite(e.routeLength)&&e.routeLength>0&&
    Math.hypot(e.x-tower.x,e.y-tower.y)<=range
  );
  eligible.sort((a,b)=>(b.progress/b.routeLength)-(a.progress/a.routeLength)||a.id-b.id);
  return eligible[0]??null;
}
