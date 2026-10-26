/** Canvas V5 E4 mistlord: mechanics only, isolated from M01–M04. */
export const M05_BOSS=Object.freeze({type:'mistlord',name:'Señor de la Niebla',hp:1640,speed:27,size:29,reward:110,escapeLives:30,
 thresholds:[.70,.35],summonBudget:6,healBudget:210,reviveBudget:1,
 cooldowns:{mist:15,summon:23,heal:18,revive:33,veil:25},windup:{mist:1.15,summon:1.25,heal:1.05,revive:1.45,veil:1.6}});
const d=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export function withM05Boss(Base){return class M05BossWorld extends Base{
 constructor(...args){super(...args);this.corpses=[];this.bossEncounter=null;this.spawnTags=new Map();this.groupSpawns=0;this.bossSpawns=0;this.summonedSpawns=0;this.revivalCount=0;}
 emit(type,info={}){
  if(type==='wave_start'&&this.wave===13)info={...info,groupSpawns:info.spawnTotal,bossSpawns:1,spawnTotal:info.spawnTotal+1};
  if(type==='spawn'){
   const e=this.enemies.get(info.entityId),tag=this.spawnTags?.get(e.id);
   e.revives=0;e.channel=0;e.specialCD=0;
   if(e.type==='shieldbearer'){e.shieldMax=Math.round(e.maxLife*1.15*.40);e.shield=e.shieldMax;}
   if(e.type==='mistlord'){
    e.isBoss=true;e.revives=1;this.bossSpawns++;this.bossEncounter.spawned=true;this.bossEncounter.id=e.id;e.bossPhase=1;
   }else if(tag==='summon'){e.e4Summoned=true;e.reward=0;e.rewardPaid=true;this.summonedSpawns++;}
   else this.groupSpawns++;
   info={...info,entity:{...e},spawnSource:e.isBoss?'boss':e.e4Summoned?'summon':'group'};
  }
  return super.emit(type,info);
 }
 startWave(){
  if(!super.startWave())return false;
  if(this.wave===13){
   this.bossEncounter={id:null,spawned:false,defeated:false,escaped:false,phase:1,transition:0,gate:0,clock:0,cast:null,
    cooldowns:{mist:5,summon:7,heal:10,revive:8,veil:8},used:{},summonLeft:6,healLeft:210,reviveLeft:1};
   this.spawnQueue.push({id:this.nextEnemyId++,type:'mistlord',at:Math.max(...this.spawnQueue.map(s=>s.at))+3.5,group:-1});
  }
  return true;
 }
 hit(e,raw,bulletId,towerId){
  const alive=e&&!e.dead&&!e.escaped&&this.enemies.has(e.id);
  const result=super.hit(e,raw*(e?.bossBlessing>0?.88:1),bulletId,towerId);
  if(alive&&e.dead){
   e.blockedBy=null;
   if(e.isBoss){this.bossEncounter.defeated=true;this.bossEncounter.cast=null;this.emit('boss_defeated',{entityId:e.id});}
   else if(!e.flying&&!['weaver','shaman','demolisher'].includes(e.type)&&(e.revives||0)<1)this.corpses.push({entity:e,time:5,x:e.x,y:e.y});
  }
  return result;
 }
 escape(e){
  if(!e?.isBoss)return super.escape(e);
  if(e.dead||e.escaped||this.escapeKeys.has(e.id)||this.ended)return false;
  this.escapeKeys.add(e.id);e.escaped=true;e.blockedBy=null;this.enemies.delete(e.id);this.escapedCount++;
  this.lives=Math.max(0,this.lives-30);this.bossEncounter.escaped=true;this.bossEncounter.cast=null;
  this.emit('entity_escape',{entityId:e.id,enemyType:e.type,boss:true,lives:this.lives,loss:30});
  if(this.lives===0){this.ended=true;this.active=false;this.economy.locked=true;this.emit('defeat',{wave:this.wave,lives:0});}return true;
 }
 reviveCorpse(c,fraction){
  if(!c||c.time<=0||!this.corpses.includes(c)||(c.entity.revives||0)>=1)return false;
  const e=c.entity;e.dead=false;e.escaped=false;e.revives=(e.revives||0)+1;e.life=Math.max(1,Math.round(e.maxLife*fraction));e.hp=e.life;
  e.shield=0;e.blockedBy=null;e.enemyWindup=0;e.enemyAttackCD=0;e.specialTarget=null;e.channel=0;e.rewardPaid=true;
  this.corpses.splice(this.corpses.indexOf(c),1);this.enemies.set(e.id,e);this.revivalCount++;
  this.emit('entity_revive',{entityId:e.id,enemyType:e.type,hp:e.life,maxHp:e.maxLife,worldPosition:{x:e.x,y:e.y}});return true;
 }
 bossAllies(b,r){return [...this.enemies.values()].filter(e=>e!==b&&!e.dead&&!e.escaped&&!e.flying&&d(e,b)<=r);}
 bossCorpse(b){return this.corpses.find(c=>c.time>.7&&(c.entity.revives||0)<1&&!['weaver','demolisher','mistlord','eclipseemperor'].includes(c.entity.type)&&d(c,b)<185);}
 bossTarget(skill,b,enc){
  if(skill==='mist')return this.bossAllies(b,175).length>0;
  if(skill==='summon')return enc.summonLeft>0&&[...this.enemies.values()].filter(e=>e.e4Summoned&&!e.dead).length<5;
  if(skill==='heal')return enc.healLeft>0&&this.bossAllies(b,165).some(e=>e.life<e.maxLife-10);
  if(skill==='revive')return enc.reviveLeft>0&&!!this.bossCorpse(b);
  return skill==='veil'&&this.activeSoldiers().some(u=>d(u,b)<105);
 }
 executeBoss(skill,b,enc){
  if(!b||b.dead||b.escaped||!this.enemies.has(b.id))return false;
  if(skill==='mist')for(const e of this.bossAllies(b,175))e.bossBlessing=Math.max(e.bossBlessing||0,6.8);
  if(skill==='summon'){
   const live=[...this.enemies.values()].filter(e=>e.e4Summoned&&!e.dead&&!e.escaped).length,n=Math.min(2,enc.summonLeft,Math.max(0,5-live));
   for(let i=0;i<n;i++){const id=this.nextEnemyId++;this.spawnTags.set(id,'summon');this.spawnQueue.push({id,type:['warrior','shieldbearer'][i%2],at:this.waveSeconds,group:-2});enc.summonLeft--;}
   this.spawnQueue.sort((a,b)=>a.at-b.at||a.id-b.id);this.spawnReady();
  }
  if(skill==='heal')for(const e of this.bossAllies(b,165).filter(e=>e.life<e.maxLife-10).sort((a,b)=>a.life/a.maxLife-b.life/b.maxLife).slice(0,2)){
   const amount=Math.min(e.maxLife-e.life,enc.healLeft,55);e.life+=amount;e.hp=e.life;enc.healLeft-=amount;this.emit('enemy_heal',{entityId:b.id,targetId:e.id,amount});this.emit('hp_changed',{entityId:e.id,hp:e.life,maxHp:e.maxLife});
  }
  if(skill==='revive'&&enc.reviveLeft>0&&this.reviveCorpse(this.bossCorpse(b),.38))enc.reviveLeft--;
  if(skill==='veil')for(const u of this.activeSoldiers().filter(u=>d(u,b)<=100)){
   u.hp=Math.max(0,u.hp-22);this.emit('soldier_hit',{entityId:u.id,sourceId:b.id,damage:22,hp:u.hp,worldPosition:{x:u.x,y:u.y}});if(!u.hp)this.soldierDieFromZero(u);
  }
  enc.used[skill]=(enc.used[skill]||0)+1;this.emit('boss_skill_resolved',{entityId:b.id,skill,phase:enc.phase});
 }
 tickBoss(dt){
  const enc=this.bossEncounter,b=enc&&this.enemies.get(enc.id);if(!b||b.dead||b.escaped)return;
  enc.clock+=dt;for(const k of Object.keys(enc.cooldowns))enc.cooldowns[k]=Math.max(0,enc.cooldowns[k]-dt);
  enc.gate=Math.max(0,enc.gate-dt);enc.transition=Math.max(0,enc.transition-dt);
  const ratio=b.life/b.maxLife,next=ratio<=.35?3:ratio<=.70?2:1;
  if(next>enc.phase){enc.phase++;b.bossPhase=enc.phase;enc.transition=1.1;enc.cast=null;enc.gate=2.3;this.emit('boss_phase',{entityId:b.id,phase:enc.phase});}
  else if(enc.cast){enc.cast.time-=dt;if(enc.cast.time<=0){const id=enc.cast.id;enc.cast=null;this.executeBoss(id,b,enc);}}
  else if(!enc.transition&&!enc.gate){
   const skills=enc.phase===1?['summon','mist','heal']:enc.phase===2?['revive','heal','mist','summon']:['veil','heal','mist','summon'];
   for(const id of skills)if(!enc.cooldowns[id]&&this.bossTarget(id,b,enc)){enc.cast={id,time:M05_BOSS.windup[id]};enc.gate=2;enc.cooldowns[id]=M05_BOSS.cooldowns[id];this.emit('boss_telegraph_start',{entityId:b.id,skill:id,windup:enc.cast.time});break;}
  }
  b.bossCast=enc.cast?.id||null;
 }
 tryEnemySupport(e,dt){if(e.isBoss)return Boolean(this.bossEncounter.cast||this.bossEncounter.transition>0);return super.tryEnemySupport(e,dt);}
 moveEnemies(dt){
  this.tickBoss(dt);
  this.corpses.forEach(c=>c.time-=dt);this.corpses=this.corpses.filter(c=>c.time>0);
  for(const e of this.enemies.values())e.bossBlessing=Math.max(0,(e.bossBlessing||0)-dt);
  super.moveEnemies(dt);
 }
 get snapshot(){return {...super.snapshot,groupSpawns:this.groupSpawns,bossSpawns:this.bossSpawns,summonedSpawns:this.summonedSpawns,revivals:this.revivalCount,
  boss:this.bossEncounter?JSON.parse(JSON.stringify(this.bossEncounter)):null,bossResolved:!!(this.bossEncounter?.defeated||this.bossEncounter?.escaped)};}
};}
