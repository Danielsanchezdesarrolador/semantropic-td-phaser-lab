# M01-ART-ALIGN-M02-01 — alineación de acabado

Orden24/10/2026 y confirmación expresa de continuar con el plan: M02 actual es referencia directa de color, árboles, densidad y agrupación para terminar M01. No se traslada su bioma agrícola ni su layout. Base de producción `90dce477ddc91fde2d300c2f8dc5e2a636aa1f7b`, rama `art/m01-align-m02`.

## Decisión implementada

- Césped: misma banda genérica ilustrada y paleta viva de M02, con escalado uniforme y composición2x; se aplica a suelo y parte superior de las terrazas de M01. Se preservan vista/skyline propios de Praderas del Amanecer, agua y roca originales, formas de costa y alturas.
- Robles: se aísla únicamente el componente alfa del roble aprobado M02. No se registran ni dibujan los otros cinco elementos del atlas rural. Las variantes2x usan el pipeline de definición de M01 y un atlas compartido; sin trabajo de preparación por frame.
- Familia de árboles:19robles redondeados frente14robles/árboles jóvenes anteriores;13 conservan su mismo punto de apoyo y ancho, la composición restante se reorganiza dentro del espacio seguro. Se mantienen cipreses como variedad de pradera.
- Composición: agrupaciones de arbustos, flores silvestres y rocas con hiedra alrededor de robles, ruinas y portal. Los compañeros se agrupan junto al pie del objeto principal, con oclusión orgánica entre decorados autorizada; se conserva una franja despejada junto al sendero y pads.144elementos decorativos frente50; el conteo describe la escena, no mide por sí solo calidad visual.
- Los tres motivos de trigo heredados se sustituyen por follaje silvestre. No se importan campos de cultivo, casas, molino, puente o carro de M02. Se conserva el pequeño suministro histórico de M01; no se convierte en escenario agrícola.

## Congelado y comprobado

Camino64wu y su spline, módulos de acceso de enemigos y definición de texturas: archivos byte a byte iguales. Captura de texturas reales antes/después: camino, pad y dos capas de entrada RGBA idénticos; alfa de caras rocosas idéntico. SHORE/MESAS, siete formaciones,133waypoints, ocho pads e IDs intactos.

Portal/shrine, arco y puerta históricos mantienen posiciones/tamaños/datos exactos y assets originales. La vegetación se agrupa alrededor sin sustituir el portal. Core, cinco oleadas63enemigos,365oro/100vidas, torres, actores, UI/HUD, balance y progresión sin modificaciones.

Todos los archivos/PNG de M02 se congelan por hash: se leen dos originales versionados para roble/césped, sin editar ni ejecutar su renderer desde M01. M03/M04 tampoco cambian. La protección del diff se refiere a la producción vigente90dce47, incorporando el bloque M02 ya aprobado, no a un baseline anterior a esa integración.

## Lista exacta de producto

1. `public/official/src/maps-visual/m01/style01/cartoon-world.mjs` — composición, carga de referencias de solo lectura, robles/grupos.
2. `public/official/src/maps-visual/m01/style01/fidelity-terrain.mjs` — parámetro opcional del césped ilustrado, sin alterar geometría ni agua/roca.
3. `public/official/src/maps-visual/m01/style01/m02-alignment.mjs` — nuevo, referencia explícita/aislamiento alfa del roble.

PNG/SVG nuevos o modificados: **ninguno**. Lectura de `public/official/art/maps/m02/cartoon03/materials-original.png` (solo césped) y `rural-atlas-original.png` (solo roble); originales inmutables, SHA en manifiesto. No se usa el mockup ni una captura del mapa como fondo.

QA: `tools/qa-map-style01-art.mjs`, `tools/qa-map-style01-browser.mjs`, evidencias en esta carpeta. No dependencias ni renderer global nuevos. La separación general de objetos propia del hotfix previo se sustituye, solo para decorados, por familias con solape intencional de vegetación; las reglas de clearance de ruta/pads y apoyo sobre terreno siguen obligatorias.

## Evidencias y límites

[PASS] Node/contratos, fuentes protegidas, geometría C2 del camino ya existente. [PASS] comparación antes/después PC1280×768 y844×390, geometría/siluetas/texturas congeladas, cero erroresJS. Ver `before-after-audit.json`. M02 referencia capturado con idéntica cámara/zoom; campos y composición agrícolas quedan en M02.

Browser final: ocho build/sell, compras normales, combate/pausa, entrada y combate más allá del saliente, fullscreen/FIT, perfiles PC/844/932DPR2 y navegaciónM02/M03/M04. La ejecución local completa pasa en PC,844×390 y932×430DPR2 (`qa-local.json`). Al registrar el acta quedan pendientes CI/integración/publicación, que se informarán con evidencia real en PR e informe de entrega.

[NOT_RUN] Dispositivo físico, campaña completa, FPS/VRAM/batería. La riqueza percibida, equivalencia de acabado y aceptación estética corresponden a Dirección, no a un contador automático. Se conserva el canvas y presupuesto de resolución existentes; no se inventa rendimiento físico.

Rollback: revert normal del merge del bloque sobre producción; misma URL oficial, sin sitios nuevos ni reinicios de sistemas.

## Portabilidad de la comparación Canvas en CI

CI40097854140 falló en el hash de alfa de acantilados contra un hash obtenido localmente; Node/build y los hashes de camino/pad/entrada pasaron. La comparación local de antes/después sí fue exacta. Se sustituye únicamente ese oráculo por el módulo original de producción90dce47, cargado en el servidor efímero de QA y rasterizado en el mismo navegador que la versión candidata. Se mantiene igualdad exacta de alfa (cero tolerancia); no se cambia arte ni geometría para pasar CI. Material original, atlas de acantilados, módulo de definición y datos de relieve están congelados por hash/arrays. Los originales se leen del commit de producción, sin añadir endpoints o módulos de QA al juego público.
