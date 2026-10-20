/** PERSONAJES P07 visual-lock showroom. 3 real source families, same camera.
 * P03 original vector Canvas2D ↔ P06 previous binary ↔ P07 source-derived PNG.
 * Original screenshot SHA 24103e... is reference only; M07/T08 not integrated.
 * All state changes are synthetic art previews, NOT authoritative combat.
 */
import {P03_ACTORS,P03_FPS,createP03Atlas,registerP03Atlas} from '../../art/actors/p03-rig.mjs';
import {ANIMATIONS} from '../../art/actors/atlas-source.mjs';
import {P06_IMAGES,preloadP06,registerP06,p06ItemFor} from './p06-atlas-loader.mjs';
import {P07_IMAGES,preloadP07,registerP07,p07ItemFor} from './p07-atlas-loader.mjs';
const $=x=>document.getElementById(x),W=1280,H=768,XX=[215,640,1065],Y=517;
const cfg={actor:'warrior',state:'walk',paused:false,direction:'E',speed:1,
 frame:0,elapsed:0,guides:false,stress:false,background:'pradera-proxy',mode:'world'};
let gallery;
function textButtons(){
 for(const b of document.querySelectorAll('[data-actor]'))b.classList.toggle('active',b.dataset.actor===cfg.actor);
 for(const b of document.querySelectorAll('[data-state]'))b.classList.toggle('active',b.dataset.state===cfg.state);
 $('pause').textContent=cfg.paused?'▶ Reanudar':'Ⅱ Pausa';
 $('direction').textContent='Vista '+cfg.direction;
 $('scale').textContent='Tamaño '+cfg.mode;
 $('background').textContent='Fondo '+cfg.background;
 $('stress').textContent='24 visuales '+(cfg.stress?'ON':'OFF');
 $('guides').textContent='Anclajes '+(cfg.guides?'ON':'OFF');
}
function save(canvas,name){
 const a=document.createElement('a');a.href=canvas.toDataURL('image/png');a.download=name;
 document.body.appendChild(a);a.click();a.remove();
}
class P07VisualLock extends Phaser.Scene{
 constructor(){super('P07-Continuidad-C1C');this.sprites=[];this.copies=[];this.historyKey=null;}
 preload(){preloadP06(this);preloadP07(this);}
 create(){
  registerP06(this);registerP07(this);
  this.bg=this.add.graphics().setDepth(-90);
  this.rulers=this.add.graphics().setDepth(240);
  for(const [i,label] of ['P03 · REFERENCIA FUENTE','P06 · COMPARAR','P07 · CONTINUIDAD'].entries()){
   this.add.text(XX[i],220,label,{fontFamily:'system-ui',fontSize:'21px',
    fontStyle:'bold',color:i===2?'#ffe3a4':'#cee4de'}).setOrigin(.5).setDepth(250);
  }
  this.add.text(W/2,113,'SEMANTROPIC TD · PERSONAJES P07 · ANCLA C1-C',
   {fontFamily:'system-ui',fontSize:'29px',fontStyle:'bold',color:'#f9e7bc'}).setOrigin(.5).setDepth(250);
  this.add.text(W/2,151,'P03 MISMOS RASGOS Y EQUIPO · P07 OPERADOR SIN RIFLE · SIN COMBATE',
   {fontFamily:'system-ui',fontSize:'13px',color:'#d7e5d8'}).setOrigin(.5).setDepth(250);
  this.note=this.add.text(W/2,654,'',{fontFamily:'system-ui',fontSize:'15px',color:'#e8e1c7'}).setOrigin(.5).setDepth(250);
  gallery=this;this.loadActor(cfg.actor);
  const gl=this.game.renderer?.gl;
  $('runtime').textContent='Phaser '+Phaser.VERSION+' · '+
   (typeof WebGL2RenderingContext!=='undefined'&&gl instanceof WebGL2RenderingContext?
   'WebGL2 navegador':'WebGL2 NO VERIFICADO')+
   ' · fuente P03 + PNG P06/P07, fondo pradera PROXY';
  window.__SEMANTROPIC_P07={scene:this,visualOnly:true,sourceScreenshotSha256:'24103e45a0e1249fa4b89d4e65ea16d9e147bdf1e2462e5c4063469a931842ef'};
  this.events.once('shutdown',()=>{this.clearActor();gallery=null;});
 }
 clearActor(){
  for(const s of this.sprites)s.destroy();for(const c of this.copies)c.destroy();
  this.sprites=[];this.copies=[];
  if(this.historyKey&&this.textures.exists(this.historyKey))this.textures.remove(this.historyKey);
  this.historyKey=null;
 }
 loadActor(id){
  this.clearActor();cfg.actor=id;cfg.elapsed=0;cfg.frame=0;
  const historical=createP03Atlas(id);registerP03Atlas(this,historical);
  this.historyKey=historical.atlasKey;
  this.activeKeys=[historical.atlasKey,p06ItemFor(id).atlasKey,p07ItemFor(id).atlasKey];
  const scale=this.worldScale();
  for(let i=0;i<3;i++)this.sprites.push(this.add.image(XX[i],Y,this.activeKeys[i],'idle-0')
    .setOrigin(.5,.92).setScale(scale).setDepth(Y+2));
  this.paintGround();this.drawGuides();this.crowd();textButtons();
  $('message').textContent=(id==='sniper_operator'?
   'P07 P03 visor humano conservado + operador SIN rifle; T08 montaje pendiente':
   'Conserva contorno, arma, rostro y silueta vectorial original P03.');
 }
 worldScale(){
  const a=P03_ACTORS.find(x=>x.actorId===cfg.actor);
  return a.heightWorld/(cfg.actor==='hound'?114:171);
 }
 paintGround(){
  const g=this.bg;g.clear();
  const green=cfg.background==='pradera-proxy';
  g.fillGradientStyle(green?0xabc978:0x263d48,green?0x9fbe73:0x263d48,
   green?0x558257:0x34454f,green?0x5d8a5b:0x34454f).fillRect(0,0,W,H);
  if(green){
   for(let k=0;k<90;k++)g.fillStyle(k%2?0x9fbf72:0x315e48,.16)
    .fillEllipse((k*197)%W,(k*211)%H,21+k%4*11,4+k%3);
  }
  for(const [i,x] of XX.entries()){
   g.fillStyle(green?0x26443a:0x1b3740,.86).fillRoundedRect(x-190,193,380,403,18);
   g.lineStyle(2,i===2?0xe6cb88:0x87aba8,.8).strokeRoundedRect(x-190,193,380,403,18);
   g.fillStyle(0x141e1f,.32).fillEllipse(x,Y+3,158,25);
  }
 }
 drawGuides(){
  const g=this.rulers;g.clear();if(!cfg.guides)return;
  for(const x of XX){
   g.lineStyle(2,0x84efb8,.95).strokeCircle(x,Y,5);
   g.lineBetween(x-23,Y,x+23,Y);g.lineBetween(x,Y-22,x,Y+22);
  }
 }
 crowd(){
  for(const x of this.copies)x.destroy();this.copies=[];
  if(!cfg.stress)return;
  for(let i=0;i<24;i++){
   const data=P07_IMAGES[i%4],x=80+i%12*103,y=575+Math.floor(i/12)*27;
   this.copies.push(this.add.image(x,y,data.atlasKey,'walk-'+i%8)
    .setOrigin(.5,.92).setScale(.24).setDepth(y+1).setAlpha(.90));
  }
 }
 update(_t,delta){
  const frames=ANIMATIONS[cfg.state].frames;
  if(!cfg.paused)cfg.elapsed+=Math.min(delta/1000,.06)*cfg.speed;
  const fps=P03_FPS[cfg.actor][cfg.state],
   idx=cfg.state==='walk'||cfg.state==='idle'?Math.floor(cfg.elapsed*fps)%frames:
    Math.min(frames-1,Math.floor(cfg.elapsed*fps));
  cfg.frame=idx;
  const frame=cfg.state+'-'+idx,base=this.worldScale();
  const scale=cfg.mode==='world'?base:cfg.mode==='detail'?base*1.8:base*parseInt(cfg.mode,10)/80;
  for(const s of this.sprites){
   if(s.frame.name!==frame)s.setFrame(frame);
   s.setFlipX(cfg.direction==='W').setScale(scale);
  }
  for(const [i,s] of this.copies.entries())s.setFrame('walk-'+((idx+i)%8));
  this.note.setText(cfg.actor+' / '+frame+' · misma escala y fase ×3 · 32 cuadros · 0 gameplay');
 }
}
function attach(){
 document.querySelectorAll('[data-actor]').forEach(b=>b.addEventListener('click',()=>gallery?.loadActor(b.dataset.actor)));
 document.querySelectorAll('[data-state]').forEach(b=>b.addEventListener('click',()=>{
  cfg.state=b.dataset.state;cfg.frame=0;cfg.elapsed=0;textButtons();
 }));
 $('pause').addEventListener('click',()=>{cfg.paused=!cfg.paused;textButtons()});
 $('step').addEventListener('click',()=>{
  cfg.paused=true;cfg.elapsed=(cfg.frame+1)/P03_FPS[cfg.actor][cfg.state];textButtons();
 });
 $('direction').addEventListener('click',()=>{
  cfg.direction=cfg.direction==='E'?'W':'E';textButtons();
 });
 $('scale').addEventListener('click',()=>{
  const m=['world','detail','44px','64px','80px'];
  cfg.mode=m[(m.indexOf(cfg.mode)+1)%m.length];textButtons();
 });
 $('background').addEventListener('click',()=>{
  cfg.background=cfg.background==='pradera-proxy'?'neutral':'pradera-proxy';
  gallery?.paintGround();textButtons();
 });
 $('stress').addEventListener('click',()=>{cfg.stress=!cfg.stress;gallery?.crowd();textButtons()});
 $('guides').addEventListener('click',()=>{cfg.guides=!cfg.guides;gallery?.drawGuides();textButtons()});
 $('film').addEventListener('click',()=>{
  const tex=gallery?.textures.get(p07ItemFor(cfg.actor).atlasKey);
  if(!tex)return;
  const img=tex.getSourceImage(),canvas=document.createElement('canvas');
  canvas.width=704;canvas.height=416;const c=canvas.getContext('2d',{alpha:true});
  [0,4,6,12,14,17,21,27].forEach((n,i)=>
   c.drawImage(img,(n%8)*176,Math.floor(n/8)*208,176,208,(i%4)*176,Math.floor(i/4)*208,176,208));
  save(canvas,'P07-'+cfg.actor+'-8-poses-from-real-png.png');
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cfg.paused=true;textButtons()}});
 textButtons();
}
try{
 if(!window.Phaser||Phaser.VERSION!=='4.2.1')throw Error('Phaser 4.2.1 requerido');
 const canvas=document.createElement('canvas'),gl=canvas.getContext('webgl2',{antialias:true});
 if(!gl)throw Error('WebGL2 requerido');
 attach();new Phaser.Game({type:Phaser.WEBGL,canvas,context:gl,
  parent:'stage',width:W,height:H,
  scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:W,height:H},
  scene:[P07VisualLock],audio:{noAudio:true}});
}catch(e){$('message').textContent='ERROR P07: '+e.message;console.error(e)}
