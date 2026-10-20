# PERSONAJES P08 — INFANTERÍA EVOLUTIVA Y COMBATE LEGIBLE · 20-10-2026
**Rama:** `feature/art-p08-infantry-evolution-combat` · **Base:** `5eef18c3c86c683d9cb38f89d708eb3d9e7c168e` (P07-HF1).
**Estado:** 4 atlas y 4 asset sheets PNG REALES; 1 recluta visual nivel I, 2 veteranos visuales nivel II, orco/hound P03; NO INTEGRADO, NO MERGE, NO LIVE. Node22 y Chromium reales siguen NOT_RUN.

| Documento / recurso oficial P08 | Acceso |
|---|---|
| **Acta completa P08** | [ACTA_P08_PERSONAJES_2026-10-20.md](./ACTA_P08_PERSONAJES_2026-10-20.md) |
| **QA P08, con pendientes reales** | [QA_P08_PERSONAJES.json](./QA_P08_PERSONAJES.json) |
| **RFC Dirección / Integrador** | [RFC_P08_INTEGRACION_C1D6_C1D7.md](./RFC_P08_INTEGRACION_C1D6_C1D7.md) |
| **Manifest y SHA256 de 4 nuevos PNG** | [P08_MANIFEST.json](../../../../public/official/art/actors/P08_MANIFEST.json) |
| **Recluta nivel I PNG** | [infantry_recruit.png](../../../../public/official/art/actors/p08/png/infantry_recruit.png) |
| **Veterano nivel II PNG** | [infantry_veteran.png](../../../../public/official/art/actors/p08/png/infantry_veteran.png) |
| **Orco P03 con combate** | [warrior.png](../../../../public/official/art/actors/p08/png/warrior.png) |
| **Hound P03 con combate** | [hound.png](../../../../public/official/art/actors/p08/png/hound.png) |
| **Sheet Recluta I** | [INFANTRY_I_SHEET.png](../../../../public/official/art/actors/p08/sheets/INFANTRY_I_SHEET.png) |
| **Sheet 2 Veteranos II** | [INFANTRY_II_TWO_VETERANS_SHEET.png](../../../../public/official/art/actors/p08/sheets/INFANTRY_II_TWO_VETERANS_SHEET.png) |
| **Sheet Orco neutral/ataque** | [WARRIOR_P03_NEUTRAL_ATTACK.png](../../../../public/official/art/actors/p08/sheets/WARRIOR_P03_NEUTRAL_ATTACK.png) |
| **Sheet Hound neutral/ataque** | [HOUND_P03_NEUTRAL_ATTACK.png](../../../../public/official/art/actors/p08/sheets/HOUND_P03_NEUTRAL_ATTACK.png) |
| **Galería Phaser visual** | [p08/index.html](../../../../public/official/src/actors-visual/p08/index.html) |
| **Loader / controlador de eventos reales** | [p08-loader.mjs](../../../../public/official/src/actors-visual/p08/p08-loader.mjs) / [p08-controller.mjs](../../../../public/official/src/actors-visual/p08/p08-controller.mjs) |
| **QA Node22 estricto** | [qa-p08.mjs](../../../../public/official/src/actors-visual/p08/qa-p08.mjs) |
| **QA Chromium 3 viewports** | [qa-p08-browser.mjs](../../../../public/official/src/actors-visual/p08/qa-p08-browser.mjs) (NOT_RUN) |

**Protecciones:** core INFANTRY_LVLS, Mapas, Torres, C1-D6/C1-D7 y producción LIVE intactos. El operador sniper queda P03 aprobado. Los sprites P08 no instancian unidades ni aplican daño.
**Aceptación bloqueada:** Node22 exit 0 sobre 8 PNG, Chromium WebGL2 capturas reales, imagen Android a escala jugable y aprobación Dirección.

---

## HISTÓRICO CONSERVADO — P01 a P07

# PERSONAJES P07-HF1 · CORRECCIÓN DE REPRODUCIBILIDAD (20-10-2026)
**PR:** [#32 DRAFT](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/32) · **Rama:** \`feature/art-p07-continuidad-c1c\` · NO MERGE/DEPLOY.
**Problema:** [Actions 39455632045](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39455632045) **FAIL_NODE22**: regeneración del atlas no idéntica byte a byte.
**Estado HF1:** 4 PNG regenerados preservando rig P03, 128 frames no vacíos, 0 bordes, 20/20 frames muestreados estables ante perturbación numérica en V8. **Node22 CI HF1 / Chromium / integración T08: NOT_RUN; aprobación artística: PENDING.**

| Recurso HF1 de PERSONAJES | Enlace |
|---|---|
| **Acta correctiva principal** | [ACTA_P07_HF1_PERSONAJES_2026-10-20.md](./ACTA_P07_HF1_PERSONAJES_2026-10-20.md) |
| **QA actualizado y evidencias históricas** | [QA_P07_PERSONAJES.json](./QA_P07_PERSONAJES.json) |
| **Manifest definitivo 4 PNG / SHA256 PNG + RGBA** | [P07_MANIFEST.json](../../../../public/official/art/actors/P07_MANIFEST.json) |
| **Script de diagnóstico por frame y píxel, CRC y gamma** | [p07-hf1-png-diagnostics.mjs](../../../../public/official/src/actors-visual/p07-hf1-png-diagnostics.mjs) |
| **Node 22 forense 4 PNG, sale distinto de cero si falla** | [qa-p07-hf1-forensic.mjs](../../../../public/official/src/actors-visual/qa-p07-hf1-forensic.mjs) |
| **QA original CON aserción estricta, ampliado** | [qa-p07.mjs](../../../../public/official/src/actors-visual/qa-p07.mjs) |
| **Evidencia PNG HF1, CI original y browsers pendientes** | [EVIDENCIA P07](../evidencias/P07/EVIDENCIA.md) |

**PRECEDENCIA:** los SHA/TAMAÑOS de la tabla HF1 en \`P07_MANIFEST.json\` reemplazan las huellas del ACTA P07 inicial; fuente histórica P03, C1-C visual y C1-D4R funcional NO son sustituidos. La validación real Node22 exit0 continúa bloqueante.

---

# PERSONAJES P07 · SEMANTROPIC TD · CONTINUIDAD VISUAL C1-C
**Fecha:** 20-10-2026 · **Rama:** \`feature/art-p07-continuidad-c1c\` · **Origen P06 SHA:** \`a5116db1f956f8b32b86570600b878ba9d5187ed\`.
**BEFORE protegido:** captura \`SEMANTROPIC_TD_REFERENCIA_VISUAL_APROBADA_C1C_M03_T04_P03.png\`, 1280×768, SHA-256 \`24103e45a0e1249fa4b89d4e65ea16d9e147bdf1e2462e5c4063469a931842ef\`.
**PR oficial:** [#32 PERSONAJES P07 DRAFT](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/32) · sin merge.
**Estado:** [CUATRO PNG BINARIOS REALES] · [P03 RECUPERADO EN FUENTE] · [WEBGL2/M07/T08 NOT_RUN] · **NO MERGE**.

## Acceso oficial para Dirección General
| Archivo | Enlace versionado | Certidumbre |
|---|---|---|
| **Acta oficial completa P07** | [ACTA_P07_PERSONAJES_2026-10-20.md](./ACTA_P07_PERSONAJES_2026-10-20.md) | Disponible |
| **QA independiente 21 checks** | [QA_P07_PERSONAJES.json](./QA_P07_PERSONAJES.json) | 12 PASS V8/API/archivo; 8 NOT_RUN; 1 PENDING |
| **Matriz T08/operador** | [MATRIZ_T08_P07_PERSONAJES.md](./MATRIZ_T08_P07_PERSONAJES.md) | Source T08 leído; montaje BLOQUEADO |
| **Evidencias/referencia/PNGs** | [EVIDENCIA P07](../evidencias/P07/EVIDENCIA.md) | Original C1-C real; AFTER NOT_RUN |
| **FRAME ABI oficial** | [README_P07_FRAME_ABI.md](../README_P07_FRAME_ABI.md) | 7 estados/32 cuadros |
| **Manifest/hashes** | [P07_MANIFEST.json](../../../../public/official/art/actors/P07_MANIFEST.json) | 4 archivos reales |
| **Orco P03-source** | [warrior.png](../../../../public/official/art/actors/p07/png/warrior.png) | 696921 bytes |
| **Hound P03-source** | [hound.png](../../../../public/official/art/actors/p07/png/hound.png) | 600467 bytes |
| **Recluta P03-source** | [infantry_recruit.png](../../../../public/official/art/actors/p07/png/infantry_recruit.png) | 610623 bytes |
| **Operador P03 SIN RIFLE** | [sniper_operator_unarmed.png](../../../../public/official/art/actors/p07/png/sniper_operator_unarmed.png) | 539246 bytes |
| **P07 rig original de P03** | [p07-p03-continuity-rig.mjs](../../../../public/official/art/actors/p07-p03-continuity-rig.mjs) | Fuente editable |
| **Generador de atlas PNG** | [p07-png-export.mjs](../../../../public/official/art/actors/p07-png-export.mjs) | Codec/fuente/128 cuadros |
| **Sockets reales de poses del operador** | [P07_OPERATOR_SOCKETS.json](../../../../public/official/art/actors/P07_OPERATOR_SOCKETS.json) | 32 frames, hand/eye/foot / T08 pendiente |
| **Vitrina P03/P06/P07** | [p07-index.html](../../../../public/official/src/actors-visual/p07-index.html) | Código Phaser, navegador NOT_RUN |
| **QA Node/PNG** | [qa-p07.mjs](../../../../public/official/src/actors-visual/qa-p07.mjs) | Script listo, no ejecutado en checkout |
| **QA navegador** | [qa-p07-browser.mjs](../../../../public/official/src/actors-visual/qa-p07-browser.mjs) | Script Playwright, NOT_RUN |

## Decisión pendiente
- El P07 RESTAURA el pintor P03. El antiguo C1-C es la referencia estética aprobada; el gameplay C1-D4 no debe retroceder.
- P07 está exportado como 4 PNG binarios **reales**, pero su rasterización CPU no equivale necesariamente a un frame pintado por Chromium; inspección visual real obligatoria.
- Operador sin rifle actor, pero manos/culata T08 con desajuste fuente/escala; se necesita escena compuesta y un solo rifle, sin intervenir Tower/core desde P.
- Probar C1-D4 M07+T08+P07 a 1280×768 y horizontal móvil, preservar camino/economía/Infantería y solicitar aprobación artística expresa. No merge/deploy.

---
## HISTORIAL COMPLETO P01 → P06 (CONSERVADO)

# SEMANTROPIC TD · EQUIPO P · P06/C1-D2 — ATLAS BINARIOS + OPERADOR SIN RIFLE
**Fecha:** 2026-10-20 · **Rama:** `feature/art-p06-animated-actors` · **Base SHA:** `15be56b487d0b4d7b1ca0a222f0c48feda0068ca`
**Estado:** [4 PNG RGBA REALES VERSIONADOS] · [V8/ALFA SOURCE QA PASS] · [CHROMIUM/T07 ART PENDING] · **NO MERGE**.
**HEAD actual:** PR P06 → pestaña Commits (al actualizar este índice HEAD cambia).
**PR DRAFT:** [#27 P06/C1-D2](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/27) → `feature/art-p05-combat-reactivity`, sin merge.

## Acceso oficial P06 — Dirección General
| Artefacto | Enlace GitHub relativo | Estado |
|---|---|---|
| **ACTA oficial P06** | [ACTA_P06_2026-10-20.md](./ACTA_P06_2026-10-20.md) | PUBLICADA |
| **QA JSON** | [QA_P06.json](./QA_P06.json) | 12 PASS / 10 NOT_RUN |
| **RFC montaje T07 / core** | [MATRIZ_T07_P06.md](./MATRIZ_T07_P06.md) | BLOQUEANTE grip actual |
| **Registro de PNG/QA visual** | [EVIDENCIA P06](../evidencias/P06/EVIDENCIA.md) | PNG REALES / screenshots NOT_RUN |
| **Manifest con SHA256** | [P06_MANIFEST.json](../../../../public/official/art/actors/P06_MANIFEST.json) | 4 binarios firmados |
| **PNG warrior** | [warrior.png](../../../../public/official/art/actors/p06/png/warrior.png) | 342686 bytes |
| **PNG hound** | [hound.png](../../../../public/official/art/actors/p06/png/hound.png) | 234736 bytes |
| **PNG recruit** | [infantry_recruit.png](../../../../public/official/art/actors/p06/png/infantry_recruit.png) | 325087 bytes |
| **PNG sniper SIN RIFLE** | [sniper_operator_unarmed.png](../../../../public/official/art/actors/p06/png/sniper_operator_unarmed.png) | 270400 bytes |
| **Fuente reproducible del PNG** | [p06-png-generator.mjs](../../../../public/official/art/actors/p06-png-generator.mjs) | Código original editable |
| **SHA256** | [p06-hash.mjs](../../../../public/official/art/actors/p06-hash.mjs) | Verificador autocontenido |
| **Grip/eye/shoulder** | [p06-operator-sockets.json](../../../../public/official/art/actors/p06-operator-sockets.json) | 7 estados E/W |
| **Loader de PNG Phaser** | [p06-atlas-loader.mjs](../../../../public/official/src/actors-visual/p06-atlas-loader.mjs) | Código publicado |
| **Adapter PR22 read-only** | [p06-core-projection.mjs](../../../../public/official/src/actors-visual/p06-core-projection.mjs) | Solo propuesta |
| **Viewer standalone** | [p06-index.html](../../../../public/official/src/actors-visual/p06-index.html) | Código Phaser, REAL browser NOT_RUN |
| **Node PNG decode QA** | [qa-p06.mjs](../../../../public/official/src/actors-visual/qa-p06.mjs) | Script persistido, NOT_RUN |
| **Chromium 3 tamaños** | [qa-p06-browser.mjs](../../../../public/official/src/actors-visual/qa-p06-browser.mjs) | Script persistido, NOT_RUN |

## Compromisos y bloqueantes
P06 mantiene el canon de 4 personajes y 32 cuadros, 1408×832, pivotes .5/.92, shadow .5/1 y las versiones P04/P05 sin cambios. El editor P06 separa arma única de T07 de manos/cuerpo del operador y persiste PNG binarios reales.
**BLOQUEANTE:** manos P06 vs stockGrip T07 no coinciden en la escala propuesta 80wu, falta screenshot integrado con `frontRail`. El core PR22 usa `originWorld` para attack_fire y T07 visual necesita muzzle del cañón: adapter central pendiente.
**CALIDAD:** si el arte sigue pareciendo demasiado geométrico, Dirección puede rechazar su canon visual conservando el avance técnico de fuente/PNG. No declarar look premium aprobado por pasar tests.
**QA visual:** 1280×768, 844×390, 932×430, 24 instancias, alpha re-decode desde checkout, filmstrips, iPhone/Android físico y FPS permanecen NOT_RUN.

---
## HISTORIAL INTACTO DE P01 A P05

# EQUIPO P · SEMANTROPIC TD · P05/C1-D2 — REACTIVIDAD
**Fecha:** 19-10-2026 · **Rama:** `feature/art-p05-combat-reactivity`
**Base congelada:** `cb6e7b73edcb6f6df4fa5dace302aac845fc5780` (P04).
**Estado:** [PROTOTIPO VISUAL] · [TESTS V8 SIMULADOS PASS] · [BROWSER/PÍXELES NOT_RUN] · [NO MERGE].
**HEAD real:** [PR P05 / pestaña Commits](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/21/commits), autoridad frente a commits posteriores de esta misma acta.

## Directorio oficial de la nueva entrega
| Recurso | Link dentro del repo | Estado |
|---|---|---|
| **Acta exhaustiva P05** | [ACTA_P05_2026-10-19.md](./ACTA_P05_2026-10-19.md) | [CONFIRMADO EN ARCHIVOS] |
| **QA independiente P05** | [QA_P05.json](./QA_P05.json) | 10 PASS V8/API + 11 NOT_RUN |
| **RFC P05→T06** | [MATRIZ_T06_P05.md](./MATRIZ_T06_P05.md) | T06 anclajes leídos; doble rifle BLOQUEANTE |
| **Capturas/evidencias P05** | [EVIDENCIA.md](../evidencias/P05/EVIDENCIA.md) | NO HAY PNG REAL de Chromium |
| **Manifest P05** | [P05_MANIFEST.json](../../../../public/official/art/actors/P05_MANIFEST.json) | 4 atlas lógicos/128 cuadros; hashes pendientes |
| **Controlador puro de reacciones** | [p05-reactivity.mjs](../../../../public/official/art/actors/p05-reactivity.mjs) | Hit/blocked/die/escape, dedup, pause |
| **Fuente gráfica P05** | [p05-painter.mjs](../../../../public/official/art/actors/p05-painter.mjs) | Fuente basada en el dibujador P04 |
| **Adaptador Phaser read-only** | [p05-view-adapter.mjs](../../../../public/official/src/actors-visual/p05-view-adapter.mjs) | Interfaz propuesta, no bridge core |
| **Galería P04/P05** | [p05-index.html](../../../../public/official/src/actors-visual/p05-index.html) | Código; WebGL2 P05 NO EJECUTADO |
| **QA Node** | [qa-p05.mjs](../../../../public/official/src/actors-visual/qa-p05.mjs) | Script disponible; Node checkout NOT_RUN |
| **QA navegador** | [qa-p05-browser.mjs](../../../../public/official/src/actors-visual/qa-p05-browser.mjs) | Script disponible; Chromium NOT_RUN |

## Cambio clave
P05 separa *muerte por evento del core* de *fuga por evento del core*, con callbacks puramente visuales e idempotentes. Reacciona a impactos y bloqueos sin reescribir HP/escudos, daño, economía, movimiento ni entidad real. El controlador mantiene fase walk al virar E/W y pausa el reloj propio. Escape es **fade sin atlas nuevo**: quedan protegidos los 32 frames por actor.

**RIESGO T06:** tower sniper T06 tiene su propio rifle montado y P04→P05 dibuja otro. No certificar montaje en T06 ni hacer merge sin resolver la duplicación; RFC obligatorio.

**Bloqueantes:** imágenes reales de Chromium 1280×768, 844×390, 932×430; PNG RGBA+hash; control de alpha y foot滑; móvil físico; aprobación pictórica. PR debe permanecer DRAFT.

---
## ARCHIVO HISTÓRICO P01 → P04 (conservado)

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