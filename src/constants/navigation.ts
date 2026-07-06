/**
 * Navigation architecture.
 *
 * The primary nav mirrors the four user intents from the product vision:
 *   Discover → Compare → Understand → Decide
 * Secondary/utility links live in the footer to keep the header uncluttered.
 */

import type { NavItem, NavSection } from "@/types/site";

/**
 * Primary navigation shown in the site header.
 * Each entry maps to a top-level route group.
 */
export const PRIMARY_NAV: NavItem[] = [
  {
    label: "Providers",
    href: "/providers/",
    description: "Browse every VPN provider with objective, structured specs.",
  },
  {
    label: "Compare",
    href: "/compare/",
    description: "Side-by-side comparisons across features, price, and privacy.",
  },
  {
    label: "Best VPNs",
    href: "/best/",
    description: "Curated shortlists by use case, with transparent criteria.",
  },
  {
    label: "Guides",
    href: "/guides/",
    description: "Educational explainers to understand how VPNs actually work.",
  },
  {
    label: "FAQ",
    href: "/faq/",
    description: "Answers to the most common VPN questions.",
  },
];

/**
 * Footer navigation, grouped by section.
 */
export const FOOTER_NAV: NavSection[] = [
  {
    title: "Discover",
    links: [
      { label: "All providers", href: "/providers/" },
      { label: "Best VPNs", href: "/best/" },
      { label: "By country", href: "/countries/" },
      { label: "By platform", href: "/platforms/" },
    ],
  },
  {
    title: "Compare",
    links: [
      { label: "Comparisons", href: "/compare/" },
      { label: "By feature", href: "/features/" },
      { label: "By streaming", href: "/streaming/" },
      { label: "Pricing", href: "/pricing/" },
    ],
  },
  {
    title: "Understand",
    links: [
      { label: "Guides", href: "/guides/" },
      { label: "Protocols", href: "/protocols/" },
      { label: "Glossary", href: "/glossary/" },
      { label: "FAQ", href: "/faq/" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about/" },
      { label: "Methodology", href: "/methodology/" },
      { label: "Editorial policy", href: "/editorial-policy/" },
      { label: "Contact", href: "/contact/" },
    ],
  },
];

/** Social/legal links shown in the footer base row. */
export const UTILITY_NAV: NavItem[] = [
  { label: "Privacy", href: "/privacy/" },
  { label: "Terms", href: "/terms/" },
  { label: "Affiliate disclosure", href: "/affiliate-disclosure/" },
  { label: "Sitemap", href: "/sitemap-index.xml" },
];
