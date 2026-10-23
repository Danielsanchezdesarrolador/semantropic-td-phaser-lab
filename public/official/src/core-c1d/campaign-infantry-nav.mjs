/** New campaign map graph builder; M02 helpers are geometry independent. */
export {nearestM02Nav as nearestCampaignNav,shortestM02Nav as shortestCampaignNav,m02NavFormation as campaignNavFormation} from './m02-infantry-nav.mjs';
const assert=(ok,msg)=>{if(!ok)throw Error('Campaign navigation: '+msg)};
const sq=(a,b)=>(a.x-b.x)**2+(a.y-b.y)**2;
export function makeCampaignInfantryNav(points){
 assert(Array.isArray(points)&&points.length>=2,"canonical waypoint sequence required");
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
