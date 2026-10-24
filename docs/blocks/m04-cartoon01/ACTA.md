# MAP-ART-04-CARTOON-V1 — Río de los Antiguos

Orden: TXT y mockup M04 del Director, 24/10/2026. Base real de producción `ea34a3797dfceb647354d311a9f06fb82743890c`. Rama `art/m04-cartoon01`, versión `m04-cartoon01-ancient-river-v1`. Solo arte de M04; la instrucción sustituye el acabado HF1, conserva su historial y todo el gameplay.

## Cambio visual y composición

Suelo y robles de la familia gráfica M02, ruina focal original con rostro/runa turquesa, arcos, columnas, musgo, flores y piedras. Río central por el cauce canónico, dos desagües escénicos y un tributario, cascadas estáticas y embarcadero escénico. Las confluencias se pintan en dos pasos (todos los bancos y después todas las aguas) para evitar tapas circulares/rectángulos pegados. Las orillas tienen variación de ancho; esta variación NO se aplica al camino. Rocas con facetas, coronas de césped, distinta profundidad de ribera y remansos/nenúfares; ningún puente funcional adicional.

Seis superficies independientes en Phaser: suelo, relieve, agua, camino y dos puentes; nueve pads con origen/centro compartido y 65 props individuales con sombra y raíz, de siete familias. Un PNG fuente nuevo original, 1536×1024 RGBA. Se aíslan sus seis componentes alpha y el roble aprobado M02; atlas preparado 2048×640, siete frames. Todos los sprites cumplen densidad fuente ≥1,8 píxeles por unidad mundo. Materiales M02 de solo lectura, sin importar granjas, trigo ni molino.

El panorama usa un compuesto de terreno sin pads/props y prolonga el mismo camino en los márgenes FIT. No se usa el mockup como imagen final. Se elimina la carga de la pintura HF1 en la escena jugable mediante el cambio mínimo de import/version de `scene-m04.mjs`; todas sus reglas, callbacks de campaña, resultados y actores quedan iguales. HF1 original y preview histórico permanecen intactos, recuperables. Sin nuevas partículas, filtros por frame, animaciones o cambios de renderer/DPR.

## Geometría y restricciones

262 puntos intactos, 261 Bézier C2, ancho exterior **62wu**, interior57wu. La referencia diagnóstica HF1 dibujaba84wu, pero la pintura HF1 publicada tenía ancho variable y NO se atribuye una medición uniforme previa de84wu.

El primer ajuste directo detectó radio24,119wu en la unión heredada próxima al waypoint145: insuficiente para un offset de31wu. Una única pasada binomial `[1,4,6,4,1]/16` sobre el polígono de control VISUAL elimina ese quiebre. Nunca se escribe en los waypoints: entrada/salida, velocidad, colisión, tiempo de viaje y core son los mismos.

Medición final en13.311muestras: **desviación máxima1,022166wu**, **radio mínimo70,891769wu**; continuidad C2 de posición y dos derivadas. Ambos offsets sin cruces en522muestras/lado. Enemigo canónico máximo: bruto de radio23wu; margen lateral mínimo6,9778wu, sin modificar su tamaño.

Raster real de486secciones en cada viewport: **61,5–62,75wu** por cuantización/antialias alrededor del nominal62. FIT1917×990: delta RGB0 en ambas uniones. La extensión visual tangente de2.200wu por extremo no prolonga el recorrido real de enemigos. Ver [road-geometry.json](road-geometry.json).

Los dos centros de puente siguen siendo `[402.64,382.54]` y `[923.53,367.27]`. Tableros del mismo ancho62 y eje que la ruta, extremos sobre las riberas. Guardas laterales a42wu; se abren cerca de los pads para permitir acceso y evitar tapar plataformas. Todos los puntos de baranda y extremos de postes se verifican frente al corredor y a las áreas de selección. Zonas de exclusión de vegetación: ruta51wu, pads58wu, río principal67wu, desagües63/65wu, tributario29wu. El embarcadero es escénico, excluido de ruta/pads y apoyado en la ribera oriental; no se convierte en cruce.

## Evidencia y QA

[Antes desktop](before-desktop.png) · [Después desktop](after-desktop-art-no-hud.png) · [Antes móvil](before-mobile.png) · [Después móvil](after-touch844-art-no-hud.png) · [M02 real](reference-desktop.png) · [Combate](after-desktop-combat.png).

Diferencias deliberadas respecto del mockup: M04 conserva su ruta en U y sus nueve centros reales, dos cruces canónicos, cauce principal transversal. No adopta el recorrido S, puentes adicionales ni los contadores390oro/1-9 del dibujo. La ruina y capas son originales, no recortes de la referencia.

- [PASS] Build, scope de producto y diff exacto del adaptador de escena (solo comentario/import/version de arte).
- [PASS] Node: 11oleadas,94enemigos, tipos/bruto/chamán y resultados; resto de las diez pruebas Node exigidas por el workflow M04-GAME01. [Reporte](qa-required-node.json), [campaña](qa-campaign.json).
- [PASS] Chromium/WebGL2 local: PC1280×768,844×390 y932×430 DPR2; nueve construcciones/ventas por perfil, compras normales, movimiento, disparo y baja real, pausa, restart, FIT, selector/regresión M01–M03. Sin errores JavaScript. [Reporte](qa-local.json).
- [PENDIENTE AL REGISTRAR] CI del PR y verificación de publicación/versión pública; resultados definitivos en PR e informe de entrega. No anunciar LIVE antes de comprobarlo.
- [NO EJECUTADO LOCALMENTE] 11oleadas completas en navegador en el smoke artístico (sí en Node; el workflow histórico M04-GAME01 conserva esa prueba de navegador completa), móvil físico, FPS/VRAM de hardware.
- [PENDIENTE] evaluación artística del Director.

## Integridad y QA histórico

[Manifiesto de archivos y blobs protegidos](manifest.json): **262puntos/9pads/11oleadas/94enemigos**, distribución `[6,5,7,5,10,10,9,6,9,12,15]`,395oro/100vidas. Core, movilidad, spawns, torres, actores, economía, combate, UI, récords y guardados sin cambio. M01/M02/M03 sin cambio.

Las pruebas históricas de HF1/B04 seguían fijando dos blobs previos a los reworks publicados M02/M03. Se incorporan únicamente las transiciones exactas a la base aprobada `ea34a37` al registro de QA de M04-GAME01 (`authorized-runtime-blobs.json`); [copia del registro](authorized-visual-blobs.json). Los validadores de B02/B04/HF1 permanecen sin cambios y vuelven a pasar con el historial aprobado, sin permitir cualquier hash.

La prueba histórica `qa-m04-browser.mjs` reconoce explícitamente HF1 o la versión nueva y compone las capas nuevas para sus controles de color del camino. Mantiene sus once oleadas, resultados, derrota, guardados, input y regresiones; no se reduce esa cobertura para obtener verde.

Rollback: revertir el merge del bloque en `production/semantropic-td-live`, misma URL y esquema de guardados. Base anterior `ea34a37`; el PNG HF1 y su registro permanecen intactos. No cambiar AGENTS/roadmap ni adelantar otros mapas o ambiente animado.
