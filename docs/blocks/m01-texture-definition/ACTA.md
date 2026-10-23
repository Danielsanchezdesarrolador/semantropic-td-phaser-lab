# M01 — definición de texturas cartoon

Orden: mejora exclusiva de definición/lectura del arte existente, sin rework de composición ni cambios funcionales. Base de producción `0fe425839565d00c6b2f6b7ec8f7e4c1fa638765`. Rama `fix/m01-texture-definition`.

## Diagnóstico focalizado y corrección

- Césped y agua se reducían primero a materiales intermedios1x y se ampliaban después hacia texturas2x. Ahora se componen directamente con densidad2x y remuestreo de calidad alta, manteniendo dimensiones aparentes, repetición y transiciones.
- Props grandes de atlas se reducían directamente por el muestreo bilineal de WebGL. Ahora cada tamaño usa una variante preparada a dos texeles por unidad de mundo, mediante reducción de calidad alta, contraste moderado y realce limitado de bordes. Nunca se amplía una fuente pequeña.
- Caras rocosas: contraste de planos y detalle de borde recuperado tras su composición final, con corrección limitada para evitar halos. No cambian coordenadas de pared, alturas, alfa/silueta ni formaciones.
- Camino: mismo ancho/trazado, contorno terroso más definido e interior con manchas más suaves para jerarquizar lectura.
- Plataformas: solo sombra de contacto y contraste del dibujo existente. No se cambian centros, ID, forma, tamaño, hitbox ni lógica.
- Agua/césped: ajuste pequeño y específico de contraste del material; se conserva el tratamiento cartoon y la misma orilla. No se añaden reflejos realistas, efectos ni animación.

No se utiliza NEAREST/pixel art, CSS de nitidez global, zoom, nuevos props ni nuevas imágenes. Todos los PNG originales permanecen byte a byte idénticos. Preparación al montar/primer tamaño, sin trabajo nuevo por frame. El realce de RGB conserva alfa y limita la corrección de detalle a ±12 niveles para controlar halos.

## Lista exacta de producto

1. `public/official/src/maps-visual/m01/style01/texture-definition.mjs` — nuevo, preparación y remuestreo de texturas M01.
2. `public/official/src/maps-visual/m01/style01/fidelity-terrain.mjs` — materiales2x y definición de las caras rocosas existentes.
3. `public/official/src/maps-visual/m01/style01/cartoon-world.mjs` — variantes de props, contraste/sombra del arte existente y versión.

**Assets PNG/SVG modificados: ninguno.** QA: `tools/qa-map-style01-art.mjs` y `tools/qa-map-style01-browser.mjs`; acta/resultados/capturas en esta carpeta. No hay dependencias nuevas ni cambios de configuración global del motor/UI.

## Protección de layout y gameplay

Las siete formaciones y los 37 props deben coincidir exactamente con el JSON del bloque de fidelidad anterior, incluyendo posiciones, tamaños, anclajes y orden. El browser compara esos arrays completos. Se conservan133 puntos de ruta, ocho sockets/IDs/hitboxes, cinco oleadas/63 enemigos, 365oro/100vidas, core, torres, actores, rally, economía, HUD, guardados, selector y demás mapas. Las fuentes protegidas siguen verificándose por hashes.

## QA y límites

- Sintaxis, Node, build y contratos existentes.
- Chromium WebGL2 desktop1280×768 y móviles horizontales844×390/932×430; 932×430 se comprueba además con DPR2. Medir backing de canvas, tamaño CSS, DPR y densidad de cada variante.
- Comparación antes/después con idénticos encuadres; vistas con/sinHUD y detalles a escala real de juego.
- Ocho pads seleccionables/construibles con la UI real, compras/ventas normales y reinicio de la partida de QA; compra Infantería+Francotirador, oleada1 con avance/disparo/baja/recompensa y pausa. No se alteran costes para probar.
- Continuidad FIT, fullscreen, resize y navegación M02/M03/M04 según smoke existente.

**No se cambia la resolución global del canvas ni la cámara para forzar nitidez.** La escena sigue definiendo un canvas lógico1280×768 con FIT y antialias. Se registran los tamaños reales en navegador: pantallas de DPR elevado pueden necesitar ampliación del framebuffer existente. Este bloque mejora la cadena de texturas, no certifica un framebuffer nativoDPR3 ni hardware móvil físico. Cualquier cambio del renderer compartido requiere un bloque técnico y regresión específicos; no se absorbe silenciosamente en este ajuste artístico.

Dispositivos físicos/FPS/VRAM/batería y campaña completa: **NOT_RUN**, smoke proporcional al alcance. La valoración estética final queda pendiente de Dirección. Riesgos: preparación inicial de RGB/variantes adicionales; caché por tamaño y limpieza al desmontar, sin procesamiento por frame. Composición y cantidad de objetos intactas.

Rollback: revert normal del merge del bloque sobre producción, conservando la misma URL oficial y el M01 anterior.

**PASS local**: tres perfiles desktop/844×390/932×430 aDPR1 con smoke completo de arte, ocho construcciones/ventas y combate. El CI añade comparación estricta del layout anterior, auditoría de densidad y perfil932×430 aDPR2. La comparación focalizada antes/después y los tamaños reales del framebuffer se incorporan al informe de entrega.

## Ajuste de preparación y QA final

La primera ejecución de CI alcanzó el límite de70s reales antes del primer tiro en el renderer por software (enemigos avanzando, core de melee activo, cero fugas; no fallo de contrato). Las variantes se agrupan ahora en **un único atlas GPU** con marcos por tamaño en lugar de una textura por variante, manteniendo la densidad2x. La espera de smoke permite hasta120s en software; sigue exigiendo tiro y baja reales, sin acelerar reloj, saltar validaciones o inventar eventos. El CI final valida este HEAD. No se atribuye FPS de dispositivo físico.

El muestreo de la cara rocosa conserva el antialias original y se refuerza RGB después de componer. La comparación focalizada exige mismo SHA256 de alfa antes/después, además de igualdad exacta de37props/sieteformaciones. La preparación no expande siluetas. Los tamaños CSS/backing se registran aDPR1 yDPR2.
