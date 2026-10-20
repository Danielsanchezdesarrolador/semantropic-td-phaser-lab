# ACTA OFICIAL P08 — INFANTERÍA EVOLUTIVA / COMBATE LEGIBLE
**SEMANTROPIC TD · Equipo PERSONAJES · 20 de octubre de 2026**
**PR:** [#39 DRAFT](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/39) · no merge.
**Rama:** `feature/art-p08-infantry-evolution-combat` · **Base exacta:** `5eef18c3c86c683d9cb38f89d708eb3d9e7c168e` (P07-HF1).
**Estado:** ASSETS REALES EN GITHUB / ADAPTADOR PROPUESTO / NO MERGE / NO DESPLIEGUE.
**Referencia protegida:** C1-C P03, SHA256 `24103e45a0e1249fa4b89d4e65ea16d9e147bdf1e2462e5c4063469a931842ef`. C1-D6 funcional de core, no sustituido.

## 1. Objetivo de Dirección
El usuario probó C1-D6 en Android e informó reclutas poco distinguibles y ataques poco visibles. P08 **no es un rediseño** de orcos, hounds ni operador sniper. Es la evolución del SOLDADO humano y una capa de presentación para ataques de orcos/hounds existentes. Solo integra Dirección General.

## 2. Inventario binario real, no promesa de exportación
Cuatro PNG RGBA8 1408×832, cuadrícula 8×4, celdas 176×208, 32 frames por actor:
| Actor | Ruta `public/official/art/actors/p08/png/` | Bytes | SHA-256 PNG |
|---|---|---:|---|
| Un recluta (Nivel I) | `infantry_recruit.png` | 562495 | `1f130ebc02766afaa020e59f55c30215611ac11c5a14cb52b1101cfcbdb25914` |
| Veterano (Nivel II, el core crea 2) | `infantry_veteran.png` | 612567 | `774a14dd6770aaa058d7941ccc9c51a6436010af82a62ffc210c43e0ccbbec6f` |
| Orco guerrero P03, ataque reforzado | `warrior.png` | 702244 | `8967215ee1fac10b369e15c5b943bc5bdeafe401da6c291d6922d9eb91dd6c4e` |
| Hound P03, ataque reforzado | `hound.png` | 602802 | `5e1338e1605f9f266575cb6e73b7a6245a3385447812778613034b0349845e38` |

Cuatro PNG adicionales de **P07 reexportados por deuda de alfa** existen en esta misma rama P08; el P07 histórico de su propia rama no fue reescrito. `P07_MANIFEST.json` actualizado dentro de la rama P08. El rasterizador `p07-raster-canvas.mjs` pone RGB=(0,0,0) cuando alfa se redondea a cero; fuente P03/siluetas, marcos y sockets protegidos. Se exige validación independiente en Node22 antes de integrar.

**Tamaño P08 comprimido:** 2.480.108 bytes; memoria nominal cuatro RGBA8 sin overhead 18.743.296 bytes. No son FPS/VRAM medidos.

## 3. Progresión que sí se ve
- **Nivel I:** un soldado humano de uniforme azul militar cartoon 3/4, casco sencillo, pechera, guantes/botas, escudo y arma original cortante; el core instancia **1**.
- **Nivel II:** un atlas de veterano con placas y hombreras ampliadas, yelmo/visor reforzado, protecciones de piernas, escudo jerárquico y símbolos de ascenso. El core instancia **2 soldados reales** con IDs independientes; la galería dibuja dos copias solo para mostrar cómo se verían.
- **Niveles III/IV:** fuera de alcance y no disponibles ni en build M01 ni en la galería.
- **Warrior y Hound:** pintor P03 original en neutral, caminar, hit, die y blocked; solo añadir trazo/anticipación de combate y aprovechar las poses históricas. No volver a P06 ni rediseñar sus cabezas/armadura/púas.
- **Sniper:** SIN cambios P08; conservar P03 aprobado por defecto.

## 4. Animación y eventos de core
`P08_MANIFEST.json` documenta `idle:4, walk:8, attackWindup:3, attack:5, hit:3, die:6, blocked:3` con ABI total 32.
`p08-controller.mjs` define una FSM de presentación por `entityId`, no por torre ni enemigo global. Usa `soldier_attack_windup` (anticipo core), `soldier_attack_hit` (arma en contacto frame 2, **daño ya procesado**), `enemy_attack_windup` y `soldier_hit.sourceId` (contacto del atacante), más `soldier_spawn/respawn/die/removed`, `enemy_blocked/unblocked`, pausa y reset. Sin evento `enemy_attack_hit` inventado, sin golpear por `animationcomplete`.
El adaptador protege el nivel visual II al morir/reaparecer sin evento de nivel. El core mantiene INFANTRY_LVLS I: HP110 daño8, cadencia1.2, 1 soldado; II: HP165 daño12, cadencia1.1, **2 soldados**. No se modificaron economía, radios, rutas, oleadas ni gameplay.

## 5. Archivos P08
**Código y fuentes bajo ownership:**
- `public/official/art/actors/p08/p08-visual-rig.mjs` — apariencias progresivas y ataques;
- `public/official/art/actors/p08/p08-png-export.mjs` — export PNG y SHA;
- `public/official/art/actors/P08_MANIFEST.json` — cuatro rutas de binarios y contratos;
- `public/official/src/actors-visual/p08/p08-loader.mjs` — carga Phaser + `p08VisualForSoldierLevel(1|2)`;
- `public/official/src/actors-visual/p08/p08-controller.mjs` — FSM de eventos reales, solo visual;
- `public/official/src/actors-visual/p08/qa-p08.mjs` — Node, zlib/CRC, PNG-RGBA y regresión de combate;
- `public/official/src/actors-visual/p08/index.html` y `gallery.mjs` — vitrina visual Phaser aislada, **no combate**;
- `public/official/src/actors-visual/p08/qa-p08-browser.mjs` — Playwright en tres viewports **NOT_RUN**.
- Cuatro **asset sheets PNG**: `p08/sheets/INFANTRY_I_SHEET.png`, `INFANTRY_II_TWO_VETERANS_SHEET.png`, `WARRIOR_P03_NEUTRAL_ATTACK.png`, `HOUND_P03_NEUTRAL_ATTACK.png`.

**Coordinación y evidencia:**
- `docs/art/actors/actas/QA_P08_PERSONAJES.json` — QA honesto; `RFC_P08_INTEGRACION_C1D6_C1D7.md` — límites de C1-D6;
- `docs/art/actors/actas/INDEX.md` — historial P01–P08;
- El Android del propietario (50833/50834) y screenshots de gameplay nuevo deben proporcionarlos/ejecutarlos Dirección General; **no** inventar overlays ni capturas.

## 6. QA ejecutado vs pendiente
[PASS V8/FUENTE]: cuatro atlas PNG reales persistidos, fuente alpha=0→RGB0, 128 cuadros nuevos con límites limpios, inspección de primeros fotogramas de ataque de recluta/veterano/orco/hound, 8 fixtures FSM event-core visual. Cuatro PNG P07 corregidos y manifest de sus hashes publicados solo en P08.
[NOT_RUN]: `node public/official/src/actors-visual/p08/qa-p08.mjs` de un checkout real con los 8 PNG, Node22 byte-exact SHA/CRC/zlib/clean RGBA, `npm run build`, Chromium/WebGL2, capturas en 1280×768, 844×390, 932×430, test Android físico, escena C1-D6/C1-D7 integrada. No hay QA de FPS, GPU ni Android validado.
[PENDIENTE]: aprobación artística y verificación del movimiento/animación a escala real 44/64/80 px; manos/rifle de sniper fuera de alcance.

## 7. Riesgos, acciones y rollback
1. **Posible discrepancia Node** entre V8 y binarios; bloquear integración si SHA PNG/RGBA o alfa falla. No silenciar la aserción.
2. **Presentación en escena real:** `c1d6-playable/scene.mjs` aún usa recluta por defecto para los dos niveles; solo Dirección modifica/importa el nuevo loader/controles.
3. **Mobile art:** source frame no equivale a captura Android. Validar ataque en pantalla y que la mejora II se diferencie sin zoom.
4. **Compatibilidad real de core:** si eventos no tienen todos `eventId/tick`, suprimir duplicados con cuidado sin generar impactos ficticios. RFC específico antes de cambios core.

**Rollback:** cerrar PR P08 sin merge. No altera rama oficial LIVE ni escenas/contratos ajenos. La entrega se ofrece como CANDIDATA, no aprobada y no desplegada.
