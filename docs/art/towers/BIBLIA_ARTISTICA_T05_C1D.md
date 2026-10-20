# T05 / C1-D — Biblia de arquitectura profunda y siluetas

## Decisión de arte NO definitiva

Recomendar dirección **A** como candidato primario a evaluación C1-D. Razón: silueta funcional e identidad de familia inmediata (barracks y vigías), puertas y plataformas legibles; el observatorio B semicubierto necesita mayor control de oclusión con P04. B se conserva como fuente de exploración real, no recolor.

## Identidad ficticia

Guardia humana del Amanecer defendiendo la Tierra con piedra local, vigas de madera, acero militar teal, insignia propia de estrella de protección, bronce de mando discreto. Su tecnología sugiere logística y óptica/precisión sin parecer hechizos ni iconografía comercial ajena. Diseño manual vectorial original con alternancia fuerte luz/sombra, grano de madera, desgaste tallado y facetas de piedra.

## Cuarteles A I→II

Nivel I: nave robusta de mampostería con acceso hundido y puerta doble, tejado irregular de dos faldones, armería lateral funcional, luces y suministros. Nivel II: terraza elevada de entrenamiento, barbacana y portón reforzado; marcas de disciplina, bandera adicional, armas organizadas. Progresión por función y masa, no solo color. Evitar interpretación como castillo genérico usando herramientas militares y techo/cubierta angular.

## Cuarteles B I→II

Refugio/hangar semicurvado de protección de tropas, gran compuerta tecnológica, arriostres semicirculares. Nivel II introduce dos bastidores laterales más altos y señales tácticas. Otra estructura real, no una variante de saturación.

## Vigía A I→II

I: plataforma realmente elevada de madera reforzada con X estructural, escalera parcial y toldo angulado trasero; arma/óptica sobre soporte. II: estabilizadores, segundo brazo tecnológico y observatorio de precisión, sin cerrar zona de actor P. En ambos la barandilla frontal es un SVG aparte, listo para componer delante SOLO de los pies/cuerpo bajo del operador.

## Vigía B I→II

Observatorio semicubierto bajo caperuza curva, base robusta y puesto de tiro estabilizado; II agrega módulo óptico vertical superior y contrafuertes asimétricos. Su riesgo: caperuza ocluye cabeza del operador; verificar antes de elegir.

## Luz, valor y lectura

Iluminación dominante noroeste alto; tejados y piedra exterior reciben claros cremados, flancos derecho/trasero usan azules piedra profundos; acero con reflejos restringidos, madera con veta simplificada y gruesa. La microtextura existe como jerarquía terciaria y puede desaparecer a bajo tamaño sin perjudicar la silueta.

## Capas compositor

Se preserva `TOWER_ART_V2` y la API original, con `meta.layerAssets` y `getTowerVisualLayers` opcionales. Cada dirección A tiene master compuesto más shadow/back/front SVG separados y alineados todos al mismo viewBox/pivote; B dispone de master fuente editable completo. El sprite P04 pertenece a P y no ha sido modificado.

## Animación/VFX

Respiración sutil de luz ubicada en salida de Infantería u óptica de Sniper, no jitter de edificio/sockets. VFX Sniper conserva acquire/windup/fire/travel/impact con eventos idempotentes y trazador de cola corto; deploy de Infantería solo una señal. Efectos no compran, generan soldados, dañan ni seleccionan enemigos del core.

## Estado comercial

Estas ilustraciones siguen siendo prototipos vectoriales revisables. No existe atlas PNG aprobado ni prueba WebGL2 T05 en navegador real, y no debe declararse acabado pictórico comercial definitivo. El usuario solicitó salto visual; la calidad final requiere capturas, retoque pictórico si necesario y autorización del Director.
