# RFC — MAPAS M07-Q2 → DIRECCIÓN GENERAL | PRIMERA PARTIDA REAL C1-D5
**20-10-2026 • Equipo MAPAS • No contrato central instalado • NO MERGE**

## 1. Baseline protegido
- Foto C1-C aprobada SHA256 `24103e45a0e1249fa4b89d4e65ea16d9e147bdf1e2462e5c4063469a931842ef` de 1280×768.
- [M07 PR #31](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/31) renderer `fiel` M03 Viva fuente, 133 waypoints, ocho sockets, 13 props originales.
- [C1-D4R PR #30](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/30) representa continuidad visual y núcleo funcional; nueva integración C1-D5 pertenece a DG.
- Este hotfix no autoriza cambios de balance, escenas, HUD, eventos core ni cámara.

## 2. Uso central mínimo, no monkeypatch
```js
import {preloadM07Illustrations,mountM01WorldV7}
  from "../maps-visual/m01/m07/renderer-v7.mjs";
// SOLO desde scene DG en preload(): preloadM07Illustrations(this)
// SOLO desde create():
const visual=mountM01WorldV7(this,mapV5,{
 palette:"viva",treatment:"fiel"
});
// El Core C1-D5 SIGUE poseyendo todas las operaciones de compra/venta, HP, oleadas.
visual.applyVisualSnapshot({
 tick: authoritativeWorldTick,
 selectedSocketId: selectedPadIdOrNull,
 sockets: authoritativeCoreSockets
});
// En shutdown: visual.destroy()
```
El contrato no crea/cambia torres ni eventos del mundo. `view.plan.sockets` contiene ocho IDs y coordenadas canónicas. `setSocketVisualState` hace preview; `applyVisualSnapshot` es preferido por autoridad del core; `projectEvent` es opcional y requiere ratificación del esquema de evento real.

## 3. Reglas de orden y venta (importante)
- Un `tick` numérico entero debe corresponder al orden AUTORITATIVO de actualización del core, no al frame de Phaser.
- Snapshot en tick 20; evento de venta tick 22; evento de construcción tardío tick 21 en el mismo socket **DEBE SER RECHAZADO**, para no revivir visualmente la torre.
- El mismo `eventId` no se proyecta dos veces. Snapshot de tick 21 posterior a venta 22 no se aplica.
- `selected` es **aro visual**, no reemplazo de textura; un pad occupied/ruins conserva su material debajo.
- Los eventos candidatos `tower_built/tower_upgraded/tower_sold/tower_ruined/tower_rebuilt` no equivalen a eventos realmente presentes en C1-D5 hasta que DG ratifique mapper.
- `scene_reset` es instrucción de presentación y no reinicia el simulador. Si el integrador pierde eventos, enviar snapshot autoritativo de tick posterior.
- El filtro global de ticks es conservador: eventos de sockets distintos que llegan desordenados pueden quedar sin pintar temporalmente. Ordenar bridge/ticks y enviar snapshot para resolver.

## 4. Cache de texturas M03: compromiso deliberado
### Caso A — M07 → M03 externo
M07 monta primero. Una escena M03 directa se monta después. Destruir M07 **no debe eliminar** las texturas que M03 directo está usando. M07-Q2 consigue esto dejando los once Canvas históricos en el TextureManager por toda la vida del manager; libera sólo objetos de pantalla y sus texturas opcionales propias.

### Caso B — M03 externo → M07
M03 directo monta primero y por defecto destruye sus once claves al apagarse, aun cuando M07 las usa. **No hay forma fiable de evitarlo desde carpeta M07 sin hackear el renderer antiguo ni el global Phaser.TextureManager**, ambos prohibidos por la orden.

**ORDEN CENTRAL OBLIGATORIA:** en escenas que compartan M03/M07 texturas:
- Usar siempre M07 wrapper cuando sea posible.
- Si DG requiere `mountM01WorldV3` directo, montarlo con `disposeTextures:false` y registrar que sus once claves son de vida global hasta `game.destroy()`.
- No montar escenas M03 directas que destruyan manager keys mientras M07 siga viva. No crear parches de `scene.textures.remove` desde MAPAS.

### Memoria
Retención fixed-size **11 Canvas históricos**: 2 masters 2560×1536 + 9 pads 424×304, RGBA8 teórico 34,43 MiB. Los SVG originales nueve siguen compartidos. El overlay opt-in Pulido suma 3,75 MiB en la misma aproximación solo mientras existe, y NO está encendido en C1-D5. Ninguna de estas cifras representa VRAM observada.

## 5. Diagnóstico read-only para DG
```js
const info=visual.getMapPerformanceInfo();
// Retorna sceneObjects, canonicalPads:8, originalProps:13,
// 11 claves M03 presentes, optionalPolishTextures:0 en Fiel.
// gpuMemoryMiB=null, fpsP50=null, fpsP95=null:
// esos valores NUNCA se inventan desde el renderer.
```
`?qa=1` habilita la API `window.__SEMANTROPIC_MAPAS_M07_Q2_QA__` **solamente en el showroom aislado**, con lectura WebGL2 y density 0/13/24/63 de MARCADORES SINTÉTICOS; no exportar ni usar ese objeto desde el juego central.

## 6. Ensayos requeridos para autorización
En el checkout de `feature/art-m07-q2-performance-c1d5`, sin cambiar build global:
```bash
set -euo pipefail
node public/official/src/maps-visual/m01/m03/qa-m03.mjs
node public/official/src/maps-visual/m01/m07/qa-m07.mjs
node public/official/src/maps-visual/m01/m07/qa-m07-q2.mjs
npm run build
python3 -m http.server 8080 -d public
# En otra terminal con Playwright + Chromium disponibles:
node public/official/src/maps-visual/m01/m07/capture-m07-q2.mjs http://127.0.0.1:8080
```
Los scripts M04–M06 históricos también pueden ejecutarse bajo coordinación DG; no ocultar `exit 1` con tuberías `tee`.

- Visores Chromium WebGL2 reales 1280×768, 844×390 y 932×430 (SwiftShader **no dispositivo móvil físico**).
- Captura 0, 13 y 63 **marcadores sintéticos** para estudio de legibilidad del escenario, coste/display list y frame time de browser; comparar con M07 original sólo si se sirve y se instrumenta una referencia de control compatible (si no, `NOT_RUN`).
- **Integrador C1-D5** debe probar 5 oleadas, 63 enemigos reales acumulados, venta/upgrade, daño, muerte, fuga, pausa/reinicio, selección táctil ocho sockets, HP y HUD en escena real.
- Realizar comparación con PNG original C1-C y nueva captura de escena DG misma cámara y objetos; cero regresiones de silueta, paleta, camino, árboles, torre y enemigo.

## 7. Gates y rollback
- A: propiedad M-only y JSON QA [PASS fuente, pendiente diff final].
- B: identidad perceptual Chromium nueva [NOT_RUN].
- C: Node/build en branch real [NOT_RUN].
- D: partida real C1-D5 y móviles [NOT_RUN].
- E: aprobación del propietario [NO RECIBIDA para este hotfix].
- F: merge/staging/deploy [PROHIBIDO hasta autorización].

Cerrar PR M07-Q2 sin merge restaura `2c08eaa13dac309f85f4e76b736db6f66545aac9`; C1-D4R, Canvas V5, Renderer M03/T/P y Render no cambian.

**Síntesis:** código y QA estructurales listos para prueba controlada; **no prometer** WebGL2 real, FPS ni combate C1-D5 sin capturas/logs verificados.