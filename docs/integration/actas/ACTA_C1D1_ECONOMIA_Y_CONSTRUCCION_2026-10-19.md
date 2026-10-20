# SEMANTROPIC TD — ACTA C1-D1 | Construcción y Economía del Mapa 01
**Fecha:** 2026-10-19 · **Integrador:** Dirección General.
**Rama aislada:** `feature/core-c1d-m01-combat` · **PR:** [#13](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/13) DRAFT hacia `integration/c1c-q2-review`.

## Alcance autorizado
Primer bloque REAL de la migración del gameplay desde Canvas V5: compra, mejora I→II y venta de Infantería y Francotiradores sobre los **ocho sockets canónicos** de Praderas del Amanecer. La fuente de verdad es `public/official/data/maps.v5.json`; no modificar sus datos.

**La escena C1-D1 NO es combate:** no genera oleadas, enemigos, daños, bloqueos, recompensas, victoria, derrota ni estrellas y no simula esos resultados. La integración artística M04/T05/P04 se conserva en PR #17 separado. Esta escena usa inicialmente arte visual M03/T04 de su rama de origen para evitar merge prematuro.

## Paridad documentada con Canvas V5
- `SPECS.infantry.cost=95`, primera mejora `SPECS.infantry.upgrades[0]=135`.
- `SPECS.sniper.cost=140`, primera mejora `SPECS.sniper.upgrades[0]=185`.
- `upgradePrice(t)` selecciona `SPECS[t.type].upgrades[t.stage-1]`.
- `clickTile(cx,cy)` comprueba spot real/ocupación, coste y desbloqueo antes de construir.
- `sell()` devuelve `floor(spent * .65)` — no devolver el 100%.
- `e5Spend` registra débito y `e5Credit` registra crédito; C1-D1 incorpora ledger propio y balance comprobable.
- M01 Normal: `gold=365`, 8 spots, 133 route waypoints, `infantry/sniper` nivel máximo II. Otras tres familias y niveles III/IV no están desbloqueados aquí.
- `maps.v5.json` M01 contiene `lives=22` y recomendaciones `pulse/cannon/prism/frost` legacy. Se ignoran explícitamente: en C1-D1 no existe sistema de vidas activo y no se reactivan esas torres.

## Implementación
- `public/official/src/core-c1d/construction-economy.mjs`: `M01BuildEconomy`, catálogos/paridad, quote/build/upgrade/sell, 8 sockets, índices estables, validaciones, saldo, registro de transacciones, eventos `tower_built`/`tower_upgraded`/`tower_sold` de lectura, snapshots defensivos, bloqueo.
- `public/official/src/c1d-build/scene.mjs` + `index.html`: escena real Phaser 4.2.1/WebGL2; selección táctil de pad o controles anteriores/siguientes, elección de familia, compra, evolución II, venta, saldo y últimas transacciones visibles. Indica expresamente «sin combate».
- `tools/qa-c1d1-economy.mjs`: test Node de costes, ocupación, insuficiencia, tope II, refund, ledger, eventos únicos, snapshots y bloqueo.
- `tools/qa-c1d1-browser.mjs`: prueba UI Chromium con WebGL2; secuencia de compra 95→upgrade135→venta149, y compra Sniper140; escritorio y emulaciones 844×390 y 932×430; capturas.
- `.github/workflows/c1d1-economy.yml`: QA en GitHub Actions.
- **Limitación temporal:** no hay persistencia entre recargas; el estado de economía se inicializa para cada sesión de prueba. La persistencia canónica se portará solo al aprobar el contrato de guardado.

## Criterios objetivos
- Resultado de compras y ventas modifica el **core**, no solo el texto de la interfaz.
- Nunca saldo negativo, doble cargo por mismo socket, ni nivel III en M01.
- Prohibido contabilizar recompensas o generar oleadas ficticias.
- Los resultados de Chromium WebGL2 deberán quedar en un run identificado; NO afirmar compatibilidad física iPhone/Android a partir de emulación.
- Rechazar PR si fallan acciones de comprar, subir nivel, vender, carga Phaser, slots o ledger.
- No fusionar a producción ni tocar Canvas V5, PR #17, Render estable ni campaña140.

## Próxima fase
C1-D2: Francotiradores reales (selección de objetivos por rango/prioridad, cooldown, daño efectivo) después de ampliar dominio con entidades enemigas y resolver eventos del core, sin simular impacto por VFX. Posteriormente C1-D3 soldados Infantería y bloqueo. C1-D4 vista/HUD de juego, C1-D5 resultados reales y C1-D6 QA de balance.

## QA efectivamente realizado (posterior a la publicación inicial)
[CI #39354969958](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39354969958) **SUCCESS**: contrato/smoke D0, pruebas de compra/upgrade/venta D1 en Node, compilación Phaser 4.2.1, Chromium WebGL2 real en escritorio 1280×768 y móviles emulados 844×390 / 932×430. Se realizaron transacciones de compra Infantería 95, upgrade 135, venta con abono 149 y compra Francotirador 140; los saldos y ledger coincidieron; también se comprobó que no puede comprarse nivel III ni una mejora Sniper sin oro suficiente.
**Evidencia visual real:** artifact GitHub Actions `c1d1-build-economy-chromium`, nueve PNG (antes, Infantería y Francotiradores en tres viewports). Sin prueba en hardware Android/iPhone real.
**Dictamen:** aceptar C1-D1 como núcleo de construcción/economía **en rama experimental**, sin aprobar combate, guardados, UX móvil definitiva ni merge a producción.
