/** MAP-STYLE-01: actual modular Phaser M01, three viewports and brief combat.
 * No accelerated campaign; art-only smoke, real input and CORE attacks. */
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,stat,mkdir,writeFile} from 'node:fs/promises';
import {resolve,join,extname,sep} from 'node:path';
import {chromium} from 'playwright';
const baselineLayout=JSON.parse(await readFile('docs/blocks/m01-fidelity-cartoon01/qa-local.json','utf8')).results[0].initial;
const root=resolve('dist'),out=process.env.STYLE01_QA_OUT||'artifacts/map-style01';await mkdir(out,{recursive:true});
const mime={'.html':'text/html','.mjs':'text/javascript','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.css':'text/css'};
const server=createServer(async(req,res)=>{try{const p=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(p!==root&&!p.startsWith(root+sep))throw Error('invalid path');const f=(await stat(p)).isDirectory()?join(p,'index.html'):p;res.writeHead(200,{'Content-Type':mime[extname(f)]||'application/octet-stream'});res.end(await readFile(f));}catch{res.writeHead(404);res.end();}});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const base='http://127.0.0.1:'+server.address().port+'/official/src/live/';
let browser,lastPage;let step="startup";const results=[];
try{
 browser=await chromium.launch({headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});

 for(const [profile,width,height] of [['desktop',1280,768],['touch844',844,390],['touch932',932,430]]){
  step=profile+' load';console.log('STYLE01 '+profile);
  const page=await browser.newPage({viewport:{width,height},isMobile:width<1000,hasTouch:width<1000,deviceScaleFactor:profile==='touch932'?2:1});const errors=[];lastPage=page;page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);await page.waitForFunction(()=>window.__SEMANTROPIC_C1D7?.scene.mapView.artVersion==='m01-hf-geometry01-cartoon-v1'&&window.__SEMANTROPIC_VIEWPORT?.panorama?.mapId===1,null,{timeout:60000});
  const initial=await page.evaluate(async baseline=>{
   const g=window.__SEMANTROPIC_C1D7,w=g.world,s=g.scene,v=s.mapView;
   if(!(s.game.renderer.gl instanceof WebGL2RenderingContext))throw Error('WebGL2 required');
   if(w.route.points.length!==133||w.economy.gold!==365||w.lives!==100||w.campaign.waves.length!==5||w.campaign.waves.reduce((n,w)=>n+w.groups.reduce((s,g)=>s+g.count,0),0)!==63||v.plan.sockets.length!==8)throw Error('M01 canonical data changed');
   if(JSON.stringify(v.landscapePlan.props.slice(0,baseline.props.length))!==JSON.stringify(baseline.props)||JSON.stringify(v.landscapePlan.formations)!==JSON.stringify(baseline.formations))throw Error('Existing props or relief moved');
   if(v.landscapePlan.props.length!==50||!v.entryObjects?.every(o=>o.visible)||v.premiumArt.roadWidth!==64||v.premiumArt.roadContinuity!=='C2-cubic-B-spline')throw Error('Missing geometry hotfix');
   for(const [i,p]of v.landscapePlan.props.entries())if(i>=baseline.props.length){
    if(p.kind==='oak'||p.kind==='youngOak'){if(p.y+p.h<145)throw Error('Tree not grounded in meadow');}
    for(const a of v.landscapePlan.props.slice(0,i))if(p.x<a.x+a.w+6&&p.x+p.w+6>a.x&&p.y<a.y+a.h+6&&p.y+p.h+6>a.y)throw Error('New decoration overlaps existing prop');
   }
   if(v.premiumArt.propAtlasCount!==1||v.premiumArt.textureDefinition!=='m01-texture-definition-v1')throw Error('Missing texture definition');
   const mod=await import('/official/src/maps-visual/m01/style01/cartoon-world.mjs');
   if(v.premiumArt.composition!=='separate-Phaser-components'||v.styleObjects.filter(o=>o.texture?.key==='maps/m01/style01/pad').length!==8||v.landscapePlan.props.length<20)throw Error('Not a modular component scene');
   const terrain=await import('/official/src/maps-visual/m01/style01/fidelity-terrain.mjs');
   if(v.premiumArt.waterLayer!=='independent-canvas-texture'||v.landscapePlan.formations.length!==7)throw Error('Missing layered terrain');
   for(const p of v.landscapePlan.props)if(!terrain.supportsFoot(p.x+p.w/2,p.y+p.h))throw Error('Prop floats on cliff/water '+p.kind);
   const faces=s.textures.get('maps/m01/style01/cliff-faces').getSourceImage().getContext('2d');
   let clearFaceSamples=0;for(let i=1;i<w.map.path.length;i++){const a=w.map.path[i-1],b=w.map.path[i],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);for(let k=0;k<=len;k+=5)for(const offset of [-35,0,35]){const x=Math.round(a[0]+dx*k/len-dy/len*offset),y=Math.round(a[1]+dy*k/len+dx/len*offset);if(x<0||x>=1280||y<0||y>=768)continue;if(faces.getImageData(x*2,y*2,1,1).data[3]>24)throw Error('Cliff reaches road '+JSON.stringify({x,y,offset}));clearFaceSamples++;}}
   v.__fidelityFaceSamples=clearFaceSamples;
   for(const p of v.landscapePlan.props)if(p.x<4||p.x+p.w>1276||!mod.propClears(p,v.landscapePlan))throw Error('Prop covers route/pad '+p.kind);
   if(JSON.stringify(v.landscapePlan.path)!==JSON.stringify(w.map.path))throw Error('Route moved');
   const road=s.textures.get('maps/m01/style01/route').getSourceImage().getContext('2d');if(road.getImageData(20,20,1,1).data[3]!==0)throw Error('Route texture includes flattened background');
   const geometry=await import('/official/src/maps-visual/m01/style01/road-geometry.mjs'),widths=[];
   for(const segment of geometry.makeRoadSpline(w.map.path))for(const t of [.15,.5,.85]){
    const p=geometry.roadPoint(segment,t),a=geometry.roadPoint(segment,t-.001),b=geometry.roadPoint(segment,t+.001),length=Math.hypot(b[0]-a[0],b[1]-a[1]),normal=[-(b[1]-a[1])/length,(b[0]-a[0])/length];
    if(p[0]<48||p[0]>1232)continue;let lo=null,hi=null;
    for(let d=-40;d<=40;d+=.25){const alpha=road.getImageData(Math.floor((p[0]+normal[0]*d)*2),Math.floor((p[1]+normal[1]*d)*2),1,1).data[3];if(alpha>=128){lo??=d;hi=d;}}
    const measured=hi-lo+.25;if(Math.abs(measured-geometry.ROAD_WIDTH)>1.5)throw Error('Nonuniform road width '+measured);widths.push(measured);
   }
   v.__roadWidthAudit={samples:widths.length,min:Math.min(...widths),max:Math.max(...widths),nominal:geometry.ROAD_WIDTH};
   if(JSON.stringify(v.landscapePlan.entryAccess.canonicalSpawn)!==JSON.stringify(w.map.path[0]))throw Error('Entry/spawn mismatch');
   let samples=0;for(let i=1;i<w.map.path.length;i++){const a=w.map.path[i-1],b=w.map.path[i],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/8);for(let k=0;k<=n;k++){const x=Math.round(a[0]+(b[0]-a[0])*k/n),y=Math.round(a[1]+(b[1]-a[1])*k/n);if(x<0||x>=1280||y<0||y>=768)continue;const p=road.getImageData(x*2,y*2,1,1).data;if(p[3]!==255||p[0]<180||p[1]<130||p[2]>200)throw Error('Route not dry/clear');samples++;}}
   return {roadWidthAudit:v.__roadWidthAudit,entryAccess:v.landscapePlan.entryAccess,snapshot:w.snapshot,composition:v.premiumArt,props:v.landscapePlan.props,rejected:v.landscapePlan.rejected,routeSamples:samples,clearFaceSamples:v.__fidelityFaceSamples,formations:v.landscapePlan.formations,displayObjects:v.styleObjects.length,definition:v.premiumArt.textureDefinition,canvasAudit:{backingWidth:s.game.canvas.width,backingHeight:s.game.canvas.height,cssWidth:s.game.canvas.getBoundingClientRect().width,cssHeight:s.game.canvas.getBoundingClientRect().height,dpr:devicePixelRatio},propSampling:v.landscapePlan.props.map(p=>{const o=v.styleObjects.find(o=>o.frame?.name===p.kind+'/defined/'+Math.ceil(p.w*2)&&o.x===p.x+p.w/2&&o.y===p.footY);const image=o?.frame;if(!image||image.width<Math.ceil(p.w*2)||Math.abs(o.displayWidth-p.w)>.001||Math.abs(o.displayHeight-p.h)>.001)throw Error('Undersized prop '+p.kind);return{kind:p.kind,worldWidth:p.w,textureWidth:image.width,textureHeight:image.height};})};
  },baselineLayout);
  if(profile==='desktop'){
   await page.setViewportSize({width:1917,height:990});
   await page.waitForFunction(()=>window.__SEMANTROPIC_VIEWPORT?.panorama?.width===1917);
   await page.screenshot({path:out+'/wide-after.png'});
   const png=(await page.screenshot()).toString('base64');
   const seams=await page.evaluate(async png=>{
    const image=new Image();image.src='data:image/png;base64,'+png;await image.decode();
    const c=document.createElement('canvas');c.width=image.width;c.height=image.height;const ctx=c.getContext('2d');ctx.drawImage(image,0,0);
    const g=window.__SEMANTROPIC_C1D7,r=g.scene.game.canvas.getBoundingClientRect(),path=g.world.map.path,result=[];
    for(const wx of [0,1280]){let wy;for(let i=1;i<path.length;i++){const a=path[i-1],b=path[i];if(a[0]<=wx&&b[0]>=wx)wy=a[1]+(b[1]-a[1])*(wx-a[0])/(b[0]-a[0]);}
     const sx=r.left+wx/1280*r.width;let maxDelta=0;
     for(const d of [-12,-6,0,6,12]){const y=Math.round(r.top+(wy+d)/768*r.height),a=ctx.getImageData(Math.round(sx)-2,y,1,1).data,b=ctx.getImageData(Math.round(sx)+2,y,1,1).data;for(let k=0;k<3;k++)maxDelta=Math.max(maxDelta,Math.abs(a[k]-b[k]));}
     if(wx===0){
      const entry=g.scene.textures.get('maps/m01/style01/entry-front').getSourceImage(),ref=document.createElement('canvas');ref.width=c.width;ref.height=c.height;const rc=ref.getContext('2d');rc.drawImage(entry,r.left-180/1280*r.width,r.top+215/768*r.height,280/1280*r.width,230/768*r.height);let maxReferenceDelta=0;
      // WebGL bilinear and 2D high-quality minification differ at individual
      // rock texels. Compare corresponding 5x5 color means, not flat-sand pixels.
      const mean=(context,x,y)=>{const a=context.getImageData(x-2,y-2,5,5).data,result=[0,0,0];for(let i=0;i<a.length;i+=4){if(a[i+3]!==255)throw Error('Entry fails to cover artificial cut');for(let k=0;k<3;k++)result[k]+=a[i+k]/25;}return result;};
      for(const d of [-12,-6,0,6,12])for(const side of [-2,2]){const x=Math.round(sx)+side,y=Math.round(r.top+(wy+d)/768*r.height),actual=mean(ctx,x,y),expected=mean(rc,x,y);for(let k=0;k<3;k++)maxReferenceDelta=Math.max(maxReferenceDelta,Math.abs(actual[k]-expected[k]));}
      if(maxReferenceDelta>10)throw Error('Entry/FIT rendering seam '+maxReferenceDelta);result.push({worldX:wx,entryOpaque:true,comparison:'5x5 color mean vs prepared entry texture',maxReferenceDelta});
     }else{if(maxDelta>3)throw Error('Road/FIT seam at '+wx+': '+maxDelta);result.push({worldX:wx,maxRGBDelta:maxDelta});}
    }return result;
   },png);initial.wideSeams=seams;
   await page.setViewportSize({width,height});await page.waitForFunction(()=>window.__SEMANTROPIC_VIEWPORT?.panorama?.width===1280);
  }
  await page.screenshot({path:out+'/'+profile+'-after.png'});
  await page.evaluate(()=>{for(const id of ['hud','hudControls','feedback'])document.getElementById(id).style.visibility='hidden';});
  await page.screenshot({path:out+'/'+profile+'-art-no-hud.png'});
  await page.evaluate(()=>{for(const id of ['hud','hudControls','feedback'])document.getElementById(id).style.visibility='';});
  if(profile==='desktop'){
   step='real fullscreen';await page.locator('#fullscreenButton').click();await page.waitForFunction(()=>Boolean(document.fullscreenElement));
   await page.screenshot({path:out+'/desktop-fullscreen.png'});await page.locator('#fullscreenButton').click();await page.waitForFunction(()=>!document.fullscreenElement);
   await page.waitForFunction(()=>window.__SEMANTROPIC_VIEWPORT?.panorama?.width===1280);initial.fullscreen='PASS_REQUEST_AND_EXIT';
  }

  if(profile==='desktop'){
   step='desktop natural entry sequence';await page.setViewportSize({width:1917,height:990});await page.waitForFunction(()=>window.__SEMANTROPIC_VIEWPORT?.panorama?.width===1917);await page.locator('#waveStart').click();initial.entryFrames=[];
   for(const target of[-8,28,70]){
    await page.waitForFunction(x=>window.__SEMANTROPIC_C1D7.world.actors.some(a=>a.x>=x),target,{timeout:120000});await page.locator('#pause').click();
    const frame=await page.evaluate(()=>{const g=window.__SEMANTROPIC_C1D7,r=g.scene.game.canvas.getBoundingClientRect();return{seconds:g.world.seconds,actors:g.world.actors.map(a=>({id:a.id,x:a.x,y:a.y})),snapshot:g.world.snapshot,clip:{x:r.left-80/1280*r.width,y:r.top+215/768*r.height,width:255/1280*r.width,height:230/768*r.height}};});
    assert.equal(frame.snapshot.kills,0);assert.equal(frame.snapshot.lives,100);assert(frame.actors.some(a=>a.x>=target));await page.screenshot({path:out+'/entry-'+target+'.png',clip:frame.clip});initial.entryFrames.push(frame);if(target!==70)await page.locator('#pause').click();
   }
   // Attack an enemy already beyond the entrance lip, using ordinary UI.
   // This verifies visible combat rather than only an off-screen first kill.
   step='desktop combat beyond entrance';const target=await page.evaluate(()=>window.__SEMANTROPIC_C1D7.world.actors.reduce((a,b)=>a.x>b.x?a:b));assert(target.x>=70);
   await page.evaluate(()=>window.__SEMANTROPIC_C1D7.menu.open(0));await page.locator('[data-t09-id="sniper"]').click();await page.waitForFunction(()=>window.__SEMANTROPIC_C1D7.economy.getTower(0)?.family==='sniper');await page.waitForTimeout(280);await page.evaluate(()=>window.__SEMANTROPIC_C1D7.menu.open(1));await page.locator('[data-t09-id="infantry"]').click();await page.waitForFunction(()=>window.__SEMANTROPIC_C1D7.economy.getTower(1)?.family==='infantry');assert.equal(await page.evaluate(()=>window.__SEMANTROPIC_C1D7.economy.gold),130);
   await page.locator('#pause').click();await page.waitForFunction(id=>{const g=window.__SEMANTROPIC_C1D7;return g.scene.fxFires>0&&g.world.kills>0&&!g.world.enemies.has(id);},target.id,{timeout:120000});await page.locator('#pause').click();initial.visibleEntryCombat=await page.evaluate(target=>({targetBeforeCombat:{id:target.id,x:target.x,y:target.y},snapshot:window.__SEMANTROPIC_C1D7.world.snapshot,fires:window.__SEMANTROPIC_C1D7.scene.fxFires}),target);await page.screenshot({path:out+'/entry-visible-combat.png'});
   await page.setViewportSize({width,height});await page.locator('#restart').click();await page.waitForFunction(()=>window.__SEMANTROPIC_C1D7?.scene.mapView.artVersion==='m01-hf-geometry01-cartoon-v1'&&window.__SEMANTROPIC_C1D7.economy.gold===365,null,{timeout:60000});
  }

  for(let i=0;i<8;i++){step=profile+' pad '+i;
   const p=await page.evaluate(i=>{const g=window.__SEMANTROPIC_C1D7,r=g.scene.game.canvas.getBoundingClientRect(),p=g.economy.getSocket(i);return{x:r.left+p.x/1280*r.width,y:r.top+p.y/768*r.height};},i);
   if(width<1000)await page.touchscreen.tap(p.x,p.y);else await page.mouse.click(p.x,p.y);
   await page.waitForFunction(i=>window.__SEMANTROPIC_C1D7.menu.get().index===i,i,{timeout:5000});{
    await page.waitForTimeout(280); // Respect the existing 250 ms intent debounce.
    await page.locator('[data-t09-id="infantry"]').click();await page.waitForFunction(i=>window.__SEMANTROPIC_C1D7.economy.getTower(i)?.family==='infantry'&&window.__SEMANTROPIC_C1D7.scene.towerMounts.size===1,i);
    await page.evaluate(i=>window.__SEMANTROPIC_C1D7.menu.open(i),i);await page.waitForTimeout(280);await page.locator('[data-t09-id="sell"]').click();await page.waitForFunction(i=>!window.__SEMANTROPIC_C1D7.economy.getTower(i)&&window.__SEMANTROPIC_C1D7.scene.towerMounts.size===0,i);
   }await page.evaluate(()=>window.__SEMANTROPIC_C1D7.menu.close());
  }
  assert.equal(await page.evaluate(()=>window.__SEMANTROPIC_C1D7.economy.gold),93);
  await page.locator('#restart').click();await page.waitForFunction(()=>window.__SEMANTROPIC_C1D7?.scene.mapView.artVersion==='m01-hf-geometry01-cartoon-v1'&&window.__SEMANTROPIC_C1D7.economy.gold===365,null,{timeout:60000});
  // Put the sniper near the entrance: this smoke checks a real shot/kill, not
  // software-renderer wall time spent waiting for enemies to reach distant pad 1.
  step=profile+' buy sniper';await page.evaluate(()=>window.__SEMANTROPIC_C1D7.menu.open(0));await page.locator('[data-t09-id="sniper"]').click();await page.waitForFunction(()=>window.__SEMANTROPIC_C1D7.economy.getTower(0)?.family==='sniper');
  step=profile+' buy infantry';await page.waitForTimeout(280);await page.evaluate(()=>window.__SEMANTROPIC_C1D7.menu.open(1));await page.locator('[data-t09-id="infantry"]').click();await page.waitForFunction(()=>window.__SEMANTROPIC_C1D7.economy.getTower(1)?.family==='infantry');
  assert.equal(await page.evaluate(()=>window.__SEMANTROPIC_C1D7.economy.gold),130);
  initial.buildsOnAllEight='PASS_REAL_UI_BUILD_SELL_ALL_8_THEN_NORMAL_RESTART';
  step=profile+' first real attack';await page.locator('#waveStart').click();await page.waitForFunction(()=>window.__SEMANTROPIC_C1D7.scene.fxFires>0&&window.__SEMANTROPIC_C1D7.world.kills>0,null,{timeout:120000});await page.locator('#pause').click();
  const combat=await page.evaluate(()=>{const g=window.__SEMANTROPIC_C1D7;return {snapshot:g.world.snapshot,diagnostics:g.diagnostics()};});assert(combat.diagnostics.towers===2);assert(combat.snapshot.totalSpawns>0);
  await page.screenshot({path:out+'/'+profile+'-combat.png'});const seconds=await page.evaluate(()=>window.__SEMANTROPIC_C1D7.world.seconds);await page.waitForTimeout(200);assert.equal(await page.evaluate(()=>window.__SEMANTROPIC_C1D7.world.seconds),seconds);
  if(profile==='desktop'){
   // Show actual independent terrain layer; no route/pads/props embedded in it.
   await page.evaluate(()=>{const s=window.__SEMANTROPIC_C1D7.scene;for(const o of s.mapView.styleObjects.slice(2))o.setVisible(false);});await page.screenshot({path:out+'/desktop-substrate-only.png'});
   for(const id of [2,3,4]){step='desktop regression navigation '+id;await page.locator('#mapPickerButton').click();await page.locator('[data-map-target="'+id+'"]').click();await page.waitForFunction(id=>window.__SEMANTROPIC_C1D7?.world.map.id===id,id,{timeout:60000});}
   assert.equal(await page.locator('[data-map-target="5"]').count(),0);
  }
  assert.deepEqual(errors,[]);results.push({profile,width,height,initial,combat,errors});await page.close();
 }
 await writeFile(out+'/report.json',JSON.stringify({status:'PASS_MAP_STYLE01_MODULAR_CARTOON_SMOKE',results,physicalMobile:'NOT_RUN',artApproval:'PENDING_DIRECTOR',fullCampaign:'NOT_RUN_ART_ONLY_BLOCK'},null,2));console.log('PASS_MAP_STYLE01_MODULAR_CARTOON_SMOKE');
}catch(error){
 let state;try{state=await lastPage?.evaluate(()=>({ready:Boolean(window.__SEMANTROPIC_C1D7),gameSeconds:window.__SEMANTROPIC_C1D7?.world.seconds,snapshot:window.__SEMANTROPIC_C1D7?.world.snapshot,menu:window.__SEMANTROPIC_C1D7?.menu.get(),fires:window.__SEMANTROPIC_C1D7?.scene.fxFires,feedback:document.getElementById('feedback')?.textContent}));}catch{}
 try{await lastPage?.screenshot({path:out+'/failure.png'});}catch{}
 const report={step,error:String(error.stack||error),state};await writeFile(out+'/failure.json',JSON.stringify(report,null,2));
 console.error('::error title=MAP_STYLE01_BROWSER::'+JSON.stringify(report).replaceAll('%','%25').replaceAll('\n','%0A').replaceAll('\r','%0D'));throw error;
}finally{await browser?.close();server.close();}
