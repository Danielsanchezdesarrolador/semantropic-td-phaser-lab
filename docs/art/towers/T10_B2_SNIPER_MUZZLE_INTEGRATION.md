# TORRES T10-B2 — Guía de integración para Dirección General

**Fuente verificada:** production/semantropic-td-live SHA `b70a28d93e42375af19f69514b1171486849e396`; `public/official/src/c1d8-b1-playable/scene.mjs` en solo lectura. SVG original T04 compuesto y P03 original protegidos.

## Boca del rifle desde geometría SVG real

| Nivel | Grupo original | Cara distal del casquillo (source-px) | Centro (source-px) | muzzleLocal histórico | worldScale |
|---|---|---|---|---|---|
| I | `t04-sniper-i-functional` | (305,152)–(297,166) | **(301,159)** | (299,156) | .312 |
| II | `t04-sniper-ii-functional` | (322,146)–(309,159) | **(315.5,152.5)** | (307,149) | .319 |

Procedencia exacta: nivel I `M276 153l20-6 9 5-8 14-18 0Z`; nivel II `M287 143l21-6 14 9-13 13-23-2Z`. Los centros son el promedio de los vértices distales. Los trazos SVG pueden sobresalir, por lo que solo un render real comprueba visualmente la salida. **No se inventaron coordenadas.**

Ambos originales: `viewBox="0 0 360 420"`, dimensiones 360×420, `footAnchor=(0.5,0.93)`. El origen fuente es arriba a la izquierda. Con sprite sin `Container`, nivel I boca relativa al socket (+37.752,-72.2592) world units; II (+43.2245,-75.9539). Transformar con escalas ACTUALES del sprite y rotación:

```js
const dx=(mouth.x-360*.5)*sprite.scaleX;
const dy=(mouth.y-420*.93)*sprite.scaleY;
const a=sprite.rotation??0;
const muzzleWorld={x:sprite.x+dx*Math.cos(a)-dy*Math.sin(a),
 y:sprite.y+dx*Math.sin(a)+dy*Math.cos(a)};
```

## Cambio de integración propuesto, NO ejecutado por TORRES

```js
import {projectT10MuzzleWorld} from '../towers-visual/t10/sniper-muzzle-contract.mjs';
// Reemplazar SOLO para attack_windup / attack_fire en scene.mjs:
const mount=this.towerMounts.get(ev.entityId);
if(!mount||mount.meta.family!=='sniper')return null;
const muzzle=projectT10MuzzleWorld(mount.sprite,mount.meta);
return {...ev,payload:{...(ev.payload??{}),muzzleWorld:muzzle,targetWorld}};
```

**No modificar `originWorld` del core**, targeting, trayectorias físicas, HP, oro, ataques ni intervalos. `SniperShotPresenter` sí usa `payload.muzzleWorld` como punto VISUAL de partida. Prohibido montar otro rifle: T04 compuesto ya lo contiene.

## Diagnóstico de incertidumbre

El catálogo antiguo `muzzleLocal` ya está CERCA de la cara distal: diferencia calculada I ≈1.13 unidades mundo, II ≈2.93. Con `Scale.FIT` a 1280×768, 844×390, 932×430 esas diferencias son <=2.93 CSS px antes de transformaciones de zoom. **Por tanto un desalineamiento observado >6 px NO queda explicado por el punto histórico solamente.** La escena LIVE actualmente llama correctamente `projectSourceAnchor(mount.sprite,mount.meta,'muzzleLocal')`. Si DG observa más distancia, inspeccionar en Chromium `sprite.x/y`, scaleX/Y, displayOriginX/Y, camara/zoom, canvas CSS bounds, posible contenedor y primer frame efectivo del FX. No introducir offsets arbitrarios.

## QA y criterio de aceptación

- Ejecutar en checkout `node docs/art/towers/qa-t10-b2.mjs` (dos SVG T04 + posiciones distintas + escala/rotación + 3 tamaños teóricos).
- Capturar en Chromium WebGL2 **1280×768, 844×390, 932×430** a niveles I/II y 2+ sockets, marcador de boca del rifle y primer punto de aparición de la bala sobre la imagen renderizada. Aceptar distancia **<=6 CSS px**.
- Registrar capturas ANTES y DESPUÉS reales, hash de dos originales intactos, un solo rifle y combate/economía sin alteraciones.
- **Chromium, capturas y Node sobre HEAD nuevo: NOT_RUN** en TORRES. El Integrador DG debe realizar QA del LIVE.

Rollback: cerrar PR Draft o revertir un único commit T10-B2. No merge ni Render desde TORRES.
