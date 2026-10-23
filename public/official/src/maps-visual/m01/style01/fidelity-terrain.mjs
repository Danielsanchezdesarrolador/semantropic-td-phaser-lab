/** M01-specific illustrated relief. Read-only geometry; rasterized once at mount. */
const W=1280,H=768,S=2;
const canvas=()=>Object.assign(document.createElement('canvas'),{width:W*S,height:H*S});
const polygon=(c,points)=>{c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();};
export const SHORE=Object.freeze([[-100,575],[0,575],[95,590],[190,600],[290,645],[415,660],[535,660],[645,665],[740,680],[830,665],[930,630],[1040,645],[1145,680],[1280,625],[1380,625]]);
export const MESAS=Object.freeze([
 {id:'left-archaeology',height:57,back:[[-10,145],[530,125],[555,260]],edge:[[555,300],[530,340],[480,363],[405,367],[320,354],[240,325],[160,285],[70,255],[-10,230]]},
 {id:'central-socket',height:55,back:[[694,321],[760,300],[806,323]],edge:[[817,365],[797,383],[751,392],[715,385],[692,369]]},
 {id:'portal-terrace',height:55,back:[[963,145],[1288,145]],edge:[[1288,270],[1215,295],[1135,278],[1060,255],[1005,248],[963,234]]},
 {id:'right-socket',height:25,back:[[1118,322],[1230,318]],edge:[[1230,335],[1215,365],[1170,390],[1125,380],[1118,361]]},
 {id:'left-lower-socket',height:43,back:[[34,450],[145,450]],edge:[[159,495],[140,510],[90,515],[43,504],[32,485]]},
 {id:'lower-central-socket',height:55,back:[[605,520],[725,520]],edge:[[742,568],[719,590],[670,599],[620,586],[600,563]]},
 {id:'front-river-bank',height:83,back:[[-100,768]],edge:SHORE,shore:true},
]);
export function shoreY(x){for(let i=1;i<SHORE.length;i++){const a=SHORE[i-1],b=SHORE[i];if(x<=b[0])return a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0]);}return SHORE.at(-1)[1];}
function grassField(source){
 const v=canvas(),c=v.getContext('2d');c.scale(S,S);const band=source.height/3;
 c.fillStyle='#9fc83e';c.fillRect(0,0,W,H);
 // Uniform material scale. Feather overlaps avoid a seam between material repeats.
 const tile=document.createElement('canvas');tile.width=1280;tile.height=284;
 const t=tile.getContext('2d');t.drawImage(source,0,band,source.width,band,0,0,1280,284);
 t.globalCompositeOperation='destination-in';const fade=t.createLinearGradient(0,0,0,284);fade.addColorStop(0,'#0000');fade.addColorStop(.08,'#000');fade.addColorStop(.92,'#000');fade.addColorStop(1,'#0000');t.fillStyle=fade;t.fillRect(0,0,1280,284);
 for(let y=-40;y<H;y+=248)c.drawImage(tile,0,y);
 return v;
}
function waterField(source){
 const v=canvas(),c=v.getContext('2d');c.scale(S,S);c.fillStyle='#06b8e5';c.fillRect(0,0,W,H);const band=source.height/3;
 const tile=document.createElement('canvas');tile.width=640;tile.height=142;const t=tile.getContext('2d');t.drawImage(source,0,band*2,source.width,band,0,0,640,142);
 for(const axis of ['x','y']){t.globalCompositeOperation='destination-in';const length=axis==='x'?640:142,fade=t.createLinearGradient(0,0,axis==='x'?length:0,axis==='y'?length:0);fade.addColorStop(0,'#0000');fade.addColorStop(.07,'#000');fade.addColorStop(.93,'#000');fade.addColorStop(1,'#0000');t.fillStyle=fade;t.fillRect(0,0,640,142);}
 for(let y=490;y<H;y+=120)for(let x=-70;x<W;x+=592)c.drawImage(tile,x,y);
 return v;
}
export function makeFidelitySubstrate(source){
 const v=grassField(source),c=v.getContext('2d');c.setTransform(S,0,0,S,0,0);const band=source.height/3;
 c.drawImage(source,0,0,source.width,band,0,0,W,145);
 const water=canvas(),wc=water.getContext('2d');wc.scale(S,S);wc.save();polygon(wc,[...SHORE.map(([x,y])=>[x,y+16]),[1380,800],[-100,800]]);wc.clip();
 wc.drawImage(waterField(source),0,0,W,H);wc.restore();
 return {ground:v,water};
}
function yOnEdge(edge,x){for(let i=1;i<edge.length;i++){const a=edge[i-1],b=edge[i];if(x>=Math.min(a[0],b[0])&&x<=Math.max(a[0],b[0]))return a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0]);}return null;}
export function supportsFoot(x,y){
 if(y>shoreY(x)-5)return false;
 for(const m of MESAS){if(m.shore)continue;const edge=yOnEdge([...m.edge].sort((a,b)=>a[0]-b[0]),x);if(edge!==null&&y>edge-7&&y<edge+m.height+6)return false;}
 return true;
}
export function makeFidelityRelief(atlas,source){
 const top=canvas(),face=canvas(),tc=top.getContext('2d'),fc=face.getContext('2d');tc.scale(S,S);fc.scale(S,S);
 const ground=grassField(source),formations=[];
 for(const m of MESAS){
  const edge=[...m.edge].sort((a,b)=>a[0]-b[0]);
  if(!m.shore){tc.save();polygon(tc,[...m.back,...m.edge]);tc.clip();tc.beginPath();tc.rect(0,145,W,H-145);tc.clip();tc.drawImage(ground,0,0,W,H);tc.restore();}
  const bounds={left:Math.min(...edge.map(p=>p[0])),right:Math.max(...edge.map(p=>p[0]))};
  // Map hand-drawn wall columns along the designed terrain edge. All source
  // motifs retain one uniform scale; height and width are never scaled separately.
  fc.save();
  const taper=x=>m.shore?1:Math.min(1,Math.max(0,(x-bounds.left)/18),Math.max(0,(bounds.right-x)/18));
  polygon(fc,[...edge.map(([x,y])=>[x,y-7]),...edge.slice().reverse().map(([x,y])=>[x,y+m.height*taper(x)])]);fc.clip();
  const motifs=(m.shore?['cliffA','cliffB','cliffC']:['cliffA','cliffB']).map(k=>atlas['maps/m01/style01/'+k]);
  let index=0,start=bounds.left;
  while(start<bounds.right){const im=motifs[index++%motifs.length],scale=m.height/im.height,tile=im.width*.84*scale;
   for(let x=start;x<Math.min(start+tile,bounds.right);x+=.5){const y=yOnEdge(edge,x);if(y===null)continue;
    const sx=im.width*.08+(x-start)/scale,sw=Math.min(.5/scale,im.width-sx);if(sw>0)fc.drawImage(im,sx,0,sw,im.height,x,y-5,.5,m.height);
   }start+=tile;
  }
  fc.restore();
  // Dark contact line belongs to the wall, below turf; the road is a separate layer.
  fc.beginPath();edge.forEach(([x,y],i)=>i?fc.lineTo(x,y+m.height*taper(x)-8):fc.moveTo(x,y+m.height*taper(x)-8));fc.strokeStyle='#234e5344';fc.lineWidth=4;fc.stroke();
  formations.push({id:m.id,height:m.height,edge,art:'original-cliff-atlas',uniformMotifScale:true});
 }
 return {top,face,formations};
}
