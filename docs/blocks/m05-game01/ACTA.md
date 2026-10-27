# M05-GAME-01 — habilitación funcional

Base: `3227b720b89e34a8c6828e1bee80b644767ae101`. Rama `feat/m05-game01`.
Orden: Dirección, 26/10/2026, M05 jugable con 13 oleadas y jefe. El arte aprobado Cartoon02 permanece congelado.

## Implementación

Adaptador delgado de la escena compartida, mundo M05 sobre CampaignCombatWorld/withCampaignInfantry, soporte shaman/weaver, jefe mistlord y resultados aislados. Selector oficial M01–M05. Se reutilizan torres, rally, UI, atlas originales y geometría aprobada.

Contrato: 307 nodos, 9 pads, 430 oro, 100 vidas, una entrada. Grupos por oleada: 6,6,8,8,11,7,8,8,9,10,10,9,10 = 110. Jefe adicional en W13: Señor de la Niebla, 1640 HP, velocidad 27, tres fases 70%/35%. Recompensa fuente 110, normalizada a 101 por E5. Invocaciones (máximo 6) y resurrecciones se cuentan por separado; no duplican recompensas.

Fuente auditada sin editar: JUEGO_V5_CANVAS.html E1/E2/E4/E5 y QA16 Normal M05, maps.v5.json y campaign140.v5.json. Se preserva el orden aritmético del escudo QA16. Habilidades canónicas: niebla protectora, invocación, curación, resurrección y velo contra soldados. Fuga de jefe: −30 vidas, máximo una estrella. Dos estrellas hasta 25 fugas conserva condición provisional V5.

Guardado: semantropic_td_phaser_m05_normal_v1; derrota no guarda victoria; storage bloqueado no impide jugar.

## Superficie compartida mínima

scene-m02: exclusión de arranque automático M05 y etiqueta de estrellas específica. live/index y map-picker: opción M05 y carga del adaptador. viewport-panorama-r5: registro M05 y callback de márgenes ya aprobado. assets M05: exclusivamente puerta de carga en LIVE; ningún dibujo, textura o composición cambia. La guarda histórica M02 Cartoon03 compara ahora todos sus módulos/PNGs con producción 3227 durante este bloque y delega el alcance M05 a su guarda estricta; mantiene sus checks C2. El primer CI falló porque comparaba todo public contra una base anterior a M03, no por cambios en el arte M02. Los pins de blobs M04 se actualizan explícitamente para estos cambios autorizados; no se deshabilitan guardas.

## Límites

Brute, shaman, weaver y jefe usan representaciones provisionales de assets originales reutilizados, identificadas por tipo/escala/color y etiqueta del jefe. No se añadieron sprites ni VFX artísticos. No es certificación de balance de cinco dificultades ni campaña 140 completa.

Móvil físico y rendimiento continuo: NO EJECUTADOS. Emulación táctil no equivale a teléfono físico.

## QA reproducible

- node tools/qa-m05-game01-scope.mjs: alcance, arte/datos/cores anteriores inmutables.
- node tools/qa-m05-game01-core.mjs: fuente Canvas, 13 oleadas, jefe, cinco habilidades, fases, fuga, premios y guardados.
- npm run build.
- node tools/qa-m05-game01-browser.mjs: Chromium WebGL2, PC 1280×768 y táctil 844×390/932×430; nueve pads, torres/upgrades/rally, pausa/reinicio, campaña por pasos explícitos, jefe, resultados y navegación M01–M05.
- node tools/qa-m05-game01-realtime.mjs: partida completa mediante UI con reloj RAF sin acelerar y presupuesto real. El driver suprime dibujo entre capturas/input para reducir costo de GPU por software; no modifica ticks, daño, oro, vidas ni desenlace. No es benchmark de render continuo.
- CI adicional: regresiones M01/M02/M03/M04 y preview artístico M05.

Evidencias locales en evidence/: partida UI real completada en 605.879 s, 72 vidas, dos estrellas, 110 grupos + 1 jefe + 4 invocados, 5 resurrecciones, jefe derrotado fase 3. Suite de tres perfiles PASS. Son resultados locales previos a integración; CI retoma la versión final. Capturas muestran combate/jefe/victoria; la foto inicial representa el estado anterior a iniciar combate, no un before/after artístico.

## Publicación y rollback

Integración únicamente después de CI verde del HEAD exacto. Render autoDeploy desde production/semantropic-td-live en URL oficial. La publicación requiere comprobar bytes y navegador contra el commit de integración; este acta no afirma publicación anticipada. Rollback: revertir el merge del bloque mediante PR, preservando guardados y el arte aprobado; no borrar ramas ni resetear producción.
