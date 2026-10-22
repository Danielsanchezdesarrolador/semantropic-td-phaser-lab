/** R4 visual mobile/desktop QA: screenshot the SAME live game 1+2, fit,
 * safe-area, responsive controls, fullscreen gesture and mobile touch.
 * Chromium emulation is not a physical Android/iOS device.
 */
import {createServer} from 'node:http';
import {readFile,stat,mkdir} from 'node:fs/promises';
import {resolve,join,extname,sep} from 'node:path';
import {chromium} from 'playwright';
const root=resolve('dist'),out='artifacts/r4-responsive-viewport-browser';
await mkdir(out,{recursive:true});
const types={'.html':'text/html;charset=utf-8','.mjs':'text/javascript;charset=utf-8',
 '.js':'text/javascript;charset=utf-8','.svg':'image/svg+xml','.png':'image/png',
 '.json':'application/json','.css':'text/css'};
const server=createServer(async(req,res)=>{try{
 const path=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
 if(path!==root&&!path.startsWith(root+sep))throw Error('untrusted path');
 const file=(await stat(path)).isDirectory()?join(path,'index.html'):path;
 res.writeHead(200,{'Content-Type':types[extname(file)]??'application/octet-stream'});
 res.end(await readFile(file));
}catch(error){res.writeHead(404);res.end(String(error))}});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
let browser;const cases=[];
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader',
  '--enable-webgl','--enable-unsafe-swiftshader']});
 const origin='http://127.0.0.1:'+server.address().port+'/official/src/live/';
 const profiles=[['desktop1920',1920,1080],['desktop1280',1280,768],
  ['android932',932,430],['android844',844,390],['android667',667,375],
  ['portrait390',390,844]];
 for(const [profile,width,height] of profiles){
  const mobile=width<1000,portrait=width<height;
  const page=await browser.newPage({viewport:{width,height},
   isMobile:mobile,hasTouch:mobile,deviceScaleFactor:mobile?2:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(origin,{waitUntil:'load',timeout:30000});
  if(response?.status()!==200)throw Error(profile+' LIVE not HTTP 200');
  await page.waitForFunction(()=>!!window.__SEMANTROPIC_C1D7?.scene
   &&!!window.__SEMANTROPIC_VIEWPORT,null,{timeout:50000});
  await page.waitForFunction(()=>document.getElementById('viewportBackdrop')?.dataset?.ready==='true',null,{timeout:20000});
  const snap=await page.evaluate(()=>{
   const g=window.__SEMANTROPIC_C1D7,app=document.getElementById('app'),
    canvas=g.scene.game.canvas,stage=document.getElementById('stage'),
    header=document.getElementById('hud'),
    actions=document.getElementById('hudControls'),
    backdrop=document.getElementById('viewportBackdrop');
   const size=e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,
    top:r.top,bottom:r.bottom,width:r.width,height:r.height}};
   if(!(g.scene.game.renderer.gl instanceof WebGL2RenderingContext))throw Error('no WebGL2');
   const a=size(app),s=size(stage),c=size(canvas),h=size(header),buttons=size(actions),
    bg=size(backdrop),painted=window.__SEMANTROPIC_VIEWPORT.panorama;
   if(!painted?.painted||painted.mapId!==g.world.map.id)
    throw Error('R5 real original map edge rendering unavailable');
   if(Math.abs(bg.width-s.width)>2||Math.abs(bg.height-s.height)>2)
    throw Error('R5 edge backdrop does not fill full viewport');
   // The stage's two dark gutters must be painted with source art even while
   // the central Phaser FIT viewport remains uncut.
   const ctx=backdrop.getContext('2d'),factorX=backdrop.width/bg.width,
    factorY=backdrop.height/bg.height;
   for(const [side,gap,sampleX] of [
    ['left',c.left-s.left,(c.left-s.left)*.5],
    ['right',s.right-c.right,s.width-(s.right-c.right)*.5]]){
    if(gap<12)continue;
    const pix=ctx.getImageData(Math.max(0,Math.min(backdrop.width-1,Math.floor(sampleX*factorX))),
     Math.floor(backdrop.height/2),1,1).data;
    const stageDark=[0x18,0x3b,0x37];
    if(pix.every((v,i)=>i===3||Math.abs(v-stageDark[i])<2))
     throw Error('Unpainted '+side+' pillarbox '+JSON.stringify([...pix]));
   }
   if(c.left<s.left-2||c.right>s.right+2||c.top<s.top-2||c.bottom>s.bottom+2)
    throw Error('Game clipped outside stage despite Phaser FIT '+JSON.stringify({c,s}));
   if(Math.abs(c.width/c.height-1280/768)>.035)
    throw Error('Game aspect ratio distorted '+JSON.stringify(c));
   if(document.documentElement.scrollWidth>window.innerWidth+2)
    throw Error('Horizontal overflow');
   if(window.innerWidth>window.innerHeight && h.right>buttons.left+4
     && h.top<buttons.bottom && buttons.top<h.bottom)
    throw Error('HUD and controls overlap '+JSON.stringify({h,buttons}));
   return {app:a,stage:s,canvas:c,header:h,controls:buttons,
    mapId:g.world.map.id,wave:g.world.wave,pads:g.scene.mapView.plan.sockets.length,
    panorama:painted,
    fullscreenSupported:window.__SEMANTROPIC_VIEWPORT.supported,
    portraitVisible:getComputedStyle(document.getElementById('portrait')).display!=='none'};
  });
  if(snap.mapId!==1||snap.pads!==8)throw Error('M01 changed unexpectedly '+profile);
  if(snap.portraitVisible!==portrait)throw Error('Portrait policy incorrect '+profile);
  if(portrait){
   if(!await page.locator('#portraitFullscreen').isVisible())
    throw Error('Portrait fullscreen CTA unavailable');
   await page.screenshot({path:out+'/'+profile+'-rotation-guide.png',fullPage:true});
  }else{
   if(!await page.locator('#fullscreenButton').isVisible())
    throw Error('Fullscreen action missing '+profile);
   // The renderer's FIT bounds are checked before and after selection.
   if(profile==='desktop1280'){
    await page.locator('#fullscreenButton').click();
    const entered=await page.evaluate(()=>document.fullscreenElement?.id==='app');
    if(entered){
     if(await page.locator('#fullscreenButton').getAttribute('aria-pressed')!=='true')
      throw Error('Fullscreen pressed state out of sync');
     await page.screenshot({path:out+'/'+profile+'-fullscreen.png'});
     await page.locator('#fullscreenButton').click();
     if(await page.evaluate(()=>!!document.fullscreenElement))
      throw Error('Fullscreen exit did not work');
    }else if(await page.locator('#viewportStatus').isHidden()){
     throw Error('Fullscreen failed with no user-facing feedback');
    }
   }
   await page.screenshot({path:out+'/'+profile+'-M01-FIT.png',fullPage:true});
   await page.locator('#mapPickerButton').click();
   await page.locator('#mapPicker [data-map-target="2"]').click();
   await page.waitForFunction(()=>window.__SEMANTROPIC_C1D7?.world?.map?.id===2,
    null,{timeout:50000});
   await page.waitForFunction(()=>window.__SEMANTROPIC_VIEWPORT.panorama?.mapId===2
    &&document.getElementById('viewportBackdrop')?.dataset?.map==='2',
    null,{timeout:20000});
   const map02=await page.evaluate(()=>{
    const g=window.__SEMANTROPIC_C1D7;
    if(g.world.route.points.length!==163||g.economy.gold!==395)
     throw Error('M02 changed gameplay state');
    const stage=document.getElementById('stage').getBoundingClientRect(),
     canvas=g.scene.game.canvas.getBoundingClientRect();
    if(canvas.left<stage.left-2||canvas.right>stage.right+2
     ||canvas.top<stage.top-2||canvas.bottom>stage.bottom+2)
     throw Error('M02 clips from viewport');
    if(window.__SEMANTROPIC_VIEWPORT.panorama?.sourceCount!==1)
     throw Error('M02 original farmland panorama texture missing');
    return {mapId:g.world.map.id,route:g.world.route.points.length,
     gold:g.economy.gold,canvasW:canvas.width,canvasH:canvas.height};
   });
   await page.screenshot({path:out+'/'+profile+'-M02-FIT.png',fullPage:true});
   // Verify picker can return to default M01 without changing original game.
   await page.locator('#mapPickerButton').click();
   await page.locator('#mapPicker [data-map-target="1"]').click();
   await page.waitForFunction(()=>window.__SEMANTROPIC_C1D7?.world?.map?.id===1,
    null,{timeout:50000});
   snap.map02=map02;snap.returnedM01=true;
  }
  if(errors.length)throw Error(profile+' JS errors: '+errors.join(' | '));
  cases.push({profile,width,height,...snap});
  await page.close();
 }
 console.log(JSON.stringify({status:'PASS_R5_FULL_BLEED_BACKGROUND_FIT_MOBILE_PC_TWO_MAPS',cases,
  physicalAndroid:'NOT_RUN',physicalIOS:'NOT_RUN',
  userFullScreenAvailability:'browser-dependent'},null,2));
}catch(error){console.error('FAIL_R4_VIEWPORT_BROWSER',error.stack||String(error));process.exitCode=1}
finally{await browser?.close();await new Promise(ok=>server.close(ok))}
