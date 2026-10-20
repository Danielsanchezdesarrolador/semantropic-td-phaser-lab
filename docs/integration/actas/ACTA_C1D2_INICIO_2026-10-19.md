# SEMANTROPIC TD — C1-D2 | Arranque del combate virtual M01
**Fecha:** 19 octubre 2026 (Santiago). **Rama:** `feature/core-c1d2-sniper-combat` (a partir de C1-D1 verificado `ee9f931143e63b84ed872330806a265dcd21c294`).
**Estado:** paridad nominal y elección de objetivo IMPLEMENTADAS COMO FUNCIONES PURAS; **combate runtime pendiente**.

## Playtest real publicado
- **Render:** `semantropic-td-c1d-playtest` (servicio estático independiente).
- **URL estable:** https://semantropic-td-c1d-playtest.onrender.com/playtest/
- **Escena C1-D1:** https://semantropic-td-c1d-playtest.onrender.com/official/src/c1d-build/index.html
- **Rama release:** `staging/c1d-playtest`; no sigue directamente las ramas de desarrollo. Es canal de pruebas, NO producción.
- **Funciones actualmente publicadas:** seleccionar ocho sockets, construir, mejorar I→II y vender; saldo/ledger real; NO enemigos, daños, resultados ni guardado.

## Paralelismo autorizado
- M05 `feature/art-m05-combat-readiness` → PR DRAFT contra `feature/art-m04-illustrated-terrain`.
- T06 `feature/art-t06-sniper-vfx` → PR DRAFT contra `feature/art-t05-premium-towers`.
- P05 `feature/art-p05-combat-reactivity` → PR DRAFT contra `feature/art-p04-animation-pass`.
- Integrador D2 `feature/core-c1d2-sniper-combat` → PR DRAFT contra `feature/core-c1d-m01-combat`.
- Los equipos M/T/P producen solo arte, animación y recursos visuales en sus namespaces, con INDEX+ACTA+QA JSON GitHub; core decide HP, daño, recompensa, cooldown, detección, ruta y wave.
- El usuario distribuye los TXT a sus tres chats; no existe envío automático entre conversaciones.

## Hallazgos verificados de la fuente Canvas V5
- `SNIPER_LEVELS` I/II nominal: (damage 40, interval 1.65, range 230, windup .26), (damage 66, interval 1.55, range 246, windup .25).
- `SPOT_BONUS`: power damage 1.18, focus range 1.16, tempo rate .84.
- `sniperPick()`: objetivo por avance de ruta PRIMERO predeterminado (otras prioridades se gestionarán más adelante).
- `sniperDamage()`: fórmula FINAL depende de multiplicadores QA17/18/19, potenciales resistencias y armadura, que quedan BLOQUEANTES para paridad efectiva.
- `campaign140Bounty()` y `e5Credit()` exigen identificar pago una vez para cada muerte. **No registrar recompensas ficticias en el módulo visual.**
- Implementación inicial en `public/official/src/core-c1d/sniper-parity.mjs`: funciones puras para stats nominales y target PRIMERO, SIN aplicar daño.
- Test `tools/qa-c1d2-sniper-parity.mjs` verifica constantes con texto protegido V5 y selección de objetivo. [CI #39356433411](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39356433411) = **SUCCESS**.

## Próxima implementación C1-D2 (pendiente)
1. Core enemigos warrior/hound con spawn canónico 63, HP/velocidad, camino y fugas reales. Detener al agotarse 100 vidas.
2. Torre virtual Sniper I/II que consulta core por posición/rango/target y emite ataque con cadencia/windup; daño efectivo auditado y aplicado solo por core.
3. Bajas idempotentes y monedas de recompensas conforme a Canvas V5 real. No usar fotos/VFX para confirmar impactos.
4. QA Node de dt, determinismo, kill/escape una vez, no-defense 50 fugas, final wave y gastos.
5. Vitrina Phaser gameplay con enemigos, torres reales, HUD y controles; pruebas Chromium WebGL2; solo entonces considerar promoción al staging de Render.

## Protección
No tocar `main`, `production`, `integration/phaser`, `public/JUEGO_V5_CANVAS.html`, ni servicios Render antiguos. El playtest staging recibe únicamente commits controlados aprobados y auditados por Integración.
