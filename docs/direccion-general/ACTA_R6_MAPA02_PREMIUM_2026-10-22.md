# SEMANTROPIC TD — R6 | Acta de rework artístico «Campos del Molino»
**Fecha:** 22 de octubre de 2026

## Misión del director
Transformar M02 conforme al mockup compartido (pintura 2D rural premium, campos de trigo dorados, curso fluvial, múltiples saltos de agua, puentes, molino, granjas, setos, árboles, cercas, piedras, flores y luz panorámica). **No copiar literalmente** la imagen ni reemplazar geometría V5. Consistencia con arte aprobado de Mapa 01 y torres T04/P03; web fullscreen R5 intacto.

## Entrega de implementación
- Nuevo pintor vectorial Canvas2D autorado `public/official/src/maps-visual/m02/premium-golden-valley-r6.mjs`, sin imágenes externas ni derechos ajenos. Diseñado en sistema de mundo original 1280×768 y rasterizado una vez a 2× = 2560×1536 dentro de la textura Phaser existente.
- Capas: (1) horizonte alpino, valle profundo, lago y aldea distante; (2) colinas agrícolas con relieve estilizado; (3) cauce de agua, espuma y cuatro cascadas principales; (4) parcelas de trigo texturizadas, cercas y surcos; (5) bosquetes de árboles con copas coloreadas, cipreses, rocas y setos; (6) ruta de tierra premium con ribetes minerales y marcas, 100% sobre polilínea fuente; (7) puente principal sobre tributario más dos puentes rurales decorativos; (8) molino con aspas, piedra y azulejos; (9) granero, barriles, carro y pacas; (10) plataformas originales de piedra con marcadores legibles, flora ornamental.
- Integración de `farmland-art.mjs` en `paintPremiumM02`, conserva API `makeM02ArtCanvas`, mapa de ocho pads y pintura de paisaje en el CanvasTexture M02; evita modificar `scene-m02.mjs`, Render gameplay, HDR P03 o source V5. Import URL de escena M02 con query nueva para evitar caché viejo.
- Diseño deliberadamente propio: composición rural original ajustada a la *herradura* de la ruta canónica en vez de copiar las curvas o disposición de objetos del mockup.
- **Límites de fidelidad**: la ilustración es arte vectorial procedural hecho a mano en código; es más rica que R3-A pero no reproduce automáticamente el acabado pictórico de un concept artist de alta gama. Aprobación visual del director en pantalla física pendiente, no declarar equivalencia 1:1 con la referencia sin esa revisión.

## Restricciones protegidas
- `maps.v5.json` inmutable, M02 id2: 163 puntos de ruta, 8 plataformas, 1 entrada, mismo oro 395.
- `campaign140.v5.json` intacto: siete oleadas, 80 enemigos; combate de arqueros, portaescudos, soldados y francotiradores igual.
- M01 arte y core, R5 fullscreen sin bordes, UI de mapa/menús y economía sin cambios.
- Objetivo rework cinco familias (Infantería, Francotirador, Guardiana, Bombardera, Control). No desbloquear torres legacy ni prometer completitud del catálogo por un rediseño de fondo.

## QA de salida
- `docs/direccion-general/qa-r6-m02-visual.mjs`: contrato de 163 nodos, 8 pads, 7 olas, source locks, inventario visual y caché.
- `tools/qa-r6-m02-premium-browser.mjs`: Chromium WebGL2 real en desktop 1280×768, Android emulado 844×390 y 932×430. Capturas y validación de textura 2×, cromatismo, menú, ruta y construcción.
- Se mantienen pruebas completas M01, R5 responsive, R3-C siete oleadas y origen de rifle T10. CI puede fallar por instalación externa Chromium; distinguir problemas de entorno de fallos visuales.
- QA Android físico + aprobación artística del director: pendientes.
- Rollback: commit compensatorio a estado `06d3ed136ce1934f3f7538aee45761f1e503492a`.
