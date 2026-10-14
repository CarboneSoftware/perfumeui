// PerfumeUI · punto de entrada de la librería.
// Cada componente nuevo se exporta acá (pnpm new:component lo hace solo).
//
// Los estilos globales se importan aparte, una vez, en el layout del proyecto:
//   import '@servaltek/perfumeui/styles/perfumeui-tokens.scss';
//   import '@servaltek/perfumeui/styles/global.css';

export { default as AppNavbar } from './components/ui/AppNavbar.astro';
export { default as Button } from './components/ui/Button.astro';
export { default as CardScroller } from './components/ui/CardScroller.astro';
export { default as DropdownMenu } from './components/ui/DropdownMenu.astro';
export { default as HeroTextContent } from './components/ui/HeroTextContent.astro';
export { default as Section } from './components/ui/Section.astro';
export { default as SectionHeading } from './components/ui/SectionHeading.astro';
export { default as StaticHero } from './components/ui/StaticHero.astro';
export { default as TextLink } from './components/ui/TextLink.astro';
export { default as HeroCarousel } from './components/hero/HeroCarousel.astro';
export { default as HeroSlide } from './components/hero/HeroSlide.astro';
export type * from './components/types';
