/**
 * Breadcrumb construction.
 *
 * Breadcrumbs can be supplied explicitly (preferred for editorial pages
 * where the hierarchy isn't path-derived) or derived from the URL path.
 * The SEO components turn the result into a BreadcrumbList JSON-LD node.
 */

import { PRIMARY_NAV } from "@/constants/navigation";
import type { Breadcrumb } from "@/types/site";
import { humanize } from "@/lib/utils/string";

const ROOT: Breadcrumb = { label: "Home", href: "/" };

/** Look up a top-level nav label for a path prefix (keeps labels in sync). */
function navLabelFor(segment: string): string | undefined {
  const match = PRIMARY_NAV.find((item) => {
    const seg = item.href.replace(/^\/|\/$/g, "");
    return seg === segment;
  });
  return match?.label;
}

/**
 * Derive breadcrumbs from a URL path.
 * @param path e.g. "/best/vpn-for-streaming"
 * @param leafLabel Optional override for the final segment label.
 */
export function breadcrumbsFromPath(path: string, leafLabel?: string): Breadcrumb[] {
  const clean = path.replace(/^\/|\/$/g, "");
  if (clean === "") return [ROOT];

  const segments = clean.split("/");
  const crumbs: Breadcrumb[] = [ROOT];
  let acc = "";

  segments.forEach((segment, index) => {
    acc += `/${segment}`;
    const isLast = index === segments.length - 1;
    const label =
      (isLast && leafLabel) ||
      navLabelFor(segment) ||
      humanize(segment);
    crumbs.push({ label, href: isLast ? path : `${acc}/` });
  });

  return crumbs;
}

/** Append an explicit leaf breadcrumb to an existing list. */
export function appendBreadcrumb(
  list: Breadcrumb[],
  crumb: Breadcrumb,
): Breadcrumb[] {
  return [...list, crumb];
}
