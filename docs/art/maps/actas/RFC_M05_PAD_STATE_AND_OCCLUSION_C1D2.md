# RFC-M05-C1D2 — ADAPTADOR VISUAL DE PLATAFORMAS, OCLUSIÓN Y PRIMER COMBATE
**Equipo M → Dirección General / Integrador C1-D2 · 2026-10-19**
**Estado:** PROPUESTA, NO CONTRATO CENTRAL EN EJECUCIÓN.

## 1. Responsabilidad
**Integrador y core** controlan si existe torre, HP, oro, nivel, daño, precios, oleadas, IA, estado de ruinas y compra/venta. **Equipo M** recibe una copia de lectura de estados visuales y actualiza el sprite de la cimentación bajo la torre. El método `mountM01WorldV5` NO suscribe listeners ni cambia simulación.

## 2. Snapshot de entrada propuesto (preferido)
```js
const view=mountM01WorldV5(phaserScene,map,{palette:"equilibrada",treatment:"bucolico"});
view.applyVisualSnapshot({
  selectedSocketId:"m01-pad-03", // opcional, sólo contorno
  sockets:[
    {socketId:"m01-pad-01",occupied:false,ruined:false},
    {socketId:"m01-pad-02",occupied:true,ruined:false}
    // ... 6 sockets adicionales desde el snapshot autorizado del core
  ]
});
```
- `projectSocketVisualState` es función pura; por prioridad **ruins > occupied > selected > neutral**. La selección simultánea de un socket ocupado se dibuja como aro debug/selección sin desocupar la torre.
- Snapshot se lee sin mutarlo; omitir una plataforma implica neutral para la representación actual.
- Cuatro estados gráficos disponibles desde la biblioteca M04: empty/neutral, selected, occupied, ruins (ruined como alias de visual).
- El estado **no se persiste** en M; al reiniciar, limpiar proyecciones y recibir un snapshot actualizado desde core.

## 3. Eventos opcionales CANDIDATOS (requieren ratificación)
```js
view.projectEvent({
  eventId:"id-autoritativo-único",
  type:"tower_built",
  socketId:"m01-pad-03",   // o payload.socketId
  payload:{socketId:"m01-pad-03"}
});
```
| Evento candidato | Proyección | Acción de core |
|---|---|---|
| `tower_built` | occupied | NO se realiza |
| `tower_upgraded` | occupied | NO se realiza |
| `tower_sold` | neutral | NO se realiza |
| `tower_ruined` | ruins | NO se realiza |
| `tower_rebuilt` | occupied | NO se realiza |
| `scene_reset` | limpia estados y dedupe | NO reinicia core |

No asumir que `tower_sold` o `tower_rebuilt` estén registrados ni que el Bridge actual los emita. El set local de eventos recuerda **máximo 128 IDs** para evitar dos animaciones visuales de la misma notificación; no deduplica ni contabiliza oro/daño. En caso de pérdida/reordenamiento de eventos, prevalece snapshot autoritativo.

**No conectar directamente al bus de C1-D2 hasta ratificación central.**

## 4. Gestión de objetos y profundidad
- M05 llama a `mountM01WorldV4` una sola vez, sin crear otro terreno o camino.
- 18 clústeres de SVG 440×280 con pivote (.5,.88); composición 6 sectores × 3.
- Oclusión `behind-actors`, clústeres con depth -1750 (background) o -1190 (low); ninguno debe cubrir HP/escudo o puntero táctico, y **ninguno participa en colisiones**.
- Atributos leíbles `occlusionMetadata`: pie mundial, radio estético y zona. Integrador valida en z-sort definitivo.
- Los pads permanecen en las ocho coordenadas derivadas del V5, hit radio visual 54, caja gráfica ~110,24 unidades; sin redefinir footprint core.
- Los SVG compuestos poseen sombra de contacto propia y una sombra Phaser suave; el constructor no genera nuevas texturas Canvas grandes.
- `destroy()` es idempotente y libera GameObjects; delega la limpieza de las once texturas por paleta a M04. Las SVG compartidas permanecen cacheadas.

## 5. Contrastes A/B, cámara y pruebas
Tratamiento A (`bucolico`): luz de hoja y sombras suaves. Tratamiento B (`contraste`): mayor separación de sombras/tonos fríos **sólo en clústeres**. Los dos usan el mismo mundo M04, la misma paleta, los mismos pads, la misma cámara FIT. Elegir variante según una captura real 1280×768 y 844×390.

**Integrador debe montar:**
1. Cuatro torres T05 auténticas en sus cuatro sockets, manteniendo compra y UI central externas a M.
2. Trece actores P04 en recorrido real y VFX de Francotiradores sin modificar la ruta ni la familia del disparo.
3. Validar barra HP, arma, oclusión de copa, contacto de sombra de pad, traza de proyectil y tap targets 54.
4. Realizar capturas equivalentes M04/M05 A/M05 B a 1280×768, 844×390 y 932×430; fotografiar emulación separada de móvil físico.
5. Evaluar si Phaser.Scale.FIT deja bandas e impulsar **RFC central** para full-bleed, sin alterar coordenadas ni cámara global desde M.

## 6. Rechazos / riesgos
- Si hay oclusión del enemigo o arma: reposicionar sólo props de M05 por orden correctiva; NO mover el socket ni escalar T/P.
- La composición sigue siendo SVG editable y jerarquía vectorial; necesita aceptación artística del director; no proclamar pintura comercial final sin captura.
- El ratio zoom móvil es decisión de integración; no aplicar hacks locales que rompan el camino.
- Si una variante degrada FPS, primero reducir densidad de SVG/atlas, no eliminar hit zones.
- La propuesta de API se mantiene CANDIDATA y no certifica que el combate real esté implementado en M05.

**Rollback:** cerrar PR #20 sin merge. Ningún cambio a M04, fuentes V5, contratos centrales ni C1-E.
