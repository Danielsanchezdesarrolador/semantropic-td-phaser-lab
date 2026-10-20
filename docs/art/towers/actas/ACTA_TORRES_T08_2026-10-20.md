# SEMANTROPIC TD — ACTA OFICIAL TORRES T08 · CONTINUIDAD C1-C

**20-10-2026** · Equipo propietario TORRES / MOTOR Phaser 4.2.1-WebGL2. **Estado:** [CONFIRMADO EN FUENTE] recuperación T04 / [NO EJECUTADO] integración visual WebGL2. No equivale a FINAL/APROBADO.

## 1. Autoridad, baseline, rama y PR

Base funcional protegida: integraciones C1-D3 [PR #26](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/26) y C1-D4 [PR #28](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/28). Baseline visual obligatoria: M03+T04+P03 en C1-C [PR #12](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/12), assets oficiales de [TORRES T04 PR #9](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/9). Nueva rama `feature/art-t08-continuidad-c1c` desde T07 HEAD `f09a9307d675ad4850261f6a6705959c0c61808f` (comprobado); PR [#29 DRAFT](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/29) hacia `feature/art-t07-sniper-single-rifle`. HEAD anterior al acta `66eb1d38528f07bcd6e6cfb30dd715c74e90763e`; consultar HEAD efectivo en PR.

## 2. Captura protegida realmente recibida

Imagen del usuario `SEMANTROPIC_TD_REFERENCIA_VISUAL_APROBADA_C1C_M03_T04_P03(3).png`, 1280×768. `sha256sum` ejecutado sobre su archivo local resultó `24103e45a0e1249fa4b89d4e65ea16d9e147bdf1e2462e5c4063469a931842ef`, coincidente con orden. [OBSERVADO EN CAPTURA ORIGINAL] pradera verde viva, camino arena, cuarteles azul pizarra con base de piedra, dos miradores altos de madera ocres y operadores humanos visibles. No extrapolar animaciones ni nivel III/IV de esta foto. La captura fue aportada en conversación, **no está subida como binario a GitHub**.

## 3. Identidad original preservada mediante fuentes exactas

Se restauraron **los cuatro masters SVG** oficiales desde T04 sin edición de píxeles/vector original. Las cuatro fuentes T08 poseen el mismo Git Blob SHA que T04 y que el archivo `public/official/art/towers/t04-snapshot/...`:

| Master | Git blob SHA original y vigente | Escala T04 recuperada |

|---|---|---:|

| Infantería I | `66e85f802e696d662d14b9154bf6924dbb6ba4b6` | .296 |

| Infantería II | `25884d1754950f8d764c0f03b797e10e7ecac212` | .308 |

| Sniper I | `52ec5b04b744a9583a9a07464a107c6b5f1cf293` | .312 |

| Sniper II | `c1689a19e9467dd39c6c5af380d63b22176ead5d` | .319 |

Estos hashes de Git prueban contenido fuente igual, no equivalencia de captura de escenario C1-D4. Los SVG T07 desplazados se guardaron en `public/official/art/towers/t07-snapshot/**`; alternativa de arquitectura T07 B permanece archivada e **INACTIVA**.

## 4. Qué se construyó en T08

- Fuente exacta T04 para cuarteles I/II, Sniper I/II, sin rehacer su silueta, techo, madera, paleta ni fundación.

- Nuevas capas históricamente derivadas `shadowFoot`, `backStructure`, `frontRail` para las cuatro torres; frontal de Infantería deliberadamente transparente para no crear un nuevo parapeto.

- Snipers T08: `structureNoRifle` excluye rifle, `rifleMounted` agrupa óptica/arma de T04 en una sola capa, `backStructure` legado lo contiene para compatibilidad; montar **solo una** modalidad.

- Catálogo T04 restaurado a sus escalas y anclajes originales. Nuevos grips/muzzle/recoil markers a nivel de [PROPUESTA] para rig P07, sin modificar actor.

- FX T07 core-driven, `SniperShotPresenter` y `adaptSniperCoreEvent` de solo lectura se conservaron; impactos únicamente cuando core emite `hit_applied` y bulletId coincide.

- `t08-index.html` y `t08-gallery.mjs` en TORRES son diagnóstico de cuatro pads **PROXY**, con masters/splits y T07 archivado; NO reconstrucción completa M03/P03 ni prueba funcional.

- Se adaptaron scripts estáticos T03–T07 para validar sus artes históricos archivados y exigir separadamente que el master vigente vuelva a T04. Nuevo `qa-t08.mjs` verifica restauración y compatibilidad visual mock.

## 5. Inventario de rutas y alcance

Todas las diferencias T08 están dentro de `public/official/art/towers/**`, `public/official/src/towers-visual/**` y `docs/art/towers/**`. Ninguna edición a Core, terreno, atlas Personas, HUD, Playable C1-D4, Render ni CI compartido. Fuente de verdad del diff en PR #29. Rollback inmediato: cerrar PR y usar T07 sin force push; fuente T04 sigue en snapshots.

## 6. Comparación objeto por objeto

[Matriz before/after](./MATRIZ_TORRES_T08_BEFORE_AFTER.md) identifica los cuatro edificios, paletas/escala y compatibilidad. [MANTIENE en fuente]: masters pixel/artifact equivalentes por identidad exacta de archivo. [PENDIENTE]: layering final con operador y UI en escena Core. No hay evidencia para declarar mejoras de animación o calidad pictórica más allá de lo restaurado.

## 7. Rig y rifle: riesgo cruzado

Contrato **rifleOwner=T, operatorOwner=P07, shotAuthority=core**. Sniper I foot actor fuente (185,198), grip (182,183), muzzle (299,156); Sniper II actor (189,198), grip (201,177), muzzle (307,149). Orden sugerido `shadow → structureNoRifle → P07 unarmed → rifleMounted → frontRail → HUD`. P07 no fue cargado ni validado; desajuste histórico mano-culata es [BLOQUEANTE], no resuelto con máscara ni ocultación. Ver [RFC P07/C1-D4](./RFC_TORRES_T08_P07_C1D4.md).

## 8. QA realmente ejecutado

[PASS] `sha256sum` captura original, lectura de PR histórico, comparación Git blob 4/4 exacto, diff ownership 0 rutas extranjeras, parsing sintáctico de catálogos y regresiones editadas, revisión XML simple de Sniper y capas, validación de IDs/anclajes. Evidencia en [VALIDACION_FUENTE](../evidencias/T08/VALIDACION_FUENTE.md). **No** se ejecutaron comandos Node reales ni browser T08.

## 9. Gates no ejecutados y bloqueo

[NOT_RUN] `node docs/art/towers/qa-t01.mjs` a `qa-t08.mjs` sobre checkout completo; `npm run build`; capturas reales 1280×768, 844×390, 932×430; P07 en C1-D4 con HP real y escenas gameplay; FPS GPU/dispositivo físico. `browserScreenshotIndex=[]`. Origen T07 carece de `.github/workflows`, no atribuir CI del PR #28 a T08.

## 10. Ingeniería mobile y estimaciones

Con Phaser.Scale.FIT hacia 844×390, altura máster T04 Sniper I 420×.312=131.04wu → ≈66.5px, II 420×.319=133.98wu → ≈68.0px; a 932×430 ≈73.4 y ≈75.0px respectivamente. Números calculados, **no medidos en framebuffer**. Sin pipeline nuevo de gran atlas, sin GPU measured. No se modifica collider, tamaño del pad, táctil ni economía.

## 11. Debilidades, riesgo y corrección priorizada

Debilidad 1: máster es T04 exacto, pero separar frontRail/arma puede cambiar orden de sobreposición cuando P07 se integra; calidad final **sin validar**. Debilidad 2: contacto de operador P07 aún no ha sido medido contra stockGrip, mano, cara y arma. Riesgo cruzado M/P/Core: sincronización visual de venta/upgrade y P07 puede duplicar rifle o desplazar actor aunque master sea exacto. Corrección: escena central sobre slots `[1,3,4,5]` con actor desarmado, screenshots misma cámara/paleta, luego microajuste T o RFC a P.

## 12. Reglas y decisión requerida

Conservar canon M01: 1280×768, 133 waypoints, 8 pads, oleadas [8,10,11,13,21], 63 apariciones, 365 oro y 100 vidas; el Core C1-D4 debe pasar su QA independiente. [PENDIENTE DECISIÓN DE DIRECCIÓN] Revisar captura integrada antes de aprobar estética y merge. Este PR no toca gameplay ni autoriza deployment.

**Resultado:** recuperación histórica exacta de las fuentes T04 [PASS]. Igualdad de escena nueva C1-D4+P07 respecto C1-C [NOT_RUN/BLOQUEANTE].
