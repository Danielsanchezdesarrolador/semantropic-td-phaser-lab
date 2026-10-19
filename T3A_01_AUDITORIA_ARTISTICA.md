# SEMANTROPIC TD — Auditoría artística T3-A

Fecha: 2026-10-19. Rama de lectura: `experimentos/t2c-revolucion-artistica`. Rama protegida de trabajo: `experimentos/t3a-biblia-conceptos`.

## Fuentes verificadas
- Repositorio: `Danielsanchezdesarrolador/semantropic-td-phaser-lab`.
- Sitio Render T2-C: `semantropic-td-t2c-art-phaser`, conectado a `experimentos/t2c-revolucion-artistica`.
- Sitio Render T1: `semantropic-td-phaser-lab`, conectado a `main`.
- `package.json` del T2-C fija la dependencia `phaser: "4.2.1"`; la versión realmente reportada por la GPU y navegador físico depende de la ejecución.
- `public/t2c/index.html`: interfaz, CSS responsive, HUD y botón de demo.
- `public/t2c/scene.js`: escenario jugable de ensayo, enemigo básico/pesado/mágico, torre infantería/sniper/guardian/bombard, eventos de combate.
- `public/t2c/art.js`: texturas procedimentales.
- Recursos de laboratorio: `public/assets/mapa_original.png` (base M01), diez PNG prerenderizados de la referencia Canvas T1.
- Archivos de campaña original: `public/JUEGO_V5_CANVAS.html`, `public/JUEGO_V5_IPHONE.html`, a mantener intocados.

## Hallazgos de código, no inferencias de capturas
1. **Bloqueo mobile-first [CONFIRMADO EN CSS].** `@media(orientation:landscape) and (max-height:550px)` usa `grid-template-columns:minmax(0,1fr) 225px`: panel lateral fijo en landscape. Los 225px pueden restar aproximadamente 26,4% del ancho en 852px incluso antes de gutters. La relación de aspecto del área útil difiere del canvas 5:3.
2. **Área de juego reducida [CONFIRMADO EN CSS].** `#stage` usa `height:calc(100dvh - 73px)` en landscape; cabecera, zona de botones y panel fijo compiten con la escena. Faltan reglas explícitas `env(safe-area-inset-*)`, touch-action global y prevención de scrolling accidental.
3. **Nitidez limitada [CONFIRMADO EN art.js].** Torres `260×260`, soldados `130×148`, enemigos `140×146`, fondo extra `1280×768`. Escalar bitmaps más allá del tamaño de origen no añade información ilustrativa; hay que regenerar mejores masters/atlases.
4. **Animaciones preliminares [CONFIRMADO EN art.js/scene.js].** Variantes de cuatro texturas calculadas por ciclo trigonométrico; no constan ciclos anatómicos separados para idle, caminar, anticipar, atacar, recuperar, recibir impacto por cada dirección.
5. **Acabado artístico de demo [CONFIRMADO EN FUENTE].** Geometría procedural Canvas con gradientes, círculos y polígonos; no equivale a archivos fuente pictóricos de producción. Los FX representan estados de ensayo en combate demo, sin trasladar stats de la campaña.

## Aspectos que NO se deben dar por verificados
- No se dispone en esta auditoría de las dos capturas comparables T2-B/T2-C citadas por el Prompt T3 como archivos de imagen montados en este turno. Sus impresiones se conservan como **evaluación reportada por el director**, no como QA visual reproducido aquí.
- La versión de paquete Phaser es 4.2.1; contexto WebGL2 real, DPR, renderer gráfico, nitidez en iPhone/Android, z-order dinámico, capturas físicas y comportamiento táctil permanecen **NO VERIFICADOS**.
- No se ejecutó un benchmark FPS ni se solicitará como criterio del bloque T3.

## Riesgos críticos antes de producción
1. Componer ilustración cuidada sin resolver layout mobile-first generaría personajes demasiado pequeños.
2. Generar personajes a mayor resolución con anatomía indiferenciada no solucionaría legibilidad.
3. Añadir capas brillantes sin código visual claro arruinaría la dirección artística.
4. Confundir la escena de cinco oleadas demo con la campaña 140 alteraría expectativas y QA.
5. Llamar «arte final» a texturas procedimentales o «WebGL2 aprobado» a configuración sin prueba real sería engañoso.

## Fases y puerta de autorización
- **T3-A ahora:** auditar, presentar dos concept frames comparables y biblia editable, obtener aprobación del director.
- **T3-B después de selección:** producir torres/enemigos con masters independientes + spritesheets, integración en nueva escena.
- **T3-C después:** layout responsive fullscreen landscape con HUD compacto, menú contextual flotante y botones táctiles.
- **T3-D después:** capturas auténticas PC + emuladas + físicas si disponibles, QA funcional y comparación crítica con T2-C.

## Integridad protegida
No tocar campañas Canvas, PixiJS, ramas T1 `main` o T2-C, producción Render, balance, economía ni 140 oleadas. Los archivos de este bloque son documentos de arte T3-A en rama separada.