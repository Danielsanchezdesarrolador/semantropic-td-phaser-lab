# SEMANTROPIC TD — C1-B/Q2 | Protocolo permanente de actas en GitHub

**Dirección General · 2026-10-19 · Estado: orden de documentación multiequipo.**

## Objetivo
Los equipos M, T y P **DEBEN VERSIONAR directamente en GitHub** sus actas, QA, decisiones artísticas, manifiestos y capturas; así el Director General/Integrador las consulta desde sus ramas y PRs, sin que el usuario tenga que enviarlas manualmente en cada conversación. Los chats no se sincronizan entre sí: GitHub es la fuente común verificable.

## Ramas nuevas de trabajo (creadas previamente)
| Equipo | Rama | Base | Destino PR DRAFT |
|---|---|---|---|
| M-03 | `feature/art-m03-q2-mapas` | `feature/art-m02-mapas` @ `a2cde5a52ec05d2a0136426cf8121c69c85af45b` | `feature/art-m02-mapas` |
| T-04 | `feature/art-t04-q2-torres` | `feature/art-t03-torres` @ `c0ca8792a2d79fd5c6d5ca66b7832a9e97e4eea2` | `feature/art-t03-torres` |
| P-03 | `feature/art-p03-q2-personajes` | `feature/art-p02-personajes` @ `a15b78ffcb365b2d2f717ce3706c9d92f3d75bf3` | `feature/art-p02-personajes` |

## Rutas y archivos obligatorios
- M: `docs/art/maps/actas/INDEX.md`, `ACTA_M03_C1B_Q2_2026-10-19.md`, `QA_M03_C1B_Q2.json`.
- T: `docs/art/towers/actas/INDEX.md`, `ACTA_T04_C1B_Q2_2026-10-19.md`, `QA_T04_C1B_Q2.json`.
- P: `docs/art/actors/actas/INDEX.md`, `ACTA_P03_C1B_Q2_2026-10-19.md`, `QA_P03_C1B_Q2.json`.

Capturas testigo livianas opcionalmente `docs/art/<equipo>/evidencias/<codigo>/**`; scripts/arte y manifest en su namespace. INDEX enlaza el PR, acta, QA, manifest, capturas, SHA HEAD, bloqueantes y versiones anteriores. **La descripción del PR debe enlazar esos documentos**. Una entrega sin acta, INDEX, QA y PR se considera documentalmente INCOMPLETA.

## Acta mínima
Identificación y SHA; objetivo autorizado y cambios reales por archivo; antes/después a misma escala; decisiones de color/materiales/siluetas/anchos/pivotes/animaciones; contratos; comandos y resultados QA; URL de GitHub Actions; capturas reales/otros conceptos claramente diferenciados; tests NO ejecutados; pendientes/BLOQUEANTES; regresiones; licencia/procedencia; rollback; criterio de aprobación del Director.

## QA JSON
`schemaVersion: "c1b-q2-qa-v1"`; `team, milestone, branch, baseSha, headSha, prUrl, checks[], screenshotIndex[], knownBlockers[], gameplayImplemented:false`. Cada check: comando real, entorno, estado PASS/FAIL/NOT_RUN, evidencia y observaciones. No inventar FPS, ejecución física, CI ni SHA.

## Protección técnica
Sólo editar rutas propias: M `art/maps`, `src/maps-visual`, `docs/art/maps`; T `art/towers`, `src/towers-visual`, `docs/art/towers`; P `art/actors`, `src/actors-visual`, `docs/art/actors`. Prohibidos `integration/c1b-art-review`, escenas comunes, core, mapas/campaña canónicos, build, Render, main, producción. Si necesitan interfaz compartida, crean RFC en su carpeta; Integrador decide. No merge unilateral.

## Estado verificable antes de Q2
PR #8 integra M02 + T03 + P02 en una escena VISUAL. QA en Chrome WebGL2 SwiftShader [run 39342295194](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39342295194) pasa scripts M/T/P, build, 1280x768, 844x390, 932x430, 4 torres, 8 sockets, 133 waypoints, 13 instancias visuales y controles. **NO** certifica Android/iPhone físicos, arte comercial ni economía, HP, ataques core o resultado campaña.

## Criterio de finalización
Equipo entrega PR DRAFT y comenta brevemente rama/PR/INDEX/bloqueantes. El usuario no necesita reenviar actas; Dirección General las consultará en GitHub, inspeccionará archivos y pruebas, y emitirá instrucciones posteriores.
