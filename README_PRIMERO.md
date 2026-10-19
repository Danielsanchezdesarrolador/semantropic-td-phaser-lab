# SEMANTROPIC TD — Phaser 4.2.1 WEB / GitHub + Netlify

Este repositorio es únicamente un **laboratorio T1-PH independiente**.

## Objetivo
Probar Phaser 4.2.1 en navegador, con **la librería empaquetada localmente** y WebGL2 verificado en tiempo de ejecución. No es una migración de la campaña, que permanece en Canvas 2D.

## Instalación local

```bash
npm install
npm run build
```

Para servir la versión compilada:

```bash
cd dist
python -m http.server 8000
```

Abrir `http://localhost:8000/LAB_PHASER_WEB.html`. Si Python no está instalado, sirve `dist` con cualquier servidor estático.

### Publicar con GitHub + Netlify
1. Crea un repositorio nuevo en https://github.com/new llamado `semantropic-td-phaser-lab`.
2. Descomprime este ZIP y **sube el contenido del directorio raíz** al repositorio (NO el ZIP, ni `node_modules/`).
3. En Netlify, `Add new project` > `Import an existing project` > GitHub > selecciona el repositorio.
4. `Build command`: `npm install --no-audit --no-fund && npm run build` (se encuentra también en netlify.toml).
5. `Publish directory`: `dist`.
6. Configura la visibilidad del sitio como **Public** (Netlify puede dejarlo privado por defecto).
7. Accede a la dirección publicada y elige `Phaser 4.2.1 + WebGL2`.

**Phaser 4.2.1 se descarga una sola vez en el sistema de compilación por npm; después el navegador obtiene `/dependencias/phaser.min.js` desde el propio sitio, no desde CDN.**

## Página y rutas

- `/` Portada
- `/LAB_PHASER_WEB.html` — Escena T1 Phaser/Canvas sintética (30 / 60 / 120 enemigos; no es gameplay oficial)
- `/JUEGO_V5_CANVAS.html` — Campaña V5 pública original y sin editar
- `/JUEGO_V5_IPHONE.html` — Variante iPhone original y sin editar

## QA y honestidad

La creación de este paquete no acredita una corrida de Phaser, WebGL2 físico, FPS ni compatibilidad móvil. Confirmar en el panel `Versión Phaser`, `WebGL2 real`, y que las texturas/escena se dibujen; si falla, revisar errores del navegador.

## Seguridad

No subas archivos secretos, tokens ni contraseñas al repositorio. Esta copia experimental es independiente de Semantropic Trivia y sus repositorios.
