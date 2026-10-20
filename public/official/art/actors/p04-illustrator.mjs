/**
 * SEMANTROPIC TD P04 • ORIGINAL 2D keypose painter; not P03 overpaint.
 * Full anatomy redrawn each pose with organic contours, volumes, boots/paws,
 * expressive face/equipment and a fixed foot-space. Independent of core.
 * Commercial-quality acceptance requires REAL visual QA and review.
 */
import {P04_CANON,P04_META,P04_STATE_FRAMES,describeP04Pose} from './p04-poses.mjs';
const TAU=Math.PI*2;
const PALETTE={
 warrior:{skin:'#719866',skinHi:'#c0c98c',skinShade:'#365f50',metal:'#89918a',metalHi:'#efe0b2',metalLo:'#3d5762',
  dark:'#283c44',cloth:'#664751',belt:'#ba8b60',eye:'#ffe098',boot:'#4b504e'},
 hound:{skin:'#aa775b',skinHi:'#f1c291',skinShade:'#66515a',metal:'#78777f',metalHi:'#c9c8ab',metalLo:'#41434d',
  dark:'#293d45',cloth:'#854b42',belt:'#bd9272',eye:'#f6bd67',boot:'#4e4847'},
 infantry_recruit:{skin:'#c69a7e',skinHi:'#f3d3ab',skinShade:'#946c5e',metal:'#648693',metalHi:'#f2e1bb',metalLo:'#34576f',
  dark:'#283c4c',cloth:'#2f7289',belt:'#c6a270',eye:'#2f434c',boot:'#41576a'},
 sniper_operator:{skin:'#c69d80',skinHi:'#e8cfaa',skinShade:'#846c5c',metal:'#55777a',metalHi:'#e5d8af',metalLo:'#35495a',
  dark:'#283d4a',cloth:'#475c53',belt:'#b49b74',eye:'#79ded6',boot:'#474f4c'}
};
function gradient(c,x1,y1,x2,y2,a,b,mid){
 const g=c.createLinearGradient(x1,y1,x2,y2);g.addColorStop(0,a);
 if(mid)g.addColorStop(.48,mid);g.addColorStop(1,b);return g;
}
function path(c,start,cmds,fill,outline='#243945',border=2.7){
 c.beginPath();c.moveTo(...start);
 for(const a of cmds){
  if(a.length===2)c.lineTo(...a);
  else if(a.length===6)c.bezierCurveTo(...a);
  else if(a.length===4)c.quadraticCurveTo(...a);
 }
 c.closePath();c.fillStyle=fill;c.fill();
 if(outline){c.strokeStyle=outline;c.lineWidth=border;c.stroke();}
}
function ribbon(c,pts,fill,out='#213b45',border=2.5){
 path(c,pts[0],pts.slice(1),fill,out,border);
}
function stroke(c,points,color,w=3){
 c.beginPath();c.moveTo(...points[0]);for(let i=1;i<points.length;i++)c.lineTo(...points[i]);
 c.lineWidth=w;c.strokeStyle=color;c.stroke();
}
function oval(c,x,y,rx,ry,fill,edge='#243943',w=2.4){
 c.beginPath();c.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),0,0,TAU);
 c.fillStyle=fill;c.fill();if(edge){c.strokeStyle=edge;c.lineWidth=w;c.stroke();}
}
function quad(c,a,b,t=0.5){return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];}
function organicLimb(c,root,elbow,tip,width,colors,upper=true){
 const [dark,light,shine]=colors;
 const perp=(a,b,w)=>{
  const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;
  return [-dy/l*w,dx/l*w];
 };
 let a=perp(root,elbow,width),b=perp(elbow,tip,width*.62),d=perp(elbow,tip,width*.48);
 const sides=[
  [root[0]+a[0],root[1]+a[1]],
  [elbow[0]+b[0],elbow[1]+b[1]],
  [tip[0]+d[0],tip[1]+d[1]],
  [tip[0]-d[0],tip[1]-d[1]],
  [elbow[0]-b[0],elbow[1]-b[1]],
  [root[0]-a[0],root[1]-a[1]]
 ];
 ribbon(c,[sides[0],[...quad(sides[0],sides[1],.6),...sides[1]],sides[2],sides[3],sides[4],sides[5]],
  gradient(c,root[0]-width,root[1],tip[0]+width,tip[1],shine,dark,light),'#273943',2.6);
 oval(c,elbow[0],elbow[1],width*.65,width*.6,light,'#354851',2);
 if(upper)stroke(c,[quad(root,elbow,.2),quad(root,elbow,.62)],shine,1.8);
}
function boot(c,at,size,p){
 const [x,y]=at;
 ribbon(c,[[x-size*.65,y-13],[x+size*.5,y-15],[x+size*.73,y-5],[x+size*.52,y+1],
  [x-size*.82,y+1],[x-size*.94,y-4]],
 gradient(c,x-size,y-17,x+size,y+2,p.metal,p.boot,p.metalLo),p.dark,2.7);
 stroke(c,[[x-size*.7,y-3],[x+size*.55,y-4]],p.belt,1.8);
}
function polishedPlate(c,pts,p){
 ribbon(c,pts,gradient(c,-30,-150,33,-83,p.metalHi,p.metalLo,p.metal),p.dark,3);
}
function bossGem(c,x,y,s,fill='#6bd8d1'){
 ribbon(c,[[x,y-s],[x+s*.7,y-s*.24],[x+s*.35,y+s],[x-s*.62,y+s*.32]],
  fill,'#355563',1.8);
 stroke(c,[[x,y-s*.75],[x,y+s*.65]],'#eaffed',1.4);
}
function sword(c,x,y,angle){
 c.save();c.translate(x,y);c.rotate(angle);
 stroke(c,[[0,8],[0,-51]],'#263e4b',10);
 stroke(c,[[0,8],[0,-51]],'#b08d59',6);
 ribbon(c,[[-7,-37],[1,-80],[10,-37],[4,-21]],
  gradient(c,-10,-78,12,-28,'#effffd','#7c9aaf','#d1e0e0'),'#304b58',2.7);
 stroke(c,[[-14,-25],[15,-25]],'#ebc98e',6);
 bossGem(c,1,-26,5);c.restore();
}
function axe(c,x,y,angle){
 c.save();c.translate(x,y);c.rotate(angle);
 stroke(c,[[1,13],[1,-60]],'#304654',13);
 stroke(c,[[1,13],[1,-60]],'#ae8c61',7.5);
 ribbon(c,[[-4,-62],[-18,-73],[-39,-82],[-36,-54],[-16,-39],[-3,-44]],
  gradient(c,-43,-83,-8,-41,'#fff2dc','#627c81','#b1b9ab'),'#284251',3.3);
 ribbon(c,[[-3,-61],[13,-75],[22,-52],[7,-38]],'#65757c','#294753',3);
 stroke(c,[[-30,-74],[-26,-55]],'#f5e5ce',2.1);bossGem(c,2,-51,6,'#e39b66');c.restore();
}
function shield(c,x,y,rotation,p,active){
 c.save();c.translate(x,y);c.rotate(rotation);
 ribbon(c,[[-22,-30],[9,-32],[24,-13],[19,21],[-1,35],[-22,11]],
 gradient(c,-28,-28,30,33,active?'#c3eae5':'#a5c6ba','#1f677e','#378b9b'),'#29465d',4.2);
 ribbon(c,[[-15,-23],[8,-25],[17,-10],[12,16],[0,25],[-15,5]],
 gradient(c,-18,-20,25,26,'#95e1d8','#346887'),'#efc88d',2.5);
 bossGem(c,-1,-2,9,'#e0c479');c.restore();
}
function faceOrc(c,p,m){
 c.save();
 // Torso rig is local y=-88. Faces are authored in FULL foot-space coordinates.
 // Undo torso-space origin before drawing the head, or it clips off the atlas.
 c.translate(0,88);
 c.translate(m.chin*8,m.breath*.26);c.rotate(m.chin*.5);
 oval(c,0,-137,28,27,gradient(c,-27,-158,27,-116,p.skinHi,p.skinShade,p.skin),'#2d4d40',3.6);
 // Tapered ears and angular nose, not an interchangeable human head.
 ribbon(c,[[-19,-146],[-35,-154],[-33,-136],[-20,-130]],p.skin,'#3b584b',2.2);
 ribbon(c,[[20,-146],[34,-151],[31,-135],[23,-132]],p.skin,'#3b584b',2.2);
 ribbon(c,[[-10,-127],[4,-119],[19,-127],[12,-111],[-5,-112]],p.skinShade,'#315544',2.2);
 oval(c,-10,-137,5,m.blink?.8:3.6,p.eye,'#2d483e',1.8);
 oval(c,14,-139,5,m.blink?.8:3.6,p.eye,'#2d483e',1.8);
 stroke(c,[[-19,-146],[-8,-143]],p.dark,4.1);stroke(c,[[7,-143],[21,-147]],p.dark,4.1);
 // Jaw opens on attack, compressed on block/hit; clean fantasy facial acting.
 const open=m.state==='attack'?Math.max(0,m.attackPhase-1)*1.2:0;
 ribbon(c,[[-12,-119],[-4,-115+open],[11,-116+open],[13,-109+open],[-11,-108]],'#394e3c','#2d4b43',1.8);
 ribbon(c,[[-9,-111+open],[-5,-120+open],[-1,-110+open]],'#f1e8cc','',0);
 ribbon(c,[[6,-111+open],[10,-119+open],[13,-111+open]],'#f1e8cc','',0);
 // Brow scar and mane tufts: large readable, no micro-text.
 stroke(c,[[16,-133],[22,-124]],'#cbb48a',2.4);
 for(const xx of [-18,-4,12])ribbon(c,[[xx,-158],[xx+5,-176+(xx===-4?-6:0)],[xx+13,-159]],
  '#b45f48','#384449',2.3);
 c.restore();
}
function faceRecruit(c,p,m,isSniper){
 oval(c,0,-136,20,24,gradient(c,-20,-154,20,-112,p.skinHi,p.skinShade,p.skin),'#51616b',2.6);
 if(!isSniper){
  oval(c,-7,-132,2.8,2.7,p.eye,'',0);
  oval(c,9,-133,2.8,2.7,p.eye,'',0);
  stroke(c,[[-5,-121],[7,-121]],'#815f59',1.6);
 }
 ribbon(c,[[-24,-143],[-24,-157],[-10,-169],[14,-168],[24,-153],[22,-133],[-22,-132]],
 gradient(c,-26,-165,27,-131,p.metalHi,p.metalLo,p.metal),p.dark,3);
 ribbon(c,[[-27,-137],[-3,-144],[27,-139],[23,-130],[-24,-130]],p.metalHi,p.dark,2.4);
 if(isSniper){
  ribbon(c,[[-24,-141],[-11,-156],[11,-161],[27,-140],[23,-128],[-21,-126]],
   '#344e55','#213842',2.6);
  for(const xx of [-7,10]){
   oval(c,xx,-134,8,m.blink?3:7,'#6bc9ca','#263f4a',2);
   oval(c,xx-2,-135,2.7,2.1,'#effff2','',0);
  }
 }else{
  ribbon(c,[[-8,-168],[-2,-181],[8,-174],[14,-162]],'#2c7699','#294959',2);
  stroke(c,[[-4,-171],[5,-165]],'#b4e8d5',1.7);
 }
}
function paintBiped(c,id,m,p){
 const isOrc=id==='warrior',isSniper=id==='sniper_operator';
 const spread=isOrc?22:17;
 const legColor=[p.metalLo,p.cloth,p.metalHi];
 const legPose=m.walk;
 c.save();c.translate(-m.fall*17-m.compression*.4,m.fall*38+m.hipRoll*.25-m.breath*.14);
 c.rotate(m.fall*-.66);
 // Heavy cape and strapped gear belong BEHIND the articulated body.
 if(isSniper)ribbon(c,[[-24,-108],[-42,-91],[-48,-36],[-31,-41],[6,-37],[33,-80],[25,-114]],
  gradient(c,-45,-115,30,-36,'#859479','#405b59','#526b64'),p.dark,3.4);
 else if(isOrc)ribbon(c,[[-30,-104],[-38,-66],[-36,-43],[-3,-53],[30,-43],[36,-109]],p.cloth,p.dark,3.3);
 // FAR LEG then NEAR LEG, curves form thigh/calf volumes with visible knees.
 const entries=[{dir:-1,x:legPose?legPose.leftX:0,y:legPose?legPose.leftY:0},
                {dir:1,x:legPose?legPose.rightX:0,y:legPose?legPose.rightY:0}];
 entries.forEach((l,i)=>{
  const root=[l.dir*15,-68],knee=[l.dir*19+l.x*.43,-38+l.y*.15],end=[l.dir*spread+l.x,-13+l.y];
  organicLimb(c,root,knee,end,isOrc?12.7:10.4,legColor);
  polishedPlate(c,[[knee[0]-10,knee[1]-9],[knee[0]+7,knee[1]-9],[knee[0]+12,knee[1]+4],[knee[0]-7,knee[1]+5]],p);
  boot(c,[end[0],l.y],isOrc?21:18,p);
 });
 // Pelvis/belt, plates composed with 3/4 asymmetry.
 ribbon(c,[[-26,-82],[24,-81],[30,-63],[4,-54],[-20,-60]],
  gradient(c,-30,-80,28,-57,p.metal,p.cloth),p.dark,2.8);
 stroke(c,[[-20,-67],[18,-67]],p.belt,6);
 bossGem(c,0,-67,5,isOrc?'#ddad80':'#75c9c7');
 // The torso is one mass and rotates AROUND pelvis; neck follows it.
 c.save();c.translate(0,-88);c.rotate(m.torso);
 const radius=isOrc?40:isSniper?30:28;
 ribbon(c,[[-radius,-23],[-radius+8,-42],[radius*.3,-47],[radius,-26],[radius-1,24],[5,35],[-radius+5,20]],
  gradient(c,-radius,-41,radius,35,p.metalHi,p.metalLo,p.metal),p.dark,4);
 ribbon(c,[[-radius*.65,-14],[6,-28],[radius*.53,-13],[radius*.49,23],[-radius*.33,25]],
   gradient(c,-radius*.7,-23,radius*.55,30,p.skinHi,p.cloth,p.metal),'#3a5361',2);
 if(isOrc){
  polishedPlate(c,[[-45,-33],[-30,-46],[-12,-37],[-19,-19],[-38,-19]],p);
  polishedPlate(c,[[21,-40],[41,-39],[46,-26],[36,-16],[19,-24]],p);
  bossGem(c,-30,-37,7,'#e9a878');
 }else{
  polishedPlate(c,[[-35,-27],[-22,-39],[-10,-27],[-18,-12]],p);
  polishedPlate(c,[[17,-33],[31,-28],[33,-13],[20,-14]],p);
  bossGem(c,0,-10,8,isSniper?'#88d6db':'#74e6d1');
 }
 // LEFT SUPPORT ARM plus genuine curved forearm; no disconnected oval tubes.
 const shoulderL=[-radius*.8,-23],shoulderR=[radius*.77,-27];
 const blocked=m.state==='blocked';
 const handL=isOrc?[-47-m.compression*.5,-6]:isSniper?[-5,-10]:[-36-(blocked?6:0),-(12+(blocked?8:0))];
 const handR=isOrc?[43+m.arm*14,-6-m.arm*15]:isSniper?[32+m.arm*2,-7-m.arm*4]:[37+m.arm*14,-8-m.arm*22];
 const armSize=isOrc?13:9.5;
 organicLimb(c,shoulderL,[-radius*.95,-2],handL,armSize,[p.skinShade,p.skin,p.skinHi]);
 organicLimb(c,shoulderR,[radius+1,-6],handR,armSize,[p.skinShade,p.skin,p.skinHi]);
 if(isOrc){
  faceOrc(c,p,m);
  axe(c,handR[0],handR[1],m.weaponAngle);
  polishedPlate(c,[[-57,-10],[-40,-17],[-29,-2],[-35,13],[-56,9]],p);
 }else{
  c.save();c.translate(0,88);faceRecruit(c,p,m,isSniper);c.restore();
  if(isSniper){
   // Rifle is one readable source of geometry. Muzzle FLASH remains T05/core.
   c.save();c.translate(-7,-16);c.rotate(m.weaponAngle);
   ribbon(c,[[-14,-3],[2,-11],[48,-11],[53,-5],[40,3],[1,9],[-15,5]],
    gradient(c,-18,-14,51,8,p.metalHi,p.metalLo,p.metal),p.dark,2.9);
   stroke(c,[[20,-13],[81,-16]],'#223d4b',8);
   stroke(c,[[33,-17],[83,-18]],'#a7b4a9',3);
   ribbon(c,[[12,-15],[18,-25],[40,-26],[44,-16]],'#2a5460',p.dark,2);
   oval(c,36,-26,4,5,'#7bdfda',p.dark,1.8);
   ribbon(c,[[9,7],[23,7],[17,20],[7,16]],'#465660',p.dark,2);
   c.restore();
  }else{
   shield(c,handL[0],handL[1]+15,-.11-m.arm*.12,p,blocked);
   sword(c,handR[0],handR[1],m.weaponAngle);
  }
 }
 c.restore();c.restore();
}
function paintHound(c,m,p){
 c.save();c.translate(-m.fall*14,m.fall*31+m.bodyHeight*.7+m.compression*.16);
 c.rotate(-m.fall*.4);
 const q=m.quad,stretch=m.bodyStretch;
 // Tail under/behind rump, with drag-inertia not synced to all feet.
 c.beginPath();c.moveTo(-54,-68);
 c.bezierCurveTo(-74,-89-(q?.tailLag??0),-88,-105+(q?.tailLag??0),-79,-74+(q?.tailLag??0));
 c.lineWidth=19;c.strokeStyle=p.dark;c.stroke();
 c.lineWidth=12;c.strokeStyle=p.skinHi;c.stroke();
 // Articulated four DIFFERENT joints, diagonal pairs. Far paws first.
 const legs=[
  {label:'hindFar',root:[-43,-51],near:false,hind:true},
  {label:'frontFar',root:[27,-55],near:false,hind:false},
  {label:'hindNear',root:[-30,-52],near:true,hind:true},
  {label:'frontNear',root:[39,-55],near:true,hind:false}
 ];
 function leg(l){
  const gait=q?.paws[l.label]??{x:0,y:0};
  const end=[l.root[0]+gait.x,0+gait.y];
  const knee=[l.root[0]+gait.x*.5+(l.hind?-10:8),-26+gait.y*.22];
  organicLimb(c,l.root,knee,[end[0],end[1]-7],l.hind?10.5:10,
    [p.skinShade,l.near?p.skin:p.metal,p.skinHi]);
  ribbon(c,[[end[0]-10,end[1]-8],[end[0]+7,end[1]-10],
   [end[0]+14,end[1]-2],[end[0]-10,end[1]+1]],
   gradient(c,end[0]-12,end[1]-10,end[0]+12,end[1]+3,p.skinHi,p.boot),p.dark,2.2);
  for(let k=-5;k<=8;k+=7)stroke(c,[[end[0]+k,end[1]-4],[end[0]+k+3,end[1]]],
    '#e8d1ad',1.5);
 }
 legs.filter(v=>!v.near).forEach(leg);
 // Anatomical flank, flexible spine, raised scapula; not a cylindrical capsule.
 c.save();c.scale(stretch,1);
 ribbon(c,[[-64,-72],[-47,-95],[-17,-89],[2,-82],[25,-93],[46,-74],[42,-51],
  [17,-40],[-13,-45],[-42,-42],[-58,-53]],
  gradient(c,-44,-94,46,-40,p.skinHi,p.skinShade,p.skin),p.dark,4);
 oval(c,-39,-56,25,19,gradient(c,-55,-72,-14,-36,p.skinHi,p.skinShade,p.skin),p.dark,2.8);
 oval(c,26,-64,24,26,gradient(c,5,-89,46,-41,p.skinHi,p.metalLo,p.skin),p.dark,3);
 // Hardened spinal crest + sinew transition, six big clear spines.
 for(let i=0;i<5;i++){
  const x=-32+i*16;
  ribbon(c,[[x-10,-80],[x-4,-98-i%2*5],[x+8,-83]],i%2?p.metal:p.metalLo,p.dark,2.1);
 }
 // Harness has fit across shoulder/hips; eye-light is distinct from ground.
 stroke(c,[[-27,-85],[-9,-48],[29,-85]],p.dark,12);
 stroke(c,[[-27,-85],[-9,-48],[29,-85]],p.belt,6);
 oval(c,-7,-65,11,11,p.metalLo,p.metalHi,2.2);bossGem(c,-6,-64,6,'#7ddad4');
 c.restore();
 legs.filter(v=>v.near).forEach(leg);
 // Head rotates from neck, not translating all forelegs.
 c.save();c.translate(m.headFocus*.17,-m.headFocus*.25);
 oval(c,50,-72,27,27,gradient(c,29,-95,75,-44,p.skinHi,p.skinShade,p.skin),p.dark,3.4);
 ribbon(c,[[52,-69],[78,-64],[86,-50],[76,-43],[53,-47]],
  gradient(c,53,-71,88,-40,'#f5d8b0','#866456',p.skin),p.dark,3.1);
 oval(c,82,-54,6,5,p.dark,p.skinHi,1.4);
 const open=m.state==='attack'?[0,3,9,6,0][m.frame]:m.state==='hit'?5:1.5;
 ribbon(c,[[52,-48],[73,-44],[69,-41+open],[56,-40+open]],
  '#60464a',p.dark,1.6);
 for(const x of [56,67])ribbon(c,[[x,-43],[x+3,-34+open],[x+7,-43]],'#fff0d6','',0);
 ribbon(c,[[31,-79],[25,-108+(q?.earLag??0)],[47,-94],[49,-76]],p.skinShade,p.dark,2.6);
 ribbon(c,[[51,-84],[72,-104-(q?.earLag??0)],[76,-75]],p.skin,p.dark,2.4);
 oval(c,57,-76,5,m.blink?.8:4,p.eye,p.dark,1.5);
 stroke(c,[[51,-83],[63,-82]],p.dark,3.2);
 c.restore();c.restore();
}
export function paintP04Frame(ctx,actorId,state,index,{silhouette=false}={}){
 if(silhouette){
  const tmp=document.createElement('canvas');tmp.width=P04_CANON.frameWidth;tmp.height=P04_CANON.frameHeight;
  const t=tmp.getContext('2d',{alpha:true});
  if(!t)throw Error('Canvas2D unavailable silhouette P04');
  paintP04Frame(t,actorId,state,index);
  t.globalCompositeOperation='source-in';t.fillStyle='#152530';
  t.fillRect(0,0,tmp.width,tmp.height);ctx.drawImage(tmp,0,0);
  return;
 }
 const p=PALETTE[actorId],motion=describeP04Pose(actorId,state,index);
 if(!p)throw Error('No painter for actor '+actorId);
 ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
 ctx.translate(P04_CANON.frameWidth*.5,P04_CANON.frameHeight*.92);
 if(actorId==='hound')paintHound(ctx,motion,p);else paintBiped(ctx,actorId,motion,p);
 ctx.restore();
}
export function makeP04Atlas(actorId){
 const actor=P04_META.find(a=>a.id===actorId);
 if(!actor)throw Error('P04 actor missing '+actorId);
 const canvas=document.createElement('canvas');
 canvas.width=P04_CANON.frameWidth*P04_CANON.columns;
 canvas.height=P04_CANON.frameHeight*P04_CANON.rows;
 const ctx=canvas.getContext('2d',{alpha:true});
 if(!ctx)throw Error('Canvas2D unavailable');
 const frames={};let n=0;
 for(const [state,count] of Object.entries(P04_STATE_FRAMES)){
  frames[state]=[];
  for(let i=0;i<count;i++,n++){
   const x=n%P04_CANON.columns*P04_CANON.frameWidth;
   const y=Math.floor(n/P04_CANON.columns)*P04_CANON.frameHeight;
   ctx.save();ctx.translate(x,y);paintP04Frame(ctx,actorId,state,i);ctx.restore();
   frames[state].push({name:state+'-'+i,x,y,w:P04_CANON.frameWidth,h:P04_CANON.frameHeight});
  }
 }
 return {actorId,atlasKey:actor.key,worldHeight:actor.worldHeight,canvas,frames,
  frameCount:n,footAnchor:P04_CANON.footAnchor,shadowAnchor:P04_CANON.shadowAnchor};
}
export function installP04Atlas(scene,entry){
 if(scene.textures.exists?.(entry.atlasKey))throw Error('P04 atlas key already exists: '+entry.atlasKey);
 scene.textures.addCanvas(entry.atlasKey,entry.canvas);
 const t=scene.textures.get(entry.atlasKey);
 for(const frs of Object.values(entry.frames))for(const f of frs)
  t.add(f.name,0,f.x,f.y,f.w,f.h);
 return entry.atlasKey;
}
export function makeP04CharacterSheet(actorId){
 if(!P04_META.some(a=>a.id===actorId))throw Error('Unrecognized character sheet P04');
 const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=820;
 const c=canvas.getContext('2d',{alpha:true});
 c.fillStyle='#132c35';c.fillRect(0,0,1200,820);
 const text=(s,x,y,size=17,color='#f7e5be')=>{
  c.fillStyle=color;c.font='700 '+size+'px system-ui';c.fillText(s,x,y);};
 const box=(x,y,w,h)=>{c.fillStyle='#24404a';c.fillRect(x,y,w,h);c.strokeStyle='#729c9b';c.lineWidth=2;c.strokeRect(x,y,w,h);};
 text('SEMANTROPIC TD · P04 · '+actorId.toUpperCase(),36,49,30);
 text('Hoja de evaluación, no sprite final aprobado',38,78,15,'#bbd9ca');
 const labels=['SILUETA','REPOSO','CONTACTO A','CONTACTO B','ANTICIPAR','ATAQUE','REACCIÓN','BLOQUEO'];
 for(let i=0;i<8;i++){
  const col=i%4,row=Math.floor(i/4),x=32+col*294,y=102+row*253;
  box(x,y,279,244);text(labels[i],x+9,y+25,17);
  const state=['idle','idle','walk','walk','attackWindup','attack','hit','blocked'][i];
  const frame=[0,1,0,4,2,2,1,1][i];
  c.save();c.translate(x+48,y+33);paintP04Frame(c,actorId,state,frame,{silhouette:i===0});c.restore();
 }
 text('TAMAÑO DE LECTURA · 44 / 64 / 80 PX',39,650,19);
 for(const [j,s] of [44,64,80].entries()){
  const x=58+j*301;
  box(x,674,240,124);
  c.save();c.translate(x+101-s/2,693);c.scale(s/176,s/176);
  paintP04Frame(c,actorId,'walk',j);c.restore();
  text(s+' px',x+16,779,17);
 }
 text('Pie .50/.92 · sombra separada · E/W espejo · render Canvas/Phaser por validar',40,814,13,'#a9d4cd');
 return canvas;
}
