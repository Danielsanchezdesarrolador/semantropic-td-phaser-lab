# SEMANTROPIC TD — ACTA R0/R3-0 · 21-oct-2026

## Estado y alcance
Base verificada al inicio: production/semantropic-td-live, HEAD 86ffbe828be7aaafcccf5a8903cf85d92ee1f0de; Render LIVE + GitHub Actions SUCCESS.
Este PR DRAFT NO cambia la versión pública, NO habilita M02 y NO toca datos Canvas protegidos.
La captura del usuario de C1-D8/B2 acredita coherencia de composición estática en M01, no prueba de animaciones, rally táctil ni FPS físico.

## Resultado R0 de M01
- PASS documentado previamente en QA automatizado: 5 oleadas, 63 enemigos, victoria/derrota, economía, rally, impacto visual y muzzle sniper.
- Revisión de captura: composición y familia visual preservadas, sin defecto grave reproducible a partir de una imagen estática.
- PENDIENTE: validación humana de animaciones, proyectiles, rally y rendimiento Android real. No afirmar PASS físico.

## R3-0: fuente exacta para M02 «Campos del Molino»
Fuente de verdad INMUTABLE: public/official/data/maps.v5.json + campaign140.v5.json.
- Nombre de fuente: Campos del Molino / La herradura dorada · granjas y molinos bajo la invasión.
- Bioma farmland; ruta única sin ramificaciones, 163 nodos, entrada [-36,296], salida [1315,377].
- Ocho sockets de construcción, oro Canvas 395, dificultad fuente Fácil+.
- Siete oleadas con cantidades 7, 9, 7, 11, 15, 11, 20 (80 unidades programadas).
- Tipos presentes: warrior, hound, archer y shieldbearer, todos routeStart 0.
- ALTO: oro 395 y lives Canvas 21 son DATOS DE REFERENCIA, no prueba de que deban portarse sin adaptación al core Phaser actual de 100 vidas.
- Bloqueo funcional: core Phaser M01 codifica id 1, ruta 133, campaña 5, economics 8 y dos tipos (warrior/hound). Prohibido conectar M02 al núcleo por cambio de índice sin refactor y QA.

## Gate documental reproducible
Node: `node tools/qa-r3-m02-canonical.mjs`. Gate solo lectura de JSON canónicos; en este acta no se afirma ejecución Node ni Chromium del PR.
Verificación adicional de contratos y geometría realizada mediante lectura programática de los dos JSON de GitHub: 0 segmentos degenerados, 8 sockets en canvas, única routeStart=0.

## Próximos bloques autorizados de alcance incremental
R3-A MAPAS (PR equipo): arte original M02 en ownership MAPAS, respetando ruta/pads y dirección C1-C; entregar plan, escena visual inspeccionable y evidencia antes de integración. SIN tocar motor/core ni production.
R3-B DG: adaptar arquitectura para escoger escenario sin alterar M01; implementar combate/roles reales para archer y shieldbearer basándose en datos/paridad, con QA de cada tipo; sin inventar reglas.
R3-C DG: selector/progreso mínimo y guardados independientes, sin cambiar URL pública. Promoción a LIVE únicamente cuando M02 sea realmente jugable y apruebe QA, preservando M01.

## Invariantes y prohibiciones
No editar public/JUEGO_V5_CANVAS.html, public/official/data/maps.v5.json, public/official/data/campaign140.v5.json ni public/official/src/m01-model.mjs.
No copiar siluetas ajenas, ni sustituir C1-C visual baseline, ni exponer M02 incompleto a jugadores.
Cada bloque con SHA, Node22+build, Chromium 1280×768/844×390/932×430, regresión M01 y rollback.
