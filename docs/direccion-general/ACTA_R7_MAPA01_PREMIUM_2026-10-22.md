# SEMANTROPIC TD — R7 Mapa 01 «Praderas del Amanecer»
**Dirección:** Rework visual oficial autorizado el 22 de octubre de 2026

## Referencia y ejecución
El Director aportó un mockup de ambiente de praderas elevadas, valle/castillo lejano, cascadas, santuario cristalino, puente fortificado, ruinas, prado exuberante y camino de tierra. La imagen aportada es **referencia artística exclusivamente**; no se utiliza ni se copia en textura. Se implementa dentro del juego de producción Phaser, tal como en R6 M02, sin generar más conceptos/imagenes sustituyendo la implementación.

## Geometría y política de integración
M01 id1 en `maps.v5.json`: **133 puntos**, ocho pads anclados a spots canónicos, ruta S real izquierda→centro→derecha, cinco oleadas, 63 enemigos y economía inicial del core 365. Respeto absoluto: NO modificar JSON, economías, scripts de proyectiles, pathfinding, E1 enemigos ni assets premium torres P03/T04.
- Pintor R7 `public/official/src/maps-visual/m01/r7/dawn-plateau-art.mjs`, **2560×1536 Canvas 2×**, render one-shot.
- Adaptador `public/official/src/maps-visual/m01/r7/renderer-r7.mjs` reutiliza `mountM01WorldV7` intacto, retiene la máquina de estados de sockets, renderer debug y SVG originales, pero sustituye visualmente las capas históricas con la nueva ilustración. Selecciones visibles; hitboxes, torres, soldados, rutas y oleadas controladas por el gameplay autoritativo sin cambios.
- Identidad única R7: horizonte montañoso + ciudadela distante, laderas y río de aguas turquesa con cinco cascadas, bosques, flores, cipreses, pradera, arcos de ruinas, santuario azul brillante, entrada con puerta fortificada y puente final con estandartes. Camino y ocho pads dibujados desde fuentes autorizadas, manteniendo la claridad táctil.
- Entrada `scene.mjs` usa `mountM01WorldR7` en vez de V7 directamente, sigue precargando SVG M07 y ejecutando todas las reglas C1-D8 intactas. R5 panorama utiliza la nueva textura R7 preferentemente, y conserva fuentes M03 originales como fallback; fullscreen FIT no recorta ni estira.
- M02 R6 permanece intacto. Selector y URL pública no cambian; se actualiza query del módulo M01 para evitar caché.

## QA y salvaguardas
- `docs/direccion-general/qa-r7-m01-visual.mjs`: bloqueos SHA JSON/core/M07/M02 y garantías artísticas, contrato ruta/pads.
- `tools/qa-r7-m01-premium-browser.mjs`: Chromium WebGL2 desktop 1280×768 y dos móviles horizontales 844×390, 932×430; textura 2×, screenshot del MAPA JUGABLE, creación de torre, fondo panorámico R7 y regreso al M02 mediante selector.
- CI antiguo para animaciones, impactos, francotirador T10, P03, progreso M01/M02, fullscreen R5 se conserva. Si falla por histórico lock desactualizado, comprobar que el cambio está autorizado y actualizar solo la aserción afectada. Si es defecto real, corregir producto.
- QA visual automático no significa equivalencia pixel-a-pixel con mockup. Pendiente valoración artística y FPS/dispositivos Android físicos.
- Rollback para volver a R6 en commit compensatorio: `90bf7433f969fafcfa72eb1e002d55b5b6b52e29`.
