// T-03 premium. Anclajes en píxeles de la FUENTE SVG 360x420. NO son sockets reales ni estadísticas.
// Políticas de escala de mundo PROVISIONALES hasta aprobar C1-A sobre pads efectivos.
const W=360,H=420;
export const TOWER_ART_V2=Object.freeze([
  {
    "assetId": "towers/infantry/level-1",
    "family": "infantry",
    "level": 1,
    "branch": null,
    "title": "Cuartel Recluta",
    "url": "../../art/towers/infantry/level-1.svg",
    "sourceSize": {
      "widthPx": 360,
      "heightPx": 420
    },
    "worldScaleProposal": 0.276,
    "worldWidthProposal": 99.36,
    "worldHeightProposal": 115.92,
    "footAnchor": {
      "x": 0.5,
      "y": 0.93
    },
    "shadowFootAnchor": {
      "x": 183,
      "y": 388,
      "units": "source-px"
    },
    "operatorAnchorLocal": {
      "x": 138,
      "y": 319,
      "units": "source-px"
    },
    "spawnExitLocal": {
      "x": 140,
      "y": 348,
      "units": "source-px"
    },
    "muzzleLocal": {
      "x": 183,
      "y": 248,
      "units": "source-px"
    },
    "visualOffsetWorld": {
      "x": 0,
      "y": 0
    },
    "attackType": "deploy",
    "presentationStates": [
      "idle",
      "target",
      "windup",
      "fire",
      "recoil",
      "recover",
      "upgrade",
      "ruined"
    ],
    "status": "prototype",
    "textureKey": "towers/infantry/level-1",
    "fixtureId": "fixture-T03-1"
  },
  {
    "assetId": "towers/infantry/level-2",
    "family": "infantry",
    "level": 2,
    "branch": null,
    "title": "Cuartel Veterano",
    "url": "../../art/towers/infantry/level-2.svg",
    "sourceSize": {
      "widthPx": 360,
      "heightPx": 420
    },
    "worldScaleProposal": 0.296,
    "worldWidthProposal": 106.56,
    "worldHeightProposal": 124.32,
    "footAnchor": {
      "x": 0.5,
      "y": 0.93
    },
    "shadowFootAnchor": {
      "x": 183,
      "y": 388,
      "units": "source-px"
    },
    "operatorAnchorLocal": {
      "x": 143,
      "y": 328,
      "units": "source-px"
    },
    "spawnExitLocal": {
      "x": 145,
      "y": 354,
      "units": "source-px"
    },
    "muzzleLocal": {
      "x": 183,
      "y": 209,
      "units": "source-px"
    },
    "visualOffsetWorld": {
      "x": 0,
      "y": 0
    },
    "attackType": "deploy",
    "presentationStates": [
      "idle",
      "target",
      "windup",
      "fire",
      "recoil",
      "recover",
      "upgrade",
      "ruined"
    ],
    "status": "prototype",
    "textureKey": "towers/infantry/level-2",
    "fixtureId": "fixture-T03-2"
  },
  {
    "assetId": "towers/sniper/level-1",
    "family": "sniper",
    "level": 1,
    "branch": null,
    "title": "Vigía Recluta",
    "url": "../../art/towers/sniper/level-1.svg",
    "sourceSize": {
      "widthPx": 360,
      "heightPx": 420
    },
    "worldScaleProposal": 0.303,
    "worldWidthProposal": 109.08,
    "worldHeightProposal": 127.26,
    "footAnchor": {
      "x": 0.5,
      "y": 0.93
    },
    "shadowFootAnchor": {
      "x": 183,
      "y": 388,
      "units": "source-px"
    },
    "operatorAnchorLocal": {
      "x": 190,
      "y": 155,
      "units": "source-px"
    },
    "spawnExitLocal": null,
    "muzzleLocal": {
      "x": 279,
      "y": 149,
      "units": "source-px"
    },
    "visualOffsetWorld": {
      "x": 0,
      "y": 0
    },
    "attackType": "tracer",
    "presentationStates": [
      "idle",
      "target",
      "windup",
      "fire",
      "recoil",
      "recover",
      "upgrade",
      "ruined"
    ],
    "status": "prototype",
    "textureKey": "towers/sniper/level-1",
    "fixtureId": "fixture-T03-3"
  },
  {
    "assetId": "towers/sniper/level-2",
    "family": "sniper",
    "level": 2,
    "branch": null,
    "title": "Vigía Veterano",
    "url": "../../art/towers/sniper/level-2.svg",
    "sourceSize": {
      "widthPx": 360,
      "heightPx": 420
    },
    "worldScaleProposal": 0.317,
    "worldWidthProposal": 114.12,
    "worldHeightProposal": 133.14,
    "footAnchor": {
      "x": 0.5,
      "y": 0.93
    },
    "shadowFootAnchor": {
      "x": 183,
      "y": 388,
      "units": "source-px"
    },
    "operatorAnchorLocal": {
      "x": 191,
      "y": 146,
      "units": "source-px"
    },
    "spawnExitLocal": null,
    "muzzleLocal": {
      "x": 301,
      "y": 146,
      "units": "source-px"
    },
    "visualOffsetWorld": {
      "x": 0,
      "y": 0
    },
    "attackType": "tracer",
    "presentationStates": [
      "idle",
      "target",
      "windup",
      "fire",
      "recoil",
      "recover",
      "upgrade",
      "ruined"
    ],
    "status": "prototype",
    "textureKey": "towers/sniper/level-2",
    "fixtureId": "fixture-T03-4"
  }
]);
export const TOWER_ART=TOWER_ART_V2;
export function validateTowerArtV2(items=TOWER_ART_V2){
 if(items.length!==4)throw Error('T03: deben existir 4 variantes I-II');
 const set=new Set();
 for(const a of items){
  if(!['infantry','sniper'].includes(a.family)||![1,2].includes(a.level)||a.branch!==null)throw Error('T03: familia/nivel no autorizado');
  if(set.has(a.assetId))throw Error('T03: texture key duplicada');set.add(a.assetId);
  if(!a.url.startsWith('../../art/towers/'))throw Error('T03: referencia a arte fuera del namespace');
  if(a.sourceSize.widthPx!==W||a.sourceSize.heightPx!==H)throw Error('T03: dimensiones fuente');
  if(a.worldScaleProposal<.2||a.worldScaleProposal>.4)throw Error('T03: escala propuesta no validada');
  if(a.footAnchor.x!==.5||a.footAnchor.y!==.93)throw Error('T03: pivote inconsistente');
  for(const key of ['muzzleLocal','shadowFootAnchor','operatorAnchorLocal','spawnExitLocal']){
   const p=a[key];if(p===null)continue;
   if(p.units!=='source-px'||p.x<0||p.x>W||p.y<0||p.y>H)throw Error('T03: anclaje fuera de textura '+key);
  }
 }
 return true;
}
// Recibe x/y/escala ya resueltos del Sprite/adapter; NO convertir coordenadas del mapa legacy.
export function projectSourceAnchor(sprite,meta,key){
 const anchor=meta[key];
 if(!anchor)return null;
 const dx=(anchor.x-meta.sourceSize.widthPx*meta.footAnchor.x)*sprite.scaleX;
 const dy=(anchor.y-meta.sourceSize.heightPx*meta.footAnchor.y)*sprite.scaleY;
 return {x:sprite.x+dx,y:sprite.y+dy};
}
export const validateTowerArt=validateTowerArtV2;
