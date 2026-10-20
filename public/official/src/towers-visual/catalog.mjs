// SEMANTROPIC TD TORRES T08: user-approved C1C/T04 visuals restored from PR#9.
// Core unchanged; anchors and worldScale restored from T04. Source pixel contact P07 PENDING.
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
    "worldScaleProposal": 0.296,
    "worldWidthProposal": 106.56,
    "worldHeightProposal": 124.32,
    "footAnchor": {
      "x": 0.5,
      "y": 0.93
    },
    "shadowFootAnchor": {
      "x": 180,
      "y": 391,
      "units": "source-px"
    },
    "operatorAnchorLocal": {
      "x": 138,
      "y": 319,
      "units": "source-px"
    },
    "spawnExitLocal": {
      "x": 139,
      "y": 350,
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
    "fixtureId": "fixture-T03-1",
    "artVersion": "T08-C1C-T04-CONTINUITY",
    "worldScaleBaselineT03": 0.276,
    "foundationVisibleWidthSourcePx": 306,
    "buildFoundationLocal": {
      "x": 180,
      "y": 382,
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
    "artApproval": "VISUAL_SOURCE_RESTORED__RUNTIME_NOT_YET_APPROVED",
    "worldScaleBaselineT04": 0.296,
    "visibleGeometryTopSourcePx": 101,
    "t04SnapshotUrl": "../../art/towers/t04-snapshot/infantry-1.svg",
    "t05AlternativeBUrl": "../../art/towers/concepts/infantry-B-level-1.svg",
    "layerAssets": {
      "shadowFoot": "../../art/towers/layers/infantry-1-shadow.svg",
      "backStructure": "../../art/towers/layers/infantry-1-back.svg",
      "frontRail": "../../art/towers/layers/infantry-1-front.svg"
    },
    "artNotes": "Deep barracks entrance, separate troop exit. No actor painted into SVG.",
    "t07PreviousScale": 0.298,
    "t04ApprovedSourceBlob": null,
    "t07SnapshotUrl": "../../art/towers/t07-snapshot/infantry-1.svg",
    "t08HistoricalApproval": "C1C 1280x768 PNG SHA256 24103e45a0e1249fa4b89d4e65ea16d9e147bdf1e2462e5c4063469a931842ef",
    "visualIdentity": "T04 original silhouette restored byte-for-byte; core statistics unchanged",
    "t08RifleComposition": "sniper: structureNoRifle + external P07 unarmed + 1 rifleMounted + frontRail"
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
    "worldScaleProposal": 0.308,
    "worldWidthProposal": 110.88,
    "worldHeightProposal": 129.36,
    "footAnchor": {
      "x": 0.5,
      "y": 0.93
    },
    "shadowFootAnchor": {
      "x": 180,
      "y": 391,
      "units": "source-px"
    },
    "operatorAnchorLocal": {
      "x": 144,
      "y": 328,
      "units": "source-px"
    },
    "spawnExitLocal": {
      "x": 145,
      "y": 355,
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
    "fixtureId": "fixture-T03-2",
    "artVersion": "T08-C1C-T04-CONTINUITY",
    "worldScaleBaselineT03": 0.296,
    "foundationVisibleWidthSourcePx": 306,
    "buildFoundationLocal": {
      "x": 180,
      "y": 382,
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
    "artApproval": "VISUAL_SOURCE_RESTORED__RUNTIME_NOT_YET_APPROVED",
    "worldScaleBaselineT04": 0.308,
    "visibleGeometryTopSourcePx": 82,
    "t04SnapshotUrl": "../../art/towers/t04-snapshot/infantry-2.svg",
    "t05AlternativeBUrl": "../../art/towers/concepts/infantry-B-level-2.svg",
    "layerAssets": {
      "shadowFoot": "../../art/towers/layers/infantry-2-shadow.svg",
      "backStructure": "../../art/towers/layers/infantry-2-back.svg",
      "frontRail": "../../art/towers/layers/infantry-2-front.svg"
    },
    "artNotes": "Deep barracks entrance, separate troop exit. No actor painted into SVG.",
    "t07PreviousScale": 0.31,
    "t04ApprovedSourceBlob": null,
    "t07SnapshotUrl": "../../art/towers/t07-snapshot/infantry-2.svg",
    "t08HistoricalApproval": "C1C 1280x768 PNG SHA256 24103e45a0e1249fa4b89d4e65ea16d9e147bdf1e2462e5c4063469a931842ef",
    "visualIdentity": "T04 original silhouette restored byte-for-byte; core statistics unchanged",
    "t08RifleComposition": "sniper: structureNoRifle + external P07 unarmed + 1 rifleMounted + frontRail"
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
    "worldScaleProposal": 0.312,
    "worldWidthProposal": 112.32,
    "worldHeightProposal": 131.04,
    "footAnchor": {
      "x": 0.5,
      "y": 0.93
    },
    "shadowFootAnchor": {
      "x": 180,
      "y": 391,
      "units": "source-px"
    },
    "operatorAnchorLocal": {
      "x": 185,
      "y": 198,
      "units": "source-px"
    },
    "spawnExitLocal": null,
    "muzzleLocal": {
      "x": 299,
      "y": 156,
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
    "artVersion": "T08-C1C-T04-CONTINUITY",
    "worldScaleBaselineT03": 0.303,
    "foundationVisibleWidthSourcePx": 306,
    "buildFoundationLocal": {
      "x": 180,
      "y": 382,
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
    "artApproval": "VISUAL_SOURCE_RESTORED__RUNTIME_NOT_YET_APPROVED",
    "worldScaleBaselineT04": 0.312,
    "visibleGeometryTopSourcePx": 72,
    "t04SnapshotUrl": "../../art/towers/t04-snapshot/sniper-1.svg",
    "t05AlternativeBUrl": "../../art/towers/concepts/sniper-B-level-1.svg",
    "layerAssets": {
      "shadowFoot": "../../art/towers/layers/sniper-1-shadow.svg",
      "backStructure": "../../art/towers/layers/sniper-1-back.svg",
      "frontRail": "../../art/towers/layers/sniper-1-front.svg",
      "structureNoRifle": "../../art/towers/layers/sniper-1-structure.svg",
      "rifleMounted": "../../art/towers/layers/sniper-1-rifle.svg"
    },
    "artNotes": "Open observation deck; operator P feet at source y207; front rail separate. Rifle permanently mounted as tower mechanism.",
    "worldScaleBaselineT05": 0.31,
    "fireEffectOriginLocal": {
      "x": 299,
      "y": 156,
      "units": "source-px"
    },
    "frontRailBoundsLocal": {
      "x0": 66,
      "y0": 205,
      "x1": 298,
      "y1": 263,
      "units": "source-px"
    },
    "t05SnapshotUrl": "../../art/towers/t05-snapshot/sniper-1.svg",
    "t06FxVariants": [
      "A",
      "B"
    ],
    "artStatus": "prototype",
    "fxContractStatus": "candidate-event-adapter",
    "rifleOwner": "T",
    "operatorOwner": "P07",
    "operatorAssetId": "sniper_operator_unarmed",
    "renderRailOwner": "T",
    "shotAuthority": "core",
    "t06SnapshotUrl": "../../art/towers/t06-snapshot/sniper-1.svg",
    "t07ArchitecturalBUrl": "../../art/towers/concepts/sniper-T07-B-level-1.svg",
    "weaponCompositionRule": "legacy backStructure INCLUDES rifle; new structureNoRifle EXCLUDES rifle, load rifleMounted ONCE after operator P06",
    "opticalFocusLocal": {
      "x": 249,
      "y": 151,
      "units": "source-px"
    },
    "stockGripLocal": {
      "x": 182,
      "y": 183,
      "units": "source-px"
    },
    "recoilPivotLocal": {
      "x": 223,
      "y": 180,
      "units": "source-px"
    },
    "platformDepthLocal": {
      "backY": 139,
      "operatorFootY": 198,
      "railFrontY": 260,
      "units": "source-px"
    },
    "rifleActionWeights": {
      "building": 0,
      "scopeSweep": 0.18,
      "rifleRecoilPx": 3,
      "operator": 0,
      "frontRail": 0
    },
    "t07Variants": [
      "A-observatorio-abierto",
      "B-bastidor-contrapeso"
    ],
    "vfxImpactAuthority": "hit_applied-correlated-bulletId-only",
    "fxStyles": [
      "A-precision-trace",
      "B-energy-orb"
    ],
    "t07PreviousScale": 0.318,
    "t04ApprovedSourceBlob": null,
    "t07SnapshotUrl": "../../art/towers/t07-snapshot/sniper-1.svg",
    "t08HistoricalApproval": "C1C 1280x768 PNG SHA256 24103e45a0e1249fa4b89d4e65ea16d9e147bdf1e2462e5c4063469a931842ef",
    "visualIdentity": "T04 original silhouette restored byte-for-byte; core statistics unchanged",
    "t08RifleComposition": "sniper: structureNoRifle + external P07 unarmed + 1 rifleMounted + frontRail",
    "t08GripStatus": "PROPOSED_P07_CONTACT_PENDING",
    "t08VariantPolicy": "T04 main identity ONLY; T07 B archived, not active for approved appearance"
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
    "worldScaleProposal": 0.319,
    "worldWidthProposal": 114.84,
    "worldHeightProposal": 133.98,
    "footAnchor": {
      "x": 0.5,
      "y": 0.93
    },
    "shadowFootAnchor": {
      "x": 180,
      "y": 391,
      "units": "source-px"
    },
    "operatorAnchorLocal": {
      "x": 189,
      "y": 198,
      "units": "source-px"
    },
    "spawnExitLocal": null,
    "muzzleLocal": {
      "x": 307,
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
    "textureKey": "towers/sniper/level-2",
    "fixtureId": "fixture-T03-4",
    "artVersion": "T08-C1C-T04-CONTINUITY",
    "worldScaleBaselineT03": 0.317,
    "foundationVisibleWidthSourcePx": 306,
    "buildFoundationLocal": {
      "x": 180,
      "y": 382,
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
    "artApproval": "VISUAL_SOURCE_RESTORED__RUNTIME_NOT_YET_APPROVED",
    "worldScaleBaselineT04": 0.319,
    "visibleGeometryTopSourcePx": 68,
    "t04SnapshotUrl": "../../art/towers/t04-snapshot/sniper-2.svg",
    "t05AlternativeBUrl": "../../art/towers/concepts/sniper-B-level-2.svg",
    "layerAssets": {
      "shadowFoot": "../../art/towers/layers/sniper-2-shadow.svg",
      "backStructure": "../../art/towers/layers/sniper-2-back.svg",
      "frontRail": "../../art/towers/layers/sniper-2-front.svg",
      "structureNoRifle": "../../art/towers/layers/sniper-2-structure.svg",
      "rifleMounted": "../../art/towers/layers/sniper-2-rifle.svg"
    },
    "artNotes": "Open observation deck; operator P feet at source y207; front rail separate. Rifle permanently mounted as tower mechanism.",
    "worldScaleBaselineT05": 0.322,
    "fireEffectOriginLocal": {
      "x": 307,
      "y": 149,
      "units": "source-px"
    },
    "frontRailBoundsLocal": {
      "x0": 65,
      "y0": 200,
      "x1": 304,
      "y1": 265,
      "units": "source-px"
    },
    "t05SnapshotUrl": "../../art/towers/t05-snapshot/sniper-2.svg",
    "t06FxVariants": [
      "A",
      "B"
    ],
    "artStatus": "prototype",
    "fxContractStatus": "candidate-event-adapter",
    "rifleOwner": "T",
    "operatorOwner": "P07",
    "operatorAssetId": "sniper_operator_unarmed",
    "renderRailOwner": "T",
    "shotAuthority": "core",
    "t06SnapshotUrl": "../../art/towers/t06-snapshot/sniper-2.svg",
    "t07ArchitecturalBUrl": "../../art/towers/concepts/sniper-T07-B-level-2.svg",
    "weaponCompositionRule": "legacy backStructure INCLUDES rifle; new structureNoRifle EXCLUDES rifle, load rifleMounted ONCE after operator P06",
    "opticalFocusLocal": {
      "x": 246,
      "y": 141,
      "units": "source-px"
    },
    "stockGripLocal": {
      "x": 201,
      "y": 177,
      "units": "source-px"
    },
    "recoilPivotLocal": {
      "x": 232,
      "y": 172,
      "units": "source-px"
    },
    "platformDepthLocal": {
      "backY": 128,
      "operatorFootY": 198,
      "railFrontY": 262,
      "units": "source-px"
    },
    "rifleActionWeights": {
      "building": 0,
      "scopeSweep": 0.18,
      "rifleRecoilPx": 2,
      "operator": 0,
      "frontRail": 0
    },
    "t07Variants": [
      "A-observatorio-abierto",
      "B-bastidor-contrapeso"
    ],
    "vfxImpactAuthority": "hit_applied-correlated-bulletId-only",
    "fxStyles": [
      "A-precision-trace",
      "B-energy-orb"
    ],
    "t07PreviousScale": 0.328,
    "t04ApprovedSourceBlob": null,
    "t07SnapshotUrl": "../../art/towers/t07-snapshot/sniper-2.svg",
    "t08HistoricalApproval": "C1C 1280x768 PNG SHA256 24103e45a0e1249fa4b89d4e65ea16d9e147bdf1e2462e5c4063469a931842ef",
    "visualIdentity": "T04 original silhouette restored byte-for-byte; core statistics unchanged",
    "t08RifleComposition": "sniper: structureNoRifle + external P07 unarmed + 1 rifleMounted + frontRail",
    "t08GripStatus": "PROPOSED_P07_CONTACT_PENDING",
    "t08VariantPolicy": "T04 main identity ONLY; T07 B archived, not active for approved appearance"
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
  for(const key of ['shadowFootAnchor','buildFoundationLocal','operatorAnchorLocal','spawnExitLocal','muzzleLocal','fireEffectOriginLocal','opticalFocusLocal','stockGripLocal','recoilPivotLocal']){
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
 if(variant==='T07B'&&meta.family==='sniper')return {composite:meta.t07ArchitecturalBUrl,split:false,operatorSlot:meta.operatorAnchorLocal,footAnchor:meta.footAnchor};
 if(variant==='T06'&&meta.family==='sniper')return {composite:meta.t06SnapshotUrl,split:false,operatorSlot:meta.operatorAnchorLocal,footAnchor:meta.footAnchor};
 if(variant==='T07'&&meta.family==='sniper')return getSniperSingleRifleLayers(meta);
 return {composite:meta.url,split:true,shadowFoot:meta.layerAssets.shadowFoot,backStructure:meta.layerAssets.backStructure,
  frontRail:meta.layerAssets.frontRail,operatorSlot:meta.operatorAnchorLocal,footAnchor:meta.footAnchor};
}

// T06 optional, visual-only metadata access. Runtime world points still controlled by Integration.
export function getSniperFireVisualAnchor(sprite,meta){
 if(meta.family!=='sniper')return null;
 return projectSourceAnchor(sprite,meta,'fireEffectOriginLocal') ?? projectSourceAnchor(sprite,meta,'muzzleLocal');
}

/**
 * T07 explicit one-rifle composition. Existing C1-E 'A' remains backwards-compatible:
 * shadowFoot → backStructure(includes ONE rifle) → operator P → frontRail.
 * NEW T07 mode: shadowFoot → structureNoRifle → P06 unarmed → rifleMounted(ONE) → frontRail.
 * This is metadata only; layering / depth / actor creation belongs to Integrator.
 */
export function getSniperSingleRifleLayers(meta){
 if(meta?.family!=='sniper'||meta.rifleOwner!=='T')throw Error('T07 rifle ownership limited to Sniper');
 const a=meta.layerAssets;
 if(!a.structureNoRifle||!a.rifleMounted)throw Error('Missing dedicated weapon layer');
 return {split:true,composite:meta.url,shadowFoot:a.shadowFoot,backStructure:a.structureNoRifle,
  operatorSlot:meta.operatorAnchorLocal,rifleMounted:a.rifleMounted,frontRail:a.frontRail,
  rifleOwner:'T',operatorOwner:'P06',operatorAssetId:'sniper_operator_unarmed',
  footAnchor:meta.footAnchor,singleRifle:true};
}
export function getSniperRifleVisualPoints(sprite,meta){
 if(meta?.family!=='sniper')return null;
 return Object.fromEntries(['operatorAnchorLocal','stockGripLocal','opticalFocusLocal','recoilPivotLocal','fireEffectOriginLocal']
  .map(k=>[k,projectSourceAnchor(sprite,meta,k)]));
}
