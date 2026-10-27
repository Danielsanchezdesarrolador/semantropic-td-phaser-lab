# Decisión aprobada — M07 Normal

[APROBADO POR DIRECCIÓN] 27/10/2026. Respuesta expresa: «Autorizar ×1,35 solo en M07 Normal».

Se aplica `M07_SNIPER_FACTOR=1.35` exclusivamente en M07 Normal. M01–M06 conservan sus factores. No cambia HP enemigo, escudos, intervalos JSON, rutas, pads, oleadas, economía, vidas iniciales, arte ni HUD.

## Antecedente experimental, anterior a la aprobación

QA18D de Canvas V5 usa Francotirador ×1,17. No se certificó una victoria con las estrategias ensayadas y los intervalos JSON exigidos; esto no demuestra imposibilidad matemática. La prueba A/B aislada ×1,35 completó 17/17 oleadas, 140 spawns (61/79), 92 bajas y 48 fugas, con 4 vidas a dt=0,1. Se conserva `proposal135.json` como evidencia histórica de la propuesta, no como QA del producto.

La validación final usa el producto autorizado, dt=0,05 y presupuesto real: 94 bajas, 46 fugas y 8 vidas. Orden de inversión: pads 5,3,7,6,8,0,4,1,2; Infantería en 6 y 8 y Francotirador en los restantes. Construir/mejorar únicamente cuando el saldo real lo permite. No se añaden recursos ni se fuerza daño o victoria.
