# MAP-ART-05-CARTOON-V1 — Pantano de la Niebla

Orden del Director: TXT `SEMANTROPIC_TD_CODEX_M05_PANTANO_CARTOON_2D_PREMIUM_2026-10-26.txt` y mockup adjunto en la conversación, 26/10/2026. Base real de producción: `46163f313b6f0abc08ca59a466cdbf1da62d6087`. Rama: `art/m05-cartoon01`. Versión de arte: `m05-cartoon01-misty-marsh-art-v1`.

## Estado y alcance

**Solo preview artístico aislado. M05 NO está jugable.** No se crea `scene-m05.mjs`, no se abre el selector ni se importan combate, economía, campaña, enemigos, jefe, guardados o HUD. Los nueve pads son representaciones de las posiciones existentes en datos; no se certifica construcción funcional de M05. M01–M04, el núcleo común, datos, AGENTS, roadmap, dependencias y lockfile quedan intactos.

En la base publicada no existe renderer de M05 ni escena jugable. **No hay un «antes» de M05 en Phaser; no se fabrica una captura anterior.** El mockup orienta acabado, no la geometría ni los contadores. Sus 410 de oro y onda 1/10 no se incorporan al preview.

## Arte modular

Máscara de islas y márgenes de tierra, agua verde-turquesa con nenúfares, caras de roca extruidas 44 unidades por debajo del terreno, coronas de césped, sombras de costa y dos manantiales/cascadas estáticos con poza de origen y cuenca visible. Caminos y plataformas tienen capas independientes. Robles pantanosos originales con raíces/musgo/faroles, robles jóvenes de la familia M02, ruinas con runa, juncos/setas/flores, troncos, restos arqueológicos y puesto de madera sobre pilotes. La choza es decoración, no torre ni tienda. Niebla estática muy tenue sobre agua, sin tapar el camino. No hay animaciones, partículas nuevas ni audio.

Un PNG fuente nuevo original de 1536×1024 RGBA contiene seis componentes aislados. Se incorpora únicamente el roble del atlas M02; no se registran molino, casas agrícolas ni cultivos. Atlas preparado una vez: 2048×640, siete frames. Densidad mínima comprobada: 1,8 píxeles fuente por unidad mundo para props. Suelo y roca genéricos M02 se leen sin modificar. El mockup no se utiliza como fondo ni como recorte.

La máscara define suelo y soporte de raíces/pads; su extrusión genera las caras de roca sobre el agua. Se verifican 15.360 posiciones entre alpha del suelo renderizado y máscara de soporte, además de raíces, huellas de pads y cuencas. Los márgenes FIT contienen solo terreno genérico: no reflejan plataformas, props o cascadas particulares. Preparación y caché al montar; ninguna textura se crea por frame. El preview descarga sus objetos y texturas al reiniciar la escena.

## Camino y pasos de madera

**307 waypoints y nueve centros de pad intactos.** Ancho exterior nominal de 62 unidades mundo, interior de 57. Una pasada binomial visual y 306 segmentos cúbicos con continuidad C2; no se escribe en la ruta canónica. Medición de 15.606 muestras: desviación máxima **0,636449 unidades**, radio mínimo **78,887438 unidades**. Offsets sin autointersecciones en 612 muestras por lado. Remuestreo por longitud de arco aproximada a intervalos regulares de 4 unidades: 593 estaciones; longitud visual 2364,797792 unidades. La longitud visual no modifica ningún tiempo de viaje del core.

Tres cruces escénicos se adaptan a los puntos existentes 60, 124 y 254, sin crear ni mover nodos. Los tableros usan el mismo eje y ancho que el sendero. Sus extremos y dos laterales por extremo se comprueban sobre tierra; los postes y guardas dejan acceso junto a pads. El tercer cauce se ajustó al detectar que un extremo no tenía apoyo. Los centros no proceden del recorrido ilustrativo del mockup ni habilitan nuevas rutas funcionales.

Se usan la misma pintura y las mismas tangentes para el camino central y su prolongación visual 2.200 unidades fuera del viewport. El preview de QA permite `?overlay=1`: dibuja los 307 puntos autoritativos y las nueve plataformas, incluidos los extremos en márgenes de un viewport ancho. La vista normal no muestra ese overlay.

## QA y evidencias

- [PASS] Node: alcance exclusivo de M05, datos/selector protegidos, geometría C2, curvatura, desviación, offsets y remuestreo por arco. [Geometría](road-geometry.json).
- [PASS] Build con Phaser 4.2.1, sin dependencias nuevas.
- [PASS] Chromium/WebGL2 local: PC 1280×768, móvil 844×390 y 932×430 DPR 2; nueve pads asentados, todos los tipos de prop, soportes de puente y cascada, densidad de sprites, alpha de terreno, ausencia de gameplay y animación, resize/FIT y descarga/remontaje sin acumulación de objetos/texturas. [Informe](qa-local.json).
- [PASS] Carga de M01, M02, M03 y M04 con sus versiones anteriores y sus puntos/pads; selector sigue mostrando solo 1–4. M05 no se carga como recurso del juego existente.
- [PENDIENTE AL REGISTRAR] CI del PR, integración y verificación pública del preview. El PR y el informe de entrega registrarán el resultado final. No anunciar preview publicado antes de comprobarlo.
- [NO EJECUTADO / NO AUTORIZADO] Construcción, movimiento enemigo, combate, economía, 13 oleadas o jefe de M05. Datos preservados no equivalen a gameplay implementado.
- [NO EJECUTADO] Móvil físico, FPS/VRAM de hardware.
- [PENDIENTE] Evaluación artística del Director. No se inicia integración funcional ni MAP-ENV-05 sin otro bloque.

Capturas: [PC](desktop.png), [móvil](mobile.png), [overlay de ruta/pads](overlay-307-waypoints-9-pads.png), [referencia M02 en ejecución](reference-M02.png). La última terminación de remansos es cosmética y conserva la geometría del smoke local; CI y capturas públicas validarán el HEAD publicado.

Diferencias deliberadas frente al mockup: la ruta real serpentea hacia el recodo sur y después sube a la espiral oriental antes de salir abajo a la derecha; se conserva, en lugar de trasladar su S ilustrativa. Los nueve centros reales incluyen dos plataformas próximas al borde inferior. La vegetación y aguas se adaptan a esa disponibilidad de suelo; no se copian su layout ni los contadores ficticios. Los faroles y la bruma permanecen estáticos. El mockup se recibió como imagen de conversación, sin ruta binaria disponible en este bloque; no se inventa un enlace de archivo.

## Integridad, publicación y rollback

[Manifiesto de producto y fuentes protegidas](manifest.json). En datos siguen existiendo 430 de oro, 13 oleadas y 110 enemigos de grupos `[6,6,8,8,11,7,8,8,9,10,10,9,10]`, slot `map05_wave13` y ocho tipos. No se interpreta el campo legacy `lives=20` ni se asignan vidas a un runtime inexistente.

Preview previsto en el MISMO sitio: `/official/src/maps-visual/m05/preview/`. Es una vista artística estable, no otro sitio público ni una versión jugable del selector oficial. Enlace entregable solo después de QA, despliegue y comprobación de versión/archivos públicos. La URL de juego `/official/src/live/` conserva M01–M04.

Rollback: revertir el merge de este bloque; solo desaparecen los archivos del preview M05, herramientas y documentación de arte. Los módulos de gameplay existentes no cambian. Esperar evaluación visual antes de otro subsistema.
