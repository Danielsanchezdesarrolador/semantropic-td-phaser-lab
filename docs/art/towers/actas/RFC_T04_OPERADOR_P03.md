# RFC T04 → Equipo P03 / Integrador · Operadores y profundidad

Estado [PROPUESTA], no autorizado a editar assets P ni escena C1-B.

En C1-B PR #8 (solo lectura) el actor P se coloca a partir de `projectSourceAnchor(tower.sprite,meta,...)`. T04 propone el **pie** del operador Sniper I=(185,198)px y Sniper II=(189,198)px sobre la plataforma superior abierta, en lugar de T03 (190,155)/(191,146).

El **muzzle** T04 está en Sniper I=(299,156), II=(307,149)px; Core/Integrador debe comprobar visualmente mano/arma, facing y realismo de trayectoria; NO significa doble disparo. Las siluetas reales del operador y el recluta vienen de P03.

Salida recluta: Infantry I=(139,350)px, II=(145,355)px. Señal visual de despliegue no crea instancia core. La eventual barandilla frente al actor requiere split/occlusión aprobada por Integrador; T04 proporciona `renderSections` solo como propuesta.

Prueba requerida: cuatro torres/operadores dentro de M01, misma cámara, z-order por pie, HP/escudo más alto que VFX; capturas reales 844×390.
