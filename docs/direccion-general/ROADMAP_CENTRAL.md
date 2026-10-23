# SEMANTROPIC TD — Roadmap central del equipo único

Este es el único roadmap operativo. Lo mantiene el equipo central integral de Codex bajo la Dirección General del usuario. Los roadmaps, ramas y actas anteriores permanecen como historia y evidencia; no activan trabajos paralelos ni autorizan reimplementar sistemas. La instrucción expresa más reciente del Director y `AGENTS.md` rigen cada bloque.

## Objetivo y continuidad

Terminar un Tower Defense comercial premium, original, tácticamente profundo y mobile-first horizontal, con Phaser 4.2.1/WebGL2. DECISIÓN ACTUAL 23/10/2026: M03 Bosque de los Susurros es la REFERENCIA DE CALIDAD VISUAL para todos los mapas; autorizar rework artístico de M01/M02 y futuros entornos, sin tocar mecánicas por inercia. Preservar la identidad C1-C y las aprobaciones posteriores, la legibilidad táctica, el CORE autoritativo y los contratos. Kingdom Rush/Ironhide es referente de calidad, sin copiar propiedad intelectual. Monetización final pendiente de decisión.

Rama de publicación: `production/semantropic-td-live`.

URL jugable única: https://semantropic-td-jugar.onrender.com/official/src/live/

Último cambio jugable verificado al adoptar esta metodología: **M01 R7 HF3**, SHA `5388a490f808bac4cfd47e02ae6739f923caa5cc`, [CI 39890530324 SUCCESS](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39890530324). Esta es una referencia de contenido jugable, no un HEAD perpetuo: comprobar la rama real antes de cada tarea.

## Estado y secuencia por bloques

| Bloque central | Estado real | Siguiente criterio de cierre |
|---|---|---|
| Metodología y documentación | [APROBADO POR DIRECCIÓN] equipo único; adopción documental en este bloque | AGENTS, política y trazabilidad coherentes; conservar ramas históricas |
| M01 vertical slice premium | [CONFIRMADO EN CÓDIGO] R7 HF3 publicado; 133 nodos, 8 pads, 5 oleadas/63 enemigos, Infantería y Sniper I/II; QA técnico PASS | [PENDIENTE] valoración artística final y playfeel del Director, dispositivos físicos/FPS. Rework solo del paisaje AUTORIZADO; no rehacer gameplay HF3 |
| M02 Campos del Molino | [CONFIRMADO EN CÓDIGO] R6, selector, 163 nodos, 8 pads, 7 oleadas/80 enemigos; [BASE JUGABLE] mecánicas R6 preservadas, arte antiguo a renovar por orden 23/10 | Rework pictórico del escenario hacia estándar M03 con identidad agrícola propia. Sin cambiar 7 olas/80 enemigos, pads ni geometría |
| Cinco familias de torres | [PENDIENTE] completar Guardiana/Bombardera/Control y niveles III/IV, especializaciones y habilidades; solo dos familias I/II construibles hoy | Subbloques autorizados con arte, mecánicas, eventos y QA reales; no implementar todo el catálogo de una vez |
| Enemigos y jefes | [CONFIRMADO EN CÓDIGO] warrior/hound en M01; M02 añade archer/shieldbearer; M03 añade foreststalker/hunter/bat según campaña. [PENDIENTE] paridad progresiva y jefes | IA, telegraphs, animaciones, estados y combate verificables por cada incorporación |
| M03 Bosque de los Susurros | [CONFIRMADO EN CÓDIGO] port Normal: 188 nodos, 8 pads, 9 oleadas/101 enemigos, siete tipos; roble, bosque y ambiente originales. Acta: `docs/blocks/m03/IMPLEMENTACION.md` | QA local navegador y regresiones PASS; CI y entrega LIVE trazadas en [PR #52](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/52). M03 DESIGNADO COMO REFERENTE DE CALIDAD PICTÓRICA 23/10; evaluación de jugabilidad/QA físico sigue pendiente |
| M04 Río de los Antiguos | [ARTE B04 / HF1] HF1 sustituye las capas superpuestas por una pintura estructural integrada y registrada sobre262 nodos, nueve posiciones y dos puentes. Acta `docs/blocks/m04-hf1/ACTA.md`; vista artística sin gameplay, CI/publicación en PR | [PENDIENTE] aprobación estética y bloques jugables separados. Once olas/94 enemigos solo en datos; selector M04 cerrado |
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

## NUEVO MANDATO ESTRATÉGICO DEL DIRECTOR — 23-OCT-2026

**Estado:** [APROBADO POR DIRECCIÓN] rework artístico general de la CAMPAÑA, sin reprogramación general del core. Las capturas provistas comparan M01 (pradera plana), M02 (campo/molino plano) y M03 (Bosque de los Susurros con tratamiento pictórico). **M03 es el norte cualitativo**, no una plantilla literal de bosque; todos los mapas deben presentar similar riqueza visual, materialidad, composición, profundidad e iluminación original sin perder legibilidad móvil.

**Objetivo de consumo Codex:** Sol con razonamiento Intermedio elegido por el usuario; minimizar alcance por prompt, no acumular sistemas. No prometer ahorros exactos: medir uso por bloques y ajustar método. Una tarea no permite otras tareas "aprovechando que estamos aquí". Equipo único Codex implementa TODO el código; colaboradores externos preparan **solo mockups/pack de diseño de torres, personajes, aliados, enemigos y VFX** fuera del repositorio, que se integrarán tras aprobación. No reactivar antiguo esquema de tres equipos que programan en ramas paralelas.

### A. MATRIZ DE ALCANCE POR TIPO DE BLOQUE

| Código | ÚNICO resultado esperado | NO hacer en el mismo bloque |
|---|---|---|
| B00 AUDITORÍA DE ESTILO | Inventario visual+runtime M01/M02/M03, screenshot baseline, SHA, rutas/archivos y presupuesto | No reescribir ni redecorar |
| MAP-ART-[NN] | Un mapa con escenario pintado premium: terrenos, bioma, árboles, rocas, fachada, agua, camino VISUAL con puntos existentes | No pads reales, oleadas, enemigos, oro, torre, combate, resultados, HUD |
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
- Adoptar AGENTS.md y este roadmap; guardar referencia M03 del 23/10 aportada por el Director y tres capturas del mismo turno. Conservar capturas y evidencias existentes; no inventar PNG en repositorio.
- Auditar una vez el renderer: capas, modelo de escenario y dependencia entre terreno/camino/pads de M01–M03, que permita trabajo artístico limitado sin modificar core.
- Separar lo aprobado, entregado y jugable; registrar SHA actual para evitar auditorías repetidas.

**ETAPA 1 — ALINEACIÓN ARTÍSTICA DE LOS TRES PRIMEROS MAPAS (PRIORIDAD INMEDIATA).**
- B01: MAP-ART-01, Praderas del Amanecer. [IMPLEMENTADO / QA LOCAL PASS] paisaje B01 en rama `feature/b01-m01-pictoric-meadow`; CI, publicación y aceptación artística se trazan en el PR. Acta: `docs/blocks/b01/ENTREGA.md`. Paisaje natural premium al estándar M03: praderas con profundidad, sendero ilustrado, rocas y árboles expresivos, horizonte, sombras/luz. Conservar 133 nodos, 8 pads, 5 olas/63 enemigos, 365 oro y core estable. No copiar el bosque M03 ni añadir sistemas.
- B02: MAP-ART-02, Campos del Molino. Paisaje rural premium: campos de cultivo volumétricos ilustrados, molino, granjas, acequias/puentes justificados, camino táctico, luz de pradera; conservar 163 nodos, 8 pads, 7 olas/80 enemigos, 395 oro. NO gameplay.
- B03: Auditoría corta de M03 (ya funcional con 9 olas/101 enemigos según acta), referencias/defectos visuales pendientes y protección. No rework M03 por rutina.
- Cada MAP-ART se cierra con captures antes/después mismo zoom, QA render PC/móvil, rutas intactas, aprobación del Director y enlace LIVE tras promoción válida.

**ETAPA 2 — PAISAJES M04–M10 EN MICROBLOQUES VISUALES.**
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

**ETAPA 4 — INTEGRACIÓN DE ARTE EXTERNO, POR PACK.**
- Subcontratos creativos externos entregan: mockups de 5 torres, I–IV y variantes; personajes aliados/enemigos, jefes, operadores; VFX de combate. No código ni merges externos.
- Codex recibe cada pack tras APROBACIÓN HUMANA, valida licencias y originalidad, tamaños, orientación 3/4, transparencias, anclajes, manifest/atlases y escala móvil. Una integración por bloque: TORRES → ACTORES → VFX (o ajustar por dependencias explícitas). Mientras tanto, torres/enemigos actuales operan provisionalmente sin que paisaje rework modifique sus mecánicas.
- Efectos se sincronizan con eventos existentes; una fuente de arma, proyectil y daño.

**ETAPA 5 — GAMEPLAY Y CAMPAÑA POR COMPONENTE.**
- Bloques independientes para pads funcionales, oleadas según datos, catálogos de enemigos, stats, combate, selección de objetivos, torres faltantes/ramas IV, jefes y balance.
- Portar M04–M10 funcionalmente por mapa y por subsistema, preservando tres slots jefe y 140 olas objetivo. No desplegar como completados los mapas solo visuales.
- Core mantiene oro, HP, fugas, daño, cooldown, estrellas y saves. Compatibilidad de partidas existentes.

**ETAPA 6 — FINAL DE EXPERIENCIA Y PRODUCCIÓN.**
- Interfaz final, menú, progreso y accesibilidad móvil por pantalla.
- Audio/SFX y música originales por paquete (con opciones mute/volumen).
- Tutorial y onboarding después de sistemas finales.
- QA de campaña 140 oleadas y dificultades, pruebas físicas Android/iPhone, FPS/memoria, perf tier, licencia/atribuciones, marketing y release comercial; seguir haciendo QA mínimo desde el primer bloque, no dejar seguridad para el final.

### C. OPTIMIZACIÓN DEL FLUJO DE CODEX
- Cada prompt TXT: identificador, objetivo único, entrada visual aprobada, rama/HEAD, rutas permitidas, exclusiones explícitas, criterios verificables y cierre de QA con URL oficial cuando esté publicada.
- Leer AGENTS y roadmap UNA VEZ al comenzar la nueva sesión o cuando cambien. En iteraciones del mismo bloque usar SHA y diff anteriores; no hacer auditoría global completa reiteradamente. Auditar dependencias puntuales.
- Sol/Medium del usuario es suficiente por defecto. Escalar pensamiento/modelo solo cuando realmente bloquee código o una regresión persistente. No atribuir mejor imagen pictórica al razonamiento sin assets adecuados.
- Reutilizar sistema de caminos/pads y recursos artísticos; evitar peticiones "rehaz todo", generación arbitraria de assets o cambios colaterales.
- QA proporcional real: 1–3 captures relevantes por iteración, smoke render en PC + viewport horizontal y regresión necesaria; CI/Render al integrar. No sustituir pruebas por declaraciones.
- Cada etapa genera feedback del Director y actualiza este roadmap; no avanzar al siguiente subsistema automáticamente.
- El presupuesto de Codex se seguirá por tarea con observación aproximada de esfuerzo/cuota, sin inventar tokenización exacta ni sacrificar gates críticos.

### D. FUENTES DE VERDAD Y ESTADOS
- Identidad visual nueva: captura M03 enviada por el Director el 23/10/2026 (fuera del repo hasta que Codex la incorpore expresamente). M01/M02 capturas antiguas suministradas en el mismo mensaje para contraste.
- Runtime, CI, producción: GitHub actual y Render; M03 en roadmap dice 188 nodos, 8 pads, 9 olas/101 enemigos. Verificar última rama/commit en cada tarea.
- Mapa 01 y 02: referencias funcionales protegidas, **diseño de paisaje antiguo ahora sometido a rework artístico autorizado**. La vieja frase "no rediseñar M02" no impide este trabajo expresamente ordenado.
- Todos los cambios DOCUMENTALES de este plan son directrices futuras, NO código reprogramado ni nuevos escenarios jugables.
