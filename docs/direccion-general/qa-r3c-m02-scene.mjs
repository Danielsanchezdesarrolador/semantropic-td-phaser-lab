/** R3-C two-map authority / M01 original-art source locks. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {m02Result,m02SaveVictory,m02ReadRecord} from '../../public/official/src/core-c1d/m02-results-phaser.mjs';
const read=p=>readFileSync(p,'utf8');
const protectedFiles={
 'public/official/src/c1d8-b2-playable/scene.mjs':'950c7ce85796932a40b23be421d1e4e9126087c5',
 'public/official/src/core-c1d/m01-combat-world.mjs':'68300432ca2f78446d804ce047adfcded84addb3',
 'public/official/src/core-c1d/m01-infantry-combat-a2.mjs':'c7c812414cf500476fd2e514c15324459da4e491',
 'public/official/src/core-c1d/m01-infantry-combat-a3.mjs':'20d3217b49a2c6901af00b40d5a04922c0a086ba',
 'public/official/src/core-c1d/construction-economy.mjs':'e560ebe497f89a8976a9bd9ba738b654cc84b3cf',
 'public/official/src/maps-visual/m01/m07/renderer-v7.mjs':'ca77f7b27886d373815789087df1044f1a6a2cdf',
 'public/official/art/actors/p03-rig.mjs':'1a4282e1652ff559b92e18f42db465d6bfb8e729'
};
for(const [p,hash] of Object.entries(protectedFiles)){
 assert.equal(execFileSync('git',['hash-object',p],{encoding:'utf8'}).trim(),hash,'R3C M01 original changed '+p);
}
const main=read('public/official/src/live/index.html');
const scene=read('public/official/src/c1d8-b2-playable/scene-m02.mjs');
const picker=read('public/official/src/maps-visual/m02/map-picker.mjs');
const renderer=read('public/official/src/maps-visual/m02/phaser-world.mjs');
const actor=read('public/official/src/actors-visual/m02-enemy-gear.mjs');
assert(main.includes('scene.mjs?release=u07-hd-gallery-live-v1'),'M01 release missing');
assert(main.includes('scene-m02.mjs?release=r3c-m02-real-seven-wave-v1'),'M02 release missing');
assert(main.includes('id="mapPicker" hidden')&&main.includes('id="mapPickerButton"'),'Map selector absent');
assert(picker.includes("u.searchParams.set('map',String(id))"),'Same official pathname map selection absent');
assert(scene.includes('MAP=m.find(x=>x.id===mapId)'),'M02 map source incorrect');
assert(scene.includes('CAMPAIGN=c.maps.find(x=>x.mapId===mapId)'),'M02 campaign source incorrect');
assert(scene.includes('this.mapView=(config.mountWorld??mountM02World)(this,MAP)'),'M02 landscape adapter missing');
assert(scene.includes('saveVictory(storage,result)'),'M02 isolated record missing');
assert(scene.includes('mountM02EnemyGear(this,kind,view,h)'),'Enemy shields/bows art missing');
assert(scene.includes('presentM02Arrow(this,ev)'),'Real enemy archer VFX missing');
assert(scene.includes('s.wave+"/"+waveCount')&&scene.includes('waveCount=config.waveCount??7'),'Seven-wave default HUD missing');
assert(scene.includes('mapId=config.mapId??2')&&scene.includes('config.World??M01CombatWithInfantry'),'M02 default source missing');
assert(scene.includes('saveVictory=config.saveVictory??m02SaveVictory'),'M02 record adapter missing');
assert(renderer.includes('makeM02ArtCanvas(map,{density:2})'),'M02 2x canonical terrain missing');
assert(actor.includes('shieldbearer')&&actor.includes('archer')&&actor.includes('mountM02EnemyGear'),'Missing M02 actor accessories');
const result=m02Result({ended:true,won:true,lives:100,escaped:0,kills:80,wave:7,gold:395,totalSpawns:80});
assert(result&&result.map===2&&result.stars===3&&result.completedWaves===7);
const cache=new Map(),storage={getItem:k=>cache.get(k)||null,setItem:(k,v)=>cache.set(k,v)};
assert(m02SaveVictory(storage,result).written);
assert.equal(m02ReadRecord(storage).map,2);
assert(!cache.has('semantropic_td_phaser_m01_normal_v1'),'Record wrote M01 key');
console.log('PASS_R3C_M02_ISOLATED_MAP_SELECTION_ART_AND_RECORDS');
