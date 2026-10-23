/** SEMANTROPIC TD · R5 "no borders" landscape panorama.
 * FIT continues rendering the complete 1280x768 authoritative map.
 * The visual-only background extends the ORIGINAL ground/road texture into
 * the otherwise empty FIT side gutters; it NEVER stretches gameplay.
 *
 * No capture of the WebGL drawing buffer, no per-frame readback, no gameplay
 * camera changes. Redrawn on resize / fullscreen and after scene mount only.
 */
export const R5_PANORAMA_VERSION='r5-edge-extension-original-map-textures-v1';
const WORLD=Object.freeze({width:1280,height:768});
const PREMIUM_M01='maps/m01/r7/dawn-plateau/v1';
const PREMIUM_M01_SCENIC='maps/m01/r7/dawn-plateau/scenic-gutters/hf2';
const GROUND_M01='maps/m01/aurora-v3/viva/ground';
const ROAD_M01='maps/m01/aurora-v3/viva/road';
const TERRAIN_M02='maps/m02/farmland/r3-b2';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export function attachR5Panorama({stage=document.getElementById('stage')}={}){
 if(!stage)throw Error('R5 stage missing');
 const node=document.createElement('canvas');
 node.id='viewportBackdrop';
 node.setAttribute('aria-hidden','true');
 node.width=1;node.height=1;
 stage.prepend(node);
 let scene=null,mapId=null,drawing=false,scheduled=0,drawCount=0,lastReport=null;
 function texture(key){
  if(!scene?.textures?.exists(key))return null;
  return scene.textures.get(key).getSourceImage();
 }
 function panelTexture(){
  if(mapId===1){
   // Use scenic plate (without gate/shrine/bridge/pads), never reflection of landmarks.
   const scenic=texture(PREMIUM_M01_SCENIC);
   if(scenic)return [scenic];
   const premium=texture(PREMIUM_M01);
   if(premium)return [premium];
   const ground=texture(GROUND_M01),road=texture(ROAD_M01);
   return ground?[ground,...(road?[road]:[])]:[];
  }
  if(mapId===2){
   const art=texture(TERRAIN_M02);
   return art?[art]:[];
  }
  if(mapId===3){const art=texture('maps/m03/whispering-forest/scenic/v1');return art?[art]:[];}
  return [];
 }
 function paintTexture(ctx,img,where,dest){
  // srcRect and destRect represent the same Y coordinate range.
  if(!img?.width||!img?.height||dest.width<=0||dest.height<=0||where.width<=0||where.height<=0)return;
  ctx.drawImage(img,where.left,where.top,where.width,where.height,
   dest.left,dest.top,dest.width,dest.height);
 }
 function paintMirror(ctx,img,sourceRect,destRect,axis){
  if(destRect.width<=0||destRect.height<=0)return;
  ctx.save();
  if(axis==='x'){
   ctx.translate(destRect.left+destRect.width,0);ctx.scale(-1,1);
   paintTexture(ctx,img,sourceRect,{...destRect,left:0});
  }else{
   ctx.translate(0,destRect.top+destRect.height);ctx.scale(1,-1);
   paintTexture(ctx,img,sourceRect,{...destRect,top:0});
  }
  ctx.restore();
 }
 function draw(){
  if(drawing)return;
  drawing=true;
  try{
   const src=panelTexture();
   const rect=stage.getBoundingClientRect();
   const actual=scene?.game?.canvas?.getBoundingClientRect();
   if(!src.length||!actual||rect.width<2||rect.height<2)return;
   // Pixel backing at max 2k horizontally, 1.25 DPR for mobile RAM.
   const dpr=clamp(Math.min(window.devicePixelRatio||1,1.25,2048/rect.width),.35,1.25);
   const w=Math.max(2,Math.round(rect.width*dpr)),h=Math.max(2,Math.round(rect.height*dpr));
   if(node.width!==w||node.height!==h){node.width=w;node.height=h;}
   const ctx=node.getContext('2d',{alpha:false});
   if(!ctx)return;
   const ratioX=w/rect.width,ratioY=h/rect.height;
   const mx=clamp((actual.left-rect.left)*ratioX,0,w);
   const my=clamp((actual.top-rect.top)*ratioY,0,h);
   const mw=clamp(actual.width*ratioX,0,w-mx);
   const mh=clamp(actual.height*ratioY,0,h-my);
   if(mw<2||mh<2)return;
   const left=mx,right=w-(mx+mw),top=my,bottom=h-(my+mh);
   ctx.fillStyle=mapId===1?'#80b77c':'#9cbe83';
   ctx.fillRect(0,0,w,h);
   ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
   for(const source of src){
    const width=source.width,height=source.height;
    // Center and edge strips use equal vertical projection -> continuous seam.
    paintTexture(ctx,source,{left:0,top:0,width,height},
      {left:mx,top:my,width:mw,height:mh});
    if(left>1){
     const sample=clamp(left/mw*width,2,width*.6);
     paintMirror(ctx,source,{left:0,top:0,width:sample,height},
      {left:0,top:my,width:left,height:mh},'x');
    }
    if(right>1){
     const sample=clamp(right/mw*width,2,width*.6);
     paintMirror(ctx,source,{left:width-sample,top:0,width:sample,height},
      {left:mx+mw,top:my,width:right,height:mh},'x');
    }
    if(top>1){
     const sample=clamp(top/mh*height,2,height*.6);
     paintMirror(ctx,source,{left:0,top:0,width,height:sample},
      {left:mx,top:0,width:mw,height:top},'y');
    }
    if(bottom>1){
     const sample=clamp(bottom/mh*height,2,height*.6);
     paintMirror(ctx,source,{left:0,top:height-sample,width,height:sample},
      {left:mx,top:my+mh,width:mw,height:bottom},'y');
    }
   }
   drawCount++;
   lastReport=Object.freeze({mapId,width:w,height:h,world:WORLD,
    gutterLeft:Math.round(left),gutterRight:Math.round(right),
    gutterTop:Math.round(top),gutterBottom:Math.round(bottom),
    painted:true,sourceCount:src.length,drawCount,
    scenicOnlyGutters:mapId===1?src[0]===texture(PREMIUM_M01_SCENIC):null});
   node.dataset.ready='true';
   node.dataset.map=String(mapId);
  }finally{drawing=false;}
 }
 function refresh(){
  if(scheduled)cancelAnimationFrame(scheduled);
  scheduled=requestAnimationFrame(()=>{scheduled=0;draw();});
 }
 function bind(nextScene,id){
  if(id!==1&&id!==2&&id!==3)throw Error('R5 unknown map');
  scene=nextScene;mapId=id;
  refresh();
  return true;
 }
 function dispose(){
  if(scheduled)cancelAnimationFrame(scheduled);
  scene=null;mapId=null;node.remove();
 }
 return Object.freeze({version:R5_PANORAMA_VERSION,bind,refresh,dispose,
  get report(){return lastReport},get canvas(){return node}});
}
