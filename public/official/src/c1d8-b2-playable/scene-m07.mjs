/** Thin M07 Normal adapter: frozen approved M07 fidelity v2, seventeen waves and two canonical routes. */
import{startCampaignScene}from'./scene-m02.mjs';
import{M07CombatWorld}from'../core-c1d/m07-campaign.mjs';
import{m07ReadRecord,m07SaveVictory,m07Result}from'../core-c1d/m07-results-phaser.mjs';
import{M07_ART_VERSION,makeM07ArtPlan,mountM07World}from'../maps-visual/m07/phaser-world.mjs';
import{registerM07Actors}from'../actors-visual/m07/campaign-enemies.mjs';
await startCampaignScene({mapId:7,waveCount:17,name:'Paso de la Escarcha',stage:'M07_GAME01_Normal_seventeen_waves_two_routes',
 actorsVersion:'P08_M03_BAT_PLUS_EXPLICIT_PROVISIONAL_M07_SUPPORT_SIEGE_GUNNER',World:M07CombatWorld,
 readRecord:m07ReadRecord,saveVictory:m07SaveVictory,makeResult:m07Result,makeArtPlan:makeM07ArtPlan,mountWorld:mountM07World,
 artVersion:M07_ART_VERSION,registerActors:registerM07Actors});
