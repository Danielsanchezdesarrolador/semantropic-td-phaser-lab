# SEMANTROPIC TD · Evidencias P-03 / C1-B-Q2
**Estado a 2026-10-19: EVIDENCIA GRAFICA REAL PENDIENTE.**
No se incluyen capturas de Phaser/WebGL2 de P03 en este PR porque no se pudo ejecutar el navegador contra esta nueva rama. No simular screenshots con conceptos IA, ni declarar CI histórica como prueba del nuevo módulo.

## Matriz obligatoria de capturas a realizar
| Identificador | Tamaño | Captura | Estado | Responsable |
|---|---|---|---|---|
| desktop p03 vs p02 | 1280×768 | misma cámara, 4 comparadores, los cuatro actores por turnos | NOT_RUN | QA browser |
| mobile-844 p03 vs p02 | 844×390 | mismo actor, mismo frame y escala | NOT_RUN | QA browser |
| mobile-932 p03 vs p02 | 932×430 | mismo actor, mismo frame y escala | NOT_RUN | QA browser |
| close-up face | 1280×768 | detalle rig/brazo/cabeza/cuadrúpedo y pivote | NOT_RUN | QA browser |
| alpha atlas PNG | 1408×832 | recorte visible sobre patrón checkerboard y SHA256 | NOT_RUN | QA/artista |

## Procedimiento de captura SIN editar áreas compartidas
1. Producir `dist` en checkout con `npm install` + `npm run build`.
2. Servir `dist` por HTTP y abrir `/official/src/actors-visual/p03-index.html`.
3. Cambiar actor P01/P02A/P02B/P03 y fijar estado, orientación y zoom idénticos para comparación.
4. Capturar todos los tamaños requeridos; verificar WebGL2 del contexto real; probar al menos 3 walk, 2 attack, hit/blocked y pausa.
5. Exportar png P03 real desde interfaz, verificar canal alpha y calcular SHA256 de los bytes exportados.
6. Comprimir copias testigo como PNG/WebP y subirlas a **esta carpeta**, actualizar QA.json y PR.

El botón `Exportar hoja de estudio P03` dibuja el face sheet con rig original en navegador: hasta que ese proceso se ejecute y produzca un PNG, sólo es fuente programática, no imagen binaria entregada.

## Comparativa sobre datos (no sobre imágenes verificadas)
- P01: atlas vectorial original; P02: sobrepintura A/B sobre P01; P03: rig propio independiente con distintas trayectorias de pie/cuerpo/brazo y cuatro patas independientes del hound.
- 128/128 trazas geométricas únicas por estado en contexto Canvas simulado; esta evidencia confirma variedad paramétrica de posiciones pero **NO** valoración de estética, contorno, pixel clipping, fotogramas reales ni device FPS.
- El run de GitHub Actions [#39342295194](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39342295194) finalizó en SUCCESS según API pero valida la versión histórica C1-B, no P03.

**No existe aún captura permanente P03 etiquetable como [CAPTURA REAL PHASER].** Criterio de arte premium abierto.