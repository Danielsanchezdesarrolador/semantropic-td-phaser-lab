/** P06 actual binary atlas showroom. P04/P05 are rendered by their real
 * editable historical painters; P06 is the COMMITTED transparent PNG.
 * This is an isolated art viewer, never M01/core gameplay.
 */
import {P04_META,P04_STATE_FRAMES,P04_FPS} from '../../art/actors/p04-poses.mjs';
import {makeP04Atlas,installP04Atlas} from '../../art/actors/p04-illustrator.mjs';
import {createP05Atlas,registerP05Atlas} from '../../art/actors/p05-painter.mjs';
import {P06_IMAGES,preloadP06,registerP06,p06ItemFor} from './p06-atlas-loader.mjs';
const $=id=>document.getElementById(id),W=1280,H=768;
const S={actor:'warrior',state:'walk',frame:0,elapsed:0,paused:false,zoom:'world',
 facing:'E',background:'neutral',guides:false,stress:false,speed:1};
const POS=[240,640,1040],BASE=518;
let scene=null;
const fact=()=>P04_META.find(a=>a.id===S.actor).worldHeight/(S.actor==='hound'?114:171);
function ui(){
 document.querySelectorAll('[data-actor]').forEach(b=>b.classList.toggle('active',b.dataset.actor===S.actor));
 document.querySelectorAll('[data-state]').forEach(b=>b.classList.toggle('active',b.dataset.state===S.state));
 $('pause').textContent=S.paused?'▶':'Ⅱ';
 $('direction').textContent='Vista '+S.facing;
 $('background').textContent='Fondo '+S.background;
 $('guides').textContent='Pivotes '+(S.guides?'ON':'OFF');
 $('stress').textContent='24 actores '+(S.stress?'ON':'OFF');
 $('size').textContent='Escala '+S.zoom;
}
function paintBackground(g){
 g.clear();
 if(S.background==='neutral'){
  g.fillGradientStyle(0x253842,0x283a44,0x34444b,0x2c4449).fillRect(0,0,W,H);
 }else{
  // Original PROXY of grass tones, NOT a stolen M05/M06 snapshot.
  g.fillGradientStyle(0x719473,0x799e70,0x52794f,0x58764f).fillRect(0,0,W,H);
  for(let i=0;i<105;i++){
   const x=(i*173+57)%W,y=(i*317+43)%H;
   g.fillStyle(0x285443,.12).fillEllipse(x,y,20+i%6*9,3+i%4);
  }
 }
 for(let i=0;i<3;i++){
  const x=POS[i];
  g.fillStyle(0x18343d,.77).fillRoundedRect(x-170,195,340,405,16);
  g.lineStyle(2,i===2?0xe8cf99:0x9cb8ad,.9).strokeRoundedRect(x-170,195,340,405,16);
  g.fillStyle(0x163332,.40).fillEllipse(x,BASE,150,24);
 }
}
function createFilmstrip(s,item){
 const image=s.textures.get(item.atlasKey).getSourceImage();
 const width=4*176,height=2*208;
 const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
 const c=canvas.getContext('2d',{alpha:true});
 const picks=[0,4,6,12,14,17,21,27];
 for(let i=0;i<picks.length;i++){
  const n=picks[i];c.drawImage(image,(n%8)*176,Math.floor(n/8)*208,176,208,
   (i%4)*176,Math.floor(i/4)*208,176,208);
 }
 return canvas;
}
function download(canvas,name){
 const a=document.createElement('a');a.href=canvas.toDataURL('image/png');
 a.download=name;document.body.appendChild(a);a.click();a.remove();
}
class P06Review extends Phaser.Scene{
 constructor(){super('P06-ArtReview');this.sources=[];this.sprites=[];this.clones=[];}
 preload(){preloadP06(this);}
 create(){
  registerP06(this);
  this.back=this.add.graphics().setDepth(-100);
  this.hud=this.add.graphics().setDepth(200);
  this.add.text(W/2,120,'SEMANTROPIC TD · P-06 · ATLAS REALES',{
   color:'#ffebbb',fontFamily:'system-ui',fontSize:'33px',fontStyle:'bold'
  }).setOrigin(.5).setDepth(250);
  for(const [i,label] of ['P04 · HISTÓRICO','P05 · REACCIÓN','P06 · PNG BINARIO'].entries()){
   this.add.text(POS[i],232,label,{color:i===2?'#ffe5a7':'#cfdfd8',
    fontFamily:'system-ui',fontSize:'22px',fontStyle:'bold'}).setOrigin(.5).setDepth(250);
  }
  this.footer=this.add.text(W/2,664,'',{
   color:'#f8edc9',fontFamily:'system-ui',fontSize:'15px'
  }).setOrigin(.5).setDepth(250);
  scene=this;this.loadActor(S.actor);
  const gl=this.game.renderer?.gl;
  $('runtime').textContent='Phaser '+Phaser.VERSION+' · '+
   (typeof WebGL2RenderingContext!=='undefined'&&gl instanceof WebGL2RenderingContext?
   'WebGL2 verificado por navegador':'WebGL2 SIN VERIFICAR')+
   ' · PNG P06 realmente versionados / solo arte';
  window.__SEMANTROPIC_P06={scene:this,assets:P06_IMAGES,visualOnly:true};
  this.events.once('shutdown',()=>{this.cleanup();scene=null});
 }
 cleanup(){
  for(const p of this.sprites)p.destroy();
  for(const p of this.clones)p.destroy();
  this.sprites=[];this.clones=[];
  // Historical canvases are scene-owned. P06 image textures are shared: keep.
  for(const b of this.sources.slice(0,2))if(this.textures.exists(b.key))
   this.textures.remove(b.key);
  this.sources=[];
 }
 loadActor(id){
  this.cleanup();
  const p4=makeP04Atlas(id),p5=createP05Atlas(id),p6=p06ItemFor(id);
  installP04Atlas(this,p4);registerP05Atlas(this,p5);
  this.sources=[
   {key:p4.atlasKey,canvas:p4.canvas,owner:'scene'},
   {key:p5.atlasKey,canvas:p5.canvas,owner:'scene'},
   {key:p6.atlasKey,canvas:null,owner:'loader'}
  ];
  for(let i=0;i<3;i++){
   const sprite=this.add.image(POS[i],BASE,this.sources[i].key,'idle-0')
    .setOrigin(.5,.92).setDepth(BASE+2).setScale(fact());
   this.sprites.push(sprite);
  }
  S.actor=id;S.frame=0;S.elapsed=0;this.spawnClones();
  this.renderBackground();this.drawGuides();ui();
  $('message').textContent=id==='sniper_operator'?'OPERADOR P06 SIN RIFLE · el rifle es T07 · montaje pendiente':
   'PNG original persistido en GitHub · datos visuales, no gameplay';
 }
 renderBackground(){paintBackground(this.back);}
 drawGuides(){
  this.hud.clear();if(!S.guides)return;
  for(const x of POS){
   this.hud.lineStyle(2,0xa9f7d3,.9).strokeCircle(x,BASE,5);
   this.hud.lineBetween(x-20,BASE,x+20,BASE);
   this.hud.lineStyle(1,0xcbd0d3,.8).strokeRoundedRect(x-31,BASE-P04_META.find(a=>a.id===S.actor).worldHeight-11,62,7,2);
  }
 }
 spawnClones(){
  for(const p of this.clones)p.destroy();this.clones=[];
  if(!S.stress)return;
  for(let i=0;i<24;i++){
   const item=P06_IMAGES[i%4],x=86+i%12*100,y=577+Math.floor(i/12)*30;
   this.clones.push(this.add.image(x,y,item.atlasKey,'walk-'+i%8)
    .setOrigin(.5,.92).setScale(.25).setDepth(y+1));
  }
 }
 update(_t,delta){
  const n=P04_STATE_FRAMES[S.state];
  if(!S.paused)S.elapsed+=Math.min(.060,delta/1000)*S.speed;
  const speed=P04_FPS[S.actor][S.state],raw=Math.floor(S.elapsed*speed);
  S.frame=(S.state==='walk'||S.state==='idle')?raw%n:Math.min(n-1,raw);
  const frame=S.state+'-'+S.frame,scale=fact()*(S.zoom==='detail'?1.8:S.zoom==='44px'?44/176:S.zoom==='64px'?64/176:S.zoom==='80px'?80/176:1);
  this.sprites.forEach(p=>{if(p.frame.name!==frame)p.setFrame(frame);
   p.setFlipX(S.facing==='W').setScale(scale);
  });
  this.clones.forEach((p,i)=>p.setFrame('walk-'+(S.frame+i)%8));
  this.footer.setText(S.actor+' · '+frame+' · mismo frame × 3 · pie (.50,.92)'+
   ' · fuente P06: PNG firmado · los 24 son sólo clones visuales');
 }
}
function bind(){
 document.querySelectorAll('[data-actor]').forEach(b=>b.addEventListener('click',()=>scene?.loadActor(b.dataset.actor)));
 document.querySelectorAll('[data-state]').forEach(b=>b.addEventListener('click',()=>{
  S.state=b.dataset.state;S.elapsed=0;S.frame=0;ui();
 }));
 $('pause').addEventListener('click',()=>{S.paused=!S.paused;ui()});
 $('step').addEventListener('click',()=>{
  S.paused=true;S.elapsed=(S.frame+1)/P04_FPS[S.actor][S.state];ui();
 });
 $('direction').addEventListener('click',()=>{S.facing=S.facing==='E'?'W':'E';ui()});
 $('background').addEventListener('click',()=>{S.background=S.background==='neutral'?'pradera-proxy':'neutral';scene?.renderBackground();ui()});
 $('guides').addEventListener('click',()=>{S.guides=!S.guides;scene?.drawGuides();ui()});
 $('stress').addEventListener('click',()=>{S.stress=!S.stress;scene?.spawnClones();ui()});
 $('size').addEventListener('click',()=>{
  const sizes=['world','detail','44px','64px','80px'];S.zoom=sizes[(sizes.indexOf(S.zoom)+1)%sizes.length];ui();
 });
 $('png').addEventListener('click',()=>{const item=p06ItemFor(S.actor);
  // The blob is the exact source image loaded by Phaser, not a re-render.
  const img=scene.textures.get(item.atlasKey).getSourceImage();
  const c=document.createElement('canvas');c.width=1408;c.height=832;
  c.getContext('2d').drawImage(img,0,0);download(c,'P06-'+S.actor+'-loaded.png');
 });
 $('film').addEventListener('click',()=>{const item=p06ItemFor(S.actor);
  download(createFilmstrip(scene,item),'P06-'+S.actor+'-8-poses.png');
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden){S.paused=true;ui()}});
 ui();
}
try{
 if(!window.Phaser||Phaser.VERSION!=='4.2.1')throw Error('Phaser 4.2.1 requerido');
 const canvas=document.createElement('canvas'),gl=canvas.getContext('webgl2',{antialias:true});
 if(!gl)throw Error('WebGL2 requerido');
 bind();
 new Phaser.Game({type:Phaser.WEBGL,canvas,context:gl,parent:'stage',width:W,height:H,
  scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:W,height:H},
  scene:[P06Review],audio:{noAudio:true}});
}catch(e){$('message').textContent='ERROR P06: '+e.message;console.error(e);}
