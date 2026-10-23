/** M04-GAME-01: narrow campaign adapter; approved HF1 painting unchanged. */
import {startCampaignScene} from './scene-m02.mjs';
import {M04CombatWorld} from '../core-c1d/m04-campaign.mjs';
import {m04ReadRecord,m04SaveVictory,m04Result} from '../core-c1d/m04-results-phaser.mjs';
import {HF1_ART_VERSION,makeM04ArtPlan} from '../maps-visual/m04/hf1/integrated-river.mjs';
import {mountM04World} from '../maps-visual/m04/phaser-world.mjs';
import {registerM04Actors} from '../actors-visual/m04/provisional-enemies.mjs';
await startCampaignScene({mapId:4,waveCount:11,name:'Río de los Antiguos',stage:'M04_GAME01_Normal_eleven_canonical_waves',
 actorsVersion:'P08_PLUS_M04_EXPLICIT_PROVISIONAL_BRUTE_SHAMAN',World:M04CombatWorld,
 readRecord:m04ReadRecord,saveVictory:m04SaveVictory,makeResult:m04Result,
 makeArtPlan:makeM04ArtPlan,mountWorld:mountM04World,artVersion:HF1_ART_VERSION,registerActors:registerM04Actors});
