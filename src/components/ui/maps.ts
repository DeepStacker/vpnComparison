/**
 * Static class-name lookup maps for UI primitives.
 *
 * Tailwind v4 detects utilities by scanning source for literal class strings,
 * so dynamic `gap-${n}` templates would produce no CSS. These maps keep every
 * utility as a complete string literal that the scanner can see, while giving
 * components a typed numeric/enum prop API.
 */

export const gapClass: Record<number, string> = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
};

export const colsClass: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  12: "grid-cols-12",
};

export const colsSmClass: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
};

export const colsMdClass: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

export const colsLgClass: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

export const colsXlClass: Record<number, string> = {
  1: "xl:grid-cols-1",
  2: "xl:grid-cols-2",
  3: "xl:grid-cols-3",
  4: "xl:grid-cols-4",
};

/** Vertical padding scale for <Section>. */
export const sectionPadClass: Record<string, string> = {
  none: "py-0",
  tight: "py-4",
  default: "py-8",
  loose: "py-12",
};

/** Container max-width variants. */
export const containerSizeClass: Record<string, string> = {
  prose: "container-prose",
  page: "container-page",
  wide: "container-page",
  full: "max-w-none w-full px-0",
};

/** Shadow scale. */
export const shadowClass: Record<string, string> = {
  none: "shadow-none",
  xs: "shadow-xs",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
};

/** Radius scale. */
export const radiusClass: Record<string, string> = {
  none: "rounded-none",
  xs: "rounded-xs",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};
