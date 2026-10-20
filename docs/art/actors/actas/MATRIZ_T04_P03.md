# SEMANTROPIC TD · RFC-P03-T04 · Matriz de anclajes de personajes
**Fecha:** 2026-10-19 · **Equipo:** P · **Estado:** PROPUESTA, BLOQUEADA POR ESCENA T04
**Lectura de datos:** `public/official/src/towers-visual/catalog.mjs` del PR #8 `integration/c1b-art-review` (**T03**, no T04 definitivo). No se editó el catálogo.
**T04/Q2:** su rama existe, pero estos valores **NO han sido ratificados por el nuevo arte T04**.

## Sistema de coordenadas de referencia
- Fuente visual de cada torre: **360×420 px**.
- Origen de torre: `footAnchor=(0.5,0.93)` → fuente `(180,390.6)`.
- Proyección **provisional** relativa a `tower.socket.world`:
  `worldOffsetX=(anchorLocal.x-180)*worldScaleProposal`,
  `worldOffsetY=(anchorLocal.y-390.6)*worldScaleProposal`.
- Personaje P03: `footAnchor=(0.5,0.92)`, sombra `(0.5,1)`, sin collider visual.
- Valores que siguen: cálculo aritmético de **referencia T03**, NO medición real del sprite P03 montado en T04.

| Actor y assetId P03 | Edificio de referencia | Local fuente 360×420 | Escala T03 | Offset pie world (dx,dy) | Ocultación/criterio |
|---|---|---|---:|---|---|
| infantry_recruit · actors/allies/infantry-recruit/v1/p03-q2 | infantry I | spawnExitLocal=(140,348) | 0.276 | (-11.04,-11.76) | Spawn inicial dibujado a ras de puerta, capa actores por pie |
| infantry_recruit · actors/allies/infantry-recruit/v1/p03-q2 | infantry II | spawnExitLocal=(145,354) | 0.296 | (-10.36,-10.83) | Pie salida sin atravesar umbral, requiere QA |
| sniper_operator · actors/allies/sniper-operator/v1/p03-q2 | sniper I | operatorAnchorLocal=(190,155) | 0.303 | (+3.03,-71.39) | Cuerpo elevado detrás de pretil, cabeza/arma sobre baranda |
| sniper_operator · actors/allies/sniper-operator/v1/p03-q2 | sniper II | operatorAnchorLocal=(191,146) | 0.317 | (+3.49,-77.53) | Pie visual dentro del balcón, requiere sublayer T/Integrator |

## Responsabilidad de cada equipo
- **T04**: define la torre, escala/offset efectivos, techo/pretil y los sockets `operatorAnchorLocal` y `spawnExitLocal`; si cambia, publica metadata actualizada.
- **P03**: entrega atlas P03, rig/poses y marcador de pie; su cámara no mueve edificios.
- **Integrador**: calcula world position final desde socket oficial; crea el actor bajo core y establece capas/oclusiones.
- Un `attackWindup` visual NO crea lógica de combate ni disparos duplicados.

## Hipótesis artística y riesgo
El operador P03 mantiene altura provisional **80 unidades**, desde pie hasta parte superior dibujada (requiere medir su silueta real). El cuerpo podría atravesar techo/baranda si C1-B lo dibuja con `depth=footY` único. **RFC:** separar capas visuales torre-back → operador → parapeto-front, o definir una máscara local del pretil. No modificar estas capas desde P.
El recluta P03 mantiene altura nominal **88 unidades** y no cambia cuántos soldados crea el core.
La distancia arma-boca de fuego depende de la silueta final. P sólo dibuja pose; efecto de salida y proyectil son dominio de T/core.

## Pruebas solicitadas a Dirección en C1-B Q2
1. Comparar contra torres I/II T04 en la **misma escena M01** y vistas 1280×768, 844×390, 932×430.
2. Mostrar pivote pie, sombra, oclusión de baranda, marco de torre y zona futura HP/escudo.
3. Comprobar escala 1× y texto oculto; si hay clip, emitir discrepancia con coordenadas medidas.
4. Ratificar o sustituir los cuatro offsets arriba por T04, sin reescribir P03 ni alterar socket core.

**BLOQUEANTE actual:** sin render integrado P03/T04 verificado, no afirmar operador correctamente encajado.