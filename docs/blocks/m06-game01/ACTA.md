# M06-GAME-01 — dos entradas, 15 oleadas

Orden de Dirección 27/10/2026: habilitar campaña Normal M06 sin retocar arte. Base producción 8abaa92a640ce810b299453dcc41f92a0c76d594; rama feat/m06-game01. Fuente protegida: maps.v5.json/campaign140.v5.json y Canvas V5 E1/E3/E5/QA17B. AGENTS, roadmap y canon artístico leídos.

## Arte congelado y alcance compartido

M06_ART_VERSION=m06-hf-eroded-banks-blue-v3. Todos los archivos artísticos previos, PNG, camino, pads, materiales, decoración y preview permanecen byte idénticos. Se añade phaser-world como adaptador de mountM06Artwork/makeM06ArtPlan y sockets projectMapSocket; no se vuelve a pintar el mapa.

Cuatro integraciones compartidas: selector/index (6, import escena), map-picker (metadatos495/100/15), panoramaR5 (registro6 usando el callback de márgenes aprobado), scene-m02 (exclusión de autoarranque6 y reacción al evento tower_destroyed para retirar la torre visual usando los métodos existentes). Los cores y reglas M01–M05 no se editan. La guarda congela TODO public anterior excepto esos cuatro archivos; actualiza pins explícitos y dispatch de guardas artísticas al alcance M06-GAME autorizado. Las expectativas de selector de pruebas históricas pasan de1–5 a1–6; sus mapas mantienen arte/reglas originales.

## Dos rutas reales

M06DualRouteWorld extiende CampaignCombatWorld + withCampaignInfantry. Sobrescribe únicamente creación de cola, spawn y movimiento para vincular routeStart0/1 a rutas autoritativas y sus rutas aéreas. Mantiene el algoritmo de bloqueo/daño del precedente. Conserva routeStart en cola, entidad, eventos (incluso muerte/fuga después de retirar del mapa de entidades) y snapshot routeState. Posición inicial y routeLength provienen de la ruta de esa entidad. No se intercambia una ruta global al procesar enemigos.

Infantería: combina los grafos independientes por coordenadas de nodos compartidos, sin crear el falso enlace entre final de la primera ruta e inicio de la segunda. 486 entradas de waypoints, 353 nodos únicos; bordes únicamente entre vecinos oficiales. Rally y Dijkstra existentes se reutilizan. Reinicio/navegación usan el ciclo existente de escena/documento; estado y contadores se construyen de nuevo.

## Campaña y reglas

M06 Normal: oro495, vidas100, nueve pads, rutas243+243, quince oleadas,125 enemigos,69 oeste y56 sureste, nueve tipos; bossSlot=null en todas. No se importa jefe de M05.

HP: fórmula V5 por map.scale1.1 y enemyHpMultiplier1.03. QA17B aplica .65 a warrior/shieldbearer/brute desde legacyWave>=8; en campaña15 corresponde a W12, no W8. Sin QA16 Normal M06 adicional. Velocidad, recompensa normalizada (10/15)^.32, escudo1.15, armadura/resistencias y bonos V5 auditados. Sniper M06 Normal tiene factor1.08 QA17B. Los tests extraen definiciones del Canvas protegido, no inventan estadísticas.

Reutiliza warrior, hound, archer, shieldbearer, brute, bat y shaman. Voladores tienen polilínea aérea V5 específica por cada ruta; no son bloqueados por infantería. Shaman cura32, radio168, canal .98s y cooldown7.

Aliengunner: fuenteE3, HPfactor1.02, velocidad58, recompensa24, daño11, rango158, intervalo1.9, windup.36. Apunta a soldados, lanza proyectil de velocidad305 y vida1.3; se cancela contra objetivos inválidos. No es un warrior con otro color.

Demolisher: fuenteE1, HPfactor3, velocidad32, recompensa45, daño38, rango138, intervalo2.5, windup.75. Prioriza soldados disponibles y puede atacar torres. E1 especifica daño estructural directo, NO explosión de área/suicidio: no se inventa. Estructura base Infantería170/Sniper135, incremento12% por nivel, upgrade preserva proporción HP. Destrucción sin reembolso, cancela proyectiles/tropa dependiente y permite reconstruir desde I sin heredar inversión; estado de ruinas es del core, sin nuevo pack artístico de escombros ni HUD. El evento existente de interacción dispara redibujo y feedback. No se rediseñan torres ni VFX.

El tick local conserva el flujo del core y espera también a proyectiles enemigos antes del cierre. Victoria solo W15 y todos resueltos. Resultado y guardado exigen125 spawns y15 olas; clave semantropic_td_phaser_m06_normal_v1, sin escribir claves M01–M05. 3★≤5fugas;2★≤25 provisional V5;1★ resto. No hay penalización por jefe inexistente. Storage bloqueado se maneja sin impedir jugar.

## Actores provisionales

Brute/shaman/aliengunner/demolisher reutilizan sprites originales P08/P03 con escala/tint y nombres en los dos arquetipos nuevos; se rotulan provisional en metadatos y acta. Bat reutiliza M03. No se generan sprites, armas o VFX nuevos. Es paridad mecánica acotada a las dos familias I/II disponibles, no aprobación definitiva de arte de enemigos ni cinco dificultades.

## QA y límites

- qa-m06-dual-routes: fixture explícita de geometría, no simulación de balance. Spawn/avance/fuga0/1, pausa y grafo sin atajos.
- qa-m06-game01-core: fuente Canvas, 15 olas125 grupos69/56, presupuesto real, victoria/derrota, proyectil alien, IA/demolición sin devolución/reconstrucción, rally, estrellas, guardado aislado/bloqueado. No cambia datos ni fuerza daño/oro en la campaña de finalización; fixtures de habilidades se identifican separadas.
- qa-m06-game01-browser: WebGL2 PC1280×768, táctil844×390/932×430. Construcción/venta real en9pads con presupuesto suficiente, reinicio; InfanteríaII/rally y W1 real. Campaña completa por pasos explícitos del core y presupuesto real; W15 representativa por RAF desde fixture wave14 con saldo original495, sin modificar HP/oro/velocidad; captura ambos frentes y daño verdadero. Derrota sin torres por pasos. Resultados/record/reinicio, navegaciónM05→M06→M04→M06 y smokeM01–M03, una escena/canvas.
- En software GPU el dibujo se suprime ENTRE checkpoints de RAF para que el reloj normal progrese; se restablece y esperan frames renderizados antes de capturar. No se cambia timescale ni renderer productivo. La primera prueba continua tuvo timeout de60s por escaso avance del reloj bajo software GPU; no fue contada PASS. No se certifica render continuo/FPS/teléfonos físicos.
- Pruebas previas: core15/125 completo,26vidas,88bajas,37fugas,1★ con una estrategia de Snipers y reconstrucción. Demuestra terminabilidad con esa estrategia, no balance óptimo/3★ ni aceptación humana. Fuente de estadísticas y reglas sí auditada.

No declarar publicado hasta CI del HEAD y verificación de bytes/navegador Render. CI/PR y capturas finales se registran al cerrar. Rollback mediante revert del merge, conservando la URL única y claves de guardado. Ninguna rama histórica se elimina. La incidencia previa de la suite general R7 queda fuera del bloque; no se afirma un PASS global por pasar estas suites.

## Distribución canónica

| Oleada | Ruta0 | Ruta1 | Total |
|---|---:|---:|---:|
| 1 | 5 | 2 | 7 |
| 2 | 3 | 3 | 6 |
| 3 | 3 | 3 | 6 |
| 4 | 5 | 3 | 8 |
| 5 | 4 | 1 | 5 |
| 6 | 4 | 1 | 5 |
| 7 | 5 | 3 | 8 |
| 8 | 4 | 3 | 7 |
| 9 | 1 | 6 | 7 |
| 10 | 6 | 6 | 12 |
| 11 | 8 | 6 | 14 |
| 12 | 3 | 4 | 7 |
| 13 | 5 | 5 | 10 |
| 14 | 5 | 5 | 10 |
| 15 | 8 | 5 | 13 |
| Total | 69 | 56 | 125 |

Mantenimiento: los overrides locales de cola/spawn/movimiento y cierre parten del core compartido congelado de la base indicada. Un futuro arreglo global de esos algoritmos deberá contrastarse también con M06; no se duplica el motor completo ni se cambian sus consumidores anteriores.

La evidencia browser-local-candidate corresponde a la ejecución candidata que pasó todos los checks funcionales; sus primeras capturas W1 se hicieron con dibujo oculto y NO se entregan como evidencia visual. El driver final restablece visibilidad y espera frames de render antes de cada captura; CI y navegador público deben validar y capturar esa versión final. Las imágenes W15 y victoria aquí incluidas sí muestran la escena renderizada.
