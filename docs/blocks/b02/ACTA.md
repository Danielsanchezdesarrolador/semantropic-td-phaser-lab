# B02 · MAP-ART-02 · Campos del Molino

[APROBADO POR DIRECCIÓN] alcance del TXT 23/10/2026: rework artístico e integración visual del paisaje M02, con camino y acabado superficial de pads; no gameplay. Base `cc7bc731761fb98aa051ce263d1cf314fa92b221`, rama `feature/b02-m02-pictoric-farmland`. CI, merge y verificación pública final se registran en el PR.

**Escenario:** dos fuentes originales 1536×1024, terreno agrícola y atlas transparente de seis recursos: molino, granja, roble, riego/estanque, cascada y provisiones. Trigo con volumen, piedra/caliza, lago y aldea distante, río inferior y una cascada de ribera; cercos cortos con guard geométrico. Referencia estética sin copiar su composición ni usar la captura como asset. Procedencia y hashes en `art-manifest.json`. Fuentes íntegras preservadas. La ruta real tiene forma de herradura distinta de la referencia.

**Camino:** ancho exterior R6 116 → nominal84, variación78–90 (aprox. −28%). Se reutiliza el enfoque de acabado MAP-PATH-01 en un módulo propio M02: grano, tierra cálida, márgenes orgánicos de pasto/piedra, sombra de contacto y suavizado exclusivamente de pintura. No se importan ni modifican módulos/assets M01. Se conserva la API y clave de textura del adaptador M02. El hook de panorama existente pinta terreno sin reflejar casas/pads y prolonga el mismo camino en márgenes no interactivos; sin editar viewport compartido.

**Pads:** dibujo R6 exacto conservado; solo contacto superficial de polvo/sombra/pasto. Ocho centros, IDs, radios e interacciones intactos. El horizonte se comprime arriba para apoyar el pad superior canónico sobre terreno visible. El fondo se compone una vez en 2560×1536, sin nueva animación/partículas por frame. La barrera de carga de fuentes se activa únicamente en la URL canónica M02 (`?map=2`), evitando descargas de este arte cuando M03 importa la fábrica de escena M02. Selector y escenas sin cambios.

**Fuera de alcance, sin cambios:** 163 waypoints, ocho sockets, siete oleadas/80 enemigos, oro395, vidas100, CORE, escenas, actores, torres, navegación, daño, economía, resultados, saves, HUD, selector, M01 y M03. Los blobs protegidos se fijan en `protected-blobs.json`; R6/farmland anteriores quedan archivados íntegros.

**Archivos:** nuevo painter `public/official/src/maps-visual/m02/b02/pictoric-farmland.mjs`, dos PNG en `public/official/art/maps/m02/b02/`, adaptador M02 `phaser-world.mjs`; QA `tools/qa-b02-map-art.mjs`, actualización del runner `tools/qa-r6-m02-premium-browser.mjs`, workflow proporcional B02. La QA R6 mantiene el resto de locks y actualiza únicamente el hash del adaptador artístico expresamente sustituido, comprobando además que monte B02.

**QA proporcional:** Node B02, contratos R6/R3C, build y Chromium/WebGL2 escritorio1280×768, móvil horizontal emulado844×390/932×430. Comparación de la ruta pintada con una versión sin props en múltiples muestras; ocho pads mouse/touch, compra UI, movimiento enemigo observado, disparos/spawns, pausa y smoke M01/M03. Comandos: `node tools/qa-b02-map-art.mjs`, `node docs/direccion-general/qa-r6-m02-visual.mjs`, `node docs/direccion-general/qa-r3c-m02-scene.mjs`, `npm run build`, `node tools/qa-r6-m02-premium-browser.mjs`. Local: Playwright preinstalado + Chromium del sistema, sin omitir assertions. Resultado final: PASS, `qa.json`.

**Antes/después auténticos:** [antes PC](antes-desktop.png) / [después PC](despues-desktop.png), mismo viewport1280×768; [antes móvil](antes-movil.png) / [después móvil](despues-movil.png), viewport844×390 (antes DPR1/después DPR2). No equiparar mockup con escena integrada ni QA local con publicación.

**Pendientes:** evaluación artística humana, balance humano, dispositivos físicos Android/iPhone y FPS/GPU reales [NOT_RUN]. La QA no certifica toda la campaña ni rendimiento físico. CI/Render/bytes públicos y navegador LIVE se registran en el PR tras verificarlos; no se atribuye un SHA interno de Render.

**Revisión del Director:** Mapa02, molino/granja/trigo/riego/ribera; camino proporcionado, ocho pads legibles en móvil, construcción y primera oleada. No avanzar a otro bloque automáticamente.

**Rollback:** revertir el merge por PR normal, QA proporcional y Render en la misma URL oficial. No resetear, borrar ni fusionar ramas históricas.
