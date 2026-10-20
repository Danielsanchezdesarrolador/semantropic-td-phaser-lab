# PERSONAJES P07 ↔ TORRES T08 — RFC CONTINUIDAD C1-C
**Fecha:** 2026-10-20 · **Dueño:** Equipo PERSONAJES · **Estado:** [FUENTE LEÍDA] + [BLOQUEANTE MONTAJE].
**Visual aprobado:** captura C1-C de 1280×768; SHA-256 \`24103e45a0e1249fa4b89d4e65ea16d9e147bdf1e2462e5c4063469a931842ef\`.
**Fuentes:** T08 \`feature/art-t08-continuidad-c1c\` catalog.mjs READ-ONLY, P03 \`p03-rig.mjs\` READ-ONLY, P07 \`p07-p03-continuity-rig.mjs\`.

## 1. El operador P07 conserva identidad de P03
El P07 parte **directamente de P03** y conserva casco, visor cyan, capa verde, piel humana y brazo/postura de vigilancia. El P03 histórico dibujaba un segundo rifle en el propio personaje. La copia P07 elimina la **única llamada de dibujo de rifle** para este actor; no modifica el pintor P03 ni los modelos de T08. Existe PNG RGBA binario \`p07/png/sniper_operator_unarmed.png\` con 32 cuadros, hash registrado en manifest.

Corrección de P07 sobre P03 adicional: el casco humano histórico estaba fuera de celda por desfase de coordenadas; se reubica su mismo arte fuente sobre la cabeza para recluta y operador. No se crea rediseño.

## 2. T08 lee fuentes y conserva calibre/arquitectura
T08 catálogo fuente 360×420px, \`footAnchor=(0.5,.93)\`. La rama T08 añade continuidad a T04 en estructura/rail sin autorizar ningún cambio a torre desde P.
| Torre T08 | WorldScale | Operador slot local | Culata stockGrip | Diferencia culata-slot | Muzzle |
|---|---:|---|---|---|---|
| Sniper I | 0.312 | (185,198) | (182,183) | (-0.936,-4.680)wu | leer del catálogo al montar |
| Sniper II | 0.319 | (189,198) | (201,177) | (+3.828,-6.699)wu | leer del catálogo al montar |

Estas cifras son proyectadas desde metadata, **NO prueba de coincidencia en Phaser**, porque hay varios anchors y capas.

## 3. Mano y ojos P07, provisional
En el rig P03, el operador tiene hombros, brazos y casco en **coordenadas del cuerpo**:
- Dentro de transformaciones \`translate(88,191)\` del pie y \`translate(0,-93)\` del torso, una pose idle aproximada de mano derecha \`(31,-24)\` en torso produce punto de imagen \`(119,74)\`.
- Mano izquierda \`(-2,-33)\` en torso → fuente \`(86,65)\`.
- Pie fuente \`(88,191)\` (\`footAnchor=(.5,.92)\` aproximado).
- Escala propuesta heredada 80wu / 171px = **0.4678 wu/px**: mano derecha desde pie \`(+14.50,-54.74)wu\`. No afirmar que esta escala sea la de montura de torre.

Comparando con stockGrip T08 I \`(-0.936,-4.680)wu\` desde slot, discrepancia teórica \`(+15.44,-50.06)wu\` si el actor se posiciona de forma directa por pie. **[BLOQUEANTE]**: el puerto operatorAnchor podría no representar un pie real, y debe homologarse por Integrador/T08 antes de forzar una corrección de pose. No usar escalado exagerado para taparlo.

## 4. Capas y visibilidad
Integrador y T08 deben ensamblar \`shadowFoot → backStructure → P07 unarmed operator → rifleMounted (solo T08) → frontRail → HUD\`. 
- El perfil del operador debe mostrar casco, ojos, brazos y manos, no desaparecer tras baranda.
- No ocultar entire operator para ocultar desajuste.
- P07 no toca recoilPivot/muzzle ni render de proyectiles.
- Upgrade I→II actualiza socket con core, no instancia enemigo extra.
- Venta, reinicio y respawn de infantería: limpieza via Integrador, no P07.

## 5. Comparación obligatoria con la captura aprobada
Before: fichero adjunto real de C1-C, NO screenshot reprocesado. After: captura real Phaser M07+T08+P07 en viewport 1280×768, personajes/tower en la misma posición y escala; también 844×390 y 932×430 emuladas, 100% zoom de cabeza/manos/rifle.
**No declarar equivalencia visual de P07 vs captura C1-C sólo por ejecutar la misma función de pintura P03**. La imagen de C1-C se ve junto a M03/T04 histórico, que también influye en el aspecto percibido del operador.

## 6. Autoridad Core C1-D4 (PR #28) protegida
El integrador conserva eventos reales de Infantería/soldier_spawn/hit/die/respawn/removed y enemigos, HUD, HP/escudo, economía y camino 133 puntos. P07 sólo entrega PNG/frames/poses; no ejecuta ni modifica lógica de daño ni usa el estado visual para decidir fuga o muerte. Los eventos son autoritativos; solo un bridge central puede suscribirse a ellos.

## Decisión solicitada a Dirección General
1. Determinar qué representa \`operatorAnchorLocal\` en nivel I/II (pie, pelvis o estación), y validar origen con guías T08.
2. Fijar escala y punto del operador conforme a la foto C1-C; medir actual mismatch en render real.
3. Si se requiere nueva pose \`mounted\`, Equipo P corrige **solo** manos/brazos tras recibir puntos en mundo; Equipo T08 no debe tocar sprites P07.
4. Autorizar composición final únicamente con screenshot auténtico y confirmación de arma única.

**No merge ni deploy. P07 personaje sin rifle es un componente disponible, no montaje aprobado.**
