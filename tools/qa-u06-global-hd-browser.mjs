/** U06 A/B/C/D image fidelity proof on the SAME official Phaser LIVE URL.
 * A: active sniper 3x vector layers, preserved original world footprint and P03 gun.
 * B/C/D: previews from original PNG into independent HD Canvas; NOT buildable M01 towers.
 */
import {createServer} from 'node:http';
import {readFile,stat,mkdir} from 'node:fs/promises';
import {resolve,join,extname,sep} from 'node:path';
import {chromium} from 'playwright';
const root=resolve('dist'),dir='artifacts/u06-global-hd-browser';
await mkdir(dir,{recursive:true});
const mime={'.html':'text/html;charset=utf-8','.js':'text/javascript;charset=utf-8',
 '.mjs':'text/javascript;charset=utf-8','.svg':'image/svg+xml','.json':'application/json',
 '.css':'text/css','.png':'image/png'};
const server=createServer(async(req,res)=>{try{
 const p=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
 if(p!==root&&!p.startsWith(root+sep))throw Error('bad path');
 const f=(await stat(p)).isDirectory()?join(p,'index.html'):p;
 res.writeHead(200,{'Content-Type':mime[extname(f)]??'application/octet-stream'});res.end(await readFile(f));
}catch(e){res.writeHead(404);res.end(String(e))}});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
let browser;const results=[];
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader',
 '--enable-webgl','--enable-unsafe-swiftshader']});
 for(const [label,width,height] of [['desktop',1280,768],['android844',844,390],['android932',932,430]]){
  for(const [level,socket] of [[1,0],[2,2]]){
   const page=await browser.newPage({viewport:{width,height},hasTouch:width<1000,isMobile:width<1000});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   const u='http://127.0.0.1:'+server.address().port+(process.env.SEMANTROPIC_PLAYTEST_PATH||'/official/src/live/');
   const response=await page.goto(u,{waitUntil:'load',timeout:30000});
   if(response?.status()!==200)throw Error('LIVE page HTTP '+response?.status());
   await page.waitForFunction(()=>!!window.__SEMANTROPIC_C1D7?.scene,null,{timeout:45000});
   const data=await page.evaluate(({socket,level})=>{
    const s=window.__SEMANTROPIC_C1D7.scene,w=window.__SEMANTROPIC_C1D7.world;
    if(!(s.game.renderer.gl instanceof WebGL2RenderingContext))throw Error('WebGL2 required');
    if(!w.economy.build(socket,'sniper').ok)throw Error('Sniper I build failed');
    if(level===2&&!w.economy.upgrade(socket).ok)throw Error('Sniper II upgrade failed');
    w.syncTowers();s.drawTowers();
    const t=w.economy.getTower(socket),m=s.towerMounts.get(t.id);
    if(!m||m.operatorAtlas!=='P03_APPROVED'||!m.operatorPrimary)throw Error('Lost original P03 rifle');
    if(m.sprite.width!==1080||m.sprite.height!==1260||m.frontRail.width!==1080)
     throw Error('Sniper 3x vector raster unavailable');
    if(Math.abs(m.sprite.scaleX-m.meta.worldScaleProposal/3)>1e-7)throw Error('3x display scale uncompensated');
    if(Math.abs(m.sprite.displayWidth-m.meta.sourceSize.widthPx*m.meta.worldScaleProposal)>.05)
     throw Error('Sniper world footprint changed');
    const layers=[m.sprite.depth,m.operatorShadow.depth,m.operator.depth,m.frontRail.depth];
    if(layers.some((a,i)=>i>0&&a<=layers[i-1]))throw Error('Operator deck layering regressed');
    const p03=m.operator;
    if(p03.width!==352||p03.height!==416)throw Error('Original 2x P03 actor quality lost');
    return {level,texture:[m.sprite.width,m.sprite.height],scale:m.sprite.scaleX,
     footprint:[m.sprite.displayWidth,m.sprite.displayHeight],operatorAtlas:[p03.width,p03.height],layers};
   },{socket,level});
   await page.screenshot({path:dir+'/'+label+'-sniper-L'+level+'-3x.png',fullPage:true});
   results.push({viewport:label,width,height,...data});if(errors.length)throw Error(errors.join(' | '));
   await page.close();
  }
 }
 // This QA-only DOM overlay runs on the same production page in Chromium.
 // It is never persisted in the game UI and never enables absent combat towers.
 const page=await browser.newPage({viewport:{width:1280,height:900}});
 await page.goto('http://127.0.0.1:'+server.address().port+'/official/src/live/',{waitUntil:'load',timeout:30000});
 const originals=await page.evaluate(async()=>{
  const mod=await import('/official/src/towers-visual/u06/legacy-hd.mjs');
  const records=[];
  const wall=document.createElement('section');
  wall.style.cssText='position:fixed;z-index:999999;inset:0;overflow:auto;background:#162027;color:white;font:15px sans-serif;padding:15px;display:flex;gap:12px';
  document.body.appendChild(wall);
  for(const [name,meta] of Object.entries(mod.U06_LEGACY_TOWER_PRESETS)){
   const img=new Image();img.src=meta.url;await img.decode();
   const hi=mod.enhanceLegacyTowerCanvas(img,{factor:3,sharpness:.21});
   if(hi.sourceWidth!==img.naturalWidth||hi.sourceHeight!==img.naturalHeight
     ||hi.width<hi.sourceWidth*1.8)throw Error('Poorly rescaled preserved art '+name);
   if(Math.abs(mod.legacyHDScale(1,hi)*hi.density-1)>1e-8)throw Error('Footprint contract '+name);
   const card=document.createElement('article');card.style.cssText='flex:1;min-width:0;padding:10px;background:#283d47';
   const title=document.createElement('h3');title.textContent=name+' · fuente y HD '+hi.density.toFixed(2)+'×';
   card.appendChild(title);
   const old=document.createElement('img');old.src=meta.url;old.style.cssText='display:block;height:160px;width:auto;max-width:100%;margin:auto';
   card.appendChild(old);
   hi.canvas.style.cssText='display:block;height:230px;width:auto;max-width:100%;margin:12px auto';
   card.appendChild(hi.canvas);wall.appendChild(card);
   records.push({name,source:[hi.sourceWidth,hi.sourceHeight],hd:[hi.width,hi.height],density:hi.density,originalSourceUnmodified:true});
  }
  return records;
 });
 await page.screenshot({path:dir+'/U06-B-C-D-original-vs-HD-legacy-preview.png',fullPage:true});
 await page.close();
 console.log(JSON.stringify({status:'PASS_U06_GLOBAL_HD_REAL_CHROMIUM',sniperCases:results.length,results,
  legacyPreview:originals,previewOnly:['guardian','artillery','control'],
  buildablePhaserM01:['infantry','sniper'],androidPhysical:'PENDING',visualSignoff:'PENDING'},null,2));
}catch(e){console.error('FAIL_U06_GLOBAL_HD',e.stack||String(e));process.exitCode=1}
finally{await browser?.close();await new Promise(ok=>server.close(ok))}
