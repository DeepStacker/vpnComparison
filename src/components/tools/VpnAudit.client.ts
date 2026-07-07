interface Provider {
  id: string;
  slug: string;
  name: string;
  jurisdiction: string;
  loggingPolicy: string;
  audits: Array<{ auditor: string; independent: boolean }>;
  killSwitch: boolean;
  multiHop: boolean;
  splitTunneling: boolean;
  features: string[];
  protocols: string[];
}

interface ReviewData {
  providerId: string;
  scores: { privacy: number; security: number; overall: number };
  verdict: { headline: string; summary: string; recommendation: string };
}

interface Control {
  id: string;
  label: string;
  description: string;
  weight: number;
}

interface ControlResult {
  control: Control;
  passed: boolean;
  reason: string;
}

interface ControlScore {
  total: number;
  max: number;
  results: ControlResult[];
}

const FRIENDLY_JURISDICTIONS = new Set(["CH", "IS", "SE", "NL", "RO", "EE", "DK", "NO"]);

const CONTROLS: Control[] = [
  { id: "jurisdiction", label: "Privacy-friendly jurisdiction", description: "Headquartered outside mandatory data-sharing alliances.", weight: 1.2 },
  { id: "logging", label: "No-logs policy", description: "Verified no-logs policy in the provider's terms.", weight: 1.5 },
  { id: "audits", label: "Independent audits", description: "At least one recent independent security audit.", weight: 1.5 },
  { id: "killswitch", label: "Kill switch", description: "Network lock to prevent traffic leaks on disconnect.", weight: 1.0 },
  { id: "multihop", label: "Multi-hop / double VPN", description: "Routes traffic through two servers for added privacy.", weight: 0.8 },
  { id: "split", label: "Split tunneling", description: "Allows selective routing around the VPN tunnel.", weight: 0.6 },
  { id: "obfuscation", label: "Obfuscation / stealth", description: "Disguises VPN traffic to bypass DPI and censorship.", weight: 0.9 },
  { id: "wireguard", label: "Modern protocol (WireGuard)", description: "Uses a modern, audited protocol by default.", weight: 0.9 },
  { id: "open", label: "Open-source apps", description: "Client apps are open source and reproducible.", weight: 0.7 },
  { id: "leak", label: "DNS & IPv6 leak protection", description: "Built-in DNS and IPv6 leak protection.", weight: 1.0 },
  { id: "tor", label: "Tor over VPN", description: "Supports routing through the Tor network.", weight: 0.4 },
  { id: "payments", label: "Anonymous payment options", description: "Accepts anonymous or hard-to-trace payment.", weight: 0.6 },
];

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function evaluateControl(
  p: Provider,
  c: Control
): { passed: boolean; reason: string } {
  switch (c.id) {
    case "jurisdiction":
      return {
        passed: FRIENDLY_JURISDICTIONS.has(p.jurisdiction),
        reason: FRIENDLY_JURISDICTIONS.has(p.jurisdiction)
          ? `Headquartered in ${p.jurisdiction}, a privacy-friendly jurisdiction.`
          : `Jurisdiction ${p.jurisdiction} is not on our privacy-friendly list.`,
      };
    case "logging":
      return {
        passed: p.loggingPolicy === "no-logs",
        reason:
          p.loggingPolicy === "no-logs"
            ? "Strict no-logs policy."
            : `Logging policy: ${p.loggingPolicy}.`,
      };
    case "audits": {
      const independent = p.audits.filter((a) => a.independent).length;
      return {
        passed: independent > 0,
        reason:
          independent > 0
            ? `${independent} independent audit(s) on record.`
            : "No independent audits on record.",
      };
    }
    case "killswitch":
      return {
        passed: p.killSwitch,
        reason: p.killSwitch ? "Kill switch is available." : "No kill switch advertised.",
      };
    case "multihop":
      return {
        passed: p.multiHop,
        reason: p.multiHop ? "Multi-hop supported." : "No multi-hop configuration.",
      };
    case "split":
      return {
        passed: p.splitTunneling,
        reason: p.splitTunneling ? "Split tunneling supported." : "No split tunneling support.",
      };
    case "obfuscation":
      return {
        passed: p.features.includes("obfuscation"),
        reason: p.features.includes("obfuscation")
          ? "Obfuscation / stealth protocol available."
          : "No obfuscation advertised.",
      };
    case "wireguard":
      return {
        passed: p.protocols.includes("wireguard"),
        reason: p.protocols.includes("wireguard") ? "WireGuard supported." : "WireGuard not in protocol list.",
      };
    case "open":
      return {
        passed: p.features.includes("open-source"),
        reason: p.features.includes("open-source") ? "Apps are open source." : "Apps are closed source.",
      };
    case "leak":
      return {
        passed: p.features.includes("dns-leak-protection"),
        reason: p.features.includes("dns-leak-protection")
          ? "DNS & IPv6 leak protection included."
          : "No explicit leak protection feature.",
      };
    case "tor":
      return {
        passed: p.features.includes("tor-over-vpn"),
        reason: p.features.includes("tor-over-vpn") ? "Tor-over-VPN supported." : "No Tor-over-VPN option.",
      };
    case "payments":
      return {
        passed: p.features.includes("anonymous-payment"),
        reason: p.features.includes("anonymous-payment")
          ? "Anonymous payment options offered."
          : "No anonymous payment option advertised.",
      };
  }
  return { passed: false, reason: "Control not evaluated." };
}

function computeControlScore(p: Provider): ControlScore {
  const results: ControlResult[] = CONTROLS.map((c) => ({ control: c, ...evaluateControl(p, c) }));
  const total = results.reduce((s, r) => s + (r.passed ? r.control.weight : 0), 0);
  const max = results.reduce((s, r) => s + r.control.weight, 0);
  return { total, max, results };
}

function contextAdjustments(context: string, p: Provider): string[] {
  const notes: string[] = [];
  if (context === "journalist" && !FRIENDLY_JURISDICTIONS.has(p.jurisdiction))
    notes.push("High-risk context: consider a provider outside major data-sharing alliances.");
  if (context === "business" && p.loggingPolicy !== "no-logs")
    notes.push("Business context: confirm a contractual no-logs clause with the provider.");
  if (context === "travel" && !p.features.includes("obfuscation"))
    notes.push("Travel context: obfuscation is recommended for restrictive networks.");
  if (context === "personal" && !p.killSwitch)
    notes.push("Enable a kill switch on every device to avoid traffic leaks.");
  return notes;
}

function renderReport(resultsEl: HTMLElement, providers: Provider[], reviews: ReviewData[], providerId: string, context: string): void {
  const p = providers.find((x) => x.id === providerId);
  if (!p) return;
  const review = reviews.find((r) => r.providerId === providerId);
  const score = computeControlScore(p);
  const pct = Math.round((score.total / score.max) * 100);
  const tone = pct >= 80 ? "success" : pct >= 60 ? "primary" : "warning";
  const ctxNotes = contextAdjustments(context, p);
  const failed = score.results.filter((r) => !r.passed);

  const headline = `
    <div class="rounded-3xl border border-${tone}/30 bg-${tone}/5 p-8 shadow-sm">
      <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div class="min-w-0">
          <p class="text-xs font-bold uppercase tracking-widest text-muted-foreground">Audit report</p>
          <h3 class="mt-2 text-2xl font-black tracking-tight">${escapeHtml(p.name)} · ${escapeHtml(context)} context</h3>
          <p class="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xl">${review ? escapeHtml(review.verdict.headline) : "Comprehensive privacy control assessment."}</p>
        </div>
        <div class="shrink-0 text-center">
          <div class="relative inline-flex items-center justify-center" style="width:100px;height:100px">
            <svg class="-rotate-90" width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-border)" stroke-width="8" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-${tone})" stroke-width="8" stroke-dasharray="${2 * Math.PI * 42}" stroke-dashoffset="${2 * Math.PI * 42 * (1 - pct / 100)}" stroke-linecap="round" class="transition-all duration-1000" />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-2xl font-black tracking-tighter" style="color:var(--color-${tone})">${pct}%</span>
            </div>
          </div>
          <p class="mt-2 text-xs font-bold uppercase tracking-widest" style="color:var(--color-${tone})">Audit score</p>
        </div>
      </div>
      <div class="mt-6 rounded-2xl border border-border/50 bg-surface p-5">
        <p class="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Control Coverage</p>
        <div class="space-y-2">
          ${score.results.map((r) => `
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold text-foreground w-28 truncate" title="${escapeHtml(r.control.label)}">${escapeHtml(r.control.label)}</span>
              <div class="flex-1 h-4 rounded-md bg-surface-sunken border border-border/50 overflow-hidden shadow-inner">
                <div class="h-full rounded-md transition-all duration-500 ${r.passed ? "bg-success" : "bg-border"}" style="width:${r.passed ? "100%" : "0%"};opacity:${r.passed ? 1 : 0.3}"></div>
              </div>
              <span class="text-[10px] font-bold ${r.passed ? "text-success" : "text-muted-foreground"} w-10 text-right">${r.passed ? "Pass" : "Gap"}</span>
            </div>
          `).join("")}
        </div>
      </div>
      <div class="mt-6 grid gap-4 sm:grid-cols-3">
        <div class="rounded-2xl border border-border/50 bg-surface p-5">
          <p class="text-xs font-bold uppercase tracking-widest text-muted-foreground">Controls passed</p>
          <p class="mt-2 text-2xl font-black tracking-tighter text-foreground">${score.results.length - failed.length}<span class="text-sm text-muted-foreground">/${score.results.length}</span></p>
        </div>
        <div class="rounded-2xl border border-border/50 bg-surface p-5">
          <p class="text-xs font-bold uppercase tracking-widest text-muted-foreground">Independent audits</p>
          <p class="mt-2 text-2xl font-black tracking-tighter text-foreground">${p.audits.filter((a) => a.independent).length}</p>
        </div>
        <div class="rounded-2xl border border-border/50 bg-surface p-5">
          <p class="text-xs font-bold uppercase tracking-widest text-muted-foreground">Jurisdiction</p>
          <p class="mt-2 text-2xl font-black tracking-tighter text-foreground">${escapeHtml(p.jurisdiction)}</p>
        </div>
      </div>
    </div>
  `;

  const detailTable = `
    <div class="rounded-2xl border border-border bg-surface p-6 shadow-sm">
      <h3 class="text-lg font-black tracking-tight">Controls Detail</h3>
      <div class="mt-4 overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <th class="py-2 pr-4">Control</th>
              <th class="py-2 pr-4">Status</th>
              <th class="py-2 pr-4">Notes</th>
            </tr>
          </thead>
          <tbody>
            ${score.results.map((r) => `
              <tr class="border-t border-border/50">
                <td class="py-3 pr-4">
                  <p class="font-bold text-foreground">${escapeHtml(r.control.label)}</p>
                  <p class="text-xs text-muted-foreground leading-relaxed">${escapeHtml(r.control.description)}</p>
                </td>
                <td class="py-3 pr-4">
                  <span class="inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${r.passed ? "text-success border-success/20 bg-success/10" : "text-warning border-warning/20 bg-warning/10"}">${r.passed ? "Pass" : "Gap"}</span>
                </td>
                <td class="py-3 pr-4 text-muted-foreground leading-relaxed">${escapeHtml(r.reason)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;

  const risksList = failed.length === 0
    ? `<li class="flex gap-3"><span class="mt-0.5 h-5 w-5 rounded-full bg-success/10 border border-success/30 flex items-center justify-center text-[10px] font-black text-success">✓</span><span>No control gaps detected. Continue periodic re-audits as policies evolve.</span></li>`
    : failed.slice(0, 4).map((f) => `<li class="flex gap-3"><span class="mt-0.5 h-5 w-5 rounded-full bg-warning/10 border border-warning/30 flex items-center justify-center text-[10px] font-black text-warning">!</span><span><strong class="text-foreground">${escapeHtml(f.control.label)}</strong>: ${escapeHtml(f.reason)}</span></li>`).join("");

  const baseActions = [
    `<li class="flex gap-3"><span class="mt-0.5 h-5 w-5 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-[10px] font-black text-primary">1</span><span>Re-audit in 90 days or after any policy change.</span></li>`,
    `<li class="flex gap-3"><span class="mt-0.5 h-5 w-5 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-[10px] font-black text-primary">2</span><span>Request the latest audit report from the provider before renewal.</span></li>`,
    `<li class="flex gap-3"><span class="mt-0.5 h-5 w-5 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-[10px] font-black text-primary">3</span><span>Document the threat model this audit supports and share with stakeholders.</span></li>`,
  ];
  const contextActions = ctxNotes.map(
    (n) => `<li class="flex gap-3"><span class="mt-0.5 h-5 w-5 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-[10px] font-black text-primary">→</span><span>${escapeHtml(n)}</span></li>`
  );

  const summaryGrid = `
    <div class="grid gap-6 md:grid-cols-2">
      <div class="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h3 class="text-base font-black uppercase tracking-widest">Top risks</h3>
        <ul class="mt-4 space-y-3 text-sm text-foreground/90">${risksList}</ul>
      </div>
      <div class="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h3 class="text-base font-black uppercase tracking-widest">Recommended actions</h3>
        <ul class="mt-4 space-y-3 text-sm text-foreground/90">${baseActions.concat(contextActions).join("")}</ul>
      </div>
    </div>
  `;

  resultsEl.innerHTML = headline + detailTable + summaryGrid;
}

export function initVpnAudit(): void {
  const dataEl = document.getElementById("audit-data");
  const reviewsEl = document.getElementById("audit-reviews-data");
  const results = document.getElementById("audit-results");
  const runBtn = document.getElementById("audit-run") as HTMLButtonElement | null;
  const providerSel = document.getElementById("audit-provider") as HTMLSelectElement | null;
  const contextSel = document.getElementById("audit-context") as HTMLSelectElement | null;

  if (!dataEl || !reviewsEl || !results || !runBtn || !providerSel || !contextSel) return;

  const providers: Provider[] = JSON.parse(dataEl.textContent || "[]");
  const reviews: ReviewData[] = JSON.parse(reviewsEl.textContent || "[]");

  runBtn.addEventListener("click", () => {
    renderReport(results, providers, reviews, providerSel.value, contextSel.value);
  });
}
