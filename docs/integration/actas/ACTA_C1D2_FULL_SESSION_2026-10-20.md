# SEMANTROPIC TD — ACTA C1-D2 G3 / cinco oleadas M01
**Fecha:** 20-10-2026 · **Integrador Central** · **Estado:** VALIDACIÓN DEL CORE POR SIMULACIÓN DETERMINISTA, QA WEBGL2 PARCIAL.
**PR:** #23 DRAFT contra feature/core-c1d2-runtime-m01 (PR #22, SHA base 482d4128bcd2d295a6eacb2909e209d89082fe46)
**Branch:** feature/integrator-c1d2-full-run-qa. **No merge, no Render, no producción.**

## Cambio real
Se agregó tools/qa-c1d2-five-waves.mjs y CI c1d2-full-session-integrator.yml. Ambos ejecutan el núcleo REAL M01 Normal existente, sin modificar reglas, mapa, estadísticas ni economía. Se prueban 5 waves [8,10,11,13,21] y 63 spawns, eventos de kill/escape, ledger, wave bonus exacto, pausas/regresiones mediante tests C1-D2 previos.

## Evidencia verificable
[GitHub Actions #39435006224](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39435006224): SUCCESS. Node checks, código fuente protegido, build real Phaser 4.2.1, regresión Chromium/WebGL2 en 1280x768, 844x390, 932x430 y artifact c1d2-complete-session-qa.

Resultados extraídos de los LOGS REALES de GitHub Actions:
- SIN TORRES: derrota natural con 50 fugas, 0 kills, vidas 0; en la última ola, 63 spawns acumulados; derrotado sin bloquear artificialmente.
- UNA SOLA SNIPER I: termina las 5 oleadas con 21 bajas, 42 fugas y 16 vidas. Esta estrategia sobreviva con muy poca defensa, señal de BALANCE PENDIENTE; NO es garantía de experiencia adecuada.
- CUATRO POLÍTICAS DE COMPRA/MEJORA automatizada: completan 5/5 oleadas con 63 bajas, 0 fugas, 100 vidas. Sin oro inyectado, todas las compras pasan por M01BuildEconomy. Solo demuestra superabilidad bajo estas estrategias deterministas.
- Se verifican recompensas por enemigo una vez, bonos de olas 1–4 exactamente una vez, ausencia de duplicados entity_die/entity_escape, integridad ledger, límite 8 pads y resultado de victoria/derrota único.

## LIMITACIONES / honestidad
La partida completa se prueba acelerando el core en Node; NO equivale a 5 olas presenciadas en Chromium a tiempo real por una persona. El browser real validó previamente compra, primer kill, bounty, pausa y render WebGL2; NO se observó cada frame de cinco olas. Las cuatro estrategias de compra son scripts, no una evaluación de dificultad por jugadores. NO se han integrado M05/T06/P05, unidades Infantería ni estrellas/guardados. No pruebas Android/iPhone físico ni FPS real móvil.

## Diagnóstico de Dirección
[CONFIRMADO] M01 puede ganar y perder mediante estado autoritativo real. [RIESGO] 42 fugas siguen dejando 16/100 vidas: según fórmula de fuga -2, el resultado es matemáticamente correcto pero la dificultad Normal debe equilibrarse y definir estrellas en D5/D6. [PENDIENTE] Pantalla de victoria, guardado por dificultad, replay de usuario y balance táctico.

## Próximo trabajo
C1-D3: soldados, bloqueo, melee, HP, respawn y coexistencia con sniper. Después C1-D4 arte M/T/P, D5 persistencia/estrellas y D6 balance/playtest con aprobación de staging. No modificar Canvas ni JSON V5. 
