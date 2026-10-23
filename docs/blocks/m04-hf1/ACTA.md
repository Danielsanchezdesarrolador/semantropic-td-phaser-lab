# M04-HF1 · integración estructural

[APROBADO POR DIRECCIÓN] corrección estructural según TXT23/10/2026. Base producción `4f460f90f1ec3524ca55fb128417beabd0e0913a`, rama `feature/m04-hf1-structural-integration`. CI, merge y publicación final se trazan en el PR del bloque.

## Problema y solución

B04 dibujaba franjas de río/canales sobre un suelo plano y pegaba puentes/cascadas/pads como capas independientes. La QA geométrica anterior no garantizaba integración estética; Dirección rechazó ese efecto de collage. HF1 reemplaza el montaje activo por **una única pintura estructural original**, con topografía completa: islas elevadas, paredes de caliza y orillas erosionadas, agua continua, caídas nacidas de desniveles y puentes con arcos/contrafuertes apoyados en ambas riberas. No se agregan props para ocultar el defecto.

El camino ya forma parte de la geografía pintada, con accesos a los tableros y bordes desgastados. Las nueve plataformas pasan de fichas cilíndricas a claros de piedra/tierra enrasados en terrazas. Vegetación, ruinas, sombras, apoyos, río y cascadas comparten composición e iluminación. El cauce/orillas **visuales** se rediseñan; los datos históricos del río se conservan como referencia, sin inventar nueva navegación.

## Geometría y ajuste espacial explicado

No se mueven waypoints, sockets/IDs ni centros de puente en los datos. La primera pintura integrada desplazaba visualmente parte del sendero y algunas runas. Se registra al dibujar mediante anclas medidas:17 de ruta/cruces, nueve centros y12 de marco. Es una proyección privada del painter M04, calculada una vez al hornear la textura; no un motor, shader o sistema jugable nuevo. La fuente PNG permanece íntegra. Malla estática1820 triángulos, continua y sin pliegues (ratio mínimo de área>0.27); anclas canónicas exactas. Se protege el marco y se rellena con la misma pintura para evitar huecos subpíxel.

Este es el único ajuste espacial: **se alinea la ilustración al contrato, no el contrato a la ilustración**. No se recolocan unidades, zonas funcionales ni progreso. No se vuelven a pegar pads/puentes/agua por encima. No hay nueva lógica por frame.

## Alcance y archivos

- Nuevo `public/official/src/maps-visual/m04/hf1/integrated-river.mjs` y sus anclas `registration.mjs`.
- Un PNG fuente original en `public/official/art/maps/m04/hf1/`; procedencia/SHA256/dimensiones en `art-manifest.json`.
- La vista existente `m04/preview/preview.mjs` monta HF1 en la misma ruta de revisión.
- QA NodeHF1, actualización del browserQA/workflow M04, evidencia y estado artístico M04 del roadmap.

B04 y sus cuatro PNG anteriores permanecen archivados íntegros y con hashes protegidos. CORE, escenas jugables, JSON, Canvas, selector, HUD, M01/M02/M03, torres, enemigos, oleadas, economía, daño y saves permanecen intactos.262 nodos/nueve posiciones/dos centros canónicos preservados. M04 sigue sin gameplay; once oleadas/94 enemigos son datos previstos, no implementados aquí.

## QA real y comparación

PASS: `node tools/qa-m04-hf1-art.mjs`, `node tools/qa-b04-map-art.mjs`, `npm run build`, `node tools/qa-b04-art-browser.mjs`. Localmente Playwright preinstalado y Chromium del sistema; CI instala Chromium propio sin omitir assertions.

WebGL2 real en1280×768,844×390 y932×430.1690 muestras del centro del camino y margen±10 sin muestras de agua ni centros verdes detectados; comprobación de anclas, ausencia de pliegues/huecos negros y capturas reales. Este control de color es una comprobación de legibilidad, no una simulación de hitboxes de futuros enemigos. Superposición diagnóstica de la ruta y nueve centros inspeccionada visualmente. Smoke del juego M01 y ausencia de M04 en el selector. `qa.json` conserva resultados.

[Antes PC](antes-desktop.png) / [después PC](despues-desktop.png), mismo viewport1280×768; [antes móvil](antes-movil.png) / [después móvil](despues-movil.png),844×390. El antes es ahora la vista B04 publicada real, no el esquema canónico de la entrega inicial. [Diagnóstico de ruta/centros](diagnostico-ruta-centros.png), overlay exclusivo de QA, no visible en la vista normal.

## Publicación, pendientes y recuperación

Misma ruta artística: `/official/src/maps-visual/m04/preview/`. Publicación/bytes y navegador públicos se verifican contra el merge y se registran en el PR; no se atribuye SHA interno de Render. La URL jugable `/official/src/live/` conserva M01–M03. No presentar M04 como nivel jugable ni abrirlo en selector por este hotfix.

[PENDIENTE] aprobación visual de Dirección. [NOT_RUN] combate/jugabilidad M04 —no implementados—, dispositivos físicos Android/iPhone, FPS/GPU y balance. La certificación de footprints de tropas/enemigos corresponde al bloque de integración jugable futuro.

Revisar continuidad río/orillas/cascadas, apoyos de ambos puentes, paso piedra-tierra, plataformas enrasadas y lectura móvil. No iniciar otros bloques automáticamente. Rollback: revertir el merge HF1 por PR normal; el renderer B04 archivado se recupera con el cambio de importación. QA y verificación Render en la misma ruta, sin resetear ramas ni tocar progreso real.
