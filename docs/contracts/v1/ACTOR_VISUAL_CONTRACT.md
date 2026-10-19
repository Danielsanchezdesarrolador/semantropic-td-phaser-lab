# ACTOR_VISUAL_CONTRACT — v1
**Responsable:** Equipo P. **Consumidores:** Integrador/core, Equipo T (operadores).
**Estado:** especificación de vista/animación, NO prueba de atlas completos.

## Inventario reconocido
18 arquetipos no-jefe identificados en campaign140.v5.json:
`warrior`, `archer`, `demolisher`, `shieldbearer`, `brute`, `hunter`, `ash`, `bat`, `shaman`, `weaver`, `hound`, `foreststalker`, `aliengunner`, `drone`, `runesentinel`, `froststalker`, `volcanicgolem`, `eclipseknight`.
3 bosses: `mistlord` (M05-W13), `ruinwarden` (M08-W19), `eclipseemperor` (M10-W23).
Los bosses están declarados; fases/IA real NO portadas todavía al Phaser PH01.
Primer lote: warrior, hound, Soldado Recluta y operador Sniper. Ninguna demo scout/seer de T3B se convierte automáticamente en actor oficial.

## Datos de visualización PROPUESTOS
```json
{
  "contractVersion":"actor-visual-v1",
  "actorInstanceId":"core-generated-id",
  "actorId":"warrior",
  "faction":"enemy",
  "role":"melee",
  "locomotion":"ground",
  "atlasKey":"actors/enemies/warrior/v1",
  "positionWorld":{"x":0,"y":0},
  "facing":"E",
  "footAnchor":{"x":0.5,"y":0.92},
  "shadowAnchor":{"x":0.5,"y":1},
  "state":"walk",
  "overlay":{"hpCurrent":null,"hpMax":null,"shieldCurrent":null,"shieldMax":null}
}
```
Claves/estados requieren adapter. No deducir stats reales desde assets. `facing` E/W es candidato inicial; ampliar direcciones solo si evidencia lo exige y se aprueba.

## Separación visual/collider
- Core gobierna ruta, posición, velocidad, HP, escudo, daño, ataques, estados, bloqueo, fuga, muerte, resurrección, target y rewards.
- P gobierna ONLY sprites/atlases, rig/ciclos y reacciones VISUALES a eventos, marcador de sombra, telegraphs asociados a actores, ilustraciones de bosses.
- Pivot al pie y sombra estable; ordenar depth desde la coordenada de pie, no centro de sprite.
- Render y collider deben ser distintos; tamaño visual no modifica balance.
- No reiniciar ciclo de animación cada tick.
- La imagen/hit flash no actualiza HP.

## Animaciones y estados a soportar
idle, walk, attackWindup, attack, hit, blocked, stun, die, escape, resurrect y bossTelegraph; implementar solo los soportados por gameplay actual, usando fallback explícito donde no haya atlas. Cada animación especifica frames, velocidad, loop, orientaciones y evento que la activa.
- Voladores no bloqueados como terrestres.
- Shield bar plateada colocada encima de HP roja, legible sobre VFX.
- La resurrección no genera duplicación de oro ni nuevos IDs de spawn arbitrarios.
- Un mismo actor muere o escapa una sola vez.

## Relaciones con Torre T
T solicita operador/visual de soldado desde id de actor P, define su posición local de soporte. P entrega atlas y anclaje. Core instancia y autoriza despawn, bloqueo, pérdida de HP y respawn. T no altera directamente state machine del actor.
Los soldados I–IV se ajustan a catálogo E5 y a discrepancia de conteo de Infantería III sin fabricar un número arbitrario.

## QA y entregas
- Spritesheets/atlas editables + imágenes fuente originales (nunca assets de terceros sin permiso), manifest de licencia/origen.
- Vitrina aislada con sprite en escala y escenario reales M01; warrior/hound/recluta/operador.
- Pruebas de dirección, anclajes, sombra, pausa, destrucción, overlays y recuperación.
- Los tres bosses requieren telegraph/fases gobernados por eventos reales antes de considerarse portados.
