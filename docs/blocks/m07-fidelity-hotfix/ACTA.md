# M07 — hotfix de fidelidad + norma AGENTS

Orden27/10/2026: corregir la simplificación del preview M07 respecto del mockup aprobado. Base de producción0f2f78a4a0a432900b2dec542f9f59cf0a2c58ce, rama feat/m07-fidelity-hotfix. Se leyó íntegro el TXT adjunto. Referencia visual: mockup de Dirección visible en conversación; no se inventa archivo local ni medición pixelométrica contra un JPG ausente.

## Simplificaciones detectadas

La entrega anterior redujo nieve a manchas planas, roca a facetas básicas, bosque a repetición dispersa y puentes a tablones/barandas simples; agua y elementos mágicos quedaron con poco contexto. Fue una reducción no autorizada de la riqueza visual, no una limitación técnica demostrada. Este hotfix no conserva ese criterio como excepción artística.

## Corrección modular

- Dos fuentes nuevas originales1536×1024: material de nieve/roca y sheet alpha de seis módulos(agrupación de tres pinos, abeto ancho, sotobosque helado, ruina, brasero con apoyo, banco de hielo). Los originales anteriores se conservan.
- La nieve ahora tiene acumulación, sombras azules, pequeñas rocas y vegetación integradas; no se pinta un mapa aplanado bajo la escena. El material se recorta por la máscara topográfica.
- Roca estratificada, cornisas, hielo e icículos se anclan a la altura local de cada borde. Las caras se extruyen106unidades frente a76anteriores; erosión multiescala rompe perfiles lisos conservando los pads.
- Agua azul del pack original M06 reutilizada, con continuidad de familia cromática. Fade superior deja ver cordillera/cabeceras; dos caídas estáticas y hielo mantienen origen/cauce/basina. Sin VFX ni animación.
-90módulos decorativos frente a56previos:6grupos de tres pinos,24abetos anchos,27grupos de sotobosque,8bancos de hielo,17rocas,4braseros,2arcos,1ruina y1portal. La cifra cuenta módulos, no90árboles. Anclajes de bosque y soporte local, variación de escala, profundidad por pie y solape intencional entre vegetación; no una cuadrícula.
- Puentes prolongados hasta apoyarse en ambos bancos: tablero separado de estructura, juntas de mampostería/arco frontal, tablas con vetas y clavos, barandas nevadas, pilares con volumen y braseros estáticos. Derivan de los mismos cruces; no se inventan conexiones jugables.
- Portal y ruina se integran con nieve, hielo y sotobosque. No se cambian sprites de torres, enemigos ni UI.

## Norma permanente

AGENTS.md incluye, antes de la identidad del proyecto, «NORMA DE FIDELIDAD A MOCKUPS APROBADOS — Dirección General,27/10/2026»:

> Todo mockup aprobado por Dirección General es una referencia visual obligatoria de alta fidelidad, no una inspiración vaga.
> Codex no puede simplificar, reducir, reinterpretar ni empobrecer por iniciativa propia la complejidad visual, densidad ambiental, relieve, profundidad, masas forestales, props, siluetas, bioma o riqueza compositiva aprobados.
> La optimización técnica no autoriza reducir el diseño sin aprobación explícita.

También aclara cómo informar conflictos técnicos antes de una excepción y que el lenguaje cartoon no permite empobrecer el diseño. Se corrige la referencia interna de AGENTS13.1 y se agrega referencia cruzada al canon central. Geometría, separación modular y prohibición de usar el mockup como fondo permanecen vigentes.

## Protecciones y QA

271+271 puntos,9centros/IDs y arte de pads conservados. Road-geometry y ancho54 idénticos al release anterior. Todos los archivos public existentes se congelan salvo assets.mjs,terrain.mjs y frost-world.mjs M07; se admiten únicamente dos PNG nuevos y eroded-rim local. Nada de M01–M06, M08–M10, campañaJSON, gameplay, vidas, economía, HUD,selector o guardados cambia.

Guard estricto específico + geometría/radios/C2 + raster de ancho real + ChromiumWebGL2 PC1280×768 y móvil844×390/932×430DPR2. Verificación de ambos extremos de los puentes, pads y cobertura de ruta. Capturas antes auténticas del release0f2f78a, no una construcción sintética; procedencia y hashes en before/provenance.json. Después y overlay de la escena real. Comparación cualitativa con el mockup; no se inventa porcentaje de fidelidad ni aprobación humana.

Presupuesto de superficies sigue en cinco texturasRGBA2560×1536:75MiB estimados más sprites/puentes/pads; fuente y conteo de texturas/objetos en reporte. No se crean sprites por frame. Desmontaje/remontaje sin crecimiento de objetos/texturas. FPS/VRAM físicos y teléfonos reales: NOT_RUN. La aceptación estética final es de Dirección, no se deduce del PASS técnico.

Preview continúa sin combate, separado del selector. CI y verificación pública se registran en el PR. No se presenta la URL del juego como M07 jugable. Rollback: revert del merge del hotfix conservando el despliegue anterior y los datos; la norma de Dirección sigue siendo la decisión vigente aunque deba revertirse arte por incidencia.

Incidencia exploratoria: una ejecución previa(artifacts/m07-hf-rich) agotó30s al esperar el overlay móvil932 mientras había corridas/builds exploratorios simultáneos. Se conserva como FAIL, sin afirmar una causa exclusiva no medida. La ejecución final aislada de artifacts/m07-hf-final completó los tres perfiles y todas las aserciones: PASS. No se redujeron detalle, aserciones, densidad ni geometría para superar QA; no se cambió el timeout del driver.
