/** M05 terrain is an extruded land mask over marsh water, not a level painting. */
import{traceRoad,paintGeometricRoad,resampleRoad,ROAD_WIDTH,distanceToPath}from'./road-geometry.mjs';
import{oval,poly,paintMarshWater,paintWetGround,paintBankDetails}from'./wetland-details.mjs';
export const BRIDGE_INDICES=Object.freeze([60,124,254]);
export function channels(map){return[[[170,320],map.path[60],[470,400],[495,470]],[[660,610],map.path[124],[700,710],[700,800]],[[940,320],map.path[254],[1210,365],[1320,360]]];}
export{oval,poly}from'./wetland-details.mjs';
export function makeMarshSurfaces(plan,a){
 const canvas=(w=2560,h=1536)=>Object.assign(document.createElement('canvas'),{width:w,height:h});
 const layer=paint=>{const v=canvas(),c=v.getContext('2d');c.scale(2,2);c.imageSmoothingQuality='high';paint(c);return v;};
 const mask=layer(c=>{c.strokeStyle='#fff';c.lineWidth=152;traceRoad(c,plan.path);c.stroke();for(const[x,y,rx,ry]of[[240,-10,300,118],[530,110,154,145],[1000,35,230,150],[1210,180,140,140],[110,590,125,170],[620,460,110,83],[1000,560,108,85]])oval(c,x,y,rx,ry,'#fff');for(const p of plan.pads)oval(c,p.x,p.y,72,62,'#fff');
  c.globalCompositeOperation='destination-out';c.lineWidth=64;for(const path of plan.channels){c.beginPath();path.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.lineCap='round';c.lineJoin='round';c.stroke();}
 });
 const maskPixels=mask.getContext('2d',{willReadFrequently:true}).getImageData(0,0,mask.width,mask.height).data;
 const support=(x,y)=>x>=0&&y>=0&&x<1280&&y<768&&maskPixels[(Math.floor(y*2)*mask.width+Math.floor(x*2))*4+3]>=240;
 let lilyGroups;const water=layer(c=>{lilyGroups=paintMarshWater(c,support,a.wetland);});
 // The cliff face is the visible difference between the land top and its lower plane.
 const faceMask=canvas(),fc=faceMask.getContext('2d');fc.drawImage(mask,0,88);fc.globalCompositeOperation='destination-out';fc.drawImage(mask,0,0);
 const relief=layer(c=>{c.fillStyle='#526f5c';c.fillRect(0,0,1280,768);const motif=a.cliffs.width/3,span=104,scale=span/(motif*.76);for(let px=0;px<mask.width;px++){const x=px/2,sx=(Math.floor(x/span)%3)*motif+motif*.12+(x%span)/scale;for(let py=0;py<mask.height-1;py++)if(maskPixels[(py*mask.width+px)*4+3]>=128&&maskPixels[((py+1)*mask.width+px)*4+3]<128)c.drawImage(a.cliffs,sx,235,.5/scale,300,x,py/2,.5,44);}});
 const rc=relief.getContext('2d');rc.setTransform(1,0,0,1,0,0);rc.globalCompositeOperation='destination-in';rc.drawImage(faceMask,0,0);rc.globalCompositeOperation='source-over';
 const ground=layer(c=>paintWetGround(c,a.wetland));
 const gc=ground.getContext('2d');gc.setTransform(1,0,0,1,0,0);gc.globalCompositeOperation='destination-in';gc.drawImage(mask,0,0);gc.globalCompositeOperation='source-over';
 const rim=canvas(),rimc=rim.getContext('2d');rimc.drawImage(mask,0,0);rimc.globalCompositeOperation='destination-out';rimc.drawImage(mask,0,-12);rimc.globalCompositeOperation='source-in';rimc.fillStyle='#a9b65d';rimc.fillRect(0,0,2560,1536);gc.drawImage(rim,0,0);
 // A clean inner contour separates land from water without changing its support mask.
 const inner=canvas(),ic=inner.getContext('2d');ic.drawImage(mask,0,0);ic.globalCompositeOperation='destination-in';for(const[dx,dy]of[[3,0],[-3,0],[0,3],[0,-3]])ic.drawImage(mask,dx,dy);
 const ink=canvas(),kc=ink.getContext('2d');kc.drawImage(mask,0,0);kc.globalCompositeOperation='destination-out';kc.drawImage(inner,0,0);kc.globalCompositeOperation='source-in';kc.fillStyle='#294e3e';kc.fillRect(0,0,2560,1536);gc.drawImage(ink,0,0);

 let bankReeds;const bank=layer(c=>{bankReeds=paintBankDetails(c,support,(x,y,r)=>distanceToPath(x,y,plan.path)>51+r&&plan.pads.every(p=>Math.hypot(x-p.x,y-p.y)>58+r));});
 // Bank flora is static and is clipped away from the protected tactical corridor.
 const bc=water.getContext('2d');bc.drawImage(bank,0,0);

 const shoreShadow=canvas(),sc=shoreShadow.getContext('2d');sc.drawImage(mask,0,96);sc.globalCompositeOperation='destination-out';sc.drawImage(mask,0,86);sc.globalCompositeOperation='source-in';sc.fillStyle='#124e5966';sc.fillRect(0,0,2560,1536);
 // Falls sit on real south-facing cliff faces; source lies on land, basin below it.
 const falls=[];for(const[x,y]of[[110,540],[970,625],[1240,265]]){let edge;for(let py=y-60;py<Math.min(720,y+100);py++){if(support(x,py)&&!support(x,py+4)){edge=py;break;}}if(edge!==undefined&&distanceToPath(x,edge,plan.path)>95&&plan.pads.every(p=>Math.hypot(x-p.x,edge-p.y)>86)&&!support(x,edge+46))falls.push({x,y:edge,width:20,height:46});}
 const cascade=layer(c=>{for(const f of falls){oval(c,f.x,f.y-5,f.width*.75,7,'#446e4b','#a5bc65',1);oval(c,f.x,f.y-5,f.width*.63,5,'#43b19a','#287365',.8);poly(c,[[f.x-f.width/2,f.y-2],[f.x+f.width/2,f.y-2],[f.x+f.width*.6,f.y+f.height],[f.x-f.width*.6,f.y+f.height]],'#51cbb0');for(let n=0;n<4;n++){c.fillStyle=n%2?'#d9f4cf':'#8de5c4';c.fillRect(f.x-f.width*.4+n*f.width*.24,f.y,1.5,f.height-3);}oval(c,f.x,f.y+f.height,f.width*.85,3,'#e3f3c9');}});
 const route=layer(c=>paintGeometricRoad(c,plan.path)),stations=resampleRoad(plan.path,4),bridges=BRIDGE_INDICES.map((index,id)=>{
  const center=plan.path[index],nearest=stations.reduce((a,b)=>Math.hypot(a.x-center[0],a.y-center[1])<Math.hypot(b.x-center[0],b.y-center[1])?a:b),halfSpan=88,lane=stations.filter(p=>Math.abs(p.distance-nearest.distance)<=halfSpan);
  const rails=[-1,1].map(side=>{const groups=[];let group=[];for(const p of lane){const x=p.x+p.nx*42*side,y=p.y+p.ny*42*side;if(plan.pads.every(p=>Math.hypot(x-p.x,y-p.y)>=68))group.push({x,y});else if(group.length){if(group.length>2)groups.push(group);group=[];}}if(group.length>2)groups.push(group);return{side,groups};});
  const bounds={x:Math.floor(center[0]-125),y:Math.floor(center[1]-125),width:250,height:250},image=canvas(500,500),c=image.getContext('2d');c.scale(2,2);c.translate(-bounds.x,-bounds.y);c.lineCap='butt';c.lineJoin='round';c.beginPath();lane.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));for(const[col,w]of[['#3d4230',62],['#d1a250',58]]){c.strokeStyle=col;c.lineWidth=w;c.stroke();}
  for(let i=2;i<lane.length;i+=2){const p=lane[i];c.beginPath();c.moveTo(p.x-p.nx*29,p.y-p.ny*29);c.lineTo(p.x+p.nx*29,p.y+p.ny*29);c.strokeStyle='#705034';c.lineWidth=1.5;c.stroke();}
  for(const rail of rails)for(const g of rail.groups){c.beginPath();g.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));for(const[col,w]of[['#2e4734',6],['#e0ae55',3]]){c.strokeStyle=col;c.lineWidth=w;c.stroke();}for(const p of[g[0],g.at(-1)]){const near=lane.reduce((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)<Math.hypot(b.x-p.x,b.y-p.y)?a:b);c.strokeStyle='#77502e';c.lineWidth=5;c.beginPath();c.moveTo(near.x+near.nx*30*rail.side,near.y+near.ny*30*rail.side);c.lineTo(p.x,p.y);c.stroke();oval(c,p.x,p.y+2,5,3,'#5c6240');c.fillStyle='#bd914b';c.fillRect(p.x-3,p.y-7,6,9);oval(c,p.x,p.y-7,4,2,'#e1b965','#644d2c',1);}}
  return{id,index,center:[...center],lane,rails,bounds,image,halfSpan,deckWidth:ROAD_WIDTH};
 });
 const pad=canvas(208,160),pc=pad.getContext('2d');pc.scale(2,2);const x=52,y=40;oval(pc,x+2,y+10,45,24,'#234b4266');oval(pc,x,y+5,41,24,'#6c8267','#2d493d',2.6);oval(pc,x,y-2,41,23,'#a7ad7a','#3c5745',2.2);oval(pc,x,y-6,39,21,'#f2dba1','#574f35',2.2);oval(pc,x,y-7,31,16,'#fff0bc','#b3985a',1.4);for(let i=0;i<10;i++){const a=i*Math.PI/5;pc.beginPath();pc.moveTo(x+Math.cos(a)*32,y-6+Math.sin(a)*16);pc.lineTo(x+Math.cos(a)*38,y-6+Math.sin(a)*20);pc.strokeStyle='#a08e5d';pc.lineWidth=1.3;pc.stroke();}poly(pc,[[x,y-14],[x+10,y-7],[x,y],[x-10,y-7]],'#8e7444','#6d633d',1.2);poly(pc,[[x,y-11],[x+5,y-7],[x,y-3],[x-5,y-7]],'#fff6d4');
 let land=0,total=0;for(let y=2;y<768;y+=4)for(let x=2;x<1280;x+=4){total++;if(support(x,y))land++;}
 return{layers:{water,shadow:shoreShadow,relief,ground,cascade,route},mask,pad,bridges,falls,support,habitat:{landSamples:land,totalSamples:total,floodedFraction:1-land/total,lilyGroups:lilyGroups.length,bankReeds}};
}
export function propClears(r,plan,support){
 if(r.x<0||r.x+r.w>1280||r.y+r.h>768)return false;
 for(let y=r.y;y<=r.y+r.h+2;y+=4)for(let x=r.x;x<=r.x+r.w+2;x+=4)if(distanceToPath(x,y,plan.path)<51)return false;
 if(plan.pads.some(p=>Math.hypot(Math.max(r.x-p.x,0,p.x-r.x-r.w),Math.max(r.y-p.y,0,p.y-r.y-r.h))<58))return false;
 return[-.24,0,.24].every(dx=>[-5,-2].every(dy=>support(r.x+r.w*.5+r.w*dx,r.y+r.h+dy)));
}
