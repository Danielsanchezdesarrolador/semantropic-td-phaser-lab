/** Static multiscale contour sculpture. Canonical travel data is never an input to mutation. */
export function sculptRim(mask,plan,fallX){
 const c=mask.getContext('2d'),w=mask.width,h=mask.height,source=c.getImageData(0,0,w,h),result=c.createImageData(w,h),density=w/1280;
 const sx=Float32Array.from({length:w},(_,i)=>Math.sin(i/density/159)),sy=Float32Array.from({length:h},(_,i)=>Math.sin(i/density/97)),dx=Float32Array.from({length:h},(_,i)=>7*Math.sin(i/density/47)+4*Math.sin(i/density/19)),dy=Float32Array.from({length:w},(_,i)=>6*Math.sin(i/density/41)+3*Math.sin(i/density/19));let changed=0;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const wx=x/density,wy=y/density;let strength=Math.min(1,wx/24,(1280-wx)/24,wy/24,(768-wy)/24);
  for(const p of plan.pads){const r=Math.hypot((wx-p.x)/75,(wy-p.y)/53);if(r<1.25)strength=Math.min(strength,Math.max(0,(r-.8)/.45));}
  for(const side of[-1,1]){const r=Math.hypot(wx-(fallX+side*47),wy-422);if(r<26)strength=Math.min(strength,Math.max(0,(r-12)/14));}
  const px=Math.max(0,Math.min(w-1.001,x+(dx[y]+3*sx[x]*sy[y])*density*strength)),py=Math.max(0,Math.min(h-1.001,y+(dy[x]+2*sx[x]*sy[y])*density*strength)),ix=Math.floor(px),iy=Math.floor(py),tx=px-ix,ty=py-iy;
  const at=(xx,yy)=>source.data[(yy*w+xx)*4+3],a=Math.round((at(ix,iy)*(1-tx)+at(ix+1,iy)*tx)*(1-ty)+(at(ix,iy+1)*(1-tx)+at(ix+1,iy+1)*tx)*ty),k=(y*w+x)*4;
  result.data[k]=result.data[k+1]=result.data[k+2]=255;result.data[k+3]=a;if((a>240)!==(source.data[k+3]>240))changed++;
 }
 c.putImageData(result,0,0);return{changedPixels:changed,method:'bounded-multiscale-erosion-with-pad-and-cascade-abutment-locks',maxDisplacement:{x:14,y:11}};
}
