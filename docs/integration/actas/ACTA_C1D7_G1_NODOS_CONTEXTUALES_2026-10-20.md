# SEMANTROPIC TD — ACTA DE DIRECCIÓN GENERAL / C1-D7 G0–G1 Y BASE G2
**Fecha:** 2026-10-20 · **PR:** #37 DRAFT · **Rama de trabajo:** `feature/integrator-c1d7-contextual-ui`.
**Baseline de producción:** `production/semantropic-td-live` SHA `edf84939dfd9aa9e754247b384e5b47fe854b411`. **Render estable SIN MODIFICACIONES:** https://semantropic-td-jugar.onrender.com/.
**HEAD de código validado:** `9792c6dfd5c177a8d4e718f5a01a4eac8a4f120d` · **QA real:** [GitHub Actions #39480048631](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39480048631) SUCCESS.

## 1. Autoridad del Prompt Maestro
Se recibió el archivo `SEMANTROPIC_TD_PROMPT_MAESTRO_DIRECCION_GENERAL_C1_D7_UI_NODAL_INFANTERIA_ANIMACION_LIVE_2026-10-20.txt`, 30 secciones. Alcance G0–G1 ejecutado ahora; G2 (P08) y T09 pendientes de entregas y validación. No se ha reescrito ningún recurso artístico M07-Q2 FIEL/T08-HF1-T04/P03 aprobado.

## 2. Entrega tangible del Integrador
- `public/official/src/core-c1d/c1d7-contextual-intents.mjs`: contrato central puro para Intents `build_infantry,build_sniper,upgrade,sell,rally,close`; DTO con economía/quotes reales, estado de pausa/derrota y razones de bloqueo. NO almacena monedas y NO simula transacciones. `c1d7ApplyIntent` reconsulta quote y ejecuta un solo método del CORE. Cálculo viewport→world/World→client desde DOMRect real, compatible con escalado CSS ENVELOP y FIT.
- `public/official/src/c1d7-playable/index.html`: interfaz compacta, menú nodal sobre cada socket, accesible para touch y teclado; footer de compra eliminado. Se conservan información de oro, vidas, oleada, resultados y guardado + Iniciar/Pausar/Reiniciar.
- `public/official/src/c1d7-playable/scene.mjs`: Phaser 4.2.1 real basado en C1-D6, acción desde evento de toque sobre la plataforma, rect de canvas, ancla/clamp seguro para no cortar nodos. Selección no llama `drawTowers` innecesariamente; compra/up/sell sí actualiza sprites y escuadrón al confirmarse la transacción. Menús se cierran por X, fuera del pad y Escape. Punto de reunión se selecciona tocando el camino.
- `public/official/src/core-c1d/c1d7-actor-visual-controller.mjs`: G2 CONTRATO PREPARATORIO sin integrarlo aún al renderer. Consume eventos reales `soldier_attack_windup,soldier_attack_hit,enemy_attack_windup,soldier_hit,hit_applied,soldier_die,soldier_respawn,entity_die,entity_escape,scene_reset`, determina fases de animación por tiempo simulado y elimina duplicados por eventId. **No altera HP, daño, monedas, targeting ni tiempos del core.** La activación artística requiere P08 verificado.
- `.github/workflows/c1d7-g1-contextual-ui.yml`, `tools/qa-c1d7-menu.mjs`, `tools/qa-c1d7-browser.mjs`, `tools/qa-c1d7-actor-visual.mjs`.

## 3. Pruebas verdaderas ejecutadas (G1)
**[PASS Node]** Bloqueo hashes originales C1-C (M03/T04/P03); 8 sockets, 133 waypoints, oro365; Infantería I cuesta95, II +135, venta `floor(230*.65)`, Sniper cuesta140; libro mayor sin doble cobro, 1→2 soldados, pausa no permite construir, roundtrip coordenadas de 8 pads en 1280x768/844x390/932x430/1536x709; navegación/rally y resultados C1-D5.
**[PASS Node]** Fases visuales puras de soldado/enemigo: windup, attack, hit, die, respawn, escape, reset; no temporizadores independientes y deduplicación por eventId. No son aún sprites P08.
**[PASS Build]** `npm install` y `npm run build` real Phaser 4.2.1.
**[PASS Chromium WebGL2]** En 1280x768, 844x390, 932x430 y 1536x709: toque de socket visual real, apertura de menú dentro del viewport, compra Infantería, mejora a II/dos soldados, venta+refund, compra Sniper, cerrar menú y pausar/reanudar. Overlay portrait comprobado con 390x844. Capturas auténticas artifact GitHub **12290527350**, incluye menús vacíos/con torre II y controles compactos.
**[NO EJECUTADO]** Fotogramas P08/T09 finales, control visual de hit-frame P08, cinco oleadas jugadas MANUALMENTE en nueva UI, rendimiento GPU Android físico, análisis manual de barras laterales del webview (el QA comprueba rectas de menú, no garantiza pantalla sin letterboxing en toda relación de aspecto). Ya existe QA de cinco oleadas de C1-D6 antes del cambio.

## 4. Estados oficiales de aceptación
G0 Auditoría: [CONFIRMADO EN ARCHIVOS].
G1 Nodos contextuales sobre juego real: [PROBADO EN NODE Y CHROMIUM], apto para revisión visual G3, **no está publicado**.
G2 Animación evolutiva y personajes: [ESPERA PERSONAJES P08]; el controlador semántico es preparación, NO trabajo artístico final.
T09 Skin/Iconos: [ESPERA TORRES T09]; interfaz actual de integrador es un control FUNCIONAL, sin inventar assets T09.
G3 Visual/performance real hardware y comparativa antes/después: [NO EJECUTADO].
G4 Victoria/derrota M01 con menús integrados y P08 activo: [NO EJECUTADO].
G5 publicación permanente y playtest humano: [NO EJECUTADO]; el link LIVE sigue siendo C1-D6.

## 5. Dependencias, rutas y gates
TORRES T09 sólo puede trabajar `public/official/src/towers-visual/**`, `public/official/art/towers/**`, `docs/art/towers/**`.
PERSONAJES P08 sólo `public/official/src/actors-visual/**`, `public/official/art/actors/**`, `docs/art/actors/**`.
El Integrador leerá sus PRs en GitHub, validará assets/hashes/QA por ownership, montará sobre esta rama y comparará capturas reales C1-C y Android. P07 HF1 continúa vetado hasta validación de su alfa; no activar por defecto. **Nunca cambiar la URL pública**: promover a `production/semantropic-td-live` y actualizar interior `public/official/src/live/index.html` sólo después de QA total, revisión visual y autorización del usuario.
