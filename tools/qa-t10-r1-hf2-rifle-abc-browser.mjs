/**
 * T10 R1-HF2 visual source disambiguation: actual Chromium WebGL2 P03-vs-T04
 * A = T04 rifle mouth (original SVG), B = displayed P03 rifle lip (rig state),
 * C = first visible R1 tracer/orb root, captured independently.
 * Real screenshots; 2 levels x 3 viewport x 2 SOURCE VARIANTS (legacy/new).
 * Source geometry != raster edge classification; human DG reviews screenshots.
 */
import {createServer} from 'node:http';
import {stat,readFile,mkdir} from 'node:fs/promises';
import {resolve,join,extname,sep} from 'node:path';
import {chromium} from 'playwright';
const root=resolve('dist'),dir='artifacts/t10-r1-hf2-rifle-abc';
await mkdir(dir,{recursive:true});
const mime={'.html':'text/html;charset=utf-8','.js':'text/javascript;charset=utf-8',
 '.mjs':'text/javascript;charset=utf-8','.json':'application/json',
 '.svg':'image/svg+xml','.png':'image/png','.css':'text/css;charset=utf-8'};
const srv=createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://localhost');
 const filePath=resolve(root,'.'+decodeURIComponent(url.pathname));
 if(filePath!==root&&!filePath.startsWith(root+sep))throw Error('invalid path');
 const file=(await stat(filePath)).isDirectory()?join(filePath,'index.html'):filePath;
 res.writeHead(200,{'Content-Type':mime[extname(file)]??'application/octet-stream'});
 res.end(await readFile(file));
}catch(e){res.writeHead(404);res.end(String(e))}});
await new Promise(ok=>srv.listen(0,'127.0.0.1',ok));
const base='http://127.0.0.1:'+srv.address().port+'/official/src/c1d8-b2-playable/';
let browser;const observations=[];
const take=async(page,file,values)=>{
 await page.screenshot({path:dir+'/'+file+'.png',fullPage:true});
 const points=[values.t04,values.p03,values.root].filter(x=>x&&Number.isFinite(x.x));
 const center={x:points.reduce((a,p)=>a+p.x,0)/points.length,
  y:points.reduce((a,p)=>a+p.y,0)/points.length};
 const canvas=await page.evaluate(()=>{
  const c=window.__SEMANTROPIC_C1D7.scene.game.canvas.getBoundingClientRect();
  return {left:c.left,top:c.top,width:c.width,height:c.height};
 });
 const cssX=canvas.left+center.x*canvas.width/1280,cssY=canvas.top+center.y*canvas.height/768;
 const view=page.viewportSize(),w=Math.min(view.width,Math.round(Math.max(160,220*canvas.width/1280))),
  h=Math.min(view.height,Math.round(Math.max(110,170*canvas.height/768)));
 const clip={x:Math.max(0,Math.min(view.width-w,cssX-w/2)),
  y:Math.max(0,Math.min(view.height-h,cssY-h/2)),width:w,height:h};
 await page.screenshot({path:dir+'/'+file+'-ZOOM.png',clip});
};
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader',
  '--enable-webgl','--enable-unsafe-swiftshader']});
 for(const [viewport,width,height] of [['desktop',1280,768],['mobile844',844,390],['mobile932',932,430]]){
  for(const [level,socket] of [[1,0],[2,2]]){
   for(const variant of ['legacy','operator']){
    const page=await browser.newPage({viewport:{width,height},hasTouch:width<1000,isMobile:width<1000});
    const errs=[];page.on('pageerror',e=>errs.push(e.message));
    await page.goto(base+(variant==='legacy'?'?t10hf2=legacy':''),{waitUntil:'load',timeout:30000});
    await page.waitForFunction(()=>!!window.__SEMANTROPIC_C1D7?.scene,null,{timeout:45000});
    const session=await page.evaluate(async({level,socket})=>{
     const g=window.__SEMANTROPIC_C1D7,s=g.scene,world=g.world,eco=world.economy;
     if(!s.game.renderer.gl||(typeof WebGL2RenderingContext==='undefined')
      ||!(s.game.renderer.gl instanceof WebGL2RenderingContext))throw Error('Not Chromium WebGL2');
     const mod=await import('/official/src/towers-visual/t10/p03-operator-rifle-muzzle.mjs');
     const t=eco.build(socket,'sniper');if(!t.ok)throw Error('real build failed');
     if(level===2&&!eco.upgrade(socket).ok)throw Error('real upgrade failed');
     world.syncTowers();s.drawTowers();s.updateHud();
     const tower=eco.getTower(socket),mount=s.towerMounts.get(tower.id);
     if(mount.addedRifleLayers!==0||mount.operatorAtlas!=='P03_APPROVED')throw Error('P03 original required');
     // Keep renderer and animations; all core ticks are explicitly controlled.
     s.update=()=>{};
     const original=mount.operator.frame.name;
     const [idleState,idleFrame]=[original.slice(0,original.lastIndexOf('-')),
      Number(original.slice(original.lastIndexOf('-')+1))];
     const t04=(()=>{const m=mount.sprite,ref=level===1?{x:301,y:159}:{x:315.5,y:152.5};
      const mat=m.getWorldTransformMatrix();
      return mat.transformPoint(ref.x-m.displayOriginX,ref.y-m.displayOriginY)})();
     const p03=mod.projectP03RifleMuzzle(mount.operator,{state:idleState,frame:idleFrame});
     s.__T10HF2={mod,mount,tower,shotRecords:[],markers:[],
      mark:(a,b,c)=>{
       for(const x of s.__T10HF2.markers)x.destroy();
       s.__T10HF2.markers=[];
       for(const [p,col,letter] of [[a,0x00e9fa,'A/T04'],[b,0xffcd32,'B/P03'],[c,0xff4fc3,'C/R1']]){
        if(!p)continue;
        s.__T10HF2.markers.push(s.add.circle(p.x,p.y,3.3,col,1).setStrokeStyle(1.4,0x142d3d,1).setDepth(90001));
        s.__T10HF2.markers.push(s.add.text(p.x+6,p.y-12,letter,{fontFamily:'monospace',
         fontSize:'11px',color:'#ffffff',backgroundColor:'#17303bdd'}).setDepth(90002));
       }
      }};
     s.__T10HF2.mark(t04,p03,null);
     return {tower:tower.id,idle:{frame:original,t04,p03},opScale:mount.operator.scaleX,
      opOrigin:{x:mount.operator.displayOriginX,y:mount.operator.displayOriginY}};
    },{level,socket});
    const baseName=viewport+'-L'+level+'-'+variant;
    await take(page,baseName+'-IDLE',session.idle);
    const first=await page.evaluate(({towerId})=>{
     const g=window.__SEMANTROPIC_C1D7,s=g.scene,w=g.world,h=s.__T10HF2;
     if(!w.startWave())throw Error('cannot start real M01 wave');
     let wind=null,fire=null,shots=0,targetSides=new Set();
     // For a real windup frame snapshot, return early with core PAUSED.
     for(let i=0;i<24000&&!wind&&w.active&&!w.ended;i++){
      const e=w.tick(1/60);s.reactEvents(e);s.drawSoldiers();
      wind=e.find(x=>x.type==='attack_windup'&&String(x.entityId)===String(towerId));
     }
     if(!wind)throw Error('no core windup');
     w.paused=true;
     const mount=h.mount,frame=mount.operator.frame.name;
     const state=frame.slice(0,frame.lastIndexOf('-')),index=Number(frame.slice(frame.lastIndexOf('-')+1));
     const p03=h.mod.projectP03RifleMuzzle(mount.operator,{state,frame:index});
     const t04=(()=>{const ref=mount.meta.level===1?{x:301,y:159}:{x:315.5,y:152.5};
      return mount.sprite.getWorldTransformMatrix().transformPoint(
       ref.x-mount.sprite.displayOriginX,ref.y-mount.sprite.displayOriginY)})();
     h.mark(t04,p03,null);
     return {wind:{t04,p03,frame,windupEvent:wind.eventId}};
    },{towerId:session.tower});
    await take(page,baseName+'-WINDUP',first.wind);
    const report=await page.evaluate(({towerId})=>{
     const g=window.__SEMANTROPIC_C1D7,s=g.scene,w=g.world,h=s.__T10HF2;
     w.paused=false;let fire=null;
     for(let i=0;i<24000&&!fire&&w.active&&!w.ended;i++){
      const ev=w.tick(1/60);s.reactEvents(ev);s.drawSoldiers();
      fire=ev.find(x=>x.type==='attack_fire'&&String(x.entityId)===String(towerId));
     }
     if(!fire)throw Error('no actual core attack_fire');
     w.paused=true;
     const mount=h.mount,job=s.shots.jobs.get(fire.eventId);
     if(!job?.premiumFirstFrame)throw Error('no R1 shot');
     const diag=s.t10FireOrigins.at(-1);
     const frame=mount.operator.frame.name,state=frame.slice(0,frame.lastIndexOf('-')),
      i=Number(frame.slice(frame.lastIndexOf('-')+1));
     const p03=h.mod.projectP03RifleMuzzle(mount.operator,{state,frame:i}),
      t04=diag.t04Source,root=job.premiumFirstFrame;
     if(!t04||!p03)throw Error('one rifle projection absent');
     h.mark(t04,p03,root);
     const css=mount.operator.scene.game.canvas.getBoundingClientRect();
     const scale=Math.min(css.width/1280,css.height/768);
     const cssDistance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y)*scale;
     const result={frame,t04,p03,root,source:diag.source,authority:diag.sourceAuthority,
      target:fire.payload.targetWorld,bulletId:fire.payload.bulletId,
      AB:cssDistance(t04,p03),BC:cssDistance(p03,root),AC:cssDistance(t04,root),
      maxFlashCss:8*scale,bulletRootWorld:{...job.premiumFirstFrame}};
     return {fire:result};
    },{towerId:session.tower});
    await take(page,baseName+'-FIRE',report.fire);
    // Three ACTUAL successive attack_fire events, never synthetic animation.
    // First was already captured; advance genuine M01 tick until two more.
    const repeated=await page.evaluate(({towerId,firstEvent,mode})=>{
     const g=window.__SEMANTROPIC_C1D7,s=g.scene,w=g.world,h=s.__T10HF2;
     const samples=[{eventId:firstEvent}];w.paused=false;
     for(let n=0;n<39000&&samples.length<3&&!w.ended;n++){
      if(!w.active){
       if(w.wave>=5||w.enemies.size||w.bullets.length)break;
       if(!w.startWave())break;
      }
      const events=w.tick(1/60);s.reactEvents(events);s.drawSoldiers();
      for(const e of events){
       if(e.type!=='attack_fire'||String(e.entityId)!==String(towerId))continue;
       const record=s.t10FireOrigins.at(-1),job=s.shots.jobs.get(e.eventId);
       if(!record||!job?.premiumFirstFrame)throw Error('real repeated fire without R1 visual');
       const p=record.operatorSource,b=job.premiumFirstFrame;
       const css=s.game.canvas.getBoundingClientRect();
       const distance=Math.hypot(p.x-b.x,p.y-b.y)*Math.min(css.width/1280,css.height/768);
       samples.push({eventId:e.eventId,authority:record.sourceAuthority,
        P03toR1Css:distance,targetRelativeX:Math.sign(e.payload.targetWorld.x-p.x)});
       if(samples.length===3){
        h.mark(record.t04Source,p,b);
        h.last={t04:record.t04Source,p03:p,root:b};
       }
      }
     }
     w.paused=true;
     if(samples.length!==3)throw Error('R1 HF2 fewer than 3 consecutive true sniper fires');
     if(mode==='operator'&&samples.slice(1).some(x=>x.P03toR1Css>5))throw Error('Repeated P03 muzzle drift');
     return {samples,last:h.last??null};
    },{towerId:session.tower,firstEvent:report.fire.source?report.fire.bulletId:0,mode:variant});
    if(repeated.last)await take(page,baseName+'-THIRD-FIRE',repeated.last);
    if(variant==='operator'&&report.fire.BC>5)throw Error('P03 barrel-to-tracer gap '+report.fire.BC+' CSS px');
    if(variant==='legacy'&&report.fire.BC<5)throw Error('Legacy T04 erroneously looks aligned '+report.fire.BC);
    if(report.fire.AB<7)throw Error('P03/T04 gap not independently distinguished');
    if(errs.length)throw Error('JS errors '+errs.join(' | '));
    observations.push({viewport:viewport+' '+width+'x'+height,level,variant,...session,...first,...report,threeShots:repeated.samples,
      visualHumanApproval:'PENDING'});
    await page.close();
   }
  }
 }
 console.log(JSON.stringify({status:'PASS_T10_HF2_P03_T04_ABC_REAL_CHROMIUM_WEBGL2',
  cases:observations.length,states:['idle','windup','fire'],markers:{
   A:'original T04 SVG barrel',B:'P03 actual source rig lip',C:'actual R1 first projectile frame'},
  note:'A/B/C source projections independent; this does NOT automatically classify raster-edge human preference.',
  results:observations},null,2));
}catch(e){console.error('FAIL_T10_HF2_RIFLE_ABC',e.stack||String(e));process.exitCode=1;}
finally{await browser?.close();await new Promise(ok=>srv.close(ok))}
