# M07-GAME-01 — integración Normal

Orden vigente recibida el 27/10/2026: habilitar M07 con geometría y arte v2 congelados. Base y producción verificada mediante git ls-remote: 8a8a3c44d976acc9a81ff8a74da5083da572ff1a. Rama feat/m07-game01. La rama documental docs/estudio-td-original-20261027 (447d620) permanece independiente y pendiente de PR por API403. No se edita AGENTS como parte de M07.

## Alcance y decisiones

Adaptador de arte y escena específicos, reglas/resultados M07, reutilización del dual-route M06 y actores originales provisionales. Selector M01–M07. No se implementa M08, jefe ni dificultad adicional. El arte de referencia es m07-hf-mockup-fidelity-v2; se preserva por hash, sin afirmar aprobación estética definitiva ni pruebas físicas. El plan existente contiene tres puentes: prevalece el plan real sobre la descripción histórica de dos.

Contrato: 271+271 nodos, nueve pads, 510 oro y 100 vidas; 17 oleadas, 140 apariciones 61/79. Conteos por ola: 6/4/4/7/7/6/8/7/7/7/9/7/10/10/13/11/17. Tipos: froststalker45, warrior16, runesentinel31, shieldbearer12, hound6, archer6, brute4, bat12, aliengunner6, shaman2. JSON protegido intacto.

Fuente de stats: public/JUEGO_V5_CANVAS.html, E1/E3 y QA18D_M07_NORMAL. Froststalker HPfactor1.1/speed84/reward23/damage12/range32/interval1.32/windup.28; runesentinel1.67/43/29/14/37/1.65/.42 y shieldFactor.82. Sin poderes inventados. QA18D HP×.72 para cinco tipos y escudo rúnico×.70 desde legacyWave7 (W12). Las duraciones, offsets y routeStart del JSON prevalecen por orden expresa sobre spawnSpacing2 y alternancia histórica de V5; no se trasplantan números del mod KRV.

Dirección autorizó expresamente «Autorizar ×1,35 solo en M07 Normal». Se aplica M07_SNIPER_FACTOR=1.35; sustituye el ×1.17 histórico exclusivamente aquí. Registro en balance-proposal/DECISION.md. No implica balance perfecto. Infantería M07 usa selección próxima al rally y cadencia V5 mediante hooks opcionales; los mapas anteriores conservan el comportamiento predeterminado. Los cambios compartidos restantes admiten rules/mapId7, carga de escena, selector y panorama; las suites previas se vuelven a ejecutar.

Brute/shaman/aliengunner/froststalker/runesentinel reutilizan sprites originales P08 provisionales, con metadata y distinción visual; bat reutiliza M03. No hay assets nuevos ni aprobación final de enemigos. Core mantiene daños/escudos/monedas; presentación consume eventos.

Resultados aislados: semantropic_td_phaser_m07_normal_v1; victoria requiere17/140 resueltos, sin enemigos pendientes. Tres estrellas hasta5 fugas, dos hasta25 (umbral heredado provisional), una después. Storage bloqueado no impide jugar.

## QA y límites

[PASS] qa-m07-game01-core: fuente V5, stats, colas JSON, rutas, escudos, pausa, derrota, almacenamiento aislado/bloqueado y campaña completa por pasos dt.05 con presupuesto real. Resultado:94 bajas,46 fugas,8 vidas. Sin forzar oro/HP/daño/victoria. Un fixture separado de finalización usa daño artificial únicamente para comprobar guardas de resultados; no cuenta como evidencia de terminabilidad.

[PASS] regresión Node qa-m06-game01-core, qa-m05-game01-core, qa-m04-campaign, qa-m03-campaign, qa-c1d2-five-waves y npm run build en esta reanudación. No equivale a certificación global del juego.

[PENDIENTE] Chromium WebGL2 PC1280×768,844×390,932×430: ejecución tools/qa-m07-game01-browser.mjs y salida artifacts/m07-game01-resumed. La suite anterior dejó capturas parciales; no se declara PASS sin reporte completo. Cubre nueve pads/UI, rally/InfanteríaII, W1 real, campaña completa con presupuesto por pasos, checkpointW17, fixtureW17 con relojRAF, derrota y navegación M01–M06. Dibujo intermitente en GPU software, restablecido antes de capturas; no acredita FPS continuo ni hardware físico. Centrado FIT admite redondeo menor a2px CSS.

[NOT_RUN] teléfonos físicos, FPS/VRAM físicos, aprobación estética humana final. [BLOQUEANTE] API GitHub403 impide crear PR/consultar CI; no sustituir con push directo a producción. Render y versión pública nueva NO VERIFICADOS. No entregar URL antigua como versión nueva.

Rollback: revertir únicamente el futuro merge M07, preservando URL oficial y guardados. No borrar ramas ni revertir la documentación separada. Cierre pendiente: completar QA navegador/comparación de arte, PR/CI, promoción autorizada y verificación pública de bytes y navegador. No se avanza otro bloque.

## Reanudación de cierre — 27/10/2026

Core, alcance/arte congelado y build repetidos PASS desde 68f3d27; regresiones Node M01/M03/M04/M05/M06 repetidas PASS. No se repite una certificación global. M02 continúa pendiente de smoke navegador.

QA navegador ahora admite M07_GAME_PROFILE=desktop|touch844|touch932 y escribe un checkpoint por perfil completado. No atribuir PASS de un perfil a los otros. Comparación antes/después sin overlays HTML, conservando visible el stage; la primera regla de captura ocultaba el contenedor y produjo timeout, corregido en el harness. Se reutiliza una sola página para preview y partida, evitando dos mundos WebGL simultáneos. No se reducen assets ni verificaciones. Ejecución actual: M07_GAME_PROFILE=desktop M07_GAME_OUT=artifacts/m07-closure-single-page-desktop node /tmp/m07-game-browser-local.mjs (adaptación local solo del import Playwright y executablePath al Chromium instalado). Informe final pendiente; conservar fallos anteriores sin presentarlos como PASS.

Bloqueo GitHub confirmado: curl -I https://api.github.com devuelve CONNECT tunnel failed, HTTP403, server envoy. El proxy rechaza el túnel antes de la respuesta HTTPS de GitHub; no hay evidencia para atribuirlo a expiración de token, permisos del repositorio o rate limit. Git HTTPS nativo sí permite verificar ramas/push. PR y CI no creados/ejecutados por este bloqueo. No se modifica producción. Creación manual del PR: https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/compare/production%2Fsemantropic-td-live...feat%2Fm07-game01?expand=1 . Mantener DRAFT hasta QA completa; no fusionar por el solo hecho de existir el enlace.

### Evidencia parcial de esta ejecución

Desktop: comparación sin HUD preview/escena idéntica píxel a píxel (art-comparison.json, MAE RGB0); capturas selector, W1 ambos frentes, victoria de campaña completa por pasos, W17 por pasos y fixtureW17 relojRAF disponibles en artifacts/m07-closure-single-page-desktop. La suite todavía no produjo reporte final después de W17; NO se marca PASS de Chromium completo. Móvil844/932 de este cierre: NOT_RUN. API/CI/PR/Render bloqueados como se indica arriba. No existe entrega LIVE nueva.
