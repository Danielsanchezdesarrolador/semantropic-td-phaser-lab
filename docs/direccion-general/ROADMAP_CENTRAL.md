# SEMANTROPIC TD — Roadmap central del equipo único

Este es el único roadmap operativo. Lo mantiene el equipo central integral de Codex bajo la Dirección General del usuario. Los roadmaps, ramas y actas anteriores permanecen como historia y evidencia; no activan trabajos paralelos ni autorizan reimplementar sistemas. La instrucción expresa más reciente del Director y `AGENTS.md` rigen cada bloque.

## DECISIÓN ARTÍSTICA FINAL VIGENTE — CARTOON 2D PREMIUM V1 (23/10/2026)
**[APROBADO POR DIRECCIÓN GENERAL]** Último mockup más cartoon de M01 «Praderas del Amanecer», aprobado explícitamente después de comparar la versión pictórica y dos mockups más suaves. **Documento canónico obligatorio:** [ESTILO_VISUAL_CANON_CARTOON_2D_PREMIUM_V1.md](ESTILO_VISUAL_CANON_CARTOON_2D_PREMIUM_V1.md). AGENTS.md obliga a Codex a consultarlo antes de nuevas tareas visuales.
- Se aplica a **TODOS**: 10 mapas, 5 familias de torres, operadores, aliados, soldados, enemigos, tres jefes, animaciones, VFX, HUD, iconos, tutorial y pantallas.
- **Sustituye** «M03 pictórico/semirrealista es el estándar visual final». M03 permanece fuente técnica histórica, no paleta ni acabado a imitar. El estilo común es cartoon 2D con contornos nítidos, sombreado gráfico por planos, masas de color saturado controlado, formas simplificadas, perspectivas 3/4 coherentes, acantilados y terrazas que crean verdadera profundidad, sombras/anclajes y lectura jugable móvil.
- El **mockup es modelo de ESTILO, no geometría del nivel**. Respetar pads, ruta, torres, oleadas, economía, ataques, guardados y balance de cada mapa; nunca pegar el mockup entero como imagen de fondo.
- La imagen aprobada fue compartida por el Director en el chat: **NO se ha incorporado un archivo de imagen binario al repositorio en este cambio documental**. Para fidelidad visual Codex debe recibirla adjunta o utilizar un asset de referencia confirmado en GitHub. Nunca inventar que el JPG está disponible en el checkout.
- La aprobación artística general NO es autorización para cambiar los diez mapas y todos los personajes de golpe; **cada implementación queda separada por bloques**. Codex equipo único del código; colaboradores preparan mockups sin programar. No copiar assets de Kingdom Rush.

### Roadmap transversal de convergencia al canon (cada casilla requiere orden de bloque)
| Etapa | Bloque visual exclusivo | Insumos y puerta de aprobación |
|---|---|---|
| 0 — Adoptar canon | DOC-ART-CANON-V1 (ESTE cambio) | AGENTS, roadmap y guía coherentes, sin cambios runtime ni afirmaciones de QA visual nueva |
| 1 — Piloto visual | MAP-STYLE-01-FIDELIDAD (M01) | Mockup final aprobado adjunto; comparar siluetas, bordes, sombras, mesetas, ocho pads y 133 nodos; demostrar en Phaser, aprobar Dirección |
| 2 — Campaña | MAP-STYLE-02 ... MAP-STYLE-10, uno por mapa | Biomas propios con mismo cartoon; sin rehacer rutas/oleadas/combate; capturas y aprobación mapa a mapa |
| 3 — Torres | ART-TOWER-[familia-nivel] | Mockups aprobados de las cinco familias I–IV/ramas según diseño oficial; siluetas, escalas, operadores y puntos de disparo coherentes; integrar sin cambiar stats |
| 4 — Aliados y enemigos | ART-ACTOR-[pack], ART-BOSS-[jefe] | Sheets originales de aliados, operadores, 18 arquetipos y jefes; sprites consistentes, pivotes, estados, outline, sombra y lectura táctica; sin alterar IA/daño |
| 5 — Movimiento | ANIM-[pack] | Idle, movimiento, anticipación, golpe, muerte y facings adecuados con el mismo estilo cartoon; separar de stats y mecánicas |
| 6 — VFX | VFX-[familia/estado] + ENV-[mapa] | Efectos cartoon de arma/daño/tipo y ambientales (agua/molino/niebla), eventos reales y control GPU; no duplicar golpes |
| 7 — UI/UX | UI-[pantalla] + ICON-[familia] | HUD, menú, iconos, barras, tarjetas, tutorial: mismo estilo cartoon, escalable y táctil, sin tapar escena |
| 8 — Audio + cierre | AUDIO-[paquete] y QA-VISUAL-GLOBAL | Música/SFX originales, pruebas de coherencia entre escenas/mapas/sprites y QA real Android/iPhone/PC |

**Regla de alcance permanente:** un mapa = solo MAPA-ARTE; pads, oleadas, torres, enemigos, core, VFX y UI requieren sus respectivas órdenes. La pintura cartoon no justifica reiniciar sistemas. El Director aprueba cada pack antes de integrarlo y cada resultado visual antes de extenderlo al resto del juego.

## Objetivo y continuidad

Terminar un Tower Defense comercial premium, original, tácticamente profundo y mobile-first horizontal, con Phaser 4.2.1/WebGL2. DECISIÓN VISUAL MÁS RECIENTE DEL 23/10/2026: CARTOON 2D PREMIUM V1 del último mockup M01 aprobado es el canon para TODOS los sistemas visuales; M03 pictórico queda como referencia histórica, no estándar de estilo. Los reworks futuros son solo por bloque autorizado y sin tocar mecánicas por inercia. Preservar la identidad C1-C y las aprobaciones posteriores, la legibilidad táctica, el CORE autoritativo y los contratos. Kingdom Rush/Ironhide es referente de calidad, sin copiar propiedad intelectual. Monetización final pendiente de decisión.

Rama de publicación: `production/semantropic-td-live`.

URL jugable única: https://semantropic-td-jugar.onrender.com/official/src/live/

Último cambio jugable verificado al adoptar esta metodología: **M01 R7 HF3**, SHA `5388a490f808bac4cfd47e02ae6739f923caa5cc`, [CI 39890530324 SUCCESS](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39890530324). Esta es una referencia de contenido jugable, no un HEAD perpetuo: comprobar la rama real antes de cada tarea.

## Estado y secuencia por bloques

| Bloque central | Estado real | Siguiente criterio de cierre |
|---|---|---|
| Metodología y documentación | [APROBADO POR DIRECCIÓN] equipo único; adopción documental en este bloque | AGENTS, política y trazabilidad coherentes; conservar ramas históricas |
| M01 vertical slice premium | [CONFIRMADO EN CÓDIGO] R7 HF3 publicado; 133 nodos, 8 pads, 5 oleadas/63 enemigos, Infantería y Sniper I/II; QA técnico PASS | [PENDIENTE] valoración artística final y playfeel del Director, dispositivos físicos/FPS. Rework solo del paisaje AUTORIZADO; no rehacer gameplay HF3 |
| M02 Campos del Molino | [CONFIRMADO EN CÓDIGO] R6, selector, 163 nodos, 8 pads, 7 oleadas/80 enemigos; [BASE JUGABLE] mecánicas R6 preservadas, arte antiguo a renovar por orden 23/10 | Transición artística por bloque al canon cartoon 2D premium V1 con identidad agrícola propia. Sin cambiar 7 olas/80 enemigos, pads ni geometría |
| Cinco familias de torres | [PENDIENTE] completar Guardiana/Bombardera/Control y niveles III/IV, especializaciones y habilidades; solo dos familias I/II construibles hoy | Subbloques autorizados con arte, mecánicas, eventos y QA reales; no implementar todo el catálogo de una vez |
| Enemigos y jefes | [CONFIRMADO EN CÓDIGO] warrior/hound en M01; M02 añade archer/shieldbearer; M03 añade foreststalker/hunter/bat según campaña. [PENDIENTE] paridad progresiva y jefes | IA, telegraphs, animaciones, estados y combate verificables por cada incorporación |
| M03 Bosque de los Susurros | [CONFIRMADO EN CÓDIGO] port Normal: 188 nodos, 8 pads, 9 oleadas/101 enemigos, siete tipos; roble, bosque y ambiente originales. Acta: `docs/blocks/m03/IMPLEMENTACION.md` | QA local navegador y regresiones PASS; CI y entrega LIVE trazadas en [PR #52](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/52). M03 mantiene su arte pictórico histórico pero deberá adecuarse al canon cartoon 2D premium V1 mediante bloque artístico futuro expresamente autorizado; evaluación de jugabilidad/QA físico sigue pendiente |
| M04 Río de los Antiguos | [APROBADO POR DIRECCIÓN 23/10] Arte HF1 congelado. [M04-GAME-01] Adaptadores de campaña/escena, nueve plataformas, 11 oleadas y 94 enemigos canónicos. Acta `docs/blocks/m04-game01/ACTA.md` | QA funcional/publicación registradas en el PR del bloque; no confundir arte aprobado con balance humano. Bruto/chamán: presentación provisional de assets originales, tipos e IA propios |
| Campaña M05 | [HISTÓRICO CANVAS / DATOS] diseño y 13 oleadas; slot jefe M05/W13 | Port solo tras orden específica, con geometría, progresión, QA y aprobación visual |
| Campaña M06–M10 | [HISTÓRICO CANVAS / DATOS] 15/17/19/21/23 oleadas, entradas dobles/triples, slots M08/W19 y M10/W23 | Integración y QA de rutas múltiples y jefes, por bloques |
| Tutorial y metaprogresión | [PENDIENTE] port/adaptación de T-00, desbloqueos, dificultades y saves versionados | Validación de progreso real y compatibilidad de guardados |
| Audio, UX, accesibilidad y ambiente vivo | [PENDIENTE] cierre audiovisual y ambiental coherente con identidad | Feedback sincronizado, controles móviles, reducción de efectos y presupuesto de rendimiento comprobados |
| QA comercial y lanzamiento | [PENDIENTE] campaña completa, estabilidad, balance humano, licencias, dispositivos físicos | Evidencias reales antes de fijar tiendas, fechas o modelo comercial |

Ordenar estos bloques no autoriza implementaciones nuevas por sí mismo. El siguiente alcance concreto se toma de la orden del Director; no se inicia otra torre, mapa o rework solo por aparecer en esta tabla. La aceptación estética humana no se deduce de CI verde.

## Campaña y reglas preservadas

Campaña objetivo: diez mapas, 140 oleadas [5,7,9,11,13,15,17,19,21,23]. Es dato/diseño protegido, no declaración de 140 oleadas jugables en Phaser. M08 canónico es **Ruinas del Imperio Perdido**; no renombrar por un roadmap antiguo. Torre de Control gratuita y única, progresión 1/2/3/3 soldados y especializaciones IV son decisiones objetivo que deben contrastarse con el port efectivo antes de tocar runtime.

No reiniciar motores, torres, personajes, mapas ni sistemas aprobados. Preservar `maps.v5.json`, `campaign140.v5.json`, Canvas V5, `m01-model.mjs`, contratos y fuentes artísticas protegidas salvo orden específica. M/T/P es separación de módulos, no organización de equipos independientes.

## Ejecución y entrega

Un único objetivo verificable → inspección de HEAD y evidencia → rama acotada/PR → cambio mínimo dentro del alcance → QA proporcional y regresión → integración/publicación autorizada → verificación de contenido en la misma URL → instrucciones concretas para que el Director pruebe.

Si el bloque no se publicó o no se verificó, decirlo y no presentar el enlace anterior como si contuviera el cambio. Una actualización solo documental no es una nueva versión jugable. El registro de ramas está en `AUDITORIA_RAMAS_HISTORICAS.json`; recuperar piezas exige revisión específica, no merges masivos ni borrado de ramas.

## ANTECEDENTE DE REWORK PICTÓRICO — 23-OCT-2026 (REEMPLAZADO EN ESTILO POR CARTOON 2D PREMIUM V1)

**Estado:** [APROBADO POR DIRECCIÓN] rework artístico general de la CAMPAÑA, sin reprogramación general del core. Las capturas provistas comparan M01 (pradera plana), M02 (campo/molino plano) y M03 (Bosque de los Susurros con tratamiento pictórico). **Esta meta pictórica M03 fue SUSTITUIDA** por Cartoon 2D Premium V1 (documento canónico arriba). Mantener lo técnico de esta metodología y avanzar solo mediante bloques, pero no volver al acabado pictórico para nuevos mockups.

**Objetivo de consumo Codex:** Sol con razonamiento Intermedio elegido por el usuario; minimizar alcance por prompt, no acumular sistemas. No prometer ahorros exactos: medir uso por bloques y ajustar método. Una tarea no permite otras tareas "aprovechando que estamos aquí". Equipo único Codex implementa TODO el código; colaboradores externos preparan **solo mockups/pack de diseño de torres, personajes, aliados, enemigos y VFX** fuera del repositorio, que se integrarán tras aprobación. No reactivar antiguo esquema de tres equipos que programan en ramas paralelas.

### A. MATRIZ DE ALCANCE POR TIPO DE BLOQUE

| Código | ÚNICO resultado esperado | NO hacer en el mismo bloque |
|---|---|---|
| B00 AUDITORÍA DE ESTILO | Inventario visual+runtime M01/M02/M03, screenshot baseline, SHA, rutas/archivos y presupuesto | No reescribir ni redecorar |
| MAP-ART-[NN] | Un mapa CARTOON 2D PREMIUM modular: terrenos, bioma, siluetas, profundidad, árboles, rocas, agua, camino visual con puntos existentes | No pads reales, oleadas, enemigos, oro, torre, combate, resultados, HUD |
| MAP-PADS-[NN] | Mejorar arte/legibilidad de plataformas de torre canónicas en un solo mapa | No mover sockets/IDs ni tocar construcciones/economía sin nuevo bloque |
| MAP-ENV-[NN] | Ambiente vivo específico del mapa: hojas, viento, cascadas justificadas, humo/nieve/ceniza, optimizado | No VFX de disparos, enemigos, balance ni rediseño completo de fondo |
| GAME-WAVES-[NN] | Datos/ritmo/oleadas del mapa y QA contra campaign140.v5.json | No modificar arte, pads, UI o torres |
| GAME-ENEMY-[TIPO] | Una clase/arquetipo enemigo con IA, animación/protocolo si ya está aprobado | No implementar catálogo completo ni nuevas olas no pedidas |
| GAME-TOWER-[FAMILIA/NIVEL] | Integrar una torre/upgrade/habilidad específica aprobada con core y tests | No tocar terreno, 10 niveles, nuevos enemigos ni HUD general |
| ART-ACTORS-[PACK] | Integrar imágenes aprobadas de soldados/enemigos/aliados con pivotes/atlas y estados visuales | No cambiar daños, HP, recompensas ni condiciones de victoria |
| VFX-[TIPO] | Un paquete de efectos de combate desde eventos reales del core | No recalcular DPS, spawns, moneda o shaders de todo el juego |
| UI-[PANTALLA] | Pantalla/HUD concreto accesible móvil con regresiones | No remodelar arte/mapas/combate |
| AUDIO-[SISTEMA] | SFX/música/mezcla de un sistema con controles de volumen | No rediseñar HUD o IA |
| QA-RELEASE | Verificación de integración, builds, estabilidad/rollback y enlace vivo | No añadir features nuevos |

**Regla predeterminada:** "Haz el mapa 04" significa MAP-ART-04, EXCLUSIVAMENTE paisaje; el usuario deberá indicar "pads", "oleadas", etc., en sus respectivos bloques. Si un mapa debe aparecer en LIVE como jugable, apertura de selector/integración se gestiona en su bloque posterior de juego, no se falsea.

### B. ROADMAP CON ORDEN Y PUERTAS DE APROBACIÓN

**ETAPA 0 — Documentación + continuidad (AHORA).**
- Adoptar AGENTS.md y el canon Cartoon 2D Premium V1 aprobado más recientemente; conservar la referencia M03 solo como antecedente y las capturas antiguas como comparación histórica. No inventar PNG/URL de repo.
- Auditar una vez el renderer: capas, modelo de escenario y dependencia entre terreno/camino/pads de M01–M03, que permita trabajo artístico limitado sin modificar core.
- Separar lo aprobado, entregado y jugable; registrar SHA actual para evitar auditorías repetidas.

**ETAPA 1 — HISTORIAL B01/B02/M03, CONTINUIDAD JUGABLE.** Las tareas aquí enumeradas documentan etapas anteriores del rework; la prioridad visual ACTUAL es piloto M01 cartoon y los bloques MAP-STYLE indicados arriba.
- B01: MAP-ART-01, Praderas del Amanecer. [IMPLEMENTADO / QA LOCAL PASS] paisaje B01 en rama `feature/b01-m01-pictoric-meadow`; CI, publicación y aceptación artística se trazan en el PR. Acta: `docs/blocks/b01/ENTREGA.md`. Base pictórica histórica, SUPERADA como estilo final por el canon Cartoon 2D Premium V1: praderas con profundidad, sendero ilustrado, rocas y árboles expresivos, horizonte, sombras/luz. Conservar 133 nodos, 8 pads, 5 olas/63 enemigos, 365 oro y core estable. No copiar el bosque M03 ni añadir sistemas.
- B02: MAP-ART-02, Campos del Molino. Paisaje rural premium: campos de cultivo volumétricos ilustrados, molino, granjas, acequias/puentes justificados, camino táctico, luz de pradera; conservar 163 nodos, 8 pads, 7 olas/80 enemigos, 395 oro. NO gameplay.
- B03: Auditoría corta de M03 (ya funcional con 9 olas/101 enemigos según acta), referencias/defectos visuales pendientes y protección. No rework M03 por rutina.
- Cada MAP-ART se cierra con captures antes/después mismo zoom, QA render PC/móvil, rutas intactas, aprobación del Director y enlace LIVE tras promoción válida.

**ETAPA 2 — MAPAS M04–M10: BLOQUES HISTÓRICOS Y PENDIENTES.** Las tareas visuales siguientes se deben interpretar bajo el CANON CARTOON V1 vigente; no reiterar M04 ya integrado ni reabrir su core.
- MAP-ART-04 Río de los Antiguos: B04 implementa arte fluvial, ruinas, nueve posiciones pintadas y dos puentes canónicos. Vista de arte independiente del selector; sin gameplay. QA/publicación en PR y `docs/blocks/b04/ACTA.md`.
- MAP-ART-05 Pantano de la Niebla: manglar/bruma, terreno húmedo, charcos, ruinas originales.
- MAP-ART-06 Desfiladero de Hierro: cañones y acantilados militares, doble acceso visual existente.
- MAP-ART-07 Paso de la Escarcha: nieve, hielo, frío, relieve y doble acceso visual.
- MAP-ART-08 Ruinas del Imperio Perdido: tres entradas canónicas, ruinas monumentales originales y composición no repetitiva.
- MAP-ART-09 Corazón del Volcán: lava, ceniza, roca basáltica, caminos cálidos legibles y tres entradas.
- MAP-ART-10 Fortaleza del Eclipse: final épico, murallas/portal, relieve defensivo y tres entradas.
- No dar por jugables los M04–M10 por disponer de su arte. Mantener el selector ocultando mapas incompletos hasta integración y QA.

**ETAPA 3 — PLATAFORMAS/REGLAS DE CONSTRUCCIÓN Y AMBIENTE EN BLOQUES DISTINTOS.**
- MAP-PADS-[NN] solo estética y claridad de pads; no mover ubicaciones/IDs sin permiso.
- MAP-ENV-[NN] solo agua, cascadas justificadas, niebla, hojas, viento, nieve, magma, luces; tier de partículas reducido móvil y rendimiento.
- Garantizar que vallas, puentes, árboles y ríos no invaden senderos o pads: screenshots con overlays de ruta y hitbox donde sea viable.

**ETAPA 4 — INTEGRACIÓN DE ARTE CARTOON 2D PREMIUM EXTERNO, POR PACK.**
- Colaboradores artísticos externos entregan mockups CARTOON 2D PREMIUM V1 de 5 torres I–IV/variantes, aliados/enemigos, jefes, operadores y VFX; deben alinearse al mismo canon visual que M01 y someterse a aprobación del Director. No código ni merges externos.
- Codex recibe cada pack tras APROBACIÓN HUMANA, valida licencias y originalidad, tamaños, orientación 3/4, transparencias, anclajes, manifest/atlases y escala móvil. Una integración por bloque: TORRES → ACTORES → VFX (o ajustar por dependencias explícitas). Mientras tanto, torres/enemigos actuales operan provisionalmente sin que paisaje rework modifique sus mecánicas.
- Efectos se sincronizan con eventos existentes; una fuente de arma, proyectil y daño.

**ETAPA 5 — GAMEPLAY Y CAMPAÑA POR COMPONENTE.**
- Bloques independientes para pads funcionales, oleadas según datos, catálogos de enemigos, stats, combate, selección de objetivos, torres faltantes/ramas IV, jefes y balance.
- Portar M04–M10 funcionalmente por mapa y por subsistema, preservando tres slots jefe y 140 olas objetivo. No desplegar como completados los mapas solo visuales.
- Core mantiene oro, HP, fugas, daño, cooldown, estrellas y saves. Compatibilidad de partidas existentes.

**ETAPA 6 — FINAL DE EXPERIENCIA Y PRODUCCIÓN EN CANON CARTOON.**
- Interfaz final, menú, progreso, tarjetas, iconos y accesibilidad móvil por pantalla, todos alineados al canon Cartoon 2D Premium V1.
- Audio/SFX y música originales por paquete (con opciones mute/volumen).
- Tutorial y onboarding después de sistemas finales.
- QA de campaña 140 oleadas y dificultades, pruebas físicas Android/iPhone, FPS/memoria, perf tier, licencia/atribuciones, marketing y release comercial; seguir haciendo QA mínimo desde el primer bloque, no dejar seguridad para el final.

### C. OPTIMIZACIÓN DEL FLUJO DE CODEX
- Cada prompt TXT: identificador, objetivo único, entrada visual aprobada, rama/HEAD, rutas permitidas, exclusiones explícitas, criterios verificables y cierre de QA con URL oficial cuando esté publicada.
- Leer AGENTS y roadmap UNA VEZ al comenzar la nueva sesión o cuando cambien. En iteraciones del mismo bloque usar SHA y diff anteriores; no hacer auditoría global completa reiteradamente. Auditar dependencias puntuales.
- Sol/Medium del usuario es suficiente por defecto. Escalar pensamiento/modelo solo cuando realmente bloquee código o una regresión persistente. No atribuir mejor imagen pictórica al razonamiento sin assets adecuados.
- Reutilizar sistema de caminos/pads y recursos artísticos; evitar peticiones "rehaz todo", generación arbitraria de assets o cambios colaterales. Cada pack nuevo de M01–M10, torres, enemigos, soldados, VFX o HUD debe validarse contra el canon Cartoon 2D Premium V1.
- QA proporcional real: 1–3 captures relevantes por iteración, smoke render en PC + viewport horizontal y regresión necesaria; CI/Render al integrar. No sustituir pruebas por declaraciones.
- Cada etapa genera feedback del Director y actualiza este roadmap; no avanzar al siguiente subsistema automáticamente.
- El presupuesto de Codex se seguirá por tarea con observación aproximada de esfuerzo/cuota, sin inventar tokenización exacta ni sacrificar gates críticos.

### D. FUENTES DE VERDAD Y ESTADOS
- Identidad visual VIGENTE: último mockup M01 más cartoon aprobado por el Director el 23/10/2026; describir según ESTILO_VISUAL_CANON_CARTOON_2D_PREMIUM_V1.md. El archivo gráfico está en conversación, no necesariamente en el repo; exigir adjunto al Codex para comparativa. M03 queda como arte histórico.
- Runtime, CI, producción: GitHub actual y Render; M03 en roadmap dice 188 nodos, 8 pads, 9 olas/101 enemigos. Verificar última rama/commit en cada tarea.
- Mapa 01 y 02: referencias funcionales protegidas, **diseño de paisaje antiguo ahora sometido a rework artístico autorizado**. La vieja frase "no rediseñar M02" no impide este trabajo expresamente ordenado.
- Todos los cambios DOCUMENTALES de este plan son directrices futuras, NO código reprogramado ni nuevos escenarios jugables.

### Orden posterior del Director — M04-GAME-01 (23/10/2026)

Excepción expresa al orden MAPA-ARTE: habilitar funcionalmente M04 con infraestructura M02/M03, sin rediseño. El arte HF1 está aprobado y congelado; cualquier cambio artístico futuro requiere otra orden. Normal es el único modo auditado por este bloque; récord M04 aislado por mapa/modo. No adelantar M05. Estado final y publicación verificable en el acta/PR de M04-GAME-01.

### Orden posterior de Dirección — M06-GAME-01 (27/10/2026)

Port Normal M06 con arte v3 congelado, dos rutas canónicas, nueve pads, 15 oleadas125 enemigos (69/56), sin jefe. Implementación y QA focalizado en `docs/blocks/m06-game01/ACTA.md`; CI y promoción a LIVE se acreditan en el PR del bloque. No se adelanta M07 ni otra dificultad. Actores nuevos provisionales con mecánicas canónicas; no representa aprobación definitiva de balance o sprites.

### Orden de Dirección — MAP-ART-07-CARTOON-V1 (27/10/2026)

Paso de la Escarcha: arte/preview estático exclusivamente,542puntos/9pads congelados; sin selector ni campaña M07. Fuentes, QA y puerta de valoración humana en `docs/blocks/m07-art-cartoon-v1/ACTA.md`. No adelantar MAP-ENV-07 ni M07-GAME-01. M06-GAME-01 ya publicado mediante PR78/merge8e3f2ec, preservado en este bloque.

### Dirección 27/10/2026 — M07 HOTFIX FIDELIDAD

La primera entrega M07 fue rechazada por simplificación artística. Orden: recuperar riqueza visual del mockup, no sustituirla por criterio propio. Norma permanente de alta fidelidad en AGENTS.md y referencia cruzada en el canon. Arte M07 v2 y QA/antes-después en `docs/blocks/m07-fidelity-hotfix/ACTA.md`; gameplay M07 continúa fuera de alcance.

### Dirección 27/10/2026 — M07-GAME-01 autorizado

Dirección ordena preservar el arte M07 `m07-hf-mockup-fidelity-v2` (PR80/81) y habilitar Normal: 17 oleadas, 140 enemigos, rutas 61/79, 542 puntos y nueve pads. Excepción posterior expresa: daño Francotirador ×1,35 únicamente en M07 Normal. No cambia el balance de M01–M06 ni el arte aprobado. Estado, evidencia y publicación real en `docs/blocks/m07-game01/ACTA.md`; no adelantar M08.
