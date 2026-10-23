/** M01-only texture preparation. Originals and alpha silhouettes stay intact.
 * Executed at mount / first size use, never in the scene update loop. */
export const DEFINITION_VERSION='m01-texture-definition-v1';
export function crispContext(canvas){
 const c=canvas.getContext('2d',{willReadFrequently:true});
 c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';return c;
}
export function defineSurface(v,{contrast=1.06,sharpness=.3}={}){
 const c=crispContext(v),frame=c.getImageData(0,0,v.width,v.height),a=frame.data,original=new Uint8ClampedArray(a),w=v.width,h=v.height;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const p=(y*w+x)*4;if(original[p+3]<16)continue;
  const left=x>0&&original[p-1]>=16,right=x<w-1&&original[p+7]>=16,up=y>0&&original[p-w*4+3]>=16,down=y<h-1&&original[p+w*4+3]>=16;
  const count=Number(left)+Number(right)+Number(up)+Number(down);
  for(let channel=0;channel<3;channel++){
   const sum=(left?original[p-4+channel]:0)+(right?original[p+4+channel]:0)+(up?original[p-w*4+channel]:0)+(down?original[p+w*4+channel]:0);
   const base=original[p+channel],edge=count?base-sum/count:0;
   // Limited correction avoids bright halos and retains the authored material palette.
   const detail=Math.max(-12,Math.min(12,edge*sharpness));
   a[p+channel]=Math.max(0,Math.min(255,(base-128)*contrast+128+detail));
  }
  // Alpha is deliberately never written: no change to silhouette or clearance.
 }
 c.putImageData(frame,0,0);return v;
}
export function prepareProp(source,widthWorld){
 // At least two texels per world unit, never upscale the original source.
 const width=Math.min(source.width,Math.ceil(widthWorld*2)),height=Math.max(1,Math.round(source.height*width/source.width));
 const v=Object.assign(document.createElement('canvas'),{width,height});
 crispContext(v).drawImage(source,0,0,width,height);
 return defineSurface(v,{contrast:1.07,sharpness:.42});
}
