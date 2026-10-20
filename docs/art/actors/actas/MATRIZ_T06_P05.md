# RFC-P05→T06 — Reactividad del operador y recluta en C1-D2
**Equipo P · 19-10-2026 · Estado: ANCLAJES LEÍDOS EN T06, MONTAJE REAL PENDIENTE**
**Fuente read-only:** `feature/art-t06-sniper-vfx` · `public/official/src/towers-visual/catalog.mjs`.
**Base de la rama artística:** `cb6e7b73edcb6f6df4fa5dace302aac845fc5780`.
**Ownership:** Equipo P no cambia sprites/contratos/pads de Torres ni core. Integrador dueño de C1-D2.

## 1. Anclajes T06 actuales
Metadatos fuente SVG `360×420 px`. FootAnchor de torre `(0.5,0.93)` = centro fuente `(180,390.6)`. Proyección propuesta `dx=(local.x-180)*scale`; `dy=(local.y-390.6)*scale`.

| Edificio T06 | P05 actor | Point local T06 | Scale | dx mundo | dy mundo | Nota |
|---|---|---|---:|---:|---:|---|
| Infantry I | infantry_recruit | spawnExitLocal (133,348) | .298 | -14.006 | -12.695 | Recluta fuera de puerta |
| Infantry II | infantry_recruit | spawnExitLocal (133,348) | .310 | -14.570 | -13.206 | Igual spot, escala nueva |
| Sniper I | sniper_operator | operatorAnchorLocal (185,204) | .318 | +1.590 | -59.339 | Pie en deck, detrás de frontRail |
| Sniper II | sniper_operator | operatorAnchorLocal (185,206) | .328 | +1.640 | -60.549 | Foot sobre plataforma II |

Estos offsets son **calculados desde metadata**, no evidencia de ajuste visual ni posiciones absolutas M01. T06 tiene `backStructure` y `frontRail` como SVG separados para Sniper I/II.

## 2. Conflicto concreto de doble arma [BLOQUEANTE]
**El catálogo T06 declara el rifle como mecanismo permanentemente montado en la torre.**
La fuente visual P04/P05 de `sniper_operator` **también contiene un rifle dibujado dentro de los fotogramas**. Montar ambos sin decisión de capas produciría dos rifles superpuestos o cañones incoherentes.

**Se solicita decisión del Integrador + Equipo T06 antes del merge:**
- **Opción A — recomendada:** T06 conserva el rifle mecánico, P prepara variante del operador **sin arma duplicada**, con manos/torso orientados a la culata. Debe entregarse atlas alternativo real y QA de composición; **NO IMPLEMENTADA todavía**.
- **Opción B:** T06 oculta su rifle durante ciertas poses de actor, pero T06 debe verificar que el muzzle/tracer no se desacople de la torre. P no edita ese mecanismo.
- **Prohibido:** decir que la alineación está resuelta solo porque los metadatos de socket existen.

P05 entrega un operador P04-derived para la **vitrina visual separada**, **no aprobado para montaje directo** en T06 mientras no se resuelva doble arma.

## 3. Orden de capas y ciclo de eventos
`towerBack/deck → operator sprite feetOnDeck → frontRail → projectile/tracerT → HUD`.
El art visual escoge frames por reacción a `attack_windup`, `attack_fire`, `hit_applied`, `entity_die`; **no calcula** si el arma acertó, hit ni daño.
Los eventos figuran en `COMBAT_EVENTS_CONTRACT.md` como **CANDIDATOS**, no como APIs probadas de C1-D2. Se necesita adapter central versionado y eventId único. Owner T mantiene la boca de fuego `muzzleLocal` y traza; P no añade muzzle flash.

## 4. Estados/variantes propuestos del operador
| Estado posicional | ¿Se usa? | Qué debe certificar T06 |
|---|---|---|
| De pie frente al visor | Propuesta visual P05, no aprobada | La cabeza/ojos visibles detrás de rail |
| Rodilla flexionada | Pendiente de arte específico | Pie/cadera caben en deck |
| Sentado | No autorizado en Q2 | Banqueta/cámara/arte T06 necesarios |

No fingir un set sentado/rodilla porque el atlas P05 tenga frame de bloqueo.

## 5. Pruebas solicitadas al Integrador
- Abrir M01 real Phaser/WebGL2 (1280×768, 844×390, 932×430), montar 4 personajes P05 en escala propuesta 91/67/88/80u.
- Sobre T06 Sniper I/II, mostrar frame de `idle`, `attackWindup`, `attack`, `hit`, y overlay `frontRail`; no duplicar rifle.
- Cambiar de dirección E/W sin reiniciar walk del orco/hound.
- Forzar eventos CANDIDATOS uno por vez con core autorizado, medir si hay doble hit/die/escape o fuga visual.
- Documentar desviaciones `observedDX,observedDY` y capturas reales en `docs/art/actors/evidencias/P05`.
- Reportar cualquier incompatibilidad mediante RFC, no cambiar producción desde P.

## 6. Propiedad y prohibiciones
P05 `p05-reactivity.mjs`: máquina de estados visual pura, emitida por el integrador **a través de dispatch(e)**. No está enganchada automáticamente al core.
`p05-view-adapter.mjs`: recibe `setWorldPoseFromCore` y opcionalmente `setOverlayFromCore`, no genera nuevos spawns ni resuelve HP.
Destruir views/atlas bajo ciclo de escena sin duplicar callbacks; el core decide el despawn y contadores.

**Estado global RFC: [REQUISITO SIN VALIDAR] + [BLOQUEANTE DOBLE RIFLE].**