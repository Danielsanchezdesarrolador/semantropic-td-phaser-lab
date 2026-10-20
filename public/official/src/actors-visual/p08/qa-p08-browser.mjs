/** P08 screenshot test for a developer-hosted local build. NOT_RUN until executed.
 * Set P08_REVIEW_URL to the served P08 gallery (same code checkout).
 * npx playwright install chromium; node public/official/src/actors-visual/p08/qa-p08-browser.mjs
 */
import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
const url=process.env.P08_REVIEW_URL;
if(!url||!url.startsWith('http://127.0.0.1:'))throw Error('Set local P08_REVIEW_URL first');
const dir='docs/art/actors/evidencias/P08';
await mkdir(dir,{recursive:true});
const browser=await chromium.launch({headless:true});
const result={status:'NOT_RUN',screenshots:[],failures:[],androidPhysical:'NOT_RUN',gameplay:'NOT_RUN'};
try{
 for(const [w,h] of [[1280,768],[844,390],[932,430]]){
  const page=await browser.newPage({viewport:{width:w,height:h}});
  const errors=[];page.on('pageerror',err=>errors.push(err.message));
  await page.goto(url,{waitUntil:'load',timeout:30000});
  await page.waitForFunction(()=>!!window.__SEMANTROPIC_P08?.scene);
  const v=await page.evaluate(()=>{
   const s=window.__SEMANTROPIC_P08.scene;
   return {version:Phaser.VERSION,webgl2:s.game.renderer.gl instanceof WebGL2RenderingContext,
    actors:s.views.length,levels:[s.views.filter(x=>x.item.id==='infantry_recruit').length,
     s.views.filter(x=>x.item.id==='infantry_veteran').length],
    atlasOK:s.views.every(x=>s.textures.get(x.sprite.texture.key).has('blocked-2'))};
  });
  if(v.version!=='4.2.1'||!v.webgl2||v.actors!==5||v.levels.join('/')!=='1/2'||!v.atlasOK)
   throw Error('P08 visual contract FAILED '+JSON.stringify(v));
  for(const state of ['idle','attackWindup','attack']){
   await page.locator('[data-state="'+state+'"]').click();await page.waitForTimeout(100);
   const file='P08-'+w+'x'+h+'-'+state+'.png';
   await page.screenshot({path:dir+'/'+file});
   result.screenshots.push({file:dir+'/'+file,source:'Chromium WebGL2'});
  }
  result.failures.push(...errors);await page.close();
 }
 result.status=result.failures.length?'FAIL_WEBGL2':'PASS_WEBGL2';
}catch(e){result.status='FAIL_WEBGL2';result.failures.push(String(e));process.exitCode=1;
}finally{await browser.close();await writeFile(dir+'/qa-p08-browser-result.json',JSON.stringify(result,null,2));}
console.log(JSON.stringify(result,null,2));
