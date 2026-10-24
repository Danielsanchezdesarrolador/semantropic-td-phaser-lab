# MAP-ART-M02-CARTOON-03 — más cartoon

Orden adjunta24/10/2026: arte exclusivo de M02 «Campos del Molino». Base de producción `7fbec3b616ebb35a400767cb15d8c53b8f377aef`; rama `art/m02-cartoon03`. Canon Cartoon2D PremiumV1 vigente, equipo central único.

## Estado real y referencia

[CONFIRMADO EN CÓDIGO] La base activa era B02 pictórico, no una versión cartoon ya publicada. Se conservan B02 y R6 íntegros como historial/rollback. El identificador Cartoon03 corresponde a la orden de Dirección.

La imagen51165.jpg define intención de estilo rural, molino, agua, puentes y riqueza ambiental; no se copia su composición ni se usa como fondo. Su HUD muestra365oro; la economía real M02 es395. No se adopta el valor de la referencia ni se mueven pads para imitarla. Se conserva la herradura canónica163puntos/ocho pads, siete oleadas/80enemigos y100vidas.

## Decisiones visuales implementadas

- Molino original de silueta más rotunda: cuerpo claro, tejado rojizo, aspas grandes y puerta azul. Granja, árboles, trigo y carro comparten contornos oliva, sombras por planos, formas expresivas y luz desde arriba izquierda.
- Materiales nuevos separados: vista rural, césped de masas ilustradas y agua de espuma gráfica; acantilados de grandes facetas de piedra cálida con corona verde. Nada de texturas fotográficas, simulación de acuarela ni filtro global que afecte UI/actores.
- Seis parcelas agrícolas identificables; cercas y pequeños grupos de flores respetan las superficies tácticas. Canal de riego con fuente, cruce del sendero mediante puente y caída sobre la misma ribera hacia el río frontal. Un segundo puente es decorativo sobre el agua, sin ruta o pad nuevo.
- Pads de arenisca cálida, borde, espesor, juntas gráficas y sombra de contacto; mantienen exactamente IDs, centros, hitboxes y estados del adapter original.
- Camino nominal84→62wu,26% más delgado. Spline cúbicaC2, bordes controlados, textura interior escasa.162segmentos/8262muestras, desviación máxima0,212876wu respecto de la ruta real; radio mínimo76,9518wu frente semiancho31. Las características matemáticas no certifican por sí mismas aprobación artística ni «perfección» subjetiva.

## Integración y recursos

Capas independientes en Phaser para terreno, ribera, canal, cultivos, camino, puente y detalles; props originales individuales en un atlas y ocho pads compartiendo textura pequeña. Los materiales/atlases NO son un mockup de mapa aplanado. Dibujos, máscaras y extracción de alfa se preparan una vez al cargar/montar; no hay lectura ni procesamiento de texturas por frame.

Última optimización: canal y ribera se hornean en regiones útiles; puente160×160wu; pad compartido104×80wu. Se evita reservar un canvas de mapa completo para cada uno de esos elementos. Esto es reducción de superficies de textura por dimensiones, no medición de VRAM/FPS físicos. Se conserva renderer/WebGL2/canvas global.

Producto:
1. `public/official/src/maps-visual/m02/phaser-world.mjs` — únicamente conecta el arte nuevo; API/estados/sockets originales.
2. `public/official/src/maps-visual/m02/cartoon03/farmland-world.mjs` — composición modular/props/márgenes FIT.
3. `public/official/src/maps-visual/m02/cartoon03/surfaces.mjs` — superficies agrícolas/agua/roca/puentes/pads.
4. `public/official/src/maps-visual/m02/cartoon03/road-geometry.mjs` — spline/dibujo M02, independiente de M01.
5. `public/official/src/maps-visual/m02/cartoon03/atlas.mjs` — carga, aislamiento y atlas rural.

PNG nuevos: `rural-atlas-original.png`, `materials-original.png`, `cliffs-original.png` en `public/official/art/maps/m02/cartoon03/`. Creaciones originales mediante image_gen, sin recortar recursos de la referencia ni sustituir PNG históricos. Dimensiones/SHA256 en `manifest.json`.

QA: nuevos `tools/qa-m02-cartoon03-art.mjs`/`qa-m02-cartoon03-browser.mjs`, dispatch en `qa-r6-m02-premium-browser.mjs`, actualización limitada del hash autorizado del adapter y su aserción en los contratos R6/R3, workflowB02. No se relajan hashes de core/UI/otros mapas; diff público solo permite el adapter y las carpetas nuevas M02.

## QA y entrega

[PASS] B02 protegido, R6/R3C, Node, build, alcance público, continuidadC2/radio/alineación.

[PASS LOCAL] Smoke de primera integración PC1280×768,844×390 y932×430DPR2: cada perfil con navegador independiente, ocho build/sell reales (395→123oro), reinicio normal, compras normales de Francotirador+Infantería (395→160), tiro y baja del core, pausa. Desktop navega M01/M03/M04 y conserva versión M01-HF-GEOMETRY-01.

[PASS LOCAL FINAL] Después de reducir superficies regionales, revisión de render/layout/anchos/pads compartidos y FIT en PC y932×430DPR2. `qa-final-render.json`. El informe del smoke anterior se conserva como `qa-local-pre-regional-optimization.json`; no se confunde esa iteración con el CI final.

[PENDIENTE AL REGISTRAR] CI sobre el commit final, integración y publicación verificadas. Se anotarán los resultados reales en PR/informe de entrega; no se presenta el sitio anterior como nuevo.

Capturas reales antes/después con igual cámara/zoom: PC1280×768 y móvil844×390, HUD oculto únicamente en la prueba. La referencia manda el lenguaje artístico; el layout real explica la composición distinta, molino situado junto a la herradura y puente sobre el riego.

[NOT_RUN] Móvil físico, campaña completa, FPS/VRAM/batería. Aprobación estética final pendiente de Dirección. No se modifican economía, oleadas, vida, daño, estadísticas, progresión, balance, torres, actores, HUD, UI ni otros mapas.

Rollback: revert normal del merge en producción; canal oficial único https://semantropic-td-jugar.onrender.com/official/src/live/ . No se crean sitios nuevos ni se reinician sistemas.
