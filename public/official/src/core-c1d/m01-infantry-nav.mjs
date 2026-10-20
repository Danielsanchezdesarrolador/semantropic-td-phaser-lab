/**
 * C1-D5 A2 — deterministický route navigation from Canvas V5 infantryNav design.
 * No changes to canonical M01 path, combat HP, targeting/balance or map geometry.
 */
const assert=(ok,msg)=>{if(!ok)throw Error("C1D5 navigation: "+msg)};
const sq=(a,b)=>{const dx=a.x-b.x,dy=a.y-b.y;return dx*dx+dy*dy};
const geom=(p)=>({x:p[0],y:p[1]});
export function makeM01InfantryNav(points){
 assert(Array.isArray(points)&&points.length===133,"133 canonical waypoints required");
 const nodes=[],keys=new Map();
 const nodeFor=p=>{
  const key=p[0].toFixed(2)+","+p[1].toFixed(2);
  if(keys.has(key))return keys.get(key);
  const id=nodes.length;keys.set(key,id);nodes.push({id,x:p[0],y:p[1],edges:[]});return id;
 };
 let prev=null;
 for(const p of points){
  const id=nodeFor(p);
  if(prev!==null&&id!==prev){
   const a=nodes[prev],b=nodes[id],cost=Math.sqrt(sq(a,b));
   if(!a.edges.some(e=>e.to===id))a.edges.push({to:id,cost});
   if(!b.edges.some(e=>e.to===prev))b.edges.push({to:prev,cost});
  }
  prev=id;
 }
 assert(nodes.length>=2,"valid graph");
 return Object.freeze({nodes,kind:"V5-shared-waypoint-graph",originalVertices:points.length});
}
export function nearestM01Nav(nav,x,y){
 assert(nav?.nodes?.length&&Number.isFinite(x)&&Number.isFinite(y),"valid nav/position");
 let best=null,score=Infinity;
 for(const n of nav.nodes){
  const d=(n.x-x)**2+(n.y-y)**2;
  if(d<score){best=n;score=d;}
 }
 return best;
}
export function shortestM01Nav(nav,start,goal){
 const nodes=nav.nodes;
 assert(Number.isInteger(start)&&Number.isInteger(goal)&&nodes[start]&&nodes[goal],"valid node ids");
 if(start===goal)return [start];
 const best=new Float64Array(nodes.length).fill(Infinity),prev=new Int32Array(nodes.length).fill(-1);
 const seen=new Set();best[start]=0;
 // Deterministic Dijkstra, identical shortest weighted graph semantics as Canvas V5.
 for(let j=0;j<nodes.length;j++){
  let at=-1,m=Infinity;
  for(let i=0;i<nodes.length;i++)if(!seen.has(i)&&best[i]<m){at=i;m=best[i];}
  if(at<0||!Number.isFinite(m))break;
  if(at===goal)break;
  seen.add(at);
  for(const e of nodes[at].edges){
   const candidate=m+e.cost;
   if(candidate<best[e.to]-1e-9){best[e.to]=candidate;prev[e.to]=at;}
  }
 }
 if(!Number.isFinite(best[goal]))return null;
 const path=[];for(let id=goal;id!==-1;id=prev[id]){
  path.push(id);if(id===start)break;
 }
 if(path.at(-1)!==start)return null;
 return path.reverse();
}
export function m01NavFormation(nav,nodeId,count,index){
 const node=nav.nodes[nodeId];assert(node&&[1,2].includes(count)&&index>=0&&index<count,"formation");
 const edges=node.edges;let tx=1,ty=0;
 if(edges.length>=2){
  const a=nav.nodes[edges[0].to],b=nav.nodes[edges.at(-1).to];tx=b.x-a.x;ty=b.y-a.y;
 }else if(edges.length){
  const a=nav.nodes[edges[0].to];tx=a.x-node.x;ty=a.y-node.y;
 }
 const len=Math.hypot(tx,ty)||1;tx/=len;ty/=len;
 const side=count===2?(index===0?-17:17):0;
 return {x:node.x-ty*side,y:node.y+tx*side,nx:-ty,ny:tx};
}
export function m01RouteCorridorDistance(nav,x,y){
 const n=nearestM01Nav(nav,x,y);return Math.hypot(x-n.x,y-n.y);
}
