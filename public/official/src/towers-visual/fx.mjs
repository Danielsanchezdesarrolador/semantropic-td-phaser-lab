// Equipo T: VFX solo VISUALES en vitrina, nunca HP/daño/oro/cooldowns.
export class TowerVfxShowcase{
 constructor(scene){this.scene=scene;this.live=new Set();this.seen=new Set();}
 keep(o){this.live.add(o);return o;}
 kill(o){if(o?.active)o.destroy();this.live.delete(o);}
 clear(){for(const o of [...this.live])this.kill(o);this.seen.clear();}
 dispatch({eventId,kind,source,target,level}){
  if(!eventId||this.seen.has(eventId))return false;
  if(!['deploy','tracer'].includes(kind))return false;
  this.seen.add(eventId);if(this.seen.size>120)this.seen=new Set([eventId]);
  if(kind==='deploy')this.deploySignal(source,level);
  else this.tracer(source,target,level);
  return true;
 }
 deploySignal(pos,level){
  const s=this.scene,color=level===2?0xf3d38d:0x7bd9d1;
  for(let n=0;n<3;n++){
   const ring=this.keep(s.add.ellipse(pos.x,pos.y,39,16,color,.24).setStrokeStyle(3,color,.92).setDepth(1200));
   s.tweens.add({targets:ring,scaleX:3+n*.4,scaleY:2.7,alpha:0,duration:550+n*100,delay:n*80,onComplete:()=>this.kill(ring)});
  }
  const glow=this.keep(s.add.rectangle(pos.x,pos.y-61,8,85,color,.7).setDepth(1201));
  s.tweens.add({targets:glow,y:glow.y-20,alpha:0,duration:600,onComplete:()=>this.kill(glow)});
 }
 tracer(source,target,level){
  const s=this.scene,laser=this.keep(s.add.circle(source.x,source.y,level===2?7:5,0xffefb2).setDepth(1350));
  const trail=this.keep(s.add.graphics().setDepth(1349));
  const flash=this.keep(s.add.ellipse(source.x,source.y,27,15,0xffe1aa,.85).setDepth(1351));
  s.tweens.add({targets:flash,alpha:0,scale:2,duration:220,onComplete:()=>this.kill(flash)});
  s.tweens.add({targets:laser,x:target.x,y:target.y,duration:level===2?300:420,ease:'Cubic.In',
   onUpdate:()=>{trail.clear().lineStyle(3,level===2?0x83e8f2:0xf1d18c,.85).beginPath().moveTo(source.x,source.y).lineTo(laser.x,laser.y).strokePath();},
   onComplete:()=>{this.kill(laser);this.kill(trail);this.impact(target,level);}});
 }
 impact(pos,level){
  const s=this.scene,color=level===2?0x81e8ee:0xf8d59b;
  const orb=this.keep(s.add.circle(pos.x,pos.y,14,color,.85).setDepth(1360));
  const ring=this.keep(s.add.circle(pos.x,pos.y,18,color,0).setStrokeStyle(3,color).setDepth(1361));
  s.tweens.add({targets:orb,alpha:0,scale:2.2,duration:280,onComplete:()=>this.kill(orb)});
  s.tweens.add({targets:ring,alpha:0,scale:2.8,duration:440,onComplete:()=>this.kill(ring)});
 }
}