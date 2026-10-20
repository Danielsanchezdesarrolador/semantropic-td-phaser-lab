# SEMANTROPIC TD — RELEASE C1-D8 B3 · COMBATE VISUAL
Fecha 20-oct-2026.
Código candidato QA: `ff9344ed7eb64cd1ce0dc4edc0a83a1ff5872717`.
CI real: https://github.com/Danielsanchezdesarrolador/semantropic-td-phaser-lab/actions/runs/39514307992 — SUCCESS.
Render estable: https://semantropic-td-jugar.onrender.com/official/src/live/ y rama production/semantropic-td-live.
Cambios: B3 `c1d8-b3-combat/motion.mjs` calcula pose ilustrativa desde P08/Core, backswing, impulso y reacción; nueva escena G2+B1+B3; dos VFX cortos por contacto confirmado, sin hits ficticios. El B2 del Francotirador NO se ha integrado todavía.
QA: Node pure motion no cambia gameplay, source lock, C1-D8 B1 rally, Phaser 4.2.1, Chromium WebGL2 escritorio 1280x768, móviles emulados 844x390 y 932x430; fotograma real ataque frame2 offsetX=-13.45 y rotation=-.259, 1 spark real, 5 oleadas 63/0/100 victoria ★★★ y derrota por 50 fugas, guardado tras recarga. No QA móvil físico ni aprobación artística humana.
Rollback commit LIVE previo: `b70a28d93e42375af19f69514b1171486849e396`.
