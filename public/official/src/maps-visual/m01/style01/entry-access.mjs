/** M01-only rocky access. Static scenery hides the canvas cut at the entrance.
 * No actor callback, camera change, spawn change, input or per-frame processing. */
export const ENTRY_BOUNDS=Object.freeze({x:-180,y:215,width:280,height:230});
export const ENTRY_OCCLUSION=Object.freeze({right:24,top:230,bottom:388});
const polygon=(c,p,color)=>{c.beginPath();p.forEach((v,i)=>i?c.lineTo(...v):c.moveTo(...v));c.closePath();c.fillStyle=color;c.fill();};
export function paintEntryAccess(c,atlas,foreground){
 const rocks=atlas['maps/m01/style01/rocks'],shrub=atlas['maps/m01/style01/shrub'];
 c.save();
 if(!foreground){
  // A shaded opening and stone canopy make the non-playable continuation explicit.
  c.beginPath();c.ellipse(-8,329,50,58,0,0,Math.PI*2);c.fillStyle='#30472d';c.fill();
  c.drawImage(rocks,-64,232,108,108*rocks.height/rocks.width);
  c.drawImage(shrub,-40,226,84,84*shrub.height/shrub.width);
 }else{
  // The irregular foreground lip covers only the first24wu of the entrance.
  // Actors naturally emerge from behind this rock; the entire playable lane
  // beyond it stays unobstructed. The same painter continues into FIT gutters.
  const edge=[[-28,245],[-6,230],[8,230],[15,248],[23,264],[18,282],[24,299],[15,316],[21,333],[13,349],[19,364],[7,383],[-25,392],[-43,368],[-48,345],[-44,312],[-52,284]];
  polygon(c,edge,'#73704c');
  c.save();c.clip();
  polygon(c,[[-60,233],[5,230],[14,262],[-5,291],[-38,279]],'#b9a76d');
  polygon(c,[[-38,279],[-5,291],[16,272],[23,299],[-6,323],[-50,316]],'#92875b');
  polygon(c,[[-50,316],[-6,323],[21,333],[3,356],[-42,352]],'#5d6449');
  polygon(c,[[-42,352],[3,356],[19,364],[7,383],[-40,388]],'#a39460');
  for(const [x,y,w]of[[-74,235,94],[-67,278,90],[-75,326,96]])c.drawImage(rocks,x,y,w,w*rocks.height/rocks.width);
  c.restore();
  c.drawImage(shrub,-65,221,85,85*shrub.height/shrub.width);
  c.drawImage(shrub,-47,374,73,73*shrub.height/shrub.width);
 }
 c.restore();
}
export function makeEntryTexture(atlas,foreground){
 const b=ENTRY_BOUNDS,v=Object.assign(document.createElement('canvas'),{width:b.width*2,height:b.height*2}),c=v.getContext('2d');c.scale(2,2);c.translate(-b.x,-b.y);paintEntryAccess(c,atlas,foreground);return v;
}
