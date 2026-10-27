/** Thin M05 Normal adapter: frozen Cartoon02, canonical campaign and mistlord. */
import{startCampaignScene}from'./scene-m02.mjs';
import{M05CombatWorld}from'../core-c1d/m05-campaign.mjs';
import{m05ReadRecord,m05SaveVictory,m05Result}from'../core-c1d/m05-results-phaser.mjs';
import{M05_ART_VERSION,makeM05ArtPlan,mountM05World}from'../maps-visual/m05/phaser-world.mjs';
import{registerM05Actors}from'../actors-visual/m05/campaign-enemies.mjs';
await startCampaignScene({mapId:5,waveCount:13,name:'Pantano de la Niebla',stage:'M05_GAME01_Normal_thirteen_waves_mistlord',
 actorsVersion:'P08_M03_BAT_PLUS_EXPLICIT_PROVISIONAL_M05_SUPPORT_BOSS',World:M05CombatWorld,
 readRecord:m05ReadRecord,saveVictory:m05SaveVictory,makeResult:m05Result,makeArtPlan:makeM05ArtPlan,mountWorld:mountM05World,
 artVersion:M05_ART_VERSION,registerActors:registerM05Actors});
