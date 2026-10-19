'use strict';
/* SEMANTROPIC TD · T3-B Proposal C Playable Vertical Slice · Phaser 4.2.1/WebGL2
   Cosmetic test/sandbox. NOT a conversion of official 140-wave Canvas V5.
   Draws new proprietary procedural textures with SemantropicT2CArt. */
(function(){
 const $=id=>document.getElementById(id), W=1280,H=768;
 const TYPE={scout:{hp:84,speed:67,reward:13,r:.62},brute:{hp:248,speed:37,reward:28,r:.77},seer:{hp:121,speed:73,reward:22,r:.66}};
 const TOWERS=[
  {kind:'infantry',x:98,y:472,name:'Cuartel de la Aurora',subtitle:'Guardianes de primera línea',range:150,rate:1.05,damage:19},
  {kind:'bombard',x:390,y:479,name:'Batería del Alba',subtitle:'Artillería de impacto radial',range:290,rate:3,damage:88},
  {kind:'sniper',x:738,y:351,name:'Vigía Esmeralda',subtitle:'Francotirador de precisión',range:325,rate:1.15,damage:55},
  {kind:'guardian',x:994,y:220,name:'Aguja de los Vientos',subtitle:'Magia elemental y control',range:295,rate:1.85,damage:32}
 ];
 const PATH=[[-60,322],[46,341],[130,379],[211,449],[309,521],[404,552],[496,530],[576,468],[630,390],[637,316],[682,252],[755,226],[835,244],[922,304],[1009,391],[1087,467],[1145,487],[1204,455],[1260,396],[1340,348]];
 let total=0;const lengths=[];for(let i=1;i<PATH.length;i++){const n=Math.hypot(PATH[i][0]-PATH[i-1][0],PATH[i][1]-PATH[i-1][1]);lengths.push(n);total+=n;}
 function pointAt(d){let left=d;for(let i=0;i<lengths.length;i++){if(left<=lengths[i]){const t=Math.max(0,left/lengths[i]),a=PATH[i],b=PATH[i+1];return {x:a[0]+(b[0]-a[0])*t,y:a[1]+(b[1]-a[1])*t};}left-=lengths[i];}return {x:PATH.at(-1)[0],y:PATH.at(-1)[1]};}
 function safeNum(n){return Math.max(0,Math.round(n));}
 function verifyGL(game){const g=game.renderer?.gl;return typeof WebGL2RenderingContext!=='undefined'&&g instanceof WebGL2RenderingContext?g:null;}
 function setStatus(s){$('log').textContent=s;}
 if(!window.Phaser||!window.SemantropicT2CArt){$('block-message').textContent='ERROR: no se cargó Phaser 4.2.1 o art.js. Comprueba que el despliegue haya terminado.';return;}
 const Phaser=window.Phaser;
 class ArtBattle extends Phaser.Scene{
  constructor(){super({key:'ArtBattle'});this.started=false;this.ended=false;this.mode='balanced';this.armed=false;this.enemies=[];this.shots=[];this.orbits=[];this.towers=[];this.wave=0;this.gold=350;this.lives=100;this.spawnLeft=0;this.spawnTimer=0;this.clock=0;this.soldier=null;this.selected=-1;this.speed=1;this.paused=false;this.maxWave=5;this.fxCount=0;}
  preload(){this.load.image('officialMap','../assets/mapa_original.png');}
  create(){
   window.__semantropicT3B=this;
   const gl=verifyGL(this.game); $('engine').textContent='Phaser '+Phaser.VERSION;
   $('gl').textContent=gl?String(gl.getParameter(gl.VERSION)):'NO VERIFICADO';
   $('backend').textContent=gl?'WebGL2 activo':'WebGL2 sin verificar';
   if(!gl){$('block-message').textContent='Phaser no obtuvo un contexto WebGL2 real. No certificamos esta ejecución.';setStatus('Sin WebGL2 verificado. Demo suspendida.');return;}
   try{window.SemantropicT2CArt.add(this);}
   catch(err){$('block-message').textContent='No fue posible crear los recursos: '+err.message;setStatus(err.stack||String(err));return;}
   this.add.image(0,0,'officialMap').setOrigin(0,0).setDepth(-2000);
   this.add.image(0,0,'t2c-land').setOrigin(0,0).setDisplaySize(W,H).setDepth(-1990);
   this.vignette=this.add.graphics().setDepth(5000);this.vignette.lineStyle(9,0xf4e2a3,.14).strokeRoundedRect(5,5,1270,758,28);
   // six pads from official level; only 4 contain working tower examples
   for(const [x,y] of [[96,482],[389,484],[733,351],[989,221],[995,544],[1120,611]]){
    const p=this.add.ellipse(x,y+5,81,35,0x0a3343,.20).setDepth(y-50);
    p.setStrokeStyle(2,0xf1dca2,.35);
   }
   for(const t of TOWERS){
    const ring=this.add.ellipse(t.x,t.y+2,99,32,0x032c35,.3).setDepth(t.y-25);
    ring.setStrokeStyle(3,t.kind==='guardian'?0x80fff5:0xf7d590,.75);
    const sprite=this.add.image(t.x,t.y+12,'t2c-tower-'+t.kind).setOrigin(.5,.83).setScale(.475).setDepth(t.y+2);
    const glow=this.add.ellipse(t.x,t.y-42,52,19,t.kind==='guardian'?0x68eae7:0xe7c586,0).setDepth(t.y+4);
    this.towers.push({...t,ring,sprite,glow,cd:1.2*Math.random(),fired:0});
   }
   this.soldier={hp:230,maxhp:230,cd:.1,x:238,y:461,frame:0,sprite:this.add.image(238,461,'t2c-soldier-0').setScale(.385).setOrigin(.5,.9).setDepth(480),bloodless:true};
   this.soldier.bar=this.add.graphics().setDepth(1500);
   this.soldier2={hp:195,maxhp:195,cd:.2,x:280,y:494,frame:0,sprite:this.add.image(280,494,'t2c-soldier-0').setScale(.34).setOrigin(.5,.9).setDepth(494)};
   this.soldier2.bar=this.add.graphics().setDepth(1501);
   // atmospheric motes are explicit cosmetic effects, not gameplay entities
   for(let i=0;i<28;i++){const x=(i*197+51)%1280,y=(i*337+43)%768;const col=i%4?0xe2dfac:0x74f5e9;let d=this.add.circle(x,y,i%5?1.6:2.4,col,.32).setDepth(1900);
    this.tweens.add({targets:d,y:y-28-Math.random()*50,x:x+12*Math.sin(i),alpha:.08,duration:2200+i*81,yoyo:true,repeat:-1});
    this.orbits.push(d);}
   this.input.on('pointerdown',p=>{let found=-1;this.towers.forEach((t,i)=>{if(Math.abs(p.x-t.x)<82&&Math.abs(p.y-t.y+40)<86)found=i;});if(found!==-1)this.selectTower(found);else this.closeSelection();});
   this.attachButtons();this.syncHud();
   $('blocker').style.display='none';setStatus('Escena T2-C lista. Inicia una oleada para ver bloqueos, impactos elementales y explosiones.');
   // auto-start to give a living vertical slice in the first screenshot without changing official gameplay
   this.time.delayedCall(1500,()=>{if(!this.armed)this.startWave();});
  }
  attachButtons(){
   const bind=(id,fn)=>$(id).addEventListener('click',fn);
   bind('spawn',()=>this.startWave());
   bind('restart',()=>location.reload());
   bind('pause',()=>{this.paused=!this.paused;$('pause').textContent=this.paused?'▶ REANUDAR':'Ⅱ PAUSA';setStatus(this.paused?'Simulación artística pausada':'Simulación reanudada');});
   bind('speed',()=>{this.speed=this.speed===1?2:1;$('speed').textContent='⏩ x'+this.speed;});
   for(const b of document.querySelectorAll('[data-mode]'))b.addEventListener('click',()=>{this.mode=b.dataset.mode;for(const q of document.querySelectorAll('[data-mode]'))q.classList.toggle('active',q===b);this.applyStyle();});
  }
  applyStyle(){const m=this.mode;setStatus(m==='tactical'?'Estilo táctico: menos partículas, prioridad a la lectura.':m==='cinematic'?'Estilo épico: estelas y destellos reforzados.':'Equilibrio: efectos y claridad en conjunto.');
   for(const o of this.orbits)o.setAlpha(m==='tactical'?.09:m==='cinematic'?.55:.28);
   this.towers.forEach(t=>t.glow.setAlpha(m==='cinematic'?.55:m==='tactical'?.12:.31));
  }
  closeSelection(){this.selected=-1;$('selected').classList.remove('open');this.towers.forEach(v=>v.ring.setStrokeStyle(3,v.kind==='guardian'?0x80fff5:0xf7d590,.75));}
  selectTower(i){
   this.selected=i;const t=this.towers[i];$('selected').classList.add('open');this.towers.forEach((v,j)=>{v.ring.setStrokeStyle(j===i?5:3,j===i?0xffffff:v.kind==='guardian'?0x80fff5:0xf7d590,j===i?1:.75);v.sprite.setTint(j===i?0xffffff:0xf0f5e7);});
   const specifics={infantry:'Soldado visible, bloqueo en carretera, intercambio cuerpo a cuerpo.',sniper:'Operador activo, disparos trazadores y aciertos precisos.',guardian:'Orbes arcanos, hielo, fuego y aura de control.',bombard:'Cañón pesado, trayectoria curva, explosiones de área.'};
   $('selected').innerHTML='<b style="color:#ffe7af">'+t.name+'</b><br><span style="color:#8de8d9">'+t.subtitle+'</span><br>'+specifics[t.kind]+'<br>Alcance de ensayo: '+t.range+' · Laboratorio T2-C';
  }
  startWave(){
   if(this.ended||this.spawnLeft>0||this.enemies.some(e=>e.hp>0))return;
   if(this.wave>=this.maxWave){setStatus('Las cinco oleadas de presentación ya se completaron. Reinicia la demo.');return;}
   this.wave++;this.armed=true;this.spawnLeft=6+this.wave*3;this.spawnTimer=0;
   $('spawn').disabled=true;$('spawn').textContent='✦ COMBATE EN CURSO';setStatus('Oleada artística '+this.wave+': '+this.spawnLeft+' unidades. Las rutas y valores son de ensayo, NO de campaña.');this.syncHud();
  }
  addEnemy(){
   const index=this.wave*3+this.spawnLeft;
   const kind=this.wave===1?index%4===0?'brute':'scout':index%5===0?'seer':index%3===0?'brute':'scout';
   const model=TYPE[kind],hp=model.hp*(1+this.wave*.09);
   const o=this.add.image(-60,322,'t2c-'+kind+'-0').setScale(model.r*.52).setOrigin(.5,.87).setDepth(320);
   o.setInteractive({useHandCursor:true});
   const e={kind,hp,maxhp:hp,speed:model.speed,dist:0,sprite:o,slow:0,hitFlash:0,attack:0,dead:false};
   e.bar=this.add.graphics().setDepth(2490);this.enemies.push(e);
   this.burst(-30,310,kind==='seer'?0xd4a5f9:0x82ddc5,6,.6);
  }
  syncHud(){
   $('gold').textContent=safeNum(this.gold);$('lives').textContent=safeNum(this.lives);$('wave').textContent=this.wave+' / '+this.maxWave;
   $('enemies').textContent=this.enemies.filter(e=>!e.dead).length+' activos';
  }
  burst(x,y,color,n=9,power=1){
   const count=Math.max(2,Math.round(n*(this.mode==='tactical'?.42:this.mode==='cinematic'?1.55:1)));
   for(let i=0;i<count;i++){
    const a=Math.PI*2*i/count+Math.random()*.4,d=(12+Math.random()*34)*power;
    const q=this.add.circle(x,y,1.2+Math.random()*4,color,.9).setDepth(2500);
    this.tweens.add({targets:q,x:x+Math.cos(a)*d,y:y+Math.sin(a)*d-10,scale:.1,alpha:0,duration:260+Math.random()*400,ease:'Sine.easeOut',onComplete:()=>q.destroy()});
   }
  }
  ring(x,y,color,size=28){
   const r=this.add.ellipse(x,y,size,size*.68,color,.15).setStrokeStyle(3,color,.95).setDepth(2400);
   this.tweens.add({targets:r,scale:3,alpha:0,duration:410,onComplete:()=>r.destroy()});
  }
  impact(x,y,kind){
   let col=kind==='ice'?0x79e9fa:kind==='fire'?0xffb96c:kind==='acid'?0x8ee88c:0xffe0a5;
   this.burst(x,y,col,kind==='bombard'?28:12,kind==='bombard'?1.9:1.1);this.ring(x,y,col,kind==='bombard'?47:25);
   if(kind==='bombard'&&this.mode!=='tactical'){const smoke=this.add.ellipse(x,y-6,49,33,0x63757b,.35).setDepth(2490);this.tweens.add({targets:smoke,alpha:0,scale:2,y:y-44,duration:500,onComplete:()=>smoke.destroy()});}
   if(kind==='bombard'&&this.mode!=='tactical'){
    const mark=this.add.ellipse(x,y+10,66,23,0x233635,.48).setDepth(y-2);
    this.tweens.add({targets:mark,alpha:0,duration:1800,onComplete:()=>mark.destroy()});}
  }
  damage(e,n,element){
   if(e.dead)return; e.hp-=n;e.hitFlash=.13;
   if(element==='ice')e.slow=2.6;
   if(e.hp<=0){e.dead=true;e.bar?.destroy();this.gold+=TYPE[e.kind].reward;this.impact(e.sprite.x,e.sprite.y-28,element||'normal');
    this.tweens.add({targets:e.sprite,alpha:0,y:e.sprite.y-17,scale:0.3,duration:280,onComplete:()=>e.sprite.destroy()});
   }
  }
  attack(t,target){
   if(!target||target.dead)return;
   if(t.kind==='infantry'){t.glow.setAlpha(.45);this.tweens.add({targets:t.glow,alpha:0,duration:300});return;}
   const color=t.kind==='sniper'?0xf5df9a:t.kind==='guardian'?0x8af6ef:0xffc78b;
   const start={x:t.x+(t.kind==='bombard'?33:8),y:t.y-(t.kind==='bombard'?92:106)};
   const shell=t.kind==='bombard',obj=this.add.image(start.x,start.y,shell?'t2c-shell':'t2c-orb').setScale(shell?.62:.38).setDepth(2200);
   const duration=shell?740:t.kind==='sniper'?260:490;
   this.shots.push({obj,target,kind:t.kind,x:start.x,y:start.y,startX:start.x,startY:start.y,time:0,duration,lastTrail:0});
   this.burst(start.x,start.y,t.kind==='guardian'?0x7feef9:color,t.kind==='bombard'?12:5,.65);
   t.fired++;t.sprite.setAngle(t.kind==='bombard'?-2:1);
   this.tweens.add({targets:t.sprite,angle:0,duration:180});
  }
  moveShots(dt){
   const keep=[];
   for(const p of this.shots){p.time+=dt*1000;let f=Math.min(1,p.time/p.duration);
    const target=p.target?.sprite && !p.target.dead?{x:p.target.sprite.x,y:p.target.sprite.y-32}:{x:p.x,y:p.y};
    p.x=p.startX+(target.x-p.startX)*f;p.y=p.startY+(target.y-p.startY)*f-(p.kind==='bombard'?110*4*f*(1-f):0);
    p.obj.setPosition(p.x,p.y);p.obj.setRotation(p.time*.008);
    if(p.time-p.lastTrail>45){p.lastTrail=p.time;const trail=this.add.circle(p.x,p.y,p.kind==='bombard'?6:3,p.kind==='guardian'?0x7aedef:p.kind==='bombard'?0xffd083:0xfff0c0,.65).setDepth(2150);
     this.tweens.add({targets:trail,alpha:0,scale:.2,duration:270,onComplete:()=>trail.destroy()});}
    if(f>=1){p.obj.destroy();
     if(p.kind==='bombard'){this.impact(p.x,p.y,'bombard');for(const e of this.enemies)if(!e.dead&&Math.hypot(e.sprite.x-p.x,e.sprite.y-32-p.y)<87)this.damage(e,88,'fire');}
     else if(p.kind==='guardian'){this.impact(p.x,p.y,'ice');this.damage(p.target,32,'ice');}
     else{this.impact(p.x,p.y,'normal');this.damage(p.target,55,null);}
    }else keep.push(p);
   }this.shots=keep;
  }
  enemyAtDistance(target){let dx=target.sprite.x-this.soldier.x,dy=target.sprite.y-this.soldier.y;return Math.hypot(dx,dy);}
  moveEnemies(dt){
   const s=this.soldier;
   for(const e of this.enemies){if(e.dead)continue;
    if(e.hitFlash>0){e.hitFlash-=dt;e.sprite.setTint(0xffffff);}else e.sprite.clearTint();
    e.slow=Math.max(0,e.slow-dt);
    const s2=this.soldier2;const defender=[s,s2].filter(v=>v.hp>0).find(v=>Math.hypot(e.sprite.x-v.x,e.sprite.y-v.y)<52);
    const blocking=e.kind!=='seer'&&!!defender;
    if(blocking){
     e.attack-=dt;if(e.attack<=0){e.attack=1.3;defender.hp=Math.max(0,defender.hp-(e.kind==='brute'?19:9));this.burst(defender.x,defender.y-67,0xf0c07c,5,.65);}
    }else e.dist+=(e.slow>0?.58:1)*e.speed*dt;
    const xy=pointAt(e.dist);
    e.sprite.setPosition(xy.x,xy.y+(Math.sin(this.clock*9+e.dist/12)*2));
    e.sprite.setDepth(xy.y+6);
    const frame=Math.floor(this.clock*(e.kind==='brute'?5:9)+e.dist/14)%8;e.sprite.setTexture('t2c-'+e.kind+'-'+frame);
    e.bar?.clear(); if(e.bar){const bx=xy.x-26,by=xy.y-(e.kind==='brute'?121:107);e.bar.fillStyle(0x132b36,.95).fillRoundedRect(bx,by,52,8,3);e.bar.fillStyle(0xe16f68,1).fillRoundedRect(bx+2,by+2,48*Math.max(0,e.hp/e.maxhp),4,2);if(e.slow>0)e.bar.lineStyle(1.5,0x90f1ff,.9).strokeRoundedRect(bx,by,52,8,3);}
    if(e.slow>0)e.sprite.setTint(0xa9efff);
    if(e.dist>=total){e.dead=true;this.lives=Math.max(0,this.lives-(e.kind==='brute'?12:e.kind==='seer'?8:5));this.burst(1250,376,0xf1c37a,18,1.5);e.sprite.destroy();e.bar?.destroy();}
   }
   const attackers=this.enemies.filter(e=>!e.dead&&e.kind!=='seer'&&this.enemyAtDistance(e)<63);
   if(s.hp>0&&attackers.length){s.cd-=dt;if(s.cd<=0){s.cd=.75;const target=attackers[0];this.damage(target,27,'normal');this.burst(target.sprite.x-6,target.sprite.y-42,0xffdd9c,6,.65);}}
   if(s.hp<=0){s.sprite.setAlpha(.3);if(!this._soldierRespawn){this._soldierRespawn=this.clock+6;setStatus('El defensor cayó en combate. Reaparecerá en 6 segundos (sistema de ensayo).');}}
   if(this._soldierRespawn&&this.clock>=this._soldierRespawn){s.hp=s.maxhp;s.sprite.setAlpha(1);this._soldierRespawn=0;this.burst(s.x,s.y-70,0x88f0d8,14,1.3);}
   s.sprite.setTexture('t2c-soldier-'+(Math.floor(this.clock*8)%8));s.sprite.y=461+Math.sin(this.clock*6)*2;
   s.bar.clear();s.bar.fillStyle(0x122c33,.9).fillRoundedRect(s.x-35,s.y-104,70,7,3);s.bar.fillStyle(s.hp<s.maxhp*.3?0xef846f:0x8df0b8,1).fillRoundedRect(s.x-34,s.y-103,68*(s.hp/s.maxhp),5,2);
   const s2=this.soldier2;
   if(s2.hp>0){const target2=this.enemies.find(e=>!e.dead&&Math.hypot(e.sprite.x-s2.x,e.sprite.y-s2.y)<62);if(target2){s2.cd-=dt;if(s2.cd<=0){s2.cd=.9;this.damage(target2,21,'normal');this.burst(target2.sprite.x,target2.sprite.y-35,0xf4d99e,5,.6);}}}
   if(s2.hp<=0){s2.sprite.setAlpha(.25);this._respawn2??=this.clock+5;}if(this._respawn2&&this.clock>=this._respawn2){s2.hp=s2.maxhp;this._respawn2=0;s2.sprite.setAlpha(1);this.burst(s2.x,s2.y-65,0x80ecd8,9,.7);}
   s2.sprite.setTexture('t2c-soldier-'+(Math.floor(this.clock*8+2)%8));s2.sprite.y=s2.y+Math.sin(this.clock*7)*2;
   s2.bar.clear();s2.bar.fillStyle(0x122c33,.92).fillRoundedRect(s2.x-30,s2.y-97,60,7,3);s2.bar.fillStyle(0x8df0b8,1).fillRoundedRect(s2.x-29,s2.y-96,58*(s2.hp/s2.maxhp),5,2);
  }
  update(time,delta){
   if(!this.towers.length||this.ended||this.paused)return;
   const dt=Math.min(delta/1000,.065)*this.speed;this.clock+=dt;
   if(this.spawnLeft>0){this.spawnTimer-=dt;if(this.spawnTimer<=0){this.spawnLeft--;this.spawnTimer=.61;this.addEnemy();}}
   this.moveEnemies(dt);
   for(const t of this.towers){t.cd-=dt;t.glow.setAlpha(Math.max(0,Math.sin(this.clock*3+t.x)*.09+.20));t.sprite.setY(t.y+12+Math.sin(this.clock*1.7+t.x)*1.3);
    if(t.cd<=0){const pool=this.enemies.filter(e=>!e.dead&&Math.hypot(e.sprite.x-t.x,e.sprite.y-(t.y-20))<t.range);
     if(pool.length){pool.sort((a,b)=>b.dist-a.dist);this.attack(t,pool[0]);t.cd=t.rate;}}}
   this.moveShots(dt);
   this.enemies=this.enemies.filter(e=>!e.dead||e.sprite.active);
   if(this.spawnLeft===0&&this.wave>0&&!this.enemies.some(e=>!e.dead)){
    if(!this._completeWave){this._completeWave=true;$('spawn').disabled=false;$('spawn').textContent=this.wave===this.maxWave?'✦ DEMO COMPLETA':'▶ SIGUIENTE OLEADA';setStatus('Oleada '+this.wave+' finalizada. Prueba otra dirección visual antes de continuar.');}
   }else this._completeWave=false;
   if(this.lives<=0){this.ended=true;$('spawn').disabled=true;setStatus('Fin del enfrentamiento de ensayo. Reinicia para volver a probar el arte.');}
   if(Math.floor(this.clock*4)!==this._lastHud){this._lastHud=Math.floor(this.clock*4);this.syncHud();}
  }
 }
 try{
   const canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
   const gl=canvas.getContext('webgl2',{alpha:false,antialias:true,preserveDrawingBuffer:true,depth:true,stencil:true});
   if(!gl||typeof WebGL2RenderingContext==='undefined'||!(gl instanceof WebGL2RenderingContext)){throw Error('Este navegador no puede crear WebGL2 real; el laboratorio no utilizará un fallback sin avisar.');}
   window.__t2cGame=new Phaser.Game({type:Phaser.WEBGL,width:W,height:H,canvas,context:gl,parent:'stage',backgroundColor:'#163c3a',antialias:true,render:{antialias:true,preserveDrawingBuffer:true},scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:W,height:H},audio:{noAudio:true},scene:[ArtBattle]});
   window.addEventListener('error',e=>{setStatus('Error JS: '+e.message);});
 }catch(err){$('block-message').textContent='BLOQUEADO: '+err.message;$('gl').textContent='NO DISPONIBLE';setStatus('Sin WebGL2 confirmado: no se puede certificar esta sesión.');}
})();
