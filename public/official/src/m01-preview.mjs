// PH-01 P1 prototype viewer: REAL Canvas V5 M01 geometry/waves in Phaser.
// Warning: no purchases or tower combat yet. This is deliberately a no-defense
// route, spawn and escape integration fixture, not a "complete playable M01".
import {validateCampaign,M01PathSmokeModel} from './m01-model.mjs';
import {installDeluxeArt,artInfo} from './m01-deluxe-art.mjs';
const $=(id)=>document.getElementById(id), W=1280,H=768;
let SOURCE=null;
const state={game:null,scene:null,model:null,paused:false,speed:1,started:false,routeDebug:false};
const messages=[];
function announce(s){$('message').textContent=s;messages.push(s);if(messages.length>14)messages.shift();}
function syncHUD(m){$('lives').textContent=m.lives;$('gold').textContent=m.gold;$('wave').textContent=m.wave+' / 5';$('live').textContent=m.enemies.size;$('spawns').textContent=m.spawnQueue.length;$('leaks').textContent=m.escapedCount;}
async function loadContract(){
 const [a,b]=await Promise.all([fetch('./data/maps.v5.json',{cache:'no-store'}),fetch('./data/campaign140.v5.json',{cache:'no-store'})]);
 if(!a.ok||!b.ok)throw Error('No se puede cargar datos V5: '+a.status+'/'+b.status);
 const [maps,campaign]=await Promise.all([a.json(),b.json()]);
 const proof=validateCampaign(maps,campaign);
 return {map:maps[0],waves:campaign.maps[0],proof};
}
function drawPath(g,pts,width,color,alpha=1){
 g.lineStyle(width,color,alpha);g.beginPath();g.moveTo(...pts[0]);for(let i=1;i<pts.length;i++)g.lineTo(...pts[i]);g.strokePath();
}
function decoratedMeadow(scene,map){
 const g=scene.add.graphics().setDepth(-5000);
 g.fillStyle(0x577f65,1).fillRect(0,0,W,H);
 let seed=10012026;function rand(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}
 function farFromRoad(x,y){
  let min=Infinity;const pts=map.path;
  for(let j=1;j<pts.length;j+=3){const a=pts[j-1],b=pts[j];const dx=b[0]-a[0],dy=b[1]-a[1],den=dx*dx+dy*dy;
   const f=Math.min(1,Math.max(0,((x-a[0])*dx+(y-a[1])*dy)/den));const d=Math.hypot(x-a[0]-dx*f,y-a[1]-dy*f);min=Math.min(min,d);}
  return min>90;
 }
 for(let i=0;i<750;i++){const x=rand()*W,y=rand()*H;if(!farFromRoad(x,y))continue;
  const scale=1+rand()*5;g.fillStyle(i%5===0?0xb0c68d:0x346859,.38);
  g.fillEllipse(x,y,scale*2.5,scale*.7);
  if(i%17===0){g.fillStyle(0xe4d1a5,.7);g.fillCircle(x,y-3,2.5);}
 }
 // THE V5 MAP01 path is drawn from its 133 EXACT coordinate vertices,
 // never from the synthetic T2-C/T3B waypoint path.
 drawPath(g,map.path,126,0x304d48,1);
 drawPath(g,map.path,113,0x8a8161,1);
 drawPath(g,map.path,101,0xc9b28e,1);
 drawPath(g,map.path,87,0xb5a27d,1);
 for(const [cx,cy] of [[38,344],[1209,412]]){g.fillStyle(0x9bbeb1,.6).fillEllipse(cx,cy,26,17);}
 const highlight=scene.add.graphics().setDepth(-1800);
 map.spots.forEach((pad,i)=>{
  const x=pad.cx*64+32,y=pad.cy*64+32;
  highlight.fillStyle(0x163f4b,.73).fillEllipse(x,y+12,82,35);
  highlight.lineStyle(4,0xb8b49a,1).strokeEllipse(x,y+8,83,37);
  highlight.fillStyle(0x708c86,.94).fillEllipse(x,y,77,34);
  highlight.lineStyle(2,0xe5c692,.95).strokeEllipse(x,y,70,29);
  scene.add.text(x,y-3,String(i+1),{fontFamily:'system-ui',fontStyle:'bold',fontSize:'17px',color:'#ffefbf'}).setOrigin(.5).setDepth(y);
 });
 const line=scene.add.graphics().setDepth(4500);
 return line;
}
class Map01Official extends Phaser.Scene{
 constructor(){super('Map01Official');this.sprites=new Map();this.acc=0;}
 preload(){this.load.image('warrior_v5','../assets/orco_guerrero.png');}
 create(){
  state.scene=this;
  const {map,waves}=SOURCE;
  state.model=new M01PathSmokeModel(map,waves);
  const gl=this.game.renderer?.gl;
  const yes=typeof WebGL2RenderingContext!=='undefined'&&gl instanceof WebGL2RenderingContext;
  $('backend').textContent=Phaser.VERSION+' / '+(yes?'WebGL2 real':'WebGL2 NO confirmado');
  const before=new URLSearchParams(location.search).get('art')==='before';
  this.pathDebug=before?decoratedMeadow(this,map):installDeluxeArt(this,map);
  $('artToggle').textContent=before?'Ver Deluxe':'Ver antes';
  $('contract').textContent+=(before?' · Baseline PH-01':` · ${artInfo().changePercent}% camino · PH-02B Deluxe`);
  $('intro').hidden=true;syncHUD(state.model);
  this.input.on('pointerdown',p=>{
   const xx=p.x,yy=p.y;const pad=map.spots.find(s=>Math.hypot(xx-(s.cx*64+32),yy-(s.cy*64+32))<54);
   if(pad){$('selection').hidden=false;$('selection').textContent='Plataforma ('+pad.cx+','+pad.cy+') · Construcción no portada aún. No compra ni gasto simulado.';}
   else $('selection').hidden=true;
  });
  announce('M01 real: 133 vértices, 8 plataformas, arte '+(before?'PH-01':'Deluxe')+'. Inicia ola 1.');
 }
 update(_time,delta){
  const m=state.model;if(!m||state.paused||m.ended||!m.active)return;
  let time=Math.min(delta/1000,.24)*state.speed;
  this.acc+=time;
  while(this.acc>=.05){this.acc-=.05;const events=m.tick(.05);
   for(const event of events)if(event.type==='wave_clear'){
      announce('Oleada '+event.wave+' sin enemigos vivos. Puedes iniciar la siguiente.');$('spawn').disabled=false;
    }else if(event.type==='defeat'){announce('Derrota natural sin defensas, vida 0. Las torres aún no se han portado.');$('spawn').disabled=true;}
  }
  const seen=new Set();
  for(const e of m.actors){
   seen.add(e.id);
   let o=this.sprites.get(e.id);
   if(!o){
    if(e.type==='warrior'&&this.textures.exists('warrior_v5')){
     o=this.add.image(e.x,e.y,'warrior_v5').setScale(.8).setOrigin(.5,.87);
    }else{
     // Documented visual placeholder for "Perro de Caza": NO production sprite yet.
     o=this.add.triangle(e.x,e.y-9,-19,19,0,-23,19,19,0xa6dca0).setStrokeStyle(3,0x294b45);
    }
    this.sprites.set(e.id,o);
   }
   o.setPosition(e.x,e.y-(e.type==='hound'?13:2)).setDepth(e.y);
   if(o.setFlipX)o.setFlipX(Math.cos(e.heading)<0);
  }
  for(const [id,object] of this.sprites)if(!seen.has(id)){object.destroy();this.sprites.delete(id);}
  syncHUD(m);
  if(state.routeDebug){this.pathDebug.clear();this.pathDebug.fillStyle(0x36ffff,.8);
    for(const [i,p] of m.map.path.entries())if(i%4===0)this.pathDebug.fillCircle(p[0],p[1],3);
  }else this.pathDebug.clear();
 }
}
(async function bootstrap(){
 try{
  const {map,waves,proof}=await loadContract();
  $('contract').textContent=proof.maps+' mapas · '+proof.waves+' oleadas · '+proof.map01PathPoints+' puntos M01';
  if(!window.Phaser||Phaser.VERSION!=='4.2.1')throw Error('Phaser 4.2.1 requerido: '+(window.Phaser?.VERSION||'no cargado'));
  const canvas=document.createElement('canvas'),gl=canvas.getContext('webgl2',{alpha:false,antialias:true});
  if(!gl||!(gl instanceof WebGL2RenderingContext))throw Error('No disponible contexto WebGL2 auténtico. No se utilizará fallback Canvas silencioso.');
  SOURCE={map,waves};
  const game=new Phaser.Game({
   type:Phaser.WEBGL,canvas,context:gl,parent:'stage',width:W,height:H,
   backgroundColor:'#35624f',antialias:true,
   scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:W,height:H},
   audio:{noAudio:true},scene:[Map01Official]
  });
  // This is isolated metadata carried through Game config, not a gameplay singleton.
  state.game=game;
  const bind=(id,fn)=>$(id).addEventListener('click',fn);
  bind('spawn',()=>{if(!state.model?.startWave())return;$('spawn').disabled=true;announce('Oleada '+state.model.wave+' real (Canvas V5) iniciada. Sin torres: prueba de recorrido/fuga.');syncHUD(state.model);});
  bind('pause',()=>{state.paused=!state.paused;$('pause').textContent=state.paused?'▶ Reanudar':'Ⅱ Pausa';});
  bind('speed',()=>{state.speed=state.speed===1?2:1;$('speed').textContent='x'+state.speed;});
  bind('artToggle',()=>{const v=new URL(location.href);v.searchParams.set('art',new URLSearchParams(location.search).get('art')==='before'?'deluxe':'before');location.assign(v.toString());});
  bind('debug',()=>{state.routeDebug=!state.routeDebug;$('debug').textContent=state.routeDebug?'Ocultar nodos':'Ver nodos';});
  bind('close',()=>{$('selection').hidden=true;});
  bind('reset',()=>{location.reload();});
 }catch(err){
  $('intro').textContent='ERROR de arranque: '+err.message;
  $('intro').hidden=false;console.error('PH01 scene failed',err);
 }
})();
