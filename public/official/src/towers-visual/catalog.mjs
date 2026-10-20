// SEMANTROPIC TD T05 | source 360x420 | T03/T04 public API preserved for C1-C.
// T05 art is NOT approved. Visual scale numbers proposals, never core collision radius.
const WIDTH=360,HEIGHT=420;
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
    "worldScaleProposal": 0.298,
    "worldWidthProposal": 107.28,
    "worldHeightProposal": 125.16,
    "footAnchor": {
      "x": 0.5,
      "y": 0.93
    },
    "shadowFootAnchor": {
      "x": 182,
      "y": 388,
      "units": "source-px"
    },
    "operatorAnchorLocal": {
      "x": 126,
      "y": 315,
      "units": "source-px"
    },
    "spawnExitLocal": {
      "x": 133,
      "y": 348,
      "units": "source-px"
    },
    "muzzleLocal": {
      "x": 177,
      "y": 244,
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
    "fixtureId": "fixture-T03-1",
    "artVersion": "T05-C1D",
    "worldScaleBaselineT03": 0.276,
    "foundationVisibleWidthSourcePx": 296,
    "buildFoundationLocal": {
      "x": 181,
      "y": 378,
      "units": "source-px"
    },
    "t03SnapshotUrl": "../../art/towers/t03-snapshot/infantry-1.svg",
    "renderSections": {
      "shadowFoot": "render-under-pad-and-actors",
      "backStructure": "render-by-tower-foot",
      "operatorSlot": "P-owned-actor-installed-after-back",
      "frontRail": "visual-masked-front-rail-above-operator-feet",
      "hud": "UI-above-all-vfx"
    },
    "operatorNote": "P-owned recruit, exit anchor is presentation only.",
    "artApproval": "prototype-awaiting-direction",
    "worldScaleBaselineT04": 0.296,
    "visibleGeometryTopSourcePx": 101,
    "t04SnapshotUrl": "../../art/towers/t04-snapshot/infantry-1.svg",
    "t05AlternativeBUrl": "../../art/towers/concepts/infantry-B-level-1.svg",
    "layerAssets": {
      "shadowFoot": "../../art/towers/layers/infantry-1-shadow.svg",
      "backStructure": "../../art/towers/layers/infantry-1-back.svg",
      "frontRail": "../../art/towers/layers/infantry-1-front.svg"
    },
    "artNotes": "Deep barracks entrance, separate troop exit. No actor painted into SVG."
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
    "worldScaleProposal": 0.31,
    "worldWidthProposal": 111.6,
    "worldHeightProposal": 130.2,
    "footAnchor": {
      "x": 0.5,
      "y": 0.93
    },
    "shadowFootAnchor": {
      "x": 182,
      "y": 388,
      "units": "source-px"
    },
    "operatorAnchorLocal": {
      "x": 128,
      "y": 315,
      "units": "source-px"
    },
    "spawnExitLocal": {
      "x": 133,
      "y": 348,
      "units": "source-px"
    },
    "muzzleLocal": {
      "x": 160,
      "y": 177,
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
    "fixtureId": "fixture-T03-2",
    "artVersion": "T05-C1D",
    "worldScaleBaselineT03": 0.296,
    "foundationVisibleWidthSourcePx": 296,
    "buildFoundationLocal": {
      "x": 181,
      "y": 378,
      "units": "source-px"
    },
    "t03SnapshotUrl": "../../art/towers/t03-snapshot/infantry-2.svg",
    "renderSections": {
      "shadowFoot": "render-under-pad-and-actors",
      "backStructure": "render-by-tower-foot",
      "operatorSlot": "P-owned-actor-installed-after-back",
      "frontRail": "visual-masked-front-rail-above-operator-feet",
      "hud": "UI-above-all-vfx"
    },
    "operatorNote": "P-owned recruit, exit anchor is presentation only.",
    "artApproval": "prototype-awaiting-direction",
    "worldScaleBaselineT04": 0.308,
    "visibleGeometryTopSourcePx": 82,
    "t04SnapshotUrl": "../../art/towers/t04-snapshot/infantry-2.svg",
    "t05AlternativeBUrl": "../../art/towers/concepts/infantry-B-level-2.svg",
    "layerAssets": {
      "shadowFoot": "../../art/towers/layers/infantry-2-shadow.svg",
      "backStructure": "../../art/towers/layers/infantry-2-back.svg",
      "frontRail": "../../art/towers/layers/infantry-2-front.svg"
    },
    "artNotes": "Deep barracks entrance, separate troop exit. No actor painted into SVG."
  },
  {
    "assetId": "towers/sniper/level-1",
    "family": "sniper",
    "level": 1,
    "branch": null,
    "title": "Vigía de Reconocimiento",
    "url": "../../art/towers/sniper/level-1.svg",
    "sourceSize": {
      "widthPx": 360,
      "heightPx": 420
    },
    "worldScaleProposal": 0.318,
    "worldWidthProposal": 114.48,
    "worldHeightProposal": 133.56,
    "footAnchor": {
      "x": 0.5,
      "y": 0.93
    },
    "shadowFootAnchor": {
      "x": 181,
      "y": 390,
      "units": "source-px"
    },
    "operatorAnchorLocal": {
      "x": 185,
      "y": 204,
      "units": "source-px"
    },
    "spawnExitLocal": null,
    "muzzleLocal": {
      "x": 321,
      "y": 174,
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
    "fixtureId": "fixture-T03-3",
    "artVersion": "T06-C1D2",
    "worldScaleBaselineT03": 0.303,
    "foundationVisibleWidthSourcePx": 296,
    "buildFoundationLocal": {
      "x": 183,
      "y": 380,
      "units": "source-px"
    },
    "t03SnapshotUrl": "../../art/towers/t03-snapshot/sniper-1.svg",
    "renderSections": {
      "shadowFoot": "render-under-pad-and-actors",
      "backStructure": "under-operator-P",
      "operatorSlot": "external-P-foot-source-px",
      "frontRail": "over-operator-lower-body; actual depth controlled by integrator",
      "hud": "UI-above-all-vfx"
    },
    "operatorNote": "EMPTY visual source-pixel foot placement. P-owned actor; requires central depth policy",
    "artApproval": "prototype-awaiting-direction",
    "worldScaleBaselineT04": 0.312,
    "visibleGeometryTopSourcePx": 72,
    "t04SnapshotUrl": "../../art/towers/t04-snapshot/sniper-1.svg",
    "t05AlternativeBUrl": "../../art/towers/concepts/sniper-B-level-1.svg",
    "layerAssets": {
      "shadowFoot": "../../art/towers/layers/sniper-1-shadow.svg",
      "backStructure": "../../art/towers/layers/sniper-1-back.svg",
      "frontRail": "../../art/towers/layers/sniper-1-front.svg"
    },
    "artNotes": "Open observation deck; operator P feet at source y207; front rail separate. Rifle permanently mounted as tower mechanism.",
    "worldScaleBaselineT05": 0.31,
    "fireEffectOriginLocal": {
      "x": 321,
      "y": 174,
      "units": "source-px"
    },
    "frontRailBoundsLocal": {
      "x0": 87,
      "y0": 219,
      "x1": 284,
      "y1": 281,
      "units": "source-px"
    },
    "t05SnapshotUrl": "../../art/towers/t05-snapshot/sniper-1.svg",
    "t06FxVariants": [
      "A",
      "B"
    ],
    "artStatus": "prototype",
    "fxContractStatus": "candidate-event-adapter"
  },
  {
    "assetId": "towers/sniper/level-2",
    "family": "sniper",
    "level": 2,
    "branch": null,
    "title": "Vigía de Precisión Reforzado",
    "url": "../../art/towers/sniper/level-2.svg",
    "sourceSize": {
      "widthPx": 360,
      "heightPx": 420
    },
    "worldScaleProposal": 0.328,
    "worldWidthProposal": 118.08,
    "worldHeightProposal": 137.76,
    "footAnchor": {
      "x": 0.5,
      "y": 0.93
    },
    "shadowFootAnchor": {
      "x": 181,
      "y": 390,
      "units": "source-px"
    },
    "operatorAnchorLocal": {
      "x": 185,
      "y": 206,
      "units": "source-px"
    },
    "spawnExitLocal": null,
    "muzzleLocal": {
      "x": 330,
      "y": 171,
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
    "fixtureId": "fixture-T03-4",
    "artVersion": "T06-C1D2",
    "worldScaleBaselineT03": 0.317,
    "foundationVisibleWidthSourcePx": 296,
    "buildFoundationLocal": {
      "x": 183,
      "y": 380,
      "units": "source-px"
    },
    "t03SnapshotUrl": "../../art/towers/t03-snapshot/sniper-2.svg",
    "renderSections": {
      "shadowFoot": "render-under-pad-and-actors",
      "backStructure": "under-operator-P",
      "operatorSlot": "external-P-foot-source-px",
      "frontRail": "over-operator-lower-body; actual depth controlled by integrator",
      "hud": "UI-above-all-vfx"
    },
    "operatorNote": "EMPTY visual source-pixel foot placement. P-owned actor; requires central depth policy",
    "artApproval": "prototype-awaiting-direction",
    "worldScaleBaselineT04": 0.319,
    "visibleGeometryTopSourcePx": 68,
    "t04SnapshotUrl": "../../art/towers/t04-snapshot/sniper-2.svg",
    "t05AlternativeBUrl": "../../art/towers/concepts/sniper-B-level-2.svg",
    "layerAssets": {
      "shadowFoot": "../../art/towers/layers/sniper-2-shadow.svg",
      "backStructure": "../../art/towers/layers/sniper-2-back.svg",
      "frontRail": "../../art/towers/layers/sniper-2-front.svg"
    },
    "artNotes": "Open observation deck; operator P feet at source y207; front rail separate. Rifle permanently mounted as tower mechanism.",
    "worldScaleBaselineT05": 0.322,
    "fireEffectOriginLocal": {
      "x": 330,
      "y": 171,
      "units": "source-px"
    },
    "frontRailBoundsLocal": {
      "x0": 72,
      "y0": 213,
      "x1": 299,
      "y1": 290,
      "units": "source-px"
    },
    "t05SnapshotUrl": "../../art/towers/t05-snapshot/sniper-2.svg",
    "t06FxVariants": [
      "A",
      "B"
    ],
    "artStatus": "prototype",
    "fxContractStatus": "candidate-event-adapter"
  }
]);
export const TOWER_ART=TOWER_ART_V2;
export const validateTowerArt=validateTowerArtV2;
export function validateTowerArtV2(list=TOWER_ART_V2){
 if(list.length!==4)throw Error('Only four M01 towers I-II');
 const ids=new Set();
 for(const m of list){
  if(!['infantry','sniper'].includes(m.family)||![1,2].includes(m.level)||m.branch!==null)throw Error('T05 out of M01 scope');
  if(ids.has(m.assetId))throw Error('Duplicate tower asset id');ids.add(m.assetId);
  if(!m.url.startsWith('../../art/towers/'))throw Error('Tower source must belong T');
  if(m.sourceSize.widthPx!==WIDTH||m.sourceSize.heightPx!==HEIGHT)throw Error('T05 source dimensions');
  if(m.footAnchor.x!==.5||m.footAnchor.y!==.93)throw Error('Foot drift');
  if(m.worldScaleProposal<.26||m.worldScaleProposal>.34)throw Error('Unratified scale out of safe proposal band');
  for(const key of ['shadowFootAnchor','buildFoundationLocal','operatorAnchorLocal','spawnExitLocal','muzzleLocal','fireEffectOriginLocal']){
   const p=m[key];if(p===null||p===undefined)continue;
   if(!p||p.units!=='source-px'||p.x<0||p.x>WIDTH||p.y<0||p.y>HEIGHT)throw Error('Invalid source px anchor '+key);
  }
  for(const key of ['shadowFoot','backStructure','frontRail']){
   if(!m.layerAssets[key]?.startsWith('../../art/towers/layers/'))throw Error('Missing genuine T layer');
  }
 }
 return true;
}
// World projection around texture footAnchor, optional flip and rotation; NO map coordinates transformed.
export function projectSourceAnchor(sprite,meta,key){
 const a=meta[key];if(!a)return null;
 const sx=(sprite.scaleX??meta.worldScaleProposal)*(sprite.flipX?-1:1);
 const sy=(sprite.scaleY??meta.worldScaleProposal)*(sprite.flipY?-1:1);
 const dx=(a.x-meta.sourceSize.widthPx*meta.footAnchor.x)*sx;
 const dy=(a.y-meta.sourceSize.heightPx*meta.footAnchor.y)*sy;
 const ang=sprite.rotation??0,c=Math.cos(ang),s=Math.sin(ang);
 return {x:sprite.x+dx*c-dy*s,y:sprite.y+dx*s+dy*c};
}
export function towerFootprintPresentation(meta,padWidthWorld=110.24){
 if(!meta||!(padWidthWorld>0))throw Error('Invalid pad');
 const width=meta.foundationVisibleWidthSourcePx*meta.worldScaleProposal;
 return {foundationWorldWidth:+width.toFixed(2),padWorldWidth:+padWidthWorld.toFixed(2),
  visiblePadPercent:+(100*Math.max(0,1-width/padWidthWorld)).toFixed(1),
  worldArtHeight:meta.worldHeightProposal,worldArtWidth:meta.worldWidthProposal,
  effectiveFootApproxWorld:width,status:'VISUAL_PROPOSAL_NOT_COLLIDER'};
}
// Composition adapter specification ONLY. Integrator decides game display object lifetime/z-order.
export function getTowerVisualLayers(meta,variant='A'){
 if(variant==='B')return {composite:meta.t05AlternativeBUrl,split:false,operatorSlot:meta.operatorAnchorLocal,footAnchor:meta.footAnchor};
 if(variant==='T04')return {composite:meta.t04SnapshotUrl,split:false,operatorSlot:meta.operatorAnchorLocal,footAnchor:meta.footAnchor};
 return {composite:meta.url,split:true,shadowFoot:meta.layerAssets.shadowFoot,backStructure:meta.layerAssets.backStructure,
  frontRail:meta.layerAssets.frontRail,operatorSlot:meta.operatorAnchorLocal,footAnchor:meta.footAnchor};
}

// T06 optional, visual-only metadata access. Runtime world points still controlled by Integration.
export function getSniperFireVisualAnchor(sprite,meta){
 if(meta.family!=='sniper')return null;
 return projectSourceAnchor(sprite,meta,'fireEffectOriginLocal') ?? projectSourceAnchor(sprite,meta,'muzzleLocal');
}
