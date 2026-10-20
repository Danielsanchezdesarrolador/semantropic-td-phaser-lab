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


---

## P07-HF1 — EVIDENCIA CORRECTIVA FINAL (20-10-2026)
**Acta principal:** [ACTA_P07_HF1_PERSONAJES_2026-10-20.md](../../actas/ACTA_P07_HF1_PERSONAJES_2026-10-20.md)
**CI fallo ANTES del hotfix:** [Actions #39455632045](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39455632045), Node 22.23.3, exit 1 en igualdad byte a byte \`qa-p07.mjs:56\`.
**Estado DESPUÉS de HF1:** [PASS_V8 20/20 muestras bajo perturbación numérica + 128 frames exportados]; [NODE22_FullQA NOT_RUN]; [CHROMIUM NOT_RUN]; [APROBACIÓN VISUAL PENDING].

La primera normalización tenía muestras inestables (5/20), por lo que NO se conservó como versión candidata. HF1 final añadió normalización de longitud de stroke y superó 20/20 muestras frente a perturbación \`+1e-12\`. No implica que el fallo real de Node22 esté solucionado hasta repetir Actions.

**Cuatro binarios HF1 definitivos (commit \`db0d27e9762ee8cd6bb65c7538a364f3c7767985\`):**

| Archivo en \`public/official/art/actors/p07/png/\` | Bytes | SHA256 PNG exacto | SHA256 de RGBA sin filtro (4.685.824 B) |
|---|---:|---|---|
| warrior.png | 696955 | \`41ce773004dc8147463d7198e996b08144ed12824b933edf4d5d737db31bcc5e\` | \`3e5aa32b1d2a521a8d738c2a9c1a6e83fb78c258306cb85c363131dfff7a823f\` |
| hound.png | 600459 | \`3812bc31e9bc46ebda437f1c88c067811c59fa8928c4f2c608f4462e96934e60\` | \`535c3cf9a3f3695a5fd9b896da65057169857147eacf13c26b7ace31dffb1f4a\` |
| infantry_recruit.png | 610640 | \`c372219d8899fb00aed63f42701a7e7d038685430a6d564b2a1784559b6f4559\` | \`ebb5229a969756483ee18fb94be239411a436b253182efea70e117a000da4f69\` |
| sniper_operator_unarmed.png | 539249 | \`94061e8637c60d9e78d31449ace49c90d4f96337c6cecc481f5fd13bf24eca2f\` | \`40079024940d5f085596f0ccaf658c62a610e1b485e81fbc94037cfe2eda79e0\` |

Estos son hashes de bytes generados en V8 y escritos como objetos binarios Git; **no son hashes de capturas de Phaser**. Se exigen pruebas posteriores del checkout original. El P07 mantiene identidad de P03, no reconstruye píxeles nuevos desde cero.

**Instrumentación ejecutable en checkout:**
\`node public/official/src/actors-visual/qa-p07-hf1-forensic.mjs\` → compara todos los SHA/CRC/decoded RGBA, primer byte/canal/frame discrepante y clasifica diferencias. Devuelve exit=1 en cualquier divergencia.
\`node public/official/src/actors-visual/qa-p07.mjs\` → mantiene \`assert(Buffer.from(regen.png).equals(data))\`; debe emitir PASS_NODE REAL para los cuatro.

**Capturas AFTER de Phaser y escena M07/T08:** NO ADJUNTADAS, porque no se ejecutó Chromium sobre la rama HF1. La foto original C1-C sigue siendo el BEFORE aprobado con SHA256 \`24103e45a0e1249fa4b89d4e65ea16d9e147bdf1e2462e5c4063469a931842ef\`. No se sustituye por imagen sintética.
