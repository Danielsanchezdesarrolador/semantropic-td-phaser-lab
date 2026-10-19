# SEMANTROPIC TD — Equipo P · INFORME DE ENTREGA P-02
**Fecha:** 2026-10-19
**Autoridad:** 03_PROMPT_MAESTRO_P02_ENEMIGOS_PERSONAJES_ANIMACION_PHASER(1).txt
**Rama:** feature/art-p02-personajes (origen P01 e1cfc075dfbddb61691ff156860a59ee25cd6f27)
**PR destino:** feature/phaser-personajes (NO integración central, NO producción)
**Clasificación global:** PROTOTIPO ARTÍSTICO + HERRAMIENTA DE VITRINA. NO APROBADO PARA GAMEPLAY.

## 1. Archivos agregados, estrictamente Equipo P
- public/official/art/actors/p02-painter.mjs — código fuente editable para atlas enriquecidos A/B por actor y pose desde P01.
- public/official/art/actors/P02_MANIFEST.json — 8 identificadores P02, escalas, ownership, origen y datos de cuadros.
- public/official/src/actors-visual/p02-gallery.mjs — escena Phaser P01 vs A vs B (solo actor seleccionado).
- public/official/src/actors-visual/p02-index.html — controles móviles de variantes y estados.
- public/official/src/actors-visual/qa-p02.mjs — script Node reproducible para tests sin navegador.
- docs/art/actors/P02_BIBLIA_COORDINACION_TP.md — dirección de arte y RFC-P02-TP01 a Equipo T.
- docs/art/actors/P02_ENTREGA_QA.md — este informe.

## 2. Entrega artística REAL y diferencias
Se generaron varias láminas conceptuales originales con un modelo de imagen de OpenAI durante la sesión, entregadas como IMÁGENES ADJUNTAS, no versionadas en GitHub. Muestran propuestas visuales de:
- warrior: hacha de metal/materia recuperada, armadura asimétrica, cuerpo de carga;
- hound: cuadrúpedo artillado, orejas y columna diferenciadas, arnés;
- infantry_recruit: escudo, espada, casco, tabardo, azul/teal/dorado;
- sniper_operator: rifle largo, visor/óptica, capas y pose de mira.
Las láminas no son atlas animados editables ni fuentes vectoriales independientes. Su tipografía y frames no deben tomarse como metadatos fiables.

Los 4 personajes P02 A y B existen como render procedimental editable que sobrepinta la anatomía P01 y añade material, indumentaria y acentos diferentes. **Aún no cumplen por sí solos el estándar de pintura premium de las láminas**. Se conservó P01 para antes/después. NO declarar producción final ni calidad comercial certificada.

## 3. Escalas y atlas
- P02 A escala propuesta 0.94 × P01; P02 B 1.08 × P01.
- Cuadros heredados P01: 176×208, 32 frames, atlas 1408×832.
- 4 actores × 2 variantes = 8 atlas lógicos / 256 cuadros de estudio.
- PNG binarios no versionados en GitHub; la vitrina crea atlas reales en Canvas 2D y ofrece exportar PNG transparente cuando se ejecuta en browser, pero esta exportación todavía no se ha ejecutado ni validado.
- No se generan cuadros Canvas nuevos en cada tick: horneado una vez por selección/variante; Frame timing visual independiente de core.
- Pivote al pie (0.5,0.92), shadow separado (0.5,1), direcciones E y W espejadas.
- Memoria teórica RGBA8 por atlas 4.47 MiB, comparativa triple 13.41 MiB sin overhead de Phaser/WebGL.

## 4. QA efectuado
**[EJECUTADO: V8 aislado con Canvas/Texturas simulados]**
1. Parseo de sintaxis P02 painter y galería: PASS.
2. Las 8 llamadas createP02Atlas(actor, variant) se completaron sin excepción: PASS.
3. Los atlas reportan 1408×832, 32 cuadros no superpuestos: PASS.
4. Registros simulados de texturas/fotogramas: 32 por atlas: PASS.
5. 8 nombres/claves distintos; 256 cuadros examinados; manifest 8 assets: PASS.
6. Los cuatro actores y sus aliases proceden del archivo P01 real leído desde GitHub: PASS.

**[NO EJECUTADO]**
- El script Node qa-p02.mjs se ha escrito y revisado, pero NO se ha ejecutado dentro de un checkout local completo de GitHub.
- npm run build; runtime Phaser; capturas reales; WebGL2; compatibilidad táctil 844×390 y 932×430.
- Render gráfico pixel a pixel, detección de clipping y foot jitter; performance real.
- PNG alpha exportado y hash SHA256; prueba en smartphone físico.
- Integración con torre Francotirador I/II, M01 real C1-A y Combat Events Bridge.
- Aprobación de Dirección de A vs B y arte final pintado.

## 5. Procedimiento de reproducción local
Desde checkout del proyecto actualizado y con Phaser 4.2.1 disponible:
1. npm install
2. node public/official/src/actors-visual/qa-p02.mjs
3. npm run build
4. Servir dist/ desde un servidor estático HTTP.
5. Abrir /official/src/actors-visual/p02-index.html.
6. Seleccionar cada actor, comparar P01 vs A vs B en 1× y 2×, probar 7 estados y dirección E/W, exportar PNG A/B.
7. Comparar clip/escala del rifle/hacha, sombra, pie y colores frente a M01/torres I-II en escena integrada por Dirección.

**No abrir el index con file://, pues lee maps.v5.json por fetch readonly**.

## 6. Clasificación y deuda relevante
[MÓDULO VISUAL AISLADO] no crea spawns core, IA, lógica de ataque, estado de HP, shields, oro, dinero, recompensas ni pérdidas.
[NUEVO ART-PROTOTYPE] source en Canvas procedural; los estados heredan rigs P01, con mejoras decorativas y materiales, no sustituyen animación pintada pose a pose.
[ABI BLOQUEANTE] M01/towers slots reales por Integrador / Equipo T; verificar anclaje de operador.
[ARTE BLOQUEANTE] revisar biomecánica hound run, weapon motion warrior, poses N/S, coherencia de 32 cuadros.
[PRODUCCIÓN BLOQUEANTE] reconstruir las poses pintadas fieles a arte conceptual, producir PNG con alpha, fuente editable por partes, hashes y QA visual/capturas.

## 7. Protección de ramas y rollback
Este paquete está COMPLETAMENTE dentro de espacios del Equipo P:
public/official/art/actors/**; public/official/src/actors-visual/**; docs/art/actors/**.
No se editó ningún archivo preexistente.
No hay cambios en:
integration/c1a-visual, integration/phaser, feature/phaser-personajes, main, production,
m01-model.mjs, m01-preview.mjs, maps.v5.json, campaign140.v5.json,
escenas M/T, torres, core, package.json, build.mjs, Render.
Para volver atrás basta cerrar PR draft o revertir sólo los commits de P02; ningún dato de partida o core cambia.

## 8. Requerimientos formales al Integrador / Dirección
- Ratificar dimensiones/apoyo en escena M01 y visibilidad frente a edificios T.
- Definir operatorAnchorWorld y equip cue al francotirador.
- Revisar A/B con láminas conceptuales y render real de galería. No aprobar automáticamente por el smoke.
- Conservar PR P02 como DRAFT hasta QA visual y aprobación.
- No merge hacia integración C1-A desde este equipo.
