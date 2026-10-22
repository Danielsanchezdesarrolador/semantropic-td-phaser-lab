# SEMANTROPIC TD · R3-A Mapa 02 — identidad M01 y torres nuevas (22 oct 2026)

## Autorización y fuentes
Director indica avanzar Mapa 02 «Campos del Molino», mantener la misma identidad que M01 y usar **cinco familias nuevas del rework**, no sprites/íconos de torres antiguas. Fuentes:
- `public/official/data/maps.v5.json`, M02 id 2, ruta 163 puntos, 8 pads y geometría una entrada.
- `public/official/data/campaign140.v5.json`, M02 siete oleadas [7,9,7,11,15,11,20], 80 enemigos warrior/hound/archer/shieldbearer.
- `public/JUEGO_V5_CANVAS.html`: `SPECS.infantry`, `SPECS.sniper`, `SPECS.guardian`, `SPECS.bomber`, `SPECS.control`. Las recomendaciones legacy de pad pulse/cannon/prism/frost NO son el catálogo de torres canónico.
- Baseline visual M01 C1-C / M07-Q2 protegido + T04/P03 y HD U04/U05/U06.
- Registro histórico R3-0 PR #45 se recuperó para la prueba Node canónica, sin fusionar ese PR ni crear ramas.

## Entregado por este bloque
1. `public/official/src/maps-visual/m02/farmland-art.mjs`: arte procedural propio editable de granjas, molino, parcelas, camino de herradura y ocho basamentos, fuente lógica 1280×768 y textura 2× de 2560×1536. No altera rutas, pads ni balances.
2. `public/official/src/maps-visual/m02/rework-contract.mjs`: contrato cinco familias, nombres, cuatro fases y estado real Phaser. La línea de torres T04/P03 en Infantería y Francotirador se conserva como base. Guardiana, Bombardera y Control requerirán nuevos assets oficiales premium para Phaser; **no** reemplazarlos por `assets/torre_guardiana.png`, `torre_bombardera.png` o `torre_control.png` del legado.
3. `tools/qa-r3-m02-canonical.mjs`: gate de fuente recuperado (PR #45); `docs/direccion-general/qa-r3a-m02-rework.mjs`: assertions de fuentes inmutables y torres.
4. `tools/qa-r3a-m02-art-browser.mjs`: prueba real Chromium que dibuja el mapa 02 original en **fixture efímero superpuesto en QA** sobre la URL oficial, 1280×768, 844×390 y 932×430. Capturas al paquete de Actions.

## Alcance / prohibiciones
**R3-A entrega la base artística y especificación de M02, NO declara M02 jugable**. No se publica selector que lleve al jugador a una partida incompleta; LIVE M01 permanece idéntico. No se crea otro enlace ni rama de prueba.
- M02 core bloqueante: combate de arquero ranged y portaescudos con escudo real, IA contra infantería, economía del mapa 02, spawn 7 oleadas y selector/guardado por mapa.
- M01 está hardcodeado a 133 waypoints, map id 1, 5 waves, solo dos enemigos; no parchear índices sobre ese core. Lives M02 de Canvas (21) no debe copiarse ciegamente sobre política 100 vidas Phaser. Revisar paridad.
- El mínimo siguiente objetivo es R3-B: CORE genérico M02 + enemigos nuevos auditados, sin alterar M01. R3-C: selector dentro del mismo LIVE, publicación solo tras siete oleadas y QA doble M01/M02.
- Cumplir pruebas Node/Chromium, verificar Render mantiene M01 y registrar rollback.

## QA
Node: source locks, 163 nodos, 8 pads, 7 oleadas, 80 spawns, 5 torres rework.
Chromium: screenshot mapa M02 por viewport y continuidad M01.
Android físico: PENDIENTE, no inventar FPS.
