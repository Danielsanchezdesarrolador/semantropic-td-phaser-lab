# RFC T06 → INTEGRADOR C1-D2 · Eventos visuales de Francotirador

**Estado: PROPUESTA, no integración core certificada.** Equipo T publica un adaptador opcional `SniperShotPresenter` en `public/official/src/towers-visual/sniper-vfx.mjs`, manteniendo intacto `TowerVfxShowcase` de C1-E.

## Envelope esperado, sujeto a validación central

`{contractVersion:'combat-events-v1',eventId:'...',tick:123,entityId:'sniper-instancia',targetId:'enemy-instancia',type:'attack_fire',worldPosition:{x,y},payload:{muzzleWorld:{x,y},targetWorld:{x,y},visualVariant:'A'}}`.

`muzzleWorld` debe derivarse de `projectSourceAnchor(sprite,meta,'fireEffectOriginLocal')` por el Integrador **solo si corresponde** al arma real; `targetWorld` es coordenada de presentación emitida/autorizada por el núcleo, nunca targeting del Equipo T.

`attack_windup` requiere `muzzleWorld`, `targetWorld` opcional. `attack_fire` requiere ambos. `entity_die` y `despawn` cancelan FX ligados por entityId/targetId; `scene_reset` limpia. El presenter no implementa listeners del bus global ni presume su contrato instalado.

Cada `attack_fire.eventId` admitido incrementa únicamente contador de eventos visuales; duplicado rechazado. VFX A traza precisa de hasta 62 world px y B proyectil energético breve hasta 42, ambos se dibujan sin colisiones ni modificar HP. El sprite P04 del operador y su reacción de golpe no corresponden a T.

## Separación arquitectónica solicitada

T06 Sniper I operator foot=(185,204)px, fireEffectOrigin/muzzle=(321,174)px; II=(185,206)px, muzzle=(330,171)px. Source 360×420, footAnchor(.5,.93), escala provisional .318/.328. Integrador monta `shadowFoot → backStructure → actor P04 → frontRail → HUD`; jamás duplicar operador en SVG.

Solicito revisar en escena real C1-D2: 8 pads intactos de M01, hitbox/tamaño táctil sin alterar, profundidad de P04, muzzle con arma y efectos sin tapar barras. No se requiere cambiar el contrato global v1 hasta revisión y autorización central.

## QA / bloqueo

No hay captura Chromium T06 ni build real sobre checkout. Bloqueante para promoción: conectar adaptador a eventos válidos del núcleo y verificar exactamente una traza por `eventId`, pausa/resume, muerte de objetivo, cierre de escena, legibilidad 844×390. No promover módulo por la sola existencia de API.
