# RFC T04 → Equipo M03 / Integrador · Disco visual de plataforma

Estado [PROPUESTA]. T04 NO modifica ningún mapa ni su pad.

Hallazgo: M02 dibuja sprite de textura de plataforma con ancho fuente cercano a 206px y `setScale(.58)`, ~119.48 world units. La silueta de base T04 proyecta 90.58–97.61wu; el perímetro del disco sigue demasiado visible (18–24%).

**Solicitud a M:** evaluar versión visual con escala aproximada .50 del mismo sprite (~103wu), sombras y tintes coherentes. Reducir SOLO dibujo. **NO** tocar socket coordinates, buildability, geometría 133 waypoints/8 pads, hitareas, radio de selección ni colisiones. Integrador valida móvil.

Beneficio esperado ALGEBRAICO: visible ~12.1%, 8.5%, 7.3%, 5.2% según torre. La evidencia visual permanece PENDIENTE.

Validar tres fondos M02/M03, operador y soldado P y camino de 110wu, además de 844×390 antes de aprobar.
