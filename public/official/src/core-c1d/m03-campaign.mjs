/** M03 Normal: exact campaign roster, legacy E1/E2/E3 stats, no alternate enemies.
 * Source: protected Canvas spawnE1Enemy/E1_ENEMIES, E5_MAP_BALANCE and
 * QA16_SHIELD_BALANCE[3]. Normal M03 has no QA16–19 HP modifiers.
 */
import {M02_ENEMY_SPECS} from './m02-combat-world.mjs';
import {CampaignCombatWorld} from './campaign-combat-world.mjs';
import {withCampaignInfantry} from './campaign-infantry-combat.mjs';
export {INFANTRY_LVLS} from './campaign-infantry-combat.mjs';
const freeze=x=>Object.freeze(x);
export const M03_ENEMY_SPECS=freeze({
 warrior:freeze({...M02_ENEMY_SPECS.warrior,blockable:true}),
 hound:freeze({...M02_ENEMY_SPECS.hound,blockable:true}),
 archer:freeze({...M02_ENEMY_SPECS.archer,blockable:true}),
 shieldbearer:freeze({...M02_ENEMY_SPECS.shieldbearer,blockable:true,shieldFactor:1.15*.45}),
 foreststalker:freeze({name:'Acechador del Bosque',category:'melee',hpFactor:.91,speed:81,size:16,reward:19,
  damage:10,range:31,interval:1.3,windup:.23,blockable:true}),
 hunter:freeze({name:'Cazador Ligero',category:'ranged',hpFactor:.86,speed:72,size:15,reward:19,
  damage:9,range:138,interval:1.75,windup:.32,blockable:true,resist:freeze({melee:1.25,ranged:.72})}),
 bat:freeze({name:'Murciélago Sombrío',category:'flying',hpFactor:.75,speed:80,size:16,reward:20,
  damage:0,range:0,interval:2,windup:0,blockable:false,flying:true})
});
export const M03_WAVE_COUNTS=freeze([8,8,10,8,8,9,15,14,21]);
const EXPECTED_TYPES=freeze([
 ['foreststalker','warrior'],['hunter','warrior'],['foreststalker','hound'],['hunter','archer'],
 ['bat','warrior'],['shieldbearer','hunter'],['bat','archer','warrior','shieldbearer'],
 ['foreststalker','bat'],['hunter','shieldbearer','bat']
]);
export function validateM03Map(map){
 if(map?.id!==3||map.path?.length!==188||map.spots?.length!==8||map.gold!==410||map.mapLayoutVersion!==4||map.branches?.length!==0)
  throw Error('M03 canonical map contract mismatch');
 return true;
}
export function validateM03Campaign(c){
 if(c?.mapId!==3||c.waves?.length!==9)throw Error('M03 requires nine canonical waves');
 c.waves.forEach((w,i)=>{
  if(w.wave!==i+1||w.bossSlot||w.groups.some(g=>g.routeStart!==0||!M03_ENEMY_SPECS[g.type])||
   w.groups.reduce((sum,g)=>sum+g.count,0)!==M03_WAVE_COUNTS[i]||
   w.groups.map(g=>g.type).join(',')!==EXPECTED_TYPES[i].join(','))throw Error('M03 wave contract mismatch: '+(i+1));
 });return true;
}
export function calculateM03Enemy(wave,type,map){
 validateM03Map(map);const def=M03_ENEMY_SPECS[type];
 if(!def||!Number.isInteger(wave)||wave<1||wave>9)throw Error('Unsupported M03 enemy/wave');
 const base=(30+wave*13)*map.scale*(1+Math.max(0,wave-3)*(.095+map.id*.009));
 return freeze({type,hp:Math.max(1,Math.round(base*def.hpFactor*(map.enemyHpMultiplier||1))),
  speed:def.speed+Math.min(wave*1.5,18)+map.id*.95,r:def.size,
  reward:Math.max(0,Math.round(def.reward*Math.min(1.05,Math.pow(10/9,.32))))});
}
export function m03WaveBonus(wave){
 if(!Number.isInteger(wave)||wave<1||wave>=9)throw Error('Only nonfinal M03 wave bonuses');
 return Math.max(1,Math.round(((25+2*3+(wave/9)*10*14)*10)/9));
}
export function m03AirPath(ground){
 const stride=Math.max(3,Math.round(ground.length/17));const vertices=[ground[0]];
 for(let i=stride;i<ground.length-1;i+=stride)vertices.push(ground[i]);
 vertices.push(ground.at(-1));return vertices.map(p=>[...p]);
}
export const M03_RULES=freeze({mapId:3,waveCount:9,version:'m03-nine-wave-canonical-v1',
 validateMap:validateM03Map,validateCampaign:validateM03Campaign,enemySpecs:M03_ENEMY_SPECS,
 calculateEnemy:calculateM03Enemy,waveBonus:m03WaveBonus,airPath:m03AirPath});
const InfantryCampaign=withCampaignInfantry(CampaignCombatWorld);
export class M03CombatWorld extends InfantryCampaign{
 constructor(map,campaign,options={}){super(map,campaign,{...options,rules:M03_RULES});}
}
