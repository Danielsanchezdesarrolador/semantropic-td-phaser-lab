/**
 * C1-D5 — Mapa 06 Normal: resultados + récord aislado de Phaser.
 * Criterio original V5 E5_STARS: 0..5 fugas =>3; 6..25 =>2 (provisional);
 * 26+ =>1. NO escribe en save Canvas V5.
 * El CORE es el único dueño de win/defeat, HP, fugas y rewards.
 */
export const M06_RESULT_SCHEMA="semantropic-phaser-m06-normal-result-v1";
export const M06_RESULT_STORAGE_KEY="semantropic_td_phaser_m06_normal_v1";
export const M06_STAR_LIMITS=Object.freeze({three:5,two:25,twoProvisional:true});
const int=(v,d=0)=>Number.isInteger(v)&&v>=0?v:d;
export function m06Stars(snapshot){
 if(!snapshot?.ended||!snapshot.won||snapshot.lives<=0||snapshot.wave!==15||snapshot.totalSpawns!==125)return 0;
 const leaks=int(snapshot.escaped);
 return leaks<=M06_STAR_LIMITS.three?3:leaks<=M06_STAR_LIMITS.two?2:1;
}
export function m06Result(snapshot){
 if(!snapshot?.ended)return null;
 const won=Boolean(snapshot.won&&snapshot.lives>0&&snapshot.wave===15&&snapshot.totalSpawns===125);
 return Object.freeze({
  schema:M06_RESULT_SCHEMA,map:6,mode:"normal",outcome:won?"victory":"defeat",
  stars:won?m06Stars(snapshot):0,completedWaves:int(snapshot.wave),
  lives:int(snapshot.lives),kills:int(snapshot.kills),escapes:int(snapshot.escaped),
  gold:int(snapshot.gold),totalSpawns:int(snapshot.totalSpawns),
  source:"real-core-M06",starRule:"V5_E5_STARS_5_25_PROVISIONAL"
 });
}
export function m06NormalizeRecord(v){
 if(!v||typeof v!=="object"||v.schema!==M06_RESULT_SCHEMA||
    v.map!==6||v.mode!=="normal"||v.outcome!=="victory"||v.completedWaves!==15||v.totalSpawns!==125||
    !Number.isInteger(v.stars)||v.stars<1||v.stars>3||
    !Number.isInteger(v.escapes)||v.escapes<0||
    !Number.isInteger(v.lives)||v.lives<1||v.lives>100)return null;
 return Object.freeze({...v});
}
export function m06BetterRecord(prev,result){
 const old=m06NormalizeRecord(prev),next=m06NormalizeRecord(result);
 if(!next)return old;
 if(!old)return next;
 return next.stars>old.stars || next.stars===old.stars&&next.escapes<old.escapes ||
  next.stars===old.stars&&next.escapes===old.escapes&&next.lives>old.lives ?next:old;
}
export function m06RecordJson(record){
 const n=m06NormalizeRecord(record);
 return n?JSON.stringify({...n,updatedAt:new Date().toISOString()}):null;
}
// Deliberately wrap Storage: disabled/private-mode environments remain playable.
export function m06ReadRecord(storage){
 try{return m06NormalizeRecord(JSON.parse(storage?.getItem(M06_RESULT_STORAGE_KEY)||"null"));}
 catch{return null;}
}
export function m06SaveVictory(storage,result){
 const candidate=m06NormalizeRecord(result);
 if(!candidate)return {written:false,best:m06ReadRecord(storage),reason:"not-a-victory"};
 const best=m06BetterRecord(m06ReadRecord(storage),candidate);
 try{
  if(typeof storage?.setItem!=="function")return {written:false,best,reason:"storage-unavailable"};
  const raw=m06RecordJson(best);storage.setItem(M06_RESULT_STORAGE_KEY,raw);
  return {written:true,best,reason:"victory"};
 }catch{return {written:false,best,reason:"storage-unavailable"};}
}
