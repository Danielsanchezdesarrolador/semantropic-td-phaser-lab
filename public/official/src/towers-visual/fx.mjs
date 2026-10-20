// T-03: solo animación visual. No resuelve impactos, cooldowns, HP, oro ni spawns.
// VFX de esta vitrina viven en el clock de Phaser y se cancelan por eventId.
export class TowerVfxShowcase {
 constructor(scene){this.scene=scene;this.jobs=new Map();this.seen=new Set();this.destroyed=false;this.maxJobs=24;this.maxSparks=7;}
 _job(id){const v={id,valid:true,objects:new Set(),timers:new Set(),tweens:new Set()};this.jobs.set(id,v);return v;}
 _add(j,obj){j.objects.add(obj);return obj;}
 _free(j,obj){if(obj?.active)obj.destroy();j.objects.delete(obj);}
 _tween(j,obj,config){
  if(!j.valid)return null;
  const cb=config.onComplete;
  const t=this.scene.tweens.add({...config,targets:obj,onComplete:(...args)=>{j.tweens.delete(t);if(j.valid)cb?.(...args);}});
  j.tweens.add(t);return t;
 }
 _later(j,delay,action){
  if(!j.valid)return;
  const evt=this.scene.time.delayedCall(delay,()=>{j.timers.delete(evt);if(j.valid)action();});
  j.timers.add(evt);return evt;
 }
 _flash(j,pos,color=0xffe8b0){
  const p=this._add(j,this.scene.add.ellipse(pos.x,pos.y,28,15,color,.86).setDepth(1300));
  this._tween(j,p,{alpha:0,scaleX:3.4,scaleY:2.2,duration:180,onComplete:()=>this._free(j,p)});
 }
 _ring(j,pos,color=0x91e1d8,radius=26){
  const p=this._add(j,this.scene.add.ellipse(pos.x,pos.y,radius*2,radius*.65,color,.08).setStrokeStyle(3,color,.92).setDepth(1260));
  this._tween(j,p,{alpha:0,scaleX:2.7,scaleY:2.4,duration:410,onComplete:()=>this._free(j,p)});
 }
 _spark(j,pos,color=0xf3dd9d,count=5){
  for(let i=0;i<Math.min(count,this.maxSparks);i++){
   const a=(i/count)*Math.PI*2+(i%3)*.17,dist=14+(i%3)*6;
   const dot=this._add(j,this.scene.add.circle(pos.x,pos.y,2.5+(i%2),color,.88).setDepth(1310));
   this._tween(j,dot,{x:pos.x+Math.cos(a)*dist,y:pos.y+Math.sin(a)*dist,alpha:0,duration:270+i*17,onComplete:()=>this._free(j,dot)});
  }
 }
 dispatch({eventId,type,source,target,level=1,method='A'}){
  if(this.destroyed||!eventId||this.seen.has(eventId))return false;
  if(this.jobs.size>=this.maxJobs)this.cancelEvent(this.jobs.keys().next().value);
  if(!['deploy_visual','attack_visual','upgrade_visual','selection_visual'].includes(type))return false;
  if(!source||!Number.isFinite(source.x)||!Number.isFinite(source.y))return false;
  this.seen.add(eventId);if(this.seen.size>400)this.seen=new Set([eventId]);
  const j=this._job(eventId);
  if(type==='deploy_visual')this._deploy(j,source,level);
  if(type==='attack_visual'){
   if(!target||!Number.isFinite(target.x)||!Number.isFinite(target.y)){this.cancelEvent(eventId);return false;}
   this._attack(j,source,target,level);
  }
  if(type==='upgrade_visual')this._upgrade(j,source,method);
  if(type==='selection_visual')this._ring(j,source,0xf1d18f,35);
  this._later(j,1500,()=>this.cancelEvent(eventId,false));
  return true;
 }
 _deploy(j,pt,lv){
  const color=lv===2?0xf8dba1:0x7addcf;
  this._ring(j,{x:pt.x,y:pt.y+11},color,22);
  const glow=this._add(j,this.scene.add.ellipse(pt.x,pt.y-8,24,56,color,.12).setDepth(1160));
  this._tween(j,glow,{alpha:.46,scaleX:1.5,duration:170,yoyo:true,repeat:1,onComplete:()=>this._free(j,glow)});
  this._later(j,75,()=>this._spark(j,{x:pt.x,y:pt.y-8},color,5));
  this._later(j,235,()=>this._ring(j,{x:pt.x,y:pt.y+11},color,27));
  // Aparición REAL de soldado exclusiva de P/core: esta señal no instancia actores.
 }
 _attack(j,from,to,lv){
  const color=lv===2?0x9ce5ea:0xf3dc9b;
  // Beat 1: acquire (retículo contenido, solo visual)
  const ret=this._add(j,this.scene.add.circle(to.x,to.y,13,color,0).setStrokeStyle(2,color,.65).setDepth(1208));
  this._tween(j,ret,{scale:.66,alpha:.55,duration:110,onComplete:()=>this._free(j,ret)});
  // Beat 2: windup óptico/mecánico.
  this._later(j,115,()=>{const b=this._add(j,this.scene.add.circle(from.x,from.y,8,0xd1faff,.5).setDepth(1298));this._tween(j,b,{scale:1.4,alpha:0,duration:80,onComplete:()=>this._free(j,b)});});
  // Beat 3/4/5: fire -> tracer -> impact, con el delay dentro del clock de Phaser.
  this._later(j,205,()=>{
   this._flash(j,from,color);
   const bolt=this._add(j,this.scene.add.circle(from.x,from.y,lv===2?5:4,0xfff6d6,1).setStrokeStyle(2,color).setDepth(1332));
   const trail=this._add(j,this.scene.add.graphics().setDepth(1330));
   this._tween(j,bolt,{x:to.x,y:to.y,ease:'Cubic.In',duration:lv===2?215:270,
    onUpdate:()=>{trail.clear().lineStyle(lv===2?3:2.5,color,.79).beginPath().moveTo(bolt.x-(bolt.x-from.x)*Math.min(1,75/Math.max(1,Math.hypot(bolt.x-from.x,bolt.y-from.y))),bolt.y-(bolt.y-from.y)*Math.min(1,75/Math.max(1,Math.hypot(bolt.x-from.x,bolt.y-from.y)))).lineTo(bolt.x,bolt.y).strokePath();},
    onComplete:()=>{this._free(j,bolt);this._free(j,trail);this._ring(j,to,color,16);this._spark(j,to,color,lv===2?7:5);}
   });
  });
 }
 _upgrade(j,at,method){
  // A: polvo, breve flash de obra. B: planos/guías luminosas apiladas.
  if(method==='B'){
   for(let i=0;i<3;i++){
    this._later(j,110*i,()=>{
     const frame=this._add(j,this.scene.add.rectangle(at.x,at.y-25-i*19,80+i*20,9,0x74dce5,.5).setStrokeStyle(2,0xf5dfb0,.65).setDepth(1420));
     this._tween(j,frame,{alpha:0,scaleX:1.28,y:frame.y-10,duration:410,onComplete:()=>this._free(j,frame)});
    });
   }
  }else{
   this._flash(j,{x:at.x,y:at.y-40},0xffedbc);
   for(let i=0;i<6;i++){
    const p=this._add(j,this.scene.add.circle(at.x-17+i*7,at.y,4,0xbfb7a1,.45).setDepth(1181));
    this._tween(j,p,{x:p.x+((i%2)?13:-13),y:p.y-16-(i%3)*7,alpha:0,duration:360+i*45,onComplete:()=>this._free(j,p)});
   }
  }
 }
 cancelEvent(eventId,removeSeen=false){
  const j=this.jobs.get(eventId);if(!j)return false;
  j.valid=false;
  for(const t of [...j.timers])t.remove(false);
  for(const t of [...j.tweens])t.stop();
  for(const obj of [...j.objects])this._free(j,obj);
  j.timers.clear();j.tweens.clear();this.jobs.delete(eventId);
  if(removeSeen)this.seen.delete(eventId);
  return true;
 }
 clear(){
  for(const id of [...this.jobs.keys()])this.cancelEvent(id);
  this.seen.clear();
 }
 destroy(){this.clear();this.destroyed=true;}
}
