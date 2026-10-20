# EQUIPO P · SEMANTROPIC TD · P04/C1-D — NUEVA ENTREGA
**Estado:** [PROTOTIPO VISUAL EN REVISIÓN] · [NODE/BROWSER REAL NO EJECUTADO] · [PR DRAFT] · **SIN MERGE**.
**Rama:** `feature/art-p04-animation-pass`; **base SHA exacta:** `eccadc3743e9f2d6c584097dcd5d9b82ee921e90`.
**SHA visto antes de actualizar este índice:** `f1f1d38ee3d83f61e65ca5bd5a4826d2f816eada`.
**HEAD verdadero actualizado:** [PR #15/commits](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/15/commits). El commit de actualización de este índice mueve SHA, por tanto no se presenta el SHA anterior como HEAD definitivo.
**PR P04:** [#15 — feature/art-p04-animation-pass → feature/art-p03-q2-personajes](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/15)
**Versión artística en evaluación:** P04 (P03 histórico permanece preservado).

## Accesos oficiales de P04 para Dirección General
| Recurso | Enlace | Evidencia |
|---|---|---|
| **ACTA OFICIAL P04** | [ACTA_P04_C1D_2026-10-19.md](./ACTA_P04_C1D_2026-10-19.md) | Confirmado en GitHub |
| **QA JSON P04** | [QA_P04_C1D.json](./QA_P04_C1D.json) | 18 checks; V8 PASS, navegador NOT_RUN |
| **Matriz/RFC T05** | [MATRIZ_T05_P04.md](./MATRIZ_T05_P04.md) | Datos leídos de T05, integración PENDIENTE |
| **Inventario de capturas** | [EVIDENCIA P04](../evidencias/P04/EVIDENCIA.md) | NO HAY CAPTURAS P04 REALES |
| **Manifest 4 actores** | [P04_MANIFEST.json](../../../../public/official/art/actors/P04_MANIFEST.json) | Prototipo / PNG no exportado |
| Rig y key poses | [p04-poses.mjs](../../../../public/official/art/actors/p04-poses.mjs) | Fuente editable P04 |
| Dibujo anatómico original | [p04-illustrator.mjs](../../../../public/official/art/actors/p04-illustrator.mjs) | Fuente editable P04 |
| Vitrina 5 versiones | [p04-index.html](../../../../public/official/src/actors-visual/p04-index.html) | Código; WebGL2 P04 NO EJECUTADO |
| Controlador vitrina | [p04-gallery.mjs](../../../../public/official/src/actors-visual/p04-gallery.mjs) | Código visual |
| QA Node reproducible | [qa-p04.mjs](../../../../public/official/src/actors-visual/qa-p04.mjs) | Archivo versionado, Node NO EJECUTADO |
| QA Chromium reproducible | [qa-p04-browser.mjs](../../../../public/official/src/actors-visual/qa-p04-browser.mjs) | Archivo versionado, Chromium NO EJECUTADO |

## Avance verificable y compuerta
P04 introduce dibujo base propio (no overpaint P03), poses de marcha y ataque con 4 personajes, hound diagonal, 32 cuadros por personaje/7 estados, pivote 0.5/.92, 5 variantes para comparación y 24 clones ARTÍSTICOS. El rig y los metadatos pasaron comprobaciones V8 simuladas. Esto NO certifica la anatomía en píxeles ni que alcance pintura comercial.

**BLOQUEANTES:** ejecutar Node/build/Phaser WebGL2 P04; conservar capturas 1280×768, 844×390 y 932×430 en GitHub; producir/verificar 4 atlas PNG+SHA256; revisar apoyos/recortes y rostro/arma; montaje con `frontRail` T05; aprobación de Dirección. No hay ni se declaran estadísticas, daño, HP o IA oficiales en P04.

---
## ARCHIVO HISTÓRICO — P01 → P03 (contenido anterior conservado)

# SEMANTROPIC TD · Equipo P · ÍNDICE DE ACTAS / VERSIONES
**Última revisión documental:** 19-10-2026
**Versión artística más reciente:** P-03 / C1-B-Q2 — nuevo rig articulado de cuatro actores, **PROTOTIPO BAJO REVISIÓN**, NO ARTE FINAL.
**Rama:** `feature/art-p03-q2-personajes`
**Base SHA exacta:** `a15b78ffcb365b2d2f717ce3706c9d92f3d75bf3`
**SHA comprobado antes de registrar este INDEX:** `f413198004ccc715e43bda005cf3d647d2e3b430`.
**HEAD de referencia en vivo y definitivo:** [PR #10, pestaña Commits](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/10/commits). La escritura de este mismo índice avanza HEAD, por lo que un SHA estático dentro de INDEX no puede autorreferenciarse al último commit sin quedar obsoleto.
**PR de salida de P03:** [#10 DRAFT, hacia feature/art-p02-personajes](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/10)
**Referencia integradora READ ONLY:** [PR #8 C1-B](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/8)
**Política:** P sólo edita public/official/art/actors/**, public/official/src/actors-visual/** y docs/art/actors/**. NO MERGE unilateral.

## Acceso inmediato para Dirección
| Documento / recurso | Ruta permanente | Estado |
|---|---|---|
| Acta exhaustiva del último lote | [ACTA_P03_C1B_Q2_2026-10-19.md](./ACTA_P03_C1B_Q2_2026-10-19.md) | **PUBLICADA** |
| Registro QA reproducible | [QA_P03_C1B_Q2.json](./QA_P03_C1B_Q2.json) | **PUBLICADO** (browser NOT_RUN) |
| Matriz T04 y RFC de anclajes | [MATRIZ_T04_P03.md](./MATRIZ_T04_P03.md) | **PROPUESTA** T03→T04 |
| Manifest de 4 atlas | [P03_MANIFEST.json](../../../../public/official/art/actors/P03_MANIFEST.json) | **PUBLICADO, prototipo** |
| Fuente de dibujos y animaciones | [p03-rig.mjs](../../../../public/official/art/actors/p03-rig.mjs) | **PUBLICADA** |
| Fuente editable face sheet | [p03-face-sheet.mjs](../../../../public/official/art/actors/p03-face-sheet.mjs) | **PUBLICADA** |
| Entrada vitrina Phaser | [p03-index.html](../../../../public/official/src/actors-visual/p03-index.html) | **PUBLICADA, navegador NO EJECUTADO** |
| Controlador vitrina P03 | [p03-gallery.mjs](../../../../public/official/src/actors-visual/p03-gallery.mjs) | **PUBLICADO** |
| QA Node local | [qa-p03.mjs](../../../../public/official/src/actors-visual/qa-p03.mjs) | **PUBLICADO, comando Node NO EJECUTADO** |
| Capturas y estado de evidencia | [EVIDENCIA.md](../evidencias/P03/EVIDENCIA.md) | **SIN CAPTURAS REALES, ver NOT_RUN** |

Los links a public/official desde este archivo usan directorios relativos a `docs/art/actors/actas/` y están diseñados para abrirse en GitHub.

## Versiones anteriores del Equipo P
| Versión | Rama/PR | Referencias |
|---|---|---|
| P-01 | [PR #2](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/2) | [Informe P01](../P01_ENTREGA_Y_QA.md), [Manifest P01](../../../../public/official/art/actors/ASSET_MANIFEST_P01.json), [fuente P01](../../../../public/official/art/actors/atlas-source.mjs) |
| P-02 | [PR #7](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/7) | [Informe P02](../P02_ENTREGA_QA.md), [Biblia/RFC P02](../P02_BIBLIA_COORDINACION_TP.md), [Manifest P02](../../../../public/official/art/actors/P02_MANIFEST.json) |
| P-03/Q2 | [PR #10](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/10) | [Acta](./ACTA_P03_C1B_Q2_2026-10-19.md), [QA](./QA_P03_C1B_Q2.json), [Manifest](../../../../public/official/art/actors/P03_MANIFEST.json) |

## Estado de entregables y aceptación
| Entregable | Resultado técnico | Aceptación |
|---|---|---|
| P03 rig independiente 4 actores | Código fuente committeado | [CONFIRMADO EN ARCHIVOS] |
| 7 estados y 32 frames/actor, 128 en total | Prueba geometría sim V8 | [PROBADO EN V8 / NO IMAGEN] |
| Atlas 4 × 1408×832, anclajes .5/.92 | Metadata y registro sim | [PROBADO EN V8 / NO WEBGL] |
| Vitrina P01 / P02 A / P02 B / P03 | Código Phaser WebGL2 integrado sólo en vitrina aislada | [CONFIRMADO EN ARCHIVOS] |
| Face sheet de 4 personajes + escala 44/64/80 | Fuente Canvas bajo namespace P | [CONFIRMADO EN ARCHIVOS] |
| QA Node/build del repo | Scripts disponibles | [NO EJECUTADO] |
| Capturas Phaser/WebGL2 3 viewports | Evidencia faltante | [NO EJECUTADO] |
| PNG alfa real + hash versionado | No exportado | [NO EJECUTADO] |
| QA físico, FPS, memoria real | No ejecutado | [NO EJECUTADO] |
| Integración montaje T04 | Anchors previos T03 documentados | [REQUISITO SIN VALIDAR] |
| Premium pictórico definitivo | No certificado; evaluación visual pendiente | [BLOQUEANTE] |
| Combate/core | No modificado | [FUERA DE ALCANCE] |

## Bloqueantes en orden de cierre
1. Ejecutar build y QA Node en checkout P03, publicar logs verificables y actualizar QA.json.
2. Capturar mismo actor y frame en P02/P03 a **1280×768, 844×390, 932×430**; persistir WebP/PNG en evidencias/P03 y etiquetar [CAPTURA REAL PHASER].
3. Confirmar art direction de silueta/piel/materiales/expresividad; corregir poses que deslicen pie y recortes de hacha/rifle.
4. Verificar escala, anclaje al suelo/sombra, posición de operador y oclusión con T04 en escena M01 real.
5. Exportar PNG originales alpha cuando sean aprobados, hash SHA-256 real y manifest actualizado; la UI no suple versionado binario.
6. Solo Dirección autoriza PR → rama anterior, posterior integración C1-B y canon final de variantes.

**No modificar este índice fuera de la rama P03 sin autorización de Dirección.**