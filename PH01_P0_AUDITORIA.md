# SEMANTROPIC TD · PH-01 P0 — AUDITORÍA Y PARIDAD INICIAL
Fecha: 2026-10-19
Estado: INICIO DE PRODUCCIÓN. NO ES M01 COMPLETO NI MIGRACIÓN TOTAL.

## Decisión del director [APROBADO]
- Phaser pasa a ser proyecto principal de producción HTML5.
- Canvas 2D V5 queda congelado como respaldo/fuente mecánica, PixiJS es histórico.
- Arte estilo C aprobado. No copiar assets externos, no ir a Unity ahora.
- No modificar geometría canónica sin aprobación específica por mapa.
- Trabajar P0 → P8 con compuertas y QA real, preservando siempre baselines.

## Versiones verificadas [CONFIRMADO EN CÓDIGO]
- GitHub repo: Danielsanchezdesarrolador/semantropic-td-phaser-lab.
- baseline T1: rama main / Render semantropic-td-phaser-lab.
- baseline T2-C: rama experimentos/t2c-revolucion-artistica / Render semantropic-td-t2c-art-phaser.
- baseline T3-B: rama art/t3b-propuesta-c / Render semantropic-td-t3b-art-c.
- nueva rama principal en preparación: production/ph01-p0-m01, derivada de art/t3b-propuesta-c.
- Dependencia Phaser: package.json phaser 4.2.1; build estático usa node build.mjs, copia public a dist y empaqueta phaser.min.js localmente.
- Canvas V5 referencia GitHub: public/JUEGO_V5_CANVAS.html, blob SHA 9b800007bd7a6b591b01a11c5e1344cbee2a7df2.
- Archivo ZIP Canvas V5 candidato disponible en la conversación con público, iPhone y DEV, mapas y 140 datos, informe QA. Su informe señala **NO CERTIFICADO balance final** y victorias legítimas pendientes.

## Fuentes mecánicas exactas del Canvas público [CONFIRMADO EN ARCHIVOS]
| Subsistema | Líneas aproximadas en V5 público | Hallazgo |
|---|---|---|
| Geometría diez mapas | 742–745 | MAPS con caminos, spots, biomas y escala |
| Tech map / vidas / oro | 1677–1703, 1729–1734 | E5_MODES, E5_TECH, E5_MAP_BALANCE, startingGold y vidas=100 |
| Guardados | 1867–1875, 1990–2025 | schema 1401 y checkpoint separado del legado |
| Vida y pérdida de fuga | 2266–2280 | idempotencia por ID, −2 común, −30 jefe |
| Spawn, HP, velocidad | 2246–2263 | se basan en wave, def y E5 mode; reglas QA adicionales por mapas posteriores |
| Enemigos E1 y hound E3 | 2380–2404 | M01 usa warrior / hound, ambos en catálogo real |
| Tres jefes | 2409–2417 | M05 mistlord, M08 ruinwarden, M10 eclipseemperor |
| 140 oleadas | 2598 | E3_CAMPAIGN, grupos e intervalos declarativos |
| Progresión tech | 1685–1700 | M01 solo Infantry2 y Sniper2, Guardiana/Bombardera/Control no desbloqueadas |
| Tutorial | bloque independiente | Script T-00 verificado en fuente original, no portado |

## Contratos de datos extraídos sin reinterpretación
- \`public/official/data/maps.v5.json\`: el ARRAY \`MAPS\` completo; 10 mapas y rutas.
- \`public/official/data/campaign140.v5.json\`: el objeto completo \`E3_CAMPAIGN\`; esquema de 140 oleadas.
- M01: 133 vértices, ocho spots, oro inicial 365, vidas canónicas 100, escala .9.
- M01: 5 oleadas, cantidades 8/10/11/13/21 = 63 unidades, tipos warrior/hound.
- Suma de daño potencial sin defensas = 63 × 2 = 126. Sin defensas hay derrota natural tras 50 fugas.
- M01 mapa tiene campo histórico \`lives:22\` obsoleto: la función E5 actual \`e5StartingLives\` **SIEMPRE devuelve 100**. PH01 usa 100.
- M01 map.spots incluyen legacy \`recommend\` (pulse/cannon/prism/frost): **NO** son catálogo de torres autorizado. No convertirlos en familias activas.
- M08 aparece como "Ruinas del Imperio Perdido" en \`MAPS\`: historial de nombre alternativo "Valle de las Tormentas" requiere decisión de director antes de renombrar.

## Matriz inicial Canvas ↔ Phaser (estados fiables)
| ID | Subsistema | Canvas candidato V5 | Phaser T3-B antes PH01 | Primer aporte PH01 | Riesgo/estado |
|---|---|---|---|---|---|
| MAP | 10 mapas, caminos, pads | 10 rutas distintas MAPS | 1 camino simplificado laboratorio | Datos 10 mapas copiados fielmente, render solo M01 | Datos confirmado, render de los demás pendiente |
| WAV | 140 oleadas, grupos, cadencia | Objeto E3_CAMPAIGN | 5 oleadas sintéticas T3B | Declarativas 140 copiadas y validación completa; M01 usa grupos reales | Parcial |
| NAV | movimiento, multientrada | E1/E3 + ramas | Ruta simulada T3B | Seguimiento continuo de 133 puntos M01 | Solo suelo/M01; intercepciones pendientes |
| SPA | enemigos E1/E2/E3 | Warrior/hound inicial; 18+ tipos posteriores | Scout/brute/seer sintéticos | Warrior y hound de M01 en modelo sin defensa | Combate y catálogos restantes pendientes |
| TWR | cinco torres, niveles, skills | Familias y desbloqueos E5 | 4 torres demo con daño propio | Confirma M01 Infantry2/Sniper2, construcción desactivada | BLOQUEANTE para victoria M01 |
| ECO | oro/precios/recompensa | Oro M01 365, recompensas y ledger E5 | Oro de ensayo 350 | Inicial oro 365, no se debita/abona sin fuente total | No premiar economía falsa |
| ESC | 100 vidas, −2, −30 jefes | Deduplicación por ID | daño variable por enemigo demo | −2 común, idempotente, derrota natural | TEST P0 aprobado; jefes pendientes |
| STARS | 1/2/3 stars, fugas/boss | E5_STARS con 2★ provisional | Sin progreso canónico | Sin estrellas ni victorias | PENDIENTE |
| DIF | cinco modos | E5_MODES reales | modo demo único | solo normal disponible en smoke | PENDIENTE |
| BOSS | tres jefes slots | M05/13 M08/19 M10/23 | 0 jefe real | IDs se conservan en campaign JSON | PENDIENTE |
| SAVE | progreso/checkpoint | claves con schema 1401; legado preservado | sin save oficial | NO escribe localStorage todavía | PENDIENTE |
| UI | menus, radial táctil | implementado Canvas V5 | móvil sin lateral fijo T3B | HUD preliminar para M01 | PENDIENTE QA browser |
| DEV | consola/fixtures | presente en Canvas | lab fx/perf | nodos de camino togglables | PENDIENTE |
| TUT | tutorial T-00 | siete etapas previo candidato | ninguno | no portado | PENDIENTE |
| ART | biomas, enemigos, FX | Canvas procedural | T3B estilo C procedural | mapa real con señalización placeholder | PENDIENTE aprobación visual |

## Nueva arquitectura incremental (sin refactor destructivo)
\`\`\`
public/official/
  index.html                  # entry independiente para M01
  data/maps.v5.json           # copia exacta, solo lectura
  data/campaign140.v5.json    # copia exacta, solo lectura
  src/m01-model.mjs           # contrato/geométrico y simulación pura smoke
  src/m01-preview.mjs         # bridge Phaser y UI smoke
tools/qa-ph01.mjs             # test automatizado de contrato y derrota natural
PH01_P0_AUDITORIA.md          # presente informe
\`\`\`
Siguientes capas de producción: \`core/CombatState\`, \`core/EnemyBrain\`, \`core/Infantry\`, \`core/TowerDefs\`, \`core/Economy\`, \`core/Results\`, \`core/Saves\`, \`view/\`, \`ui/\` y \`dev/\`. **Propuesta modular**, aún no es código integrado.

## QA disponible
- [PROBADO] comparación estructural 10 mapas/140 oleadas; M01 ruta 133 / spots 8 / spawns 63.
- [PROBADO] simulación pura JS smoke Normal SIN TORRES: se ejecutan 5 oleadas; 63 spawns; vida llega a cero en la oleada 5 por 50 fugas; escapar 2 por enemigo, registro único de ID.
- [PENDIENTE] servicio estático Phaser, captura real WebGL2 y landscape; no afirmar QA física sin capturas.
- [PENDIENTE] construcción y costos fuente, upgrades, daño, bloqueo, guardados, victoria/derrota completa, estrellas y superabilidad Normal.

## Compromisos P0–P8
P0: auditoría, baselines, extracción y matriz de paridad; primero smoke real.  
P1: gameplay modular, cámaras y controles (M01) sin falsear sistemas ausentes.  
P2: portar M01 como partida completa: dos familias iniciales, 5 oleadas, 100 vidas, pérdidas 2, economía, victoria/derrota, guardado y QA táctil; la geometría alternativa necesita aprobación del director.  
P3: cinco torres y habilidades E1/E2; ramas y bloqueo reales.  
P4: M02–M10 secuencial con jefes; no decir migrados solo porque tienen JSON.  
P5: resultados, progresión, DEV y tutorial.  
P6: arte C premium por mapas con aprobación.  
P7: árbol global y héroe (futuros, no implementados).  
P8: QA móvil, balance de campaña y candidato release.

## Diagnóstico cámara / escala
- Lógica Canvas: mundo 1280×768 (5:3); responsive actual T3B usa \`FIT\` + HUD superpuesto sin panel lateral.
- En teléfono 844×390 (2.16:1), world FIT puede producir bandas laterales horizontales: el problema es ENCUADRE/CÁMARA, no aumentar 8K PNG.
- En un panel de 844×390, una composición 5:3 completa ocupa ~650×390 y deja ~97 px de margen a cada lado. Es estimación geométrica, NO captura.
- P1 empieza con FIT para no cortar entradas/salidas y overlays perimetrales; comparar composición en navegador y proponer encuadre revisado antes de canonizar geometría.
- Rango táctil, escala visual de torres/personajes/HP y posición de HUD deben ser medidos en smartphone landscape, sin FPS benchmark nuevo.

## Aprobaciones abiertas
- Elegir propuesta de rework específica para M01 (ruta/plataformas nuevas) luego de ver actual vs propuesta; estilo C está aprobado pero NO cada geometría.
- Validar art masters nuevos; los primeros procedurales T3B aún son placeholders.
- M08 nombre histórico y comportamiento jefe deben ratificarse donde haya discrepancia.
- Política no destructiva de importación de guardados antiguos, cuando haya paridad real.
