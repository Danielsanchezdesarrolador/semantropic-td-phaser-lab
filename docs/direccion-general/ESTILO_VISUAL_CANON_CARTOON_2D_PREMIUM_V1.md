# SEMANTROPIC TD — CANON ARTÍSTICO: CARTOON 2D PREMIUM V1

**Decisión oficial aprobada por Dirección General:** 23 de octubre de 2026 (posterior a los estándares M03 pictóricos y MAP-STYLE-01 anteriores).  
**Alcance:** todos los mapas, torres, operadores, soldados, aliados, enemigos, jefes, VFX, animaciones, HUD, iconografía, tutorial, menús y futuras expansiones.  
**Autoridad:** AGENTS.md y el roadmap central remiten a ESTE documento como norma vigente de arte.

## 1. Referencia visual aprobada — única línea de estilo
La **ÚLTIMA versión cartoon más acentuada del mockup M01 «Praderas del Amanecer»** aprobada explícitamente por el Director el 23/10/2026 define el estilo. Es la imagen de la conversación donde se ven contornos oscuros claramente dibujados, árboles redondeados por masas de color, acantilados geométricos escalonados, camino limpio cálido, 8 pads de piedra y portal cristalino azul sobre la pradera. **Se trata de dirección de estilo y calidad, no de un plano geométrico autorizado ni de prueba de integración en runtime.** El archivo binario original se encuentra en la conversación de Dirección; **no está incluido automáticamente en el repositorio ni debe inventarse una ruta o URL de GitHub**. Antes de un nuevo bloque artístico pedir/recibir la imagen aprobada si no está disponible en el entorno Codex. Se puede usar un archivo de referencia autorizado si se incorpora por el flujo normal del repositorio.

Esta elección **SUSTITUYE** la decisión anterior de utilizar el acabado pictórico/semirrealista del M03 como referente final. M03 y anteriores quedan como referencias históricas técnicas y de contenido, no como guías de estilo artístico futuro. **No rehacer funcionalidad aprobada por este cambio**. Referencia de género: Kingdom Rush/Ironhide solo para legibilidad, cohesión e intención lúdica; **prohibido copiar assets, diseños, composiciones, personajes, siluetas y UI**.

## 2. ADN visual común
- **Cartoon 2D de videojuego, vista elevada 3/4 ligera**, siluetas rotundas, atractivas, expresivas y fáciles de identificar a escala móvil horizontal.
- **Contornos nítidos y deliberados:** perfiles oscuros de grosor coherente, variación de línea según jerarquía; bordes interiores más finos; no bordes pixelados, irregulares o temblorosos. Prueba obligatoria a resolución real de juego.
- **Color por familias de masas:** planos cromáticos claros y contrastes controlados; sombreado estilizado por bloques (cel shading suave) con 2–4 valores principales por material, sin textura fotográfica ni pinceladas hiperrealistas.
- **Profundidad por diseño 2D:** terreno escalonado, caras visibles de acantilados, bordes de césped, sombras de contacto, oclusión y escala relativa coherente; NO fingir profundidad colocando una pintura bajo sprites recortados.
- **Ritmo de detalle:** primero grandes siluetas, luego materiales, finalmente acentos pequeños. Reservar aire alrededor de camino, plataformas, unidades y menús.
- **Materiales cartoon reconocibles:** piedra con facetas grandes; madera con volúmenes y pocas vetas; agua de masas turquesa con espuma de formas controladas; metal con brillo gráfico; tierra de borde definido; vegetación de racimos redondeados.
- **Cohesión:** mismo sentido de luz, contraste, densidad de tinta, perspectiva, escala, sombras y render final a través de los 10 mapas y todos los elementos interactivos.

## 3. MAPAS y geografía jugable
- Cada bioma conserva identidad (M01 praderas; M02 campos y molino; M03 bosque; M04 río; M05 pantano; M06 desfiladero; M07 escarcha; M08 ruinas; M09 volcán; M10 fortaleza), pero comparte estilo cartoon, perspectiva 3/4, bordes y sombras.
- Camino deliberadamente dibujado: curvas suaves, ancho visual controlado, tierra con detalle bajo, transiciones claras a pasto/puentes, ninguna costura ni «cinta pegada». **Puntos de ruta autoritativos protegidos** salvo bloque GEOMETRÍA autorizado.
- Plataformas: 3/4 de piedra con borde/espesor, base y sombra de contacto, rodeadas de suelo integrado; completamente visibles y pulsables. La ilustración no manda sobre el número/ID/ubicación funcional de pads.
- Escenarios compuestos mediante superficies, detalles, elementos modulares, alturas y profundidad en Phaser: **prohibido utilizar un mockup aplanado como el mapa final**. Evitar collage de PNG, bordes/tiras rectangulares, saltos de escala y capas sin anclaje.
- Vegetación, ruinas, fuentes, cercos, molinos, ríos, cascadas y portales: siluetas cartoon del mismo set; relevancia espacial, coherencia topográfica y tamaño dentro del mundo. Evitar añadir props sobre senderos/pads o cascadas sin fuente y caída.
- Trazar comparativas antes/después a mismo encuadre y escala 16:9; cubrir FIT, safe areas, móvil horizontal y seam checks.
- **El mockup aprobado solo define estilo, nunca la geometría ejecutable**; M01 mantiene 133 puntos de ruta, 8 pads y el core actual salvo futura orden exclusiva.

## 4. TORRES y edificios (cinco familias)
- Infantería, Francotiradores, Guardiana, Bombardera y Torre de Control: mismas reglas 2D cartoon, formas estructurales diferenciadas por silueta/color/función; metal/madera/piedra estilizados coherentes, arquitectura sin microtextura fotográfica.
- Niveles I–III y especializaciones IV (si se implementan): evolución visual evidente a escala móvil sin cambiar stats por arte. Cada rama conserva identidad y jerarquía clara. No clonar torres de terceros.
- Operador, arma, boca del rifle y disparo alineados a pivotes reales; **un solo rifle físico visible**, sin duplicación por atlas/VFX/oclusiones. Torres y soldado unidos al mismo suelo/pad con sombras.

## 5. PERSONAJES, ALIADOS, ENEMIGOS y JEFES
- 2D cartoon expresivo, anatomía simplificada creíble y reconocible; proporciones con cabezas/manos/armas estilizadas solo dentro de una guía común. No cambiar rig ni hitbox por una mejora cosmética sin autorización.
- Identidad por arquetipo: infantería, francotiradores, enemigos escudados/voladores/sanadores/resistentes y jefes distinguibles por silueta, paleta, movimiento, efectos y telegraph, incluso con varias unidades simultáneas.
- Colores aliados/enemigos y estados visuales diferenciados; outline y sombras de contacto; los proyectiles provienen del arma/habilidad real.
- Jefes: formas épicas y expresivas del mismo universo cartoon; no fotorealismo, monstruos genéricos 3D ni escala que borre caminos/pads.

## 6. ANIMACIONES y VFX
- Animación 2D con poses claramente legibles: idle, desplazamiento, preparación, golpe/disparo, reacción, muerte; prioridad de anticipación/contacto/recuperación y lectura en movimiento.
- VFX originales cartoon (flash, trazos, humos, magia, hielo, fuego, ácido, impactos, escombros) mediante formas sólidas/siluetas y timings breves; **no llamaradas realistas, partículas fotográficas ni shaders excesivos**.
- Ambientales separados: molino, viento, hojas, agua, espuma, cascadas, niebla, nieve, lava; no saturar la batalla. VFX ligados a eventos autoritativos, no generan daño ni duplican ataques.
- Presupuesto GPU: pooling, atlas, pocos drawcalls, niveles de detalle y opciones de reducción; mediciones reales donde haya efectos en vivo.

## 7. HUD, iconografía y sonido
- HUD 2D cartoon de juego premium, de la misma familia cromática/contornos/profundidad; botones y paneles legibles, jerarquía táctil y estados claros, sin superposición con escenas.
- Iconos de torres, ramas, habilidades, monedas, vidas y oleadas ilustrados con la misma gramática; accesibilidad y contraste verificables.
- Sonido y música coherentes con tono de fantasía militar estilizada, originales/licenciados, mezcla clara, controles de volumen. La decisión artística **NO** autoriza implementar audio/HUD en un bloque de mapas.

## 8. Pipeline de diseño a implementación
1. **Mockup original aprobado por Dirección** y si aplica spritesheets/atlases separados por el equipo artístico; no inventar assets inexistentes.
2. Codex revisa dimensiones, pivotes, profundidad, alpha, siluetas, escala, licencias y rutas fuente. Archivo visual de referencia debe estar accesible; si no, pedir adjunto, no adivinar.
3. **Un bloque, un objetivo**: solo mapa o torre o actores o VFX o HUD. No reescribir oleadas/combate/economía mientras se pinta un mapa.
4. Recrear la fidelidad usando módulos y assets originales reales dentro de Phaser; un dibujo generado o un mockup no equivale a sprites editables ni a geometría de gameplay.
5. Captura runtime en escritorio y móvil horizontal, comparativa al mockup de estilo, prueba de continuidad de caminos/pads y regresión de escenas. Reportar qué se ve distinto y por qué.
6. Integrar por PR y reglas de publicación vigentes; link oficial solo cuando despliegue esté verificado.

## 9. Puerta de calidad (aceptación humana)
- [ ] Se reconoce **cartoon 2D premium** antes que pintura/render/colaje.
- [ ] Contornos y masas de color coherentes en mapa, torres, personajes y VFX.
- [ ] Profundidad real estilizada: alturas, sombras, anclajes, oclusión sin props flotantes.
- [ ] Camino y pads bien integrados, sin ocultación, seam ni errores de escala.
- [ ] Belleza **y** lectura de mapa interactivo en PC y móvil horizontal.
- [ ] Referencia respetada sin copiar terceros ni usar la imagen como fondo final.
- [ ] Gameplay canónico, QA y vínculo LIVE preservados cuando no son objeto del bloque.
- [ ] Dirección General aprueba visualmente cada pack antes de extender el rework.

**Regla de precedencia:** este canon aprobado el 23/10/2026 prevalece sobre todo mandato de «M03 pictórico como estándar final» previo. La continuidad funcional y demás normas de AGENTS.md siguen vigentes.
## Fidelidad obligatoria — actualización de Dirección 27/10/2026

Rige la sección «NORMA DE FIDELIDAD A MOCKUPS APROBADOS» de [AGENTS.md](../../AGENTS.md). El mockup exige alta fidelidad de riqueza, densidad, masas, relieve y acabado. La técnica cartoon por planos y la optimización modular no autorizan simplificar el diseño aprobado. La geometría funcional permanece protegida; cualquier reducción artística requiere orden expresa.
