# CLAUDE.md

Monorepo pnpm de PerfumeUI, el sistema de diseño de Servaltek. Ver `README.md` para estructura y comandos.

- `packages/perfumeui` (`@servaltek/perfumeui`): librería de componentes Astro. Publica fuente `.astro`, sin build. Tokens canónicos en `src/styles/perfumeui-tokens.scss`. Las páginas importan por subpath (`@servaltek/perfumeui/components/ui/PfButton.astro`) o desde el índice (`import { PfButton } from '@servaltek/perfumeui'`).
- `apps/docs` (`perfumeui-docs`): sitio de docs, Astro estático. Alias `@/*` → `apps/docs/src/*`. Las clases de página son globales con prefijo `pui-` (`src/styles/perfumeui-docs.css`).
- Origen: la sección `/perfumeui` de `F:\servaltek\landing\servaltek` (Astro 6). Ahí siguen viviendo las versiones de producción de los componentes; si cambian allá, se copian acá. `../perfumeui-docs` (Next.js) está abandonado y es sólo referencia.

## Convenciones

- Componente nuevo: `pnpm new:component <Nombre> [--group <Grupo>]`. Página modelo: `apps/docs/src/pages/components/text-link.astro`.
- Sin hex en componentes: todo `var(--*)`.
- Sin React ni islas de framework: la interacción va con `<script>` de Astro.
- La sidebar va pegada al borde izquierdo (layout de ancho completo); el contenido se centra en el resto.
- `PfNavbar` hace un chequeo silencioso de SSO contra `auth.servaltek.com`; fuera de ese dominio el iframe se bloquea por CSP y en la consola aparece un error. Es esperado.
- Copy en español rioplatense (voseo).
- Antes de cerrar un cambio: `pnpm check` y `pnpm build`.
