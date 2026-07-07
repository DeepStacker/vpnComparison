/* Auto-extracted from VpnCompare.astro. All logic wrapped in initVpnCompare(). */
export function initVpnCompare(): void {

interface Provider {
  id: string; slug: string; name: string; tagline: string;
  serverNetwork: { serverCount: number; countryCount: number; countries: string[]; virtualLocations: boolean };
  protocols: string[]; platforms: string[]; features: string[];
  streaming: Array<{ service: string; support: string }>;
  torrenting: { supported: boolean; labeledServers: boolean; rating?: number };
  loggingPolicy: string; jurisdiction: string;
  pricing: { plans: Array<{ effectiveMonthly: number; featured?: boolean }>; moneyBackGuaranteeDays: number; freeTier: boolean };
  audits: Array<{ auditor: string; independent: boolean }>;
  killSwitch: boolean; multiHop: boolean; splitTunneling: boolean;
  adBlocker: boolean; dedicatedIp: boolean; simultaneousConnections: number;
}

interface ReviewData {
  providerId: string;
  scores: {
    privacy: number; security: number; performance: number; streaming: number;
    torrenting: number; easeOfUse: number; value: number; overall: number;
  };
  verdict: { headline: string; summary: string; recommendation: string };
}

interface ComparisonEntry {
  slug: string;
  title: string;
  providerIds: string[];
}

    const allProviders: Provider[] = JSON.parse(document.getElementById("compare-data")!.textContent);
    const allReviews: ReviewData[] = JSON.parse(document.getElementById("compare-reviews-data")!.textContent);
    const allComparisons: ComparisonEntry[] = JSON.parse(document.getElementById("compare-comparisons-data")!.textContent);
    const countryNames: Record<string, string> = JSON.parse(document.getElementById("compare-country-names")!.textContent);

    const reviewMap = new Map(allReviews.map((r) => [r.providerId, r]));
    const providerMap = new Map(allProviders.map((p) => [p.id, p]));

    let selectedIds: string[] = [];

    const selector = document.getElementById("compare-selector")!;
    const matrix = document.getElementById("compare-matrix")!;

    function render() {
      renderSelector();
      renderMatrix();
    }

    function renderSelector() {
      selector.innerHTML = "";

      const label = document.createElement("p");
      label.className = "text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6";
      label.textContent = "Select 2–4 providers to compare:";
      selector.appendChild(label);

      const grid = document.createElement("div");
      grid.className = "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5";

      for (const p of allProviders) {
        const isSelected = selectedIds.includes(p.id);

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className =
          "rounded-xl border px-4 py-3 text-sm font-bold transition-all text-left shadow-sm " +
          (isSelected
            ? "border-primary bg-primary/10 text-primary shadow-md ring-2 ring-primary/20"
            : "border-border bg-surface text-foreground hover:border-primary/30 hover:bg-surface-raised");

        btn.textContent = p.name;

        btn.addEventListener("click", () => {
          if (isSelected) {
            selectedIds = selectedIds.filter((id) => id !== p.id);
          } else {
            if (selectedIds.length >= 4) return;
            selectedIds.push(p.id);
          }
          render();
        });

        grid.appendChild(btn);
      }

      selector.appendChild(grid);

      if (selectedIds.length < 2) {
        const hint = document.createElement("p");
        hint.className = "mt-6 text-sm font-medium text-muted-foreground flex items-center gap-2";
        hint.innerHTML = `<span class="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-black">!</span> Select ${2 - selectedIds.length} more provider${2 - selectedIds.length !== 1 ? "s" : ""} to see a comparison.`;
        selector.appendChild(hint);
      }
    }

    /* ---------- Comparison Matrix ---------- */
    interface ComparisonRow {
      attribute: string;
      label: string;
      values: Record<string, string>;
      higherIsBetter?: boolean;
    }

    function buildMatrix(): ComparisonRow[] {
      const selected = selectedIds.map((id) => providerMap.get(id)!).filter(Boolean);
      if (selected.length < 2) return [];

      const row = (
        attribute: string,
        label: string,
        pick: (p: Provider) => string,
        higherIsBetter?: boolean,
      ): ComparisonRow => ({
        attribute,
        label,
        higherIsBetter,
        values: Object.fromEntries(selected.map((p) => [p.id, pick(p)])),
      });

      return [
        row("price", "Starting price", (p) => {
          const min = Math.min(...p.pricing.plans.map((pl) => pl.effectiveMonthly));
          return `$${min.toFixed(2)}/mo`;
        }, false),
        row("money-back", "Money-back guarantee", (p) =>
          p.pricing.moneyBackGuaranteeDays > 0 ? `${p.pricing.moneyBackGuaranteeDays} days` : "None"),
        row("free-tier", "Free tier", (p) => p.pricing.freeTier ? "Yes" : "No"),
        row("jurisdiction", "Jurisdiction", (p) => countryNames[p.jurisdiction] ?? p.jurisdiction),
        row("logging", "Logging policy", (p) => p.loggingPolicy.replace(/-/g, " ")),
        row("audits", "Audits", (p) => String(p.audits.length), true),
        row("servers", "Servers", (p) => p.serverNetwork.serverCount.toLocaleString(), true),
        row("countries", "Countries", (p) => String(p.serverNetwork.countryCount), true),
        row("connections", "Devices", (p) =>
          p.simultaneousConnections === 0 ? "Unlimited" : String(p.simultaneousConnections), true),
        row("kill-switch", "Kill switch", (p) => p.killSwitch ? "Yes" : "No"),
        row("split-tunneling", "Split tunneling", (p) => p.splitTunneling ? "Yes" : "No"),
        row("multi-hop", "Multi-hop", (p) => p.multiHop ? "Yes" : "No"),
        row("torrenting", "Torrenting", (p) => p.torrenting.supported ? "Yes" : "No"),
        row("overall", "Overall score", (p) => {
          const r = reviewMap.get(p.id);
          return r ? r.scores.overall.toFixed(1) : "—";
        }, true),
      ];
    }

    function pickWinners(rows: ComparisonRow[]): Record<string, string> {
      const winners: Record<string, string> = {};
      for (const row of rows) {
        if (row.higherIsBetter === undefined) continue;
        const ids = selectedIds;
        if (ids.length === 0) continue;
        let bestId = ids[0]!;
        let bestVal = -Infinity;
        for (const id of ids) {
          const raw = row.values[id] ?? "";
          const numeric = parseFloat(raw.replace(/[^0-9.]/g, "")) || 0;
          const adjusted = row.higherIsBetter ? numeric : -numeric;
          if (adjusted > bestVal) {
            bestVal = adjusted;
            bestId = id;
          }
        }
        winners[row.attribute] = bestId;
      }
      return winners;
    }

    /* ---------- Score overview ---------- */
    function renderScoreCards(providers: Provider[]) {
      const container = document.createElement("div");
      container.className = "mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4";

      for (const p of providers) {
        const review = reviewMap.get(p.id);
        if (!review) continue;

        const score = review.scores.overall;
        const card = document.createElement("a");
        card.href = `/vpn/${p.slug}/#review`;
        card.className =
          "group rounded-2xl border border-border bg-surface p-6 no-underline transition-all duration-300 hover:shadow-xl hover:border-primary/30 hover:-translate-y-1";

        card.innerHTML = `
          <div class="text-base font-black tracking-tight text-foreground group-hover:text-primary transition-colors">${escapeHtml(p.name)}</div>
          <div class="mt-4 flex items-baseline gap-1">
            <span class="text-3xl font-black tracking-tighter ${score >= 8 ? "text-success" : score >= 6 ? "text-primary" : "text-warning"}">${score.toFixed(1)}</span>
            <span class="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">/ 10</span>
          </div>
          <div class="mt-3 h-2 w-full rounded-full bg-surface-sunken border border-border/50 overflow-hidden shadow-inner">
            <div class="h-full rounded-full transition-all duration-1000 ease-out ${score >= 8 ? "bg-success" : score >= 6 ? "bg-primary" : "bg-warning"}" style="width:${score * 10}%"></div>
          </div>
          <p class="mt-4 text-xs font-bold text-muted-foreground uppercase tracking-widest line-clamp-1">${escapeHtml(review.verdict.headline)}</p>
        `;

        container.appendChild(card);
      }

      return container;
    }

    function renderMatrix() {
      matrix.innerHTML = "";

      const selected = selectedIds.map((id) => providerMap.get(id)!).filter(Boolean);
      if (selected.length < 2) return;

      /* Check for existing editorial comparison */
      const matchingComparison = allComparisons.find((c) =>
        c.providerIds.length === selectedIds.length &&
        c.providerIds.every((id) => selectedIds.includes(id)) &&
        selectedIds.every((id) => c.providerIds.includes(id)),
      );

      if (matchingComparison) {
        const banner = document.createElement("div");
        banner.className =
          "mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-2xl border border-primary/20 bg-primary/5 p-8 shadow-sm";
        banner.innerHTML = `
          <div>
            <p class="text-lg font-black tracking-tight text-foreground">Editorial comparison available</p>
            <p class="text-base text-muted-foreground mt-1">We've written a detailed, hands-on analysis of these providers.</p>
          </div>
          <a href="/comparisons/${matchingComparison.slug}/" class="shrink-0 rounded-xl bg-primary px-6 py-3 text-sm font-black uppercase tracking-widest text-primary-foreground no-underline transition-all duration-200 hover:brightness-110 shadow-lg">Read Analysis</a>
        `;
        matrix.appendChild(banner);
      }

      /* Score cards */
      const scoreCards = renderScoreCards(selected);
      if (scoreCards.children.length > 0) matrix.appendChild(scoreCards);

      /* Enterprise results panel */
      const rows = buildMatrix();
      const winners = pickWinners(rows);

      const bestOverallId = winners.overall ?? selected[0]?.id;
      const bestPrivacyId = winners.logging ?? selected[0]?.id;
      const bestStreamingId = winners.servers ?? selected[0]?.id;

      const bestOverall = selected.find((p) => p.id === bestOverallId) ?? selected[0];
      const bestPrivacy = selected.find((p) => p.id === bestPrivacyId) ?? selected[0];
      const bestStreaming = selected.find((p) => p.id === bestStreamingId) ?? selected[0];

      const confidence = computeConfidence(rows);
      const riskSummary = computeRiskSummary(selected, rows);
      const recommendedActions = computeRecommendedActions(rows);

      const resultsPanel = document.createElement("div");
      resultsPanel.className =
        "mb-10 rounded-3xl border border-primary/20 bg-primary/5 p-8 shadow-sm";
      resultsPanel.innerHTML = `
        <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div class="min-w-0">
            <p class="text-sm font-bold uppercase tracking-widest text-muted-foreground">Executive Summary</p>
            <h3 class="mt-2 text-2xl font-black tracking-tight">Best fit: ${escapeHtml(bestOverall?.name ?? "—")}</h3>
            <p class="mt-3 text-base text-muted-foreground leading-relaxed max-w-2xl">
              Based on your selected providers, we highlight the strongest options for privacy, streaming performance, and overall value.
              This is a static demo dataset, but the workflow mirrors a real enterprise comparison experience.
            </p>
          </div>

          <div class="shrink-0">
            <div class="rounded-2xl border border-primary/30 bg-primary/10 p-5">
              <p class="text-sm font-bold uppercase tracking-widest text-muted-foreground">Confidence</p>
              <div class="mt-2 flex items-baseline gap-2">
                <span class="text-4xl font-black tracking-tighter text-primary">${confidence}%</span>
                <span class="text-xs font-bold uppercase tracking-widest text-muted-foreground">demo</span>
              </div>
              <p class="mt-2 text-sm text-muted-foreground leading-relaxed">Higher confidence means more criteria are strongly supported across providers.</p>
            </div>
          </div>
        </div>

        <!-- Score comparison chart -->
        <div class="mt-6 rounded-2xl border border-border/50 bg-surface p-6" id="compare-score-chart-container">
          <p class="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Score Comparison</p>
          <div id="compare-score-chart" style="height:160px"></div>
        </div>

        <div class="mt-6 grid gap-6 lg:grid-cols-3">
          <div class="rounded-2xl border border-border/50 bg-surface p-6">
            <p class="text-sm font-bold uppercase tracking-widest text-muted-foreground">Key Findings</p>
            <ul class="mt-4 space-y-3 text-sm text-foreground/90">
              <li class="flex gap-3"><span class="mt-0.5 h-5 w-5 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-[10px] font-black text-primary">1</span><span>Privacy leader: ${escapeHtml(bestPrivacy?.name ?? "—")}</span></li>
              <li class="flex gap-3"><span class="mt-0.5 h-5 w-5 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-[10px] font-black text-primary">2</span><span>Streaming leader: ${escapeHtml(bestStreaming?.name ?? "—")}</span></li>
              <li class="flex gap-3"><span class="mt-0.5 h-5 w-5 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-[10px] font-black text-primary">3</span><span>Overall winner: ${escapeHtml(bestOverall?.name ?? "—")}</span></li>
            </ul>
          </div>

          <div class="rounded-2xl border border-border/50 bg-surface p-6">
            <p class="text-sm font-bold uppercase tracking-widest text-muted-foreground">Potential Risks</p>
            <div class="mt-4 space-y-3">
              ${riskSummary
                .map(
                  (r: { title: string; detail: string; severity: "Low" | "Medium" | "High" }) => `
                  <div class="rounded-xl border border-border/50 bg-surface-sunken/40 p-4">
                    <div class="flex items-center justify-between gap-3">
                      <p class="text-sm font-black text-foreground">${escapeHtml(r.title)}</p>
                      <span class="text-xs font-bold uppercase tracking-widest ${r.severity === "High" ? "text-warning" : r.severity === "Medium" ? "text-primary" : "text-success"}">${escapeHtml(r.severity)}</span>
                    </div>
                    <p class="mt-2 text-sm text-muted-foreground leading-relaxed">${escapeHtml(r.detail)}</p>
                  </div>
                `,
                )
                .join("")}
            </div>
          </div>

          <div class="rounded-2xl border border-border/50 bg-surface p-6">
            <p class="text-sm font-bold uppercase tracking-widest text-muted-foreground">Recommended Actions</p>
            <div class="mt-4 space-y-3">
              ${recommendedActions
                .map(
                  (a: { action: string; rationale: string }) => `
                  <div class="rounded-xl border border-border/50 bg-surface-sunken/40 p-4">
                    <p class="text-sm font-black text-foreground">${escapeHtml(a.action)}</p>
                    <p class="mt-2 text-sm text-muted-foreground leading-relaxed">${escapeHtml(a.rationale)}</p>
                  </div>
                `,
                )
                .join("")}
            </div>
          </div>
        </div>
      `;
      matrix.appendChild(resultsPanel);

      // Render score comparison bar chart
      requestAnimationFrame(function() {
        var chartEl2 = document.getElementById("compare-score-chart");
        if (!chartEl2 || selected.length === 0) return;
        var html = '<div class="space-y-4">';
        var cols = ["overall", "logging", "servers"];
        var colLabels = { overall: "Overall", logging: "Privacy", servers: "Performance" };
        var barColors = ['var(--color-primary)', 'var(--color-success)', 'var(--color-warning)', 'var(--color-info)'];
        for (var ci = 0; ci < cols.length; ci++) {
          var colKey = cols[ci];
          var maxVal = 0;
          var vals = [];
          for (var pi = 0; pi < selected.length; pi++) {
            var p = selected[pi];
            if (!p) continue;
            var review = reviewMap.get(p.id);
            var raw = colKey === "overall" ? (review ? review.scores.overall : 0) * 10 :
                      colKey === "logging" ? (review ? review.scores.privacy : 0) * 10 :
                      (review ? review.scores.performance : 0) * 10;
            if (raw > maxVal) maxVal = raw;
            vals.push({ name: p.name, value: raw, color: barColors[pi] || 'var(--color-primary)' });
          }
          if (maxVal < 1) maxVal = 1;
          html += '<div><p class="text-xs font-bold text-muted-foreground mb-1.5">' + colLabels[colKey as keyof typeof colLabels] + '</p><div class="space-y-1">';
          for (var vi = 0; vi < vals.length; vi++) {
            var v = vals[vi];
            if (v) {
              var pct = (v.value / maxVal) * 100;
              html += '<div class="flex items-center gap-2">';
              html += '<span class="text-[9px] font-bold text-muted-foreground w-16 truncate">' + escapeHtml(v.name) + '</span>';
              html += '<div class="flex-1 h-3 rounded-full bg-surface-sunken border border-border/50 overflow-hidden shadow-inner">';
              html += '<div class="h-full rounded-full transition-all duration-500" style="width:' + pct + '%;background:' + v.color + '"></div></div>';
              html += '<span class="text-[9px] font-bold text-foreground w-6 text-right">' + Math.round(v.value) + '</span>';
              html += '</div>';
            }
          }
          html += '</div></div>';
        }
        html += '</div>';
        chartEl2.innerHTML = html;
      });

      /* Comparison table */
      const tableWrapper = document.createElement("div");
      tableWrapper.className =
        "overflow-x-auto rounded-3xl border border-border shadow-sm bg-surface";

      const tbl = document.createElement("table");
      tbl.className = "w-full text-left border-collapse";

      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");
      headerRow.className = "border-b border-border bg-surface-sunken/50";

      const thLabel = document.createElement("th");
      thLabel.className =
        "px-6 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground border-r border-border/50";
      thLabel.textContent = "Criteria";
      headerRow.appendChild(thLabel);

      for (const p of selected) {
        const th = document.createElement("th");
        th.className = "px-6 py-5 text-center";
        th.innerHTML = `
          <div class="flex flex-col items-center gap-3">
            <div class="h-10 w-10 rounded-xl bg-surface border border-border p-1.5 shadow-sm">
              <img src="/logos/${p.id}.svg" alt="${p.name}" class="h-full w-full object-contain" />
            </div>
            <span class="text-sm font-black tracking-tight">${escapeHtml(p.name)}</span>
          </div>
        `;
        headerRow.appendChild(th);
      }
      thead.appendChild(headerRow);
      tbl.appendChild(thead);

      const tbody = document.createElement("tbody");
      for (const row of rows) {
        const tr = document.createElement("tr");
        tr.className = "border-b border-border/50";

        const tdLabel = document.createElement("td");
        tdLabel.className = "px-6 py-4 font-bold text-foreground/90 border-r border-border/50";
        tdLabel.textContent = row.label;
        tr.appendChild(tdLabel);

        for (const p of selected) {
          const td = document.createElement("td");
          td.className = "px-6 py-4 text-center text-foreground/80";

          const val = row.values[p.id];
          const isWinner = winners[row.attribute] === p.id;

          td.innerHTML = `
            <div class="inline-flex items-center justify-center gap-2">
              <span class="text-sm font-bold ${isWinner ? "text-primary" : "text-foreground/80"}">${escapeHtml(String(val ?? "—"))}</span>
              ${isWinner ? "<span class=\"inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 border border-primary/30 text-[10px] font-black text-primary\">★</span>" : ""}
            </div>
          `;
          tr.appendChild(td);
        }

        tbody.appendChild(tr);

        const detailTr = document.createElement("tr");
        detailTr.className = "bg-surface-raised/20";
        const detailTd = document.createElement("td");
        detailTd.colSpan = selected.length + 1;
        detailTd.className = "px-6 py-0";

        detailTd.innerHTML = `
          <div class="mx-auto max-w-5xl my-4 rounded-2xl border border-border/50 bg-surface-sunken/40 p-5">
            <p class="text-sm font-black text-foreground">What this means</p>
            <p class="mt-2 text-sm text-muted-foreground leading-relaxed">${escapeHtml(getRowExplanation(row.attribute, row.label))}</p>
          </div>
        `;
        detailTr.appendChild(detailTd);
        tbody.appendChild(detailTr);
      }

      tbl.appendChild(tbody);
      tableWrapper.appendChild(tbl);
      matrix.appendChild(tableWrapper);
    }

    function escapeHtml(str: string): string {
      return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    function computeConfidence(rows: ComparisonRow[]): number {
      const keyAttrs = ["overall", "kill-switch", "servers", "torrenting", "logging", "price"];
      let supported = 0;
      for (const attr of keyAttrs) {
        if (rows.some((r) => r.attribute === attr)) supported++;
      }
      const base = Math.round((supported / keyAttrs.length) * 100);
      return Math.max(55, Math.min(96, base));
    }

    function computeRiskSummary(
      selected: Provider[],
      rows: ComparisonRow[],
    ): Array<{ title: string; detail: string; severity: "Low" | "Medium" | "High" }> {
      const killSwitchRow = rows.find((r) => r.attribute === "kill-switch");
      const torrentingRow = rows.find((r) => r.attribute === "torrenting");
      const jurisdictionRow = rows.find((r) => r.attribute === "jurisdiction");

      const risks: Array<{ title: string; detail: string; severity: "Low" | "Medium" | "High" }> = [];

      if (killSwitchRow) {
        const anyNo = selected.some((p) => String(killSwitchRow.values[p.id]).toLowerCase() === "no");
        risks.push({
          title: "Kill switch coverage",
          detail: anyNo
            ? "At least one selected provider shows weaker kill-switch coverage. Verify behavior during reconnects and app restarts."
            : "All selected providers show strong kill-switch support in this dataset.",
          severity: anyNo ? "Medium" : "Low",
        });
      }

      if (torrentingRow) {
        const anyNo = selected.some((p) => String(torrentingRow.values[p.id]).toLowerCase() === "no");
        risks.push({
          title: "Torrenting readiness",
          detail: anyNo
            ? "Some providers may not support torrenting or may discourage it. If P2P is critical, confirm labeled servers and policy clarity."
            : "Torrenting support appears consistent across selections.",
          severity: anyNo ? "Medium" : "Low",
        });
      }

      if (jurisdictionRow) {
        const anyUnclear = selected.some((p) => {
          const v = String(jurisdictionRow.values[p.id] ?? "");
          return v.trim() === "" || v.includes("—");
        });
        risks.push({
          title: "Jurisdiction clarity",
          detail: anyUnclear
            ? "One or more selections have less explicit jurisdiction labeling. For compliance-sensitive use, validate the provider’s legal stance."
            : "Jurisdiction labeling is sufficiently clear for decision-making in this dataset.",
          severity: anyUnclear ? "High" : "Low",
        });
      }

      return risks.slice(0, 3);
    }

    function computeRecommendedActions(rows: ComparisonRow[]): Array<{ action: string; rationale: string }> {
      const overallRow = rows.find((r) => r.attribute === "overall");
      const priceRow = rows.find((r) => r.attribute === "price");
      const serversRow = rows.find((r) => r.attribute === "servers");

      const actions: Array<{ action: string; rationale: string }> = [];

      if (overallRow) {
        actions.push({
          action: "Start with the overall winner",
          rationale:
            "Use the top overall score as your baseline, then validate the two criteria that matter most to your use case (privacy and performance).",
        });
      }

      if (priceRow) {
        actions.push({
          action: "Confirm effective monthly pricing",
          rationale:
            "Compare the lowest effective monthly plan, not just the headline price, to avoid budget surprises during renewal.",
        });
      }

      if (serversRow) {
        actions.push({
          action: "Validate routing flexibility",
          rationale:
            "More servers and countries can improve access and reduce congestion. If streaming is critical, test peak-hour performance before committing.",
        });
      }

      while (actions.length < 3) {
        actions.push({
          action: "Review security features",
          rationale: "Cross-check kill switch, split tunneling, and multi-hop behavior to match your threat model.",
        });
      }

      return actions.slice(0, 3);
    }

    function getRowExplanation(attribute: string, label: string): string {
      const map: Record<string, string> = {
        price: "Lower starting prices can improve adoption, but always compare effective monthly cost across plan cycles.",
        "money-back": "A money-back guarantee reduces purchase risk and is especially valuable when you’re testing streaming or device compatibility.",
        "free-tier": "A free tier can be useful for short validation, but evaluate limitations and whether key security features are included.",
        jurisdiction: "Jurisdiction affects legal exposure. Prefer providers with clear, privacy-friendly legal stances for sensitive use.",
        logging: "Logging policy is a core privacy signal. No-logs policies generally reduce the risk of data retention.",
        audits: "Independent audits increase trust by verifying claims through third-party review.",
        servers: "More servers can improve routing flexibility and reduce congestion, especially for streaming.",
        countries: "Broader country coverage can improve access to region-specific content and failover options.",
        connections: "Device limits matter for households and teams. Unlimited is typically more predictable for multi-device use.",
        "kill-switch": "A kill switch helps prevent traffic leaks if the VPN connection drops.",
        "split-tunneling": "Split tunneling can improve usability by routing only selected traffic through the VPN.",
        "multi-hop": "Multi-hop can add defense-in-depth but may reduce speed depending on routing.",
        torrenting: "Torrenting support determines whether P2P is allowed and how reliably it works.",
        overall: "Overall score blends multiple criteria into a single decision signal. Use it as a starting point, not the only factor.",
      };
      return map[attribute] ?? `This criterion (${label}) helps differentiate providers for your specific needs.`;
    }

    /* Init — select first 2 providers by default */
    selectedIds = allProviders.slice(0, Math.min(2, allProviders.length)).map((p) => p.id);
    render();
}
