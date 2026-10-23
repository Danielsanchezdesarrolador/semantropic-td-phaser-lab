# AGENTS.md — SEMANTROPIC TD
## Directrices permanentes para Codex — equipo central único
**Fecha de adopción:** 22 de octubre de 2026.
**Decisión vigente de Dirección General:** equipo único de desarrollo integral; sustituye el esquema histórico de tres equipos independientes.
**Roadmap operativo único:** `docs/direccion-general/ROADMAP_CENTRAL.md`.
**ESTILO VISUAL OFICIAL APROBADO:** **CARTOON 2D PREMIUM V1** — leer **docs/direccion-general/ESTILO_VISUAL_CANON_CARTOON_2D_PREMIUM_V1.md** antes de CUALQUIER tarea de diseño/arte, animación, torre, aliado, enemigo, VFX o UI. Prevalece sobre M03 pictórico.
**Alcance:** repositorio completo. Si existen AGENTS.md más específicos en subcarpetas, respetarlos siempre que no contradigan la visión aprobada ni este marco. Los pedidos expresos más recientes del director prevalecen sobre decisiones históricas.
**Idioma de reportes y coordinación:** español.


> **DIRECTIVA VIGENTE DE DIRECCIÓN 23/10/2026 — CARTOON 2D PREMIUM V1 (posterior a M03 pictórico).** El Director aprobó como CANON GENERAL el ÚLTIMO mockup M01 más cartoon: líneas oscuras limpias, sombreado gráfico por masas, verdes brillantes, profundidad por terrazas/acantilados, camino integrado, pads asentados y composición de videojuego, no imagen pictórica estática. **Se aplica sin excepción a mapas, cinco familias de torres, soldados/operadores/aliados, enemigos/jefes, VFX/animación, HUD/iconos y material futuro**, cada uno en su propio bloque. La fuente detallada es el documento de estilo referido arriba. El M03 pictórico deja de ser el objetivo final y pasa a histórico; preservar funcionalidades del runtime. Una orden de mapa SOLO autoriza su arte; Codex sigue siendo único programador y el equipo artístico externo suministra mockups.

> LEER ANTES DE CUALQUIER CAMBIO. Este archivo establece dirección y controles; su mera lectura NO autoriza modificaciones, commits, merges ni despliegues. Verificar siempre el código y el commit actual. No tratar documentos históricos como prueba de implementación.

## 1. Identidad y misión: no negociables
- Proyecto: **SEMANTROPIC TD**, independiente de SEMANTROPIC TRIVIA / UNITY020.
- Meta: terminar y publicar un videojuego **Tower Defense comercial premium, original, estable y tácticamente profundo**, ambientado en la defensa de la Tierra frente a una invasión alienígena; ejército futurista estilizado, tropas, operadores, mechas, aeronaves y enemigos memorables.
- Dirección artística: **cartoon 2D en perspectiva 3/4**, fantasía tecnológica y militar futurista, ilustración ambiental rica, composición cuidada, siluetas expresivas, escenarios vivos y animaciones con anticipación, impacto y recuperación.
- Kingdom Rush / Ironhide es **referencia de calidad percibida, legibilidad y pulido**, nunca una fuente de assets para copiar. No reproducir personajes, siluetas, interfaces, mapas, iconos, composiciones o recursos de terceros.
- El gameplay siempre debe ser entendible en pantalla pequeña: no sacrificar lectura de caminos, plataformas, enemigos, daños o acciones por exceso de decoración/VFX.
- Prioridad de plataforma: **Android, iPhone/iPad en horizontal y web/PC**, interfaz táctil mobile-first. No afirmar compatibilidad móvil física sin prueba real.

## 2. Stack, proyecto y canal de publicación
- **Motor oficial de producción:** Phaser 4.2.1 + WebGL2; HTML5, CSS, JavaScript ES modules; build y QA con Node según scripts existentes. NO migrar espontáneamente a Unity, PixiJS, Godot ni reescribir en Canvas.
- Repositorio único: https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab
- Rama de publicación: production/semantropic-td-live.
- URL oficial única e invariable: https://semantropic-td-jugar.onrender.com/official/src/live/
- Render despliega automáticamente desde producción. **Trabajar en rama aislada/PR primero**; no hacer push, merge o deploy accidental a producción. Para bloques ordinarios ya autorizados: QA real, integración y promoción atómica conforme a docs/integration/RELEASE_CHANNEL_POLICY.md; grandes rediseños, cambios sustantivos de reglas y decisiones irreversibles requieren autorización expresa.
- No crear nuevas URL públicas para cada versión ni usar staging como sustituto de la página oficial de juego.
- Nunca modificar datos reales, progreso o guardados del usuario sin plan de migración/rollback.

## 3. Jerarquía de decisiones y hechos
1. Aprobación o instrucción expresa MÁS RECIENTE del director del juego (usuario), dentro del alcance autorizado.
2. Identidad artística y decisiones oficiales documentadas, incluido este archivo, la metodología de equipo único y la política de publicación.
3. Código, assets, commits, rama real, pruebas y CI para establecer **qué funciona actualmente** (no para invalidar automáticamente una decisión artística).
4. Contratos canónicos y datos de campaña protegidos.
5. Roadmaps históricos/Canvas V5 como especificación de referencia; propuestas anteriores NO son aprobación para un cambio nuevo.
- Si dos fuentes discrepan: identificar archivos, fechas, ramas y SHA; marcar [CONFLICTO POR RESOLVER]. NO elegir una solución silenciosamente.
- Los reportes deben marcar [CONFIRMADO EN CÓDIGO], [PROBADO EN NAVEGADOR], [PROBADO EN MÓVIL FÍSICO], [APROBADO POR DIRECCIÓN], [PROPUESTA], [PENDIENTE], [BLOQUEANTE] o [NO EJECUTADO].
- No confundir capturas/mockups, actas, QA Node, tests sintéticos, PRs DRAFT y despliegues LIVE. Las versiones Canvas, PixiJS y Phaser pueden implementar cosas distintas.

## 4. Historia y activos protegidos
Fuentes históricas clave que NO deben alterarse unilateralmente:
- public/JUEGO_V5_CANVAS.html
- public/official/data/maps.v5.json
- public/official/data/campaign140.v5.json
- public/official/src/m01-model.mjs
- docs/contracts/v1/ (contratos de mapas, torres, actores, eventos, manifiestos y ownership)
- docs/integration/RELEASE_CHANNEL_POLICY.md
Auditar las rutas y los nombres reales antes de referenciarlos en cambios. Canvas V5 es una **referencia de mecánicas y respaldo**, no el runtime productivo. En mapas.v5.json hay campos LEGACY (vidas, recomendaciones de torres antiguas) que NO autorizan regresar a reglas anteriores.

### Identidad visual interna obligatoria
- Respetar baseline artístico aprobado **C1-C / M03 + T04 + P03**, restaurado tras regresiones de reworks visuales no aceptados. Consultar imágenes originales y evidencias verificables ANTES de cambiar arte.
- La pradera M01, camino cálido serpenteante, Infantería pizarra/gris-azulada, Francotirador original de madera con **un solo rifle**, orcos verdes, sabuesos pardos y proporciones/siluetas aprobadas son identidad protegida.
- Proteger la FUNCIONALIDAD R7 M01/HF3, R6 M02 y viewport R5. Aprobación artística vigente posterior: estilo Cartoon 2D Premium V1 como canon de todos los mapas, desplazando estándar M03 pictórico. Especificaciones del juego y geometría no se rediseñan por este cambio; cada bioma sigue siendo único.
- No transformar el arte original aprobado en un simple estilo genérico, vectorial plano, pixel art o clon de otra IP.

## 5. Campaña objetivo, sin atribuirla falsamente al runtime
**Plan de producto:** 10 mapas y **140 oleadas**. Distribución histórica registrada en campaign140.v5.json:
1. Praderas del Amanecer — 5 oleadas.
2. Campos del Molino — 7 oleadas.
3. Bosque de los Susurros — 9 oleadas.
4. Río de los Antiguos — 11 oleadas.
5. Pantano de la Niebla — 13 oleadas; encuentro de jefe.
6. Desfiladero de Hierro — 15 oleadas.
7. Paso de la Escarcha — 17 oleadas.
8. Ruinas del Imperio Perdido — 19 oleadas; encuentro de jefe.
9. Corazón del Volcán — 21 oleadas.
10. Fortaleza del Eclipse — 23 oleadas; jefe final.

M01–M05: una entrada; M06–M07: dos; M08–M10: tres (verificar geometrías reales antes de implementar). La campaña contempla tres slots de jefe: M05/W13 Señor de la Niebla, M08/W19 Custodio del Obelisco y M10/W23 Emperador del Eclipse; sus IA/fases y certificación de balance Phaser deben comprobarse antes de afirmar que están terminados. M08 puede aparecer como «Valle de las Tormentas» en borradores viejos: NO cambiar el identificador canónico «Ruinas del Imperio Perdido» sin aprobación formal.
**No afirmar que diez mapas, 140 oleadas, dieciocho enemigos o cinco dificultades YA están jugables en Phaser por estar definidos en Canvas/JSON.** Inspeccionar la versión LIVE actual por commit.

## 6. Mecánicas objetivo y cinco familias de torres
- Familias oficiales: **Infantería, Francotiradores, Guardiana, Bombardera, Torre de Control**. NO reintroducir las familias antiguas Pulso, Criogénica, Artillería original o Prisma porque persistan en campos legacy.
- Evolución de producto I–III + elección entre dos especializaciones IV, habilidades y tres rangos por habilidad; implementar solo cuando cada regla esté auditada, aprobada y acotada a su fase.
- Infantería: cuartel de contención, reclutas/veteranos/escuadrón, bloqueo, rally, golpes, HP, muerte y respawn. Diseño histórico posterior «Defensa Viva»: I=1, II=2, III=3, IV=3 soldados especializados; confirmar normativa de rama/runtime antes de portar.
- Francotiradores: operador visible, arma única, objetivo, disparo y VFX desde muzzle real, prioridades, DPS del núcleo.
- Guardiana: elementos fuego/hielo/ácido y rama defensiva Bastión.
- Bombardera: morteros/área, artillería pesada y tecnológica.
- Torre de Control: una por partida, manual, apoyos Infantería/Mecha/Nave y operaciones especiales; el costo histórico de construcción base 0 pertenece al diseño posterior «Defensa Viva» y NO debe aplicarse a Phaser sin comparar el roadmap y la economía efectiva.
- Dieciocho arquetipos enemigos, escudos, curación, voladores, resistencias/debilidades, ruinas/reconstrucción, economía y cinco dificultades son objetivos de paridad progresiva, NO permiso de implementación masiva.
- Donde se haya validado en M01 Phaser: 5 oleadas, 63 enemigos, 8 pads, 133 nodos, oro inicial 365, 100 vidas, fuga común -2, Infantería I/II y Sniper I/II; proteger parámetros actuales salvo orden y QA específicos. No trasladar el campo legacy lives=22.
- **El core es la autoridad única** de HP, oro, daños, cooldowns, lógica de combate, fugas, bloqueo, recompensas, victoria/derrota, estrellas y guardados. VFX, sprites y presentadores solo observan/proyectan eventos (una vez por eventId/bulletId), jamás simulan un golpe real o generan recursos.

## 7. Equipo único, separación modular y ramas históricas
- **Codex es el equipo central de desarrollo integral**, bajo la Dirección General del usuario: mapas/ambientación; torres/habilidades/VFX; personajes/enemigos/animación; gameplay/combate/economía/progresión; interfaz/experiencia móvil/optimización; integración/pruebas/QA.
- La metodología anterior de tres equipos M/T/P independientes y tres flujos simultáneos está **reemplazada oficialmente**. No crear equipos, agentes, worktrees o ramas paralelas por inercia histórica. Las tareas cloud ya tienen checkout aislado; usarlo y crear otro worktree solo si el Director lo solicita expresamente.
- Mantener separación técnica por módulos: mapas en `public/official/src/maps-visual/**`; torres/VFX en `public/official/src/towers-visual/**`; actores en `public/official/src/actors-visual/**`; reglas en el CORE y sus contratos. Las etiquetas históricas M/T/P describen áreas de código, no equipos autónomos ni barreras entre responsables distintos.
- Un solo roadmap operativo en `docs/direccion-general/ROADMAP_CENTRAL.md`. Ejecutar bloques pequeños, completos y verificables, con un objetivo y alcance explícitos. El equipo único coordina cambios necesarios entre módulos sin duplicar lógica ni mezclar objetivos independientes.
- Consultar contratos y fuentes protegidas antes de editar. La responsabilidad integral no autoriza rediseños, cambios de balance, geometrías o mecánicas fuera del bloque aprobado. Proponer y documentar cualquier desviación necesaria.
- Usar una rama acotada/PR para el bloque y promover a `production/semantropic-td-live` mediante el flujo autorizado tras QA. Una rama por bloque no significa tres equipos ni tres desarrollos simultáneos.
- Auditar las ramas históricas antes de recuperar contenido: SHA/base, diffs, contratos, integración selectiva previa y QA. **No eliminarlas, sobrescribirlas ni fusionarlas indiscriminadamente**; conservar especialmente referencias artísticas aprobadas y actas. Ancestría Git no equivale a aprobación ni a ausencia de integración selectiva.
- No hacer force push, rebase destructivo ni sobrescribir trabajo ajeno. Los cambios compartidos en escenas, HUD, build, CI o datos se coordinan dentro del mismo equipo, con alcance, pruebas y rollback proporcionales.

## 8. Normas artísticas y corrección de mapas
- Antes de cada rework: inspeccionar baseline aprobado + capturas reales actuales; justificar cambio a misma cámara/zoom y tamaños de juego móvil. Mockup ≠ asset integrado.
- Proteger la funcionalidad: caminos siempre visibles y continuos; ninguna cascada, río, valla/reja, piedra, árbol o prop sobre camino transitable, pads, tropas, enemigos, HUD o puerta. Respetar perspectiva, capas Y/depth, sombras, raíces, footAnchor, hitbox y oclusión.
- Cascadas solo donde la topografía/curso de agua las justifique; animaciones ambientales con moderación (agua, viento, hojas, niebla, chispas) y bajo costo GPU. Evitar cascadas duplicadas, decorados flotando, capas superpuestas u objetos que parecen bloquear rutas.
- Cada corrección de solapes requiere capturas ANTES/DESPUÉS, evidencia de cero colisiones visuales nocivas, rutas/pads iguales y regresión en los otros mapas.
- Efectos de ataque de torres, personajes y enemigos deben corresponder a eventos del core. No duplicar rifles, flashes, impactos o barras de vida.
- Rework CARTOON 2D PREMIUM de mapas y packs visuales está aprobado el 23/10/2026 como DIRECTION, pero NO autoriza un megarework ni cambios a geometría jugable, sockets, niveles, mecánicas, HUD o reglas fuera de bloques exclusivos. Cada bioma y arquetipo mantiene su identidad propia.

## 9. Secuencia obligatoria por bloque para Codex
0. Al entrar: leer este AGENTS.md y buscar AGENTS.md aplicables en subárbol.
1. Identificar la orden exacta, rama, HEAD/SHA, alcance y módulos afectados. Leer contratos/actas/roadmap pertinentes y verificar estado LIVE.
2. Resumir brevemente [CONFIRMADO], [PENDIENTE] y riesgos. Un bloque = **un objetivo comprobable**; evitar reescrituras generales.
3. Si la tarea requiere arte: consultar referencias aprobadas y diseñar alternativas/mockup cuando la dirección así lo haya pedido. NO implementar propuestas no autorizadas.
4. Hacer cambios mínimos en rama propia, sin alterar fuentes protegidas fuera del alcance aprobado. Registrar toda desviación necesaria como RFC.
5. Ejecutar QA REAL proporcional al bloque. Para cambios solo documentales, validar coherencia, rutas referenciadas y alcance del diff, sin atribuirles nueva QA jugable. Cuando cambie la aplicación: validación Node, npm run build y Chromium/WebGL2 real; gameplay, input táctil, resize, overlays, scroll, colisiones, saldo, fugas y persistencia según alcance. Comparar baseline en desktop 1280×768 y móvil horizontal 844×390 / 932×430 cuando corresponda. No equiparar emulación a Android/iPhone físicos.
6. Capturar screenshots/vídeos auténticos de la escena integrada y antes/después, con comandos, SHA y entorno; para VFX/animación demostrar secuencias temporales reales.
7. Inspeccionar regresiones M01/M02 y toda pantalla/función tocada. No inventar FPS, VRAM, autonomía, aprobación humana, PASS ni URL LIVE.
8. Registrar acta, QA y manifiesto en GitHub; abrir PR/commit con diff limitado, riesgos, rollback y rutas tocadas.
9. Integrar y publicar los bloques ordinarios autorizados mediante el flujo GitHub/Render verificado, conservando una sola URL pública. No pedir autorización redundante para microcambios ya incluidos en el alcance aprobado.
10. Antes de entregar un bloque jugable: ejecutar QA técnico aplicable, revisar regresiones, comprobar que Render publicó, verificar que la URL oficial carga los archivos/versión nuevos y registrar evidencia de correspondencia con el commit. No afirmar un SHA interno de Render si solo se verificaron archivos públicos.
11. Entregar siempre el enlace jugable `https://semantropic-td-jugar.onrender.com/official/src/live/` y explicar qué modificaciones debe revisar el Director. Si la versión no está publicada o no se pudo comprobar, indicar el estado real; no presentar el enlace anterior como si contuviera los cambios nuevos. Una actualización solo documental debe decir expresamente que no añade novedades jugables.

## 10. Instrucciones de comunicación y entrega
- Responder en español, de manera concreta, con creatividad propia y criterio experto; si se solicita ejecución de código, implementar el cambio real, no devolver solo una idea.
- Diferenciar hecho, propuesta, incertidumbre y defecto conocido. No presentar una promesa de calidad comercial como QA aprobado.
- Al cerrar cada tarea informar: objetivo, archivos modificados, SHA/rama/PR, pruebas efectivas con PASS/FAIL/NOT_RUN, capturas y resultado visual, riesgos y siguiente bloque sugerido.
- La autoridad estética final es el director humano. Conservar la continuidad de Semantropic TD aunque Codex cambie de chat o sesión: registrar decisiones relevantes y evidencias en archivos del repositorio.
- No repetir trabajo terminado ni forzar un megabloque por querer «acelerar» la producción.
- Importante: AGENTS.md guía a Codex **solo cuando está presente y es leído en el checkout/entorno de trabajo correspondiente**; informar a las sesiones ya activas y asegurar que la versión pertinente del archivo llegue a sus ramas. AGENTS.md no sustituye el control humano ni las pruebas.

## 11. Inicio rápido de cada nueva tarea
Confirmar internamente:
1. ¿Qué commit/branch y escena Phaser REAL voy a editar?
2. ¿Qué decidió aprobar el director y qué parte es solo una propuesta histórica?
3. ¿Tengo el baseline visual y contratos válidos?
4. ¿Cuál es el único objetivo de este bloque y qué queda explícitamente FUERA?
5. ¿Cómo demostraré el resultado en Chromium y móvil emulado sin inventar evidencia?
6. ¿Cómo coordino los módulos del equipo único sin regresiones ni cambios de identidad?
7. ¿Qué SHA, capturas, PR y rollback dejaré para el siguiente agente?

**MANDATO FINAL:** completar SEMANTROPIC TD con identidad propia, calidad comercial premium, juego táctico auténtico y continuidad estricta. Progresar sin destruir lo ya aprobado.

## 12. Continuidad y prioridad de esta decisión
- La decisión expresa del Director de adoptar equipo único prevalece sobre cualquier instrucción histórica que obligue a mantener tres equipos, tres worktrees o tres flujos independientes. Conservar esa documentación como historia, no como orden operativa vigente.
- El último bloque jugable verificado al adoptar esta metodología es M01 R7 HF3, commit `5388a490f808bac4cfd47e02ae6739f923caa5cc`, CI 39890530324 SUCCESS; M02 R6 permanece aprobado. Comprobar HEAD de nuevo antes de cada tarea: esta referencia no es perpetua.
- No reiniciar el proyecto ni abrir implementaciones nuevas sin un bloque autorizado. Respetar decisiones artísticas, mecánicas y técnicas ya aprobadas; separar QA técnico, publicación y aprobación estética humana.

## 13. DECISIÓN VIGENTE — CANON CARTOON 2D PREMIUM V1 Y MICROBLOQUES

### 13.1 Canon visual actual — TODO el juego, no solo escenarios
- **APROBADO POR DIRECCIÓN (última decisión visual del 23/10/2026): Cartoon 2D Premium V1**. Modelo artístico: último mockup M01 explícitamente aprobado como más cartoon. Fuente permanente de especificaciones: docs/direccion-general/ESTILO_VISUAL_CANON_CARTOON_2D_PREMIUM_V1.md.
- Esta aprobación **SUSTITUYE** M03 pictórico/hiperdetallado como estilo final. El M03 conserva valor histórico y su gameplay/código, pero ya NO define el acabado gráfico. No reaplicar las instrucciones antiguas de «homogeneizar hacia M03 pictórico».
- ADN obligatorio EN MAPAS, TORRES, SOLDADOS, ALIADOS, ENEMIGOS, JEFES, ANIMACIONES, VFX, HUD e ICONOS: siluetas 2D originales reconocibles, contorno nítido, cel shading por masas de color, perspectiva 3/4 consistente, relieves escalonados, sombra de contacto, detalles gráficos controlados y lectura táctil a escala móvil.
- La referencia es un **mockup de estilo** y está en la conversación del Director, no publicada automáticamente como asset GitHub. Si la imagen no está accesible en el checkout, solicitar adjunto para comparación; NO inventar URL ni afirmar fidelidad medida. Prohibido insertar la captura como mapa monolítico/fondo final.
- Cada bioma, torre, unidad, arma, facción y VFX mantiene función e identidad propias dentro del mismo estilo. Kingdom Rush es referencia de claridad del género, NUNCA fuente para calcar su propiedad intelectual.
- La calidad y homogeneidad futuras requieren mockups aprobados por pack, QA de imagen real y aceptación humana; esta directiva general NO habilita implementarlos todos en el bloque actual.

### 13.2 UNA ORDEN = UN SUBSISTEMA
Interpretación predeterminada de "hacer el mapa" = **MAPA-ARTE**, no construir el nivel completo.
- **MAPA-ARTE:** fondos, superficie, relieve, materiales, vegetación, agua, ruinas, composición y pintura de camino apoyada en la geometría canónica; NO cambiar puntos de ruta, sockets, enemigos, spawns, oleadas, economía, combate, UI global ni guardados.
- **MAPA-PADS:** exclusivamente arte/legibilidad de plataformas. Conservar sus IDs, centros, cantidades y lógica; cualquier reubicación real requiere aprobación distinta.
- **MAPA-AMBIENTE:** agua animada, viento, hojas, niebla, brillo ambiental, sombras dinámicas, con presupuestos GPU y opción de reducción. Sin nuevas mecánicas.
- **CAMPAÑA-OLAS:** diseño de grupos/ritmo, spawns, datos de oleadas y QA de navegación; no rediseñar fondos.
- **ENEMIGOS-COMPORTAMIENTO:** un arquetipo/habilidad por bloque, sin recolorear o reconstruir todo el mapa.
- **CORE-COMBATE:** solo reglas/daño/HP/cooldowns/recompensas cuando se autorice.
- **TORRES-ARTE, ACTORES-ARTE y VFX-COMBATE:** solo tras recepción y aprobación de MOCKUPS EXTERNOS preparados por los colaboradores artísticos; integrar paquetes por bloque aislado, sin trabajo paralelo de código de equipos M/T/P.
- **HUD-UX, AUDIO, BALANCE, RELEASE**: bloques dedicados. No añadirlos a una tarea de paisaje.

### 13.3 Secuencia general de producción — ver ROADMAP_CENTRAL.md
1. Oficializar la referencia Cartoon 2D Premium V1 para todos los subsistemas; registrar mockup M01 aprobado y auditar estilos heredados contra el canon SIN cambiar código en bloque documental.
2. M01 es el **piloto visual**: fidelidad gráfica del escenario (sin mover sus 133 nodos/8 pads ni alterar 5 olas, oro, torres, enemigos y combate). Capturas runtime y aprobación humana obligatorias. Los cambios ya ejecutados quedan como historial.
3. Llevar M02–M10 al mismo IDIOMA cartoon por MAPA-ARTE-[NN] individual, manteniendo cada bioma, arte original, datos canónicos y funcionalidad existente; los mapas pictóricos ya aprobados conservan código/función hasta sus reworks autorizados.
4. Los colaboradores artísticos externos preparan mockups/sheets ORIGINALMENTE cartoon para cinco familias de TORRES, aliados/operadores, enemigos y jefes; Codex los integra uno por pack DESPUÉS de aprobación. Animaciones y VFX de combate por bloques aparte.
5. HUD, iconos, tutorial, SFX/música y accesibilidad se alinean al canon en etapas exclusivas, sin mezclarse con paisaje, enemigos o daño.
6. QA/render comparativo y publicación del mismo LIVE con rollback y gates; no crear nuevas ramas de equipos paralelos ni URL pública diferente.
- Aprobación visual de estilo no equivale a reproducción píxel a píxel de la composición ni a autorización de rehacer sistemas; respetar archivos funcionales existentes y la política de producción.

### 13.4 Disciplina de ahorro de uso Codex (Sol Medium cuando el usuario lo seleccione)
- Evitar que una tarea de mapa se transforme en "arte + 9 oleadas + siete enemigos + combate + resultados". Alcance EXPLÍCITO y FUERA DE ALCANCE obligatorio en cada prompt.
- Comprobar HEAD, diff y módulos del bloque. No auditar de cero todo GitHub/campaña/ramas/pruebas si ya existe inventario con SHA válido. Reutilizar reportes, cache de arte y APIs.
- Cambios mínimos y reversibles; no duplicar motores, assets ni componentes. Evitar reescrituras monolíticas, redibujar fondos completos por un ajuste o generar decenas de capturas redundantes.
- QA proporcional sin falsificar ni omitir pruebas críticas: validación de arte, build, Chromium real con imágenes desktop/móvil para cambios visuales; smoke y regresión para integraciones jugables. Solo QA global al cierre de integración/campaña o cuando un riesgo real lo justifique.
- Justificar antes cualquier dependencia fuera del objetivo. Si surge bug crítico separado, registrarlo y abrir hotfix independiente; no absorberlo silenciosamente.
- Reportar de forma compacta: rama/SHA, archivos, alcance, QA PASS/FAIL/NOT_RUN, comparación antes/después, enlace LIVE solo tras comprobar despliegue y 1 siguiente bloque propuesto. No asegurar porcentaje de ahorro de cuota.

### 13.5 Criterios obligatorios de cierre
1. Un subsistema, un bloque, un diff coherente.
2. Fidelidad al **Canon Cartoon 2D Premium V1** en el subsistema visual tocado, sin copiar ni el bosque M03 ni el layout del mockup M01 en otros biomas.
3. Ningún camino o pad oculto; sin rejas/cascadas/props cruzando geometría transitable ni arte flotante.
4. MAPA-ARTE no modifica nunca olas, economía, IA enemiga, construcción de torres o daño sin autorización adicional.
5. QA y capturas auténticas; no confundir Chromium emulado con móvil físico.
6. CI, versión publicada y URL oficial verificadas antes de anunciar un bloque LIVE; si está DRAFT informar el estado sin inventar publicación.
7. Nueva prioridad explícita del Director prevalece solo para cambios artísticos aquí autorizados.
