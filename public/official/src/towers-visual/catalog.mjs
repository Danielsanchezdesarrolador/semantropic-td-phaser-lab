// SEMANTROPIC TD T04-Q2: editable SVG 360x420. Visual proposal, NOT core rules.
// Keeps exported T03 names for the integrator: TOWER_ART_V2, validateTowerArtV2, projectSourceAnchor.
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
    "artVersion": "T04-Q2",
    "worldScaleBaselineT03": 0.276,
    "foundationVisibleWidthSourcePx": 306,
    "buildFoundationLocal": {
      "x": 180,
      "y": 382,
      "units": "source-px"
    },
    "t03SnapshotUrl": "../../art/towers/t03-snapshot/infantry-1.svg",
    "renderSections": {
      "foundation": "under-actors",
      "buildingBody": "foot-y-sorted",
      "frontRoof": "operator-occlusion-managed-by-integrator",
      "hud": "always-higher-than-vfx"
    },
    "operatorNote": "P-owned recruit, exit anchor is presentation only."
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
    "artVersion": "T04-Q2",
    "worldScaleBaselineT03": 0.296,
    "foundationVisibleWidthSourcePx": 306,
    "buildFoundationLocal": {
      "x": 180,
      "y": 382,
      "units": "source-px"
    },
    "t03SnapshotUrl": "../../art/towers/t03-snapshot/infantry-2.svg",
    "renderSections": {
      "foundation": "under-actors",
      "buildingBody": "foot-y-sorted",
      "frontRoof": "operator-occlusion-managed-by-integrator",
      "hud": "always-higher-than-vfx"
    },
    "operatorNote": "P-owned recruit, exit anchor is presentation only."
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
    "artVersion": "T04-Q2",
    "worldScaleBaselineT03": 0.303,
    "foundationVisibleWidthSourcePx": 306,
    "buildFoundationLocal": {
      "x": 180,
      "y": 382,
      "units": "source-px"
    },
    "t03SnapshotUrl": "../../art/towers/t03-snapshot/sniper-1.svg",
    "renderSections": {
      "foundation": "under-actors",
      "buildingBody": "foot-y-sorted",
      "frontRoof": "operator-occlusion-managed-by-integrator",
      "hud": "always-higher-than-vfx"
    },
    "operatorNote": "EMPTY visual source-pixel foot placement. P-owned actor; requires central depth policy"
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
    "artVersion": "T04-Q2",
    "worldScaleBaselineT03": 0.317,
    "foundationVisibleWidthSourcePx": 306,
    "buildFoundationLocal": {
      "x": 180,
      "y": 382,
      "units": "source-px"
    },
    "t03SnapshotUrl": "../../art/towers/t03-snapshot/sniper-2.svg",
    "renderSections": {
      "foundation": "under-actors",
      "buildingBody": "foot-y-sorted",
      "frontRoof": "operator-occlusion-managed-by-integrator",
      "hud": "always-higher-than-vfx"
    },
    "operatorNote": "EMPTY visual source-pixel foot placement. P-owned actor; requires central depth policy"
  }
]);
export const TOWER_ART=TOWER_ART_V2;
export const validateTowerArt=validateTowerArtV2;
export function validateTowerArtV2(items=TOWER_ART_V2){
 if(items.length!==4)throw Error('T04 requires 4 variants only');
 const keys=new Set();
 for(const a of items){
  if(!['infantry','sniper'].includes(a.family)||![1,2].includes(a.level)||a.branch!==null)throw Error('Unauthorised tower');
  if(keys.has(a.assetId))throw Error('Duplicate tower asset ID');keys.add(a.assetId);
  if(a.sourceSize.widthPx!==W||a.sourceSize.heightPx!==H)throw Error('Bad SVG dims');
  if(a.footAnchor.x!==.5||a.footAnchor.y!==.93)throw Error('Foot pivot changed');
  if(!a.url.startsWith('../../art/towers/'))throw Error('Non-owned art path');
  if(!(a.worldScaleProposal>.2&&a.worldScaleProposal<.36))throw Error('Scale proposal out of bounds');
  if(!(a.foundationVisibleWidthSourcePx>=300&&a.foundationVisibleWidthSourcePx<=W))throw Error('Foundation missing');
  for(const k of ['operatorAnchorLocal','spawnExitLocal','muzzleLocal','shadowFootAnchor','buildFoundationLocal']){
    const v=a[k];if(v===null)continue;
    if(!v||v.units!=='source-px'||v.x<0||v.x>W||v.y<0||v.y>H)throw Error('Invalid local anchor '+k);
  }
 }
 return true;
}
// Sprite is Phaser.Image-like {x,y,scaleX,scaleY,rotation,flipX,flipY}. Rotation applies around foot.
// Does NOT translate map coordinates, alter hitboxes or actor state.
export function projectSourceAnchor(sprite,meta,key){
 const p=meta[key];if(!p)return null;
 const sx=(sprite.scaleX??meta.worldScaleProposal)*(sprite.flipX?-1:1);
 const sy=(sprite.scaleY??meta.worldScaleProposal)*(sprite.flipY?-1:1);
 const dx=(p.x-meta.sourceSize.widthPx*meta.footAnchor.x)*sx;
 const dy=(p.y-meta.sourceSize.heightPx*meta.footAnchor.y)*sy;
 const rot=sprite.rotation??0,c=Math.cos(rot),s=Math.sin(rot);
 return {x:sprite.x+dx*c-dy*s,y:sprite.y+dx*s+dy*c};
}
export function towerFootprintPresentation(meta,padWidthWorld=119.48){
 if(!meta||!(padWidthWorld>0))throw Error('Invalid footprint input');
 const width=meta.foundationVisibleWidthSourcePx*meta.worldScaleProposal;
 return {foundationWorldWidth:+width.toFixed(2),padWorldWidth:+padWidthWorld.toFixed(2),
  visiblePadPercent:+(100*Math.max(0,1-width/padWidthWorld)).toFixed(1),
  worldArtHeight:meta.worldHeightProposal,worldArtWidth:meta.worldWidthProposal,
  effectiveFootApproxWorld:width,
  status:'proposal-not-collider-not-approved'};
}
