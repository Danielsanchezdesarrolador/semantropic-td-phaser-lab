/** M06 Normal only: Canvas E1/E3, QA17B and campaign140 rules. No art dependencies. */
import{M04_ENEMY_SPECS}from'./m04-campaign.mjs';import{M03_ENEMY_SPECS,m03AirPath}from'./m03-campaign.mjs';import{M06DualRouteWorld}from'./m06-dual-route-world.mjs';
export const M06_WAVE_COUNTS=Object.freeze([7,6,6,8,5,5,8,7,7,12,14,7,10,10,13]);
export const M06_ENEMY_SPECS=Object.freeze({...M04_ENEMY_SPECS,warrior:Object.freeze({...M04_ENEMY_SPECS.warrior,range:35}),hound:Object.freeze({...M04_ENEMY_SPECS.hound,range:26}),bat:M03_ENEMY_SPECS.bat,aliengunner:Object.freeze({name:'Tirador Alienígena',category:'ranged',hpFactor:1.02,speed:58,size:17,reward:24,damage:11,range:158,interval:1.9,windup:.36,blockable:true}),demolisher:Object.freeze({name:'Demoledor de Asedio',category:'siege',hpFactor:3,speed:32,size:23,reward:45,damage:38,range:138,interval:2.5,windup:.75,blockable:true,canHitTowers:true})});
export function validateM06Map(m){if(m?.id!==6||m.path?.length!==243||m.branches?.length!==1||m.branches[0].length!==243||m.spots?.length!==9||m.gold!==495)throw Error('M06 canonical map');}
export function validateM06Campaign(c){if(c?.mapId!==6||c.entries!==2||c.waves?.length!==15)throw Error('M06 canonical campaign');c.waves.forEach((w,i)=>{if(w.wave!==i+1||w.bossSlot||w.groups.reduce((n,g)=>n+g.count,0)!==M06_WAVE_COUNTS[i]||w.groups.some(g=>![0,1].includes(g.routeStart)||!M06_ENEMY_SPECS[g.type]))throw Error('M06 group contract');});const n=[0,0];for(const w of c.waves)for(const g of w.groups)n[g.routeStart]+=g.count;if(n[0]!==69||n[1]!==56)throw Error('M06 route counts');}
export function calculateM06Enemy(wave,type,map){validateM06Map(map);const s=M06_ENEMY_SPECS[type];if(!s||!Number.isInteger(wave)||wave<1||wave>15)throw Error('M06 unsupported enemy');const base=(30+wave*13)*map.scale*(1+Math.max(0,wave-3)*(.095+map.id*.009)),raw=Math.round(base*s.hpFactor*map.enemyHpMultiplier),late=1+(wave-1)*9/14>=8;return{type,hp:Math.max(1,Math.round(raw*(late&&['warrior','shieldbearer','brute'].includes(type)?.65:1))),speed:s.speed+Math.min(wave*1.5,18)+map.id*.95,r:s.size,reward:Math.max(0,Math.round(s.reward*Math.min(1.05,Math.pow(10/15,.32))))};}
export const M06_RULES=Object.freeze({mapId:6,waveCount:15,version:'m06-game01-two-real-routes-v1',validateMap:validateM06Map,validateCampaign:validateM06Campaign,enemySpecs:M06_ENEMY_SPECS,calculateEnemy:calculateM06Enemy,airPath:m03AirPath,waveBonus:w=>Math.max(1,Math.round((37+w/15*140)*10/15))});
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export class M06CombatWorld extends M06DualRouteWorld{
 constructor(map,campaign,options={}){super(map,campaign,{...options,rules:options.rules??M06_RULES});this.structures=new Map();this.ruins=new Map();this.enemyShots=[];}
 hit(e,raw,bullet,tower){const t=[...this.economy.towers.values()].find(t=>t.id===tower);return super.hit(e,raw*(t?.family==='sniper'?1.08:1),bullet,tower);}
 syncTowers(){super.syncTowers();if(!this.structures)return;for(const t of this.economy.towers.values()){const max=Math.round(({infantry:170,sniper:135}[t.family])*(1+.12*(t.level-1))),s=this.structures.get(t.id);if(!s){this.structures.set(t.id,{hp:max,max});this.ruins.delete(t.spotIndex);}else if(s.max!==max){s.hp=Math.max(1,Math.round(max*s.hp/s.max));s.max=max;}}for(const id of this.structures.keys())if(![...this.economy.towers.values()].some(t=>t.id===id))this.structures.delete(id);}
 structuralDamage(t,amount,enemy){if(this.economy.getTower(t.spotIndex)?.id!==t.id)return false;const s=this.structures.get(t.id);s.hp=Math.max(0,s.hp-amount);this.emit('tower_structural_hit',{entityId:t.id,sourceId:enemy.id,hp:s.hp,maxHp:s.max,damage:amount});if(s.hp)return true;this.economy.towers.delete(t.spotIndex);this.ruins.set(t.spotIndex,{former:t.family});this.emit('tower_destroyed',{entityId:t.id,spotIndex:t.spotIndex,sourceId:enemy.id,refund:0});this.syncTowers();return false;}
 tryEnemySupport(e,dt){
  if(e.type==='shaman'){e.specialCD=Math.max(0,(e.specialCD||0)-dt);if(e.channel>0){e.channel-=dt;if(e.channel<=0){const target=this.enemies.get(e.specialTarget);if(target&&!target.dead&&!target.flying&&distance(e,target)<168){const amount=Math.min(32,target.maxLife-target.life);target.life+=amount;target.hp=target.life;this.emit('enemy_heal',{entityId:e.id,targetId:target.id,amount});this.emit('hp_changed',{entityId:target.id,hp:target.life,maxHp:target.maxLife});}e.specialTarget=null;e.specialCD=7;}return true;}if(e.specialCD)return false;const targets=[...this.enemies.values()].filter(t=>t!==e&&!t.dead&&!t.flying&&t.life<t.maxLife-5&&distance(t,e)<168).sort((a,b)=>a.life/a.maxLife-b.life/b.maxLife);if(!targets.length)return false;e.specialTarget=targets[0].id;e.channel=.98;this.emit('enemy_support_windup',{entityId:e.id,type:e.type,windup:.98});return true;}
  if(!['demolisher','aliengunner'].includes(e.type))return false;
  const def=M06_ENEMY_SPECS[e.type];e.attackCD=Math.max(0,(e.attackCD||0)-dt);let aim=e.aimKind==='tower'?[...this.economy.towers.values()].find(t=>t.id===e.aimId):this.findSoldier(e.aimId);const valid=()=>aim&&(e.aimKind==='tower'?this.economy.getTower(aim.spotIndex)?.id===aim.id:aim.hp>0&&aim.respawn<=0);
  if(e.ai==='windup'){if(!valid()||distance(e,aim)>def.range+22){e.ai='walk';e.aimId=null;return false;}e.attackWindup-=dt;if(e.attackWindup<=0){if(distance(e,aim)<=def.range+20){if(e.aimKind==='tower')this.structuralDamage(aim,def.damage,e);else if(e.type==='aliengunner')this.enemyShots.push({sourceId:e.id,targetId:aim.id,x:e.x,y:e.y-12,damage:11,life:1.3});else this.damageSoldier(aim,def.damage,e.id);this.emit('enemy_attack_fire',{entityId:e.id,targetId:aim.id,weapon:e.type,damage:def.damage,worldPosition:{x:e.x,y:e.y},targetWorld:{x:aim.x,y:aim.y}});}e.ai='recovery';e.recovery=.19;}return true;}
  if(e.ai==='recovery'){e.recovery-=dt;if(e.recovery<0&&e.attackCD===0)e.ai='walk';return true;}
  const soldiers=this.activeSoldiers().filter(t=>distance(t,e)<(e.type==='aliengunner'?158:146)).sort((a,b)=>distance(a,e)-distance(b,e));aim=soldiers[0];e.aimKind='soldier';if(!aim&&e.type==='demolisher'){aim=[...this.economy.towers.values()].filter(t=>distance(t,e)<138).sort((a,b)=>distance(a,e)-distance(b,e))[0];e.aimKind='tower';}if(!aim)return false;e.aimId=aim.id;if(e.attackCD===0){e.attackCD=def.interval;e.attackWindup=def.windup;e.ai='windup';this.emit('enemy_attack_windup',{entityId:e.id,targetId:aim.id,windup:def.windup});}return true;
 }
 damageSoldier(u,damage,sourceId){if(!u||u.hp<=0||u.respawn>0)return;u.hp=Math.max(0,u.hp-damage);this.emit('soldier_hit',{entityId:u.id,sourceId,damage,hp:u.hp,worldPosition:{x:u.x,y:u.y}});if(!u.hp)this.soldierDieFromZero(u);}
 tryArcherRanged(e,dt){return e.type==='aliengunner'?false:super.tryArcherRanged(e,dt);}
 moveEnemies(dt){super.moveEnemies(dt);const survivors=[];for(const shot of this.enemyShots){shot.life-=dt;const u=this.findSoldier(shot.targetId);if(!u||u.hp<=0||u.respawn>0||shot.life<=0)continue;const d=distance(shot,u),step=305*dt;if(d<step+10)this.damageSoldier(u,shot.damage,shot.sourceId);else{shot.x+=(u.x-shot.x)/d*step;shot.y+=(u.y-shot.y)/d*step;survivors.push(shot);}}this.enemyShots=survivors;}
 tick(dt){
  if(!Number.isFinite(dt)||dt<0||dt>.25)throw Error("M06 invalid dt");
  if(!this.active&&!this.paused&&!this.ended&&dt>0){this.tickNumber++;this.seconds+=dt;this.stepSoldiers(dt);return this.drainEvents();}
  if(this.paused||this.ended||!this.active||dt===0)return [];
  this.tickNumber++;this.seconds+=dt;this.waveSeconds+=dt;
  this.spawnReady();this.moveEnemies(dt);
  if(!this.ended){this.tickSnipers(dt);this.tickBullets(dt);}
  if(!this.ended&&!this.spawnQueue.length&&!this.enemies.size&&!this.bullets.length&&!this.enemyShots.length){
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
 get snapshot(){return{...super.snapshot,enemyShots:this.enemyShots?.length||0,structures:this.structures?[...this.structures].map(([id,s])=>({id,...s})):[],ruins:this.ruins?[...this.ruins]:[]};}
}
