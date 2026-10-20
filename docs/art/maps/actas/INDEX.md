# SEMANTROPIC TD — EQUIPO MAPAS / ÍNDICE HISTÓRICO

## NUEVO: M07-Q2 · PRIMERA PARTIDA REAL C1-D5 / OPTIMIZACIÓN SIN REDISEÑO · 20-10-2026

**Rama exclusiva:** [feature/art-m07-q2-performance-c1d5](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/tree/feature/art-m07-q2-performance-c1d5).  
**Base exacta:** `feature/art-m07-continuidad-c1c @ 2c08eaa13dac309f85f4e76b736db6f66545aac9` ([PR #31 MAPAS M07](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/31)).  
**PR nuevo:** consultar [pull requests del repositorio](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pulls) y su futura acta; DRAFT, NO MERGE.  
**Visual lock C1-C:** PNG del propietario 1280×768 SHA256 `24103e45a0e1249fa4b89d4e65ea16d9e147bdf1e2462e5c4063469a931842ef`; default M03 paleta Viva y modo Fiel inalterados.  
**Referencia funcional:** C1-D4R [PR #30](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/30), nuevo C1-D5 a cargo exclusivo de Dirección General.

| Archivo / evidencia | Acceso | Estado |
|---|---|---|
| Acta oficial M07-Q2 | [ACTA_MAPAS_M07_Q2_PERF_C1D5_2026-10-20.md](ACTA_MAPAS_M07_Q2_PERF_C1D5_2026-10-20.md) | [CONFIRMADO EN GITHUB] |
| QA estructurado | [QA_MAPAS_M07_Q2.json](QA_MAPAS_M07_Q2.json) | V8 fuente simulada PASS; Node/Chrome NOT_RUN |
| Datos antes/después | [PERF_BASELINE_M07_Q2.json](PERF_BASELINE_M07_Q2.json) | 50 ciclos: 575→36 creates en mocks; FPS reales NOT_RUN |
| RFC para Integrador | [RFC_MAPAS_M07_Q2_C1D5_LIFECYCLE.md](RFC_MAPAS_M07_Q2_C1D5_LIFECYCLE.md) | PROPUESTA, DG debe ratificar |
| Renderer M07-Q2 | [renderer-v7.mjs](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m07-q2-performance-c1d5/public/official/src/maps-visual/m01/m07/renderer-v7.mjs) | IDENTIDAD M03 INALTERADA |
| QA Node Q2 | [qa-m07-q2.mjs](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m07-q2-performance-c1d5/public/official/src/maps-visual/m01/m07/qa-m07-q2.mjs) | Archivo listo, ejecución nativa NOT_RUN |
| QA Node legado adaptado | [qa-m07.mjs](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m07-q2-performance-c1d5/public/official/src/maps-visual/m01/m07/qa-m07.mjs) | Assertions actualizadas a retención M03 Q2, ejecución nativa NOT_RUN |
| Captura Chromium con frame timing | [capture-m07-q2.mjs](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m07-q2-performance-c1d5/public/official/src/maps-visual/m01/m07/capture-m07-q2.mjs) | Script preparado, Chromium NOT_RUN |
| Evidencias PNG nuevas | `docs/art/maps/evidencias/M07-Q2/**` | No generadas, SHA256 nuevas 0 |
| Asset manifest M07+Q2 | [manifest.json](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m07-q2-performance-c1d5/public/official/art/maps/m01/m07/manifest.json) | 7 fuentes reutilizadas, 0 assets nuevos |

**[PROBADO EN V8 CON MOCKS]** 50 montajes/desmontajes; 575 → 36 llamadas a `addCanvas` y 575 → 25 `textures.remove` frente a M07 original; 11 claves Canvas M03 cacheadas de forma estable, 9 SVG originales retenidos, Pulido opcional libera su textura, selección no vacía un pad ocupado, venta tick22 no revive por tick21, escena M03 directa con `disposeTextures:false` no pierde recursos al cerrar M07.

**[RIESGO EXPLÍCITO]** El M03 directo con `disposeTextures:true` todavía puede eliminar texturas comunes cuando cierra: resolver ownership en Dirección General, sin tocar fuente M03.

**[NO EJECUTADO]** Node nativo, build, Chromium WebGL2 real 1280×768 / 844×390 / 932×430, p50/p95 del navegador, hardware móvil, partida C1-D5 de cinco oleadas y 63 apariciones oficiales, capturas integradas C1-C vs M07-Q2. La prueba de 63 MARCADORES sintéticos no es combate.

**Rollback:** cerrar PR M07-Q2 sin fusionar; Canvas V5, M07 aprobado, C1-D4R, escenas comunes, Torres, Personajes, Render y campaña quedan intactos.

---

## Archivo histórico M01–M07

## M-07 · RESTAURACIÓN VISUAL C1-C / M03 VIVA · 20-10-2026

**PR borrador:** [#31 MAPAS/M07](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/31), destino `feature/art-m06-combat-painterly`, **NO MERGE**.  
**Rama exclusiva:** [feature/art-m07-continuidad-c1c](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/tree/feature/art-m07-continuidad-c1c).  
**SHA base congelado:** `fa7f5f90a059b3292a20a7b3834ac43c81176ac7` (M06).  
**HEAD verificable:** [PR #31 → Commits](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/31/commits); cada cambio de índice añade un commit, no escribir HEAD propio inventado.  
**PNG C1-C original verificado SHA256:** `24103e45a0e1249fa4b89d4e65ea16d9e147bdf1e2462e5c4063469a931842ef` (1280×768; archivo del Director, no sustituido).  
**Baseline visual:** M03/C1C [PR #12](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/12).  
**Baseline funcional:** C1-D4 [PR #28](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/28) **sólo referencia, sin cambios**.

| Entregable M07 | Acceso | Estado real |
|---|---|---|
| Acta de continuidad con comparativa | [ACTA_MAPAS_M07_CONTINUIDAD_C1C_2026-10-20.md](ACTA_MAPAS_M07_CONTINUIDAD_C1C_2026-10-20.md) | CONFIRMADO EN GITHUB |
| QA estructurado | [QA_M07.json](QA_M07.json) | V8 PASS / NODE & CHROMIUM NOT_RUN |
| Inventario objeto por objeto | [INVENTARIO_M07_CONTINUIDAD_C1C.json](INVENTARIO_M07_CONTINUIDAD_C1C.json) | 13 props, posiciones M03 |
| RFC Integrador C1-D4 | [RFC_MAPAS_M07_C1D4_INTEGRACION_FIEL.md](RFC_MAPAS_M07_C1D4_INTEGRACION_FIEL.md) | PROPUESTA, NO APLICADO |
| Renderer conservador | [renderer-v7.mjs](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m07-continuidad-c1c/public/official/src/maps-visual/m01/m07/renderer-v7.mjs) | M03 Viva original por defecto |
| Manifest de fuentes históricas | [manifest.json](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m07-continuidad-c1c/public/official/art/maps/m01/m07/manifest.json) | 7 SHA blobs únicos M02/M03 |
| Vitrina standalone de M07 | [index.html](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m07-continuidad-c1c/public/official/art/maps/m01/m07/index.html) | FUENTE, SIN RENDER PHASER PROBADO |
| Galería triple verificadora PNG | [gallery.html](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m07-continuidad-c1c/public/official/art/maps/m01/m07/gallery.html) | Acepta sólo el PNG sha256 correcto, comparación map-only |
| QA Node | [qa-m07.mjs](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m07-continuidad-c1c/public/official/src/maps-visual/m01/m07/qa-m07.mjs) | NOT_RUN EN NODE NATIVO |
| Capturador Chromium | [capture-m07.mjs](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m07-continuidad-c1c/public/official/src/maps-visual/m01/m07/capture-m07.mjs) | NOT_RUN EN CHROMIUM |
| Capturas M07 reales | `docs/art/maps/evidencias/M07` (directorio se genera sólo al ejecutar capturador) | NO EXISTEN TODAVÍA |

**[CONFIRMADO EN FUENTE]** M07 Fiel crea M03 Viva original con 13 props, 7 oaks lobulados, camino arena S de 133 vértices, 8 pads y siete recursos únicos propios reutilizados (9 SVG precargados incluyendo recursos no instanciados). Las capas M04/M05/M06 quedan **desactivadas visualmente** por no usarse en ese montaje.

**[PROBADO EN V8+PHASER/CANVAS MOCKS]** 53 objetos Fiel, 54 Pulido opcional; selección de pad ocupado preservada, secuencia snapshot/evento/duplicado, caches con dos vistas, destroy doble idempotente.

**[NOT_RUN]** QA Node nativo y build; Chromium 1280×768/844×390/932×430; original/after con idénticos T/P/HUD, integración C1-D4, iOS/Android físicos y aprobación de Dirección. La foto C1-C verificada **no es** captura nueva de M07.

**Rollback:** cerrar PR #31. M03/M04/M05/M06, core C1-D4, otros equipos, main, producción y Render siguen protegidos.

---

## Archivo histórico anterior: M01 a M06

## Lote M06 / 20-10-2026 · Sexta revisión pictórica de Mapa 01

**Rama:** [feature/art-m06-combat-painterly](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/tree/feature/art-m06-combat-painterly)  
**Base congelada:** `feature/art-m05-combat-readiness @ aa902e3bba5ada7e19d0a6de75650c076c23f3f6`  
**HEAD real:** consultar [commits de PR #25](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/25/commits); el índice es en sí un commit nuevo, por lo que no se inventa SHA autorreferencial.  
**PR DRAFT:** [#25 M06/C1-D2](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/25), destino `feature/art-m05-combat-readiness`, **NO MERGE**.

| Documento/fuente | Acceso | Estado |
|---|---|---|
| Acta M06 | [ACTA_M06_2026-10-20.md](ACTA_M06_2026-10-20.md) | PRESENCIA CONFIRMADA |
| QA estructurado M06 | [QA_M06.json](QA_M06.json) | Mock PASS, Node/Chromium NOT_RUN |
| RFC Integrador/PR22 | [RFC_M06_C1D2_COHESION_COMBATE.md](RFC_M06_C1D2_COHESION_COMBATE.md) | PROPUESTA, NO CONTRATO EN CORE |
| Manifest de arte M06 | [manifest.json](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m06-combat-painterly/public/official/art/maps/m01/m06/manifest.json) | 6 SVG nuevos y textura procedural versionada |
| SVG 3/4 propios | [M06/svg/](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/tree/feature/art-m06-combat-painterly/public/official/art/maps/m01/m06/svg) | 6 fuentes editables |
| Renderer A/B | [renderer-v6.mjs](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m06-combat-painterly/public/official/src/maps-visual/m01/m06/renderer-v6.mjs) | IMPLEMENTADO y PROBADO EN V8 MOCK |
| Vitrina real Phaser | [index.html](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m06-combat-painterly/public/official/art/maps/m01/m06/index.html) | FUENTE DISPONIBLE, navegador NOT_RUN |
| Galería misma cámara | [gallery.html](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m06-combat-painterly/public/official/art/maps/m01/m06/gallery.html) | COMPARADOR DISPONIBLE |
| QA Node ESM | [qa-m06.mjs](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m06-combat-painterly/public/official/src/maps-visual/m01/m06/qa-m06.mjs) | LISTO, NOT_RUN |
| Capturador Chromium | [capture-m06.mjs](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m06-combat-painterly/public/official/src/maps-visual/m01/m06/capture-m06.mjs) | LISTO, NOT_RUN |
| Capturas auténticas M06 | `docs/art/maps/evidencias/M06/` | SIN CAPTURAS GENERADAS |
| Core independiente | [PR #22 C1-D2 Sniper real](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/22) | NO ES PR M06, NO MODIFICADO |

**[CONFIRMADO EN CÓDIGO]** A = pincelada atmosférica con curvas/volúmenes suaves; B = relieve por facetas/estratos. Ambos comparten ruta M01 133, ocho pads, ancho 110, selección visual 54 y heredan los 18 microambientes M05.

**[PROBADO EN V8 + MOCKS]** Seis montajes, 122 GameObjects por tratamiento/paleta, 48 SVG precargados, 6 nuevos, 1600×960 Canvas bake, snapshot read-only y resource lease entre dos vistas; 0 errores después de dos correcciones locales.

**[NO EJECUTADO]** Node en checkout real, `npm run build`, capturas Phaser WebGL2 escritorio/móvil, ejecución iPhone/Android física, FPS/GPU, integración 4 T06/13 P05 y HP/tracers de combate real. M06 NO es un juego jugable nuevo.

**[BLOQUEANTE]** Revisar conflicto core PR22 `originWorld` vs T06 `muzzleWorld` en RFC; montaje real M/T/P y evaluación de riqueza pictórica antes de elevar a staging.

**OWNERSHIP/ROLLBACK:** sólo `public/official/art/maps/m01/m06/**`, `public/official/src/maps-visual/m01/m06/**` y `docs/art/maps/actas/**`. Cerrar PR #25 sin fusionar revierte por completo el lote. Datos/Canvas/core/Render permanecen protegidos.

---

## Registro anterior: M01 a M05

## Etapa actual: M-05 / C1-D2 — Mapas listos visualmente para revisión de combate
**Fecha:** 19-10-2026. **Rama:** [feature/art-m05-combat-readiness](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/tree/feature/art-m05-combat-readiness).  
**Base exacta:** `429c26a82b645b8dc32728fcba44d0f32d130184` (M04).  
**HEAD validado al crear esta sección:** `958ab70831b51a613615e8f3a5dc5c71ef0b6dd1`; el commit del índice produce un HEAD posterior. **El HEAD vigente con SHA inmutable se consulta en [PR #20 / commits](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/20/commits)**.  
**PR oficial:** [#20 — M05/C1-D2 DRAFT](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/20), contra `feature/art-m04-illustrated-terrain`, **NO MERGE**.

| Documento/arte | Enlace | Estado verificable |
|---|---|---|
| ACTA M05 | [ACTA_M05_2026-10-19.md](ACTA_M05_2026-10-19.md) | PRESENTE |
| QA M05 JSON | [QA_M05.json](QA_M05.json) | 14 checks; PASS mocks, Node/browser NOT_RUN |
| RFC de adaptador socket | [RFC_M05_PAD_STATE_AND_OCCLUSION_C1D2.md](RFC_M05_PAD_STATE_AND_OCCLUSION_C1D2.md) | PROPUESTA para Integrador |
| Manifest 18 fuentes | [manifest.json](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m05-combat-readiness/public/official/art/maps/m01/m05/manifest.json) | PRESENTE · estado prototype |
| Hoja 18 SVG | [M05_PLANCHA_18_MICROAMBIENTES.html](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m05-combat-readiness/public/official/art/maps/m01/m05/M05_PLANCHA_18_MICROAMBIENTES.html) | 6 zonas × 3 variantes editables |
| Renderer M05 | [renderer-v5.mjs](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m05-combat-readiness/public/official/src/maps-visual/m01/m05/renderer-v5.mjs) | NUEVO / ESTRUCTURAL PROBADO |
| Vitrina Phaser | [index.html](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m05-combat-readiness/public/official/art/maps/m01/m05/index.html) | ENTREGADA / NO EJECUTADA REAL |
| Comparador A/B | [gallery.html](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m05-combat-readiness/public/official/art/maps/m01/m05/gallery.html) | MISMO ENCUADRE / SIN CAPTURAS |
| QA Node ESM | [qa-m05.mjs](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m05-combat-readiness/public/official/src/maps-visual/m01/m05/qa-m05.mjs) | NOT_RUN EN NODE |
| Capturador real Chromium | [capture-m05.mjs](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m05-combat-readiness/public/official/src/maps-visual/m01/m05/capture-m05.mjs) | NOT_RUN EN CHROME |
| Fotos M05 | `docs/art/maps/evidencias/M05/` | NO GENERADAS |
| Revisión integrada previa | [PR #17 C1-E](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/17) | M04+T05+P04, NO M05 |

**Estado QA:** [PROBADO EN SIMULACIÓN V8] 3 paletas × 2 tratamientos, 18 clústeres adicionales, 8 pads, 109 objetos, 0 referencias faltantes, snapshots y eventos visuales sin gameplay, texturas limpiadas. [NO EJECUTADO] Chromium Phaser/WebGL2 M05 1280×768 / 844×390 / 932×430, Node nativo, CI, 4 torres/13 actores T05/P04 y móvil físico. [BLOQUEANTE] Dirección General debe elegir tratamiento A/B con pruebas reales, ratificar entrada de eventos y verificar oclusión.

**Datos V5 protegidos:** mapa M01 133 puntos, 8 sockets, 110 ancho gráfico, selección visual 54; no hay nuevos caminos, precios, oleadas, daño ni guardados.  
**Regla de ownership:** sólo `public/official/art/maps/m01/m05/**`, `public/official/src/maps-visual/m01/m05/**`, `docs/art/maps/actas/**`.  
**Rollback:** cerrar PR #20 sin merge; no tocar M04/C1-E/C1-D2/Canvas V5.

---

## Archivo histórico: M-01 a M-04

**Etapa artística vigente: M-04 C1-D (M01 Praderas del Amanecer).**  
**Rama vigente:** [feature/art-m04-illustrated-terrain](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/tree/feature/art-m04-illustrated-terrain).  
**BASE EXACTA M03:** `dd7274369996b592de9a827e3c7d399e086bca65`.  
**HEAD actual:** verificar SHA completo en [PR #16 / commits](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/16/commits). El índice mismo es un commit, por lo que no se inventa un SHA autorreferencial.  
**PR activo:** [#16 M04 DRAFT](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/16), hacia `feature/art-m03-q2-mapas`, SIN MERGE.

| Entregable M04 | Enlace directo | Estado |
|---|---|---|
| Acta M04 | [ACTA_M04_C1D_2026-10-19.md](ACTA_M04_C1D_2026-10-19.md) | CONFIRMADO EN ARCHIVOS |
| QA.json persistente | [QA_M04_C1D.json](QA_M04_C1D.json) | PASS mocks / NO Node ni navegador |
| Manifest de 15 SVG | [manifest.json](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m04-illustrated-terrain/public/official/art/maps/m01/m04/manifest.json) | VERSIONADO |
| Plancha 12 recursos | [M04_PLANCHA_12_PROPS.svg](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m04-illustrated-terrain/public/official/art/maps/m01/m04/M04_PLANCHA_12_PROPS.svg) | 4×3 editable |
| Renderer M04 | [renderer-v4.mjs](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m04-illustrated-terrain/public/official/src/maps-visual/m01/m04/renderer-v4.mjs) | IMPLEMENTADO |
| Vitrina Phaser | [M04 index.html](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m04-illustrated-terrain/public/official/art/maps/m01/m04/index.html) | SIN SERVIR EN BROWSER |
| Galería M03 vs M04 | [gallery.html](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m04-illustrated-terrain/public/official/art/maps/m01/m04/gallery.html) | COMPARADOR ENTREGADO |
| QA Node | [qa-m04.mjs](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m04-illustrated-terrain/public/official/src/maps-visual/m01/m04/qa-m04.mjs) | NOT_RUN (disponible) |
| Capturador Playwright | [capture-m04.mjs](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m04-illustrated-terrain/public/official/src/maps-visual/m01/m04/capture-m04.mjs) | NOT_RUN (disponible) |
| Capturas M04 | `docs/art/maps/evidencias/M04/` | SIN FOTOS, NO EJECUTADO |
| Referencia integrada anterior | [C1-C/Q2 PR #12](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/12) | M03/T04/P03, NO M04 |

### Semáforo de QA
**[PROBADO EN SIMULACIÓN]** 3 paletas; 8 pads, 133 vértices, 20 props nuevos + 3 hitos; carga de 24 SVG compartidos, sin claves perdidas, 11 texturas generadas y limpieza idempotente por paleta.  
**[NO EJECUTADO]** build Node nativo y Chromium Phaser M04 real 1280×768, 844×390, 932×430; móvil físico, medición FPS/memoria.  
**[BLOQUEANTE]** foto conjunta con T04/T05 y P03/P04, política de oclusión, revisión de franjas FIT y aprobación pictórica del director.  
**[PROTEGIDO]** ningún cambio M03, datos V5 ni archivos compartidos. PR #16 aislado.  
**ROLLBACK:** cerrar PR #16 sin fusionar.

---

## Archivo histórico anterior (M-01 → M-03)

**Dirección General / consulta automática en GitHub · 19-10-2026**  
**Línea vigente candidata:** M-03 Q2 «Praderas del Amanecer / Aurora v3».  
**Rama:** [`feature/art-m03-q2-mapas`](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/tree/feature/art-m03-q2-mapas).  
**Base exacta ratificada:** `feature/art-m02-mapas @ a2cde5a52ec05d2a0136426cf8121c69c85af45b`.  
**HEAD comprobado antes del commit de este índice:** `39af8f814a1b5215a8d976b1ca3b3b557054e6e0`. Como añadir `INDEX.md` crea un commit posterior, **el HEAD definitivo se consulta en el [PR #11](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/11/commits)**; no atribuir falsamente un SHA definitivo a un archivo autorreferencial.  
**PR abierto:** [#11 M03/Q2 (DRAFT)](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/11), destino `feature/art-m02-mapas` · **sin merge**.

## Entregables M03 y enlaces
| Recurso | Enlace directo | Estado |
|---|---|---|
| Acta obligatoria | [ACTA_M03_C1B_Q2_2026-10-19.md](ACTA_M03_C1B_Q2_2026-10-19.md) | PRESENTE |
| QA JSON obligatorio | [QA_M03_C1B_Q2.json](QA_M03_C1B_Q2.json) | PRESENTE · mocks PASS; Node/browser NOT_RUN |
| Manifiesto M03 | [manifest.json](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m03-q2-mapas/public/official/art/maps/m01/m03/manifest.json) | PRESENTE · no arte final |
| Renderizador M03 | [renderer-v3.mjs](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m03-q2-mapas/public/official/src/maps-visual/m01/m03/renderer-v3.mjs) | PRESENTE |
| Vitrina comparativa | [m03/index.html](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m03-q2-mapas/public/official/art/maps/m01/m03/index.html) | PRESENTE (sin publicación) |
| QA Node reusable | [qa-m03.mjs](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m03-q2-mapas/public/official/src/maps-visual/m01/m03/qa-m03.mjs) | ENTREGADO · NOT_RUN |
| Capturador Playwright | [capture-m03.mjs](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m03-q2-mapas/public/official/src/maps-visual/m01/m03/capture-m03.mjs) | ENTREGADO · NOT_RUN |
| Fuentes SVG M03 | [SVG originales](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/tree/feature/art-m03-q2-mapas/public/official/art/maps/m01/m03/svg) | 2 editables |
| Evidencias fotográficas M03 | `docs/art/maps/evidencias/M03/` | NO EJECUTADO · no PNG inventados |
| Captura y QA C1B previo | [GitHub Actions #39342295194](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39342295194) | SUCCESS previo, NO certifica M03 |

## Registro histórico de lotes del Equipo M
| Versión | Rama / PR | Documento | Estado |
|---|---|---|---|
| M-01 · Aurora v1 | `feature/phaser-mapas` / [PR #3](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/3) | [M01_AURORA_ENTREGA_Y_QA.md](../M01_AURORA_ENTREGA_Y_QA.md) | Baseline, sin alteración |
| M-02 · Aurora v2 | `feature/art-m02-mapas` / [PR #6](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/6) | [M02_AURORA_V2_ENTREGA_QA_Y_INTEGRACION.md](../M02_AURORA_V2_ENTREGA_QA_Y_INTEGRACION.md) | Baseline del lote Q2, intacto |
| M-03 · Art Q2 | `feature/art-m03-q2-mapas` / [PR #11](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/11) | [Acta M03](ACTA_M03_C1B_Q2_2026-10-19.md) | IMPLEMENTADO AISLADAMENTE; aprobación artística pendiente |
| Integración previa C1-B | `integration/c1b-art-review` / [PR #8](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/8) | Evidencia Actions previa | SOLO LECTURA, no incluye M03 |

## Datos canónicos protegidos
M01 = mundo **1280×768**, **133** waypoints, entrada (−32,342), salida (1312,400), **8** sockets y camino visual **110**. Hit radius provisional **54**, sin modificación de reglas. M03 no porta economía, daño, guardados ni oleadas.

## Estado de QA y bloqueantes
- **[CONFIRMADO EN ARCHIVOS]** V3 reduce base de 269,12 a 110,24 unidades visuales aprox., conserva 4 estados (empty/occupied/selected/ruins).
- **[PROBADO EN SIMULACIÓN V8]** 3 paletas; 8 pads; 13 ilustraciones; 53 objetos; texturas generadas/destruidas. No prueba WebGL2 real.
- **[OBSERVADO EN CAPTURA VERIFICADA — C1B anterior]** Revisado el archivo real `desktop-B.png` (1280×768) y `mobile-landscape-B.png` (932×430) del artifact [#39342295194](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39342295194). Plataformas M02 excesivas frente a torres T03. **No son capturas M03.**
- **[NO EJECUTADO]** Node nativo, CI build M03, WebGL2 real, fotografías 1280×768/844×390/932×430, emulación y smartphone físico.
- **[BLOQUEANTE]** Ratio plataforma/torre T03 real, oclusión con P02, veredicto artístico y autorización del Integrador para integrar/renderizar.
- **[PENDIENTE]** Publicar miniaturas/testigos **solo después de ejecutar captura genuina**, actualizar QA.json y Acta con resultados verificables.

## Control de responsabilidades
No editar `public/official/src/c1b-art-review/**`, `c1-visual/**`, `m01-model.mjs`, `maps.v5.json`, `campaign140.v5.json`, torres/personajes, HUD/core, producción o Canvas V5.  
No realizar merge a M02 ni integración central sin orden expresa de Dirección General.

**Comunicación al Director:** basta remitir PR #11 y este INDEX; toda la memoria M03 está persistida en GitHub.
