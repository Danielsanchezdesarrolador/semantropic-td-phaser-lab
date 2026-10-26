# MAP-ART-05-HF-ALIGN-REF-01 — Pantano húmedo

Orden del Director: `SEMANTROPIC_TD_CODEX_M05_HOTFIX_ALINEAR_CON_REFERENCIA_2026-10-26.txt`, 26/10/2026. Hotfix artístico exclusivamente. Base real PR70, producción `e3c58108615108f309452d3ef84e1574b729d4fd`; rama `art/m05-hf-align-ref`.

## Resultado y comparación con la referencia

El mockup de pantano adjunto en la conversación es la referencia visual: agua verdosa estructural, islotes húmedos, raíces antiguas, vegetación agrupada, choza sobre pilotes, faroles ámbar y ruinas turquesa. La imagen original sigue en la conversación; no se inventa ruta binaria ni comparación pixel a pixel. Las capturas de este bloque son Phaser real, no el mockup convertido en fondo.

- **Agua:** material original jade/verde con lentejas y nenúfares, sombras de profundidad, brillos suaves y grupos de flora flotante. Se estrecha únicamente el soporte artístico de los islotes, ampliando humedales; los tres cruces continúan sobre los mismos puntos de ruta. La superficie sin terreno superior pasa del 23,27% al 30,87%, muestreada en 61.440 posiciones. Esta métrica de máscara no equivale a agua visible final: acantilados y props ocultan parte.
- **Orillas:** labio de tierra húmeda oliva, raíces y eneas emergentes, roca más fría y oscura. El césped rural repetido se sustituye por barro, musgo, raíces y flora baja. Material fuente 1536×1024 con dos superficies, aplicado a 2 píxeles fuente por unidad del mundo y reflejado en bordes para evitar costuras.
- **Vegetación:** 96 props individuales frente a 63; 74 grupos de flora de humedal y 17 árboles originales de pantano. Se eliminan los robles de pradera y la carga de su atlas M02. Plantas agrupadas alrededor de ruinas, árboles y bancos. Las candidatas sin apoyo o que invaden el espacio táctico se descartan.
- **Atmósfera:** paleta de musgo/arcilla contra agua jade, niebla baja estática sobre agua, faroles cálidos y ruinas cian del atlas original. Sin nuevos VFX animados, partículas o tweens.
- **Integración:** sombras de contacto, raíces asentadas y extremos de puentes comprobados contra la máscara real. Se conservan las tres pasarelas y las cascadas con fuente y cuenca verificables.

Se aproxima al mockup en materiales húmedos, identidad de vegetación, presencia del agua y cohesión temática. Sigue siendo distinto en composición: la ruta canónica larga y serpenteante, los nueve centros y los cruces aprobados mandan sobre el layout ilustrado. No se afirma fidelidad exacta ni aceptación artística humana.

## Archivos del producto (cinco)

- `public/official/src/maps-visual/m05/cartoon01/assets.mjs`: barrera de carga propia; seis componentes originales, roca M02 de solo lectura y nuevo material húmedo. Ya no carga césped ni roble rural.
- `public/official/src/maps-visual/m05/cartoon01/marsh-world.mjs`: versión `m05-hf-align-ref01-wetland-art-v1`, composición de grupos y bruma estática, métricas de hábitat.
- `public/official/src/maps-visual/m05/cartoon01/surfaces.mjs`: soporte visual de islotes, materiales y transición húmeda, manteniendo pintura del camino/pads/puentes.
- `public/official/src/maps-visual/m05/cartoon01/wetland-details.mjs`: materiales, arcilla, nenúfares, raíces y eneas estáticos.
- `public/official/art/maps/m05/cartoon01/wetland-materials-original.png`: fuente nueva original generada para el proyecto; no sobrescribe imágenes aprobadas.

QA: dos herramientas M05 existentes y filtro documental de su workflow. Los anteriores informes PR70 se conservan como historia; evidencias nuevas en esta carpeta.

## Contratos protegidos

307 waypoints y nueve centros exactos; módulo geométrico, arte de pads, atlas original, HTML/JS de preview, selector y datos protegidos sin cambios. Camino 62wu, curvas C2 y desviación inferior a 0,637wu conservados. Ningún cambio en M01–M04, core, UI, economía, oleadas, enemigos, torres, guardados o dependencias. M05 continúa **solo preview, fuera del selector y sin combate**.

## Validación y límites

- [PASS] Node: alcance aislado, dimensiones del material, datos protegidos, arte de pads idéntico y geometría C2/curvatura/offsets/estaciones.
- [PASS] `npm run build`, Phaser 4.2.1.
- Capturas `before-*` reconstruyen módulos exactos de producción PR70 mediante intercepción local de JS en Chromium, assets originales intactos. `baseline-browser.json` identifica versión y método.
- Browser/CI/publicación: consultar informes adjuntos y PR para estado final; el acta se registra antes de promover.
- [NOT_RUN] móvil físico, FPS/VRAM físicos, M05 gameplay/jefe/oleadas. [PENDIENTE] evaluación estética del Director.

Rollback: revertir el merge de este hotfix a través del flujo habitual; base de recuperación PR70 indicada arriba. La URL de revisión artística se conserva: `/official/src/maps-visual/m05/preview/`. No se publica otra web ni se habilita M05 en LIVE.

Nota de trazabilidad local: la corrida completa comprobó desktop y dos tamaños táctiles, reinicios y regresión M01–M04. Después de iniciar desktop se retiró del atlas el frame de roble ya sin instancias; los casos móviles y las capturas finales `probe*.json` usan seis frames. El resultado visual y los 96 props no cambiaron. CI comprueba todos los perfiles sobre el HEAD final, incluida la ausencia de descargas de césped/roble M02.
