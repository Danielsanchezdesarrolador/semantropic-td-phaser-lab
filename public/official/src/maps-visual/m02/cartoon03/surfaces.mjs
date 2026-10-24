/** Bright cel-shaded agricultural terrain; static M02-specific layers. */
import {makeRoadSpline,roadPoint,paintGeometricRoad,ROAD_WIDTH} from './road-geometry.mjs';
export const W=1280,H=768;
export const canvas=()=>Object.assign(document.createElement('canvas'),{width:W*2,height:H*2});
export const poly=(c,pts,fill,edge=null,width=1)=>{c.beginPath();pts.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();c.fillStyle=fill;c.fill();if(edge){c.strokeStyle=edge;c.lineWidth=width;c.stroke();}};
export const oval=(c,x,y,rx,ry,fill,edge=null,width=1)=>{c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=fill;c.fill();if(edge){c.strokeStyle=edge;c.lineWidth=width;c.stroke();}};
const rng=n=>()=>((n=(Math.imul(n,1664525)+1013904223)>>>0)/4294967296);
export const shoreY=x=>680+12*Math.sin(x/210)-42*Math.exp(-(((x-1100)/220)**2));
export const FIELD_BEDS=Object.freeze([[65,110,270,120],[700,110,155,105],[655,280,135,115],[310,270,100,135],[45,515,85,120],[1015,530,190,100]].map(Object.freeze));
export const CHANNEL=[[760,340],[785,385],[805,435],[825,495],[850,555],[870,615],[885,700]];
export function distanceToPath(x,y,path){let d=Infinity;for(let i=1;i<path.length;i++){const a=path[i-1],b=path[i],dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)));d=Math.min(d,Math.hypot(x-a[0]-dx*t,y-a[1]-dy*t));}return d;}
export function propClears(r,plan){
 if(r.y+r.h>shoreY(r.x+r.w/2)-7)return false;
 for(let y=r.y;y<=r.y+r.h;y+=7)for(let x=r.x;x<=r.x+r.w;x+=7)if(distanceToPath(x,y,plan.path)<52||distanceToPath(x,y,CHANNEL)<34)return false;
 return plan.pads.every(p=>Math.hypot(Math.max(r.x-p.x,0,p.x-r.x-r.w),Math.max(r.y-p.y,0,p.y-r.y-r.h))>65);
}
function ground(c,materials){
 c.fillStyle='#a4d83d';c.fillRect(0,0,W,H);
 // Illustrated scenic strip and aspect-preserving turf repeats, no map raster.
 c.drawImage(materials,0,0,1536,250,0,0,1280,90);
 const tile=Object.assign(document.createElement('canvas'),{width:2560,height:800}),tc=tile.getContext('2d');tc.scale(2,2);tc.imageSmoothingQuality='high';tc.drawImage(materials,0,260,1536,480,0,0,1280,400);
 tc.globalCompositeOperation='destination-in';const fade=tc.createLinearGradient(0,0,0,400);fade.addColorStop(0,'#0000');fade.addColorStop(.075,'#000');fade.addColorStop(.925,'#000');fade.addColorStop(1,'#0000');tc.fillStyle=fade;tc.fillRect(0,0,1280,400);
 for(const y of[72,432])c.drawImage(tile,0,y,1280,400);
}

function coast(c,materials,cliffs){
 // Large readable cliff facets, with a clear turf crown and a lower water plane.
 const edge=[];for(let x=-80;x<=1360;x+=20)edge.push([x,shoreY(x)]);
 poly(c,[...edge,[1360,800],[-80,800]],'#0aafd8');
 poly(c,[...edge,...edge.slice().reverse().map(([x,y])=>[x,y+65])],'#7b785a','#3e5945',2);
 // Original outlined cliff motifs, uniform scale and organic crown, sampled
 // along the authored shore only. Larger planes replace the old flat facets.
 const motifWidth=cliffs.width/3,sy=145,sh=390,scale=74/sh,tileWorld=motifWidth*.76*scale;
 for(let start=-20,index=0;start<W;start+=tileWorld,index++)for(let x=start;x<start+tileWorld;x+=.5){
  const sx=(index%3)*motifWidth+motifWidth*.12+(x-start)/scale;
  c.drawImage(cliffs,sx,sy,.5/scale,sh,x,shoreY(x)-7,.5,74);
 }
 c.save();poly(c,[...edge.map(([x,y])=>[x,y+65]),[1360,800],[-80,800]],'#08b2dc');c.clip();
 c.drawImage(materials,0,752,1536,272,0,640,1280,227);c.restore();
 c.beginPath();edge.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.strokeStyle='#335b30';c.lineWidth=5;c.stroke();c.strokeStyle='#b5db4d';c.lineWidth=2;c.stroke();
 for(let x=0;x<W;x+=36){const y=shoreY(x)+67;oval(c,x,y,20,2,'#c7f9f5');}
 const r2=rng(72);for(let i=0;i<120;i++){const x=r2()*W,y=shoreY(x)+70+r2()*80;if(y>H)continue;oval(c,x,y,4+r2()*12,1.3,i%3?'#6de4ef':'#d5fcf7');}
}
function water(c,materials){
 const segments=makeRoadSpline(CHANNEL);c.beginPath();c.moveTo(...segments[0].start);for(const s of segments)c.bezierCurveTo(...s.c1,...s.c2,...s.end);
 for(const [color,width]of[['#506b38',58],['#c9b36b',54],['#157eaa',48],['#16bddb',43]]){c.lineWidth=width;c.strokeStyle=color;c.lineCap='round';c.stroke();}
 // Illustrated water is clipped to the canal interior; banks stay separate.
 const sides=[[],[]];for(let i=0;i<CHANNEL.length;i++){const p=CHANNEL[i],a=CHANNEL[Math.max(0,i-1)],b=CHANNEL[Math.min(CHANNEL.length-1,i+1)],n=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let side=0;side<2;side++){const d=side?20:-20;sides[side].push([p[0]-(b[1]-a[1])/n*d,p[1]+(b[0]-a[0])/n*d]);}}
 c.save();poly(c,[...sides[0],...sides[1].reverse()],'#18bddc');c.clip();c.globalAlpha=.65;for(const y of[220,430,640])c.drawImage(materials,0,752,1536,272,0,y,1280,227);c.restore();
 oval(c,760,340,31,23,'#88b950','#426b37',2);oval(c,760,340,27,19,'#e3cb8b','#6e7d43',1.5);oval(c,760,339,23,15,'#1bbdd5');for(const [x,y]of[[736,331],[743,357],[775,327]])poly(c,[[x-5,y],[x,y-6],[x+6,y-3],[x+4,y+3]],'#c5bd80','#60774b',1);
 for(const [x,y]of CHANNEL){for(const d of[-12,10])oval(c,x+d,y,5,1.4,'#b6f5ed');}
 // The last reach drops over the same cliff rim into the foreground river.
 poly(c,[[863,shoreY(880)-1],[890,shoreY(880)-1],[896,shoreY(880)+68],[863,shoreY(880)+68]],'#35cce5');
 for(const x of[867,875,885]){c.fillStyle='#baf7ef';c.fillRect(x,shoreY(880)+2,2,60);}oval(c,880,shoreY(880)+69,25,4,'#e4ffec');
}
export function paintPad(c,x,y){
 oval(c,x+2,y+10,46,24,'#49672c66');oval(c,x,y+5,43,23,'#7c8252','#344d35',2);oval(c,x,y-2,43,23,'#a5966b','#4d5437',2);oval(c,x,y-7,41,21,'#f6d79a','#655438',2);oval(c,x,y-8,33,16,'#ffe6af','#a1804b',1.2);
 for(let i=0;i<8;i++){const a=i*Math.PI/4;c.beginPath();c.moveTo(x+Math.cos(a)*34,y-7+Math.sin(a)*16);c.lineTo(x+Math.cos(a)*41,y-7+Math.sin(a)*20);c.strokeStyle='#a0804b';c.lineWidth=1.5;c.stroke();}
 poly(c,[[x,y-16],[x+10,y-9],[x,y-2],[x-10,y-9]],'#b68b50','#78603b',1.4);poly(c,[[x,y-13],[x+5,y-9],[x,y-5],[x-5,y-9]],'#fff0c7');
}
export function makeSurfaces(plan,atlas,sources){
 const region=(paint,b={x:0,y:0,width:W,height:H})=>{const v=Object.assign(document.createElement('canvas'),{width:b.width*2,height:b.height*2}),c=v.getContext('2d');c.scale(2,2);c.translate(-b.x,-b.y);paint(c);return v;};
 const layer=paint=>region(paint);
 const bounds={relief:{x:0,y:600,width:1280,height:168},river:{x:720,y:300,width:220,height:468}};
 const base=layer(c=>ground(c,sources.materials)),relief=region(c=>coast(c,sources.materials,sources.cliffs),bounds.relief),river=region(c=>water(c,sources.materials),bounds.river);
 const fields=layer(c=>{
  for(const [x,y,w,h]of FIELD_BEDS){
   poly(c,[[x,y],[x+w,y+6],[x+w-4,y+h],[x,y+h-6]],'#c49d36','#6c7837',2);
   for(let dy=0;dy<h;dy+=27)for(let dx=0;dx<w;dx+=57)c.drawImage(atlas.wheat,x+dx-5,y+dy-13,82,82*atlas.wheat.height/atlas.wheat.width);
  }
  c.globalCompositeOperation='destination-out';
  for(const path of[plan.path,CHANNEL]){c.beginPath();path.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.lineCap='round';c.lineJoin='round';c.lineWidth=path===CHANNEL?95:125;c.stroke();}
  for(const p of plan.pads)oval(c,p.x,p.y,72,58,'#000');
  c.fillRect(0,674,W,H-674);c.globalCompositeOperation='source-over';
 });
 const route=layer(c=>paintGeometricRoad(c,plan.path));
 const padTile=Object.assign(document.createElement('canvas'),{width:208,height:160}),pc=padTile.getContext('2d');pc.scale(2,2);pc.translate(52,40);paintPad(pc,0,0);
 // Bridge follows the actual lane tangent where the irrigation channel crosses it.
 let crossing;for(const p of plan.path)if(!crossing||distanceToPath(...p,CHANNEL)<crossing.distance)crossing={point:p,distance:distanceToPath(...p,CHANNEL)};
 const index=plan.path.indexOf(crossing.point),a=plan.path[Math.max(0,index-1)],b=plan.path[Math.min(plan.path.length-1,index+1)],angle=Math.atan2(b[1]-a[1],b[0]-a[0]);
 bounds.bridge={x:crossing.point[0]-80,y:crossing.point[1]-80,width:160,height:160};
 const bridge=region(c=>{c.translate(...crossing.point);c.rotate(angle);c.fillStyle='#584333';c.fillRect(-52,-32,104,64);for(let x=-52;x<52;x+=9){c.fillStyle=x%3?'#d69b4a':'#e9b864';c.fillRect(x,-30,8,60);c.strokeStyle='#755031';c.lineWidth=1;c.strokeRect(x,-30,8,60);}for(const y of[-38,38]){c.strokeStyle='#4e4c31';c.lineWidth=6;c.beginPath();c.moveTo(-57,y);c.lineTo(57,y);c.stroke();c.strokeStyle='#d89e4b';c.lineWidth=3;c.stroke();for(const x of[-55,55]){poly(c,[[x-5,y-7],[x+5,y-7],[x+5,y+6],[x-5,y+6]],'#e2d09a','#655e42',1.5);}}},bounds.bridge);
 return{layers:{base,relief,river,fields,route,bridge},bounds,padTile,bridge:{x:crossing.point[0],y:crossing.point[1],angle},roadWidth:ROAD_WIDTH};
}
