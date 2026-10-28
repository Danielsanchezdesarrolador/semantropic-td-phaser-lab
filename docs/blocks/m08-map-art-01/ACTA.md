# M08-MAP-ART-01 · propuesta original

Base verificada: producción44c5de9ba05f09e1689149a543d27760eb690aaf, PR82 fusionado. Rama feat/m08-map-art-01. Este bloque es exclusivamente un preview artístico aislado; no es un nivel jugable ni está publicado. Entrega mediante PR DRAFT; aprobación humana pendiente. Rama documental docs/estudio-td-original-20261027 preservada; AGENTS y roadmap locales conservan modificaciones ajenas excluidas de este commit.

## Contrato y diseño

Fuentes: AGENTS, canon Cartoon2D Premium V1, roadmap, mapas/campaña JSON y patrón modular M07. Overlay GEOMETRIA_ANTES.svg exportado antes de dibujar; CONTRATO.json conserva151+126+126 puntos, tres entradas y salida1313,384, diez centros derivados de spots. Bandas de exclusión decorativa53wu sobre rutas y elipses61×45 alrededor de sockets; son márgenes artísticos, no cambios de hitbox. Campaña19/171 y bossSlot permanecen solo en datos existentes.

Ciudad-observatorio terrestre: arenisca/oliva, bronce astronómico y energía cian, fachadas invadidas por vegetación esmeralda. Piezas grandes de ruina y roca, patio pavimentado en la convergencia y acceso oriental claro. Suelo y camino son capas independientes; los diez pads y cada módulo ambiental son objetos separados. No hay una ilustración monolítica de mapa. No se añaden agua, cascadas o puentes sin justificación topográfica: la propuesta prioriza terrazas y ruinas. Relieve local mediante módulos de roca escalonada, muros y patios elevados; no se altera la superficie de tránsito canónica.

Dos imágenes fuente originales generadas específicamente para el proyecto: atlas de seis props RGBA1536×1024 (observatorio, muro, bosque, patio, roca, sotobosque) y material de hierba/tierra. El atlas se recorta en celdas; terreno cacheado2560×1536 y camino cacheado2560×1536, pads128×96, props512×512. Render estático; no regeneración por frame ni VFX/combate. No se incorporan recursos de KRV ni de otros juegos. Se conservaron los originales de generación en el workspace.

La primera vista mostró terreno plano y hierba geométrica repetitiva; se corrigió con material original antes de las capturas finales. Anclajes principales se combinan con agrupaciones deterministas filtradas por clearance; no se permite solapar cajas decorativas con rutas/pads. Es una propuesta artística: profundidad monumental, densidad y lenguaje final requieren evaluación de Dirección, no se califican como aceptados por pasar tests.

## Evidencias y QA

- tools/qa-m08-art.mjs: PASS403 nodos, inicios/salida, diez pads y conservación de JSON/selector/public previo. Scope limitado a nuevas rutas M08.
- node --check en los tres módulos y npm run build: PASS.
- tools/qa-m08-art-browser.mjs: Chromium real WebGL2 desktop1280×768, touch844×390,932×430 con DPR2: PASS. Sin errores JS, FIT sin overflow, diez pads, todas las cajas decorativas fuera de bandas. Mismo número de objetos/texturas tras destroy/remount; cero texturas m08 restantes tras destroy. Este recuento no acredita ausencia universal de fugas de memoria.
- evidence/report.json registra resultados y cajas de props. Capturas desktop.png, touch844.png, touch932.png y desktop-overlay-after.png son renders auténticos. GEOMETRIA_ANTES.svg procede directamente del JSON; overlay posterior usa esas mismas rutas/sockets sin desplazarlos.
- Memoria teórica de canvases RGBA: dos superficies2560×1536≈30MiB, seis celdas512²≈6MiB y pad≈48KiB, antes de fuentes, duplicados GPU y overhead. No se midió VRAM, FPS sostenido ni memoria real. Teléfonos físicos NOT_RUN.
- Los tableros conceptuales mencionados no están adjuntos a este pedido; el mockup M01 histórico es visible en la conversación, sin archivo local inventado. No se afirma igualdad pixel-perfect con una referencia aprobada de M08. Aprobación estética humana PENDIENTE.

## Revisión y publicación

Preview local: /official/src/maps-visual/m08/preview/; diagnóstico ?overlay=1. No se presenta localhost como enlace público. Las capturas del PR permiten revisión; no se crea un sitio público ni se cambia Render. M08 permanece fuera del selector y sin torres/IA/economía/oleadas/resultados. El LIVE existente no contiene este preview. CI del PR se reporta por su estado real, separado de PASS local.

Rollback: descartar/revertir únicamente este bloque, sin cambiar contratos canónicos ni M01–M07. Siguiente paso: valoración visual de Dirección y correcciones dentro de MAPA-ARTE-08; no iniciar M08-GAME ni fusionar/promocionar sin aprobación estética explícita.


## Reanudación y auditoría visual — 28/10/2026 UTC

[CONFIRMADO EN CÓDIGO] HEAD local y remoto al retomar: d754b00cb421c55b3273bfc13b21aa5d97346698. Los 17 archivos inventariados coinciden en tamaño y SHA-256 con el manifiesto. Ningún módulo ni recurso M08 cambió desde la evidencia existente. Se preservan los cambios ajenos en AGENTS.md, ROADMAP_CENTRAL.md y el estudio documental sin incluirlos en este bloque.

[REVISADO VISUALMENTE] Se abrieron desktop.png, touch844.png, touch932.png y desktop-overlay-after.png. Resultado artístico: **requiere revisión de composición; no se certifica fidelidad premium terminada**.

| Criterio | Observación de las capturas |
| --- | --- |
| Acantilados y terrazas | Hay volumen en rocas aisladas, especialmente al sureste; no existe todavía una topografía continua que articule una ciudad escalonada. El plano de suelo domina la composición. |
| Caminos | Son continuos y despejados; el borde uniforme se percibe como cinta y la convergencia produce puntas duras. El pavimento central tiene límites rectangulares y poca integración con la hierba. |
| Ruinas y vegetación | Observatorio reconocible al noreste, muros envejecidos y vegetación abundante. La repetición de módulos y su microdetalle compiten con la lectura arquitectónica; aún no forman una ciudad monumental. |
| Perspectiva y contacto | Los props tienen caras 3/4 y sombras, pero el terreno plano y la diferente resolución gráfica de camino/pads/props debilitan su cohesión. |
| Superposiciones y plataformas | Los diez pads se ven completos en las cuatro imágenes; no se aprecia decoración bloqueando rutas. La evidencia automatizada verifica cajas contra las bandas protegidas, no toda posible colisión entre píxeles decorativos. |
| Celulares | Caminos y pads siguen siendo distinguibles. El microdetalle de ruinas y follaje se comprime; mantener estos detalles no equivale a resolver las masas cartoon. Emulación, no dispositivos físicos. |
| Invasión alienígena | El acento cian del observatorio no establece por sí solo señales inequívocas de invasión. Falta narrativa ambiental específica. |

[PROPUESTA, NO IMPLEMENTADA] Antes de un rediseño importante, Dirección debe valorar esta intervención: conservar los dos recursos originales y la geometría; organizar los módulos existentes en tres conjuntos arquitectónicos deliberados (observatorio noreste, acceso occidental derruido y terrazas meridionales), unidos mediante superficies escalonadas originales fuera de rutas/pads. Trabajar después la transición del pavimento y bordes del sendero; unificar contornos, masas cromáticas y sombras sin reducir la riqueza ambiental. Proponer señales estáticas de intrusión alienígena en ruinas secundarias, sin mecánicas ni VFX de combate. Si los módulos existentes no bastan, presentar las piezas complementarias antes de regenerar recursos principales.

Esta propuesta cambia la composición y el relieve, por lo que **no se ejecuta bajo la autorización de correcciones locales**. No se ha identificado un bloqueo funcional que justifique modificar código durante esta reanudación. Correcciones realizadas: precisión del diagnóstico y trazabilidad documental; ninguna modificación artística, de gameplay o de layout. No hay nuevas capturas «después» porque el render permanece idéntico.

[QA REUTILIZADO] Geometría, sintaxis, build y Chromium WebGL2 en los tres perfiles conservan su PASS previo, respaldado por hashes coincidentes. No se repiten estas pruebas locales ni se regeneran imágenes por una actualización documental. El CI del PR se consulta aparte; no se presupone su resultado. Regresión: archivos públicos existentes protegidos por la comprobación previa de alcance y hashes; no se afirma una nueva partida de M01–M07. Móvil físico, FPS sostenido y VRAM: NOT_RUN.

[PUERTA DE DIRECCIÓN] Entregar el PR en borrador y estas capturas para valorar el estado y la propuesta. Detener el bloque; sin merge, Render, aprobación estética ni inicio de M08-GAME-01.


## M08-ART-R2 — recomposición autorizada, 28/10/2026 UTC

La orden posterior M08-ART-R2 autoriza ejecutar la propuesta compositiva, sustituyendo la pausa de la auditoría anterior. Base de esta pasada: 3150e7b00144197beb63cb11830986a993a680b9; mismo PR83 y rama feat/m08-map-art-01. El CI anterior terminó SUCCESS (run40609511706); no se atribuye ese resultado a R2.

### Cambios reales

- world.mjs pasa a m08-observatory-candidate-r2. La distribución automática de hasta90 props se sustituye por58 módulos colocados expresamente: grupos west, observatory, south, southwest, garden e intrusion. El número menor no representa retirar detalle por rendimiento: los módulos horizontales reúnen más arquitectura y relieve por pieza; la valoración de riqueza sigue siendo humana.
- Oeste: puerta astronómica derruida, frente de cornisas enlazadas y muros asociados; noreste: observatorio existente sobre cornisa con contrafuertes; sur: dos bandas escalonadas de acantilados con juntas solapadas, muros y patios. Los módulos conservan anclajes/sombras y orden explícito en profundidad.
- Los dos PNG originales permanecen byte a byte iguales. Se añade un único pack original imperial-complements-r2.png, generado para cubrir piezas ausentes: cornisa horizontal, puerta urbana, muro de contención y resto tecnológico alienígena. Fuente original preservada en /workspace/generated_images/exec-f273d993-c423-4b1c-bdb3-de5dd325174d.png (workspace, no dependencia runtime). El atlas resultante no dividió columnas por igual: se usan cuatro frames explícitos para evitar cortar las siluetas, sin reescalar el archivo fuente.
- Carretera: conserva las anchuras92/86/79/69 y el eje original; la base de trazos recibe hombros minerales irregulares dentro de su huella, variación cromática y pequeños remates de tierra en la unión. Se excluyen los bordes minerales de zonas cercanas a otra ruta. No hay cambio de anchura táctil, puntos ni accesos.
- Plaza: envolvente oval irregular y baldosas escalonadas con transición de opacidad al suelo. La primera iteración R2 dejaba juntas excesivas; se corrigieron antes de la evidencia final. No se mantiene el rectángulo original.
- Intrusión: fragmento original de tecnología oscura con núcleo cian quebrado, estático, junto al conjunto meridional. No se añaden mecánicas, partículas, interfaz o enemigos.

### QA final R2

[PASS] node tools/qa-m08-art.mjs; node --check world.mjs y tools/qa-m08-art-browser.mjs; npm run build. La prueba de alcance conserva datos canónicos, selector y archivos públicos existentes M01–M07. No se ejecutan partidas nuevas de estos mapas al no integrarse el preview en su runtime.

[PROBADO EN NAVEGADOR / PASS] Chromium /usr/bin/chromium con WebGL2 SwiftShader, Playwright, perfiles1280×768 DPR1,844×390 DPR1 y932×430 DPR2. Comando local: M08_OUT=artifacts/m08-r2-final CHROMIUM_PATH=/usr/bin/chromium node /tmp/m08-browser-r2.mjs; ese runner replica tools/qa-m08-art-browser.mjs cambiando únicamente la resolución de import de Playwright al paquete instalado en el entorno.

Tres perfiles:403nodos,10pads,58módulos, cajas fuera de banda53wu/elipses61×45, sin errores JS, centrado FIT;128objetos y13texturas totales antes/después de destroy/remount; cero texturas m08/ tras destroy. QA además exige versiónR2 y presencia de grupos arquitectónicos/intrusión. report.json incorpora SHA-256 de módulos, tres PNG y datos de mapa/campaña. La primera ejecución de desarrollo detectó una pieza fuera del margen y no constituye evidencia PASS; se corrigió antes de la ejecución final completa.

[REVISADO VISUALMENTE] Capturas finales PC y móvil: diez pads visibles, accesos despejados, monumento y cornisa anclados, sin cortes evidentes de frames. La comparación se conserva en COMPARATIVA_R2.md y evidence/before-r2/ a idénticos perfiles. evidence/desktop-overlay-after.png muestra tres ejes y diez sockets.

[NOT_RUN] Teléfonos físicos, FPS sostenido, VRAM y memoria real. Los recuentos de objetos/texturas acreditan limpieza de una reconstrucción, no ausencia universal de fugas. CI R2 se consulta en PR83; el acta no presupone un resultado verde.

### Riesgos y puerta artística

R2 mejora agrupación, continuidad de las bandas rocosas y narrativa, pero no se declara cumplimiento artístico absoluto: las caras del terreno se concentran en bandas periféricas, la superficie central aún es mayormente plana, los PNG originales mantienen detalle fino y el pavimento/pads usan un lenguaje gráfico más simple. La reutilización de la cornisa puede reconocerse en el sur; Dirección debe valorar su ritmo, monumentalidad y cohesión a escala móvil. No se afirma igualdad con un mockup M08 no disponible ni aprobación premium por CI.

Solo cambiaron world.mjs, un pack complementario, QA navegador y documentación/evidencias del bloque. plan.mjs, geometría, sockets, campaña, gameplay, AGENTS y roadmap se preservan. PR83 permanece DRAFT. Sin merge, Render, M08-GAME-01 ni M09. Detención para valoración artística humana con las capturas reales.
