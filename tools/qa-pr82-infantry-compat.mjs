/** Differential replay against the exact pre-M07 infantry implementation. */
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {withCampaignInfantry} from '../public/official/src/core-c1d/campaign-infantry-combat.mjs';
import {CampaignCombatWorld} from '../public/official/src/core-c1d/campaign-combat-world.mjs';
const dir=new URL('../public/official/src/core-c1d/',import.meta.url);
let source=execFileSync('git',['show','8a8a3c44d976acc9a81ff8a74da5083da572ff1a:public/official/src/core-c1d/campaign-infantry-combat.mjs'],{encoding:'utf8'});
source=source.replace(/from\s*(['"])(\.[^'"]+)\1/g,(_,q,p)=>'from '+JSON.stringify(new URL(p,dir).href));
const old=(await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'))).withCampaignInfantry;
const maps=JSON.parse(readFileSync('public/official/data/maps.v5.json')),campaigns=JSON.parse(readFileSync('public/official/data/campaign140.v5.json')).maps;
for(const id of [3,4,5]){
 const rules=(await import(new URL(`m0${id}-campaign.mjs`,dir)))[`M0${id}_RULES`];assert(rules);assert(!rules.infantryV5Cadence&&!rules.pickInfantryTarget);
 // Replay canonical single-route campaigns; M06 has a separate full dual-route regression.
 const campaign=structuredClone(campaigns.find(c=>c.mapId===id));
 const args=[maps.find(m=>m.id===id),campaign,{rules}],a=new (old(CampaignCombatWorld))(...args),b=new (withCampaignInfantry(CampaignCombatWorld))(...args);
 for(const w of [a,b]){w.economy.build(0,'infantry');w.economy.upgrade(0);w.startWave();}
 let events=0;
 for(let i=0;i<1800;i++){const x=a.tick(.05),y=b.tick(.05);assert.deepEqual(y,x,`M${id} event tick${i}`);events+=x.length;assert.deepEqual(b.snapshot,a.snapshot);assert.deepEqual(b.soldiers,a.soldiers);}
 assert(events>0);console.log(`PASS_PR82_M${id}_INFANTRY_IDENTICAL_1800_TICKS`);
}
