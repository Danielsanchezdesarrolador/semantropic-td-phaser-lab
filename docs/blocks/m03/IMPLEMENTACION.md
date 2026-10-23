# M03 Bosque de los Susurros — bloque 23-oct-2026

## Alcance y base verificados

Base: `production/semantropic-td-live` en `0e85c3a393c5d3e5223520f7dc863b2abc7203cc`; rama de trabajo `feature/m03-bosque-susurros-premium`. HEAD de producción comprobado por GitHub. Antes del bloque, la URL oficial solo ofrecía M01/M02. No existía port jugable M03. La carpeta histórica `maps-visual/m01/m03` contiene una revisión artística de M01, no el mapa 03 de campaña. No se recuperaron ni fusionaron ramas históricas.

Se respeta AGENTS equipo central único, objetivo comercial premium y contratos. Se mantiene Phaser 4.2.1/WebGL2, FIT 1280×768, M01 R7 HF3 y M02 R6. Fuentes protegidas y arte aprobado de torres/actores anteriores se conservan byte a byte; `qa-m03-campaign.mjs` contrasta las fuentes con la base.

## Integración y datos

Una sola implementación de escena M02/M03: `startCampaignScene(config)` en `scene-m02.mjs`; M02 sigue siendo la configuración por defecto. `scene-m03.mjs` suministra reglas, arte, actores y resultados específicos. No se copió otra escena completa ni se reinició el juego. Las actualizaciones de locks M02 documentan esta extracción: el hash anterior era `e8aa7c6cb8dc56211669f71219d47591a4ac01a8`; las pruebas retienen el bloqueo exacto actualizado y añaden comprobaciones de defaults y regresión jugable M02. Los cores M01/M02 no cambian.

M03 usa módulos compartidos de economía, navegación e infantería adaptados del flujo probado, con reglas específicas en `core-c1d/m03-campaign.mjs`, proyección de sockets única, arte y actores separados. Selector y panorama aceptan 3; el panorama M03 prolonga el sendero usando la tangente real en x=0/1280, en franjas no interactivas, evitando un corte o giro en V por espejo; la ruta del core permanece idéntica. navegación completa elimina la escena anterior. Resultados permiten volver al selector. Las dos familias construibles siguen siendo Infantería/Francotirador I/II, costos y reembolso existentes. No se añaden Guardiana/Bombardera/Control, niveles III/IV ni jefes.

- id=3, mapLayoutVersion=4, 188 puntos originales, 8 pads y oro=410.
- 100 vidas comunes Phaser; `lives=20` de mapas es legacy.
- `decor.mapLayoutVersion=3` anidado está desactualizado frente al 4 superior; no se modifica el JSON protegido.
- Las nueve oleadas son exactamente `[8,8,10,8,8,9,15,14,21]`, 101 enemigos, siete tipos.
- warrior, hound, archer, shieldbearer conservan reglas compartidas; foreststalker, hunter y bat se portan de E1/E2/E3 del Canvas protegido, sin roster sustituto.
- Hunter: ataque de ballesta real a soldados, resistencia ranged=.72/melee=1.25. Acechador: melee rápido bloqueable. Bat: ruta aérea derivada por stride=11 (18 vértices), no bloqueable por infantería, objetivo válido de sniper. No se cambia la ruta terrestre de 188 puntos.
- Normal M03 usa hpFactor/scale/map enemyHpMultiplier y velocidad de E1. No tiene modificadores HP QA16–19 de mapas/dificultades posteriores. Escudo M03: `1.15 × QA16_SHIELD_BALANCE[3].normal (.45)`; bonos: base `25+2*3`, progresión 14, normalización 10/9. M02 no se rebalancea.
- Daño, escudos, HP, fugas, bloqueo, cadencia, oro y victoria vienen del core. Animación, impactos y sprites no producen daño. Muerte custom solo a partir de muerte confirmada; fuga no simula una muerte.
- Estrellas comunes: ≤5 fugas=3, ≤25=2, resto=1, marcado provisional V5. Guardado exclusivo `semantropic_td_phaser_m03_normal_v1`; M01/M02 y Canvas no se escriben. Storage deshabilitado no bloquea la partida ni afirma un guardado inexistente.

## QA reproducible y evidencia

`node tools/qa-m03-campaign.mjs`, `npm run build`, `node tools/qa-m03-browser.mjs`, batería Node y navegadores de `.github/workflows/semantropic-td-production-live.yml`.

La prueba principal compra con saldo real (410 + bajas + bonos), construye snipers en orden `[1,3,4,5,6,7,2,0]` y mejora I→II si alcanza. Simulación de paso fijo 1/60, sin oro inyectado ni muertes forzadas: nueve oleadas, 101 spawns, 93 bajas, 8 fugas, 84 vidas, victoria y 2 estrellas. Es una estrategia válida reproducible, no certificación de balance comercial. Sin defensas: derrota por 50 fugas/0 vidas. Se comprueban atacante ranged, resistencia, escudos, rally, pausa, duplicación de recompensas/eventos, bloqueo, tecnologías cerradas y persistencia aislada.

Navegador Chromium/WebGL2: desktop 1280×768, táctil emulado 844×390 y 932×430, ocho pads con input real, compra/mejora/venta/rally, pausas, ambiente, victoria/derrota, reinicio, selector entre tres mapas, orientación vertical y reducción de movimiento. La partida acelerada usa ticks reales del core y saldo legal; no equivale a nueve oleadas recorridas manualmente a velocidad normal. Se captura además combate con la escena corriendo en tiempo real.

Los primeros fallos de QA se corrigieron: acceso al selector bloqueado por overlay de resultados (nuevo botón explícito); el runner de input respetaba insuficientemente el debounce existente de 250ms (se esperan 320ms, sin cambiar el runtime); el test estático M02 se adaptó al factory conservando el test funcional de guardado.

Capturas ANTES: selector oficial sin M03 y plano técnico. DESPUÉS: escena integrada vacía, tropas/rally, combate real y oleadas 5/9, victoria/derrota y fotogramas ambientales A/B en los tres viewports. Un M03 jugable anterior no existía; no se presenta el wireframe como captura de un juego anterior. Evidencias completas quedan en artifacts de CI; selección en este directorio cuando cierre QA. El informe de entrega registra resultados efectivos y publicación separadamente.

## Límites y rollback

[NO EJECUTADO] Android/iPhone físico, GPU móvil, autonomía, revisión artística del Director y playtest humano prolongado. SwiftShader/Chromium de escritorio y FPS internos no certifican 60fps físicos. No se abre otro mapa ni nuevos sistemas por este bloque.

Rollback: revertir el commit de merge del PR M03 con `git revert -m 1 <merge_SHA>` en una rama de rollback, ejecutar QA, promover a producción por PR. Base anterior `0e85c3a393c5d3e5223520f7dc863b2abc7203cc`; Render publicará en la misma URL. No force push, reset destructivo, borrar ramas ni borrar récords. El registro M03 permanece aislado y es inocuo para M01/M02.
