# SEMANTROPIC TD · P06 · EVIDENCIA VISUAL / ATLAS
**Fecha:** 20-10-2026 · **Rama:** `feature/art-p06-animated-actors`
**Estado:** [PNG BINARIOS CONFIRMADOS EN GIT], [V8/ALFA REVISADOS A NIVEL FUENTE], [CAPTURAS PHASER NO EJECUTADAS]

## Archivos de imagen reales disponibles EN GITHUB
| Actor | Archivo | Bytes | SHA256 de bytes exportados |
|---|---|---:|---|
| Warrior | `public/official/art/actors/p06/png/warrior.png` | 342686 | `bb0a8198bfdd36e9170bac15dffa062cb87dd8845e7ceb03620cff93257093e9` |
| Hound | `public/official/art/actors/p06/png/hound.png` | 234736 | `b94a9ac5d6a0c7c28f040de952a829d47599f8b45fb4791ca7c156d794f2ae8c` |
| Recluta | `public/official/art/actors/p06/png/infantry_recruit.png` | 325087 | `9347993eb8085c799fa3c457cd3f7164a0f16480350f59425002b2130c4764bb` |
| Operador SIN rifle | `public/official/art/actors/p06/png/sniper_operator_unarmed.png` | 270400 | `92da13f5b7431043bf2b0116b3fd400f3be35c4d303e67db043d35f1faf79d5f` |

Estos son **cuatro blobs PNG reales y persistentes**, no `canvas.toDataURL()` pendiente ni imágenes de referencia IA. Generador reproducible `p06-png-generator.mjs`; hashes calculados sobre bytes exportados con `p06-hash.mjs`. Muestras de firma IHDR reportadas 1408×832, RGBA8 color=6. Auditoría de fuente RGBA revisó 128 celdas y detectó/corrigió clipping y overflow antes del segundo commit binario. PNG miniatura 7×5 generado con mismo encoder fue decodificado independientemente usando Pillow. **No se realizó aún redescodificación completa desde checkout de los cuatro PNG; script Node preparado.**

**Esos PNG son PROTOTIPOS ILUSTRADOS PROCEDURALMENTE, no obra pictórica premium aprobada.** Las ilustraciones fuente no se sustituyen por arte externo ni por assets de marcas ajenas. El usuario conserva la aprobación artística final.

## Browser screenshots / filmstrips [NO EJECUTADO]
| Solicitud real | Estado | Script y destino |
|---|---|---|
| Comparativa desktop Phaser/WebGL2 1280×768 | NOT_RUN | `qa-p06-browser.mjs` → `p06-desktop-real-webgl2.png` |
| Móvil landscape 844×390 | NOT_RUN | `qa-p06-browser.mjs` → `p06-landscape844-real-webgl2.png` |
| Móvil landscape 932×430 | NOT_RUN | `qa-p06-browser.mjs` → `p06-landscape932-real-webgl2.png` |
| 4 filmstrips 8 poses extraídos de PNG cargados por Phaser | NOT_RUN | `qa-p06-browser.mjs` |
| T07 Sniper I/II con capa frontal y operador P06 | BLOQUEANTE | Integrador debe ensamblar 3 capas y corregir grip |
| iPhone/Android físico | NOT_RUN | No se dispone de dispositivo accesible |

## QA local reproducible sin herramientas centralizadas
En checkout real del PR P06:
1. `node public/official/src/actors-visual/qa-p06.mjs` — decodifica PNG REALES mediante zlib, valida firma/32 frames/bordes/alfa, SHA256 Node vs hash JS, salida regenerada byte-a-byte y PR22 proyección de HP/eventos.
2. `npm install && npm run build`.
3. `npm install --no-save playwright && npx playwright install chromium` (herramientas locales, no cambiar package.json).
4. `node public/official/src/actors-visual/qa-p06-browser.mjs`. Tras ejecución exitosa genera screenshots verdaderos y filmstrips dentro de esta carpeta.
5. Revisar screenshots reales, subir archivos sin falsificar evidencia, actualizar `QA_P06.json` y acta.
6. Solo el Integrador debe abrir M01 real con P06/T07 y validar coordinación ocular/culata/manos; la vitrina P06 usa fondo de pradera **PROXY**, no un M06 copiado.

## Dos debilidades declaradas sin maquillaje
1. Arte P06 raster procedimental gana exportabilidad y separación de arma, pero la **calidad de pincel, expresividad, material y continuidad pictórica** a escala móvil **no está demostrada** y puede no superar P05; no aprobar por tener un PNG.
2. Manos del operador de 80wu no proyectan a culata de T07 desde sus sockets nominales; diferencia calculada de ~35wu vertical, no medida en screenshot. Requiere revisión conjunta T07/P06/Integrador.

**Criterio:** jamás etiquetar una imagen PNG de atlas como screenshot de escena Phaser, ni una captura SwiftShader como dispositivo iPhone real.