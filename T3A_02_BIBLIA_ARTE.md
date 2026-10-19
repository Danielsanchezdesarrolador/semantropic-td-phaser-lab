# SEMANTROPIC TD — Biblia artística T3-A (propuesta editable)

**Estado:** PROPUESTA PARA ELECCIÓN; no es estándar de producción aprobado.  
**Arte original:** fantasía tecnológica-arcana 2D/3/4. Inspirarse en claridad y calidad de referentes Tower Defense, nunca copiar siluetas, escenas, personajes ni UI de terceros.

## 1. ADN de diseño
- **Facción defensora:** geometría ascendente, piedra labrada de bordes redondeados, metal grabado con remaches discretos, textiles gruesos y cristales arcanos. La silueta de cada torre debe ser reconocible sin detalles internos.
- **Facción invasora:** masas asimétricas orgánicas, armadura parcheada, escudos ovalados/grandes, bastones y prismas inestables; cada arquetipo modifica anatomía y pose, no solo color.
- **Terreno:** ilustración artesanal con grupos variados de vegetación, raíces, piedras de dos familias, tierra cálida y luces suaves. Decoración no debe camuflar ruta ni plataformas.

## 2. Tratamientos comparables (mismo encuadre y estado)

### A — Fantasía Arcana Ilustrada
Materiales volumétricos con borde pintado suave (no contorno negro), luz cálida lateral, sombras azul petróleo, piedra arenisca arcana, metal dorado mate, cristal turquesa contenido. Vegetación oliva rica en forma, suelo de verdes cálidos. Personajes con rostros marcados y volumen pictórico, color más contenido. Favorece atmósfera y magia elegante.

### B — Fantasía Táctica Cartoon Premium
Siluetas y expresiones rotundas, contorno cálido medio, sombras en bloques con degradado suave, iluminación focal, piezas arquitectónicas más exageradas, verdes vivos matizados, adversarios con lectura cromática fuerte. Ataques y barras HP más inmediatos. Favorece legibilidad en teléfono.

**Hipótesis recomendada:** usar **B como base de lectura móvil** y absorber de **A la riqueza de materiales y ambiente**, solo si el director aprueba una síntesis C. No producir tres demos completas.

## 3. Paletas de referencia (no canon hasta aprobación)

| Función | A | B |
|---|---|---|
| Cielo/luz | #F7DDA4 | #FFF0BA |
| Suelo en luz | #8FAD74 | #8AC16D |
| Suelo sombra | #496958 | #3D7869 |
| Ruta | #BCA17B | #C4A47A |
| Piedra | #99A6A1 | #889AA6 |
| Metal | #5E7386 | #55687A |
| Dorado/ornamento | #D9BA79 | #E8C06B |
| Infantería | #65A9AC | #58AEBB |
| Francotiradores | #728D58 | #76A852 |
| Guardiana | #58C5CA | #61D5DE |
| Bombardera | #CC875E | #E38A52 |
| Hostiles básicos | #70986B | #6EAE61 |
| Hostiles armadura | #8C8C80 | #8893A2 |
| Hostiles especiales | #9479B0 | #9B72CF |
| Vida enemigo | #D76D64 | #DF6763 |
| Escudo | #D5E2E8 | #D8E5F4 |

## 4. Proporciones y perspectiva

Mundo de referencia: 1280 × 768 como coordenadas lógicas de ensayo, **no tamaño ni relación obligatoria de viewport móvil**. Ilustración isométrica suave 3/4 sin fuga oblicua exagerada. Plataformas elípticas, caras laterales visibles y sombras direccionales cortas.

Tamaños previstos a validar en el **viewport real de teléfono horizontal**:
- Camino suficiente para leer dos unidades contiguas y su rango de intercepción.
- Torres de 1,6–2,1 veces la altura aparente de un soldado, con ocupación visual transparente según arquitectura.
- Básicos: referencia 1 unidad; pesados: 1,2–1,4; especiales: 1–1,2 pero con equipo identificable.
- Pivote personaje: centro inferior entre pies, z-sort por coordenada de contacto al suelo.
- Barra de vida separada de casco/cuerno por mínimo 5–9 px **visuales** en resolución final.

## 5. Silueta, materiales, contornos

- Silueta antes de detalle: reconocible a tamaño 60–90 px en render de referencia.
- Contornos: A de 1–2 px en imagen fuente más borde pintado; B de 2–4 px en sprite maestro, modulados según escala física y densidad.
- Luz desde arriba/izquierda, sombra de contacto oval corta debajo de cada objeto; AO integrada en base de torres.
- Piedra: caras talladas y 2–3 grietas significativas, no ruido aleatorio.
- Metal: tres planos (luz/medio/sombra), remaches limitados, borde cálido.
- Madera: veta por segmento estructural, sin líneas finas repetitivas.
- Tela: pliegues grandes y oscilación sutil, insignias SEMANTROPIC originales.
- Cristal: facetas con centro translúcido y halo controlado en acción.
- Personajes: cara, casco, hombros, puños, rodillas, calzado y arma diferenciables.

## 6. Torres: identidad individual

| Familia | Silueta | Foco animado | Señal ataque |
|---|---|---|---|
| Infantería | Puerta/arco fortificado y dos estandartes | guardia de puerta, viento | soldado interpone escudo y ataca |
| Francotiradores | estructura esbelta con cabina visible | operario gira con arma | flash corto + trazo fino |
| Guardiana | pináculos simétricos + núcleo flotante | cristal late, runa mínima | anticipación, orbe, respuesta de blanco |
| Bombardera | caja pesada / cañón inclinado + contrapeso | retroceso, anillo mecánico | proyectil arqueado + onda breve |
| Control (fuera del slice) | diseño singular de comunicaciones | despliegue manual | nunca automatizar operación del jugador |

## 7. Arquetipos de enemigos para primeros masters

- **Orco de avanzada:** ágil, arma corta, expresiones impacientes; brazo adelantado y caminata rápida.
- **Orco acorazado:** hombros grandes, escudo que no tapa la cara permanentemente, paso pesado con anticipación visible.
- **Portador arcano:** silueta vertical, bastón/prisma, capucha original, postura lateral; efecto de apoyo solo si lo habilita la lógica demo.

Cada personaje necesita anotaciones de frente/perfil/espalda o reconocer la dirección real que está ausente. No bastan recolores del mismo cuerpo.

## 8. Gramática de animación

Ciclo mínimo por actor: idle, caminar (pierna/contrabrazo alternos), anticipación, ataque, recuperación, impacto sin violencia gráfica, retirada. Timings iniciales de **arte**: 0,1–0,16 s por frame en marcha rápida; pesado 0,14–0,22; anticipación 100–200 ms y recuperación 120–250 ms, **sin alterar cadencias oficiales**. Sincronizar frame de contacto con evento de combate, no a ojo.

## 9. VFX — cuatro beats
1. **Anticipación:** señal discreta (arma/cuerpo, cristal, cañón) sin ocultar el blanco.
2. **Emisión:** flash/trazo/orbe desde punto de origen correcto.
3. **Impacto:** chispa o pulso con forma y escala coherente con radio visual.
4. **Residuo:** desvanecimiento breve; sin nube opaca que tape carretera.

Idioma elemental: calor naranja asimétrico, hielo azul facetado, ácido verde de gotas pequeñas, escudo plata hexagonal, curación verde azulado ascendente; no inventar buffs/debuffs.

## 10. Interfaz móvil

- Landscape ocupa **la pantalla disponible** (respetando `env(safe-area-inset-*)` y barras del sistema).
- Campo de batalla ocupa zona predominante; prohibido panel derecho permanente.
- Vidas/oro/ola compactos arriba; pausa/x1/x2 e iniciar ola en una franja táctil corta.
- Tocar torre: panel radial/abanico o tarjeta contextual ligera adyacente **sin esconder ruta**; cierre inequívoco y toque fuera sin cierre accidental durante una acción.
- Acciones táctiles meta ≥44–48 px CSS cuando el viewport lo permita.
- Descripción larga: overlay de inspección opcional y pausado, no ficha perenne.
- Cambios de pantalla conservan selección y no duplican compras/acciones.
- Pantalla vertical: aviso de girar + pausa segura.
- Dos layouts obligatorios a validar: juego sin selección; torre seleccionada, ambos paisaje horizontal.

## 11. Requisitos de resolución y reutilización futura

Masters independientes de Phaser. Orientación inicial de producción sugerida (POR VALIDAR tras concept approval):
- torre: PNG alfa de 512–1024 px altura fuente según complejidad;
- personaje: master 512px de altura, atlas por dirección/acción y documentación de pivotes;
- escenario: capas 2560×1536 de ilustración a exportar de forma optimizada, no una captura reescalada;
- PNG con canal alfa y exportación WebP opcional, fuente en formatos editables cuando exista.

Convención de nombres:
`td3_<faccion>_<arquetipo>_<accion>_<direccion>_<frame>_<w>x<h>.png`.
Acompañar cada atlas con JSON de frame/pivot/escala/z y manifiesto de procedencia. Nunca describir una mini textura procedural ampliada como «nuevo arte premium».

## 12. Criticidad y fases siguientes

**T3-A [EN PROCESO]:** concepto A/B, aprobar uno antes de producción.  
**T3-B [PENDIENTE]:** nuevos masters y animaciones fuente.  
**T3-C [PENDIENTE]:** HUD y navegación táctil.  
**T3-D [PENDIENTE]:** validación y captures verdaderas.

La aprobación artística la da únicamente el director. T2-C, T1, Canvas V5 y PixiJS se mantienen intactos.