/** Visual inspection entry only; no gameplay, build input, waves or economy. */
import {mountM04Artwork} from '../river-art.mjs';
const maps=await(await fetch('../../../../data/maps.v5.json')).json();
const map=maps.find(m=>m.id===4),baseline=new URL(location.href).searchParams.get('baseline')==='1';
if(baseline)document.querySelector('aside').textContent='M04 · esquema canónico de referencia; no era un nivel Phaser';
class RiverArtReview extends Phaser.Scene{
 create(){const art=mountM04Artwork(this,map,{baseline});window.__SEMANTROPIC_M04_ART_REVIEW={version:art.version,plan:art.plan,qa:art.qa,scene:this,artOnly:true};}
}
const canvas=document.createElement('canvas'),gl=canvas.getContext('webgl2',{alpha:false,antialias:true});
if(!gl||!(gl instanceof WebGL2RenderingContext))throw Error('WebGL2 requerido para revisar M04');
new Phaser.Game({type:Phaser.WEBGL,canvas,context:gl,parent:'stage',width:1280,height:768,backgroundColor:'#183d43',scene:RiverArtReview,render:{antialias:true,pixelArt:false},scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH}});
