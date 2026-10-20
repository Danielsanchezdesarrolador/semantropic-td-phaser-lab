# RFC TORRES T09 → DIRECCIÓN GENERAL C1-D7 · Nodos contextuales

**Fecha:** 2026-10-20. **Estado:** [PROPUESTA TÉCNICA CON CÓDIGO DISPONIBLE, PENDIENTE INTEGRADOR]. **Ownership:** TORRES solo `public/official/src/towers-visual/t09/**`, arte de nodos y pruebas bajo `docs/art/towers/**`. DG controla selección, core, DOM shell, input de juego y LIVE.

## 01. Auditoría de C1-D6 vigente (producción, solo lectura)

Se verificó en `production/semantropic-td-live@edf84939dfd9aa9e754247b384e5b47fe854b411` el archivo `public/official/src/c1d6-playable/scene.mjs`: `chosenSocket` global, `this.mapView.plan.sockets` con `socket.world.x/y`, `WORLD.economy.getTower(i)`, `quote(i,family)`, `quoteUpgrade(i)`, `quoteSell(i)`; `trade(method,...args)` invoca `WORLD.economy[method]`, sincroniza `WORLD.syncTowers()`, `drawTowers()`, `updatePanel()` y HUD. Un menú HTML de pie usa `<select id=family>`, `#buy/#upgrade/#sell`, flechas prev/next y botón reunión. **Los textos de compra 95/140 están actualmente codificados directamente en updatePanel; DG debe sustituirlos por valores de quote, sin moverlos al sistema T09.**

El core de `construction-economy.mjs` devuelve cotizaciones verdaderas: `quote` `{ok,cost,family,spot}` o `{ok:false,reason,message,cost?}`; `quoteUpgrade` `{ok,cost,toLevel}` o `{ok:false,reason:'TECH_LOCKED'|'INSUFFICIENT_GOLD'...}`; `quoteSell` `{ok,refund,tower}`. No inferir coste desde el catálogo visual ni de `#family`.

## 02. API pura — contrato final candidato

Ruta `public/official/src/towers-visual/t09/spec.mjs`, exportación:

```js
getContextMenuVisualSpec({
 socket:{index:chosenSocket,socketId:socket.socketId},
 tower:economy.getTower(chosenSocket),
 quotes:{buildInfantry:economy.quote(chosenSocket,'infantry'),
         buildSniper:economy.quote(chosenSocket,'sniper'),
         upgrade:economy.quoteUpgrade(chosenSocket),
         sell:economy.quoteSell(chosenSocket)},
 mode:'preparation'|'wave'|'paused'|'awaiting-rally-selection'|'victory'|'defeat'|'unavailable',
 permissions:{canRally:boolean,canInspect:boolean}, // calculados por DG/core
 worldPoint:{x:socket.world.x,y:socket.world.y},
 rangeWorld:/* solo rango real calculado por core; si no, null */ null,
 revision:/* id de revisión que DG incremente tras cambios */ number
});
```

Retorna un POJO serializable `{version,status,mode,closed,readonly,selectedSocketIndex,selectedSocketId,tower,anchorWorld,rangeWorld,visualFlags,nodes,revision}`. Cada nodo contiene `{id,icon,title,action,enabled,reason,price,priceKind,ariaLabel,hint,highlight,intent}`. `price=null` cuando la cotización no entrega un entero válido. `INSUFFICIENT_GOLD` NO habilita compra aunque devuelva `cost`. `TECH_LOCKED` bloquea mejora nivel II. Reunión solo aparece para Infantería y **requiere** `permissions.canRally===true` del Integrador; `inspect` de Sniper solo con radio positivo core+permiso.

Las únicas intenciones que TORRES emite son `build_infantry`, `build_sniper`, `upgrade`, `sell`, `set_rally`, `inspect`, `close`. `intent` lleva `socketIndex`, `towerId`, `family`, `revision`. **No contiene ningún resultado de venta, compra, oro o nivel**. La opción `close` permanece accesible en pausa, mientras los cambios están deshabilitados. Al terminar la partida `spec.closed===true` y no hay nodos.

## 03. Screen layout y safe area

`layoutContextNodes({anchorScreen:{x,y},viewportSafeRect:{left,top,right,bottom},nodeSpecs:spec.nodes,nodeDiameter=54,preferredOrientation='auto'})` posiciona 0–4 círculos de tamaño >=44 CSS px, reorienta/refleja e introduce desplazamiento interior; retorna `{nodes,lines,anchorScreen,layoutCenter,orientation,fits,diameter,shiftPx,safeRect}`. `fits===false` PROHÍBE presentar botones que se traslapen y expone una notificación. Las coordenadas son **CSS px relativos al contenedor overlay**, no Phaser world units. El método puro `projectWorldToScreen({worldPoint,matrix:{a,b,c,d,tx,ty},canvasRect,hostRect,renderSize})` admite el transform affine REAL del Integrador; no asume zoom, DPR o mundo 1280×768. DG debe reconstruir la matriz cuando haya resize, zoom, scroll o giro, y actualizar `viewportSafeRect` a partir de bounds reales de cabecera, pie, browser safe inset.

## 04. Montaje DOM opcional

`mountT09Presenter(hostHTMLElement,{onIntent,onLayout})` crea UNA capa `.t09-overlay` dentro del host; importar `menu.css` en la escena LIVE vía DG. Retorna `{update(spec,{anchorScreen,viewportSafeRect,nodeDiameter}),clear(),destroy(),current,layout,destroyed,root}`. Escucha solamente `pointerdown`, `pointerup`, `click`, `keydown` SOBRE el overlay propio; no registra manejadores globales de documento o Phaser. `pointer-events:none` en contenedor, `pointer-events:auto` solo botones; se paran eventos dentro de ellos. `onIntent` no llama funciones core; DG debe descartar intenciones obsoletas y **volver a cotizar** antes de operación.

**MUY IMPORTANTE:** No montar el host sobre todo el juego capturando taps. Las pulsaciones de plataforma llegan al `this.input.on('pointerdown')` de DG, quien selecciona socket, abre `update` con `anchorScreen` calculado de pantalla; solo un menú activo a la vez. El clic en botón no debe propagarse al canvas. Tap exterior, otro socket, resultado final, reinicio, resize, cambio de mapa y destroy pertenecen al dueño central, quien invoca `clear`/`update`/`destroy`.

## 05. Handlers del Integrador (pseudoflujo, NO modificación T09)

1. `onSocketSelected(i)`: `chosenSocket=i`, cancelar menú anterior, pedir `WORLD.economy.getTower(i)`+TODAS las quotes; pasar a spec y presenter. 2. `onIntent`: confirmar `intent.socketIndex===chosenSocket` y `intent.revision===revisionActual`; comprobar que `!WORLD.paused&&!WORLD.ended` para acciones, pedir **quote nueva** y, si `.ok`, ejecutar `trade('build',i,'infantry'|'sniper')`/`trade('upgrade',i)`/`trade('sell',i)`, o iniciar modo de reunión propio de `WORLD.setInfantryRally`. `close` limpia sin tocar economía. 3. Tras confirmación de método core, sincronizar `WORLD.syncTowers()`/draw y regenerar DTO. El feedback éxito/error proviene de `out.ok` real, no de onIntent. 4. Tras cambios de oro/oleada/venta/upgrade/restart/pausa/victoria/derrota, actualizar o cerrar spec para impedir precios viejos.

El halo de rango debe crearlo DG solo si hay `rangeWorld` verificado y transformado correctamente; T09 no produce ni cambia colisiones/hitbox. No dibujar el rifle o atacante duplicado.

## 06. Flujos de aceptación obligatorios DG

Vacío→Infantería; vacío→Sniper; I→II; vender→vacío; Infantería→espera reunión→punto válido; sin oro→bloqueado; 8 sockets y corner taps; cerrar/otro socket; pausa, fin de oleada, muerte/victoria, giro/resume y cancelación de listeners. El alcance opcional requiere fuente core. Comprobar mobile 844×390, 932×430 y browser screenshot 1536×709, además desktop 1280×768. No cambiar geometría canónica de sockets.

## 07. Arte y continuidad

Iconos 9 SVG originales 96×96 con transparencia fuente sin fondos raster, `public/official/art/towers/t09/icons/**`; hoja de estilos militar cartoon original verde pizarra/cobre; maestros de Infantería y Sniper T04 conservados byte a byte T08-HF1. Sin implementar máscara del operador P07 ni cambiar la composición default P03. La demostración aislada (`t09/index.html`) tiene ocho pads PROXY, cotizaciones FICTICIAS y títulos visibles; **NO ES EL JUEGO LIVE**.

## 08. QA y gate de integración

TORRES entrega `docs/art/towers/qa-t09.mjs` para `node docs/art/towers/qa-t09.mjs`: 4 hashes T04, 9 iconos, todas las cotizaciones/rechazos, 4 tamaños×5 zonas seguras, 100 ciclos open/close y fake DOM listeners. Dirección debe correr Node REAL, npm build, Chromium WebGL2, taps táctiles y mediciones FPS; luego publicar capturas reales C1-D7 y revisión de propietario. Capturas 50833/50834 nombradas en orden NO están adjuntas individualmente a esta conversación, por tanto comparación pixel-alineada NO ESTÁ DISPONIBLE.

## 09. Rollback, restricciones y autoridad

PR T09 siempre DRAFT sobre HEAD T08-HF1; cerrar/revertir sin afectar producción. Prohibido modificar `public/official/src/c1d6-playable/**`, `src/live/**`, `core-c1d/**`, escena compartida, personajes o mapas. El único enlace público LIVE ya existe y su modificación corresponde a DG C1-D7. No merge, no Render ni deployment por TORRES.
