# SEMANTROPIC TD · EVIDENCIAS P05 / C1-D2
**Fecha:** 2026-10-19 · **Rama:** `feature/art-p05-combat-reactivity`
**ESTADO:** [CÓDIGO PUBLICADO] · [V8 SIMULADO PASS] · [PHASER REAL NO EJECUTADO] · [CAPTURAS NO DISPONIBLES].

## No hay capturas auténticas P05 todavía
Las hojas y atlas P05 se generan a través de Canvas2D y se registran en Phaser *cuando se ejecutan en navegador*. El código no constituye un PNG exportado. El contenido de las pruebas V8 no produce píxeles, por lo que **no se incorpora mockup ni imagen IA como si fuese captura runtime**. No se atribuye a P05 el QA de PR #17/C1-E ni otros runs anteriores.

## Evidencia solicitada — mismo encuadre
| Solicitada | Estado | Comando/procedimiento |
|---|---|---|
| 1280×768 P04 vs P05 | NOT_RUN | `qa-p05-browser.mjs` |
| 844×390 landscape emulado | NOT_RUN | `qa-p05-browser.mjs` |
| 932×430 landscape emulado | NOT_RUN | `qa-p05-browser.mjs` |
| P05 cuatro atlas PNG 1408×832 | NOT_RUN | Browser export con `toDataURL('image/png')` |
| PNGs con alfa/hashes reales | NOT_RUN | Test Chromium pixel alpha + SHA256 bytes reales |
| 4 hojas de expresión 1200×820 | NOT_RUN | Botón `Hoja 6 poses P05` por personaje |
| Operador en T06 frontRail | BLOCKED | RFC P05→T06: duplicación de rifle |
| 20–30 actores móviles y FPS p50/p95 | NOT_RUN | Browser/hardware con medición real |

## Cómo ejecutar cuando se disponga de checkout
1. `npm install && npm run build` (sin editar build ni package desde P).
2. `node public/official/src/actors-visual/qa-p05.mjs` (QA Node puro con Canvas2D simulado).
3. `npm install --no-save playwright && npx playwright install chromium`.
4. `node public/official/src/actors-visual/qa-p05-browser.mjs`.
5. El script browser (si finaliza) escribirá PNG auténticos de la página y atlas RGBA con hash en esta carpeta, junto con `RUN_P05_BROWSER.json`. Validar visualmente y subir esos archivos a GitHub **antes** de cambiar QA JSON a PASS.
6. Para pruebas manuales, servir `dist` por HTTP y abrir `/official/src/actors-visual/p05-index.html`. Seleccionar actores, disparar hits, bloqueos, eliminación/fuga y Reset; revisar foot pivot fijo y las sombras.
7. Pedir al Integrador que instancie P05 desde el core verdadero y T06 con ambas capas y capture desalineaciones. No equiparar la vista aislada a partida jugable.

## Lo demostrado hasta ahora
- 4×32 frames y 7 estados con dibujos P04-derived y reacciones P05; 128 trazas de dibujo distintas.
- FSM independiente acepta eventos propuestos, bloquea eventId duplicados, pausa/resume, cambia E↔W sin reset walk, y separa die vs escape; terminal callback una vez por flujo.
- 4 hojas de seis poses originales producidas estructuralmente por función (no exportadas).
- Un atlas RGBA8 sin comprimir = 1408×832×4 = 4,685,824 bytes ≈4.469 MiB; **estimación**, no GPU medida.
- T06 read-only facilita sockets y frontRail; **no** prueba encaje y contiene un rifle propio, en posible conflicto con el actor P05.

**No usar [CAPTURA REAL] ni [PROBADO EN NAVEGADOR] para P05 hasta verificar los archivos reales.**