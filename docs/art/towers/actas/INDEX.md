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
