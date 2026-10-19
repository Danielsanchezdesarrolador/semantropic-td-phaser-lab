/** [M] Standalone Node 20 QA for isolated M01 world assets.
 * Run: node public/official/src/maps-visual/m01/qa.mjs
 * NO GPU/browser simulation claim; structural smoke only.
 */
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {
 validateM01,visualSocketPreview,verifyClearance,makeArtPlan,mountM01World,
 M01_PATH_WIDTH,M01_PALETTE_NAMES,M01_WORLD,M01_RENDER_DPR
} from "./renderer.mjs";

const maps=JSON.parse(readFileSync(new URL("../../../data/maps.v5.json",import.meta.url),"utf8"));
const map=maps[0],before=JSON.stringify(map.path)+"|"+JSON.stringify(map.spots);
const proof=validateM01(map),plan=makeArtPlan(map),sockets=visualSocketPreview(map);
assert.equal(proof.waypoints,133);assert.equal(proof.pads,8);
assert.deepEqual(proof.start,[-32,342]);assert.deepEqual(proof.end,[1312,400]);
assert.deepEqual(M01_WORLD,{width:1280,height:768});
assert.equal(M01_PATH_WIDTH,110);assert.equal(M01_RENDER_DPR,2);
assert.deepEqual(M01_PALETTE_NAMES,["equilibrada","viva","atmosferica"]);
assert.equal(sockets.length,8);assert.equal(new Set(sockets.map(s=>s.socketId)).size,8);
assert.deepEqual(sockets.map(s=>[s.world.x,s.world.y]),[[96,480],[416,480],[672,544],[736,352],[992,224],[992,544],[1120,608],[1184,352]]);
assert.ok(plan.props.length>=20,"environment must meaningfully enrich the landscape");
for(const item of plan.props)assert.ok(
 verifyClearance(item.x,item.y,item.worldFootprintRadius,map,sockets,64,64),
 "prop trespasses onto road or pad "+item.id
);
assert.equal(plan.visualRoadWidth,110);
const g=(...args)=>({addColorStop(){}});
const ctx=new Proxy({},{
 get(o,k){if(k==="createLinearGradient"||k==="createRadialGradient")return g;if(!(k in o))o[k]=()=>{};return o[k];},
 set(o,k,v){o[k]=v;return true;}
});
globalThis.document={createElement(type){assert.equal(type,"canvas");return {width:0,height:0,getContext(context){assert.equal(context,"2d");return ctx;}}}};
const textures=new Map(),created=[];
const sprite=()=>({
 setOrigin(){return this},setDisplaySize(){return this},setDepth(){return this},setScale(){return this},
 setInteractive(){return this},setData(){return this},destroy(){this.isDestroyed=true;return this}
});
const graphics=()=>({
 ...sprite(),setDepth(){return this},clear(){return this},lineStyle(){return this},strokeCircle(){return this},
 beginPath(){return this},moveTo(){return this},lineTo(){return this},strokePath(){return this},
 fillStyle(){return this},fillCircle(){return this}
});
const scene={
 textures:{
  exists:k=>textures.has(k),
  remove:k=>textures.delete(k),
  addCanvas:(k,c)=>{assert.ok(!textures.has(k));textures.set(k,{width:c.width,height:c.height});}
 },
 add:{image:(x,y,key)=>{assert.ok(textures.has(key),"unresolved key "+key);const s=sprite();created.push({x,y,key,s});return s;},
     graphics:()=>{const g=graphics();created.push({graphics:true,g});return g;}}
};
const render=[];
for(const palette of M01_PALETTE_NAMES){
 const snapshot=mountM01World(scene,map,{palette,showReserved:true});
 assert.equal(snapshot.plan.sockets.length,8);
 assert.equal(snapshot.plan.props.length,plan.props.length);
 assert.equal(snapshot.padObjects.length,8);
 assert.equal(snapshot.propObjects.length,plan.props.length);
 const prefix="maps/m01/aurora/"+palette+"/";
 assert.deepEqual(textures.get(prefix+"terrain"),{width:2560,height:1536});
 assert.deepEqual(textures.get(prefix+"path"),{width:2560,height:1536});
 assert.deepEqual(textures.get(prefix+"socket-tempo"),{width:464,height:364});
 assert.deepEqual(textures.get(prefix+"prop-oak"),{width:388,height:410});
 snapshot.updateDebug({showRoute:true,showClearance:true,selectedSocket:"m01-pad-01"});
 render.push({palette,objects:snapshot.objects.length,sockets:snapshot.padObjects.length,props:snapshot.propObjects.length});
 snapshot.destroy();
 assert.ok(snapshot.objects.every(o=>o.isDestroyed===true),"graphics objects must be cleaned");
}
assert.equal(textures.size,3*12,"twelve generated texture keys per palette");
assert.equal(JSON.stringify(map.path)+"|"+JSON.stringify(map.spots),before,"canonical map mutated");
console.log(JSON.stringify({
 status:"PASS",type:"STRUCTURAL_ONLY_NOT_BROWSER",
 map:proof,visualRoadWidth:M01_PATH_WIDTH,sockets:sockets.map(s=>({id:s.socketId,world:s.world})),
 props:plan.props.length,discardedProps:plan.rejected.length,palettes:render,
 pending:["Real Phaser/Chrome WebGL2 render","iPhone/Android landscape physical QA","Manual scene screenshot","Director visual art approval","Integrator runtime socket adapter"]
},null,2));