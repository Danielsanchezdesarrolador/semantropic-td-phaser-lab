# SEMANTROPIC TD — Roadmap central del equipo único

Este es el único roadmap operativo. Lo mantiene el equipo central integral de Codex bajo la Dirección General del usuario. Los roadmaps, ramas y actas anteriores permanecen como historia y evidencia; no activan trabajos paralelos ni autorizan reimplementar sistemas. La instrucción expresa más reciente del Director y `AGENTS.md` rigen cada bloque.

## Objetivo y continuidad

Terminar un Tower Defense comercial premium, original, tácticamente profundo y mobile-first horizontal, con Phaser 4.2.1/WebGL2. Preservar la identidad C1-C y las aprobaciones posteriores, la legibilidad táctica, el CORE autoritativo y los contratos. Kingdom Rush/Ironhide es referente de calidad, sin copiar propiedad intelectual. Monetización final pendiente de decisión.

Rama de publicación: `production/semantropic-td-live`.

URL jugable única: https://semantropic-td-jugar.onrender.com/official/src/live/

Último cambio jugable verificado al adoptar esta metodología: **M01 R7 HF3**, SHA `5388a490f808bac4cfd47e02ae6739f923caa5cc`, [CI 39890530324 SUCCESS](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39890530324). Esta es una referencia de contenido jugable, no un HEAD perpetuo: comprobar la rama real antes de cada tarea.

## Estado y secuencia por bloques

| Bloque central | Estado real | Siguiente criterio de cierre |
|---|---|---|
| Metodología y documentación | [APROBADO POR DIRECCIÓN] equipo único; adopción documental en este bloque | AGENTS, política y trazabilidad coherentes; conservar ramas históricas |
| M01 vertical slice premium | [CONFIRMADO EN CÓDIGO] R7 HF3 publicado; 133 nodos, 8 pads, 5 oleadas/63 enemigos, Infantería y Sniper I/II; QA técnico PASS | [PENDIENTE] valoración artística final y playfeel del Director, dispositivos físicos/FPS. No rehacer HF3 sin defecto observado |
| M02 Campos del Molino | [CONFIRMADO EN CÓDIGO] R6, selector, 163 nodos, 8 pads, 7 oleadas/80 enemigos; [APROBADO POR DIRECCIÓN] arte según transferencia | Mantener regresiones; balance humano y rendimiento físico según evidencia. No rediseñar el mapa aprobado |
| Cinco familias de torres | [PENDIENTE] completar Guardiana/Bombardera/Control y niveles III/IV, especializaciones y habilidades; solo dos familias I/II construibles hoy | Subbloques autorizados con arte, mecánicas, eventos y QA reales; no implementar todo el catálogo de una vez |
| Enemigos y jefes | [CONFIRMADO EN CÓDIGO] warrior/hound en M01; M02 añade archer/shieldbearer; M03 añade foreststalker/hunter/bat según campaña. [PENDIENTE] paridad progresiva y jefes | IA, telegraphs, animaciones, estados y combate verificables por cada incorporación |
| M03 Bosque de los Susurros | [CONFIRMADO EN CÓDIGO] port Normal: 188 nodos, 8 pads, 9 oleadas/101 enemigos, siete tipos; roble, bosque y ambiente originales. Acta: `docs/blocks/m03/IMPLEMENTACION.md` | Cerrar QA navegador y regresiones, promoción y comprobación LIVE; aprobación artística del Director y móviles físicos pendientes |
| Campaña M04–M05 | [HISTÓRICO CANVAS / DATOS] diseños y 11/13 oleadas; slot jefe M05/W13 | Port por mapa solo tras orden específica, con rutas/pads canónicos, progresión, QA y aprobación visual |
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
