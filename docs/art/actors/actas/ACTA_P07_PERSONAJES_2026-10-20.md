# ACTA OFICIAL — PERSONAJES P07 · CONTINUIDAD VISUAL C1-C
**Proyecto:** SEMANTROPIC TD · **Fecha:** 20-10-2026 · **Motor:** Phaser 4.2.1 / WebGL2
**Rama:** \`feature/art-p07-continuidad-c1c\` · **Base exacta:** \`a5116db1f956f8b32b86570600b878ba9d5187ed\` (P06 PR #27)
**PR:** [#32 DRAFT](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/32) contra \`feature/art-p06-animated-actors\`, no autorización de merge/deploy.
**Estado:** [4 PNG RGBA REALES EN GIT] · [CONTINUIDAD P03 EN FUENTE] · [NO APROBADO ARTÍSTICAMENTE]
**SHA final:** consultar PR P07 Commits (esta acta e INDEX generan nuevos commits).

## 1. Referencias y diferenciación de baselines
La **captura visual aprobada C1-C** se recibió físicamente en esta conversación y se verificó por \`sha256sum\` (1280×768 RGB PNG), SHA256 \`24103e45a0e1249fa4b89d4e65ea16d9e147bdf1e2462e5c4063469a931842ef\`. Representa M03+T04+P03 y un **showroom solo visual**, no combate.
El **baseline funcional protegido** sigue C1-D4, PR #28, \`integration/c1d4-first-playable-m01\`, con mejoras M07 y T08 desarrollándose en ramas independientes. P07 no revierte funcionalidad ni migra datos/guardados.

## 2. Auditoría del error P06 y decisión correctiva
P06 sí exportó cuatro PNG auténticos y aportó la variante sin rifle, pero su generador pintó anatomías geométricas nuevas desde cero y **no se había aprobado** como continuidad pictórica. Para impedir retroceso se descartó ese dibujador para la identidad P07; sus pruebas/hash/codec se conservan por compatibilidad.

Se localizó el **pintor histórico REAL de P03**, \`public/official/art/actors/p03-rig.mjs\`, blob Git \`1a4282e1652ff559b92e18f42db465d6bfb8e729\`. Se creó una copia P07 con mismos contornos, colores, accesorios, anatomía y keyframes. El hound hereda su forma espinosa, no las elipses de P06. El orco hereda rostro, hacha y armadura. Sólo tres diferencias deliberadas respecto al código histórico:
1. claves de atlas nuevas versionadas;
2. se corrigió el offset del casco/visor humano que quedaba arriba del encuadre en la fuente anterior;
3. se eliminó la llamada de dibujo a \`rifle(...)\` exclusiva del \`sniper_operator\`, porque la torre T08 es dueña del único rifle.

**No se copiaron sprites de la captura C1-C ni se sustituyeron assets ajenos.** El dibujo P07 proviene directamente del pintor vectorial oficial P03, originalmente creado para el proyecto.

## 3. Inventario de entregas
| Archivo | Alcance |
|---|---|
| \`public/official/art/actors/p07-p03-continuity-rig.mjs\` | Pintor y rig P03 conservados; sin rifle operador, casco reparado |
| \`public/official/art/actors/p07-raster-canvas.mjs\` | Fallback CPU de Canvas2D vector→RGBA, con path, strokes y gradientes |
| \`public/official/art/actors/p07-png-export.mjs\` | Exportador de PNG real determinista desde fuente P03 con ABI 32 cuadros |
| \`public/official/art/actors/p07/png/*.png\` | Cuatro atlas binarios nuevos persistidos en objetos Git |
| \`public/official/art/actors/P07_MANIFEST.json\` | Hash, bytes, gamma/alpha, autoría, estado y enlace a referencia aprobada |
| \`public/official/src/actors-visual/p07-atlas-loader.mjs\` | Carga PNG auténticos P07 en Phaser y registra 32 cuadros |
| \`public/official/src/actors-visual/p07-gallery.mjs\` / \`p07-index.html\` | Comparativa real fuente P03 vs PNG P06 vs PNG P07, 24 clones y filmstrip UI |
| \`public/official/src/actors-visual/qa-p07.mjs\` | Node zlib+SHA256+128 alpha frames, regeneración byte idéntico |
| \`public/official/src/actors-visual/qa-p07-browser.mjs\` | Pruebas Chromium/Phaser en 3 viewports y filmstrips (NOT_RUN) |
| \`docs/art/actors/README_P07_FRAME_ABI.md\` | Orden de frames, nombres, pivotes y compatibilidad |
| \`docs/art/actors/actas/QA_P07_PERSONAJES.json\` | Registro independiente PASS/NOT_RUN/PENDING |
| \`docs/art/actors/actas/MATRIZ_T08_P07_PERSONAJES.md\` | RFC T08 mano/culata, un rifle, cámaras y oclusión |
| \`docs/art/actors/evidencias/P07/EVIDENCIA.md\` | Inventario de captura aprobada y capturas reales faltantes |
| \`docs/art/actors/actas/INDEX.md\` | Índice histórico P01–P07, sin borrar P06 |
| \`docs/art/actors/actas/ACTA_P07_PERSONAJES_2026-10-20.md\` | Este informe |

## 4. Comparativa de identidad por elemento
| Elemento protegido | C1-C/P03 aprobado | Situación P06 | Recuperación P07 | Juicio actual |
|---|---|---|---|---|
| Warrior | verde oliva claro; cabeza grande y rasgos expresivos; hombreras, hacha | nueva geometría genérica procedimental | pintor P03: volumen, ojos, dentadura y hacha originales | [MANTIENE EN FUENTE]; escena real PENDIENTE |
| Hound | marrón cálido, hocico, púas dorsales oscuras, patas visibles, cuerpo bajo | reinterpretación de animal nuevo | paths P03 de espinas, arnés, cabeza y 4 patas | [MANTIENE EN FUENTE]; locomoción/QA real PENDIENTE |
| Recluta | identidad humana militar P03 (en foto visible parcialmente) | humano nuevo geométrico | P03 armadura, espada, escudo, casco rehabilitado | [MEJORA EN FUENTE] casco recortado; aprobación visual PENDIENTE |
| Francotirador | humano pequeño con casco y postura sobre vigía T04 | P06 sin rifle pero rediseñado | humano P03 casco/visor/capa, rifle duplicado eliminado | [MANTIENE/MEJORA EN FUENTE]; montaje T08 BLOQUEANTE |

El origen de la captura es la composición M03/T04/P03, no cada atlas aislado. No se proclama que la escena moderna ya coincida con C1-C solo porque los personajes recuperaron fuente P03.

## 5. Cuatro PNG binarios reales / SHA256 / ABI
Cada archivo: RGBA8 PNG \`1408×832\`, 8 columnas ×4 filas, 32 frames de 176×208, nombres/orden legacy \`idle 4, walk 8, attackWindup 3, attack 5, hit 3, die 6, blocked 3\`.
| Asset | Bytes PNG comprimidos | SHA256 generado desde bytes reales |
|---|---:|---|
| warrior.png | 696921 | \`96bb22bac15eb054ea435389556491ecf040599476b84beb9a318c9abf0a98c7\` |
| hound.png | 600467 | \`959b338bc17bb0fbfb51dd17525041b128b758edd44151f479b5cb81fdc0e8a7\` |
| infantry_recruit.png | 610623 | \`b34e0e1b7f47ea1948d91cf15a15f8d7d899411ec4c5349356ceb871bc54c3aa\` |
| sniper_operator_unarmed.png | 539246 | \`586441a555677ac6f8b67fb232283481e8431f9f608bbaa50dad7639f83f2ace\` |

**Tamaño total comprimido:** 2,447,257 bytes; atlas RGBA8 decodificados nominal ≈ 17.876 MiB para cuatro sin overhead GPU. No se reportan métricas de FPS/VRAM.

**Aclaración importante de calidad:** el **export binario** usó el dibujador P03 original por medio de un rasterizador Canvas-like CPU construido en P07; conserva coordenadas, paths, gradientes y colores, pero **NO es garantizadamente idéntico pixel-a-pixel al Canvas nativo de Chromium**, especialmente en antialias. Aun así, son cuatro PNG reales de fuente histórica, no ilustraciones genéricas P06. Es obligatorio revisar la nitidez/colores del PNG P07 en Chromium real antes de aprobar.

## 6. Animación, fase y core protegido
- El paint P03 conserva gait/orc hacha/4 patas hound/balance, fps P03 y 32 claves.
- E/W se implementa mediante flip horizontal; en cambio de dirección no reiniciar reloj/ciclo.
- Los archivos P05/P06 FSM y adapters se mantienen intactos; el core C1-D4 manda \`spawn\`, HP, muerte/fuga y eventos de Infantería. P07 no crea \`entity_die\`, botín, bloqueos, timers de respawn ni cambios de HP.
- La vitrina Phaser P07 es solo artística con estado sintético de actor. No atribuye las animaciones de prueba a combate real.
- Nivel de dificultad/movimiento/oleadas/campaña protegidos: 133 waypoints, 8 pads, 5 oleadas, 63 apariciones, 365 oro inicial, 100 vidas; 10 mapas/140 oleadas sin cambios.

## 7. Bloqueo cruzado T08 operador + rifle
Se leyó \`feature/art-t08-continuidad-c1c\` catálogo read-only. OperatorAnchor I (185,198), StockGrip I (182,183), escala .312; II operator (189,198), stock (201,177), escala .319. Con anclaje actor nominal 80wu, mano del P03 fuente (119,74) vs pie (88,191), la diferencia relativa actor bajo escala nominal supera la del stock T08, **sin medición real de píxeles en escena**. No fingir que encajan.
\`T08\` conserva arma única y rail; Integrador debe declarar si operatorAnchorLocal significa pie/pelvis/manos y montar \`backStructure→P07 unarmed→rifleMounted→frontRail\`. P07 no mueve rifle ni muzzle; no se corrige escala forzadamente desde Equipo P. Ver RFC.

## 8. QA ejecutado vs pendiente
**[PASS EN FUENTE/V8/GITHUB]**: referencia original checksum via terminal; exact P06 origin branch; lectura histórica PR #10/#12, 4 PNG binarios creados/commiteados, 128 frames alfa no vacíos y sin contacto exterior, 4 SHA256 sobre bytes, P07 rig sin rifle de actor, casco reparado en muestras V8, galería fuente parseada, T08 metadata leída. \`QA_P07_PERSONAJES.json\` enumera los 21 checks individualmente (12 PASS, 8 NOT_RUN, 1 PENDING).
**[NOT_RUN/PENDING]**: \`node qa-p07.mjs\` nativo en checkout, \`npm run build\`, Chromium WebGL2 1280×768/844×390/932×430, filmstrips/GIF/WebM verdaderos, 1/8/16/24 unidades real, integración M07+T08+P07 sobre combate C1-D4, FPS móvil físico, calidad pictórica aprobada por propietario.

## 9. Mejoras, debilidades y riesgo entre equipos
**Mejora perceptible concreta:** frente a P06, las representaciones rasterizadas P07 recuperan directamente el orco P03 con ojos/dientes/hacha y el hound P03 con púas/orejas/hocico, visibles en muestras V8; además el operador desarmado exhibe nuevamente el visor P03 en lugar de una cabeza genérica y corrige los cascos humanos fuera de cuadro.
**Debilidad 1:** el fallback raster CPU puede producir línea/gradient distinto al Canvas2D nativo P03 (no se ha ejecutado chromium ni comparación píxel real de todo el atlas).
**Debilidad 2:** el tamaño/socket del operador P07 todavía no coincide nominalmente con culata T08; se necesita captura 100% en ambas torres.
**Riesgo transversal:** la futura escena C1-D4 usa mapa M07, torres T08 y capas centralizadas; restaurar solo actores puede no restaurar C1-C global, y ningún equipo aislado debe sobreescribir integración para arreglar perspectiva.

## 10. Puertas de aceptación, priorización y rollback
- Prioridad 1 **bloquear regresión**: revisar P03 vs P07 en navegador real (primero orco/hound).
- Prioridad 2 **operador**: resolver con T08/Integrador manopla/stock/rail, rifle único real, misma escala C1-C.
- Prioridad 3 **evidencia C1-D4**: capturar M07+T08+P07 mismo viewport 1280×768 de before user original, misma fase/sockets; mobile landscape y pruebas de combate real.
- Prioridad 4 **arte**: Dirección/propietario acepta explícitamente antes de promocionar.

No se modificaron fuentes originales P03, M07/T08, mapas, core, main, production, Render, CSS/contratos compartidos, sistemas de economía ni escena integrada.
**Rollback:** cerrar PR P07 sin merge y regresar al HEAD P06 \`a5116db1...\`; archivos antiguos permanecen. No despliegue.
**Cierre de esta etapa:** P07 corregido EN FUENTE y PNG REALES DISPONIBLES; identidad FINAL y montaje siguen PENDIENTES DE PRUEBAS.
