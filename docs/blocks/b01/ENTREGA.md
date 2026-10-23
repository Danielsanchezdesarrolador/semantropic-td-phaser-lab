# B01 · MAP-ART-01 · Praderas del Amanecer

[APROBADO POR DIRECCIÓN] alcance confirmado: rework del paisaje M01, estándar pictórico M03 e identidad de pradera propia. Base: `6dc99a8a53404a653de0a6f77ea59fbda091d78c`, rama `feature/b01-m01-pictoric-meadow`. Publicación y CI finales se trazan en el [PR #54](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/54); este documento registra QA local previo a integrar.

## Resultado y alcance

Terreno pintado con materialidad orgánica, horizonte de amanecer, valle y ciudad distante, árboles expresivos, arco ligero, santuario y ribera con dos cascadas estáticas. Dos fuentes originales de 1536×1024: terreno y atlas transparente de seis decoraciones; procedencia y SHA256 en `art-manifest.json`. No se usa la referencia enviada como asset ni se copia su trazado. El renderer compone el arte una vez en textura 2560×1536; el panorama utiliza el hook R5 existente. No se introduce animación ambiental ni trabajo por frame nuevo.

Se reutilizan el plan R7 y el dibujo exacto de sus pads. Props independientes con exclusión conservadora de la ruta y pads; cuatro grupos florales rechazados por el guard. La ruta visual conserva los 133 nodos. El adaptador R7 conserva sus claves de textura y API de selección. El paisaje R7 anterior permanece archivado e intacto.

No cambian escenas, CORE, torres, actores, VFX, HUD, saves, selector, campaña, oleadas, construcción, economía ni M02/M03. `protected-blobs.json` fija sus blobs contra la base para comprobarlo sin depender del historial completo de CI.

## Evidencia técnica

- [CONFIRMADO EN CÓDIGO] `node tools/qa-b01-map-art.mjs`: PASS; 133 nodos, 8 pads, 5 oleadas/63 enemigos, oro inicial 365; blobs protegidos y dibujo exacto de pads sin cambios.
- [CONFIRMADO EN CÓDIGO] `node docs/direccion-general/qa-r7-m01-visual.mjs` y `npm run build`: PASS.
- [PROBADO EN NAVEGADOR] `tools/qa-r7-m01-premium-browser.mjs`: PASS, Chromium real/WebGL2 en escritorio 1280×768, móvil emulado 844×390 y 932×430. Informe `qa-local.json`. Localmente se usa Playwright preinstalado y `/usr/bin/chromium`; CI instala Playwright 1.57.0/Chromium.
- 1217 muestras de camino sin decoraciones encima, ocho pads seleccionables mediante mouse/touch, compra real de Infantería en UI, prueba de disparos/spawns en combate de escritorio, pausa, selección y smoke M02/M03. Sin errores JS observados. No es una certificación de balance ni campaña completa.
- [NO EJECUTADO] Android/iPhone físicos, FPS/GPU reales. [PENDIENTE] aprobación artística humana.

## Comparación auténtica, mismo viewport

| Vista | Antes (base R7 HF3) | Después (B01 integrado localmente) |
|---|---|---|
| Escritorio 1280×768 | [antes](antes-desktop.png) | [después](despues-desktop.png) |
| Móvil 844×390, DPR2 | [antes](antes-movil.png) | [después](despues-movil.png) |

## CI, publicación y recuperación

El workflow `b01-map-art-qa.yml` ejecuta contrato, build, render PC/móvil, pads, combate y smoke M02/M03 en el PR. Tras PASS se integra por merge normal a `production/semantropic-td-live`; Render publica en la URL única. Verificación de bytes públicos y navegador LIVE se registra después en el PR: no se deduce de estas capturas locales ni se afirma un identificador interno de Render.

Rollback: revertir el merge B01 mediante PR normal sobre producción, build/QA aplicable y comprobar los bytes anteriores en la misma URL. No borrar ramas ni resetear historial. Revisar visualmente terreno/horizonte, lectura del camino y ocho pads, tamaños móvil y construcción/primeros enemigos. Próximo paso: valoración del Director; B02 no se inicia automáticamente.
