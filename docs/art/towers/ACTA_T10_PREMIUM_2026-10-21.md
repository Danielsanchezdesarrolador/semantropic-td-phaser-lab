# SEMANTROPIC TD — DG + TORRES · ACTA T10 PREMIUM MUZZLE
**Fecha:** 21 octubre 2026. **Estado:** [CÓDIGO IMPLEMENTADO Y CI WEBGL2 PASS] / [APROBACIÓN ARTÍSTICA MÓVIL PENDIENTE]. **Motor:** Phaser 4.2.1 WebGL2. **Rama:** `feature/t10-premium-muzzle-vfx-20261021`. **Base protegida de producción:** `86ffbe828be7aaafcccf5a8903cf85d92ee1f0de`. **SHA TÉCNICO efectivamente probado:** `44f41b9d793c62ce424d1fe02f298c1432f2525a`. PR #47 DRAFT a `production/semantropic-td-live`. No merge ni deploy.

## I. Fallo observado y análisis de causa, sin conjeturas elevadas a hecho
El Director confirmó en móvil real que la bala se percibía fuera del cañón y el VFX no parecía premium; esto es el criterio visual del propietario. Fuente inspeccionada: `public/official/src/c1d8-b2-playable/scene.mjs`, `t10/sniper-muzzle-contract.mjs`, `catalog.mjs`, `sniper-vfx.mjs`, `tools/qa-c1d8-b2-sniper-browser.mjs`.
Antes del hotfix B2 YA calculaba `muzzleWorld=projectT10MuzzleWorld(mount.sprite,mount.meta)` usando el contrato geométrico del SVG T04 (I 301,159; II 315.5,152.5), y el presenter `_fire` usaba ese punto para la bala. Por tanto, **no se ha demostrado** que una gran discrepancia numérica de posición sea la causa principal. La prueba anterior comparaba bolita→coordenada calculada, no detectaba de manera independiente el labio visible rasterizado del rifle. El VFX anterior era un orb simple y líneas brillantes sin pulso realmente direccional; esa limitación SÍ está confirmada en el código.

## II. Implementación exacta del candidato premium
- `t10/premium-runtime-muzzle.mjs`: proyección del centro de boca T04 contra dimensiones reales `sprite.width/height`, `displayOriginX/Y`, flipX/Y y `sprite.getWorldTransformMatrix()` del sprite Phaser montado. Fallback affine para imagen raíz sin Container, excepción si sprite anidado no dispone de world matrix. Diagnóstico deja `actual`, `nominal`, diferencia en world units, escala, frame, origen y padre. No toca los SVG ni el rig P03/P07.
- `sniper-vfx.mjs`: nuevo perfil **OPT-IN** `{premium:true}`, por defecto `false` para escenas heredadas. Cada disparo autorizado comparte un ÚNICO punto `from` para flash direccional (~75ms), glow/pulso, núcleo del proyectil y cola breve. Impacto con pop/ring/chispas solo después de `hit_applied` real con `bulletId` correlacionado. Sin rayos gigantes, hit artificial, ajustes a daño ni disparadores de gameplay.
- `c1d8-b2-playable/scene.mjs`: monta `SniperShotPresenter` con `premium:true`, obtiene `muzzleWorld` desde `projectMountedT10Muzzle(mount.sprite,mount.meta)` y registra diagnósticos para los primeros 48 eventos. Preserva `ev.payload.originWorld` lógico y `targetWorld`; no modifica `WORLD`, disparos lógicos, targeting, cadencia o balance.
- `tools/qa-c1d8-b2-sniper-browser.mjs`: en 3 viewports×2 niveles, exige WebGL2 real, una única arma T04, disparo core real y origen común entre flash, glow y núcleo, con registro de primer frame y captura.
- `docs/art/towers/qa-t10-premium.mjs`: compara hashes de dos SVG T04, pivote/escala y world matrix; mock de Phaser verifica dedupe, rechazo de impacto falso, impacto real, clear/destroy y compatibilidad del perfil clásico.
- `.github/workflows/t10-premium-feature-qa.yml`: job de rama feature únicamente, Node/build/Chromium, capturas, sin acceso ni pasos de deploy.

## III. QA REAL — PASS
- [GitHub Actions #39687530681](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39687530681) HEAD técnico probado `44f41b9d793c62ce424d1fe02f298c1432f2525a`: **conclusion=success**, job `premium-sniper` ID `119525281349`.
- Node 22: bloqueo de arte original, `qa-t10-b2.mjs`, `qa-t10-premium.mjs`, regresión rally Core, movimiento B3, menú T09 y JS syntax: PASS.
- `npm install` + `npm run build`: PASS con Phaser 4.2.1.
- Chromium WebGL2: **6/6** tomas (nivel I y II en 1280×768, 844×390, 932×430), construcción real, primera salida `attack_fire` del core real. `cssDiff=0` en los seis casos entre el origen premium calculado y el centro del primer frame de la bala. `discrepancyWorld` entre world matrix y punto nominal ~0.0000016 world units en montajes estándar. Esta es una medida de COHERENCIA GEOMÉTRICA, no lectura automática del contorno rasterizado del rifle.
- Regresión real B1 en browser: victoria M01 `5 oleadas`, `63 kills`, `0 escapes`, `100 lives`, `3 estrellas`; derrota real `0 lives`, `50 escapes`, récord sin victoria falsa; galería P08 sin títulos solapados en 1280×768, 844×390, 932×430: PASS.
- Arte T04: SVG Francotirador I SHA Git `52ec5b04b744a9583a9a07464a107c6b5f1cf293`, II `c1689a19e9467dd39c6c5af380d63b22176ead5d`: intactos. Composición compuesta original, cero rifles añadidos.
- [Artifact real del runner — screenshots + logs](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39687530681/artifacts/12387281758) ID `12387281758`, 7.287.148 bytes, guardado por GitHub Actions. Incluye las capturas de los seis primeros disparos y del browser B1.

## IV. No medido, sin aprobación automática
- La inspección VISUAL HUMANA de la punta rasterizada contra flash/bala dentro de capturas todavía es **PENDIENTE**. Los puntos verdes QA marcan coordenada geométrica; no equivalen a detección independiente del extremo del arma.
- Capturas ANTES/DESPUÉS homogéneas de calidad premium: **NO COMPARADAS** aquí; arte de antes puede reconstruirse desde la producción protegida, pero no se han declarado screenshots emparejados.
- Impactos reales filmados/capturados en warrior y hound, más coste de GPU/FPS p50/p95 en Android físico: **NOT_RUN / SIN DATOS**. Node mock valida causalidad `hit_applied` pero no una comparación estética de impacto entre versiones.
- Usuario/Director debe revisar legibilidad de disparo en móvil horizontal y decidir si la versión es lo bastante premium. **No publicar a LIVE sin aprobación explícita**.

## V. Invariantes, riesgos y rollback
El diff feature no toca mapas, JSON V5, economía, stats, operadores, máster SVG, UI live, ni `production/semantropic-td-live`. El VFX optimiza por lifetime de tweens/timers Phaser, sin setTimeout, sin nuevos shaders, maxActive existente. No se ha medido FPS físico; agregar CPU/GPU extra sigue siendo riesgo móvil. Fallback `premium:false` preserva estilo anterior. Rollback: cerrar PR #47 o revertir cambios de la rama; no tocar producción.

**Gate:** QA automática técnica PASS. **PROMOCIÓN A LIVE: NO AUTORIZADA** hasta revisión visual y móvil del Director.
