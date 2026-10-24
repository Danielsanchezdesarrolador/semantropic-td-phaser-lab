# MAP-ART-03-CARTOON-V1 — Bosque de los Susurros

Orden del Director: adjunto `SEMANTROPIC_TD_PROMPT_CODEX_M03_CARTOON_2D_PREMIUM_CAMINO_GEOMETRICO_2026-10-24.txt` y mockup `51198.jpg`, 24/10/2026. Alcance exclusivo: arte de M03. Base de producción comprobada: `58b3e79e19a1d7ab16282a39bded4e8a32756568`. Rama `art/m03-cartoon01`. Versión `m03-cartoon01-enchanted-forest-v1`.

## Resultado y límites

Suelo vivo de la familia cromática M02, robles redondeados originales con árbol ancestral, grupos de helechos/hongos/flores, arcos musgosos, tronco y runas turquesa. Costas con facetas grandes, pequeñas repisas, corriente forestal y caída estática conectada al río inferior. Composición por seis superficies Phaser independientes, ocho sprites de pad y props individuales con pivote de raíz, sombras y orden por pie; atlas de seis componentes alpha aislados. Panorama FIT solo de terreno, con continuidad de camino propia. El mockup nunca se rasteriza como mapa.

El arroyo y su cruce se adaptan al camino REAL, no al trazado S ilustrativo. El puente sigue la misma curva y anchura que el camino; barandas a 42wu de su centro y soportes fuera del corredor. Su emplazamiento se separa de los pads, tras detectar una invasión en el primer prototipo local. La corriente/cascada nuevas son estáticas. Los 17 motes/ripples históricos y su pausa/reduced-motion permanecen sin cambios; no se añaden animaciones ambientales.

No se cambia motor, renderer común, DPR, UI, actores, torres, campaña, economía, combate o mapas M01/M02/M04. Las imágenes pictóricas y funciones antiguas quedan conservadas como historia, sin usarlas como objetivo artístico nuevo. La escena y sus preloads históricos permanecen iguales; este bloque no es una optimización global de carga.

## Camino medido

- 188 puntos autoritativos intactos, 187 segmentos cúbicos B-spline con continuidad C2, incluyendo derivadas primera y segunda.
- Ancho exterior constante: **62wu**, frente a **83wu** anteriores; interior de arena 57wu. Huella canónica máxima: radio 17wu; holgura lateral nominal superior a 13wu.
- 9.537 muestras: desviación máxima al recorrido **0,243274wu**, radio de curvatura mínimo **61,186686wu**, superior al semiancho 31wu. Prueba adicional de cruces no locales de ambos offsets.
- Una sola función de pintura para mundo y márgenes FIT, prolongación tangente visual de 2.200wu fuera de cada extremo; ningún spawn/punto/velocidad cambia.
- El puente tiene tablero de **62wu** y sigue el mismo eje. Los acentos de arena se retiran de los 24wu inmediatos a los bordes para continuidad raster del FIT.
- La geometría es exacta en unidades mundo; el antialias y la lectura de píxeles introducen cuantización. El reporte de navegador registra mínimo/máximo raster, no una supuesta perfección píxel a píxel a toda escala.

## Archivos y fuentes

Lista exhaustiva de producto y blobs protegidos en [manifest.json](manifest.json). Seis módulos visuales M03: `forest-art.mjs` (solo versión), `phaser-world.mjs` (adaptador), `cartoon01/assets.mjs`, `forest-world.mjs`, `road-geometry.mjs`, `surfaces.mjs`. Un PNG nuevo: `public/official/art/maps/m03/cartoon01/forest-atlas-original.png`, generado originalmente para este bloque, 1536×1024 RGBA, sin copiar píxeles del mockup. Se extraen seis componentes independientes y se preparan una sola vez en atlas 2048×640. Los dos PNG originales M02 de materiales y acantilados se leen sin modificar; ninguna granja, trigo ni molino se incorpora.

QA dedicado en `tools/qa-m03-cartoon01-{art,geometry,browser}.mjs` y workflow `m03-cartoon01-qa.yml`. No se añade ninguna dependencia ni se cambia lockfile. La emulación local usa Chromium de sistema con WebGL2/SwiftShader; CI usa Chromium de Playwright.

## Evidencias y estado

- [Después desktop](after-desktop-art-no-hud.png), [después móvil](after-touch844-art-no-hud.png), [combate real](after-desktop-combat.png).
- [Antes desktop](before-desktop.png), [antes móvil](before-mobile.png), [referencia M02 real](reference-desktop.png), [medición geométrica](road-geometry.json).
- [CONFIRMADO EN CÓDIGO] 8 pads / 188 puntos / 9 oleadas / 101 enemigos, distribución `[8,8,10,8,8,9,15,14,21]`, 410 oro y 100 vidas de runtime. El HUD ilustrativo 385 / 1/8 del mockup NO se aplica.
- [PASS] Node: campaña completa canónica, scope protegido, continuidad/curvatura/alineación y offsets; build Phaser.
- [PASS] Navegador final WebGL2: PC 1280×768, móvil 844×390 y 932×430 DPR2; ocho selecciones/construcciones/ventas por perfil, oro correcto, ataques y baja real, pausa, FIT ancho y regresión M01/M02/M04 sin errores JavaScript. Ancho raster en 343 secciones: **61,5–62,75wu** (62 nominal); continuidad FIT: delta RGB 0 en ambas uniones. Reporte [qa-local.json](qa-local.json).
- [PASS] CI del producto `6dc0c2e9b90a56179703d1f4d30a3c3db826f845`: [40107580572](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/40107580572), incluido navegador de tres perfiles. El commit posterior solo incorpora estas evidencias, sin cambios de producto.
- [PENDIENTE AL REGISTRAR] Integración y publicación: comprobación de SHA público/bytes y smoke LIVE se registrarán en el PR e informe de entrega. No se anuncia LIVE antes de verificarlos.
- [NO EJECUTADO] dispositivo móvil físico, FPS/VRAM de hardware, campaña completa de nueve oleadas en navegador en este bloque artístico. La campaña completa sí se prueba en Node; el navegador prueba entrada, ocho construcciones/ventas, compras normales, disparo/muerte, pausa, resize/FIT y navegación de regresión M01/M02/M04.
- [PENDIENTE] aceptación estética del Director. QA técnico no la sustituye. Diferencias deliberadas con mockup: trazado, altura/posición de relieves, río y puente adaptados a layout real, ocho pads en sus centros reales.

Rollback: revertir el merge del PR de este bloque en producción, conservando la misma URL y guardados; base visual anterior `58b3e79`. No force/rebase ni nuevas URL públicas.
