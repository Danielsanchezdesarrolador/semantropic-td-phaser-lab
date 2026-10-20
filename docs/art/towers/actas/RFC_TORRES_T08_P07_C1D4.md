# RFC TORRES T08 — Integrador C1-D4 / Personajes P07 · Continuidad C1-C

**Estado:** [PROPUESTA DE MONTAJE]; NO implementación central autorizada. Propiedad TORRES: arte de torres y FX. P07: operador y manos. DG: escena, HUD, core bridge y releases.

## Identidad fuente recuperada

La captura aprobada por el propietario corresponde a C1-C `integration/c1c-q2-review` PR #12: M03 paleta `viva`, Torres T04 PR #9, Personajes P03; escena histórica de muestra artística, **SIN combate**. PNG original recibido y hash SHA256 verificado `24103e45a0e1249fa4b89d4e65ea16d9e147bdf1e2462e5c4063469a931842ef` (1280×768). Los cuatro masters T08 son byte-idénticos a los masters T04 históricos.

## Contrato 1 — Render visual intacto, no stats

Instalar los cuatro masters recuperados `public/official/art/towers/{infantry,sniper}/level-{1,2}.svg` con sus IDs canónicos, fuente 360×420, footAnchor=(.5,.93), worldScale Infantería I=.296 II=.308, Francotiradores I=.312 II=.319. Estos datos pertenecen a la PRESENTACIÓN T04, no al collider/pad/cadencia/daño ni socket. Restaurar C1-C no equivale a sobrescribir la escena funcional de C1-D4.

## Contrato 2 — Un solo rifle visual, operador P07 desarmado

Compatible legado: `getTowerVisualLayers(meta,'A')` monta `shadowFoot → backStructure (YA incluye rifle) → actor P07 → frontRail`; NUNCA añadir `rifleMounted` ahí.

Avanzado T08 recomendado para Integrador: `getSniperSingleRifleLayers(meta)` monta `shadowFoot → structureNoRifle (CERO rifle) → operador real P07 sniper_operator_unarmed → rifleMounted (UNO) → frontRail → HUD`. Capas comparten `viewBox=0 0 360 420`, mismo footAnchor; no rasterizar una sola vez por instancia sino cachear texturas por asset. En Infantería `frontRail` queda intencionalmente vacío: preservar portada y salida histórica, no crear fachada ficticia delante de reclutas.

## Contrato 3 — Grip, ojo y muzzle

| Nivel | operatorFoot (fuente) | stockGrip | opticalFocus | recoilPivot | muzzle/fireOrigin | Escala |

|---|---|---|---|---|---|---|

| Sniper I | (185,198) | (182,183) | (249,151) | (223,180) | (299,156) | .312 |

| Sniper II | (189,198) | (201,177) | (246,141) | (232,172) | (307,149) | .319 |

Todas unidades **source-px** sobre 360×420. Relación grip−foot proyectada al mundo sin rotación: I=(-0.94,-4.68) wu, II=(3.83,-6.70) wu. Esto NO demuestra que la mano del P07 esté ahí. El desajuste de mano reportado en T07/P06 sigue pendiente de comparación con el atlas P07 real. No ocultar cara/manos con máscara para simular alineación; P07 debe corregir poses si lo requiere el montaje.

## Contrato 4 — Sin doble daño

`adaptSniperCoreEvent` read-only genera `payload.muzzleWorld` desde sprite T y conserva `payload.originWorld`, eventId, bulletId, targetWorld. `SniperShotPresenter` dibuja flash/traza al recibir `attack_fire` emitido por core; el **impacto sólo surge de hit_applied real y bulletId correlacionado**, no de timer visual. Venta, upgrade, objetivo muerto/escapado, pausa y cambio de escena deben invalidar FX mediante bridge central. T no añade lógica a `m01-combat-world.mjs`, no cambia 840wu/s ni stats protegidas.

## Contrato 5 — Fotografía y aprobación

DG debe comparar referencia C1-C real con C1-D4+T08+P07 en mismos world coords/sockets, perfil de cámara y paleta, en 1280×768 / 844×390 / 932×430. Validar pre-oleada, niveles I→II, dos francotiradores, varios enemies/HP real, venta/recompra/pause. Si falla mano/culata, baranda o color, reportar RFC con recorte real; no cambiar la identidad de torre.

**Gate PENDIENTE:** No existe actualmente render integrado WebGL2 T08/P07 certificado por TORRES.
