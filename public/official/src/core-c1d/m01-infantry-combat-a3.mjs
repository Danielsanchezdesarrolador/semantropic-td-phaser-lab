/**
 * C1-D8/B1 — ONLY fix infantry rally movement while in preparation / between waves.
 * The inherited A2 core retains all five-wave combat, targeting, HP, economy and stats.
 * Without this, M01CombatWorld.tick() returns early whenever !active, freezing
 * infantry even though setInfantryRally() accepted and assigned their new home.
 */
import {M01CombatWithInfantryA2} from "./m01-infantry-combat-a2.mjs";
export {INFANTRY_LVLS} from "./m01-infantry-combat-a2.mjs";
export class M01CombatWithInfantryA3 extends M01CombatWithInfantryA2 {
 tick(dt){
  const downtime=!this.active&&!this.paused&&!this.ended&&dt>0;
  const events=super.tick(dt); // existing dt validation, waves, HP and all attacks
  if(!downtime)return events;
  // Only movement + animation elapsed time; no waves/spawns, sniper fire,
  // HP mutation, gold rewards, enemy movement or duplicate attack events.
  this.tickNumber++;
  this.seconds+=dt;
  this.stepSoldiers(dt);
  return this.drainEvents();
 }
}
