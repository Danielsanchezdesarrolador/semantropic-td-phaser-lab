/**
 * P07 deterministic Canvas2D-compatible raster for existing P03 vector artwork.
 * PRESERVES original P03 coordinates, volumes, outline geometry and palette.
 * The historical source painter is invoked unchanged (except sniper rifle).
 * CPU fallback is not a Chromium quality certification; browser renderer wins.
 */
export function createP07RasterCanvas(width,height,{cellWidth=176,cellHeight=208}={}){
 const data=new Uint8Array(width*height*4);
 // HF1: quantize transformed coordinates (1e-6 source px) to avoid
 // platform-dependent last-bit differences in sin/cos/hypot between V8 and Node.
 const q=v=>Number.isFinite(v)?Math.round(v*1000000)/1000000:v;
 const identity=()=>[1,0,0,1,0,0];
 const mul=(m,n)=>[m[0]*n[0]+m[2]*n[1],m[1]*n[0]+m[3]*n[1],
  m[0]*n[2]+m[2]*n[3],m[1]*n[2]+m[3]*n[3],
  m[0]*n[4]+m[2]*n[5]+m[4],m[1]*n[4]+m[3]*n[5]+m[5]];
 const hex=c=>{
  if(!c)return [30,48,55];
  if(Array.isArray(c))return c;
  const named={white:'#ffffff',black:'#000000',transparent:'#000000'};
  let h=named[c]||c;
  if(/^#[0-9a-fA-F]{3}$/.test(h))h='#'+[...h.slice(1)].map(s=>s+s).join('');
  if(/^#[0-9a-fA-F]{6}$/.test(h))return [1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
  return [40,65,69];
 };
 class Ctx{
  constructor(){this.transform=identity();this.fillStyle='#000000';this.strokeStyle='#000000';
   this.lineWidth=1;this.globalAlpha=1;this.lineCap='round';this.lineJoin='round';
   this.stack=[];this.points=[];this.closed=false;}
  save(){this.stack.push({transform:this.transform.slice(),fillStyle:this.fillStyle,
   strokeStyle:this.strokeStyle,lineWidth:this.lineWidth,globalAlpha:this.globalAlpha,
   lineCap:this.lineCap,lineJoin:this.lineJoin})}
  restore(){const s=this.stack.pop();if(s)Object.assign(this,s)}
  translate(x,y){this.transform=mul(this.transform,[1,0,0,1,x,y])}
  rotate(r){const c=Math.cos(r),s=Math.sin(r);this.transform=mul(this.transform,[c,s,-s,c,0,0])}
  scale(x,y){this.transform=mul(this.transform,[x,0,0,y,0,0])}
  _p(x,y){const m=this.transform;return [q(m[0]*x+m[2]*y+m[4]),q(m[1]*x+m[3]*y+m[5])]}
  beginPath(){this.points=[];this.closed=false}
  moveTo(x,y){this.points.push(this._p(x,y))}
  lineTo(x,y){this.points.push(this._p(x,y))}
  closePath(){this.closed=true}
  bezierCurveTo(x1,y1,x2,y2,x3,y3){
   let p=this.points.at(-1);if(!p)return;
   const a=this._p(x1,y1),b=this._p(x2,y2),c=this._p(x3,y3);
   const n=18;
   for(let i=1;i<=n;i++){const t=i/n,v=1-t;this.points.push([
    q(v*v*v*p[0]+3*v*v*t*a[0]+3*v*t*t*b[0]+t*t*t*c[0]),
    q(v*v*v*p[1]+3*v*v*t*a[1]+3*v*t*t*b[1]+t*t*t*c[1])])}
  }
  ellipse(x,y,rx,ry,angle=0,start=0,end=2*Math.PI,anticlockwise=false){
   const n=36,cs=Math.cos(angle),sn=Math.sin(angle);
   for(let i=0;i<=n;i++){
    let a=start+(end-start)*i/n,dx=rx*Math.cos(a),dy=ry*Math.sin(a);
    let pt=this._p(x+dx*cs-dy*sn,y+dx*sn+dy*cs);
    if(i===0)this.points.push(pt);else this.points.push(pt);
   }
   this.closed=Math.abs(end-start)>=Math.PI*1.99;
  }
  createLinearGradient(x0,y0,x1,y1){
   const a=this._p(x0,y0),b=this._p(x1,y1);
   return {kind:'linear',a,b,stops:[],addColorStop(t,color){this.stops.push([+t,hex(color)])}};
  }
  _color(col,x,y){
   if(!col||typeof col==='string')return hex(col);
   if(col.kind==='linear'){
    const dx=col.b[0]-col.a[0],dy=col.b[1]-col.a[1],l=dx*dx+dy*dy||1,
     t=q(Math.max(0,Math.min(1,((x-col.a[0])*dx+(y-col.a[1])*dy)/l))),
     stops=col.stops.sort((a,b)=>a[0]-b[0]);
    if(!stops.length)return [70,100,104];
    if(t<=stops[0][0])return stops[0][1];
    for(let i=0;i<stops.length-1;i++){
     let a=stops[i],b=stops[i+1];if(t<=b[0]){
      const v=(t-a[0])/(b[0]-a[0]||1);
      return a[1].map((k,j)=>Math.round(k+(b[1][j]-k)*v));
     }
    }
    return stops.at(-1)[1];
   }
   return hex(col);
  }
  _pixel(x,y,col,coverage=1){
   x|=0;y|=0;
   if(x<0||y<0||x>=width||y>=height)return;
   // Strict frame-local clipping so line widths cannot contaminate neighbors.
   if(this.clipCell){
    const [cx,cy]=this.clipCell;
    if(x<cx+3||y<cy+3||x>=cx+cellWidth-3||y>=cy+cellHeight-3)return;
   }
   const i=(y*width+x)*4,alpha=Math.max(0,Math.min(1,q(this.globalAlpha*coverage))),
    old=data[i+3]/255,blended=alpha+old*(1-alpha);
   if(blended<.0001)return;
   const rgb=this._color(col,x,y);
   for(let k=0;k<3;k++)data[i+k]=Math.round((rgb[k]*alpha+data[i+k]*old*(1-alpha))/blended);
   const nextAlpha=Math.min(255,Math.round(blended*255));
   // P08 alpha debt fix: fully transparent RGBA must have RGB=(0,0,0).
   // Rounding low-coverage values to alpha=0 previously left nonzero RGB.
   if(nextAlpha===0){data[i]=0;data[i+1]=0;data[i+2]=0;data[i+3]=0;}
   else data[i+3]=nextAlpha;
  }
  _circle(x,y,r,col){
   r=Math.max(.1,q(r));x=q(x);y=q(y);
   for(let yy=Math.floor(y-r-1);yy<=Math.ceil(y+r+1);yy++){
    for(let xx=Math.floor(x-r-1);xx<=Math.ceil(x+r+1);xx++){
     const dx=q(xx+.5-x),dy=q(yy+.5-y),d=q(Math.sqrt(dx*dx+dy*dy));
     if(d<=r+.45)this._pixel(xx,yy,col,Math.min(1,Math.max(0,q((r+.45-d)*1.2))));
    }
   }
  }
  stroke(){
   const p=this.points;if(p.length<2)return;
   const segs=p.length-(this.closed?0:1),rad=this.lineWidth/2;
   for(let j=0;j<segs;j++){
    const a=p[j],b=p[(j+1)%p.length],len=q(Math.sqrt(q((a[0]-b[0])**2)+q((a[1]-b[1])**2)));
    const steps=Math.max(1,Math.ceil(len*1.1));
    for(let k=0;k<=steps;k++){let t=k/steps;this._circle(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,rad,this.strokeStyle)}
   }
  }
  fill(){
   const p=this.points;if(p.length<3)return;
   const minY=Math.max(0,Math.floor(Math.min(...p.map(x=>x[1])))),
    maxY=Math.min(height-1,Math.ceil(Math.max(...p.map(x=>x[1]))));
   for(let y=minY;y<=maxY;y++){
    const inter=[];
    for(let i=0;i<p.length;i++){
     const a=p[i],b=p[(i+1)%p.length];
     if((a[1]<=y+.5&&b[1]>y+.5)||(b[1]<=y+.5&&a[1]>y+.5))
      inter.push(a[0]+(y+.5-a[1])*(b[0]-a[0])/(b[1]-a[1]));
    }
    inter.sort((a,b)=>a-b);
    for(let j=0;j+1<inter.length;j+=2){
     const left=Math.max(0,Math.ceil(inter[j]-.5)),right=Math.min(width-1,Math.floor(inter[j+1]-.5));
     for(let x=left;x<=right;x++)this._pixel(x,y,this.fillStyle);
    }
   }
  }
 }
 const ctx=new Ctx();
 return {canvas:{width,height,data},ctx,
  withCell(x,y,fn){ctx.clipCell=[x,y];try{fn()}finally{ctx.clipCell=null}},
  inspectFrame(x,y){
   let visible=0,partial=0,border=0;
   for(let iy=0;iy<cellHeight;iy++)for(let ix=0;ix<cellWidth;ix++){
    const a=data[((y+iy)*width+x+ix)*4+3];
    if(a){visible++;if(a<255)partial++;if(ix===0||ix===cellWidth-1||iy===0||iy===cellHeight-1)border++;}
   }
   return {visible,partial,border};
  }
 };
}
