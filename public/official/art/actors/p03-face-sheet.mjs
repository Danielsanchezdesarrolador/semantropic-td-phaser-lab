/**
 * P03 character-study sheet (not gameplay face animation or final production sheet).
 * Original editable 2D composition derived solely from P03 rig.
 */
import {P03_ACTORS,paintP03Frame} from './p03-rig.mjs';
export const P03_SHEET_W=1200,P03_SHEET_H=820;
const PALETTES={
 warrior:['#729766','#384e44','#b59474','#d4c79d','#b95e46'],
 hound:['#a97e62','#624954','#bb9b71','#9de0d6','#333f48'],
 infantry_recruit:['#488497','#dcd1b3','#286e83','#d9b980','#384b56'],
 sniper_operator:['#405b65','#7c846a','#d7b78d','#85d8d7','#324c50']
};
function label(c,s,x,y,size=19,color='#ecdab6'){
 c.fillStyle=color;c.font='700 '+size+'px system-ui';c.fillText(s,x,y);
}
function cell(c,x,y,w,h,col='#1a3341'){
 c.fillStyle=col;c.fillRect(x,y,w,h);
 c.strokeStyle='#71918c';c.lineWidth=2;c.strokeRect(x+1,y+1,w-2,h-2);
}
function draw(c,actorId,state,frame,x,y,scale=1,silhouette=false){
 c.save();c.translate(x,y);c.scale(scale,scale);
 // paintP03Frame uses a local source cell 176×208.
 paintP03Frame(c,actorId,state,frame,{silhouette});
 c.restore();
}
export function createP03FaceSheet(actorId){
 const a=P03_ACTORS.find(x=>x.actorId===actorId);
 if(!a)throw Error('Actor desconocido de face sheet P03 '+actorId);
 const c=document.createElement('canvas');c.width=P03_SHEET_W;c.height=P03_SHEET_H;
 const x=c.getContext('2d',{alpha:true});
 if(!x)throw Error('Canvas2D requerido');
 x.fillStyle='#122530';x.fillRect(0,0,c.width,c.height);
 label(x,'SEMANTROPIC TD · P-03 · '+actorId.toUpperCase(),35,51,33);
 label(x,'BIBLIA DE ESTUDIO, NO HOJA FINAL DE EXPRESIONES',38,83,16,'#a6cfc4');
 const cols=[36,326,616,906];
 for(let i=0;i<4;i++)cell(x,cols[i],114,260,336);
 label(x,'01 · SILUETA',cols[0]+14,145,19);
 label(x,'02 · COLOR / LINE ART',cols[1]+14,145,17);
 label(x,'03 · ANTICIPACIÓN',cols[2]+14,145,17);
 label(x,'04 · REACCIÓN',cols[3]+14,145,17);
 draw(x,actorId,'idle',0,cols[0]+40,183,1.14,true);
 draw(x,actorId,'idle',1,cols[1]+40,183,1.14);
 draw(x,actorId,'attackWindup',2,cols[2]+40,183,1.14);
 draw(x,actorId,'hit',1,cols[3]+40,183,1.14);
 label(x,'Plan de materiales / facción',36,490,20);
 PALETTES[actorId].forEach((hex,i)=>{
  x.fillStyle=hex;x.fillRect(36+i*98,511,86,57);
  label(x,hex,39+i*98,590,13,'#d1cbb9');
 });
 label(x,'LECTURA EN MINIATURA · mismas poses a 44 / 64 / 80 px (ancho de caja)',36,635,19);
 for(const [j,size] of [44,64,80].entries()){
  const boxX=37+j*265;
  cell(x,boxX,655,226,130,'#213b43');
  const scale=size/176;
  draw(x,actorId,'walk',j%8,boxX+113-size/2,678,scale,false);
  label(x,size+'px',boxX+14,774,17);
 }
 label(x,'Pivote 0.50 / 0.92 · sombra independiente · escala 3/4 aún pendiente',37,808,14,'#95beb7');
 return c;
}
