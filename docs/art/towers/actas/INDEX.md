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
