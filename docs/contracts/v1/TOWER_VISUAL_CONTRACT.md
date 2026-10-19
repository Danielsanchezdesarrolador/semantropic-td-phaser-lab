# TOWER_VISUAL_CONTRACT — v1
**Responsable:** Equipo T; integración de eventos/core por Integrador. **Consumidor de actores:** Equipo P.
**Estado:** especificación de assets/interfaz, todavía no conectada a gameplay.

## Catálogo y restricciones
Cinco familias: `infantry`, `sniper`, `guardian`, `bomber`, `control`. I–III comunes; IV con dos ramas canónicas por familia; habilidades y rangos toman datos Canvas V5 revisados. `control` máximo una unidad por partida; invocaciones/operaciones activadas MANUALMENTE. Para otras torres, habilidades compradas activan automáticamente según reglas reales.
- infantry: IV `royal` Caballeros Reales / `lancer` Lanceros de Élite.
- sniper: IV `precision` / `assault`.
- guardian: IV `elemental` / `bastion`.
- bomber: IV `heavy` / `tech`.
- control: especializaciones aéreas/terrestres, operaciones equipables; verificar identificadores EXACTOS en Canvas antes de fijarlos como claves.
M01 desbloquea SOLO Infantería hasta II y Francotiradores hasta II. Visuales de Control y demás familias no se consideran desbloqueados por existir assets.

**DISCREPANCIA ABIERTA:** Auditoría T indica Canvas V5 I=1, II=2, III=3, IV=3 soldados Infantería; documento PM-03 antiguo indica III=2. Usar V5 como referencia efectiva para implementación existente; NO fabricar atlas finales de Infantería III ni reformular mecánica hasta resolver formalmente.

## Interfaz de vista PROPUESTA
```json
{
  "contractVersion": "tower-visual-v1",
  "towerInstanceId": "core-assigned-unique-id",
  "family": "infantry",
  "level": 2,
  "branch": null,
  "socketId": "m01-pad-01",
  "render": {"atlasKey": "towers/infantry/level-2", "footAnchor": {"x": 0.5, "y": 1}, "visualOffsetWorld": {"x": 0, "y": 0}, "scalePolicy": "world-not-screen"},
  "visualState": "idle",
  "operatorSlots": [{"slotId": "soldier-spawn-01", "actorInstanceId": null}]
}
```
Los nombres de estados y claves son ejemplos de contrato a ratificar con scripts de runtime; NO claves verificadas del motor actual.

## Responsabilidades
- T: edificios de torres, armas instaladas, bocas de fuego, siluetas I–IV, montaje y anclaje de operador suministrado por P, proyectiles y VFX que pertenecen a torres, audio de torres cuando autorizado.
- P: sprite/anatomía/atlas/poses/reacciones de SOLDADOS, operadores, Mecha/nave si diseñados como actor, y enemigos.
- Core: comprar, vender, evolucionar, precio, rango, cadencia, objetivo, costos/cooldowns de operaciones, impacto, buffs, bloqueo, spawn de aliados, HP de torres y ruina/reconstrucción.
- Torre visual NO decide cuántos soldados efectivos hay ni aplica damage.
- Control visual NO dispara operación manual por animación espontánea: espera una orden válida del core.
- Torre demolida: render de ruinas según evento, sin simular estado de compra/reconstrucción.

## Espacios y animaciones
- Pivote al contacto con el socket; arte excedente puede subir, nunca cambiar hitbox.
- Anclajes: `muzzle` (origen proyectil), `operator` (posición actor P), `effectOrigin`, `buildFoundation` obligatorios cuando relevantes. Registrar locales en unidades de textura y adaptarlas a mundo con escala aprobada.
- Ciclos: idle, target/acquire, windup, fire, recoil, recover, upgrade, ruined; no repetir un sonido/daño por frame.
- Controlar agrupación de VFX por instancia; limpiar en muerte, cambio de mapa, pausa o reinicio.
- HP rojo / escudo plateado de enemigos siempre encima de VFX ordinarios.

## Diseño visual
Cartoon estilizado 3/4 fantasía tecnológica original. Edificios con escala coherente con pads; operador identificable en Sniper; Guardian con cristales diferenciados; Bombardera con mortero/cañón reconocible; Control estructura y estados manuales únicos. No copias de edificios de otras IP.

## Entregables T-01 a T-04
Infantería I-II y Francotiradores I-II primero; vista frontal y 3/4, ciclos y VFX, manifest y capturas en contexto de pads reales; variantes jerárquicas y prueba pausa. Posteriormente ramas III-IV y otras familias tras orden independiente.

## QA de contrato
- `family/level/branch` validados contra catálogo core; no placeholders silenciosos.
- Render no crea monedas, ni quita HP ni actualiza cooldowns.
- Cada evento fire genera una sola secuencia visual; daño lo aplica core una sola vez.
- Pivote a suelo estable, no deslizamiento de unidad, sin torre flotante.
- Selección contextual móvil y visibilidad de HUD sin panel lateral permanente.
