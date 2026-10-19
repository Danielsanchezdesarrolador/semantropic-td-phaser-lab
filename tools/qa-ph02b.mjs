// PH-02B Deluxe QA: no browser/GPU dependency; smoke-test artwork source against canonical M01.
import {readFileSync} from "node:fs";
import assert from "node:assert/strict";
import {installDeluxeArt,artInfo,VISUAL_PATH_WIDTH,SOURCE_PATH_WIDTH} from "../public/official/src/m01-deluxe-art.mjs";
import {validateCampaign} from "../public/official/src/m01-model.mjs";
const maps=JSON.parse(readFileSync("public/official/data/maps.v5.json","utf8"));
const table=JSON.parse(readFileSync("public/official/data/campaign140.v5.json","utf8"));
const contract=validateCampaign(maps,table);
assert.deepEqual(contract.map01Counts,[8,10,11,13,21]);
assert.equal(maps[0].path.length,133);
assert.equal(maps[0].spots.length,8);
assert.ok(VISUAL_PATH_WIDTH<SOURCE_PATH_WIDTH);
assert.ok((1-VISUAL_PATH_WIDTH/SOURCE_PATH_WIDTH)>=.1&&(1-VISUAL_PATH_WIDTH/SOURCE_PATH_WIDTH)<=.18);
// Stub browser Canvas DOM to execute ALL generator branches.
// Validates JavaScript execution, texture dimensions and correct coordinate assignments,
// NOT appearance, runtime WebGL2 or accessibility on actual phones.
const g=()=>({addColorStop(){}});
const ctx=new Proxy({},{
 get(obj,p){if(p==="createLinearGradient"||p==="createRadialGradient")return g;
 if(p==="canvas")return {width:2560,height:1536};
 if(!(p in obj))obj[p]=()=>{};return obj[p];},
 set(obj,p,v){obj[p]=v;return true;}
});
globalThis.document={createElement(kind){assert.equal(kind,"canvas");return{width:0,height:0,getContext(type){assert.equal(type,"2d");return ctx}}}};
const textures=[],images=[],scene={textures:{
 exists:()=>false,addCanvas:(key,canvas)=>textures.push({key,width:canvas.width,height:canvas.height})},
 add:{
  image(x,y,key){images.push({x,y,key});return{setOrigin(){return this},setDepth(){return this},setDisplaySize(){return this},setScale(){return this},setInteractive(){return this},setData(){return this}}},
  graphics(){return{setDepth(){return this}}}
 }};
assert.ok(installDeluxeArt(scene,maps[0]));
assert.equal(images.length,9);
assert.equal(images.filter(x=>x.key.startsWith("ph02b-pad")).length,8);
assert.deepEqual(textures.map(x=>[x.width,x.height]),[[2560,1536],[376,312],[376,312],[376,312]]);
for(let i=0;i<maps[0].spots.length;i++){
 const spot=maps[0].spots[i],obj=images[i+1];
 assert.equal(obj.x,spot.cx*64+32);assert.equal(obj.y,spot.cy*64+32);
}
const info=artInfo();assert.equal(info.changePercent,-12.7);
console.log(JSON.stringify({
 status:"PASS",scope:"M01 canonical path and architectural map art structural QA (not browser QA)",
 pathPoints:133,spots:8,enemyWaveCounts:contract.map01Counts,
 changePct:info.changePercent,
 textures,sceneObjects:images.length,canvasMaster:info.master,
 pending:["real visual browser screenshot","Phaser WebGL2 session verification","mobile touch and layout inspection","director art approval","official tower combat"]
},null,2));