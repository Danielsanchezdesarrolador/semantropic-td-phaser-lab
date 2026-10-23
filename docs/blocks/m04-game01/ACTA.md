# M04-GAME-01 — habilitación funcional de Río de los Antiguos

Orden recibida 23/10/2026: `SEMANTROPIC_TD_PROMPT_CODEX_M04_HABILITAR_JUGABLE_2026-10-23.txt`.
[APROBADO POR DIRECCIÓN] El arte HF1 queda congelado. Nueva autorización funcional específica prevalece sobre los antiguos bloques solo artísticos. No se generan imágenes nuevas.

Base de producción: `73d7b774d8ba5e06e49b0a91a44c26bf18b907a0` (PR #58).
Rama: `feature/m04-game01-playable`. PR/commit final y publicación: ver el PR del bloque; solo afirmar LIVE después de verificarlo.

## Alcance y fuentes

- Escena M04 estrecha reutiliza `startCampaignScene`, `CampaignCombatWorld`, economía y extensión de Infantería compartidas con M03. Arte EXACTO de HF1 mediante un adaptador de mundo; fuente PNG, registro, montaje HF1 y preview permanecen byte a byte.
- Una entrada, 262 nodos, nueve sockets canónicos, 395 oro y 100 vidas. El campo legacy lives=20 no se aplica. Campaign140 intacto: conteos `[6,5,7,5,10,10,9,6,9,12,15]`, total 94; seis tipos originales, sin sustituir tipos de CORE.
- Fichas bruto/chamán de Canvas `E1_ENEMIES`; armadura/resistencias del bruto. Chamán según `e2SupportBrain`: no se cura a sí mismo, elige aliado terrestre vivo a menos de 168 unidades con déficit >5, menor proporción de HP; canal .58+.4 s, cura 32 al terminar si sigue válido, cooldown 7 s también si el objetivo deja de ser válido. Se detiene durante canal y respeta pausa. Todos los HP/recompensas vienen del CORE.
- HP usa el doble redondeo de `spawnE1Enemy`, multiplicador canónico del mapa y `QA17_HP_BALANCE[4].normal`: escudero .70, bruto .77, guerrero .82. No portar ajustes de otras dificultades. Bounty y bonos siguen `campaign140Bounty` / `campaign140WaveBonus` para 11 oleadas.
- Bruto/chamán conservan tipo y comportamiento propios; representación PROVISIONAL reutiliza assets originales P08/P03 de guerrero con escala/tinte. No son arte final ni sustitución de sus estadísticas. Archer/shieldbearer conservan sus capas originales, hound/warrior su arte habitual. No se abre un bloque artístico.
- Resultados y récord en `semantropic_td_phaser_m04_normal_v1`; no modifica claves M01/M02/M03 o Canvas. Solo Normal; no fingir cinco dificultades. Guardar récord no concede dinero/premios; recompensas del CORE se deduplican.

## Dependencias compartidas imprescindibles

1. Economía de campaña: límite y snapshot de sockets usan cantidad canónica, en vez de ocho.
2. Escena común: aserción, denominador de plataforma y DTO T09 usan cantidad canónica; importar el adaptador M04 no autoarranca M02.
3. T09: acepta `socket.count` explícito y validado; por defecto mantiene ocho para consumidores anteriores. La novena plataforma necesita su menú real.
4. CORE base inicializa armadura desde ficha (M03 sigue 0); extensión de Infantería ofrece hook de apoyo solo implementado por M04.
5. Selector y viewport aceptan M04; misma ruta LIVE y panorama FIT existente, sin mover coordenadas. No hay rediseño de HUD.
6. Guards de los bloques artísticos anteriores: sus freezes de runtime están superados exclusivamente por esta orden funcional; `authorized-runtime-blobs.json` enumera antes/después de cada archivo compartido autorizado. Los locks del arte y datos originales permanecen. Las actas históricas no se reescriben.

Fuera de alcance: rediseño de escenario, nuevas familias/niveles, otras dificultades, audio, balance global, IA no requerida por M04 y M05–M10. M01/M02 conservan sus cores; M03 usa defaults equivalentes. Geometría, campaña y Canvas protegidos por hashes en `protected-blobs.json`.

## QA y límites

[CONFIRMADO EN CÓDIGO / QA NODE] Recorrido con presupuesto real (sin inyectar oro/HP/daño): 11 oleadas, 94 spawns, 80 bajas, 14 fugas, 72 vidas, victoria de dos estrellas. Diez bonos intermedios, una victoria, eventos y recompensas únicos; nueve torres simultáneas; cruce real por ambos centros de puente. También soporte aislado, armadura, pausa, Infantería I/II, rally, venta, derrota real con 50 fugas, bloqueo final, persistencia aislada y Storage no disponible.

[PROBADO EN NAVEGADOR] Ver `qa.json`/CI para resultado definitivo: WebGL2, escritorio 1280×768 y móvil emulado 844×390/932×430, toques en nueve plataformas, menús reales de compra/mejora/rally/venta, pausa/reinicio, recorrido completo acelerando pasos del CORE, resultados, récord y selector M01–M04. Capturas auténticas con torres/enemigos/resultado. Aceleración no equivale a FPS físicos ni a balance humano aprobado.

Regresiones focalizadas: M01 cinco olas/rally, M02 siete olas/core/arte, M03 nueve olas/core; navegación a los tres en Chromium. Guards HF1/B04/B02 conservan datos y arte. QA geométrica/píxeles del arte por pruebas HF1; no es certificación universal de hitboxes futuras.

[NO EJECUTADO] Android/iPhone físicos, rendimiento GPU/FPS comercial, balance humano definitivo, otras dificultades.

## Publicación y rollback

Flujo: QA → PR a `production/semantropic-td-live` → merge ordinario → Render automático → comparación de archivos públicos y apertura real de `?map=4` en la misma URL oficial. El servicio no expone su SHA interno de despliegue: no atribuirlo sin evidencia. Informes posteriores se adjuntan al PR y a la entrega.

Rollback: revertir el merge de este bloque mediante PR, conservando guardados; publicar y comprobar que vuelve la producción base `73d7b77`, M01–M03 seleccionables y M04 solo en preview. No resetear ramas ni borrar récords.

Revisión del Director: Mapa ▾ → 04 Río de los Antiguos; construir torres, iniciar primera oleada, observar los dos puentes, probar mejoras/rally/pausa y completar resultados. Cualquier cambio artístico requiere otra orden. Siguiente paso: prueba humana de M04 y observaciones; no iniciar otro bloque automáticamente.
