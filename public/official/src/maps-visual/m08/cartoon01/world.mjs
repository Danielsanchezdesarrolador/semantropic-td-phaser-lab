import{makePlan,clearRect}from'./plan.mjs';
export const VERSION='m08-observatory-candidate-r2';
const sheet=await new Promise((ok,no)=>{const im=new Image();im.onload=()=>ok(im);im.onerror=no;im.src=new URL('../../../../art/maps/m08/cartoon01/observatory-original-props.png',import.meta.url).href;});
const material=await new Promise((ok,no)=>{const im=new Image();im.onload=()=>ok(im);im.onerror=no;im.src=new URL('../../../../art/maps/m08/cartoon01/grass-earth-original.png',import.meta.url).href;});
const complement=await new Promise((ok,no)=>{const im=new Image();im.onload=()=>ok(im);im.onerror=no;im.src=new URL('../../../../art/maps/m08/cartoon01/imperial-complements-r2.png',import.meta.url).href;});
const canvas=(w=1280,h=768)=>Object.assign(document.createElement('canvas'),{width:w,height:h});
function sprites(){return Array.from({length:6},(_,i)=>{const c=canvas(512,512),x=c.getContext('2d');x.drawImage(sheet,i%3*512,Math.floor(i/3)*512,512,512,0,0,512,512);return c;});}
export function mount(scene,map){const plan=makePlan(map),objects=[],keys=[],add=(name,c)=>{const key='m08/art/'+name;scene.textures.addCanvas(key,c);keys.push(key);return key;};
 const terrain=canvas(2560,1536),c=terrain.getContext('2d');c.scale(2,2);c.fillStyle='#8a9e50';c.fillRect(0,0,1280,768);
 c.drawImage(material,0,0,1280,768);
 // A broken ceremonial fan follows the junction instead of a rectangular grid.
 const plaza=(x,y)=>((x-815)/235)**2+((y-375)/133)**2<1+.12*Math.sin(x*.045+y*.02);
 for(let y=247;y<520;y+=23)for(let x=580;x<1050;x+=37){const dx=(Math.floor(y/23)%2)*16,px=x+dx;if(!plaza(px,y))continue;
 const edge=((px-815)/235)**2+((y-375)/133)**2;c.globalAlpha=edge>.83?.45:1;c.fillStyle=['#b9ad87','#c0b38e','#ada580'][(x+y)%3];c.strokeStyle='#8f8968';c.lineWidth=1;c.beginPath();c.moveTo(px+1,y);c.lineTo(px+36,y+1);c.lineTo(px+36,y+22);c.lineTo(px,y+22);c.closePath();c.fill();c.stroke();c.globalAlpha=1;}
 objects.push(scene.add.image(0,0,add('terrain',terrain)).setOrigin(0).setScale(.5).setDepth(-5000));
 const road=canvas(2560,1536),r=road.getContext('2d');r.scale(2,2);r.lineJoin='round';r.lineCap='round';
 // Keep the canonical 92wu road footprint and 69wu clear inner lane.
 // Fill the small meeting wedge with matching earth; no points are moved.
 const trace=()=>{r.beginPath();for(const route of plan.routes){route.forEach(([x,y],i)=>i?r.lineTo(x,y):r.moveTo(x,y));}};
 for(const[col,width]of[['#657142',92],['#b39866',86],['#e1bd80',79],['#ebc68b',69]]){r.strokeStyle=col;r.lineWidth=width;trace();r.stroke();}
 // Irregular, low-profile mineral shoulders remain inside the existing footprint.
 for(const route of plan.routes)for(let i=2;i<route.length-2;i+=2){const[x,y]=route[i],[ax,ay]=route[i-1],[bx,by]=route[i+1],l=Math.hypot(bx-ax,by-ay)||1,nx=-(by-ay)/l,ny=(bx-ax)/l;
 for(const side of[-1,1]){const d=side*(39+Math.sin(i*2.1)*2),ex=x+nx*d,ey=y+ny*d;
 // Avoid mineral edges in the shared junction / near another route's center.
 let nearest=Infinity;for(const other of plan.routes)for(const q of other)nearest=Math.min(nearest,Math.hypot(ex-q[0],ey-q[1]));if(nearest<34)continue;
 r.fillStyle=i%3?'#c7aa72':'#f0d49a';r.beginPath();r.ellipse(ex,ey,3.8,1.8,Math.atan2(by-ay,bx-ax),0,7);r.fill();}
 r.fillStyle='#d9b780';r.beginPath();r.ellipse(x+Math.sin(i)*17,y+Math.cos(i)*13,3,1.2,.2,0,7);r.fill();}
 // Soft earthen wedges at the merge remove sharp painted tips while preserving lanes.
 r.fillStyle='#e3bf82';for(const [x,y]of[[604,345],[574,428]]){r.beginPath();r.ellipse(x,y,12,5,-.3,0,7);r.fill();}
 objects.push(scene.add.image(0,0,add('road',road)).setOrigin(0).setScale(.5).setDepth(-4500));
 const pad=canvas(128,96),p=pad.getContext('2d');p.fillStyle='#263e3255';p.beginPath();p.ellipse(65,59,57,25,0,0,7);p.fill();p.fillStyle='#71674d';p.strokeStyle='#394b39';p.lineWidth=2;p.beginPath();p.ellipse(64,51,51,29,0,0,7);p.fill();p.stroke();p.fillStyle='#d8c99a';p.beginPath();p.ellipse(64,42,51,26,0,0,7);p.fill();p.stroke();p.strokeStyle='#9b8d63';p.beginPath();p.ellipse(64,42,42,20,0,0,7);p.stroke();for(let i=0;i<9;i++){const a=i*7/9;p.beginPath();p.moveTo(64+42*Math.cos(a),42+20*Math.sin(a));p.lineTo(64+51*Math.cos(a),42+26*Math.sin(a));p.stroke();}p.fillStyle='#b59d69';p.beginPath();p.moveTo(64,34);p.lineTo(77,42);p.lineTo(64,50);p.lineTo(51,42);p.closePath();p.fill();
 const pk=add('pad',pad);for(const q of plan.pads)objects.push(scene.add.image(q.x,q.y,pk).setOrigin(.5,42/96).setScale(.88).setDepth(-1000));
 const ss=sprites();
 // Source atlas has unequal columns; explicit frames avoid slicing the gate/cliff.
 for(const[x,y,w,h]of[[0,0,960,530],[960,0,576,530],[0,540,950,484],[960,540,576,484]]){const c=canvas(w,h);c.getContext('2d').drawImage(complement,x,y,w,h,0,0,w,h);ss.push(c);}
 const sk=ss.map((s,i)=>add('prop-'+i,s));
 const place=(kind,x,y,w,h=w,group='garden',depth=y+h)=>{const box={kind,x,y,w,h,group};if(!clearRect(box,plan))throw Error('M08 R2 clearance: '+JSON.stringify(box));
 objects.push(scene.add.ellipse(x+w/2,y+h-5,w*.7,Math.min(18,h*.12),0x29372b,.24).setDepth(depth-.1));
 objects.push(scene.add.image(x,y,sk[kind]).setOrigin(0).setDisplaySize(w,h).setDepth(depth));plan.props.push(box);};
 // Deliberately connected terraces. Overlapping stone ends form continuous scarps;
 // ground-level architectural pieces sit behind their front lip, never on a lane.
 for(const a of[
 [6,240,0,240,135,'west',130],[6,430,0,230,135,'west',131],
 [6,920,120,350,100,'observatory',210],
 [6,630,595,320,165,'south',750],[6,895,595,375,165,'south',751],
 [6,480,700,200,68,'south',752],[6,800,540,255,120,'south',655],[6,1010,540,260,120,'south',656],
 [7,30,0,180,110,'west',115],[8,250,10,180,95,'west',110],
 [3,350,150,120,130,'west',281],[1,490,5,150,140,'west',145],
 [0,960,5,205,210,'observatory',215],[8,1160,70,115,120,'observatory',195],
 [1,40,465,120,190,'southwest',655],
 [8,640,550,140,95,'south',647],[3,790,555,110,100,'south',657],
 [1,1100,515,150,140,'south',658],[9,1025,505,100,80,'intrusion',548]
 ])place(...a);
 // Hand-authored groves and garden beds, grouped around architecture.
 for(const a of[
 [2,215,4,85],[2,600,10,90],[2,335,15,100],[2,1170,0,100],
 [2,900,155,95],[2,1160,150,95],[2,30,355,105],[2,90,420,95],
 [2,15,640,125],[2,1150,650,105],[2,670,645,95],[2,900,670,90],
 [5,215,120,60],[5,285,135,60],[5,345,110,45],[5,465,145,45],
 [5,575,150,40],[5,645,95,45],[5,905,15,45],[5,1200,230,45],
 [5,875,230,45],[5,810,175,40],[5,370,290,45],[5,340,315,35],
 [5,5,310,35],[5,155,380,40],[5,180,450,45],[5,210,480,45],
 [5,20,450,35],[5,170,550,40],[5,15,580,40],[5,600,655,45],
 [5,705,550,40],[5,750,595,40],[5,950,550,40],[5,1240,460,35],
 [5,1170,480,40],[5,600,720,40],[5,1050,710,45]
 ])place(...a);
 return{plan,objects,keys,version:VERSION,destroy(){objects.forEach(o=>o.destroy());keys.forEach(k=>scene.textures.remove(k));}};
}
