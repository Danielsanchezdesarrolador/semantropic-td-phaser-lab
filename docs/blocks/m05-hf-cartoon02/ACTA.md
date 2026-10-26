# MAP-ART-05-HF-CARTOON-02 — lectura cartoon del pantano

Orden del Director: `SEMANTROPIC_TD_CODEX_M05_HOTFIX_MAS_2D_CARTOON_PREMIUM_2026-10-26.txt`, 26/10/2026. Hotfix de estilo, no gameplay. Base real PR71: `2cbcda7badc8925a0ff7890f3ccab6e3749baa68`; rama `art/m05-hf-cartoon02`.

## Qué cambia y por qué

La humedad y el humedal de PR71 se mantienen. Se sustituye la lectura sobretexturizada por formas más organizadas, contornos claros y volúmenes ilustrados. No se aplica un filtro global al mapa.

- **Suelo:** material original nuevo con masas de musgo, barro y pocas matas grandes; menos microhojas dispersas. Recorte interior oscuro de 1,5wu para separar el islote del agua; labio oliva claro y sombras de contacto.
- **Agua:** bandas jade/verde con curvas amplias, sombras estilizadas y menos detalle pequeño. Se reducen los grupos adicionales de nenúfares de 34 a 17 y las pequeñas líneas dispersas; no se elimina agua ni se retrocede a pradera.
- **Paredes:** nuevo atlas original de roca húmeda, facetas grandes e irregulares, luz oliva y sombra fría. Extrusión de 44wu con la misma máscara, sin patrones de ladrillo ni columnas uniformes. Base opaca recortada a la cara para evitar transparencias entre fragmentos.
- **Props:** nuevo atlas de seis componentes con copas y raíces más claras, contornos más firmes, madera/piedra de lectura más limpia, faroles ámbar y runas turquesa. Identidades originales: árbol antiguo con farol, choza con emblema de hoja, arco, flora, tronco y huesos arqueológicos.
- **Agrupación:** 66 props frente a 96. Se mantienen todos los 22 elementos principales (17 árboles, 2 arcos, choza, tronco, huesos), con sus centros de raíz; flora baja de 74 a 44 grupos. Se retiran 30 repeticiones de relleno. Los 66 anclajes conservan centro y pie; se comprueba su apoyo y distancia a camino/pads.
- **Puentes y plataformas:** bordes y planos de color más definidos. Las plataformas siguen siendo nueve con los mismos centros/IDs, soporte de textura de 208×160 y jerarquía táctica. El pedido actual incluye expresamente el acabado de pads (apartado 3.6), por lo que sustituye la congelación de su pintura específica del hotfix anterior; no autoriza modificar su función.

La jerarquía se organiza entre agua fría y limpia, suelo húmedo oliva, props de follaje vivo, piedra crema de pads y camino cálido. Se conserva el bioma por agua estructural, barro, musgo, árboles retorcidos, raíces, flora de orilla, faroles y ruinas. No se declara aprobación artística humana: comparar capturas y evaluar en el preview.

## Producto: ocho archivos

1. `public/official/src/maps-visual/m05/cartoon01/assets.mjs`: carga exclusivamente las tres fuentes originales M05 nuevas, seis componentes y atlas preparado; no carga arte de M02.
2. `public/official/src/maps-visual/m05/cartoon01/marsh-world.mjs`: versión `m05-hf-cartoon02-clean-wetland-art-v1`, composición por anclajes.
3. `public/official/src/maps-visual/m05/cartoon01/surfaces.mjs`: contorno, pared, paleta de puente/pad y superficies.
4. `public/official/src/maps-visual/m05/cartoon01/wetland-details.mjs`: menor frecuencia de detalles pequeños en agua y barro.
5. `public/official/src/maps-visual/m05/cartoon01/composition-cartoon02.mjs`: 66 anclajes derivados del runtime PR71, agrupación preservada.
6. `public/official/art/maps/m05/cartoon01/marsh-atlas-cartoon02-original.png`: fuente original de props, 1536×1024 RGBA.
7. `public/official/art/maps/m05/cartoon01/wetland-materials-cartoon02-original.png`: dos materiales originales separados, 1536×1024, no un mapa aplanado.
8. `public/official/art/maps/m05/cartoon01/bank-cliffs-cartoon02-original.png`: tres motivos originales de roca, 2172×724 RGBA.

Las tres fuentes son revisiones originales mediante generación de imagen de arte del propio proyecto. Los PNG anteriores no se sobrescriben. Resolución fuente suficiente: materiales a 2px fuente/wu; props comprobados a ≥1,8px/wu; superficies a 2× con filtrado de calidad. No cambia resolución, FIT ni antialias del renderer. Ninguna dependencia nueva ni compresión destructiva.

## Protección y pruebas

[CONFIRMADO EN CÓDIGO] 307 waypoints, 9 centros, módulo de camino de 62wu/C2, máscara y canales sin cambios. En Node se compara el código exacto de la máscara con PR71. Cobertura sin terreno superior: 30,8659% antes y después, muestreo 61.440 posiciones; no representa porcentaje de agua visible tras oclusión. Extrusión, alturas y tres cruces conservados.

[PASS] Node: alcance M05, datos/selector/preview y fuentes históricas inmutables, dimensiones de nuevas imágenes, código exacto de máscara, ruta C2, offsets y estaciones. [PASS] build Phaser 4.2.1.

Browser/CI/publicación: consultar informes y PR del bloque para estado final; esta acta se prepara antes de promover. QA del navegador exige mismos centros, raíces, apoyos de pads/puentes/props, máscara vs ground alpha, ancho, seam/FIT, overlay, reinicio, cero animaciones nuevas y carga M01–M04 con selector 1–4.

Baseline before: Chromium real, módulos exactos PR71 servidos mediante intercepción local de Git, mismas fuentes históricas y encuadres PC/844×390. `baseline-browser.json` registra el método y versión.

[NOT_RUN] Android/iPhone físicos, FPS/VRAM físicos, gameplay M05. [PENDIENTE] evaluación estética del Director. M05 continúa **solo preview artístico, sin combate y fuera del selector**. No cambios core, UI, oleadas, enemigos, economía, torres, guardados, M01–M04, AGENTS ni roadmap.

Publicación mediante PR/CI/canal Render existente. Mismo preview `/official/src/maps-visual/m05/preview/`, sin nuevos sitios. Rollback: revertir el merge de este bloque; base de recuperación PR71 indicada arriba.

[PROBADO EN NAVEGADOR — PASS] QA local final: Phaser/WebGL2 en desktop 1280×768, 844×390 táctil y 932×430 DPR2 emulado, 66 anclajes exactos, 9 pads, apoyos, 551 cortes de ancho, seams de FIT, 307 marcadores, reinicio sin acumulación de objetos/texturas, cero animaciones nuevas y cero errores JavaScript. Carga M01–M04 conserva versiones y selector 1–4, sin cargar M05 en el juego oficial. Informe y capturas en esta carpeta.
