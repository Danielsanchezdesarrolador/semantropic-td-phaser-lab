/** M03 uses the shared battle presentation, with explicit campaign/art adapters. */
import {startCampaignScene} from './scene-m02.mjs';
import {M03CombatWorld} from '../core-c1d/m03-campaign.mjs';
import {m03ReadRecord,m03SaveVictory,m03Result} from '../core-c1d/m03-results-phaser.mjs';
import {M03_PROP_URL,M03_TERRAIN_URL,M03_ART_VERSION,makeM03ArtPlan} from '../maps-visual/m03/forest-art.mjs';
import {mountM03World} from '../maps-visual/m03/phaser-world.mjs';
import {registerM03Actors} from '../actors-visual/m03/forest-enemies.mjs';
await startCampaignScene({mapId:3,waveCount:9,name:'Bosque de los Susurros',
 actorsVersion:'P08_APPROVED_PLUS_M03_ORIGINAL_RIGS',stage:'M03_Normal_nine_canonical_waves',World:M03CombatWorld,
 readRecord:m03ReadRecord,saveVictory:m03SaveVictory,makeResult:m03Result,
 makeArtPlan:makeM03ArtPlan,mountWorld:mountM03World,artVersion:M03_ART_VERSION,
 preload:scene=>{scene.load.image('m03-original-props',M03_PROP_URL);scene.load.image('m03-original-terrain',M03_TERRAIN_URL);},registerActors:registerM03Actors});
