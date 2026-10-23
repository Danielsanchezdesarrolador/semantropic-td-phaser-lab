# M01-FIDELIDAD-CARTOON-01

Orden: `SEMANTROPIC_TD_CODEX_PROMPT_MAESTRO_M01_FIDELIDAD_VISUAL_CARTOON_EXACTA_2026-10-23.txt`, leída íntegramente. Referencia aprobada: imagen adjunta 1672×941 con mesetas cartoon y sin HUD. Se usa como dirección de diseño, nunca como mapa plano o fuente de recortes. Base de producción `28a861fd92f7c21b8b4d2da3c992bb310544a8db`; rama `feature/m01-cartoon-fidelity`.

La orden artística vigente prevalece para M01 sobre las referencias pictóricas históricas. No cambia AGENTS ni roadmap ni autoriza extender este trabajo a otros mapas.

## Ficha de seis zonas antes de implementar

| Zona | Sirve del M01 publicado | Falta respecto a la referencia / trabajo visual |
|---|---|---|
| Fondo / horizonte | Mundo 1280×768 y extensión FIT | Montañas y colinas con planos cel shading; material de suelo menos pictórico. |
| Pradera elevada izquierda | Dos grupos de ruinas y suministros | Meseta con frente rocoso, espesor de césped, masas arbóreas con contorno fuerte. |
| Gran curva central | 133 waypoints y separación de zonas tácticas | Arena con borde orgánico fino y textura jerarquizada; evitar cinta de cuatro bandas lisas. |
| Meseta / portal superior derecha | Hito de cristal y sockets reales | Geografía elevada y sombra de pared; portal y vegetación del mismo lenguaje de contornos. |
| Plataforma central-inferior | Centros e IDs de los ocho pads | Base pétrea empotrada, relieve alrededor y transiciones de suelo; ningún desplazamiento funcional. |
| Borde acantilado / río inferior | Frente paisajístico y agua sin mecánica | Roca angular con pared visible, orilla irregular, agua cartoon independiente y continuidad lateral. |

## Protección

Solo módulos/arte visual M01, QA y evidencias del bloque. Cero cambios a los 133 puntos, ocho sockets/hitboxes/IDs, 365 oro, 100 vidas, cinco oleadas/63 enemigos, core, torres, actores, rally, HUD, selector, guardados y M02–M05. La geometría funcional obliga a adaptar distancias y contornos del mockup: no se estiran sprites anisotrópicamente ni se escalan ruta o mundo.

## Adaptación implementada

Cuatro fuentes originales nuevas: atlas de materiales (panorama / césped / agua), tres secciones de pared rocosa, seis motivos de naturaleza y cuatro estructuras. Se conserva el atlas de detalles original del hotfix anterior para trigo, ruinas menores y suministros secundarios. No se utiliza el mockup como imagen o mosaico del nivel.

Siete formaciones: meseta arqueológica izquierda, elevación del pad interior, terraza del portal, terraza derecha adaptada a la cercanía de la ruta, elevación inferior izquierda, elevación central inferior y frente de roca/río. Suelo superior, paredes y agua son texturas/capas Phaser independientes. Las columnas de roca ilustradas se disponen a lo largo de bordes diseñados y mantienen escala uniforme del motivo original; se recorta su extremo para integrarlo como ladera, sin estirar sprites en dos ejes.

La tierra y el agua usan materiales originales de escala controlada; los solapes se funden al rasterizar una vez. No hay lectura de píxeles ni generación nueva de paisaje por frame. Las texturas panorámicas para FIT incluyen solo geografía, nunca pads, portal o decorados duplicados.

El sendero mantiene su trazado; tiene borde de tierra más fino, arena cálida, manchas de material y césped marginal, sin marco verde de cuatro bandas. Los pads conservan posiciones/IDs y reciben piedra cálida, base corta y sombra/contacto de tierra. Árboles, arcos, rocas, portal, carro y cercos usan originales de contorno más claro. La colocación se comprueba contra ruta, pads, paredes de roca y orilla; no se ponen raíces sobre agua o cara de acantilado.

## Matriz de fidelidad (evaluación interna, no aprobación de Dirección)

| Criterio | Estado visual | Evidencia / límite concreto |
|---|---|---|
| Estilo cartoon | PASS | Contornos oscuros y masas de luz/sombra más claras; desaparece el terreno pictórico anterior. |
| Relieve / mesetas | PARCIAL | Siete formaciones y paredes visibles; la referencia posee más interrupciones y escalones, mientras el frente inferior aquí continúa por claridad del trazado canónico. |
| Carretera | PARCIAL | Borde terroso fino y arena/material integrado; la distribución de curvas y la proporción relativa de terreno libre siguen el M01 real, no la geometría diferente del mockup. |
| Pads | PASS | Ocho centros/IDs originales, piedra apoyada y suelo visible; no se ha simulado altura funcional ni movido hitboxes. |
| Props | PARCIAL | Dos zonas de ruinas y originales nuevos; menos densidad y variedad de agrupaciones que en la referencia por márgenes conservadores de lectura táctica. |
| Portal | PASS | Hito azul superior derecho apoyado en terraza, sin cambiar su función; diseño original adaptado, no copia exacta del cristal del mockup. |
| Agua / bordes | PARCIAL | Agua cartoon separada y frente rocoso; se mantienen una ribera continua y menos islotes que en la referencia. |
| Perspectiva | PASS | 2D 3/4, sprites con escala uniforme, anclaje por pie; relieve únicamente visual. |
| Claridad de combate | PASS | WebGL2 PC/844×390/932×430, tropas, tiro y recompensa reales; ocho construcciones por perfil y captura con HUD. |

Los PASS de esta matriz son evaluación técnica/visual interna del criterio, no equivalencia píxel a píxel ni aprobación humana. No se declara fidelidad exacta o calidad comercial terminada. El Director debe valorar especialmente masa/profundidad de roca, contornos, densidad y acabado del sendero antes de propagar el estilo.

## QA y metodología

Pruebas Node existentes: sintaxis, build, protección de datos/core/escenas/HUD/otros mapas/AGENTS/roadmap, 133 nodos y ocho sockets. Se añade contrato puro de siete formaciones y apoyo de los ocho pads en terreno. Browser: WebGL2 real desktop 1280×768, 844×390 y 932×430; imagen ancha1917×990, entrada/salida de fullscreen, comparación de píxeles en límites FIT, capturas sin HUD solo mediante ocultación temporal en QA.

QA ampliada de entrada: seleccionar y construir Infantería desde el menú real en los ocho pads, vender con las reglas normales, luego usar el botón normal de reinicio de partida. Se respeta el debounce de 250 ms del menú existente: los primeros intentos del script fueron rechazados por acciones demasiado rápidas, sin cambio alguno a runtime/menú. No se incrementa oro artificialmente ni se alteran costes/reembolsos para las pruebas. Después del reinicio: Infantería0 + Francotirador1, oro365→130, oleada1 con aparición/avance/disparo/muerte/recompensa y pausa. Navegación de regresión M02/M03/M04; M05 sigue cerrado.

**NOT_RUN**: dispositivos móviles físicos, FPS/VRAM/batería en hardware físico y campaña completa (bloque artístico con smoke proporcional). Aprobación artística humana pendiente. Los resultados efectivos se incorporan en QA JSON/capturas y en la entrega, con SHA de CI y comprobación pública si se promueve.

## Archivos, riesgos y reversión

Producto: `public/official/src/maps-visual/m01/style01/cartoon-world.mjs`, nuevo `fidelity-terrain.mjs`, originales en `public/official/art/maps/m01/fidelity01/`. El adaptador R7 y las escenas permanecen idénticos. QA: los dos scripts `tools/qa-map-style01-*.mjs`; evidencias en esta carpeta. Sin nuevas dependencias.

Riesgos: atlas adicionales y texturas de relieve/agua aumentan memoria y carga inicial; se rasterizan únicamente al montar, sin procesamiento de paisaje por frame. No se certifica rendimiento móvil físico. Diferencias de composición expresadas en la matriz. Rollback mediante revert normal del merge del bloque, conservando `28a861f` como baseline anterior y la misma URL oficial.

**QA local final: PASS** en los tres perfiles. Siete formaciones, ocho construcciones/ventas reales por perfil (365→93), reinicio normal y compra Infantería+Francotirador (365→130), avance/tiro/baja/recompensa y pausa. Cero errores JS. Fullscreen real y ambas uniones FIT pasan en desktop; ningún píxel de la cara de roca invade las muestras del carril. `qa-local.json` contiene los estados y recuentos reales.

## Actualización documental concurrente de producción

Durante QA se integró PR #62, merge `be702995379054d5cc1a08d7766787f379ec1b64`, exclusivamente documental: AGENTS.md, roadmap y nuevo canon `ESTILO_VISUAL_CANON_CARTOON_2D_PREMIUM_V1.md`. Se leyeron las nuevas directrices y el canon. Se incorporó producción mediante merge normal, conservando los tres archivos idénticos a PR62, sin edición de su contenido por este bloque. El canon confirma la línea recibida y no amplía el alcance de esta tarea a otros sistemas.

El primer CI sobre la combinación de ramas falló porque la protección histórica de STYLE01 fijaba los hashes antiguos de AGENTS/roadmap. Se añade `inherited-document-blobs.json`, limitado a esas dos transiciones documentales exactas provenientes de PR62; todos los hashes funcionales siguen exigiéndose sin excepción. No se alteran pruebas de gameplay ni se desactiva protección del core. Se vuelve a ejecutar CI sobre el HEAD integrado.
