// PH-01 P0/P1 — pure simulation data and read-only campaign path
// EXACT source map / wave tables are injected from public/official/data/*.v5.json.
// This is a diagnostic NO-DEFENSE smoke model, NOT the complete Canvas E1/E5 combat port.
export const CAMPAIGN_WAVE_COUNTS=Object.freeze([5,7,9,11,13,15,17,19,21,23]);
export const BASIC_ENEMIES=Object.freeze({
  warrior:Object.freeze({name:"Orco Guerrero",speed:50,hpFactor:1,reward:15,size:15}),
  hound:Object.freeze({name:"Perro de Caza",speed:112,hpFactor:.53,reward:12,size:14})
});
export const MAP01_INITIAL=Object.freeze({lives:100,leakDamage:2,bossLeakDamage:30,tech:Object.freeze({infantry:2,sniper:2})});
const assert=(ok,message)=>{if(!ok)throw new Error("PH01 contract: "+message)};
export function validateCampaign(maps,table){
 assert(Array.isArray(maps)&&maps.length===10,"expected 10 source maps");
 assert(table?.schema==="semantropic-td-campaign140-v1","campaign schema");
 assert(Array.isArray(table.maps)&&table.maps.length===10,"10 campaign configs");
 let total=0;
 for(let i=0;i<10;i++){
  const m=maps[i],c=table.maps[i];
  assert(m.id===i+1&&c.mapId===m.id,"map IDs and order");
  assert(Array.isArray(m.path)&&m.path.length>2,"primary path is present");
  assert(Array.isArray(m.spots)&&m.spots.length>0,"tower spots present");
  for(const p of m.path)assert(Array.isArray(p)&&p.length===2&&p.every(Number.isFinite),"waypoint coordinates");
  assert(c.waves.length===CAMPAIGN_WAVE_COUNTS[i],"wave contract M"+m.id);
  for(let j=0;j<c.waves.length;j++){
   const w=c.waves[j];assert(w.wave===j+1,"wave numbering");
   for(const g of w.groups){
    assert(Number.isInteger(g.count)&&g.count>0,"positive integer spawn count");
    assert(Number.isFinite(g.spawnInterval)&&g.spawnInterval>0,"spawn cadence");
    assert(Number.isFinite(g.startOffset)&&g.startOffset>=0,"offset");
    assert(Number.isInteger(g.routeStart)&&g.routeStart>=0,"route index");
   }
  }
  total+=c.waves.length;
 }
 assert(total===140,"exact 140 waves");
 return {maps:10,waves:140,map01PathPoints:maps[0].path.length,map01TowerSpots:maps[0].spots.length,map01Counts:table.maps[0].waves.map(w=>w.groups.reduce((sum,g)=>sum+g.count,0))};
}
export function pathSegments(points){
 const distance=[],cumulative=[0];let total=0;
 for(let i=1;i<points.length;i++){
  const dx=points[i][0]-points[i-1][0],dy=points[i][1]-points[i-1][1],d=Math.hypot(dx,dy);
  assert(Number.isFinite(d)&&d>0,"zero or invalid route segment "+i);
  distance.push(d);total+=d;cumulative.push(total);
 }
 return {points,distance,cumulative,total};
}
export function positionOnPath(route,d){
 d=Math.max(0,Math.min(route.total,d));
 if(d>=route.total){const e=route.points.at(-1);return {x:e[0],y:e[1],heading:0};}
 let lo=0,hi=route.distance.length-1;
 while(lo<hi){const mid=(lo+hi)>>1;if(route.cumulative[mid+1]<d)lo=mid+1;else hi=mid;}
 const i=lo,t=(d-route.cumulative[i])/route.distance[i];
 const a=route.points[i],b=route.points[i+1];
 return {x:a[0]+(b[0]-a[0])*t,y:a[1]+(b[1]-a[1])*t,heading:Math.atan2(b[1]-a[1],b[0]-a[0])};
}
export class M01PathSmokeModel{
 constructor(map,waves,{mode="normal"}={}){
  assert(map?.id===1&&waves?.mapId===1,"this first smoke model supports M01 only");
  assert(mode==="normal","other difficulties not yet ported");
  assert(waves.waves.length===5,"five waves expected");
  this.map=map;this.waves=waves;this.route=pathSegments(map.path);
  this.mode=mode;this.wave=0;this.lives=MAP01_INITIAL.lives;this.gold=map.gold;
  this.active=false;this.ended=false;this.won=false;this.seconds=0;this.waveSeconds=0;
  this.spawnQueue=[];this.enemies=new Map();this.nextEnemyId=1;this.escaped=new Set();
  this.escapedCount=0;this.events=[];
 }
 startWave(){
  if(this.ended||this.active||this.enemies.size||this.wave>=5)return false;
  this.wave++;this.waveSeconds=0;this.active=true;
  const cfg=this.waves.waves[this.wave-1];
  this.spawnQueue=cfg.groups.flatMap((g,i)=>Array.from({length:g.count},(_,j)=>({
    id:this.nextEnemyId++,type:g.type,at:g.startOffset+j*g.spawnInterval,route:g.routeStart,group:i
  }))).sort((a,b)=>a.at-b.at||a.group-b.group||a.id-b.id);
  this.events.push({type:"wave_start",wave:this.wave,spawnTotal:this.spawnQueue.length});
  return true;
 }
 tick(dt){
  if(!Number.isFinite(dt)||dt<0||dt>1)throw Error("invalid fixed step: use <=1 second");
  if(this.ended||!this.active)return [];
  this.events.length=0;this.seconds+=dt;this.waveSeconds+=dt;
  while(this.spawnQueue.length&&this.spawnQueue[0].at<=this.waveSeconds+1e-8){
   const p=this.spawnQueue.shift();
   assert(p.route===0,"M01 has one ground route");
   assert(!!BASIC_ENEMIES[p.type],"unsupported M01 enemy type "+p.type);
   // Translated precisely from V5 spawnE1Enemy normal formula.
   const def=BASIC_ENEMIES[p.type];
   const base=(30+this.wave*13)*this.map.scale*(1+Math.max(0,this.wave-3)*(.095+this.map.id*.009));
   const hp=Math.max(1,Math.round(Math.round(base*def.hpFactor*(this.map.enemyHpMultiplier||1))));
   const speed=def.speed+Math.min(this.wave*1.5,18)+this.map.id*.95;
   const ent={id:p.id,type:p.type,hp,maxHp:hp,speed,distance:0,escaped:false,dead:false};
   this.enemies.set(ent.id,ent);
   this.events.push({type:"spawn",wave:this.wave,entity:{...ent}});
  }
  for(const ent of [...this.enemies.values()]){
   if(ent.dead||ent.escaped)continue;
   ent.distance=Math.min(this.route.total,ent.distance+ent.speed*dt);
   if(ent.distance>=this.route.total){
    if(this.escaped.has(ent.id))throw Error("duplicate escape for "+ent.id);
    this.escaped.add(ent.id);ent.escaped=true;this.enemies.delete(ent.id);
    this.escapedCount++;this.lives=Math.max(0,this.lives-MAP01_INITIAL.leakDamage);
    this.events.push({type:"escape",enemyId:ent.id,loss:MAP01_INITIAL.leakDamage,lives:this.lives});
    if(this.lives===0){this.active=false;this.ended=true;this.events.push({type:"defeat",wave:this.wave});break;}
   }
  }
  if(!this.ended&&!this.spawnQueue.length&&!this.enemies.size){
    this.active=false;
    this.events.push({type:"wave_clear",wave:this.wave});
    if(this.wave===5){ // In the NO-DEFENSE diagnostic 63 enemies must already have caused defeat.
      this.ended=true;this.won=true;
      this.events.push({type:"diagnostic_end",warning:"No-tower smoke model only; NOT a campaign win."});
    }
  }
  return this.events.map(e=>({...e}));
 }
 get actors(){return [...this.enemies.values()].map(e=>({...e,...positionOnPath(this.route,e.distance)}));}
 get snapshot(){return {map:1,wave:this.wave,lives:this.lives,gold:this.gold,active:this.active,ended:this.ended,mode:this.mode,spawnsRemaining:this.spawnQueue.length,actors:this.enemies.size,escaped:this.escapedCount,warning:"P0/P1: NO-DEFENSE route smoke test; no tower combat, win eligibility, stars or saves."};}
}