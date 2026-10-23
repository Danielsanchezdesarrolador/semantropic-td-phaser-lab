/** T09 pure visual contract. No gameplay, economy or Phaser dependency. */
export const T09_SPEC_VERSION='t09-visual-intent-v1';
export const T09_INTENTS=Object.freeze(['build_infantry','build_sniper','upgrade','sell','set_rally','inspect','close']);
export const T09_MODES=Object.freeze(['preparation','wave','paused','awaiting-rally-selection','victory','defeat','unavailable']);
const VALID=new Set(['infantry','sniper']);
const amount=n=>Number.isInteger(n)&&n>=0?n:null;
function node({id,icon,title,action,socketIndex,towerId=null,family=null,quote=null,priceKind=null,permitted=true,blockedReason=null,revision=null}){
 const q=quote&&typeof quote==='object'?quote:null;
 const price=priceKind&&q?amount(q[priceKind]):null;
 const enabled=action==='close'?true:(permitted&&q?.ok===true);
 const reason=enabled?null:(blockedReason??(q?.reason==='INSUFFICIENT_GOLD'?'INSUFFICIENT_GOLD':q?.reason??(q?'QUOTE_REJECTED':'QUOTE_MISSING')));
 const suffix=price===null?'':(action==='sell'?' +':' ')+String(price);
 const hint=enabled?'':(typeof q?.message==='string'?q.message:reason);
 return {id,icon,title,action,enabled,reason,price,priceKind,ariaLabel:title+suffix+(enabled?'':' · No disponible: '+hint),
  hint,highlight:false,intent:action==='close'?{action:'close',socketIndex,revision}:{action,socketIndex,towerId,family,revision}};
}
/**
 * DTO input: {socket:{index,socketId?,count?},tower:null|{id,family,level},
 * quotes:{buildInfantry,buildSniper,upgrade,sell},mode,permissions:{canRally?,canInspect?},
 * worldPoint:{x,y}|null,rangeWorld?:number,revision?:string|number}.
 * Quotes are RAW economy.quote/quoteUpgrade/quoteSell, including false cases.
 */
export function getContextMenuVisualSpec({socket,tower=null,quotes={},mode='preparation',permissions={},worldPoint=null,rangeWorld=null,revision=null}={}){
 const socketCount=socket?.count??8;
 if(!Number.isInteger(socketCount)||socketCount<1||!socket||!Number.isInteger(socket.index)||socket.index<0||socket.index>=socketCount)throw Error('T09 socket outside canonical count');
 if(!T09_MODES.includes(mode))throw Error('T09 invalid mode');
 if(tower&&(!VALID.has(tower.family)||![1,2].includes(tower.level)||typeof tower.id!=='string'))throw Error('T09 invalid tower DTO');
 if(worldPoint!==null&&(!Number.isFinite(worldPoint.x)||!Number.isFinite(worldPoint.y)))throw Error('T09 non-finite world point');
 const state=mode==='victory'||mode==='defeat'||mode==='unavailable'?'unavailable-over-game':mode==='awaiting-rally-selection'?'awaiting-rally-selection':mode==='paused'?'paused-read-only':tower?'open-'+tower.family+'-'+(tower.level===1?'I':'II'):'open-empty-socket';
 const readonly=mode==='paused'||mode==='awaiting-rally-selection',closed=state==='unavailable-over-game';
 const I=socket.index,id=tower?.id??null,block=readonly?'READ_ONLY_MODE':null;
 const close=()=>node({id:'close',icon:'close',title:'Cerrar',action:'close',socketIndex:I,revision});
 const nn=[];
 if(!closed){
  if(!tower){
   nn.push(node({id:'infantry',icon:'build-infantry',title:'Construir Infantería',action:'build_infantry',family:'infantry',socketIndex:I,
    quote:quotes.buildInfantry,priceKind:'cost',permitted:!readonly,blockedReason:block,revision}));
   nn.push(node({id:'sniper',icon:'build-sniper',title:'Construir Francotirador',action:'build_sniper',family:'sniper',socketIndex:I,
    quote:quotes.buildSniper,priceKind:'cost',permitted:!readonly,blockedReason:block,revision}));
  }else{
   nn.push(node({id:'upgrade',icon:'upgrade',title:tower.level===2?'Nivel máximo':'Mejorar a nivel II',action:'upgrade',socketIndex:I,
    towerId:id,quote:quotes.upgrade,priceKind:'cost',permitted:!readonly,blockedReason:block,revision}));
   nn.push(node({id:'sell',icon:'sell',title:'Vender torre',action:'sell',socketIndex:I,towerId:id,quote:quotes.sell,
    priceKind:'refund',permitted:!readonly,blockedReason:block,revision}));
   if(tower.family==='infantry')nn.push(node({id:'rally',icon:'rally',title:'Punto de reunión',action:'set_rally',socketIndex:I,
    towerId:id,quote:{ok:permissions.canRally===true},permitted:!readonly,blockedReason:block,revision}));
   else if(permissions.canInspect===true&&Number.isFinite(rangeWorld)&&rangeWorld>0)nn.push(node({
    id:'inspect',icon:'inspect',title:'Ver alcance',action:'inspect',socketIndex:I,towerId:id,quote:{ok:true},
    permitted:!readonly,blockedReason:block,revision}));
  }
  nn.push(close());
 }
 return {version:T09_SPEC_VERSION,status:state,mode,closed,readonly,selectedSocketIndex:I,selectedSocketId:socket.socketId??null,
  tower:tower?{id:tower.id,family:tower.family,level:tower.level}:null,anchorWorld:worldPoint?{x:worldPoint.x,y:worldPoint.y}:null,
  rangeWorld:Number.isFinite(rangeWorld)&&rangeWorld>0?rangeWorld:null,
  visualFlags:{insufficientGold:nn.some(x=>x.reason==='INSUFFICIENT_GOLD'),
   maximumLevel:tower?.level===2&&quotes.upgrade?.reason==='TECH_LOCKED',
   awaitingRally:mode==='awaiting-rally-selection',paused:mode==='paused',overGame:closed},nodes:nn,revision};
}
