/** M06 two-route strategy. Existing campaign worlds remain byte unchanged.
 * Spawn/movement overrides preserve proven base semantics while binding each entity to its route.
 */
import{pathSegments,positionOnPath}from'../m01-model.mjs';
import{CampaignCombatWorld}from'./campaign-combat-world.mjs';
import{withCampaignInfantry}from'./campaign-infantry-combat.mjs';
import{makeCampaignInfantryNav}from'./campaign-infantry-nav.mjs';
import{M02_INFANTRY_BLOCK_CAPACITY as INFANTRY_BLOCK_CAPACITY}from'./m02-infantry-combat-a2.mjs';
const ensure=(v,m)=>{if(!v)throw Error('M06 routes: '+m)},copy=x=>JSON.parse(JSON.stringify(x));
const pointAt=(route,d)=>positionOnPath(route,d),dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),unitAlive=u=>u&&u.hp>0&&u.respawn<=0;
export function makeM06InfantryNav(paths){
 const nodes=[],keys=new Map();
 for(const path of paths){const graph=makeCampaignInfantryNav(path),ids=graph.nodes.map(p=>{const key=p.x.toFixed(2)+','+p.y.toFixed(2);if(!keys.has(key)){keys.set(key,nodes.length);nodes.push({id:nodes.length,x:p.x,y:p.y,edges:[]});}return keys.get(key);});
 for(const p of graph.nodes)for(const e of p.edges){const from=nodes[ids[p.id]],to=ids[e.to];if(!from.edges.some(q=>q.to===to))from.edges.push({to,cost:e.cost});}}
 return Object.freeze({nodes,kind:'M06-two-canonical-route-shared-node-graph',originalVertices:paths.reduce((n,p)=>n+p.length,0)});
}
export class M06DualRouteWorld extends withCampaignInfantry(CampaignCombatWorld){
 constructor(map,campaign,options){super(map,campaign,options);ensure(map.id===6&&map.branches?.length===1,'M06 two routes required');this.routes=[map.path,map.branches[0]].map(pathSegments);this.airRoutes=[map.path,map.branches[0]].map(p=>pathSegments(this.rules.airPath(p)));this.infantryNav=makeM06InfantryNav([map.path,map.branches[0]]);this.routeSpawns=[0,0];this.routeByEntity=new Map();}
 routeFor(id,flying=false){ensure(id===0||id===1,'invalid routeStart');return(flying?this.airRoutes:this.routes)[id];}
 emit(type,info={}){const e=this.enemies.get(info.entityId??info.targetId);const routeStart=e?.routeStart??this.routeByEntity?.get(info.entityId??info.targetId);if(routeStart!==undefined)info={...info,routeStart};if(type==='spawn'){this.routeSpawns[info.entity.routeStart]++;this.routeByEntity.set(info.entityId,info.entity.routeStart);}return super.emit(type,info);}
 escape(e){const result=super.escape(e);if(result){/* base may append defeat after escape; annotate the matching escape only */for(let i=this.events.length-1;i>=0;i--)if(this.events[i].type==='entity_escape'&&this.events[i].entityId===e.id){this.events[i]=Object.freeze({...this.events[i],routeStart:e.routeStart});break;}}return result;}
 startWave(){
  if(this.ended||this.paused||this.active||this.enemies.size||this.bullets.length||this.wave>=this.rules.waveCount)return false;
  this.wave++;this.waveSeconds=0;this.active=true;this.syncTowers();
  const config=this.campaign.waves[this.wave-1];
  this.spawnQueue=config.groups.flatMap((g,group)=>Array.from({length:g.count},(_,i)=>{
   ensure(this.rules.enemySpecs[g.type]&&(g.routeStart===0||g.routeStart===1),"campaign enemy and route must be canonical");
   return {id:this.nextEnemyId++,type:g.type,at:g.startOffset+i*g.spawnInterval,group,routeStart:g.routeStart};
  })).sort((a,b)=>a.at-b.at||a.group-b.group||a.id-b.id);
  this.emit("wave_start",{wave:this.wave,spawnTotal:this.spawnQueue.length});
  return true;
 }
 spawnReady(){
  while(this.spawnQueue.length&&this.spawnQueue[0].at<=this.waveSeconds+1e-9&&!this.ended){
   const item=this.spawnQueue.shift(),data=this.rules.calculateEnemy(this.wave,item.type,this.map),route=this.routeFor(item.routeStart,Boolean(this.rules.enemySpecs[item.type].flying)),p=positionOnPath(route,0);
   const e={id:item.id,routeStart:item.routeStart,type:item.type,life:data.hp,maxLife:data.hp,hp:data.hp,maxHp:data.hp,
    speed:data.speed,r:data.r,reward:data.reward,progress:0,routeLength:route.total,
    x:p.x,y:p.y,heading:p.heading,dead:false,escaped:false,armor:this.rules.enemySpecs[item.type].armor||0,shield:Math.max(0,Math.round(data.hp*(this.rules.enemySpecs[item.type].shieldFactor||0))),
     shieldMax:Math.max(0,Math.round(data.hp*(this.rules.enemySpecs[item.type].shieldFactor||0))),
    resist:copy(this.rules.enemySpecs[item.type].resist||{}),flying:Boolean(this.rules.enemySpecs[item.type].flying),blockable:this.rules.enemySpecs[item.type].blockable!==false,rewardPaid:false,wave:this.wave};
   this.enemies.set(e.id,e);this.totalSpawns++;
   this.emit("spawn",{entityId:e.id,entity:copy(e),wave:this.wave,worldPosition:{x:e.x,y:e.y}});
  }
 }
 moveEnemies(dt){
  this.stepSoldiers(dt);
  const used=new Map(),ordered=[...this.enemies.values()].sort((a,b)=>b.progress-a.progress||a.id-b.id);
  // Preserve existing blocker first if alive; this stabilizes contacts.
  for(const e of ordered){
   const u=this.findSoldier(e.blockedBy);
   if(!unitAlive(u)||dist(u,e)>e.r+28){e.blockedBy=null;continue;}
   const count=used.get(u.id)||0;
   if(count>=INFANTRY_BLOCK_CAPACITY){e.blockedBy=null;continue;}
   used.set(u.id,count+1);
  }
  for(const e of ordered){
    if(e.dead||e.escaped)continue;
    if(this.tryEnemySupport?.(e,dt))continue;
    if(this.tryArcherRanged(e,dt))continue;
    const active=this.findSoldier(e.blockedBy);
   if(unitAlive(active)){
    this.enemyHitsSoldier(e,active,dt);
    continue; // Held enemy cannot walk until blocker released or defeated.
   }
   const route=this.routeFor(e.routeStart,e.flying);
   const start=e.progress,finish=Math.min(route.total,start+e.speed*dt);
   const from=pointAt(route,start),to=pointAt(route,finish);
   const block=this.tryBlock(e,from,to,used);
   if(block){
    const travel=(finish-start)*block.fraction;
    e.progress=start+travel;
    const p=pointAt(route,e.progress);e.x=p.x;e.y=p.y;e.heading=p.heading;
    e.blockedBy=block.unit.id;e.enemyWindup=0;e.enemyAttackCD=0;
    used.set(block.unit.id,(used.get(block.unit.id)||0)+1);
    this.emit("enemy_blocked",{entityId:e.id,soldierId:block.unit.id,worldPosition:{x:e.x,y:e.y}});
    this.enemyHitsSoldier(e,block.unit,dt);
   }else{
    e.progress=finish;e.x=to.x;e.y=to.y;e.heading=to.heading;
    if(e.progress>=route.total-1e-8)this.escape(e);
   }
  }
 }
 get snapshot(){return {...super.snapshot,infantryPathfinding:"M06 shared-node graph of two canonical routes; no artificial connectors",routeSpawns:[...this.routeSpawns],routeState:[...this.enemies.values()].map(e=>({id:e.id,routeStart:e.routeStart,progress:e.progress,routeLength:e.routeLength,x:e.x,y:e.y,flying:e.flying})),routes:this.routes.map(r=>({nodes:r.points.length,length:r.total})),routeEnemies:[0,1].map(id=>[...this.enemies.values()].filter(e=>e.routeStart===id).length)};}
}
