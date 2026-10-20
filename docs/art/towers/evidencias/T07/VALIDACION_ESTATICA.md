# T07 · Registro verificable de pruebas de fuente y simulación visual

Fecha de corte: 20 octubre 2026. Equipo T / rama `feature/art-t07-sniper-single-rifle`.

## [CONFIRMADO EN CÓDIGO]

- Base GitHub T06 SHA `6788b5931fc6161bbfbca6cb25a1c2a83a7e1eb3` efectivamente verificada antes de crear rama.

- Dos másters Sniper A, dos alternativas B, seis capas heredadas renovadas, dos estructuras adicionales sin rifle, dos capas dedicadas rifleMounted y dos snapshots T06: 16 fuentes SVG.

- Todas las 16 fuentes regresaron de GitHub; chequeo JS de apertura/cierre y vista `360×420`: PASS. Conteos por marcadores: master, B, legacy back y rifle layer tienen UNO; structureNoRifle CERO. No sustituye XML validator de Node.

- Catálogo de cuatro torres y `getSniperSingleRifleLayers()`: validación/metadata y source anchor projection: PASS V8.

- La ruta antigua `getTowerVisualLayers(meta,'A')` sigue dibujando rifle en back; la ruta T07 avanzada utiliza structureNoRifle+rifleMounted. NO combinarlas.

## [EJECUTADO EN JS V8 CON PHASER MOCK]

- Se evaluaron **catálogo y adaptador unidos** para resolver sus imports; el primer banco aislado que omitía import arrojó falso error y no se utilizó como QA del módulo.

- Proyección `originWorld`→`muzzleWorld` en evento crudo tipo PR #22: PASS, conserva origen original. Lookup de torre ausente devuelve null.

- `attack_fire` aceptado una vez, duplicado por `eventId` rechazado: PASS.

- `attack_fire` NO muestra impacto: PASS (contador cero). `hit_applied` con mismo `bulletId`/tower/target muestra un solo impacto, otro `hit_applied` idéntico rechazado: PASS.

- `entity_die` inmediatamente después de hit mantiene solo efecto confirmado; `despawn` cancela el resto: PASS.

- `tower_sold` cancela FX propios, `clear()` termina jobs/timers/tweens/graphics y `shutdown` desconecta listeners: PASS.

- Resultado MOCK final: 13 comprobaciones PASS, 0 errores, 13 objetos gráficos ficticios, 7 timers y 10 tweens creados.

## [NO EJECUTADO]

- `node docs/art/towers/qa-t07.mjs` y regresiones Node T01–T06 en checkout real; npm build/Phaser 4.2.1 real.

- Chromium WebGL2 1280×768 / 844×390 / 932×430, screenshots reales o GIF, FPS p50/p95, GPU memoria, iPhone/Android físico.

- Montaje real con asset P06 `sniper_operator_unarmed` y combate del PR #22, eventos finales core reales y 30 enemigos.

## [BLOQUEANTES]

- No certificar que P06 alinea ojo/brazo con stockGrip/muzzle hasta capturar montaje integrado.

- No afirmar arte premium final ni rendimiento verificado, ni afirmar captura real inexistente (`screenshotIndex=[]`).

- Dirección/Integrador debe validar las escalas visuales .318/.328 y el hit bridge real.

## Métricas estimadas, NO medición GPU

Cada SVG de 360×420 rasterizado RGBA sin mipmaps ≈604800 bytes por textura. Número real de texturas depende de preloads/dedupe del browser; no hay medición de VRAM ni FPS.

## [CONFIRMADO EN GITHUB COMPARE]
10 commits, 28 archivos (17 added / 11 modified) T06→T07, ninguna ruta ajena a `docs/art/towers`, `public/official/art/towers` y `public/official/src/towers-visual`; las ramas de Core/P/M y escenas compartidas permanecen sin cambios desde Equipo T. El commit adicional de este QA cambia exclusivamente dos archivos documentales T.
