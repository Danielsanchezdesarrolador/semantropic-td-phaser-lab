# T04/Q2 · MATRIZ DE ESCALAS Y ANCLAJES

Estado: [PROPUESTA]. No usar estas cifras como collision radius o aprobado core.

## Origen M02 verificado en código read-only

`platformTexture` construye disco de radio 103 px. `renderer-v2.mjs` instancia el disco con scale 0.58: diámetro 206×0.58=**119.48 world units**. T04 no modifica M02. Solicitud RFC de disco visual 103 world units, manteniendo 8 socket positions y 133 nodos de ruta.

## Escalas sobre lienzo SVG 360×420, base visible de 306px

| Variante | T03 | T04 | Ancho lienzo wu | Alto lienzo wu | Base wu | Disco 119 visible | Disco 103 visible | Altura aparente 844×390* |

|---|---:|---:|---:|---:|---:|---:|---:|---:|

| infantry 1 | 0.276 | 0.296 | 106.56 | 124.32 | 90.58 | 24.2% | 12.1% | 82.0px |
| infantry 2 | 0.296 | 0.308 | 110.88 | 129.36 | 94.25 | 21.1% | 8.5% | 85.3px |
| sniper 1 | 0.303 | 0.312 | 112.32 | 131.04 | 95.47 | 20.1% | 7.3% | 86.4px |
| sniper 2 | 0.317 | 0.319 | 114.84 | 133.98 | 97.61 | 18.3% | 5.2% | 88.3px |

* Equivalencia algebraica world→display: ×(844/1280). No es medición screenshot, retina scale ni clipping móvil. Porcentaje = 100×max(0,1−anchobase/anchopad); NO es área ni hitbox.

## Anclajes fuente (source-px, ancho360, alto420)

| Torre | foot normalizado | buildFoundationLocal | shadowFoot | spawnExit de P | operator slot de P | muzzle T |

|---|---|---|---|---|---|---|

| infantry 1 | (.5,.93) | (180,382) | (180,391) | (139,350) | (138,319) | (183,248) |

| infantry 2 | (.5,.93) | (180,382) | (180,391) | (145,355) | (144,328) | (183,209) |

| sniper 1 | (.5,.93) | (180,382) | (180,391) | — | (185,198) | (299,156) |

| sniper 2 | (.5,.93) | (180,382) | (180,391) | — | (189,198) | (307,149) |

## Contrato de proyección T03 preservado

`projectSourceAnchor(sprite,meta,key)` acepta posición, escala, rotación y flip del sprite (rotación sobre foot). No lee ni redefine `cx/cy`, no instala sockets, no invoca actores; el motor central decide dónde y cuándo ocurre una acción.

## Riesgos y criterios móviles

Edificios II tienen más piezas funcionales, no meramente escala. El arte de torre puede ocluir al operador P si se renderiza como única lámina; `renderSections` son metadatos para evaluar máscara, no capa real integrada. La plataforma M03 debe revisarse antes de agrandar indiscriminadamente las torres. Captura 1280×768 / 844×390 / 932×430 y ensayo del operador son **PENDING**.
