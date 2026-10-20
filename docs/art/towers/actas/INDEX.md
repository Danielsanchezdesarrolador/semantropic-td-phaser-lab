# SEMANTROPIC TD — TORRES T08-HF1 | HOTFIX ESPECÍFICO P07

**20-10-2026** | **Estado:** `[CORREGIDO EN FUENTE]`, `Node/build/WebGL2 [NOT_RUN DESPUÉS DEL HOTFIX]`. Sin cambio estético, sin T09, sin merge, sin deploy. [PR #29 DRAFT](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/29).

## Documentación correctiva actual

- [ACTA TORRES T08-HF1](./ACTA_TORRES_T08_HF1_2026-10-20.md) — fallo histórico real Actions #39455399642 y corrección P07.

- [QA TORRES T08 JSON actualizado](./QA_TORRES_T08.json) — resultados y estados posteriores al hotfix.

- [RFC TORRES T08-HF1/P07](./RFC_TORRES_T08_HF1_P07.md) — contrato de capas/ownership e instrucciones al Integrador.

- [Test Node qa-t08 ampliado](../qa-t08.mjs) — mismo assert P07 más paridad de manifiesto y compatibilidad P06, pendiente ejecución real.

- [Catálogo T08](../../../../public/official/src/towers-visual/catalog.mjs) — `getSniperSingleRifleLayers()` deriva owner desde `meta.operatorOwner`.

- [Adaptador visual](../../../../public/official/src/towers-visual/t07-core-visual-adapter.mjs) — T08 contract P07, alias histórico T07 P06 intacto.

**Corte técnico:** base real T08 antes del hotfix `ceaf74681887825a435968ffc44397fa17d70339`; commits de corrección `c530e5665334f16fec6754c1d11efcc5c579d449`, `73d95ed8d3565599fd6af24bd71886b14a6c181a`; HEAD final disponible en PR. Los cuatro SVG canónicos conservan blob Git idéntico a T04 PR #9.

**Siguiente gate:** Integrador ejecuta `node docs/art/towers/qa-t08.mjs`, build y Chromium WebGL2 en escena jugable con P07. QA fuente/mocks no significa aprobación artística del grip.

---

## Índice T08 original e historial intacto

# SEMANTROPIC TD · TORRES T08 — Continuidad visual C1-C aprobada

**Fecha:** 2026-10-20. **Hito vigente:** TORRES T08 antirretroceso artístico. La imagen C1-C del propietario (M03+T04+P03) manda sobre el aspecto visible; core funcional C1-D4 (PR#28) se protege. Rama propia `feature/art-t08-continuidad-c1c`, base T07 `f09a9307d675ad4850261f6a6705959c0c61808f`. **PR [#29 DRAFT](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/29)** → `feature/art-t07-sniper-single-rifle`. HEAD antes de este índice `3da97d7b342e02e63a6e2241c2e487ca1ea90f2d` (consultar HEAD exacto más reciente en PR). NO MERGE, NO RENDER.

## Material actual para Dirección General

- [ACTA TORRES T08 (20-oct-2026)](./ACTA_TORRES_T08_2026-10-20.md) — identificación, cuatro blobs T04 exactos, QA, riesgos.

- [QA TORRES T08 JSON](./QA_TORRES_T08.json) — PASS de contenido vs NOT_RUN de navegador/Node.

- [ASSET MANIFEST T08](../ASSET_MANIFEST_T08.json) — fuente histórica, paths y escalas, SHA256 de captura, propiedad de rifle.

- [Prueba Node QA-T08](../qa-t08.mjs) — script listo para ejecutar desde checkout real, hoy NOT_RUN.

- [RFC TORRES/P07/CORE](./RFC_TORRES_T08_P07_C1D4.md) — grip, muzzle, composición de rifle único y tareas integrador.

- [Matriz BEFORE / AFTER](./MATRIZ_TORRES_T08_BEFORE_AFTER.md) — los cuatro edificios, fuente exacta vs composición pendiente.

- [Evidencia estática TORRES T08](../evidencias/T08/VALIDACION_FUENTE.md) — hash de imagen y fuentes reales.

- [Showroom diagnóstico T08](../../../../public/official/src/towers-visual/t08-index.html) — source HTML Phaser, NO captura de mapa C1-D4.

- [Catálogo T08](../../../../public/official/src/towers-visual/catalog.mjs) / [Split rifle único](../../../../public/official/src/towers-visual/sniper-vfx.mjs) / [Adapter read-only](../../../../public/official/src/towers-visual/t07-core-visual-adapter.mjs).

## Referencia aprobada y criterios

PNG original adjunto en conversación: `SEMANTROPIC_TD_REFERENCIA_VISUAL_APROBADA_C1C_M03_T04_P03(3).png`, 1280×768, SHA256 **24103e45a0e1249fa4b89d4e65ea16d9e147bdf1e2462e5c4063469a931842ef** [VERIFICADO LOCALMENTE]. No hay binario de la captura original almacenado en este PR. Los cuatro SVG T08 *sí* están byte-idénticos a T04 fuente PR#9 y `t04-snapshot` [VERIFICADO GITHUB].

### Gates

- A — Restauración fuente T04 y ownership exclusivo TORRES: PASS de source.

- B — Render real P07/un-rifle/rail idéntico a captura C1-C: NOT_RUN, bloqueante.

- C — Node, npm build: NOT_RUN.

- D — WebGL2 navegador y contraste 1280/844/932: NOT_RUN.

- E — Validación del propietario / Dirección General de escena real: PENDIENTE.

- `browserScreenshotIndex=[]` y no deben considerarse conceptos o proxy como capturas reales.

---

## Historial y actas T07 / T06 / T05 / T04 / T03 anterior (preservado)

# SEMANTROPIC TD · EQUIPO T — T07 / RIFLE ÚNICO / 20-10-2026

**Entrega actual:** T07 Francotirador I/II, single mechanical rifle property T, P06 actor unarmed; **rama:** `feature/art-t07-sniper-single-rifle` creada desde HEAD T06 `6788b5931fc6161bbfbca6cb25a1c2a83a7e1eb3`. **PR [#24 DRAFT](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/24)** hacia `feature/art-t06-sniper-vfx`. **HEAD documental pre-index:** `9cdabeffdc7e2bb152a418c9bb75b4fdf48ea0ce`, HEAD final en PR para evitar SHA autorreferencial.

## Artefactos y documentación T07

- [ACTA oficial T07](./ACTA_T07_2026-10-20.md) — objetivo, inventario, QA, comparativa A/B, riesgos.

- [QA T07 JSON](./QA_T07.json) — comandos/checks PASS de fuentes/mock y NOT_RUN runtime.

- [Manifest T07](../ASSET_MANIFEST_T07.json) — masters, rifle ownership, layers y trazabilidad.

- [QA Node T07](../qa-t07.mjs) — script reproducible, aún no ejecutado sobre clon real.

- [RFC P06 / Core C1-D2](./RFC_T07_P06_CORE_SINGLE_RIFLE.md) — contrato rifle único y adapter.

- [Evidencia técnica T07](../evidencias/T07/VALIDACION_ESTATICA.md) — fuente y mock, NO captura real.

- [Showroom Phaser T07 (código)](../../../../public/official/src/towers-visual/t07-index.html) — T05/T06/T07 A/B, solo simulación visual, requiere build real.

- [Catálogo y metadata](../../../../public/official/src/towers-visual/catalog.mjs) / [SniperShotPresenter](../../../../public/official/src/towers-visual/sniper-vfx.mjs) / [adapter read-only](../../../../public/official/src/towers-visual/t07-core-visual-adapter.mjs).

## Estado verificable

- [CONFIRMADO EN CÓDIGO] 16 SVG fuente verificadas, un rifle por composición y cero en structureNoRifle; catálogo, adaptador y scripts publicados.

- [EJECUTADO CON JS V8 Y PHASER MOCK] 13 PASS, sin impacto automático de fire, `hit_applied` único asociado a bulletId, teardown y lookup externo de muzzleWorld.

- [NO EJECUTADO] npm build, Node QA completo, Chromium 1280×768 / 844×390 / 932×430, screenshots auténticos, P06 real, core bridge instalado, FPS/hardware.

- [BLOQUEANTE] aceptación artística real y pruebas de P06 `sniper_operator_unarmed` montado sin duplicación.

- `screenshotIndex=[]` y no existen capturas Phaser T07 verificadas. No confundir showroom con combate del PR #22.

---

## Historial T06 y versiones anteriores, conservado

# SEMANTROPIC TD · EQUIPO T — ÍNDICE ACTUAL C1-D2 / T06

**Candidato vigente: Francotirador T06**, rama `feature/art-t06-sniper-vfx`. **Base autorizada exacta:** `ffc06ccf0328e12c3af26a869167673e14d5b2e4`; snapshot HEAD antes de este índice `fd72fce3ac03506aa846a2614e96948861aa0965`. **PR [#19 DRAFT](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/19) → `feature/art-t05-premium-towers`**. Sin merge ni despliegue.

## Documentos T06 para Dirección General

- [ACTA T06 oficial](./ACTA_T06_2026-10-19.md) — inventario, arquitectura I/II, estados de QA, riesgos y decisiones solicitadas.

- [QA T06 JSON](./QA_T06.json) — comprobaciones PASS reales de contenido y Phaser MOCK frente a NOT_RUN del runtime.

- [Manifiesto assets T06](../ASSET_MANIFEST_T06_C1D2.json) — 2 masters, 6 capas, 2 snapshots T05, propuestas de escala y autoría.

- [Script QA reproducible](../qa-t06.mjs) — tests Node, aún NO EJECUTADOS sobre checkout.

- [RFC hacia Integrador C1-D2](./RFC_T06_C1D2_EVENTS.md) — envelope propuesto de attack_fire y oclusión P04.

- [Evidencia comprobada T06](../evidencias/T06/VALIDACION_ESTATICA.md) — estructura SVG, parser, mocks, fallo corregido.

- [Showroom T06 en fuente](../../../../public/official/src/towers-visual/t06-index.html) — requiere build/servidor Phaser 4.2.1 real.

- [Adaptador de disparo visual](../../../../public/official/src/towers-visual/sniper-vfx.mjs) — `SniperShotPresenter`, sin daño real.

## Estado T06

- **[CONFIRMADO EN FUENTE]** dos Francotiradores 3/4 reconstruidos, seis capas editables y dos T05 snapshots; `footAnchor` constante; `muzzle/fireEffectOriginLocal` definidos.

- **[PROBADO CON JS Y PHASER MOCK]** parse y anclajes, eventos A/B y dedup, target desaparecido, cancelación de objetos y cierre.

- **[NO EJECUTADO]** Node qa-t06 en checkout, npm build, Phaser WebGL2 real, móvil, capturas 1280×768/844×390/932×430, gameplay Core, FPS.

- **[PENDIENTE DECISIÓN]** aprobación artística de Dirección, integración `CombatEventBridge` por Integrador, montaje P04/rail y eventual atlas PNG comercial.

- `screenshotIndex=[]`. La escena es showroom de eventos **sintéticos**; NO representa un combate real funcional.

---

## Historial anterior — T05/C1-D y versiones previas (conservado sin cambios)

# SEMANTROPIC TD · EQUIPO T — INDEX DE VERSIONES Y ACTAS

**Versión candidata:** T05 / C1-D · 2026-10-19. **Rama:** `feature/art-t05-premium-towers`. **Base protegida:** `140a81ae4b38f915326deefbb35230368389eac8`. **HEAD antes del commit del índice:** `10bd05bd55c032f054f952e212efea847d4c871c`. SHA final en [PR #14](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/14); evitar un valor autorreferencial falso.

**Pull Request:** [#14 — T05 rediseño profundo (DRAFT)](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/14) → `feature/art-t04-q2-torres` · NO MERGE.

## Enlaces para Dirección e Integración

- [ACTA T05 C1-D completa](./ACTA_T05_C1D_2026-10-19.md)

- [QA T05 C1-D JSON](./QA_T05_C1D.json) — estructura de pruebas PASS/MOCK vs NOT_RUN.

- [MANIFEST T05 original](../ASSET_MANIFEST_T05_C1D.json) — A/B, capas, source size y anclajes.

- [BIBLIA ARTÍSTICA T05](../BIBLIA_ARTISTICA_T05_C1D.md) — recomendado A, alternativa B.

- [MATRIZ T05](../MATRIZ_ANCLAJES_T05_C1D.md) — escalas, pad M03 y cifras FIT móviles.

- [RFC hacia Integrador/M04/P04](./RFC_T05_SPLIT_M04_P04.md) — frontRail y operador.

- [VALIDACIÓN ESTÁTICA](../evidencias/T05/VALIDACION_ESTATICA.md) — no confundir con browser.

- [QA Node T05](../qa-t05.mjs) — script reproducible, aún NOT_RUN.

- [Galería Phaser T05](../../../../public/official/src/towers-visual/t05-index.html) — revisar tras build.

- [Lámina A/B Infantería](../../../../public/official/art/towers/concepts/T05_SHEET_INFANTERIA_A_B.svg) y [Lámina A/B Sniper](../../../../public/official/art/towers/concepts/T05_SHEET_SNIPER_A_B.svg) — CONCEPTO original, NO captura de runtime.

## Estado de las entregas

| Lote | Documentación | PR | Estado |

|---|---|---|---|

| T01/T02 | [Reporte](../REPORTE_T01_T02.md) | [#1](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/1) | Baseline |

| T03 | [Biblia](../BIBLIA_ARTISTICA_T03.md), [QA](../REPORTE_T03_QA.md) | [#5](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/5) | Baseline conservado |

| T04/Q2 | [ACTA](./ACTA_T04_C1B_Q2_2026-10-19.md), [QA](./QA_T04_C1B_Q2.json) | [#9](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/9) | Snapshots completos |

| **T05/C1-D** | [ACTA](./ACTA_T05_C1D_2026-10-19.md), [QA](./QA_T05_C1D.json) | [#14](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/14) | PROTOTIPO revisión |

## Hitos de T05

- T05-0: auditar T04 y C1-C solo lectura: PASS código; capturas C1-C no auditadas localmente.

- T05-1: dos láminas A/B y siluetas SVG: PASS entregadas, no certificación visual.

- T05-2/3: cuatro edificios A + cuatro B con estructuras nuevas y frontRail separado: PASS archivos.

- T05-4: galería T05, iluminación leve y FX refinados sin gameplay: PASS código; browser NOT_RUN.

- T05-5: QA fuentes/JS V8 MOCK PASS; Node real, Chrome WebGL2 y foto integrada NOT_RUN.

- T05-6: PR #14 y documentación persistente en GitHub: PASS al verificar PR final.

## Bloqueantes

1. Ejecutar `node docs/art/towers/qa-t01.mjs`, `qa-t03.mjs`, `qa-t04.mjs`, `qa-t05.mjs` y `npm run build`.

2. Capturas **REALES PHASER** antes T04/A/B con mismo socket en 1280×768, 844×390, 932×430; `screenshotIndex=[]` hasta entonces.

3. Inspección con P04 y M04 para operador/muzzle/rail/oclusiones y ratificación de worldScale.

4. Aprobación artística de Dirección, posible export raster y retoque antes de llamarlo final.

**Ningún archivo de M/P/core ni Render fue modificado por este Equipo.**
