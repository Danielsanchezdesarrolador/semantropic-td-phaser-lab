# SEMANTROPIC TD · ACTA OFICIAL TORRES T09 — NODOS CONTEXTUALES

**Fecha:** 20 octubre 2026. **Motor:** Phaser 4.2.1 / WebGL2. **Owner:** TORRES (visual, iconos, contrato). **Estado:** [ENTREGADO COMO COMPONENTE INTEGRABLE] · [PENDIENTE CONEXIÓN C1-D7].

## 1. Orden oficial y trazabilidad

Prompt de Dirección General `SEMANTROPIC_TD_PROMPT_MAESTRO_TORRES_T09_NODOS_CONTEXTUALES_UI_PHASER_2026-10-20.txt`, sin autorización de modificar economía o escenas. Base T08-HF1 HEAD exacto `d4b913e5b5fbcb6ad884974aa5df595b71a98b8b`, nueva rama `feature/art-t09-contextual-nodes`, [PR #38 DRAFT](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/38) a T08. Último commit técnico previo a ACTA `8a0efcebd9101e9d1a8b13615ac6465f303687e3`, HEAD actual en PR. NO MERGE, NO RENDER, no cambios al enlace público LIVE.

## 2. Contexto real de producto inspeccionado

Fuente LIVE observada solo lectura: `production/semantropic-td-live@edf84939dfd9aa9e754247b384e5b47fe854b411`; C1-D6 `public/official/src/c1d6-playable/scene.mjs` y `index.html`. El panel inferior contiene `#family`, `#buy`, `#upgrade`, `#sell`, flechas de selección, rally y controles de partida. Funciones `WORLD.economy.quote`, `quoteUpgrade`, `quoteSell`, `getTower` existían; en `updatePanel` se observaron textos codificados 95/140, origen exacto de deuda UX. No se editó escena o precio protegido; T09 toma los valores como DTO desde DG.

## 3. Funcionalidad y matrices de estados

`getContextMenuVisualSpec(...)` devuelve menú vacío [Infantería, Francotirador, Cerrar] según ambas quotes M01; menú construido [Mejorar, Vender, Reunión para Infantería, Cerrar] o [Mejorar, Vender, Inspeccionar si rango REAL suministrado, Cerrar] para Sniper. Estados entregados: `closed` mediante presenter.clear, `open-empty-socket`, `open-infantry-I/II`, `open-sniper-I/II`, gold insufficient, TECH_LOCKED, paused-read-only, awaiting-rally-selection, unavailable-over-game. Distingue nivel del DTO auténtico y no deduce ni vende oro. Una quote rechazada jamás habilita acción por mostrar costo.

El contrato emite SOLO intenciones `build_infantry`, `build_sniper`, `upgrade`, `sell`, `set_rally`, `inspect`, `close`. Mensajes de operación exitosa pertenecen a DG tras confirmación real `WORLD.economy[method]`. El nodo close funciona en pausa, mientras compra/venta/upgrade no; victoria/derrota desactivan todos.

## 4. Diseño original de iconos

Se crearon NUEVE iconos SVG fuente de 96×96, transparentes, nombres estables en `public/official/art/towers/t09/icons/`: `build-infantry`, `build-sniper`, `upgrade`, `sell`, `rally`, `close`, `inspect`, `cost`, `blocked`. Estética cartoon militar original con techo pizarra, mirador madera, bronce, metal verde-azul; sin copied geometry de otras marcas. Medición Git real: archivos suman **4.896 bytes fuente**, NO VRAM. Todos listados individualmente con path, bytes y blob SHA en [manifest](../ASSET_MANIFEST_T09.json). Los SVG son editables, no atlas PNG final de producción.

## 5. Layout táctil y visibilidad

`layoutContextNodes` es pura y trabaja en CSS px. Minimiza desplazamiento desde socket y reorienta el arco 1–4 nodos en bordes. `nodeDiameter` mínimo 44 px; si safeRect no cabe sin solapes, devuelve `fits=false` y el presenter inhibe botones en lugar de salir fuera. `projectWorldToScreen` usa matriz affine de cámara suministrada por DG y medidas reales de canvas/host; no asume zoom 1, DPR 1 o viewport 1280. Controles no cambian hitbox socket.

UI accesible con etiquetas ARIA/disabled, focus visible, hover/pressed, reduced-motion CSS, fuente contraste militar. `mountT09Presenter` reutiliza overlay DOM en host autorizado y registra solo cuatro listeners dentro del propio overlay; `destroy` los libera. Intercepta pointer events de botones y no del mapa de fondo.

## 6. Prototipo Phaser separado, con límites de evidencia

`public/official/src/towers-visual/t09/index.html` y `gallery.mjs`: escena Phaser WebGL2 aislada que pinta OCHO pads PROXY (no sockets reales), carga las cuatro ilustraciones T04 de la rama y representa estados con precios completamente FICTICIOS (117,163,159) señalados como demo. Simula UI para revisar fluidez de nodos; no ejecuta llamadas al core, no juega oleadas, no modifica CORE o LIVE. No se presenta como captura auténtica, porque ese navegador no se ejecutó aquí.

## 7. Entregables y API

| Ruta | Propósito |

|---|---|

| `public/official/src/towers-visual/t09/spec.mjs` | DTO de quotes a nodes/presentación sin gameplay |

| `public/official/src/towers-visual/t09/layout.mjs` | safeRect, clamp, world→screen puro |

| `public/official/src/towers-visual/t09/presenter.mjs` | botones DOM scoped, onIntent, cleanup |

| `public/official/src/towers-visual/t09/menu.css` | arte visual, disabled/focus y reduced motion |

| `public/official/src/towers-visual/t09/gallery.mjs` + `index.html` | showroom Phaser en scope T09 |

| `public/official/art/towers/t09/icons/*.svg` | nueve iconos originales |

| `docs/art/towers/qa-t09.mjs` | QA Node reproducible: estados/layout/DOM falso/hashes T04 |

| `docs/art/towers/ASSET_MANIFEST_T09.json` | pesos, versiones, trazabilidad y protección |

| `docs/art/towers/actas/RFC_T09_C1D7_NODOS_CONTEXTUALES.md` | contrato exacto para DG |

| `docs/art/towers/evidencias/T09/VALIDACION_ESTADOS_LAYOUT.md` | pruebas realmente ejecutadas / no ejecutadas |

| `docs/art/towers/actas/QA_TORRES_T09.json` | inventario de gates |

## 8. Continuidad aprobada

Los cuatro SVG master T04 restaurados en T08-HF1 permanecen byte-idénticos a sus Git blobs históricos: Infantería I `66e85f802e696d662d14b9154bf6924dbb6ba4b6`, Infantería II `25884d1754950f8d764c0f03b797e10e7ecac212`, Sniper I `52ec5b04b744a9583a9a07464a107c6b5f1cf293`, Sniper II `c1689a19e9467dd39c6c5af380d63b22176ead5d`. Ref C1-C SHA-256 `24103e45a0e1249fa4b89d4e65ea16d9e147bdf1e2462e5c4063469a931842ef`. No se editó art catalog, sniper rifle, actor P03/P07, profundidad, sockets, economía o daño.

## 9. QA sustentado y limitaciones

**[PROBADO V8 PURO]** 29 comprobaciones PASS sin FAIL de spec, 4 viewports × 5 posiciones de borde/centro, modos, cotización insuficiente y transform affine. **[PROBADO V8 FakeDOM]** 100 ciclos update/clear sin listeners acumulados, un solo intento al tocar nodo enabled, disabled no emite, destroy elimina cuatro listeners. **[CONFIRMADO GITHUB]** 9 commits /19 archivos 100% ownership TORRES al corte de QA; cuatro hashes T04 protegidos; nueve iconos SVG en tree GitHub.

**[NO EJECUTADO]** `node docs/art/towers/qa-t09.mjs` real en checkout, npm build, Chromium Phaser WebGL2, screenshot 1280×768 / 844×390 / 932×430 / 1536×709, touch móvil físico, FPS/GPU. El contenedor tiene Node/Chromium, pero `git ls-remote` de GitHub falla por DNS. Ningún resultado de V8 se presenta como Node real.

**[PENDIENTE MATERIAL]** `50833.jpg` y `50834.jpg` figuran en el prompt T09 pero no llegaron como adjuntos individuales; comparación before/after auténtica NO realizada. No se han probado tap real, safe insets de navegador ni DOM de producción.

## 10. Evaluación crítica y riesgos

Debilidad 1: el layout puro prueba geometría de safeRect, pero DG debe medir safeRect de HTML real y cámara Phaser para evitar botones bajo overlays. Debilidad 2: el DOM presenter no reemplaza por sí mismo la selección del core ni resuelve resultados de comercio; cualquier feedback de éxito sin confirmación DG sería defecto. Riesgo cruzado: tocando un nodo y un socket a la vez puede causar doble selección si DG monta la capa fuera del host o reemite handlers; la prueba E2E debe verificar propagación, invalidación por revisión y taps rápidos.

Corrección priorizada: DG integra evento de selección sobre sockets reales de C1-D6, reemplaza panel inferior por el presenter respetando todos los controles globales, vuelve a pedir quote tras cada operación, corre Node/browser, valida con capturas comparativas y decide diseño sin cambiar masters T04.

## 11. Entrega, autorización y rollback

PR #38 continúa DRAFT. Solo DG puede fusionar y conectar a `public/official/src/c1d7-playable/**` o `live/**` y desplegar en URL permanente. Si rechaza layout, cerrar PR #38 o revertir commits exclusivos TORRES sin tocar producción. No se generó otro link LIVE.
