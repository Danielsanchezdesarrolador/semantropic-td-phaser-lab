# Evidencia auténtica M03

Fecha: 23-oct-2026. Base de producción: `0e85c3a393c5d3e5223520f7dc863b2abc7203cc`. Último commit funcional de este conjunto: `2c21dacdc301e9045973aab3b589f4841fa25313`.

- **ANTES_SELECTOR_OFICIAL.png**: Chromium real, URL pública oficial antes de publicar M03, 1280×768. Solo aparecen M01/M02. Transporte HTTPS mediante `route.fetch` con verificación TLS; sin desactivar certificados ni sustituir respuestas.
- **PLANO_CANONICO.png**: plano técnico de los 188 puntos/ocho pads, no una captura de un M03 jugable anterior.
- **DESPUES_1280/844/932.png**: Phaser WebGL2 real del build local final `2c21dac`, corrección de continuidad en franjas panorámicas incluida. No son mockups ni imágenes de generación presentadas como juego.
- **COMBATE_OLEADA_09_932.png**: checkpoint del núcleo real de la novena oleada, con presupuesto legal, escena Phaser renderizada. Es anterior a la corrección exclusivamente visual de las franjas laterales; comparte core, actores y geometría del commit final.
- **AMBIENTE_A/B_844.png**: dos fotogramas de escena real separados por reanudación del reloj; la prueba también verifica que ambiente y core se congelan durante pausa. Esta secuencia local precede la corrección de franjas; CI del último commit vuelve a generar las secuencias finales.
- **browser-report.json**: tres perfiles completos Chromium/WebGL2, nueve oleadas/101 spawns por perfil, compra/mejora/venta/rally, victoria, derrota, récord, ocho pads, navegación, orientación y reducción de movimiento. El runner pasó antes del último ajuste de panorámica; se ejecutó además smoke visual final en los tres tamaños. CI 39947454669 se ejecuta sobre el commit funcional final y conserva todos los screenshots finales.
- **core-qa.json**: prueba Node sin muertes ni fondos forzados; estado final y detalle por oleada.
- **estrategias-mixtas.jsonl**: cuatro partidas reales del núcleo, una torre Infantería y siete Francotiradores, compras/mejoras solo con saldo; cuatro victorias, contactos melee y ataques ranged de enemigos efectivos.
- **regresiones-locales.log**: R7 M01, R6 M02, M02 siete oleadas y viewport R4/R5, runners existentes con assertions conservadas.

Entorno: Node 24.19.0, Phaser 4.2.1, Chromium del sistema y SwiftShader; los runners locales importan Playwright preinstalado por ruta absoluta y usan `/usr/bin/chromium`, conservando sus assertions. CI instala Playwright 1.57 y Chromium headless. Viewports móviles son **emulados**, no Android/iPhone físicos.

Rendimiento: `softwareDesktopFps` son muestras internas breves tras carga/navegación en escritorio con GPU por software, no medias de toda la partida. `jsHeapBytes` son snapshots de heap sin forzar GC, no VRAM ni pruebas de ausencia de fugas. `drawCalls=NOT_INSTRUMENTED`. No se certifica 60fps, consumo ni fluidez de teléfono físico.

La aceptación artística/comercial permanece pendiente del Director. Ver estado definitivo de CI, merge y entrega LIVE en el [PR #52](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/52); este fichero no afirma una publicación anterior a su comprobación.
