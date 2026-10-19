# SEMANTROPIC TD — P-02: BIBLIA VISUAL Y RFC A TORRES
19 de octubre de 2026 | Equipo P | Rama feature/art-p02-personajes
Estado: PROPUESTA DE ARTE (NO APROBADO PARA PRODUCCIÓN)

## 1. Autoridad y estado
Base exacta: P-01 commit e1cfc075dfbddb61691ff156860a59ee25cd6f27.
Destino PR: feature/phaser-personajes. Nunca fusionar C1-A, integration/phaser ni main unilateralmente.
Actor Visual, Tower Visual, Asset Manifest y Combat Events v1 son normas, no adaptadores runtime certificados.
La ilustración conceptual realizada con IA de OpenAI durante este encargo es REFERENCIA, no atlas funcional ni material ya incorporado a GitHub. El render experimental de P02 es fuente editable que complementa P01. No se debe afirmar equivalencia entre arte conceptual pintado y frames procedurales.
No usar sprites de franquicias ajenas, capturas comerciales o texturas sin derechos.

## 2. A/B: escalas y dirección de producción
A: TÁCTICA COMPACTA, 94% de altura P01 provisional, menos ruido de ornamento, contraste legible con horda móvil; candidata de trabajo para gameplay.
B: ILUSTRADA EXPRESIVA, 108% de altura P01 provisional, volumen, material asimétrico, distintivos ampliados; candidata para zoom y aprobación estética.
Estas escalas NO modifican ruta, posiciones, collider, velocidad ni mecánica.
Mundo objetivo de referencia 1280x768, camino visual 110u, M01 133 nodos y 8 pads. Requiere prueba con torres I-II reales y sus plataformas.

| Actor | P01 altura ref. | A propuesta | B propuesta | Lectura mínima |
| --- | ---: | ---: | ---: | --- |
| warrior | 91u | 85.54u | 98.28u | torso enorme + hacha recuperada, no confundir con soldado |
| hound | 67u | 62.98u | 72.36u | cuatro patas + lomo bajo + colmillos |
| infantry_recruit | 88u | 82.72u | 95.04u | escudo + espada + casco ligero |
| sniper_operator | 80u | 75.20u | 86.40u | rifle de largo alcance + visor + capa, no escudo |

A/B no son canónicas hasta aprobación. Recomendación inicial: A para gameplay 1x en móvil y B para acabado y difusión si no interfiere con torres.

## 3. Personajes
WARRIOR: masa pesada bípeda, cuellos cortos, arma separada del rostro, hombrera asimétrica reciclada de material alienígena, cicatrices y ojos leíbles. El walk requiere transferencia real de peso/contrapeso. La sobrepintura P02 agrega placas y mineral, pero la biomecánica principal aún hereda P01: DEUDA ARTÍSTICA.
HOUND: cuatro extremidades verificables, columna flexible, cabeza adelantada y arnés distintivo, sin apariencia de masa triangular. Walk a 12 FPS es cue visual, no aumento de velocidad de core. El arte procedural conserva parte de la locomoción original: DEUDA WALK/RUN.
RECLUTA: casco, placa, tabardo, espada y escudo. A aporta defensa legible; B aumenta penacho/garganta/metal. Rol básico, no héroe ni unidad de nivel IV. Blocking solo desde core.
SNIPER: capas de reconocimiento y visor, rifle largo y postura estable sin confundirlo con el soldado. Equipamiento P02 marca un cue visual; el VFX del cañón/trazador pertenece exclusivamente al Equipo T. Ningún frame dispara daño.

## 4. Estados visuales, frames y FPS propuestos
Todos heredan metadata P01: idle 4, walk 8, attackWindup 3, attack 5, hit 3, blocked 3, die 6: 32 frames por atlas. 176x208 por celda, atlas 1408x832.
| Actor | idle | walk | windup | attack | hit | blocked | die |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| warrior | 5 | 9 | 9 | 12 | 13 | 9 | 9 |
| hound | 5 | 12 | 10 | 13 | 13 | 10 | 10 |
| infantry_recruit | 4 | 9 | 9 | 12 | 12 | 8 | 9 |
| sniper_operator | 5 | 8 | 9 | 11 | 12 | 8 | 8 |

Fps propuestos (no canon). P01 original E/W espejado, N/S requieren costo/beneficio formal antes de producción.
La vitrina regresa de eventos visuales no-loop a idle con un hold breve, NO es Combat Events Bridge ni máquina core.
Foot anchor: (0.5,0.92). Sombra: (0.5,1). Orden de dibujo por Y del pie.
Sombra independiente; collider nunca derivado de silueta.
HP roja arriba de cabeza y barra escudo plateada aún más arriba son solamente sugerencias de offset. HUD y valores pertenecen al core.

## 5. RFC-P02-TP01: operador sniper y soldado
P entrega IDs exactos visuales sniper_operator e infantry_recruit y claves Phaser de la variante seleccionada.
El Equipo T define el operatorAnchorWorld en torre sniper I/II y el mundo/plataforma. P no mueve el pad ni la estructura T.
Cue de arma normalizado PROVISIONAL sniper: (0.81,0.45) de la celda fuente, necesita acordarse según boca de fuego real T.
T dibuja arma de torre, proyectiles y VFX; P dibuja postura y gesto del operador, sin disparar evento lógico ni muzzle flash redundante.
Core decide spawn, ID de instancia, bloqueo, HP, daño, cooldown, muerte y recompensa.
Cualquier flotación/oclusiones se responde con ticket de compatibilidad; nunca corregir modificando towers/camino/core desde P.

## 6. Inventario de clases visuales para 18+3 (SIN AUTORIZACIÓN DE PRODUCIR)
Básicos: warrior, archer, demolisher, ash, weaver (siluetas de arma/función).
Veloz: hunter, hound, foreststalker, froststalker (piernas, masa baja, aceleración visual).
Tanques: brute, volcanicgolem, eclipseknight (masa robusta y alto contraste).
Escudados: shieldbearer, runesentinel (escudo plata visible; barras reales core).
Apoyo/sanación: shaman (gestos de soporte; revivir no crea oro).
Voladores: bat, drone (altura visual/sombra; no bloqueo terrestre).
Tirador a distancia: aliengunner (arma claramente ajena a aliado; no disparo propio).
Bosses: mistlord M05 W13; ruinwarden M08 W19; eclipseemperor M10 W23.
Estas son CLASES ARTÍSTICAS, no estadísticas ni 18+3 sprites creados ahora.
El catálogo y las 140 oleadas oficiales no se modifican.

## 7. Memoria y exportación
Un atlas P02 1408×832 RGBA8 ocupa 4.47 MiB estimados sin overhead.
La comparativa P01/A/B para un actor ocupa 13.41 MiB; la vitrina destruye texturas antiguas al cambiar de sujeto.
Los 8 atlas de los 4 actores A/B residentes costarían unos 35.75 MiB: evitar precarga móvil.
La galería permite exportar PNG; NO existen PNG exportados/versionados finales en este PR.
SHA256 y canal alpha deben verificarse sobre los bytes reales antes de aprobación.

## 8. QA y compuerta de Dirección
[PENDIENTE] Capturas browser 1280×768, 844×390, 932×430; WebGL2, dispositivos físicos y FPS.
[PENDIENTE] PNG alpha real y clipping de casco/hacha/rifle.
[PENDIENTE] Calidad visual frente a tres láminas IA, diseño original manual reproducible pose-a-pose.
[PENDIENTE] Compatibilidad real operatorAnchor de torre I/II T.
[PENDIENTE] Aprobación explícita variante A/B y escala por Dirección.
[CONFIRMADO COMO ALCANCE DE CÓDIGO] Solo rutas de propiedad Equipo P; sin edición de core/maps/towers/Render.
