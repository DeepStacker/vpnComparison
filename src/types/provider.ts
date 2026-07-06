/**
 * VPN provider domain — OBJECTIVE structured data.
 *
 * Everything here is verifiable fact (specs, pricing, jurisdiction, audits).
 * Editorial opinion (scores, verdicts, pros/cons) lives in `content.ts`
 * under Review. The two must never mix.
 */

import type { CountryCode, ID, ISODateString, Maybe, Slug, URLString } from "./common";

/* ------------------------------------------------------------
 * Protocols
 * ------------------------------------------------------------ */
export type ProtocolCategory =
  | "openvpn"
  | "wireguard"
  | "ikev2"
  | "l2tp"
  | "pptp"
  | "sstp"
  | "softether"
  | "proprietary"
  | "other";

export interface Protocol {
  id: ID;
  slug: Slug;
  name: string;
  category: ProtocolCategory;
  /** Short, neutral description of how the protocol works. */
  description: string;
  /** Cipher + key exchange, e.g. "AES-256-GCM / RSA-4096". */
  encryption?: string;
  /** Default transport (UDP/TCP). */
  transport?: "udp" | "tcp" | "both";
  /** Whether the implementation is open source. */
  openSource: boolean;
  /** Typical use case strengths. */
  strengths?: string[];
  /** Known weaknesses or limitations. */
  weaknesses?: string[];
  /** Organization or individual that created the protocol. */
  creator?: string;
  /** Year the protocol was released. */
  releaseYear?: number;
  /** Relative speed rating. */
  speedRating?: "slow" | "moderate" | "fast" | "very-fast";
  /** Relative security rating. */
  securityRating?: "weak" | "adequate" | "strong" | "very-strong";
  /** Platforms that natively support this protocol. */
  platformSupport?: string[];
  /** Default port. */
  port?: number;
}

/* ------------------------------------------------------------
 * Platforms
 * ------------------------------------------------------------ */
export interface Platform {
  id: ID;
  slug: Slug;
  name: string;
  /** Lucide icon name or asset slug for the platform logo. */
  icon: string;
  /** Whether the provider ships a first-party app for this platform. */
  official: boolean;
  /** Platform category. */
  category?: "desktop" | "mobile" | "tv" | "browser" | "router" | "other";
  /** Minimum supported OS version. */
  minOsVersion?: string;
  /** Known limitations on this platform. */
  limitations?: string[];
  /** Common issues users face on this platform. */
  commonIssues?: string[];
  /** App store or download URL. */
  storeUrl?: string;
  /** Link to setup guide. */
  setupGuideUrl?: string;
}

/* ------------------------------------------------------------
 * Countries
 * ------------------------------------------------------------ */
export type Region =
  | "north-america"
  | "south-america"
  | "europe"
  | "asia"
  | "africa"
  | "oceania"
  | "middle-east";

export interface Country {
  code: CountryCode;
  slug: Slug;
  name: string;
  region: Region;
  /** Emoji flag (lightweight, no asset required). */
  flagEmoji: string;
  /** Whether the country is a privacy-friendly jurisdiction. */
  privacyFriendly: boolean;
  /** Human-readable note on data-sharing alliances (5/9/14 Eyes, etc.). */
  jurisdictionNote?: string;
  /** Level of internet censorship. */
  censorshipLevel?: "low" | "moderate" | "high" | "extreme" | "unknown";
  /** Surveillance alliance membership. */
  surveillanceAlliance?: "five-eyes" | "nine-eyes" | "fourteen-eyes" | "none" | "unknown";
  /** Whether mandatory data retention laws exist. */
  dataRetentionLaw?: boolean;
  /** Internet penetration rate (0–100). */
  internetPenetration?: number;
  /** Recommended VPN protocols for this country. */
  recommendedProtocols?: ID[];
}

/* ------------------------------------------------------------
 * Streaming services
 * ------------------------------------------------------------ */
export interface StreamingService {
  id: ID;
  slug: Slug;
  name: string;
  icon: string;
  /** Regions the service is primarily available in. */
  regions: CountryCode[];
  /** Service website URL. */
  websiteUrl?: string;
  /** Content category. */
  category?: "entertainment" | "sports" | "news" | "anime" | "live-tv" | "other";
  /** How difficult this service is to unblock with a VPN. */
  vpnDetectionDifficulty?: "easy" | "moderate" | "difficult" | "unknown";
  /** General notes on reliability with VPNs. */
  reliabilityNotes?: string;
  /** Tips for unblocking this service with a VPN. */
  troubleshootingTips?: string[];
}

export type StreamingSupport = "verified" | "partial" | "unsupported" | "unknown";

/* ------------------------------------------------------------
 * Features
 * ------------------------------------------------------------ */
export type FeatureCategory =
  | "security"
  | "privacy"
  | "performance"
  | "usability"
  | "streaming"
  | "torrenting"
  | "advanced"
  | "pricing";

export interface Feature {
  id: ID;
  slug: Slug;
  name: string;
  category: FeatureCategory;
  description: string;
  technicalExplanation?: string;
  advantages?: string[];
  disadvantages?: string[];
  idealUsers?: string[];
  securityImpact?: string;
  performanceImpact?: string;
  importance?: "essential" | "important" | "nice-to-have" | "specialized";
}

/* ------------------------------------------------------------
 * Pricing
 * ------------------------------------------------------------ */
export type BillingCycle = "monthly" | "quarterly" | "yearly" | "biennially" | "triennially";

export interface PricePlan {
  cycle: BillingCycle;
  /** Price per cycle in the plan's currency (minor-units-as-major, e.g. dollars). */
  price: number;
  currency: string;
  /** Effective monthly price for comparison. */
  effectiveMonthly: number;
  /** Whether this plan is the headline/best-value offering. */
  featured?: boolean;
}

export interface Pricing {
  currency: string;
  plans: PricePlan[];
  /** Money-back guarantee in days (0 = none). */
  moneyBackGuaranteeDays: number;
  /** Accepted payment method slugs (card, paypal, crypto, cash, etc.). */
  paymentMethods: string[];
  /** Whether a genuinely usable free tier exists. */
  freeTier: boolean;
  freeTierNotes?: string;
}

/* ------------------------------------------------------------
 * Audits
 * ------------------------------------------------------------ */
export interface AuditRecord {
  /** Auditor name, e.g. "PwC", "Cure53", "Deloitte". */
  auditor: string;
  /** ISO date the audit report was published. */
  date: ISODateString;
  /** Scope the audit covered. */
  scope: string;
  /** Link to the public report. */
  reportUrl?: URLString;
  /** Whether the audit was independent (no conflicts of interest). */
  independent: boolean;
}

/* ------------------------------------------------------------
 * Logging policy
 * ------------------------------------------------------------ */
export type LoggingPolicy =
  | "no-logs"
  | "minimal"
  | "connection-only"
  | "usage-only"
  | "unknown";

/* ------------------------------------------------------------
 * Provider — the canonical objective record
 * ------------------------------------------------------------ */
export interface ProviderServerNetwork {
  /** Total number of physical/virtual servers. */
  serverCount: number;
  /** Number of countries with at least one server. */
  countryCount: number;
  /** Country codes where servers are available. */
  countries: CountryCode[];
  /** Whether virtual server locations are used. */
  virtualLocations: boolean;
}

export interface ProviderStreaming {
  service: ID;
  support: StreamingSupport;
  /** Last verified date for the support claim. */
  verifiedAt?: ISODateString;
}

export interface ProviderTorrenting {
  supported: boolean;
  /** Whether P2P-friendly servers are explicitly labeled. */
  labeledServers: boolean;
  /** 0–10 score reflecting privacy + throughput for torrenting. */
  rating?: number;
}

export interface Provider {
  id: ID;
  slug: Slug;
  name: string;
  tagline: string;
  /** Square logo asset path ( Astro Image ) — optional until assets land. */
  logo?: string;
  /** Marketing site (informational, not an affiliate link). */
  websiteUrl: URLString;
  /** Transparent affiliate link, only used when the project monetizes. */
  affiliateUrl?: URLString;

  foundedYear: number;
  /** Jurisdiction country code (where the company is legally based). */
  jurisdiction: CountryCode;
  hqCountry: CountryCode;
  /** Parent company, if the provider is a subsidiary. */
  parentCompany?: string;
  /** Ownership structure. */
  ownership?: "public" | "private" | "subsidiary";
  /** Whether the provider publishes a warrant canary. */
  warrantCanary?: boolean;
  /** Whether servers use RAM-only (diskless) infrastructure. */
  ramOnlyServers?: boolean;
  /** URLs to transparency/accountability reports. */
  transparencyReports?: URLString[];

  serverNetwork: ProviderServerNetwork & { ownedInfrastructure?: boolean };

  /** Protocol IDs supported. */
  protocols: ID[];
  /** Platform IDs with first-party apps. */
  platforms: ID[];
  /** Feature IDs that apply. */
  features: ID[];
  /** Per-service streaming support. */
  streaming: (ProviderStreaming & { notes?: string; regionsTested?: CountryCode[] })[];
  torrenting: ProviderTorrenting & { portForwarding?: boolean; notes?: string };

  loggingPolicy: LoggingPolicy;
  /** Description of DNS handling (own servers, encrypted DNS, etc.). */
  dnsHandling?: string;
  /** Description of leak protection capabilities. */
  leakProtection?: string;
  /** Type of obfuscation supported. */
  obfuscationType?: "stealth" | "no-borders" | "scramble" | "multi-hop" | "none" | "other";
  /** Whether post-quantum encryption is supported. */
  postQuantum?: boolean;
  /** Whether a verified network kill switch is available. */
  killSwitch: boolean;
  splitTunneling: boolean;
  adBlocker: boolean;
  multiHop: boolean;
  dedicatedIp: boolean;
  /** Maximum simultaneous device connections (0 = unlimited). */
  simultaneousConnections: number;

  pricing: Pricing;
  /** Support contact details. */
  support?: {
    liveChat?: boolean;
    email?: boolean;
    knowledgeBase?: boolean;
    averageResponseTime?: string;
  };
  /** Independent audit history, oldest first. */
  audits: AuditRecord[];

  /** ISO date this objective record was last reviewed for accuracy. */
  updatedAt: ISODateString;
  /** Optional source URLs backing the claims above. */
  sources?: URLString[];
}

/* ------------------------------------------------------------
 * Helpers / enums surfaced for tooling
 * ------------------------------------------------------------ */
export interface ProviderFilter {
  featureIds?: ID[];
  protocolIds?: ID[];
  platformIds?: ID[];
  maxMonthlyPrice?: number;
  loggingPolicy?: LoggingPolicy[];
  freeTierOnly?: boolean;
  streamingServiceId?: ID;
  region?: Region;
}

/** A comparison row keyed by a feature/attribute id. */
export interface ComparisonCell {
  /** The attribute being compared, e.g. "price", "jurisdiction", "protocols". */
  attribute: string;
  /** Per-provider value, keyed by provider id. */
  values: Record<ID, string | number | boolean | Maybe<string[]>>;
}
