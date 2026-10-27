# M08-MAP-ART-01 · propuesta original

Base verificada: producción44c5de9ba05f09e1689149a543d27760eb690aaf, PR82 fusionado. Rama feat/m08-map-art-01. Este bloque es exclusivamente un preview artístico aislado; no es un nivel jugable ni está publicado. PR DRAFT y aprobación humana pendientes. Rama documental docs/estudio-td-original-20261027 preservada; AGENTS y roadmap locales conservan modificaciones ajenas excluidas de este commit.

## Contrato y diseño

Fuentes: AGENTS, canon Cartoon2D Premium V1, roadmap, mapas/campaña JSON y patrón modular M07. Overlay GEOMETRIA_ANTES.svg exportado antes de dibujar; CONTRATO.json conserva151+126+126 puntos, tres entradas y salida1313,384, diez centros derivados de spots. Bandas de exclusión decorativa53wu sobre rutas y elipses61×45 alrededor de sockets; son márgenes artísticos, no cambios de hitbox. Campaña19/171 y bossSlot permanecen solo en datos existentes.

Ciudad-observatorio terrestre: arenisca/oliva, bronce astronómico y energía cian, fachadas invadidas por vegetación esmeralda. Piezas grandes de ruina y roca, patio pavimentado en la convergencia y acceso oriental claro. Suelo y camino son capas independientes; los diez pads y cada módulo ambiental son objetos separados. No hay una ilustración monolítica de mapa. No se añaden agua, cascadas o puentes sin justificación topográfica: la propuesta prioriza terrazas y ruinas. Relieve local mediante módulos de roca escalonada, muros y patios elevados; no se altera la superficie de tránsito canónica.

Dos imágenes fuente originales generadas específicamente para el proyecto: atlas de seis props RGBA1536×1024 (observatorio, muro, bosque, patio, roca, sotobosque) y material de hierba/tierra. El atlas se recorta en celdas; terreno cacheado2560×1536 y camino cacheado2560×1536, pads128×96, props512×512. Render estático; no regeneración por frame ni VFX/combate. No se incorporan recursos de KRV ni de otros juegos. Se conservaron los originales de generación en el workspace.

La primera vista mostró terreno plano y hierba geométrica repetitiva; se corrigió con material original antes de las capturas finales. Anclajes principales se combinan con agrupaciones deterministas filtradas por clearance; no se permite solapar cajas decorativas con rutas/pads. Es una propuesta artística: profundidad monumental, densidad y lenguaje final requieren evaluación de Dirección, no se califican como aceptados por pasar tests.

## Evidencias y QA

- tools/qa-m08-art.mjs: PASS403 nodos, inicios/salida, diez pads y conservación de JSON/selector/public previo. Scope limitado a nuevas rutas M08.
- node --check en los tres módulos y npm run build: PASS.
- tools/qa-m08-art-browser.mjs: Chromium real WebGL2 desktop1280×768, touch844×390,932×430 con DPR2: PASS. Sin errores JS, FIT sin overflow, diez pads, todas las cajas decorativas fuera de bandas. Mismo número de objetos/texturas tras destroy/remount; cero texturas m08 restantes tras destroy. Este recuento no acredita ausencia universal de fugas de memoria.
- evidence/report.json registra resultados y cajas de props. Capturas desktop.png, touch844.png, touch932.png y desktop-overlay-after.png son renders auténticos. GEOMETRIA_ANTES.svg procede directamente del JSON; overlay posterior usa esas mismas rutas/sockets sin desplazarlos.
- Memoria teórica de canvases RGBA: dos superficies2560×1536≈30MiB, seis celdas512²≈6MiB y pad≈48KiB, antes de fuentes, duplicados GPU y overhead. No se midió VRAM, FPS sostenido ni memoria real. Teléfonos físicos NOT_RUN.
- Los tableros conceptuales mencionados no están adjuntos a este pedido; el mockup M01 histórico es visible en la conversación, sin archivo local inventado. No se afirma igualdad pixel-perfect con una referencia aprobada de M08. Aprobación estética humana PENDIENTE.

## Revisión y publicación

Preview local: /official/src/maps-visual/m08/preview/; diagnóstico ?overlay=1. No se presenta localhost como enlace público. Las capturas del PR permiten revisión; no se crea un sitio público ni se cambia Render. M08 permanece fuera del selector y sin torres/IA/economía/oleadas/resultados. El LIVE existente no contiene este preview. CI del PR se reporta por su estado real, separado de PASS local.

Rollback: descartar/revertir únicamente este bloque, sin cambiar contratos canónicos ni M01–M07. Siguiente paso: valoración visual de Dirección y correcciones dentro de MAPA-ARTE-08; no iniciar M08-GAME ni fusionar/promocionar sin aprobación estética explícita.
