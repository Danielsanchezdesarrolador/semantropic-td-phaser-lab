/** M04-HF1: one coherent original painting, registered once to canonical geometry.
 * No separate water/bridge/pad/prop layers and no gameplay implementation.
 */
import registration from './registration.mjs';
export const HF1_ART_VERSION='m04-hf1-structural-integrated-v1';
export const HF1_ART_URL=new URL('../../../../art/maps/m04/hf1/integrated-river-original.png',import.meta.url).href;
const painting=typeof document==='undefined'?null:await new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(Error('M04-HF1 painting unavailable'));im.src=HF1_ART_URL;});
export function makeM04ArtPlan(map){
 if(map?.id!==4||map.path?.length!==262||map.spots?.length!==9||map.decor?.bridge_centers?.length!==2)throw Error('M04 canonical art contract invalid');
 return {version:HF1_ART_VERSION,path:map.path.map(p=>[...p]),river:map.decor.river_path.map(p=>[...p]),bridges:map.decor.bridge_centers.map(p=>[...p]),pads:map.spots.map((p,i)=>({id:'m04-pad-'+String(i+1).padStart(2,'0'),index:i,x:p.cx*64+32,y:p.cy*64+32}))};
}
export function samplePainting(x,y){
 let dx=0,dy=0,total=0;
 for(const a of registration.anchors){const d=(x-a.target[0])**2+(y-a.target[1])**2;if(d<1e-10)return [...a.source];const weight=1/Math.pow(d,1.6);dx+=(a.source[0]-a.target[0])*weight;dy+=(a.source[1]-a.target[1])*weight;total+=weight;}
 return [x===0||x===1280?x:x+dx/total,y===0||y===768?y:y+dy/total];
}
const area=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
export function makeRegistrationMesh(){
 const xs=[...new Set([0,1280,...Array.from({length:11},(_,i)=>i*128),...registration.anchors.map(a=>a.target[0])])].sort((a,b)=>a-b);
 const ys=[...new Set([0,768,...Array.from({length:9},(_,i)=>i*96),...registration.anchors.map(a=>a.target[1])])].sort((a,b)=>a-b);
 const vertices=ys.map(y=>xs.map(x=>({target:[x,y],source:samplePainting(x,y)}))),triangles=[];let minimumAreaRatio=Infinity;
 for(let y=1;y<ys.length;y++)for(let x=1;x<xs.length;x++)for(const t of [[vertices[y-1][x-1],vertices[y-1][x],vertices[y][x]],[vertices[y-1][x-1],vertices[y][x],vertices[y][x-1]]]){
  const ratio=area(...t.map(p=>p.source))/area(...t.map(p=>p.target));if(ratio<=0)throw Error('M04-HF1 registration folds the painting');minimumAreaRatio=Math.min(minimumAreaRatio,ratio);triangles.push(t);
 }
 return {triangles,minimumAreaRatio,anchors:registration.anchors};
}
function drawTriangle(c,image,triangle,density){
 const source=triangle.map(p=>[p.source[0]*image.width/1280,p.source[1]*image.height/768]),target=triangle.map(p=>p.target),[s0,s1,s2]=source,[t0,t1,t2]=target;
 const ux=s1[0]-s0[0],uy=s1[1]-s0[1],vx=s2[0]-s0[0],vy=s2[1]-s0[1],det=ux*vy-vx*uy;
 const ax=((t1[0]-t0[0])*vy-(t2[0]-t0[0])*uy)/det,cx=(ux*(t2[0]-t0[0])-vx*(t1[0]-t0[0]))/det;
 const ay=((t1[1]-t0[1])*vy-(t2[1]-t0[1])*uy)/det,cy=(ux*(t2[1]-t0[1])-vx*(t1[1]-t0[1]))/det;
 const mx=target.reduce((s,p)=>s+p[0],0)/3,my=target.reduce((s,p)=>s+p[1],0)/3;
 c.save();c.setTransform(density,0,0,density,0,0);c.beginPath();target.forEach((p,i)=>{const d=Math.hypot(p[0]-mx,p[1]-my)||1,k=(d+.35)/d;const x=mx+(p[0]-mx)*k,y=my+(p[1]-my)*k;i?c.lineTo(x,y):c.moveTo(x,y);});c.closePath();c.clip();
 c.setTransform(ax*density,ay*density,cx*density,cy*density,(t0[0]-ax*s0[0]-cx*s0[1])*density,(t0[1]-ay*s0[0]-cy*s0[1])*density);c.drawImage(image,0,0);c.restore();
}
export function makeM04ArtCanvas(map,{density=2,baseline=false}={}){
 if(!painting||![1,2].includes(density))throw Error('M04-HF1 browser painting required');const plan=makeM04ArtPlan(map),canvas=document.createElement('canvas');canvas.width=1280*density;canvas.height=768*density;const c=canvas.getContext('2d',{alpha:false});
 const mesh=makeRegistrationMesh();
 if(baseline){c.setTransform(density,0,0,density,0,0);c.fillStyle='#a8bf98';c.fillRect(0,0,1280,768);for(const [line,width,color] of [[plan.river,104,'#5299ad'],[plan.path,84,'#d7bc8e']]){c.beginPath();line.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.lineWidth=width;c.strokeStyle=color;c.lineCap='round';c.lineJoin='round';c.stroke();}for(const p of plan.pads){c.beginPath();c.ellipse(p.x,p.y,39,21,0,0,Math.PI*2);c.fillStyle='#ead6a4';c.fill();}}
 else {c.setTransform(density,0,0,density,0,0);c.drawImage(painting,0,0,1280,768);for(const t of mesh.triangles)drawTriangle(c,painting,t,density);}
 return {canvas,plan,qa:{version:HF1_ART_VERSION,composition:'one-integrated-painting',separateScenicLayers:0,routeVertices:262,padsRendered:9,bridges:plan.bridges.map(center=>({center})),registrationAnchors:mesh.anchors,registrationTriangles:mesh.triangles.length,minimumAreaRatio:mesh.minimumAreaRatio,gameplayImplemented:false}};
}
export function mountM04Artwork(scene,map,{baseline=false}={}){
 const art=makeM04ArtCanvas(map,{baseline}),key='maps/m04/ancient-river/art-v1';scene.textures.addCanvas(key,art.canvas);const image=scene.add.image(0,0,key).setOrigin(0,0).setDisplaySize(1280,768);
 return {version:HF1_ART_VERSION,plan:art.plan,qa:art.qa,textureKey:key,destroy(){image.destroy();scene.textures.remove(key);}};
}
