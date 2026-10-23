# Evidencia auténtica M03

Fecha: 23-oct-2026. Base de producción: `0e85c3a393c5d3e5223520f7dc863b2abc7203cc`. Código final probado: `97d16cbb4d06cc8123fbb5b04318005a110db420` (core, arte, panorámica y tests). Los commits posteriores de evidencia no cambian el runtime.

- **ANTES_SELECTOR_OFICIAL.png**: Chromium real, URL pública oficial antes de publicar M03, 1280×768. Solo aparecen M01/M02. Transporte HTTPS mediante `route.fetch` con verificación TLS; sin desactivar certificados ni sustituir respuestas.
- **PLANO_CANONICO.png**: plano técnico de los 188 puntos/ocho pads, no una captura de un M03 jugable anterior.
- **DESPUES_1280/844/932.png**: Phaser WebGL2 real del build local final `97d16cb`, con continuidad por tangentes en las franjas panorámicas. No son mockups ni imágenes de generación presentadas como juego.
- **COMBATE_OLEADA_09_932.png**: checkpoint del núcleo real de la novena oleada, con presupuesto legal, escena Phaser renderizada. Capturado tras corregir las franjas laterales, sobre el código final.
- **AMBIENTE_A/B_844.png**: dos fotogramas de escena real separados por reanudación del reloj; la prueba también verifica que ambiente y core se congelan durante pausa. Secuencia del código final.
- **browser-report.json**: tres perfiles completos Chromium/WebGL2, nueve oleadas/101 spawns por perfil, compra/mejora/venta/rally, victoria, derrota, récord, ocho pads, navegación, orientación y reducción de movimiento. El runner final pasó en los tres tamaños, incluyendo muestreo de píxeles en ambos extremos para validar el sendero prolongado por tangente. [CI 39948103757](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39948103757) ejecuta además la batería completa sobre `97d16cb` y conserva sus screenshots; las ejecuciones anteriores fueron sustituidas al pulir la panorámica.
- **core-qa.json**: prueba Node sin muertes ni fondos forzados; estado final y detalle por oleada.
- **estrategias-mixtas.jsonl**: cuatro partidas reales del núcleo, una torre Infantería y siete Francotiradores, compras/mejoras solo con saldo; cuatro victorias, contactos melee y ataques ranged de enemigos efectivos.
- **regresiones-locales.log**: R7 M01, R6 M02, M02 siete oleadas y viewport R4/R5, runners existentes con assertions conservadas.

Entorno: Node 24.19.0, Phaser 4.2.1, Chromium del sistema y SwiftShader; los runners locales importan Playwright preinstalado por ruta absoluta y usan `/usr/bin/chromium`, conservando sus assertions. CI instala Playwright 1.57 y Chromium headless. Viewports móviles son **emulados**, no Android/iPhone físicos.

Rendimiento: `softwareDesktopFps` son muestras internas breves tras carga/navegación en escritorio con GPU por software, no medias de toda la partida. `jsHeapBytes` son snapshots de heap sin forzar GC, no VRAM ni pruebas de ausencia de fugas. `drawCalls=NOT_INSTRUMENTED`. No se certifica 60fps, consumo ni fluidez de teléfono físico.

La aceptación artística/comercial permanece pendiente del Director. Ver estado definitivo de CI, merge y entrega LIVE en el [PR #52](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/52); este fichero no afirma una publicación anterior a su comprobación.

Combate adicional a tiempo real en 844×390: **M03_REAL_SNIPER_COMBAT_844.png** y **real-sniper-report.json**: 4 disparos presentados, 3 bajas reales, Infantería II + Francotirador I, sin errores JS. Reproducción: `npm run build`, servir `dist` con `python -m http.server 8003 --directory dist`, después `node docs/blocks/m03/evidence/qa-real-time-sniper.cjs` (Playwright instalado; si se usa Chromium del sistema, `M03_CHROMIUM_EXECUTABLE=/usr/bin/chromium`).
