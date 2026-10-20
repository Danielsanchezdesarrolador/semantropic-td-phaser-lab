# PERSONAJES P07 — FRAME ABI · C1-C VISUAL LOCK
**Fecha:** 20-10-2026 · **Solo Equipo P**.

Los atlas P07 no cambian el contrato de P03/P05/P06:
- Cada PNG es **RGBA 1408×832**, cuadrícula **8×4**, 32 celdas de **176×208**.
- Orden: \`idle:0–3\`, \`walk:4–11\`, \`attackWindup:12–14\`, \`attack:15–19\`, \`hit:20–22\`, \`die:23–28\`, \`blocked:29–31\`.
- Phaser frame names: \`idle-0..3\`, \`walk-0..7\`, \`attackWindup-0..2\`, \`attack-0..4\`, \`hit-0..2\`, \`die-0..5\`, \`blocked-0..2\`.
- Pivote mundo propuesto \`{x:.5,y:.92}\`, sombra \`{x:.5,y:1}\`, E/W por espejo horizontal, no inventar N/S.
- Alturas candidatas mantenidas: warrior 91wu, hound 67wu, infantry_recruit 88wu, sniper_operator 80wu, **no hitbox**.
- \`escape\` usa FSM visual del P05/P06 en base a \`walk\` + fade; no se crean frames ficticios.
- \`blocked\` o \`soldier_hit\` son únicamente visuales después de evento real del integrador; la galería sintética no afecta HP ni progresión.
- No se borra ningún atlas P03/P06 previo. Nuevas texture keys versionadas por P07; actor canónico \`sniper_operator\` continúa sin ser arquetipo nuevo. Variante \`p07-c1c-unarmed\` es SIN rifle; el arma única es T08.
- \`p07-atlas-loader.mjs\` precarga PNG físicos, registra 32 nombres y no elimina texturas compartidas.
- No generar texturas en frame-update ni crear 24 atlas para 24 sprites: las copias comparten máximo cuatro PNG.

## Fuente e identidad
\`p07-p03-continuity-rig.mjs\` deriva del \`p03-rig.mjs\` original con la misma geometría/paleta, excepto reparación de coordenadas de casco humano y eliminación de arma duplicada del operador; no usar el \`p06-png-generator.mjs\` para redibujar siluetas (solo su codec PNG).
\`p07-raster-canvas.mjs\` es la alternativa CPU para export binario reproducible. Sus trazos raster son una APROXIMACIÓN del Canvas2D nativo: diferencias de antialias/gradiente deben inspeccionarse en navegador real.
\`qa-p07.mjs\` verifica SHA256, inflate, 128 cuadros, clipping y regeneración byte a byte desde fuente.

## Secuencia de verificación estética
P03 histórico → P06 histórico → P07 PNG final candidato, mismo frame/escala/zoom; luego ORIGINAL C1-C user screenshot (SHA256 documentado) vs M07/T08/P07 montado realmente en Phaser, cámara 1280×768; 844×390 y 932×430 paisaje. Rechazar cualquier diferencia que cambie silueta/rasgos aprobados sin autorización.
