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
