/** TORRES T09 UI component showroom ONLY, artificial DTO quotes; no playable gameplay. */
import {TOWER_ART_V2} from '../catalog.mjs';
import {getContextMenuVisualSpec} from './spec.mjs';
import {mountT09Presenter} from './presenter.mjs';
const W=1280,H=768,$=id=>document.getElementById(id);
const pads=[
 {x:130,y:222},{x:370,y:246},{x:625,y:207},{x:910,y:240},
 {x:1138,y:393},{x:822,y:525},{x:470,y:506},{x:158,y:524}];
const states={gold:220,mode:'preparation',selected:null,towers:new Map(),serial:0,presenter:null,scene:null,viewport:null};
const qCost={infantry:117,sniper:163,upgrade:159}; // EXPLICIT FIXTURE, NOT CANONICAL CORE COSTS.
const notice=s=>{$('status').textContent=s};
const tower=(i)=>states.towers.get(i)??null;
function quoted(i,family){
 if(tower(i))return {ok:false,reason:'OCCUPIED'};
 const cost=qCost[family];return states.gold>=cost?{ok:true,cost}:{ok:false,reason:'INSUFFICIENT_GOLD',cost,gold:states.gold,message:'Oro insuficiente (demo)'};
}
function quotes(i){
 const t=tower(i);
 return {buildInfantry:quoted(i,'infantry'),buildSniper:quoted(i,'sniper'),
  upgrade:t?(t.level===2?{ok:false,reason:'TECH_LOCKED',message:'Nivel máximo'}:
   states.gold>=qCost.upgrade?{ok:true,cost:qCost.upgrade,toLevel:2}:{ok:false,reason:'INSUFFICIENT_GOLD',cost:qCost.upgrade,message:'Oro insuficiente'}):{ok:false,reason:'EMPTY'},
  sell:t?{ok:true,refund:t.level===2?144:76}:{ok:false,reason:'EMPTY'}};
}
function browserRect(){
 const container=$('root').getBoundingClientRect(),cnv=states.scene?.game?.canvas?.getBoundingClientRect();
 const width=container.width,height=container.height;
 // reserve actual toolbar and status footprint, not a hardcoded world/game resolution.
 const header=$('toolbar').getBoundingClientRect(),footer=$('status').getBoundingClientRect();
 return {left:Math.max(8,cnv?cnv.left-container.left+8:8),top:Math.max(8,header.bottom-container.top+7),
 right:Math.min(width-8,cnv?cnv.right-container.left-8:width-8),bottom:Math.min(height-8,footer.top-container.top-7)};
}
function screenOf(world){
 const host=$('root').getBoundingClientRect(),canvas=states.scene.game.canvas.getBoundingClientRect();
 return {x:canvas.left-host.left+(world.x/W)*canvas.width,y:canvas.top-host.top+(world.y/H)*canvas.height};
}
function refresh(){
 if(states.selected===null||!states.scene||!states.presenter)return;
 const i=states.selected,t=tower(i),p=pads[i];
 const spec=getContextMenuVisualSpec({socket:{index:i,socketId:'t09-proxy-'+i},tower:t,quotes:quotes(i),
  mode:states.mode,permissions:{canRally:true,canInspect:true},worldPoint:p,rangeWorld:t?.family==='sniper'?175:null,
  revision:states.serial});
 const result=states.presenter.update(spec,{anchorScreen:screenOf(p),viewportSafeRect:browserRect(),nodeDiameter:54});
 if(result&&!result.fits)notice('Área segura demasiado pequeña, reduce controles de vista. Esto es solo una demo.');
 states.scene.drawScene();
}
function choose(i){
 if(states.mode==='awaiting-rally-selection'){
  states.mode='preparation';notice('DEMO: punto de reunión seleccionado; no se llamó al core.');
 }
 states.selected=i;refresh();
}
function intent(ev){
 const i=ev.socketIndex;
 if(i!==states.selected)return;
 if(ev.action==='close'){states.presenter.clear();states.selected=null;states.scene.drawScene();return;}
 if(['paused','victory','defeat'].includes(states.mode))return;
 const q=quotes(i);
 const actions={
  build_infantry:()=>{if(!q.buildInfantry.ok)return;states.gold-=q.buildInfantry.cost;states.towers.set(i,{id:'fixture-'+(++states.serial),family:'infantry',level:1})},
  build_sniper:()=>{if(!q.buildSniper.ok)return;states.gold-=q.buildSniper.cost;states.towers.set(i,{id:'fixture-'+(++states.serial),family:'sniper',level:1})},
  upgrade:()=>{if(!q.upgrade.ok)return;states.gold-=q.upgrade.cost;states.towers.get(i).level=2},
  sell:()=>{if(!q.sell.ok)return;states.gold+=q.sell.refund;states.towers.delete(i)},
  set_rally:()=>{if(tower(i)?.family!=='infantry')return;states.mode='awaiting-rally-selection'},
  inspect:()=>{}
 };
 if(!actions[ev.action])return;
 actions[ev.action]();states.serial++;
 notice('SIMULACIÓN VISUAL: intención '+ev.action+'. C1-D7 debe volver a cotizar y ejecutar el core.');
 refresh();
}
class Showroom extends Phaser.Scene{
 constructor(){super('T09Component');this.views=[];this.padGraphics=null;}
 preload(){
  for(const m of TOWER_ART_V2)this.load.svg(m.assetId,
   new URL('../../../art/towers/'+m.family+'/level-'+m.level+'.svg',import.meta.url).href,{width:360,height:420});
 }
 create(){
  const gl=this.game.renderer?.gl;
  if(!gl||typeof WebGL2RenderingContext==='undefined'||!(gl instanceof WebGL2RenderingContext))
   throw Error('El renderizador Phaser no es WebGL2');
  this.land=this.add.graphics().setDepth(-99);this.padGraphics=this.add.graphics().setDepth(-10);
  this.drawLandscape();
  this.views=[];
  this.input.on('pointerdown',p=>{
   const near=pads.map((v,i)=>({i,d:Math.hypot(v.x-p.x,v.y-p.y)})).sort((a,b)=>a.d-b.d)[0];
   if(near?.d<=70)choose(near.i);else if(states.selected!==null){states.presenter.clear();states.selected=null;this.drawScene();}
  });
  states.scene=this;
  states.presenter=mountT09Presenter($('root'),{onIntent:intent});
  this.drawScene();choose(3);
  notice('SHOWROOM / COTIZACIONES FICTICIAS. La integración real pertenece a Dirección General C1-D7.');
 }
 drawLandscape(){
  this.land.clear().fillGradientStyle(0xb5d896,0xb5d896,0x7caa87,0x7caa87,1).fillRect(0,0,W,H);
  this.land.lineStyle(90,0xeed19a,.95).beginPath().moveTo(-90,445).lineTo(270,390).lineTo(505,450).lineTo(770,375).lineTo(1050,420).lineTo(1350,370).strokePath();
  this.land.lineStyle(3,0xb68d5a,.65).beginPath().moveTo(-80,396).lineTo(270,345).lineTo(505,407).lineTo(770,332).lineTo(1050,375).lineTo(1320,326).strokePath();
  this.add.text(W/2,106,'T09 · NODOS CONTEXTUALES / COMPONENTE AISLADO',
   {fontFamily:'Georgia,serif',fontSize:'28px',color:'#244b62',fontStyle:'bold'}).setOrigin(.5);
  this.add.text(W/2,138,'OCHO PLATAFORMAS PROXY · NO M01 / NO ECONOMÍA CORE / SIN MERGE LIVE',
   {fontFamily:'system-ui',fontSize:'15px',color:'#244953'}).setOrigin(.5);
 }
 drawScene(){
  if(!this.padGraphics)return;
  this.padGraphics.clear();this.views.forEach(v=>v.destroy());this.views=[];
  for(let i=0;i<pads.length;i++){
   const p=pads[i],t=tower(i);
   this.padGraphics.fillStyle(0x23526d,.21).fillEllipse(p.x,p.y+7,108,28);
   this.padGraphics.fillStyle(i===states.selected?0xf6deb1:0xadae9c,.98).fillEllipse(p.x,p.y,102,32);
   this.padGraphics.lineStyle(3,i===states.selected?0x1e6b75:0xe4c79a,.91).strokeEllipse(p.x,p.y,102,32);
   if(t){
    const meta=TOWER_ART_V2.find(m=>m.family===t.family&&m.level===t.level);
    if(meta)this.views.push(this.add.image(p.x,p.y,meta.assetId).setOrigin(.5,.93).setScale(meta.worldScaleProposal).setDepth(p.y+3));
   }
   this.views.push(this.add.text(p.x,p.y+26,String(i+1)+'/8',
    {fontFamily:'system-ui',fontSize:'13px',color:'#275167',fontStyle:'bold'}).setOrigin(.5).setDepth(900));
  }
  $('meta').textContent='DEMO: oro '+states.gold+' · '+states.mode+' · selección '+(states.selected===null?'ninguna':states.selected+1);
 }
}
try{
 if(!window.Phaser||Phaser.VERSION!=='4.2.1')throw Error('Requiere Phaser 4.2.1');
 const canvas=document.createElement('canvas');
 const gl=canvas.getContext('webgl2',{antialias:true});
 if(!gl)throw Error('No hay WebGL2 disponible para la galería T09');
 new Phaser.Game({type:Phaser.WEBGL,canvas,context:gl,width:W,height:H,parent:'stage',backgroundColor:'#86ad8b',
  scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:W,height:H},
  audio:{noAudio:true},scene:[Showroom]});
 const listen=(id,cb)=>$(id).addEventListener('click',cb);
 listen('reset',()=>{states.gold=220;states.mode='preparation';states.towers.clear();states.serial++;refresh()});
 listen('low',()=>{states.gold=0;states.serial++;refresh()});
 listen('fund',()=>{states.gold=500;states.serial++;refresh()});
 listen('pause',()=>{states.mode=states.mode==='paused'?'preparation':'paused';states.serial++;refresh()});
 listen('end',()=>{states.mode='victory';states.serial++;refresh();states.presenter.clear();states.selected=null;states.scene.drawScene()});
 listen('wave',()=>{states.mode='wave';states.serial++;refresh()});
 listen('size',()=>{states.serial++;refresh()});
 window.addEventListener('resize',()=>{if(states.scene)refresh()});
 window.__SEMANTROPIC_T09={status:'COMPONENT_DEMO_NOT_GAMEPLAY',stage:'T09',getVisualState:()=>({
  mode:states.mode,goldFixture:states.gold,selected:states.selected,nodeCount:states.presenter?.current?.nodes?.length??0})};
}catch(e){notice('T09 componente ERROR: '+e.message);console.error(e)}
