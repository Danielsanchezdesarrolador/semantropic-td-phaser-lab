# COMBAT_EVENTS_CONTRACT — v1
**Autoridad:** Integrador/core. **Suscriptores:** M, T, P, HUD. **Estado:** contrato propuesto para el bridge, NO runtime instalado.

## Regla de oro
ÚNICAMENTE core escribe el estado de juego: HP, escudo, oro, vidas, oleadas, spawns, recompensa, costos, cooldowns, desbloqueos, daño a torres, blocking, fuga y final. Visuales son proyecciones del estado, nunca segunda simulación de combate.

## Envelope versionado PROPUESTO
```json
{
  "contractVersion":"combat-events-v1",
  "eventId":"session-wave-sequence-unique",
  "sessionId":"core-session-id",
  "tick":1234,
  "type":"attack_windup",
  "entityId":"core-instance-id",
  "targetId":"core-target-id",
  "worldPosition":{"x":300,"y":420},
  "payload":{}
}
```
El esquema es guía hasta implementar `CombatEventBridge` y fijar en PR testado los nombres/type enumerados. No afirmar que existe hoy ni cambiar clocks del simulador solo para este contrato.

## Tipos propuestos
- oleadas: `wave_start`, `spawn`, `wave_clear`, `campaign_map_win`, `defeat`.
- entidades: `move_state`, `target_acquired`, `attack_windup`, `attack_fire`, `projectile_travel`, `hit_applied`, `status_applied`, `status_removed`, `shield_changed`, `hp_changed`, `blocked`, `entity_die`, `entity_escape`, `entity_revive`, `despawn`.
- torres: `tower_built`, `tower_upgraded`, `tower_branch_selected`, `ability_cast`, `tower_ruined`, `tower_rebuilt`, `control_manual_order`.
- jefes: `boss_phase`, `boss_telegraph_start`, `boss_telegraph_end`, `boss_skill_resolved`.
- lifecycle: `game_paused`, `game_resumed`, `scene_reset`.
**Estos nombres son PROPUESTAS de interfaz, salvo `spawn`, `escape`, `wave_start`, `wave_clear` y `defeat` ya observados en M01PathSmokeModel. No copiar nombres inventados sin revisar implementación.**

## Ownership por clase
- M: escucha selección/ocupación/ruinas para decoración, opacidades u oclusión.
- T: escucha eventos de adquisición de objetivo, disparo, impacto y VFX del arma; construcción/evolución/ruina.
- P: escucha spawn, movimiento, estados, ataques corporales, HP/escudo, muerte/resurrección, fases y telegraphs.
- HUD: escucha resumen de core; ningún equipo artístico puede falsificar números.

## Idempotencia y temporalidad
- Evento `eventId` único; consumidor mantiene set bounded de IDs cuando se necesita deduplicación; de doble render NO se deduce segunda aplicación de daño.
- Ataque fire = una notificación visual asociada a resolución core. Render no decide hit/miss.
- Pausa congela el tiempo simulado (ni tick/compras/cooldowns progresan de fondo). VFX pausa según clock de escena, no `setTimeout` independiente.
- Reinicio y cambio de mapa destruyen suscripciones y objetos efímeros.
- Revivir no otorga segunda recompensa por muerte ya contabilizada.
- Escape común −2; boss −30 según política de campaña, controlado en core una vez.
- Victoria real requiere cálculo core, no ausencia visual de enemigos.

## Flujos de prueba obligatorios (cuando haya adaptador)
1. Enemy spawn→walk→blocked→attack→damage→die→reward exactamente una vez.
2. Enemy spawn→escape→−2 vidas exactamente una vez, sin reward por fuga.
3. Shield plateado absorbe antes de HP rojo, con barras legibles.
4. Bombardera explota en área: efecto único, daño resuelto por core por objetivo.
5. Torre de Control orden manual→valida costes/cooldown→summon visual; pulsar dos veces no duplica recursos.
6. Boss fase→telegraph→skill→ruina si cumple reglas; cancelaciones no ejecutan skill fantasma.
7. Pause→resume, reinicio y perdidas de foco móvil sin eventos duplicados.

## Protección
No exportar objetos Phaser serializados a saves; persistir estado de dominio con versión. No efectos a pantalla completa que oculten selección, vidas o barras críticas.
