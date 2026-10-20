import {preloadP08,registerP08,P08_IMAGES,P08_STATES} from './p08-loader.mjs';
const STAGE={width:1280,height:768},H=208,W=176;
const cfg={state:'attack',time:0,paused:false,stepped:false,worldHeight:80,guides:false};
let gallery;
const labels=[{id:'infantry_recruit',x:196,title:'I · RECLUTA',scale:88/171},
 {id:'infantry_veteran',x:421,title:'II · VETERANO 1',scale:88/171},
 {id:'infantry_veteran',x:615,title:'II · VETERANO 2',scale:88/171},
 {id:'warrior',x:897,title:'ORCO · P03',scale:91/171},
 {id:'hound',x:1112,title:'HOUND · P03',scale:67/114}];
const $=id=>document.getElementById(id);
function ui(){
 for(const b of document.querySelectorAll('[data-state]'))b.setAttribute('aria-pressed',String(b.dataset.state===cfg.state));
 $('pause').textContent=cfg.paused?'▶ Reanudar':'Ⅱ Pausa';
 $('guides').textContent='Anclas '+(cfg.guides?'ON':'OFF');
 $('size').textContent='Altura '+(cfg.worldHeight===80?'mundo':cfg.worldHeight+'px');
}
class P08Review extends Phaser.Scene{
 constructor(){super('P08-personajes');this.views=[];}
 preload(){
  preloadP08(this,{baseUrl:'../../../art/actors/p08/png/'});
  this.load.on('loaderror',e=>$('note').textContent='ERROR: falta PNG '+e.key);
 }
 create(){
  registerP08(this);
  this.graphics=this.add.graphics().setDepth(-100);
  this.guides=this.add.graphics().setDepth(1000);
  this.paintBackdrop();
  this.add.text(STAGE.width/2,154,'SEMANTROPIC TD · P08 · INFANTERÍA EVOLUTIVA',{
   fontFamily:'system-ui',fontSize:'32px',fontStyle:'bold',color:'#f4e5be'
  }).setOrigin(.5).setDepth(1200);
  this.add.text(STAGE.width/2,190,'I = UN RECLUTA  |  II = DOS VETERANOS (core crea soldados; esto solo muestra arte)',{
   fontFamily:'system-ui',fontSize:'15px',color:'#d7e9d7'
  }).setOrigin(.5).setDepth(1200);
  for(const [i,item] of labels.entries()){
   const atlas=P08_IMAGES.find(x=>x.actorId===item.id);
   const y=489+(i===4?10:0);
   const sh=this.add.ellipse(item.x,y+3,item.id==='hound'?50:42,12,0x133932,.55).setDepth(5);
   const sprite=this.add.image(item.x,y,atlas.atlasKey,'idle-0')
     .setOrigin(.5,.92).setScale(item.scale).setDepth(y+5);
   // B1: 2 veteranos tienen columnas independientes. Nunca abarcar el panel vecino.
   const title=this.add.text(item.x,558,item.title,{
    fontFamily:'system-ui',fontSize:i===1||i===2?'20px':'17px',
    fontStyle:'bold',color:i>=3?'#f1d49e':'#ddf0d7'
   }).setOrigin(.5).setDepth(1200);
   this.views.push({sprite,sh,item,index:i,title,panelWidth:i===1||i===2?174:i===4?172:180});
  }
  this.help=this.add.text(STAGE.width/2,626,'',{
   fontFamily:'system-ui',fontSize:'16px',color:'#f4e4bc'
  }).setOrigin(.5).setDepth(1200);
  this.paintGuides();
  gallery=this;window.__SEMANTROPIC_P08={scene:this,artOnly:true,actors:labels.length,
   levelIVisualCount:1,levelIIVisualCount:2,coreInstalled:false};
  $('note').textContent='P08 · 4 PNG reales · 7 estados / 32 cuadros · identidad P03 conservada · sin daño';
 }
 paintBackdrop(){
  const g=this.graphics;g.clear();
  g.fillGradientStyle(0xa9ca8e,0xa7cc88,0x6e9a78,0x729d7a).fillRect(0,0,1280,768);
  for(let i=0;i<75;i++){
   const x=i*163%1280,y=260+i*197%460;
   g.fillStyle(i%2?0x386a53:0xcee0a0,.15).fillEllipse(x,y,22+i%5*7,4+i%3*2);
  }
  for(const [i,item] of labels.entries()){
   const panelWidth=i===1||i===2?174:i===4?172:180;
   g.fillStyle(0x23474b,.75).fillRoundedRect(item.x-panelWidth/2,253,panelWidth,288,14);
   g.lineStyle(2,i<3?0x9ac6b3:0xcfb991,.85)
    .strokeRoundedRect(item.x-panelWidth/2,253,panelWidth,288,14);
  }
 }
 paintGuides(){
  this.guides.clear();if(!cfg.guides)return;
  this.guides.lineStyle(1,0xfce2a6,.85);
  for(const v of this.views){
   const y=v.sprite.y;
   this.guides.strokeCircle(v.sprite.x,y,5);
   this.guides.lineBetween(v.sprite.x-20,y,v.sprite.x+20,y);
  }
 }
 update(_time,delta){
  if(!cfg.paused)cfg.time+=Math.min(delta/1000,.08);
  const count=P08_STATES[cfg.state],fps=cfg.state==='walk'?12:cfg.state==='attack'?14:9;
  const frame=(cfg.state==='walk'||cfg.state==='idle'||cfg.state==='blocked')?
   Math.floor(cfg.time*fps)%count:Math.min(count-1,Math.floor(cfg.time*fps));
  for(const v of this.views){
   const phase=v.index===2?1:0;
   const local=(cfg.state==='walk'||cfg.state==='idle'||cfg.state==='blocked')?
    (frame+phase)%count:Math.min(count-1,frame+phase);
   v.sprite.setFrame(cfg.state+'-'+local);
   const scale=cfg.worldHeight===80?v.item.scale:cfg.worldHeight/(v.item.id==='hound'?114:171);
   v.sprite.setScale(scale);
   v.sprite.setFlipX(v.index===2);
  }
  this.help.setText(cfg.state+' · cuadro '+frame+'/'+(count-1)+
   ' · escala juego · sólo animaciones de inspección (no eventos core)');
 }
}
function attach(){
 for(const b of document.querySelectorAll('[data-state]'))b.addEventListener('click',()=>{
  cfg.state=b.dataset.state;cfg.time=0;ui();
 });
 $('pause').addEventListener('click',()=>{cfg.paused=!cfg.paused;ui()});
 $('step').addEventListener('click',()=>{cfg.paused=true;cfg.time+=1/12;ui()});
 $('size').addEventListener('click',()=>{
  cfg.worldHeight=cfg.worldHeight===80?44:cfg.worldHeight===44?64:cfg.worldHeight===64?80:80;ui();
 });
 $('guides').addEventListener('click',()=>{cfg.guides=!cfg.guides;gallery?.paintGuides();ui()});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cfg.paused=true;ui()}});
 ui();
}
try{
 if(!window.Phaser||Phaser.VERSION!=='4.2.1')throw Error('Phaser 4.2.1 requerido');
 const canvas=document.createElement('canvas'),gl=canvas.getContext('webgl2',{antialias:true});
 if(!gl)throw Error('No hay WebGL2');
 attach();
 new Phaser.Game({type:Phaser.WEBGL,canvas,context:gl,parent:'stage',
  width:1280,height:768,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,
   width:1280,height:768},scene:[P08Review],audio:{noAudio:true}});
}catch(e){$('note').textContent='ERROR P08 '+e.message;console.error(e)}
