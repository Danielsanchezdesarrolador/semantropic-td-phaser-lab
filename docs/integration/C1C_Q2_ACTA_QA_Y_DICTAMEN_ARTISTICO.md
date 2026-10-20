# SEMANTROPIC TD — ACTA C1-C/Q2 | Auditoría de los tres reworks en Phaser

**Dirección General / Integración** · 2026-10-19 (Chile)  
**Rama aislada:** `integration/c1c-q2-review` · **PR:** [#12](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/12) (DRAFT).  
**Base:** `integration/c1b-art-review` @ `b42bef24c9a103bb41574c13fe9aeec5edd23e54`.

## 1. Procedencia de las entregas
| Equipo | PR | HEAD de entrega auditado | Archivos cambiados | Acta permanente |
|---|---|---|---|---|
| Mapas M03 | [#11](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/11) | `dd7274369996b592de9a827e3c7d399e086bca65` | 11 | `docs/art/maps/actas/INDEX.md` |
| Torres T04 | [#9](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/9) | `140a81ae4b38f915326deefbb35230368389eac8` | 21 | `docs/art/towers/actas/INDEX.md` |
| Personajes P03 | [#10](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/10) | `eccadc3743e9f2d6c584097dcd5d9b82ee921e90` | 11 | `docs/art/actors/actas/INDEX.md` |

**Total: 43 archivos de los equipos trasladados como blobs sin alterar sus ramas originales**, más módulo central C1-C y QA. No se han fusionado sus PR ni cambiado `integration/phaser`, `main`, `production/ph01-p0-m01`, Render ni Canvas V5.

## 2. Hallazgos y avances
- **M03:** ocho pads gráficos de aproximadamente **110,24 unidades de ancho aparente** frente a **269,12** en M02 (reducción gráfica ~59 %); las posiciones y el radio táctil de referencia no cambian; sendero original de 133 waypoints, 8 sockets, ancho visual 110. Cinco escalas de detalle y decoración curada; no se interpretan como assets finales pintados.
- **T04:** cuatro torres Infantería/Francotiradores I–II, cimentación integrada, siluetas de arquitectura más consistentes, catálogo T03-compatible, `projectSourceAnchor` con rotación/flip, VFX visuales con deduplicación. Escalas/proporciones siguen provisionales.
- **P03:** nuevo rig articulado para warrior/hound/infantry_recruit/sniper_operator, 32 cuadros por actor, pie (0.5,.92), atlas compatibles 1408×832, comparación real con P02 B en misma escena. El operador necesita aún validación de oclusión con barandilla del Sniper.
- En C1-C se presentan cuatro torres en pads M01 reales, cuatro tipos de actores (13 instancias visuales, nueve recorriendo ruta únicamente para inspección), nuevas paletas y botón VFX.

## 3. QA real (no confundir con resultados históricos)
[GitHub Actions C1-C/Q2 #39347724679](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39347724679): **SUCCESS**.
- Parse de ESM, **nueve** scripts estructurales M01–M03 / T01–T04 / P01–P03: **PASS** después de corrección de assertion M03.
- Build real del paquete Phaser 4.2.1 + presencia de rutas y assets: **PASS**.
- Playwright Chromium WebGL2 (SwiftShader) escenas 1280×768 y móviles emulados 844×390 / 932×430: **PASS**, 133 waypoints, 8 sockets, cuatro torres, 13 actores, cuatro atlas, WebGL2; selección, VFX, pausa, paleta y centrado.
- Capturas: `desktop-P03.png`, `desktop-P02-B.png`, `desktop-after-controls.png`, `mobile-landscape-P03-A.png`, `mobile-landscape-P03-B.png` en artifact `c1c-q2-webgl2-captures` (artifacts de CI tienen caducidad; conservar copia de respaldo).
- **NO EJECUTADO**: pruebas en dispositivos Android/iPhone reales, memoria GPU medida, batería/FPS móvil físico, gameplay de combate, mapa completo con HUD real y guardados.

## 4. Incidencia encontrada durante CI
El QA original M03 contenía `assert.equal(root.layerGroups.pads.length,8)`. El renderer agrega ocho imágenes de base más ocho indicadores de selección, es decir **16 GameObjects en ese grupo**, manteniendo **8** pads canónicos. El Integrador corrigió la assertion **solo en esta rama C1-C**; notificación al Equipo M en PR #11. No alterar geometría o sockets.

## 5. Dictamen visual a partir de capturas auténticas
**Mejora apreciable con respecto a C1-B anterior**: plataformas ya no parecen enormes discos que compiten con edificios; las torres tienen mejor jerarquía de fachada/cimentación; el rig de P03 muestra una silueta más limpia y una diferenciación mayor de facciones. Camino, follaje y arte son reconocibles en un solo cuadro.

**Aún NO aprobar como acabado comercial definitivo:**
1. Escena sigue relativamente vacía en superficies de césped extensas; aumentar diversidad de microambientes, textura ilustrada y composición sin ocultar sendero/selección.
2. Varios recursos son SVG/Canvas vectoriales y se ven más simples que el benchmark pictórico premium original. Los assets finales requieren una revisión artística por personaje y edificio antes de aprobar exportación/atlas.
3. Móviles ultrapanorámicos con Phaser.FIT tienen franjas oscuras laterales simétricas. El encuadre está **centrado** y pasa QA, pero no es full-bleed; cámara adaptable y safe areas son tarea exclusiva de Integración.
4. Operador Sniper debe aparecer detrás de la barandilla correspondiente con subcapas bien definidas, sin ocultar rifle, cabeza o indicadores.
5. Demo no contiene combate, disparos efectivos, precios, bloqueos ni oleadas jugables; sin juego real no puede aprobarse el ritmo visual de combate.
6. Animaciones de actor y movimientos 3/4 requieren inspección frame por frame, orientación N/S futura y pruebas móviles físicas.

## 6. Autorización recomendada
- **Aprobación técnica provisional para continuar iteración**, no merge definitivo de arte a producción.
- Preparar **C1-D**: primer vertical slice de combate real M01 (Infantería/Sniper I-II, warrior/hound, compras, economía, daño, fugas, victorias) con adaptadores centrales, preservando fuentes V5. No construir combate sintético en equipos artísticos.
- En paralelo, preparar **M04/T05/P04** correcciones puntuales orientadas a assets finales, densidad de escenario, operador/barandillas, keyposes y hojas editables.
- Conservar PR #9/#10/#11/#12 como borradores hasta autorización y QA funcional.

**Regla permanente:** cada equipo conserva `INDEX.md`, `ACTA_*.md`, `QA_*.json` y enlaces de pruebas en su rama de GitHub, para que Dirección General los consulte sin archivos adjuntos manuales.
