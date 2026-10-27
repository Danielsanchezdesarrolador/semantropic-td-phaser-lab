# MAP-ART-07-CARTOON-V1 — Paso de la Escarcha

Orden de Dirección 27/10/2026, adjunto TXT leído íntegramente. Base producción8e3f2ec00432a5455021db39a45800d4decd7a67, rama feat/m07-art-cartoon-v1. AGENTS, roadmap, canon y arquitectura M06 leídos. Un equipo, un bloque artístico, ningún gameplay.

## Referencia y alcance

Mockup visible y examinado en la conversación: cordillera nevada, dos caminos cálidos, bosques de pinos, facetas frías, ruinas, cristales y puentes. No se dispone de un JPG local de esa referencia: no se inventa ruta ni comparación píxel a píxel. El PNG nuevo es un sheet original generado para este bloque, con seis sprites alpha independientes: pino, arco, cristal, árbol seco, roca y portal. No es el mockup ni un fondo monolítico. Se conserva su archivo fuente1536×1024, recortado únicamente en memoria por celda/píxeles alpha para caché de texturas.

Un segundo asset original aporta únicamente la cordillera distante, sin camino ni pads. No es un mapa aplanado.

Cinco superficies separadas en Phaser: horizonte, agua, relieve, nieve y caminos; tres puentes con tablero y barandas, nueve pads con espesor/sombra y props con profundidad por pie. Toda la escena es estática: sin partículas, nieve, VFX ni agua animados. Desmontaje elimina objetos/texturas; assets fuente se cachean sin crear sprites por frame.

## Geometría protegida

map7/frost_pass,271+271 nodos,9spots,2 entradas(-40,176)/(-40,646),destino(1315,304). JSON, datos de campaña, economía, vidas y módulos existentes permanecen byte idénticos. No hay scene-m07 de campaña ni opción7 en selector. 510oro/17olas/140enemigos/liveslegacy18 solo se auditan como datos, no se implementan.

La línea visual usa el algoritmo cúbico C2 local del precedente M06, adaptado únicamente en paleta y ancho54 unidades mundo (M06:58). Los controles se acondicionan visualmente sin alterar las polilíneas. ErrorC2<4.2e-12; radios mínimos75.27/45.07>27; desviación máxima al trazado canónico6.88/13.76<27. Anchura analítica constante entre offsets normales±27; unión y barandas excluidas de la medida. El navegador mide además la banda alpha del canvas de camino en estaciones normales cada85unidades, fuera de la unión: tolerancia±2unidades por muestreo/antialias, valores reales en report.json. Overlay542puntos/9centros disponible con ?overlay=1.

Los puentes se sitúan por intersección muestreada entre rutas y canales. Dos cruces occidentales, uno de piedra DESPUÉS de la confluencia; prueba de ambos extremos sobre terreno. Las curvas del río se separan del pad cercano para mantener sus centros; no cambia la geometría jugable. Dos caídas estáticas conectan el agua corriente superior con su tramo inferior y espuma. Los pads se dibujan con diámetro superior61.6 para mantener también íntegramente visible el centro x1248 cerca del borde; no se mueve ningún socket. La futura hitbox funcional pertenece a otro bloque.

## QA y comparación

qa-m07-art: congela TODO public anterior, contrato542/9, C2, radios y separación del eje. qa-m07-art-browser: Chromium WebGL2 real PC1280×768 y táctil844×390/932×430DPR2, capturas/overlay, ambos bancos, cantidad de props, desmontaje/remontaje sin crecimiento de objetos/texturas, cero pageerror. Se usa FIT con márgenes exteriores uniformes, no se recorta el layout en móvil.

No existía arte M07 en producción: no hay captura histórica before que se pueda atribuir al juego anterior. desktop-construction-baseline.png es una fase NUEVA de construcción sin props, identificada expresamente, no un before de producción. After/overlay son capturas reales del nuevo preview. Comparación cualitativa con el mockup: se mantienen familia blanca/azul y camino cálido, pinos nevados, ruinas/cristales y relieve. Se cambia la composición para respetar las dos rutas reales y nueve pads; tres puentes topográficos en lugar de copiar los del mockup. El resultado utiliza masas de nieve y roca más simplificadas que el mockup. La densidad forestal y el acabado final requieren valoración del Director, no se autoaprueba fidelidad comercial.

Presupuesto estimado de cinco superficies RGBA2560×1536:75MiB sin mipmaps, más sprites/puentes/pads y framebuffer. Es estimación por dimensiones, NO medición de VRAM. Conteos reales de objetos/texturas en report.json. FPS sostenidos, memoria física y teléfonos reales: NOT_RUN. No se declara nivel jugable ni rendimiento comercial certificado.

## Entrega y rollback

QA, CI y publicación se acreditan en el PR. Preview solo se entrega como publicado después de verificar contenido servido. URL del juego oficial mantiene M01–M06: no se presenta como M07 jugable. Rollback por revert del merge del bloque, sin tocar datos ni guardados.

Puerta de aprobación: Dirección debe valorar ARTÍSTICAMENTE las capturas y preview. Futuro separado: MAP-PADS-07 si requiere ajuste visual, MAP-ENV-07 para agua/nieve/viento; M07-GAME-01 para17olas,dosrutas,combate,resultados y récord. Ninguno se ejecuta aquí.
