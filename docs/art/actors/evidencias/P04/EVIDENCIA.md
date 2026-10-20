# SEMANTROPIC TD · P04 · Estado de evidencias de animación
**Fecha:** 2026-10-19 · **Rama:** feature/art-p04-animation-pass
**PR DRAFT:** https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/pull/15
**Estado: SIN CAPTURAS PHASER REALES P04 AL CREAR ESTE DOCUMENTO.**

## Por qué este directorio está vacío de screenshots
Existe código de vitrina y generador de hojas de personaje, pero los atlases NO se han exportado/inspeccionado como PNG reales ni se ha ejecutado browser en esta rama en este turno. No publicar ilustración IA bajo etiqueta falsa [CAPTURA PHASER]. La salida V8 Canvas mock valida estructura, NO píxeles o legibilidad.

## Capturas obligatorias [NO EJECUTADO]
| Imagen solicitada | Relación/condición | Estado |
|---|---|---|
| P04-desktop-real-webgl2.png | Chromium real 1280×768, cinco versiones con mismo encuadre | NOT_RUN |
| P04-mobile844-real-webgl2.png | Chromium touch emulado 844×390 | NOT_RUN |
| P04-mobile932-real-webgl2.png | Chromium touch emulado 932×430 | NOT_RUN |
| P04-closeup-real-webgl2.png | poses hound/guerrero/francotirador, contact points y bordes | NOT_RUN |
| 4 hojas P04 1200×820 | original sheet PNG generada en navegador con export | NOT_RUN |
| 4 atlas P04 1408×832 | PNG RGBA real + SHA256, alpha inspeccionado | NOT_RUN |
| operator-on-T05-frontRail.png | Prueba escena conjunta T05 con capa frontal | NOT_RUN |

## Cómo generar pruebas de verdad
1. En checkout de rama P04, ejecutar `npm install` y `npm run build`.
2. Instalar Playwright local sin editar package: `npm install --no-save playwright && npx playwright install chromium`.
3. Ejecutar `node public/official/src/actors-visual/qa-p04.mjs`.
4. Ejecutar `node public/official/src/actors-visual/qa-p04-browser.mjs`.
5. El script de navegador, **si se ejecuta con éxito**, escribe PNG + RUN_P04_BROWSER.json en esta carpeta. Revisar cada archivo real antes de versionarlo; capturas con SwiftShader son render Chromium, no teléfono físico.
6. Abrir `dist/official/src/actors-visual/p04-index.html` servido por HTTP y reproducir 3 walk/2 attack, pausa/reanudar, cambio de actor, 24 copias visuales, escala 44/64/80 px y E/W.
7. Probar T05 mediante Integrador sobre M01 real, guardar montaje antes/después y registrar measuredDx/Dy si hay desalineación.
8. Tras prueba, subir PNG/WebP livianos y `RUN_P04_BROWSER.json` a GitHub, cambiar estados QA del acta y dejar fuente/hashes disponibles.

## Evidencia disponible hoy [PROBADA EN V8 SIMULADO]
- 128 fotogramas y comandos geométricos diferentes en cada estado/actor.
- 4 atlas 1408×832 y 4 hojas de estudio 1200×820 simuladas sin excepción.
- Claves de texturas registradas en mocks de Phaser.
- Los metadatos del T05 en rama independiente muestran anclajes source y capas frontRail, **sin prueba visual de encaje P04**.

**No declarar gameplay, aprobación estética ni FPS sin pruebas reales.**