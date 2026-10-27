/** Thin M06 Normal adapter: frozen approved M06 v3, fifteen waves and two canonical routes. */
import{startCampaignScene}from'./scene-m02.mjs';
import{M06CombatWorld}from'../core-c1d/m06-campaign.mjs';
import{m06ReadRecord,m06SaveVictory,m06Result}from'../core-c1d/m06-results-phaser.mjs';
import{M06_ART_VERSION,makeM06ArtPlan,mountM06World}from'../maps-visual/m06/phaser-world.mjs';
import{registerM06Actors}from'../actors-visual/m06/campaign-enemies.mjs';
await startCampaignScene({mapId:6,waveCount:15,name:'Desfiladero de Hierro',stage:'M06_GAME01_Normal_fifteen_waves_two_routes',
 actorsVersion:'P08_M03_BAT_PLUS_EXPLICIT_PROVISIONAL_M06_SUPPORT_SIEGE_GUNNER',World:M06CombatWorld,
 readRecord:m06ReadRecord,saveVictory:m06SaveVictory,makeResult:m06Result,makeArtPlan:makeM06ArtPlan,mountWorld:mountM06World,
 artVersion:M06_ART_VERSION,registerActors:registerM06Actors});
