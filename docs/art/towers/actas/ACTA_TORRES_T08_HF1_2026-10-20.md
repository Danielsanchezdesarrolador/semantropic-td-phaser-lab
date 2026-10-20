# SEMANTROPIC TD — ACTA TORRES T08-HF1

**Fecha:** 2026-10-20. **Operación:** hotfix puntual de continuidad de ownership P07, sin T09, sin rediseño. **Estado:** CORREGIDO EN FUENTE, PENDIENTE REEJECUCIÓN DEL QA REAL.

## 1. Orden y base exacta

Se actuó exclusivamente en `feature/art-t08-continuidad-c1c` / [PR #29](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/29) (DRAFT). HEAD inicial confirmado por GitHub `ceaf74681887825a435968ffc44397fa17d70339`. No se editaron PR #28, #30, #33, main, staging, Mapas, Personajes o Core. Artística autorizada: captura C1-C M03+T04+P03 (1280×768), SHA-256 `24103e45a0e1249fa4b89d4e65ea16d9e147bdf1e2462e5c4063469a931842ef`.

## 2. Incidente real de CI: Actions #39455399642

En [GitHub Actions 39455399642](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39455399642), job `combined-art` ID `118740821956`, el paso `Team QA and core regression` ejecutó Node v22.23.3 con `set -euo pipefail`, pero **FALLÓ (exit code 1)** en `docs/art/towers/qa-t08.mjs:38`. La aserción requería `layers.singleRifle && layers.rifleOwner==='T' && layers.operatorOwner==='P07'`. Con metadatos T08 `meta.operatorOwner='P07'`, la función `getSniperSingleRifleLayers(meta)` retornaba literal `P06`. Los pasos build/Chromium/screenshots fueron OMITIDOS por ese fallo; NO se registran como pruebas realizadas.

## 3. Cambio correctivo exacto

- `public/official/src/towers-visual/catalog.mjs`: `getSniperSingleRifleLayers` ahora deriva `operatorOwner` de `meta.operatorOwner`, con fallback histórico `P06` para metadatos de T07 sin owner. Igual sucede con `operatorAssetId`: toma `meta.operatorAssetId`, fallback id estable `sniper_operator_unarmed`. Se actualizaron dos frases desactualizadas `operator P06` en `weaponCompositionRule` T08, sin cambiar imagen ni capas.

- `public/official/src/towers-visual/t07-core-visual-adapter.mjs`: nueva exportación `T08_VISUAL_CORE_CONTRACT` con P07; `T07_VISUAL_CORE_CONTRACT` se preserva INALTERADO como alias histórico P06. `adaptSniperCoreEvent` NO se modificó: conserva originWorld, genera muzzleWorld sólo de presentación y pasa eventId/bulletId.

- `docs/art/towers/qa-t08.mjs`: ahora verifica P07 vigente, P06 legado, ambos contratos exportados, manifiesto `ownerPolicy`, id de operador desarmado, estructura sin arma separada del back legado y la única capa rifleMounted. No se debilitó la aserción original; se la conservó.

## 4. Verificación de arte sin regresión

Tras el cambio, los hashes de blob Git de los masters canónicos TORRES T08 siguen **exactamente** los de T04 PR #9 / C1-C:

| Master T04 restaurado | Blob SHA | Estado |

|---|---|---|

| Infantería I | `66e85f802e696d662d14b9154bf6924dbb6ba4b6` | [CONFIRMADO] sin cambios |

| Infantería II | `25884d1754950f8d764c0f03b797e10e7ecac212` | [CONFIRMADO] sin cambios |

| Francotirador I | `52ec5b04b744a9583a9a07464a107c6b5f1cf293` | [CONFIRMADO] sin cambios |

| Francotirador II | `c1689a19e9467dd39c6c5af380d63b22176ead5d` | [CONFIRMADO] sin cambios |

Fuente 360×420, footAnchor `.5/.93`, worldScale `[.296,.308,.312,.319]` y sniper operator anchors I `(185,198)` / II `(189,198)` y stockGrip I `(182,183)` / II `(201,177)` continúan desde el catálogo T08. La composición legacy sigue con un rifle en `backStructure`; la avanzada usa estructura sin rifle y un solo `rifleMounted`. No se editaron SVG ni colliders.

## 5. Pruebas después del parche, con alcance preciso

**[PROBADO EN V8 / PHASER MOCK, NO NODE]:** 13 checks PASS / 0 FAIL sobre módulos vigentes leídos desde GitHub: catálogo cuatro torres; T08 P07 para dos snipers; fallback P06 para ambos; T07 y T08 contratos diferenciados; adaptador read-only proyecta muzzle y preserva originWorld; sin `attack_fire` duplicado; sin impacto falso; hit_applied correlacionado único; cancelación/cleanup; sintaxis QA. **[GITHUB COMPARE]:** 12 commits / 41 archivos en corte de fuente previo a documentos HF1, 0 rutas extranjeras.

**[NO EJECUTADO]** comando real `node docs/art/towers/qa-t08.mjs` sobre checkout del HEAD corregido; `npm run build`, runner Chromium/WebGL2, screenshots 1280×768/844×390/932×430, dispositivo físico y FPS. GitHub no resuelve desde el contenedor disponible (`git ls-remote` falló DNS), por lo cual un checkout local reproducible no pudo obtenerse. El resultado histórico de Actions fue FAIL **antes** del hotfix y no certifica que este HEAD ya pasó Node.

## 6. Grip, dependencia P07 y gate integrador

El encaje de manos/ojo/cuerpo de P07 con la culata T08 **sigue sin aprobación visual**. No se movió la torre, socket, collider ni rig P07, y no se cambió daño, oro, oleadas, targeting ni velocidad del proyectil. Dirección debe instalar este PR por su procedimiento central, ejecutar Node QA T08 + regresiones, npm build y Chromium WebGL2 sobre C1-D4R con capturas en misma cámara; si falla encaje crear RFC con screenshot real.

## 7. Plan de rollback / no merge

Revertir commits T08-HF1 de código y tests en PR #29 (no fast-forward hacia producción) si el Integrador detecta incompatibilidad. T04 masters permanecen idénticos y PR #29 queda DRAFT. No se fusionó ni desplegó.
