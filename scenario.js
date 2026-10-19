'use strict';
// Datos neutrales compartidos por Canvas y Phaser: semilla y posiciones iguales.
window.T1Scene = (() => {
 let cfg=null;
 function setConfig(data){cfg=data;}
 function rng(seed){let t=seed>>>0;return()=>{t+=0x6D2B79F5;let n=Math.imul(t^(t>>>15),1|t);n^=n+Math.imul(n^(n>>>7),61|n);return((n^(n>>>14))>>>0)/4294967296;};}
 function create(count){
  if(!cfg) throw Error('Escenario JSON no cargado');
  const r=rng(cfg.seed), keys=cfg.textureKeys, base=[];
  for(let i=0;i<5;i++) base.push({id:'t'+i,k:keys.towers[i],x:150+i*212,y:320+(i%2)*90,offset:-40,scale:1,kind:'tower',life:1,phase:i*1.1});
  for(let i=0;i<8;i++) base.push({id:'s'+i,k:keys.soldier,x:140+(i%4)*260,y:400+Math.floor(i/4)*63,offset:-35,scale:.86,kind:'soldier',life:1,phase:i*.54});
  for(let i=0;i<count;i++){const k=keys.enemies[i%keys.enemies.length];const initX=65+r()*1160,initY=150+r()*420;
   // Se consumen cuatro valores de posición como en resetScene() de T1 Pixi:
   // x/y iniciales y baseX/baseY de movimiento; idéntica secuencia RNG.
   const baseX=65+r()*1160,baseY=150+r()*420;
   base.push({id:'e'+i,k,baseX,baseY,vx:9+r()*26,x:initX,y:initY,offset:-35,phase:r()*6.283,scale:k==='orco_demoledor'?1.03:.8+r()*.14,kind:'enemy',life:.2+r()*.8}); }
  return base;
 }
 function snapshot(base,time,fx=false){
  const sprites=base.map(b=>{
   let x=b.x,y=b.y,a=0;
   if(b.kind==='enemy') { x=75+((b.baseX+b.vx*time*6)%1130); y=b.baseY+Math.sin(time*1.5+b.phase)*9; a=Math.sin(time*1.4+b.phase)*.036; }
   if(b.kind==='soldier') x=b.x+Math.sin(time*1.1+b.phase)*8;
   return {id:b.id,k:b.k,x,y,angle:a,offset:b.offset,scale:b.scale,kind:b.kind,life:b.life};
  }).sort((a,b)=>a.y-b.y || a.id.localeCompare(b.id));
  const projectiles=Array.from({length:12},(_,i)=>({id:i,x:80+(i*97+time*123)%1150,y:300+Math.sin(time*2+i)*85,color:i%2?0xeacb65:0x7fe5fa,r:3}));
  const overlays=fx?sprites.filter(s=>s.kind==='enemy').map((s,i)=>({id:s.id,x:s.x,y:s.y-112*s.scale,w:40*s.scale,h:4,life:s.life,shield:i%7===0})):[];
  const effects=fx?Array.from({length:18},(_,i)=>({id:i,x:100+(i*89+time*(50+i*5))%1080,y:230+Math.sin(time*1.7+i)*135,r:3+(i%4),alpha:.45+.4*Math.abs(Math.sin(time*1.1+i)),color:[0xff914d,0x82d8ff,0x78e598][i%3]})):[];
  return {sprites,projectiles,overlays,effects,time};
 }
 return {setConfig,create,snapshot};
})();
