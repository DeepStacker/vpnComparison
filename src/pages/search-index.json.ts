import { getCollection } from "astro:content";
import {
  reviewHref,
  guideHref,
  bestListHref,
  comparisonArticleHref,
  faqHref,
  providerHref,
  countryHref,
  featureHref,
  protocolHref,
  platformHref,
  streamingHref,
} from "@/lib/content/links";

export const prerender = true;

interface SearchEntry {
  id: string;
  title: string;
  summary: string;
  url: string;
  type: string;
  content: string;
}

function cleanBody(body: string | undefined): string {
  if (!body) return "";
  return body
    .replace(/<[^>]*>/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#*`>|\-_]{2,}/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 1500);
}

export async function GET(): Promise<Response> {
  const entries: SearchEntry[] = [];

  for (const entry of await getCollection("reviews")) {
    entries.push({
      id: entry.id,
      title: entry.data.title,
      summary: entry.data.summary ?? "",
      url: reviewHref(entry.id),
      type: "review",
      content: cleanBody(entry.body),
    });
  }

  for (const entry of await getCollection("guides")) {
    entries.push({
      id: entry.id,
      title: entry.data.title,
      summary: entry.data.summary ?? "",
      url: guideHref(entry.id),
      type: "guide",
      content: cleanBody(entry.body),
    });
  }

  for (const entry of await getCollection("best-lists")) {
    entries.push({
      id: entry.id,
      title: entry.data.title,
      summary: entry.data.summary ?? "",
      url: bestListHref(entry.id),
      type: "best-list",
      content: cleanBody(entry.body),
    });
  }

  for (const entry of await getCollection("comparisons")) {
    entries.push({
      id: entry.id,
      title: entry.data.title,
      summary: entry.data.summary ?? "",
      url: comparisonArticleHref(entry.id),
      type: "comparison",
      content: cleanBody(entry.body),
    });
  }

  for (const entry of await getCollection("faqs")) {
    entries.push({
      id: entry.id,
      title: entry.data.question,
      summary: entry.data.answer.slice(0, 200),
      url: faqHref(entry.id),
      type: "faq",
      content: `${entry.data.answer} ${cleanBody(entry.body)}`,
    });
  }

  for (const entry of await getCollection("provider-overviews")) {
    entries.push({
      id: entry.id,
      title: entry.data.title,
      summary: entry.data.summary ?? "",
      url: providerHref(entry.data.provider.id),
      type: "provider",
      content: cleanBody(entry.body),
    });
  }

  for (const entry of await getCollection("countries")) {
    entries.push({
      id: entry.id,
      title: `${entry.data.name} — VPN Server Locations`,
      summary: `${entry.data.name} VPN servers. ${entry.data.jurisdictionNote ?? `Find VPN providers with servers in ${entry.data.name}.`}`,
      url: countryHref(entry.data.slug),
      type: "country",
      content: `${entry.data.name} ${entry.data.region} ${entry.data.jurisdictionNote ?? ""}`,
    });
  }

  for (const entry of await getCollection("features")) {
    entries.push({
      id: entry.id,
      title: `${entry.data.name} — VPN Feature`,
      summary: entry.data.description,
      url: featureHref(entry.data.slug),
      type: "feature",
      content: `${entry.data.name} ${entry.data.category} ${entry.data.description}`,
    });
  }

  for (const entry of await getCollection("protocols")) {
    entries.push({
      id: entry.id,
      title: `${entry.data.name} — VPN Protocol`,
      summary: entry.data.description,
      url: protocolHref(entry.data.slug),
      type: "protocol",
      content: `${entry.data.name} ${entry.data.category} ${entry.data.encryption ?? ""} ${entry.data.description}`,
    });
  }

  for (const entry of await getCollection("platforms")) {
    entries.push({
      id: entry.id,
      title: `${entry.data.name} — VPN Platform`,
      summary: entry.data.official ? `Official VPN apps for ${entry.data.name}.` : `VPN compatibility with ${entry.data.name}.`,
      url: platformHref(entry.data.slug),
      type: "platform",
      content: `${entry.data.name} ${entry.data.official ? "official app" : "compatible"}`,
    });
  }

  for (const entry of await getCollection("streaming-services")) {
    entries.push({
      id: entry.id,
      title: `VPNs That Work with ${entry.data.name} — Streaming Compatibility`,
      summary: `Find VPNs that unblock ${entry.data.name}. Verified streaming support tested by our team.`,
      url: streamingHref(entry.data.slug),
      type: "streaming",
      content: `${entry.data.name} streaming VPN unblock ${entry.data.regions.join(" ")}`,
    });
  }

  entries.push({
    id: "tools-finder",
    title: "VPN Finder — Personalized VPN Recommendation Tool",
    summary: "Answer a few questions to get a personalized VPN recommendation based on your privacy needs, budget, and preferences.",
    url: "/tools/finder/",
    type: "tool",
    content: "VPN recommender finder wizard tool personalized recommendation privacy budget streaming torrenting gaming",
  });

  entries.push({
    id: "tools-compare",
    title: "VPN Comparison Builder — Side-by-Side VPN Comparison",
    summary: "Select any VPN providers to compare them side by side across pricing, privacy, network, features, and more.",
    url: "/tools/compare/",
    type: "tool",
    content: "VPN comparison compare side by side tool builder pricing privacy features network",
  });

  return new Response(JSON.stringify(entries), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
