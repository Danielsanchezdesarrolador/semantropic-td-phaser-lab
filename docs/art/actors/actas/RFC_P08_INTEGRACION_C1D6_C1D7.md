# RFC PERSONAJES P08 → DIRECCIÓN GENERAL / INTEGRADOR C1-D6/C1-D7
**Fecha:** 2026-10-20 · **Ámbito:** ÚNICAMENTE propuesta de montaje, no código core autorizado
**Rama equipo:** \`feature/art-p08-infantry-evolution-combat\`
**PR destino:** DRAFT contra \`feature/art-p07-continuidad-c1c\`
**Core inspeccionado:** \`integration/c1d6-map01-playable-release\`, \`public/official/src/core-c1d/m01-infantry-combat-a2.mjs\` y \`public/official/src/c1d6-playable/scene.mjs\` [SOLO LECTURA].
**C1-C arte aprobado:** screenshot 1280×768 SHA256 \`24103e45a0e1249fa4b89d4e65ea16d9e147bdf1e2462e5c4063469a931842ef\`.

## A. Diagnóstico exacto del juego actual
C1-D6 \`scene.mjs\` muestra \`makeActor("infantry_recruit",u.x,u.y)\` para **todos los soldados** al crearlos, incluso nivel II, y en \`drawSoldiers()\` solo cambia \`attackWindup\`/walk/idle según \`u.windup\`/state. Esa visualización no distingue rango I/II y **no representa el contacto de espada** con su evento core. El equipo P no está autorizado a editar ese archivo.

El core autoritativo define:
- I: \`{hp:110,damage:8,interval:1.2,radius:130,respawn:10,count:1,speed:82,reach:20}\`.
- II: \`{hp:165,damage:12,interval:1.1,radius:130,respawn:9,count:2,speed:88,reach:20}\`.
- Upgrade I→II actualiza \`u.level\` de la unidad existente y \`createSoldier\` crea la segunda, con \`slot\` y \`entityId\` diferentes.
- El nivel III/IV no está habilitado en este M01; no instalar atlas de esas ramas ni tocar balance.

## B. API entregada por Personajes (opcional, NO conectada a core)
\`public/official/src/actors-visual/p08/p08-loader.mjs\` exporta:
- \`preloadP08(scene)\`, \`registerP08(scene)\` para PNGs de cuatro assets con 32 celdas cada uno (8×4, 176×208).
- \`p08VisualForSoldierLevel(1|2)\` retorna \`actorId/atlasKey/worldHeight/footAnchor\`.
- \`p08VisualForEnemy(type)\` solo admite \`warrior,hound\`; demás enemigos no incluidos.
- \`P08AnimationController\` desde \`p08-controller.mjs\`, con \`presentEntity(id,{kind,level,moving})\`, \`consumeCoreEvent(e,visualEntityLookup)\`, \`update(dtSeconds)\`, \`snapshot(id)\`, \`destroy()\`.
**No se agrega** \`enemy_attack_hit\` ni \`damage\` desde presentación. El core conserva todos sus eventos y mutaciones.

## C. Orden mínimo de instalación en C1-D7 (a ejecutar SOLO por Integrador)
1. Preload PNG P08 con los cuatro keys, registrar una sola vez 32 frames por textura. Mantener P03 histórico cargado para fallback de arte. Sniper operator P03 por defecto, NO usar variante P07 experimental sin autorización.
2. Crear \`P08AnimationController\` una vez por escena, no por cada actor. Destruirlo al apagar/reiniciar escena.
3. Para cada unidad de \`WORLD.soldiers\`, elegir **desde core real** \`p08VisualForSoldierLevel(u.level)\`: I recluta, II veterano. Si cambia \`u.level\` en un sprite existente, llamar \`setTexture(nuevoAtlasKey,'idle-0')\` sin duplicar sprite ni modificar \`u.id\`.
4. Renderizar cada unidad por su \`entityId\` único y \`u.x,u.y\` real. Al subir a nivel II deben verse **dos** instancias de atlas veterano, nunca tercera animación/soldado.
5. Antes del render, llamar \`presentEntity\` con el \`u.level\` y estado de movimiento real; al recibir cada \`WORLD.tick(dt)\` usar \`consumeCoreEvent(event,lookupCoreEntity)\`. El \`lookupCoreEntity\` consulta el propio mundo existente (\`findSoldier\`/enemies), no JSON duplicado.
6. \`P08AnimationController.update(dt)\` solo con delta **no pausado**. \`snapshot(id).frameName\` determina el cuadro; **NO** aplicar \`WORLD.hit\`, daños, oro ni cambios de HP desde callback.
7. El \`soldier_attack_windup\` ejecuta anticipación durante \`windup\` real (~0.29+slot). \`soldier_attack_hit\` confirma el golpe; la transición visual arranca **en frame attack-2** ese mismo tick. Si el target murió/fue interrumpido y no hubo hit, la anticipación se cancela sin fingir golpe.
8. \`enemy_attack_windup\` inicia anticipación en el enemigo real (\`sourceId\` será la identidad del enemigo). **NO EXISTE** necesariamente \`enemy_attack_hit\`. \`soldier_hit\` trae \`sourceId\` del enemigo que infligió daño y permite mostrar su \`attack-2\` sincronizado; ningún segundo daño se calcula.
9. \`soldier_hit\` en soldado reproduce reacción corta; \`soldier_die\` y \`entity_die\` interrumpen ataques; \`soldier_respawn\` reinicia visual sin cambiar vida core. \`soldier_removed\`, venta y reset destruyen vistas/tweens. Nunca multiplicar recompensas, spawns ni conteos.
10. En C1-D6 \`drawSoldiers\` oculta inmediatamente \`u.hp<=0\` y \`drawEnemies\` borra enemigo ya removido. Para mostrar \`die\` visual, mantener vista en un *render-only death cache* ~0.66s antes de destruir, SIN preservar colisiones ni HP. Revisar con Integrador para no crear actores fantasma ni UI superviviente.
11. Mantener HP bars, path 133 puntos, 8 pads, 5 oleadas, 63 apariciones, economía, cooldowns, menú táctil y guardados del core tal cual; solo reemplazar selección de textura/fotograma.
12. Perf: cuatro texturas RGBA decodificadas representan ~17.876 MiB; si se retienen además 4 P07 podrían sumarse otros ~17.876 MiB antes de overhead. Decidir lazy-preload/unload de texturas y medir con navegador/Android **real**.

## D. Matriz eventos ABI (confirmados en fuente del core)
| Emite Core | Campos mínimos | Vista P08 | Condición contra eventos fantasma |
|---|---|---|---|
| \`soldier_spawn\` | entityId/towerId/worldPosition/level | idle → walk | un solo sprite por entityId |
| \`soldier_attack_windup\` | entityId/towerId/targetId/windup/worldPosition | attackWindup | no daño |
| \`soldier_attack_hit\` | entityId/targetId/damage | attack frame 2 | target debe corresponder al windup pendiente |
| \`enemy_attack_windup\` | entityId/targetId/windup | attackWindup | enemigo canónico P03 |
| \`soldier_hit\` | entityId/sourceId/damage/hp | soldado hit; enemigo sourceId attack frame 2 | solo una presentación correlacionada |
| \`enemy_blocked / enemy_unblocked\` | entityId/soldierId | blocked / locomoción | no crear bloqueo ni radio |
| \`soldier_die / soldier_respawn\` | entityId/towerId/... | die/idle | preservar nivel II en eventos que omiten level |
| \`soldier_removed\` | entityId/towerId | cleanup | sin tweens huérfanos |
| \`entity_die / entity_escape\` | entityId | die/escape visual | core ya pagó o restó vidas |
| \`game_paused/resumed\` | type | freeze/resume | cero avance en pausa |

## E. QA previa y pruebas obligatorias después de integración
La rama P08 suministra \`qa-p08.mjs\` como **Node real estricto** (incluye 4 P07 alpha-clean reexport y 4 P08 nuevos, SHA256 PNG+RGBA, CRC, alfa0 RGB0, 32 frames, equivalencia neutral enemy, variante I/II y FSM).
**Sin ejecución real Node22 exit0 no debe considerarse PASS_NODE.**
- Node: \`node public/official/src/actors-visual/p08/qa-p08.mjs\`, \`node public/official/src/actors-visual/qa-p07.mjs\` y \`node public/official/src/actors-visual/qa-p06.mjs\`.
- Browser: prueba de galería \`public/official/src/actors-visual/p08/index.html\` en 1280×768, 844×390, 932×430: \`P08_REVIEW_URL=http://127.0.0.1:<PUERTO>/official/src/actors-visual/p08/index.html node public/official/src/actors-visual/p08/qa-p08-browser.mjs\`.
- Integrador: screenshots core REAL de 1 recluta vs 2 veteranos; \`soldier_attack_windup→soldier_attack_hit\`, \`enemy_attack_windup→soldier_hit\` contra orco y hound; vida/economía unchanged.
- Medir a escala real de las imágenes de Android 50833.jpg/50834.jpg: **no estaban presentes entre los recursos disponibles de este chat, por lo que las dimensiones de sus sprites no se han extraído ni validado**.
- QA visual: mantener neutral de enemigos P03 y operador sniper P03; comparar contra C1-C aprobada 1280×768 hash.
- Si errores de textura, silhouette downgrade o contacto no perceptible: conservar gameplay y P03 en lugar de instalar P08.

## F. Bloqueante externo y propuesta focalizada
No solicitar \`enemy_attack_hit\` por ahora: \`soldier_hit.sourceId\` existente basta para contacto visual confirmado. Si en integración se detecta \`soldier_hit\` posterior a muerte/respawn y la correlación falla, reportar RFC al Integrador con evento \`enemy_attack_cancelled {entityId,targetId,reason,tick}\` como **PROPUESTA NO IMPLEMENTADA**. No alterar core desde Personajes.

**La aprobación comercial/artística corresponde al propietario y Dirección General; este RFC no modifica producción.**

## F. B1 — Entrega de legibilidad de galería (20-10-2026)
**Solo presentación; no es un nuevo contrato de gameplay.** La vitrina anterior del PR #39 colocaba los dos veteranos en x=453/594 con paneles de 180 px y títulos iguales casi superpuestos; la separación entre centros era 141 px, produciendo 39 px de solapamiento de tarjetas. En P08-B1 los centros son x=425/611, paneles de 174 px, **12 px de espacio entre paneles**, y los títulos independientes `II · VETERANO 1` y `II · VETERANO 2`; el texto es 20 px en mundo de galería para mantener legibilidad en viewport horizontal. No cambia ninguna textura ni escala de actor.

Para instalar el arte, el Integrador debe usar `p08VisualForSoldierLevel(u.level)` con **cada entityId auténtico del core**: Nivel I=1 recluta; Nivel II=2 instancias visuales del mismo atlas `infantry_veteran` pero con ids/posiciones de los dos soldados core. Si cambia el nivel, reemplazar texture/atlas del sprite existente sin crear un tercer soldado. `p08VisualForEnemy('warrior'|'hound')` conserva silueta P03; los demás enemigos usan fallback vigente.

**Sincronización por eventos core**: `soldier_attack_windup` → `attackWindup`; `soldier_attack_hit` → `attack-2` **después de daño aplicado por core**; `enemy_attack_windup` → `attackWindup`; `soldier_hit` con `sourceId` → `attack-2` del enemigo real y `hit` del soldado real. No existe `enemy_attack_hit` garantizado, nunca deducir un daño nuevo desde `attack-2`. `soldier_die/respawn/removed`, `enemy_blocked`, `entity_die/escape`, pausa/reanudación y reset requieren limpieza y congelación de vistas sin alterar entidad/HP/vida del core.

**Límite de aprobación:** Node P07/P08 + build ya pasaron en auditoría independiente previa al microajuste; comparar capturas *después* de este commit en Chromium real 1280×768, 844×390, 932×430 y someter a aprobación. El test de galería `qa-p08-browser.mjs` ahora rechaza solapamientos de tarjetas o títulos y registra SHA256 de las nueve capturas. El test pendiente en C1-D7 de cinco oleadas es exclusivamente de Dirección General.
