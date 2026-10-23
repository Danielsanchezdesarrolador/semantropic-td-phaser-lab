# Decisión oficial — equipo central único y entrega verificable

## Autoridad y alcance

[APROBADO POR DIRECCIÓN] El Director reemplaza oficialmente el esquema de tres equipos M/T/P independientes por un equipo central integral de Codex. La separación técnica y todas las decisiones artísticas, mecánicas y contratos aprobados se conservan. No se reinicia el proyecto.

El equipo central cubre mapas/ambientación, torres/habilidades/VFX, actores/enemigos/animación, gameplay/combate/economía/progresión, interfaces/UX móvil/optimización e integración/QA. Trabaja con un roadmap operativo y bloques pequeños, completos y verificables. Una rama acotada/PR por bloque es un mecanismo de revisión del equipo único, no tres flujos paralelos.

Base documental/productiva: `5388a490f808bac4cfd47e02ae6739f923caa5cc` (HF3). AGENTS original leído y conservado como antecedente en la rama `docs/agentes-vision-maestra-20261022`, SHA `af0fdfeb4237acceef57163b7902c6532f3fbb94`. Se incorpora su contenido al reglamento raíz con la metodología nueva expresamente autorizada; no se fusiona esa rama histórica.

## Auditoría de ramas

Se inventariaron las **60 ramas remotas** existentes antes del nuevo bloque documental: HEAD, base común, commits exclusivos de cada lado, asunto del último commit y rutas cambiadas desde la base. 25 refs eran ancestros de HF3 (incluida producción); 35 tenían commits no ancestrales. El JSON conserva los SHAs exactos de ese corte.

Se revisaron de forma dirigida las entregas históricas M-01, T-01/T-02 y P-01 y seis comparaciones de blobs representativos. Los SVG originales T04 de Infantería/Sniper I, P03 rig y el loader P08 comparados coinciden byte a byte con producción aunque sus ramas no sean ancestros: la divergencia Git **no prueba que falte integrar su contenido**. M07/T10 presentan diferencias o rutas no presentes en el head histórico consultado; eso requiere auditoría concreta antes de recuperar cualquier pieza. La revisión no valida visualmente todo el contenido de cada rama ni autoriza sus diseños descartados.

Registro: `AUDITORIA_RAMAS_HISTORICAS.json`. No se elimina, sobrescribe ni fusiona ninguna rama histórica; no se hace force push. Las ramas anteriores siguen siendo evidencia y respaldo, no flujos de desarrollo obligatorios.

## Documentación vigente

- `AGENTS.md`: equipo único, módulos coordinados, precedencia sobre órdenes antiguas de tres equipos, protección histórica y entrega obligatoria del enlace jugable verificado.
- `ROADMAP_CENTRAL.md`: único orden operativo; distingue hechos de objetivos y aceptación humana pendiente.
- `PROTOCOLO_UNICO_Y_ESTADO.md`: alineación del flujo actual y nueva entrada, conservando la bitácora anterior.
- `RELEASE_CHANNEL_POLICY.md`: proceso vigente y cinco controles de entrega, con antecedentes del canal intactos.
- `OWNERSHIP_AND_WORKFLOW.md`: aviso de vigencia que retira las órdenes organizativas C0; el texto histórico y los contratos técnicos no se reescriben.

## Enlace y publicación

Rama de publicación única: `production/semantropic-td-live`.

URL oficial permanente: https://semantropic-td-jugar.onrender.com/official/src/live/

Todo bloque **jugable** implementado y aprobado por QA exige pruebas técnicas, revisión de regresiones, publicación efectiva en Render, comprobación de que la URL entrega los archivos/versión nuevos e indicación de qué debe probar el Director. No atribuir al enlace anterior un cambio todavía no publicado o no verificado. No crear servicios públicos alternativos. Una comprobación de archivos públicos no se presenta como metadato interno de SHA de Render.

## Validación proporcional de este bloque

Solo documentación: comprobar referencias locales, JSON de inventario, coherencia con la decisión, diff sin código ni assets y preservación de ramas históricas. No se atribuyen nuevas pruebas de gameplay a una modificación documental. Los resultados jugables de HF3 siguen asociados a [CI 39890530324 SUCCESS](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39890530324), con 26 pasos.

No cambia ningún archivo de `public/`, herramientas de juego, dependencias, build, CI, estadísticas, geometrías, guardados ni arte. Por ello este bloque **no añade novedades jugables**: el juego sigue siendo HF3. Una eventual ejecución automática de CI tras integrar documentación debe informarse con su propio estado, sin reutilizar el PASS de HF3 como si perteneciera a otro SHA.

Pendientes sin reabrir sistemas: aprobación artística final M01 por el Director, playfeel/balance humano y rendimiento Android/iOS físico. El arte R6 M02 permanece aprobado según la transferencia.

Rollback documental: revertir el commit de esta metodología; no resetear producción ni restaurar indiscriminadamente ramas de arte. La responsabilidad técnica de las reglas permanece en el CORE.
