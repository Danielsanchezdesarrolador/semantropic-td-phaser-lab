# SEMANTROPIC TD — Equipo M · M-02 Aurora v2
**19 de octubre de 2026 · Segunda ronda de arte (NO Mapa 02)**  
**Rama:** `feature/art-m02-mapas`  
**Base:** M-01 Aurora, `feature/phaser-mapas` commit `209b57da2f5ac5aa774c843153c2e5ff898d1000`  
**PR destino:** `feature/phaser-mapas`, no `integration/phaser` ni producción.

## Objetivo aprobado
Primer mapa «Praderas del Amanecer» como paisaje de campaña memorable: primer amanecer de vigilancia, tres landmarks, naturaleza con siluetas agrupadas y jerarquía visual táctico-comercial de diseño propio. Se preserva completamente la fuente canónica y toda la lógica del juego.

## Resumen del arte realmente producido
- **Siete ilustraciones originales SVG editables**, transparentes, exportables a PNG/atlas: torre de observación, baliza-santuario, resto de acueducto, roble volumétrico, señal de camino, valla vieja, carreta de suministros. No se extrajeron referencias visuales externas ni se copió arte ajeno.
- **Una lámina SVG editable de seis materiales:** piedra, madera, aleación, tierra, vegetación y cristal/luz arcana.
- **Módulo v2 independiente** con 3 paletas, terreno de masas cromáticas ordenadas, guijarros y marcas de rodada en carretera de 110 unidades, pads de piedra biselada con runa y shaders simulados con textura Canvas horneada.
- **Tres hitos ambientales:** acueducto antiguo (aprox. X102 Y113), baliza arcana (X1106 Y88), puesto abandonado (X1119 Y725); los tres usan la misma línea de color y narrativa de alerta.
- **17 ilustraciones instanciadas** por mapa entre árboles, marcadores, valla, carreta y landmarks; extras de microvegetación quedan horneados en terreno para evitar miles de sprites.
- **Estados de pad** `neutral, selected, occupied, ruins` son SOLO VISUALES, no compran ni construyen torres ni deciden colisiones. Oclusión futura declarada por metadatos de pie.
- **Vitrina aislada** `public/official/art/maps/m01/m02/index.html`: A (M01 v1 intacto), B (M02 equilibrada), C (M02 viva), D opcional atmosférica; misma cámara y geometría, selector de sockets y overlays. Presets locales de zoom 84%, 92% y 100%.

## Materiales y jerarquía tonal (fuente editada)
| Material | Dominante (equilibrio) | Luz | Sombra | Borde | Acento |
|---|---|---|---|---|---|
| Hierba | #8fbd7a | #cfe6a0 | #3d8066 | #529569 | #75aa6e |
| Tierra/camino | #cba371 | #efd4a1 | #906a4c | #5e7754 | #ddba82 |
| Piedra | #aab9a4 | #e2dac1 | #546c71 | #264d52 | #79cbbd |
| Madera | #986e4e | #ddaa65 | #614d42 | #485451 | #e4ba75 |
| Tecnología arcana | #79cbbd | #c8fff0 | #3c7f98 | #264d52 | #e4ba75 |

Iluminación coherente desde la zona superior izquierda (noroeste de pantalla); sombra hacia inferior derecha. El camino tiene más luminosidad que el fondo, torres/actores se reservan aún más contraste, VFX conservan máximos puntuales. La versión viva eleva vegetación/dorado sin introducir neones.

## Geometría INALTERABLE

- Mundo `1280×768`.
- 133 waypoints originales, desde (−32,342) hasta (1312,400).
- Ocho pads EXACTOS (96,480),(416,480),(672,544),(736,352),(992,224),(992,544),(1120,608),(1184,352).
- Camino: 110 unidades visuales. Los detalles y rodada se pintan alrededor de la línea central V5, sin rutas alternativas.
- Cualquier futura modificación de geometría requiere orden separada.
- Escenario no altera 5 oleadas oficiales, 100 vidas, fuga −2, economía ni stats.

## Responsabilidades y namespaces

Todos los archivos están bajo:
- `public/official/src/maps-visual/m01/m02/**`
- `public/official/art/maps/m01/m02/**`
- `docs/art/maps/**`

**No tocar:** `m01-preview.mjs`, `m01-model.mjs`, `public/official/index.html`, `public/official/src/c1-visual/**`, `maps.v5.json`, `campaign140.v5.json`, `package.json`, `build.mjs`, Atlas T/P, Render, guardados, balance ni ramas comunes.

## Interfaces requeridas del Integrador

- `preloadM02Illustrations(scene,baseUrl)` en `preload`. Los 7 SVG están disponibles en ruta de build `/official/art/maps/m01/m02/svg/`.
- `mountM01WorldV2(scene,canonicalMap,{palette})` en `create` después de cargar assets. Retorna `objects, padObjects, propObjects, occlusionMetadata, setSocketVisualState, updateDebug, updateAmbient, destroy`.
- La escena integrada debe invocar `updateAmbient(dt,paused)` desde reloj Phaser; no timers independientes.
- `destroy()` limpia sprites y texturas horneadas de la variante, en forma idempotente. Las SVG cargadas por Phaser se mantienen en su cache compartida, sin reload cada frame.
- `visualSocketPreview` sigue siendo fixture M-01; `getMapSockets(1)`, `layerIDs`, alpha-occlusion y `CombatEventBridge` pertenecen EXCLUSIVAMENTE al Integrador.
- `occlusionMetadata` incluye pie y regla propuesta; no se impone z global del juego.
- Montaje individual C1-A requiere PR central de adaptador; NO editar escena `c1-visual` en M02.

## Comparación de cámara móvil (PROPUESTA, no aprobación)
| Preset local | Zoom | Ventaja | Riesgo |
|---|---:|---|---|
| Escenario completo | 84% | Elementos aparentemente menores | Más área vacía/bordes en pantallas anchas |
| Equilibrio visual | 92% | Zoom de compromiso | Menos detalle por pixel |
| Natural | 100% | Integra 1280×768 completo con FIT | En 844×390 hay bandas laterales de ~97px |

No se modifica `Phaser.Scale.FIT` ni HUD global. La decisión oficial exige comparar en escenas integradas con actores reales.

## Rendimiento y datos técnicos
- Dos fuentes Canvas 2560×1536, solo una vez por paleta; estimación de 30 MiB RGBA8 sin compresión para ambas, antes de SVG/atlas/GPU overhead.
- Tres texturas pequeñas de pads 464×368, siete sprites SVG rasterizados al cargar.
- Sin generar Canvas dentro de `update`. El único trabajo frame a frame son tres luces puntuales animadas con delta limitado y reloj de escena.
- Vitrina solo mantiene una paleta activa; las texturas horneadas de v2 se eliminan en `destroy`.
- Se requieren mediciones reales de memoria y aspecto en smartphone cuando la integración autorice un navegador.

## QA y límites (evidencia veraz)
- **[COMPROBADO CON EVALUADOR V8 / MOCK]** sintaxis de `renderer-v2.mjs` y `showcase-v2.mjs` tras retirar encabezados ESM; tres paletas montan ocho pads, 17 ilustraciones y 31 objetos de escena cada una; 5 texturas generadas por paleta; desmonte no falla y elimina esas texturas.
- **[COMPROBADO EN GITHUB]** archivos SVG y fuente original versionados; manifesto de assets y nueva vitrina aislada.
- **[ENTREGADO NO EJECUTADO EN NODE]** `qa-m02.mjs` preparado para `node .../qa-m02.mjs`. No confundir el mock ejecutado en V8 con Node QA real.
- **[NO EJECUTADO]** despliegue/render de la nueva rama, captura auténtica Phaser WebGL2, layout en 1280×768/844×390/932×430, escala de grises visual, QA física de Android/iPhone/iPad, consumo GPU, interacción integrada T/P.
- **[REQUIERE APROBACIÓN DEL DIRECTOR]** calidad comercial, escala final y aceptación de una paleta B o C como estándar.
- **[NO PROBADO]** si un actor cruza copas/árboles; solo metadatos de oclusión.

## Puerta de salida M-02
PR contra `feature/phaser-mapas` en DRAFT; **no merge**. Integrador/Director debe autorizar staging y revisar imagen real del mismo encuadre A/B/C con torres y actores visibles sin solapes. Si se aprueba, incorporar M02 al flujo de M-01 por commit central. El equipo M no promueve assets al juego ni modifica las escenas compartidas.

## Rollback
Cerrar PR borrador o revertir los archivos nuevos bajo `m02/`. M-01 intacto, C1-A intacto, Canvas V5 intacto.
