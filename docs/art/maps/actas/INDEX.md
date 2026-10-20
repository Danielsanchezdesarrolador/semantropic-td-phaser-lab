# SEMANTROPIC TD — EQUIPO M · ÍNDICE OFICIAL DE ACTAS

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
