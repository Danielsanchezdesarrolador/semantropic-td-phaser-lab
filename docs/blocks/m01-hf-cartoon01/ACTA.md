# M01-HF-CARTOON-01 — pulido visual

Orden de Dirección: `SEMANTROPIC_TD_CODEX_HOTFIX_M01_CARTOON_PULIDO_VISUAL_2026-10-23.txt`, leída íntegramente; referencias: mockup cartoon y captura real defectuosa del usuario. Base publicada verificada por GitHub: `0cb89bd43ff6ae447332a523b7c5f40dc71c663c`. Rama `fix/m01-cartoon-visual-polish`.

## Resultado y alcance

- Sendero: se sustituyó el polígono con desplazamientos sinusoidales por trazos de anchura constante, uniones cuadráticas suaves, cuatro bandas cálidas, grano muy sutil y piedras espaciadas. Los 133 waypoints del core no cambian; el suavizado es exclusivamente del pincel visual.
- Objetos: seis motivos originales nuevos con siluetas definidas — roble joven, arbusto florido, columna rota, barril con madera, trigo y roca con hiedra. Se conservan las fuentes originales y los atlas anteriores. El atlas se descompone en sprites transparentes, sin convertir el mapa en una imagen plana.
- Variedad: 29 → 45 props aceptados, agrupados junto a ruinas, árboles, suministros y margen inferior; 101 objetos visuales frente a 69. Sombras y orden por pie conservados. Cada rectángulo completo mantiene distancia del camino y sockets.
- Continuidad: el roble anterior partía de x=-10 y quedaba recortado por FIT; ahora ningún prop del mapa cruza los límites laterales. Camino y extensión usan el mismo pincel en coordenadas mundiales.

## Diagnóstico de la línea: hechos y límites

La captura del usuario muestra una línea lateral. En una reproducción del **commit publicado actual**, a 1917×990, no se reprodujo esa línea en el interior del camino: cinco filas interiores ya presentan RGB iguales a ambos lados. Por tanto, **no se atribuye una causa exacta comprobada a aquella línea**. Sí se verificaron un árbol recortado en el límite de FIT y bordes del camino irregulares. Ambos se corrigieron. Se añadió QA de la imagen real en pantalla a ambos lados del FIT (cinco muestras interiores por lado, diferencia máxima de canal ≤3), además de comparación visual desktop/móvil/ancho. No se modificó el viewport compartido ni se ocultaron costuras con paneles sobre el juego.

## Protección

Fuera de alcance y sin cambios: core, datos, ruta, ocho pads, 365 oro, 100 vidas, cinco oleadas / 63 enemigos, combate, torres, actores, HUD, viewport R5, M02/M03/M04, guardados, AGENTS.md y roadmap. La nueva orden cartoon de Dirección prevalece para M01 sobre la instrucción pictórica histórica de AGENTS; se registra aquí sin modificar ese reglamento.

No se añade puente decorativo sobre la ruta: no existe cruce canónico de agua que lo justifique. No se rediseñan portal, enemigos ni torre por esta tarea.

## QA

- **PASS**: sintaxis, contrato de arte/geometría y hashes de fuentes protegidas; comprobaciones Node B01/B02/B04/M04-HF1/R7.
- **PASS**: build Phaser 4.2.1; Chromium WebGL2 real en desktop 1280×768 y móviles horizontales emulados 844×390 y 932×430.
- **PASS**: 8/8 pads con entrada real, 407 muestras de recorrido, props sin solapes con camino/pads, fondos y sprites independientes, navegación M02/M03/M04 y M05 cerrado.
- **PASS**: compra Infantería + Francotirador, 365→130 oro; oleada 1 con disparo real, muerte/recompensa →146 oro; 100 vidas, pausa funcional, cero errores JS.
- Capturas: `antes-*.png` / `despues-*.png`, misma cámara. Las capturas anchas reproducen localmente la base exacta publicada y el hotfix. Las anteriores desktop/móvil provienen de la verificación pública del bloque previo.
- **NOT_RUN**: dispositivos móviles físicos, FPS/GPU físico y campaña completa; bloque exclusivamente artístico, smoke proporcional.
- **PENDIENTE**: aprobación estética de Dirección; QA técnico no certifica equivalencia artística con el mockup.

QA CI y publicación se registran en la PR y en el informe final de entrega con sus SHAs y fecha real. No considerar este acta prueba de publicación por sí sola.

## Archivos y reversión

Producto: `public/official/src/maps-visual/m01/style01/cartoon-world.mjs` y `public/official/art/maps/m01/style01/details-atlas-original.png`. CI: `.github/workflows/b01-map-art-qa.yml` descarga historia completa para que los contratos comparen contra el SHA histórico incluso después de otros merges (el checkout superficial falló antes de ejecutar navegador). QA: `tools/qa-map-style01-art.mjs`, `tools/qa-map-style01-browser.mjs`; acta, manifiesto, QA y capturas en esta carpeta. No hay dependencias nuevas.

Rollback: revertir el merge de este hotfix mediante PR normal sobre producción; conserva el bloque STYLE01 anterior y todos los sistemas. Riesgo: mayor número de sprites y una textura original adicional; extracción al montar, ningún procesamiento nuevo por frame. Rendimiento en hardware físico sin medir.

Revisión del Director: recorrer visualmente la entrada y salida en pantalla ancha, bordes y curvas del sendero, nitidez de arbustos/ruinas/trigo y lectura de los ocho pads en móvil. Si reaparece la línea en su dispositivo, registrar resolución/navegador y captura para reproducirla; no se presenta una causa supuesta como comprobada.
