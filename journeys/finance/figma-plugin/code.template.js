// Finance Journey Builder — Figma plugin (v1, WIP)
// Run via: Figma desktop -> Plugins -> Development -> Import plugin from manifest... (point at manifest.json)
// then Plugins -> Development -> Finance Journey Builder, with the target file open.
// Builds a new page with editable frames/text/images — no external network calls, all assets embedded.
// Never touches existing pages/content in the file — it only ever creates a brand-new page.
//
// Mirrors journeys/finance/template.html v1 — same copy, same sources, same WIP framing
// (single interview: Jesse Tracy). Two stages have no screenshot and render as a dashed
// "gap" stage rather than a normal one; other no-screenshot stages render normally but with
// an inline dashed note box instead of a screenshot row.

function base64ToUint8Array(base64) {
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var clean = base64.replace(/[^A-Za-z0-9+/=]/g, "");
  var bytes = [];
  var buffer = 0, bits = 0;
  for (var i = 0; i < clean.length; i++) {
    var c = clean.charAt(i);
    if (c === "=") break;
    var val = chars.indexOf(c);
    if (val === -1) continue;
    buffer = (buffer << 6) | val;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      bytes.push((buffer >> bits) & 0xff);
    }
  }
  return new Uint8Array(bytes);
}

var COLOR = {
  bg: { r: 1, g: 1, b: 1 },
  fg: { r: 2 / 255, g: 8 / 255, b: 23 / 255 },
  fgMuted: { r: 100 / 255, g: 116 / 255, b: 139 / 255 },
  mutedBg: { r: 241 / 255, g: 245 / 255, b: 249 / 255 },
  border: { r: 226 / 255, g: 232 / 255, b: 240 / 255 },
  primary: { r: 19 / 255, g: 93 / 255, b: 170 / 255 },
  accent: { r: 13 / 255, g: 162 / 255, b: 231 / 255 },
  destructive: { r: 239 / 255, g: 68 / 255, b: 68 / 255 },
  destructiveBg: { r: 254 / 255, g: 242 / 255, b: 242 / 255 },
  destructiveBorder: { r: 254 / 255, g: 202 / 255, b: 202 / 255 },
  bgSubtle: { r: 248 / 255, g: 250 / 255, b: 252 / 255 },
  finance: { r: 100 / 255, g: 116 / 255, b: 139 / 255 },
  financeBg: { r: 241 / 255, g: 245 / 255, b: 249 / 255 },
};

var FONT_R = { family: "Inter", style: "Regular" };
var FONT_M = { family: "Inter", style: "Medium" };
var FONT_B = { family: "Inter", style: "Bold" };
var FONT_SB = { family: "Inter", style: "Semi Bold" };

var CONTENT_WIDTH = 760;

var IMAGES = {
  ordersSpots: { b64: "{{IMG_ORDERS_SPOTS}}", w: 900, h: 440, caption: "An order's Spots Booked table — the kind of record Finance can view but doesn't write to." },
  generateInvoices: { b64: "{{IMG_GENERATE_INVOICES}}", w: 900, h: 604, caption: "Generate Invoices — one of six separate per-revenue-type generation screens." },
  bubsDirect: { b64: "{{IMG_BUBS_DIRECT}}", w: 900, h: 520, caption: "The actual duplicate-record workaround: \"Bubs Naturals - DIRECT\" next to plain \"Bubs Naturals.\"" },
  invoiceList: { b64: "{{IMG_INVOICE_LIST}}", w: 900, h: 548, caption: "The Overdue filter on the Invoice List — the actual collections-tracking screen." },
  payoutReport: { b64: "{{IMG_PAYOUT_REPORT}}", w: 900, h: 604, caption: "A real Payout Report — gross revenue split into Daylight's and the show's participation." },
  spanReport: { b64: "{{IMG_SPAN_REPORT}}", w: 900, h: 526, caption: "The SPAN Report — a separate monthly per-show revenue breakdown by region/tier." },
  airtableMonthly: { b64: "{{IMG_AIRTABLE_MONTHLY}}", w: 900, h: 534, caption: "Bauer Media Group's tab in the Financial Airtable — one of several still empty." },
  monetization: { b64: "{{IMG_MONETIZATION}}", w: 900, h: 604, caption: "The Daylight / Monetization Google Sheet — built by hand from a Marly export." },
};

var STAGES = [
  {
    num: "1", phase: "UPSTREAM", title: "Order visibility",
    body: [
      "Jesse can see the orders Ad Ops books and prices — spot dates, positions, revenue, CPM — but doesn't need to edit them, and flags his own write access as an unnecessary accidental-edit risk rather than something he asked for."
    ],
    images: ["ordersSpots"],
    badges: ["Marly/QCode — Orders"],
    source: "Jesse Tracy interview",
  },
  {
    num: "2", phase: "MONTHLY", title: "Monthly invoice generation",
    body: [
      "At the start of each month, Jesse generates the prior month's invoices in Marly — but not as one document. The Finance nav has a separate \"Generate\" button per revenue type: Invoice, Bill Invoice, Social, Custom, Usage, Rewards. Each has to be run on its own."
    ],
    friction: "Jesse wants one combined, client-customizable invoice instead of six separate generation paths for the same client's month.",
    images: ["generateInvoices"],
    badges: ["Marly/QCode — Finance"],
    source: "Jesse Tracy interview · combined interviews packet, p.39",
  },
  {
    num: "3", phase: "EDGE CASE", title: "Billing-destination management",
    body: [
      "Jesse selects or edits whether a given order bills the advertiser directly or its agency — and Marly can't model anything more complex than that binary. A real case: Bubs Naturals wanted direct billing, while its agency Podscale also wanted to bill directly for the same spend. With no way to represent dual/parent-child billing, Jesse's workaround was to create a second, duplicate advertiser record — \"Bubs Naturals Direct\" — alongside the original."
    ],
    friction: "The workaround is a real, live record today, not a hypothetical: \"Bubs Naturals - DIRECT\" carries its own revenue and receivables totals, tracked entirely separately from the standard \"Bubs Naturals\" record.",
    images: ["bubsDirect"],
    badges: ["Marly/QCode — Advertisers"],
    source: "Jesse Tracy interview · combined interviews packet, p.40",
  },
  {
    num: "4", phase: "ONGOING", title: "Collections & past-due tracking",
    body: [
      "Jesse monitors an invoice list for unpaid and overdue accounts — filterable by Voided / PO / Unpaid / Overdue / Requires PDF — and sends reminder emails, often batched, using a \"Past Due Reminders\" action built into the same screen."
    ],
    images: ["invoiceList"],
    badges: ["Financial Airtable", "Email"],
    source: "Jesse Tracy interview · combined interviews packet, p.38",
  },
  {
    num: "5", phase: "DOWNSTREAM", title: "PDF invoice retrieval",
    isGap: true,
    gapNote: "No screenshot for this stage — Bill.com itself wasn't shown on screen during the interview. Jesse pulls sent-invoice PDFs from Bill.com, not Marly, to attach to collections follow-ups; the PDFs live outside the system that generated the underlying invoice data.",
    badges: ["Bill.com"],
    source: "Jesse Tracy interview",
  },
  {
    num: "6", phase: "MONTHLY — TOP PAIN POINT", title: "Monthly per-show financial reporting",
    body: [
      "Jesse's biggest stated pain point: manually populating and publishing a per-show PDF financial report every month, across roughly 100 shows, sourced from Excel files an external accounting team emails in. Marly's own Payout Reports and SPAN Report screens cover part of this — per-show revenue splits into Daylight's cut vs. the show's, and a monthly US/International/Premium revenue breakdown — but the full monthly report Jesse actually sends out still gets assembled by hand."
    ],
    friction: "Neither in-system report replaces the actual monthly per-show PDF Jesse assembles by hand from the accounting team's Excel files — the two tools don't appear to feed each other yet.",
    images: ["payoutReport", "spanReport"],
    badges: ["Marly/QCode — Payout Reports", "Marly/QCode — SPAN Report", "Excel (external accounting team)"],
    source: "Jesse Tracy interview · combined interviews packet, p.36",
  },
  {
    num: "7", phase: "EMERGING", title: "Miscellaneous revenue tracking",
    body: [
      "A dedicated Financial Airtable, still being built out, is meant to track revenue streams outside the core order system — fed by a parsing tool \"Scott\" built to ingest uploaded reports (e.g. a \"Cloud roll\" report). Its Monthly Reports section already has a tab per client/network (Bauer Media Group, Gumball, Podroll, RedCircle, SPAN, By Podcast) — most still empty."
    ],
    friction: "Jesse himself wasn't fully sure what part of Scott's parsing tool does — this piece is real but incomplete, both in data and in Jesse's own understanding of it.",
    images: ["airtableMonthly"],
    badges: ["Financial Airtable"],
    source: "Jesse Tracy interview · combined interviews packet, p.37",
  },
  {
    num: "8", phase: "WEEKLY/MONTHLY", title: "Internal metrics reporting",
    body: [
      "A monetization spreadsheet shared with Sales gets updated by exporting raw data out of Marly and manually pivoting it in Excel — neither Marly nor Airtable supports pivot-table export natively, so this step can't be automated as-is."
    ],
    images: ["monetization"],
    badges: ["Google Sheets", "Marly/QCode export"],
    source: "Jesse Tracy interview · combined interviews packet, p.37",
  },
  {
    num: "9", phase: "STRUCTURAL", title: "Broadcast-month billing reconciliation",
    isGap: true,
    gapNote: "No screenshot for this stage. Some clients bill on a broadcast-month cycle rather than a calendar month; Marly defaults to calendar-month billing regardless, which causes invoices for those clients to show as falsely past-due until Jesse manually reconciles the mismatch.",
    badges: ["Marly/QCode — Finance"],
    source: "Jesse Tracy interview",
  },
];

async function loadFonts() {
  await figma.loadFontAsync(FONT_R);
  await figma.loadFontAsync(FONT_M);
  await figma.loadFontAsync(FONT_B);
  try { await figma.loadFontAsync(FONT_SB); } catch (e) { FONT_SB.style = "Bold"; }
}

function solidPaint(color, opacity) {
  var p = { type: "SOLID", color: color };
  if (opacity !== undefined) p.opacity = opacity;
  return p;
}

function mkText(content, opts) {
  opts = opts || {};
  var t = figma.createText();
  t.fontName = opts.font || FONT_R;
  t.characters = content;
  t.fontSize = opts.size || 14;
  if (opts.lineHeightPct) t.lineHeight = { unit: "PERCENT", value: opts.lineHeightPct };
  if (opts.letterSpacing) t.letterSpacing = { unit: "PERCENT", value: opts.letterSpacing };
  t.fills = [solidPaint(opts.color || COLOR.fg)];
  if (opts.width) {
    t.textAutoResize = "HEIGHT";
    t.resize(opts.width, t.height);
  }
  if (opts.caps) t.textCase = "UPPER";
  return t;
}

function autoFrame(name, direction, opts) {
  opts = opts || {};
  var f = figma.createFrame();
  f.name = name;
  f.layoutMode = direction;
  f.primaryAxisSizingMode = opts.fixedMain ? "FIXED" : "AUTO";
  f.counterAxisSizingMode = opts.fixedCross ? "FIXED" : "AUTO";
  f.itemSpacing = opts.spacing !== undefined ? opts.spacing : 8;
  f.paddingLeft = opts.padding !== undefined ? opts.padding : 0;
  f.paddingRight = opts.padding !== undefined ? opts.padding : 0;
  f.paddingTop = opts.padding !== undefined ? opts.padding : 0;
  f.paddingBottom = opts.padding !== undefined ? opts.padding : 0;
  if (opts.paddingLeft !== undefined) f.paddingLeft = opts.paddingLeft;
  if (opts.paddingRight !== undefined) f.paddingRight = opts.paddingRight;
  if (opts.paddingTop !== undefined) f.paddingTop = opts.paddingTop;
  if (opts.paddingBottom !== undefined) f.paddingBottom = opts.paddingBottom;
  f.fills = opts.fill ? [solidPaint(opts.fill)] : [];
  if (opts.stroke) {
    f.strokes = [solidPaint(opts.stroke)];
    f.strokeWeight = opts.strokeWeight || 1;
  }
  if (opts.cornerRadius !== undefined) f.cornerRadius = opts.cornerRadius;
  if (opts.wrap) {
    try { f.layoutWrap = "WRAP"; } catch (e) {}
  }
  if (opts.crossAlign) f.counterAxisAlignItems = opts.crossAlign;
  if (opts.mainAlign) f.primaryAxisAlignItems = opts.mainAlign;
  return f;
}

function mkOwnerTag(label) {
  var tag = autoFrame("owner-tag", "HORIZONTAL", {
    paddingLeft: 10, paddingRight: 12, paddingTop: 5, paddingBottom: 5,
    spacing: 6, cornerRadius: 999, fill: COLOR.financeBg, crossAlign: "CENTER",
  });
  var dot = figma.createEllipse();
  dot.resize(7, 7);
  dot.fills = [solidPaint(COLOR.finance)];
  tag.appendChild(dot);
  tag.appendChild(mkText(label, { font: FONT_SB, size: 11, color: COLOR.finance, letterSpacing: 4 }));
  return tag;
}

function mkWipPill() {
  var tag = autoFrame("wip-pill", "HORIZONTAL", {
    paddingLeft: 9, paddingRight: 9, paddingTop: 4, paddingBottom: 4,
    spacing: 6, cornerRadius: 999, fill: COLOR.destructiveBg,
    stroke: COLOR.destructiveBorder, strokeWeight: 1, crossAlign: "CENTER",
  });
  tag.appendChild(mkText("WIP · SINGLE INTERVIEW", { font: FONT_B, size: 10.5, color: COLOR.destructive, letterSpacing: 3 }));
  return tag;
}

function mkBadge(label) {
  var f = autoFrame("badge", "HORIZONTAL", {
    padding: 6, paddingLeft: 12, paddingRight: 12,
    fill: COLOR.mutedBg, stroke: COLOR.border, cornerRadius: 999,
  });
  f.appendChild(mkText(label, { font: FONT_M, size: 11, color: COLOR.fg, letterSpacing: 1 }));
  return f;
}

function mkBadgeRow(labels) {
  var row = autoFrame("badges", "HORIZONTAL", { spacing: 8, wrap: true, fixedMain: true });
  row.resize(CONTENT_WIDTH, row.height);
  labels.forEach(function (l) { row.appendChild(mkBadge(l)); });
  return row;
}

function mkFriction(text) {
  var wrap = autoFrame("friction", "HORIZONTAL", {
    padding: 14, spacing: 10, fill: COLOR.destructiveBg, stroke: COLOR.destructiveBorder,
    cornerRadius: 8, fixedMain: true,
  });
  wrap.resize(CONTENT_WIDTH, wrap.height);
  var bar = figma.createRectangle();
  bar.resize(3, 10);
  bar.fills = [solidPaint(COLOR.destructive)];
  bar.name = "accent-bar";
  wrap.appendChild(bar);
  var txt = mkText("⚠  " + text, { font: FONT_R, size: 13, color: COLOR.fg, width: CONTENT_WIDTH - 40, lineHeightPct: 140 });
  wrap.appendChild(txt);
  return wrap;
}

function mkGapNote(text) {
  var box = autoFrame("gap-note", "VERTICAL", {
    padding: 14, stroke: COLOR.border, strokeWeight: 1, cornerRadius: 8,
  });
  try { box.dashPattern = [4, 4]; } catch (e) {}
  box.appendChild(mkText(text, { font: FONT_R, size: 13, color: COLOR.fgMuted, width: CONTENT_WIDTH - 28, lineHeightPct: 145 }));
  return box;
}

function mkImageRect(key, displayW) {
  var img = IMAGES[key];
  var bytes = base64ToUint8Array(img.b64);
  var image = figma.createImage(bytes);
  var rect = figma.createRectangle();
  var displayH = Math.round((displayW * img.h) / img.w);
  rect.resize(displayW, displayH);
  rect.fills = [{ type: "IMAGE", imageHash: image.hash, scaleMode: "FILL" }];
  return rect;
}

function mkShot(key) {
  var img = IMAGES[key];
  var displayW = 340;
  var col = autoFrame("shot", "VERTICAL", { spacing: 6 });
  var chrome = autoFrame("browser-chrome", "VERTICAL", {
    stroke: COLOR.border, strokeWeight: 1, cornerRadius: 8, spacing: 0,
  });
  var bar = autoFrame("bar", "HORIZONTAL", { padding: 8, spacing: 5, fill: COLOR.mutedBg, fixedMain: true });
  bar.resize(displayW, bar.height);
  [COLOR.border, COLOR.border, COLOR.border].forEach(function (c) {
    var dot = figma.createEllipse();
    dot.resize(7, 7);
    dot.fills = [solidPaint(c)];
    bar.appendChild(dot);
  });
  chrome.appendChild(bar);
  chrome.appendChild(mkImageRect(key, displayW));

  col.appendChild(chrome);
  col.appendChild(mkText(img.caption, { font: FONT_R, size: 11, color: COLOR.fgMuted, width: displayW, lineHeightPct: 135 }));
  return col;
}

function mkShotsRow(keys) {
  var row = autoFrame("shots", "HORIZONTAL", { spacing: 16, wrap: true });
  keys.forEach(function (k) { row.appendChild(mkShot(k)); });
  return row;
}

function mkSourceTag(text) {
  var row = autoFrame("source-tag", "HORIZONTAL", { spacing: 6, crossAlign: "CENTER" });
  var dot = figma.createEllipse();
  dot.resize(6, 6);
  dot.fills = [solidPaint(COLOR.accent)];
  row.appendChild(dot);
  row.appendChild(mkText(text, { font: FONT_R, size: 11, color: COLOR.fgMuted }));
  return row;
}

function mkStage(stage) {
  var row = autoFrame("stage-" + stage.num, "HORIZONTAL", { spacing: 20, crossAlign: "MIN" });

  var marker = autoFrame("marker", "HORIZONTAL", {
    stroke: stage.isGap ? COLOR.border : COLOR.accent, strokeWeight: 2, cornerRadius: 999,
    mainAlign: "CENTER", crossAlign: "CENTER", fixedMain: true, fixedCross: true,
  });
  marker.resize(40, 40);
  if (stage.isGap) { try { marker.dashPattern = [3, 3]; } catch (e) {} }
  marker.appendChild(mkText(stage.num, { font: FONT_SB, size: 15, color: stage.isGap ? COLOR.fgMuted : COLOR.fg }));
  row.appendChild(marker);

  var card = autoFrame("card", "VERTICAL", { spacing: 10 });

  card.appendChild(mkText(stage.phase, { font: FONT_M, size: 11, color: COLOR.fgMuted, letterSpacing: 2 }));
  card.appendChild(mkOwnerTag("FINANCE" + (stage.readOnly ? " (READ-ONLY)" : "")));
  card.appendChild(mkText(stage.title, { font: FONT_B, size: 21, color: stage.isGap ? COLOR.fgMuted : COLOR.fg, width: CONTENT_WIDTH }));

  if (stage.body) {
    stage.body.forEach(function (p) {
      card.appendChild(mkText(p, { font: FONT_R, size: 14, color: COLOR.fg, width: CONTENT_WIDTH, lineHeightPct: 148 }));
    });
  }

  if (stage.friction) card.appendChild(mkFriction(stage.friction));
  if (stage.images) card.appendChild(mkShotsRow(stage.images));
  if (stage.gapNote) card.appendChild(mkGapNote(stage.gapNote));
  if (stage.badges) card.appendChild(mkBadgeRow(stage.badges));
  if (stage.source) card.appendChild(mkSourceTag(stage.source));

  row.appendChild(card);
  return row;
}

function mkScopeCallout() {
  var wrap = autoFrame("scope-callout", "HORIZONTAL", {
    padding: 16, spacing: 12, fill: COLOR.destructiveBg, stroke: COLOR.destructiveBorder,
    cornerRadius: 8, fixedMain: true, crossAlign: "MIN",
  });
  wrap.resize(CONTENT_WIDTH, wrap.height);
  wrap.appendChild(mkText("⚠", { font: FONT_R, size: 16, color: COLOR.destructive }));
  var copy = autoFrame("scope-copy", "VERTICAL", { spacing: 6 });
  var innerW = CONTENT_WIDTH - 48;
  copy.appendChild(mkText("This is an early, single-source pass — treat it as a draft", { font: FONT_SB, size: 15, color: COLOR.destructive, width: innerW }));
  copy.appendChild(mkText(
    "Everything below comes from one interview, Jesse Tracy's. There's no second Finance stakeholder to cross-check against, and no Legal or Product interview yet to confirm the Bill.com handoff or where the still-being-built Financial Airtable is headed. Where a stage has no real screenshot, that's flagged rather than illustrated with a guess.",
    { font: FONT_R, size: 13, color: COLOR.fg, width: innerW, lineHeightPct: 145 }
  ));
  wrap.appendChild(copy);
  return wrap;
}

async function build() {
  await loadFonts();

  var page = figma.createPage();
  page.name = "Finance Journey (WIP)";
  figma.currentPage = page;

  var root = autoFrame("Finance Journey", "VERTICAL", {
    padding: 64, spacing: 44, fill: COLOR.bg,
  });

  // Header
  var header = autoFrame("header", "VERTICAL", { spacing: 14 });
  var eyebrowRow = autoFrame("eyebrow-row", "HORIZONTAL", { spacing: 10, crossAlign: "CENTER" });
  eyebrowRow.appendChild(mkText("DAYLIGHT MEDIA · INTERNAL — CURRENT STATE", { font: FONT_SB, size: 12, color: COLOR.primary, letterSpacing: 2 }));
  eyebrowRow.appendChild(mkWipPill());
  header.appendChild(eyebrowRow);
  header.appendChild(mkText("The Finance Journey", { font: FONT_B, size: 38, color: COLOR.fg, width: CONTENT_WIDTH, lineHeightPct: 108 }));
  header.appendChild(mkText(
    "How Daylight's revenue actually gets invoiced, collected, and reported today — reconstructed from Jesse Tracy's account of running Finance solo across a book of business that's grown from ~30 to ~100 shows.",
    { font: FONT_R, size: 16, color: COLOR.fgMuted, width: CONTENT_WIDTH, lineHeightPct: 150 }
  ));
  var legendRow = autoFrame("legend", "HORIZONTAL", { spacing: 20, wrap: true, fixedMain: true, crossAlign: "CENTER" });
  legendRow.resize(CONTENT_WIDTH, legendRow.height);
  function legendItem(label, color, outline) {
    var item = autoFrame("legend-item", "HORIZONTAL", { spacing: 6, crossAlign: "CENTER" });
    var dot = figma.createEllipse();
    dot.resize(8, 8);
    dot.fills = color ? [solidPaint(color)] : [];
    if (outline) { dot.strokes = [solidPaint(outline)]; dot.strokeWeight = 1.5; }
    item.appendChild(dot);
    item.appendChild(mkText(label, { font: FONT_R, size: 12.5, color: COLOR.fgMuted }));
    legendRow.appendChild(item);
  }
  legendItem("Finance-owned", COLOR.finance);
  legendItem("Tool in use", null, COLOR.fgMuted);
  legendItem("Friction point", COLOR.destructive);
  legendItem("Source", COLOR.accent);
  header.appendChild(legendRow);
  root.appendChild(header);

  // Scope callout
  root.appendChild(mkScopeCallout());

  // Stages
  STAGES.forEach(function (s) { root.appendChild(mkStage(s)); });

  // Naming callout
  var callout = autoFrame("naming-note", "VERTICAL", {
    padding: 18, spacing: 8, stroke: COLOR.border, strokeWeight: 1, cornerRadius: 8,
    fill: COLOR.bgSubtle,
  });
  callout.appendChild(mkText("A note on names", { font: FONT_SB, size: 16, color: COLOR.fg }));
  callout.appendChild(mkText(
    "This journey inherits the same unresolved system-naming cluster documented in the Sales/Ad Ops journey: Marly, Marley, QCode, Molly, Bob/Vault. Finance screenshots in this pass show both a Marly-branded sidebar and a QCode-branded (app.qcodemedia.dev) dark-mode Finance view for the SPAN Report — used here as \"Marly/QCode\" without implying either name is canonical.",
    { font: FONT_R, size: 13, color: COLOR.fgMuted, width: CONTENT_WIDTH - 36, lineHeightPct: 150 }
  ));
  root.appendChild(callout);

  // Methodology footer
  var footer = autoFrame("methodology", "VERTICAL", { spacing: 10 });
  footer.appendChild(mkText("Methodology & gaps", { font: FONT_SB, size: 16, color: COLOR.fg }));
  var footerItems = [
    "Built from one interview — Understanding User Needs w Product (Finance_ Jesse) — plus 9 screenshots pulled from the combined stakeholder-interviews packet (pp.36-40). No second Finance stakeholder exists yet to corroborate or add to Jesse's account.",
    "Two stages (PDF retrieval from Bill.com, broadcast-month reconciliation) have no supporting screenshot — the interview described them but the tool wasn't shown on screen. Flagged rather than illustrated.",
    "This journey doesn't yet trace how Finance's invoicing connects back to the Sales/Ad Ops IO lifecycle documented in journeys/sales-adops — that handoff (papered order → billable revenue) is a natural next research thread, not yet interviewed on either side.",
    "The Financial Airtable and its parsing tool are real but under-documented even to Jesse himself — treat the \"miscellaneous revenue tracking\" stage as the least stable part of this reconstruction."
  ];
  footerItems.forEach(function (it) {
    var row = autoFrame("footer-item", "HORIZONTAL", { spacing: 8, fixedMain: true });
    row.resize(CONTENT_WIDTH, row.height);
    row.appendChild(mkText("–", { font: FONT_R, size: 13, color: COLOR.border }));
    row.appendChild(mkText(it, { font: FONT_R, size: 12.5, color: COLOR.fgMuted, width: CONTENT_WIDTH - 20, lineHeightPct: 145 }));
    footer.appendChild(row);
  });
  root.appendChild(footer);

  page.appendChild(root);
  figma.viewport.scrollAndZoomIntoView([root]);
  figma.notify("Finance Journey (WIP) built on a new page — fully editable.");
  figma.closePlugin();
}

build().catch(function (err) {
  console.error(err);
  figma.notify("Build failed: " + err.message, { error: true });
  figma.closePlugin();
});
