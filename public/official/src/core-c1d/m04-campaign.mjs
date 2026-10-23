/** M04 Normal: source parity with Canvas E1/E2, QA17 M04 Normal HP,
 * E5 wave bonuses and campaign140 reward normalization. No global balance edits. */
import {M02_ENEMY_SPECS} from './m02-combat-world.mjs';
import {CampaignCombatWorld} from './campaign-combat-world.mjs';
import {withCampaignInfantry} from './campaign-infantry-combat.mjs';
const freeze=Object.freeze;
export const M04_ENEMY_SPECS=freeze({
 warrior:freeze({...M02_ENEMY_SPECS.warrior,blockable:true}),
 hound:freeze({...M02_ENEMY_SPECS.hound,blockable:true}),
 archer:freeze({...M02_ENEMY_SPECS.archer,blockable:true}),
 shieldbearer:freeze({...M02_ENEMY_SPECS.shieldbearer,blockable:true}),
 brute:freeze({name:'Bruto Acorazado',category:'melee',hpFactor:2.7,speed:30,size:23,reward:30,
  damage:18,range:45,interval:1.85,windup:.57,blockable:true,resist:freeze({melee:.66,ranged:1.13}),armor:.10}),
 shaman:freeze({name:'Chamán de la Bruma',category:'healer',hpFactor:1.15,speed:39,size:17,reward:28,
  damage:0,range:0,interval:2.5,windup:.58,blockable:false,heal:32,healRadius:168,healCD:7})
});
export const M04_WAVE_COUNTS=freeze([6,5,7,5,10,10,9,6,9,12,15]);
const types=[['warrior','brute'],['brute','archer','hound'],['shaman','warrior','warrior'],
 ['brute','shieldbearer','hound'],['shaman','archer','warrior','warrior'],['shaman','archer','warrior','warrior'],
 ['hound','shaman','brute','hound'],['shieldbearer','shaman','warrior'],['brute','warrior','hound'],
 ['archer','shaman','shieldbearer','warrior'],['brute','shaman','warrior','hound']];
export function validateM04Map(m){
 if(m?.id!==4||m.path?.length!==262||m.spots?.length!==9||m.gold!==395||m.branches?.length!==0)throw Error('M04 canonical map mismatch');
 return true;
}
export function validateM04Campaign(c){
 if(c?.mapId!==4||c.entries!==1||c.waves?.length!==11)throw Error('M04 requires eleven canonical waves');
 c.waves.forEach((w,i)=>{if(w.wave!==i+1||w.bossSlot||w.groups.some(g=>g.routeStart!==0||!M04_ENEMY_SPECS[g.type])||
 w.groups.reduce((s,g)=>s+g.count,0)!==M04_WAVE_COUNTS[i]||w.groups.map(g=>g.type).join(',')!==types[i].join(','))throw Error('M04 wave mismatch '+(i+1));});return true;
}
export function calculateM04Enemy(wave,type,map){
 validateM04Map(map);const d=M04_ENEMY_SPECS[type];if(!d||!Number.isInteger(wave)||wave<1||wave>11)throw Error('Unsupported M04 enemy/wave');
 const base=(30+wave*13)*map.scale*(1+Math.max(0,wave-3)*(.095+map.id*.009));
 const raw=Math.round(base*d.hpFactor*(map.enemyHpMultiplier||1));
 const hpAdjustment={shieldbearer:.7,brute:.77,warrior:.82}[type]??1;
 return freeze({type,hp:Math.max(1,Math.round(raw*hpAdjustment)),speed:d.speed+Math.min(wave*1.5,18)+map.id*.95,r:d.size,
 reward:Math.max(0,Math.round(d.reward*Math.min(1.05,Math.pow(10/11,.32))))});
}
export function m04WaveBonus(w){if(!Number.isInteger(w)||w<1||w>=11)throw Error('Only nonfinal M04 bonuses');return Math.max(1,Math.round(((25+2*4+(w/11)*10*14)*10)/11));}
export const M04_RULES=freeze({mapId:4,waveCount:11,version:'m04-game01-eleven-canonical-waves-v1',validateMap:validateM04Map,
 validateCampaign:validateM04Campaign,enemySpecs:M04_ENEMY_SPECS,calculateEnemy:calculateM04Enemy,waveBonus:m04WaveBonus,airPath:p=>p});
const InfantryCampaign=withCampaignInfantry(CampaignCombatWorld);
export class M04CombatWorld extends InfantryCampaign{
 constructor(map,campaign,options={}){super(map,campaign,{...options,rules:M04_RULES});}
 /** Canvas e2SupportBrain: no self heal, lowest HP ratio, windup+.4, seven-second cooldown.
  * Target is revalidated at release; a failed channel still consumes cooldown. */
 tryEnemySupport(e,dt){
  if(e.type!=='shaman')return false;
  const d=M04_ENEMY_SPECS.shaman;e.specialCD=Math.max(0,(e.specialCD||0)-dt);
  if(e.channel>0){e.channel-=dt;if(e.channel<=0){
   const target=this.enemies.get(e.specialTarget);
   if(target&&!target.dead&&!target.escaped&&target!==e&&Math.hypot(target.x-e.x,target.y-e.y)<d.healRadius){
    const before=target.life;target.life=Math.min(target.maxLife,target.life+d.heal);target.hp=target.life;
    if(target.life>before){this.emit('enemy_heal',{entityId:e.id,targetId:target.id,amount:target.life-before,worldPosition:{x:target.x,y:target.y}});
     this.emit('hp_changed',{entityId:target.id,hp:target.life,maxHp:target.maxLife});}
   }
   e.specialTarget=null;e.specialCD=d.healCD;
  }return true;}
  if(e.specialCD>0)return false;
  const target=[...this.enemies.values()].filter(a=>a!==e&&!a.dead&&!a.escaped&&!a.flying&&a.life<a.maxLife-5&&Math.hypot(a.x-e.x,a.y-e.y)<d.healRadius)
   .sort((a,b)=>a.life/a.maxLife-b.life/b.maxLife)[0];
  if(!target)return false;e.specialTarget=target.id;e.channel=d.windup+.4;
  this.emit('enemy_heal_windup',{entityId:e.id,targetId:target.id,windup:e.channel,worldPosition:{x:e.x,y:e.y}});return true;
 }
}
