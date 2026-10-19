# [M] SEMANTROPIC TD · M-01 AURORA — REPORTE DE ENTREGA

**Fecha:** 2026-10-19  
**Equipo:** M — Mapas y Escenarios  
**Rama exclusiva:** `feature/phaser-mapas`  
**Base ratificada C0:** `104beaa44682cd2f81e30461ac6fe1b685186789` (deriva de PH-02B `b4edfb176094d65059f88145e556daf4a890e56e`)  
**Target PR:** `integration/phaser`; **prohibido merge directo**.  
**Autoridad:** Dirección General e Integrador técnico bajo PM-03 / contratos v1.

## 1. Estado honesto

- [CONFIRMADO EN CÓDIGO] Módulo de arte original M-01 completamente separado del visor y del core.
- [CONFIRMADO EN CÓDIGO] Vitrina HTML Phaser propia, servible de forma estática bajo `/official/art/maps/m01/index.html` cuando el integrador publique la rama autorizada.
- [PROBADO EN SIMULACIÓN] Tres paletas (equilibrada, viva, atmosférica) generaron texturas vía contexto Canvas simulado y montaron objetos gráficamente representables por Phaser.
- [PROBADO EN SIMULACIÓN] 133 waypoints, ocho sockets canónicos, 28 props con clearance comprobado; los datos fuente no se mutaron.
- [PENDIENTE / NO PROBADO] Renderizado auténtico WebGL2/Chrome, captura visual genuina de PH02B vs M01, QA móvil emulado y físico, oclusiones reales con actores de P y edificios de T.
- [PENDIENTE] Aprobación artística del director para uso oficial. No hay imágenes finales pintadas manualmente.
- [BLOQUEANTE DE INTEGRACIÓN] `getMapSockets`/CombatEventBridge siguen siendo interfaces **especificadas**, NO adaptadores runtime existentes. Esta vitrina no implementa ninguno de ellos.

## 2. Arte entregado / identidad

**Tema:** Praderas del Amanecer, primera pradera de la campaña. Ambientes cálidos y acogedores de fantasía tecnológica propia; arquitectura tallada en piedra con detalles arcanos moderados. Inspiración de riqueza comercial sin copiar obras ajenas.

| Subsistema | Primer lote Aurora |
|---|---|
| Suelo | textura fuente 2560×1536, gradientes de verde, once campos cromáticos, praderas con brotes/floración, colinas sutiles y luz matinal |
| Camino | exactamente los 133 puntos V5; ancho exterior 110 unidades (−12,7 % respecto al PH01 126), bordes definidos y tierra cálida |
| Plataformas | 8 pads del mapa, tres estilos materiales (`tempo/power/focus`), master 464×364, capas de piedra, relieve, junta y runa discreta |
| Props | siete familias: roble, santuario menor, bandera, lámpara, piedra, flores y arbusto |
| Composición | 28 props declarados, con filtro de clearance respecto a senda/plataforma |
| Variantes artísticas C | `equilibrada` (recomendada), `viva` (más luminosa), `atmosferica` (paleta suave) |
| Inspección | A/B PH-02B vs Aurora, línea con puntos, círculos de interacción, ruta de inspección con marcador NO enemigo y zoom de diagnóstico |

No se cambió la topología original del camino ni se crearon nuevas rutas. Los puntos de entrada/salida originales son (−32,342) y (1312,400).

## 3. Ownership y archivos

**Todos los cambios del Equipo M permanecen en las rutas autorizadas:**
- `public/official/src/maps-visual/m01/renderer.mjs` — módulo fuente de arte e interfaces locales de vista.
- `public/official/src/maps-visual/m01/showcase.mjs` — escena independiente; **no** comparte estado con gameplay.
- `public/official/src/maps-visual/m01/qa.mjs` — contrato y pruebas de texturas, destructores/clearance, Node 20.
- `public/official/art/maps/m01/index.html` — vitrina HTML con Phaser runtime local empaquetado en build existente.
- `public/official/art/maps/m01/manifest.json` — registro de recursos en prototipo.
- `docs/art/maps/**` — documentación y RFC interequipo.

**No se modificaron** `m01-preview.mjs`, `m01-model.mjs`, `maps.v5.json`, `campaign140.v5.json`, `public/official/index.html`, `package.json`, `build.mjs`, `public/t3b`, Canvas V5 ni las ramas T/P.

## 4. QA y limitaciones

| Prueba | Estado | Evidencia |
|---|---|---|
| 133 puntos fuente | PROBADO EN SIMULACIÓN | validación estructural JS en sandbox de evaluación |
| 8 IDs de socket / posiciones | PROBADO EN SIMULACIÓN | `m01-pad-01…08`; coordenadas sin cambios |
| 28 props fuera de reserva | PROBADO EN SIMULACIÓN | `verifyClearance` frente a ruta y pads |
| Tres texturas de terreno/camino/pads/props | PROBADO EN SIMULACIÓN | texturas 2560×1536, 464×364, 388×410 |
| 3 variantes artísticas | PROBADO EN SIMULACIÓN | 39 objetos por variante montados y destruibles |
| Sintaxis JS (parser) | PROBADO EN SIMULACIÓN | evaluación V8 / parser modular equivalente |
| Prueba `node .../qa.mjs` en CI | NO EJECUTADO | script entregado, integrador debe ejecutarlo en checkout |
| Build `npm run build` en Render | NO EJECUTADO | **sin deploy nuevo**, conforme a Acta C0 |
| Chrome WebGL2 real, capturas A/B | NO EJECUTADO | no hay sesión browser con esta rama servida |
| Landscape físico iPhone/Android | NO EJECUTADO | dispositivo de Dirección/Integrador |
| Integración con T/P/core | NO EJECUTADO | requiere adaptador central e integración aprobada |

**Regla de publicación:** no presentar los resultados de simulación como prueba visual. Ningún benchmark FPS fue solicitado o declarado.

## 5. Responsabilidad de integración

El integrador debe registrar adaptador versionado `getMapSockets(mapId)` y determinar `radiusWorld` definitivo de footprint. En esta vitrina los ocho IDs son una **proyección local**, no API pública. El hit radius de referencia 54 es provisional y corresponde al visor actual.

**No desarrollar** torres, personajes, colisiones, compra, economía, daño, recompensas ni oleadas dentro del módulo M. `route marker` solo prueba interpolación de ruta en una vitrina visual.

## 6. Riesgos y siguiente pase

1. La calidad comercial necesita crítica de un frame real y posiblemente reemplazo gradual de procedurales con ilustraciones editables de alta calidad.
2. Un elemento elevado puede superponerse visualmente a un actor de P si se cambia el zoom; validar layering/depth conjuntamente antes de integrar.
3. El master 2560×1536 puede consumir memoria móvil; registrar la huella GPU tras tener preview publicado.
4. Los ids de socket no son fields actuales de `maps.v5.json`, sino IDs derivados para futura ratificación.
5. Variantes cambian sólo visuales; nunca economía/combat stats.

**Rollback:** no mergear PR; borrar/revertir los cambios de rutas M del feature branch. Core/campaña no reciben commits.
