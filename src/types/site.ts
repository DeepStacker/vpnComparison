/**
 * Site/UI structural types: navigation, breadcrumbs, and layout metadata.
 */

/** A single navigation link. `description` powers richer navigation UIs. */
export interface NavItem {
  label: string;
  href: string;
  description?: string;
  /** Lucide icon name when the nav item is rendered with an icon. */
  icon?: string;
  /** Mark the current route for aria-current rendering. */
  current?: boolean;
}

/** A titled group of links, used in footers and mega-menus. */
export interface NavSection {
  title: string;
  links: NavItem[];
}

/** A breadcrumb segment rendered with semantic BreadcrumbList schema. */
export interface Breadcrumb {
  label: string;
  href: string;
}

/** Theme preference resolved for the document root. */
export type ThemePreference = "light" | "dark" | "system";
