# [M] RFC-M01-01 — Adaptador de sockets y estratificación visual

**Estado: PROPUESTA DEL EQUIPO M · NO CAMBIO DE CONTRATO EFECTIVO**  
**Dirigido a:** Dirección General / Integrador técnico.  
**Base:** PM-03 C0, `map-socket-v1`, branch `feature/phaser-mapas`.

## Interfaz cuya implementación central se solicita

1. `getMapSockets(1)` desde adaptador **central**, readonly: ocho objetos estables, `socketId=m01-pad-01…08`, `legacySpotIndex=0…7`, `world{x,y}`, `footAnchor`, `visualOffset`, `interactiveRadiusWorld`, `footprint.radiusWorld` (**core a ratificar**), `metadata.kind/role`, estados occupied/ruined/selected.
2. `getPathRoutes(1)` desde adaptador central: la ruta exacta de 133 nodos del JSON canónico con inicio (−32,342), salida (1312,400); el proyecto visual no devuelve un trazado alternativo.
3. `onSocketVisualState(socketId, visualState)`: evento visual desacoplado. M modifica solo selección/iluminación de pad y densidad/alpha de props; T/core conserva compra, costos, nivel y torre.
4. Capas aprobadas con z-sorting de actores del integrador: `terrain`, `path`, `terrain-props-low`, `pad-foot`, `tower-base`, `actors-by-footY`, `combat-vfx`, `screen-status`, `HUD`. Nuestros elementos `worldPropsBack/worldPropsFront` requieren mapping central, no imponemos orden global.

## Fixture M-01 (no API central)

La vitrina usa temporalmente `visualSocketPreview(map)` solo para mostrar coordenadas. Las posiciones se derivan del `maps.v5.json` oficial, **sin introducir IDs en el JSON ni modificarlo**. `radiusWorld=null` por requerir aprobación del core; `interactiveRadiusWorld=54` solo por compatibilidad con el visor legado, no collider.

| ID candidato | X | Y | Campo fuente |
|---|---:|---:|---|
| m01-pad-01 | 96 | 480 | spots[0] |
| m01-pad-02 | 416 | 480 | spots[1] |
| m01-pad-03 | 672 | 544 | spots[2] |
| m01-pad-04 | 736 | 352 | spots[3] |
| m01-pad-05 | 992 | 224 | spots[4] |
| m01-pad-06 | 992 | 544 | spots[5] |
| m01-pad-07 | 1120 | 608 | spots[6] |
| m01-pad-08 | 1184 | 352 | spots[7] |

## Preguntas abiertas

- ¿`footprint.radiusWorld` de la familia Infantería I/II y Francotiradores I/II? No derivar desde sprite o hit radius.
- ¿Cómo registrar `visualOffsetWorld` de la torre respecto al basamento sin mover el socket?
- ¿Qué regla de occlusión aplicar a copa alta y sombra en el mismo tile si pasa un actor de P?
- ¿Se aprueban IDs `m01-pad-01...08` y qué alias stable requiere el sistema de guardado?
- ¿Cómo inicializar estado visual ocupado/ruinas/selección desde core sin evento duplicado?
- ¿Recomendación de GPU memory budget y escala art Dpr2 con modo móvil landscape?

**No se solicita cambiar geometría, economía, tower ownership, ni escenas compartidas.** La vitrina facilita revisión de M01 previo a la integración.
