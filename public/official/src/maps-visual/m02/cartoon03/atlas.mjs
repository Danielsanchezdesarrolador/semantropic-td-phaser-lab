/** Original generated rural sprites, isolated by connected alpha at load only. */
export const ATLAS_URL=new URL('../../../../art/maps/m02/cartoon03/rural-atlas-original.png',import.meta.url).href;
const load=u=>new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=()=>no(Error('M02 cartoon atlas missing'));i.src=u;});
const active=typeof document!=='undefined'&&new URL(location.href).searchParams.get('map')==='2';
export const MATERIALS_URL=new URL('../../../../art/maps/m02/cartoon03/materials-original.png',import.meta.url).href;
export const CLIFFS_URL=new URL('../../../../art/maps/m02/cartoon03/cliffs-original.png',import.meta.url).href;
const sources=active?await Promise.all([ATLAS_URL,MATERIALS_URL,CLIFFS_URL].map(load)):null;
const source=sources?.[0];
let cached;
export function ruralAtlas(){
 if(cached)return cached;if(!source)throw Error('M02 browser asset barrier missing');
 const w=source.width,h=source.height,cv=Object.assign(document.createElement('canvas'),{width:w,height:h}),ctx=cv.getContext('2d',{willReadFrequently:true});ctx.drawImage(source,0,0);
 const raw=ctx.getImageData(0,0,w,h).data,labels=new Int32Array(w*h),queue=new Int32Array(w*h),groups=[];let id=0;
 for(let p=0;p<w*h;p++){if(labels[p]||raw[p*4+3]<64)continue;id++;let head=0,tail=1;queue[0]=p;labels[p]=id;let l=w,r=0,t=h,b=0;
  while(head<tail){const q=queue[head++],x=q%w,y=Math.floor(q/w);l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);for(const n of[x?q-1:-1,x<w-1?q+1:-1,y?q-w:-1,y<h-1?q+w:-1])if(n>=0&&!labels[n]&&raw[n*4+3]>=64){labels[n]=id;queue[tail++]=n;}}
  if(tail>10000)groups.push({id,l,r,t,b});
 }
 if(groups.length!==6)throw Error('Expected six separate rural sprites');
 const names=['mill','farm','oak','wheat','bridge','supplies'],sprites={};
 for(const g of groups){const col=Math.min(2,Math.floor((g.l+g.r)/2/(w/3))),row=(g.t+g.b)/2>h/2?1:0,name=names[row*3+col],sw=g.r-g.l+5,sh=g.b-g.t+5,v=Object.assign(document.createElement('canvas'),{width:sw,height:sh}),c=v.getContext('2d'),data=c.createImageData(sw,sh);
  for(let y=0;y<sh;y++)for(let x=0;x<sw;x++){const sx=g.l-2+x,sy=g.t-2+y;if(sx<0||sy<0||sx>=w||sy>=h)continue;const p=sy*w+sx;let own=labels[p]===g.id;
   if(!own&&!labels[p])for(let dy=-2;dy<=2&&!own;dy++)for(let dx=-2;dx<=2;dx++){const nx=sx+dx,ny=sy+dy;if(nx>=0&&ny>=0&&nx<w&&ny<h&&labels[ny*w+nx]===g.id){own=true;break;}}
   if(own)data.data.set(raw.subarray(p*4,p*4+4),(y*sw+x)*4);
  }
  c.putImageData(data,0,0);const width=Math.min(sw,({mill:512,farm:352,oak:280,wheat:240,bridge:260,supplies:280})[name]),image=Object.assign(document.createElement('canvas'),{width,height:Math.round(sh*width/sw)}),ic=image.getContext('2d');ic.imageSmoothingQuality='high';ic.drawImage(v,0,0,image.width,image.height);sprites[name]=image;
 }
 const packed=Object.assign(document.createElement('canvas'),{width:2048,height:640}),pc=packed.getContext('2d'),frames=[];let x=4;
 for(const name of names){const im=sprites[name];if(x+im.width>2048)throw Error('Rural atlas row exceeds budget');pc.drawImage(im,x,4);frames.push({name,x,y:4,width:im.width,height:im.height});x+=im.width+4;}
 return cached={canvas:packed,frames,sprites,materials:sources[1],cliffs:sources[2]};
}
