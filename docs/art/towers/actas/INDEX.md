# EQUIPO T · INDEX de actas y QA — C1-B / T04 Q2

**Vigente:** T04-Q2, prototipo en revisión. **Branch:** `feature/art-t04-q2-torres`. **Base congelada:** `c0ca8792a2d79fd5c6d5ca66b7832a9e97e4eea2`.

**Último HEAD de código+QA inspeccionado al redactar índice:** `729bb712b7b56714ff0a2a72d0031f8b60521c79`. Este índice y acta se añaden en commit posterior; el HEAD **actual** se consulta en [PR #9](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/9) o en la vista de rama, para evitar incluir un SHA autorreferencial imposible.

**PR:** [#9 DRAFT → feature/art-t03-torres](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/9). Sin merge y sin cambios en integración C1-B.

## Documentos principales

- [ACTA T04](./ACTA_T04_C1B_Q2_2026-10-19.md) — identificación A-L, inventario y decisiones.

- [QA JSON T04](./QA_T04_C1B_Q2.json) — ejecución registrada, limitaciones y bloqueantes.

- [MANIFEST T04 v1](../ASSET_MANIFEST_T04_Q2.json) — 4 assets, anclajes, escalas y derechos.

- [MATRIZ DE ANCLAJES](../MATRIZ_ANCLAJES_T04_Q2.md) — comparación escalas T03→T04, pad real M02 y propuesta M03.

- [VALIDACIÓN ESTÁTICA](../evidencias/T04/VALIDACION_ESTATICA.md) — registros de evaluación V8 mock y comprobaciones estructurales.

- [RFC M03 pad](./RFC_T04_PAD_M03.md) — disminuir SOLO disco visual, no geometría.

- [RFC P03 operador](./RFC_T04_OPERADOR_P03.md) — slot/facing y política frontal del parapeto.

- [Galería T04](../../../public/official/src/towers-visual/t04-index.html) — comparación bajo Phaser después de build; no desplegada.

- [QA reproducible Node](../qa-t04.mjs) — script, **NO EJECUTADO** en clon.

## Historial de versiones

| Fase | Ref | Entregables | Estado |

|---|---|---|---|

| T01/T02 | [Reporte](../REPORTE_T01_T02.md) | Primeros 4 SVG y galería | Baseline |

| T03 | [Biblia](../BIBLIA_ARTISTICA_T03.md), [Manifest](../ASSET_MANIFEST_T03_V2.json), [QA](../REPORTE_T03_QA.md), [PR #5](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/5) | Primer rework premium | Baseline conservada |

| T04 Q2 | [Este índice](./INDEX.md), [PR #9](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/9) | Cimiento, microvolumen, anclajes, VFX, comparación A/B | Prototipo Q2 |

## Evidencia y pendientes

- [CONFIRMADO EN ARCHIVOS] Cuatro SVG T04, cuatro SVG snapshot T03, catálogo T03-compatible, VFX acotados, galería nueva, manifesto/QA/RFC.

- [PROBADO EN ENTORNO JS SIMULADO] sintaxis de módulos; deduplicación, cancelación y límite de 24 jobs con Phaser MOCK, **NO Phaser real**.

- [NO EJECUTADO] Node script final, npm build T04, WebGL2 navegador y capturas reales 1280×768, 844×390, 932×430.

- [BLOQUEANTE PARA APROBACIÓN ARTÍSTICA] ensamblaje visual auténtico C1-B con P03 y M03, escala/oclusiones/capturas móviles.

- **Capturas:** no hay imágenes T04 de runtime persistentes; `screenshotIndex` vacío. No presentar como finales gráficos IA o mock.

- **Responsables:** T conserva assets/metadata; M revisa disco; P revisa operador; Integrador ejecuta escena conjunta y QA visual.
