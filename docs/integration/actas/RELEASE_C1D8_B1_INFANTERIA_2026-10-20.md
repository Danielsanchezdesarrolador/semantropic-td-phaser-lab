# SEMANTROPIC TD — ACTA RELEASE C1-D8 B1 / PUNTO DE REUNIÓN
- Fecha: 2026-10-20; compromiso: actualizaciones por bloque sobre la MISMA URL, sin crear nuevas versiones de prueba.
- QA fuente: `414dfa35326afca4e9f4ced5c30cd9c689370c52`, [Actions 39511773777 SUCCESS](https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39511773777), artifact 12305098768.
- Núcleo nuevo `m01-infantry-combat-a3.mjs` extiende A2 exclusivamente en momentos de preparación/entre oleadas: mueve soldados, mantiene pausas, no spawns/balas/HP/oro artificial.
- UI nueva `/official/src/c1d8-b1-playable/` muestra círculo real de alcance 130 unidades; permite reintentos tras toque inválido y cancelar; confirma destino con marcador.
- QA Node: desplazamiento autónomo a nodo 133 canónico, pausa congela, no cambia oro, primera oleada intacta.
- QA Chromium WebGL2 escritorio 1280×768 + landscape844×390/932×430 touch: tocar T09 Rally, fuera radio mantiene selección, toque válido guarda nodo, ambas unidades nivel II caminan de verdad, cancelar restaura control; además 5 oleadas reales del core, victoria 63 bajas/0 fugas/100 vidas/★★★ guardado, derrota 50 fugas.
- Legacy C1-D7 G2, P08, T09, T08, M07-Q2 FIEL y campañas/Canvas protegidos.
- Rollback SHA anterior producción `961af46b7e66962878f7e71e2cf58a07a9281ef9`.
- Pendientes: validación manual Android físico, FPS real y bloques B2/B3; no declarar corrección del rifle ni animaciones completas.
