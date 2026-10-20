# RFC T07 → DIRECCIÓN / INTEGRADOR C1-D2 / EQUIPO P06

Estado: [PROPUESTA SIN VALIDAR EN ESCENA INTEGRADA]. Ningún cambio en core ni atlases P.

## Único rifle y capas T/P

La decisión visual autorizada es rifleOwner=T, operatorOwner=P06 (`sniper_operator_unarmed`), renderRailOwner=T, shotAuthority=core. Ningún sprite P debe contener rifle. Una composición con dos rifles es ERROR BLOQUEANTE.

El catálogo mantiene el adaptador legado C1-E `getTowerVisualLayers(meta,'A')`: `shadowFoot → backStructure (rifle T incluido) → operador P → frontRail`. Para T07 nuevo, `getSniperSingleRifleLayers(meta)` devuelve `shadowFoot → structureNoRifle → operador P06 → rifleMounted (1) → frontRail`. **Nunca cargar estructura antigua CON rifle más rifleMounted**.

Sniper I foot=(.5,.93), operator=(185,204), stockGrip=(205,184), opticalFocus=(248,162), recoilPivot=(235,199), muzzle/effectOrigin=(321,174). II foot idéntico, operator=(185,206), grip=(209,182), optic=(258,154), recoil=(245,191), muzzle/effect=(330,171). Todas source-px en lienzo 360x420; escalas 0.318 y 0.328 solamente propuesta visual.

## Discrepancia real de eventos en PR #22

En `feature/core-c1d2-runtime-m01` / M01CombatWorld la instancia `attack_fire` incluye `payload.originWorld`, `payload.targetWorld` y `payload.bulletId`. `SniperShotPresenter.accept` requiere `muzzleWorld` para dibujar. T07 propone **adaptSniperCoreEvent(e, lookup)** como función pura read-only bajo `public/official/src/towers-visual/t07-core-visual-adapter.mjs`. El Integrador debe resolver `tower instance → sprite/meta` y llamar al adaptador; no existe bus universal instalado. No transformar origen real del proyectil del core.

`hit_applied` contiene `bulletId`, `towerId`, `targetId`, `worldPosition` y el daño ya calculado por core. El presentador T07 dibuja impacto **únicamente** si existe un `attack_fire` anterior con ese bulletId, torre y objetivo. Nunca invoca hit ni modifica HP. Un `entity_die` inmediatamente posterior a hit permite finalizar el destello confirmado sin duplicarlo; `despawn` y `entity_escape` cancelan disparos pendientes. `tower_sold`/`tower_upgraded` son señales **propuestas del puente visual central** para cancelar VFX, no eventos publicados por M01CombatWorld en PR #22.

## Tareas del Integrador / P06

1. Montar `sniper_operator_unarmed` real alineado al stockGrip/optic sin atravesar frontRail. 2. Crear adapter autorizado de core a visual y conservar eventId/bulletId/tick. 3. Al vender torre o cambiar nivel emitir teardown explícito desde la escena central. 4. Prueba 1 trace/eventId, hit_applied único, muerte/escape, pausa, reinicio, dos torres, mobile 844x390. 5. Ratificar profundidad del muzzle y rifle arm recoil una sola vez. 6. No duplicar hit desde la vista de personajes P06.

## Riesgos

Las poses hombro/manos P06 no están disponibles/verificadas; anclajes no constituyen pruebas físicas. La dirección B usa master compuesto con un rifle T (no split avanzado completo). Un acabado gráfico de SVG plano puede seguir sin alcanzar el nivel comercial; requieren capturas reales y aprobación artística.
