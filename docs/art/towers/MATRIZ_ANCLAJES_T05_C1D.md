# SEMANTROPIC TD — Matriz T05 de proporciones y anclajes

Estado [PROPUESTA]; exactitud geométrica de la FUENTE SVG y datos; no medida fotográfica.

## Mundo y pad (leídos en M03 C1-C en modo solo lectura)

El M03 usa `M03_PAD_SOURCE.approxWorldWidth = 110.24` unidades; se preservan 8 sockets/133 nodos, los cuales **no son modificados por T05**. El lienzo T05 es 360×420 y su anchura real no es toda su envolvente. Fundación ilustrada estimada entre x31 y x327 (296px) sin equivaler al footprint ni collider de la torre.

## Comparación T04 → T05

| Familia/nivel | T04 escala | T05 escala propuesta | Alto lienzo wu | Ancho lienzo wu | Base visual wu | Pad visible aprox | Alto visual a 844×390* | Alto visual a 932×430* |

|---|---:|---:|---:|---:|---:|---:|---:|---:|

| infantry 1 | 0.296 | 0.298 | 125.16 | 107.28 | 88.21 | 20.0% | 63.6 px | 70.1 px |
| infantry 2 | 0.308 | 0.310 | 130.20 | 111.60 | 91.76 | 16.8% | 66.1 px | 72.9 px |
| sniper 1 | 0.312 | 0.310 | 130.20 | 111.60 | 91.76 | 16.8% | 66.1 px | 72.9 px |
| sniper 2 | 0.319 | 0.322 | 135.24 | 115.92 | 95.31 | 13.5% | 68.7 px | 75.7 px |

* Escalado estimado `Phaser.Scale.FIT`: factor min(anchoViewport/1280,altoViewport/768). No se obtuvo captura real ni se midió framebuffer de iPhone.

## Anclajes 360×420, coordenadas source-px

| Familia/nivel | footAnchor | foundation | shadowFoot | spawnExit | operatorSlot | muzzle |

|---|---|---|---|---|---|---|

| infantry 1 | (.5,.93) | (181,378) | (182,388) | (133,348) | (126,315) | (177,244) |

| infantry 2 | (.5,.93) | (181,378) | (182,388) | (133,348) | (128,315) | (160,177) |

| sniper 1 | (.5,.93) | (183,380) | (181,390) | — | (187,207) | (318,170) |

| sniper 2 | (.5,.93) | (183,380) | (181,390) | — | (187,207) | (319,170) |

## Capas y sorting candidato

Por cada torre A, SVG verdaderamente independientes `shadowFoot` → `backStructure` → **actor P04 (slot)** → `frontRail` → HUD/HP. El integrador decidirá el depth, el tamaño del actor, máscara y la separación necesaria; T05 no cambia el actor atlas. En el montaje compatible C1-C se puede continuar usando el SVG monolítico A `meta.url`, sin activar split layers hasta que el Integrador apruebe.

## Dos direcciones artísticas verdaderas

- **A recomendada:** Infantería cuartel bajo y funcional con armería lateral, techo a dos aguas volumétrico y entrada utilizable; Sniper estructura esbelta de vigía angular con plataforma abierta, escaleras y arma fijada.

- **B alternativa:** Infantería refugio/hangar semicurvo blindado con compuerta y contrafuertes técnicos, distribución distinta; Sniper observatorio semicubierto con cúpula/sombra barrida y base pétrea.

Las siluetas alternativas B no cambian las familias ni el gameplay. Son propuestas SVG editables, no aprobadas, y carecen por ahora de split frontal propio.

## Limitaciones: prueba de lectura real

Las escalas se han mantenido contenidas; cuatro ilustraciones nuevas y dos A/B no significan automáticamente legibilidad 64/90/130. La galería permite la comparación controlada. Capturas 1280×768, 844×390 y 932×430 quedan NOT_RUN. La zona segura de móviles y el operador final P04 aún deben revisarse por Integrador.
