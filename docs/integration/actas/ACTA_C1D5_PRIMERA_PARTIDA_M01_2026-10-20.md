# SEMANTROPIC TD — ACTA C1-D5: PRIMERA PARTIDA FUNCIONAL MAPA 01
**Fecha:** 2026-10-20 · **Motor:** Phaser 4.2.1 / WebGL2.
**PR:** #34 DRAFT · **Rama:** `feature/integrator-c1d5-m01-playable` · **Código probado:** `a5d51eeadc65b984a3bd229dfe862960b9a85537`.
**Base artística INMUTABLE y aprobada por usuario:** C1-D4R PR #30, M03 Viva/T04/P03 originales, PNG C1-C SHA256 `24103e45a0e1249fa4b89d4e65ea16d9e147bdf1e2462e5c4063469a931842ef`.
**No merge, no Render, sin publicación**.

## 01. Implementación CORE real
- `public/official/src/core-c1d/m01-infantry-nav.mjs`: grafo con 133 nodos sobre los waypoints M01 oficiales, aristas bidireccionales ponderadas, nearest-node, Dijkstra determinista y formación lateral de 34 unidades para dos soldados. Inspirado en `buildInfantryNav/infantryNearestNav/infantryShortestPath/infantryFormationOffset` reales del Canvas V5 protegido; no se modificó Canvas.
- `public/official/src/core-c1d/m01-infantry-combat-a2.mjs`: nueva variante de la Infantería C1-D3 original en módulo separado, movimiento por puntos de ruta, replanning moderado, bloqueo y ataques reales, respawn intacto, punto de reunión manual `setInfantryRally` validado por radio de la torre. No reescribe sniper, economía ni estadísticas.
- `public/official/src/core-c1d/m01-results-phaser.mjs`: resultado de core autoritativo, estrellas de acuerdo a `E5_STARS` de Canvas V5: 3 estrellas ≤5 fugas, 2 ≤25 fugas (**dos estrellas provisional según fuente**), 1 si más; derrota 0 estrellas. Sólo se guardan VICTORIAS reales, mejor récord prioriza estrellas/fugas/vidas. Key exclusivo `semantropic_td_phaser_m01_normal_v1` para no alterar el progreso global original.
- `public/official/src/c1d5-playable/{scene.mjs,index.html}`: motor Phaser WebGL2, mismos M03/T04/P03 oficiales, las dos torres permitidas I/II, pantalla de resultado con retry, indicador récord, botón táctil contextual de Reunión y controles previos de comprar/upgrade/vender/oleada/pausa.

## 02. Fuente de verdad, invariantes
- Mapa 01 133 vértices, 8 pads, 5 oleadas [8,10,11,13,21] = 63 warrior/hound; 365 oro y 100 vidas; fuga −2.
- El CORE decide HP, selección/alcance de Sniper, daño, recompensas, bloqueo e hit de Infantería, victoria y derrota; capa Phaser/P03 sólo dibuja.
- Se conservan cuatro SVG TORRES T04 originales y el código P03/M03 de C1-D4R, sin reemplazo por estilos M06/T07/P06. Ninguna fuente V5 protegida fue editada.

## 03. QA independiente ejecutada
[PASS REAL NODE] `tools/qa-c1d5-navigation.mjs`: grafo 133, rutas en ambos sentidos, separación 34, rally dentro/fuera de alcance, primera oleada con 6 bloqueos y 5 golpes melee, upgrades, y victoria real cinco oleadas (63 bajas, 0 fugas, 100 vidas, 8174 ticks). No-defense derrota 50 fugas.
[PASS REAL NODE] `tools/qa-c1d5-results.mjs`: umbrales 5/25 de Canvas V5, derrota nunca registra victoria, récord best-of, corrupt storage/localStorage unavailable sin romper juego.
[PASS REAL NODE] regresiones `qa-c1d2-sniper-parity`, `qa-c1d2-combat`, `qa-c1d2-five-waves`, `qa-c1d3-infantry` + lock fuente C1-D4R.
[PASS REAL BUILD] Phaser 4.2.1 compile.
[PASS REAL CHROMIUM WEBGL2] [Actions #39465476757](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39465476757), HEAD código SHA `a5d51eeadc65b984a3bd229dfe862960b9a85537`; desktop 1280×768, móvil emulado 844×390 y 932×430: compra de Infantería y sniper, rally por touch, primera baja, recompensa única, pausa/reinicio, encuadre sin letterbox.
[PASS REAL CHROMIUM] derrota natural sin defensas: 50 fugas, vidas=0, modal Sin estrellas y 0 registro persistido (11.067 ticks simulados).
[PASS REAL CHROMIUM] victoria natural mediante política automatizada comprando torres: cinco oleadas, spawns=63, kills=63, fugas=0, lives=100, tres estrellas, récord de 0 fugas persistente después de click en 'Volver a jugar' (8.174 ticks simulados).
Arte y UI inspeccionados en capturas reales; misma identidad C1-C. Evidencia de imágenes + logs: artifact GitHub ID `12284871818`.

## 04. Alcance correcto de los resultados
- La victoria Chrome usa el **CORE REAL** acelerado por script de compras; no fue jugada manualmente por usuario. El producto todavía requiere playtest humano del ciclo completo.
- El récord pertenece a esta prueba Phaser M01 y NO desbloquea mapas ni reemplaza el perfil Canvas/campaña V5. No hay cloud sync ni checkpoint de una partida en curso.
- La navegación A2 implementa el **grafo y Dijkstra de Canvas V5**, pero NO constituye paridad completa de todos los estados/especializaciones/obstáculos. M01 solo permite niveles I/II.
- Chromium con SwiftShader no equivale a un iPhone/Android físico, y no tenemos medición de GPU real del usuario.

## 05. Dependencias paralelas / próximos pasos
- MAPAS M07-Q2: Prompt Maestro entregado al equipo para optimizar caches, leases, render, legibilidad y perf respetando M03 Viva 100%.
- TORRES T08-HF1 y PERSONAJES P07-HF1 siguen trabajando en bloqueantes registrados en PR #29 y #32. No mezclar esos recursos hasta pasar QA y aprobación visual.
- Siguiente Gate: playtest humano con feedback del usuario, pulido de UX/legibilidad HUD, balance M01 y dispositivos físicos. Después posible staging aislado SOLO con autorización. PR #34 permanece Draft.

## 06. Veredicto
**APROBADO TECNICAMENTE PARA CANDIDATO DE PRIMERA PARTIDA M01** sobre arte protegido. No significa publicación, versión comercial ni campaña 140 completa. SOURCE LOCK y rollback C1-D4R protegidos.
