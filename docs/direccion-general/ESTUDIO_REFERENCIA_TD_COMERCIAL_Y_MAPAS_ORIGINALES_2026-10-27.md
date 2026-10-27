# Estudio de referencia TD comercial y mapas originales — 27/10/2026

[DOCUMENTAL SIN RUNTIME]. Síntesis del informe aportado por Dirección `01_INFORME_TECNICO_ARTISTICO_KRV_A_SEMANTROPIC.md` y su solicitud de integración. Los hallazgos del APK y las declaraciones públicas se atribuyen a ese informe: en este bloque no se recibieron ni analizaron APK, bibliotecas nativas, atlas o audio, ni se verificaron de nuevo las fuentes externas. No es una certificación de Kingdom Rush Vengeance oficial ni del runtime de SEMANTROPIC.

## Precedencia y estado comprobado

Base documental consultada: `8a8a3c44d976acc9a81ff8a74da5083da572ff1a`, rama de producción `production/semantropic-td-live`, coincidente con HEAD local al iniciar. El checkout `feat/m07-game01` contiene trabajo previo sin publicar: esta incorporación lo conserva y lo excluye de su commit documental. No se afirma una nueva publicación de Render.

Rigen [AGENTS.md](../../AGENTS.md), el [roadmap](ROADMAP_CENTRAL.md), el [canon Cartoon 2D Premium V1](ESTILO_VISUAL_CANON_CARTOON_2D_PREMIUM_V1.md), los [contratos v1](../contracts/v1/README.md) y la [política de publicación](../integration/RELEASE_CHANNEL_POLICY.md). El estudio complementa esas fuentes. Phaser 4.2.1/WebGL2 y la identidad original de defensa terrestre frente a invasión alienígena, con militares y tecnología estilizados, permanecen vigentes.

Ya estaban cubiertos en AGENTS: originalidad, equipo único, autoridad del CORE, modularidad, geometría protegida, fidelidad, bloques pequeños y QA PC/móvil. Se añade un procedimiento de diseño verificable, coherencia topográfica y criterios de auditoría de balance, oleadas y presentación; no se duplican contratos técnicos.

## Hallazgos atribuidos al informe y sus límites

El informe describe dos APK modificados: mod Junkworld v2.3 y una variante balanceada. No son código fuente oficial. Declara 3.888 archivos en la variante: 2.231 PLIST, 303 PNG, 1.134 OGG y 42 MP3; 54 archivos de datos de nivel y 57 archivos por modo Campaign/Heroic/Iron. Hay niveles auxiliares o modificados: estas cifras no representan 54 niveles oficiales ni objetivos de contenido para SEMANTROPIC.

Según el informe, nivel/geometría/pads/objetos y metadatos están separados de oleadas, subgrupos, apariciones e intervalos de cada modo. Los atlas inspeccionados de niveles 1/4/12/19/32/36 contienen segmentos de paisaje, props y capas ambientales; esa muestra respalda una composición modular, sin demostrar cómo funciona cada escenario. Las observaciones de molino/vida rural, agua, costa/banderas y arena/público permiten deducir variedad ambiental, no reproducir esas escenas.

El informe registra dos campañas con errores de parseo PLIST y recuentos de aparición desproporcionados en el mod; describe cuatro rutas de contenido cambiadas entre variantes, además de firmas. No acredita equilibrio oficial, seguridad del APK, ingeniería inversa integral del código nativo ni pruebas completas en dispositivos. Las cantidades de archivos de animación no equivalen a cantidades de personajes.

Las declaraciones públicas citadas sobre idea → concepto → geometría → playtest → arte final, edición artesanal de oleadas y herramientas Adobe Animate/Cocos2d-x se mantienen como referencias atribuidas. No motivan migrar de motor ni importar código, gráficos, audio, fuentes, UI, personajes o composiciones reconocibles de terceros.

## Procedimiento para mapas originales

1. Definir propósito narrativo, amenaza y decisiones tácticas del nivel. Para mapas existentes, partir del diseño aprobado; una auditoría no autoriza rehacerlo.
2. Verificar geometría y contratos bloqueados: rutas, entradas/salidas, pads, hitboxes, paso de soldados y cámaras. Nuevas geometrías requieren su autorización y playtest propios.
3. Concebir grandes masas, topografía y volumen en perspectiva 3/4; fijar jerarquía entre camino, plataformas y decoración, con materiales y sombras continuos.
4. Usar un mockup original aprobado y conservar su riqueza, densidad y profundidad. Cartoon por masas no significa empobrecer el diseño. El mockup no se utiliza como imagen monolítica del nivel.
5. Componer suelo → caras de relieve → camino sobre los mismos nodos → pads integrados → objetos anclados → torres/unidades → oclusión → VFX ambientales separados → HUD. Es un orden conceptual, no una nueva API ni un valor z universal: aplicar los contratos vigentes de sockets, footAnchor y capas.
6. Comprobar el encaje: no ocultar ruta, pads ni controles; puentes con apoyos y tránsito coherentes, cascadas con nacimiento, desnivel y desembocadura; evitar props flotantes y falsas zonas jugables.
7. En un bloque de ambiente autorizado, medir presupuesto GPU y usar pooling, atlas, caché y LOD sin reducir unilateralmente el mockup aprobado. Cada bioma conserva geografía, materiales, relato y efectos propios.
8. Comparar baseline y resultado al mismo encuadre PC/móvil horizontal, con pruebas de hitboxes, interfaz, capas y rendimiento real. La emulación no acredita dispositivos físicos; la aceptación artística corresponde a Dirección.

La campaña objetivo conserva M01 Praderas del Amanecer, M02 Campos del Molino, M03 Bosque de los Susurros, M04 Río de los Antiguos, M05 Pantano de la Niebla, M06 Desfiladero de Hierro, M07 Paso de la Escarcha, M08 Ruinas del Imperio Perdido, M09 Corazón del Volcán y M10 Fortaleza del Eclipse. Distribución canónica: 5/7/9/11/13/15/17/19/21/23 = 140 oleadas; jefes M05/W13, M08/W19 y M10/W23. Especificación no equivale a implementación certificada.

Las ideas del informe para praderas, cultivos, bosque, río, pantano, cañón, nieve, ruinas, volcán y fortaleza son propuestas futuras. No sustituyen mockups aprobados ni autorizan geometrías nuevas. Se protegen, entre otros contratos, M01 133 nodos/8 pads, M02 163/8, M03 188/8, M04 nueve pads/dos puentes y M07 542 nodos/nueve pads. Este bloque no vuelve a certificar esas geometrías.

## Criterios para auditorías posteriores

| Área | Criterio y evidencia exigible en su bloque autorizado |
|---|---|
| Balance | DPS teórico/efectivo, TTK, overkill, tiempo atacando, cooldown, rango, resistencias, escudos, bloqueo, AoE, upgrades, costo por función y oro obtenido/gastado. Runs reproducibles con configuración y dificultad registradas; cifras propias, nunca del mod. |
| Oleadas | Subgrupos, secuenciación, mezcla de arquetipos, telegraphs, pausas y desafíos. Auditar las 140 olas contra rutas, intervalos, slots de jefe, recompensas y ausencia de bloqueos; no reescribir campaña por este estudio. |
| Actores/jefes | Silueta propia, rig/pivote/footAnchor, sprites e hitboxes coherentes, estados y anticipación; daño resuelto por CORE y QA específico de los tres encuentros cuando estén implementados. |
| VFX | Anticipación → disparo desde muzzle real → trayectoria → impacto → residuo. Consumir una vez los identificadores autoritativos existentes; pooling y sincronía audiovisual. Separar ambiente de combate. |
| UI/UX | Mobile-first horizontal: camino/pads legibles, menú contextual, cancelación clara, contraste, accesibilidad, safe areas y controles táctiles comprobados. |
| Audio | Recursos propios o licenciados, diferenciados por ambiente, disparo, impacto, UI y música; mezcla y sincronía verificadas. No incorporar ficheros de la referencia. |
| Datos y progreso | Contratos versionados de nivel, torres, unidades, estado, oleadas y metaprogresión; guardados con migración explícita. Auditar interfaces existentes antes de proponer nuevas. |
| QA | Baseline frente a resultado, pruebas automatizadas pertinentes, evidencia visual auténtica y memoria/drawcalls/FPS medidos en el entorno objetivo. PASS/FAIL/NOT_RUN explícitos. |

Las cinco familias siguen siendo Infantería, Francotiradores, Guardiana, Bombardera y Torre de Control. Los nombres ilustrativos `AttackSpec`, `TargetPolicy` o `projectileSpawned` del informe son propuestas, no contratos implementados: respetar el bus real y [COMBAT_EVENTS_CONTRACT](../contracts/v1/COMBAT_EVENTS_CONTRACT.md). El CORE conserva autoridad única sobre daños, recursos, resultados y progreso.

## Conflictos y lectura histórica

- Las menciones a tres equipos o integración C0 en contratos antiguos están superadas organizativamente por AGENTS y la nota de [OWNERSHIP_AND_WORKFLOW](../contracts/v1/OWNERSHIP_AND_WORKFLOW.md). Subsisten las separaciones técnicas, no tres flujos de desarrollo.
- El canon M03 pictórico es histórico; prevalecen Cartoon 2D Premium V1 (23/10) y alta fidelidad (27/10). «Geometría primero» no permite desplazar rutas existentes ni reducir arte aprobado.
- La investigación del APK no certifica el código actual. Las sugerencias para diez mapas no implican diez reworks autorizados ni 140 olas probadas.
- M07 tiene autorización previa específica para jugabilidad y Francotirador ×1,35 solo en Normal. Este estudio no la revoca ni cambia su estado de QA/publicación, pendiente de cierre por separado.
- No se detecta conflicto nuevo con identidad o contratos vigentes aplicando estas precedencias. No se adopta estética medieval ajena como identidad del proyecto.

## Entrega documental, QA y siguiente paso

Alcance de esta integración: este documento, una sección breve añadida a AGENTS y una línea de estudio/propuesta en el roadmap. Mantener íntegro el texto previo y excluir del commit los cambios M07 ya existentes. Validar diff, enlaces locales y alcance de archivos; no añadir assets ni ejecutables. Runtime, gráficos, navegador y móvil: **NOT_RUN para este bloque documental**. Las pruebas previas de M07 pertenecen a su bloque independiente.

Entrega por rama/PR documental; no realizar merge o despliegue por esta orden. Rollback: revertir únicamente el commit documental. Siguiente bloque sugerido, pendiente de autorización: **AUDIT-MAP-ARCH**, inventario de renderers, rutas, pads, atlas y dependencias con capturas reales, sin rework. No iniciar esa auditoría ni adelantar M08 como efecto de este documento.

## Referencias externas citadas por el informe (no revalidadas aquí)

- [Ironhide, herramientas y método de mapas, entrevista de 2018](https://app2top.com/interview/ironhide-we-will-be-working-on-the-kingdom-rush-series-while-our-fans-are-playing-it-132608.html).
- [Producto Kingdom Rush Vengeance](https://www.ironhidegames.com/Games/kingdom-rush-vengeance).
- [Entrevista sobre diseño de oleadas](https://www.enter.co/cultura-digital/videojuegos/la-ciencia-y-el-arte-detras-de-un-buen-tower-defense-entrevista/).
- [Nota de Ironhide sobre progresión citada como 24/07/2026](https://www.ironhidegames.com/News/Details/502).
- [Phaser Paths](https://docs.phaser.io/api-documentation/class/curves-path) y [animaciones](https://docs.phaser.io/phaser/concepts/animations): verificar compatibilidad con la versión instalada antes de implementar.
