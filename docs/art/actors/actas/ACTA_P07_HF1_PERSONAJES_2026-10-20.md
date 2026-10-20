# ACTA OFICIAL — PERSONAJES P07-HF1 · CONTINUIDAD Y REPRODUCIBILIDAD
**Fecha:** 20-10-2026 · **Orden correctiva:** P07-HF1 / Dirección General
**Rama ÚNICA:** \`feature/art-p07-continuidad-c1c\` · **PR:** [#32 DRAFT](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/32)
**Base inicial:** PR #32 HEAD \`6b2659e1e44e39cf3019e20bad7acbb02c859fdd\`; comparar HEAD final en pestaña Commits.
**ESTADO HONESTO:** [HOTFIX VERSIONADO] · [PASS_V8] · [NODE22_FULL_QA NOT_RUN AFTER HF1] · [WEBGL2 NOT_RUN] · [APROBACIÓN PENDING] · NO MERGE/DEPLOY.

## 1. FALLO REAL, NO HIPÓTESIS
GitHub Actions [#39455632045](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39455632045), job \`combined-art\` #118741627133, Node \`v22.23.3\`:
\`AssertionError [ERR_ASSERTION]: P07 raster source was NOT byte-for-byte reproducible\`, \`qa-p07.mjs:56\`, exit code 1.
Esa ejecución se realizó sobre \`integration/c1d4s-m07-t08-p07-review\` SHA \`494f630b28519ba095e4036ef8ae5200b5855c56\`. Se cotejaron por hash **source** (\`atlas-source.mjs\`, \`p07-p03-continuity-rig.mjs\`, \`p07-raster-canvas.mjs\`, \`p06-png-generator.mjs\`, \`p07-png-export.mjs\`) y **cuatro PNG binarios**: eran los mismos blobs que el PR #32 anterior; la falla no corresponde a integración con fichero diferente.

En el entorno V8 con el que se exportó P07 antes de HF1, el \`warrior.png\` se regeneró idéntico al commit (696921 B, SHA256 \`96bb22bac15eb054ea435389556491ecf040599476b84beb9a318c9abf0a98c7\`). Una aproximación \`"use strict"\` también reprodujo idéntico. La diferencia de Node22 era por tanto una **divergencia de ejecución todavía no localizada a un primer píxel en CI**: no atribuirla automáticamente a compresor, paleta, colores ni fuente distinta.

## 2. EXPERIMENTO CONTROLADO: SENSIBILIDAD NUMÉRICA
Se introdujo deliberadamente una variación \`+1e-12\` en operaciones \`sin/cos/hypot/sqrt/atan2\` del entorno V8 sobre \`warrior idle-0\`.
- Renderer anterior: **45 canales RGB/A distintos**, de los cuales **13 diferencias alfa**.
- Prototipo HF1: **0 diferencias** al mismo perturbador.
- Comparación renderer original vs HF1 sin perturbador, mismo frame: **94 canales distintos, 0 canales alfa distintos** (en el primer cuadro probado).
Esta prueba **demuestra susceptibilidad y eficacia frente a esa perturbación**, NO demuestra que la variación idéntica sea la causa efectiva del fallo Node22. Node en CI todavía no ha sido re-ejecutado con la corrección.

## 3. CORRECCIÓN LOCAL, SIN ALTERAR EL RIG ORIGINAL
\`public/official/art/actors/p07-raster-canvas.mjs\`:
- normaliza coordenadas transformadas, muestras Bézier, interpolación de gradientes y cobertura alfa a precisión \`1e-6\`;
- usa \`sqrt(dx²+dy²)\` sobre desplazamientos normalizados y resultado normalizado, evitando sensibilidad subpixel de \`hypot\`;
- conserva rutas del pintor P03, poses, huesos, siluetas, valores base de paleta, sombras, cuatro patas del hound, equipo del orco y cascos humanos;
- sigue preservando el casco P07 reubicado y la llamada de rifle eliminado del personaje operador. **TORRES T08 mantiene arma única**; montaje mano/culata pendiente.
No se modificó \`p07-p03-continuity-rig.mjs\`, fuente histórica P03, colisiones, gameplay ni contratos fuera de dominio.

## 4. BINARIOS REALES HF1 Y HUELLAS DUAL PNG/RGBA
Se regeneraron y sustituyeron los cuatro objetos Git PNG RGBA8 fuente P03 en commit \`b8e2fa2488d6b136855b0a4b7e1198a35d30e28d\`. ABI exacto: 1408×832, 8×4 de 176×208, 32 frames por actor, 128 global; estados \`idle4,walk8,attackWindup3,attack5,hit3,die6,blocked3\`; pivote 0.5/0.92. Cada fuente V8 produjo 32 cuadros no vacíos y cero contactos alfa en bordes.

| Actor | Bytes PNG HF1 | SHA256 PNG comprimido (bytes exactos) | SHA256 RGBA crudo (4.685.824 bytes) |
|---|---:|---|---|
| warrior | 696970 | \`da8922ef87fcef8a43919dfdcd0a96aa3efc12a892493fac465562f2d39cbf28\` | \`d49d01c53ca49be3eac278c33f79d5f0325a80195148ab6ed6b3aaf7590acdb4\` |
| hound | 600460 | \`e4c152adadb57ec67bc268ed246f67a118b807b6c3fd7fb563679359a509516a\` | \`ff5e85d9788f712294fef4b42e7d6321092cfe1a0273ceed78c3d83147d7fec5\` |
| infantry_recruit | 610641 | \`83ccc2f9385abc2f0d8d9407dce7786cd9fd6c8b68da77ac8506c1f0b76a747d\` | \`b72d555e5a08aa519702aa09c6758d232289102600d24c44f6c03e5a5fee3bce\` |
| sniper_operator_unarmed | 539249 | \`94061e8637c60d9e78d31449ace49c90d4f96337c6cecc481f5fd13bf24eca2f\` | \`40079024940d5f085596f0ccaf658c62a610e1b485e81fbc94037cfe2eda79e0\` |

**Total PNG comprimido:** 2.447.320 bytes; RGBA nominal 18.743.296 bytes (cuatro).
El SHA PNG mide archivo/compresión/chunks; el SHA RGBA mide píxeles decodificados, permitiendo separar diferencias de encoding de cambios visuales. No afirmar que CRC/chunks ya fueron decodificados en Node HF1; se versionó el lector y falta ejecutarlo.

## 5. QA FORENSE QUE NO OCULTA EL FALLO
Nuevo \`public/official/src/actors-visual/p07-hf1-png-diagnostics.mjs\`: con Node \`zlib/crypto\` comprueba firma PNG, IHDR, CRC de cada chunk, bit depth/colorType RGBA8, presencia de gAMA/sRGB, alfa parcial y fringe RGB, 128 frames/bordes, descomprime filtro NONE y obtiene **SHA256 de píxeles**. Si PNG y regenerado difieren, informa:
- hash/longitud de ambos PNG;
- hash/longitud RGBA de ambos;
- primera diferencia PNG y primer canal/RGB/alpha de píxel, coordenada y frame;
- lista de los 32 frames que presentan diferencias.
Clasificación inequívoca: \`BYTE_IDENTICAL\`, \`ENCODING_OR_METADATA_ONLY\`, \`RASTER_RGBA_DIFFERENT\`.

**El test original \`assert(Buffer.from(regen.png).equals(data))\` permanece como puerta obligatoria**, con diagnóstico previo; no aceptar \`ENCODING_OR_METADATA_ONLY\` como PASS sin RFC explícito. El script \`qa-p07-hf1-forensic.mjs\` verifica los cuatro archivos, devuelve exit 1 si alguno difiere y registra Node/V8/platform/GITHUB_SHA.

## 6. PRUEBAS Y LÍMITES DE LA EVIDENCIA
| Control | Estado real a la fecha |
|---|---|
| CI original Node22 \`qa-p07.mjs\` | **FAIL_NODE**, run #39455632045 |
| V8 HF1 precisión/perturbación | **PASS_V8** en \`warrior idle-0\` |
| Exportación de 4 PNG binarios y cuatro SHA256 PNG | **PASS_V8/GitHub blobs** |
| 4 SHA256 de RGBA fuente y 128 cuadros sin border | **PASS_V8** |
| QA completo HF1 en Node22 checkout (cuatro PNG, salida 0) | **NOT_RUN** |
| Node P03/P06 regresión | **NOT_RUN** |
| \`npm run build\`, Phaser4 real | **NOT_RUN** |
| Chromium/WebGL2 1280×768, 844×390, 932×430 | **NOT_RUN** |
| Front/Back T08, grip y rifle único real en M07 | **BLOQUEANTE montaje** |
| FPS iOS/Android físico | **NOT_RUN** |
| Aprobación estética user vs captura C1-C | **PENDING** |

Referencia C1-C original: SHA256 \`24103e45a0e1249fa4b89d4e65ea16d9e147bdf1e2462e5c4063469a931842ef\`, verificado sobre el PNG adjunto. PR #30 C1-D4R se conserva como referencia funcional/artística; no se revierte.

## 7. ORDEN DE QA PARA DIRECCIÓN/INTEGRADOR EN CHECKOUT
En branch \`feature/art-p07-continuidad-c1c\`:
1. \`node public/official/src/actors-visual/qa-p07-hf1-forensic.mjs\` — ejecutar y registrar exit code; si falla copiar JSON completo y NO fusionar.
2. \`node public/official/src/actors-visual/qa-p07.mjs\` — debe conservar y pasar la aserción estricta byte-identical y hash RGBA exacto.
3. \`node public/official/src/actors-visual/qa-p03.mjs\` y \`node public/official/src/actors-visual/qa-p06.mjs\` sin cambiar fuentes históricas.
4. \`npm install && npm run build\`; luego \`node public/official/src/actors-visual/qa-p07-browser.mjs\` en Chromium/WebGL2 real, capturas 1280×768/844×390/932×430.
5. Integrador monta M07+T08+P07 sobre gameplay C1-D4R real; compara con referencia 1280×768 y verifica interacción/siluetas/cascos/arma única. No cambiar tower/core desde P.
6. Si CI no da **PASS_NODE** real, abrir nuevo diagnóstico con firstDifferentRgbaByte y NO APROBAR P07.

## 8. OWNERSHIP / ROLLBACK
Únicamente \`public/official/art/actors/**\`, \`public/official/src/actors-visual/**\`, \`docs/art/actors/**\`; sin merge/force push/deploy. P03 y P06 históricos intactos; reinstalar blobs P07 anteriores o cerrar PR #32 para rollback. La corrección de precisión no debe alterar intencionalmente siluetas/paletas ni identidad de C1-C.

**CONCLUSIÓN:** HF1 preparado con binarios nuevos y diagnóstico reproducible; **no declarar resuelto de forma certificada hasta que Node22 ejecute todo con salida 0 y dirección compare el render real**.
