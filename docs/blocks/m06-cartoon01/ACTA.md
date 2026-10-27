# MAP-ART-06-CARTOON-V1 — Desfiladero de Hierro / El Anillo de la Mesa

Orden de Dirección 26/10/2026: exclusivamente arte de M06, referencia adjunta `evidence/mockup-direction.jpg`. Base de producción `9696f897e4872a12d75e8bb709ff171d15090a87`; rama `art/m06-cartoon01`. Canon Cartoon 2D Premium V1, AGENTS y contratos leídos.

## Estado y alcance

La base no tiene un M06 artístico/campaña Phaser. La carpeta histórica `maps-visual/m01/m06` corresponde a una revisión M06 de M01, no al mapa 6. Se añade un preview M06 aislado en el mismo sitio Render. No se añade M06 al selector ni se implementa campaña. M01–M05 y TODOS los archivos públicos anteriores permanecen byte idénticos; la guarda verifica sus blobs.

Solo nuevos módulos `maps-visual/m06`, tres PNG originales `art/maps/m06`, QA, CI y documentación del bloque. No se editan mapas/campaña JSON, Canvas V5, cores, torres, enemigos, economía, HUD, audio, guardados o selector.

## Contrato y geometría

Mapa canónico id6, dos rutas de 243 puntos cada una (486 entradas contando el tramo compartido), nueve pads. IDs `m06-pad-01`…`09`; centros originales calculados desde spots. Primera entrada oeste (-42,180), segunda sureste (1185,807), salida común (1315,170). Ningún punto ni ID se modifica.

Pintura del camino: ancho nominal 58 unidades, curvas cúbicas uniformes C2. Acondicionamiento exclusivamente del polígono visual: 31 pasadas binomiales más la pasada interna del spline. Radios mínimos medidos ≈49.08 y 32.11, mayores que media anchura +2: evita pliegues de offsets. Desviación visual máxima ≈11.86/10.48, contenida dentro de la semianchura útil; el recorrido real no cambia. C2 y extremos se verifican numéricamente, y navegador mide ancho en estaciones alejadas de la confluencia. La unión de rutas se ensancha naturalmente; no se interpreta esa confluencia como fallo de ancho.

## Aplicación artística y comparación con mockup

1. Identidad de cañón: paredes de arenisca roja/terracota con facetas grandes, arena ocre, vegetación seca escasa, cactus, acacias, mineral de hierro, minas, carro/cajas/barril y cristal de salida. Contornos y planos de color estilizados.
2. Profundidad: máscara de mesetas y extrusión frontal de 104 unidades, caras oscuras bajo tapas iluminadas, pequeñas mesas laterales y fondo lejano de buttes. Superficies, relieve, agua, sendero, puentes, pads y props son objetos/capas separados de Phaser. No se pega el mockup como fondo: la imagen panorámica original solo representa el horizonte distante.
3. Agua y minería: dos canales abren grietas en las mesetas. Tres puentes curvos siguen el mismo spline y llegan a ambos bancos. Una caída estática conecta un escalón del canal con el tramo inferior; no hay animación/VFX ambiental nueva. Props con apoyo en tierra, sombras y exclusión de todo camino/pad.
4. Camino: mismo ancho y gradación geométrica por ruta, textura tenue, bordes limpios, continuidad hacia los límites FIT. Los márgenes son extensión escénica reflejada; no representan rutas nuevas ni cambian el mundo jugable.

El mockup define estilo y bioma, no layout. El resultado mantiene dos entradas oeste/sureste y confluencia canónicas, por eso difiere de las curvas, posiciones de plataformas y puentes de la referencia. El set minero es compacto; no replica cada grúa/pasarela del mockup ni afirma fidelidad píxel a píxel. Calidad estética final: PENDIENTE de Dirección, no deducida de PASS técnico.

## Assets originales y modularidad

- `canyon-props-original.png`, 1536×1024 RGBA: mina, carro/cajas/barril, cactus, acacia, mineral y portal; recortes alpha en runtime, sin sobrescribir fuente.
- `canyon-materials-original.png`, 1536×1024: arena, dos variantes de pared y agua. Materiales recortados sobre máscaras de terreno, no una ilustración completa de mapa. Baldosas reflejadas para conservar continuidad de borde.
- `canyon-horizon-original.png`, 1536×1024: solo escenografía lejana, detrás de las superficies.

Generados originalmente para este bloque con imagegen; sin assets de terceros ni copia de otro videojuego. Dirección proporciona el mockup de referencia. PNG sin conversión destructiva. Superficies a 2560×1536 mostradas a 1280×768; props fuente mayores que tamaño final, Phaser4.2.1/WebGL2 antialias/FIT. No se altera resolución global ni filtros del juego. Ninguna medición de GPU/FPS físicos se inventa.

## Before/after y QA

`before-canvas-v5-1280.png`: render original Canvas V5 a 1280×768, referencia histórica, no un supuesto Phaser anterior. Captura mediante navegador y selección M06. Para desbloquear la selección se utilizó un perfil QA efímero local `completedAny[5]`, sin tocar archivos ni datos reales. `before-canvas-v5.png` conserva además la captura con overlays legacy. Después: captura real Phaser desktop y móvil horizontal, más overlay de ambos recorridos y nueve pads.

Comandos reproducibles:

- `node tools/qa-m06-cartoon01-art.mjs`: alcance exclusivo, todos los archivos públicos previos congelados, tamaños fuente, rutas/pads y continuidad/radios/desviaciones.
- `npm run build`.
- `node tools/qa-m06-cartoon01-browser.mjs`: Chromium real WebGL2, 1280×768, 844×390 y 932×430 DPR2; apoyo de nueve pads, ruta completa sobre tierra/puentes, bancos conectados, props despejados, ancho real, caída con fuente/basín, FIT/overlay, restart/disposal y smoke LIVE M01/M02/M05. Selector sigue 1–5 y no carga assets M06.

Resultados y capturas locales en evidence; CI/publicación final se registran en PR y entrega. QA humano/Android/iPhone físicos: NOT_RUN. Jugabilidad M06: NOT_IMPLEMENTED / NOT_AUTHORIZED. No se presenta el preview como campaña jugable.

## Publicación y rollback

Tras CI verde del HEAD exacto, integrar mediante PR al canal `production/semantropic-td-live`; Render automático en el mismo sitio. Verificar archivos publicados y preview real antes de anunciar LIVE. URL de revisión artística: `/official/src/maps-visual/m06/preview/`. Juego oficial sin cambios: `/official/src/live/` (M01–M05).

Rollback reversible: revertir merge del bloque por PR; solamente añade archivos aislados, sin migraciones ni modificación de guardados. No borrar ramas históricas ni reiniciar servicios. La suite general histórica R7 presenta un fallo previo en producción (registrado en M05-GAME-01); este bloque no modifica su ámbito.

## Gates locales del candidato

| Gate | Estado |
|---|---|
| Alcance y archivos públicos anteriores | PASS |
| Dos curvas C2, radios y extremos | PASS |
| Phaser/WebGL2, PC + 844×390 + 932×430 | PASS |
| 9 pads, rutas apoyadas, 3 puentes, props despejados | PASS |
| Reinicio, texturas/objetos y smoke M01/M02/M05 | PASS |
| Juntas de camino FIT ancho 1917×990 | PASS, diferencia RGB 0 en ambas juntas |
| CI del HEAD y publicación Render | PENDIENTE al redactar; registrar cierre en PR/entrega |
| Móvil físico / aceptación estética humana | NOT_RUN / PENDIENTE |
| Campaña jugable M06 | FUERA DE ALCANCE |

## Corrección final de apoyo de la caída

La revisión de la captura pública de PR74 detectó que el labio rocoso central terminaba dentro del canal y podía leerse flotante. Se amplía exclusivamente ese pequeño labio estático hasta ambas orillas, con facetas de roca, sin tocar flujo, máscara de terreno, senderos, puentes o pads. El navegador verifica ahora apoyo en tierra Y píxeles opacos del labio dibujado en x±43 respecto al centro de la caída. Corrección dentro del mismo bloque artístico, rama `art/m06-cascade-support`, base PR74 `8642ff5ab30ba3b5f9fa56cf3f790c246c497154`. Repetir CI y comprobar el archivo publicado antes de entrega final.
