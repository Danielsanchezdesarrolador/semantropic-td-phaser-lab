/**
 * SEMANTROPIC TD — C1-D1: construcción + economía auténtica de M01 Normal.
 *
 * Auditoría de fuente: public/JUEGO_V5_CANVAS.html (SPECS.infantry/sniper,
 * upgradePrice(), clickTile(), sell(), e5Spend(), e5Credit()).
 * Este módulo NO simula combate, enemigos, oleadas, daño ni victorias.
 * La única fuente de coordenadas es map.spots de maps.v5.json.
 */
export const M01_ECONOMY_VERSION="semantropic-c1d1-economy-v1";
export const M01_BUILD_FAMILIES=Object.freeze({
 infantry:Object.freeze({id:"infantry",name:"Infantería",baseCost:95,upgradeIToII:135,cap:2}),
 sniper:Object.freeze({id:"sniper",name:"Francotiradores",baseCost:140,upgradeIToII:185,cap:2})
});
export const M01_SELL_REFUND_RATE=0.65;
const fail=(reason,message,detail={})=>({ok:false,reason,message,...detail});
const copy=x=>JSON.parse(JSON.stringify(x));
function integer(n){return Number.isInteger(n)&&Number.isFinite(n)}
function validSpot(map,index){return integer(index)&&index>=0&&index<map.spots.length}
export class M01BuildEconomy{
 constructor(map,{mode="normal"}={}){
  if(map?.id!==1||!Array.isArray(map.spots)||map.spots.length!==8||map.path?.length!==133)throw Error("C1-D1 requires canonical M01 with eight spots and 133 waypoints");
  if(mode!=="normal")throw Error("C1-D1 only implements Normal; no fake support for other modes");
  if(!integer(map.gold)||map.gold<0)throw Error("C1-D1 invalid canonical initial gold");
  this.mode=mode;
  this.mapId=1;
  this.map=map;
  this.initialGold=map.gold;
  this.gold=map.gold;
  this.towers=new Map();
  this.ledger=[];
  this.events=[];
  this.nextTowerId=1;
  this.nextEventId=1;
  this.locked=false;
 }
 getSocket(index){
  if(!validSpot(this.map,index))return null;
  const s=this.map.spots[index];
  return Object.freeze({socketId:"m01-pad-"+String(index+1).padStart(2,"0"),index,cx:s.cx,cy:s.cy,x:s.cx*64+32,y:s.cy*64+32,kind:s.kind});
 }
 catalog(){return copy(M01_BUILD_FAMILIES)}
 quote(index,family){
  const spot=this.getSocket(index);
  if(!spot)return fail("INVALID_SOCKET","Punto de construcción inexistente");
  if(this.locked)return fail("LOCKED","Las construcciones están bloqueadas");
  if(this.towers.has(index))return fail("OCCUPIED","Este punto ya tiene una torre");
  const spec=M01_BUILD_FAMILIES[family];
  if(!spec)return fail("FAMILY_LOCKED","Familia bloqueada en el Mapa 01");
  if(this.gold<spec.baseCost)return fail("INSUFFICIENT_GOLD","Monedas insuficientes",{cost:spec.baseCost,gold:this.gold});
  return {ok:true,spot,cost:spec.baseCost,family,level:1};
 }
 build(index,family){
  const proposal=this.quote(index,family);
  if(!proposal.ok)return proposal;
  const {spot,cost}=proposal;
  const before=this.gold;
  this.gold-=cost;
  const tower={id:"m01-tower-"+this.nextTowerId++,socketId:spot.socketId,spotIndex:index,family,level:1,spent:cost,cx:spot.cx,cy:spot.cy,x:spot.x,y:spot.y};
  this.towers.set(index,tower);
  this.record("debit","construcción",cost,before,this.gold,tower.id);
  const event=this.emit("tower_built",tower);
  return {ok:true,event,tower:copy(tower),gold:this.gold,cost};
 }
 quoteUpgrade(index){
  const spot=this.getSocket(index);
  if(!spot)return fail("INVALID_SOCKET","Punto inexistente");
  if(this.locked)return fail("LOCKED","Las mejoras están bloqueadas");
  const tower=this.towers.get(index);
  if(!tower)return fail("EMPTY","No hay torre que mejorar");
  const spec=M01_BUILD_FAMILIES[tower.family];
  if(!spec||tower.level>=spec.cap)return fail("TECH_LOCKED","Nivel III no disponible en Mapa 01");
  const cost=spec.upgradeIToII;
  if(this.gold<cost)return fail("INSUFFICIENT_GOLD","Monedas insuficientes",{cost,gold:this.gold});
  return {ok:true,cost,toLevel:2,fromLevel:tower.level};
 }
 upgrade(index){
  const quoted=this.quoteUpgrade(index);
  if(!quoted.ok)return quoted;
  const t=this.towers.get(index),before=this.gold;
  this.gold-=quoted.cost;
  t.level=2;t.spent+=quoted.cost;
  this.record("debit","evoluciones y habilidades",quoted.cost,before,this.gold,t.id);
  const event=this.emit("tower_upgraded",t);
  return {ok:true,event,tower:copy(t),gold:this.gold,cost:quoted.cost};
 }
 quoteSell(index){
  if(!this.getSocket(index))return fail("INVALID_SOCKET","Punto inexistente");
  if(this.locked)return fail("LOCKED","La venta está bloqueada");
  const tower=this.towers.get(index);
  if(!tower)return fail("EMPTY","No hay torre para vender");
  return {ok:true,refund:Math.floor(tower.spent*M01_SELL_REFUND_RATE),tower:copy(tower)};
 }
 sell(index){
  const q=this.quoteSell(index);
  if(!q.ok)return q;
  const before=this.gold;
  this.towers.delete(index);
  this.gold+=q.refund;
  this.record("credit","ventas",q.refund,before,this.gold,q.tower.id);
  const event=this.emit("tower_sold",q.tower);
  return {ok:true,event,refund:q.refund,gold:this.gold,tower:q.tower};
 }
 record(type,source,amount,before,after,towerId){
  this.ledger.push(Object.freeze({id:this.ledger.length+1,map:1,mode:"normal",type,source,amount,before,after,towerId}));
  this.assertEconomy();
 }
 emit(type,tower){
  const event=Object.freeze({contractVersion:"combat-events-v1",eventId:"c1d1-"+this.nextEventId++,type,entityId:tower.id,socketId:tower.socketId,source:"economy",tower:copy(tower)});
  this.events.push(event);
  return event;
 }
 assertEconomy(){
  const total=this.ledger.reduce((sum,t)=>sum+(t.type==="credit"?t.amount:-t.amount),this.initialGold);
  if(total!==this.gold||this.gold<0||!integer(this.gold))throw Error("C1-D1 economic ledger inconsistency");
  if(this.towers.size>8)throw Error("C1-D1 exceeded canonical sockets");
  return true;
 }
 getTower(index){return this.towers.has(index)?copy(this.towers.get(index)):null}
 get snapshot(){
  return copy({version:M01_ECONOMY_VERSION,scope:"REAL_BUILD_UPGRADE_SELL_ONLY_NOT_COMBAT",mapId:1,mode:"normal",initialGold:this.initialGold,gold:this.gold,towers:[...this.towers.values()],ledger:this.ledger,events:this.events.map(e=>({...e})),sockets:8,tech:{infantry:2,sniper:2},combatImplemented:false});
 }
}
