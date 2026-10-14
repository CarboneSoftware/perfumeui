// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Sitio 100% estático. Las rutas son archivos reales en src/pages/.
  output: 'static',
  // BaseLayout arma canonical y og:url absolutas con Astro.site.
  site: 'https://perfume.servaltek.com',
});
