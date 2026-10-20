# TORRES T08 — Matriz de continuidad C1-C / T04 vs T07 y T08

**Ancla real:** captura del usuario 1280×768, SHA256 `24103e45a0e1249fa4b89d4e65ea16d9e147bdf1e2462e5c4063469a931842ef`. Se observa mapa verde vivo, camino arena, dos cuarteles bajos azules, dos miradores con madera y operador humano visible. Los sprites concretos de niveles son confirmados en **código histórico**; la captura por sí sola NO identifica el nivel de cada uno.

**Hecho de código C1-C:** `TOWER_ART_V2.forEach((meta,i)...)`, `routeModels=[1,3,4,5]`, de modo que Infantería I ocupa índice 1, Infantería II índice 3, Sniper I índice 4 y Sniper II índice 5. Fuente M03 y P03 para otros elementos. El screenshot histórico es muestra artística, no combate validado.

| Componente | T04 visible/aprobado | T07 divergente | Correctivo T08 | Veredicto de fuente | Comprobación pendiente |

|---|---|---|---|---|---|

| Cuartel I | Techo azul pizarra, volumen bajo, base escalonada piedra | estética T05 más geométrica | master T04 recuperado byte a byte (.296) | [MANTIENE] EXACTO en SVG | render C1D4 y reclutas P07 |

| Cuartel II | Misma arquitectura compacta con mejoras discretas (.308) | hereda construcción T05 | master T04 recuperado byte a byte | [MANTIENE] EXACTO en SVG | cambio I→II real sin salto |

| Sniper I | Deck alto abierto, madera ocre, escalera, P03 expuesto (.312) | refuerzos ópticos/rework T06/T07 no autorizado | master T04 recuperado, soporte sin rifle + rifle T separados | [MANTIENE] MASTER; [PENDIENTE] split/P07 | poses y rail a escala real |

| Sniper II | Vigía alto reforzado y operador expuesto (.319) | bastidor/mecha y torreta futurista alternativos | master T04 recuperado, II misma línea que I | [MANTIENE] MASTER; [PENDIENTE] split/P07 | lectura de upgrade y proporción |

| Core proyectiles | C1-C era solo revisión visual | T07 agrega FX read-only/bulletId | VFX T07 CONSERVADOS, hit sólo ante core | [MEJORA TÉCNICA ESTÁTICA] | prueba `hit_applied` real en C1D4 |

| T07 concepto B | no figura en captura aprobada | contrapeso/techumbre divergente | conservado como histórico inactivo | [DESCARTADO COMO CANON] | dirección podría estudiar sólo con permiso |

| P07 operador | P03 visible en captura original | P06/P07 una arma, rig cambiante | sólo contrato `sniper_operator_unarmed` | [PENDIENTE] | contacto manos, mirada, rifle, baranda |

## Escalas previstas sin alterar colliders

Phaser Scale.FIT 1280×768 en viewport 844×390 da factor matemático ~.5078; imagen Sniper I alto 131.04wu ≈66.5 píxeles, II 133.98wu ≈68.0. En 932×430, I ≈73.4 y II ≈75.0 píxeles. **Estimaciones matemáticas no medidas en navegador**. Ni tamaño de clic ni radio de socket se modifican.

## Dos debilidades verificables / un riesgo cruzado

1. [CONFIRMADO EN FUENTE] Master visual histórico es idéntico, pero el reparto de SVG entre rifle/estructura cambia z-order respecto del PNG histórico; solo un render P07 real puede comprobar su equivalencia final. 2. [CONFIRMADO] FrontRail histórico de cuarteles no era un objeto separado; T08 declara frontal transparente para no crear un parapeto nuevo. [RIESGO CRUZADO] Mano/culata de P07 todavía pueden no coincidir; ningún atlas P07 fue tocado.

**Corrección priorizada:** DG montaje real P07/CORE/M03 y capturas con idéntica cámara, seguida de microajuste solamente de anclajes/pivote T o RFC a P07.
