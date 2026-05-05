const data = window.PUREFLOW_LEADS;

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "Mini Route Guide", label: "Mini Route Guide", icon: "route" },
  { id: "A Walk First", label: "A Walk First", icon: "target" },
  { id: "B Review Route Fill", label: "B Review", icon: "review" },
  { id: "Sandy to Nephi Corridor", label: "Sandy to Nephi", icon: "corridor" },
  { id: "Salt Lake Suburb Add-Ons", label: "SLC Suburbs", icon: "map" },
  { id: "Davis County Add-Ons", label: "Davis Add-Ons", icon: "plus" },
  { id: "Gyms Sports Indoor Golf", label: "Gyms / Golf", icon: "activity" },
  { id: "Offices CPA Coworking", label: "Offices / CPA", icon: "office" },
  { id: "Credit Proxy Check", label: "Credit Proxy", icon: "credit" },
  { id: "C Low Verify", label: "Low / Verify", icon: "verify" },
  { id: "Sources", label: "Sources", icon: "source" },
];

const tableColumns = [
  "priority_rank",
  "lead_score",
  "priority_tier",
  "financial_quality_score",
  "financial_quality_tier",
  "recommended_terms",
  "city",
  "business_name",
  "category",
  "sales_segment",
  "address",
  "phone",
  "website",
  "decision_access",
  "water_cooler_fit",
  "pitch_angle",
  "credit_proxy_notes",
  "risk_flags",
  "source_url",
];

const creditProxyColumns = [
  "financial_quality_score",
  "financial_quality_tier",
  "recommended_terms",
  "priority_tier",
  "lead_score",
  "city",
  "business_name",
  "sales_segment",
  "address",
  "phone",
  "website",
  "credit_proxy_notes",
  "risk_flags",
  "source_url",
];

const state = {
  view: "dashboard",
  search: "",
  city: "All",
  segment: "All",
  tier: "All",
  crmStatus: "All",
  crmGuideOpen: false,
  minScore: 0,
};

const CRM_STORAGE_KEY = "pureflow_lead_command_crm_v1";
const crmStatuses = [
  "Not Contacted",
  "Knocked",
  "Contacted",
  "Interested",
  "Callback",
  "Quoted",
  "Won",
  "Lost",
  "Bad Fit",
];

const els = {
  navList: document.getElementById("navList"),
  viewRoot: document.getElementById("viewRoot"),
  searchInput: document.getElementById("searchInput"),
  cityFilter: document.getElementById("cityFilter"),
  segmentFilter: document.getElementById("segmentFilter"),
  tierFilter: document.getElementById("tierFilter"),
  scoreFilter: document.getElementById("scoreFilter"),
  scoreOutput: document.getElementById("scoreOutput"),
  resetFilters: document.getElementById("resetFilters"),
  crmModeAction: document.getElementById("crmModeAction"),
  crmGuideAction: document.getElementById("crmGuideAction"),
  topExportAction: document.getElementById("topExportAction"),
  drawer: document.getElementById("leadDrawer"),
  drawerContent: document.getElementById("drawerContent"),
  drawerClose: document.getElementById("drawerClose"),
  drawerBackdrop: document.getElementById("drawerBackdrop"),
};

function formatNumber(value) {
  return Number(value || 0).toLocaleString();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b)));
}

function iconSvg(name) {
  const icons = {
    dashboard: '<path d="M4 13h6V4H4v9Zm10 7h6V4h-6v16ZM4 20h6v-4H4v4Z"/>',
    route: '<path d="M5 6.5a2.5 2.5 0 1 1 4.2 1.83L5 13l-4.2-4.67A2.5 2.5 0 0 1 5 6.5ZM19 17.5a2.5 2.5 0 1 1 4.2 1.83L19 24l-4.2-4.67A2.5 2.5 0 0 1 19 17.5Z" transform="scale(.82) translate(0 -2)"/><path d="M8 14c4 0 8-4 12-4M8 17c4 0 8 4 12 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    target: '<path d="M12 3a9 9 0 1 0 9 9h-3a6 6 0 1 1-6-6V3Z"/><path d="M12 8a4 4 0 1 0 4 4h-3a1 1 0 1 1-1-1V8Z"/><path d="M13 3h8v3h-5v5h-3V3Z"/>',
    review: '<path d="M5 4h14v16H5V4Zm3 4h8M8 12h8M8 16h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    corridor: '<path d="M4 18c4-7 12-5 16-12M4 7c5 2 10 8 16 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="4" cy="18" r="2"/><circle cx="20" cy="6" r="2"/>',
    plus: '<path d="M12 4v16M4 12h16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
    activity: '<path d="M4 13h4l2-7 4 14 2-7h4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
    office: '<path d="M5 20V5h9v15M14 9h5v11M8 8h3M8 12h3M8 16h3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    verify: '<path d="M5 12l4 4L19 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>',
    source: '<path d="M6 5h12v14H6V5Zm3 4h6M9 13h6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    credit: '<path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8.5 12.2 11 14.7l4.8-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
    crm: '<path d="M4 7h16v13H4V7Zm4 0V5h8v2" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8 12h8M8 16h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    water: '<path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 15c1.2 1.1 3.8 1.1 6 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    filter: '<path d="M4 5h16l-6 7v5l-4 2v-7L4 5Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    map: '<path d="M9 18 4 20V6l5-2 6 2 5-2v14l-5 2-6-2Zm0 0V4m6 16V6" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.dashboard}</svg>`;
}

function normalizeKey(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function leadId(row) {
  const raw = [row.business_name, row.city, row.address, row.source_url].map(normalizeKey).join("|");
  let hash = 0;
  for (let index = 0; index < raw.length; index++) {
    hash = (hash * 31 + raw.charCodeAt(index)) >>> 0;
  }
  return `pf_${hash.toString(36)}`;
}

function loadCrmState() {
  try {
    return JSON.parse(window.localStorage.getItem(CRM_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

let crmState = loadCrmState();

function saveCrmState() {
  window.localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(crmState));
}

function crmRecord(row) {
  return crmState[leadId(row)] || {
    status: "Not Contacted",
    owner: "",
    followUp: "",
    notes: [],
    updatedAt: "",
  };
}

function updateCrmRecord(row, patch) {
  const id = leadId(row);
  crmState[id] = {
    ...crmRecord(row),
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  saveCrmState();
  return crmState[id];
}

function sheetRows(sheetName) {
  return data.sheets[sheetName] || [];
}

function isLeadRow(row) {
  return Boolean(row.business_name || row.Business || row.source_url);
}

function leadPoolForView(view = state.view) {
  if (view === "dashboard" || view === "Mini Route Guide") return data.allLeads;
  if (view === "Sources") return sheetRows("Sources");
  return sheetRows(view).filter(isLeadRow);
}

function applyFilters(rows) {
  return rows.filter((row) => {
    const text = [
      row.business_name,
      row.city,
      row.sales_segment,
      row.category,
      row.address,
      row.priority_tier,
      row.financial_quality_tier,
      row.recommended_terms,
      row.route_zone,
    ]
      .join(" ")
      .toLowerCase();
    const score = Number(row.lead_score || 0);
    return (
      (!state.search || text.includes(state.search.toLowerCase())) &&
      (state.city === "All" || row.city === state.city) &&
      (state.segment === "All" || row.sales_segment === state.segment) &&
      (state.tier === "All" || row.priority_tier === state.tier) &&
      score >= state.minScore
    );
  });
}

function countBy(rows, key) {
  const counts = new Map();
  rows.forEach((row) => {
    const value = row[key] || "Blank";
    counts.set(value, (counts.get(value) || 0) + 1);
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function formatShortDate(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function downloadCsv(filename, rows) {
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(link.href);
  link.remove();
}

function navCount(item) {
  if (item.id === "dashboard") return data.allLeads.length;
  return sheetRows(item.id).length;
}

function renderNav() {
  els.crmModeAction.classList.toggle("active", state.view === "CRM Mode");
  els.crmGuideAction.classList.toggle("active", state.view === "CRM Mode" && state.crmGuideOpen);
  els.navList.innerHTML = navItems
    .map((item) => {
      const active = item.id === state.view ? " active" : "";
      return `
        <button class="nav-button${active}" type="button" data-view="${escapeHtml(item.id)}">
          <span class="nav-icon">${iconSvg(item.icon)}</span>
          <span class="nav-label">${escapeHtml(item.label)}</span>
          <span class="nav-count">${formatNumber(navCount(item))}</span>
        </button>
      `;
    })
    .join("");
}

function fillSelect(select, values, current) {
  select.innerHTML = ["All", ...values]
    .map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`)
    .join("");
  select.value = current;
}

function initFilters() {
  fillSelect(els.cityFilter, unique(data.allLeads.map((row) => row.city)), state.city);
  fillSelect(els.segmentFilter, unique(data.allLeads.map((row) => row.sales_segment)), state.segment);
  fillSelect(els.tierFilter, unique(data.allLeads.map((row) => row.priority_tier)), state.tier);
}

function kpiCards(rows) {
  const a = rows.filter((row) => row.priority_tier === "A - Walk First").length;
  const b = rows.filter((row) => row.priority_tier === "B - Review / Route Fill").length;
  const gym = rows.filter((row) =>
    ["Gym / Fitness", "Indoor Golf", "Pickleball / Indoor Sports"].includes(row.sales_segment),
  ).length;
  const offices = rows.filter((row) =>
    ["Coworking / Office Space", "Accounting / CPA"].includes(row.sales_segment),
  ).length;
  const strongStability = rows.filter((row) => row.financial_quality_tier === "A - Strong Stability").length;
  const cautionTerms = rows.filter((row) =>
    ["C - Deposit / Autopay Recommended", "D - Verify Before Quote"].includes(row.financial_quality_tier),
  ).length;
  const avgScore = rows.length
    ? Math.round(rows.reduce((sum, row) => sum + Number(row.lead_score || 0), 0) / rows.length)
    : 0;
  const cards = [
    [rows.length, "Filtered prospects", "Live count after search and filters", "filter"],
    [a, "A walk-first", "Best fit for door knocking", "target"],
    [b, "B route-fill", "Good leads near the route", "route"],
    [gym + offices, "New scope wins", "Gyms, indoor golf, Picklr, offices, CPA", "activity"],
    [strongStability, "Strong stability", "Best public-footprint proxy tier", "credit"],
    [cautionTerms, "Terms caution", "Deposit, autopay, or verify first", "verify"],
    [avgScore, "Average score", "Quality of visible route pool", "dashboard"],
  ];
  return `<div class="kpi-grid">${cards
    .map(
      ([value, label, note, icon]) => `
        <div class="kpi-card">
          <div class="kpi-icon">${iconSvg(icon)}</div>
          <div>
            <span class="kpi-value">${formatNumber(value)}</span>
            <div class="kpi-label">${escapeHtml(label)}</div>
            <p class="kpi-note">${escapeHtml(note)}</p>
          </div>
        </div>
      `,
    )
    .join("")}</div>`;
}

function routeStats(rows) {
  const routeCount = new Set(rows.map((row) => row.mini_route_group).filter(Boolean)).size;
  const cities = new Set(rows.map((row) => row.city).filter(Boolean)).size;
  const strongSegments = rows.filter((row) =>
    ["Pickleball / Indoor Sports", "Indoor Golf", "Gym / Fitness", "Coworking / Office Space", "Accounting / CPA"].includes(row.sales_segment),
  ).length;
  return [
    ["Visible routes", routeCount],
    ["Cities", cities],
    ["New-scope targets", strongSegments],
  ];
}

function waterSystemCard(rows) {
  const a = rows.filter((row) => row.priority_tier === "A - Walk First").length;
  const b = rows.filter((row) => row.priority_tier === "B - Review / Route Fill").length;
  const total = Math.max(rows.length, 1);
  const aPct = Math.round((a / total) * 100);
  const bPct = Math.round((b / total) * 100);
  return `
    <section class="panel system-panel">
      <div class="panel-head">
        <div>
          <h2 class="panel-title">Commercial Cooler Fit</h2>
          <p class="panel-subtitle">Visual read on the filtered lead pool.</p>
        </div>
        <div class="panel-mark">${iconSvg("water")}</div>
      </div>
      <div class="cooler-visual" aria-label="Commercial cooler fit">
        <div class="cooler-tower">
          <div class="cooler-slot"></div>
          <div class="cooler-drop"></div>
          <div class="cooler-base"></div>
        </div>
        <div class="cooler-copy">
          <span class="field-label">Route quality mix</span>
          <strong>${aPct}% A-fit</strong>
          <p>Prioritize walk-in-ready operators, then fill with nearby B leads while the rep is already in the area.</p>
        </div>
      </div>
      <div class="quality-bars">
        <div>
          <span>A Lead Concentration</span>
          <div class="bar-track"><div class="bar-fill" style="width:${aPct}%"></div></div>
        </div>
        <div>
          <span>B Fill-In Coverage</span>
          <div class="bar-track"><div class="bar-fill secondary" style="width:${bPct}%"></div></div>
        </div>
      </div>
    </section>
  `;
}

function fieldPlaybook(rows) {
  const stats = routeStats(rows);
  return `
    <section class="panel playbook-panel">
      <div class="panel-head">
        <div>
          <h2 class="panel-title">Field Playbook</h2>
          <p class="panel-subtitle">Same logic as the workbook, tuned for the rep.</p>
        </div>
      </div>
      <div class="playbook-grid">
        ${stats
          .map(
            ([label, value]) => `
              <div class="playbook-stat">
                <strong>${formatNumber(value)}</strong>
                <span>${escapeHtml(label)}</span>
              </div>
            `,
          )
          .join("")}
      </div>
      <ol class="playbook-steps">
        <li><span>01</span><strong>Open the route guide</strong><p>Pick a city or zone before drilling into individual businesses.</p></li>
        <li><span>02</span><strong>Knock A leads first</strong><p>Owner-operated, high-water-use businesses with the clearest close path.</p></li>
        <li><span>03</span><strong>Use B leads as fill</strong><p>Still good prospects, but verify manager access or buying authority.</p></li>
      </ol>
    </section>
  `;
}

function segmentTileGrid(rows) {
  const items = countBy(rows, "sales_segment").slice(0, 6);
  const total = Math.max(rows.length, 1);
  return `
    <section class="panel segment-tile-panel">
      <div class="panel-head">
        <div>
          <h2 class="panel-title">Prospect Mix</h2>
          <p class="panel-subtitle">Grid view of the strongest current buckets.</p>
        </div>
      </div>
      <div class="segment-tile-grid">
        ${items
          .map(([segment, count], index) => {
            const pct = Math.round((count / total) * 100);
            return `
              <button class="segment-tile tone-${index + 1}" type="button" data-segment="${escapeHtml(segment)}">
                <span class="segment-index">${String(index + 1).padStart(2, "0")}</span>
                <strong>${escapeHtml(segment)}</strong>
                <span>${count} leads · ${pct}% of view</span>
              </button>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function routeMatrix(rows) {
  if (!rows.length) return "";
  const preferredSegments = [
    "Gym / Fitness",
    "Indoor Golf",
    "Pickleball / Indoor Sports",
    "Medical / Med Spa",
    "Accounting / CPA",
    "Coworking / Office Space",
    "Salon / Beauty",
    "Auto / Blue Collar",
  ];
  const rankedSegments = [
    ...preferredSegments.filter((segment) => rows.some((row) => row.sales_segment === segment)),
    ...countBy(rows, "sales_segment").map(([segment]) => segment),
  ];
  const segments = rankedSegments.filter((segment, index) => segment && rankedSegments.indexOf(segment) === index).slice(0, 5);
  const cities = countBy(rows, "city")
    .slice(0, 7)
    .map(([city]) => city);
  return `
    <section class="panel route-matrix-panel">
      <div class="panel-head">
        <div>
          <h2 class="panel-title">Route Matrix</h2>
          <p class="panel-subtitle">Top city and segment intersections for fast territory planning.</p>
        </div>
        <div class="panel-mark">${iconSvg("map")}</div>
      </div>
      <div class="route-matrix-grid" style="--matrix-cols:${segments.length}">
        <div class="matrix-head">City</div>
        ${segments.map((segment) => `<div class="matrix-head">${escapeHtml(segment)}</div>`).join("")}
        ${cities
          .map(
            (city) => `
              <div class="matrix-city">${escapeHtml(city)}</div>
              ${segments
                .map((segment) => {
                  const cellRows = rows.filter((row) => row.city === city && row.sales_segment === segment);
                  const aRows = cellRows.filter((row) => row.priority_tier === "A - Walk First").length;
                  return `
                    <button class="matrix-cell" type="button" data-city="${escapeHtml(city)}">
                      <strong>${cellRows.length}</strong>
                      <span>${aRows} A</span>
                    </button>
                  `;
                })
                .join("")}
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function financialQualityPanel(rows) {
  const counts = countBy(rows, "financial_quality_tier");
  const max = Math.max(...counts.map(([, count]) => count), 1);
  return `
    <section class="panel financial-panel">
      <div class="panel-head">
        <div>
          <h2 class="panel-title">Stability / Credit Proxy</h2>
          <p class="panel-subtitle">Public-footprint terms guidance, not a bureau credit report.</p>
        </div>
        <div class="panel-mark">${iconSvg("credit")}</div>
      </div>
      <div class="chart-list">
        ${counts
          .map(
            ([label, count]) => `
              <div class="bar-row">
                <div class="bar-label">${escapeHtml(label)}</div>
                <div class="bar-track"><div class="bar-fill" style="width:${Math.round((count / max) * 100)}%"></div></div>
                <div class="bar-count">${count}</div>
              </div>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function segmentBars(rows) {
  const counts = countBy(rows, "sales_segment").slice(0, 10);
  const max = Math.max(...counts.map(([, count]) => count), 1);
  return `
    <div class="panel">
      <div class="panel-head">
        <div>
          <h2 class="panel-title">Segment Heat</h2>
          <p class="panel-subtitle">Where the water-cooler use case is densest.</p>
        </div>
      </div>
      <div class="chart-list">
        ${counts
          .map(
            ([label, count]) => `
              <div class="bar-row">
                <div class="bar-label">${escapeHtml(label)}</div>
                <div class="bar-track"><div class="bar-fill" style="width:${Math.round((count / max) * 100)}%"></div></div>
                <div class="bar-count">${count}</div>
              </div>
            `,
          )
          .join("")}
      </div>
    </div>`;
}

function cityPriority(rows) {
  const counts = countBy(rows, "city").slice(0, 14);
  return `
    <div class="panel">
      <div class="panel-head">
        <div>
          <h2 class="panel-title">City Density</h2>
          <p class="panel-subtitle">Use these as route anchors.</p>
        </div>
      </div>
      <div class="city-list">
        ${counts
          .map(
            ([city, count]) => `
              <button class="city-row" type="button" data-city="${escapeHtml(city)}">
                <strong>${escapeHtml(city)}</strong>
                <span>${count} leads</span>
              </button>
            `,
          )
          .join("")}
      </div>
    </div>`;
}

function topRoutes() {
  const routes = sheetRows("Mini Route Guide")
    .slice()
    .sort((a, b) => Number(b["A Leads"] || 0) - Number(a["A Leads"] || 0))
    .slice(0, 8);
  return `
    <div class="panel top-routes-panel">
      <div class="panel-head">
        <div>
          <h2 class="panel-title">Best Mini Routes</h2>
          <p class="panel-subtitle">A-lead heavy areas to work first.</p>
        </div>
      </div>
      <div class="route-grid">
        ${routes
          .map(
            (route) => `
              <button class="route-card" type="button" data-city="${escapeHtml(route.City)}">
                <div class="badge-line">
                  <span class="pill a">${route["A Leads"] || 0} A</span>
                  <span class="pill b">${route["B Leads"] || 0} B</span>
                  <span class="pill">${escapeHtml(route["Route Zone"] || "")}</span>
                </div>
                <strong>${escapeHtml(route.City || "")}</strong>
                <span>${escapeHtml(route["Top Segments"] || "")}</span>
              </button>
            `,
          )
          .join("")}
      </div>
    </div>`;
}

function renderDashboard() {
  const rows = applyFilters(data.allLeads);
  const aCount = rows.filter((row) => row.priority_tier === "A - Walk First").length;
  const routeCount = new Set(rows.map((row) => row.mini_route_group).filter(Boolean)).size;
  els.viewRoot.innerHTML = `
    <section class="panel hero-panel command-hero">
      <div>
        <p class="eyebrow">Commercial hydration targets</p>
        <h2>Route-ready prospects for offices, gyms, lounges, shops, and clinics.</h2>
        <p>
          This dashboard turns the workbook into field mode: start with A leads, use B leads as
          nearby fill-in, and click any row for pitch angle, map link, source, and risk flags.
        </p>
        <div class="drawer-actions">
          <button class="primary-action" type="button" data-view-jump="Mini Route Guide">Open route guide</button>
          <button class="ghost-action" type="button" data-view-jump="A Walk First">Start A leads</button>
        </div>
      </div>
      <div class="route-focus">
        <div class="route-chip"><strong>${formatNumber(aCount)}</strong><span>A leads currently visible</span></div>
        <div class="route-chip"><strong>${formatNumber(routeCount)}</strong><span>mini route groups</span></div>
        <div class="route-chip"><strong>Own it</strong><span>Replace jug/bottle systems with PureFlow commercial coolers</span></div>
      </div>
    </section>
    ${kpiCards(rows)}
    <div class="dashboard-mosaic">
      ${waterSystemCard(rows)}
      ${fieldPlaybook(rows)}
      ${financialQualityPanel(rows)}
      ${segmentTileGrid(rows)}
      ${routeMatrix(rows)}
      ${topRoutes()}
      ${segmentBars(rows)}
      ${cityPriority(rows)}
    </div>
  `;
}

function crmRows() {
  const filtered = applyFilters(data.allLeads);
  const rows = state.crmStatus === "All"
    ? filtered
    : filtered.filter((row) => crmRecord(row).status === state.crmStatus);
  return rows.slice().sort((a, b) => {
    const ar = crmRecord(a);
    const br = crmRecord(b);
    const aDue = ar.followUp || "9999-12-31";
    const bDue = br.followUp || "9999-12-31";
    return (
      aDue.localeCompare(bDue) ||
      String(ar.status).localeCompare(String(br.status)) ||
      Number(b.lead_score || 0) - Number(a.lead_score || 0)
    );
  });
}

function crmSummary(rows) {
  const touched = rows.filter((row) => crmRecord(row).status !== "Not Contacted" || crmRecord(row).notes.length).length;
  const dueToday = rows.filter((row) => {
    const record = crmRecord(row);
    return record.followUp && record.followUp <= todayIso() && !["Won", "Lost", "Bad Fit"].includes(record.status);
  }).length;
  const pipeline = rows.filter((row) => ["Interested", "Callback", "Quoted"].includes(crmRecord(row).status)).length;
  const won = rows.filter((row) => crmRecord(row).status === "Won").length;
  return [
    [touched, "Touched leads", "Rows with notes or status updates", "crm"],
    [dueToday, "Due now", "Follow-ups due today or earlier", "verify"],
    [pipeline, "Active pipeline", "Interested, callback, or quoted", "target"],
    [won, "Won", "Closed wins tracked locally", "credit"],
  ];
}

function crmGuide() {
  const steps = [
    ["01", "Find Lead", "Use search, city, segment, or route filters. Click the business row.", "target"],
    ["02", "Set Status", "Pick the real outcome: Knocked, Interested, Callback, Quoted, Won, Lost, or Bad Fit.", "crm"],
    ["03", "Add Next Step", "Type rep name. Add follow-up date if anyone needs a callback.", "verify"],
    ["04", "Write Note", "One sentence is enough: who you talked to, water setup, next move.", "review"],
    ["05", "Save", "Press Save CRM Update before closing the lead drawer.", "credit"],
  ];
  const statuses = [
    ["Not Contacted", "Nobody has worked it yet."],
    ["Knocked", "Stopped by. Use if no buyer yet."],
    ["Interested", "They might buy. Add details."],
    ["Callback", "Needs a date. Do not leave blank."],
    ["Quoted", "Quote sent or pricing discussed."],
    ["Won", "Sold. Nice."],
    ["Lost / Bad Fit", "Done for now. Add why."],
  ];
  return `
    <section class="panel crm-guide-panel${state.crmGuideOpen ? "" : " collapsed"}" data-crm-guide>
      <div class="panel-head">
        <div>
          <h2 class="panel-title">CRM Mode Quick Guide</h2>
          <p class="panel-subtitle">Simple field workflow for reps. Five clicks, then move on.</p>
        </div>
      </div>
      <div class="guide-flow">
        ${steps
          .map(
            ([num, title, copy, icon]) => `
              <div class="guide-step">
                <div class="guide-art">
                  <span>${num}</span>
                  ${iconSvg(icon)}
                </div>
                <strong>${escapeHtml(title)}</strong>
                <p>${escapeHtml(copy)}</p>
              </div>
            `,
          )
          .join("")}
      </div>
      <div class="guide-board">
        <div class="guide-phone">
          <div class="guide-row"><span>A</span><strong>Business Row</strong><em>Click lead</em></div>
          <div class="guide-panel-mini">
            <span>Status</span>
            <strong>Callback</strong>
            <span>Rep</span>
            <strong>Ben</strong>
            <span>Date</span>
            <strong>${todayIso()}</strong>
          </div>
          <div class="guide-note-card">Note: talked to manager, has jug water, call Friday.</div>
        </div>
        <div class="guide-rules">
          <h3>Status Cheat Sheet</h3>
          <div class="status-cheat-grid">
            ${statuses
              .map(
                ([status, meaning]) => `
                  <div>
                    <span class="pill ${status === "Interested" || status === "Quoted" || status === "Won" ? "a" : status === "Callback" || status === "Knocked" ? "b" : "c"}">${escapeHtml(status)}</span>
                    <p>${escapeHtml(meaning)}</p>
                  </div>
                `,
              )
              .join("")}
          </div>
          <div class="guide-do-list">
            <strong>Rep rules</strong>
            <p>Never leave a good lead with no next step. Callback always needs a date. Notes should say who, current water, and next action.</p>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderCrmMode() {
  const rows = crmRows();
  const summaryRows = applyFilters(data.allLeads);
  els.viewRoot.innerHTML = `
    <section class="panel crm-command-panel">
      <div class="panel-head">
        <div>
          <h2 class="panel-title">CRM Mode</h2>
          <p class="panel-subtitle">Local notes, status, follow-ups, and export tools for this browser.</p>
        </div>
        <div class="drawer-actions crm-actions">
          <button class="primary-action" type="button" data-export="twenty">Twenty import CSV</button>
        </div>
      </div>
      <div class="crm-alert">
        Local CRM data is saved in this browser only. Use the Supabase setup below when you want shared team notes.
      </div>
      <div class="kpi-grid crm-kpis">
        ${crmSummary(summaryRows)
          .map(
            ([value, label, note, icon]) => `
              <div class="kpi-card">
                <div class="kpi-icon">${iconSvg(icon)}</div>
                <div>
                  <span class="kpi-value">${formatNumber(value)}</span>
                  <div class="kpi-label">${escapeHtml(label)}</div>
                  <p class="kpi-note">${escapeHtml(note)}</p>
                </div>
              </div>
            `,
          )
          .join("")}
      </div>
    </section>
    ${crmGuide()}
    <section class="panel table-panel">
      <div class="table-toolbar">
        <div>
          <h2 class="panel-title">Rep Work Queue</h2>
          <p class="panel-subtitle">${formatNumber(rows.length)} visible CRM rows after filters</p>
        </div>
        <label class="crm-status-filter">
          <span>Status</span>
          <select data-crm-status-filter>
            ${["All", ...crmStatuses].map((status) => `<option value="${escapeHtml(status)}"${status === state.crmStatus ? " selected" : ""}>${escapeHtml(status)}</option>`).join("")}
          </select>
        </label>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Follow-Up</th>
              <th>Owner</th>
              <th>Lead</th>
              <th>Credit Proxy</th>
              <th>City</th>
              <th>Business</th>
              <th>Segment</th>
              <th>Last Note</th>
            </tr>
          </thead>
          <tbody>
            ${rows
              .map((row, index) => {
                const record = crmRecord(row);
                const lastNote = record.notes[0]?.text || "";
                return `
                  <tr data-row-index="${index}">
                    <td>${tableCell("crm_status", record.status)}</td>
                    <td>${escapeHtml(formatShortDate(record.followUp) || "Not set")}</td>
                    <td>${escapeHtml(record.owner || "Unassigned")}</td>
                    <td>${tableCell("priority_tier", row.priority_tier)} ${tableCell("lead_score", row.lead_score)}</td>
                    <td>${tableCell("financial_quality_tier", row.financial_quality_tier)} ${tableCell("financial_quality_score", row.financial_quality_score)}</td>
                    <td>${escapeHtml(row.city)}</td>
                    <td><strong>${escapeHtml(row.business_name)}</strong><br><span class="muted-line">${escapeHtml(row.address || "Address not listed")}</span></td>
                    <td>${escapeHtml(row.sales_segment)}</td>
                    <td>${escapeHtml(lastNote.slice(0, 130))}</td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
  [...els.viewRoot.querySelectorAll("tbody tr")].forEach((tr) => {
    tr.addEventListener("click", () => openDrawer(rows[Number(tr.dataset.rowIndex)]));
  });
}

function columnLabel(key) {
  return key
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace("Url", "URL")
    .replace("Cpa", "CPA");
}

function scoreClass(score) {
  const numeric = Number(score || 0);
  if (numeric >= 88) return "";
  if (numeric >= 70) return " mid";
  return " low";
}

function financialScoreClass(score) {
  const numeric = Number(score || 0);
  if (numeric >= 82) return "";
  if (numeric >= 70) return " mid";
  return " low";
}

function tableCell(key, value) {
  if (key === "lead_score") {
    return `<span class="score-dot${scoreClass(value)}">${escapeHtml(value)}</span>`;
  }
  if (key === "financial_quality_score") {
    return `<span class="score-dot${financialScoreClass(value)}">${escapeHtml(value)}</span>`;
  }
  if (String(key).includes("url") || key === "website") {
    if (!value) return "";
    return `<a href="${escapeHtml(value)}" target="_blank" rel="noreferrer">${escapeHtml(String(value).replace(/^https?:\/\//, "").slice(0, 46))}</a>`;
  }
  if (key === "priority_tier" || key === "financial_quality_tier" || key === "crm_status") {
    const cls = String(value).startsWith("A") || ["Interested", "Quoted", "Won"].includes(value)
      ? "a"
      : String(value).startsWith("B") || ["Knocked", "Contacted", "Callback"].includes(value)
        ? "b"
        : "c";
    return `<span class="pill ${cls}">${escapeHtml(value)}</span>`;
  }
  return escapeHtml(value);
}

function renderTable(title, rows, columns = tableColumns, subtitle = "") {
  const filtered = applyFilters(rows);
  if (!filtered.length) {
    els.viewRoot.innerHTML = `
      <div class="empty-state">
        <strong>No leads match the current filters.</strong><br />
        Reset filters or lower the score threshold.
      </div>
    `;
    return;
  }
  els.viewRoot.innerHTML = `
    <section class="panel table-panel">
      <div class="table-toolbar">
        <div>
          <h2 class="panel-title">${escapeHtml(title)}</h2>
          <p class="panel-subtitle">${escapeHtml(subtitle || `${formatNumber(filtered.length)} visible rows`)}</p>
        </div>
        <span class="pill">${formatNumber(filtered.length)} rows</span>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>${columns.map((column) => `<th>${escapeHtml(columnLabel(column))}</th>`).join("")}</tr>
          </thead>
          <tbody>
            ${filtered
              .map(
                (row, index) => `
                  <tr data-row-index="${index}">
                    ${columns.map((column) => `<td>${tableCell(column, row[column])}</td>`).join("")}
                  </tr>
                `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
  [...els.viewRoot.querySelectorAll("tbody tr")].forEach((tr) => {
    tr.addEventListener("click", (event) => {
      if (event.target.closest("a")) return;
      openDrawer(filtered[Number(tr.dataset.rowIndex)]);
    });
  });
}

function renderRouteGuide() {
  const routes = sheetRows("Mini Route Guide").filter((route) => {
    const text = Object.values(route).join(" ").toLowerCase();
    return (
      (!state.search || text.includes(state.search.toLowerCase())) &&
      (state.city === "All" || route.City === state.city)
    );
  });
  renderTable(
    "Mini Route Guide",
    routes.map((route) => ({
      ...route,
      business_name: route.City,
      city: route.City,
      lead_score: Number(route["A Leads"] || 0) + Number(route["B Leads"] || 0),
    })),
    ["Route Zone", "City", "A Leads", "B Leads", "Total", "Top Segments", "Best First Stops", "Route Note"],
    "Grouped by route zone and city for door knocking simplicity.",
  );
}

function renderSources() {
  const rows = sheetRows("Sources");
  renderTable("Sources", rows, ["Source", "How Used", "Link"], "Where the dashboard and expanded workbook data came from.");
}

function renderCreditProxy() {
  renderTable(
    "Credit Proxy Check",
    leadPoolForView("Credit Proxy Check"),
    creditProxyColumns,
    "Public-footprint stability proxy for sales terms. Not a paid bureau credit report.",
  );
}

function renderView() {
  renderNav();
  if (state.view === "dashboard") renderDashboard();
  else if (state.view === "CRM Mode") renderCrmMode();
  else if (state.view === "Mini Route Guide") renderRouteGuide();
  else if (state.view === "Credit Proxy Check") renderCreditProxy();
  else if (state.view === "Sources") renderSources();
  else renderTable(state.view, leadPoolForView(state.view));
  bindViewActions();
}

function crmExportRows() {
  return data.allLeads.map((row) => {
    const record = crmRecord(row);
    return { row, record, id: leadId(row) };
  });
}

function exportCrmNotes() {
  const header = [
    "lead_id",
    "business_name",
    "city",
    "sales_segment",
    "status",
    "owner",
    "follow_up",
    "updated_at",
    "latest_note",
    "all_notes",
    "lead_score",
    "priority_tier",
    "financial_quality_tier",
    "recommended_terms",
    "address",
    "phone",
    "website",
  ];
  const rows = crmExportRows().map(({ row, record, id }) => [
    id,
    row.business_name,
    row.city,
    row.sales_segment,
    record.status,
    record.owner,
    record.followUp,
    record.updatedAt,
    record.notes[0]?.text || "",
    record.notes.map((note) => `${note.createdAt}: ${note.text}`).join(" | "),
    row.lead_score,
    row.priority_tier,
    row.financial_quality_tier,
    row.recommended_terms,
    row.address,
    row.phone,
    row.website,
  ]);
  downloadCsv(`pureflow-crm-notes-${todayIso()}.csv`, [header, ...rows]);
}

function exportTwentyCsv() {
  const header = [
    "Name",
    "Domain Name",
    "Phone",
    "Address",
    "City",
    "Lead Score",
    "Priority Tier",
    "Financial Quality Tier",
    "Recommended Terms",
    "Sales Segment",
    "CRM Status",
    "Assigned Owner",
    "Follow Up Date",
    "Pitch Angle",
    "Notes",
    "Source URL",
  ];
  const rows = crmExportRows().map(({ row, record }) => [
    row.business_name,
    row.website ? String(row.website).replace(/^https?:\/\//, "").split("/")[0] : "",
    row.phone,
    row.address,
    row.city,
    row.lead_score,
    row.priority_tier,
    row.financial_quality_tier,
    row.recommended_terms,
    row.sales_segment,
    record.status,
    record.owner,
    record.followUp,
    row.pitch_angle,
    record.notes.map((note) => `${note.createdAt}: ${note.text}`).join(" | "),
    row.source_url,
  ]);
  downloadCsv(`pureflow-twenty-import-${todayIso()}.csv`, [header, ...rows]);
}

function bindViewActions() {
  els.viewRoot.querySelectorAll("[data-crm-guide-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      state.crmGuideOpen = !state.crmGuideOpen;
      renderView();
    });
  });
  els.viewRoot.querySelectorAll("[data-export]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.export === "crm-notes") exportCrmNotes();
      if (button.dataset.export === "twenty") exportTwentyCsv();
    });
  });
  els.viewRoot.querySelectorAll("[data-crm-status-filter]").forEach((select) => {
    select.addEventListener("change", () => {
      state.crmStatus = select.value;
      renderView();
    });
  });
  els.viewRoot.querySelectorAll("[data-view-jump]").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.viewJump;
      renderView();
    });
  });
  els.viewRoot.querySelectorAll("[data-city]").forEach((button) => {
    button.addEventListener("click", () => {
      state.city = button.dataset.city;
      els.cityFilter.value = state.city;
      state.view = "A Walk First";
      renderView();
    });
  });
  els.viewRoot.querySelectorAll("[data-segment]").forEach((button) => {
    button.addEventListener("click", () => {
      state.segment = button.dataset.segment;
      els.segmentFilter.value = state.segment;
      state.view = "A Walk First";
      renderView();
    });
  });
}

function renderNoteList(record) {
  if (!record.notes.length) {
    return '<div class="crm-empty-note">No notes yet.</div>';
  }
  return record.notes
    .slice(0, 8)
    .map(
      (note, index) => `
        <div class="crm-note" data-note-index="${index}">
          <div class="crm-note-head">
            <span>${escapeHtml(formatShortDate(note.createdAt))}${note.editedAt ? " edited" : ""}</span>
            <button class="note-inline-action note-danger" type="button" data-note-delete="${index}">Delete</button>
          </div>
          <textarea data-note-edit="${index}" rows="3" aria-label="Edit saved CRM note">${escapeHtml(note.text)}</textarea>
          <div class="crm-note-actions">
            <button class="note-inline-action" type="button" data-note-save="${index}">Save note</button>
            <span class="note-save-status" data-note-status="${index}" aria-live="polite"></span>
          </div>
        </div>
      `,
    )
    .join("");
}

function crmEditor(row) {
  const record = crmRecord(row);
  return `
    <section class="crm-editor" data-lead-id="${escapeHtml(leadId(row))}">
      <div class="crm-editor-head">
        <div>
          <h3>CRM Notes</h3>
          <p>Saved locally in this browser until Supabase team sync is connected.</p>
        </div>
        <span class="pill">${escapeHtml(record.status)}</span>
      </div>
      <div class="crm-form-grid">
        <label>
          <span>Status</span>
          <select data-crm-field="status">
            ${crmStatuses.map((status) => `<option value="${escapeHtml(status)}"${status === record.status ? " selected" : ""}>${escapeHtml(status)}</option>`).join("")}
          </select>
        </label>
        <label>
          <span>Assigned Rep</span>
          <input data-crm-field="owner" type="text" value="${escapeHtml(record.owner)}" placeholder="Rep name" />
        </label>
        <label>
          <span>Follow-Up</span>
          <input data-crm-field="followUp" type="date" value="${escapeHtml(record.followUp)}" />
        </label>
      </div>
      <label class="crm-note-box">
        <span>New Note</span>
        <textarea data-crm-field="note" rows="4" placeholder="Talked to owner, current water setup, objections, next step..."></textarea>
      </label>
      <div class="crm-quick-actions">
        <button type="button" data-crm-quick="Knocked - no answer">No answer</button>
        <button type="button" data-crm-quick="Talked to manager">Talked to manager</button>
        <button type="button" data-crm-quick="Has jug/bottle water today">Has jug water</button>
        <button type="button" data-crm-quick="Asked for callback">Callback</button>
      </div>
      <div class="drawer-actions">
        <button class="primary-action" type="button" data-crm-save>Save CRM Update</button>
        <span class="crm-save-status" aria-live="polite"></span>
      </div>
      <div class="crm-note-list" data-crm-note-list>${renderNoteList(record)}</div>
    </section>
  `;
}

function bindSavedNoteActions(root, row) {
  root.querySelectorAll("[data-note-save]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.noteSave);
      const editor = root.querySelector(`[data-note-edit="${index}"]`);
      const status = root.querySelector(`[data-note-status="${index}"]`);
      const text = editor.value.trim();

      if (!text) {
        status.textContent = "Type a note or delete it.";
        status.classList.add("warning");
        return;
      }

      const current = crmRecord(row);
      const notes = [...(current.notes || [])];
      if (!notes[index]) return;

      notes[index] = {
        ...notes[index],
        text,
        editedAt: new Date().toISOString(),
      };

      const saved = updateCrmRecord(row, { notes });
      root.querySelector("[data-crm-note-list]").innerHTML = renderNoteList(saved);
      bindSavedNoteActions(root, row);
      const savedStatus = root.querySelector(`[data-note-status="${index}"]`);
      if (savedStatus) savedStatus.textContent = "Saved";
      renderView();
    });
  });

  root.querySelectorAll("[data-note-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.noteDelete);
      if (!window.confirm("Delete this saved note?")) return;

      const current = crmRecord(row);
      const notes = [...(current.notes || [])];
      if (!notes[index]) return;
      notes.splice(index, 1);

      const saved = updateCrmRecord(row, { notes });
      root.querySelector("[data-crm-note-list]").innerHTML = renderNoteList(saved);
      bindSavedNoteActions(root, row);
      root.querySelector(".crm-save-status").textContent = "Note deleted";
      renderView();
    });
  });
}

function bindDrawerCrm(row) {
  const root = els.drawerContent.querySelector(".crm-editor");
  if (!root) return;
  bindSavedNoteActions(root, row);
  root.querySelectorAll("[data-crm-quick]").forEach((button) => {
    button.addEventListener("click", () => {
      const note = root.querySelector('[data-crm-field="note"]');
      note.value = note.value ? `${note.value}\n${button.dataset.crmQuick}` : button.dataset.crmQuick;
      if (button.dataset.crmQuick.includes("Callback")) root.querySelector('[data-crm-field="status"]').value = "Callback";
    });
  });
  root.querySelector("[data-crm-save]").addEventListener("click", () => {
    const current = crmRecord(row);
    const noteText = root.querySelector('[data-crm-field="note"]').value.trim();
    const notes = noteText
      ? [{ text: noteText, createdAt: new Date().toISOString() }, ...(current.notes || [])]
      : current.notes || [];
    const saved = updateCrmRecord(row, {
      status: root.querySelector('[data-crm-field="status"]').value,
      owner: root.querySelector('[data-crm-field="owner"]').value.trim(),
      followUp: root.querySelector('[data-crm-field="followUp"]').value,
      notes,
    });
    root.querySelector('[data-crm-field="note"]').value = "";
    root.querySelector("[data-crm-note-list]").innerHTML = renderNoteList(saved);
    bindSavedNoteActions(root, row);
    root.querySelector(".crm-save-status").textContent = "Saved";
    renderView();
  });
}

function openDrawer(row) {
  if (!row || !row.business_name) return;
  els.drawerContent.innerHTML = `
    <p class="eyebrow">${escapeHtml(row.priority_tier || "Lead detail")}</p>
    <h2>${escapeHtml(row.business_name)}</h2>
    <div class="badge-line">
      <span class="pill">${escapeHtml(row.city || "")}</span>
      <span class="pill">${escapeHtml(row.sales_segment || "")}</span>
      <span class="pill a">Score ${escapeHtml(row.lead_score || "")}</span>
    </div>
    <div class="detail-grid">
      ${detailItem("Category", row.category)}
      ${detailItem("Address", row.address)}
      ${detailItem("Phone", row.phone)}
      ${detailItem("Decision Access", row.decision_access)}
      ${detailItem("Stability / Credit Proxy", `${row.financial_quality_tier || "Not scored"}${row.financial_quality_score ? ` (${row.financial_quality_score})` : ""}`)}
      ${detailItem("Recommended Terms", row.recommended_terms)}
      ${detailItem("Water Cooler Fit", row.water_cooler_fit)}
      ${detailItem("Pitch Angle", row.pitch_angle)}
      ${detailItem("Credit Proxy Notes", row.credit_proxy_notes)}
      ${detailItem("Risk Flags", row.risk_flags)}
      ${detailItem("Source", row.source_type)}
    </div>
    ${crmEditor(row)}
    <div class="drawer-actions">
      ${row.maps_url ? `<a class="primary-action" href="${escapeHtml(row.maps_url)}" target="_blank" rel="noreferrer">Open map</a>` : ""}
      ${row.website ? `<a class="ghost-action" href="${escapeHtml(row.website)}" target="_blank" rel="noreferrer">Website</a>` : ""}
      ${row.source_url ? `<a class="ghost-action" href="${escapeHtml(row.source_url)}" target="_blank" rel="noreferrer">Source</a>` : ""}
    </div>
  `;
  els.drawer.classList.add("open");
  els.drawerBackdrop.classList.add("open");
  els.drawer.setAttribute("aria-hidden", "false");
  bindDrawerCrm(row);
}

function detailItem(label, value) {
  return `
    <div class="detail-item">
      <span>${escapeHtml(label)}</span>
      <p>${escapeHtml(value || "Not listed")}</p>
    </div>
  `;
}

function closeDrawer() {
  els.drawer.classList.remove("open");
  els.drawerBackdrop.classList.remove("open");
  els.drawer.setAttribute("aria-hidden", "true");
}

function bindEvents() {
  els.navList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-view]");
    if (!button) return;
    state.view = button.dataset.view;
    renderView();
  });
  els.searchInput.addEventListener("input", () => {
    state.search = els.searchInput.value;
    renderView();
  });
  els.cityFilter.addEventListener("change", () => {
    state.city = els.cityFilter.value;
    renderView();
  });
  els.segmentFilter.addEventListener("change", () => {
    state.segment = els.segmentFilter.value;
    renderView();
  });
  els.tierFilter.addEventListener("change", () => {
    state.tier = els.tierFilter.value;
    renderView();
  });
  els.scoreFilter.addEventListener("input", () => {
    state.minScore = Number(els.scoreFilter.value);
    els.scoreOutput.textContent = `${state.minScore}+`;
    renderView();
  });
  els.resetFilters.addEventListener("click", () => {
    state.search = "";
    state.city = "All";
    state.segment = "All";
    state.tier = "All";
    state.crmStatus = "All";
    state.minScore = 0;
    els.searchInput.value = "";
    els.cityFilter.value = "All";
    els.segmentFilter.value = "All";
    els.tierFilter.value = "All";
    els.scoreFilter.value = "0";
    els.scoreOutput.textContent = "0+";
    renderView();
  });
  els.crmModeAction.addEventListener("click", () => {
    state.view = "CRM Mode";
    renderView();
  });
  els.crmGuideAction.addEventListener("click", () => {
    const shouldToggle = state.view === "CRM Mode";
    state.view = "CRM Mode";
    state.crmGuideOpen = shouldToggle ? !state.crmGuideOpen : true;
    renderView();
  });
  els.topExportAction.addEventListener("click", exportCrmNotes);
  els.drawerClose.addEventListener("click", closeDrawer);
  els.drawerBackdrop.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeDrawer();
  });
}

initFilters();
bindEvents();
renderView();
