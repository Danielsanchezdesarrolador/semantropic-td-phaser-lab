/** C1-D4R official historical source-lock. It checks bytes, not visual approval. */
import assert from "node:assert/strict";
import {execFileSync} from "node:child_process";
import {readFileSync} from "node:fs";
const gitHash=p=>execFileSync("git",["hash-object",p],{encoding:"utf8"}).trim();
const immutable=[
 ["public/official/src/maps-visual/m01/m03/renderer-v3.mjs","d0e72f80a730c030e497721f7d05dad32be3b61a"],
 ["public/official/art/actors/p03-rig.mjs","1a4282e1652ff559b92e18f42db465d6bfb8e729"],
 ["public/official/art/actors/atlas-source.mjs","043d7126e7e62c4c34d5242a3f8e26f1b90bdb87"],
 ["public/official/src/c1d4r-combat/heritage/t04/towers/infantry/level-1.svg","66e85f802e696d662d14b9154bf6924dbb6ba4b6"],
 ["public/official/src/c1d4r-combat/heritage/t04/towers/infantry/level-2.svg","25884d1754950f8d764c0f03b797e10e7ecac212"],
 ["public/official/src/c1d4r-combat/heritage/t04/towers/sniper/level-1.svg","52ec5b04b744a9583a9a07464a107c6b5f1cf293"],
 ["public/official/src/c1d4r-combat/heritage/t04/towers/sniper/level-2.svg","c1689a19e9467dd39c6c5af380d63b22176ead5d"]
];
for(const [path,sha] of immutable)assert.equal(gitHash(path),sha,"Historical visual asset changed: "+path);
const scene=readFileSync("public/official/src/c1d4r-combat/scene.mjs","utf8");
for(const text of ['M01CombatWithInfantry','mountM01WorldV3','createP03Atlas','registerP03Atlas','t04ArtFor','projectT04Point'])
 assert(scene.includes(text),"Lost original source or real gameplay: "+text);
for(const text of ['mountM01WorldV6','preloadP06','registerP06','getSniperSingleRifleLayers','T07_SINGLE_RIFLE'])
 assert(!scene.includes(text),"Unapproved visual package reintroduced: "+text);
const lock=JSON.parse(readFileSync("docs/integration/actas/VISUAL_BASELINE_LOCK_C1D4R.json","utf8"));
assert.equal(lock.sourceScreenshot.sha256,"24103e45a0e1249fa4b89d4e65ea16d9e147bdf1e2462e5c4063469a931842ef");
console.log(JSON.stringify({status:"PASS_C1D4R_SOURCE_LOCK",copiedOriginalSVG:4,
 identicalM03Rig:true,identicalP03Rig:true,immutableSourceFiles:immutable.length,
 screenshotCheckedByShaOnly:true,visualHumanApproval:"NOT_RUN"},null,2));
