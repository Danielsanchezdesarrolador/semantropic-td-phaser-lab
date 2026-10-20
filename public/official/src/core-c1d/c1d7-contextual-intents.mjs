/**
 * SEMANTROPIC TD C1-D7/G1 — Integrator-owned contextual gameplay bridge.
 * TORRES T09 may supply skins/assets later, but it MUST NOT own transactions.
 * No parallel economy. Every quote and action comes from M01BuildEconomy.
 */
export const C1D7_MENU_VERSION="C1-D7-G1-nodal-v1";
export const CONTEXT_INTENTS=Object.freeze([
 "build_infantry","build_sniper","upgrade","sell","rally","close"
]);
const freeze=x=>Object.freeze(x);
const build=(spec,quote)=>freeze({
 intent:"build_"+spec,enabled:Boolean(quote?.ok),cost:quote?.cost??(spec==="infantry"?95:140),
 disabledReason:quote?.ok?null:(quote?.message||"No disponible")
});
export function c1d7MenuDTO(economy,index,{paused=false,ended=false,position=null}={}){
 const socket=economy?.getSocket(index);
 if(!socket)return null;
 const tower=economy.getTower(index);
 const unavailable=paused||ended;
 const qInf=economy.quote(index,"infantry"),qSni=economy.quote(index,"sniper");
 const qUp=economy.quoteUpgrade(index),qSell=economy.quoteSell(index);
 const actions=tower?
  [freeze({intent:"upgrade",enabled:!unavailable&&Boolean(qUp.ok),
   cost:qUp.cost??(tower.family==="infantry"?135:185),
   disabledReason:unavailable?"Partida pausada o terminada":qUp.ok?null:qUp.message}),
   freeze({intent:"sell",enabled:!unavailable&&Boolean(qSell.ok),
    refund:qSell.refund??0,
    disabledReason:unavailable?"Partida pausada o terminada":qSell.ok?null:qSell.message}),
   ...(tower.family==="infantry"?[freeze({intent:"rally",enabled:!unavailable,
    disabledReason:unavailable?"Partida pausada o terminada":null})]:[])]:
  [build("infantry",qInf),build("sniper",qSni)].map(a=>unavailable?
   freeze({...a,enabled:false,disabledReason:"Partida pausada o terminada"}):a);
 return freeze({version:C1D7_MENU_VERSION,socketIndex:index,socketId:socket.socketId,
   socketWorldPosition:freeze({x:socket.x,y:socket.y}),
   cameraSafeRect:position??null,hasTower:Boolean(tower),
   family:tower?.family??null,level:tower?.level??0,paused:Boolean(paused),ended:Boolean(ended),
   gold:economy.gold,actions:freeze([...actions,freeze({intent:"close",enabled:true})])});
}
export function c1d7ApplyIntent(world,index,intent){
 if(!world?.economy||!Number.isInteger(index)||world.ended||world.paused)
  return {ok:false,reason:"STATE_LOCKED",message:"La partida no admite esta acción ahora."};
 const eco=world.economy;
 if(!CONTEXT_INTENTS.includes(intent))return {ok:false,reason:"UNKNOWN_INTENT",message:"Acción desconocida."};
 if(intent==="close")return {ok:true,reason:"CLOSE"};
 if(intent==="rally"){
  const t=eco.getTower(index);
  return t?.family==="infantry"?{ok:true,reason:"SELECT_RALLY"}:
   {ok:false,reason:"NOT_INFANTRY",message:"Selecciona primero un cuartel."};
 }
 const method=intent.startsWith("build_")?"build":intent;
 const args=method==="build"?[index,intent.slice(6)]:[index];
 const quote=method==="build"?eco.quote(...args):method==="upgrade"?
   eco.quoteUpgrade(index):eco.quoteSell(index);
 if(!quote.ok)return {ok:false,...quote};
 const out=eco[method](...args); // EXACTLY one authoritative transaction
 if(out.ok)world.syncTowers(); // live soldier roster, no visual fake units
 return out;
}
/** CanvasRect coordinates (CSS px), Phaser viewport logical units and world.
 * Compatible with Phaser Scale.ENVELOP/FIT and DPR; never assumes 1 CSS px == 1 world unit.
 */
export function c1d7WorldToClient({x,y},rect,logicalWidth=1280,logicalHeight=768){
 if(!rect?.width||!rect?.height)throw Error("Invalid Phaser canvas DOM rect");
 return freeze({x:rect.left+x/logicalWidth*rect.width,
  y:rect.top+y/logicalHeight*rect.height});
}
export function c1d7ClientToWorld({x,y},rect,logicalWidth=1280,logicalHeight=768){
 if(!rect?.width||!rect?.height)throw Error("Invalid Phaser canvas DOM rect");
 return freeze({x:(x-rect.left)/rect.width*logicalWidth,
  y:(y-rect.top)/rect.height*logicalHeight});
}
/** Clamp a compact contextual node without hiding controls under browser/safe areas. */
export function c1d7NodePlacement(anchor,{width,height,menuWidth=208,menuHeight=180,margin=8}){
 const availableW=Math.max(0,width-2*margin),availableH=Math.max(0,height-2*margin);
 const w=Math.min(menuWidth,availableW),h=Math.min(menuHeight,availableH);
 const left=Math.min(Math.max(anchor.x-w/2,margin),Math.max(margin,width-margin-w));
 const above=anchor.y-h-26>=margin;
 const top=Math.min(Math.max(above?anchor.y-h-26:anchor.y+38,margin),
  Math.max(margin,height-margin-h));
 return freeze({left,top,width:w,height:h,above,anchorX:anchor.x,anchorY:anchor.y});
}
