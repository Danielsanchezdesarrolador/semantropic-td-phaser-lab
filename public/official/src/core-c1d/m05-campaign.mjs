/** M05 Normal: V5 E1/E2/E4/E5 and QA16 local M05 Normal modifiers. */
import{M04_ENEMY_SPECS}from'./m04-campaign.mjs';
import{M03_ENEMY_SPECS,m03AirPath}from'./m03-campaign.mjs';
import{CampaignCombatWorld}from'./campaign-combat-world.mjs';
import{withCampaignInfantry}from'./campaign-infantry-combat.mjs';
import{withM05Boss,M05_BOSS}from'./m05-boss.mjs';
export const M05_ENEMY_SPECS=Object.freeze({...M04_ENEMY_SPECS,shieldbearer:Object.freeze({...M04_ENEMY_SPECS.shieldbearer,shieldFactor:1.15*.40}),bat:M03_ENEMY_SPECS.bat,
 weaver:Object.freeze({name:'Tejedor de Sombras',category:'reviver',hpFactor:1.05,speed:35,size:17,reward:33,damage:0,range:0,interval:3.1,windup:.86,blockable:false,reviveRadius:175,reviveCD:13}),
 mistlord:Object.freeze({name:M05_BOSS.name,category:'melee',hpFactor:1,speed:27,size:29,reward:110,damage:20,range:48,interval:1.9,windup:.57,blockable:true,resist:{ice:.86}})});
export const M05_WAVE_COUNTS=Object.freeze([6,6,8,8,11,7,8,8,9,10,10,9,10]);
export function validateM05Map(m){if(m?.id!==5||m.path?.length!==307||m.spots?.length!==9||m.gold!==430||m.branches?.length)throw Error('M05 canonical map mismatch');return true;}
export function validateM05Campaign(c){
 if(c?.mapId!==5||c.entries!==1||c.waves?.length!==13)throw Error('M05 requires thirteen waves');
 c.waves.forEach((w,i)=>{if(w.wave!==i+1||w.bossSlot!==(i===12?'map05_wave13':null)||w.groups.reduce((n,g)=>n+g.count,0)!==M05_WAVE_COUNTS[i]||w.groups.some(g=>g.routeStart!==0||!M05_ENEMY_SPECS[g.type]||g.type==='mistlord'))throw Error('M05 wave mismatch '+(i+1));});return true;
}
export function calculateM05Enemy(wave,type,map){
 validateM05Map(map);const spec=M05_ENEMY_SPECS[type];if(!spec||wave<1||wave>13||!Number.isInteger(wave))throw Error('M05 enemy/wave unsupported');
 const bounty=x=>Math.max(0,Math.round(x*Math.min(1.05,Math.pow(10/13,.32))));
 if(type==='mistlord'){if(wave!==13)throw Error('Boss only W13');return{type,hp:1640,speed:27,r:29,reward:bounty(110)};}
 const base=(30+wave*13)*map.scale*(1+Math.max(0,wave-3)*(.095+map.id*.009));
 const raw=Math.round(base*spec.hpFactor*(map.enemyHpMultiplier||1));
 return{type,hp:Math.max(1,Math.round(raw*(type==='brute'?.90:1))),speed:spec.speed+Math.min(wave*1.5,18)+map.id*.95,r:spec.size,reward:bounty(spec.reward)};
}
export function m05WaveBonus(w){if(!Number.isInteger(w)||w<1||w>=13)throw Error('M05 nonfinal bonus only');return Math.max(1,Math.round((35+(w/13)*140)*10/13));}
export const M05_RULES=Object.freeze({mapId:5,waveCount:13,version:'m05-game01-thirteen-waves-mistlord-v1',validateMap:validateM05Map,validateCampaign:validateM05Campaign,enemySpecs:M05_ENEMY_SPECS,calculateEnemy:calculateM05Enemy,waveBonus:m05WaveBonus,airPath:m03AirPath});
const InfantryCampaign=withCampaignInfantry(CampaignCombatWorld);
class M05CampaignBase extends InfantryCampaign{
 constructor(map,campaign,options={}){super(map,campaign,{...options,rules:M05_RULES});}
 tryEnemySupport(e,dt){
  if(!['shaman','weaver'].includes(e.type))return false;
  const spec=M05_ENEMY_SPECS[e.type];e.specialCD=Math.max(0,(e.specialCD||0)-dt);
  if(e.channel>0){e.channel-=dt;if(e.channel<=0){
   const target=e.type==='shaman'?this.enemies.get(e.specialTarget):this.corpses.find(c=>c.entity.id===e.specialTarget);
   if(e.type==='shaman'&&target&&!target.dead&&!target.escaped&&this.enemies.has(target.id)&&Math.hypot(target.x-e.x,target.y-e.y)<168){
    const amount=Math.min(32,target.maxLife-target.life);target.life+=amount;target.hp=target.life;this.emit('enemy_heal',{entityId:e.id,targetId:target.id,amount});this.emit('hp_changed',{entityId:target.id,hp:target.life,maxHp:target.maxLife});
   }else if(e.type==='weaver')this.reviveCorpse(target,.42);
   e.specialTarget=null;e.specialCD=e.type==='shaman'?7:13;
  }return true;}
  if(e.specialCD>0)return false;
  const targets=e.type==='shaman'?[...this.enemies.values()].filter(a=>a!==e&&!a.dead&&!a.escaped&&!a.flying&&a.life<a.maxLife-5&&Math.hypot(a.x-e.x,a.y-e.y)<168).sort((a,b)=>a.life/a.maxLife-b.life/b.maxLife):this.corpses.filter(c=>c.time>0&&(c.entity.revives||0)<1&&Math.hypot(c.x-e.x,c.y-e.y)<175).sort((a,b)=>a.time-b.time);
  if(!targets.length)return false;e.specialTarget=e.type==='shaman'?targets[0].id:targets[0].entity.id;e.channel=spec.windup+.4;this.emit('enemy_support_windup',{entityId:e.id,type:e.type,windup:e.channel});return true;
 }
}
export class M05CombatWorld extends withM05Boss(M05CampaignBase){}
