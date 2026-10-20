# DIRECCIÓN GENERAL — ACTA DE AUDITORÍA C1-D7 T09/P08 TRAS TIMEOUT
**Fecha:** 2026-10-20 · **Rama auditoría:** `audit/c1d7-t09-p08-realqa-20261020` · **Sin merge ni Render**

## Fuentes recuperadas
- MAPAS M07-Q2 #35 SHA `61fd5c15f9b8c7d24ef29d96997359922bc24771`: incorporado y probando en C1-D6 LIVE.
- TORRES T09 #38 SHA `aec5abad0b2376ca4907ec8644b7cae1b9864bfa`: 23 archivos en ownership, Node22 `docs/art/towers/qa-t09.mjs` PASS, `npm run build` PASS. Galería original rota por URL `../../../dependencias/phaser.min.js` (necesita `../../../../dependencias/`); aún con corrección AUDIT-ONLY no quedó seleccionada plataforma/nodos en Chromium. Posible falta de contexto WebGL2 explícito en showroom; confirmar pageerror. Reportado en comentarios #38. No confundir con escena core; G1 ya validada.
- PERSONAJES P08 #39 SHA `7265c84664699955afce188e0227d56887d58a6b`: 27 archivos recuperados, 4 PNG nuevos + 4 P07 alpha-clean, 4 sheets, loader/controller/acta/QA. Node22 **PASS** `p08/qa-p08.mjs` 8 PNG, `qa-p07.mjs` PASS, build PASS. Chromium/WebGL2 P08 showroom capturó 9 fotos en tres viewports y tres estados, sin integración al gameplay. En galería se superponen los rótulos/tarjetas de dos veteranos, especialmente 844×390. Reportado en comentario #39, bloque P08-B1.
- DIRECCIÓN GENERAL #37 SHA `35707384c4ca2759ba976bddaf3640de9ca6f685`: G1 nodos funcionales y G2 controlador visual preparatorio Node/Chromium PASS #39480048631; T09/P08 pendientes de montaje.

## Auditoría independiente
- [GitHub Actions #39491269733](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39491269733) **Node real T09/P08/P07 + build PASS**; P08 9 capturas galería auténticas, workflow global FALLA por showroom T09/no montaje. Artifact #12294969703.
- [GitHub Actions #39492188188](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39492188188): seguimiento T09, QA Node PASS, navegador T09 sigue no-ready. No certificar T09 Chrome PASS.
- Producción `production/semantropic-td-live` HEAD `edf84939dfd9aa9e754247b384e5b47fe854b411` **sin cambios**. URL única https://semantropic-td-jugar.onrender.com/.
- Capturas P08 comparadas con fuente C1-C; parecen reconocibles pero arte NO aprobado por usuario. Resultados Chromium galerías ≠ 5 oleadas en el juego.

## Plan estrictamente por bloques
1. PERSONAJES P08-B1: microajuste de legibilidad de showroom de 2 veteranos + evidencia real + QA regresión; NO regenerar fuentes o PNG que ya pasaron.
2. TORRES T09-HF0: corregir src Phaser + inicialización WebGL2 showroom (sin alterar iconos ni core), Node/Chromium 3 viewports.
3. DG G2 en PR aislado: montar T09 como presentación sobre intents económicos G1; montar P08 I/II sobre core A2 y sincronizar eventos sin doble golpe; comparar antes/después C1-C, sin merge LIVE.
4. DG G3: cinco oleadas y victory/defeat/regresión FPS/Android, usuario aprueba.
5. DG G4: única rama `production/semantropic-td-live`, misma URL permanente; revertir si regresión.

**No volver a ejecutar por 40 minutos tareas enormes: checkpoint commit en cada bloque y registrar PASS/FAIL/NOT_RUN.**
