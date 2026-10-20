# SEMANTROPIC TD — Canal permanente de juego (Phaser 4.2.1)
## Fuente de verdad
- Rama publicable: `production/semantropic-td-live`.
- URL canónica: raíz del sitio Render (redirige a `/official/src/live/`); esta ruta `/official/src/live/` **no cambia entre versiones**.
- Escena publicada actualmente: `../c1d6-playable/scene.mjs`, versión C1-D6.
- Producción sólo MAPAS M07-Q2 tratamiento FIEL, TORRES T08-HF1 con masters T04 originales y P03 personajes aprobados; P07-HF1 archivos precargados, **NO ACTIVOS** mientras falla `qa-p07.mjs`.
- Gameplay: M01 de 5 oleadas / 63 enemigos, 133 nodos, ocho pads, dos familias I/II, punto de reunión, victoria/derrota, récord local aislado.
## Protocolo obligatorio de actualizaciones
1. Equipos desarrollan en sus propias ramas y PR; no trabajan directamente sobre la rama de producción.
2. Integrador construye rama de revisión, verifica fuentes, arte original, Node/Phaser y Chromium WebGL2 en 1280×768, 844×390, 932×430. **Fallo bloqueante impide promoción**.
3. Dirección General revisa comparación visual original C1-C y solicita aprobación para cambios de identidad o core; nunca reintroduce regresiones.
4. Sólo un commit/merge validado se promueve a `production/semantropic-td-live` y se actualiza `public/official/src/live/index.html` para señalar la nueva escena. La URL fija NO cambia.
5. Render Static Site (autoDeploy YES) observa EXCLUSIVAMENTE `production/semantropic-td-live`; los cambios aprobados desplegados sustituyen los archivos del mismo sitio, con **mismo dominio y misma URL**.
6. Comprobar despliegue LIVE, enlace accesible y humo funcional; si falla, revertir commit en la **misma rama**, sin cambiar URL.
7. No modificar Canvas V5 ni campaña protegida ni reutilizar servicios de laboratorio. Registrar cada deploy con SHA.
## Versión fundadora
- C1-D6 / PR #36 (Draft revisión) CI real PASS [Actions #39469370610](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39469370610).
- Excepción explícita de arte: P07-HF1 `qa-p07.mjs` reporta alfa=0 con RGB residual; *no* desactivar ese test ni promocionar sus sprites sin corrección y revisión.
- No se realizaron pruebas de usuario en iPhone físico; Browser/QA fue Chromium WebGL2.
