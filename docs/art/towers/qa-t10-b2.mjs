/** Run from real repo checkout: node docs/art/towers/qa-t10-b2.mjs
 * NOT a Chromium screenshot validation.
 */
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {TOWER_ART_V2,projectSourceAnchor} from '../../../public/official/src/towers-visual/catalog.mjs';
import {T10_SNIPER_MUZZLES,validateT10Muzzle,projectT10MuzzleWorld,diagnoseT10Muzzle} from '../../../public/official/src/towers-visual/t10/sniper-muzzle-contract.mjs';
for(const level of [1,2]){
 const m=TOWER_ART_V2.find(x=>x.family==='sniper'&&x.level===level),r=T10_SNIPER_MUZZLES[level];
 assert.equal(validateT10Muzzle(m),r);
 const svg=await readFile(r.file,'utf8');
 assert.ok(svg.includes('viewBox="0 0 360 420"')&&svg.includes('id="'+r.group+'"')&&svg.includes('d="'+r.path+'"'));
 assert.equal(execFileSync('git',['hash-object',r.file],{encoding:'utf8'}).trim(),r.blob);
 assert.equal(r.sourcePoint.x,(r.face.upper.x+r.face.lower.x)/2);
 assert.equal(r.sourcePoint.y,(r.face.upper.y+r.face.lower.y)/2);
 for(const origin of [{x:155,y:230},{x:1130,y:350},{x:410,y:525}]){
  const s={...origin,scaleX:m.worldScaleProposal,scaleY:m.worldScaleProposal,rotation:0,flipX:false,flipY:false};
  const world=projectT10MuzzleWorld(s,m),k=m.worldScaleProposal;
  assert.ok(Math.hypot(world.x-s.x-(r.sourcePoint.x-180)*k,world.y-s.y-(r.sourcePoint.y-390.6)*k)<1e-7);
  assert.deepEqual(world,projectSourceAnchor(s,{...m,muzzleLocal:r.sourcePoint},'muzzleLocal'));
  const d=diagnoseT10Muzzle(s,m);
  for(const [w,h] of [[1280,768],[844,390],[932,430]]){
   const fit=Math.min(w/1280,h/768);
   assert.ok(d.worldDelta*fit<6,'metadata delta alone cannot explain >6px');
  }
  for(const zoom of [.8,1.35]){
   const sc={...s,scaleX:k*zoom,scaleY:k*zoom},pos=projectT10MuzzleWorld(sc,m);
   assert.ok(Math.hypot(pos.x-sc.x-(r.sourcePoint.x-180)*sc.scaleX,
    pos.y-sc.y-(r.sourcePoint.y-390.6)*sc.scaleY)<1e-7);
  }
 }
 const s={x:700,y:450,scaleX:m.worldScaleProposal,scaleY:m.worldScaleProposal,rotation:Math.PI/4};
 const p=projectT10MuzzleWorld(s,m);
 const dx=(r.sourcePoint.x-180)*s.scaleX,dy=(r.sourcePoint.y-390.6)*s.scaleY;
 assert.ok(Math.hypot(p.x-s.x-dx*Math.cos(s.rotation)+dy*Math.sin(s.rotation),
  p.y-s.y-dx*Math.sin(s.rotation)-dy*Math.cos(s.rotation))<1e-7);
 assert.throws(()=>validateT10Muzzle({...m,footAnchor:{x:.5,y:.5}}));
}
console.log('PASS T10-B2 original 2 T04 rifle faces, blob hashes, 3 sockets, 3 FIT sizes, scaling/rotation.');
console.log('NOT_RUN: full LIVE Phaser WebGL2 and <=6 CSS px visual screenshots.');
