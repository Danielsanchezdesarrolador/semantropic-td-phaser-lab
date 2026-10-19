# T-03 — Biblia artística premium (PROTOTIPO)

## Paleta y gramática visual

Arquitectura original militar-fantástica-tecnológica 3/4, luz cálida izquierda y sombra a la derecha. Piedra gris cálida #bdbbb0, acero #91a8a8, madera #b08252, bronce #dfb77d, tejado azul #315572, óptica teal #76cad0. En móvil priman silueta, volumen y remates grandes; detalle fino subordinado.

## Cuatro torres

Infantería I: cuartel compacto y bajo, techo volumétrico, portal visible, herrajes y suministros. Infantería II: torreón almenado superior, doble estandarte, escudos y portal ampliado, robustez significativamente mayor.

Francotiradores I: vigía de madera elevado, X de refuerzo, escalera, plataforma abierta y óptica pequeña. Francotiradores II: gran mirador elevado piedra-acero, parapeto abierto, antena/visor teal calibrado; operador P se monta sobre slot, no dentro de la textura.

## Dimensiones propuestas (FUENTE 360x420 px; no colisiones)

INFANTRY 1: 99.36 world units ancho LIENZO, 115.92 world units alto LIENZO, scale 0.276; pie 0.5/0.93; salida {"x":140,"y":348,"units":"source-px"}; operador {"x":138,"y":319,"units":"source-px"}; muzzle {"x":183,"y":248,"units":"source-px"}; sombra {"x":183,"y":388,"units":"source-px"}.

INFANTRY 2: 106.56 world units ancho LIENZO, 124.32 world units alto LIENZO, scale 0.296; pie 0.5/0.93; salida {"x":145,"y":354,"units":"source-px"}; operador {"x":143,"y":328,"units":"source-px"}; muzzle {"x":183,"y":209,"units":"source-px"}; sombra {"x":183,"y":388,"units":"source-px"}.

SNIPER 1: 109.08 world units ancho LIENZO, 127.26 world units alto LIENZO, scale 0.303; pie 0.5/0.93; salida null; operador {"x":190,"y":155,"units":"source-px"}; muzzle {"x":279,"y":149,"units":"source-px"}; sombra {"x":183,"y":388,"units":"source-px"}.

SNIPER 2: 114.12 world units ancho LIENZO, 133.14 world units alto LIENZO, scale 0.317; pie 0.5/0.93; salida null; operador {"x":191,"y":146,"units":"source-px"}; muzzle {"x":301,"y":146,"units":"source-px"}; sombra {"x":183,"y":388,"units":"source-px"}.

Anchors salvo pie en source-px; worldScaleProposal NO aprobada y no equivale a radio de footprint. Necesario superponer con pad real M01 (8 pads) y actor P, sin mover coordenadas canónicas.

## Estados e intención VFX

Idle pulso leve, target/acquire retícula, windup brillo de lente, fire fogonazo, recoil vibración pequeña, recover reposo, upgrade A flash/polvo o B planos luminosos. Ruined no implementado. Señal Infantry no crea unidades. Sniper 5 beats: acquire→windup→flash→tracer→impacto VISUAL, sin aplicar daño.

## Vitrina y gate artístico

Vitrina independiente con comparativa antes/después contra cuatro baseline SVG, zoom 1.0 y 1.35, escala mundo provisional y anclajes. Se requiere captura verdadera a 1280x768, 844x390 y 932x430, fondo césped claro/oscuro y prueba con operador/soldado P. No hacer merge ni integrar combate sin aprobación central.

## Canon protegido

M01 Infantería/Sniper I-II solamente. Sin Guardiana/Bombardera/Control ni III-IV. Infantería III número de soldados (2 vs 3) queda PENDIENTE. Core posee daño, oro, IA, bloqueo, cooldown, upgrades y guardado.
