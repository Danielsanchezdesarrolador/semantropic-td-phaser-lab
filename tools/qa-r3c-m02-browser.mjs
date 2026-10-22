/** R3-C official LIVE 2-map integration: honest 7-wave CORE + Phaser visuals.
 * Uses Node HTTP static dist, real Chromium WebGL2 and the same /live/ pathname.
 * Kills are accelerated only via the authoritative HP/hit API, not balance QA.
 */
import {createServer} from 'node:http';
import {readFile,stat,mkdir} from 'node:fs/promises';
import {resolve,join,extname,sep} from 'node:path';
import {chromium} from 'playwright';
const root=resolve('dist'),out='artifacts/r3c-m02-browser';
await mkdir(out,{recursive:true});
const mime={'.html':'text/html;charset=utf-8','.mjs':'text/javascript;charset=utf-8',
 '.js':'text/javascript;charset=utf-8','.png':'image/png','.svg':'image/svg+xml',
 '.json':'application/json','.css':'text/css'};
const server=createServer(async(req,res)=>{try{
 const p=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
 if(p!==root&&!p.startsWith(root+sep))throw Error('blocked path');
 const f=(await stat(p)).isDirectory()?join(p,'index.html'):p;
 res.writeHead(200,{'Content-Type':mime[extname(f)]??'application/octet-stream'});
 res.end(await readFile(f));
}catch(e){res.writeHead(404);res.end(String(e))}});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
let browser;const cases=[];
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader',
  '--enable-webgl','--enable-unsafe-swiftshader']});
 for(const [viewport,width,height] of [['desktop',1280,768],['android844',844,390],['android932',932,430]]){
  const page=await browser.newPage({viewport:{width,height},isMobile:width<1000,hasTouch:width<1000});
  const errors=[];page.on('pageerror',e=>errors.push(e.stack||e.message));
  const url='http://127.0.0.1:'+server.address().port+'/official/src/live/';
  const r=await page.goto(url,{waitUntil:'load',timeout:30000});
  if(r?.status()!==200)throw Error('LIVE HTTP unavailable '+r?.status());
  await page.waitForFunction(()=>window.__SEMANTROPIC_C1D7?.world?.map?.id===1,null,{timeout:45000});
  if(!(await page.locator('#mapPickerButton').isVisible()))throw Error('Campaign selector unavailable');
  await page.locator('#mapPickerButton').click();
  if(await page.locator('#mapPicker').isHidden())throw Error('Campaign picker not visible');
  await page.locator('#mapPicker [data-map-target="2"]').click();
  await page.waitForURL('**/official/src/live/?map=2',{timeout:20000});
  await page.waitForFunction(()=>window.__SEMANTROPIC_C1D7?.world?.map?.id===2,null,{timeout:45000});
  const initial=await page.evaluate(()=>{
   const g=window.__SEMANTROPIC_C1D7,w=g.world,s=g.scene;
   if(!(s.game.renderer.gl instanceof WebGL2RenderingContext))throw Error('M02 not Phaser WebGL2');
   if(g.economy.mapId!==2||w.lives!==100||w.economy.gold!==395||
     w.route.points.length!==163||s.mapView.plan.sockets.length!==8)throw Error('M02 source mismatch');
   if(w.campaign.waves.length!==7)throw Error('M02 seven-wave campaign unavailable');
   const tex=s.textures.get('maps/m02/farmland/r3-b2').getSourceImage();
   if(tex.width!==2560||tex.height!==1536)throw Error('M02 original map not rasterized at 2x');
   if(!g.economy.build(0,'infantry').ok)throw Error('M02 Infantry I cannot be built');
   w.syncTowers();s.drawTowers();s.drawSoldiers();
   if(!g.economy.getTower(0)||g.economy.gold!==300)throw Error('M02 real building economy');
   if(w.soldiers.length!==1)throw Error('M02 recruited infantry absent');
   return {mapId:w.map.id,gold:g.economy.gold,source:[tex.width,tex.height],
    route:w.route.points.length,sockets:s.mapView.plan.sockets.length,
    soldiers:w.soldiers.length,availableFamilies:Object.keys(g.economy.catalog())};
  });
  await page.screenshot({path:out+'/'+viewport+'-m02-infantry.png',fullPage:true});
  const seven=await page.evaluate(()=>{
   const g=window.__SEMANTROPIC_C1D7,w=g.world,s=g.scene;
   const seen=new Set();let firstArcher=false,firstShield=false;
   for(let wave=1;wave<=7;wave++){
    if(!w.startWave())throw Error('M02 failed to start wave '+wave);
    let steps=0;
    while(!w.finishedWaves.has(wave)&&!w.ended){
     w.tick(.1);
     if(w.enemies.size){
      s.drawEnemies();
      for(const e of [...w.enemies.values()]){
       seen.add(e.type);
       const view=s.enemyViews.get(e.id);
       if(['archer','shieldbearer'].includes(e.type)){
        if(!view?.gear||view.actorId!==e.type)throw Error('Missing visual identity of '+e.type);
        if(e.type==='archer')firstArcher=true;
        if(e.type==='shieldbearer'){
         firstShield=true;
         if(!view.shieldBar||!(e.shield>0))throw Error('Real shield meter unavailable');
        }
       }
       w.hit(e,500000,'QA-core-kill','QA-real-core');
      }
     }
     if(++steps>5000)throw Error('M02 wave stalled '+wave);
    }
    if(w.wave!==wave||!w.finishedWaves.has(wave))throw Error('M02 wave not cleared '+wave);
   }
   s.drawEnemies();s.drawSoldiers();s.updateHud();
   if(!w.ended||!w.won||w.wave!==7||w.totalSpawns!==80||w.kills!==80||
     w.lives!==100||w.escapedCount!==0||!firstArcher||!firstShield)
    throw Error('M02 seven-wave actual CORE result invalid '+JSON.stringify(w.snapshot));
   return {wave:w.wave,spawns:w.totalSpawns,kills:w.kills,escapes:w.escapedCount,
    lives:w.lives,victory:w.won,types:[...seen].sort(),
    archerVisual:firstArcher,shieldbearerVisual:firstShield,coreKilledViaHit:true};
  });
  await page.waitForFunction(()=>!document.getElementById('results').hidden,null,{timeout:15000});
  if((await page.locator('#resultTitle').textContent()).indexOf('Mapa 02')===-1)
   throw Error('Incorrect M02 result title');
  const saved=await page.evaluate(()=>({
   m02:localStorage.getItem('semantropic_td_phaser_m02_normal_v1'),
   m01:localStorage.getItem('semantropic_td_phaser_m01_normal_v1')
  }));
  if(!saved.m02||saved.m01)throw Error('Record isolation failed');
  await page.screenshot({path:out+'/'+viewport+'-m02-7-olas-victoria.png',fullPage:true});
  await page.locator('#resultRestart').click();
  await page.waitForFunction(()=>window.__SEMANTROPIC_C1D7?.world?.map?.id===2
   &&window.__SEMANTROPIC_C1D7?.world?.wave===0,null,{timeout:45000});
  await page.locator('#mapPickerButton').click();
  await page.locator('#mapPicker [data-map-target="1"]').click();
  await page.waitForURL(url,{timeout:20000});
  await page.waitForFunction(()=>window.__SEMANTROPIC_C1D7?.world?.map?.id===1,null,{timeout:45000});
  if(errors.length)throw Error('JS errors '+errors.join(' | '));
  cases.push({viewport,width,height,initial,seven,
   persistedM02:!!saved.m02,separateM01:!saved.m01,backToM01:true});
  await page.close();
 }
 console.log(JSON.stringify({status:'PASS_R3C_M02_LIVE_SELECTOR_7_WAVES_WEBGL2',
  cases,legacyTowersNotBuildable:['guardian','bomber','control'],
  enemyArtwork:'P08 wardrobe vector adaptation, artistic director approval pending',
  balanceHumanMeasured:false,androidPhysicalMeasured:false},null,2));
}catch(error){console.error('FAIL_R3C_M02_BROWSER',error.stack||String(error));process.exitCode=1}
finally{await browser?.close();await new Promise(ok=>server.close(ok))}
