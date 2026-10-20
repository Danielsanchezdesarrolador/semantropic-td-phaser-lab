/**
 * SEMANTROPIC TD P05 | optional visual adapter for the Integrator.
 * Accepts a preexisting core entity visual and P05 reactive model.
 * NEVER attaches to the core bus on its own, never moves an entity by itself,
 * never changes hp/coins/waves/cooldowns, and never grants rewards.
 */
export function createP05ViewAdapter({
 sprite,shadow=null,overlayGraphics=null,reactivity,
 worldScale=1,screenFacing='E',layerZ=0
}={}){
 if(!sprite||typeof sprite.setFrame!=='function')throw Error('P05 needs an existing Phaser sprite');
 if(!reactivity||typeof reactivity.snapshot!=='function')throw Error('P05 needs an explicit reactive view');
 let disposed=false,position={x:0,y:0},scale=worldScale,frame=null;
 sprite.setOrigin?.(.5,.92);shadow?.setOrigin?.(.5,1);
 function setWorldPoseFromCore(world){
  if(disposed)return false;
  if(!world||!Number.isFinite(world.x)||!Number.isFinite(world.y))return false;
  position={x:world.x,y:world.y};
  return true;
 }
 function setWorldScaleFromIntegrator(next){
  if(!Number.isFinite(next)||next<=0)return false;
  scale=next;return true;
 }
 function render(){
  if(disposed)return null;
  const snap=reactivity.snapshot();
  if(frame!==snap.frame){sprite.setFrame(snap.frame);frame=snap.frame;}
  sprite.setPosition?.(position.x,position.y);
  sprite.setScale?.(scale,scale*snap.visualSquash);
  sprite.setFlipX?.(snap.facing==='W');
  sprite.setAlpha?.(snap.opacity);
  sprite.setDepth?.(position.y+layerZ);
  if(snap.materialFlash>.07){
   sprite.setTint?.(0xeaf9ed);
  }else{
   sprite.clearTint?.();
  }
  if(shadow){
   shadow.setPosition?.(position.x,position.y+1);
   shadow.setAlpha?.(snap.shadowOpacity);
   shadow.setDepth?.(position.y-3);
  }
  if(overlayGraphics){
   const o=snap.overlay,valid=(value,max)=>Number.isFinite(value)&&Number.isFinite(max)&&max>0;
   overlayGraphics.clear?.();
   const w=54,x=position.x-w/2,y=position.y-snap.worldHeight-13;
   if(valid(o.hpCurrent,o.hpMax)){
    overlayGraphics.fillStyle?.(0x233843,.92);overlayGraphics.fillRoundedRect?.(x,y,w,5,2);
    overlayGraphics.fillStyle?.(0xc64d4e,.96);
    overlayGraphics.fillRoundedRect?.(x,y,w*Math.min(1,Math.max(0,o.hpCurrent/o.hpMax)),5,2);
   }
   if(valid(o.shieldCurrent,o.shieldMax)&&o.shieldMax>0){
    overlayGraphics.fillStyle?.(0x2a414a,.92);overlayGraphics.fillRoundedRect?.(x,y-9,w,4,2);
    overlayGraphics.fillStyle?.(0xb6bec7,.97);
    overlayGraphics.fillRoundedRect?.(x,y-9,w*Math.min(1,Math.max(0,o.shieldCurrent/o.shieldMax)),4,2);
   }
   overlayGraphics.setDepth?.(position.y+1400);
  }
  return snap;
 }
 function advance(deltaMs){if(disposed)return null;reactivity.advance(deltaMs);return render();}
 function dispose({destroySprite=false,destroyShadow=false,destroyOverlay=false}={}){
  if(disposed)return false;
  disposed=true;reactivity.dispose();
  if(destroySprite)sprite.destroy?.();
  if(destroyShadow)shadow?.destroy?.();
  if(destroyOverlay)overlayGraphics?.destroy?.();
  return true;
 }
 return Object.freeze({
  setWorldPoseFromCore,setWorldScaleFromIntegrator,advance,render,dispose,
  get disposed(){return disposed},
  get textureOwnership(){return 'integrator';},
  get coreAuthority(){return 'read-only';}
 });
}
