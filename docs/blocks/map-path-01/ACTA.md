# MAP-PATH-01 · camino integrado M01

Orden del Director 23/10/2026: corregir únicamente escala visual y acabado del camino y contacto superficial de sus ocho plataformas. Base de producción `143999af7369a61f2cb04afdc65781c7f50be9bd`; rama `feature/map-path-01-integrated`. CI y publicación final se registran en el PR del bloque.

**Antes/después:** ancho exterior dibujado 120 → nominal 84 unidades de mundo, variación orgánica 78–90 (aprox. −30%). Centro claro reservado de 52 unidades. Se eliminan bandas concéntricas/kerb regular; se incorporan grano de tierra multiescala, transferencia tenue de textura del terreno existente, sombras y pequeños grupos discontinuos de pasto/piedra. Las curvas se suavizan solo en la copia de pintura; la ruta canónica no se modifica. El mismo contorno/textura se pinta en los márgenes no interactivos para evitar uniones de estilos distintos. Composición estática, sin nuevo coste por frame ni assets generados.

**Plataformas:** dibujo R7 exacto conservado; se agrega polvo/sombra de apoyo y pasto bajo en el borde exterior. Centros, IDs, hitboxes, API de construcción y selección intactos. Horizonte, vegetación, agua, ruinas, iluminación y los dos PNG B01 originales se reutilizan sin regenerar ni reubicar.

**Archivos:** `public/official/src/maps-visual/m01/b01/pictoric-meadow.mjs`, `tools/qa-r7-m01-premium-browser.mjs` y evidencia de este directorio. No cambian escenas, CORE, datos, torres, enemigos, navegación, economía, HUD, selector, resultados, saves, M02 o M03. Se mantienen 133 nodos, ocho sockets, cinco oleadas/63 enemigos, oro365/vidas100.

**QA proporcional:** Node (`tools/qa-b01-map-art.mjs`), build (`npm run build`) y Chromium/WebGL2 (`tools/qa-r7-m01-premium-browser.mjs`). Localmente Playwright preinstalado y Chromium del sistema, sin omitir assertions. Tres viewports: 1280×768, 844×390 y 932×430; 1217 muestras del camino sin props encima, geometría intacta, ocho sockets mouse/touch, compra UI, movimiento enemigo observado, disparos/spawns reales, pausa y smoke M02/M03. La primera assertion de movimiento muestreaba una sola vez tras 7.5 s y encontró un enemigo recién aparecido; se reemplazó por observación durante un intervalo, sin tocar gameplay. Resultado final en `qa.json`.

**Comparación real:** [antes escritorio](antes-desktop.png) / [después escritorio](despues-desktop.png), mismo viewport 1280×768. Captura móvil de QA en `despues-movil.png` (844×390, DPR2).

**Pendientes:** aceptación artística del Director, dispositivos físicos Android/iPhone y mediciones FPS/GPU reales [NOT_RUN]. CI/Render y navegador público se trazan en el PR; estas capturas corresponden al build local. No atribuir publicación por tener QA local.

**Revisión humana:** camino menos dominante, transiciones de pradera, continuidad de entrada/salida en móvil, lectura de tropas y ocho plataformas; construir e iniciar primera oleada. No iniciar M02 tras este bloque.

**Rollback:** revertir el merge de este PR con un PR normal a producción, build/QA proporcional y Render en la URL oficial habitual. No resetear ni eliminar ramas.
