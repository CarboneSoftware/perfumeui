// PerfumeUI · punto de entrada de la librería.
// Cada componente nuevo se exporta acá (pnpm new:component lo hace solo).
//
// Los estilos globales se importan aparte, una vez, en el layout del proyecto:
//   import '@servaltek/perfumeui/styles/perfumeui-tokens.scss';
//   import '@servaltek/perfumeui/styles/global.css';

export { default as PfNavbar } from './components/ui/PfNavbar.astro';
export { default as PfButton } from './components/ui/PfButton.astro';
export { default as PfCardScroller } from './components/ui/PfCardScroller.astro';
export { default as PfDropdownMenu } from './components/ui/PfDropdownMenu.astro';
export { default as PfHeroTextContent } from './components/ui/PfHeroTextContent.astro';
export { default as PfSection } from './components/ui/PfSection.astro';
export { default as PfSectionHeading } from './components/ui/PfSectionHeading.astro';
export { default as PfStaticHero } from './components/ui/PfStaticHero.astro';
export { default as PfTextLink } from './components/ui/PfTextLink.astro';
export { default as PfHeroCarousel } from './components/hero/PfHeroCarousel.astro';
export { default as PfHeroSlide } from './components/hero/PfHeroSlide.astro';
export type * from './components/types';
