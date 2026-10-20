/* P05 only: PHASER REAL ART gallery. Same P04 & P05 source painter.
 * Synthetic EVENTS for preview only, NOT core combat.
 */
import {P04_META} from '../../art/actors/p04-poses.mjs';
import {makeP04Atlas,installP04Atlas} from '../../art/actors/p04-illustrator.mjs';
import {createP05Atlas,registerP05Atlas,makeP05ExpressionSheet} from '../../art/actors/p05-painter.mjs';
import {createP05Reactivity} from '../../art/actors/p05-reactivity.mjs';
import {createP05ViewAdapter} from './p05-view-adapter.mjs';
const W=1280,H=768,$=id=>document.getElementById(id);
const opt={actor:'warrior',paused:false,speed:1,facing:'E',crowd:false,guides:false};
let room,seq=0;
function ui(){
 document.querySelectorAll('[data-actor]').forEach(b=>b.classList.toggle('active',b.dataset.actor===opt.actor));
 $('pause').textContent=opt.paused?'▶ Reanudar':'Ⅱ Pausa';
 $('direction').textContent='Orientación '+opt.facing;
 $('speed').textContent='Ritmo '+opt.speed+'×';
 $('crowd').textContent='24 copias '+(opt.crowd?'ON':'OFF');
 $('guides').textContent='Pivotes '+(opt.guides?'ON':'OFF');
}
function download(canvas,name){const a=document.createElement('a');a.href=canvas.toDataURL('image/png');a.download=name;document.body.appendChild(a);a.click();a.remove();}
class P05Gallery extends Phaser.Scene{
 constructor(){super('P05Gallery');this.bundles=[];this.childrenActors=[];this.copies=[];}
 create(){
  const bg=this.add.graphics().setDepth(-20);
  bg.fillGradientStyle(0x224452,0x1d4249,0x31584c,0x284740).fillRect(0,0,W,H);
  for(let i=0;i<100;i++)bg.fillStyle(i%2?0x9cc0a3:0x5f968e,.09)
   .fillEllipse((i*157+31)%W,(i*223+67)%H,30+i%7*7,3+i%6);
  for(const [i,x] of [335,945].entries()){
   bg.fillStyle(i?0x2f4339:0x1e3845,.85).fillRoundedRect(x-270,185,540,420,22);
   bg.lineStyle(3,i?0xe4c78f:0x9fbec5,.87).strokeRoundedRect(x-270,185,540,420,22);
   this.add.text(x,228,i?'P05 · REACTIVIDAD':'P04 · BASE',
    {fontFamily:'system-ui',fontSize:'29px',fontStyle:'bold',color:i?'#f3dfb2':'#c9e5df'})
     .setOrigin(.5).setDepth(100);
  }
  this.add.text(W/2,119,'SEMANTROPIC TD · PERSONAJES / P05',
   {fontFamily:'system-ui',fontSize:'32px',fontStyle:'bold',color:'#f6e7c3'}).setOrigin(.5).setDepth(100);
  this.add.text(W/2,149,'MISMO FRAME Y ESCALA · SIN COMBATE LÓGICO',
   {fontFamily:'system-ui',fontSize:'14px',color:'#c7ded7'}).setOrigin(.5).setDepth(100);
  this.gfx=this.add.graphics().setDepth(200);
  this.label=this.add.text(W/2,667,'',{fontFamily:'system-ui',fontSize:'16px',color:'#efe1b9'})
   .setOrigin(.5).setDepth(200);
  room=this;this.loadActor(opt.actor);
  const gl=this.game.renderer?.gl;
  $('runtime').textContent='Phaser '+Phaser.VERSION+' · '+(
   typeof WebGL2RenderingContext!=='undefined'&&gl instanceof WebGL2RenderingContext?
   'WebGL2 del navegador':'WebGL2 NO VERIFICADO')+' · visual únicamente';
  window.__SEMANTROPIC_P05={scene:this,get controller(){return room?.controller},readonly:true};
  this.events.once('shutdown',()=>{this.clear();room=null});
 }
 clear(){
  this.binding?.dispose();this.controller?.dispose();
  for(const child of this.childrenActors)child.destroy();
  for(const c of this.copies)c.destroy();
  this.childrenActors=[];this.copies=[];
  for(const b of this.bundles)this.textures.remove(b.key);
  this.bundles=[];this.binding=null;this.controller=null;this.gfx?.clear();
 }
 loadActor(id){
  this.clear();opt.actor=id;seq=0;opt.paused=false;
  const base=makeP04Atlas(id),now=createP05Atlas(id);
  installP04Atlas(this,base);registerP05Atlas(this,now);
  this.bundles=[{key:base.atlasKey,canvas:base.canvas},{key:now.atlasKey,canvas:now.canvas}];
  this.baseline=this.add.image(335,512,base.atlasKey,'idle-0').setOrigin(.5,.92).setDepth(515);
  this.actor=this.add.image(945,512,now.atlasKey,'idle-0').setOrigin(.5,.92).setDepth(515);
  const shadow=this.add.ellipse(945,514,90,21,0x071c21,.62).setDepth(508);
  this.childrenActors.push(this.baseline,this.actor,shadow);
  this.controller=createP05Reactivity({actorId:id,entityId:'demo-'+id,
   onVisualDone:()=>{$('message').textContent='Animación terminal finalizada. Recompensas y HP solo core.'}});
  const scale=P04_META.find(a=>a.id===id).worldHeight/(id==='hound'?114:171);
  this.binding=createP05ViewAdapter({sprite:this.actor,shadow,reactivity:this.controller,worldScale:scale});
  this.binding.setWorldPoseFromCore({x:945,y:512});
  this.baseline.setScale(scale);
  this.send('spawn');this.send('move_state',{moving:true,facing:opt.facing});
  this.crowd();this.guides();ui();
 }
 send(type,payload={}){
  if(!this.controller)return false;
  const ok=this.controller.dispatch({contractVersion:'combat-events-v1',
   type,entityId:'demo-'+opt.actor,eventId:'visual-'+(++seq),tick:seq,payload});
  if(ok)$('message').textContent='Solo vitrina: '+type+' → '+this.controller.snapshot().state;
  return ok;
 }
 crowd(){
  for(const a of this.copies)a.destroy();this.copies=[];
  if(!opt.crowd)return;
  for(let i=0;i<24;i++){
   const x=115+i%12*96,y=580+Math.floor(i/12)*28;
   this.copies.push(this.add.image(x,y,this.bundles[1].key,'walk-'+i%8)
    .setOrigin(.5,.92).setScale(.22).setAlpha(.82).setDepth(y+1));
  }
 }
 guides(){
  this.gfx.clear();if(!opt.guides)return;
  for(const x of [335,945]){
   this.gfx.lineStyle(2,0x9bebd8,.95).strokeCircle(x,512,5);
   this.gfx.lineBetween(x-20,512,x+20,512);
   this.gfx.lineBetween(x,492,x,532);
  }
 }
 update(_t,delta){
  if(!this.controller)return;
  if(!opt.paused)this.binding.advance(Math.min(delta,100)*opt.speed);
  const s=this.controller.snapshot();
  this.baseline.setFrame(s.frame).setFlipX(opt.facing==='W');
  this.copies.forEach((c,i)=>c.setFrame('walk-'+(i+Math.floor(s.phase*8))%8));
  this.label.setText(opt.actor+' · '+s.state+' · '+s.frame+' · P05 alpha '+s.opacity.toFixed(2)+
   ' · pausa '+(opt.paused?'sí':'no')+' · 0 daño desde visuales');
 }
}
function wire(){
 document.querySelectorAll('[data-actor]').forEach(b=>b.addEventListener('click',()=>room?.loadActor(b.dataset.actor)));
 document.querySelectorAll('[data-event]').forEach(b=>b.addEventListener('click',()=>{
  const ev=b.dataset.event;
  if(opt.paused){opt.paused=false;room?.send('game_resumed');}
  room?.send(ev,ev==='move_state'?{moving:true,facing:opt.facing}:{});
  ui();
 }));
 $('reset').addEventListener('click',()=>room?.loadActor(opt.actor));
 $('pause').addEventListener('click',()=>{
  opt.paused=!opt.paused;room?.send(opt.paused?'game_paused':'game_resumed');ui();
 });
 $('direction').addEventListener('click',()=>{
  opt.facing=opt.facing==='E'?'W':'E';room?.send('move_state',{moving:true,facing:opt.facing});ui();
 });
 $('speed').addEventListener('click',()=>{opt.speed=opt.speed===.5?1:opt.speed===1?1.5:.5;ui()});
 $('crowd').addEventListener('click',()=>{opt.crowd=!opt.crowd;room?.crowd();ui()});
 $('guides').addEventListener('click',()=>{opt.guides=!opt.guides;room?.guides();ui()});
 $('png').addEventListener('click',()=>room&&download(room.bundles[1].canvas,'p05-'+opt.actor+'-draft-atlas.png'));
 $('sheet').addEventListener('click',()=>download(makeP05ExpressionSheet(opt.actor),'p05-'+opt.actor+'-expression.png'));
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&!opt.paused){
  opt.paused=true;room?.send('game_paused');ui();
 }});
 ui();
}
try{
 if(!window.Phaser||Phaser.VERSION!=='4.2.1')throw Error('Phaser 4.2.1 requerido');
 const canvas=document.createElement('canvas'),gl=canvas.getContext('webgl2',{antialias:true});
 if(!gl)throw Error('WebGL2 obligatorio en la vitrina');
 wire();new Phaser.Game({type:Phaser.WEBGL,canvas,context:gl,parent:'stage',width:W,height:H,
  scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:W,height:H},
  scene:[P05Gallery],audio:{noAudio:true}});
}catch(e){$('message').textContent='ERROR P05: '+e.message;console.error(e);}
