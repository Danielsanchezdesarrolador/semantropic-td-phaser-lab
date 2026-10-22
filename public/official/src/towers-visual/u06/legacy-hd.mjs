/**
 * SEMANTROPIC TD U06 B/C/D - HD preparation for preserved legacy tower PNGs.
 *
 * Important: Guardiana, Bombardera and Torre de Control have not yet been
 * implemented as buildable Phaser M01 towers. This is an immutable-source,
 * quality-controlled renderer intended for their future integration. It never
 * mounts them in the combat scene or modifies the protected Canvas campaign.
 *
 * A 3x raster with conservative unsharp luminance gives cleaner presentation
 * at zoom, but DOES NOT manufacture detail absent from original PNG art.
 */
export const U06_LEGACY_TOWER_PRESETS=Object.freeze({
 guardian: Object.freeze({key:'guardiana',url:'/assets/torre_guardiana.png',accent:0x91dbd0}),
 artillery: Object.freeze({key:'bombardera',url:'/assets/torre_bombardera.png',accent:0xeac38c}),
 control: Object.freeze({key:'control',url:'/assets/torre_control.png',accent:0x9dcce4})
});
export const U06_LEGACY_HD_VERSION='u06-bcd-3x-preserved-png-v1';
export function enhanceLegacyTowerCanvas(image,{factor=3,sharpness=.21,maxDimension=4096}={}){
 if(!image||!(image.naturalWidth||image.width)||!(image.naturalHeight||image.height))
  throw Error('U06 requires a decoded source PNG');
 if(!Number.isFinite(factor)||factor<1||factor>3||!Number.isFinite(sharpness)||sharpness<0||sharpness>.35)
  throw Error('U06 quality settings outside safe bounds');
 const width=image.naturalWidth||image.width,height=image.naturalHeight||image.height;
 const density=Math.min(factor,maxDimension/Math.max(width,height));
 if(density<1)throw Error('U06 PNG too large for safe atlas');
 const w=Math.round(width*density),h=Math.round(height*density);
 if(w*h>16000000)throw Error('U06 excessive presentation canvas');
 const c=document.createElement('canvas');c.width=w;c.height=h;
 const ctx=c.getContext('2d',{alpha:true,willReadFrequently:true});
 if(!ctx)throw Error('U06 Canvas2D unavailable');
 ctx.clearRect(0,0,w,h);
 ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
 ctx.drawImage(image,0,0,width,height,0,0,w,h);
 const frame=ctx.getImageData(0,0,w,h),pixels=frame.data,old=new Uint8ClampedArray(pixels);
 // Preserve alpha, avoid ringing across the painted silhouette. The method is
 // mild and purposefully confined to well-covered interior pixels.
 for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){
  const p=(y*w+x)*4;if(old[p+3]<220)continue;
  const ns=[p-4,p+4,p-w*4,p+w*4];
  if(ns.some(n=>old[n+3]<190))continue;
  for(let channel=0;channel<3;channel++){
   const base=old[p+channel],neighbor=ns.reduce((t,n)=>t+old[n+channel],0)/4;
   pixels[p+channel]=Math.max(0,Math.min(255,base+(base-neighbor)*sharpness));
  }
 }
 ctx.putImageData(frame,0,0);
 return {canvas:c,width:w,height:h,sourceWidth:width,sourceHeight:height,
  density,version:U06_LEGACY_HD_VERSION};
}
export async function preloadLegacyTowerHD(url,opts){
 const img=new Image();img.decoding='async';
 img.src=url;
 await img.decode();
 return enhanceLegacyTowerCanvas(img,opts);
}
/** For future integration only: retain identical logical footprint by
 * mounting HD textures at originalScale / density. Never touch combat stats.
 */
export function legacyHDScale(originalWorldScale,hd){
 if(!Number.isFinite(originalWorldScale)||originalWorldScale<=0||!hd?.density)
  throw Error('U06 missing source world scale');
 return originalWorldScale/hd.density;
}
