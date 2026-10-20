# SEMANTROPIC TD — ACTA OFICIAL MAPAS M07 | CONTINUIDAD VISUAL C1-C
**20-10-2026 • Operación antirretroceso • Equipo MAPAS**  
**Estado: RESTAURACIÓN DE FUENTE VISUAL IMPLEMENTADA; NO APROBADO EN PHASER REAL NI INTEGRADO AL COMBATE.**

## 1. Orden, identidades y alcance autorizado
Se ejecuta el Prompt Maestro «MAPAS M07 — Continuidad Visual Obligatoria» de Dirección General con la captura exacta aportada por el propietario.

- **Imagen aprobada original:** PNG RGB de **1280×768**, SHA-256 calculado de archivo real `24103e45a0e1249fa4b89d4e65ea16d9e147bdf1e2462e5c4063469a931842ef` (**[VERIFICADO LOCALMENTE]**, no screenshot reconstruido).
- **Baseline artístico histórico:** [PR #12 C1-C / integration/c1c-q2-review](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/12), M03 Viva + T04 + P03. La escena C1-C llama `mountM01WorldV3(this,MAP,{palette:settings.palette})` y paleta default `viva`.
- **Baseline funcional protegido:** [PR #28 / C1-D4](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/28), `integration/c1d4-first-playable-m01` @ `f9ba3cbbe0b1733782e5b368691179d5afdf864c` verificado al auditar; **NO EDITADO**.
- **Iteración desviada, no producción:** [PR #25 M06](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/25), `feature/art-m06-combat-painterly`.
- **Nueva rama autorizada:** `feature/art-m07-continuidad-c1c`, creada desde el **SHA real** `fa7f5f90a059b3292a20a7b3834ac43c81176ac7` de M06. **PR #31** [MAPAS/M07 antirretroceso](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/31) → M06, **DRAFT, NO MERGE**.
- **HEAD inmutable vigente:** consultar [PR #31 → Commits](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/31/commits); actualizar el índice modifica el HEAD, por lo que esta acta no falsea un autorreferente.

## 2. Lo que está APROBADO POR FOTO, no por extrapolación
**[OBSERVADO EN CAPTURA ORIGINAL]**:
- Pradera de verdes de luz y sombra; zonas abiertas con terrazas amplias y árboles frondosos de **copas lobuladas** con borde cartoon marcado; coníferas/arbustos bajos discretos en primer plano.
- Ruta principal crema/arena/ocre con borde pardo oscuro y una gran curva en S. Se ve completa en escala de juego.
- Portón/ruina gris arriba a la izquierda, valla de guardia, estructura cristalina azul cerca de la parte superior central, siete árboles/props principales originales persistentes.
- Plataformas pálidas ochavadas/hexagonales con contorno. Torres militares azul petróleo y madera, francotirador elevado con operador visible; green warriors y brown hounds de escala jugable.
- La foto **NO** aprueba ataques invisibles, fases no vistas de animación, mapas 02–10, torres III/IV, HUD funcional, FX reales ni gameplay con daño.

El usuario aprobó **ESA IDENTIDAD**, no un bioma alternativo más detallado. C1-C era un showroom visual sin combate real.

## 3. Diagnóstico comparado de M03 → M06 → M07
| Elemento | Antes original C1-C / M03 | Variación acumulada M04-M06 | M07 implementado | Estado |
|---|---|---|---|---|
| Geometría/silueta del camino | Ruta de 133 puntos, arena dorada, trazo S y ribete oscuro | M04 creó camino/textura de material alternativo; M05 lo heredó y M06 agregó pigmento | Monta directamente M03 `road` sobre M03 `ground`; ni un waypoint editado | **MANTIENE EN CÓDIGO** |
| Terreno/colinas | `viva`, masas amplias claras/medias/oscuras | M04 sustituyó composición de ground; M05 y M06 superponen niveles | `mountM01WorldV3` original con `viva` por defecto | **MANTIENE EN FUENTE** |
| Árboles cartoon | Siete copas originales `oak-illustrated.svg` | Se conservaron parcialmente debajo de nuevas formas/escenografías | M07 carga M03 y no monta ninguna de las seis estructuras M06 | **MANTIENE EN FUENTE** |
| Portón, cristales, empalizada | `aqueduct`, `shrine`, `fence` y props de valle | M04 cambió hitos, M05 amplió clústeres, M06 introdujo un `fortress-gate` distinto | 13 props antiguos, mismas claves/posiciones/mismos anclajes M03 | **MANTIENE EN FUENTE** |
| Pads | Ocho 110,24 unidades aparentes, radio de vista 54 | Conservados en geometría, arte de materiales alternativo | Se reutiliza literalmente `padArt` de M03 con su textura pálida | **MANTIENE EN FUENTE** |
| Adaptador de presentación | Demostración sin construcción real | M05/M06 introdujeron snapshot/evento de visual-only | Wrapper de lectura M07 conserva snapshot, prioridad de tick, dedupe y destroy idempotente | **MEJORA TÉCNICA** |
| Microdetalle | Pasto ilustrado sobrio | 18 clústeres extra M05 + una textura y 6 SVG M06 | `fiel`: **0** gráficos nuevos. `pulido`: 1 capa tenue en espacios seguros | **PROPUESTA OPT-IN** |

La restauración **no modifica ningún archivo** de los renderizadores M03/M04/M05/M06. El M07 Fiel **no importa M06 visualmente ni precarga sus 48 SVG**, sólo el preload M03 (9 recursos compartidos, 7 M02 + 2 M03). El comparador de M06 abre su propia vitrina read-only en otro iframe PC, separada.

## 4. Código implementado
### 4.1 Renderizador versionado
[renderer-v7.mjs](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m07-continuidad-c1c/public/official/src/maps-visual/m01/m07/renderer-v7.mjs)
- `preloadM07Illustrations(scene)` precarga ilustraciones antiguas; `makeM07ArtPlan(map)` obtiene 13 props originales y ocho pads desde el source M03.
- `mountM01WorldV7(scene,map,{palette:"viva",treatment:"fiel"})` crea literalmente M03 con misma superficie; **opción fiel predeterminada**.
- `treatment:"pulido"`: un único canvas transparente **1280×768 RGBA8 (~3,75 MiB teóricos)** con pocas pinceladas muy tenues en áreas libres. No dibuja sobre ruta ni en radio 82 de sockets, no cambia copas/arquitectura; queda pendiente decidir si merece sobrevivir revisión del Director.
- El origen 3/4, foot, z, escala y atlas de árboles son los heredados M03, sin crear pad #9 ni colisión.
- `applyVisualSnapshot`, `setSocketVisualState`, `projectEvent`, `resetVisuals`, `destroy`, `getPadMetrics` como **presentación solamente**; no event bus, economía, armas, tiros, daño ni recompensas.
- `applyVisualSnapshot` respeta selección de un pad ocupado: el aro se dibuja **sin pasar a empty**. Un evento candidato sin tick o atrasado no sobrescribe estado más reciente; `eventId` deduplicado (máximo 128).
- Lease de texturas M03 generadas, compartidas entre vistas M07 del mismo `texture manager`. Texturas históricas externas preexistentes se preservan; las SVG quedan cacheadas. No se crea Canvas por frame ni se instala timer.
- **Limitación de ownership:** esa contabilidad protege dos consumidores M07, pero no garantiza detectar consumidores externos directos de `mountM01WorldV3`; integrador deberá auditar lifecycle mixto.

### 4.2 Vitrinas sin falsificar la escena jugable
- [index.html](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m07-continuidad-c1c/public/official/art/maps/m01/m07/index.html): preview sólo de escenario Fiel/Pulido, 1280×768, controles de ruta/pads y marcadores sintéticos claramente rotulados 13/24. Sin torre T/P falsa, sin ataque ni fugas.
- [gallery.html](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m07-continuidad-c1c/public/official/art/maps/m01/m07/gallery.html): triple comparación fuente PNG original + M06 en vitrina aislada + M07 restaurado; selección local del original y comprobación SHA256 con `crypto.subtle`; el PNG no se redibuja, altera ni envía por el formulario.
- **Advertencia crítica:** el PNG antes incluye T04/P03 y HUD; dos iframes actuales sólo muestran terreno. **No es una paridad visual global autenticada**. El Integrador debe mostrar C1-D4 con actores, torres y HP desde la misma cámara. La prueba PixelDiff o artística de igualdad queda PENDIENTE.

### 4.3 Objetos canónicos y procedencia
13 props exactos derivados de `makeM03ArtPlan`: siete oaks, fence (444,126), aqueduct (102,113), shrine (625,92), lookout (1119,725), supply (824,698), fern (545,683). Árboles M03: (346,140), (515,99), (834,115), (1192,137), (69,724), (314,744), (752,731). Se conservaron IDs, rutas SVG y pie/escala calculada. Inventario en [INVENTARIO_M07_CONTINUIDAD_C1C.json](INVENTARIO_M07_CONTINUIDAD_C1C.json) con fuente, material y estado por objeto.

Manifest [manifest.json](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m07-continuidad-c1c/public/official/art/maps/m01/m07/manifest.json) registra siete recursos SVG distintos en escena con SHA-1 de blobs Git reales; el preload contiene nueve recursos históricos. **Ningún asset no aprobado suplanta otro**.

## 5. Datos y mecánicas protegidas
**Sin cambios** a `public/JUEGO_V5_CANVAS.html`, `public/official/data/maps.v5.json`, `campaign140.v5.json`, `m01-model.mjs`, contratos, UI central, T/P ni `integration/c1d4-first-playable-m01`.

Canon M01: mundo 1280×768, 133 waypoints, ocho spots, cinco oleadas [8,10,11,13,21] = 63 warrior/hound, 365 monedas Normal, 100 vidas runtime, fuga común −2. La restauración M07 **no simula** ni certifica aquí el funcionamiento del Core C1-D4 con esos valores; se conservan porque archivos fuente no se han tocado.

## 6. Pruebas y trazabilidad
**[VERIFICADO LOCALMENTE]** PNG original proporcionado: 1280×768, PNG RGB, SHA-256 exacto del documento. El screenshot no está guardado como binario en GitHub: el comparador acepta el original desde el navegador y lo valida.

**[CONFIRMADO EN FUENTE]** C1-C invoca renderer M03 y paleta Viva. M07 no reescribe M03, ni M04/M05/M06, ni archivos de otros equipos.

**[PROBADO EN V8 CON MOCKS, NO CHROMIUM]** Dos tratamientos:
- M07 Fiel: 53 objetos en vista, 13 decoraciones originales, ocho pads, 9 SVG de M02/M03. NINGÚN SVG/canvas extra M06.
- M07 Pulido: 54 objetos, los mismos 13 originales, ocho pads, un overlay opcional; renderer M03 base.
- `applyVisualSnapshot(tick=20)` conserva el pad ocupado bajo selección. `tower_sold(tick=19)` rechazado, `tower_built(tick=21)` aceptado, `eventId` duplicado ignorado, `resetVisuals` y `destroy()` idempotentes.
- Dos vistas simultáneas con Pulido: al cerrar A la textura de B permanece; al cerrar B se libera. Quedan cacheadas nueve fuentes SVG compartidas.
- Source plan retorna los mismos trece IDs, coordenadas y ocho sockets de M03.

**[NOT_RUN]**:
- Node nativo (M03–M07), `npm run build`, QA Chrome WebGL2 1280×768 / 844×390 / 932×430, test iPhone/Android físicos, memoria/FPS/draw calls.
- Capturas genuinas M07 de nueva escena con mismas cuatro torres y 13 actores P03/C1-D4, 20+ actores, `attack_fire/hit/escape`, HP, pausa/reinicio y márgenes ENVELOP.
- Igualdad perceptual de color y silueta del render M07 real contra el PNG original. No declarar `PROBADO EN CHROMIUM WEBGL2` hasta CI/capturas.
- `screenshotIndex=[]` en QA_M07.json. Las capturas C1-C en [CI histórico](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39347724679) NO son nueva evidencia M07.

QA replicable: [qa-m07.mjs](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m07-continuidad-c1c/public/official/src/maps-visual/m01/m07/qa-m07.mjs) (Node fuente con mocks) y [capture-m07.mjs](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/blob/feature/art-m07-continuidad-c1c/public/official/src/maps-visual/m01/m07/capture-m07.mjs) (Chromium real; acepta PNG original para verificar/copy). Ninguno ejecutado en runner Node/Chromium de esta rama.

## 7. GATES del Equipo e Integrador
| Gate | Estado | Autoridad |
|---|---|---|
| A: ownership/Git source | [CONFIRMADO EN CÓDIGO] pendiente diff final | Equipo M |
| B: continuidad artística foto → escena | **[BLOQUEANTE]** real-frame review | Director |
| C: Node ESM/build | **[NOT_RUN]** | CI runner |
| D: WebGL2 + jugabilidad C1-D4 real | **[NOT_RUN]** | Integrador |
| E: propietario aprueba M07 con captura | **[NOT_RUN]** | Propietario |
| F: staging/merge | **NO AUTORIZADO** | Dirección |

No despliegue, merge, actualización del núcleo ni aceptación premium por tests simulados.

## 8. Mínimo de crítica exigida
**Mejora perceptible esperada:** vuelven el sendero crema S, siete copas lobuladas, portón gris/cristal azul y ocho pads claros reconocibles de la captura, sin agregar nuevas siluetas. **[PENDIENTE DE CAPTURA REAL]** es una mejora esperada, no un resultado perceptual certificado.

**Dos debilidades demostrables en fuente:** (1) M03 sigue renderizando terreno/camino mediante procedimientos Canvas, no pintura raster final; (2) la escena map-only carece de torres/enemigos reales y por sí sola no permite validar oclusión, UX, HP ni combate.

**Riesgo cruzado:** convivencia de texturas M03 entre escena C1-D4 y múltiples vistas M07 + integración central de assets T/P. **Corrección priorizada:** Integrador prepara un montaje aislado de C1-D4 con `mountM01WorldV7` y cámara/actores reales, captura 1280×768 y 844×390, compara con foto aprobada y corrige sólo decoraciones M07 si hay regresión.

## 9. Rollback, derechos y responsabilidad
Archivos nuevos restringidos a `public/official/src/maps-visual/m01/m07/**`, `public/official/art/maps/m01/m07/**`, `docs/art/maps/actas/**`; sin force push a otros equipos. Cerrar PR #31 conserva M06 y no afecta C1-D4. Derechos de arte heredado M02/M03: fuentes propias con asistencia IA, revisión comercial final por dirección.

**DICTAMEN DE EQUIPO:** «La fuente y distribución M03 Viva se recuperaron en un renderer M07 aislado. **El parecido visual real, el combate y la aprobación artística permanecen pendientes**, por lo que no se propone merge».