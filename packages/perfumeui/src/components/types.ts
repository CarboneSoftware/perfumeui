/**
 * Contratos compartidos por todos los componentes.
 *
 * Un solo lugar donde vive la forma de un CTA, de una imagen responsive o de
 * un fondo de sección. Si un componente necesita una de estas ideas, importa
 * el tipo de acá en vez de redeclararlo.
 */

/** Link de acción. Mismo shape en heroes, cards, banners y secciones. */
export interface CtaLink {
  label: string;
  href: string;
}

/** Fuente de `<picture>`. `media` opcional para el source por defecto. */
export interface ImageSource {
  srcset: string;
  media?: string;
}

/**
 * Logo que reemplaza al badge de un hero. `src` es la versión para superficies
 * claras; `srcOnDark`, si está, se usa cuando el texto va sobre fondo oscuro.
 */
export interface HeroLogo {
  src: string;
  srcOnDark?: string;
  alt: string;
  /** Alto con que se muestra. Cualquier largo CSS; `40px` por defecto. */
  height?: string;
}

/** Par valor + etiqueta (barra de datos del PageHeader). */
export interface Stat {
  value: string;
  label: string;
}

/** Ítem de una lista numerada o de una grilla de features. */
export interface Step {
  title: string;
  body: string;
}

/** Imagen de una grilla/mosaico. */
export interface GalleryImage {
  src: string;
  alt?: string;
  colSpan?: 1 | 2;
  rowSpan?: 1 | 2;
  /** A dónde lleva esta celda. Si falta, usa el `link` de la sección. */
  href?: string;
}

/**
 * Fondos estándar de sección, del más claro al más oscuro.
 * `none` no pinta nada (hereda del body).
 */
export type Surface = "white" | "subtle" | "muted" | "alt" | "dark" | "none";

/** `light` = tinta oscura sobre fondo claro. `dark` = tinta clara sobre oscuro. */
export type Tone = "light" | "dark";

/** Escala tipográfica de los títulos de sección. */
export type HeadingSize = "sm" | "md" | "lg" | "xl";

/** Alineación horizontal del contenido de un bloque de texto. */
export type Align = "start" | "center";
