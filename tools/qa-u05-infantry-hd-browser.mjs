/** U05 real Chromium WebGL2: Infantry T04 tower I/II HD on three viewports.
 * Original source/key, exact world footprint, money and recruited troops stay intact.
 */
import {createServer} from 'node:http';
import {readFile,stat,mkdir} from 'node:fs/promises';
import {resolve,join,extname,sep} from 'node:path';
import {chromium} from 'playwright';
const root=resolve('dist'),dir='artifacts/u05-infantry-hd-browser';
await mkdir(dir,{recursive:true});
const mime={'.html':'text/html;charset=utf-8','.js':'text/javascript;charset=utf-8',
 '.mjs':'text/javascript;charset=utf-8','.svg':'image/svg+xml','.json':'application/json',
 '.css':'text/css','.png':'image/png'};
const server=createServer(async(req,res)=>{try{
 const p=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
 if(p!==root&&!p.startsWith(root+sep))throw Error('invalid request');
 const f=(await stat(p)).isDirectory()?join(p,'index.html'):p;
 res.writeHead(200,{'Content-Type':mime[extname(f)]??'application/octet-stream'});
 res.end(await readFile(f));
}catch(e){res.writeHead(404);res.end(String(e))}});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
let browser;const results=[];
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader',
 '--enable-webgl','--enable-unsafe-swiftshader']});
 for(const [vp,w,h] of [['desktop',1280,768],['android844',844,390],['android932',932,430]]){
  for(const [level,socket] of [[1,0],[2,2]]){
   const page=await browser.newPage({viewport:{width:w,height:h},isMobile:w<1000,hasTouch:w<1000});
   const errs=[];page.on('pageerror',e=>errs.push(e.message));
   const url='http://127.0.0.1:'+server.address().port+(process.env.SEMANTROPIC_PLAYTEST_PATH||'/official/src/live/');
   const resp=await page.goto(url,{waitUntil:'load',timeout:30000});
   if(resp?.status()!==200)throw Error('HTTP '+resp?.status());
   await page.waitForFunction(()=>!!window.__SEMANTROPIC_C1D7?.scene,null,{timeout:45000});
   const result=await page.evaluate(({socket,level})=>{
    const g=window.__SEMANTROPIC_C1D7,w=g.world,s=g.scene;
    if(!(s.game.renderer.gl instanceof WebGL2RenderingContext))throw Error('WebGL2 unavailable');
    if(w.economy.gold!==365)throw Error('baseline gold');
    if(!w.economy.build(socket,'infantry').ok)throw Error('build failed');
    if(level===2&&!w.economy.upgrade(socket).ok)throw Error('upgrade failed');
    w.syncTowers();s.drawTowers();s.drawSoldiers();
    const t=w.economy.getTower(socket),m=s.towerMounts.get(t.id),a=m?.meta,sp=m?.sprite;
    if(a?.family!=='infantry'||a.level!==level)throw Error('wrong tower level');
    if(sp.texture.key!=='towers/infantry/level-'+level)throw Error('source alias changed');
    if(sp.width!==720||sp.height!==840)throw Error('texture not rasterized at 2x');
    if(Math.abs(sp.scaleX-a.worldScaleProposal/2)>.00001)throw Error('scale was not compensated');
    if(Math.abs(sp.displayWidth-a.sourceSize.widthPx*a.worldScaleProposal)>.05
     ||Math.abs(sp.displayHeight-a.sourceSize.heightPx*a.worldScaleProposal)>.05)
     throw Error('world footprint changed');
    if(Math.abs(sp.x-s.mapView.plan.sockets[socket].world.x)>.00001
      ||Math.abs(sp.y-s.mapView.plan.sockets[socket].world.y)>.00001)
      throw Error('infantry tower pad changed');
    if(m.operator||m.frontRail||m.operatorPrimary)throw Error('Sniper-only operator leaked into infantry');
    if(w.economy.gold!==(level===1?270:135)||w.soldiers.length!==(level===1?1:2))
      throw Error('economy/soldiers changed');
    for(const l of [1,2]){
      const tex=s.textures.get('towers/infantry/level-'+l).getSourceImage();
      if(tex.width!==720||tex.height!==840)throw Error('preloaded source not 2x '+l);
    }
    return {level,source:[sp.width,sp.height],display:[sp.displayWidth,sp.displayHeight],
      gold:w.economy.gold,soldiers:w.soldiers.length,key:sp.texture.key};
   },{socket,level});
   await page.waitForTimeout(100);
   await page.screenshot({path:dir+'/'+vp+'-L'+level+'.png',fullPage:true});
   if(errs.length)throw Error(errs.join(' | '));
   results.push({viewport:vp,w,h,...result});await page.close();
  }
 }
 console.log(JSON.stringify({status:'PASS_U05_F3A_INFANTRY_2X_CHROMIUM_WEBGL2',cases:results.length,
  results,androidPhysical:false,visualApproval:'PENDING_DIRECTOR'},null,2));
}catch(e){console.error('FAIL_U05_F3A',e.stack||String(e));process.exitCode=1}
finally{await browser?.close();await new Promise(ok=>server.close(ok))}
