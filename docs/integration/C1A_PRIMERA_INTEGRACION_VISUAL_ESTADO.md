# SEMANTROPIC TD — C1-A / Primera integración visual de equipos M, T y P

**Fecha:** 2026-10-19. **Rama aislada:** `integration/c1a-visual`. **Objetivo:** escena conjunta de presentación visual, sin conexión a combate ni cambios en producción.

## Trabajo efectuado por el Integrador
1. Partiendo de `integration/phaser` (commit `104beaa44682cd2f81e30461ac6fe1b685186789`) se creó esta rama aislada.
2. Se copiaron **24 archivos nuevos** (sin modificaciones a rutas protegidas), conservando los blobs exactos de tres ramas:
   - M, mapa M01 Aurora: 7 rutas nuevas.
   - T, Infantería/Sniper I–II: 11 rutas nuevas.
   - P, 4 actores con atlas: 6 rutas nuevas.
3. Se agregó `public/official/src/c1-visual/index.html` y `scene.mjs`, que importan **los módulos reales de cada equipo** y presentan una escena común.
4. M aporta los 133 waypoints y 8 sockets canónicos, terreno, camino 110u, props, tres paletas.
5. T aporta SVG Infantería I/II y Sniper I/II ubicados en sockets reales (índices 1, 3, 4, 5); VFX de señal/trazador bajo activación visual.
6. P aporta atlas prototipo de warrior, hound, recruit y sniper_operator; 10 actores de desfile recorren **visualmente** la ruta canónica y cuatro aliados se presentan junto a edificios.

## Límites / prohibiciones
- Enemigos en escena **NO son spawns de las cinco oleadas reales** y los soldados **NO bloquean ni atacan**.
- Animaciones y VFX **NO alteran** oro, HP, fugas, economía, cooldown, daño, vida, guardados ni victoria.
- NO hay compras, upgrades funcionales ni gameplay completo en C1-A.
- Sin merge de PR #1, #2 ni #3 a `integration/phaser`; sus PR continúan separados, borradores y revisables.
- Sin cambios en `main`, `production/ph01-p0-m01`, `art/ph02b-m01-deluxe`, Canvas V5 ni despliegues Render.
- Aprobación artística y escalas definitivas **PENDIENTES**. El contenido integrado sigue siendo prototipo.
- No se autoriza usar sprites o VFX de terceros como material final.

## QA conocido
- [CONFIRMADO EN GITHUB] Nuevos archivos presentes y paths únicos/no solapados en rama aislada.
- [PROBADO COMO TEXTO JS] Sintaxis de `scene.mjs` analizada con Function() tras retirar declaraciones import ESM. Esto **NO prueba** carga de módulos ni ejecución de Phaser.
- [CONFIRMADO EN CÓDIGO] `build.mjs` copia `public/**` y el runtime local Phaser 4.2.1 al directorio `dist/`.
- [NO EJECUTADO] `npm install`, `npm run build`, scripts QA M/T/P en proceso Node.
- [NO EJECUTADO] Navegador real, WebGL2 efectivo, SVG cargados, Canvas atlas, captura auténtica, Android/iPhone físico, eventos táctiles.
- [PENDIENTE] Inspección y aprobación visual de proporciones de edificios, enemigos, operadores; z-index/oclusiones; efectos temporizados y pausa.

## Cómo revisar en una instalación del repositorio
1. Checkout de `integration/c1a-visual` o entorno de revisión aislado (NO sustituir producción).
2. `npm install` y `npm run build`.
3. Servir `dist/` mediante HTTP (no `file://`).
4. Abrir `/official/src/c1-visual/index.html` en navegador con WebGL2.
5. Confirmar mapa M-01 real, cuatro torres, enemigos caminando, aliados, paletas y selector de VFX.
6. Confirmar que la propia escena anuncia explícitamente `ESCENA VISUAL AISLADA` y que no se activa combate ni economía.
7. Reportar capturas de PC y móvil horizontal, fallos consola, colisiones gráficas y errores de escala.

## Siguiente etapa
**C1-A/Q1:** revisión visual, corrección de errores de carga/escala y aprobación artística básica del conjunto. **En paralelo**, los equipos pueden preparar propuestas M-02/T-03/P-02 en sus propias ramas tras recibir el estándar global de escala/anchors; no necesitan esperar a la migración de toda la campaña.
**C1-B:** tras QA real, promover módulos mediante PRs revisados a integración y comenzar adaptadores centrales del core y los eventos; no confundir esto con migración total del juego.

**NOTA:** Este informe describe código publicado y verificación limitada; no se presenta como certificación de gameplay o render WebGL2.
