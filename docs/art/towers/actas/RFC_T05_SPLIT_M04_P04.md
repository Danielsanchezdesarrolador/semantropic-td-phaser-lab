# RFC T05-C1D-01 — Split layers, soldado/operador y escala con M04/P04

**A:** Integrador Técnico / Equipo M04 / Equipo P04. **Estado:** [PROPUESTA] no aplicada fuera de namespace T.

En `feature/art-t05-premium-towers` existen para cada variante A tres archivos con idéntico viewBox 360×420 y pivote (0.5,0.93): `shadowFoot`, `backStructure`, `frontRail`. Para mantener compatibilidad, C1-C sigue usando el compuesto A en `meta.url`. Solicitud: componer `shadowFoot` bajo el actor; `backStructure` bajo operador; `frontRail` delante de sus piernas pero NO rostro/arma, con HUD/HP encima de efectos.

El Integrador debe validar los pies P04 con el `operatorAnchorLocal` Sniper=(187,207) y el muzzle físico de T05 Sniper I=(318,170), II=(319,170); ninguno equivale a un cambio mecánico de proyectiles. Infantería conserva `spawnExitLocal=(133,348)`; P04 aporta recluta real, Core autoriza el spawn.

La escala T05 de cada torre es mera propuesta entre 0.298 y 0.322. Se recomienda observar las cuatro en M04 sobre pads M03 ~110.24wu con 8 sockets auténticos antes de ratificar cualquier footprint. Solicitar a M04 cambios de decoración de pad únicamente por RFC independiente si hay desequilibrio visual; no alterar coordenadas ni selección táctil.

**Criterios:** escena C1-D real 1280×768/844×390/932×430, operador no tapa techo, barandilla delante de pies, muzzle coincide con arma, sombra bajo estructura, sin saturación y ruta legible. Si fails, ajustar únicamente shaders/capas/anclajes T en nuevo PR o emitir adaptador central aprobado.

**Bloqueado:** sin integración conjunta de T05/M04/P04 ni capturas reales. No implementar cambios core, actor, mapas, paquetes ni Render por parte de T.
