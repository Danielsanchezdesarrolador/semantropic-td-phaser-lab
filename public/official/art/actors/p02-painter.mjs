/**
 * SEMANTROPIC TD / Equipo P / P-02: estudio procedural de dirección de arte.
 * Fuente editable; NO sustituye arte final aprobado ni invoca física/core.
 * Reusa ANIMACIONES Y POSES de P-01 y añade silueta/equipo/materiales propios.
 * A = lectura táctica compacta, B = expresión de mayor detalle, provisional.
 */
import {CAST,ANIMATIONS,FRAME_WIDTH,FRAME_HEIGHT,ATLAS_COLUMNS,createActorAtlas} from './atlas-source.mjs';

export const P02_STUDIES=Object.freeze({
 A:Object.freeze({id:'A',name:'Táctica compacta',heightFactor:0.94,detail:0.62,volume:0.72}),
 B:Object.freeze({id:'B',name:'Ilustrada expresiva',heightFactor:1.08,detail:1,volume:1.13})
});
export const P02_VERSION='P02-study-v1';
export const P02_ANIM=Object.freeze({
 warrior:Object.freeze({idle:5,walk:9,attackWindup:9,attack:12,hit:13,die:9,blocked:9}),
 hound:Object.freeze({idle:5,walk:12,attackWindup:10,attack:13,hit:13,die:10,blocked:10}),
 infantry_recruit:Object.freeze({idle:4,walk:9,attackWindup:9,attack:12,hit:12,die:9,blocked:8}),
 sniper_operator:Object.freeze({idle:5,walk:8,attackWindup:9,attack:11,hit:12,die:8,blocked:8})
});
export const P02_ANCHORS=Object.freeze({
 warrior:Object.freeze({foot:[.5,.92],shadow:[.5,1],hpOffsetWorld:108,shieldOffsetWorld:119,equipmentCue:[.72,.39]}),
 hound:Object.freeze({foot:[.5,.92],shadow:[.5,1],hpOffsetWorld:81,shieldOffsetWorld:92,equipmentCue:[.79,.53]}),
 infantry_recruit:Object.freeze({foot:[.5,.92],shadow:[.5,1],hpOffsetWorld:105,shieldOffsetWorld:116,equipmentCue:[.63,.43]}),
 sniper_operator:Object.freeze({foot:[.5,.92],shadow:[.5,1],hpOffsetWorld:97,shieldOffsetWorld:108,equipmentCue:[.81,.45]})
});
const PI=Math.PI,TAU=PI*2;
function line(c,path,color,w=2,alpha=1){
 c.beginPath();path.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));
 c.strokeStyle=color;c.lineWidth=w;c.globalAlpha=alpha;c.stroke();c.globalAlpha=1;
}
function poly(c,pts,fill,stroke='#213843',w=2){
 c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();
 c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=w;c.stroke();}
}
function ell(c,x,y,rx,ry,fill,stroke='',w=2){
 c.beginPath();c.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),0,0,TAU);
 c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=w;c.stroke();}
}
function curve(c,p,stroke,w=2){
 c.beginPath();c.moveTo(p[0],p[1]);
 for(let i=2;i<p.length;i+=6)c.bezierCurveTo(...p.slice(i,i+6));
 c.strokeStyle=stroke;c.lineWidth=w;c.stroke();
}
function crystal(c,x,y,s,fill){
 poly(c,[[x,y-s],[x+s*.65,y-s*.25],[x+s*.38,y+s*.78],[x-s*.2,y+s],[x-s*.7,y-s*.1]],fill,'#1d3d4b',2);
 poly(c,[[x,y-s],[x+s*.65,y-s*.25],[x,y+s*.55]],'#c4ece3','',0);
}
function curlStroke(c,pts,dark,light,thick){
 line(c,pts,dark,thick+3);line(c,pts,light,thick);
}
function metal(c,x,y,w,h,accent,variant,seed){
 const density=variant==='B'?10:5;
 for(let j=0;j<density;j++){
  const k=(j*17+seed*11)%31/31;
  const xx=x+((j*13+seed*7)%37)/37*w;
  const yy=y+((j*29+seed*5)%41)/41*h;
  line(c,[[xx,yy],[xx+4+3*k,yy-2]],j%3===0?accent:'#223e4a',j%3===0?2.3:1.5,j%3===0?.7:.42);
 }
}
function paintVolume(c,variant,index){
 c.save();c.globalCompositeOperation='source-atop';
 const g=c.createLinearGradient(17,0,130,FRAME_HEIGHT);
 g.addColorStop(0,variant==='B'?'rgba(255,229,170,.18)':'rgba(255,227,183,.10)');
 g.addColorStop(.36,'rgba(255,255,255,0)');
 g.addColorStop(1,variant==='B'?'rgba(11,31,46,.25)':'rgba(9,30,40,.16)');
 c.fillStyle=g;c.fillRect(0,0,FRAME_WIDTH,FRAME_HEIGHT);
 // Scattered tiny brush glints are clipped to existing form, NOT random-frame flashing.
 for(let q=0;q<(variant==='B'?38:17);q++){
  const x=((q*107+index*23)%177),y=((q*83+index*7)%183);
  line(c,[[x,y],[x+3+(q%4),y-1]],q%4===0?'#ffe8bc':'#496b73',q%4===0?1.6:.9,q%4===0?.2:.14);
 }
 c.restore();
}
function overlayOrc(c,m,d,variant){
 const b=variant==='B',k=d;
 // New asymmetrical recovered-tech pauldrons and indigo reactor shards.
 poly(c,[[-39,-125],[-49,-119],[-52,-105],[-45,-94],[-25,-94],[-22,-113]],b?'#3b4756':'#455660','#1c2b3a',4);
 poly(c,[[-47,-120],[-30,-133],[-19,-117],[-24,-111],[-43,-112]],b?'#b99e74':'#b49a79','#34444e',3);
 ell(c,-32,-117,11,6,'#718c8f','#263b4b',2);
 crystal(c,-31,-123,b?9:6,b?'#85eee8':'#87b9b3');
 if(b){
  for(const x of [-48,-37,-22]){
   poly(c,[[x,-119],[x+5,-139-(x%5)],[x+11,-118]],'#91aaac','#344851',2);
  }
 }
 // Raised trapezius/gorget reads heavy even when downsized.
 poly(c,[[-20,-117],[-3,-111],[17,-117],[11,-102],[-14,-101]],'#4b4852','#233b45',2.5);
 line(c,[[-20,-106],[-7,-98],[4,-103],[15,-97]],'#b68d6e',3);
 // War tags and three diagonal battle stripes: not copyrighted iconography.
 const swing=Math.sin(m*TAU)*(b?2.2:1.1);
 poly(c,[[-13,-86],[-3,-91],[3,-77],[-7,-73]],'#a65c47','#403b45',2);
 for(let j=0;j<3;j++)line(c,[[-15+j*8,-90+swing],[-12+j*8,-82+swing]],'#e3b78a',2.2);
 // Battle eyebrows, scar & ring independently tracking idle and gait.
 line(c,[[-15,-131],[-6,-134]],'#2a3b33',4);
 line(c,[[10,-134],[20,-130]],'#2a3b33',4);
 if(b){
  line(c,[[18,-128],[24,-117]],'#beae8b',2);
  ell(c,35,-128,2.5,3.8,'#e8b56a','#3f464b',1);
  poly(c,[[-4,-159],[0,-176],[8,-162]],'#9d463e','#29353c',2);
 }
 // Small angular pauldron highlights, follow world pose minimally.
 metal(c,-47,-128,35,29,'#d4c6a7',variant,2);
}
function overlayHound(c,t,variant){
 const b=variant==='B',breath=Math.sin(t*TAU)*2;
 // Scapular and spinal silhouette; no fake physics collision.
 poly(c,[[-42,-72],[-26,-99],[-9,-80],[9,-105],[25,-78],[37,-83],[43,-69]],
  b?'#4b4a55':'#65515b','#263b46',3.5);
 const n=b?5:3;
 for(let i=0;i<n;i++){
  const x=-32+i*17;
  poly(c,[[x-8,-75],[x-1,-98-(i%2)*8],[x+10,-75]],i%2?'#bc9a75':'#8a9a98','#31434a',2);
 }
 // A distinctive signal harness with functional-looking buckles.
 line(c,[[-19,-76],[9,-59],[35,-68]],'#3a4b51',13);
 line(c,[[-19,-76],[9,-59],[35,-68]],b?'#c07754':'#b08b61',6);
 ell(c,13,-63,10,7,'#394952','#e4be82',2);
 crystal(c,14,-63,b?6:4,'#80d7d0');
 // Facial ears, jaw underbite and eye communicate pursuit.
 ell(c,58,-75,3.5,3,'#f4bc77','#243b41',1.5);
 line(c,[[63,-59],[79,-55]],'#f8e0bf',1.8);
 for(const x of [57,67])poly(c,[[x,-52],[x+3,-44],[x+7,-53]],'#f5dfc0','#514747',1);
 if(b){
  for(let j=0;j<4;j++)line(c,[[-42+j*7,-66],[j*7-40,-70-breath]],'#e3b49d',2);
  poly(c,[[-64,-59],[-78,-80],[-65,-84]],'#cd7857','#293a3b',2);
 }
 metal(c,-33,-83,70,21,'#e6c49a',variant,3);
}
function overlayRecruit(c,t,variant){
 const b=variant==='B';
 // Orthogonal 'starfall' chestplate: enough hierarchy for recruit not Veteran.
 poly(c,[[-21,-107],[0,-116],[20,-108],[15,-87],[1,-75],[-17,-90]],'#4b8294','#274656',3);
 poly(c,[[-15,-105],[-2,-109],[0,-80],[-13,-89]],'#9fc0ba','',0);
 poly(c,[[0,-109],[15,-104],[11,-87],[0,-80]],'#c9b782','',0);
 crystal(c,1,-97,b?8:6,'#78e7d8');
 // Stronger shoulder/helmet asymmetry.
 poly(c,[[-33,-112],[-21,-123],[-8,-111],[-19,-97]],'#d9c897','#49616c',3);
 poly(c,[[18,-117],[29,-119],[36,-106],[23,-99]],'#91a8ac','#385061',3);
 if(b){
  poly(c,[[-14,-165],[-2,-191],[4,-176],[12,-188],[18,-162]],'#315d9a','#243f57',2.5);
  line(c,[[-7,-171],[3,-179]],'#9ad9e3',2.2);
 }
 // Shield enrichment stays on ally side and does not edit T core or HP.
 const guard=Math.sin(t*TAU)*(b?1.8:1);
 poly(c,[[-52,-78+guard],[-26,-80+guard],[-20,-55+guard],[-32,-37+guard],[-49,-52+guard]],
  b?'#246b8b':'#367b8a','#d6bf89',3.5);
 poly(c,[[-48,-72+guard],[-29,-73+guard],[-26,-56+guard],[-35,-46+guard],[-44,-57+guard]],
  '#65acba','#e5c78a',2);
 crystal(c,-36,-61+guard,8,'#f1d38c');
 if(b){
  metal(c,-48,-75,28,30,'#f6dfaa',variant,4);
  line(c,[[-16,-66],[6,-67],[20,-61]],'#e2c394',2);
 }
}
function overlaySniper(c,t,variant){
 const b=variant==='B',breath=Math.sin(t*TAU)*1.3;
 // A cloak with visual volume, clearly different from shield infantry.
 poly(c,[[-28,-135],[-43,-126],[-52,-55],[-24,-39],[-2,-67]],'#4c5551','#2e4149',3);
 poly(c,[[-28,-132],[-39,-120],[-43,-67],[-27,-74]],b?'#8d8269':'#668278','',0);
 poly(c,[[-25,-133],[-11,-154],[13,-147],[23,-129],[18,-116],[-21,-112]],
  '#415e60','#253d46',3.5);
 poly(c,[[-21,-131],[-5,-144],[13,-137],[17,-121],[-17,-116]],'#334b55','#b6b28d',1.5);
 crystal(c,10,-129,5,b?'#73d4ed':'#9fcbd1');
 // Rifle optical system, sling and magazine; muzzle VFX owned by Equipo T.
 const aim=breath*.45;
 line(c,[[-18,-95+aim],[74,-101+aim]],'#34414c',b?12:9);
 line(c,[[-9,-99+aim],[69,-105+aim]],'#ad8c5f',b?6:5);
 line(c,[[11,-105+aim],[38,-108+aim]],'#d0b887',2);
 poly(c,[[14,-106+aim],[19,-116+aim],[36,-117+aim],[41,-109+aim]],'#2f5261','#a2e3e5',2);
 ell(c,36,-112+aim,4,5,b?'#8be2f1':'#88bbbd','#233b44',1.2);
 line(c,[[59,-102+aim],[86,-103+aim]],'#455c64',5);
 poly(c,[[3,-88+aim],[15,-87+aim],[13,-77+aim],[5,-77+aim]],'#344c53','#a5926e',2);
 // Never shoot or add tracer here.
 if(b){
  poly(c,[[-35,-111],[-24,-112],[-28,-87],[-43,-90]],'#8e7d67','#45535a',2);
  for(let i=0;i<3;i++)ell(c,-34+i*5,-89,2.2,4.5,'#c6ac7b','#4b5558',.7);
  metal(c,-24,-112,40,48,'#dfc99d',variant,6);
 }
}
function overlay(c,actor,state,index,count,variant){
 const t=index/Math.max(1,count);
 c.save();
 c.translate(FRAME_WIDTH/2,FRAME_HEIGHT*.92);
 const fall=state==='die'?Math.min(1,t*1.25):0;
 if(fall){c.translate(-t*7,fall*22);c.rotate(-fall*.56);c.globalAlpha=1-fall*.15;}
 if(actor.kind==='orc')overlayOrc(c,t,variant);
 else if(actor.kind==='hound')overlayHound(c,t,variant);
 else if(actor.kind==='recruit')overlayRecruit(c,t,variant);
 else overlaySniper(c,t,variant);
 c.restore();
}
export function createP02Atlas(actorId,variant='A'){
 if(!P02_STUDIES[variant])throw Error('Variante P02 inválida: '+variant);
 const a=CAST.find(x=>x.actorId===actorId);
 if(!a)throw Error('Actor P02 desconocido: '+actorId);
 const base=createActorAtlas(actorId),canvas=document.createElement('canvas');
 canvas.width=base.canvas.width;canvas.height=base.canvas.height;
 const c=canvas.getContext('2d',{alpha:true});
 if(!c)throw Error('Canvas 2D necesario solo para hornear atlas P02');
 const frames={};
 let indexGlobal=0;
 for(const [state,def] of Object.entries(ANIMATIONS)){
  frames[state]=[];
  for(let i=0;i<def.frames;i++,indexGlobal++){
   const x=(indexGlobal%ATLAS_COLUMNS)*FRAME_WIDTH;
   const y=Math.floor(indexGlobal/ATLAS_COLUMNS)*FRAME_HEIGHT;
   c.save();c.translate(x,y);
   c.drawImage(base.canvas,x,y,FRAME_WIDTH,FRAME_HEIGHT,0,0,FRAME_WIDTH,FRAME_HEIGHT);
   paintVolume(c,variant,indexGlobal);
   overlay(c,a,state,i,def.frames,variant);
   c.restore();
   frames[state].push({name:state+'-'+i,x,y,w:FRAME_WIDTH,h:FRAME_HEIGHT});
  }
 }
 return {actor:a,variant,frames,canvas,framesTotal:indexGlobal,
  atlasKey:a.atlasKey+'/p02-'+variant.toLowerCase(),
  heightWorld:a.heightWorld*P02_STUDIES[variant].heightFactor,
  anchors:P02_ANCHORS[actorId]};
}
export function addP02Texture(scene,entry){
 if(!entry||!entry.atlasKey||!entry.canvas)throw Error('Atlas P02 ausente');
 scene.textures.addCanvas(entry.atlasKey,entry.canvas);
 const tx=scene.textures.get(entry.atlasKey);
 for(const fs of Object.values(entry.frames))for(const f of fs)
  tx.add(f.name,0,f.x,f.y,f.w,f.h);
 return entry.atlasKey;
}
