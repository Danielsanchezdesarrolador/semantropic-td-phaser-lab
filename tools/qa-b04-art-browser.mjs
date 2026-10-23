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
   const painter=await import('../river-art.mjs'),map=(await(await fetch('/official/data/maps.v5.json')).json()).find(m=>m.id===4);
   if(r.version!==painter.B04_ART_VERSION||p.path.length!==262||p.pads.length!==9||r.qa.padsRendered!==9)throw Error('B04 inactive or wrong geometry');
   if(JSON.stringify(p.path)!==JSON.stringify(map.path)||JSON.stringify(p.river)!==JSON.stringify(map.decor.river_path)||JSON.stringify(p.bridges)!==JSON.stringify(map.decor.bridge_centers))throw Error('B04 canonical data changed');
   for(const kind of ['arch','statue','shrine','columns','cascade','oak'])if(!p.props.some(p=>p.kind===kind))throw Error('Missing art kind '+kind);
   for(const prop of p.props)if(!painter.b04PropClearsGeometry(prop,p))throw Error('Scenery encroaches geometry');
   if(r.qa.bridges.length!==2||r.qa.bridges.some((b,i)=>JSON.stringify(b.center)!==JSON.stringify(map.decor.bridge_centers[i])))throw Error('Canonical bridge altered');
   const actual=painter.makeM04ArtCanvas(map,{density:1}).canvas.getContext('2d'),clear=painter.makeM04ArtCanvas(map,{density:1,scenic:true}).canvas.getContext('2d');let routeSamples=0;
   for(let i=1;i<p.path.length;i++){const a=p.path[i-1],b=p.path[i],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);if(!len)continue;const n=Math.ceil(len/8);
    for(let k=0;k<=n;k++)for(const offset of [-18,0,18]){const x=Math.round(a[0]+dx*k/n-dy/len*offset),y=Math.round(a[1]+dy*k/n+dx/len*offset);if(x<0||x>=1280||y<0||y>=768)continue;const v=actual.getImageData(x,y,1,1).data,w=clear.getImageData(x,y,1,1).data;if(v.some((n,j)=>n!==w[j]))throw Error('Road obstruction '+x+','+y);routeSamples++;}}
   const texture=s.textures.get('maps/m04/ancient-river/art-v1').getSourceImage();if(texture.width!==2560||texture.height!==1536||routeSamples<1000)throw Error('Wrong art resolution/coverage');
   const canvas=s.game.canvas.getBoundingClientRect();if(canvas.left< -1||canvas.top< -1||canvas.right>innerWidth+1||canvas.bottom>innerHeight+1||document.documentElement.scrollWidth>innerWidth+1)throw Error('Clipped/scrolling preview');
   return {version:r.version,route:262,paintedPads:9,bridges:r.qa.bridges,props:p.props,rejected:p.rejected,routeSamples,webgl2:true,artOnly:true};
  });
  await page.screenshot({path:out+'/'+profile+'-M04-art.png'});
  if(profile==='desktop'){await page.goto(origin+'/official/src/maps-visual/m04/preview/?baseline=1');await page.waitForFunction(()=>window.__SEMANTROPIC_M04_ART_REVIEW);await page.screenshot({path:out+'/before-canonical-diagram.png'});}
  if(errors.length)throw Error(errors.join(' | '));cases.push({profile,width,height,...result});await page.close();
 }
 const page=await browser.newPage({viewport:{width:1280,height:768}});await page.goto(origin+'/official/src/live/');await page.waitForFunction(()=>window.__SEMANTROPIC_C1D7?.world.map.id===1,null,{timeout:60000});if(await page.locator('[data-map-target="4"]').count())throw Error('Unfinished M04 in gameplay selector');await page.close();
 console.log(JSON.stringify({status:'PASS_B04_ART_REVIEW_WEBGL2',cases,officialM01Smoke:'PASS',m04Gameplay:'NOT_IMPLEMENTED_NOT_TESTED',physicalMobile:'NOT_RUN',artApproval:'PENDING',before:'Canonical diagram only; no prior M04 Phaser art existed'},null,2));
}catch(e){console.error('FAIL_B04_ART_REVIEW',e.stack||String(e));process.exitCode=1}
finally{await browser?.close();await new Promise(ok=>server.close(ok))}
