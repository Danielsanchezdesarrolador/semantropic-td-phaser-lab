/**
 * SEMANTROPIC TD • P06 • original deterministic RGBA atlas raster export.
 * This generator draws the EXACT binary atlases committed in P06.
 * No Canvas, no browser and no third-party image files required.
 * Optimized for reproducibility in Node and in sandboxed V8.
 * All assets are 8-bit RGBA PNG (color type 6) with actual transparency.
 */
export const P06_FRAME={width:176,height:208,columns:8,rows:4,frames:32};
export const P06_STATES={idle:4,walk:8,attackWindup:3,attack:5,hit:3,die:6,blocked:3};
export const P06_ACTORS={
 warrior:{key:'actors/enemies/warrior/v1/p06',worldHeight:91,colors:['#536a55','#819768','#bed09c','#3d514b','#ad8256','#e9c18b']},
 hound:{key:'actors/enemies/hound/v1/p06',worldHeight:67,colors:['#66545a','#997963','#d9a784','#404751','#c7a070','#e5c0a1']},
 infantry_recruit:{key:'actors/allies/infantry-recruit/v1/p06',worldHeight:88,colors:['#355b71','#54889a','#a8c9c3','#253d50','#dab983','#f0d9ae']},
 sniper_operator:{key:'actors/allies/sniper-operator/v1/p06-unarmed',worldHeight:80,colors:['#3d5758','#698778','#c7bca0','#293d43','#c5b58c','#e5d6ba']}
};
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
function image(){const {width:w,height:h,columns:c,rows:r}=P06_FRAME;
 return {width:w*c,height:h*r,data:new Uint8Array(w*c*h*r*4)}}
function pixel(s,x,y,rgb,alpha=255){
 x|=0;y|=0;if(x<0||y<0||x>=s.width||y>=s.height||alpha<=0)return;
 const i=(y*s.width+x)*4,was=s.data[i+3],a=alpha/255,old=was/255,out=a+old*(1-a);
 if(out<=0)return;
 for(let k=0;k<3;k++)s.data[i+k]=Math.round((rgb[k]*a+s.data[i+k]*old*(1-a))/out);
 s.data[i+3]=Math.min(255,Math.round(out*255));
}
function ellipse(s,x,y,rx,ry,rgb,angle=0,edge=1){
 if(rx<=0||ry<=0)return;
 const sn=Math.sin(angle),cs=Math.cos(angle),rad=Math.max(rx,ry)*1.45+3;
 const loX=Math.max(0,Math.floor(x-rad)),hiX=Math.min(s.width-1,Math.ceil(x+rad));
 const loY=Math.max(0,Math.floor(y-rad)),hiY=Math.min(s.height-1,Math.ceil(y+rad));
 for(let py=loY;py<=hiY;py++)for(let px=loX;px<=hiX;px++){
  const dx=px+.5-x,dy=py+.5-y,u=(dx*cs+dy*sn)/rx,v=(-dx*sn+dy*cs)/ry,q=Math.sqrt(u*u+v*v);
  if(q<1.025){
   const a=q>1-edge/Math.max(rx,ry)?Math.max(0,Math.min(255,Math.round((1.025-q)*320))):255;
   pixel(s,px,py,rgb,a);
  }
 }
}
function segment(s,x1,y1,x2,y2,width,rgb){
 const dx=x2-x1,dy=y2-y1,steps=Math.ceil(Math.hypot(dx,dy)*1.15);
 for(let i=0;i<=steps;i++){const t=i/Math.max(1,steps);ellipse(s,x1+dx*t,y1+dy*t,width/2,width/2,rgb)}
}
function blend(c,shade=1){return c.map(v=>Math.round(Math.max(0,Math.min(255,v*shade))))}
const note=(s,x,y,color,w=3)=>ellipse(s,x,y,w,w,color);
function paintActor(s,id,state,index,x,y){
 const base=P06_ACTORS[id],p=base.colors.map(hex),dark=p[0],main=p[1],light=p[2],
 ink=p[3],trim=p[4],face=p[5],wave=Math.PI*2*index/(P06_STATES[state]);
 const walk=state==='walk',wind=state==='attackWindup',attack=state==='attack',
  hit=state==='hit',die=state==='die',blocked=state==='blocked';
 const f=index/Math.max(1,P06_STATES[state]-1);
 const fall=die?f*f*(3-2*f):0,cc=hit?Math.sin(Math.PI*f)*5:0;
 const sx=(walk?Math.sin(wave)*2:0)+(wind?-f*3:attack?Math.sin(f*Math.PI)*4:0)+cc*.6;
 const vertical=walk?Math.cos(2*wave)*1.6:state==='idle'?Math.sin(wave)*.9:0;
 // Coordinates are local and fixed to a 0.5/.92 foot contact plane.
 const px=x+88+sx,py=y+191-vertical+fall*16;
 if(id==='hound'){
  // Four paws explicitly visible, diagonal pairs in antiphase.
  const bodyY=py-51-fall*5,bodyX=px+2,phase=walk?wave:0;
  const legs=[[-35,0],[-16,Math.PI],[25,Math.PI],[45,0]];
  // Far legs.
  for(const [i,idx] of [1,2].entries()){
   const [lx,ph]=legs[idx],stride=walk?Math.sin(phase+ph)*11:0,lift=walk?Math.max(0,Math.cos(phase+ph))*10:0;
   segment(s,bodyX+lx,bodyY+12,bodyX+lx+stride*.4,py-19-lift*.4,9,dark);
   segment(s,bodyX+lx+stride*.4,py-19-lift*.4,bodyX+lx+stride,py-5-lift,7,main);
   ellipse(s,bodyX+lx+stride+3,py-4-lift,10,4,ink);
  }
  segment(s,bodyX-45,bodyY-18,bodyX-68,bodyY-29-(walk?Math.sin(phase-1)*10:0),10,main);
  ellipse(s,bodyX-30,bodyY,29,23,ink);
  ellipse(s,bodyX,bodyY-5,57,27,dark,-.07);
  ellipse(s,bodyX-7,bodyY-9,52,23,main,-.04);
  ellipse(s,bodyX-18,bodyY-21,38,9,light,-.1);
  ellipse(s,bodyX+26,bodyY+4,26,20,trim);
  // Shoulder protection and harness.
  segment(s,bodyX-17,bodyY-19,bodyX-1,bodyY+18,9,ink);
  segment(s,bodyX-16,bodyY-20,bodyX+2,bodyY+18,4,trim);
  ellipse(s,bodyX-2,bodyY-1,8,8,light);
  for(let q=0;q<4;q++)ellipse(s,bodyX-23+q*17,bodyY-27,5,12,q%2?ink:trim,-.2);
  for(const idx of [0,3]){
   const [lx,ph]=legs[idx],stride=walk?Math.sin(phase+ph)*11:0,lift=walk?Math.max(0,Math.cos(phase+ph))*10:0;
   segment(s,bodyX+lx,bodyY+12,bodyX+lx+stride*.5,py-21-lift*.3,12,main);
   segment(s,bodyX+lx+stride*.5,py-21-lift*.3,bodyX+lx+stride,py-7-lift,9,light);
   ellipse(s,bodyX+lx+stride+5,py-4-lift,11,5,dark);
  }
  // Expressive hound head; no graphic details.
  const headX=bodyX+58+(attack?7*Math.sin(f*Math.PI):hit?-5*(1-f):0),headY=bodyY-15;
  ellipse(s,headX-7,headY,23,22,ink);
  ellipse(s,headX-1,headY-3,22,20,main);
  ellipse(s,headX+17,headY+9,19,11,face);
  ellipse(s,headX+35,headY+8,6,5,ink);
  ellipse(s,headX-12,headY-25,10,17,dark,-.34);
  ellipse(s,headX+2,headY-25,8,18,trim,.34);
  ellipse(s,headX+8,headY-6,5,5,ink);note(s,headX+9,headY-7,face,2.4);
  if(attack)ellipse(s,headX+17,headY+19,16,4,ink);
 }else{
  const orc=id==='warrior',sniper=id==='sniper_operator';
  const massive=orc?1.25:1,legSpace=orc?21:17;
  const stride=walk?Math.sin(wave)*14:0,leftLift=walk?Math.max(0,-Math.cos(wave))*9:0,rightLift=walk?Math.max(0,Math.cos(wave))*9:0;
  // Rear arm / legs: anatomy volumes drawn per state (two ground contacts).
  for(const sign of [-1,1]){
   const footX=px+sign*legSpace+sign*stride,footY=py-(sign<0?leftLift:rightLift)-fall*4;
   segment(s,px+sign*13,py-64,px+sign*20+sign*stride*.35,py-35,orc?23:17,dark);
   segment(s,px+sign*20+sign*stride*.35,py-35,footX,footY-7,orc?18:13,main);
   ellipse(s,footX+sign*3,footY-6,orc?18:14,8,ink,-sign*.05);
   ellipse(s,footX,footY-9,orc?10:8,4,trim);
  }
  const chestY=py-109-fall*12;
  ellipse(s,px,chestY+27,orc?32:26,37,ink,0);
  ellipse(s,px,chestY+21,orc?32:26,34,dark);
  ellipse(s,px-3,chestY+15,orc?29:24,30,main);
  ellipse(s,px-9,chestY+7,orc?22:16,21,light);
  ellipse(s,px,chestY+43,orc?22:18,12,trim);
  // Shoulder armor, one large and one medium plate, identity at mobile sizes.
  ellipse(s,px-25*massive,chestY-10,orc?24:19,orc?19:14,ink,-.22);
  ellipse(s,px-25*massive,chestY-13,orc?19:14,orc?14:10,trim,-.2);
  ellipse(s,px+24*massive,chestY-10,orc?20:16,orc?16:12,ink,.2);
  ellipse(s,px+24*massive,chestY-13,orc?16:12,orc?12:9,light,.1);
  const armSwing=walk?Math.sin(wave)*11:attack?Math.sin(f*Math.PI)*18:wind?-f*16:blocked?-9:0;
  const armX=px+28*massive,armY=chestY+20;
  segment(s,px+25*massive,chestY-3,armX+armSwing*.5,armY,orc?21:14,ink);
  segment(s,armX+armSwing*.5,armY,armX+armSwing,armY+24-(attack?f*20:0),orc?17:12,main);
  ellipse(s,armX+armSwing,armY+24-(attack?f*20:0),orc?11:9,9,face);
  // Hand-held axe for orc, shield/short blade recruit, no rifle on operator.
  if(orc){
   const ax=armX+armSwing+6,ay=armY+25-(attack?f*20:0);
   const topX=ax+(wind?-f*10:attack?Math.sin(f*Math.PI)*11:0);
   segment(s,ax,ay+6,topX,ay-63,8,dark);
   segment(s,ax,ay+6,topX,ay-63,4,trim);
   ellipse(s,topX-12,ay-54,20,12,light,-.55);
   ellipse(s,topX-22,ay-53,11,7,ink,-.45);
  }else if(id==='infantry_recruit'){
   const hx=armX+armSwing,hy=armY+20;
   segment(s,hx,hy+7,hx+10,hy-55,7,trim);
   ellipse(s,hx+10,hy-52,6,24,light,.10);
   ellipse(s,hx+10,hy-55,4,19,face,.10);
  }
  const leftHandX=px-40-(blocked?9:0),leftHandY=chestY+27-(blocked?16:0);
  segment(s,px-28*massive,chestY+1,px-37,chestY+19,orc?21:14,ink);
  segment(s,px-37,chestY+19,leftHandX,leftHandY,orc?15:11,main);
  ellipse(s,leftHandX,leftHandY,9,8,face);
  if(id==='infantry_recruit'){
   ellipse(s,leftHandX-4,leftHandY+3,23,30,ink,-.12);
   ellipse(s,leftHandX-5,leftHandY,18,25,dark,-.12);
   ellipse(s,leftHandX-7,leftHandY-1,13,20,main,-.12);
   ellipse(s,leftHandX-8,leftHandY-2,6,7,trim);
  }else if(sniper){
   // P06 canonical 'sniper_operator_unarmed': no weapon geometry at all.
   // Hands grip a FIXED tower-mounted stock visually, set by T07/Integrator.
   const gripLift=wind?8*f:attack?5*Math.sin(f*Math.PI):0;
   segment(s,armX-9,chestY+18,px+21,chestY+11-gripLift,10,dark);
   ellipse(s,px+21,chestY+11-gripLift,8,6,face);
   ellipse(s,leftHandX+20,chestY+17-gripLift,8,6,face);
  }
  const headY=chestY-51-(hit?3*Math.sin(Math.PI*f):0);
  ellipse(s,px,headY,orc?29:23,orc?28:25,ink);
  ellipse(s,px,headY-2,orc?27:21,orc?26:23,orc?main:face);
  if(orc){
   ellipse(s,px-21,headY-5,7,6,light);
   ellipse(s,px+21,headY-5,7,6,light);
   ellipse(s,px-6,headY+8,22,12,dark);
   ellipse(s,px-8,headY+8,6,7,face);
   ellipse(s,px+9,headY+8,6,7,face);
   ellipse(s,px-10,headY-8,6,5,ink);ellipse(s,px+11,headY-8,6,5,ink);
   for(let z=0;z<3;z++)ellipse(s,px-18+z*17,headY-28,8,11,z%2?trim:dark,-.3);
  }else{
   // Military visor/helmet shield without attached rifle.
   ellipse(s,px,headY-13,25,17,dark);
   ellipse(s,px,headY-19,23,14,main);
   ellipse(s,px-10,headY-4,6,4,sniper?light:ink);
   ellipse(s,px+9,headY-4,6,4,sniper?light:ink);
   ellipse(s,px-9,headY-4,3,2,ink);ellipse(s,px+9,headY-4,3,2,ink);
   if(sniper){ellipse(s,px-10,headY-4,7,6,ink);ellipse(s,px+9,headY-4,7,6,ink);
    note(s,px-12,headY-6,light,2);note(s,px+7,headY-6,light,2);}
   else ellipse(s,px-4,headY-30,5,11,trim);
  }
 }
 if(hit){
  ellipse(s,px-42,py-123,4,4,light);ellipse(s,px-52,py-131,2.5,2.5,trim);
 }
 if(blocked)ellipse(s,px-36,py-110,3,22,light,-.25);
 // Non-graphic terminal visual dissolve: the core already resolved the result.
 if(die){
  const strength=Math.max(0,1-f*.89);
  const from=x,to=x+176;for(let yy=y;yy<y+208;yy++)for(let xx=from;xx<to;xx++){
   if(((xx+13*yy+index*7)%31)<(1-strength)*31){
    const i=(yy*s.width+xx)*4;s.data[i+3]=Math.round(s.data[i+3]*strength);
   }
  }
 }
}
const crcTable=(()=>{let a=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;a[n]=c>>>0;}return a})();
function crc32(bytes){let c=-1;for(const b of bytes)c=crcTable[(c^b)&255]^(c>>>8);return(c^-1)>>>0}
function adler32(bytes){let a=1,b=0;for(const x of bytes){a=(a+x)%65521;b=(b+a)%65521}return(b*65536+a)>>>0}
function u32(n){return [(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255]}
function pngChunk(label,data){
 const type=[...label].map(c=>c.charCodeAt(0)),arr=[...type,...data];
 return [...u32(data.length),...arr,...u32(crc32(arr))];
}
function deflateFixed(bytes){
 // Standards-compliant single fixed-Huffman DEFLATE block (RFC 1951).
 // LZ77 checks distance 1 / 4 / preceding scanline to compress flat-color art.
 const out=[0x78,0x01];
 let bits=0,used=0;
 const put=(value,count)=>{for(let j=0;j<count;j++){
  bits|=((value>>>j)&1)<<used;if(++used===8){out.push(bits);bits=0;used=0;}
 }};
 const rev=(code,len)=>{let v=0;for(let j=0;j<len;j++){v=(v<<1)|(code&1);code>>>=1;}return v;};
 const symbol=n=>{
  let code,len;
  if(n<=143){code=48+n;len=8}
  else if(n<=255){code=400+n-144;len=9}
  else if(n<=279){code=n-256;len=7}
  else {code=192+n-280;len=8}
  put(rev(code,len),len);
 };
 const LBASE=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258];
 const LEXTRA=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
 const DBASE=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577];
 const DEXTRA=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];
 const match=(n,d)=>{
  let j=0;for(;j<28;j++)if(n>=LBASE[j]&&n< LBASE[j+1])break;
  symbol(257+j);if(LEXTRA[j])put(n-LBASE[j],LEXTRA[j]);
  let k=0;for(;k<29;k++)if(d>=DBASE[k]&&d<DBASE[k+1])break;
  put(rev(k,5),5);if(DEXTRA[k])put(d-DBASE[k],DEXTRA[k]);
 };
 put(1,1);put(1,2); // BFINAL=1, BTYPE=01 (fixed codes).
 const width=P06_FRAME.width*P06_FRAME.columns,stride=width*4+1;
 for(let i=0;i<bytes.length;){
  let best=0,dist=0;
  for(const d of [1,4,stride]){
   if(i<d)continue;
   const test=bytes[i]===bytes[i-d]&&bytes[i+1]===bytes[i+1-d];
   if(!test)continue;
   let n=2;
   while(n<258&&i+n<bytes.length&&bytes[i+n]===bytes[i+n-d])n++;
   if(n>=3&&n>best){best=n;dist=d;if(n===258)break;}
  }
  if(best>=3){match(best,dist);i+=best}
  else {symbol(bytes[i]);i++}
 }
 symbol(256);
 if(used)out.push(bits);
 out.push(...u32(adler32(bytes)));
 return Uint8Array.from(out);
}
export function encodeP06Png(atlas){
 // To remain portable to any JS runtime, the exporter uses correctly formed
 // zlib STORED blocks. Lossless PNG RGBA8, at a disk-size tradeoff.
 const {width,height,data}=atlas,stride=width*4;
 const filtered=new Uint8Array(height*(stride+1));
 for(let y=0;y<height;y++)filtered.set(data.subarray(y*stride,(y+1)*stride),y*(stride+1)+1);
 const ihdr=[...u32(width),...u32(height),8,6,0,0,0];
 const z=deflateFixed(filtered);
 const signature=[137,80,78,71,13,10,26,10];
 const chunks=[signature,pngChunk('IHDR',ihdr),pngChunk('IDAT',z),pngChunk('IEND',[])];
 const n=chunks.reduce((s,x)=>s+x.length,0),result=new Uint8Array(n);
 let offset=0;for(const chunk of chunks){result.set(chunk,offset);offset+=chunk.length;}
 return result;
}
export function generateP06Atlas(actorId){
 if(!P06_ACTORS[actorId])throw Error('P06 invalid actor: '+actorId);
 const art=image();let n=0;
 for(const [state,count] of Object.entries(P06_STATES)){
  for(let i=0;i<count;i++,n++){
   const x=n%8*176,y=Math.floor(n/8)*208;
   paintActor(art,actorId,state,i,x,y);
  }
 }
 const png=encodeP06Png(art);
 let visible=0,transparent=0,partial=0;
 for(let i=3;i<art.data.length;i+=4){
  if(art.data[i])visible++;else transparent++;if(art.data[i]>0&&art.data[i]<255)partial++;
 }
 return {actorId,atlasKey:P06_ACTORS[actorId].key,png,frames:n,width:art.width,height:art.height,
  rgbaPixelCount:visible,transparentPixelCount:transparent,partialAlphaPixelCount:partial,
  footAnchor:{x:.5,y:.92},shadowAnchor:{x:.5,y:1},source:'p06-png-generator.mjs'};
}
