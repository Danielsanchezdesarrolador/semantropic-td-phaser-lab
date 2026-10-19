# SEMANTROPIC TD — Equipo T, T-01/T-02, entrega visual aislada
Fecha: 2026-10-19. Rama: feature/phaser-torres. Contratos PM-03/C0 v1.

## Qué se entregó
- Cuatro SVG originales editables 360 x 420: Infantería I/II; Francotiradores I/II.
- Módulo propio public/official/src/towers-visual con catálogo, FX y vitrina index.html.
- Manifiesto docs/art/towers/ASSET_MANIFEST_T01.json y QA estático qa-t01.mjs.
- Visual de puerta de reclutas → fortaleza veterana; torre vigía → estación de precisión reforzada.
- VFX voluntarios de señal de despliegue sin soldados (actor P pendiente); trazador e impacto sin daño.
- eventId de demostración con deduplicación y clear de objetos gráficos.
- No se escribe core, m01-preview, mapa, economía, datos campaña ni arte de actores.

## URL prevista al hacer build
En el dominio que despliegue el integrador, visitar /official/src/towers-visual/index.html.
Depende de Phaser 4.2.1 local copiado por el build existente (no CDN).
Se visualiza en cuatro sockets ficticios; no es M01 ni usa geometría verdadera.

## Estado QA
[CONFIRMADO EN CÓDIGO] fuentes y manifiesto presentes en rama T.
[NO EJECUTADO] navegador real Phaser/WebGL2; capturas; iPhone/Android físico; FPS.
[PENDIENTE] validar que Phaser 4.2.1 resuelva carga SVG al hacer build real.
[NO IMPLEMENTADO] actores/operadores/soldados, ataques válidos core, costes, stats, HP, disparos jugables, upgrades.
[PENDIENTE] revisión artística por Dirección y tamaños de sprites con socket real M01.

## QA y rollback propuestos al integrador
1. node --check public/official/src/towers-visual/catalog.mjs
2. node --check public/official/src/towers-visual/fx.mjs
3. node --check public/official/src/towers-visual/showcase.mjs
4. node docs/art/towers/qa-t01.mjs
5. npm install y npm run build, luego galería en Chrome con WebGL2.
6. Capturar 844x390 y 932x430; pulsar los cuatro botones.
7. Pausa/reanudación/limpiar FX; verificar consola y recortes.
8. Comparar composición y pivotes con arte oficial M01, una vez exista bridge.
9. Revertir estos commits T para rollback o rechazar PR; no tocar stable.

## Dependencias pendientes
CombatEventBridge y socket adapter son interfaces documentadas, no APIs ya activas.
Operador Sniper y Soldados son entregables del Equipo P.
Infantería III (2 vs 3 soldados) continúa BLOQUEADA y fuera de alcance.
Ningún Render nuevo, merge ni cambio de rama de producción autorizado.
