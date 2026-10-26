/** M05 originals plus generic approved M02 turf, rock and rounded oak, read-only. */
export const SOURCES=Object.freeze({marsh:new URL('../../../../art/maps/m05/cartoon01/marsh-atlas-original.png',import.meta.url).href,oak:new URL('../../../../art/maps/m02/cartoon03/rural-atlas-original.png',import.meta.url).href,materials:new URL('../../../../art/maps/m02/cartoon03/materials-original.png',import.meta.url).href,cliffs:new URL('../../../../art/maps/m02/cartoon03/cliffs-original.png',import.meta.url).href});
const active=typeof document!=='undefined'&&location.pathname.includes('/maps-visual/m05/preview/');
const load=url=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(Error('M05 cartoon source missing '+url));im.src=url;});
const loaded=active?await Promise.all(Object.values(SOURCES).map(load)):null;
let cached;
function components(image,oakOnly=false){
 const w=image.width,h=image.height,cv=Object.assign(document.createElement('canvas'),{width:w,height:h}),c=cv.getContext('2d',{willReadFrequently:true});c.drawImage(image,0,0);const raw=c.getImageData(0,0,w,h).data,labels=new Int32Array(w*h),queue=new Int32Array(w*h),groups=[];let id=0;
 const start=oakOnly?[Math.floor(h*.30)*w+Math.floor(w*.84)]:null;
 for(let scan=0;scan<(start?start.length:w*h);scan++){const p=start?start[scan]:scan;if(labels[p]||raw[p*4+3]<64)continue;id++;let head=0,tail=1;queue[0]=p;labels[p]=id;let l=w,r=0,t=h,b=0;
  while(head<tail){const q=queue[head++],x=q%w,y=Math.floor(q/w);l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);for(const n of[x?q-1:-1,x<w-1?q+1:-1,y?q-w:-1,y<h-1?q+w:-1])if(n>=0&&!labels[n]&&raw[n*4+3]>=64){labels[n]=id;queue[tail++]=n;}}
  if(tail>10000)groups.push({id,l,r,t,b});
 }
 if(groups.length!==(oakOnly?1:6))throw Error('M05 atlas components invalid');const out={};
 for(const g of groups){if(oakOnly&&(g.l<w*.6||g.b>h*.62))throw Error('Never extract rural buildings');const width=g.r-g.l+5,height=g.b-g.t+5,v=Object.assign(document.createElement('canvas'),{width,height}),vc=v.getContext('2d'),pixels=vc.createImageData(width,height);
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){const sx=g.l-2+x,sy=g.t-2+y;if(sx<0||sy<0||sx>=w||sy>=h)continue;const p=sy*w+sx;let own=labels[p]===g.id;if(!own&&raw[p*4+3]<64)for(let dy=-2;dy<=2&&!own;dy++)for(let dx=-2;dx<=2;dx++){const nx=sx+dx,ny=sy+dy;if(nx>=0&&ny>=0&&nx<w&&ny<h&&labels[ny*w+nx]===g.id){own=true;break;}}if(own)pixels.data.set(raw.subarray(p*4,p*4+4),(y*width+x)*4);}
  vc.putImageData(pixels,0,0);const col=Math.min(2,Math.floor((g.l+g.r)/2/(w/3))),row=(g.t+g.b)/2>h*.53?1:0,name=oakOnly?'oak':['tree','hut','arch','reeds','log','bones'][row*3+col];out[name]=v;
 }return out;
}
export function marshAssets(){
 if(cached)return cached;if(!loaded)throw Error('M05 browser asset barrier missing');const sprites={...components(loaded[0]),...components(loaded[1],true)},packed=Object.assign(document.createElement('canvas'),{width:2048,height:640}),pc=packed.getContext('2d');pc.imageSmoothingQuality='high';const sizes={tree:352,hut:384,arch:280,reeds:224,log:224,bones:224,oak:280},frames=[];let x=4;
 for(const[name,im]of Object.entries(sprites)){const width=Math.min(im.width,sizes[name]),height=Math.round(im.height*width/im.width);if(x+width>2048||height+8>640)throw Error('M05 atlas budget');pc.drawImage(im,x,4,width,height);frames.push({name,x,y:4,width,height});x+=width+8;}
 return cached={canvas:packed,frames,sprites,materials:loaded[2],cliffs:loaded[3]};
}
