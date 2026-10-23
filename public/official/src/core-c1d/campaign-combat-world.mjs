/** Campaign extension: preserves M02's proven sniper/event/ledger flow, parameterises map rules.
 * Existing M01/M02 cores are unchanged. No visual module may apply damage.
 */
import {pathSegments,positionOnPath} from '../m01-model.mjs';
import {sniperNominalStats,pickSniperFirst} from './sniper-parity.mjs';
import {CampaignBuildEconomy} from './campaign-construction-economy.mjs';
const SNIPER_BULLET_SPEED=840;
const ensure=(v,m)=>{if(!v)throw Error('Campaign combat: '+m)};
const copy=x=>JSON.parse(JSON.stringify(x));
const round3=x=>Math.round(x*1000)/1000;
export function resolveCampaignDamage(raw,enemy,kind="ranged"){
 // Canvas V5 hurt(kind, physical): per-enemy resistance, armour and shields.
 ensure(Number.isFinite(raw)&&raw>=0,"invalid damage");
 const resist=enemy.resist||{};
 const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
 const multiplier=clamp(clamp(Number(resist[kind]??1),.45,1.6)*clamp(Number(resist.physical??1),.45,1.6),.4,1.7);
 const mitigated=Math.max(0,raw*multiplier*(1-clamp(enemy.armor||0,0,.5)));
 const absorbed=Math.min(Math.max(0,enemy.shield||0),mitigated);
 return {absorbed,dealt:Math.max(0,mitigated-absorbed),total:mitigated};
}
export class CampaignCombatWorld{
 constructor(map,campaign,{economy=null,mode="normal",rules}={}){
  rules.validateMap(map);rules.validateCampaign(campaign);
  ensure(mode==='normal','only Normal is audited');
  this.rules=rules;this.map=map;this.campaign=campaign;
  this.economy=economy||new CampaignBuildEconomy(map,{mode,rules});
  ensure(this.economy.mapId===map.id&&this.economy.gold===map.gold&&this.economy.towers.size===0,'fresh canonical economy required');
  this.route=pathSegments(map.path);this.airRoute=pathSegments(rules.airPath(map.path));
  this.lives=100;
  this.wave=0;this.active=false;this.ended=false;this.won=false;this.paused=false;
  this.seconds=0;this.waveSeconds=0;this.nextEnemyId=1;this.nextBulletId=1;this.nextEventId=1;this.tickNumber=0;
  this.enemies=new Map();this.bullets=[];this.towers=new Map();this.spawnQueue=[];this.events=[];
  this.escapedCount=0;this.kills=0;this.totalSpawns=0;this.rewardKeys=new Set();this.escapeKeys=new Set();this.waveBonusKeys=new Set();
  this.finishedWaves=new Set();
 }
 emit(type,info={}){
  const event=Object.freeze({contractVersion:"combat-events-v1",eventId:"c1d2-"+this.nextEventId++,tick:this.tickNumber,
    sessionId:"map"+this.map.id+"-normal-1",type,...copy(info)});
  this.events.push(event);return event;
 }
 drainEvents(){const out=this.events.slice();this.events.length=0;return out;}
 syncTowers(){
  const desired=new Set();
  for(const t of this.economy.towers.values()){
   if(t.family!=="sniper")continue; // Infantry is implemented by the shared extension.
   desired.add(t.id);
   const prev=this.towers.get(t.id);
   if(!prev)this.towers.set(t.id,{id:t.id,spotIndex:t.spotIndex,level:t.level,
    cooldown:0,aim:null,readyAt:0});
   else if(prev.level!==t.level){prev.level=t.level;prev.aim=null;prev.cooldown=0;}
  }
  for(const id of this.towers.keys())if(!desired.has(id)){
   this.towers.delete(id);
   this.bullets=this.bullets.filter(b=>b.towerId!==id); // cancel sold projectiles
  }
 }
 startWave(){
  if(this.ended||this.paused||this.active||this.enemies.size||this.bullets.length||this.wave>=this.rules.waveCount)return false;
  this.wave++;this.waveSeconds=0;this.active=true;this.syncTowers();
  const config=this.campaign.waves[this.wave-1];
  this.spawnQueue=config.groups.flatMap((g,group)=>Array.from({length:g.count},(_,i)=>{
   ensure(this.rules.enemySpecs[g.type]&&g.routeStart===0,"campaign enemy and route must be canonical");
   return {id:this.nextEnemyId++,type:g.type,at:g.startOffset+i*g.spawnInterval,group};
  })).sort((a,b)=>a.at-b.at||a.group-b.group||a.id-b.id);
  this.emit("wave_start",{wave:this.wave,spawnTotal:this.spawnQueue.length});
  return true;
 }
 moveEnemies(dt){
  for(const e of Array.from(this.enemies.values())){
   if(e.dead||e.escaped)continue;
   e.progress=Math.min((e.flying?this.airRoute:this.route).total,e.progress+e.speed*dt);
   const pose=positionOnPath(e.flying?this.airRoute:this.route,e.progress);
   e.x=pose.x;e.y=pose.y;e.heading=pose.heading;
   if(e.progress>=(e.flying?this.airRoute:this.route).total-1e-8)this.escape(e);
  }
 }
 spawnReady(){
  while(this.spawnQueue.length&&this.spawnQueue[0].at<=this.waveSeconds+1e-9&&!this.ended){
   const item=this.spawnQueue.shift(),data=this.rules.calculateEnemy(this.wave,item.type,this.map),p=positionOnPath(this.route,0);
   const e={id:item.id,type:item.type,life:data.hp,maxLife:data.hp,hp:data.hp,maxHp:data.hp,
    speed:data.speed,r:data.r,reward:data.reward,progress:0,routeLength:(this.rules.enemySpecs[item.type].flying?this.airRoute:this.route).total,
    x:p.x,y:p.y,heading:p.heading,dead:false,escaped:false,armor:0,shield:Math.max(0,Math.round(data.hp*(this.rules.enemySpecs[item.type].shieldFactor||0))),
     shieldMax:Math.max(0,Math.round(data.hp*(this.rules.enemySpecs[item.type].shieldFactor||0))),
    resist:copy(this.rules.enemySpecs[item.type].resist||{}),flying:Boolean(this.rules.enemySpecs[item.type].flying),blockable:this.rules.enemySpecs[item.type].blockable!==false,rewardPaid:false,wave:this.wave};
   this.enemies.set(e.id,e);this.totalSpawns++;
   this.emit("spawn",{entityId:e.id,entity:copy(e),wave:this.wave,worldPosition:{x:e.x,y:e.y}});
  }
 }
 escape(e){
  if(e.dead||e.escaped||this.escapeKeys.has(e.id)||this.ended)return false;
  this.escapeKeys.add(e.id);e.escaped=true;this.enemies.delete(e.id);this.escapedCount++;
  this.lives=Math.max(0,this.lives-2);
  this.emit("entity_escape",{entityId:e.id,enemyType:e.type,lives:this.lives,loss:2});
  if(this.lives<=0){this.ended=true;this.active=false;this.economy.locked=true;
   this.emit("defeat",{wave:this.wave,lives:0});}
  return true;
 }
 credit(amount,source,key,entityId=null){
  if(this.rewardKeys.has(key))return false;
  ensure(Number.isInteger(amount)&&amount>=0,"credit must be integer");
  this.rewardKeys.add(key);const before=this.economy.gold;this.economy.gold+=amount;
  this.economy.record("credit",source,amount,before,this.economy.gold,entityId||key);
  return true;
 }
 hit(e,raw,bulletId,towerId){
  if(!e||e.dead||e.escaped||!this.enemies.has(e.id))return false;
  const resolved=resolveCampaignDamage(raw,e,String(bulletId).startsWith("melee:")?"melee":"ranged");
  e.shield=Math.max(0,(e.shield||0)-resolved.absorbed);
  e.life=Math.max(0,e.life-resolved.dealt);e.hp=e.life;
  this.emit("hit_applied",{entityId:e.id,targetId:e.id,towerId,bulletId,damage:round3(resolved.dealt),
   absorbed:round3(resolved.absorbed),hp:round3(e.life),worldPosition:{x:e.x,y:e.y}});
  this.emit("hp_changed",{entityId:e.id,hp:round3(e.life),maxHp:e.maxLife});
  if(e.life===0){
   e.dead=true;this.enemies.delete(e.id);this.kills++;
   if(!e.rewardPaid){
    e.rewardPaid=true;this.credit(e.reward,"enemigos","kill:"+e.id,e.id);
   }
   this.emit("entity_die",{entityId:e.id,enemyType:e.type,towerId,bounty:e.reward,worldPosition:{x:e.x,y:e.y}});
  }
  return true;
 }
 tickSnipers(dt){
  this.syncTowers();
  for(const t of this.towers.values()){
   const real=this.economy.getTower(t.spotIndex);
   if(!real||real.id!==t.id)continue;
   const spot=this.economy.getSocket(t.spotIndex),st=sniperNominalStats(real.level,spot.kind);
   if(t.aim){
    t.aim.remaining-=dt;
    if(t.aim.remaining<=0){
     const enemy=this.enemies.get(t.aim.targetId);
     t.aim=null;t.cooldown=st.scheduledInterval;
     // Canvas V5 release permits range +14, and cancels invalid target.
     if(enemy&&!enemy.dead&&!enemy.escaped&&Math.hypot(enemy.x-real.x,enemy.y-real.y)<=st.effectiveRange+14){
      const angle=Math.atan2(enemy.y-real.y,enemy.x-real.x);
      const bullet={id:this.nextBulletId++,towerId:t.id,targetId:enemy.id,damage:st.nominalDamage,
       x:real.x+Math.cos(angle)*23,y:real.y+Math.sin(angle)*23,speed:SNIPER_BULLET_SPEED};
      this.bullets.push(bullet);
      this.emit("attack_fire",{entityId:t.id,targetId:enemy.id,worldPosition:{x:real.x,y:real.y},
       payload:{targetWorld:{x:enemy.x,y:enemy.y},originWorld:{x:bullet.x,y:bullet.y},bulletId:bullet.id}});
     }
    }
   }else{
    t.cooldown=Math.max(0,t.cooldown-dt);
    if(t.cooldown<=0){
     const candidates=Array.from(this.enemies.values()).map(e=>({...e,distance:e.progress,routeLength:e.routeLength}));
     const target=pickSniperFirst(candidates,{x:real.x,y:real.y},st.effectiveRange);
     if(target){
      t.aim={targetId:target.id,remaining:st.windup};
      this.emit("target_acquired",{entityId:t.id,targetId:target.id});
      this.emit("attack_windup",{entityId:t.id,targetId:target.id,windup:st.windup,
       worldPosition:{x:real.x,y:real.y}});
     }
    }
   }
  }
 }
 tickBullets(dt){
  const survivors=[];
  for(const b of this.bullets){
   const e=this.enemies.get(b.targetId);
   if(!e||e.dead||e.escaped||!this.towers.has(b.towerId))continue;
   const dx=e.x-b.x,dy=e.y-b.y,d=Math.hypot(dx,dy),travel=b.speed*dt;
   if(d<=travel+e.r){this.hit(e,b.damage,b.id,b.towerId);}
   else if(d>0){b.x+=dx/d*travel;b.y+=dy/d*travel;survivors.push(b);}
  }
  this.bullets=survivors;
 }
 tick(dt){
  ensure(Number.isFinite(dt)&&dt>=0&&dt<=.25,"invalid dt: fixed step max 0.25s");
  if(this.paused||this.ended||!this.active||dt===0)return [];
  this.tickNumber++;this.seconds+=dt;this.waveSeconds+=dt;
  this.spawnReady();this.moveEnemies(dt);
  if(!this.ended){this.tickSnipers(dt);this.tickBullets(dt);}
  if(!this.ended&&!this.spawnQueue.length&&!this.enemies.size&&!this.bullets.length){
   this.active=false;
   if(!this.finishedWaves.has(this.wave)){
    this.finishedWaves.add(this.wave);
    this.emit("wave_clear",{wave:this.wave});
    if(this.wave===this.rules.waveCount){this.ended=true;this.won=true;this.economy.locked=true;this.emit("campaign_map_win",{wave:this.wave,lives:this.lives});}
    else{const key="wave:"+this.wave;if(!this.waveBonusKeys.has(key)){
     this.waveBonusKeys.add(key);const bonus=this.rules.waveBonus(this.wave);
     this.credit(bonus,"bonos",key);this.emit("wave_bonus",{wave:this.wave,amount:bonus});}}
   }
  }
  return this.drainEvents();
 }
 pause(){if(this.ended||this.paused)return false;this.paused=true;this.emit("game_paused");return true;}
 resume(){if(!this.paused)return false;this.paused=false;this.emit("game_resumed");return true;}
 get actors(){return Array.from(this.enemies.values()).map(e=>copy(e));}
 get snapshot(){return {contract:this.rules.version,mapId:this.map.id,mode:"normal",wave:this.wave,active:this.active,
  ended:this.ended,won:this.won,paused:this.paused,lives:this.lives,gold:this.economy.gold,
  kills:this.kills,escaped:this.escapedCount,totalSpawns:this.totalSpawns,spawnsRemaining:this.spawnQueue.length,
  enemies:this.enemies.size,bullets:this.bullets.length,onlySniperCombat:true,infantryCombatImplemented:false,
  corePersistsRecords:false};}
}
