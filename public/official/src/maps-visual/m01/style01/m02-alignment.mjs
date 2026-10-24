/** M01 reuses only the approved M02 oak silhouette and generic grass material.
 * The versioned M02 originals are read-only; no rural props are registered. */
export const ALIGNMENT_VERSION='m01-align-m02-v1';
export const REFERENCE_ASSETS=Object.freeze({
 grass:new URL('../../../../art/maps/m02/cartoon03/materials-original.png',import.meta.url).href,
 oak:new URL('../../../../art/maps/m02/cartoon03/rural-atlas-original.png',import.meta.url).href
});
let cachedOak;
export function extractReferenceOak(source){
 if(cachedOak)return cachedOak;
 const w=source.width,h=source.height,v=Object.assign(document.createElement('canvas'),{width:w,height:h}),c=v.getContext('2d',{willReadFrequently:true});c.drawImage(source,0,0);
 const raw=c.getImageData(0,0,w,h).data,seen=new Uint8Array(w*h),queue=new Int32Array(w*h),seed=Math.floor(h*.30)*w+Math.floor(w*.84);
 if(raw[seed*4+3]<64)throw Error('Approved M02 oak seed missing');let head=0,tail=1;queue[0]=seed;seen[seed]=1;let l=w,r=0,t=h,b=0;
 while(head<tail){const p=queue[head++],x=p%w,y=Math.floor(p/w);l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);for(const n of[x?p-1:-1,x<w-1?p+1:-1,y?p-w:-1,y<h-1?p+w:-1])if(n>=0&&!seen[n]&&raw[n*4+3]>=64){seen[n]=1;queue[tail++]=n;}}
 if(tail<100000||l<w*.6||b>h*.62)throw Error('Unexpected rural atlas component; never import buildings/crops');
 const left=l-2,top=t-2,cv=Object.assign(document.createElement('canvas'),{width:r-l+5,height:b-t+5}),ctx=cv.getContext('2d'),out=ctx.createImageData(cv.width,cv.height);
 for(let y=0;y<cv.height;y++)for(let x=0;x<cv.width;x++){const sx=left+x,sy=top+y,p=sy*w+sx;if(sx<0||sy<0||sx>=w||sy>=h)continue;let own=seen[p];if(!own&&raw[p*4+3]<64)for(let dy=-2;dy<=2&&!own;dy++)for(let dx=-2;dx<=2;dx++){const nx=sx+dx,ny=sy+dy;if(nx>=0&&ny>=0&&nx<w&&ny<h&&seen[ny*w+nx]){own=1;break;}}if(own)out.data.set(raw.subarray(p*4,p*4+4),(y*cv.width+x)*4);}
 ctx.putImageData(out,0,0);return cachedOak=cv;
}
