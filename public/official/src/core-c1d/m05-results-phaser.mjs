/**
 * C1-D5 — Mapa 05 Normal: resultados + récord aislado de Phaser.
 * Criterio original V5 E5_STARS: 0..5 fugas =>3; 6..25 =>2 (provisional);
 * 26+ =>1. NO escribe en save Canvas V5.
 * El CORE es el único dueño de win/defeat, HP, fugas y rewards.
 */
export const M05_RESULT_SCHEMA="semantropic-phaser-m05-normal-result-v1";
export const M05_RESULT_STORAGE_KEY="semantropic_td_phaser_m05_normal_v1";
export const M05_STAR_LIMITS=Object.freeze({three:5,two:25,twoProvisional:true});
const int=(v,d=0)=>Number.isInteger(v)&&v>=0?v:d;
export function m05Stars(snapshot){
 if(!snapshot?.ended||!snapshot.won||snapshot.lives<=0||snapshot.wave!==13||!snapshot.bossResolved)return 0;
 if(snapshot.boss?.escaped)return 1;
 const leaks=int(snapshot.escaped);
 return leaks<=M05_STAR_LIMITS.three?3:leaks<=M05_STAR_LIMITS.two?2:1;
}
export function m05Result(snapshot){
 if(!snapshot?.ended)return null;
 const won=Boolean(snapshot.won&&snapshot.lives>0&&snapshot.wave===13&&snapshot.bossResolved);
 return Object.freeze({
  schema:M05_RESULT_SCHEMA,map:5,mode:"normal",outcome:won?"victory":"defeat",
  stars:won?m05Stars(snapshot):0,completedWaves:int(snapshot.wave),
  lives:int(snapshot.lives),kills:int(snapshot.kills),escapes:int(snapshot.escaped),
  gold:int(snapshot.gold),totalSpawns:int(snapshot.totalSpawns),
  bossDefeated:!!snapshot.boss?.defeated,bossEscaped:!!snapshot.boss?.escaped,bossResolved:!!snapshot.bossResolved,groupSpawns:int(snapshot.groupSpawns),bossSpawns:int(snapshot.bossSpawns),summonedSpawns:int(snapshot.summonedSpawns),revivals:int(snapshot.revivals),
  starRuleLabel:snapshot.boss?.escaped?"El jefe escapó: máximo 1★ según V5.":"Regla V5: 3★ hasta 5 fugas; 2★ hasta 25 (provisional); jefe escapado: máximo 1★.",
  source:"real-core-M05",starRule:"V5_E5_STARS_5_25_PROVISIONAL"
 });
}
export function m05NormalizeRecord(v){
 if(!v||typeof v!=="object"||v.schema!==M05_RESULT_SCHEMA||
    v.map!==5||v.mode!=="normal"||v.outcome!=="victory"||v.completedWaves!==13||!v.bossResolved||v.bossSpawns!==1||v.groupSpawns!==110||Boolean(v.bossDefeated)===Boolean(v.bossEscaped)||v.bossEscaped&&v.stars>1||
    !Number.isInteger(v.stars)||v.stars<1||v.stars>3||
    !Number.isInteger(v.escapes)||v.escapes<0||
    !Number.isInteger(v.lives)||v.lives<1||v.lives>100)return null;
 return Object.freeze({...v});
}
export function m05BetterRecord(prev,result){
 const old=m05NormalizeRecord(prev),next=m05NormalizeRecord(result);
 if(!next)return old;
 if(!old)return next;
 return next.stars>old.stars || next.stars===old.stars&&next.escapes<old.escapes ||
  next.stars===old.stars&&next.escapes===old.escapes&&next.lives>old.lives ?next:old;
}
export function m05RecordJson(record){
 const n=m05NormalizeRecord(record);
 return n?JSON.stringify({...n,updatedAt:new Date().toISOString()}):null;
}
// Deliberately wrap Storage: disabled/private-mode environments remain playable.
export function m05ReadRecord(storage){
 try{return m05NormalizeRecord(JSON.parse(storage?.getItem(M05_RESULT_STORAGE_KEY)||"null"));}
 catch{return null;}
}
export function m05SaveVictory(storage,result){
 const candidate=m05NormalizeRecord(result);
 if(!candidate)return {written:false,best:m05ReadRecord(storage),reason:"not-a-victory"};
 const best=m05BetterRecord(m05ReadRecord(storage),candidate);
 try{
  if(typeof storage?.setItem!=="function")return {written:false,best,reason:"storage-unavailable"};
  const raw=m05RecordJson(best);storage.setItem(M05_RESULT_STORAGE_KEY,raw);
  return {written:true,best,reason:"victory"};
 }catch{return {written:false,best,reason:"storage-unavailable"};}
}
