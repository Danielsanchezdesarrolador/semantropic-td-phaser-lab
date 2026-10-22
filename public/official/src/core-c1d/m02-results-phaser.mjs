/**
 * C1-D5 — Mapa 02 Normal: resultados + récord aislado de Phaser.
 * Criterio original V5 E5_STARS: 0..5 fugas =>3; 6..25 =>2 (provisional);
 * 26+ =>1. NO escribe en save Canvas V5.
 * El CORE es el único dueño de win/defeat, HP, fugas y rewards.
 */
export const M02_RESULT_SCHEMA="semantropic-phaser-m02-normal-result-v1";
export const M02_RESULT_STORAGE_KEY="semantropic_td_phaser_m02_normal_v1";
export const M02_STAR_LIMITS=Object.freeze({three:5,two:25,twoProvisional:true});
const int=(v,d=0)=>Number.isInteger(v)&&v>=0?v:d;
export function m02Stars(snapshot){
 if(!snapshot?.ended||!snapshot.won||snapshot.lives<=0)return 0;
 const leaks=int(snapshot.escaped);
 return leaks<=M02_STAR_LIMITS.three?3:leaks<=M02_STAR_LIMITS.two?2:1;
}
export function m02Result(snapshot){
 if(!snapshot?.ended)return null;
 const won=Boolean(snapshot.won&&snapshot.lives>0);
 return Object.freeze({
  schema:M02_RESULT_SCHEMA,map:2,mode:"normal",outcome:won?"victory":"defeat",
  stars:won?m02Stars(snapshot):0,completedWaves:int(snapshot.wave),
  lives:int(snapshot.lives),kills:int(snapshot.kills),escapes:int(snapshot.escaped),
  gold:int(snapshot.gold),totalSpawns:int(snapshot.totalSpawns),
  source:"real-core-R3-B1",starRule:"V5_E5_STARS_5_25_PROVISIONAL"
 });
}
export function m02NormalizeRecord(v){
 if(!v||typeof v!=="object"||v.schema!==M02_RESULT_SCHEMA||
    v.map!==2||v.mode!=="normal"||v.outcome!=="victory"||
    !Number.isInteger(v.stars)||v.stars<1||v.stars>3||
    !Number.isInteger(v.escapes)||v.escapes<0||
    !Number.isInteger(v.lives)||v.lives<1||v.lives>100)return null;
 return Object.freeze({...v});
}
export function m02BetterRecord(prev,result){
 const old=m02NormalizeRecord(prev),next=m02NormalizeRecord(result);
 if(!next)return old;
 if(!old)return next;
 return next.stars>old.stars || next.stars===old.stars&&next.escapes<old.escapes ||
  next.stars===old.stars&&next.escapes===old.escapes&&next.lives>old.lives ?next:old;
}
export function m02RecordJson(record){
 const n=m02NormalizeRecord(record);
 return n?JSON.stringify({...n,updatedAt:new Date().toISOString()}):null;
}
// Deliberately wrap Storage: disabled/private-mode environments remain playable.
export function m02ReadRecord(storage){
 try{return m02NormalizeRecord(JSON.parse(storage?.getItem(M02_RESULT_STORAGE_KEY)||"null"));}
 catch{return null;}
}
export function m02SaveVictory(storage,result){
 const candidate=m02NormalizeRecord(result);
 if(!candidate)return {written:false,best:m02ReadRecord(storage),reason:"not-a-victory"};
 const best=m02BetterRecord(m02ReadRecord(storage),candidate);
 try{
  const raw=m02RecordJson(best);storage?.setItem(M02_RESULT_STORAGE_KEY,raw);
  return {written:true,best,reason:"victory"};
 }catch{return {written:false,best,reason:"storage-unavailable"};}
}
