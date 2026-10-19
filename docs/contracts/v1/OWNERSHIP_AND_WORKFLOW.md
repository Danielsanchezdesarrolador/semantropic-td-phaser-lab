# PM-03/C0 — Ownership de equipos, ramas, PRs y QA
**Coordinación:** Dirección General + Integrador técnico (este frente de integración). **Rama:** integration/phaser.

## Decisiones de base
- Proyecto oficial Phaser 4.2.1, Phaser es motor principal hasta terminar el videojuego. Unity, futura evaluación opcional.
- Commit de origen congelado: `b4edfb176094d65059f88145e556daf4a890e56e`. PH02B incluye PH01 y sus 5 commits adicionales; `production/ph01-p0-m01` queda sin tocar como respaldo.
- Rama central `integration/phaser`. Equipos trabajan desde el **HEAD de integración CON contratos v1 incluidos**, no desde main ni desde ramas de laboratorio.
- Ramas reservadas: `feature/phaser-mapas`, `feature/phaser-torres`, `feature/phaser-personajes`.
- Preferir PRs breves: cada equipo → integration/phaser. Ningún equipo mergea unilateralmente.

## Ownership de escritura propuesto
| Owner | Permitidos inicialmente | Prohibidos unilateralmente |
|---|---|---|
| M | `public/official/art/maps/**`, `public/official/src/maps-visual/**`, `docs/art/maps/**` | `maps.v5.json`, `campaign140.v5.json`, `m01-model.mjs`, visor compartido, towers/actors |
| T | `public/official/art/towers/**`, `public/official/src/towers-visual/**`, `docs/art/towers/**` | `t3b/art-c.js`, archivos M/P, datos economía, core, bootstrap |
| P | `public/official/art/actors/**`, `public/official/src/actors-visual/**`, `docs/art/actors/**` | escenas M, torres, `t3b/art-c.js`, datos de oleadas y core |
| Integrador | `docs/contracts/**`, adaptadores core, bootstrap/scene, package/build, JSON canónico SOLO bajo orden explícita | no incorporar arte o gameplay no aprobado sin revisión |

Las rutas art/ y src/visual son **nuevos namespaces autorizados para PRs futuros**, NO módulos existentes; primero crear carpetas en la rama del equipo. Cambios en nombre/estructura deben registrar propuesta de contrato y revisión central.

## Áreas compartidas bloqueadas
`public/official/index.html`, `public/official/src/m01-model.mjs`, `public/official/src/m01-preview.mjs`, `public/official/data/maps.v5.json`, `public/official/data/campaign140.v5.json`, `public/t3b/art-c.js`, `public/t3b/scene.js`, `package.json`, `build.mjs`, Render y guardados. Ningún equipo trabaja en ellas directamente.
- Una eventual extracción de arte T3B en módulos M/T/P ocurre mediante PR/adaptador específico del Integrador.
- **No cambiar la geometría canónica por estética:** aprobación explícita de Dirección para rework de paths/pads y revisión de balance si cambia geometría jugable.

## Interacciones entre equipos
- M entrega socket estable y capas, T consume la posición y entrega anchor de operadores.
- T implementa estructura y VFX disparos; P assets/animaciones de operador y soldado; core resuelve orden, ataque, daño, cooldown, bloqueo.
- P implementa estados visuales, nunca decide premios o HP.
- Integrador une en el visor real sin copiar demos sintéticas como estadísticas oficiales.

## PR mínimo
Título `[M|T|P] módulo/objetivo`; descripción con commit base, lista de archivos, manifest de assets, capturas reales o marcado no probado, pruebas de sintaxis, funcionamiento aislado, compatibilidad móvil, comparación con C1/C2 y rollback. Nunca PR de varios equipos mezclados.
- Pull request hacia integration/phaser requiere revisión del integrador; no auto-merge.
- Sin Render nuevo hasta que se acuerden credenciales/workspace y servicio de cada rama.
- Permitir vitrinas/art showcases como pruebas independientes con `index.html` propio bajo namespace de equipo; nada de rutas oficiales compartidas.
- Los screenshots son evidencia visual, NO prueban gameplay, FPS ni WebGL2 por sí solos.

## Estado actual y pasos
1. Publicar docs v1 y congelar HEAD de integración.
2. Crear ramas M, T, P DESDE el mismo HEAD nuevo.
3. Cada equipo comienza un PR aislado de assets/manifest/vitrina (no edita core).
4. Integrador abre PR de implementación REAL de adaptadores y bridge en pasos controlados.
5. QA vertical slice M01: solo infantería/sniper hasta II, warrior/hound, 5 oleadas, 100 vidas, economía, compras, ataques, bloqueos, victoria/derrota y estrellas solo cuando la lógica exista.
6. Antes de expandir III–IV, resolver **conteo Infantería III** (PM-03 antiguo vs Canvas V5 fuente).
7. Documentar estados de calidad y ninguna afirmación de certificación prematura.

## Conflictos y bloqueantes
- Diferencia Infantería III: pendiente decisión documental formal. Canvas V5 fuente efectiva según T usa I=1 II=2 III=3 IV=3; PM-03 antiguo III=2. No inventar número o deshacer mecánica.
- `maps.v5.json` conserva campos legacy `recommend: pulse/cannon/prism/frost` y `lives:22`; NO son autorizaciones de torres legacy ni del núcleo de 22 vidas. Core actual fuerza 100 vidas y −2 fugas. Corregir campos solo en PR central posterior con QA y orden, no durante C0.
- Fase actual sin combate oficial portado; no llamar «juego completo» al visor diagnóstico.

**Criterio de avance:** los equipos tienen permiso para iniciar sus módulos VISUALES aislados desde rama común; integración/producción solo después de PR central y pruebas.
