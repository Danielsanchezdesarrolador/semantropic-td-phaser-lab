/** Isolated art review; no campaign scene, build input, economy, saves or waves. */
import{mountM07Artwork}from'../cartoon01/frost-world.mjs';
const map=(await(await fetch('../../../../data/maps.v5.json')).json()).find(m=>m.id===7),showOverlay=new URL(location.href).searchParams.get('overlay')==='1';
function markers(c){c.beginPath();for(const path of[map.path,...map.branches]){path.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));}c.strokeStyle='#f9f4fc';c.lineWidth=1;c.stroke();for(const p of[map.path,...map.branches].flat()){c.beginPath();c.arc(...p,1.7,0,Math.PI*2);c.fillStyle='#ed4cce';c.fill();}for(const p of map.spots){const x=p.cx*64+32,y=p.cy*64+32;c.beginPath();c.ellipse(x,y,44,27,0,0,Math.PI*2);c.strokeStyle='#fa4dcf';c.lineWidth=1.5;c.stroke();c.fillStyle='#ff4ccf';c.fillRect(x-2,y-2,4,4);}}
class FrostReview extends Phaser.Scene{
 create(){this.art=mountM07Artwork(this,map,{baseline:new URL(location.href).searchParams.has('baseline')});this.overlay=null;if(showOverlay){const cv=Object.assign(document.createElement('canvas'),{width:2560,height:1536}),c=cv.getContext('2d');c.scale(2,2);markers(c);this.textures.addCanvas('maps/m07/qa-overlay',cv);this.overlay=this.add.image(0,0,'maps/m07/qa-overlay').setOrigin(0).setScale(.5).setDepth(20000);}
  window.__SEMANTROPIC_M07_ART_REVIEW={version:this.art.version,plan:this.art.plan,qa:this.art.metadata,scene:this,artOnly:true,overlay:showOverlay,overlayWaypoints:showOverlay?542:0,overlayPads:showOverlay?9:0};
  this.paintMargins=()=>{};
  this.onResize=()=>requestAnimationFrame(this.paintMargins);this.scale.on('resize',this.onResize);this.onResize();this.events.once('shutdown',()=>{this.scale.off('resize',this.onResize);this.art.destroy();if(this.overlay){this.overlay.destroy();this.textures.remove('maps/m07/qa-overlay');}delete window.__SEMANTROPIC_M07_ART_REVIEW;});
 }
}
const canvas=document.createElement('canvas'),gl=canvas.getContext('webgl2',{alpha:false,antialias:true});if(!gl||!(gl instanceof WebGL2RenderingContext))throw Error('WebGL2 requerido para revisar M07');
new Phaser.Game({type:Phaser.WEBGL,canvas,context:gl,parent:'stage',width:1280,height:768,backgroundColor:'#c8e6f5',scene:FrostReview,render:{antialias:true,pixelArt:false},scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH}});
