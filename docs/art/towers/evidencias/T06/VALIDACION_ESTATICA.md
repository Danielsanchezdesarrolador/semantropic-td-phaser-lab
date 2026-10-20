# T06 — REGISTRO DE EVIDENCIA REALMENTE DISPONIBLE

**[CONFIRMADO EN GITHUB]** Fuentes T06 de Francotiradores I/II, layers shadow/back/front, snapshots T05, catálogo de anclajes, `sniper-vfx.mjs`, galería Phaser aislada; sin archivos M/P/core.

**[EJECUTADO SOBRE CONTENIDO]** XML balanceado de 8 SVG, firma 360×420, parse de módulos JavaScript. La primera validación detectó `fireEffectOriginLocal` erróneamente requerido para Infantería: se corrigió en commit específico y después validó las cuatro variantes.

**[JS/V8 CON PHASER MOCK]** evento incompleto rechazado, windup/fire únicos aceptados, duplicate eventId rechazado, VFX estilos A/B, desaparición de objetivo cancela su job, timers/tweens y objetos destruidos tras clear, scene.shutdown desuscribe listeners, ningún evento aceptado tras destroy. SIN ejecución real de navegador.

**[NO EJECUTADO]** Node qa-t01/qa-t03/qa-t04/qa-t05/qa-t06 sobre checkout; npm build; Chromium WebGL2 T06; capturas reales 1280×768, 844×390, 932×430; iPhone/Android y FPS. `screenshotIndex=[]`.

**[BLOQUEANTE DE ENTORNO]** Chromium y Node existen en el contenedor, pero `git ls-remote` de github.com falla DNS. Por tanto no fue posible clonar T06 ni cargar sus SVG en una sesión real Phaser; ninguna imagen conceptual se marcó como prueba de runtime.

**[PENDIENTE INTEGRADOR]** compatibilidad final del CombatEventBridge candidato, operador P04 y arte sobre M04, aprobación por Dirección.
