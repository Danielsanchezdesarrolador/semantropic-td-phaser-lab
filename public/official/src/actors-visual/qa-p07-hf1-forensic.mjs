/** PERSONAJES P07-HF1 — forensic rerun for all four atlases.
 * node public/official/src/actors-visual/qa-p07-hf1-forensic.mjs
 * Reports SHA PNG and independently decompressed RGBA for each actor.
 * EXIT 1 if ANY byte-difference, RGBA mismatch, invalid alpha/border or wrong hash.
 * The main qa-p07.mjs byte-exact assertion remains mandatory.
 */
import {readFileSync} from 'node:fs';
import {buildP07Atlas} from '../../art/actors/p07-png-export.mjs';
import {reportP07Mismatch,readP07Png} from './p07-hf1-png-diagnostics.mjs';
const manifest=JSON.parse(readFileSync(new URL('../../art/actors/P07_MANIFEST.json',import.meta.url),'utf8'));
let failed=0;
const context={node:process.version,v8:process.versions.v8,platform:process.platform,
 arch:process.arch,githubSha:process.env.GITHUB_SHA||null,
 runUrl:process.env.GITHUB_RUN_ID?'https://github.com/'+process.env.GITHUB_REPOSITORY+'/actions/runs/'+process.env.GITHUB_RUN_ID:null};
console.log('[P07-HF1] ENV '+JSON.stringify(context));
for(const asset of manifest.assets){
 try{
  const file=asset.file.split('/').at(-1);
  const original=readFileSync(new URL('../../art/actors/p07/png/'+file,import.meta.url));
  const rerender=buildP07Atlas(asset.canonicalId);
  const info=reportP07Mismatch(original,rerender.png,asset.canonicalId);
  const stored=readP07Png(original);
  const expectedGood=info.classification==='BYTE_IDENTICAL'&&
   info.stored.pngSha256===asset.sha256&&
   info.regenerated.pngSha256===asset.sha256&&
   info.stored.rgbaSha256===asset.rgbaSha256&&
   info.regenerated.rgbaSha256===asset.rgbaSha256&&
   rerender.rgbaSha256===asset.rgbaSha256&&
   stored.summary.alphaBorderContacts===0&&stored.summary.emptyFrames===0&&
   stored.summary.transparentNonzeroRgbPixels===0;
  console.log('[P07-HF1] '+(expectedGood?'PASS_NODE':'FAIL_NODE')+' '+JSON.stringify(info));
  if(!expectedGood)failed++;
 }catch(e){failed++;console.error('[P07-HF1] EXCEPTION '+asset.canonicalId+' '+(e.stack||e));}
}
console.log('[P07-HF1] '+JSON.stringify({outcome:failed===0?'PASS_NODE':'FAIL_NODE',actors:manifest.assets.length,failed}));
if(failed)process.exitCode=1;
