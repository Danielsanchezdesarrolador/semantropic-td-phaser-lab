# SEMANTROPIC TD — EQUIPO P · P-01
**Fecha:** 2026-10-19 · **Rama:** feature/phaser-personajes · **Contrato:** PM-03/C0 v1
**Estado:** [CÓDIGO VERIFICADO DE FORMA LIMITADA] / [ARTE PROTOTIPO] / [NAVEGADOR NO EJECUTADO]

## Encargo y alcance
Entrega aislada de cuatro ACTORES VISUALES, no gameplay ni migración de combate:
1. Orco Guerrero (warrior): silueta robusta, piel jade, armadura de bronce, hacha.
2. Perro de Caza (hound): cuadrúpedo ámbar, espinas y arnés, zancada de cuatro patas.
3. Soldado Recluta (infantry_recruit): infantería aliada, tabardo claro, escudo y espada.
4. Operador Francotirador (sniper_operator): uniforme verde/teal, gafas, rifle orientable.

Diseño original 2D cartoon/3⁄4 en Canvas vectorial, sin extracción de sprites ajenos.
Estos dibujos son PROTOTIPOS de producción, pendientes de validación artística.
La postura del arma es VISUAL y no dispara proyectiles ni aplica daño.

## Lo entregado
- Fuente original editable: public/official/art/actors/atlas-source.mjs.
- Manifiesto: public/official/art/actors/ASSET_MANIFEST_P01.json.
- Vitrina Phaser independiente: public/official/src/actors-visual/index.html.
- Controlador visual: public/official/src/actors-visual/gallery.mjs.
- Smoke Node sin navegador: public/official/src/actors-visual/qa-p01.mjs.
- Este documento bajo docs/art/actors/.

## Frames, pivotes, memoria
Cada personaje genera su propio atlas al iniciar por primera vez:
- 32 cuadros, celdas 176×208 px, 8 columnas × 4 filas.
- Atlas 1408×832 px RGBA (4.69 MB de GPU sin compresión por atlas aproximadamente).
- 4 atlas, total 128 cuadros (18.74 MB RGBA sin mipmaps aproximadamente).
- Fuente editable por módulos Canvas 2D con dibujos anatómicos por estado.
- Foot anchor (0.5, 0.92), sombra separada (0.5,1), depth según Y del pie.
- Dirección E con espejo W. Sin animación de ocho direcciones.
- Alturas mundiales temporales: warrior 91, hound 67, recruit 88, sniper 80.
  Estos valores sirven solo a la vitrina y NO están aprobados para collider.
- La galería permite exportar los 4 atlas a PNG transparentes desde el navegador.
  NO hay PNG preexportados versionados en GitHub. No afirmar master final.

Estados disponibles en vitrina:
- idle: 4 frames a 4 fps, loop.
- walk: 8 frames a 9 fps, loop.
- attackWindup: 3 frames a 8 fps.
- attack: 5 frames a 12 fps.
- hit: 3 frames a 12 fps.
- die: 6 frames a 9 fps.
- blocked: 3 frames a 8 fps (prueba visual; no implica blocking funcional).
Los frames no loop terminan en su última pose hasta seleccionar otro estado.
Las acciones UI cambian poses sin invocar daño, oro, muertes, fuga ni habilidades.

## Para abrir la vitrina
1. Instalar dependencias de Phaser 4.2.1 según repositorio.
2. Ejecutar npm run build desde la raíz (sin modificar package.json).
3. Servir el directorio dist/ como HTTP estático.
4. Abrir /official/src/actors-visual/index.html.
5. Probar estados/dirección, pausar, zoom, anclajes, exportar PNG.
6. No abrir HTML con file://: el fetch de maps.v5.json necesita servidor.

## Contexto del mapa
La vitrina obtiene SOLO LECTURA public/official/data/maps.v5.json, valida
M01 con 133 puntos y dibuja una senda atenuada de referencia contextual.
El movimiento de actores en esta sala es cíclico y en un mismo lugar:
NO existe navegación/pathfinding ni conexión a m01-model.mjs.
Sin cambios a geometría, 8 pads, campaña, core o renderer principal.

## Límite de APIs y titularidad
- No se editaron m01-model.mjs, m01-preview.mjs, index.html principal,
  campaign140.v5.json, maps.v5.json, public/t3b/art-c.js, torres, economía,
  package.json, build.mjs, Render ni el motor de eventos.
- Fuente ubicada en namespace P public/official/art/actors/**.
- Galería/QA en namespace P public/official/src/actors-visual/**.
- Documento dentro de docs/art/actors/**.
- La conexión al combate real y a los slots operador T la hará integrador.
- No adoptar gameplay sintético T3B como fuente de autoridad.
- Ninguna animación escribe HP, recompensas, cooldowns ni fuga.
- No se implementó Combat Events Bridge: sigue especificación v1.

## QA ejecutado y no ejecutado
**[PROBADO ESTÁTICAMENTE EN V8, 2026-10-19]**
- new Function de módulos, tras omitir declaraciones import/export (sintaxis).
- Smoke con Canvas mock: 4 actores construyen atlas sin excepciones JS.
- 32 frames por atlas, 128 total; metadatos 1408×832; 4 texturas simuladas.
- El JSON del manifest parsea con 4 IDs diferentes.

**[NO EJECUTADO]**
- Test Node quedó versionado, pero no ejecutado como proceso Node en checkout.
- Phaser runtime, WebGL2 real, capturas Chromium, PNGs verdaderos exportados,
  nitidez, hitbox visual, smartphones físicos y touch pendientes.
- No se ejecutó build, despliegue, comparación FPS ni smoke gameplay.
- Módulos no equivalen a sprites finalizados listos para campaña.

## QA sugerido al integrador
- Ejecutar node public/official/src/actors-visual/qa-p01.mjs.
- Servir build y verificar que 4 atlas de 32 frames aparezcan.
- Evaluar escala visual en 1280×768 y smartphones 844×390.
- Confirmar alpha PNGs exportados, ausencia de halo y albedo correcto.
- Verificar pie fijo, sombra, E/W sin parpadeo, pausa, exportación y background.
- Validar HP/escudo cuando exista adapter real (ahora NO).
- Medir memoria móvil si hay síntomas: atlas se crean una vez, no por frame.

## Dependencias pendientes
- Aprobación artística de siluetas y escala real cuatro actores.
- Adaptador ActorVisual y core Combat Events Bridge del integrador.
- Colocación de operador sniper por Equipo T.
- Estados lógicos de bloqueo, daño, HP, muerte en core.
- Animaciones oblicuas/N/S además de espejo horizontal.
- PNG finales pintados/optimizados con SHA-256 tras exportación.

## Rollback
Revertir commits de PR sobre integration/phaser o eliminar exclusivamente
rutas del Equipo P. No hay archivos compartidos editados, guardados migrados
ni servicios Render desplegados.

## Próximo lote sujeto a aprobación
P-02: revisión artística de estas cuatro siluetas, PNG exportados con metadata,
prueba escala acordada en M01 y adaptador visual al core real.
La integración gameplay no se atribuye a P unilateralmente.
