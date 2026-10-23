/**
 * C1-D5 — Mapa 04 Normal: resultados + récord aislado de Phaser.
 * Criterio original V5 E5_STARS: 0..5 fugas =>3; 6..25 =>2 (provisional);
 * 26+ =>1. NO escribe en save Canvas V5.
 * El CORE es el único dueño de win/defeat, HP, fugas y rewards.
 */
export const M04_RESULT_SCHEMA="semantropic-phaser-m04-normal-result-v1";
export const M04_RESULT_STORAGE_KEY="semantropic_td_phaser_m04_normal_v1";
export const M04_STAR_LIMITS=Object.freeze({three:5,two:25,twoProvisional:true});
const int=(v,d=0)=>Number.isInteger(v)&&v>=0?v:d;
export function m04Stars(snapshot){
 if(!snapshot?.ended||!snapshot.won||snapshot.lives<=0)return 0;
 const leaks=int(snapshot.escaped);
 return leaks<=M04_STAR_LIMITS.three?3:leaks<=M04_STAR_LIMITS.two?2:1;
}
export function m04Result(snapshot){
 if(!snapshot?.ended)return null;
 const won=Boolean(snapshot.won&&snapshot.lives>0);
 return Object.freeze({
  schema:M04_RESULT_SCHEMA,map:4,mode:"normal",outcome:won?"victory":"defeat",
  stars:won?m04Stars(snapshot):0,completedWaves:int(snapshot.wave),
  lives:int(snapshot.lives),kills:int(snapshot.kills),escapes:int(snapshot.escaped),
  gold:int(snapshot.gold),totalSpawns:int(snapshot.totalSpawns),
  source:"real-core-M04",starRule:"V5_E5_STARS_5_25_PROVISIONAL"
 });
}
export function m04NormalizeRecord(v){
 if(!v||typeof v!=="object"||v.schema!==M04_RESULT_SCHEMA||
    v.map!==4||v.mode!=="normal"||v.outcome!=="victory"||
    !Number.isInteger(v.stars)||v.stars<1||v.stars>3||
    !Number.isInteger(v.escapes)||v.escapes<0||
    !Number.isInteger(v.lives)||v.lives<1||v.lives>100)return null;
 return Object.freeze({...v});
}
export function m04BetterRecord(prev,result){
 const old=m04NormalizeRecord(prev),next=m04NormalizeRecord(result);
 if(!next)return old;
 if(!old)return next;
 return next.stars>old.stars || next.stars===old.stars&&next.escapes<old.escapes ||
  next.stars===old.stars&&next.escapes===old.escapes&&next.lives>old.lives ?next:old;
}
export function m04RecordJson(record){
 const n=m04NormalizeRecord(record);
 return n?JSON.stringify({...n,updatedAt:new Date().toISOString()}):null;
}
// Deliberately wrap Storage: disabled/private-mode environments remain playable.
export function m04ReadRecord(storage){
 try{return m04NormalizeRecord(JSON.parse(storage?.getItem(M04_RESULT_STORAGE_KEY)||"null"));}
 catch{return null;}
}
export function m04SaveVictory(storage,result){
 const candidate=m04NormalizeRecord(result);
 if(!candidate)return {written:false,best:m04ReadRecord(storage),reason:"not-a-victory"};
 const best=m04BetterRecord(m04ReadRecord(storage),candidate);
 try{
  if(typeof storage?.setItem!=="function")return {written:false,best,reason:"storage-unavailable"};
  const raw=m04RecordJson(best);storage.setItem(M04_RESULT_STORAGE_KEY,raw);
  return {written:true,best,reason:"victory"};
 }catch{return {written:false,best,reason:"storage-unavailable"};}
}
