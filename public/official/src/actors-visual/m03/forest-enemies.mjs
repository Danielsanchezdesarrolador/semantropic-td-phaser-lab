/** Original articulated M03 rigs. Texture frames are presentation only; CORE events
 * select windup/attack/hit/death. No sprite frame applies HP or rewards. */
export const M03_ACTOR_TYPES=Object.freeze(['foreststalker','hunter','bat']);
const STATES={idle:4,walk:8,windup:4,attack:4,hit:2,death:6};
function rig(ctx,kind,state,frame,count){
 const phase=frame/count*Math.PI*2,swing=state==='walk'?Math.sin(phase):Math.sin(phase)*.16;
 ctx.translate(64,104);ctx.lineJoin='round';ctx.lineCap='round';
 const shape=(points,fill,stroke='#182b34',width=2)=>{ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();};
 const line=(points,color,width)=>{ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();};
 const shade=(a,b)=>{const g=ctx.createLinearGradient(-16,-57,18,0);g.addColorStop(0,a);g.addColorStop(1,b);return g;};
 if(state==='death'){ctx.rotate(frame/count*1.1);ctx.globalAlpha=1-frame/count*.65;}
 if(state==='hit')ctx.translate(-3+frame*3,0);
 if(kind==='bat'){
  const flap=Math.sin(phase)*(state==='walk'?20:8),w=48;
  for(const side of [-1,1]){ctx.save();ctx.scale(side,1);shape([[3,-31],[25,-52-flap],[w,-58-flap],[43,-27],[33,-34],[26,-17],[18,-25],[9,-12]],shade('#7463a0','#242c4e'));line([[7,-30],[25,-48-flap],[42,-53-flap]],'#9d8bb2',1.5);ctx.restore();}
  shape([[-10,-44],[-13,-61],[-2,-52],[7,-59],[9,-42],[14,-23],[7,-11],[-6,-13],[-14,-28]],shade('#58678d','#192c45'));
  shape([[-6,-40],[0,-34],[-7,-34]],'#b7f1cc',undefined,1);shape([[3,-40],[10,-39],[7,-33]],'#b7f1cc',undefined,1);
  line([[-5,-22],[-3,-18]],'#f5e8be',2);line([[5,-22],[3,-18]],'#f5e8be',2);return;
 }
 const hunter=kind==='hunter',advance=state==='attack'?9:state==='windup'?-4:0;
 // Boots, separated knees, layered cloak and upper armour give true silhouette differences.
 for(const side of [-1,1]){const x=side*8,step=swing*side*7;line([[x,-27],[x+step*.5,-12],[x+step,-2]],'#24394a',9);line([[x+step,-2],[x+step+5,0]],'#182a32',7);}
 shape([[-16,-49],[12,-54],[21,-19],[9,-22],[3,-13],[-8,-22],[-21,-17]],shade(hunter?'#9a7447':'#3e7772',hunter?'#385646':'#1e4249'));
 shape([[-12,-51],[13,-51],[10,-30],[-10,-29]],shade('#6f8b84','#354953'));
 line([[-10,-38],[9,-36]],hunter?'#e3bd69':'#9dc4aa',2);
 shape([[-14,-53],[-13,-66],[-3,-77],[10,-70],[17,-56],[11,-46],[-8,-46]],shade(hunter?'#88704c':'#4b6c62',hunter?'#394337':'#243d40'));
 shape([[-7,-62],[8,-62],[10,-52],[-5,-52]],'#192d37');line([[-4,-57],[0,-57]],'#a0f5b2',2);line([[5,-57],[8,-57]],'#a0f5b2',2);
 if(hunter){
  // Crossbow and quiver, rather than the archer/warrior gear fallback.
  line([[-12,-47],[-24,-59]],'#876740',6);line([[-24,-62],[-17,-69]],'#ddc9a0',2);
  line([[9,-45],[23+advance,-39],[30+advance,-43]],'#987349',7);
  line([[17+advance,-58],[26+advance,-44],[18+advance,-29]],'#c6ac78',3);line([[17+advance,-58],[18+advance,-29]],'#ded5b0',1);
  line([[10+advance,-43],[36+advance,-43]],'#9db0ac',3);
 }else{
  line([[-13,-47],[-23-swing*4,-30]],'#426860',8);line([[13,-46],[22+advance,-32]],'#426860',8);
  shape([[22+advance,-35],[35+advance,-55],[33+advance,-28],[25+advance,-20]],shade('#d1e7cb','#719d9c'));
  shape([[-18,-35],[-24,-30],[-29,-42],[-27,-23],[-18,-21]],'#95b6a0');
  line([[-15,-68],[-21,-76]],'#c3c494',3);line([[12,-67],[19,-76]],'#c3c494',3);
 }
}
export function registerM03Actors(scene){
 for(const kind of M03_ACTOR_TYPES){
  const total=Object.values(STATES).reduce((a,b)=>a+b,0),c=document.createElement('canvas');c.width=128*total;c.height=128;
  const ctx=c.getContext('2d');let index=0;const frames=[];
  for(const [state,count] of Object.entries(STATES))for(let f=0;f<count;f++){
   ctx.save();ctx.translate(index*128,0);rig(ctx,kind,state,f,count);ctx.restore();frames.push({name:state+'-'+f,index:index++});
  }
  const tex=scene.textures.addCanvas('m03-actor-'+kind,c);for(const f of frames)tex.add(f.name,0,f.index*128,0,128,128);
 }
 const events=new Map(),deaths=new Set();
 return {
  owns:kind=>M03_ACTOR_TYPES.includes(kind),
  make(kind,x,y){if(!M03_ACTOR_TYPES.includes(kind))return null;
   const scale=kind==='bat'?.85:kind==='hunter'?.95:1,sprite=scene.add.image(0,kind==='bat'?-10:0,'m03-actor-'+kind,'walk-0').setOrigin(.5,104/128).setScale(scale);
   const shadow=scene.add.ellipse(0,3,kind==='bat'?28:25,7,0x142e37,.35),barY=kind==='bat'?-78:-87,back=scene.add.rectangle(0,barY,30,4,0x1c2936),hp=scene.add.rectangle(-15,barY,30,4,0x8de5ad).setOrigin(0,.5);
   return {custom:true,view:scene.add.container(x,y,[shadow,sprite,back,hp]),sprite,hp,baseScale:scale,actorId:kind};
  },
  isDead:id=>deaths.has(id),
  event(ev,seconds){if(ev.type==='entity_die')deaths.add(ev.entityId);if(ev.type==='entity_escape')events.delete(ev.entityId);if(ev.type==='enemy_attack_windup')events.set(ev.entityId,{state:'windup',at:seconds,duration:ev.windup||.3});if(ev.type==='enemy_attack_fire')events.set(ev.entityId,{state:'attack',at:seconds,duration:.22});if(ev.type==='hit_applied')events.set(ev.entityId,{state:'hit',at:seconds,duration:.15});},
  present(v,e,seconds,{dead=false}={}){
   const event=events.get(e.id);let state=dead?'death':event&&seconds<event.at+event.duration?event.state:e.blockedBy?'idle':'walk';
   const elapsed=dead?seconds-v.deathAt:event&&state===event.state?seconds-event.at:seconds;
   const frame=dead?Math.min(5,Math.floor(elapsed/.05)):Math.floor(elapsed*(state==='walk'?12:16))%STATES[state];
   v.sprite.setFrame(state+'-'+Math.max(0,frame)).setFlipX(Math.cos(e.heading)<0);
   v.sprite.y=e.type==='bat'?-12+Math.sin(seconds*6)*2:Math.abs(Math.sin(seconds*10))*1.1;
   if(dead)v.hp.setVisible(false);v.lastEntity={...e};
  },
  forget(id){events.delete(id);deaths.delete(id);},destroy(){events.clear();deaths.clear();for(const k of M03_ACTOR_TYPES)scene.textures.remove('m03-actor-'+k);}
 };
}
