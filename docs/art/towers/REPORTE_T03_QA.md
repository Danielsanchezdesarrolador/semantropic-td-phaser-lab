# T-03 — Control de calidad y transferencia

Estado: PROTOTIPO NO APROBADO. Cuatro SVG originales rediseñados, cuatro SVG baseline, nuevo catálogo de anclajes, galería Phaser, VFX solo visuales y manifest v2.

[INSPECCIÓN ESTÁTICA] Revisión de contenido de archivos en rama T03 y parser JS del render. [NO EJECUTADO] node --check real en clon, qa-t01, qa-t03, npm run build, Chrome/Firefox WebGL2, FPS, capturas reales 1280x768, 844x390 y 932x430 o dispositivo físico.

[SIN IMPLEMENTAR] Daño, economía, cooldown, IA, compra, subida de nivel efectiva, combate real y animaciones de actores P. Ruinas a la espera de eventos core.

QA posterior: node --check public/official/src/towers-visual/catalog.mjs; node --check public/official/src/towers-visual/fx.mjs; node --check public/official/src/towers-visual/showcase.mjs; node docs/art/towers/qa-t01.mjs; node docs/art/towers/qa-t03.mjs; npm install && npm run build. Después abrir dist/official/src/towers-visual/index.html bajo servidor estático. Inspeccionar botones, comparación, zoom, anchors, FX A/B, pausa, limpiar durante disparo, 10 ejecuciones rápidas sin VFX fantasma.

Integrador debe probar pads reales, profundidad, legibilidad móvil y operador P antes de aprobación. PR hacia feature/phaser-torres; prohibido merge autónomo, edit shared, Render o integration/c1a-visual. Discrepancia Infantería III abierta.
