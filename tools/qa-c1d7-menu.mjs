import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {M01CombatWithInfantryA2} from "../public/official/src/core-c1d/m01-infantry-combat-a2.mjs";
import {c1d7MenuDTO,c1d7ApplyIntent,c1d7WorldToClient,c1d7ClientToWorld,c1d7NodePlacement} from "../public/official/src/core-c1d/c1d7-contextual-intents.mjs";
const m=JSON.parse(readFileSync(new URL("../public/official/data/maps.v5.json",import.meta.url)))[0];
const c=JSON.parse(readFileSync(new URL("../public/official/data/campaign140.v5.json",import.meta.url))).maps[0];
const w=new M01CombatWithInfantryA2(m,c),e=w.economy;
assert.equal(e.gold,365);assert.equal(e.snapshot.sockets,8);
const d=c1d7MenuDTO(e,0);
assert.equal(d.hasTower,false);assert.equal(d.actions.length,3);
assert.equal(d.actions.find(x=>x.intent==="build_infantry").cost,95);
assert.equal(d.actions.find(x=>x.intent==="build_sniper").cost,140);
assert.equal(c1d7ApplyIntent(w,0,"build_infantry").ok,true);
assert.equal(e.gold,270);assert.equal(e.ledger.length,1);assert.equal(w.soldiers.length,1);
assert.equal(c1d7ApplyIntent(w,0,"build_infantry").ok,false);
assert.equal(e.ledger.length,1,"no duplicate charge occupied");
assert.equal(c1d7MenuDTO(e,0).actions[0].intent,"upgrade");
assert.equal(c1d7ApplyIntent(w,0,"upgrade").ok,true);
assert.equal(e.gold,135);assert.equal(w.soldiers.length,2);
assert.equal(c1d7ApplyIntent(w,0,"upgrade").ok,false);
assert.equal(e.ledger.length,2);
assert.equal(c1d7ApplyIntent(w,0,"rally").reason,"SELECT_RALLY");
const refund=e.quoteSell(0).refund;
assert.equal(refund,Math.floor((95+135)*.65));
assert.equal(c1d7ApplyIntent(w,0,"sell").ok,true);
assert.equal(e.gold,135+refund);assert.equal(e.getTower(0),null);
assert.equal(w.soldiers.length,0);assert.equal(e.ledger.length,3);
assert.equal(c1d7ApplyIntent(w,2,"build_sniper").ok,true);
assert.equal(c1d7ApplyIntent(w,2,"rally").ok,false);
assert.equal(e.assertEconomy(),true);
w.pause();
const before=e.gold;
assert.equal(c1d7ApplyIntent(w,3,"build_infantry").ok,false);
assert.equal(e.gold,before);
assert.equal(c1d7MenuDTO(e,3,{paused:true}).actions.find(x=>x.intent==="build_infantry").enabled,false);
w.resume();
let geometry=[];
for(const [width,height,rect] of [
 [1280,768,{left:0,top:0,width:1280,height:768}],
 [844,390,{left:-97.4,top:0,width:1038.8,height:623.3}],
 [932,430,{left:-112,top:-20,width:1155,height:695}],
 [1536,509,{left:350,top:0,width:836,height:509}],
]){
 for(let i=0;i<8;i++){
  const socket=e.getSocket(i);
  const client=c1d7WorldToClient(socket,rect);
  const back=c1d7ClientToWorld(client,rect);
  assert(Math.abs(back.x-socket.x)<1e-6&&Math.abs(back.y-socket.y)<1e-6);
  const node=c1d7NodePlacement(client,{width,height,menuWidth:208,menuHeight:180,margin:8});
  assert(node.left>=8&&node.top>=8&&node.left+node.width<=width-8+1e-6);
  assert(node.top+node.height<=height-8+1e-6);
 }
 geometry.push(width+"x"+height);
}
console.log(JSON.stringify({status:"PASS_C1D7_G1_CONTEXTUAL_INTENTS",m01Original:{pads:8,route:133,initialGold:365},
 realLedger:e.ledger.length,upgradesLevel2:true,oneVsTwoSoldiers:true,
 checkNoDuplicateCharge:true,pausedNoWrites:true,roundtripViewport:geometry},null,2));
