/**
 * SEMANTROPIC TD — R3-A Mapa 02 «Campos del Molino», original farmland
 * illustration canvas, consistent with approved M01 C1-C/M07-Q2 palette.
 * Safe authoring layer only; NOT a playable map until core seven-wave QA.
 * READ-ONLY source: official/data/maps.v5.json + campaign140.v5.json.
 * Source 1280×768 geometry; 2x (2560×1536) HQ drawing possible.
 */
export const M02_ART_VERSION='r3-a-m02-farmland-authored-v1';
export const M02_ART_PALETTE=Object.freeze({
 pasture:'#8eba79',pastureLight:'#c1d895',pastureDark:'#659b76',
 ridge:'#477c67',roadOutline:'#a28563',road:'#dfbe8d',roadLight:'#eddaa9',
 stone:'#aeb6a4',stoneShadow:'#536d72',wood:'#946c51',woodLight:'#d8a878',
 tech:'#7fc9c3',crop:'#e3c37a',cropShadow:'#b58e59'
});
const rng=(seed)=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
const dPath=(x,y,path)=>{
 let best=Infinity;
 for(let i=1;i<path.length;i++){
  const a=path[i-1],b=path[i],dx=b[0]-a[0],dy=b[1]-a[1],len=dx*dx+dy*dy;
  const t=len?Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/len)):0;
  best=Math.min(best,Math.hypot(x-(a[0]+dx*t),y-(a[1]+dy*t)));
 }return best;
};
function validateMap(map){
 if(map?.id!==2||map?.name!=='Campos del Molino'||map.biome!=='farmland'
  ||map.path?.length!==163||map.spots?.length!==8||map.branches?.length!==0
  ||map.design?.routes!==1||map.gold!==395)throw Error('R3-A canonical M02 source mismatch');
 const f=map.path[0],last=map.path.at(-1);
 if(f[0]!==-36||f[1]!==296||last[0]!==1315||last[1]!==377)
  throw Error('R3-A start/end canonical route mismatch');
}
const rectangles=Object.freeze([
 [130,58,224,106],[382,45,170,116],[750,60,150,88],
 [49,565,100,116],[380,660,150,92],[736,676,137,72],
 [1032,565,140,98],[1120,650,128,106]
]);
const landmarks=Object.freeze([
 Object.freeze({id:'molino',x:505,y:125,kind:'mill',title:'Molino del valle'}),
 Object.freeze({id:'granja',x:1180,y:130,kind:'farm',title:'Granero de vigilancia'}),
 Object.freeze({id:'reservas',x:1140,y:666,kind:'supplies',title:'Provisiones agrícolas'})
]);
export function makeM02ArtPlan(map){
 validateMap(map);
 const pads=map.spots.map((p,i)=>Object.freeze({index:i,kind:p.kind,
  role:p.role,x:p.cx*64+32,y:p.cy*64+32}));
 const path=map.path.map(p=>Object.freeze([p[0],p[1]]));
 for(const l of landmarks){
  if(dPath(l.x,l.y,map.path)<105||pads.some(p=>Math.hypot(p.x-l.x,p.y-l.y)<95))
   throw Error('R3-A landmark overlapping protected road/socket: '+l.id);
 }
 return Object.freeze({version:M02_ART_VERSION,world:Object.freeze({width:1280,height:768}),
  theme:'Colinas agrícolas de la herradura dorada',path:Object.freeze(path),
  pads:Object.freeze(pads),landmarks,fields:rectangles.map((r,i)=>Object.freeze({id:i,rect:Object.freeze([...r])})),
  sourceId:map.id,roadWidth:110,techSource:'C1-C visual language / farmland original'});
}
function pathStroke(ctx,path,w,col){
 ctx.strokeStyle=col;ctx.lineWidth=w;ctx.lineJoin='round';ctx.lineCap='round';
 ctx.beginPath();for(let i=0;i<path.length;i++){const p=path[i];i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1])}ctx.stroke();
}
function cropRows(ctx,rect,i){
 const [x,y,w,h]=rect,p=M02_ART_PALETTE;
 ctx.save();ctx.translate(x,y);ctx.rotate((i%3-1)*.035);
 ctx.fillStyle=i%2?p.cropShadow:'#bca46b';ctx.globalAlpha=.38;
 ctx.beginPath();ctx.roundRect(0,0,w,h,14);ctx.fill();
 ctx.globalAlpha=.64;ctx.strokeStyle=p.crop;ctx.lineWidth=4;
 for(let j=14;j<h-5;j+=13){
  ctx.beginPath();ctx.moveTo(10,j);ctx.quadraticCurveTo(w*.42,j-6,w-10,j+2);ctx.stroke();
 }
 ctx.restore();
}
function mill(ctx,x,y){
 const p=M02_ART_PALETTE;ctx.save();ctx.translate(x,y);
 ctx.fillStyle='#254f4d40';ctx.beginPath();ctx.ellipse(11,63,71,22,0,0,Math.PI*2);ctx.fill();
 // raised stone base, wooden shaft and tiled roof, original military-fantasy palette
 ctx.fillStyle=p.stoneShadow;ctx.beginPath();ctx.moveTo(-42,47);ctx.lineTo(46,47);ctx.lineTo(31,-35);ctx.lineTo(-27,-35);ctx.closePath();ctx.fill();
 ctx.fillStyle=p.stone;ctx.beginPath();ctx.moveTo(-34,40);ctx.lineTo(35,40);ctx.lineTo(24,-31);ctx.lineTo(-20,-31);ctx.closePath();ctx.fill();
 ctx.fillStyle=p.wood;ctx.fillRect(-12,2,24,38);
 ctx.fillStyle='#456073';ctx.beginPath();ctx.moveTo(-47,-32);ctx.lineTo(0,-79);ctx.lineTo(48,-32);ctx.closePath();ctx.fill();
 ctx.strokeStyle='#355664';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-47,-32);ctx.lineTo(0,-79);ctx.lineTo(48,-32);ctx.stroke();
 ctx.strokeStyle=p.wood;ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(0,-23);ctx.lineTo(0,-99);ctx.moveTo(-53,-23);ctx.lineTo(53,-23);ctx.stroke();
 for(let k=0;k<4;k++){
  ctx.save();ctx.translate(0,-23);ctx.rotate(k*Math.PI/2+.25);
  ctx.fillStyle=p.woodLight;ctx.beginPath();ctx.moveTo(6,-23);ctx.lineTo(29,-62);ctx.lineTo(13,-72);ctx.lineTo(-6,-26);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#634f41';ctx.lineWidth=2;ctx.stroke();ctx.restore();
 }
 ctx.fillStyle=p.tech;ctx.beginPath();ctx.arc(0,-23,9,0,Math.PI*2);ctx.fill();
 ctx.restore();
}
function farm(ctx,x,y){
 const p=M02_ART_PALETTE;ctx.save();ctx.translate(x,y);
 ctx.fillStyle='#31584d55';ctx.beginPath();ctx.ellipse(12,31,70,26,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle=p.wood;ctx.fillRect(-59,-9,118,43);
 ctx.fillStyle='#59798b';ctx.beginPath();ctx.moveTo(-73,-12);ctx.lineTo(0,-62);ctx.lineTo(73,-12);ctx.closePath();ctx.fill();
 ctx.fillStyle=p.woodLight;ctx.fillRect(-14,6,28,28);ctx.fillRect(-47,0,18,18);
 ctx.strokeStyle='#523e39';ctx.lineWidth=3;ctx.strokeRect(-14,6,28,28);ctx.strokeRect(-47,0,18,18);
 ctx.restore();
}
function supplies(ctx,x,y){
 const p=M02_ART_PALETTE;ctx.save();ctx.translate(x,y);
 for(let i=0;i<4;i++){
  const xx=i*19-24,yy= i%2?18:1;
  ctx.fillStyle='#c49b5d';ctx.beginPath();ctx.roundRect(xx,yy,28,23,5);ctx.fill();
  ctx.strokeStyle='#a37b4c';ctx.lineWidth=3;ctx.strokeRect(xx,yy,28,23);
 }
 ctx.fillStyle=p.woodLight;ctx.fillRect(-42,25,110,7);ctx.restore();
}
function drawPad(ctx,pad){
 const pal=M02_ART_PALETTE;
 ctx.save();ctx.translate(pad.x,pad.y);
 ctx.fillStyle='#163f3f70';ctx.beginPath();ctx.ellipse(3,12,44,24,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle=pal.stoneShadow;ctx.beginPath();ctx.ellipse(0,4,40,23,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle=pal.stone;ctx.beginPath();ctx.ellipse(0,-3,40,21,0,0,Math.PI*2);ctx.fill();
 ctx.strokeStyle='#e4d9ba';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,-3,33,15,0,0,Math.PI*2);ctx.stroke();
 ctx.strokeStyle=pal.tech;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(-8,-3);ctx.lineTo(0,-9);ctx.lineTo(8,-3);ctx.lineTo(0,3);ctx.closePath();ctx.stroke();
 ctx.restore();
}
export function paintM02Artwork(ctx,plan,{density=2}={}){
 if(!ctx||!plan||plan.version!==M02_ART_VERSION||![1,2].includes(density))throw Error('Invalid R3-A M02 canvas/plan');
 const p=M02_ART_PALETTE;
 ctx.save();ctx.setTransform(density,0,0,density,0,0);
 const background=ctx.createLinearGradient(0,0,1280,768);
 background.addColorStop(0,p.pastureLight);background.addColorStop(.48,p.pasture);background.addColorStop(1,p.pastureDark);
 ctx.fillStyle=background;ctx.fillRect(0,0,1280,768);
 const r=rng(20261022);
 for(let i=0;i<360;i++){
  const x=r()*1280,y=r()*768;
  if(dPath(x,y,plan.path)<78||plan.pads.some(z=>Math.hypot(x-z.x,y-z.y)<61))continue;
  ctx.fillStyle=i%4?'#dce6a633':'#446f5833';ctx.beginPath();
  ctx.ellipse(x,y,2+r()*7,1+r()*3,r()-.5,0,Math.PI*2);ctx.fill();
 }
 for(const q of plan.fields)cropRows(ctx,q.rect,q.id);
 for(const l of plan.landmarks){
  if(l.kind==='mill')mill(ctx,l.x,l.y);
  if(l.kind==='farm')farm(ctx,l.x,l.y);
  if(l.kind==='supplies')supplies(ctx,l.x,l.y);
 }
 pathStroke(ctx,plan.path,116,p.ridge);
 pathStroke(ctx,plan.path,108,p.roadOutline);
 pathStroke(ctx,plan.path,97,p.road);
 pathStroke(ctx,plan.path,83,p.roadLight);
 pathStroke(ctx,plan.path,66,p.road);
 // Brush wear on both road edges; no change to canonical centerline.
 ctx.setLineDash([11,17]);pathStroke(ctx,plan.path,2,'#f2dba478');ctx.setLineDash([]);
 for(const pad of plan.pads)drawPad(ctx,pad);
 ctx.restore();
 return Object.freeze({density,width:1280*density,height:768*density,
  padsRendered:plan.pads.length,routeVertices:plan.path.length});
}
export function makeM02ArtCanvas(map,{density=2}={}){
 const plan=makeM02ArtPlan(map);
 if(typeof document==='undefined')throw Error('R3-A requires browser Canvas for rasterization');
 const canvas=document.createElement('canvas');canvas.width=1280*density;canvas.height=768*density;
 const ctx=canvas.getContext('2d',{alpha:false});
 if(!ctx)throw Error('Canvas2D missing');
 const qa=paintM02Artwork(ctx,plan,{density});
 return {canvas,plan,qa};
}
