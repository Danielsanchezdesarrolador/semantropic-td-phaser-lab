# RFC-M06-01 — INTEGRACIÓN ESCÉNICA CON C1-D2, T06 Y P05

**20-10-2026 • Equipo M → Integrador de Dirección General**  
**Estado:** PROPUESTA VERSIONADA; no está instalado un bridge universal.

## Fuente de arte y contrato nuevo
```js
import {preloadM06Illustrations,mountM01WorldV6}
 from "../maps-visual/m01/m06/renderer-v6.mjs";
// En preload Phaser: preloadM06Illustrations(this)
// En create con mapa V5 real:
const mapVisual=mountM01WorldV6(this,canonicalMap,{
 palette:"equilibrada",treatment:"atmosfera",reducedMotion:true
});
// Vista exclusivamente. Core sigue dueño de todas las reglas.
```

M06 importa M05 (que reutiliza M04), crea una sola textura pintada 1600×960 y seis ilustraciones originales. `destroy()` es idempotente. M06 alquila su textura mediante un contador de referencias por texture-manager para no eliminarla cuando otra vista M06 sigue viva; los recursos heredados de M04/M05 requieren revisión de convivencia por el Integrador.

## Adaptador de snapshots y eventos (solo lectura)
```js
mapVisual.applyVisualSnapshot({
 tick: authoritativeCoreTick,
 selectedSocketId:"m01-pad-03",
 sockets:[
  {socketId:"m01-pad-01",occupied:true,ruined:false},
  {socketId:"m01-pad-02",occupied:false,ruined:false}
 ]
});
```
- Se respetan ids de `map-socket-v1` (m01-pad-01 ... 08), x/y exactos y 54 de radio VISUAL provisional. No se genera collider.
- Snapshot gana frente a un evento atrasado: si `tick` de evento es menor o igual al snapshot, se ignora la actualización artística.
- Tras recibir snapshot **sin tick**, se ignoran eventos candidatos no suficientemente versionados, hasta un nuevo snapshot o `resetVisuals()`. El Integrador deberá aportar `tick` del core para proyecciones incrementales.
- `projectEvent` delega nombres candidatos heredados M05 (tower_built, tower_upgraded, tower_sold, tower_ruined, tower_rebuilt, scene_reset); **NO** afirmar que PR #22 los emite.
- `scene_reset` proyecta neutral, no llama core y no gasta/restituye oro.
- No conectar suscripciones sin API central aprobada. Si se conecta una, guardar y liberar disposer en la escena del Integrador.

## Conflicto conocido T06/PR22 — origen del disparo
**[BLOQUEANTE]** `M01CombatWorld` de PR #22 emite `attack_fire.payload.originWorld` y `targetWorld`; `SniperShotPresenter` T06 requiere `payload.muzzleWorld` y `targetWorld`. El origen geométrico/core NO es necesariamente el muzzle dibujado en torre T06. **El Integrador debe escribir el adaptador de importación y proyección a T06**, usando `towerId/entityId`, `eventId`, `tick`, socket y metadata muzzle reales; M06 no toca trayectorias, daño ni cadencia.

## Orden de lectura y oclusión propuesto
`terrain(M04) → m06-painterly(-4500) → camino(M04) → propsBack(-1745) → pads(M04) → torres(T06) → P05/actores por footY → propsFront(si autorizado) → trazadores/VFX → HP/escudo → HUD`.

M06 coloca sus seis SVG detrás de actores en depth -1745/-1195 (valores heredados, no contrato global definitivo). `occlusionMetadata` incluye `footWorld,radiusWorld,maxHeightWorld`, `noCollider`. El integrador certificará diferencias de escala 44/64/80 y cámara 844×390/932×430. Ninguna cima de árbol oculta HP.

## Revisión de combate auténtico
El PR #22 mantiene sólo Sniper I/II con daño real. Requerimos escena conjunta con T06 y P05, vierte snapshots reales del core sobre ocho pads y captura:
1. Estado quieto con 4 torres y 13 actores (reales, no marcadores de showroom).
2. 20+ actores con stress visual, ataque real `attack_fire` y `hit_applied`.
3. `entity_die` y `entity_escape` realizados por core; HUD vidas permanece visible.
4. Pausa/resume, reinicio, venta, desaparición, recurso ausente, evento duplicado/tick antiguo.
5. M04/M05A/M05B/M06A/M06B a misma cámara y paleta, 1280×768, 844×390 y 932×430.
6. FPS p50/p95/GPU en ejecución real; registrar hardware, renderer y timebase.

**NOTA:** el showroom M06 admite 13/24 marcadores **ficticios**, no implica actores P05. No lo confundir con qa del core.

## Arte y mobile-first
A pinta masas suaves, B añade facetas y sombras; ambas conservan las ocho plataformas ~110,24 de caja visual heredada, ruta 133, ancho 110 y parámetros de cámara FIT central. El equipo M **no impone** full-bleed, no instala HUD ni mueve torres. Dirección elegirá según legibilidad de trayecto/HP y estética pictórica.

## Riesgos y rollback
- M06 sigue usando SVG editables/Canvas2D bake, no es prueba de acabado pintado final; requiere crítica de pantalla real.
- +5,86 MiB RGBA8 teóricos para textura 1600×960 y +2,22 MiB referencias SVG decodificadas a fuente 360×270; memoria GPU no medida.
- La convivencia de dos vistas M04/M05 puede necesitar lease independiente bajo autoridad de su owner, no tocar esas carpetas desde M06.
- Si tiempo GPU móvil empeora, rasterizar grupos grandes a WebP/PNG con alpha, reducir detalles laterales, no retocar hitbox ni ruta.
- Rollback: cerrar [PR #25](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/25), sin merge ni cambios core.
