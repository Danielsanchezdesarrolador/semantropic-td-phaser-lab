# SEMANTROPIC TD — ACTA OFICIAL T10 PREMIUM R1

**21 de octubre de 2026** · Dirección General / Equipo TORRES / VFX. **Estado: PASS técnico de ejecución real; aprobación artística en Android pendiente.** Motor Phaser 4.2.1/WebGL2. PR [#49 DRAFT](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/49).

## 1. Base oficial e invariantes

Rama `feature/t10-premium-r1-sync-20261021` creada desde `production/semantropic-td-live@66b3c58436fdf7a349b2c13c93f4fb390cbd352d` (C1-D8 B4). **SHA exacto probado:** `6f5c0ef8615bc46aae4dc48276a18843ffc17234`. No hubo merge ni despliegue ni cambios en el URL público. Ningún SVG master T04, operador P03/P07/P08, mapa canónico V5, economía, daños, cadencia de core, rewards o ruta M01 fue editado.

## 2. Defectos del Director, separados de nuestra evidencia

El Director confirmó en Android real: origen visual adelantado, baja calidad premium, impacto poco legible y enemigo que desaparece mientras la bala visual todavía viajaba. Observación artística **[CONFIRMADA POR DIRECTOR]**, distinta de una medida de píxeles de captura. El PR previo B4 pasó QA matemático que no analizaba independientemente el labio raster del cañón.

## 3. Causa raíz inspeccionada EN CÓDIGO

- Core sniper `SNIPER_BULLET_SPEED=840` world units/s en `m01-combat-world.mjs`. `tickBullets` emite `hit_applied`; el core reduce HP, elimina al enemigo y emite `entity_die` cuando se agota su vida. Esa autoridad lógica se mantiene intacta.

- El T10 Premium B4 usaba proyectil cosmético con duración `max(115,min(310,distance*1.24))` ms, desacoplada de los 840wu/s; el core podía confirmar impacto antes de finalizar tween. El presenter activaba impacto desde `hit_applied`, pero la bala seguía viajando.

- `drawEnemies()` eliminaba instantáneamente el objeto visual cuando el core eliminaba el actor. No existía una breve cola visual del impacto letal.

- El flash anterior alcanzaba 14wu desde la boca, con `pulse r7`, `glow r7` y núcleo `r3.5` centrados en el borde del cañón. Esa silueta puede dar la apariencia de origen adelantado aun con coordenada numérica correcta. No se demostró un offset grande de geometría T04.

## 4. Corrección concreta R1

1. **Muzzle perceptual:** se conserva el punto físico `projectMountedT10Muzzle()` de la ilustración T04 aprobada, pero el primer núcleo/halo/flash utiliza un único root situado **3,25wu dentro del cañón, hacia atrás en la dirección de tiro**. Flash reducido a 8wu, núcleo a radio 2,4, halo a radio 4,3, trail máximo 15wu. Sin render duplicado de rifle.

2. **Sincronía:** tween visual limitado a `max(32,min(245,distance/840*760))` ms, con easing lineal. En `hit_applied` autenticado por `bulletId` se cancela inmediatamente el tween si sigue activo; no queda orb, glow ni trail volando tras confirmar el contacto. Se muestra impacto premium en la posición real entregada por core.

3. **Hit premium:** `ring` de 12wu, núcleo de impacto 6,2wu, anillo exterior, cuatro destellos breves y fade de ~115–150ms. Se usan objetos Phaser temporales; sin nuevas partículas GPU masivas ni modificaciones físicas.

4. **Desaparición:** solo un `hit_applied` letal de Francotirador con `hp===0` conserva el **contenedor visual** del enemigo por 125ms y le aplica `alpha:0`. Core ya pagó recompensa, eliminó actor y dejó de seleccionarlo. Finalizado plazo, destruye la vista y limpia `enemyViews`, P08 y memoria de movimiento. Otros ataques, escapes y muertes no se alteran.

5. **Compatibilidad:** el presentador clásico `{premium:false}` permanece intacto. El correctivo se instala solo en `c1d8-b2-playable/scene.mjs` y `sniper-vfx.mjs`, sin editar `src/live/index.html`.

## 5. QA real, no simulado

- [GitHub Actions R1 #39695198098 — conclusion: success](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39695198098), SHA probado `6f5c0ef8615bc46aae4dc48276a18843ffc17234`. Node 22: fuente T04, `qa-t10-b2`, `qa-t10-premium` adaptado a R1, regresión rally core, B3 combat motion y menú T09: **PASS**. `npm install`/`npm run build` con Phaser 4.2.1: **PASS**.

- **6/6 [Chromium/WebGL2 real]:** niveles I/II, vistas 1280×768, 844×390, 932×430, origen de orb/halo/flash alrededor del root perceptual. Distancia CSS proyectada a la boca física: 3,25 (desktop), 2,14 (844×390) y 2,37 (932×430) píxeles (aprox., por escala FIT). **Esto es una prueba de coherencia geométrica, NO detección automática del contorno ilustrado.**

- **12/12 [Chromium/WebGL2, fixture dirigida]:** nivel I e II × `warrior`/`hound` × tres tamaños. Enemigos reales instanciados por el core con sus propiedades oficiales, pero fixture QA los fuerza a **1 HP** para observar un golpe letal, sin modificar archivos canónicos ni convertirlo en prueba de oleada sin alterar. Se verificó `attack_fire`, impacto core verdadero, que ninguna bala visual siga volando después, que sprite sobreviva solo durante fade, y que se elimine sin leaks a los 250ms. PNG de FIRE, HIT y AFTER guardados.

- **M01 completa de verdad, prueba separada SIN fixture:** PASS, 5 oleadas/63 eliminaciones/0 fugas/100 vidas/★★★; derrota con 0 vidas y sin triunfo ficticio; P08 gallery 3 resoluciones PASS. Son resultados de regresiones del runner, NO una medición de FPS Android.

- [Artefacto R1 de GitHub Actions](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39695198098/artifacts/12390821009) ID `12390821009`, **17.923.351 bytes**, incluye capturas y logs. Referencia histórica [artefacto B4 (antes)](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39687530681/artifacts/12387281758) ID `12387281758`. Aunque ambos ofrecen capturas, **no se realizó comparación pixel a pixel de una misma toma y condiciones controladas** entre B4 y R1.

## 6. QA fallida y corrección del harness (no ocultar)

Runs anteriores [#39694646513](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39694646513) y [#39694952723](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39694952723) fallaron en QA dirigida al perder el evento de contacto entre capturas. La instrumentación confirmó `world.kills=1`, sin fugas ni fallos del core. Se corrigió exclusivamente el harness bloqueando el avance lógico (`world.paused=true`) entre capturas, mientras Renderer/Tween/SceneTime se mantienen reales; el tercer run `#39695198098` pasó 12/12. El harness no es el código de producción.

## 7. Lo que sigue pendiente

- **[PENDIENTE DIRECTOR]** valorar en Android físico que el origen ahora se perciba unido al rifle en I y II, que el destello tenga calidad premium y que el impacto comunique contacto claramente.

- **[NO MEDIDO]** FPS p50/p95, jank táctil en Android físico, VRAM y comparación en condiciones idénticas B4/R1 del labio rasterizado. No afirmar PASS artístico por las pruebas de coordenadas o 12 fixtures.

- Si el Director identifica distancia visual persistente, contrastar en capture render el borde efectivo del SVG con flash/tracer, no introducir offsets arbitrarios al core. Si rendimiento decae, reducir duración/alpha del glow antes que eliminar la sincronía de muerte.

## 8. Files, rollback y decisión

Entregables: `public/official/src/towers-visual/sniper-vfx.mjs`; `public/official/src/c1d8-b2-playable/scene.mjs`; `docs/art/towers/qa-t10-premium.mjs`; `tools/qa-c1d8-b2-sniper-browser.mjs`; `tools/qa-t10-r1-sync-browser.mjs`; `.github/workflows/t10-r1-sync-feature-qa.yml`; esta ACTA y QA JSON.

Rollback: cerrar PR #49 o revertir su diff. Producción `production/semantropic-td-live` y URL pública se conservaron. **El PR queda DRAFT: NO LISTO PARA PROMOCIÓN SIN APROBACIÓN VISUAL/ANDROID DEL DIRECTOR.**
