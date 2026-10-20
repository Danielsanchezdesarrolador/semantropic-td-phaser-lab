# SEMANTROPIC TD — RFC-P06/T07/C1-D2 · Operador desarmado y anclajes
**Fecha:** 2026-10-20 · **Equipo P** · **Fuente T07:** feature/art-t07-sniper-single-rifle (READ ONLY)
**Fuente Core:** PR #22, SHA `482d4128bcd2d295a6eacb2909e209d89082fe46` (READ ONLY)
**Estado:** [CONFIRMADO EN CÓDIGO] variante SIN RIFLE, [BLOQUEANTE] alinear mano/culata en escena.

## Resolución P06 del doble rifle
El PNG P06 `sniper_operator_unarmed.png` se dibuja **sin rifle** mediante `p06-png-generator.mjs`. La clave es `actors/allies/sniper-operator/v1/p06-unarmed`, canon ID de gameplay sigue `sniper_operator`. El P05 armado permanece intacto para su galería histórica y NO está habilitado para integración conjunta.
La arquitectura/cañón/baranda/frontRail y muzzle de T07 pertenecen al Equipo T, P06 no los copió.

## Puntos de referencia T07 (metadata leída)
La torre tiene sourceSize **360×420**, `footAnchor=(.5,.93)`, centro de pie origen (180,390.6) source px.

| T07 | worldScale T07 | operatorAnchorLocal | stockGripLocal | opticalFocusLocal | muzzleLocal | recoilPivotLocal |
|---|---:|---|---|---|---|---|
| Sniper I | .318 | (185,204) | (205,184) | (248,162) | (321,174) | (235,199) |
| Sniper II | .328 | (185,206) | (209,182) | (258,154) | (330,171) | (245,191) |

**Relativo a pie del operador en torre**:
- I: stockGrip `(+6.36,-6.36) wu`; muzzle relativo `(+43.25,-9.54) wu`.
- II: stockGrip `(+7.872,-7.872) wu`; muzzle relativo `(+47.56,-11.48) wu`.

## Anatomía P06 sin arma — referencias en fuente 176×208
- footPivot source `(88,191)` y anchor normalizado (0.5,0.92).
- `handGripLocal ≈ (109,101)`, `offHandLocal ≈(68,107)`.
- `eyeFocusLocal ≈(78,35)`, `shoulderLocal ≈(112,80)`.
- `headBoundsLocal ≈(65,7,46×56)`.
- Estados E/W, W por espejado horizontal x' = 176-x, **no un dibujo N/S inventado**.
- Se dispone de metadata por pose en `public/official/art/actors/p06-operator-sockets.json`.

## Desajuste descubierto por cálculos, NO por screenshot
Si el Integrador mantiene altura visual P05 de **80 wu** sobre altura útil fuente aproximada **171 px**:
- Actor handGrip relativo al pie: `((109-88),(101-191))*(80/171)` ≈ **(+9.82,-42.11) wu**.
- StockGrip T07 I relativo al pie: **(+6.36,-6.36) wu** → discrepancia mano ≈ **(+3.46,-35.75) wu**.
- StockGrip T07 II relativo al pie: **(+7.87,-7.87) wu** → discrepancia mano ≈ **(+1.95,-34.23) wu**.

Esta comparación no acredita que la mano esté realmente desplazada tantos píxeles *en el render*, porque el escalado final y el anchor compuesto corresponden al Integrador. **Indica un posible bloqueo grande**: con 80wu full-body y estos slots, la mano no cae en culata. No resolver mediante escalado arbitrario de la torre desde P.

## Corrección priorizada a discutir
1. Integrador reproduce montaje P06→T07 I/II a 1280×768, 844×390, 932×430, muestra pies/ojos/manos/culata con guías.
2. Equipo T07 mantiene arma **única** y aporta máscaras `backStructure / rifleMounted / frontRail` para el operador.
3. Equipo P06 corrige postura/codos/pelvis de una variante `mounted` **solo después de** fijar escala/slot real o proponer tratamiento de operador superior sin piernas si Dirección lo aprueba.
4. Se abre RFC de `operatorWorldHeight`, `handGripWorld`, `stockGripWorld`, máscara por rail, tolerancias aceptadas en píxeles. Prohibido marcar APPROVED sin captura.
5. La actualización I→II del edificio cambia asociación a operatorAnchorLocal, no crea un nuevo core enemy/spawn ni recurso.

## Core PR22 / T07 event origin
`M01CombatWorld` emite `attack_fire` con `payload.originWorld`, `payload.targetWorld`, `bulletId`. T07 VFX puede requerir `muzzleWorld`. **El origen físico de la bala NO prueba coincidencia con la boca del arma**. Integrador debe mapear `originWorld→muzzleWorld` desde socket T07 y mantener `eventId,entityId,targetId,tick`; no modificar cadence/HP/daño core para embellecer un tiro.

## QA y propiedad
- P06 introduce PNG binario real con rifle omitido en **toda la fuente de dibujo del actor**: [CONFIRMADO EN CÓDIGO].
- T07 ya declara capas de rifle individual y frontRail: [CONFIRMADO EN METADATA].
- Montaje real y validación de poses, ojos y clearance de baranda: **[NO EJECUTADO]**.
- Core attack_fire vs muzzle: **[BLOQUEANTE DE ADAPTER]**, no combate ficticio.
- M05/M06: no se copiaron imágenes de sus ramas; el viewer P06 etiqueta expresamente su pradera provisional.
- `infantry_recruit`: gameplay de melee y bloqueo real sigue pendiente de C1-D3.

**NO MERGE** sin revisar montaje y medidas sobre el motor Phaser real.