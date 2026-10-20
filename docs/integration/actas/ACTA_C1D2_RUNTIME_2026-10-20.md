# SEMANTROPIC TD — ACTA C1-D2 RUNTIME M01 · 20-10-2026
**PR:** https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/22
**Rama:** feature/core-c1d2-runtime-m01, base PR #18 @ 33788fdd9e0b6ce8ab153e46bca4b9ea2ac1aad2.
**Alcance:** Primer combate REAL de Francotirador I/II M01 Normal; escena Phaser con visuales M03/T04 provisionales. Infantería sin gameplay (C1-D3). Ni M05/T06/P05 integrados ni staging.
**Fuentes:** Canvas V5 protegido: sniperReleaseShot, sniperDamage, sniperProjectileHit, hurt, campaign140Bounty, e5Credit, spawnE1Enemy; maps.v5.json M01; campaign140.v5.json 5 oleadas.
**Sistema:** 133 waypoints, 8 plataformas, 5 oleadas de [8,10,11,13,21] enemigos warrior/hound, 365 monedas, 100 vidas, -2 fuga; héroe/boss NO presente.
**Combate:** target PRIMERO por progreso/ruta y alcance; spot power/focus/tempo desde sniper-parity.mjs; windup 0.26/0.25, cadencia 1.65/1.55; proyectil a 840u/s; hit reduce HP y recompensa exactamente una vez; sell cancela proyectiles visuales/modelo; la Infantería sigue sin bloquear ni atacar.
**Economía:** M01BuildEconomy único ledger, +bounties warrior 16 y hound 13 aplicando factor de M01, bonus de oleada solo una vez y no en última ola; oro no negativo y cierra al terminar.
**Evento:** instancia core emite attack_windup, attack_fire, hit_applied, entity_die, entity_escape, wave_clear, defeat; esquema candidato combat-events-v1, bridge global todavía no instalado. Solo core modifica estado.
**UI:** /official/src/c1d2-combat/ en build aislado (NO desplegado a Render). Base gráfica M03/T04 provisional; overlays enemigos sencillos no son P05. FIT móvil no resuelto en esta rama.
**CI:** https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39427116327.
Primer run: PASS sintaxis, PASS Node combate/paridad, PASS npm build, Chromium FALLÓ en inicialización de escena (#feedback selector no encontrado). Se añadió diagnóstico HTTP/HTML para la siguiente ejecución; consultar Actions y QA JSON antes de afirmar C1-D2 navegable.
**Pendientes:** Chromium WebGL2 capturas auténticas 1280×768, 844×390, 932×430; revisar UI móvil; auditoría de art M05/T06/P05 y doble rifle; visual-event adapter central, saves/estrellas/infantería y balance.
**Prohibición:** No main/integration/phaser/producción, no actualización staging/c1d-playtest, no merge de PR #22 hasta QA + revisión.
