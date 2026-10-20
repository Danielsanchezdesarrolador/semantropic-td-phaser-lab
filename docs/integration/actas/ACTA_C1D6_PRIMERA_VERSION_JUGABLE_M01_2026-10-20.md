# SEMANTROPIC TD — ACTA DE INTEGRACIÓN C1-D6 / MAPA 01 JUGABLE

**Fecha:** 2026-10-20 · **PR:** #36 DRAFT · **Motor:** Phaser 4.2.1 / WebGL2 · **QA fuente exacta:** `b68cde6bb8d2230eadda999cd13232a55f2c0aa5`

## 1. Baselines oficiales obligatorios
- Visual APROBADA POR USUARIO: C1-C screenshot M03/T04/P03, 1280×768 SHA-256 `24103e45a0e1249fa4b89d4e65ea16d9e147bdf1e2462e5c4063469a931842ef`; C1-D4R PR #30 intacta.
- Jugabilidad C1-D5 PR #34, cinco oleadas en M01, 63 warrior/hound, 133 waypoints, 8 pads, 365 oro, 100 vidas, fuga común −2, Infantería I/II con rutas y rally, Sniper I/II, economía, victoria/derrota, 3★ y récord local aislado.

## 2. Origen de las tres entregas y estado
- MAPAS M07-Q2 PR #35 SHA `61fd5c15f9b8c7d24ef29d96997359922bc24771`: M03 Viva "fiel" conservado, optimización cache texturas/props y control lifecycle; QA real Node PASS.
- TORRES T08-HF1 PR #29 SHA `d4b913e5b5fbcb6ad884974aa5df595b71a98b8b`: 4 masters SVG de T04 exactos, operador contractual P07 por metadatos, rifle único en alternativa split; QA real Node PASS. En la escena jugable se usa el master composite original T04 junto con operador P03 aprobado, sin doble capa de rifle.
- PERSONAJES P07-HF1 PR #32 SHA `5eef18c3c86c683d9cb38f89d708eb3d9e7c168e`: 4 PNG persistidos y loader están copiados y precargados. QA REAL Node FAIL `qa-p07.mjs:73` — 45 píxeles con RGB != 0 y alfa 0 en PNG warrior (regla "PNG RGB fringe inside fully transparent areas"); comprobación de bytes reproducibles previa sí PASS. **NO ART RELEASE**. Reportado en PR #32. Escena DEFAULT usa P03 completo original; vista candidata `?actors=p07` y operador experimental `?operator=p07` solo para auditoría, nunca la URL principal.

## 3. Integración C1-D6
Se copiaron 84 Git blobs exactos de los tres PR a rama exclusiva `integration/c1d6-map01-playable-release` desde C1-D5, sin mezclarlos con los dueños. Escena nueva `public/official/src/c1d6-playable/{index.html,scene.mjs}`, atajo `public/play-m01/index.html`. De manera predeterminada renderiza MAPAS M07-Q2 en treatment "fiel" (no pulido), TORRES T08-HF1 con cuatro SVG originales aprobados, P03 original para tres actores y operador, combate C1-D5 real. P07-HF1 binarios están disponibles para diagnóstico únicamente.

No se modificó Canvas V5, `maps.v5.json`, `campaign140.v5.json`, core C1-D5 ni staging Render previo.

## 4. QA real
**[PASS]** [GitHub Actions #39469370610](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39469370610) en SHA `b68cde6bb8d2230eadda999cd13232a55f2c0aa5`.
- Source locks M03/T04/P03; Node `qa-m07-q2.mjs`, `qa-t08.mjs`, `qa-c1d5-navigation.mjs`, `qa-c1d5-results.mjs`, `qa-c1d2-five-waves.mjs`, `qa-c1d3-infantry.mjs` SUCCESS. QA P07 Node FAIL informado en la ejecución pero separado mediante `continue-on-error` **solo porque P07 NO es arte de producción activo**; no presentar PASS P07.
- Build `npm install && npm run build` real Phaser 4.2.1 PASS.
- Chromium WebGL2 real 1280×768, 844×390 y 932×430: seleccionar plataforma (tap), comprar Infantería/Sniper, mover rally, primer kill/recompensa, pausar, reiniciar, mapa visual M07-Q2/T08-HF1/P03 y PNG P07 en TextureManager solo para comparación.
- Derrota real del core sin defensas: 50 fugas, vidas 0, modal "Sin estrellas", progreso no guardado.
- Victoria real de la simulación autoritativa con compras automatizadas: cinco oleadas, 63 bajas, cero fugas, 100 vidas, tres estrellas, récord local persistente tras reinicio.
- Artifact auténtico #12286566855 (11 PNG, logs Mapas/Torres/Core/P07 bloqueado). Chromium se ejecutó vía software WebGL; **no es móvil físico**.

## 5. Dictamen
[CONFIRMADO] **C1-D6 es candidata jugable funcional con mapa y torres nuevos, pero Personajes P07 aún no apto**. La versión artística P03 aprobada continúa activa y evita regresión; el usuario debe realizar playtest humano antes de promover gameplay/arte como final.
[NO REALIZADO] Merge, staging/Render nuevo, FPS de GPU real, iPhone físico, QA humano cinco oleadas, balance competitivo y aprobación de arte P07.
**Próximo paso:** sitio estático Render AISLADO (no sobrescribir C1-D1) tras confirmación del workspace de Render; rama de despliegue única; visual y core invariantes. Entregar URL `/play-m01/` una vez servicio `live` confirmado. Después hotfix P07 con QA real Node y screenshot operador T08/P07 antes de activarlo.
