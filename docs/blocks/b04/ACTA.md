# B04 · MAP-ART-04 · Río de los Antiguos

[APROBADO POR DIRECCIÓN] orden artística del TXT 23/10/2026. Base `e10e4d390da83e467c2bf41bcf00cee1fbaa158e`; rama `feature/b04-m04-ancient-river-art`. CI/merge y verificación de publicación se trazan en el PR.

## Estado real y límites

M04 tenía datos canónicos y referencia histórica Canvas, pero ningún escenario/nivel M04 integrado en Phaser. Las carpetas históricas `maps-visual/m01/m04/` son versiones antiguas del **Mapa01**, no un Mapa04 jugable. Este bloque crea exclusivamente arte y su vista de revisión WebGL2. No se abre M04 en el selector ni se implementa gameplay.

Se conservan 262 waypoints, nueve posiciones canónicas y dos centros de puente (`402.64,382.54` / `923.53,367.27`). La disposición de la imagen externa no sustituye estos datos. Campaña M04: once oleadas/94 enemigos definidos, **no portados ni probados jugablemente aquí**. Los marcadores de plataformas solo se pintan: no hay hitboxes, selección, construcción, economía, torres, enemigos, combate, HUD jugable, guardados ni resultados M04. El campo histórico de vidas del JSON no establece una nueva regla Phaser.

M01/M02/M03, CORE, escenas, selector, campañas, mapas JSON y Canvas permanecen intactos. `protected-blobs.json` fija esos archivos y assets contra el SHA base. Los únicos archivos previos editados son una actualización del estado artístico M04 en el roadmap central; el resto son archivos nuevos de este bloque.

## Arte e integración visual

Cuatro PNG originales: terreno de ruinas/caliza, atlas transparente de seis motivos, agua y puente de piedra. Fuentes finales íntegras, procedencia, dimensiones y SHA256 en `art-manifest.json`. El terreno final se editó sobre una generación propia para corregir proporciones; la textura de agua separada evita rocas sobredimensionadas. No se usa la referencia del Director como asset ni se copia su layout.

Río canónico, dos canales escénicos adicionales que no cruzan la ruta ni las superficies de pads, riberas y sector central rodeado de agua. Camino nominal84 unidades sobre los puntos existentes; puentes ilustrados con superficie despejada y laterales fuera del centro, centrados en los dos cruces canónicos. Ruinas, estatua, santuario, árboles y dos cascadas bajas junto a la ribera inferior. Exclusión de props alrededor de ruta/pads y comprobación de apoyo de su base fuera del agua, salvo cascadas. Los candidatos inseguros se rechazan.

Se reutiliza el enfoque de composición ya probado, en un módulo M04 independiente; no se modifican ni importan módulos artísticos de otros mapas. Textura 2560×1536 compuesta una vez, sin nuevas animaciones ambientales o partículas. Vista FIT para inspección, con márgenes laterales neutros en pantallas anchas: no es la interfaz jugable del juego.

## Archivos

- `public/official/src/maps-visual/m04/river-art.mjs`: plan, painter estático y montaje visual sin input.
- `public/official/src/maps-visual/m04/preview/`: entrada Phaser4.2.1/WebGL2 de revisión, claramente rotulada «vista artística, sin combate».
- `public/official/art/maps/m04/`: cuatro fuentes originales.
- `tools/qa-b04-map-art.mjs`, `tools/qa-b04-art-browser.mjs`, `.github/workflows/b04-map-art-qa.yml`: QA proporcional y evidencia.
- `docs/blocks/b04/` y estado M04 del roadmap central.

## QA y comparación honesta

Comandos: `node tools/qa-b04-map-art.mjs`, `npm run build`, `node tools/qa-b04-art-browser.mjs`. Local: Playwright preinstalado y Chromium del sistema, sin omitir assertions; CI instala su Chromium. Node comprueba blobs protegidos, igualdad de ruta/río/centros, nueve pads, canales nuevos alejados de ruta y superficies de pads en tierra. Browser: WebGL2 real, desktop1280×768 y móvil844×390/932×430, muestras del camino comparadas con arte sin props, nueve marcadores/dos puentes, composición sin errores/scroll ni recorte y smoke de la página oficial M01 sin opción M04. La primera prueba detectó el contexto WebGL1 predeterminado del visor nuevo; se corrigió exigiendo explícitamente WebGL2 como en LIVE. Resultado final PASS en `qa.json`.

**Antes:** [esquema canónico](antes-esquema-canonico.png), construido para comparar geometría; **no representa un M04 Phaser anterior ni una captura Canvas histórica**. No existía tal escenario Phaser. **Después:** [arte PC](despues-desktop.png), [arte móvil](despues-movil.png), capturas reales de la vista de revisión; mismo viewport PC1280×768.

[NOT_RUN] gameplay M04, porque no está implementado; Android/iPhone físicos, FPS/GPU y balance. [PENDIENTE] aprobación estética humana e integración jugable mediante futuros bloques autorizados. No adelantar esos bloques automáticamente.

## Publicación y revisión

Ruta de revisión estable en el mismo sitio oficial: `/official/src/maps-visual/m04/preview/`. Es una **vista artística sin gameplay**, no un nuevo sitio público ni un sustituto del enlace jugable oficial. Solo se entrega como publicada tras comprobar archivos y navegador públicos contra el merge. La URL jugable `/official/src/live/` conserva M01/M02/M03; no se presenta como si contuviera M04 jugable. No atribuir un SHA interno de Render al verificar solo bytes públicos.

Dirección debe revisar identidad fluvial, ruinas/caliza, integración de los dos puentes, proporción del sendero, nueve posiciones visibles y claridad móvil. Rollback: revertir el merge artístico por PR normal y verificar Render en el mismo sitio; nunca resetear/borrar ramas ni tocar progreso del usuario.
