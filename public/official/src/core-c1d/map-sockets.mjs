/** Canonical grid-to-world projection for campaign extensions; no screen scaling. */
export function projectMapSocket(map,index){
 const p=map?.spots?.[index];
 if(!p||!Number.isInteger(index))return null;
 const x=p.cx*64+32,y=p.cy*64+32;
 return Object.freeze({socketId:`m${String(map.id).padStart(2,'0')}-pad-${String(index+1).padStart(2,'0')}`,
  index,cx:p.cx,cy:p.cy,x,y,kind:p.kind,world:Object.freeze({x,y}),
  metadata:Object.freeze({kind:p.kind,role:p.role}),interactiveRadiusWorld:54});
}
