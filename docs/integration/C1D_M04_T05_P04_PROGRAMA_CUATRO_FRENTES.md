# SEMANTROPIC TD — Dirección General | C1-D y tercera revolución artística
**Inicio:** 2026-10-19 · **Estado:** órdenes preparadas, ramas creadas, primera auditoría de gameplay ejecutada.

## Trabajo simultáneo
| Equipo | Rama | Rama base para PR DRAFT | Responsabilidad |
|---|---|---|---|
| M-04 | `feature/art-m04-illustrated-terrain` | `feature/art-m03-q2-mapas` | Praderas ilustradas, microambientes, pads, iluminación |
| T-05 | `feature/art-t05-premium-towers` | `feature/art-t04-q2-torres` | Rework profundo de Cuartel y Vigía I-II, capas/operadores/VFX |
| P-04 | `feature/art-p04-animation-pass` | `feature/art-p03-q2-personajes` | Animación y anatomía de Warrior, Hound, Recluta, operador |
| Core C1-D | `feature/core-c1d-m01-combat` | `integration/c1c-q2-review` | Primer combate REAL del Mapa 01, exclusivo del Integrador |

## Objetivos
**Arte:** No aprobar como versión final una simple suma de polígonos, nuevos contornos o saturación. Se exige diseño original ilustrado, silueta reconocible a escala móvil, camadas correctas y QA visual auténtico.

**Core:** Phaser 4.2.1 WebGL2; M01 5 waves y 63 spawns, 8 pads, 133 waypoints, runtime 100 vidas, gold 365; Infantería/Sniper I–II. Empezar con contrato/paridad antes de stats, construir por D1–D6. No confundir `M01PathSmokeModel` ni escenas C1-A/B/C con partida jugable.

## Documentación en GitHub por cada equipo
- M: `docs/art/maps/actas/INDEX.md`, acta M04 y QA JSON.
- T: `docs/art/towers/actas/INDEX.md`, acta T05 y QA JSON.
- P: `docs/art/actors/actas/INDEX.md`, acta P04 y QA JSON.
- Core: `docs/integration/actas/INDEX.md`, acta C1D0–D6 y QA JSON.
Cada PR enlaza acta, QA, captures, manifiesto y bloqueantes. No pedir al usuario enviar documentos manualmente.

## Avances ya verificables
- Rama Core C1-D y tres ramas de arte creadas, fuentes anteriores intactas.
- [PR #13 C1D0](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/13) DRAFT.
- [CI auditoría #39350436854](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39350436854) PASS de contratos y smoke sin defensas; **NO es combate implementado**.

## Restricciones
No fusionar PRs ni editar producción, main, Canvas V5 protegido, Render estable o guardados. En integración comercial futura se validará con navegador WebGL2, dispositivos físicos y aprobación artística del Director. Historial de PR Q2 #9/#10/#11/#12 disponible para comparación y rollback.
