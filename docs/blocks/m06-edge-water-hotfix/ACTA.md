# M06 — bordes, agua y naturalidad

Orden de Dirección: SEMANTROPIC_TD_PROMPT_PRO_M06_HOTFIX_BORDES_AGUA_NATURALIDAD_2026-10-26.txt. El camino y los pads están aceptados como base y se protegen. Base producción 088fa5a44d0842c054c8e8bd6eda073b95a8a690; rama art/m06-edge-water-hotfix. Versión m06-hf-eroded-banks-blue-v3.

## Corrección focalizada

No se reconstruye el mapa. Se conservan composición general, materiales de tierra/roca, props originales, puentes, pads y trazado de la versión orgánica.

- BORDES: se esculpe la máscara de terreno con variaciones suaves a varias escalas (máximo 14×11 unidades). Rompe la uniformidad de las orillas y los recortes largos. Los entornos de los pads y los apoyos de la caída quedan bloqueados para conservar apoyo exacto. Las paredes existentes se proyectan desde el nuevo borde local.
- TRANSICIÓN SUPERIOR: se elimina la línea clara uniforme del borde y se sustituyen tramos por pequeñas salientes facetadas de roca, con variación de tamaño y separación. La cara de roca conecta con el suelo, evitando una terminación de papel recortado.
- PIE DEL CAÑÓN: pequeños derrubios apoyados en la base, sombra de contacto y espuma azulada tenue conectan pared y agua. Se excluyen rutas y pads antes de dibujar cada detalle. No son nuevos pads ni objetos interactivos.
- AGUA: material original nuevo canyon-blue-water-original.png, 1536×1024; planos azules naturales moderados, azul verdoso secundario y reflejos azul pálido. Sustituye la lectura jade/turquesa, sin recolorear globalmente el mapa. La caída y su espuma usan la misma familia. Se mantiene la transición lejana existente.
- VIDA/COHESIÓN: los grupos mineros, vegetación y piedra existentes se revalidan contra las nuevas orillas; salientes y derrubios enriquecen la transición sin llenar el sendero ni añadir animaciones o VFX.

No se afirma reproducción exacta del mockup ni aceptación estética humana. El objetivo de agua toma la familia azul/azul verdoso del juego, con menor saturación; no copia un color único de otros mapas ni edita sus assets.

## Superficie de código

Se modifican únicamente assets.mjs, terrain.mjs y canyon-world.mjs de M06; se añade eroded-rim.mjs y el PNG de agua. Se preservan todos los PNG anteriores. El módulo road-geometry.mjs queda byte idéntico, al igual que los dos recorridos de 243 puntos, nueve pads/IDs, datos, HUD, selector, oleadas, combate, torres y M01–M05. La guarda usa la base real y permite solo esos tres módulos existentes; congela todos los demás archivos públicos.

## Evidencia y QA

Before: preview Phaser público v2, mismo encuadre que el after; no se mezcla con el Canvas histórico en esta comparación.

Comandos:
- node tools/qa-m06-cartoon01-art.mjs
- npm run build
- node tools/qa-m06-cartoon01-browser.mjs

Chromium/WebGL2 real en desktop1280×768, táctil844×390 y 932×430 DPR2. Verifica rutas y pads exactos, terreno/puentes bajo todos los puntos de viaje visibles, 9 pads apoyados, tres puentes conectados, props despejados, ancho C2, juntas FIT, caída con píxeles opacos sobre ambos bancos y reinicio sin acumulación. Comprueba además cada polígono nuevo de borde/pie contra ruta/pads y registra el color promedio de la capa de agua (predominio azul) y la diferencia real de máscara. Smoke M01/M02/M05 con selector1–5 y sin carga de arte M06.

Los promedios de color y mediciones geométricas son controles técnicos, no un certificado de calidad comercial. No se implementa campaña M06. Móvil físico y rendimiento continuo: NOT_RUN. Aprobación artística: PENDIENTE DIRECCIÓN.

CI/publicación se cierran en PR y entrega con SHA exacto, archivos públicos y navegador. Rollback: revert del merge del bloque por PR; sin reset de producción ni migración de guardados. La incidencia histórica R7 de la suite general se mantiene fuera de alcance; no se afirma un PASS global por esta corrección de arte.
