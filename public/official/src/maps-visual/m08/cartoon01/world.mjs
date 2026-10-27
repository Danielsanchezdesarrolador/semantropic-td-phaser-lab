import{makePlan,clearRect}from'./plan.mjs';
export const VERSION='m08-observatory-candidate-v1';
const sheet=await new Promise((ok,no)=>{const im=new Image();im.onload=()=>ok(im);im.onerror=no;im.src=new URL('../../../../art/maps/m08/cartoon01/observatory-original-props.png',import.meta.url).href;});
const material=await new Promise((ok,no)=>{const im=new Image();im.onload=()=>ok(im);im.onerror=no;im.src=new URL('../../../../art/maps/m08/cartoon01/grass-earth-original.png',import.meta.url).href;});
const canvas=(w=1280,h=768)=>Object.assign(document.createElement('canvas'),{width:w,height:h});
function sprites(){return Array.from({length:6},(_,i)=>{const c=canvas(512,512),x=c.getContext('2d');x.drawImage(sheet,i%3*512,Math.floor(i/3)*512,512,512,0,0,512,512);return c;});}
export function mount(scene,map){const plan=makePlan(map),objects=[],keys=[],add=(name,c)=>{const key='m08/art/'+name;scene.textures.addCanvas(key,c);keys.push(key);return key;};
 const terrain=canvas(2560,1536),c=terrain.getContext('2d');c.scale(2,2);c.fillStyle='#8a9e50';c.fillRect(0,0,1280,768);
 c.drawImage(material,0,0,1280,768);
 // Fragmented original paving in the ceremonial convergence; route painted last.
 for(let y=280;y<510;y+=27)for(let x=660;x<1000;x+=43){c.fillStyle=(x+y)%3?'#a9a17b':'#9c9570';c.strokeStyle='#7d795d';c.lineWidth=1;c.beginPath();c.roundRect(x+(y%2)*6,y,39,23,3);c.fill();c.stroke();}
 objects.push(scene.add.image(0,0,add('terrain',terrain)).setOrigin(0).setScale(.5).setDepth(-5000));
 const road=canvas(2560,1536),r=road.getContext('2d');r.scale(2,2);r.lineJoin='round';r.lineCap='round';
 for(const[col,width]of[['#4c5e3b',92],['#877452',86],['#d4ad72',79],['#ebc68b',69]]){r.strokeStyle=col;r.lineWidth=width;for(const route of plan.routes){r.beginPath();route.forEach(([x,y],i)=>i?r.lineTo(x,y):r.moveTo(x,y));r.stroke();}}
 // Quiet road material marks follow the canonical centerline, without inventing turns.
 for(const route of plan.routes)for(let i=4;i<route.length;i+=5){const[x,y]=route[i];r.fillStyle='#d7ae75';r.beginPath();r.ellipse(x+Math.sin(i)*14,y+Math.cos(i)*10,3,1.3,.2,0,7);r.fill();}
 objects.push(scene.add.image(0,0,add('road',road)).setOrigin(0).setScale(.5).setDepth(-4500));
 const pad=canvas(128,96),p=pad.getContext('2d');p.fillStyle='#263e3255';p.beginPath();p.ellipse(65,59,57,25,0,0,7);p.fill();p.fillStyle='#71674d';p.strokeStyle='#394b39';p.lineWidth=2;p.beginPath();p.ellipse(64,51,51,29,0,0,7);p.fill();p.stroke();p.fillStyle='#d8c99a';p.beginPath();p.ellipse(64,42,51,26,0,0,7);p.fill();p.stroke();p.strokeStyle='#9b8d63';p.beginPath();p.ellipse(64,42,42,20,0,0,7);p.stroke();for(let i=0;i<9;i++){const a=i*7/9;p.beginPath();p.moveTo(64+42*Math.cos(a),42+20*Math.sin(a));p.lineTo(64+51*Math.cos(a),42+26*Math.sin(a));p.stroke();}p.fillStyle='#b59d69';p.beginPath();p.moveTo(64,34);p.lineTo(77,42);p.lineTo(64,50);p.lineTo(51,42);p.closePath();p.fill();
 const pk=add('pad',pad);for(const q of plan.pads)objects.push(scene.add.image(q.x,q.y,pk).setOrigin(.5,42/96).setScale(.88).setDepth(-1000));
 const ss=sprites(),sk=ss.map((s,i)=>add('prop-'+i,s));
 const place=(kind,x,foot,w)=>{const box={kind,x:x-w/2,y:foot-w,w,h:w};if(!clearRect(box,plan)||plan.props.some(q=>Math.hypot(x-q.x-q.w/2,foot-q.y-q.h)<w*.38+q.w*.26))return false;objects.push(scene.add.ellipse(x,foot-7,w*.65,w*.17,0x334536,.25).setDepth(-900));objects.push(scene.add.image(x,foot,sk[kind]).setOrigin(.5,1).setDisplaySize(w,w).setDepth(foot));plan.props.push(box);return true;};
 // Hand-composed landmarks describe western breach, northern observatory and southern ruins.
 for(const[k,x,y,w]of[[0,60,105,90],[0,135,145,140],[0,1040,230,195],[1,110,700,145],[3,630,155,135],[1,1190,640,150],[0,635,470,130],[4,350,740,160],[4,920,730,185],[2,1150,180,150]])for(const [dx,dy]of[[0,0],[-25,0],[25,0],[0,-30],[0,30]])if(place(k,x+dx,y+dy,w))break;
 for(let i=0;i<1400;i++){const kind=i<100?(i%3===0?4:i%3===1?2:3):i%4===0?4:i%5===0?2:5,w=i<100?95+i%45:kind===5?28+i%25:55+i%36;place(kind,20+(i*137.507)%1240,40+(i*83.731)%710,w);if(plan.props.length>=90)break;}
 return{plan,objects,keys,version:VERSION,destroy(){objects.forEach(o=>o.destroy());keys.forEach(k=>scene.textures.remove(k));}};
}
