'use strict';
(async function(){
 const $=id=>document.getElementById(id), W=1280,H=768, names=['mapa_original','torre_infanteria','torre_francotirador','torre_guardiana','torre_bombardera','torre_control','orco_guerrero','orco_arquero','orco_demoledor','soldado_infanteria'];
 const data={renderer:'canvas',game:null,scene:null,canvasRaf:0,images:{},cfg:null,base:[],snap:null,count:30,fx:false,frame:0,metrics:[],errors:[],modeStart:0,loadPhaser:null,ready:false,activeBenchmark:null,benchmarkPromise:null,benchResolve:null,phaserVersion:'4.2.1',phaserGL:null,hasPhaserRun:false,paused:false,speed:1};
 window.t1PhLab={data, bench:async (renderer,seconds=10,repeat=1)=>bench(renderer,seconds,repeat),setRenderer,selectCount:setCount};
 function log(s,problem=false){$('status').textContent=s;$('status').style.color=problem?'#ffbaaa':'#d6ebf3';}
 function backend(s){$('backend').textContent=s;}
 function human(x){return x==null?'—':Math.round(x*100)/100;}
 function now(){return performance.now();}
 function info(){return {userAgent:navigator.userAgent,platform:navigator.platform,dpr:devicePixelRatio,language:navigator.language,screen:[screen.width,screen.height],isSecureContext,visualViewport:window.visualViewport?[Math.round(visualViewport.width),Math.round(visualViewport.height)]:null};}
 function pct(x,f){if(!x.length)return null;const k=[...x].sort((a,b)=>a-b);return k[Math.min(k.length-1,Math.floor((k.length-1)*f))];}
 function paintResults(){ $('result').textContent=JSON.stringify(data.metrics.slice(-1)[0]||{'aviso':'Aún no hay mediciones Phaser.'},null,2);$('download').disabled=data.metrics.length===0; }
 function download(blob,filename){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1500);}
 function renderCanvas(){
  const ctx=$('canvas2d').getContext('2d',{alpha:false}); const snap=data.snap;
  ctx.clearRect(0,0,W,H);ctx.drawImage(data.images.mapa_original,0,0,W,H);
  for(const e of snap.sprites){const im=data.images[e.k],w=im.width*e.scale,h=im.height*e.scale;
   ctx.save();ctx.translate(e.x,e.y+e.offset);ctx.rotate(e.angle);ctx.drawImage(im,-w/2,-h/2,w,h);ctx.restore();}
  for(const p of snap.projectiles){ctx.fillStyle='#'+p.color.toString(16).padStart(6,'0');ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();}
  for(const p of snap.overlays){ctx.fillStyle='#19242b';ctx.fillRect(p.x-p.w/2,p.y,p.w,p.h);ctx.fillStyle=p.shield?'#6ee5ed':'#79d78b';ctx.fillRect(p.x-p.w/2,p.y,p.w*p.life,p.h);}
  for(const e of snap.effects){ctx.globalAlpha=e.alpha;ctx.fillStyle='#'+e.color.toString(16).padStart(6,'0');ctx.beginPath();ctx.arc(e.x,e.y,e.r,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
 }
 function setCount(n){data.count=n;data.frame=0;data.base=window.T1Scene.create(n);data.snap=window.T1Scene.snapshot(data.base,0,data.fx);if(data.renderer==='phaser'&&data.scene)data.scene.resetVisuals();else renderCanvas();log('Carga sintética '+n+' · semilla 20261019');}
 function tick(){if(data.renderer!=='canvas')return;
  const t=(data.frame%7200)/60;if(!data.paused)data.frame+=data.speed;const before=now();data.snap=window.T1Scene.snapshot(data.base,t,data.fx);const updateMS=now()-before;const renderStart=now();renderCanvas();const renderMS=now()-renderStart;
  observe(now(),updateMS,renderMS);data.canvasRaf=requestAnimationFrame(tick);
 }
 function observe(ts,updateMs,renderMs){
  const b=data.activeBenchmark;if(b){b.frameCount++;if(b.frameCount>=b.warmFrames){
   if(b.lastTs){const dt=ts-b.lastTs;if(dt>0 && dt<250)b.frames.push(dt);} b.lastTs=ts;b.updates.push(updateMs);if(renderMs!=null)b.cpuCalls.push(renderMs);
   if(ts-b.measureStarted>=b.seconds*1000 && b.measureStarted>0)endRun(); else if(!b.measureStarted){b.measureStarted=ts;b.lastTs=0;}
  }}
  const f=$('fps');const m=data.__prevFrame?1000/(ts-data.__prevFrame):null;data.__prevFrame=ts;
  if(data.frame%25===0 && Number.isFinite(m))f.textContent=human(m)+' (rAF)';
 }
 function endRun(){const b=data.activeBenchmark;if(!b)return;
  data.activeBenchmark=null;const a=b.frames,durationSec=a.reduce((x,y)=>x+y,0)/1000;
  const r={date:new Date().toISOString(),engine:b.renderer,phaserVersion:b.renderer==='phaser'?data.phaserVersion:null,backendReal:b.renderer==='canvas'?'CanvasRenderingContext2D':(data.phaserGL?.getParameter(data.phaserGL.VERSION)||'NO VERIFICADO'),webgl2Real:b.renderer==='phaser'&&typeof WebGL2RenderingContext!=='undefined'&&data.phaserGL instanceof WebGL2RenderingContext,
   scenario:'T1-PH '+data.count+' enemigos sintéticos',count:data.count,mode:data.fx?'FX sintético (NO gameplay oficial)':'Base equivalente T1',seed:20261019,logicalViewport:[W,H],renderDPR:1,realFramebuffer:b.renderer==='phaser'&&data.game?[data.game.canvas.width,data.game.canvas.height]:[W,H],hardwareEnvironment:info(),rep:b.rep,warmFrames:b.warmFrames,frames:a.length,requestedSeconds:b.seconds,measuredFrameSpanSeconds:human(durationSec),fpsObserved:a.length&&durationSec?a.length/durationSec:null,frameMsP50:pct(a,.5),frameMsP95:pct(a,.95),frameMsP99:pct(a,.99),framesOver33_3Pct:a.length?100*a.filter(x=>x>33.3).length/a.length:null,updateCpuMeanMS:b.updates.length?b.updates.reduce((x,y)=>x+y,0)/b.updates.length:null,canvasDrawCpuMeanMS:b.renderer==='canvas'&&b.cpuCalls.length?b.cpuCalls.reduce((x,y)=>x+y,0)/b.cpuCalls.length:null,gpuMemoryMB:null,deviceTemp:null,renderDurationGpuMS:null,notes:'intervalos entre callbacks visuales; no son mediciones GPU ni certificación móvil. El perfil FX contiene efectos sintéticos.'};
  data.metrics.push(r);paintResults();log('Medición '+b.rep+' terminada · '+b.renderer+' · '+b.frames.length+' intervalos'); if(data.benchResolve){const resolve=data.benchResolve;data.benchResolve=null;resolve(r);}
 }
 function failRun(e){const b=data.activeBenchmark;data.activeBenchmark=null;data.errors.push(String(e));if(data.benchResolve){const resolve=data.benchResolve;data.benchResolve=null;resolve(null);}log('Error de prueba: '+e.message,true);}
 async function bench(renderer='canvas',seconds=10,repetitions=1){
  if(data.benchmarkPromise)throw Error('Benchmark ya está en ejecución');if(data.paused||data.speed!==1)throw Error('Desactiva pausa y velocidad x2 antes de medir');
  const task=(async()=>{await setRenderer(renderer);const results=[];
   for(let rep=1;rep<=repetitions;rep++){
    data.frame=0;data.modeStart=now();log('Medición '+rep+'/'+repetitions+' · calentamiento 90 fotogramas · '+seconds+' s');
    const b={renderer,rep,seconds,warmFrames:90,frameCount:0,measureStarted:0,lastTs:0,frames:[],updates:[],cpuCalls:[]};data.activeBenchmark=b;
    const value=await new Promise(resolve=>data.benchResolve=resolve);if(value)results.push(value);
   }
   return results;
  })();data.benchmarkPromise=task;
  try {return await task;}finally{data.benchmarkPromise=null;}
 }
 async function getImages(){await Promise.all(names.map(key=>new Promise((resolve,reject)=>{let im=new Image(); im.onload=()=>{data.images[key]=im;resolve();};im.onerror=()=>reject(Error('PNG no disponible: '+key));im.src=window.T1EmbeddedAssets?.[key]||'assets/'+key+'.png';})));}
 async function loadPhaser(){if(window.Phaser&&window.Phaser.VERSION==='4.2.1')return window.Phaser;
  if(data.loadPhaser)return data.loadPhaser;
  data.loadPhaser=(async()=>{
   const scripts=['dependencias/phaser.min.js','https://cdnjs.cloudflare.com/ajax/libs/phaser/4.2.1/phaser.min.js','https://cdn.jsdelivr.net/npm/phaser@4.2.1/dist/phaser.min.js','https://unpkg.com/phaser@4.2.1/dist/phaser.min.js'];
   for(const path of scripts){try{await new Promise((ok,fail)=>{const el=document.createElement('script');el.src=path;el.async=true;let finished=false;const timer=setTimeout(()=>{if(!finished){finished=true;el.remove();fail(Error('CDN sin respuesta: '+path));}},12000);el.onload=()=>{if(!finished){finished=true;clearTimeout(timer);ok();}};el.onerror=()=>{if(!finished){finished=true;clearTimeout(timer);el.remove();fail(Error('No descargado: '+path));}};document.head.appendChild(el);});if(window.Phaser&&window.Phaser.VERSION==='4.2.1')return window.Phaser;throw Error('La versión no coincide con 4.2.1');}catch(e){data.errors.push(e.message);}}
   throw Error('No se pudo cargar Phaser 4.2.1; instálalo en dependencias/phaser.min.js o usa el CDN con Internet.');
  })();try{return await data.loadPhaser;}catch(e){data.loadPhaser=null;throw e;}
 }
 function makePhaserScene(Phaser){
  return class LabScene extends Phaser.Scene{
   constructor(){super({key:'T1PH'});this.items=new Map();this.projectiles=[];this.bars=[];this.fxObjs=[];}
   create(){for(const k of names)this.textures.addImage(k,data.images[k]);this.add.image(0,0,'mapa_original').setOrigin(0,0).setDepth(-10000);this.resetVisuals();data.scene=this;}
   resetVisuals(){for(const s of this.items.values())s.destroy();for(const s of this.projectiles)s.destroy();for(const bar of this.bars){bar.bg.destroy();bar.fg.destroy();}for(const s of this.fxObjs)s.destroy();this.items.clear();this.projectiles=[];this.bars=[];this.fxObjs=[];
    for(const b of data.base){let s=this.add.image(b.x,b.y+b.offset,b.k).setScale(b.scale);this.items.set(b.id,s);}
    for(let i=0;i<12;i++)this.projectiles.push(this.add.circle(0,0,3,i%2?0xeacb65:0x7fe5fa).setDepth(2000));
    if(data.fx){for(let i=0;i<data.count;i++){this.bars.push({bg:this.add.rectangle(0,0,40,4,0x19242b).setDepth(2100),fg:this.add.rectangle(0,0,40,4,0x79d78b).setDepth(2101)});}for(let i=0;i<18;i++)this.fxObjs.push(this.add.circle(0,0,3,0xffffff).setDepth(2200));}
   }
   update(time,delta){if(data.renderer!=='phaser')return;
    const start=now();let t=(data.frame%7200)/60;if(!data.paused)data.frame+=data.speed;data.snap=window.T1Scene.snapshot(data.base,t,data.fx);
    for(const e of data.snap.sprites){const s=this.items.get(e.id);s.setPosition(e.x,e.y+e.offset);s.setRotation(e.angle);s.setDepth(e.y);}
    for(let i=0;i<12;i++){const p=data.snap.projectiles[i];this.projectiles[i].setPosition(p.x,p.y);}
    if(data.fx){data.snap.overlays.forEach((p,i)=>{const bar=this.bars[i];bar.bg.setPosition(p.x,p.y+p.h/2).setSize(p.w,p.h);bar.fg.setPosition(p.x-p.w*(1-p.life)/2,p.y+p.h/2).setSize(p.w*p.life,p.h).setFillStyle(p.shield?0x6ee5ed:0x79d78b);});data.snap.effects.forEach((p,i)=>{const q=this.fxObjs[i];q.setPosition(p.x,p.y).setRadius(p.r).setFillStyle(p.color,p.alpha);});}
    data.__phaserUpdateMS=now()-start;
   }
  };
 }
 async function initPhaser(){const P=await loadPhaser();const c=document.createElement('canvas');c.width=W;c.height=H;c.style.width='100%';c.style.height='100%';c.style.display='block';c.style.touchAction='none';
  // Contexto WebGL2 creado *antes* de Phaser; nunca inferir desde el flag WEBGL.
  const gl=c.getContext('webgl2',{alpha:false,antialias:false,preserveDrawingBuffer:true,depth:true,stencil:true});
  if(!gl||typeof WebGL2RenderingContext==='undefined'||!(gl instanceof WebGL2RenderingContext))throw Error('WebGL2 no está disponible. No se ejecuta Phaser en WebGL1 ni Canvas fallback.');
  data.phaserGL=gl;$('frame').insertBefore(c,$('tag'));
  const PScene=makePhaserScene(P);
  data.game=new P.Game({type:P.WEBGL,canvas:c,context:gl,width:W,height:H,parent:'frame',transparent:false,backgroundColor:'#142926',antialias:false,pixelArt:false,roundPixels:false,autoFocus:true,render:{pixelArt:false},scale:{mode:P.Scale.NONE,width:W,height:H},fps:{target:60,forceSetTimeOut:false},audio:{noAudio:true},scene:[PScene]});
  await new Promise((resolve,reject)=>{let i;const to=setTimeout(()=>{clearInterval(i);reject(Error('Phaser no inicializó escena (15s).'));},15000);i=setInterval(()=>{if(data.scene){clearInterval(i);clearTimeout(to);resolve();}},30);});
  if(data.game.renderer.gl!==gl)throw Error('Phaser no adoptó el contexto WebGL2 verificado; no medir.');
  data.hasPhaserRun=true;$('gl').textContent='SÍ: '+gl.getParameter(gl.VERSION);$('version').textContent=P.VERSION;backend('Phaser '+P.VERSION+' · '+gl.getParameter(gl.VERSION));
  data.game.events.on(P.Core.Events.POST_RENDER,()=>{if(data.renderer==='phaser')observe(now(),data.__phaserUpdateMS,null);});
  c.addEventListener('pointerdown',clickSelect);data.gameCanvas=c;
 }
 async function setRenderer(kind){if(!data.ready)throw Error('Archivos de escena no cargados');if(!['canvas','phaser'].includes(kind))throw Error('Motor incorrecto');
  if(data.renderer===kind && (kind==='canvas'||data.game))return;
  if(kind==='phaser'){
   log('Cargando Phaser 4.2.1; la escena Canvas seguirá visible mientras tanto...');await loadPhaser();
   if(data.canvasRaf){cancelAnimationFrame(data.canvasRaf);data.canvasRaf=0;}
   $('canvas2d').style.display='none';data.renderer='phaser';data.frame=0;
   try{if(!data.game)await initPhaser();else{data.gameCanvas.style.display='block';data.game.loop.wake();}}
   catch(e){if(data.game){try{data.game.destroy(true);}catch(_){}data.game=null;data.scene=null;}if(data.gameCanvas){try{data.gameCanvas.remove();}catch(_){}data.gameCanvas=null;}data.renderer='canvas';$('canvas2d').style.display='block';data.phaserGL=null;data.__prevFrame=0;backend('Canvas 2D · Phaser bloqueado');data.canvasRaf=requestAnimationFrame(tick);log('BLOQUEADO: '+e.message,true);throw e;}
  }else{if(data.game){data.game.loop.sleep();data.gameCanvas.style.display='none';}data.renderer='canvas';$('canvas2d').style.display='block';data.__prevFrame=0;backend('Canvas 2D · textura V5');data.canvasRaf=requestAnimationFrame(tick);}
  $('current').textContent=kind==='phaser'?'Phaser WebGL2':'Canvas 2D';log('Motor activo: '+kind);
 }
 function clickSelect(e){const canvas=e.currentTarget;const rect=canvas.getBoundingClientRect();const x=(e.clientX-rect.left)*W/rect.width,y=(e.clientY-rect.top)*H/rect.height;
  const candidates=data.snap.sprites.filter(s=>s.kind==='tower'&&Math.abs(x-s.x)<58&&Math.abs(y-(s.y+s.offset))<85);$('selected').textContent=candidates.length?'Torre: '+candidates[candidates.length-1].k.replace('torre_',''):'Sin torre bajo toque';}
 const safe=fn=>(async e=>{try{if(data.benchmarkPromise)throw Error('Termina la medición actual antes de cambiar escena.');await fn(e);}catch(error){data.errors.push(String(error));log('BLOQUEADO: '+error.message,true);}});
 $('btnCanvas').onclick=safe(()=>setRenderer('canvas'));
 $('btnPhaser').onclick=safe(()=>setRenderer('phaser'));
 $('density').onchange=safe(()=>setCount(Number($('density').value)));
 $('fx').onchange=safe(async()=>{data.fx=$('fx').checked;setCount(data.count);});
 $('btnPause').onclick=()=>{data.paused=!data.paused;$('btnPause').textContent=data.paused?'Reanudar escena':'Pausar escena';log(data.paused?'Escena pausada':'Escena reanudada');};$('btnSpeed').onclick=()=>{data.speed=data.speed===1?2:1;$('btnSpeed').textContent=data.speed===1?'Velocidad x1':'Velocidad x2';log('Velocidad de simulación '+data.speed+'x (solo visual)');};$('btnBench').onclick=async()=>{try{const motor=$('engine').value,seconds=Number($('seconds').value),repeat=Number($('repeats').value);$('btnBench').disabled=true;await bench(motor,seconds,repeat);}catch(e){data.errors.push(String(e));log(e.message,true);}finally{$('btnBench').disabled=false;}};
 $('download').onclick=()=>{const exportData={project:'SEMANTROPIC TD T1-PH',sourceVersion:'Campaña V5 DEV',referenceHash:'3712c3de1fa40266ba1e0c9f9eb2ac1b56123ad4ffcfb10ea8604a28c2f56267',phaser:'4.2.1',seed:20261019,results:data.metrics,errors:data.errors};download(new Blob([JSON.stringify(exportData,null,2)],{type:'application/json'}),'semantropic_t1ph_resultados.json');};
 $('csv').onclick=()=>{const rows=[['motor','perfil','fx','rep','fps','p50ms','p95ms','p99ms','pct>33.3ms','backendReal','WebGL2','frameN']];for(const v of data.metrics)rows.push([v.engine,v.count,v.mode,v.rep,v.fpsObserved,v.frameMsP50,v.frameMsP95,v.frameMsP99,v.framesOver33_3Pct,v.backendReal,v.webgl2Real,v.frames]);download(new Blob([rows.map(r=>r.map(x=>'"'+String(x??'').replace(/"/g,'""')+'"').join(',')).join('\n')],{type:'text/csv'}),'semantropic_t1ph_resultados.csv');};
 $('capture').onclick=()=>{try{let canvas=data.renderer==='phaser'?data.gameCanvas:$('canvas2d');canvas.toBlob(b=>{if(b)download(b,'semantropic_t1ph_'+data.renderer+'_'+data.count+'.png');else log('No fue posible capturar el canvas',true);});}catch(e){log('Captura bloqueada: '+e.message,true);}};
 window.addEventListener('orientationchange',()=>{$('orientation').textContent=screen.orientation?.type||'Sin dato';});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&data.activeBenchmark)failRun(Error('Se interrumpió por pestaña oculta; corrida descartada'));});
 $('canvas2d').addEventListener('pointerdown',clickSelect);
 try{const embeddedConfig=document.getElementById('t1-embedded-scenario');if(embeddedConfig){data.cfg=JSON.parse(embeddedConfig.textContent);}else{const response=await fetch('scenario/scenario_t1.json');if(!response.ok)throw Error('Escenario JSON HTTP '+response.status);data.cfg=await response.json();}window.T1Scene.setConfig(data.cfg);await getImages();data.ready=true;setCount(30);renderCanvas();data.canvasRaf=requestAnimationFrame(tick);log('Arte V5 cargado. Buscando Phaser 4.2.1…');backend('Canvas 2D · cargando Phaser');$('orientation').textContent=screen.orientation?.type||'Sin dato';if(new URLSearchParams(location.search).get('engine')!=='canvas'){setRenderer('phaser').catch(err=>{log('Phaser no disponible: '+err.message+' · Canvas sigue operativo',true);});}}
 catch(e){data.errors.push(String(e));log('Error inicial: '+e.message+' · iniciar con python -m http.server 8000',true);}
})();
