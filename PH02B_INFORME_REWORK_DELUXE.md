# PH-02B · Mapa 01 «Praderas del Amanecer» — Deluxe
**Fecha:** 19 de octubre de 2026  
**Rama reversible:** `art/ph02b-m01-deluxe` (derivada de `production/ph01-p0-m01`)  
**Motor:** Phaser 4.2.1 (dependencia de build; WebGL2 real por verificar en navegador).  
**Estado:** rework artístico jugable en el visor M01 de prueba de rutas y oleadas. **No significa M01 con torres oficiales migradas.**

## Cambios ejecutados
| Elemento | Antes PH-01 | Deluxe PH-02B |
|---|---|---|
| Camino exterior | trazo de 126 px | 110 px (−12,70 %) |
| Camino relleno | bandas 113/101/87, colores simples | capas 103/96/85/78, tierra cálida, desgaste, grava y orilla |
| Línea central | 133 waypoints del V5 | los 133 mismos puntos, intactos |
| Césped | base verde uniforme + 750 motas | gradiente ilustrado, 10 manchas compositivas grandes, praderas y arbustos agrupados |
| Vegetación | motas simples | matas, 3 familias de copa, árboles puntuales en márgenes, flores y pasto corto |
| Props | casi ninguno | piedras trabajadas, ruinas, señales y lámparas arcanas en sectores despejados |
| Plataformas | 8 elipses planas numeradas | 8 basamentos tallados por capas con piedras, metal y runas por rol (tempo, power, focus) |
| Selección | hit radius 54 en spots V5 | mismo hit radius y mismos spots |
| Cámara | 1280×768 + Phaser.FIT | no alterada |
| Comparación | solo estado PH-01 | `?art=before` vs `?art=deluxe`; mismo mapa/cámara/oleadas |
| Gameplay | no-defense visor del Canvas V5 | **sin modificar la lógica de gameplay** |

### Recursos creados
- `public/official/src/m01-deluxe-art.mjs`: código **fuente editable** para generar una textura de ambiente 2560×1536 y tres variaciones de plataformas 376×312 (Canvas a 2× usado para bake de texturas, dibujadas posteriormente por Phaser).
- `public/official/src/m01-preview.mjs`: selección de capa `PH-01` o `PH-02B` con la misma simulación.
- `public/official/index.html`: botón A/B y comportamiento visual contextual.
- `tools/qa-ph02b.mjs`: pruebas de estructura y geometría.

El arte se produce proceduralmente y es propio de Semantropic TD, **NO debe presentarse como ilustraciones finales pintadas a mano**. La inspiración externa no se utiliza como asset.

### Criterios de integración protegidos
- Enemigos M01 (warrior/hound), cinco oleadas 8/10/11/13/21, total 63, oro 365, núcleo 100 vidas, fugas −2: **no modificados**.
- Los 133 vértices, 8 ubicaciones y el alcance táctico permanecen intactos.
- Los campos `recommend` legacy de spot son solo datos del viejo archivo y **no representan torres activas canónicas**.
- No se cambió `public/JUEGO_V5_CANVAS.html` ni `public/JUEGO_V5_IPHONE.html`, y no se promovió el nuevo artwork al staging PH-01.
- Solo se crea un staging separado `PH-02B`; revertir es seleccionar la rama anterior.

## Validación
**Probado automáticamente:** Node syntax de ES modules, contrato de diez mapas/ciento cuarenta oleadas, M01 no-defense natural loss y construcción completa de cuatro texturas mediante contexto Canvas simulado (no visual); integridad de ocho pads y fuente 133 coordenadas.  
**Pendiente:** capturas auténticas antes/después, render en Chrome WebGL2, pruebas táctiles mobile landscape y escritorio, QA de oclusión y evaluación artística del director. El build LIVE solo prueba la publicación, no la calidad del frame.

### Riesgos abiertos
1. Los gráficos son ilustración procedural preproducción, susceptibles de parecer aún vectoriales a ojo profesional.
2. El visor PH-01 continúa sin compra, bloqueo, daño ni estrellas; el rework artístico **no completa la migración**.
3. Medir cómo se comporta la textura 2560×1536 en dispositivos modestos y evitar saturación ambiental.
4. Verificar contraste del nuevo camino 12.7% más estrecho en móviles reales; si es demasiado fino, revisar ancho sin tocar path.
5. Falta una captura del visor PH-01 en el mismo viewport, obtenida de un navegador real: el modo A/B facilita capturarla.

## Prioridad de iteración siguiente
1. Validar antes/después auténticos 844×390 / 932×430 / PC con capturas; corregir legibilidad.
2. Sustituir props y vegetación procedurales provisionales con atlas editables ilustrados aprobados.
3. Retomar PH-01 P2: combate Infantería/Francotirador, construcción y resultados fieles al Canvas, de forma separada de los cambios de arte.
