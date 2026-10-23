# R7 HF3 — Camino despejado y pulido de M01

El Director autorizó corregir las decoraciones superpuestas en el camino y pulir el mapa a partir de su captura real `51052.jpg`. Base y rollback por commit compensatorio: `1b04ef9a76a946ee2028a87a92c4136daf9aae8a`.

## Resultado

- Se retiran el arco de entrada y el puente de salida que se dibujaban sobre la calzada. El arco en ruinas de la pradera permanece fuera de ella.
- La carretera se pinta después de la escenografía para mantener libre su superficie. La ruta sigue tomando los mismos 133 puntos canónicos, sin cambios a sus coordenadas ni a su ancho.
- Árboles con luz y sombra gradual, rocas con volumen y estratos, superficie del camino con menor contraste entre franjas. Pintado estático, sin añadir trabajo por fotograma, nuevas texturas ni dependencias.
- El santuario se baja dentro del escenario para mostrar completo el cristal. El panorama lateral continúa usando exclusivamente terreno, sin duplicar monumentos ni pads.
- Se actualiza la clave de caché del HTML a `dawn-plateau-hf3` y la importación del pintor a `layout=hf3`.

## Protección

Sin cambios a M02 R6, M07 histórico, escenas de combate, geometría de mapas, pads, oleadas, economía, torres, personajes, FIT ni controles fullscreen. Los ocho puntos de construcción siguen usando la máquina de estados existente. El cambio no habilita torres ni mapas nuevos.

## Verificación

Compilación y los 70 controles Node/sintaxis del flujo de producción aprobados, incluidos los contratos R7/R6. Combate Node M01 y siete oleadas/80 enemigos M02 aprobados; la simulación M02 utiliza daño acelerado de QA y no acredita balance humano.

El runner R7 incorpora una regresión de píxeles: compara tres líneas de muestreo a lo largo de toda la ruta con el fondo de terreno libre de monumentos y comprueba las posiciones del antiguo arco y puente en la textura real. Conserva controles de construcción, WebGL2, ocho pads, textura 2×, selector M02 y tres resoluciones.

Chromium R7 PASS en 1280×768, 844×390 y 932×430: 1.217 muestras de calzada por perfil y construcción/selector preservados. Regresión Chromium B3 de M01 PASS: tres resoluciones, contacto de tropas, victoria de cinco oleadas/63 enemigos y derrota. La primera tanda de cargas de navegador agotó tiempos bajo cuatro procesos Chromium por software; B3 pasó al reducir concurrencia. Responsive y campaña M02 se verifican también en el flujo CI posterior al push; consultar el run del SHA publicado antes de atribuirle PASS. Aprobación artística y FPS en Android físico pendientes del Director. Una captura Chromium no acredita hardware móvil.
