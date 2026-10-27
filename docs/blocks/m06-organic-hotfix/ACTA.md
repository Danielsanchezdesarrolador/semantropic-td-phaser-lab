# M06 — hotfix artístico orgánico cartoon

Orden: TXT de Dirección 26/10, corrección fuerte de artificialidad, paleta, recortes, orillas y riqueza. Base producción 3a827f1c21379d006a54e418c00d6717c0cf1f72. Rama art/m06-organic-hotfix.

Cambios exclusivos: assets.mjs, terrain.mjs, canyon-world.mjs y un material PNG original nuevo. No se sobrescriben PNG anteriores. Nueva versión m06-hf-organic-cartoon-v2. Los seis tipos de props originales se reutilizan.

- Siluetas: las mesetas poligonales se sustituyen por curvas cuadráticas orgánicas; las dos rutas y los nueve pads permanecen exactos. El módulo del camino queda byte idéntico.
- Paredes: grandes facetas cel shading coral/terracota y ocre; se proyecta cada columna desde su borde de terreno local para eliminar recortes arbitrarios de una textura global.
- Orilla: pie rocoso vertical erosionado y espuma tenue al contacto con el agua; no se añade playa de arena. Agua jade más calmada, con transición atmosférica hacia el fondo, sin corte horizontal brusco.
- Cohesión: tierra cálida con manchas de vegetación salvia/oliva; agua y caída comparten una paleta más contenida. La arena nueva también da textura leve al sendero, sin cambiar su geometría.
- Vida: grupos adicionales de cactus, roca mineral y acacias, colocados solo si pasan apoyo, exclusión de ruta/pads y separación de otros props. Sin animación, gameplay ni VFX nuevos.

QA: la guarda congela todos los archivos públicos de la base salvo los tres módulos M06 enumerados. Protege también los PNG históricos y la geometría anterior. Chromium verifica dos rutas 243+243, nueve pads, tres puentes con apoyo, ausencia de props sobre ruta/pads, ancho, juntas FIT, reinicio/disposal, apoyo real de la caída y smoke M01/M02/M05. PC 1280×768, móvil horizontal emulado 844×390/932×430. Build/CI/publicación se registran en PR/entrega; móvil físico NOT_RUN y aceptación estética PENDIENTE de Dirección.

Before: captura pública de la versión anterior. After: captura real Phaser nueva, no el atlas ni el mockup. M06 continúa siendo vista artística sin campaña. El selector jugable M01–M05 no cambia. Rollback: revert del merge del bloque, sin migraciones ni alteración de guardados.
