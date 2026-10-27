# M07 — corrección de encuadre del hotfix de fidelidad

Base63d234b4ee40f4b7cea9db86eeb96baa73e1e0f4, rama fix/m07-preview-centering. Parte del cierre visual M07 solicitado por Dirección; no otro rediseño.

La inspección de la captura pública móvil detectó márgenes desiguales. Medida a932×430:161.171875px izquierda y54.171875px derecha. El CSSgrid centraba el canvas y PhaserCENTER_BOTH añadía otro margen. Prueba controlada suprimiendo el margen:107.671875px a ambos lados. La primera prueba de cambiar solo display de grid a block no corrigió el encuadre; no se contó como solución.

Corrección: conservar centrado CSS y desactivar únicamente autoCenter de Phaser en el preview(NO_CENTER). FIT conserva el mapa completo; no hay recorte, reescalado de assets fuente, modificación de rutas, pads, terreno, densidad, gameplay ni HUD. La versión artística sigue m07-hf-mockup-fidelity-v2.

QA añade medida de márgenes horizontales/verticales con tolerancia<1px en PC1280×768 y móvil844×390/932×430DPR2. Se conservan todas las aserciones de geometría, ancho, puentes y lifecycle. El guard de fidelidad admite de forma explícita este único módulo de preview además del alcance artístico anterior; datos,road-geometry,padCanvas y runtime anterior continúan congelados. CI y contenido público se verifican en el PR de esta corrección.

Este ajuste resuelve un defecto de presentación observado al cierre; no se usa para reducir la fidelidad ni para considerar aprobado el arte sin Dirección. Rollback mediante revert del merge de este ajuste; el hotfix artístico y la norma AGENTS permanecen publicados.
