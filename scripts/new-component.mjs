#!/usr/bin/env node
// Crea un componente nuevo de PerfumeUI y su página de docs, y lo publica en el sidebar.
//
//   pnpm new:component Badge
//   pnpm new:component PromoBanner --group Secciones
//
// Todos los componentes llevan el prefijo `Pf` (PfBadge, PfPromoBanner); se lo
// agrega el script, así que se pasa el nombre sin prefijo. El slug de la página no lo lleva.
//
// Hace cuatro cosas:
//   1. packages/perfumeui/src/components/ui/Pf<Name>.astro  (esqueleto del componente)
//   2. packages/perfumeui/src/index.ts                    (agrega el export)
//   3. apps/docs/src/pages/components/<slug>.astro        (página con el molde de TextLink)
//   4. apps/docs/src/data/perfumeui-nav.ts                (agrega el ítem al sidebar)

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const lib = join(root, 'packages/perfumeui/src');
const docs = join(root, 'apps/docs/src');

const args = process.argv.slice(2);
const baseName = args.find((a) => !a.startsWith('--'))?.replace(/^Pf(?=[A-Z])/, '');
const groupFlag = args.indexOf('--group');
const group = (groupFlag >= 0 ? args[groupFlag + 1] : undefined) ?? 'Primitivas';

if (!baseName || !/^[A-Z][A-Za-z0-9]*$/.test(baseName)) {
  console.error('Uso: pnpm new:component <NombreEnPascalCase> [--group <Grupo del sidebar>]');
  process.exit(1);
}

const name = `Pf${baseName}`;
const slug = baseName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const href = `/components/${slug}`;
const componentPath = join(lib, 'components/ui', `${name}.astro`);
const pagePath = join(docs, 'pages/components', `${slug}.astro`);
const indexPath = join(lib, 'index.ts');
const navPath = join(docs, 'data/perfumeui-nav.ts');

const index = readFileSync(indexPath, 'utf8');
let nav = readFileSync(navPath, 'utf8');

for (const p of [componentPath, pagePath]) {
  if (existsSync(p)) {
    console.error(`Ya existe: ${p}`);
    process.exit(1);
  }
}
if (index.includes(`default as ${name} }`) || nav.includes(`name: "${baseName}"`)) {
  console.error(`${name} ya está exportado en index.ts o listado en perfumeui-nav.ts.`);
  process.exit(1);
}

// ── 4 · sidebar ────────────────────────────────────────────────────────────
const item = `{ name: "${baseName}", href: "${href}" }`;
const groupStart = nav.indexOf(`label: "${group}",`);
if (groupStart >= 0) {
  // Agrega el ítem al final del array `items` de ese grupo.
  const close = nav.indexOf(']', nav.indexOf('items: [', groupStart));
  const before = nav.slice(0, close).trimEnd();
  const isMultiline = nav.slice(nav.indexOf('items: [', groupStart), close).includes('\n');
  nav = isMultiline
    ? `${before}${before.endsWith(',') ? '' : ','}\n      ${item},\n    ${nav.slice(close)}`
    : `${before}, ${item}${nav.slice(close)}`;
} else {
  // Grupo nuevo, al final del árbol.
  const end = nav.indexOf('];', nav.indexOf('perfumeUINav'));
  nav = `${nav.slice(0, end)}  {\n    label: "${group}",\n    items: [${item}],\n  },\n${nav.slice(end)}`;
}
writeFileSync(navPath, nav);

// ── 1 · componente ─────────────────────────────────────────────────────────
writeFileSync(
  componentPath,
  `---
/**
 * ${name} · TODO: una línea sobre para qué existe.
 * Regla dura: ningún hex. Todo sale de los tokens (var(--*)).
 */
interface Props {
  class?: string;
}

const { class: className } = Astro.props;
---

<div class:list={["${slug}", className]}>
  <slot />
</div>

<style>
  .${slug} {
    color: var(--ink);
  }
</style>
`,
);

// ── 2 · index.ts ───────────────────────────────────────────────────────────
const exportLine = `export { default as ${name} } from './components/ui/${name}.astro';`;
const lastExport = [...index.matchAll(/^export \{ default as .*$/gm)].at(-1);
const at = lastExport ? lastExport.index + lastExport[0].length : index.length;
writeFileSync(indexPath, `${index.slice(0, at)}\n${exportLine}${index.slice(at)}`);

// ── 3 · página de docs ─────────────────────────────────────────────────────
writeFileSync(
  pagePath,
  `---
import PerfumeUILayout from "@/layouts/PerfumeUILayout.astro";
import DocsHeader from "@/components/docs/DocsHeader.astro";
import PropsTable from "@/components/docs/PropsTable.astro";
import ${name} from "@servaltek/perfumeui/components/ui/${name}.astro";

const props = [
  {
    name: "class",
    type: "string",
    default: "—",
    body: "Clase extra, para posicionarlo desde el padre.",
  },
];
---

<PerfumeUILayout title="${name}" description="TODO: una línea para buscadores.">
  <DocsHeader
    family="${group}"
    name="${name}"
    lead="TODO: la bajada. Qué resuelve y la regla que no se rompe."
  />

  <section class="pui-block">
    <h2 class="pui-block__title">Ejemplos</h2>
    <p class="pui-block__body">TODO: qué muestran estos ejemplos.</p>

    <div class="pui-grid">
      <div class="pui-preview">
        <div class="pui-preview__stage pui-preview__stage--light">
          <${name}>${name}</${name}>
        </div>
        <div class="pui-preview__foot">
          <span class="pui-mono">default</span>
          <p class="pui-preview__caption">TODO: cuándo se usa.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="pui-block">
    <h2 class="pui-block__title">Props</h2>
    <PropsTable rows={props} />
  </section>
</PerfumeUILayout>
`,
);

console.log(`✓ ${name} creado (grupo: ${group})
  componente  packages/perfumeui/src/components/ui/${name}.astro
  export      packages/perfumeui/src/index.ts
  página      apps/docs/src/pages/components/${slug}.astro  →  ${href}
  sidebar     apps/docs/src/data/perfumeui-nav.ts`);
