/** P08 screenshot test for a developer-hosted local build. NOT_RUN until executed.
 * Set P08_REVIEW_URL to the served P08 gallery (same code checkout).
 * npx playwright install chromium; node public/official/src/actors-visual/p08/qa-p08-browser.mjs
 */
import {chromium} from 'playwright';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const url=process.env.P08_REVIEW_URL;
if(!url||!url.startsWith('http://127.0.0.1:'))throw Error('Set local P08_REVIEW_URL first');
const dir='docs/art/actors/evidencias/P08';
await mkdir(dir,{recursive:true});
const browser=await chromium.launch({headless:true});
const result={status:'NOT_RUN',screenshots:[],layout:[],failures:[],androidPhysical:'NOT_RUN',gameplay:'NOT_RUN',scope:'P08 art showroom only; no C1-D7 combat'};
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
  // B1: validate the actual Phaser text widths and card geometry after preload.
  const layout=await page.evaluate(()=>{
   const s=window.__SEMANTROPIC_P08.scene;
   const veterans=s.views.filter(v=>v.item.id==='infantry_veteran');
   if(veterans.length!==2)throw Error('Missing two veteran visual instances');
   const [a,b]=veterans;
   const panelsGap=(b.sprite.x-b.panelWidth/2)-(a.sprite.x+a.panelWidth/2);
   const titlesGap=(b.title.x-b.title.displayWidth/2)-(a.title.x+a.title.displayWidth/2);
   const labelsDistinct=a.title.text!==b.title.text;
   return {cards:2,panelsGap,titlesGap,labelsDistinct,
     titleWidths:[a.title.displayWidth,b.title.displayWidth],
     labels:[a.title.text,b.title.text],internalScale:s.game.scale.displaySize.width/s.game.scale.gameSize.width};
  });
  if(layout.panelsGap<8||layout.titlesGap<8||!layout.labelsDistinct)
   throw Error('P08-B1 VETERAN OVERLAP '+w+'x'+h+' '+JSON.stringify(layout));
  result.layout.push({viewport:w+'x'+h,source:'actual Phaser text displayWidth + card positions',...layout});
  for(const state of ['idle','attackWindup','attack']){
   await page.locator('[data-state="'+state+'"]').click();await page.waitForTimeout(100);
   const file='P08-'+w+'x'+h+'-'+state+'.png';
   await page.screenshot({path:dir+'/'+file});
   const actualPNG=await readFile(dir+'/'+file);
   result.screenshots.push({file:dir+'/'+file,source:'actual Chromium WebGL2 P08 art gallery',
    viewport:w+'x'+h,state,bytes:actualPNG.length,
    sha256:createHash('sha256').update(actualPNG).digest('hex')});
  }
  result.failures.push(...errors);await page.close();
 }
 result.status=result.failures.length?'FAIL_WEBGL2':'PASS_WEBGL2';
}catch(e){result.status='FAIL_WEBGL2';result.failures.push(String(e));process.exitCode=1;
}finally{await browser.close();await writeFile(dir+'/qa-p08-browser-result.json',JSON.stringify(result,null,2));}
console.log(JSON.stringify(result,null,2));
