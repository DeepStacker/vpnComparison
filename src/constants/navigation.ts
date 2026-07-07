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
    label: "Dashboard",
    href: "/dashboard/",
    description: "Executive overview with KPIs, trends, and insights.",
  },
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
    label: "Tools",
    href: "/tools/",
    description: "Interactive recommender, comparisons, audits, speed tests and more.",
  },
  {
    label: "Insights",
    href: "/insights/",
    description: "Industry analytics, benchmarks, and aggregated intelligence.",
  },
  {
    label: "Guides",
    href: "/guides/",
    description: "Educational explainers to understand how VPNs actually work.",
  },
];

/**
 * Footer navigation, grouped by section.
 */
export const FOOTER_NAV: NavSection[] = [
  {
    title: "Discover",
    links: [
      { label: "Dashboard", href: "/dashboard/" },
      { label: "All providers", href: "/vpn/" },
      { label: "Comparisons", href: "/comparisons/" },
      { label: "Insights", href: "/insights/" },
      { label: "Best VPNs", href: "/best-lists/" },
    ],
  },
  {
    title: "Tools",
    links: [
      { label: "VPN Recommender", href: "/tools/finder/" },
      { label: "Comparison Builder", href: "/tools/compare/" },
      { label: "Speed Analyzer", href: "/tools/speed/" },
      { label: "Privacy Audit", href: "/tools/audit/" },
      { label: "Health Check", href: "/tools/health/" },
      { label: "Leak Test", href: "/tools/leak-test/" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "Guides", href: "/guides/" },
      { label: "FAQ", href: "/faq/" },
      { label: "Methodology", href: "/methodology/" },
      { label: "Activity", href: "/activity/" },
      { label: "Search", href: "/search/" },
      { label: "Settings", href: "/settings/" },
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
