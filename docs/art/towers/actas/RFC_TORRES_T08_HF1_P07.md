# RFC TORRES T08-HF1 → DIRECCIÓN GENERAL / P07 / INTEGRADOR

**Estado:** contrato P07 corregido en TORRES, montaje real P07 NO VALIDADO. [PR #29](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/29).

## Decisión del hotfix

`getSniperSingleRifleLayers(meta)` devuelve `operatorOwner=meta.operatorOwner`, que es `P07` en ambos Snipers T08. Conservar el fallback P06 para catálogos T07 históricos; para un consumidor que necesite introspección de versión, `T08_VISUAL_CORE_CONTRACT` anuncia P07 mientras `T07_VISUAL_CORE_CONTRACT` preserva el contrato anterior. No añadir rifle a assets Personajes.

## Contrato de composición con dos modalidades (exclusivas)

Legado C1-C/T08: `shadowFoot → backStructure (rifle T ya incluido) → operador P07 desarmado → frontRail`. **No sumar rifleMounted**. Avanzado: `shadowFoot → structureNoRifle (sin arma) → operador P07 desarmado → rifleMounted (una sola arma propiedad TORRES) → frontRail → HUD`. El Integrador, único owner de escena compartida, controla instancias, profundidad y tiempo de vida.

## Anclajes canónicos vs contacto real

Sniper I escala .312: operatorAnchorLocal (185,198), stockGripLocal (182,183), muzzle (299,156). Sniper II escala .319: operatorAnchorLocal (189,198), stockGripLocal (201,177), muzzle (307,149); fuente 360×420, pie .5/.93. La proyección matemática de esos puntos NO prueba contacto mano-culata con rig P07. Solicitamos a P07/DG captura real del operador y rifle por niveles I/II en idle, aim, fire/recoil y zoom/crop, misma cámara y sin alterar sockets ni colliders.

## Event adapter

`adaptSniperCoreEvent` solo agrega `muzzleWorld` visual desde sprite/meta T08 y conserva `originWorld`, `eventId`, `bulletId` y el `targetWorld` de Core. `SniperShotPresenter` mantiene impacto condicionado a `hit_applied` correlacionado, sin atribuir muerte, oro o cooldown. Desmontaje correcto de FX ante venta, upgrade y cambio de escena se verificará en Core.

## Pruebas solicitadas para levantar bloqueante

Repetir `node docs/art/towers/qa-t08.mjs` real en checkout HEAD actualizado de PR #29 y `npm run build`, con salida, SHA, exit code y `set -euo pipefail` para pipelines con tee. Luego ejecutar QA conjunto M07/T08/P07 sobre núcleo C1-D4R con Chromium/WebGL2 1280×768, 844×390 y 932×430. No mezclar captura de showroom aislado con escena funcional. Solo DG puede integrar a PR #33 o promover tras aprobación.
