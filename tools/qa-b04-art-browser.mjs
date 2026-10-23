/** B04 — Real Chromium/WebGL2 art review; M04 has no gameplay.
 * Standalone art review; M04 gameplay is deliberately absent.
 */
import {createServer} from 'node:http';
import {readFile,stat,mkdir} from 'node:fs/promises';
import {resolve,join,extname,sep} from 'node:path';
import {chromium} from 'playwright';
const root=resolve('dist'),out=process.env.B04_QA_OUT||'artifacts/b04-map-art';
await mkdir(out,{recursive:true});
const mime={'.html':'text/html;charset=utf-8','.mjs':'text/javascript;charset=utf-8',
 '.js':'text/javascript;charset=utf-8','.svg':'image/svg+xml','.png':'image/png',
 '.css':'text/css','.json':'application/json'};
const server=createServer(async(req,res)=>{try{
 const p=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
 if(p!==root&&!p.startsWith(root+sep))throw Error('Unsafe path');
 const file=(await stat(p)).isDirectory()?join(p,'index.html'):p;
 res.writeHead(200,{'Content-Type':mime[extname(file)]??'application/octet-stream'});
 res.end(await readFile(file));
}catch(e){res.writeHead(404);res.end(String(e))}});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
let browser;const cases=[];
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader']});
 const origin='http://127.0.0.1:'+server.address().port;
 for(const [profile,width,height] of [['desktop',1280,768],['touch844',844,390],['touch932',932,430]]){
  const page=await browser.newPage({viewport:{width,height},hasTouch:width<1000,isMobile:width<1000});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(origin+'/official/src/maps-visual/m04/preview/',{waitUntil:'load'});await page.waitForFunction(()=>window.__SEMANTROPIC_M04_ART_REVIEW,null,{timeout:60000});
  const result=await page.evaluate(async()=>{
   const r=window.__SEMANTROPIC_M04_ART_REVIEW,s=r.scene,p=r.plan;
   if(!(s.game.renderer.gl instanceof WebGL2RenderingContext))throw Error('Not WebGL2');
   if(!r.artOnly||r.qa.gameplayImplemented!==false||window.__SEMANTROPIC_C1D7)throw Error('M04 falsely exposed as playable');
   const painter=await import('../hf1/integrated-river.mjs'),map=(await(await fetch('/official/data/maps.v5.json')).json()).find(m=>m.id===4);
   if(r.version!==painter.HF1_ART_VERSION||p.path.length!==262||p.pads.length!==9||r.qa.padsRendered!==9)throw Error('HF1 inactive or geometry changed');
   if(JSON.stringify(p.path)!==JSON.stringify(map.path)||JSON.stringify(p.river)!==JSON.stringify(map.decor.river_path)||JSON.stringify(p.bridges)!==JSON.stringify(map.decor.bridge_centers))throw Error('Canonical data mutated');
   if(r.qa.composition!=='one-integrated-painting'||r.qa.separateScenicLayers!==0||r.qa.minimumAreaRatio<=.2)throw Error('Collage/folded image remains');
   for(const pad of p.pads){const a=r.qa.registrationAnchors.find(a=>a.id==='pad-'+pad.index);if(!a||a.target[0]!==pad.x||a.target[1]!==pad.y)throw Error('Pad art anchor moved');}
   const texture=s.textures.get('maps/m04/ancient-river/art-v1').getSourceImage();if(texture.width!==2560||texture.height!==1536)throw Error('Wrong art resolution');
   const c=texture.getContext('2d');let routeSamples=0,waterHits=0,greenCenters=0;
   for(let i=1;i<p.path.length;i++){const a=p.path[i-1],b=p.path[i],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);if(!len)continue;const n=Math.ceil(len/8);
    for(let k=0;k<=n;k++)for(const offset of [-10,0,10]){const x=Math.round(a[0]+dx*k/n-dy/len*offset),y=Math.round(a[1]+dy*k/n+dx/len*offset);if(x<0||x>=1280||y<0||y>=768)continue;const v=c.getImageData(x*2,y*2,1,1).data;if(v[1]>v[0]*1.12&&v[2]>v[0]*1.04&&v[1]>90)waterHits++;if(offset===0&&v[1]>v[0]*1.08&&v[1]>v[2]*1.12)greenCenters++;routeSamples++;}}
   if(waterHits||greenCenters||routeSamples<1000)throw Error('Registered route not clear '+JSON.stringify({waterHits,greenCenters,routeSamples}));
   for(let x=0;x<1280;x+=8)for(const y of [0,767]){const v=c.getImageData(x*2,y*2,1,1).data;if(v[0]+v[1]+v[2]<3)throw Error('Unpainted frame edge '+JSON.stringify({x,y,pixel:[...v]}));}
   const canvas=s.game.canvas.getBoundingClientRect();if(canvas.left< -1||canvas.top< -1||canvas.right>innerWidth+1||canvas.bottom>innerHeight+1||document.documentElement.scrollWidth>innerWidth+1)throw Error('Clipped/scrolling preview');
   return {version:r.version,route:262,paintedPads:9,bridges:r.qa.bridges,routeSamples,waterHits,greenCenters,minimumAreaRatio:r.qa.minimumAreaRatio,registrationTriangles:r.qa.registrationTriangles,webgl2:true,artOnly:true};
  });
  await page.screenshot({path:out+'/'+profile+'-M04-art.png'});
  if(profile==='desktop'){
   await page.evaluate(()=>{const r=window.__SEMANTROPIC_M04_ART_REVIEW,t=r.scene.textures.get('maps/m04/ancient-river/art-v1'),c=t.getSourceImage().getContext('2d');c.save();c.scale(2,2);c.beginPath();r.plan.path.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.strokeStyle='#ff3344';c.lineWidth=1.5;c.stroke();for(const p of r.plan.pads){c.beginPath();c.arc(p.x,p.y,4,0,Math.PI*2);c.fillStyle='#ff3344';c.fill();}c.restore();t.refresh();});
   await page.screenshot({path:out+'/desktop-canonical-overlay.png'});
  }
  if(errors.length)throw Error(errors.join(' | '));cases.push({profile,width,height,...result});await page.close();
 }
 const page=await browser.newPage({viewport:{width:1280,height:768}});await page.goto(origin+'/official/src/live/');await page.waitForFunction(()=>window.__SEMANTROPIC_C1D7?.world.map.id===1,null,{timeout:60000});if(await page.locator('[data-map-target="4"]').count()!==1)throw Error('M04-GAME-01 selector missing');await page.close();
 console.log(JSON.stringify({status:'PASS_M04_HF1_INTEGRATED_WEBGL2',cases,officialM01Smoke:'PASS',m04Gameplay:'SEPARATE_GAME01_QA_REQUIRED',physicalMobile:'NOT_RUN',artApproval:'PENDING',before:'Published B04 preview at4f460f9; authentic comparison in HF1 documentation'},null,2));
}catch(e){console.error('FAIL_M04_HF1_ART_REVIEW',e.stack||String(e));process.exitCode=1}
finally{await browser?.close();await new Promise(ok=>server.close(ok))}
