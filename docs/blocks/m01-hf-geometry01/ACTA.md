# M01-HF-GEOMETRY-01 — camino, entrada y decoración

Orden expresa de Dirección adjunta el23/10/2026, retomada24/10UTC. Base producción `0228fc599eda59287196e1445332f58ac6bb6e31`, rama `fix/m01-road-entry-decoration`. Un bloque visual de M01; no rework total.

## Confirmado en código

- Camino: spline cúbica uniforme con132segmentos Bézier y continuidad C2 (posición, tangente y segunda derivada continuas). Ancho exterior fijo64wu frente79wu anterior (19% más fino); interior59wu frente72wu. Sin triángulos/manchas en el borde; acentos interiores reducidos y contenidos. La misma curva/pintura se usa en textura y prolongación FIT. No se editan waypoints.
- Alineación:6732muestras; desviación máxima0,328166wu respecto de la polilínea canónica. Radio mínimo45,0394wu >32wu del semiancho exterior: la cara interior no se pliega por radio insuficiente. La perfección percibida sigue sujeta a valoración humana; los resultados matemáticos no sustituyen aprobación artística.
- Spawn: el core empieza en(-32,342), fuera del canvas. En FIT ancho el panorama continuaba pero los actores se recortaban en el borde físico. Se introduce un acceso rocoso estático por capas: hueco sombreado tras el camino y labio frontal irregular que cubre hasta24wu de la entrada. Los actores originales emergen de detrás del saliente; no se modifica spawn, animación, posición, movimiento, escala, máscara de enemigos ni reloj.
- Entrada y margen usan las mismas dos texturas regionales2x (560×460), sin capturas del framebuffer ni trabajo por frame. Se conserva camino visible hasta el acceso. La oclusión intencional queda acotada a la entrada; no se añaden obstáculos de gameplay.
- Decoración: cinco árboles (dos robles/tres robles jóvenes), tres arbustos, cuatro grupos de flores y un grupo pequeño de rocas. Conserva los37props anteriores sin mover/reescalar; total50. Cada nuevo prop respeta margen54wu a ruta,57wu a pads, soporte del suelo y separación6wu de otros props. Árboles asentados sobre la pradera, fuera del horizonte. Siete formaciones/acantilados y ocho plataformas originales intactos.

## Archivos de producto y assets

1. `public/official/src/maps-visual/m01/style01/cartoon-world.mjs`: integración, decoración y continuidad del acceso con FIT.
2. `public/official/src/maps-visual/m01/style01/road-geometry.mjs`: nuevo, spline y dibujo de ancho uniforme.
3. `public/official/src/maps-visual/m01/style01/entry-access.mjs`: nuevo, acceso rocoso por capas.

PNG/SVG originales modificados o añadidos: **ninguno**. Se reutilizan atlas originales y el pipeline de definición/atlas del bloque PR64. No se cambia relieve/materiales, renderer global, viewport compartido, HUD, UI, torres, actores, core, economía, campaña ni otros mapas.

QA: `tools/qa-map-style01-art.mjs`, `tools/qa-map-style01-browser.mjs`, nuevo `tools/qa-map-style01-road-geometry.mjs`. Sin dependencias nuevas.

## QA y evidencia

- PASS Node/contratos: fuentes protegidas exactas,133nodos/ocho pads,365oro/100vidas/cinco olas63enemigos; baselineM02/R6 y runtime intactos.
- PASS geometría: continuidadC2, curvatura sin pliegue, alineación; ver `road-geometry.json`.
- Browser: raster del camino medido en normales a la curva,64wu con tolerancia1,5wu por raster2x; props existentes y formaciones iguales; nuevos props con soporte/clearance; ocho build/sell reales, combate tiro+baja, pausa/fullscreen y navegaciónM02–M04.
- Entrada: secuencia real sin defensa, pausa con botón al pasar x=-8,28,70; capturas auténticas y coordenadas del core. No se invoca tick ni se aceleran actores para fabricar evidencia.
- FIT ancho1917×990: salida con prueba de arena plana; entrada con comparación contra su textura preparada, promedios5×5 para admitir la diferencia de filtros WebGL/2D en texeles de roca (la anterior comparación píxel plano de arena no correspondía al nuevo saliente). Se exige cobertura opaca del corte y diferencia mediaRGB≤10.
- Referencias before: Chromium local sobre dist del producto publicado0228fc5, mismo encuadre. Capturas after y resultados del navegador se incorporan al informe/artefactos de CI.

**PENDIENTE al registrar esta acta:** final del navegador, CI, integración y comprobación de publicación. No atribuir PASS anticipado.

**NOT_RUN:** móvil físico, campaña completa, FPS/VRAM/batería. Aprobación visual final: pendiente de Dirección. Canon Cartoon2D PremiumV1 preservado; no se afirma fidelidad automática ni perfección estética certificada.

Rollback: revert normal del merge de esta PR en producción; misma URL oficial. No reinicios de sistemas ni sitios públicos nuevos.

La QA añade ataque a un enemigo que ya superó x70 mediante compras UI durante la pausa y reanudación normal. Exige tiro, baja y desaparición de ese mismo ID: prueba focalizada de combate más allá del labio de entrada (x≤24), sin fabricar eventos ni editar reglas. Evidencia `entry-visible-combat.png` en CI.
