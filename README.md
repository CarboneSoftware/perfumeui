# PerfumeUI

El sistema de diseño de Servaltek, en componentes Astro, más su sitio de documentación.

Los componentes, los tokens y el diseño de la documentación vienen de la sección `/perfumeui`
de la landing de Servaltek (`F:\servaltek\landing\servaltek`), que era la versión al día.

```
perfumeui/
├── packages/perfumeui/              @servaltek/perfumeui · la librería
│   └── src/
│       ├── components/ui/           PfNavbar, PfButton, PfCardScroller, PfDropdownMenu, PfHeroTextContent,
│       │                            PfSection, PfSectionHeading, PfStaticHero, PfTextLink
│       ├── components/hero/         PfHeroCarousel, PfHeroSlide
│       ├── components/types.ts      contratos compartidos (CtaLink, Surface, Tone, HeadingSize…)
│       ├── styles/perfumeui-tokens.scss  tokens canónicos (color, tipo, forma, espacio, claro/oscuro)
│       ├── styles/global.css        reset + .icon-btn + .container (los usan los componentes)
│       ├── styles/hero-scene.css    primitivas de escena de HeroSlide
│       ├── lib/auth.ts              SSO de Servaltek (oidc-client-ts) que usa PfNavbar
│       └── index.ts                 exports
├── apps/docs/                       perfumeui-docs · el sitio de documentación (Astro)
│   └── src/
│       ├── layouts/                 BaseLayout (head/meta) + PerfumeUILayout (navbar, sidebar, footer)
│       ├── components/docs/         DocsHeader, DocsSidebar, DocsFooter, PropsTable, DemoScene
│       ├── styles/perfumeui-docs.css  clases pui-* de las páginas
│       ├── data/perfumeui-nav.ts    árbol del sidebar + tabs del navbar
│       └── pages/                   /, /tokens, /components/<slug>, /demo/navbar, /callback, /silent-renew
└── scripts/new-component.mjs        scaffolder
```

## Comandos

Requiere Node 22.12+ y pnpm 11.

```bash
pnpm install
```

```bash
pnpm dev
```

| Comando | Qué hace |
|---|---|
| `pnpm dev` | Levanta el sitio de docs en `http://localhost:4321` |
| `pnpm build` | Build estático en `apps/docs/dist/` |
| `pnpm preview` | Sirve el build |
| `pnpm check` | Type-check de todos los `.astro` y `.ts` |
| `pnpm new:component <Nombre>` | Crea un componente nuevo y su página de docs |

## Cargar un componente nuevo

```bash
pnpm new:component Badge
```

```bash
pnpm new:component PromoBanner --group Secciones
```

En un paso:

1. crea `packages/perfumeui/src/components/ui/<Nombre>.astro` (esqueleto),
2. lo exporta desde `packages/perfumeui/src/index.ts`,
3. crea `apps/docs/src/pages/components/<slug>.astro` con `DocsHeader`, un bloque de ejemplo y `PropsTable`,
4. lo agrega al grupo del sidebar en `apps/docs/src/data/perfumeui-nav.ts` (si el grupo no existe, lo crea; por defecto, `Primitivas`).

Después: escribí el componente y completá los `TODO` de la página. Para la estructura de una página
completa (adornos, tono, tamaños, props, Hacé / No hagas) mirá `pages/components/text-link.astro`.

## Reglas del sistema

- **Ningún hex en un componente.** Todo sale de `var(--*)` de `perfumeui-tokens.scss`. Excepciones: las variantes `glass` y `light` del botón y los tokens "on dark", que viven sobre fotos o bandas siempre oscuras.
- Tema: `data-wtl-theme` en `<html>` (o en un subárbol), guardado en `localStorage['wtl-theme']`. El switch vive en el `PfNavbar` (`themeToggle`).
- Copy en español rioplatense.

## Usar la librería desde otro proyecto Astro

```astro
---
import '@servaltek/perfumeui/styles/perfumeui-tokens.scss';
import '@servaltek/perfumeui/styles/global.css';
import { PfButton } from '@servaltek/perfumeui';
---

<PfButton href="/cotizar">Cotizar</PfButton>
```

El paquete publica los `.astro` fuente (no hay paso de build): el proyecto que lo consume los compila y necesita `sass`.
Los componentes esperan los assets de marca en `/res/` y `/pics/` del `public/` del consumidor.

## Deploy

Los docs se publican en Coolify detrás de oauth2-proxy, y sólo entran cuentas de Keycloak con el
rol de realm `developer`. Pasos y configuración en [`deploy/README.md`](deploy/README.md).
