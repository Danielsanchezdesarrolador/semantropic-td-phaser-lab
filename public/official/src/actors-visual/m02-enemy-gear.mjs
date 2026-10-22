/** R3-B2: original Phaser vector props over approved P08 warrior frames.
 * Differentiates Orc Archer and Shieldbearer without replacing source P03/P08.
 * These are M02 gameplay presentation layers, damage belongs to CORE only.
 */
export const R3_M02_ENEMY_ART='m02-archer-shieldbearer-vector-overlay-v1';
export const m02VisualBase=type=>type==='archer'||type==='shieldbearer'?'warrior':type;
export function mountM02EnemyGear(scene,kind,view,height=91){
 if(!['archer','shieldbearer'].includes(kind))return null;
 const g=scene.add.graphics();
 // Artwork 2D 3/4, precise silhouette at game-world scale 91px high
 if(kind==='shieldbearer'){
  // Bronze rim + reinforced steel shield with axial boss and alien insignia.
  g.fillStyle(0x213c44,.94);g.fillRoundedRect(-25,-57,26,36,6);
  g.lineStyle(3,0xcdb780,1);g.strokeRoundedRect(-25,-57,26,36,6);
  g.fillStyle(0x668c93,.9);g.fillRoundedRect(-22,-53,20,29,5);
  g.lineStyle(2,0xb6d6d0,.87);g.strokeLineShape(new Phaser.Geom.Line(-12,-50,-12,-26));
  g.fillStyle(0xf3d197,1);g.fillCircle(-12,-39,5);
  g.lineStyle(1.8,0x274951,1);g.strokeCircle(-12,-39,5);
  // cyan pulse visor accent
  g.fillStyle(0x9edbd3,.9);g.fillRoundedRect(-14,-66,17,4,2);
 }else{
  // Asymmetrical curved bronze recurve bow with taut green-blue string.
  g.lineStyle(4,0x6e4c37,1);
  g.beginPath();g.moveTo(17,-66);g.lineTo(23,-55);g.lineTo(24,-44);g.lineTo(19,-31);g.strokePath();
  g.lineStyle(2,0xe6be7a,.9);
  g.beginPath();g.moveTo(17,-66);g.lineTo(11,-49);g.lineTo(19,-31);g.strokePath();
  g.lineStyle(1.8,0xe1f5cb,1);
  g.beginPath();g.moveTo(17,-66);g.lineTo(19,-31);g.strokePath();
  g.lineStyle(2.5,0xc1e4ce,.85);
  g.beginPath();g.moveTo(11,-49);g.lineTo(35,-48);g.strokePath();
  g.fillStyle(0xe0e7cc,1);g.fillTriangle(35,-48,29,-52,29,-44);
  g.fillStyle(0x45686c,.92);g.fillRoundedRect(-14,-75,25,8,3);
 }
 view.add(g);return g;
}
export function presentM02Arrow(scene,event){
 if(event.type!=='enemy_attack_fire'||event.weapon!=='bow'||!event.targetWorld)return false;
 const start=event.worldPosition,goal=event.targetWorld;
 if(!start||!goal)return false;
 // Visual tracer only: CORE has already validated the strike/HP.
 const line=scene.add.graphics().setDepth(Math.max(start.y,goal.y)+3000);
 line.lineStyle(2.5,0xf9d8a1,.98).lineBetween(start.x,start.y-36,goal.x,goal.y-34);
 line.lineStyle(1,0x91e1d5,.8).lineBetween(start.x+2,start.y-38,goal.x+2,goal.y-36);
 scene.tweens.add({targets:line,alpha:0,duration:190,ease:'Cubic.In',onComplete:()=>line.destroy()});
 return true;
}
