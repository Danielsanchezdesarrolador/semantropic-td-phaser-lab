# RFC-P04→T05 · Montaje de recluta y francotirador
**Equipo P, P04/C1-D, 19-10-2026**
**Estado:** METADATOS VERIFICADOS EN ARCHIVOS T05, COMPATIBILIDAD VISUAL NO PROBADA.

Fuente **READ ONLY**: `feature/art-t05-premium-towers`, `public/official/src/towers-visual/catalog.mjs` y sus referencias a `frontRail`. En fecha de auditoría la rama T05 existe; estos son sus valores disponibles y pueden cambiar antes de aprobación. No editamos ningún archivo T05.

## Referencia y cálculo
Fuente torre SVG `360×420 px`. `footAnchor=(0.5,0.93)` → referencia de centro en píxeles **(180,390.6)**.
`dx=(local.x-180)*worldScaleProposal`; `dy=(local.y-390.6)*worldScaleProposal`.
Offsets relativos al pie de la torre/socket dentro de la escena, **no** posiciones absolutas de mapas.

| Actor P04 | Torre T05 read-only | Slot local de fuente | Escala T05 | dx mundo | dy mundo | Capa requerida |
|---|---|---|---:|---:|---:|---|
| infantry_recruit | towers/infantry/level-1 | spawnExitLocal (133,348) | 0.298 | -14.006 | -12.695 | Soldado fuera de puerta por orden de core |
| infantry_recruit | towers/infantry/level-2 | spawnExitLocal (133,348) | 0.310 | -14.570 | -13.206 | Acceso a cuartel / sin clipping umbral |
| sniper_operator | towers/sniper/level-1 | operatorAnchorLocal (187,207) | 0.310 | +2.170 | -56.916 | **back tower → actor → frontRail** |
| sniper_operator | towers/sniper/level-2 | operatorAnchorLocal (187,207) | 0.322 | +2.254 | -59.119 | **back tower → actor → frontRail** |

### Precisión importante
- Los slots y escalas provienen de **T05 en su propia rama**, no del viejo T03 ni de un T05 integrado físicamente con P04.
- T05 incluye `frontRail` separado mediante capas SVG (referencias a `towers/layers/sniper-1-front.svg`, `sniper-2-front.svg`). Dicho archivo NO se copia al namespace P.
- Las alturas P04 **91 / 67 / 88 / 80 world units** se preservan como propuesta, **no** collider ni aprobación.
- Pie actor `(0.5,.92)`, sombra `(0.5,1)`; es diferente al footAnchor de torre `(0.5,.93)`.
- Comprobación de rostro visible, culata, rifle frente al `frontRail`, sombras en deck y barrel alignment: **NO EJECUTADO** (falta escena conjunta T05/P04 en navegador).

## Petición concreta a Equipo T05 / Integrador
1. Ratificar `operatorAnchorLocal` en su próximo commit definitivo y proporcionar **`frontRail` separada** para dejar piernas/cuerpo detrás de la baranda sin tapar cabeza, rifle o HUD.
2. Permitir dos subcapas: `towerBack/deck`, `actorByFootY`, `towerFrontRail` con depth decidido por Integrador; evitar recortar todo el operador mediante una máscara total.
3. Confirmar worldScale real y punto de boca de fuego T05; P04 anima rifle visual **sin disparar proyectil/muzzle**.
4. Montar un recluta con pies en spawnExitLocal; el core decidirá si/ cuándo aparece, su bloqueo y su HP.
5. Probar 1280×768, 844×390, 932×430 con la misma cámara y 20–30 entidades VISUALES con pausa, sin fingir pelea real.
6. Si hay desalineación, registrar error medido `observedWorldDx/Dy` y captura **REAL** bajo `docs/art/actors/evidencias/P04/`. No alterar mapas/T05/core en esta rama.

**Responsabilidades:** P crea sprite/rig/pose y entrega claves `actors/allies/sniper-operator/v1/p04` / `actors/allies/infantry-recruit/v1/p04`; T05 dueño del edificio/baranda y VFX de arma; Integrador dueño de escena, core, eventos y depth.

**Cierre:** ABI contrato versión 1 preservado. RFC sigue PENDIENTE de QA visual conjunto, no declarar correctos los anclajes solo porque existan números.