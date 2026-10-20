/**
 * SEMANTROPIC TD / TORRES T09.
 * Run from repository root: node docs/art/towers/qa-t09.mjs
 * All tests here are Node PURE / MOCK DOM. They are NOT Chromium or gameplay.
 */
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {getContextMenuVisualSpec,T09_INTENTS} from '../../../public/official/src/towers-visual/t09/spec.mjs';
import {layoutContextNodes,projectWorldToScreen} from '../../../public/official/src/towers-visual/t09/layout.mjs';
import {mountT09Presenter,T09_ICONS} from '../../../public/official/src/towers-visual/t09/presenter.mjs';
const manifestFile='docs/art/towers/ASSET_MANIFEST_T09.json';
const requiredSVG={
 'infantry/level-1.svg':'66e85f802e696d662d14b9154bf6924dbb6ba4b6',
 'infantry/level-2.svg':'25884d1754950f8d764c0f03b797e10e7ecac212',
 'sniper/level-1.svg':'52ec5b04b744a9583a9a07464a107c6b5f1cf293',
 'sniper/level-2.svg':'c1689a19e9467dd39c6c5af380d63b22176ead5d'};
for(const [short,sha] of Object.entries(requiredSVG)){
 const file='public/official/art/towers/'+short;
 const got=execFileSync('git',['hash-object',file],{encoding:'utf8'}).trim();
 assert.equal(got,sha,'T09 must never modify original C1-C/T04 masters');
}
const raw={buildInfantry:{ok:true,cost:117},buildSniper:{ok:true,cost:163},upgrade:{ok:true,cost:159},sell:{ok:true,refund:77}};
const socket={index:7,socketId:'m01-pad-08'};
const spec=(more={})=>getContextMenuVisualSpec({socket,quotes:raw,worldPoint:{x:1250,y:50},revision:1,...more});
let empty=spec();
assert.equal(empty.status,'open-empty-socket');
assert.deepEqual(empty.nodes.map(x=>x.action),['build_infantry','build_sniper','close']);
assert.deepEqual(empty.nodes.map(x=>x.price),[117,163,null]);
assert.ok(empty.nodes.every(x=>T09_INTENTS.includes(x.action)));
assert.equal(empty.nodes[1].intent.family,'sniper');
const denied=spec({quotes:{buildInfantry:{ok:false,reason:'INSUFFICIENT_GOLD',cost:117},
 buildSniper:{ok:false,reason:'FAMILY_LOCKED'}}});
assert.equal(denied.nodes[0].enabled,false);
assert.equal(denied.nodes[0].reason,'INSUFFICIENT_GOLD');
assert.equal(denied.nodes[0].price,117);
assert.equal(denied.nodes[1].price,null,'UNKNOWN cost never guessed');
assert.equal(denied.nodes[1].enabled,false);
for(const level of [1,2]){
 for(const family of ['infantry','sniper']){
  const tower={id:'tower-7',family,level};
  const q={...raw,upgrade:level===2?{ok:false,reason:'TECH_LOCKED'}:raw.upgrade};
  const s=spec({tower,quotes:q,permissions:{canRally:true,canInspect:true},rangeWorld:170});
  assert.equal(s.status,'open-'+family+'-'+(level===1?'I':'II'));
  assert.equal(s.nodes[0].enabled,level===1);
  assert.equal(s.nodes[1].price,77);
  assert.equal(s.nodes.some(n=>n.action==='set_rally'),family==='infantry');
  assert.ok(s.nodes.length<=4);
  if(level===2)assert.ok(s.visualFlags.maximumLevel);
 }
}
assert.equal(spec({mode:'paused'}).nodes.filter(n=>n.enabled).length,1);
assert.equal(spec({mode:'awaiting-rally-selection',tower:{id:'inf1',family:'infantry',level:1}}).nodes.filter(n=>n.enabled).length,1);
for(const mode of ['victory','defeat','unavailable']){
 const s=spec({mode});assert.ok(s.closed);assert.equal(s.nodes.length,0);
}
assert.throws(()=>spec({socket:{index:8}}));
assert.throws(()=>spec({mode:'god-mode'}));
const layouts=[{w:1280,h:768,t:45,b:50},{w:844,h:390,t:54,b:58},
 {w:932,h:430,t:50,b:60},{w:1536,h:709,t:65,b:85}];
const tower={id:'t1',family:'infantry',level:1};
let layoutCount=0;
for(const {w,h,t,b} of layouts){
 for(const [x,y] of [[2,2],[w-2,2],[2,h-2],[w-2,h-2],[w/2,h/2]]){
  const safe={left:8,top:t,right:w-8,bottom:h-b};
  const out=layoutContextNodes({anchorScreen:{x,y},viewportSafeRect:safe,
   nodeSpecs:spec({tower,permissions:{canRally:true}}).nodes});
  assert.ok(out.fits,'safe layout '+w+'x'+h);
  assert.ok(out.diameter>=44);
  for(const n of out.nodes){
   assert.ok(n.left>=safe.left-1e-6&&n.right<=safe.right+1e-6);
   assert.ok(n.top>=safe.top-1e-6&&n.bottom<=safe.bottom+1e-6);
  }
  layoutCount++;
 }
}
const none=layoutContextNodes({anchorScreen:{x:10,y:10},viewportSafeRect:{left:0,top:0,right:100,bottom:100},nodeSpecs:[]});
assert.equal(none.nodes.length,0);
const tiny=layoutContextNodes({anchorScreen:{x:15,y:15},viewportSafeRect:{left:0,top:0,right:54,bottom:54},nodeSpecs:spec({tower}).nodes});
assert.equal(tiny.fits,false,'should never declare overlapped tiny layout safe');
const projected=projectWorldToScreen({worldPoint:{x:10,y:20},
 matrix:{a:2,b:0,c:0,d:2,tx:40,ty:80},
 canvasRect:{left:200,top:100,right:1000,bottom:550},
 hostRect:{left:0,top:0,right:1200,bottom:650},renderSize:{width:1600,height:900}});
assert.deepEqual(projected,{x:230,y:160});
// Minimal fake DOM to test lifecycle/listener cleanup without installing jsdom.
class FakeEl{
 constructor(tag,doc){this.tag=tag;this.ownerDocument=doc;this.children=[];this.parentNode=null;
  this.listeners=new Map();this.style={};this.dataset={};this.disabled=false;this.hidden=false;this.classes=new Set();
  this.classList={add:n=>this.classes.add(n),toggle:(n,b)=>b?this.classes.add(n):this.classes.delete(n)};
 }
 append(...nodes){for(const n of nodes){n.parentNode=this;this.children.push(n)}}
 appendChild(n){this.append(n);return n}
 replaceChildren(...nodes){for(const n of this.children)n.parentNode=null;this.children=[];this.append(...nodes)}
 remove(){if(this.parentNode)this.parentNode.children=this.parentNode.children.filter(n=>n!==this);this.parentNode=null}
 addEventListener(n,cb){const list=this.listeners.get(n)??[];list.push(cb);this.listeners.set(n,list)}
 removeEventListener(n,cb){this.listeners.set(n,(this.listeners.get(n)??[]).filter(x=>x!==cb))}
 setAttribute(n,v){this[n]=String(v)}
 contains(other){let x=other;while(x){if(x===this)return true;x=x.parentNode}return false}
 closest(){return this.tag==='button'?this:(this.parentNode?.closest?.()??null)}
}
const doc={createElement(tag){return new FakeEl(tag,doc)},createElementNS(ns,tag){return new FakeEl(tag,doc)}};
const host=new FakeEl('div',doc),intents=[];
const presenter=mountT09Presenter(host,{onIntent:v=>intents.push(v)});
assert.equal(host.children.length,1);
const safe={left:10,top:55,right:834,bottom:335};
for(let i=0;i<100;i++){
 presenter.update(spec({revision:i}),{anchorScreen:{x:815,y:320},viewportSafeRect:safe});
 assert.equal(presenter.current.revision,i);
 assert.equal(presenter.layout.nodes.length,3);
 presenter.clear();
}
presenter.update(spec({revision:101}),{anchorScreen:{x:50,y:100},viewportSafeRect:safe});
const child=presenter.root.children[2].children[0];
const event={target:child,stopPropagation(){this.stopped=true},preventDefault(){}};
presenter.root.listeners.get('click')[0](event);
assert.equal(intents.length,1,'only one click intent after 100 open/close');
assert.equal(intents[0].action,'build_infantry');
assert.equal(intents[0].revision,101);
presenter.update(denied,{anchorScreen:{x:50,y:100},viewportSafeRect:safe});
const disabled=presenter.root.children[2].children[0];
presenter.root.listeners.get('click')[0]({...event,target:disabled});
assert.equal(intents.length,1,'disabled must not emit');
presenter.destroy();
assert.equal(presenter.destroyed,true);
assert.equal(host.children.length,0);
assert.ok([...presenter.root.listeners.values()].every(list=>list.length===0),'no listener leak');
assert.throws(()=>presenter.update(empty,{anchorScreen:{x:50,y:100},viewportSafeRect:safe}));
for(const [id,url] of Object.entries(T09_ICONS)){
 assert.ok(url.endsWith('/'+id+'.svg'));
 const local='public/official/art/towers/t09/icons/'+id+'.svg';
 const src=await readFile(local,'utf8');
 assert.ok(src.startsWith('<svg')&&src.includes('viewBox="0 0 96 96"')&&src.trim().endsWith('</svg>'));
}
const manifest=JSON.parse(await readFile(manifestFile,'utf8'));
assert.equal(manifest.milestone,'T09');
assert.equal(manifest.icons.length,9);
const sheet=await readFile('public/official/art/towers/t09/T09_ICON_SHEET_3X3.svg','utf8');
assert.ok(sheet.includes('viewBox="0 0 384 384"'));
for(const name of manifest.iconSheet.order)assert.ok(sheet.includes('id="t09-'+name+'"'));
assert.equal(manifest.iconSheet.grid.cellWidthPx,128);
const gallery=await readFile('public/official/src/towers-visual/t09/gallery.mjs','utf8');
assert.ok(gallery.includes('COMPONENT_DEMO_NOT_GAMEPLAY'));
console.log(JSON.stringify({status:'PASS',scope:'NODE_PURE_AND_MOCK_DOM_NOT_CHROMIUM',
 layoutCases:layoutCount,icons:9,repeatOpenClose:100,listenerLeaks:0,t04Unchanged:4,
 costs:'FROM_DTO',coreMutations:0},null,2));
