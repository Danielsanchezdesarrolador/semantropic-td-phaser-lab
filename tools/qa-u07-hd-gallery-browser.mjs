/** U07 — Real Chromium WebGL2 QA of LIVE modal/HD art, mobile landscape.
 * View-only legacy towers: this test does not imply combat for missing families.
 */
import {createServer} from 'node:http';
import {readFile,stat,mkdir} from 'node:fs/promises';
import {resolve,join,extname,sep} from 'node:path';
import {chromium} from 'playwright';
const root=resolve('dist'),out='artifacts/u07-hd-gallery-browser';
await mkdir(out,{recursive:true});
const mime={'.html':'text/html;charset=utf-8','.mjs':'text/javascript;charset=utf-8',
 '.js':'text/javascript;charset=utf-8','.css':'text/css','.svg':'image/svg+xml',
 '.png':'image/png','.json':'application/json'};
const server=createServer(async(req,res)=>{try{
 const p=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
 if(p!==root&&!p.startsWith(root+sep))throw Error('unsafe path');
 const file=(await stat(p)).isDirectory()?join(p,'index.html'):p;
 res.writeHead(200,{'Content-Type':mime[extname(file)]??'application/octet-stream'});
 res.end(await readFile(file));
}catch(e){res.writeHead(404);res.end(String(e))}});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
let browser;const cases=[];
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader',
  '--enable-webgl','--enable-unsafe-swiftshader']});
 for(const [name,width,height] of [['desktop',1280,768],['android844',844,390],['android932',932,430]]){
  const page=await browser.newPage({viewport:{width,height},isMobile:width<1000,hasTouch:width<1000});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto('http://127.0.0.1:'+server.address().port+
   (process.env.SEMANTROPIC_PLAYTEST_PATH||'/official/src/live/'),{waitUntil:'load',timeout:30000});
  if(response?.status()!==200)throw Error('LIVE GET failed '+response?.status());
  await page.waitForFunction(()=>!!window.__SEMANTROPIC_C1D7?.scene&&!!window.__SEMANTROPIC_HD_GALLERY,
    null,{timeout:45000});
  const baseline=await page.evaluate(()=>{
   const a=window.__SEMANTROPIC_C1D7;
   if(!(a.scene.game.renderer.gl instanceof WebGL2RenderingContext))throw Error('WebGL2 missing');
   if(a.world.paused||a.world.ended||a.world.economy.gold!==365)throw Error('Unexpected baseline');
   return {gold:a.world.economy.gold,towers:a.world.economy.towers.size,
    paused:a.world.paused};
  });
  await page.locator('#towerHDGalleryButton').click();
  await page.waitForFunction(()=>window.__SEMANTROPIC_HD_GALLERY.processed.size===3,
   null,{timeout:45000});
  const details=await page.evaluate(()=>{
   const modal=document.getElementById('towerHDGallery');
   if(modal.hidden||modal.getAttribute('aria-modal')!=='true')throw Error('Dialog is not accessible');
   if(!window.__SEMANTROPIC_C1D7.world.paused)throw Error('Gallery did not pause game');
   const previews=window.__SEMANTROPIC_HD_GALLERY.processed;
   const rows=[...previews.entries()].map(([key,v])=>({key,source:[v.sourceWidth,v.sourceHeight],
    hd:[v.width,v.height],density:v.density}));
   if(rows.some(r=>Math.abs(r.density-3)>1e-8))throw Error('Not 3x legacy PNG');
   if(modal.querySelectorAll('.tower-hd-card').length!==3||
    modal.querySelectorAll('.tower-hd-card img').length!==3||
    modal.querySelectorAll('.tower-hd-card canvas').length!==3)throw Error('Missing before/after canvases');
   const economics=window.__SEMANTROPIC_C1D7.world.economy;
   if(economics.towers.size!==0||economics.gold!==365)throw Error('Artwork gallery mutated economy');
   const sizes=rows.map(r=>r.hd);
   return {rows,sizes,paused:true,notBuildable:true};
  });
  await page.locator('#towerHDZoom').fill('200');
  await page.locator('#towerHDZoom').dispatchEvent('input');
  await page.waitForFunction(()=>document.getElementById('towerHDZoomValue').textContent==='200%');
  await page.screenshot({path:out+'/'+name+'-U07-torres-HD.png',fullPage:true});
  await page.locator('#towerHDGalleryClose').click();
  const after=await page.evaluate(()=>({
   modalHidden:document.getElementById('towerHDGallery').hidden,
   paused:window.__SEMANTROPIC_C1D7.world.paused,
   gold:window.__SEMANTROPIC_C1D7.world.economy.gold,
   towerCount:window.__SEMANTROPIC_C1D7.world.economy.towers.size
  }));
  if(!after.modalHidden||after.paused||after.gold!==baseline.gold||after.towerCount!==baseline.towers)
   throw Error('Gallery close failed to restore live game');
  if(errors.length)throw Error('JS errors: '+errors.join(' | '));
  cases.push({viewport:name,width,height,baseline,details,after});
  await page.close();
 }
 console.log(JSON.stringify({status:'PASS_U07_HD_GALLERY_LIVE_THREE_VIEWPORTS',
  cases,artApproval:'PENDING_DIRECTOR',playableTowers:['infantry','sniper'],
  previewOnly:['guardian','artillery','control']},null,2));
}catch(error){console.error('FAIL_U07_HD_GALLERY',error.stack||String(error));process.exitCode=1}
finally{await browser?.close();await new Promise(ok=>server.close(ok))}
