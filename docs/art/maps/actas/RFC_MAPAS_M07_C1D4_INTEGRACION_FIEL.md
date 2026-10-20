# RFC — MAPAS M07 → DIRECCIÓN GENERAL: RESTAURAR C1-C EN CORE C1-D4
**20-10-2026 | PR de MAPAS #31 DRAFT | Contrato de integración propuesto, NO instalado**

## 1. Discrepancia observada en el código actual
**[CONFIRMADO EN FUENTE REAL DEL PR #28]**: `integration/c1d4-first-playable-m01` usa `public/official/src/c1d4-combat/scene.mjs`. Líneas 4, 17, 29 (en el SHA `f9ba3cbbe0b1733782e5b368691179d5afdf864c`):

```js
import {preloadM06Illustrations,mountM01WorldV6} from "../maps-visual/m01/m06/renderer-v6.mjs";
// preload()...
preloadM06Illustrations(this);preloadP06(this);
// create()...
this.mapView=mountM01WorldV6(this,MAP,{palette:"viva",treatment:"atmosfera",reducedMotion:true});
```

Esta dependencia instala el paisaje M04/M05/M06 diferente de la captura original. **No autoriza sustituir C1-D4 por un viejo showroom C1-C sin combate**.

## 2. Cambio central mínimo PROPUESTO para Integrador
Se solicita una modificación **ÚNICAMENTE en escena compartida propiedad de Dirección General, NO en el PR #31 del Equipo M**:

```js
import {preloadM07Illustrations,mountM01WorldV7} from "../maps-visual/m01/m07/renderer-v7.mjs";
// preload de combat scene:
preloadM07Illustrations(this);
preloadP06(this);               // conservar Personajes moderno
// create:
this.mapView=mountM01WorldV7(this,MAP,{
  palette:"viva",
  treatment:"fiel"
});
```

La rama funcional C1-D4 mantiene `M01CombatWithInfantry`, `WORLD`, economía, compra/venta, construcción, target, HP, barras, tracers, rewards, pause y waves. **No bajar a T04/P03 para gameplay**: conservar T06/P06 oficiales funcionales aunque las fuentes artísticas aprobadas visibles de esos equipos requieran otro PR de continuidad.

## 3. Forma efectiva de MapVisual M07
`view.plan.sockets` tiene ocho `socketId, world, legacySpotIndex` con las mismas posiciones M03/Map V5.
`view.padObjects`, `view.setSocketVisualState(socketId,"occupied"|"empty"|"selected"|"ruins")`, `view.updateDebug`, `view.destroy` conservan semántica compatible con llamadas D4.
`view.applyVisualSnapshot({tick,selectedSocketId,sockets:[...]})` permite lectura autoritativa si DG decide usar snapshots. El contrato incluye prioridad de ruinas sobre ocupado y selección por contorno separado.
`view.projectEvent(e)` es **un lector de candidatos de M05/M06**, no un bus central ya instalado; el integrador debe validar nombres reales de evento y ordenar tick, nunca inferir daño de un sprite.

**[NO AUTORIZADO A EQUIPO M]** Cambiar el `worldScale` de T06, el root depth de P06, el hitbox core o Phaser.Scale.FIT para simular que la escena coincide con la captura.

## 4. Captura igualitaria y revisión
[Referencia aprobada original] SHA-256:
`24103e45a0e1249fa4b89d4e65ea16d9e147bdf1e2462e5c4063469a931842ef`.
No sustituir imagen por capturas C1-D4 previas ni reprocesar antes con filtros.

**Integrator QA obligado:**
1. checkout de rama central de revisión aislada desde C1-D4 y selección/importe no-mutable de PR #31. **No merge directo a main**.
2. Compilar Phaser4.2.1 Node y Chromium/WebGL2 real; screenshot 1280×768 y emulación 844×390/932×430. Verificar hash exacto del PNG before.
3. **Imagen misma cámara/objetos** con cuatro torres, trece soldados/enemigos, FPS y equivalencia de color. El original se ve con T04/P03 mientras el juego usa T06/P06: documentar cambios de equipos y no achacar diferencias a M07.
4. Ejecutar WORLD real con 5 oleadas/63 spawns en Normal, sniper + infantería I/II, muerte `entity_die`, fuga `entity_escape`, daño `hit_applied`, venta y pausa/resume, sin modificación de core ni economía.
5. Controles negativos: desactivar/reconectar escena, falta de SVG, doble montaje/destroy, seleccionar pad ocupado, rutas intactas, skin después de close/reopen.
6. Screenshots 100% de: curva central y sendero, portón/árboles, cristal/valla, pad ocupado bajo torre; comparar before C1-C / C1-D4 M06 / C1-D4 M07.
7. Registrar cualquier objeto oculto o cambiado como `[DESVIACIÓN]` si incumple el ancla. No aprobar estética final sin consentimiento del propietario.

**PROHIBIDO** a este RFC prometer que C1-D4 ya monta M07: hasta su PR central, `mountM01WorldV7` está disponible solo en una rama de MAPAS.

## 5. Decisiones visuales y rendimiento
- M07 Fiel = terreno/camino/assets **M03 Viva** sin añadir texturas de M04/M05/M06; ocho bases pálidas originales y trece objetos M03.
- M07 Pulido = una capa de microdetalle por montar, opcional, sin cambios de carretera/copas.
- `preloadM07Illustrations` carga 9 SVG M02/M03, frente al acumulado 48 SVG de M06; esto no garantiza todavía menor FPS/GPU hasta medir navegador.
- No tocar original Canvas V5 ni modificar coordenadas de escape para compensar arte.
- El sprite M03 usa leases por escena M07 para texturas Canvas; revisar destrucción si DG también monta vistas antiguas M03 fuera del wrapper M07.
- Conserva cámara `Phaser.Scale.FIT`; full-bleed/ENVELOP es decisión central aparte.

## 6. Bloqueantes, propiedad y rollback
**[BLOQUEANTE]** No hay M07 con C1-D4 ejecutado ni screenshot en Chromium. No se certifica paridad de la captura C1-C ni integración jugable.

DG es dueña exclusiva de `public/official/src/c1d4-combat/scene.mjs`, workflow/CI, bridges de combate, cámara y HUD. Equipo MAPAS no lo edita desde PR #31.

Rollback central, si autorizado: revertir sólo import y mount visual en escena C1-D4, conservar core/saves. Rollback de MAPAS: cerrar [PR #31](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/31) sin merge. Referencia visual histórica C1-C sigue disponible en PR #12.

**Solicitud:** Dirección General debe integrar la fuente M07 y entregar el primer screenshot auténtico con combate (sin staging ni publicación hasta aprobación del propietario).