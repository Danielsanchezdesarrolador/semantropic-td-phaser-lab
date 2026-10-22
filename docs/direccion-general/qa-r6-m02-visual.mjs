/** SEMANTROPIC TD R6: Golden Valley production art source contract.
 * Official original reference is a visual target, NOT a raster copied into repo.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {makeM02ArtPlan,M02_ART_VERSION} from '../../public/official/src/maps-visual/m02/farmland-art.mjs';
import {R6_MAP02_ART} from '../../public/official/src/maps-visual/m02/premium-golden-valley-r6.mjs';
const fs=p=>readFileSync(p,'utf8');
for(const [p,sha] of Object.entries({
 'public/official/data/maps.v5.json':'1da0e20145e1312f3d75443debabea17e3db507c',
 'public/official/data/campaign140.v5.json':'794cf43f9b172a39dd88f02e2a89ea11455064c3',
 'public/official/src/c1d8-b2-playable/scene.mjs':'2c38341e12e100c3c9260d2984e3408e7accc031',
 'public/official/src/c1d8-b2-playable/scene-m02.mjs':'e8aa7c6cb8dc56211669f71219d47591a4ac01a8',
 'public/official/src/core-c1d/m02-combat-world.mjs':'63741749125e7ac455787caae3bd5b3fb7d3b8a0',
 'public/official/src/maps-visual/m02/phaser-world.mjs':'929902d5a0286ec9165524bf3156ac4d67a46db6'
})){
 assert.equal(execFileSync('git',['hash-object',p],{encoding:'utf8'}).trim(),sha,
   'R6 must NEVER change protected gameplay/map file '+p);
}
const raw=JSON.parse(fs('public/official/data/maps.v5.json')).find(m=>m.id===2);
const campaign=JSON.parse(fs('public/official/data/campaign140.v5.json')).maps.find(m=>m.mapId===2);
const plan=makeM02ArtPlan(raw);
assert.equal(plan.path.length,163);assert.equal(plan.pads.length,8);
assert.equal(raw.gold,395);assert.equal(raw.branches.length,0);
assert.equal(campaign.waves.length,7);
assert.deepEqual(campaign.waves.map(w=>w.groups.reduce((n,g)=>n+g.count,0)),[7,9,7,11,15,11,20]);
assert.equal(plan.landmarks.find(l=>l.kind==='mill')?.x,505);
assert.equal(plan.landmarks.find(l=>l.kind==='farm')?.x,1180);
assert.equal(M02_ART_VERSION,'r6-m02-golden-valley-v1');
assert.equal(R6_MAP02_ART,'r6-m02-golden-valley-paint-v1');
const premium=fs('public/official/src/maps-visual/m02/premium-golden-valley-r6.mjs');
const art=fs('public/official/src/maps-visual/m02/farmland-art.mjs');
const live=fs('public/official/src/live/index.html');
for(const landmark of ['hills(ctx)','river(ctx)','wheat(ctx,plan)','wheatFences(ctx)',
 'distributeWoodland(ctx,plan)','road(ctx,plan)','bridge(ctx)',
 'scenicFootbridge(ctx,348','scenicFootbridge(ctx,1095',
 'mill(ctx,l.x,l.y)','farmhouse(ctx,l.x,l.y)','pads(ctx,plan)','flowers(ctx,plan)']){
 assert(premium.includes(landmark),'R6 missing director art requirement '+landmark);
}
assert(art.includes('return paintPremiumM02(ctx,plan,{density})'),
 'M02 gameplay renderer must actually use premium art');
assert(live.includes('r6=golden-valley-art-v1'),'M02 art cache invalidation required');
assert(live.includes('scene.mjs?release=u07-hd-gallery-live-v1'),'M01 must remain selectable');
assert(live.includes('mapPickerButton'),'Map picker preserved');
console.log('PASS_R6_MAP02_GOLDEN_VALLEY_ART_163_PATH_8_PADS_7_WAVES_SOURCE_LOCK');
