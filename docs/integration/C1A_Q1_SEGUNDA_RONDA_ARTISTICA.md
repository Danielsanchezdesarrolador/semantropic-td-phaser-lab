# SEMANTROPIC TD — C1-A/Q1 y apertura de segunda ronda artística
**Fecha:** 2026-10-19. **Director General/Integrador:** integración central. **Estado:** etapa artística M-02/T-03/P-02 autorizada.

## Verificación inicial ejecutada
- PR #4 (`integration/c1a-visual`) combina 24 archivos de Mapas, Torres y Personajes sin modificar gameplay/producción.
- Workflow `C1-A visual integration QA`: [ejecución 39335814054](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39335814054) **SUCCESS**, confirmado por jobs exitosos: npm install, Node syntax, QA estructural M/T/P, npm build y verificación de archivos empaquetados.
- **PENDIENTE** navegador WebGL2 real, inspección artística con frame auténtico, touch/móvil físico. No fusionar PR #4 todavía.

## Nuevas ramas de arte (creadas y verificadas)
| Equipo | Nueva rama | Base conservada | Objetivo |
|---|---|---|---|
| M | `feature/art-m02-mapas` | `feature/phaser-mapas` @ `209b57da` | M01 Aurora v2: color vivo, vegetación, camino, pads, profundidad, variantes |
| T | `feature/art-t03-torres` | `feature/phaser-torres` @ `c9fd2f28` | Infantería y Sniper I/II: arquitectura premium, materiales, operadores anclables y VFX |
| P | `feature/art-p02-personajes` | `feature/phaser-personajes` @ `e1cfc075` | Warrior, Hound, Recluta y operador Sniper: silueta, frames, pivotes, expresividad |

**Los PR originales #1, #2, #3 permanecen como borradores sin editar.** Cada lote nuevo debe abrir su propio PR contra la rama anterior del mismo equipo, no sobre integration directamente. Dirección General decidirá cuándo promover lo aprobado al proyecto compartido.

## Estado y ownership
- Core, m01-model, escena C1-A, datos 140, Phaser build, contratos, Render y producción reservados al integrador.
- Equipo M solo carpetas `public/official/art/maps/**`, `src/maps-visual/**`, `docs/art/maps/**`.
- Equipo T solo `art/towers/**`, `src/towers-visual/**`, `docs/art/towers/**`.
- Equipo P solo `art/actors/**`, `src/actors-visual/**`, `docs/art/actors/**`.
- No modificar los 133 puntos del M01, ocho sockets, 5 oleadas, 100 vidas, ni desbloqueos I-II de M01 por trabajo visual.
- Fuentes y atlas originales, manifiestos versionados, no copiar IP ni screenshots externos, estado no certificable sin test auténtico.
- La escena C1-A es presentación visual aislada, NO tiene economía, construcción/ataque real ni victoria de campaña.

## Puertas de aprobación
1. Capturas de escena combinada en PC y paisaje 844×390/932×430.
2. Estándar de escala y sombra compartidos (v1 provisional hasta capturas y aprobación).
3. Antes/después de los cuatro actores, cuatro edificios I/II y M01.
4. QA Node/CI de ramas, render Phaser auténtico donde se ejecute, nota de limitaciones.
5. PRs aislados M-02, T-03, P-02 revisados antes de C1-B core.

**No autorizar merge a production ni Render estable sin aprobación posterior.**
