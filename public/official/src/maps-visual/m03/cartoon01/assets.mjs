/** Original forest sprites; shared approved generic M02 turf/rock are read-only. */
import {extractForestProps} from '../forest-art.mjs';
export const SOURCES=Object.freeze({forest:new URL('../../../../art/maps/m03/cartoon01/forest-atlas-original.png',import.meta.url).href,materials:new URL('../../../../art/maps/m02/cartoon03/materials-original.png',import.meta.url).href,cliffs:new URL('../../../../art/maps/m02/cartoon03/cliffs-original.png',import.meta.url).href});
const active=typeof document!=='undefined'&&new URL(location.href).searchParams.get('map')==='3';
const load=url=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(Error('M03 cartoon source missing '+url));im.src=url;});
const loaded=active?await Promise.all(Object.values(SOURCES).map(load)):null;
let cached;
export function forestAssets(){
 if(cached)return cached;if(!loaded)throw Error('M03 cartoon load barrier missing');
 // Existing six-component alpha extractor labels by cell; names remapped only.
 const source=extractForestProps(loaded[0]),sprites={oak:source.oak,arch:source.tree,fern:source.ruins,log:source.waterfall,rocks:source.undergrowth,rune:source.beacon};
 const atlas=Object.assign(document.createElement('canvas'),{width:2048,height:640}),c=atlas.getContext('2d');c.imageSmoothingQuality='high';let x=4;const frames=[],sizes={oak:448,arch:320,fern:256,log:256,rocks:240,rune:240};
 for(const[name,im]of Object.entries(sprites)){const w=Math.min(im.width,sizes[name]),h=Math.round(im.height*w/im.width);if(x+w>2048||h+8>640)throw Error('M03 forest atlas budget');c.drawImage(im,x,4,w,h);frames.push({name,x,y:4,width:w,height:h});x+=w+8;}
 return cached={canvas:atlas,frames,sprites,materials:loaded[1],cliffs:loaded[2]};
}
