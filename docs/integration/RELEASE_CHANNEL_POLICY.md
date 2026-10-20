# SEMANTROPIC TD — Canal oficial único y desarrollo continuo (20-oct-2026)

## Decisión confirmada por el usuario
Publicar desde ahora cada **bloque funcional verificado** directamente en el **mismo juego**, sin necesitar consentimiento nuevo en cada actualización ordinaria ni producir URLs de pruebas sucesivas. El usuario confirmó expresamente autorización de actualizar el sitio existente C1-D7 y el flujo continuo. No adelantar bloques sin QA ni interrumpir servicios existentes.

- **URL pública permanente:** https://semantropic-td-jugar.onrender.com/
- **Ruta canónica estable:** /official/src/live/
- **Render service inmutable:** srv-dbbqpl7avr4c73duc8lg, My Workspace.
- **Rama conectada con autoDeploy:** production/semantropic-td-live.
- **Primera evolución del canal:** C1-D6 → **C1-D7 G2**.
- **Escena nueva:** ../c1d7-g2-playable/scene.mjs; T09-HF0 nodos, P08-B1-HF1 evolución/animación, M07-Q2 FIEL/T08 T04 arquitectura original.
- **Pruebas previas release:** [Actions #39505983652](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39505983652) SUCCESS en SHA de código `606cfdb236e42a45d9699457218d91ffac019357`, posterior commit sólo documentación `968e4c354d5bd907d2bac655c125ee0222b02246`.
- M01 conserva cinco oleadas (63 enemigos), ocho plataformas, 133 waypoints, Infantería niveles I/II, Francotirador I/II, resultados y récord local.

## Metodología de publicación sin nuevas esperas
1. Los equipos crean **bloques pequeños** y commits recuperables en ramas de ownership, sin alterar Canvas V5/campaña/arte aprobado.
2. Integrador valida cada bloque (mínimo Node, build y Chromium real incluyendo controles táctiles y fuente visual). Nuevas mecánicas con efecto en la partida requieren QA específico del ciclo afectado; no simular resultados.
3. Tras **QA aprobado** se promueve por commit atómico a la rama de producción, que Render autodespliega **en la URL anterior**, conservando sitio, rutas y guardados compatibles.
4. Verificar Render LIVE, CI de ruta canónica y funcionamiento; ante falla, **rollback en la misma rama y misma URL** sin crear sitios alternativos.
5. Para cambios artísticos grandes o de diseño no solicitados, consultar y mostrar capturas; para correcciones y funciones ya autorizadas, **no repetir solicitudes de permiso**.
6. Distinguir claramente **QA automático** de dispositivo físico / test humano, y no afirmar FPS GPU reales no medidos.

## Seguridad de regresiones
- Visual aprobada C1-C M03/T04/P03 (hash foto 24103e45a0e1249fa4b89d4e65ea16d9e147bdf1e2462e5c4063469a931842ef): silueta del sniper, edificio, colores del escenario, identidades P03 conservadas.
- P08 es evolución animada autorizada con fallback `?actors=p03`; UI T09 puede revertirse para diagnóstico con `?menu=g1`.
- CORE manda economía, golpes, enemigos y estadísticas; arte no lo suplanta.
- Snapshot rollback anterior a C1-D7: `edf84939dfd9aa9e754247b384e5b47fe854b411` (release C1-D6).
- No modificar `public/JUEGO_V5_CANVAS.html`, `public/official/data/maps.v5.json`, `public/official/data/campaign140.v5.json`, `public/official/src/m01-model.mjs`.
