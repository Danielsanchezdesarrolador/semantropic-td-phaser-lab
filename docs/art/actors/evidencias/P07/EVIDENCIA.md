# PERSONAJES P07 — EVIDENCIAS DE CONTINUIDAD C1-C
**Equipo:** PERSONAJES · **Fecha:** 20-10-2026 · **Rama:** \`feature/art-p07-continuidad-c1c\`

## Referencia original [OBSERVADO EN CAPTURA ORIGINAL]
**Fuente aportada directamente por el propietario:** \`SEMANTROPIC_TD_REFERENCIA_VISUAL_APROBADA_C1C_M03_T04_P03.png\`, 1280×768, archivo PNG RGB.
Hash SHA-256 REAL comprobado mediante \`sha256sum\` del archivo proporcionado: \`24103e45a0e1249fa4b89d4e65ea16d9e147bdf1e2462e5c4063469a931842ef\`.
Esa imagen es un BEFORE **aprobado**, no una captura derivada de la rama P07. El archivo existe en la conversación, pero no se ha re-subido/copiado como blob Git al repositorio; el hash permite comprobar que se analiza la fuente correcta.

### Aspectos visibles que se protegen
- **Orco:** cara verde expresiva, orejas visibles, hombreras gris oscuras, hacha elevada, postura bípeda robusta y contorno grueso (en la imagen hacia entrada/camino).
- **Hound:** cuerpo marrón cálido y bajo, hocico, ojos/gemas, púas triangulares en dorso, cuatro extremidades y arnés; más bajo que orco.
- **Recluta:** la fuente P03 muestra el escudo/espada, pero en screenshot original la silueta individual no se resuelve totalmente; no inventar aprobación de detalles invisibles.
- **Operador sniper:** figura humana con casco arriba de vigía T04, observando desde plataforma; P07 conserva visor/casco y retira segundo rifle.
- **Contexto M/T:** pradera viva, carretera arena bordes oscuros, cubiertas azul petróleo y vigía elevado; no hay aprobación automática de otros mapas.

## Material P07 [CONFIRMADO EN ARCHIVOS]
4 PNG RGBA8 1408×832 / 32 frames cada uno con hashes SHA256 de bytes exportados, manifiesto \`P07_MANIFEST.json\`:
| Actor | PNG real | Tamaño |
|---|---|---:|
| warrior | \`public/official/art/actors/p07/png/warrior.png\` | 696921 bytes |
| hound | \`public/official/art/actors/p07/png/hound.png\` | 600467 bytes |
| infantry_recruit | \`public/official/art/actors/p07/png/infantry_recruit.png\` | 610623 bytes |
| sniper_operator_unarmed | \`public/official/art/actors/p07/png/sniper_operator_unarmed.png\` | 539246 bytes |

**Autoría:** se ejecutaron los paths y paletas del código original \`p03-rig.mjs\` del PR #10; la versión P07 solo actualiza claves de textura, omite rifle propio del operador y corrige transform del casco humano desplazado. Para exportar los PNG fuera del navegador se usó un rasterizador Canvas2D **aproximado en CPU**, con gradientes lineales y bordes de contorno. No afirmar equivalencia píxel-a-píxel al dibujo Canvas2D nativo P03 ni al screenshot C1-C.

**Comprobaciones ejecutadas:** export real y creación de cuatro blobs Git; 128/128 cuadros no vacíos, cero contactos alfa en límites de celdas, bytes+SHA256 registrados. Se inspeccionaron en el entorno V8 muestras de primer cuadro de orco/hound/recluta/operator, no son screenshots Phaser.

## Capturas reales [NOT_RUN]
| Objetivo | Estado |
|---|---|
| View P03/P06/P07, 1280×768, Phaser4 WebGL2 | NOT_RUN |
| Landscape Chromium 844×390 | NOT_RUN |
| Landscape Chromium 932×430 | NOT_RUN |
| Filmstrips reales en Chromium de cuatro actores | NOT_RUN |
| WebM/GIF ciclos walk/hit/die del navegador | NOT_RUN |
| Escena con M07/T08/P07 montados e interfaz C1-D4 | NOT_RUN |
| Móvil físico/FPS medido | NOT_RUN |

**Ejecutar en checkout P07 con Node22 y Phaser 4.2.1 instalado:**
1. \`node public/official/src/actors-visual/qa-p07.mjs\` → checksum nativo, inflate zlib, alfa/celda y reproducción byte exacto.
2. \`npm install && npm run build\`.
3. \`npm install --no-save playwright && npx playwright install chromium\`.
4. \`node public/official/src/actors-visual/qa-p07-browser.mjs\` → captura y filmstrips, **solo si se ejecuta realmente**.
5. Integrador produce viewport same-camera de C1-D4 con M07+T08+P07, estados de combate auténticos y crop 100% con puntos mano/culata.
6. Dirección compara el PNG original proporcionado y ese AFTER real antes de aprobar. Sin AFTER auténtico la identidad sigue PENDIENTE DE APROBACIÓN.

**Dos límites verificables:** (1) rasterizador CPU no es Canvas Chromium, borde/material pueden variar; (2) stockGrip de T08 y manopla del operador P03/P07 difieren bajo escala 80wu. La restitución de identidad en source no certifica composición final.
