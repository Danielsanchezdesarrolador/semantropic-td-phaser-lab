# SEMANTROPIC TD — PROTOCOLO ÚNICO DE DIRECCIÓN Y BITÁCORA
**Fecha de adopción:** 21 octubre 2026. **Actualización de entrega:** T10 R1-HF2.
**ESTADO**: documento canónico permanente; siempre corroborar SHA de producción y CI actual en GitHub/Render al comenzar cada chat.

## 1. IDENTIDAD Y AUTORIDAD
Juego SEMANTROPIC TD (NO Semantropic Trivia/Unity), Tower Defense Phaser 4.2.1/WebGL2, cartoon militar futurista 2D 3/4 con estética original. Una sola Dirección General y un solo chat principal. El Director humano aprueba el resultado artístico. El asistente planifica, implementa mediante herramientas conectadas, revisa GitHub y Render, registra QA, despliega y lleva la bitácora. No generar prompts para otros chats o dividir los desarrollos entre MAPAS / TORRES / PERSONAJES. Los anteriores equipos quedan históricos. El último trabajo TORRES termina con PR #49, consumido selectivamente por release directo.

## 2. PRODUCCIÓN: UNA URL Y UN FLUJO
- Repo: `Danielsanchezdesarrolador/semantropic-td-phaser-lab`.
- Rama única de trabajo y producción: `production/semantropic-td-live`. No abrir ramas experimentales ni versiones paralelas para probar.
- URL pública PERMANENTE: https://semantropic-td-jugar.onrender.com/official/src/live/
- Render service ID: `srv-dbbqpl7avr4c73duc8lg`, workspace `tea-daum20gjo6nc73dndfqg`.
- Un objetivo en ejecución, un bloque a la vez; actualizar directamente la rama de producción con un commit atómico después de inspección del código, salvaguardas y pruebas disponibles. El auto-deploy de Render ejecuta el cambio. Verificar commit->Render LIVE y CI de GitHub.
- Mantener rollback por commit anterior; no inventar PASS, no forzar escrituras concurrentes ni modificar archivos protegidos sin autorización. No usar otra URL pública.
- **No confundir commit/push con QA PASS ni con aceptación Android**. Puede haber resultados visuales insatisfactorios aun con CI verde; repararlos sobre la misma URL.

## 3. ESTADO DEL JUEGO
- Una campaña histórica Canvas V5 de 10 mapas y 140 oleadas sirve como fuente PROTEGIDA; todavía no es campaña Phaser jugable.
- Phaser LIVE: M01 `Praderas del Amanecer` con 5 oleadas, 63 enemigos, 100 vidas, oro, menú, rally, Infantería I/II, Francotirador I/II, victoria/derrota/estrellas. No afirmar M02+ jugable.
- Identidad protegida C1-C M03/T04/P03; hashes e inventarios del repositorio prevalecen.
- Fuentes protegidas: `public/JUEGO_V5_CANVAS.html`, `public/official/data/maps.v5.json`, `public/official/data/campaign140.v5.json`, `public/official/src/m01-model.mjs`.
- Próximo objetivo luego de aprobación del Francotirador: cierre M01, después M02 `Campos del Molino`, ruta 1 entrada, 8 pads, 7 olas y 80 enemigos según acta DG PR #45. Requiere core de enemigos archer/shieldbearer, no es solo decorado.

## 4. HISTORIAL ÚLTIMOS BLOQUES
- C1-D8/B2: origen T04 por proyección del muzzle; Android Director detectó que la bala nacía lejos del rifle visible.
- C1-D8/B4 T10 PREMIUM: flash/tracer/hit premium, publicado con SHA `66b3c58436fdf7a349b2c13c93f4fb390cbd352d` y CI #39690718386 PASS. Director RECHAZÓ estética: aún había origen lejos y bala visual posterior a muerte.
- T10 R1 PR #49: core 840wu/s conservado, tracer cancelado al `hit_applied` `bulletId`, impacto más legible y fade letal visual 125ms. QA #39695198098 PASS.
- T10 R1-HF2 FINAL del último equipo TORRES: identificó dos rifles visuales T04 fijo y P03 animado. Opera desde boca REAL P03 por frame/escala/matriz, utiliza arquitectura T08 sin rifle integrado, conserva masters T04/P03. Fuente PR #49 HEAD `a4a33d11c2ab5643cd333987a2cc3d0b3eb13f14`; código probado `70239f640315cbfaf06a898d17c128076fc71ac6`; Actions #39711087400 PASS, artefacto #12396929890. Distancia histórica P03 a VFX 23–41 CSSpx, nuevo ~2–3 CSSpx en emulación. Alcance QA 6 muzzle y 12 hits, 3 disparos reales por composición, partida M01. No hubo FPS Android físico medido ni tiros a la derecha en muestras QA.
- Esta entrega se publica directamente por Dirección General, sin ramas DG adicionales. **La aprobación estética Android y la jugabilidad percibida son PENDIENTES** hasta el Director.

## 5. PROCEDIMIENTO DE CADA BLOQUE
1) Inspeccionar este documento y el último SHA/CI/Render reales; mirar capturas y reclamos del Director.
2) Especificar un único resultado observable y restricciones de regresión.
3) Revisar archivos reales; implementar de forma atómica directo en `production/semantropic-td-live` sin ramas de prueba; conservar commit anterior de rollback.
4) CI Node 22/build Phaser; Chromium WebGL2 1280x768, 844x390, 932x430 cuando corresponda, M01 completo, y comprobación de identidad.
5) Render LIVE mismo link, sha debe coincidir. Comunicar estado honestamente.
6) Director evalúa Android físico; cerrar bloque solo si aprueba; si detecta fallo aplicar microcorrectivo sobre misma versión.
7) Actualizar esta bitácora con objetivo, SHA de producción, QA, estado y siguiente bloque. Si este mismo commit hace la actualización, registrar SHA pre-release y enlazar CI para consultar SHA vivo posteriormente.

## 6. NORMA PARA NUEVO CHAT / TRANSFERENCIA
Nuevo chat NO inicia otro trabajo por su cuenta ni asume que una tarea histórica continúa ejecutándose. Lee este archivo, inspecciona repositorio `production/semantropic-td-live`, últimos commits, CI, Render y estado de PR #49; compara con último mensaje del Director. Si hay diferencia, los hechos recientes y la aprobación del Director mandan. Nunca utilizar 3 equipos, jamás derivar tareas a otros chats, ni perder horas inventando ramas o versiones paralelas. Si una conexión no permite actuar, informarlo de inmediato con alternativa concreta y sin fingir acceso. No mezclar con Trivia Unity.


## 7. U02 A+B — Francotirador seguimiento y plataforma
- Director autorizó fases A (mirar/seguir objetivo real) y B (estar sobre plataforma), no fase C de VFX premium.
- Presentación A: orientación P03 flipX y pequeña inclinación según el objetivo elegido por el CORE, continuidad mientras se mueve, frame correcto antes de cálculo de boca P03. Sin modificar selección/daño/velocidad/HP/oro del CORE.
- Presentación B: sprite P03 arriba de estructura sin rifle T08/T04; línea de baranda frontal T08 en capa superior y sombra de contacto. Masters intactos.
- QA Node y Chromium 2 niveles x 3 resoluciones x direcciones izquierda/derecha en fixture visual; M01 completo y disparos verificados por regresiones originales.
- Commit rollback pre-U02: 5a3b59823f3560935ef7a58fa60d01457804ebca. Publicar en misma URL, sin ramas. Android humano y Fase C pendientes.


## 8. U02 A+B HF1 — Corrección menor del adorno junto a las botas (22 oct 2026)
- El Director aprueba explícitamente las fases A+B en Android real; reporta detalle que parece un par de gafas a los pies del operador nivel I.
- Diagnóstico visual/source: el ornamento brillante del frente de la estructura T08 sin rifle (SVG local `translate(191 236) scale(0.48)`) coincide con el área aparente bajo las botas P03. Se elimina SOLO en `layers/sniper-1-structure.svg`; el master protegido `sniper/level-1.svg` y rig P03 intactos.
- Sin modificaciones al core, orientación, profundidad, cadencia, rifle o VFX. Se fuerza cache nueva SVG/JS en el LIVE. Nivel II no posee la misma insignia y no fue editado.
- QA Node confirma ausencia en estructura visible y presencia intacta en master, además de las regresiones M01/U02 en Chromium.
- Rollback pre-HF1 `276ec13086a8aceb7431dc3b726dbe4e1f0f400a`. Fase C premium VFX aún no autorizada.


## 9. U03 FASE C PREMIUM + ELIMINACIÓN REAL DE "GAFAS" DE ATLAS (22 oct 2026)
- Director confirma U02 A/B aprobadas, pero reporta que tras HF1 la figura celeste semejante a gafas aún aparece junto a los pies. Autoriza corregirla junto con la fase C premium.
- Causa técnica localizada: `createP03Atlas` del archivo protegido `p03-rig.mjs` no recorta cada celda antes de pintar, y el dibujo de visor del fotograma puede desbordarse hacia una fila adyacente. **No se toca P03 fuente**. Nuevo helper `p03-atlas-isolation.mjs` recompone SOLO el atlas sniper_operator mediante fotogramas en lienzo independiente; conserva atlasKey, dimensiones, frames y arte originales. Control de origen por SHA P03 `1a4282e1652ff559b92e18f42db465d6bfb8e729`.
- Fase C: `sniper-vfx.mjs` ahora utiliza flash de boca direccional más nítido, estela luminosa por capas, impact slash orientado y chispas de trayectoria; la señal visual de sniper II es ligeramente más refinada que I mediante `visualLevel` sin modificar estadísticas. Cada hit se produce EXCLUSIVAMENTE con `hit_applied` autenticado por `bulletId`; travel/kill/fade se mantienen.
- Nuevos tests: Node fuente original/reglas y Chromium WebGL2 aislación píxel-a-píxel de ocho frames P03 y disparo core auténtico I/II × 3 viewports, junto con las regresiones M01/impacto/R1/U02.
- Rollback previo `8606d8cacfdc33e445578ff98f3910bb4efa1bbd`. No crear ramas ni versiones alternas. Mantener una sola URL. Aprobación visual Android física pendiente.


## 10. U04 F1+F2 — HD de Francotiradores I/II y Aliados I/II (22-oct-2026)
- Director pide equiparar definición aparente con los enemigos sin rediseñar identidad, sin gameplay. No autoriza aún resto de torres (F3).
- F1: rasterizar SVG original de torre sniper 1/2 y rail frontal T08 a `720x840` (2x), ajustar `worldScaleProposal/2` y normalizar proyección de slot del operador a origen fuente 360x420, respetando visual body sobre plataforma. El P03 rifle/operador se recompone desde vectores históricos protegidos a resolución 2x por celda aislada con escala compensada. `projectP03RifleMuzzle` convierte coordenadas nativas a densidad visual. Sin tocar fuente protegida P03 ni masters de T04.
- F2: ambas fuentes PNG aliadas oficiales P08 infantry_recruit / infantry_veteran se mantienen intactas; tratamiento moderado de bordes en regiones opacas en lienzo y upscale con alta calidad a atlas auxiliar 352x416 por frame. La fuente PNG original **no contiene nuevos detalles**; solo aumenta nitidez perceptual. Escala compensada en actor y movimiento para no alterar hitbox/foot anchor, atlas enemigos sin tocar.
- Se corrige sobre la marcha QA U03 previo: comparación byte-a-byte entre dos Canvas2D genera falsos fallos por premultiplicación de alfa en píxeles semitransparentes. Nuevo comparador tolera diferencias cromáticas pequeñas de raster pero exige concordancia visual real.
- Nuevos QA Node y Chromium WebGL2 2 torres por 3 resoluciones comprueban origen del rifle/operador, geometría de edificio, texturas HD, atlas aliados originales y regresiones M01/U03. Reportar FPS Android sólo si medido, no suponer.
- Sin ramas, sin URL alternativa, un solo commit directo y bitácora actualizada. Rollback pre-U04 `6ee146df2f626c66fc1826869d0e48629a5792e5`. Art approval Android físico pendiente.

## 11. U05 · Fase 3A Cuartel Infantería HD I/II · 2026-10-22
- Director inicia U05 F3A directamente en producción, sin rama ni URL alternativas. Scope: SOLO cuartel I y II; Guardiana/Bombardera/Control serán bloques siguientes, no afirmar que existen jugables en Phaser M01.
- Maestros vectoriales T04 de Infantería I/II: `public/official/art/towers/infantry/level-{1,2}.svg`, 360×420, 89/94 formas, sin bitmaps. Se mantienen hashes, dimensiones lógicas y siluetas originales. Render Phaser aumenta densidad raster a 720×840 y compensa escala a 50% manteniendo pie, pad, depth, mundo, hitbox.
- No modifica infantería aliada P08 (ya pulida U04), sniper, enemigos, balance, campaña, economía o navegación. Uso memoria: +2 atlas raster 720×840; seguimiento rendimiento real móvil pendiente.
- QA Node bloquea SVG masters, Chromium WebGL2 en 1280×768, 844×390, 932×430 prueba construir/mejorar I/II, textura 2x, misma medida mostrada, oro, soldados y screenshots. Se conserva CI de M01 completo y U04.
- Baseline y rollback `cf9a50630cf7317dd8484c41d464bd60e5209b5c` (CI U04 #39783480481 SUCCESS). Aprobación cualitativa del Director en Android pendiente.


## 12. U06 — HD GLOBAL: DOS BLOQUES APROBADOS (22-OCT-2026)
- Orden del Director: ejecutar inmediatamente (1) segunda pasada Francotirador y (2) Guardiana, Bombardera, Torre de Control; sin nuevas solicitudes de permiso. Una sola rama `production/semantropic-td-live`, una sola URL.
- Base anterior U05: `ee4bd76e1bcde8b4e65241d577d4b46a979f6179` (CI #39808307542 SUCCESS). Render LIVE validado. Commit anterior sirve rollback sin forzar historia.
- Bloque A ACTIVO Y VISIBLE en Phaser M01: estructura y baranda frontal sniper I/II pasan de raster 2× (720×840) a vector raster 3× (1080×1260), con tamaño mundial idéntico (`worldScaleProposal / 3`), foot/anchor proyectado desde 360×420 original; operador P03/rifle sigue a 2× por restricciones de memoria y contrato de atlas, con seguimiento, muzzle, hit/kill sincronía y layering intactos. Conservamos Cuartel I/II 2× y aliados P08 2×. No prometer que 3× aumenta detalle artístico interno distinto del SVG original.
- Bloques B/C/D — **PREPARACIÓN VISUAL, NO TORRES JUGABLES AÚN**. Repositorio contiene originales históricos `public/assets/torre_guardiana.png`, `torre_bombardera.png`, `torre_control.png`; NO existen entradas Guardiana/Bombardera/Control construibles en el catálogo de Phaser M01 (`TOWER_ART_V2` contempla SOLO Infantería I/II y Francotirador I/II). Se implementa módulo reutilizable `official/src/towers-visual/u06/legacy-hd.mjs`: reescalado Canvas 3× con high-quality sampling, corrección leve de bordes interiores manteniendo silueta/alpha, protección PNG originales y compensación de tamaño lógica. Los assets HD se prueban y generan como vista comparativa capturada por CI **en la URL oficial bajo fixture QA**; el LIVE M01 NO muestra ni habilita las tres torres: integrar mecánicas/arte premium del Canvas V5 al Phaser es trabajo posterior separado y requiere autorización.
- QA real Node + Chromium WebGL2 tres resoluciones y nivel I/II francotirador verifica textura 1080×1260, mundo, rail/operator depth y P03 2×; fixture B/C/D fotografía originales frente a HD y registra dimensiones. Regresiones completas U03/U04/U05/M01 intactas, C1D shooter/targeting sin toques. Arte pixel PNG no recibe detalles nuevos; sólo tratamiento perceptual. FPS físico Android y aprobación estética pendientes.
- Próximo trabajo: evaluación del Director del Francotirador 3× y lectura comparativa HD B/C/D; no declarar las 3 torres jugables mientras falte implementación core/escenas.


## 13. U07 — ENTREGA DE ARTE HD B/C/D EN EL JUEGO OFICIAL (22 oct 2026)
- Autoridad: Director ordena «ejecuta lo faltante». Se confirma U06 CI #39813883261 SUCCESS para SHA `2e5dd154217c712b9cee82efcbed0205215956a3`, Render LIVE. Se prohíbe volver a pedir confirmación tras verbos ejecuta/avanza/confirmo/aprobado.
- U07 integra en LA MISMA URL LIVE un botón accesible `Torres HD` y galería modal móvil para tres torres preservadas: Guardiana, Bombardera, Torre de Control; muestra cada PNG maestro sin alterarlo frente a su Canvas reescalado HD 3× U06, permitiendo zoom. Carga a demanda; no requiere otro servidor, rama ni URL; tiene cierre, escape, accesibilidad/foco, y pausa/reanuda correctamente la partida cuando se abre. El juego mantiene el HUD, Phaser M01, 5 oleadas y los dos tipos construibles actuales.
- **Diferencia crítica**: es entrega VISUAL Y ACCESIBLE, no integración de combate. Las tres familias NO son construibles en el motor Phaser hasta una implementación de economía, targeting, arte y habilidades auditada con reglas V5. Mostrar botones para construirlas sin combate real sería engañoso; prohibido. El siguiente bloque de ingeniería será incorporación jugable por familia y balance autorizado, comenzando con una torre que tenga especificación V5 verificable.
- No tocar artes originales `public/assets/torre_{guardiana,bombardera,control}.png`; no modificar P03, SVGs, daño, economía, mapa, ni rutas. Incorporación visual de U07 es ligera y se computa únicamente al abrir galería (on-demand).
- QA Node de estructura/conservación y Chromium real 3 resoluciones: abrir galería, comprobar las tres parejas ORIGINAL/HD con factor, zoom, accesibilidad, cerrar y preservar el estado del mundo; QA regresión U06 y M01 completa.
- Rollback anterior `2e5dd154217c712b9cee82efcbed0205215956a3`. Aprobación visual Android físico del Director pendiente; CI/Render siempre validar SHA antes de declarar PASS.


## 14. R3-A M02 CAMPOS DEL MOLINO — NUEVO MAPA + CATÁLOGO REWORK (22-oct-2026)
- AUTORIZACIÓN del Director: pasar a Mapa 02, misma línea artística de M01, torres nuevas del rework. Ver `docs/direccion-general/ACTA_R3A_M02_CAMPOS_DEL_MOLINO_2026-10-22.md`.
- Fuente protegida Canvas V5: M02 163 waypoints, 8 pads, 1 ruta/entrada, oro nominal fuente 395, 7 oleadas [7,9,7,11,15,11,20] = 80 enemigos warrior/hound/archer/shieldbearer.
- Rework correcto recuperado de `SPECS.infantry/sniper/guardian/bomber/control`; ignorar «pulse/cannon/prism/frost» (recommend legacy en mapas V5). Objetivo 5 familias y 4 etapas, rama IV como fuente, sin afirmar port completo a Phaser.
- R3-A ejecutado DIRECTO en `production/semantropic-td-live` y misma URL, sin rama. Arte propio farmland 2× procedural de molinos/cultivos/herradura, pads y ruta fuente: `public/official/src/maps-visual/m02/farmland-art.mjs`. Contrato visual/canónico `public/official/src/maps-visual/m02/rework-contract.mjs`.
- Los recursos de M02 NO se montan aún en LIVE jugador: falta CORE M02, soporte archer/shieldbearer, economía, resultados, UI para mapa 02 y QA real 7 oleadas. NO ofrecer ni insinuar que M02 es jugable. Las capturas se producen solo mediante QA fixture efímero sobre el sitio existente.
- Prohibido reemplazar torres T04/P03 U06 por PNG antiguos. Guardiana/Bombardera/Control del legado visual U07 son consulta, no assets nuevos de producción. R3-B siguiente bloque: core autoritativo M02 con nuevas amenazas y torres aprobadas sin perturbar M01.
- Conservar contrato de Map01 LIVE probado SHA `f0c5de8575384bdb7d31e8a14ecaeb27eafd6328`; rollback mediante commit normal a esa base si es preciso. QA físico Android M02 no aplica hasta que sea jugable.


## 15. R3-B1 — CORE M02 SEPARADO / 7 OLEADAS (22-oct-2026)
- El Director autorizó expresamente «Perfecto comienza entonces» tras el bloque R3-A. Este paso implementa el primer corte de COMBATE real de M02 fuera de LIVE UI, conservando los archivos de M01 y las cinco torres del rework como objetivos.
- Núcleo propio en `public/official/src/core-c1d/m02-*`: `M02BuildEconomy` 395 monedas, ocho pads, dos primeras torres T04/P03 I/II con costos reales; `M02CombatWorld` 163 nodos, 7 oleadas [7,9,7,11,15,11,20], 80 spawns, derrota/victoria y ledger. `M02CombatWithInfantryA3` usa nav Dijkstra, bloqueo, rally, soldados, francotirador y ataque real a distancia del arquero, escudo HP×1,15 para portaescudos.
- Fuente estat E1 originales Canvas protegida, no inventar costes/recompensas/tipo. Adaptación inicial de bonos/Normal queda pendiente de paridad fina y ajuste humano. El core emite eventos de disparo pero sin efectos de flecha aún.
- `docs/direccion-general/qa-r3b-m02-core.mjs` audita economía, una flecha de daño real, escudo absorbente, 7 oleadas/80 entidades y no-duplicación; la victoria simulada se fuerza con llamadas legítimas de `hit()`: NO valida balance de jugador.
- M01 LIVE y el HTML de entrada permanecen sin modificación; M02 NO está publicado como mapa seleccionable, pues no existen sprites finales premium de archer/shieldbearer, UI/ruta visual y selector ni guardados M02. Continuar R3-B2 y R3-C antes de declararlo jugable. Sin ramas ni otra URL.
- Rollback anterior `6a1e5c812f5713dfb2f3690473a511e4de5c5f68` (R3-A, CI #39831468918 SUCCESS).


## 16. R3-B2 + R3-C MAPA 02 VISUAL / CAMPAÑA SELECCIONABLE (22-oct-2026)
- El Director autorizó por adelantado continuar todos los bloques necesarios sin nuevas preguntas, conservando un solo LIVE, rama principal y control DG.
- R3-B1 núcleo ya CI #39847128858 SUCCESS SHA 0ad0435816e12731e566b22452f1a72a0687ee9a. M01 intacto.
- R3-B2: nuevo adaptador Phaser `public/official/src/maps-visual/m02/phaser-world.mjs`: el arte procedural original M02 a 2× se carga en un único CanvasTexture de 2560×1536, ocho sockets `m02-pad-*` y estados de plataforma. `actors-visual/m02-enemy-gear.mjs`: arqueros y portaescudos diferenciados con equipamiento ilustrado vectorial sobre guerrero P08 homologado. Flechas VFX puramente visuales generadas desde `enemy_attack_fire` real CORE; medidor de escudo de portaescudo alimentado desde HP de escudo real, daño intacto. Estos dos diseños son adaptaciones iniciales y requieren revisión artística humana; no sustituir P03/P08 originales.
- R3-C: `scene-m02.mjs` propia de Phaser, manteniendo `scene.mjs` M01 byte a byte; oleadas 7/80, nuevas entidades del CORE, torres autorizadas Infantería I/II y Francotirador I/II, menús, rally, resultados. `m02-results-phaser.mjs` con clave de guardado segregada por mapa.
- Selector accesible `map-picker.mjs` en la MISMA URL `/official/src/live/`; M02 navega a misma ruta con `?map=2`, no crea servidor, página ni build experimental paralelo. Predeterminado sin parámetro = M01; revisiones anteriores de M01 se protegen por hash.
- Catálogo objetivo REWORK 5 familias; Guardiana, Bombardera y Torre de Control todavía NO están construibles en Phaser, faltan arte T04 premium específico, habilidades y QA de gameplay. El selector no promete estas tres. UI M02 con equipamiento vectorial inicial NO equivale a aprobación artística final del Director.
- QA real Chromium 3 resoluciones sobre pathname oficial: selector M01→M02→M01; terreno, construcción, animación/escudo, siete oleadas y 80 eliminaciones mediante `hit()` CORE con aceleración, récord M02 distinto; regresión extensa M01 intacta. El QA NO demuestra balance humano; no afirmar partida física Android ni FPS sin medir.
- Rollback R3-B1 estable `0ad0435816e12731e566b22452f1a72a0687ee9a`. Si CI/Render FALLA, reparar sin cambiar activos protegidos, o regresar mediante commit compensatorio, no forzar history.


## 17. R4 — ADAPTACIÓN RESPONSIVE MÓVIL + PC / PANTALLA COMPLETA (22-oct-2026)
- **Prioridad expresa del Director:** optimizar primero visualización y controles en celular y PC, poner pantalla completa; después continuar arte/rediseño M02. Suspender cambios de diseño artístico de M02 y sus nuevos assets por este bloque.
- Diagnóstico verificado de código: `scene.mjs` y `scene-m02.mjs` usaban `Phaser.Scale.ENVELOP` bajo 1000 px en paisaje, que llena ventana recortando bordes. Se reemplaza exclusivamente por `Phaser.Scale.FIT`: mantiene TODO el mundo lógico 1280×768 y conserva intactos rutas, pad geometry, cámaras y targeting.
- Los dos scripts Phaser cambian solo una instrucción de escalado y la ampliación de proximidad de toque táctil sobre pads de 55 a 80 unidades de mundo para `pointer:coarse`. El radio no altera footprint, daño, economía, camino ni colisiones. QA restringe hashes `7ab7c08bcc9244a302f4c0c4bfdd704c3df4239f` M01 y `0489edf223a7b772a083df690515b7eb3749fa86` M02. SHA fuente anterior M01 era `81a832c5185cdca93a8e4c1672e2bfc5217dfb1d`.
- UI oficial `public/official/src/live/index.html` añade botón accesible «⛶ Pantalla completa» y controlador `public/official/src/mobile/viewport-r4.mjs`: `requestFullscreen()` y salida, reflejo aria-pressed, eventos `fullscreenchange`, resize/visualViewport/ResizeObserver, `Phaser.ScaleManager.refresh`, intento no bloqueante de orientation lock landscape en equipos táctiles. Donde el navegador no expone fullscreen, indicar «Añadir a pantalla de inicio»; jamás prometer fullscreen universal en iOS Safari.
- Hoja `viewport-r4.css` con jerarquía top HUD/controles, safe-area notch, pantallas estrechas, landscape, retrato de orientación con CTA fullscreen, feedback y menús táctiles; sin eliminar controles ni desactivar zoom general del navegador.
- QA `docs/direccion-general/qa-r4-viewport.mjs`: hashes de escenas viewport-only, seguridad fullscreen, permanencia menú M01/M02. QA real `tools/qa-r4-responsive-browser.mjs`: 1920×1080, 1280×768, 932×430, 844×390, 667×375, retrato 390×844, FIT canvas sin cortes, selector de ambos mapas, escritorio fullscreen, capturas. Android/iPhone físicos/teclas y FPS **pendientes**.
- Criterios de aceptación: ningún borde de mapa cortado, campos clave visibles, legibilidad de HUD y menú, controls no superpuestos, fullscreen accesible cuando API compatible, salida sin perder partida, M01/M02 conservan oleadas/combate/economía. CI y Render validar SHA antes de declarar PASS.
- Rollback por commit normal a `d9d68a426f9fb0c2c569fc164bc71ea0157ab579`. Fuente de estilos/artes M02 no modificada en este bloque.


## 18. R5 — PANTALLA COMPLETA SIN FRANJAS LATERALES (22-oct-2026)
- **Reporte Android con captura física proporcionada por el Director**: pantalla completa browser funciona pero quedan gutters oscuros verde petróleo a izquierda y derecha. Captura muestra relación de aspecto ultra-ancha (>2:1) y base mapa 1280×768 = 5:3. No estirar personajes/torres ni recortar mapas.
- Solución: mantener Phaser.Scale.FIT y proyección del mundo 1280×768, construir una capa auxiliar de **extensión panorámica visual no interactiva** debajo del canvas Phaser para pintar los gutters del FIT con texturas ORIGINALES protegidas.
- Nueva `public/official/src/mobile/viewport-panorama-r5.mjs` obtiene desde Phaser los bitmaps originales M01 `maps/m01/aurora-v3/viva/ground` y `road`, y M02 `maps/m02/farmland/r3-b2`. Refleja SOLO los bordes del arte hacia fuera del mundo 1280×768, sin alterar geometrías, rutas, colisiones ni habilidades. La capa se actualiza al cargar escena y en resize/fullscreen/orientación, sin lecturas WebGL por frame y con tope de resolución para RAM móvil. `#viewportBackdrop` está detrás del canvas original y no recibe interacciones.
- `viewport-r4.mjs` expone `bindScene(scene,mapId)`, propagando resize; `scene.mjs` M01 y `scene-m02.mjs` M02 añaden una llamada visual de binding después del montaje de terreno. Pantalla completa, arte de torres y lógica de combate originales intactos.
- Persisten HUD y controles, mapa entero sin cortarse ni distorsionarse (FIT), galería HD y selector. Se actualizan guards SHA intencionalmente para M01/M02 (solo llamada de binding).
- Node R5 asegura texturas de terreno y nueva capa, QA Chromium prueba 6 viewports, muestras pixel lado izquierdo y derecho cuando corresponde, fullscreen, selector M01/M02 y regreso. QA física Android de la nueva versión pendiente.
- **Limitación del navegador**: al activar fullscreen puede aparecer temporalmente un aviso de salida que pertenece a Chrome/Android; el juego no puede ocultarlo.
- Rollback por commit normal a `803d0df524123188d7451a4e51c1bb6fd82944ee`. Una sola rama production y una sola URL LIVE.


## 19. R6 — M02 «CAMPOS DEL MOLINO» REWORK ARTÍSTICO PREMIUM (22-oct-2026)
- Director compartió mockup campiña/trigales/cascadas/molino/puentes premium y autorizó ejecutar integralmente el PROMPT MAESTRO previo. El documento maestro firmado es `docs/direccion-general/ACTA_R6_MAPA02_PREMIUM_2026-10-22.md`.
- Pintura procedural **original** de valle rural con alto detalle, separada en nuevo módulo `public/official/src/maps-visual/m02/premium-golden-valley-r6.mjs`. `farmland-art.mjs` redirige el pintado a R6 manteniendo API existente, anclajes del molino/casa, 163 nodos y 8 pads, fuente 2560×1536 a 2×. R5 panorama sin bordes y renderer M02 siguen funcionando.
- Paisajismo nuevo: montañas y villa distantes, río con cascadas, trigo con surcos, bosques ilustrados, puentes (principal + 2 secundarios), molino y vivienda detallados, carros/pacas, cercos y plataformas piedra. No usar/elaborar imagen descargada/derivada copiada del mockup.
- M01, clases/core de M02, oleadas, economía, armamento y todas las texturas de personajes protegidas, sin cambios. Rework 5 torres aprobado como destino, solo 2 jugables todavía; arte M02 no habilita automáticamente Guardiana/Bombardera/Control.
- QA de geometría, assets y WebGL2 realizado mediante Node y Chromium con capturas (desktop y Android emulado). En GitHub Actions se evita `--with-deps` cuando es posible para evitar timeout del espejo de apt de Ubuntu visto en CI anterior; si falla por librerías, reportar infraestructura separadamente.
- **No declarar arte 1:1 con mockup**. Pendiente evaluación estética en móvil físico; antes de más gameplay, revisar ese arte y ajustar detalles visibles.
- Rollback conocido `06d3ed136ce1934f3f7538aee45761f1e503492a`.
