# MAP_SOCKET_CONTRACT — v1
**Responsable:** Equipo M (escena y terreno). **Consumidores:** T, P, Integrador.
**Estado:** norma de coordinación v1; adaptador de runtime por implementar.

## Fuente de verdad
- Rutas, entradas y plataformas canónicas: public/official/data/maps.v5.json. No duplicar coordenadas en módulos artísticos.
- M01 contiene 133 puntos path y 8 spots, con coordenadas heredadas `cx,cy` enteras en cuadrícula de 64 unidades. Fórmula verificada en el visor actual: `worldX = cx*64+32`, `worldY = cy*64+32`; esta fórmula debe ir en un adaptador central, no repetirse en T/P.
- Escala de diseño actual: mundo Phaser M01 1280 × 768, `Phaser.Scale.FIT` en el visor; el tamaño de pantalla y el ratio móvil no alteran coordenadas mundiales.
- No cambiar 133 vértices ni 8 pads para rework meramente artístico. PH02B redujo SOLO el grosor visual del sendero de 126 a 110 (~12.7 %), manteniendo su línea central.

## Propuesta de interfaz de consumo
```json
{
  "contractVersion": "map-socket-v1",
  "mapId": 1,
  "socketId": "m01-pad-01",
  "legacySpotIndex": 0,
  "world": {"x": 96, "y": 480},
  "layer": "tower-foot",
  "footAnchor": {"x": 0.5, "y": 1},
  "footprint": {"radiusWorld": "DETERMINAR_POR_CORE"},
  "interactiveRadiusWorld": 54,
  "blockedForBuild": false,
  "metadata": {"role": "Intercepción del primer recodo", "kind": "tempo"}
}
```
`socketId` es identificador ESTABLE PROPUESTO para el adaptador, no nuevo campo ya existente en maps.v5.json. `interactiveRadiusWorld=54` corresponde a selección provisional actual del visor; no constituye collider definitivo.

## Reglas de ownership
- M puede producir sprites/texturas de suelo, camino, vegetación, props, ruinas visuales, sombra de pads y fondos de sus mapas en su carpeta aislada.
- M NO ajusta rutas, pathfinding, colisiones, posiciones canónicas, buildability, visibilidad de torres ni eventos core de otras familias sin revisión central.
- T posiciona torre usando socket y su `footAnchor`, no `cx,cy` heredado. Si T requiere margen o elevación, solicitar `visualOffset` documentado sin mover el socket.
- P consume posiciones mundiales, nivel de suelo, orden de dibujo y ruta core, nunca anima enemigos sobre caminos alternativos inventados.
- El entorno debe contemplar oclusiones: objetos altos pueden tapar brevemente unidades con lógica de alpha/foreground cuando se especifique; deben quedar visibles barras HP/escudo.
- El mapa no coloca torre por cuenta propia ni gasta oro.

## Orden de capas conceptual (se hará enum único en Integrador)
`terrain < path < terrain-props-low < pad-foot < tower-base < actors-sorted-by-footY < combat-vfx < screen-status < HUD`.
Decoración frontal/oclusiones requiere clasificación, no un valor z fijo improvisado. Orden efectivo se validará en escena.

## API candidata (sin implementación asumida)
`getMapSockets(mapId): readonly MapSocket[]` desde core.
`getPathRoutes(mapId): readonly Route[]` desde core.
`projectWorldToScreen(point, viewport): point` desde integración.
`onSocketVisualState(socketId, occupied/ruined/selected)` por evento de lectura.

## QA
- 8/8 pads con IDs únicos y coords constantes en M01; 133/133 vértices iguales a datos V5.
- Selección táctil verificable dentro de pantalla, sin tapar HUD/safe areas.
- Camino artísticamente legible al reducir grosor; los actores siguen el centro de ruta original.
- No colisiones, detección o costos creados por visuales.
- Todo cambio de distribución física de caminos/pads exige aprobación de Dirección y nueva revisión de balance; no confundir rework gráfico con rework geométrico.
