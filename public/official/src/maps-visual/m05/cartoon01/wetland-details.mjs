/** Static, layered marsh materials. No actor, animation or gameplay ownership. */
export const oval=(c,x,y,rx,ry,fill,edge=null,line=1)=>{c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=fill;c.fill();if(edge){c.strokeStyle=edge;c.lineWidth=line;c.stroke();}};
export const poly=(c,p,fill,edge=null,line=1)=>{c.beginPath();p.forEach((v,i)=>i?c.lineTo(...v):c.moveTo(...v));c.closePath();c.fillStyle=fill;c.fill();if(edge){c.strokeStyle=edge;c.lineWidth=line;c.stroke();}};
export const wetRandom=seed=>()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
function patch(c,x,y,rx,ry,col,seed){const r=wetRandom(seed);const p=[];for(let i=0;i<12;i++){const a=i*Math.PI/6,s=.78+r()*.22;p.push([x+Math.cos(a)*rx*s,y+Math.sin(a)*ry*s]);}poly(c,p,col);}
function lily(c,x,y,size,flower){
 oval(c,x+2,y+3,size+2,size*.44,'#103f4099');
 c.beginPath();c.ellipse(x,y,size,size*.44,0,.22,Math.PI*2-.18);c.lineTo(x-1,y);c.closePath();c.fillStyle='#72aa37';c.fill();c.strokeStyle='#244f39';c.lineWidth=1;c.stroke();
 c.beginPath();c.moveTo(x-size*.7,y-1);c.quadraticCurveTo(x,y-size*.38,x+size*.6,y-1);c.strokeStyle='#b4c85d';c.stroke();
 if(flower){for(let i=0;i<5;i++){const a=i*1.25;oval(c,x+Math.cos(a)*2.8,y-3+Math.sin(a)*1.8,2.5,1.8,'#e1c7cf','#6f6680',.4);}oval(c,x,y-3,1.5,1,'#edcf76');}
}
export function reedTuft(c,x,y,size,seed){
 const r=wetRandom(seed);oval(c,x,y+1,size*.4,size*.1,'#133e4199');
 for(let i=0;i<7;i++){const dx=(r()-.5)*size*.8,h=size*(.45+r()*.5);c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+dx*.2,y-h*.7,x+dx,y-h);c.lineTo(x+dx*.45+2,y-h*.35);c.closePath();c.fillStyle=['#305b3c','#63944a','#8cac50'][i%3];c.fill();c.strokeStyle='#244a37';c.lineWidth=.65;c.stroke();if(i%3===0){c.strokeStyle='#3f6240';c.lineWidth=1.2;c.beginPath();c.moveTo(x+dx,y-h);c.lineTo(x+dx,y-h-7);c.stroke();oval(c,x+dx,y-h-6,1.5,4,'#72583c','#304534',.5);}}
}
function material(c,image,sy,sh){
 const w=768,h=w*sh/image.width;
 for(let row=0;row<Math.ceil(768/h);row++)for(let col=0;col<Math.ceil(1280/w);col++){c.save();c.translate(col*w,row*h);if(row%2){c.translate(0,h);c.scale(1,-1);}if(col%2){c.translate(w,0);c.scale(-1,1);}c.drawImage(image,0,sy,image.width,sh,0,0,w,h);c.restore();}
}
export function paintMarshWater(c,support,image){
 material(c,image,516,508);const r=wetRandom(50505);
 for(let i=0;i<180;i++){const x=r()*1280,y=r()*768;if(support(x,y))continue;oval(c,x,y,4+r()*15,.6,i%4?'#72ad8580':'#a8c8a080');}
 const groups=[];for(let i=0;i<95;i++){const x=r()*1280,y=r()*768;if(support(x,y))continue;groups.push({x,y});for(let j=0;j<3+i%3;j++){const px=x+(r()-.5)*34,py=y+(r()-.5)*18;if(!support(px,py))lily(c,px,py,4+r()*6,j===0&&i%3===0);}}
 return groups;
}
export function paintWetGround(c,image){
 material(c,image,0,510);
 // Small exposed wet clay patches among the moss, no meadow grass texture.
 const r=wetRandom(51026);for(let i=0;i<35;i++){const x=r()*1280,y=r()*768;patch(c,x,y,9+r()*16,3+r()*5,'#71654655',i+9);}
}
export function paintBankDetails(c,support,clear){
 const r=wetRandom(26105);let reeds=0;
 for(let i=0;i<1450;i++){const x=6+r()*1268,y=20+r()*730;if(!clear(x,y,28))continue;
  // Roots remain anchored to land; emergent reeds sit immediately offshore.
  if(support(x,y)&&!support(x,y+10)){oval(c,x,y-1,10+r()*10,3,'#a29b5a');c.strokeStyle='#354a38';c.lineWidth=2;c.beginPath();c.moveTo(x-7,y-3);c.quadraticCurveTo(x+2,y+3,x+3,y+11);c.stroke();}
  else if(!support(x,y)&&support(x,y-18)&&!support(x,y-4)){reedTuft(c,x,y,10+r()*7,i+12);reeds++;}
 }
 return reeds;
}
