# ASSET_MANIFEST_SCHEMA — v1
**Responsables de registro:** M, T y P para recursos bajo su propiedad; **validación de la tabla global:** Integrador.
**Estado:** especificación de manifiesto, pendiente de validador de runtime y QA.

## Objetivo
Assets reutilizables, licencia/originalidad trazable, escalado predecible, no colisiones de claves Phaser, atlas portables a futura tecnología SI algún día se autoriza. No justifica migrar a Unity hoy.

## Ejemplo de manifiesto propuesto
```json
{
  "manifestVersion":"semantropic-assets-v1",
  "assetId":"enemy-warrior-walk-v1",
  "owner":"P",
  "category":"actor",
  "canonicalId":"warrior",
  "variant":"walk-east",
  "files":[{"path":"public/assets/actors/enemies/warrior/walk-east.png","type":"image/png","sha256":"RECALCULAR_AL_EXPORTAR"}],
  "frame":{"widthPx":512,"heightPx":512,"count":8,"layout":"horizontal"},
  "anchors":{"foot":{"x":0.5,"y":0.92},"effect":null},
  "scale":{"worldHeight":"POR_APROBAR_EN_M01","sourcePixelsPerWorldUnit":"POR_FIJAR"},
  "source":{"origin":"creación original Semantropic TD","author":"Equipo P","license":"PROPIA_VERIFICAR","sourceFile":"registrar archivo editable"},
  "status":"experimental"
}
```
Dimensiones de frames, atlas y escala son ejemplos, no requisitos universales: cada familia se ajusta al estándar aprobado de M01 y puede tener recortes/packing distinto si metadata lo describe.

## Claves inmutables
- `assetId` único global, separador de namespaces: `maps/m01/...`, `towers/infantry/...`, `actors/enemies/warrior/...`, `vfx/towers/bomber/...`.
- `owner` es M/T/P, `category` identifica consumo; no nombre de archivo ambiguo `sprite.png` en rutas globales.
- Estado: `concept`, `prototype`, `approved`, `retired`; no declarar approved por estar en repo.
- Formatos preferidos para VFX/actores: PNG transparentes, atlas + JSON de frames cuando convenga; fondos pueden usar texturas sin alpha. Todo con fuente editable/documentada cuando exista.
- `sha256` real por archivo al registrar el arte final, evitar placeholders en manifiesto aprobado.
- Recursos de ejemplo T3B/T1 NO pasan a catálogos oficiales sin revisión de Dirección.

## Pipeline
Brief visual→arte fuente→exportación→atlas/frames→manifest→vitrina aislada→captura real→aprobación→PR→integración del adaptador→QA.
- Conservar relación diseño fuente / export para corregir material o VFX.
- No hotlink externo en producción ni dependencia tácita de un CDN.
- Declarar peso, resolución y dimensiones para permitir downscaling móvil futuro sin cambios visuales de gameplay.
- No usar imagen generativa o externa sin registrar origen, derechos y permiso de uso comercial.

## Prohibiciones
No reutilizar material protegido de Kingdom Rush u otra IP; usar sus principios de legibilidad y riqueza, no assets o composiciones exactas. No publicar fuentes originales sin aprobación de la Dirección.

## QA
- Cada key resuelve archivo real, sin 404 ni nombre duplicado.
- Pivotes de torres y actores coherentes en un socket de M01.
- Alpha correcto, ausencia de halo sucio y compresión sin artefactos notables a tamaño móvil.
- Manifiestos de equipos se combinan sin colisiones antes del merge; Integrador controla diccionario global.
