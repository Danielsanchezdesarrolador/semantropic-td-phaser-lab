/** SEMANTROPIC TD R7 — approved visual rework source-integrity contract.
 * No copied reference raster and no gameplay changes. M07 historical renderer
 * remains preserved as fallback; main scene presents R7 painted background.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {makeR7MapPlan,R7_MAP01_ART_VERSION}
 from '../../public/official/src/maps-visual/m01/r7/dawn-plateau-art.mjs';
import {R7_M01_TEXTURE}
 from '../../public/official/src/maps-visual/m01/r7/renderer-r7.mjs';
const read=p=>readFileSync(p,'utf8');
for(const [p,sha] of Object.entries({
 'public/official/data/maps.v5.json':'1da0e20145e1312f3d75443debabea17e3db507c',
 'public/official/data/campaign140.v5.json':'794cf43f9b172a39dd88f02e2a89ea11455064c3',
 'public/official/src/maps-visual/m01/m07/renderer-v7.mjs':'ca77f7b27886d373815789087df1044f1a6a2cdf',
 'public/official/src/c1d8-b2-playable/scene-m02.mjs':'e8aa7c6cb8dc56211669f71219d47591a4ac01a8',
 'public/official/src/core-c1d/m01-combat-world.mjs':'68300432ca2f78446d804ce047adfcded84addb3',
 'public/official/src/core-c1d/m02-combat-world.mjs':'63741749125e7ac455787caae3bd5b3fb7d3b8a0'
})){
 assert.equal(execFileSync('git',['hash-object',p],{encoding:'utf8'}).trim(),sha,'R7 protected original changed '+p);
}
const maps=JSON.parse(read('public/official/data/maps.v5.json'));
const map=maps.find(m=>m.id===1),plan=makeR7MapPlan(map);
assert.equal(plan.version,'r7-m01-dawn-plateau-premium-v1');
assert.equal(R7_MAP01_ART_VERSION,plan.version);
assert.equal(R7_M01_TEXTURE,'maps/m01/r7/dawn-plateau/v1');
assert.equal(plan.path.length,133);
assert.equal(plan.pads.length,8);
assert.equal(map.gold,365);
assert.equal(map.design.routes,1);
assert.deepEqual(plan.path[0],[-32,342]);
assert.deepEqual(plan.path.at(-1),[1312,400]);
assert.deepEqual(plan.pads.map(p=>p.index),[0,1,2,3,4,5,6,7]);
const campaign=JSON.parse(read('public/official/data/campaign140.v5.json')).maps.find(m=>m.mapId===1);
assert.equal(campaign.waves.length,5);
const painter=read('public/official/src/maps-visual/m01/r7/dawn-plateau-art.mjs');
for(const feature of ['distantWorld(c)','cliffsAndWater(c,plan)','meadow(c,plan)',
 'road(c,plan.path)','entrance(c)','archRuins(c)','shrine(c)','exitBridge(c)','pads(c,plan)']){
 assert(painter.includes(feature),'R7 director feature missing: '+feature);
}
const adapter=read('public/official/src/maps-visual/m01/r7/renderer-r7.mjs');
assert(adapter.includes("import {mountM01WorldV7}"),'M07 protected fallback lost');
assert(adapter.includes('pad.selection')===false || adapter.includes('pad.selection.setVisible')===false);
assert(adapter.includes('base.padObjects')&&adapter.includes('applyVisualSnapshot'),'R7 preserved socket state API');
const scene=read('public/official/src/c1d8-b2-playable/scene.mjs');
assert(scene.includes('mountM01WorldR7(this,MAP,{palette:"viva",treatment:"fiel"})'),'LIVE M01 not using R7');
assert(scene.includes('window.__SEMANTROPIC_VIEWPORT?.bindScene?.(this,1)'),'R5 full bleed lost');
const pano=read('public/official/src/mobile/viewport-panorama-r5.mjs');
assert(pano.includes("const premium=texture(PREMIUM_M01)"),'R5 side panels not using premium terrain');
const live=read('public/official/src/live/index.html');
assert(live.includes('r7=dawn-plateau-v1'),'Missing R7 cache invalidation');
assert(live.includes('scene-m02.mjs?release='),'Map 02 removed');

import {R7_HF1_DECORATION_SITES as correctedDecor} from '../../public/official/src/maps-visual/m01/r7/dawn-plateau-art.mjs';
assert.equal(correctedDecor.waterfalls.length,2,'R7 HF1 must have exactly two cliff falls');
assert.equal(correctedDecor.fences.length,4,'R7 HF1 fence plan must be minimal');
const routeDist=(x,y)=>{
 let best=Infinity;
 for(let i=1;i<plan.path.length;i++){
  const a=plan.path[i-1],b=plan.path[i],dx=b[0]-a[0],dy=b[1]-a[1],len=dx*dx+dy*dy;
  const t=len?Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/len)):0;
  best=Math.min(best,Math.hypot(x-a[0]-dx*t,y-a[1]-dy*t));
 }
 return best;
};
for(const [cx,cy,w,h] of correctedDecor.waterfalls){
 assert(cy>=625&&cy<=655&&cy+h>=735&&cy+h<=768,'Waterfall must descend from cliff to river');
 assert(routeDist(cx,cy)>120+w/2,'Waterfall must be clear of playable road');
 for(const p of plan.pads)assert(Math.hypot(cx-p.x,cy-p.y)>95+w/2,'Waterfall too close to pad');
}
for(const [a,b] of correctedDecor.fences){
 const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),nx=-dy/len,ny=dx/len;
 assert(len>=24&&len<=125,'Fence fragment too long or short');
 for(let i=0,n=Math.ceil(len/8);i<=n;i++){
  const x=a[0]+dx*i/n,y=a[1]+dy*i/n;
  for(const offset of [-24,0,8]){
   const xx=x+nx*offset,yy=y+ny*offset;
   assert(xx>=12&&xx<=1268&&yy>=125&&yy<=645,'Fence out of playable meadow bounds');
   assert(routeDist(xx,yy)>112,'Fence rail or post intersects road buffer');
   for(const p of plan.pads)
    assert(Math.hypot(xx-p.x,yy-p.y)>100,'Fence rail or post intersects build pad buffer');
  }
 }
}
assert(read('public/official/src/live/index.html').includes('r7=dawn-plateau-hf1'),
 'Browser cache invalidation missing for R7 HF1');
console.log('PASS_R7_MAP01_HF1_TWO_FALLS_CLEAR_ROAD_FENCES_133_PATH_8_PADS_M02_R6_PROTECTED');
