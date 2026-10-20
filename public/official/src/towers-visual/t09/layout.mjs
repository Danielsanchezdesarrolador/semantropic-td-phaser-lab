/** Pure CSS pixel layout, viewport safe rect in overlay-host coordinates; no fixed resolution. */
const clamp=(n,lo,hi)=>Math.max(lo,Math.min(hi,n));
const rect=r=>r&&['left','top','right','bottom'].every(k=>Number.isFinite(r[k]))&&r.right>r.left&&r.bottom>r.top;
export function projectWorldToScreen({worldPoint,matrix,canvasRect,hostRect,renderSize}){
 if(!worldPoint||!Number.isFinite(worldPoint.x)||!Number.isFinite(worldPoint.y))throw Error('T09 invalid world point');
 if(!matrix||!['a','b','c','d','tx','ty'].every(k=>Number.isFinite(matrix[k])))throw Error('T09 camera matrix required');
 if(!rect(canvasRect)||!rect(hostRect)||!(renderSize?.width>0&&renderSize?.height>0))throw Error('T09 viewport missing');
 const x=matrix.a*worldPoint.x+matrix.c*worldPoint.y+matrix.tx;
 const y=matrix.b*worldPoint.x+matrix.d*worldPoint.y+matrix.ty;
 return {x:canvasRect.left-hostRect.left+x*(canvasRect.right-canvasRect.left)/renderSize.width,
  y:canvasRect.top-hostRect.top+y*(canvasRect.bottom-canvasRect.top)/renderSize.height};
}
const pattern={1:[[0,-58]],2:[[-46,-60],[46,-60]],3:[[-68,-61],[0,-92],[68,-61]],
 4:[[-54,-64],[54,-64],[-54,14],[54,14]]};
export function layoutContextNodes({anchorScreen,viewportSafeRect,nodeSpecs,nodeDiameter=54,preferredOrientation='auto'}={}){
 const r=viewportSafeRect;
 if(!rect(r)||!anchorScreen||!Number.isFinite(anchorScreen.x)||!Number.isFinite(anchorScreen.y))throw Error('T09 invalid safe layout');
 if(!Array.isArray(nodeSpecs)||nodeSpecs.length>4)throw Error('T09 expected 0..4 nodes');
 const count=nodeSpecs.length,d=clamp(nodeDiameter,44,72);
 if(!count)return {nodes:[],lines:[],anchorScreen:{...anchorScreen},layoutCenter:{...anchorScreen},
  safeRect:{...r},orientation:'none',fits:true,diameter:d,shiftPx:0};
 const pats=pattern[count],orientations=[['above',1,1],['below',1,-1],['left',-1,1],['right',-1,-1]];
 let best=null;
 for(const [orientation,sx,sy] of orientations){
  const pts=pats.map(([x,y])=>[x*d/54*sx,y*d/54*sy]);
  const left=r.left-Math.min(...pts.map(p=>p[0]-d/2));
  const right=r.right-Math.max(...pts.map(p=>p[0]+d/2));
  const top=r.top-Math.min(...pts.map(p=>p[1]-d/2));
  const bottom=r.bottom-Math.max(...pts.map(p=>p[1]+d/2));
  const cx=left<=right?clamp(anchorScreen.x,left,right):(left+right)/2;
  const cy=top<=bottom?clamp(anchorScreen.y,top,bottom):(top+bottom)/2;
  const shift=Math.hypot(cx-anchorScreen.x,cy-anchorScreen.y);
  const cells=pts.map(([x,y],i)=>({id:nodeSpecs[i].id,x:cx+x,y:cy+y}));
  let bad=0;
  for(const item of cells)bad+=Math.max(0,r.left-(item.x-d/2))+Math.max(0,(item.x+d/2)-r.right)+Math.max(0,r.top-(item.y-d/2))+Math.max(0,(item.y+d/2)-r.bottom);
  const score=shift+(bad*100)+(preferredOrientation===orientation?-5:0)+(orientation==='above'?-1:0);
  if(!best||score<best.score)best={orientation,score,cells,center:{x:cx,y:cy},shift};
 }
 const nodes=best.cells.map(item=>{
  const x=clamp(item.x,r.left+d/2,r.right-d/2),y=clamp(item.y,r.top+d/2,r.bottom-d/2);
  return {...item,x,y,left:x-d/2,top:y-d/2,right:x+d/2,bottom:y+d/2,width:d,height:d};
 });
 let overlaps=false;
 for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++)
  if(Math.hypot(nodes[i].x-nodes[j].x,nodes[i].y-nodes[j].y)<d+3)overlaps=true;
 const fits=(r.right-r.left)>=d&&(r.bottom-r.top)>=d&&!overlaps;
 return {nodes,lines:nodes.map(n=>({x1:anchorScreen.x,y1:anchorScreen.y,x2:n.x,y2:n.y})),
  safeRect:{...r},anchorScreen:{...anchorScreen},layoutCenter:best.center,orientation:best.orientation,
  diameter:d,fits,shiftPx:+best.shift.toFixed(2)};
}
