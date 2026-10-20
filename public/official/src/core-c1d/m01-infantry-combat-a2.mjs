/**
 * C1-D5 A2 — Infantry soldiers I/II and actual melee/block/HP/respawn in M01.
 * Adds behavior atop VERIFIED C1-D2 core without rewriting sniper or economy.
 * M01 warrior/hound only. Deterministic route graph and bounded interception, validated against V5 navigation structure.
 * Art team P displays soldiers; no visual frame may apply damage.
 */
import {M01CombatWorld} from "./m01-combat-world.mjs";
import {positionOnPath} from "../m01-model.mjs";
import {makeM01InfantryNav,nearestM01Nav,shortestM01Nav,m01NavFormation} from "./m01-infantry-nav.mjs";
export const INFANTRY_LVLS=Object.freeze({
 1:Object.freeze({hp:110,damage:8,interval:1.2,radius:130,respawn:10,count:1,speed:82,reach:20}),
 2:Object.freeze({hp:165,damage:12,interval:1.1,radius:130,respawn:9,count:2,speed:88,reach:20})
});
export const M01_INFANTRY_BLOCK_CAPACITY=2;
export const M01_ENEMY_MELEE=Object.freeze({
 warrior:Object.freeze({damage:11,interval:1.35,windup:.32}),
 hound:Object.freeze({damage:7,interval:1.12,windup:.21})
});
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const clone=x=>JSON.parse(JSON.stringify(x));
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const pointAt=(route,d)=>positionOnPath(route,d);
const unitAlive=u=>u&&u.hp>0&&u.respawn<=0;

export class M01CombatWithInfantryA2 extends M01CombatWorld {
 constructor(...args){
  super(...args);this.squads=new Map();this.nextSoldierId=1;
  this.infantryNav=makeM01InfantryNav(this.route.points);this.rallyNodes=new Map();this.navigationRepaths=0;
 }
 rallyAt(t){
  // Canvas V5 shared-node graph; no visual or collision geometry modifications.
  const requested=this.rallyNodes.get(t.spotIndex);
  const closest=nearestM01Nav(this.infantryNav,t.x,t.y);
  const node=this.infantryNav.nodes[requested??closest.id];
  const lv=INFANTRY_LVLS[t.level];
  if(!node||dist(t,node)>lv.radius)return {...closest,nodeId:closest.id,
   ...m01NavFormation(this.infantryNav,closest.id,1,0)};
  return {...node,nodeId:node.id,...m01NavFormation(this.infantryNav,node.id,1,0)};
 }
 setInfantryRally(spotIndex,x,y){
  // A manual combat order independent of tower purchase/sell and enemy collision.
  const t=this.economy.getTower(spotIndex);
  if(!t||t.family!=="infantry"||this.ended||this.paused||!Number.isFinite(x)||!Number.isFinite(y))
   return {ok:false,reason:"invalid-tower-or-state"};
  const node=nearestM01Nav(this.infantryNav,x,y),lv=INFANTRY_LVLS[t.level];
  if(dist(t,node)>lv.radius+1e-6)return {ok:false,reason:"out-of-range"};
  this.rallyNodes.set(spotIndex,node.id);
  this.syncTowers();
  const squad=this.squads.get(t.id);
  if(squad)for(const u of squad.units){u.navPath=[];u.navGoal=null;u.navRepath=0;}
  this.emit("infantry_rally_changed",{towerId:t.id,spotIndex,
   navNodeId:node.id,worldPosition:{x:node.x,y:node.y}});
  return {ok:true,spotIndex,nodeId:node.id,x:node.x,y:node.y};
 }
 createSoldier(t,index,lv,anchor){
  const offset=lv.count===2?(index===0?-14:14):0;
  const u={id:"m01-soldier-"+this.nextSoldierId++,parentId:t.id,spotIndex:t.spotIndex,
    slot:index,level:t.level,hp:lv.hp,maxHp:lv.hp,x:t.x+(index?15:0),y:t.y+8,
    homeX:anchor.x+anchor.nx*offset,homeY:anchor.y+anchor.ny*offset,respawn:0,
    attackCD:.35+index*.13,attackTargetId:null,windup:0,state:"moving",
    navPath:[],navGoal:null,navRepath:0};
  this.emit("soldier_spawn",{entityId:u.id,towerId:t.id,worldPosition:{x:u.x,y:u.y},level:t.level});
  return u;
 }
 syncTowers(){
  super.syncTowers();
  const inPlay=new Set();
  for(const t of this.economy.towers.values()){
   if(t.family!=="infantry")continue;
   inPlay.add(t.id);
   const lv=INFANTRY_LVLS[t.level];
   if(!lv)throw Error("C1-D3 infantry level locked");
   const anchor=this.rallyAt(t);
   let squad=this.squads.get(t.id);
   if(!squad){squad={towerId:t.id,level:t.level,units:[]};this.squads.set(t.id,squad);}
   if(squad.level!==t.level){
    squad.level=t.level;
    for(const u of squad.units){
     const fraction=u.maxHp?u.hp/u.maxHp:0;
     u.maxHp=lv.hp;u.hp=u.hp>0?Math.max(1,Math.round(lv.hp*fraction)):0;
     u.level=t.level;u.attackTargetId=null;u.windup=0;
    }
   }
   while(squad.units.length<lv.count)squad.units.push(this.createSoldier(t,squad.units.length,lv,anchor));
   while(squad.units.length>lv.count)this.removeSoldier(squad.units.pop());
   squad.units.forEach((u,index)=>{
    const offset=lv.count===2?(index===0?-17:17):0;
    u.homeX=anchor.x+anchor.nx*offset;u.homeY=anchor.y+anchor.ny*offset;
    if(u.homeNode!==anchor.nodeId){u.homeNode=anchor.nodeId;u.navPath=[];u.navGoal=null;}
   });
  }
  for(const [id,squad] of this.squads)if(!inPlay.has(id)){
   for(const u of squad.units)this.removeSoldier(u);
   this.squads.delete(id);
  }
 }
 removeSoldier(u){
  for(const e of this.enemies.values())if(e.blockedBy===u.id){e.blockedBy=null;e.enemyWindup=0;e.enemyAttackCD=0;this.emit("enemy_unblocked",{entityId:e.id,soldierId:u.id,reason:"soldier_removed"});}
  this.emit("soldier_removed",{entityId:u.id,towerId:u.parentId});
 }
 activeSoldiers(){return [...this.squads.values()].flatMap(s=>s.units).filter(unitAlive);}
 findSoldier(id){for(const s of this.squads.values())for(const u of s.units)if(u.id===id)return u;return null;}
 soldierDie(u){
  if(!unitAlive(u))return false;
  const lv=INFANTRY_LVLS[u.level];
  u.hp=0;u.respawn=lv.respawn;u.state="defeated";u.windup=0;u.attackTargetId=null;
  for(const e of this.enemies.values())if(e.blockedBy===u.id){e.blockedBy=null;e.enemyWindup=0;e.enemyAttackCD=0;this.emit("enemy_unblocked",{entityId:e.id,soldierId:u.id,reason:"soldier_defeated"});}
  this.emit("soldier_die",{entityId:u.id,towerId:u.parentId,respawnAfter:lv.respawn,worldPosition:{x:u.x,y:u.y}});
  return true;
 }
 stepSoldiers(dt){
  this.syncTowers();
  for(const [id,squad] of this.squads){
   const t=[...this.economy.towers.values()].find(x=>x.id===id);
   if(!t)continue;
   const lv=INFANTRY_LVLS[t.level];
   for(const u of squad.units){
    if(u.hp<=0){
     u.respawn=Math.max(0,u.respawn-dt);
     if(u.respawn===0){
      u.hp=u.maxHp;u.x=t.x+(u.slot?15:0);u.y=t.y+8;
      u.attackCD=.4+u.slot*.12;u.state="moving";u.navPath=[];u.navGoal=null;u.navRepath=0;
      this.emit("soldier_respawn",{entityId:u.id,towerId:t.id,hp:u.hp,worldPosition:{x:u.x,y:u.y}});
     }else u.state="respawning";
     continue;
    }
    u.attackCD=Math.max(0,u.attackCD-dt);
    const currentTarget=u.attackTargetId?this.enemies.get(u.attackTargetId):null;
    if(u.windup>0){
     u.windup-=dt;
     if(u.windup<=0){
      u.windup=0;u.attackTargetId=null;u.attackCD=lv.interval;
      if(currentTarget&&!currentTarget.dead&&!currentTarget.escaped&&dist(u,currentTarget)<=currentTarget.r+lv.reach+2){
       // M01 warrior/hound have no shield, armor or melee/ranged resistance.
       // Their effective physical melee damage equals the base hit calculation.
       this.hit(currentTarget,lv.damage,"melee:"+u.id+":"+this.tickNumber,t.id);
       this.emit("soldier_attack_hit",{entityId:u.id,towerId:t.id,targetId:currentTarget.id,
        damage:lv.damage,worldPosition:{x:currentTarget.x,y:currentTarget.y}});
      }
      u.state="idle";
     }
     continue;
    }
    const enemies=[...this.enemies.values()].filter(e=>!e.dead&&!e.escaped&&dist(t,e)<=lv.radius+20);
    enemies.sort((a,b)=>b.progress-a.progress||a.id-b.id);
    const target=enemies[0]||null;
    const within=target&&dist(target,u)<=target.r+lv.reach+2;
    if(within&&u.attackCD<=0){
     u.attackTargetId=target.id;u.windup=.29+u.slot*.035;u.state="attackWindup";
     this.emit("soldier_attack_windup",{entityId:u.id,towerId:t.id,targetId:target.id,
      windup:u.windup,worldPosition:{x:u.x,y:u.y}});
     continue;
    }
    const dest=target?{x:target.x,y:target.y}:{x:u.homeX,y:u.homeY};
    const goal=nearestM01Nav(this.infantryNav,dest.x,dest.y);
    u.navRepath=Math.max(0,(u.navRepath||0)-dt);
    if(u.navGoal!==goal.id||(!u.navPath.length&&dist(u,dest)>34)||u.navRepath===0){
     const here=nearestM01Nav(this.infantryNav,u.x,u.y);
     const route=shortestM01Nav(this.infantryNav,here.id,goal.id);
     // Only accept connected paths from the protected M01 route, never teleport.
     u.navPath=route?route.slice(1):[];
     u.navGoal=goal.id;u.navRepath=.42;this.navigationRepaths++;
    }
    let waypoint=dest;
    if(dist(u,dest)>34){
     const origin=nearestM01Nav(this.infantryNav,u.x,u.y);
     if(dist(u,origin)>22)waypoint=origin;
     else if(u.navPath.length){
      waypoint=this.infantryNav.nodes[u.navPath[0]];
      if(dist(u,waypoint)<3){u.navPath.shift();
       waypoint=u.navPath.length?this.infantryNav.nodes[u.navPath[0]]:dest;}
     }
    }
    let vx=waypoint.x-u.x,vy=waypoint.y-u.y,len=Math.hypot(vx,vy);
    if(len>2){
     const walk=Math.min(len,lv.speed*dt);
     const nx=u.x+vx/len*walk,ny=u.y+vy/len*walk;
     if(Math.hypot(nx-t.x,ny-t.y)<=lv.radius+12){
      u.x=nx;u.y=ny;u.state="moving";
     }else u.state="holding";
    }else u.state="idle";
   }
  }
 }
 // Deterministic contact along a ≤1.9 world-unit step; no frame-rate tunnelling.
 tryBlock(e,from,to,used){
  const enemyStats=M01_ENEMY_MELEE[e.type];
  if(!enemyStats)return null;
  let nearest=null,best=Infinity,bestFraction=1;
  for(const u of this.activeSoldiers()){
   if((used.get(u.id)||0)>=M01_INFANTRY_BLOCK_CAPACITY)continue;
   const radius=e.r+13,dx=to.x-from.x,dy=to.y-from.y,l2=dx*dx+dy*dy;
   const f=l2?clamp(((u.x-from.x)*dx+(u.y-from.y)*dy)/l2,0,1):0;
   const px=from.x+dx*f,py=from.y+dy*f;
   const d=Math.hypot(u.x-px,u.y-py);
   if(d>radius)continue;
   if(!nearest||f<bestFraction-1e-9||Math.abs(f-bestFraction)<1e-9&&d<best){
    nearest=u;best=d;bestFraction=f;
   }
  }
  if(!nearest)return null;
  return {unit:nearest,fraction:bestFraction};
 }
 enemyHitsSoldier(e,u,dt){
  const def=M01_ENEMY_MELEE[e.type];if(!def||!unitAlive(u))return;
  if(e.enemyWindup>0){
   e.enemyWindup=Math.max(0,e.enemyWindup-dt);
   if(e.enemyWindup===0){
    if(unitAlive(u)){
     u.hp=Math.max(0,u.hp-def.damage);
     this.emit("soldier_hit",{entityId:u.id,sourceId:e.id,damage:def.damage,hp:u.hp,
      worldPosition:{x:u.x,y:u.y}});
     if(u.hp===0)this.soldierDieFromZero(u);
    }
    e.enemyAttackCD=def.interval;
   }
  }else{
   e.enemyAttackCD=Math.max(0,(e.enemyAttackCD||0)-dt);
   if(e.enemyAttackCD===0){
    e.enemyWindup=def.windup;
    this.emit("enemy_attack_windup",{entityId:e.id,targetId:u.id,windup:def.windup});
   }
  }
 }
 soldierDieFromZero(u){
  const lv=INFANTRY_LVLS[u.level];
  u.hp=0;u.respawn=lv.respawn;u.state="defeated";u.attackTargetId=null;u.windup=0;
  for(const e of this.enemies.values())if(e.blockedBy===u.id){
   e.blockedBy=null;e.enemyWindup=0;e.enemyAttackCD=0;
   this.emit("enemy_unblocked",{entityId:e.id,soldierId:u.id,reason:"soldier_defeated"});
  }
  this.emit("soldier_die",{entityId:u.id,towerId:u.parentId,respawnAfter:lv.respawn,worldPosition:{x:u.x,y:u.y}});
 }
 moveEnemies(dt){
  this.stepSoldiers(dt);
  const used=new Map(),ordered=[...this.enemies.values()].sort((a,b)=>b.progress-a.progress||a.id-b.id);
  // Preserve existing blocker first if alive; this stabilizes contacts.
  for(const e of ordered){
   const u=this.findSoldier(e.blockedBy);
   if(!unitAlive(u)||dist(u,e)>e.r+28){e.blockedBy=null;continue;}
   const count=used.get(u.id)||0;
   if(count>=M01_INFANTRY_BLOCK_CAPACITY){e.blockedBy=null;continue;}
   used.set(u.id,count+1);
  }
  for(const e of ordered){
   if(e.dead||e.escaped)continue;
   const active=this.findSoldier(e.blockedBy);
   if(unitAlive(active)){
    this.enemyHitsSoldier(e,active,dt);
    continue; // Held enemy cannot walk until blocker released or defeated.
   }
   const start=e.progress,finish=Math.min(this.route.total,start+e.speed*dt);
   const from=pointAt(this.route,start),to=pointAt(this.route,finish);
   const block=this.tryBlock(e,from,to,used);
   if(block){
    const travel=(finish-start)*block.fraction;
    e.progress=start+travel;
    const p=pointAt(this.route,e.progress);e.x=p.x;e.y=p.y;e.heading=p.heading;
    e.blockedBy=block.unit.id;e.enemyWindup=0;e.enemyAttackCD=0;
    used.set(block.unit.id,(used.get(block.unit.id)||0)+1);
    this.emit("enemy_blocked",{entityId:e.id,soldierId:block.unit.id,worldPosition:{x:e.x,y:e.y}});
    this.enemyHitsSoldier(e,block.unit,dt);
   }else{
    e.progress=finish;e.x=to.x;e.y=to.y;e.heading=to.heading;
    if(e.progress>=this.route.total-1e-8)this.escape(e);
   }
  }
 }
 get soldiers(){return [...this.squads.values()].flatMap(s=>s.units).map(clone);}
 get snapshot(){return {...super.snapshot,onlySniperCombat:false,infantryCombatImplemented:true,
  soldiers:this.soldiers.filter(x=>x.hp>0).length,
  soldiersRespawning:this.soldiers.filter(x=>x.hp===0).length,
  infantryPathfinding:"M01 Canvas-V5-style waypoint graph, Dijkstra, 2-soldier lateral formation; complete all-branch V5 behavior pending",
  navNodes:this.infantryNav.nodes.length,navRepaths:this.navigationRepaths};
 }
}
