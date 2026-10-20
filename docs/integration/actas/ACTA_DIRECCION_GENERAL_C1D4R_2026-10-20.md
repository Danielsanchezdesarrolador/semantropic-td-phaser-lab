# SEMANTROPIC TD — ACTA DIRECCION_GENERAL C1-D4R / VISUAL LOCK
**Fecha:** 20 octubre 2026 · **Integración:** PR #30 DRAFT → PR #28 · **BASE CODE HEAD:** f9ba3cbbe0b1733782e5b368691179d5afdf864c · **BUILD HEAD PROBADO:** 0f8ca6199598dce1afa2ae5c062dd666803d5235

## Directiva del usuario
La imagen oficial adjunta por el usuario C1-C M03+T04+P03, 1280×768, SHA256 24103e45a0e1249fa4b89d4e65ea16d9e147bdf1e2462e5c4063469a931842ef, es la referencia VISUAL APROBADA. PR #28 M06/T07/P06 funciona técnicamente pero su diseño fue rechazado por pérdida de continuidad. La restauración corrige PRESENTACIÓN, sin regresar al showroom sin combate.

## Auditoría GitHub reproducible
[CONFIRMADO EN FUENTE] PR #12 C1-C @ 053237d559ab5b0f014deee37e997e328095831f.
[CONFIRMADO EN FUENTE] M03 public/official/src/maps-visual/m01/m03/renderer-v3.mjs Git blob d0e72f80a730c030e497721f7d05dad32be3b61a idéntico al C1-C.
[CONFIRMADO EN FUENTE] P03 public/official/art/actors/p03-rig.mjs blob 1a4282e1652ff559b92e18f42db465d6bfb8e729 idéntico al C1-C.
[CONFIRMADO EN FUENTE] Los cuatro SVG de torres públicas actuales difieren del C1-C. Se copiaron 4 blobs históricos exactos PR #12 (infantry I/II, sniper I/II) al directorio PROPIO de Integración c1d4r-combat/heritage/t04/towers/*.svg. NO se restauraron encima de TORRES/T07, hay rollback total.

## Implementación real (no sólo plan)
- Nueva escena pública de branch (aún sin Render) `/official/src/c1d4r-combat/index.html` y `scene.mjs`.
- Canvas M03 original (palette viva) sin geometría nueva, mismo camino y ocho sockets.
- Cuartel y Francotirador visual T04 exactos con escalas/anchors T04 originales; P03 crea cuatro atlas Canvas 32 fotogramas actor por actor en Scene.create(), sin superposición de rifle T07.
- Operador P03 y T04 replican slot antiguo de C1-C. Es un montaje histórico no un rework. VFX T07 se usa SÓLO como presentación de attack_fire/hit_applied autoritativos y proyecta muzzle desde meta T04; no cambia origen de proyectil de gameplay.
- Core preservado `M01CombatWithInfantry` con compra, venta, upgrade, HP, movimiento de ruta, bloqueo, windup, melee, sniper, fugas y bonificación. HUD landscape y toque de pads heredados de C1-D4, sin alterar M01 V5 protegida.
- ARCHIVOS NUEVOS solamente bajo scene+integration+QA+workflow; carpetas de arte MAPAS/TORRES/PERSONAJES intactas.

## QA ejecutada
[PROBADO EN NODE] `node tools/qa-c1d4r-source-lock.mjs`: coincide el Git SHA de 7 fuentes históricas; escena NO importa M06/P06/T07 single-rifle layers. Compilación Phaser 4.2.1 PASS. Pruebas regresión `qa-c1d2-sniper-parity`, `qa-c1d2-combat`, `qa-c1d2-five-waves` y `qa-c1d3-infantry`: PASS.
[PROBADO EN CHROMIUM WEBGL2] [Actions #39451203262](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39451203262) concluyó SUCCESS con `set -euo pipefail`. Tres viewports 1280x768, 844x390, 932x430. En cada uno: mapa renderer M03, torres T04 y textura 4 actores P03, compra de Infantería y Francotirador, primer kill/recompensa, pausa, reinicio, canvas fullbleed en móvil emulado y selección de socket con tap real de Playwright.
[CAPTURAS VERIFICADAS] Artifact GitHub ID 12278517252 incluye x9 imágenes before/first-kill/restarted. SHA256 desktop first kill d0c1417fc9c23a014c91fe4d7bdb10776ddde2d508618f8280aa4289157b78f9; landscape844 bad22eb2ca3df08309a888d77300f2edbca250a18bd0e231cdfd6c99523209ca; landscape932 b125f12fabcef91621787021e5c150f0ea314bc8c18c11a30ea5e4a84e0c7db1.
[VISUAL INSPECTION DIRECTION] Captura desktop actual mantiene terreno/camino/árboles/praderas, torre T04 alta y silueta P03 warrior/hound. No hay aprobación estética final del usuario. Las posiciones de las torres y enemigos difieren de screenshot original porque son estado auténtico de partida, no escena showroom arreglada.

## Bloqueantes / límites honestos
- [PENDIENTE APROBACIÓN USUARIO] Revisión de comparativa original 1280×768 vs screenshot del primer kill C1-D4R. No se debe confundir CI verde con calidad comercial aprobada.
- [PENDIENTE] C1-D3 A2 navegación/rally paridad completa Canvas V5 y QA humano de las cinco olas.
- [PENDIENTE] Estrellas/resultados/guardado D5, balance D6, mobile físico y revisión de HUD de la partida.
- [NO DESPLEGADO] Render C1-D1 permanece estable; PR #30 Draft no merged, no promoted.
- La imagen oficial está suministrada por el usuario y enlazada en el contrato; su hash está comprobado, no se modifican sus píxeles.

## Próximo gate
Entregar al usuario comparativa original + restaurada (no mockup) y validar que las siluetas y colores retoman la identidad aprobada. Sólo entonces aceptar pulidos artísticos M07/T08/P07 siempre que su before/after mantenga esta línea. 
