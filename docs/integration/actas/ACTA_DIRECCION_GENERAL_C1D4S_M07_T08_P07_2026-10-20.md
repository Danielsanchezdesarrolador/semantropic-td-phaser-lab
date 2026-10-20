# SEMANTROPIC TD — DIRECCION_GENERAL / C1-D4S AUDITORÍA DE ENTREGAS M07, T08 Y P07
**Fecha:** 2026-10-20 · **PR:** #33 Draft hacia C1-D4R PR #30 (aprobada por el usuario) · **Motor:** Phaser 4.2.1/WebGL2.
**Estado:** [QA FUNCIONAL CHROMIUM PASS] + [BLOQUEANTES QA DE TORRES Y PERSONAJES] + [CONTINUIDAD VISUAL PARCIAL].

## Origen de las entregas
PR #31 MAPAS M07 HEAD `2c08eaa13dac309f85f4e76b736db6f66545aac9`: 12 archivos, renderer V7 treatment=fiel sobre M03 Viva.
PR #29 TORRES T08 HEAD `ceaf74681887825a435968ffc44397fa17d70339`: 40 archivos, cuatro masters exactos T04 y capas alternativas rifle único.
PR #32 PERSONAJES P07 HEAD `6b2659e1e44e39cf3019e20bad7acbb02c859fdd`: 20 archivos, cuatro atlas PNG binarios 1408x832, 32 frames x 4, procedentes del P03 original con retoques.
Integración de 72 blobs de Git en su namespace, sin tocar core ni staging.

## QA real en checkout y Chromium
- [PASS] Node M07 `node public/official/src/maps-visual/m01/m07/qa-m07.mjs`.
- [FAIL BLOQUEANTE TORRES] `node docs/art/towers/qa-t08.mjs`: el test exige `operatorOwner:'P07'` y `getSniperSingleRifleLayers()` entrega `operatorOwner:'P06'`. Reportado en PR #29, comentario #6295539866.
- [FAIL BLOQUEANTE PERSONAJES] `node public/official/src/actors-visual/qa-p07.mjs`: línea 56, los PNG persistidos no se reproducen byte por byte desde `buildP07Atlas()`. Reportado en PR #32, comentarios #6295540834 y #6295736553.
- [PASS] las regresiones C1-D2/C1-D3, 5 oleadas, economía; Phaser 4.2.1 build.
- [PASS CHROMIUM WebGL2] run #39455854687: ambas escenas C1-D4R y C1-D4S terminaron compra Infantería/Sniper, daño/primer kill, bounty, pausa, reinicio, touch-pad en 1280x768, 844x390, 932x430. Capturas reales: artifact 12280572543 con 9+9 screenshots.
- [FAIL FINAL INTENCIONAL] El workflow está diseñado para terminar rojo cuando estos bloqueantes persisten. No interpretar arte PASS aunque Chromium funcione.

## Revisión visual de Dirección
- [MANTIENE] M07 tratamiento FIEL mantiene topología y lenguaje visual M03 Viva aprobado; sin mapa reinterpretado.
- [MANTIENE] T08 recupera master composite T04 y apariencia de cuartel/vigía, sin nuevas siluetas.
- [CAMBIO LEVE POR REVISAR] P07 orcos conservan identidad P03, pero presentan pequeñas diferencias de perfil/nitidez por raster CPU; comparar a igual cámara.
- [REGRESIÓN NO APROBADA] P07 sniper_operator_unarmed muestra casco/cabeza oscura de ojos cian prominentes donde C1-D4R aprobada muestra cabeza beige/casco original. No es un cambio autorizado; además grip/culata permanece pendiente. Ver recorte real de screenshot desktop de ambos estados.
- [DECISIÓN TÉCNICA] Para impedir retroceso en la rama de REVIEW, por defecto C1-D4S conserva render del operador original P03; P07 sólo se habilita con `?operator=p07` en el candidato para comparar. NO autoriza pasar a staging ni afirma rifle único final.

## Principios innegociables
- C1-D4R PR #30 permanece visual aprobado, rollback y baseline protegido.
- No tocar public/JUEGO_V5_CANVAS.html, mapas/campaña V5, core C1-D3 ni la economía.
- C1-D4S es DRAFT #33: no merge, sin Render, sin aprobación visual total.
- Corregir QA T08/P07 en sus ramas originales y repetir QA/capturas; después Dirección + usuario validan el aspecto.
- Equipo M07 sin hotfix por el momento; su mapa ya coincide con la referencia C1-C.

## Próximo gate
Nueva CI para C1-D4S con fallback P03 como visual predeterminado. Hasta que T08/P07 reparen sus pruebas y demuestren grip/continuidad, mantener ambos como componentes candidatos y NO promocionar PR #33.

## Validación adicional: operador P03 como fallback funcional (después de rechazo P07)
[PASS CHROMIUM/WebGL2 REAL] [Actions #39457360704](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39457360704) ejecutó C1-D4R aprobado y luego C1-D4S con operador P03 original predeterminado. Tres viewports, touch/compra/kill/bonus/pause/restart pasaron. Arte candidato de T08/M07 luce fiel; operador igual que el aprobado. Artifact real ID 12280953608, screenshot primer kill. El run general termina FAILURE **intencional** por T08/P07 QA pendientes, no por navegador; los dos pasos browser son SUCCESS. Se preserva variante opt-in `?operator=p07` sólo para inspección, rechazada para montaje predeterminado por cambio de casco/cabeza.
[DECISIÓN] Preservar rollback PR #30, mantener PR #33 DRAFT; acciones correctivas en TORRES #29 y PERSONAJES #32. No autorizar merge/deploy aún.
