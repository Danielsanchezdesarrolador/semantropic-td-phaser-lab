# SEMANTROPIC TD — Contratos compartidos v1 (PM-03 / C0)
**Fecha:** 2026-10-19. **Rama coordinadora:** integration/phaser.
**BASE CONGELADA PARA PREPARACIÓN:** b4edfb176094d65059f88145e556daf4a890e56e (PH-02B, 5 commits descendientes de PH-01 c497c145e9fea0cdbe20f82a79525b11721b6432).

## Carácter de estos documentos
Estos contratos constituyen una **norma de coordinación v1** aprobada para trabajo paralelo. Son especificaciones de interfaz y entrega, **NO prueba de que las APIs estén implementadas ni de que exista gameplay completo en Phaser**. Los adaptadores y pruebas de ejecución requerirán PRs independientes del Integrador. Donde aparezca PROPUESTA/ABIERTO está prohibido asumir una implementación válida.

## Motor y fuentes
- Proyecto oficial: Phaser 4.2.1 / WebGL2 en HTML5, objetivo Android/iOS/iPadOS mobile-first. PC para desarrollo.
- Referencia protegida: public/JUEGO_V5_CANVAS.html; fuente de mapas y campaña: public/official/data/maps.v5.json y public/official/data/campaign140.v5.json.
- Visor Phaser de M01: public/official/src/m01-model.mjs (solo spawns/ruta/fugas) y m01-preview.mjs (no construcción, torres, economía jugable ni combate). PH02B añade arte sin alterar lógica.
- M01: 133 waypoints, 8 puntos de construcción, 5 oleadas (8/10/11/13/21 = 63 enemigos, warrior y hound), vidas iniciales 100 y fuga no-jefe −2.
- Diez mapas y 140 oleadas [5,7,9,11,13,15,17,19,21,23], cinco torres, 18 arquetipos no-jefe y tres jefes.
- M05 mistlord ola 13, M08 ruinwarden ola 19, M10 eclipseemperor ola 23. Los slots declarados NO prueban IA implementada.
- No reintroducir torres legacy, no reescribir sistemas compartidos sin integrador. La decisión artística C continúa vigente; diseño 100% original.

## Documentos
1. MAP_SOCKET_CONTRACT.md — M crea terreno/paths/pads; T consume sockets; P consume rutas/oclusiones.
2. TOWER_VISUAL_CONTRACT.md — T crea edificios y VFX de torres; P produce operadores/soldados; core manda la lógica.
3. ACTOR_VISUAL_CONTRACT.md — P crea enemigos, aliados y animadores; T solicita presentaciones de operadores.
4. COMBAT_EVENTS_CONTRACT.md — eventos de combate de fuente core; visuales no infligen daño.
5. ASSET_MANIFEST_SCHEMA.md — manifiesto de recursos, versiones, licencias y escalas.
6. OWNERSHIP_AND_WORKFLOW.md — permisos por rutas, ramas, PR, QA y bloqueantes.

## Principios inviolables
- Una sola autoridad para HP, escudos, oro, cooldown, movimientos, colisiones, fuga, recompensas, victorias, resultados y persistencia: **core del Integrador**.
- Ningún módulo de arte computa daño, crea oro o cambia fugas.
- Los tres equipos no editan m01-model.mjs, m01-preview.mjs, public/official/index.html, public/t3b/art-c.js, package.json, campaign140.v5.json ni maps.v5.json en sus ramas sin PR del Integrador.
- Las escalas se acuerdan en unidades del mundo y puntos de anclaje; las cifras de tamaños definitivos requieren revisión visual en M01 real.
- Cada PR debe indicar [CÓDIGO PROBADO], [SIMULACIÓN], [CAPTURA REAL], [PENDIENTE], [NO EJECUTADO] según corresponda.
- No merge automático, no editar main/production, no despliegues Render nuevos sin instrucción específica.
- Los ejemplos JSON se publican como **shapes de interfaz a implementar**, no como esquemas ya existentes.

## Puerta de salida de C0
- [x] Base congelada en commit de origen y rama central creada.
- [x] Especificaciones v1 documentadas en integración.
- [ ] Revisión/ratificación de detalles ABI y PR de adaptadores, eventos y validadores.
- [ ] QA del primer M01 con torres y actores reales; no afirmar terminado.
- [ ] Resolver discrepancia de recuento de Infantería III antes de atlas final de ese nivel.

**Los equipos pueden preparar trabajo independiente tras recibir ramas creadas desde el mismo commit con estos contratos; la conexión al core queda reservada al Integrador.**
