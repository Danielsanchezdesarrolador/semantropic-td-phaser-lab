/**
 * Equipo P · P04 · Visual-only WebGL2 comparison: P01 / P02 A/B / P03 / P04.
 * SAME world height, anchor and frame indices across columns for fair assessment.
 * No map/real tower or core events. Stress mode duplicates ART, never spawns.
 */
import {CAST,ANIMATIONS,createActorAtlas} from '../../art/actors/atlas-source.mjs';
import {createP02Atlas,P02_ANIM} from '../../art/actors/p02-painter.mjs';
import {createP03Atlas,registerP03Atlas,P03_FPS} from '../../art/actors/p03-rig.mjs';
import {makeP04Atlas,installP04Atlas,makeP04CharacterSheet} from '../../art/actors/p04-illustrator.mjs';
import {P04_META,P04_FPS,P04_STATE_FRAMES,P04_CANON} from '../../art/actors/p04-poses.mjs';
const W=1280,H=768,$=id=>document.getElementById(id);
const X=[134,387,640,893,1146],BASE=526;
const LABELS=['P01 BASE','P02 A','P02 B','P03 Q2','P04 NUEVO'];
const opt={actorId:'warrior',state:'walk',facing:'E',speed:1,paused:false,zoom:1,
  drawGuides:false,stress:false,stepFrame:null};
let activeScene=null;
function choice(){
 document.querySelectorAll('[data-actor]').forEach(b=>b.classList.toggle('active',b.dataset.actor===opt.actorId));
 document.querySelectorAll('[data-state]').forEach(b=>b.classList.toggle('active',b.dataset.state===opt.state));
 $('facing').textContent='Frente: '+opt.facing;
 $('speed').textContent='Velocidad: '+opt.speed+'×';
 $('pause').textContent=opt.paused?'▶ Reanudar':'Ⅱ Pausar';
 $('zoom').textContent='Escala: '+(opt.zoom===1?'M01':'detalle');
 $('guides').textContent=opt.drawGuides?'Pivotes: ON':'Pivotes: OFF';
 $('stress').textContent=opt.stress?'Horda visual: ON':'Horda visual: OFF';
}
function colorLabel(n){return ['#c8d3d3','#b2dcce','#dcbea1','#c6daea','#f6df9c'][n]}
function refOverlay(scene){
 const b=scene.add.graphics().setDepth(-15);
 b.fillGradientStyle(0x1f3b46,0x163b46,0x345849,0x26423f).fillRect(0,0,W,H);
 for(let i=0;i<130;i++){
  b.fillStyle(i%3===0?0x5c8270:0x7aa594,.12)
    .fillEllipse((i*173+55)%W,(i*271+85)%H,12+i%7*8,3+i%4);
 }
 for(let i=0;i<5;i++){
  const x=X[i];
  b.fillStyle(i===4?0x38392d:0x12323a,.9).fillRoundedRect(x-118,198,236,414,14);
  b.lineStyle(2,i===4?0xe8c987:0x729c9a,.75).strokeRoundedRect(x-118,198,236,414,14);
  b.fillStyle(0x7acfbb,.12).fillEllipse(x,BASE+2,170,25);
  scene.add.text(x,238,LABELS[i],{fontFamily:'system-ui',fontStyle:'bold',
   fontSize:'21px',color:colorLabel(i)}).setOrigin(.5).setDepth(120);
  scene.add.text(x,271,i===4?'RIG ANATÓMICO P04':i===3?'RIG P03':'REFERENCIA HISTÓRICA',{
   fontFamily:'system-ui',fontSize:'11px',color:'#b8c9c4'
  }).setOrigin(.5).setDepth(120);
 }
 scene.add.text(W/2,129,'SEMANTROPIC TD · REVISIÓN P04 / ANIMACIÓN',{
  fontFamily:'system-ui',fontSize:'31px',color:'#ffe6b4',fontStyle:'bold'
 }).setOrigin(.5).setDepth(122);
 scene.add.text(W/2,156,'5 VERSIONES · MISMA ALTURA MUNDIAL · MISMO FRAME · MISMA CÁMARA',{
  fontFamily:'system-ui',fontSize:'14px',color:'#bce1d9'
 }).setOrigin(.5).setDepth(122);
}
function installLegacy(scene,key,b){
 scene.textures.addCanvas(key,b.canvas);
 const tx=scene.textures.get(key);
 for(const list of Object.values(b.frames))for(const f of list)tx.add(f.name,0,f.x,f.y,f.w,f.h);
 return key;
}
function save(canvas,name){
 if(!canvas||typeof canvas.toDataURL!=='function')throw Error('Canvas no exportable');
 const a=document.createElement('a');a.href=canvas.toDataURL('image/png');a.download=name;
 document.body.appendChild(a);a.click();a.remove();
}
class P04Gallery extends Phaser.Scene{
 constructor(){super('P04Gallery');this.bundles=[];this.pieces=[];this.shadows=[];this.elapsed=0;this.guides=null;this.stressSprites=[];}
 create(){
  refOverlay(this);this.guides=this.add.graphics().setDepth(250);
  this.readout=this.add.text(W/2,659,'',{fontFamily:'system-ui',fontSize:'15px',color:'#e8e1bf'})
    .setOrigin(.5).setDepth(251);
  activeScene=this;this.loadActor(opt.actorId);
  this.events.once('shutdown',()=>{this.clearCurrent();activeScene=null;});
  const g=this.game.renderer?.gl;
  const isGL=typeof WebGL2RenderingContext!=='undefined'&&g instanceof WebGL2RenderingContext;
  $('runtime').textContent='Phaser '+Phaser.VERSION+' / '+(isGL?'WebGL2 del navegador':'WebGL2 NO VALIDADO')+
   ' · 5 atlas solo del actor seleccionado · SIN IA ni daño';
  window.__SEMANTROPIC_P04={scene:this,cast:CAST,metadata:P04_META,gameplayImplemented:false};
 }
 clearCurrent(){
  for(const o of this.pieces)o.destroy();
  for(const s of this.shadows)s.destroy();
  for(const s of this.stressSprites)s.destroy();
  this.pieces=[];this.shadows=[];this.stressSprites=[];
  for(const b of this.bundles)this.textures.remove(b.key);
  this.bundles=[];
  this.guides.clear();
 }
 loadActor(id){
  this.clearCurrent();
  const a=CAST.find(x=>x.actorId===id);if(!a)throw Error('Actor no encontrado '+id);
  const sheets=[createActorAtlas(id),createP02Atlas(id,'A'),createP02Atlas(id,'B'),
   createP03Atlas(id),makeP04Atlas(id)];
  for(let i=0;i<sheets.length;i++){
   const b=sheets[i],key=i===3?b.atlasKey:i===4?b.atlasKey:'actors/p04compare/'+id+'/'+i;
   if(i===3)registerP03Atlas(this,b);
   else if(i===4)installP04Atlas(this,b);
   else installLegacy(this,key,b);
   const worldH=a.heightWorld,sourceH=id==='hound'?114:171;
   const scale=worldH/sourceH;
   const shadow=this.add.ellipse(X[i],BASE+1,id==='hound'?94:73,20,0x071c22,.60).setDepth(BASE-4);
   const sprite=this.add.image(X[i],BASE,key,'idle-0').setOrigin(.5,.92).setScale(scale).setDepth(BASE+2);
   this.bundles.push({key,canvas:b.canvas,label:LABELS[i],i});
   this.pieces.push(sprite);this.shadows.push(shadow);
  }
  opt.actorId=id;this.elapsed=0;opt.stepFrame=null;
  this.renderGuides();this.renderStress();choice();
  $('message').textContent=id+' · 160 cuadros en 5 variantes, 32 por atlas, solo representaciones visuales.';
 }
 renderGuides(){
  const g=this.guides;g.clear();
  if(!opt.drawGuides)return;
  for(const x of X){
   g.lineStyle(1.5,0x86ffdd,.92).strokeCircle(x,BASE,5);
   g.lineBetween(x-22,BASE,x+22,BASE);g.lineBetween(x,BASE-16,x,BASE+16);
   g.fillStyle(0xb8bec2,.9).fillRoundedRect(x-38,BASE-124,76,5,2);
   g.fillStyle(0xb5474b,.9).fillRoundedRect(x-38,BASE-115,76,5,2);
  }
 }
 renderStress(){
  for(const s of this.stressSprites)s.destroy();
  this.stressSprites=[];
  if(!opt.stress)return;
  const key=this.bundles[4]?.key;if(!key)return;
  for(let i=0;i<24;i++){
   const x=90+(i%12)*98,y=563+Math.floor(i/12)*30;
   const s=this.add.image(x,y,key,'walk-'+i%8).setOrigin(.5,.92)
    .setScale(.23).setAlpha(.78).setDepth(y+1);
   this.stressSprites.push(s);
  }
 }
 update(_t,delta){
  if(!opt.paused&&opt.stepFrame===null)this.elapsed+=Math.min(.048,delta/1000)*opt.speed;
  const state=opt.state,def=P04_STATE_FRAMES[state],fps=P04_FPS[opt.actorId][state];
  if(opt.stepFrame===null&&state!=='idle'&&state!=='walk'&&this.elapsed*fps>=def+.6){
   opt.state='idle';this.elapsed=0;choice();
  }
  const current=opt.state,n=P04_STATE_FRAMES[current];
  const frame=opt.stepFrame===null?(current==='idle'||current==='walk'?
   Math.floor(this.elapsed*P04_FPS[opt.actorId][current])%n:
   Math.min(n-1,Math.floor(this.elapsed*P04_FPS[opt.actorId][current]))):opt.stepFrame%n;
  this.pieces.forEach(p=>{
   if(p.frame.name!==current+'-'+frame)p.setFrame(current+'-'+frame);
   p.setFlipX(opt.facing==='W');
   p.setScale((CAST.find(a=>a.actorId===opt.actorId).heightWorld/(opt.actorId==='hound'?114:171))*opt.zoom);
  });
  this.stressSprites.forEach((s,i)=>s.setFrame('walk-'+((frame+i)%8)));
  this.readout.setText(opt.actorId+' · '+current+' · frame '+(frame+1)+'/'+n+
    ' · P04 '+P04_FPS[opt.actorId][current]+'fps · '+(opt.paused?'PAUSADO':'RELOJ PHASER')+
    ' · pie 0.5/.92');
 }
}
function bind(){
 document.querySelectorAll('[data-actor]').forEach(b=>b.addEventListener('click',()=>activeScene?.loadActor(b.dataset.actor)));
 document.querySelectorAll('[data-state]').forEach(b=>b.addEventListener('click',()=>{
  opt.state=b.dataset.state;opt.stepFrame=null;
  if(activeScene)activeScene.elapsed=0;choice();
 }));
 $('facing').addEventListener('click',()=>{opt.facing=opt.facing==='E'?'W':'E';choice();});
 $('pause').addEventListener('click',()=>{opt.paused=!opt.paused;if(!opt.paused)opt.stepFrame=null;choice();});
 $('speed').addEventListener('click',()=>{opt.speed=opt.speed===.5?1:opt.speed===1?1.5:.5;choice();});
 $('zoom').addEventListener('click',()=>{opt.zoom=opt.zoom===1?1.8:1;choice();});
 $('guides').addEventListener('click',()=>{opt.drawGuides=!opt.drawGuides;activeScene?.renderGuides();choice();});
 $('stress').addEventListener('click',()=>{opt.stress=!opt.stress;activeScene?.renderStress();choice();});
 $('step').addEventListener('click',()=>{
  if(opt.stepFrame===null)opt.stepFrame=0;
  else opt.stepFrame=(opt.stepFrame+1)%P04_STATE_FRAMES[opt.state];
  opt.paused=true;choice();
 });
 $('png').addEventListener('click',()=>{
  try{save(activeScene?.bundles[4]?.canvas,'semantropic-p04-'+opt.actorId+'-atlas-prototype.png');}
  catch(e){$('message').textContent=e.message;}
 });
 $('face').addEventListener('click',()=>{
  try{save(makeP04CharacterSheet(opt.actorId),'semantropic-p04-'+opt.actorId+'-sheet-prototype.png');}
  catch(e){$('message').textContent=e.message;}
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden){opt.paused=true;choice();}});
 choice();
}
try{
 if(!window.Phaser||Phaser.VERSION!=='4.2.1')throw Error('Phaser 4.2.1 requerido');
 const cvs=document.createElement('canvas'),gl=cvs.getContext('webgl2',{antialias:true});
 if(!gl)throw Error('Se requiere WebGL2 para vitrina P04');
 bind();
 new Phaser.Game({type:Phaser.WEBGL,canvas:cvs,context:gl,parent:'stage',width:W,height:H,
  scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:W,height:H},
  scene:[P04Gallery],audio:{noAudio:true}});
}catch(e){$('message').textContent='ERROR: '+e.message;console.error(e);}
