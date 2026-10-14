/**
 * Árbol del sidebar de PerfumeUI. `href` ausente = todavía sin página →
 * se renderiza como "Pronto", sin link.
 */
export interface NavItem {
  name: string;
  href?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const perfumeUINav: NavGroup[] = [
  {
    label: "Empezar",
    items: [{ name: "Introducción", href: "/" }],
  },
  {
    label: "Fundamentos",
    items: [{ name: "Tokens", href: "/tokens" }],
  },
  {
    label: "Primitivas",
    items: [
      { name: "Button", href: "/components/button" },
      { name: "TextLink", href: "/components/text-link" },
      { name: "Section", href: "/components/section" },
      { name: "SectionHeading", href: "/components/section-heading" },
      { name: "CardScroller", href: "/components/card-scroller" },
    ],
  },
  {
    label: "Navegación",
    items: [{ name: "AppNavbar", href: "/components/app-navbar" }],
  },
  {
    label: "Heroes",
    items: [
      { name: "HeroCarousel", href: "/components/hero-carousel" },
      { name: "HeroSlide", href: "/components/hero-slide" },
      { name: "StaticHero", href: "/components/static-hero" },
      { name: "HeroTextContent", href: "/components/hero-text-content" },
    ],
  },
];

/**
 * navItems del AppNavbar real para la sección /perfumeui. Solo los dos
 * destinos que ya existen — AppNavbar no tiene noción de tab "pronto" (eso
 * vive en el árbol del sidebar de arriba), así que Patrones/Recursos no
 * aparecen acá todavía.
 */
export const perfumeUINavItems = [
  { label: "Fundamentos", url: "/tokens" },
  { label: "Componentes", url: "/components/button" },
];
