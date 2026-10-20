# SEMANTROPIC TD — ACTA P08-B1 CIERRE VISUAL / PERSONAJES
**Fecha:** 2026-10-20 · **Orden:** P08-B1 · **PR #39:** DRAFT, no merge/deploy.
**Rama:** `feature/art-p08-infantry-evolution-combat` · **HEAD de inicio verificado:** `7265c84664699955afce188e0227d56887d58a6b`.
**Commit B1:** un único commit en esta rama; SHA definitivo: consultar [PR #39 → Commits](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/39/commits) y PR descripción de cierre, porque incluir su propio SHA en el contenido de un commit cambia el SHA de ese mismo commit.
**Scope exclusivo:** galería P08, su QA browser, docs/art/actors/actas/{ACTA_P08_B1_CIERRE_VISUAL_2026-10-20.md,QA_P08_B1.json,RFC_P08_INTEGRACION_C1D6_C1D7.md}.

## Antes (evidencia real, no juego integrado)
Se recuperó el artefacto de Actions [#39492188188, artifact #12297010101](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39492188188/artifacts/12297010101) con **9 PNG reales Chromium/WebGL2**, estados idle/attackWindup/attack a 1280×768, 844×390 y 932×430. SHA256 individual registrado en QA_P08_B1.json.
La escena P08 mostraba dos paneles de Veteranos Nivel II centrados en x=453 y x=594, con ancho de 180 cada uno. **Solapamiento verificable: 180−(594−453)=39 unidades de escena** y títulos `II · VETERANOS (1)/(2)` visualmente superpuestos a escala móvil. Esta falla afecta exclusivamente la vitrina artística; el core todavía no usa P08.

## Microcorrección B1 — SOLO UNA DEFICIENCIA
Se desplazaron centros a x=425 y x=611 y fijó el ancho de ambos paneles en 174, dejando **12 unidades de separación real entre tarjetas**. Rótulos independientes `II · VETERANO 1` y `II · VETERANO 2`, font 20px; los otros tres paneles y sprites mantienen su rol y escala. En Chromium local, Canvas 2D con fuente bold 20px system-ui midió el rótulo `II · VETERANO 1` en ≈154,46 px, menor que el panel de 174 y con margen de ≈31,54 unidades entre ambos rótulos. **Eso es QA geométrico real de tipografía, no captura de la escena Phaser después del commit.**

Se amplió **solo el QA de galería relacionado**: `qa-p08-browser.mjs` verifica con Phaser real que los 2 títulos y tarjetas tienen gap al menos 8 unidades, sus etiquetas son diferentes, las 5 instancias están presentes y 32 frames por atlas registrados; al capturar 9 PNG adjunta SHA256 de bytes de pantalla. Este script NO está ejecutado después de B1 hasta checkout y Chromium completos.

## Qué NO cambió
- Los **8 PNG binarios**, hashes y P07 alpha fix permanecen idénticos.
- P08 rig, fuente, ataques, FPS, foot anchors, paletas y escalas de cada actor SIN CAMBIOS.
- Warrior/hound neutral conservan P03, francotirador P03 fuera del scope B1.
- Ni `M01CombatWithInfantryA2` ni `INFANTRY_LVLS`, daño, oro, economía, dos soldados reales, rutas, oleadas, Render, Live o production.
- Nivel I: 1 soldado core → recluta. Nivel II: 2 entidades core → 2 veteranos, **no** crea unidades desde galería.

## QA auténtico / puertas
| Verificación | Antes B1 (auditoría independiente) | Después B1 |
|---|---|---|
| Node22 P08 ocho PNG/256 cuadros | PASS en Actions #39491269733 y #39492188188 | **NOT_RUN** nuevo commit; binarios inalterados |
| Node22 P07 alfa / bytes | PASS mismo Actions | **NOT_RUN** nuevo commit; archivos inalterados |
| `npm run build` | PASS auditoría independiente previa | **NOT_RUN** después |
| 9 capturas Chromium | PASS real, hashes y artifact conservados | **NOT_RUN** después |
| Solape de paneles y etiquetas | FAIL visual (39 unidades de superposición) | **PASS geométrico de código/Canvas text**, browser Phaser pendiente |
| Escala 44/64/80 px / animación perceptible | capturas basales a altura mundo, no aprobación artística | **NOT_RUN** validación corregida |
| Jugabilidad 5 oleadas C1-D7 / Android real | NO APLICA en galería | **NO EJECUTADO / integrador** |

**Recomendación de Dirección de Arte:** orco y hound son reconocibles respecto P03 en capturas previas. En pantalla 844×390 el render ajustado al alto reduce notablemente el tamaño de figuras, por lo que legibilidad de contacto, diferencia de armadura y coherencia completa a 44/64/80 px deben revisarse con capturas y zoom objetivo posteriores. No retocar el atlas sin defecto reproducible y autorización.

## Instrucciones estrictas a Integrador
`p08VisualForSoldierLevel(u.level)` cambia atlas según el nivel real sin crear unidades: 1 recluta I; dos instancias Nivel II independientes con entityIds únicos. `p08VisualForEnemy` para warrior/hound. Eventos `soldier_attack_windup`, `soldier_attack_hit` y `soldier_hit {sourceId}` sincronizan `attackWindup` y `attack-2` tras daño core, nunca producen hit gameplay. No introducir `enemy_attack_hit` ficticio. Reutilizar RFC ampliado.
**P08-B1 no autoriza integración, merge, despliegue, aprobación comercial ni modificación de LIVE.**
