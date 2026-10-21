# SEMANTROPIC TD — DIRECCIÓN GENERAL · INTEGRACIÓN C1-D8/B4 T10 PREMIUM
Fecha: 21 octubre 2026

## Procedencia verificable
- Fuente equipo TORRES: PR #47 `feature/t10-premium-muzzle-vfx-20261021`, HEAD `2f1a7fbbbdf28b076ea180ca6ba2c1805e350624`.
- Código técnico probado por QA equipo: `44f41b9d793c62ce424d1fe02f298c1432f2525a`, workflow #39687530681 PASS.
- Base de producción previa: `86ffbe828be7aaafcccf5a8903cf85d92ee1f0de`, rollback protegido.
- El PR artístico #47 queda sin fusionar para preservar ownership; DG toma de él cinco archivos de código/QA con sus blobs exactos.

## Alcance de integración
1. Scene jugable: `projectMountedT10Muzzle`, presenter premium y diagnósticos; gameplay/daño/targeting no cambian.
2. Presenter con flash direccional, glow, tracer e impacto condicionado a `hit_applied`.
3. Nuevo helper de proyección real del sprite Phaser, sin duplicar rifles ni operadores.
4. Tests Node y browser premium importados desde entrega TORRES.
5. Marcador visible `C1-D8 B4 T10 PREMIUM` y nuevo query de caché en `/official/src/live/` para evitar que el navegador muestre la versión B2 previa.
6. CI de producción ampliado con QA de T10 premium + comprobación del código de versión + archivo nuevo.

## Condiciones de liberación y aceptación
- Validar CI de integración Node22/build/Chromium/WebGL2 (1280x768, 844x390, 932x430) y regresión 5 oleadas + victoria/derrota. Distinguir automático frente a dispositivo físico.
- Merge DG sólo tras PASS y si base de producción sigue siendo el SHA anterior, sin integrar M02 accidentalmente.
- Confirmar Render LIVE SHA y CI producción SUCCESS en la URL canónica.
- El usuario verificará estética y coincidencia visual con boca del cañón en su propio Android; matemáticamente la diferencia nominal medida por TORRES es ~0.0000016wu, por lo que NO presumir calidad premium o alineación perceptual resuelta.
- De persistir defecto visual, abrir un único microbloque correctivo en TORRES con evidencia, manteniendo rollback.

## Prohibiciones
Sin cambio de daño/estadísticas/oleadas, sin modificaciones a fuentes protegidas Canvas V5, sin otro sitio público o versión paralela. El trabajo de M02 continúa en PR independiente.
