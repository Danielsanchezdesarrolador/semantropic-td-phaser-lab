# SEMANTROPIC TD — ACTA OFICIAL MAPAS M07-Q2 / PERF C1-D5
**20-octubre-2026 · Equipo MAPAS · Phaser 4.2.1/WebGL2 · Estado: PROTOTIPO OPTIMIZADO EN FUENTE, NO CERTIFICADO EN NAVEGADOR**

## 1. Orden, baselines y alcance
**Prompt Maestro:** MAPAS M07-Q2 — Primera partida jugable M01 / Rendimiento Phaser / Continuidad C1-C.

- Imagen original protegida verificada **1280×768**, SHA-256 `24103e45a0e1249fa4b89d4e65ea16d9e147bdf1e2462e5c4063469a931842ef`. El archivo PNG original del usuario pasó lectura local real y comprobación SHA; **no** es una captura nueva Q2.
- **Base MAPAS:** `feature/art-m07-continuidad-c1c@2c08eaa13dac309f85f4e76b736db6f66545aac9`, PR [#31](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/31).
- **Rama exclusiva hotfix:** `feature/art-m07-q2-performance-c1d5`, PR DRAFT contra la rama M07, **NO MERGE**. HEAD actual se obtiene de la pestaña *Commits* del PR.
- **Arte aprobado de partida real:** C1-D4R [PR #30](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/30); C1-D5 es propietario de Dirección General y **no ha sido editado por MAPAS**.
- Archivos protegidos sin cambios: datos V5, 140 oleadas, `m01-model.mjs`, `core-c1d/**`, escenas y HUD central, Render, `main`, campañas, producción, assets de T/P, build global.

## 2. Identidad M03/C1-C — 100 % FUENTE PROTEGIDA
- `mountM01WorldV7` continúa montando directamente el histórico `mountM01WorldV3` con paleta `viva` y `treatment:"fiel"` predeterminado.
- Misma ruta de 133 waypoints, ocho sockets oficiales, ancho gráfico de camino 110, radio visual de selector 54.
- Siete árboles `oak-illustrated.svg`, valla, acueducto/puerta, cristal `shrine`, mirador y supply/fern, total **13 props originales** en las coordenadas exactas de M03. Nueve SVG heredados precargados (incluye dos fuentes no instanciadas).
- **Ningún recurso nuevo de M04/M05/M06, ni gradientes/edificios/animaciones en modo Fiel.** La variante `pulido` sigue siendo opt-in; no se activa en el juego ni se altera de forma automática.
- El navegador real **aún no ha confirmado equivalencia visual** contra la captura C1-C. Fuente idéntica no equivale a verificación píxel por píxel con T/P/HUD integrados.

## 3. Hallazgos reales de código
**H1: conflicto entre consumidores M03 directos y M07.** El M07 anterior eliminaba las once texturas M03 generadas al destruir su última vista. Si otra escena M03 se había montado después y usaba esas claves, perdía texturas sin saberlo. **FIX:** M07-Q2 nunca borra las texturas históricas compartidas del `Phaser.TextureManager`; retiene un conjunto fijo de 11 claves durante la vida del manager. Los SVG de nueve fuentes también continúan cacheados. La textura de microdetalle opcional usa lease independiente y se elimina al desaparecer su último usuario.

**H2: latencia y churn de textures al reiniciar.** Antes M07 rehacía dos fondos grandes y nueve pads al volver a montar. Ahora reutiliza el mismo juego de texturas, sin recomputación en `update`, sin timers ni render por tick.

**H3: eventos visuales desordenados.** Un evento `tower_built` atrasado podía dibujar una base ocupada después de `tower_sold` más reciente. **FIX:** se registran ticks de snapshot y por socket; un snapshot anterior y los eventos visuales viejos son ignorados. `eventId` duplicado también se rechaza. `scene_reset` explícito sigue limpiando proyecciones.

**H4: selección sobre pad ocupado.** La API directa de selección podía activar el glifo `empty` mientras una torre seguía ocupando el pad. **FIX:** `selected` cambia sólo el indicador existente, preservando `occupied/ruins` y sin modificar la simulación.

## 4. Medición ANTES/DESPUÉS efectuada — V8 mocks, NO GPU
Evalué **fuentes JS auténticas descargadas de GitHub**, M03, M07 original y M07-Q2 con mocks Phaser/Canvas, 50 montajes/desmontajes alternados Fiel/Pulido y la misma topología V5.

| Variable observada en mock | M07 base | M07-Q2 | Interpretación |
|---|---:|---:|---|
| Creaciones de textura Canvas | **575** | **36** | −539 llamadas a `addCanvas` |
| Borrados de textura Canvas | **575** | **25** | −550 llamadas a `remove` |
| Claves M03 generadas al finalizar | 0 | **11** | Caché intencional y acotada |
| SVG heredados disponibles | 9 | **9** | Ningún asset visual nuevo |
| Texturas opcionales `pulido` residuales | 0 | **0** | Su lease conserva limpieza |

Prueba estructural adicional **[PASS V8 SIMULADO]**: 50 ciclos Q2, 2.675 objetos de escena destruidos, 63 objetos visuales sintéticos y ninguna textura de césped rehecha por tick; selección+ocupación, venta `tick=22`, reaparición obsoleta `tick=21`, snapshot antiguo y `eventId` duplicado rechazados; consumidor M03 directo con `disposeTextures:false` continúa utilizando las claves tras cerrar M07.

**Memoria teórica:** once superficies RGBA8 M03 (dos de 2560×1536 y nueve de 424×304) suman **34,43 MiB**, sin mips, driver, staging ni decodificación SVG. **NO** es lectura GPU. La textura opt-in de césped 1280×768 suma 3,75 MiB sólo mientras existe. Retención acotada no es fuga creciente, pero aumenta el mínimo de memoria del manager durante su vida.

## 5. Evidencias disponibles y pendientes
- [QA_MAPAS_M07_Q2.json](QA_MAPAS_M07_Q2.json): checks con categorías PASS mock/source, NOT_RUN y riesgos.
- [PERF_BASELINE_M07_Q2.json](PERF_BASELINE_M07_Q2.json): contadores antes/después, memoria teórica, tres viewports pendientes.
- `public/official/src/maps-visual/m01/m07/qa-m07-q2.mjs`: Node real ESM usando los archivos checkout, 50 ciclos y 63 formas **SINTÉTICAS**, no ataques reales.
- `public/official/src/maps-visual/m01/m07/capture-m07-q2.mjs`: Playwright/Chromium WebGL2 y screenshots auténticas 1280×768 / 844×390 / 932×430 con 0/13/63 formas visuales sintéticas; `requestAnimationFrame` medirá p50/p95 si se ejecuta, además del renderer real.
- `showcase-v7.mjs` ofrece instrumentación **sólo con `?qa=1`**, inaccesible desde vista normal. No cambia juego ni sprites aprobados.

**[NOT_RUN]** Node con checkout real M07-Q2, build `npm run build`, browser Chromium/WebGL2, FPS físicos, GPU móvil, capturas reales nuevas, partida C1-D5 de cinco oleadas y 63 apariciones oficiales. No se inventan métricas ni se llama `PASS` a un script simplemente escrito.

## 6. Bloqueante de convivencia con legacy M03
Si M03 se montó PRIMERO y su renderer antiguo conserva `disposeTextures:true`, al desmontarse puede eliminar recursos Phaser que una vista M07 aún necesita. **MAPAS no puede corregir la destrucción de un renderer M03 de propiedad histórica sin violar la orden**. Dirección General debe definir ownership común del TextureManager o usar para ese M03 `disposeTextures:false`; el RFC explica el riesgo y el test de convivencia. `M07-Q2` nunca elimina recursos históricos por su cuenta.

## 7. Contrato para Integrador / C1-D5
`preloadM07Illustrations(scene)`, `mountM01WorldV7(scene,map,{palette:"viva",treatment:"fiel"})`. Tras snapshot oficial, `view.applyVisualSnapshot({...tick,sockets})`; estado ocupado/ruinas conserva glifo bajo selección; `view.projectEvent(e)` es propuesta read-only de eventos y no garantiza adaptadores instalados. `view.getMapPerformanceInfo()` reporta solo recuentos de la capa Mapas, no FP simulados ni memoria GPU. `destroy()` es idempotente.

No se sugiere insertar 63 objetos sintéticos en C1-D5: su QA debe emplear el core verdadero y leer cinco oleadas, 63 spawns, HP, fugas, ataques, pausa y venta. La cámara/ENVELOP/SAFEs permanecen propiedad exclusiva de DG. Cualquier valor de display objects del juego completo requiere prueba central separada.

[RFC_MAPAS_M07_Q2_C1D5_LIFECYCLE.md](RFC_MAPAS_M07_Q2_C1D5_LIFECYCLE.md).

## 8. Criterios de aceptación y rollback
Gate A fuentes/ownership necesita diff final; Gate B igualdad visual necesita captura C1-C y nuevo Chromium; Gate C Node/build nativos NOT_RUN; Gate D C1-D5 5 oleadas reales NOT_RUN; Gate E revisión artística explícita del propietario NOT_RUN; Gate F merge/deploy NO AUTORIZADO.

**Veredicto de MAPAS:** optimización de código aplicada, reducción de churn probada en mocks, arte original no rediseñado. **NO CERTIFICADO PARA JUEGO FINAL.** Cerrar PR Q2 sin merge recupera exactamente M07 previo y no afecta C1-D4R, Render ni otros equipos.