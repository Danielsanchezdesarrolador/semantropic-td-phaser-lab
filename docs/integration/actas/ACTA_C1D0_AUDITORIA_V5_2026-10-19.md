# SEMANTROPIC TD — ACTA C1-D0 · PREAUDITORÍA Canvas V5 / Phaser PH01
**Fecha:** 2026-10-19 · **Rama:** `feature/core-c1d-m01-combat` · **Estado:** auditoría INICIADA; gameplay C1-D1–D6 no implementado.

## Fuentes inspeccionadas [CONFIRMADO EN ARCHIVOS]
1. `public/JUEGO_V5_CANVAS.html`, bloque de campaña y E5 (referencia protegida).
2. `public/official/src/m01-model.mjs`, simulador de diagnóstico SIN torres.
3. `public/official/data/maps.v5.json` y `campaign140.v5.json`, datos canónicos.
4. `docs/contracts/v1/COMBAT_EVENTS_CONTRACT.md` — norma propuesta, API no implementada.
5. PR #12 `integration/c1c-q2-review` — integración artística con WebGL2, NO combate real.

## Parámetros directamente comprobados
- M01 ID1 Praderas, 133 waypoints y 8 spots; ruta única.
- 5 oleadas distribuidas [8,10,11,13,21] = 63 enemigos `warrior` y `hound`.
- `maps.v5.json` M01 contiene `gold: 365`, `scale: 0.9`, `enemyHpMultiplier: 1`.
- `maps.v5.json` M01 contiene `lives: 22` **LEGACY** y recomendaciones de torres `pulse/cannon/prism/frost`; no usar ni interpretar como permisos.
- `m01-model.mjs` ofrece runtime de 100 vidas, fuga común −2, fuga jefe −30 y tech cap `infantry:2`, `sniper:2`.
- Canvas V5 `E5_MODES.normal` multiplica HP/damage/speed/spawn/gold por 1; `e5StartingLives` retorna 100 en todos los modos.
- Canvas V5 `E5_STARS` contiene `maxLeaksThreeStars:5`, `maxLeaksTwoStars:25`, `twoStarsProvisional:true` (por tanto la norma de 2 estrellas aún necesita tratamiento como decisión provisional y test del resultado efectivo).
- Canvas V5 contiene `INFANTRY_LEVELS` I→II con `count:1/2`, HP 110/165 y damage 8/12; `SPECS.infantry` base cost 95, upgrades [135,235,370], range 130. `SPECS.sniper` base cost 140, upgrades [185,310,420], damage 40, rate 1.65, range 230. **CANDIDATOS DE FUENTE PARA PARIDAD; verificar fórmulas EFECTIVAS incluyendo perks y dificultad antes de codificar estadísticas definitivas.** No usar `const families` del tutorial, que tiene stats distintos (ej. sniper 41 / rate 1.55 / range254).

## Límites y pendientes BLOQUEANTES ANTES DE PORTAR COMBATE
- Inventariar las funciones efectivas en Canvas: construir/pagar, mejorar, target, soldados y blocking, daños enemigos/torres, wave bonus, kill bounty, stars de resultado, persistencia, destrucción/reconstrucción.
- Resolver discrepancias con evidencia de código/campos legacy. No completar con valores supuestos.
- El modelo actual `M01PathSmokeModel` puede terminar por derrota natural sin torres; contiene `diagnostic_end`, que NO es victoria de campaña.
- Tests Node/CI C1D0 verifican exclusivamente fuentes y smoke. Una CI verde NO significa ataque/sniper/soldados implementados.

## Plan autorizado
C1D0 auditoría y contrato → C1D1 economía/build → C1D2 sniper → C1D3 infantry/block → C1D4 escena/HUD → C1D5 resultados/estrellas → C1D6 QA/balance. Cada hito acta propia y PR revisable. Core nunca se mezcla con archivos de arte M04/T05/P04.

## Evidencia pendiente
Acción CI nueva y captura de resultados de Node; sin Chromium del combate real, hardware físico ni partida jugable hasta etapas posteriores. No afirmar lo contrario.
