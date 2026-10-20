# T05 — EVIDENCIA TÉCNICA PERSISTENTE, NO CAPTURAS DE PHASER

19-10-2026. [CONFIRMADO EN ARCHIVOS] 4 SVG A, 4 SVG B, 12 SVG de capas, 4 snapshots T04, 2 concept sheets; estructuras XML con pares de etiquetas balanceados en GitHub. Fuente 360×420 en 24 archivos técnicos, más 2 láminas 1600×770.

[PROBADO EN JS V8 CON PHASER MOCK] parser de catalog.mjs, fx.mjs, t05-gallery.mjs: PASS. qa-t05.mjs y qa-t04.mjs parseados con AsyncFunction: PASS de sintaxis, NO son scripts Node ejecutados.

[PROBADO EN JS V8 CON PHASER MOCK] validación TOWER_ART_V2, anclajes rotados x4, split layer paths, proyección foot/pad; FX invalid target rejected before seen.add, eventId duplicado rejected, cancelEvent cancela timers/tweens, clear destruye objetos, maxJobs<=24: PASS.

[NO EJECUTADO] `node docs/art/towers/qa-t01.mjs`, qa-t03, qa-t04, qa-t05 sobre repo local; `npm run build` sobre rama; navegador real Phaser 4.2.1/WebGL2; capturas 1280×768, 844×390, 932×430; iPhone/Android físico; FPS/memoria; M04/P04 juntos.

El CI GitHub de C1-C anterior, si existe, NO constituye aprobación ni prueba real de T05.

Dos concept sheets SVG dentro de `public/official/art/towers/concepts/`: `[CONCEPTO EDITABLE]` y NO `[CAPTURA REAL PHASER]`.

Screenshots T05 reales: NINGUNO. Aprobación artística: PENDING. Ningún cuadro de FPS inventado.

[CONFIRMADO EN GITHUB DIFF] 40 changed files, 9 commits at checkpoint, all paths T-owned, zero changes M/P/core/shared. This QA-only commit remains T-owned.
