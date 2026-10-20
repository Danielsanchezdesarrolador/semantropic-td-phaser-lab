/* P03 Q2 standalone Phaser WebGL2 gallery: P01 / P02 A / P02 B / P03.
 * NO gameplay. Visual animation state is driven by gallery clock only.
 */
import {CAST,ANIMATIONS,createActorAtlas} from '../../art/actors/atlas-source.mjs';
import {createP02Atlas,P02_ANIM} from '../../art/actors/p02-painter.mjs';
import {createP03Atlas,registerP03Atlas,P03_FPS} from '../../art/actors/p03-rig.mjs';
import {createP03FaceSheet} from '../../art/actors/p03-face-sheet.mjs';
const W=1280,H=768,$=id=>document.getElementById(id);
const COL=[166,482,798,1114],BASE=528;
const selected={actorId:'warrior',state:'walk',facing:'E',paused:false,origin:false,scaleMode:'game',showZone:false};
const originalSource=CAST;
let gallery=null;
function ui(){
 for(const b of document.querySelectorAll('[data-actor]'))b.classList.toggle('active',b.dataset.actor===selected.actorId);
 for(const b of document.querySelectorAll('[data-state]'))b.classList.toggle('active',b.dataset.state===selected.state);
 $('facing').textContent='Dirección: '+selected.facing;
 $('pause').textContent=selected.paused?'▶ Continuar':'Ⅱ Pausar';
 $('scale').textContent=selected.scaleMode==='game'?'Escala: M01 1×':'Escala: detalle 1.8×';
 $('zone').textContent=selected.showZone?'Zona HP/escudo: ON':'Zona HP/escudo: OFF';
}
function tile(scene,x,i){
 const g=scene.add.graphics().setDepth(1);
 const colors=[0x223642,0x21463d,0x35463d,0x3d3843];
 g.fillStyle(colors[i],.93).fillRoundedRect(x-147,198,294,412,15);
 g.lineStyle(2,i===3?0xf0cf87:0x82a8a2,.82).strokeRoundedRect(x-147,198,294,412,15);
 g.fillStyle(0x79cabe,.1).fillEllipse(x,BASE,185,33);
 const name=['P-01','P-02 A','P-02 B','P-03 Q2'][i];
 scene.add.text(x,229,name,{fontFamily:'system-ui',fontSize:'25px',fontStyle:'bold',
  color:i===3?'#ffe6a2':'#c9e6de'}).setOrigin(.5).setDepth(2);
 scene.add.text(x,262,['BASE VECTORIAL','ESTUDIO TÁCTICO','ESTUDIO DETALLE','NUEVO RIG ARTICULADO'][i],
 {fontFamily:'system-ui',fontSize:'12px',color:'#c7d3c9'}).setOrigin(.5).setDepth(2);
}
function downloadCanvas(canvas,file){
 if(!canvas||typeof canvas.toDataURL!=='function')throw Error('PNG no disponible');
 const a=document.createElement('a');a.href=canvas.toDataURL('image/png');
 a.download=file;document.body.appendChild(a);a.click();a.remove();
}
class ActorQ2Gallery extends Phaser.Scene{
 constructor(){super('ActorP03Q2');this.entries=[];this.bundles=[];this.elapsed=0;this.zones=null;this.readout=null;}
 create(){
  const g=this.add.graphics().setDepth(-30);
  g.fillGradientStyle(0x15343b,0x214c4d,0x243e3c,0x284c3c).fillRect(0,0,W,H);
  for(let i=0;i<4;i++)tile(this,COL[i],i);
  this.add.text(W/2,115,'SEMANTROPIC TD · ACTORES P-03 / C1-B-Q2',{
   fontFamily:'system-ui',fontSize:'30px',fontStyle:'bold',color:'#ffe3a9'
  }).setOrigin(.5).setDepth(100);
  this.add.text(W/2,151,'COMPARACIÓN CONTROLADA · RENDER PHASER · SIN COMBATE REAL',{
   fontFamily:'system-ui',fontSize:'15px',color:'#bbdfd4'
  }).setOrigin(.5).setDepth(100);
  this.readout=this.add.text(W/2,655,'',{fontFamily:'system-ui',fontSize:'16px',color:'#e2dbbb'}).setOrigin(.5).setDepth(100);
  this.zones=this.add.graphics().setDepth(90);
  gallery=this;this.selectActor(selected.actorId);
  $('runtime').textContent='Phaser '+Phaser.VERSION+' · '+(this.game.renderer?.gl instanceof WebGL2RenderingContext?'WebGL2 REAL (browser actual)':'WebGL2 no validado')+' · visual sin gameplay';
  window.__SEMANTROPIC_P03={scene:this,get actorId(){return selected.actorId;},cast:originalSource,readonly:true};
 }
 selectActor(id){
  if(!originalSource.some(a=>a.actorId===id))throw Error('Actor inexistente '+id);
  for(const e of this.entries){e.sprite.destroy();e.shadow.destroy();}this.entries=[];
  for(const b of this.bundles){this.textures.remove(b.key);}this.bundles=[];
  const bas=createActorAtlas(id),a=createP02Atlas(id,'A'),b=createP02Atlas(id,'B'),p=createP03Atlas(id);
  const sheets=[
   {key:'actors/compare/p01/'+id,bundle:bas},
   {key:a.atlasKey,bundle:a},
   {key:b.atlasKey,bundle:b},
   {key:p.atlasKey,bundle:p}
  ];
  for(let i=0;i<sheets.length;i++){
   const x=COL[i],file=sheets[i],key=file.key;
   if(i===3)registerP03Atlas(this,p);
   else{
    this.textures.addCanvas(key,file.bundle.canvas);
    const tx=this.textures.get(key);
    for(const frames of Object.values(file.bundle.frames))for(const f of frames)tx.add(f.name,0,f.x,f.y,f.w,f.h);
   }
   this.bundles.push({key,canvas:file.bundle.canvas,name:['P01','P02A','P02B','P03'][i]});
   const data=CAST.find(v=>v.actorId===id);
   const height=data.heightWorld*(i===1?.94:i===2?1.08:1);
   const scale=height/(id==='hound'?114:171);
   const shadow=this.add.ellipse(x,BASE+1,id==='hound'?97:69,20,0x06191d,.64).setDepth(BASE-3);
   const sprite=this.add.image(x,BASE,key,'idle-0').setOrigin(.5,.92).setDepth(BASE+2);
   this.entries.push({sprite,shadow,x,scale,worldHeight:height});
  }
  this.elapsed=0;selected.actorId=id;
  this.drawZones();ui();$('message').textContent=id+' · 4 atlas de 32 cuadros. P03 separado y editable. No se calculan daños.';
 }
 drawZones(){
  this.zones.clear();if(!selected.showZone)return;
  for(const e of this.entries){
   const head=BASE-e.worldHeight-24;
   this.zones.fillStyle(0xb0293e,.9).fillRoundedRect(e.x-35,head,70,5,2);
   this.zones.fillStyle(0xb6b9b9,.92).fillRoundedRect(e.x-35,head-9,70,5,2);
   this.zones.lineStyle(2,0x88f6cd,.8).strokeCircle(e.x,BASE,5);
  }
 }
 update(_t,delta){
  if(!selected.paused)this.elapsed+=Math.min(.05,delta/1000);
  const def=ANIMATIONS[selected.state];
  const fps=P03_FPS[selected.actorId][selected.state];
  if(!def.loop&&this.elapsed*fps>=def.frames+.6){selected.state='idle';this.elapsed=0;ui();}
  const frames=ANIMATIONS[selected.state],active=P03_FPS[selected.actorId][selected.state];
  const pos=Math.floor(this.elapsed*active),index=frames.loop?pos%frames.frames:Math.min(pos,frames.frames-1);
  this.entries.forEach((e,i)=>{
   const f=selected.state+'-'+index;
   if(e.sprite.frame.name!==f)e.sprite.setFrame(f);
   e.sprite.setFlipX(selected.facing==='W');
   e.sprite.setScale(e.scale*(selected.scaleMode==='game'?1:1.8));
  });
  this.readout.setText(selected.actorId+' / '+selected.state+' · '+(index+1)+'/'+frames.frames+
    ' · '+active+' fps · '+(selected.paused?'PAUSA':'TIEMPO PHASER')+' · pie 0.50/0.92');
 }
}
function attach(){
 document.querySelectorAll('[data-actor]').forEach(b=>b.addEventListener('click',()=>gallery?.selectActor(b.dataset.actor)));
 document.querySelectorAll('[data-state]').forEach(b=>b.addEventListener('click',()=>{
  selected.state=b.dataset.state;if(gallery)gallery.elapsed=0;ui();
 }));
 $('facing').addEventListener('click',()=>{selected.facing=selected.facing==='E'?'W':'E';ui();});
 $('pause').addEventListener('click',()=>{selected.paused=!selected.paused;ui();});
 $('scale').addEventListener('click',()=>{selected.scaleMode=selected.scaleMode==='game'?'detail':'game';ui();});
 $('zone').addEventListener('click',()=>{selected.showZone=!selected.showZone;gallery?.drawZones();ui();});
 $('png').addEventListener('click',()=>{
  try{const t=gallery?.bundles.find(x=>x.name==='P03');
   downloadCanvas(t?.canvas,'semantropic-p03-'+selected.actorId+'-atlas.png');
  }catch(e){$('message').textContent=e.message;}
 });
 $('faces').addEventListener('click',()=>{
  try{downloadCanvas(createP03FaceSheet(selected.actorId),'semantropic-p03-'+selected.actorId+'-face-study.png');}
  catch(e){$('message').textContent=e.message;}
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden){selected.paused=true;ui();}});
 ui();
}
try{
 if(!window.Phaser||Phaser.VERSION!=='4.2.1')throw Error('Requiere Phaser 4.2.1 de este proyecto');
 const c=document.createElement('canvas'),gl=c.getContext('webgl2',{antialias:true});
 if(!gl)throw Error('Esta vitrina exige WebGL2 real');
 attach();
 new Phaser.Game({type:Phaser.WEBGL,canvas:c,context:gl,parent:'stage',width:W,height:H,
  scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:W,height:H},
  scene:[ActorQ2Gallery],audio:{noAudio:true}});
}catch(e){$('message').textContent='ERROR P-03: '+e.message;console.error(e);}
