# TORRES T08 — Evidencias y límites de QA

## [OBSERVADO EN CAPTURA ORIGINAL] LOCAL

Archivo PNG adjunto y leído realmente en `/mnt/data/SEMANTROPIC_TD_REFERENCIA_VISUAL_APROBADA_C1C_M03_T04_P03(3).png`. Dimensiones 1280×768; SHA-256 comprobado con `sha256sum` = `24103e45a0e1249fa4b89d4e65ea16d9e147bdf1e2462e5c4063469a931842ef` (coincide con la orden). Esto certifica identidad del fichero, no calidad de render actualizado.

## [CONFIRMADO EN FUENTE] GitHub PR#9/#12

Se recuperaron los masters T04 PR #9 y se verificaron los **mismos blob SHA Git** en `public/official/art/towers/t04-snapshot/...` del equipo; cuatro archivos actuales T08 restaurados byte a byte con esos contenidos. `C1C` `createTowers()` consume T04 con `routeModels=[1,3,4,5]`. Master T07 archivado por separado. No se alteran M/P/Core.

## [PROBADO CON LECTURA SVG] V8 parser structural

Los dos masters Sniper T08 y cinco capas por nivel `shadow/back/structure/rifle/front` recuperadas en GitHub y verificadas estructura XML simple/360×420. El archivo `rifleMounted` posee una agrupación única `t08-one-mounted-rifle` y `structureNoRifle` carece de ella. Es garantía estática, no conteo renderizado con P07.

## [NO EJECUTADO] Node/Phaser/Chromium

`node docs/art/towers/qa-t08.mjs` y regresiones T01–T07: scripts preparados pero todavía no ejecutados en checkout. `npm run build`: NOT_RUN. Capturas Phaser/WebGL2 T08 auténticas desktop 1280×768 y mobile landscape 844×390/932×430: NOT_RUN; dispositivo físico: NOT_RUN. Sin FPS p50/p95, VRAM ni ejecución de P07 con combate C1-D4.

No existe `.github/workflows/` en HEAD T07 origen, por lo que no se puede inferir CI de esta rama. `screenshotIndex=[]`. El showroom de Torres es un **proxy de geometría**, jamás una captura de la escena completa C1-C/C1-D4.
