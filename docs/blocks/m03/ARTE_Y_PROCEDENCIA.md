# M03 — arte original y composición por capas

Dirección: prompt maestro del Director de 23-oct-2026, Bosque de los Susurros; referencia JPG 51066 usada para estudiar riqueza, vegetación, perspectiva e iluminación. El JPG no se distribuye en el juego, no se calca su layout ni se usa como textura.

Dos PNG originales creados para este bloque con la herramienta de generación de imágenes de OpenAI:

- `public/official/art/maps/m03/forest-props-original.png`: atlas transparente original, seis ilustraciones independientes (roble, árbol secundario, ruinas, cascada sobre roca, sotobosque y baliza). Se conserva el original sin recortar. Extracción por componentes alfa en el cargador; cada instancia tiene posición independiente y pasa exclusiones geométricas.
- `public/official/art/maps/m03/forest-terrain-original.png`: pintura de suelo y ribera sin camino, pads, personajes, torres ni landmarks; se conserva el original. El pintado de terreno se proyecta con la ribera por debajo de y=650 para no invadir pads canónicos.

Brief de creación: bosque encantado original en perspectiva 3/4, musgo oliva/esmeralda, luz cálida y niebla azul, piedra envejecida, agua turquesa. Textura pintada, volumen y sombras; prohibidos assets/composiciones de juegos existentes, texto, UI y rutas inventadas. El segundo encargo especificó terreno abierto, sin grandes árboles, ruinas, caminos, círculos, plataformas ni cascadas; el atlas proporciona esos elementos por separado. No se incorporó arte de bibliotecas externas ni de Ironhide. Esto documenta procedencia técnica; no sustituye una revisión jurídica comercial ni la aprobación estética del Director.

El renderer construye por capas: terreno → props rechazando cruces → camino canónico de 188 muestras → ocho pads → luz ambiental. No hay imagen completa de mapa con ruta incorporada. La cascada única está en la ribera inferior y no atraviesa la senda. El ambiente usa 12 motas y cinco reflejos, reloj del núcleo, pausa y `prefers-reduced-motion`; no shaders o emisores ilimitados. Las franjas panorámicas usan un terreno sin landmarks/pads, evitando reflejar torres o el Roble.

Los tres actores nuevos son rigs originales articulados rasterizados por código (`actors-visual/m03/forest-enemies.mjs`): acechador con capa/hojas y hoja de combate, cazador ligero con ballesta y carcaj, murciélago con alas articuladas. Cada uno tiene idle, marcha/vuelo, anticipación, ataque, golpe y muerte. No se usan sprites warrior como sustitutos. Los cuatro tipos anteriores mantienen P08 y sus accesorios existentes. El aspecto final de mapas/actores requiere aprobación humana.

Los hashes, tamaños y dimensiones están en `asset-manifest.json`. Los PNG fuente permanecen en Git; no se necesita llamar un servicio generativo para jugar o compilar.
