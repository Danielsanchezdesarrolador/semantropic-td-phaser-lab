# MAP-STYLE-01 — M01 cartoon 2D premium modular

[ORDEN MÁS RECIENTE DEL DIRECTOR] 23/10/2026, dos TXT idénticos y mockup (escenario superior como referencia). Sustituye la pauta pictórica para este bloque exclusivo de M01. M05 se pausa sin integración; no se extiende el estilo a los demás mapas. AGENTS.md y ROADMAP_CENTRAL.md NO se editan: consolidación documental requiere otra orden.

Base productiva: `579f421b36d408dc0ddc6a5457615f05b949a9c0`. Rama `feature/map-style01-m01-cartoon`. SHA/PR/publicación definitivos: ver PR del bloque y evidencia de entrega.

## Diagnóstico y construcción

ANTES: B01 componía terreno pictórico, camino, decoraciones y pads en una sola lámina visible. Esa capa favorecía una lectura de pintura de fondo. Se conserva el renderer anterior byte a byte en `r7/renderer-r7-b01-archived.mjs`, además de sus fuentes B01.

DESPUÉS: el adaptador visual R7 monta `style01/cartoon-world.mjs` y sigue delegando toda la API/estados de sockets en `mountM01WorldV7`. No se toca la escena de combate. La composición contiene:

- Dos imágenes de fondo lejano y terreno usando recortes del sustrato original vacío. Esa textura no contiene ruta, pads ni decoración frontal. El encuadre reduce el horizonte para que la geometría completa quede sobre suelo verde; la ribera inferior queda bajo los pads.
- Una CanvasTexture TRANSPARENTE de camino, dibujada una vez desde los 133 waypoints, con contorno irregular, tonos gráficos de arena y marcas de suelo. La ruta del mockup no se copia.
- Ocho imágenes Phaser de plataforma, usando un componente de piedra dibujado para este bloque, en IDs y posiciones reales. Menús, selección, ocupación y ruinas siguen la API anterior.
- Dos atlas ORIGINALES con diez motivos separables. 29 sprites colocados: árboles, cipreses, arco, cristales, rocas, flores, vallas, carro y portón decorativo; pies, sombras y orden de profundidad propios. Se conservan todos los originales generados. No hay recortes de la captura del Director ni mosaico del mockup.
- El panorama móvil conserva el pipeline existente, reflejando solo sustrato sin pads ni monumentos; continúa la pintura del camino en márgenes no jugables. No cambia cámara ni coordenadas.

El terreno sigue siendo una textura ilustrada original estática, como permite la orden; la ruta, los pads y el primer plano están separados y son objetos reales de la escena. `sustrato-sin-componentes.png` prueba la separación en el runtime (capturado ocultando esos objetos; no es el aspecto normal del juego).

## Resultado visual y límites concretos

[PROBADO EN NAVEGADOR] Pradera luminosa, formas gráficas y contornos selectivos, árboles expresivos, bloques de roca, ruinas, cristal y vallas coherentes; menos ruido fotográfico. Camino visible, ocho plataformas diferenciadas y torres/enemigos actuales distinguibles en combate. El portón es una ruina decorativa fuera de la ruta, no una nueva entrada funcional.

No se reproduce literalmente el puente/portón sobre la curva de la referencia: esa curva no coincide con el M01 real. El sprite de puente del atlas queda sin montar para no inventar un cruce. No se añaden cascadas sin un cauce que las alimente ni nuevas animaciones ambientales. No se afirma equivalencia estética exacta con el mockup ni aprobación artística del Director. La jerarquía, densidad y acabado quedan sujetos a su valoración.

## Protección de alcance

[CONFIRMADO POR HASH] 133 nodos, ocho sockets, 365 oro, 100 vidas, cinco olas/63 enemigos; CORE, IA, Infantería/Francotirador, sprites, rally, daños, targeting, fugas, economía, resultados, guardados, HUD, selector y M02–M05 intactos. Ningún cambio de geometría o gameplay. AGENTS/roadmap intactos.

Único archivo productivo existente modificado: `public/official/src/maps-visual/m01/r7/renderer-r7.mjs`. Los demás módulos/assets productivos del bloque son nuevos y exclusivos de M01. Las pruebas históricas se adaptan exclusivamente a la sustitución autorizada de esa entrada visual, mediante hashes antes/después en `authorized-visual-blobs.json`. Se mantienen los locks de datos y otros sistemas. La QA R7 histórica inspecciona el renderer archivado y la QA activa usa los nuevos gates modulares; no confundir ambos.

## QA proporcional

[PASS] Node/sintaxis, build y Chromium/WebGL2 real: escritorio 1280×768 y móvil emulado 844×390 / 932×430. Composición de 69 objetos visuales propios (incluye capas, pads y sombras), 29 sprites de primer plano; ocho pads seleccionables por mouse/touch; compra real Infantería I y Francotirador I, saldo 130 tras compras, inicio de primera ola, disparo y primera baja/recompensa del CORE, pausa y ausencia de errores JavaScript. 407 muestras del centro de ruta cubiertas por camino opaco de arena. Rectángulos completos de props fuera de ruta/pads. Se navega además a M02/M03/M04 en escritorio; selector no abre M05.

[PASS] Fuentes protegidas mediante `protected-blobs.json`; guards históricos B01/B02/B04/HF1/R4/R7 conservados con la excepción visual M01 explícita. Capturas antes/después auténticas a misma cámara y tamaño.

[NOT_RUN] Campaña completa local (bloque artístico: se usa smoke breve), Android/iPhone físicos, FPS/GPU/consumo real. No afirmar mejoras porcentuales. Arte estático y extracción de atlas una sola vez; no se incorpora procesamiento de píxeles por frame. La suite heredada de CI puede ejecutar regresiones adicionales automáticamente; el resultado se informa por separado, sin atribuirlo a aprobación estética.

[CI/PUBLICACIÓN] Ver PR para estados definitivos. URL oficial solo se declara actualizada tras comprobar archivos y runtime públicos: https://semantropic-td-jugar.onrender.com/official/src/live/ . No se crea otro sitio ni preview de M01.

## Rollback y revisión

Revertir el merge de este bloque mediante PR, sin resetear ramas ni borrar guardados; el renderer B01 exacto queda archivado como referencia. Verificar la misma URL y M01 después de volver al baseline.

El Director debe inspeccionar Mapa 01: lenguaje cartoon, riqueza y jerarquía, integración de camino/pads/objetos, comparación desktop/móvil y lectura de torres/enemigos en la primera ola. [PENDIENTE] valoración artística. No se inicia otro mapa ni se consolida la nueva pauta en AGENTS/roadmap sin otra orden.
