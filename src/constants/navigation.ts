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
    label: "Reviews",
    href: "/vpn/",
    description: "In-depth VPN reviews with real test data and scores.",
  },
  {
    label: "Compare",
    href: "/comparisons/",
    description: "Side-by-side comparisons across features, price, and privacy.",
  },
  {
    label: "Best VPNs",
    href: "/best-lists/",
    description: "Curated shortlists by use case, with transparent criteria.",
  },
  {
    label: "Guides",
    href: "/guides/",
    description: "Educational explainers to understand how VPNs actually work.",
  },
  {
    label: "Tools",
    href: "/tools/",
    description: "Interactive VPN recommender and comparison builder.",
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
      { label: "All providers", href: "/vpn/" },
      { label: "Best VPNs", href: "/best-lists/" },
      { label: "Comparisons", href: "/comparisons/" },
      { label: "Tools", href: "/tools/" },
      { label: "Reviews", href: "/vpn/" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "Guides", href: "/guides/" },
      { label: "FAQ", href: "/faq/" },
      { label: "Methodology", href: "/methodology/" },
      { label: "Search", href: "/search/" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about/" },
      { label: "Privacy", href: "/privacy/" },
      { label: "Terms", href: "/terms/" },
      { label: "Contact", href: "/contact/" },
    ],
  },
];

/** Social/legal links shown in the footer base row. */
export const UTILITY_NAV: NavItem[] = [
  { label: "Privacy", href: "/privacy/" },
  { label: "Terms", href: "/terms/" },
  { label: "Sitemap", href: "/sitemap-index.xml" },
];
