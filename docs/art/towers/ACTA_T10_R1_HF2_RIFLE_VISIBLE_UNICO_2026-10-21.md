# SEMANTROPIC TD — ACTA OFICIAL TORRES T10 R1-HF2 · UN SOLO RIFLE VISIBLE

**Fecha:** 2026-10-21 (Chile). **Motor:** Phaser 4.2.1/WebGL2. **Prioridad:** microcorrectivo visual sobre R1. **PR:** [#49 DRAFT](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/49). **Rama:** `feature/t10-premium-r1-sync-20261021`. **BASE LIVE SIN TOCAR:** `production/semantropic-td-live@66b3c58436fdf7a349b2c13c93f4fb390cbd352d`. **SHA EXACTO DE CÓDIGO/QA REAL PROBADO:** `70239f640315cbfaf06a898d17c128076fc71ac6`. **Promoción:** NO AUTORIZADA. La aprobación final en Android físico sigue correspondiendo al Director.

## 1. Causa raíz comprobada: dos armas, un origen equivocado

- **[CONFIRMADO EN FUENTE]** El operador aprobado P03 genera un rifle completo dentro de cada fotograma de `sniper_operator` usando `rifle(c,[-17,-26],null,P.arm*.075)` en `public/official/art/actors/p03-rig.mjs`. Su lip del tubo, en coordenadas locales del propio rifle, se aproxima a `(79,-7)` (últimos puntos dibujados en `path(c,[[40,-9],[79,-9]])`). El rig rota el arma con el brazo, hombro y torso. Esta es la boca SUPERIOR que el Director percibía.
- **[CONFIRMADO EN FUENTE]** El compuesto T04 `sniper/level-1.svg` y `sniper/level-2.svg` contienen una SEGUNDA silueta armada inferior, independiente del rig P03. Hasta R1 el presenter proyectaba la boca T04 sobre el sprite del edificio; el arma superior del operador no era la fuente del VFX.
- **[OBSERVADO EN CAPTURA REAL]** Se inspeccionó recorte de Chromium R1 anterior: arriba sobresale el rifle oscuro del operador; abajo se ve otro cañón/mecanismo de la torre, con el punto de emisión original verde al extremo inferior. Dos siluetas distintas visualmente verificables. No es solo una hipótesis geométrica.
- **[MEDIDO WEBGL2]** En la comparación A/B/C, `A` = boca histórica T04, `B` = lip rig P03 en frame real, `C` = raíz VFX. L1 desktop: B→C **41,01 CSS px antes** (T04) frente a **3,25 CSS px** con P03. L2 desktop: **34,82→3,25**. Mobile 844×390 L1: **27,04→2,14**; L2 **22,96→2,14**. Mobile 932×430: raíz P03 aprox. **2,37 px**. Los valores son distancias entre las fuentes geométricas proyectadas mediante sprites efectivos; la fotografía documenta visiblemente el cañón, pero el edge raster pixel a pixel no se segmentó mediante visión automática.

## 2. Decisión artística mínima: usar SOLO P03 como rifle visible

**Rifle principal aprobado como CANDIDATO:** P03 original del operador, porque es el arma dinámica superior que sostiene el personaje, el que vio el Director en Android. **Edificio:** usar los SVG YA EXISTENTES del propio Equipo TORRES `public/official/art/towers/layers/sniper-1-structure.svg` y `sniper-2-structure.svg` (arquitectura T04/T08 pero sin rifle integrado). No añadir rifle tercero ni rehacer la torre. En las capturas HF2 de Francotirador I/II se observa una única silueta de cañón superior. El visor/ornamentos del techo siguen visibles y no son otro rifle proyectable.

Los maestros originales protegidos `public/official/art/towers/sniper/level-{1,2}.svg` se mantienen **byte idénticos**, con hashes Git I `52ec5b04b744a9583a9a07464a107c6b5f1cf293` y II `c1689a19e9467dd39c6c5af380d63b22176ead5d`. Tampoco se editó `p03-rig.mjs`, atlas, personajes P07/P08 ni mapas. En el candidato el sistema de carga elige textura T08 rifleless SOLO para sniper con P03 original; `?t10hf2=legacy` opt-in muestra la composición T04 histórica para contraste; operador P07 experimental no se cambió ni se hizo pasar por P03.

## 3. Proyección exacta del rifle P03 desde el fotograma efectivo

`public/official/src/towers-visual/t10/p03-operator-rifle-muzzle.mjs` calcula el source lip recorriendo EXACTAMENTE la pila de transformaciones del rig: `rifle(79,-7)` → `rotate(P.arm*0.075)` → `translate(-17,-26)` → `rotate(P.shoulder)` → `translate(0,-93)` → `rotate(-P.fall*1.05)` → `translate(-P.reaction*.46,P.fall*53-P.bob+P.compress)` → `frame translate(88,208*.92)` → origen de TextureFrame + flipX/Y → `operator.getWorldTransformMatrix()`. `getP03Pose('sniper_operator',state,frame)` se importa de la fuente oficial P03 sin modificarla. No se usa un offset mágico desde T04.

En la scene DG `adaptHistoricShot` muestra primero el frame calculado real `attackWindup-N` o `attack-N`, mide el lip del mismo frame, y lo entrega como `payload.muzzleWorld` sin editar el origen físico `originWorld` del core. El presenter R1 sigue colocando la raíz óptica apenas **3,25 unidades mundo DENTRO del cañón P03**, para que flash/proyectil se solapen con el borde. La elección de estructura T08 y el uso del helper están documentados para revisión DG porque `scene.mjs` es ownership central, no TORRES.

## 4. Intocables R1 — verificados

- Velocidad core `SNIPER_BULLET_SPEED=840` world units/s, economía, HP, range, cooldown, targeting, recompensas, M01/V5: NO MODIFICADOS.
- Correlación `bulletId` + `hit_applied` real, cancelación del tracer y halo al impacto, impacto premium, no bala fantasma y ausencia de impactos inventados: **INTACTOS**.
- Fade visual únicamente de muerte letal por sniper: **125 ms**, sin mantener enemigo en core, igual R1. Menú, rally, P08, victoria y derrota: sin cambios.

## 5. QA real (no inflar PASS)

- [Actions R1-HF2 #39711087400](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39711087400), SHA probado `70239f640315cbfaf06a898d17c128076fc71ac6`, resultado **SUCCESS**.
- Node22 **PASS**: bloqueo de fuentes T04, `qa-t10-b2`, `qa-t10-premium`, **nuevo `qa-t10-r1-hf2.mjs`** sobre rig P03 original, 24 proyecciones de fotogramas en dos niveles y comprobación de flips/origen/escala; regresiones gameplay, M01/rally, P08/T09. `npm install` y `npm run build` Phaser 4.2.1: **PASS**.
- Chromium WebGL2 **6/6** muzzle `I/II × (1280×768,844×390,932×430)`: PASS. Chromium WebGL2 **12/12** impactos y fade `I/II × warrior/hound × 3 viewports`, usando *fixture dirigida a 1 HP* de enemigos instanciados por core: PASS. No se confunde fixture con partida sin manipulación.
- **12 composiciones A/B/C** en 2 niveles × 3 viewports × 2 modos (T04 legacy vs P03-HF2), captura real y ZOOM en **idle / windup / attack_fire**: PASS. También se muestrearon tres eventos consecutivos auténticos `attack_fire` por composición; 24 tiros adicionales observados y comparados, con root P03 dentro de **2,14–3,25 CSS px**. En esos objetivos muestreados el blanco estuvo hacia el lado izquierdo del muzzle; los blancos hacia la derecha NO quedaron cubiertos por esta fixture y no se inventa cobertura.
- **M01 completa SIN fixture**: victoria 5 oleadas/63 spawns/63 eliminaciones/0 fugas/100 vidas/★★★ y derrota real, récord/reinicio/rally: PASS. P08 galería 3 tamaños: PASS.
- [Artifact real FINAL de GitHub Actions](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39711087400/artifacts/12396929890) ID `12396929890`, **33.053.679 bytes**, contiene capturas de ambas variantes, frames A/B/C con acercamientos, tres tiros, escenarios de hit/muerte, regresión M01 y logs. [Artifact comparativo anterior](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39710710967/artifacts/12397332009) ID `12397332009` documenta A/B/C sin la arquitectura rifleless, referencia intermedia.

## 6. QA visual humana sobre capturas

Se revisaron efectivamente los recortes Chromium de nivel I y nivel II: antes se observan dos rifles separados y la raíz del tiro junto al rifle inferior; en HF2 se observa un único rifle superior saliente, y el marcador C aparece en su punta. Este hallazgo es **inspección humana de capturas renderizadas**, no afirmación de rendimiento Android físico ni una garantía de belleza premium aprobada por el Director. La geometría del labio y la coincidencia perceptual son mucho más coherentes; la valoración estética final queda pendiente.

## 7. Bloqueantes y rollback

- **[PENDIENTE DIRECTOR]** confirmación visual en Android horizontal físico, comodidad del cañón superior, animaciones windup/fire y carácter premium satisfactorio; no autorizar publicación solo por QA.
- **[NO MEDIDO]** FPS Android p50/p95, latencia táctil real, bordes raster a nivel de píxel, impacto sobre objetivos situados a la derecha en la fixture. No vender estas pruebas como realizadas.
- **[OWNERSHIP]** Los cambios del helper/QA pertenecen a TORRES; la modificación de `c1d8-b2-playable/scene.mjs` debe ratificarla DG. Ninguna fuente PERSONAJES se tocó. No se pidió a PERSONAJES alterar P03.
- **Rollback:** `?t10hf2=legacy` compara durante validación; revertir commits HF2 dentro de PR #49 o cerrar el PR. Producción LIVE sigue sin cambios. **No merge, no deploy, no nuevo enlace público**.

**Estado de entrega:** `R1-HF2 listo para DG` **como candidato QA técnico aprobado**, con gate de aprobación artística/móvil del Director abierto.
