# SEMANTROPIC TD — T2-C · INFORME DE ENTREGA PRELIMINAR

**Fecha:** 19-10-2026 · **Rama aislada:** `experimentos/t2c-revolucion-artistica`

## Estado documental

- [CONFIRMADO EN GITHUB] Archivos independientes `public/t2c/index.html`, `public/t2c/art.js`, `public/t2c/scene.js`.
- [CONFIRMADO EN CÓDIGO] El arte de ambiente, torres, enemigos y soldado se genera localmente como texturas mediante Canvas fuera de pantalla y se representa en Phaser 4 con WebGL2; no son sprites de terceros.
- [PRUEBA SINTÁCTICA] `art.js` y `scene.js` pasaron análisis de sintaxis de JavaScript en V8.
- [COMPILACIÓN] Sitio estático independiente en Render, compilación `npm install && npm run build`, runtime de Phaser 4.2.1 incluido.
- [NO VERIFICADO] Captura real del vertical slice funcionando en Chrome/Safari.
- [NO VERIFICADO] WebGL2 efectivo en dispositivo real, animación completa, legibilidad y estabilidad móvil.
- [NO EJECUTADO] Comparación visual lado a lado capturada con navegador y aprobación artística humana.

## Nuevos elementos en T2-C

1. **Mapa:** base M01 original como referencia, superposición de vegetación, rocas, ruinas, luminarias arcanas, reflejos y ambientación dinámica, sin alterar la campaña.
2. **Torres:** cuatro familias: Infantería con estandartes, Francotiradores con operador, Guardiana con cristal arcano y Bombardera con cañón pesado. Se conservan las cinco familias oficiales en el juego original; esta demo muestra cuatro.
3. **Enemigos:** explorador, pesado blindado y vidente arcano. Texturas vectoriales originales y cuatro poses cíclicas para cada clase.
4. **Soldado de Infantería:** cuatro poses visuales, vida, bloqueo y ataque simulado en el punto de cruce.
5. **VFX:** trazadoras, orbes, impacto de hielo, explosión, destellos, auras, ondas expansivas, vegetación y partículas de ambientación.
6. **Interacción:** iniciar oleada, pausa, velocidad x2, inspección táctil de torres y reiniciar.
7. **Variantes:** Táctico (FX reducidos), Equilibrio y Épico (FX realzados).
8. **HUD:** núcleo, oro de ensayo, número de oleada y panel de inspección.

**Limitación de alcance:** el combate de cinco oleadas es un ensayo visual autocontenido, no utiliza IA, economía, daño ni sistema de jefes de la Campaña V5. No se incorpora Torre de Control funcional ni las 140 oleadas al slice.

## Comparación T1 / T2-C (de código, no dictamen de aspecto)

| Aspecto | Laboratorio T1 | Laboratorio T2-C |
|---|---|---|
| Objetivo | Benchmarks y fidelidad técnica | Arte, presentación, VFX y legibilidad |
| Enemigos | 3 sprites originales prerenderizados | 3 familias de ensayo con 4 poses cada una |
| Torres | Imagen/textura de cinco familias | 4 rediseños arquitectónicos de demostración |
| Combate | Trayectorias sintéticas | Ataques, daño, bloqueo, fugas, victoria/derrota de ensayo |
| FX | Partículas sintéticas de laboratorio | Orbes, estelas, destellos, explosiones y estados elementales |
| UI | Panel técnico de rendimiento | HUD de videojuego con inspección y estilos artísticos |

## QA humano pendiente

- [ ] Confirmar en panel `Motor: Phaser 4.2.1` y `Backend: WebGL 2.0` o su cadena de navegador, **no inferir desde configuración**.
- [ ] Comprobar que mapa y cuatro torres se ven al abrir y que se inicia automáticamente la primera oleada.
- [ ] Confirmar tres tipos enemigos, cambios de frame y soldado bloqueando.
- [ ] Confirmar proyectiles de Francotirador, orbes de Guardiana y explosiones de Bombardera.
- [ ] Confirmar todas las opciones Táctico/Equilibrio/Épico, pausa, x2 y selección táctil.
- [ ] Ejecutar al menos dos oleadas sin bloqueo y verificar el HUD.
- [ ] Capturar PC y Android/iPhone landscape cuando sea posible.
- [ ] Comparar capturas reales con T1/PixiJS y decidir si la mejora artística es suficiente.
- [ ] Revisar errores de consola y probar recarga/retorno de segundo plano.

**Regla final:** ni el despliegue LIVE ni la revisión de sintaxis equivalen a QA visual, certificación WebGL2 física o aprobación artística. La Campaña V5 no ha sido modificada.
