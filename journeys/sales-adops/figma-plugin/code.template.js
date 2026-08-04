// Sales & Ad Ops Journey Builder — Figma plugin (v2)
// Run via: Figma desktop -> Plugins -> Development -> Import plugin from manifest... (point at manifest.json)
// then Plugins -> Development -> Sales & Ad Ops Journey Builder, with the target file open.
// Builds a new page with editable frames/text/images — no external network calls, all assets embedded.
// Never touches existing pages/content in the file — it only ever creates a brand-new page.
//
// v2 adds: explicit per-stage Sales/Ad Ops/Finance ownership tags, a "two nav trees" callout with
// the real Marly sidebar screenshot, a Bob/Vault quadrant-ownership diagram inside the ad-plan
// stage, a Rate Card screenshot, a "Sales-only, continuous work" section, and owner labels on the
// IO lifecycle strip. Mirrors journeys/sales-adops/template.html v2 — same copy, same sources.
//
// Figma auto-layout axis note: for a VERTICAL frame the "primary axis" is height (the stacking
// direction) and the "counter axis" is width. All the "fixed width, auto height" containers below
// therefore rely on AUTO/AUTO (hug) sizing on the parent — the actual width comes from each
// child (text nodes, badge rows, image rows) already being resized to CONTENT_WIDTH, so the
// parent naturally hugs to that same width. Only HORIZONTAL rows that need to force a wrap
// (badges, friction box) set primaryAxisSizingMode to FIXED, since width IS the primary axis there.

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
  sales: { r: 42 / 255, g: 157 / 255, b: 144 / 255 },
  salesBg: { r: 236 / 255, g: 247 / 255, b: 245 / 255 },
  adops: { r: 13 / 255, g: 162 / 255, b: 231 / 255 },
  adopsBg: { r: 234 / 255, g: 247 / 255, b: 255 / 255 },
  finance: { r: 100 / 255, g: 116 / 255, b: 139 / 255 },
  financeBg: { r: 241 / 255, g: 245 / 255, b: 249 / 255 },
};

var FONT_R = { family: "Inter", style: "Regular" };
var FONT_M = { family: "Inter", style: "Medium" };
var FONT_B = { family: "Inter", style: "Bold" };
var FONT_SB = { family: "Inter", style: "Semi Bold" };
var FONT_I = { family: "Inter", style: "Italic" };

var CONTENT_WIDTH = 760;

var IMAGES = {
  navSidebar: { b64: "{{IMG_MARLY_NAV}}", w: 276, h: 1080, caption: "Marly's own sidebar — Sales as one expandable section, Ad Ops as a separate top-level item." },
  rateCard: { b64: "{{IMG_RATE_CARD}}", w: 1200, h: 675, caption: "The real Rate Card/Roster this stage filters — Thomas's alone to edit, updated weekly." },
  adplan: { b64: "{{IMG_ADPLAN}}", w: 720, h: 465, caption: "The BOB grid: one row per flight week, one column per show, booked or open." },
  io: { b64: "{{IMG_IO}}", w: 720, h: 443, caption: "An incoming IO (right) next to the ad plan it has to be transcribed into (left)." },
  orders: { b64: "{{IMG_ORDERS}}", w: 720, h: 521, caption: "Once papered: the order record, its booked spots, and a Dynamic Order slot for make-goods." },
  podscribe: { b64: "{{IMG_PODSCRIBE}}", w: 720, h: 523, caption: "Podscribe: the attribution source of truth for downloads and delivery." },
  delivery: { b64: "{{IMG_DELIVERY}}", w: 720, h: 522, caption: "Delivery Reports: a separate tab the team cross-references by hand against Sales & Orders." },
};

var STAGES = [
  {
    num: "1", phase: "INTAKE", owner: "sales", title: "RFP intake",
    body: [
      "An agency sends a Request for Proposal: the brand, target demographics, and any campaign specifics — read type, attribution needs, a target CPM — usually against a shared brand-brief/submission template."
    ],
    badges: ["Email", "Brand brief template"],
    source: "Sales & Ad Ops Flow.pdf",
  },
  {
    num: "2", phase: "QUALIFY", owner: "sales", title: "Rate card filtering",
    body: [
      "Thomas Mancusi (Sales) confirms this from the seller's side directly: “sales will do the RFP rate card pulling.” The seller narrows the full Rate Card down to what's actually available for this RFP, in a fixed sequence of manual checks:"
    ],
    detail: [
      "Competitive advertiser check — pull any show already active with a competing brand. Category exclusivity is earned by 3 embedded spots or 3 months of DAI, and holds for 30 days after the last ad airs.",
      "Previous vetting check — drop any show that has already declined this brand before.",
      "Criteria filter — narrow to shows matching the RFP's demographics and requirements."
    ],
    friction: "Exclusivity windows and episodic category conflicts are tracked by memory and spreadsheet, not enforced by the system. “No way to track this.”",
    images: ["rateCard"],
    badges: ["Rate Card / Roster (Excel)"],
    source: "Sales & Ad Ops Flow.pdf · Thomas Mancusi interview",
  },
  {
    num: "3", phase: "QUALIFY — HANDOFF TO AD OPS", owner: "adops", title: "Vetting",
    body: [
      "Once Sales hands off its filtered show list, Ad Ops takes over: it sends vetting requests for any remaining un-vetted, on-demo shows, then logs the “whys” back onto the Rate Card. This is the first point in the whole journey where Ad Ops touches the deal — per Brett, directly: “sales will happen before this. The only thing that'll happen that Adops will interact with in these first few… is going to be vetting. Adops handles the vetting requests.”"
    ],
    badges: ["Marly/QCode — Vetting"],
    source: "Sales & Ad Ops Flow.pdf · Brett Connaughton interview, Pt.2",
  },
  {
    num: "4", phase: "PROPOSE", owner: "sales", title: "Submit & get feedback",
    body: [
      "If the client supplied their own template, the seller transfers the rate-card data over; if not, the proposal goes out as-is by email. Aaron Hurting does this ~95% of the time — per Brett, “half ad ops, half sales assistant” — adapting the same underlying data to whichever template that specific agency wants (Oxford, RSU, and WPP each have their own). The client comes back with one of three answers: nothing, some shows, or everything."
    ],
    badges: ["Email", "Client template"],
    source: "Sales & Ad Ops Flow.pdf · Brett Connaughton interview, Pt.2",
  },
  {
    num: "5", phase: "SCHEDULE", owner: "adops", title: "Ad plan & scheduling",
    body: [
      "Confirmed shows move into the Ad Plan — internally “BOB,” Book of Business — a week-over-week grid inside Marly/QCode/Vault. Every flight week for every show is either Unbooked or filled in with the winning brand and its dollar amount. This is squarely Ad Ops's: “adops is owning scheduling, right?” — “Yep.”",
      "Scheduling itself runs on judgment, not rules the system enforces: a standard buy is 3 spots, 3 weeks apart; the goal is balanced inventory with an even spread across shows; midroll position is rotated so no single advertiser always lands in the same slot; and competing categories (a mattress brand and a sheets brand, say) shouldn't land in the same episode."
    ],
    friction: "Episodic category exclusivity has no system support today. “Could we flag good or bad choices in BOB based on the RFP?” was raised as an open want, not a built feature.",
    images: ["adplan"],
    quadrant: true,
    badges: ["Marly/QCode — Ad Plan (BOB)"],
    source: "Brett Connaughton interview, Pt.1 & Pt.2",
  },
  {
    num: "6", phase: "BOOK IT — THE BIGGEST TIME SINK", owner: "adops", title: "Order entry (“papering” the IO)",
    body: [
      "An Insertion Order arrives from the agency in whichever format that agency happens to use: a simple Google Form response, a fully manual email the team has to key in on the host's behalf, or the client's own spreadsheet template. Whatever the format, it resolves to the same shape — agency/billing contacts, then a line-item table of content type, placement, flight week, show, rate, and total net cost, plus general terms for payment and advertiser ownership.",
      "Ad Ops then re-enters all of it into Marly/QCode by hand, order by order: click to book each spot individually — there's no bulk-select — then manually key in dates, impressions, spot revenue, and CPM (which auto-calculates), and flag anything that needs client pre-approval. Spot position is assigned by feel, to keep rotation fair across every advertiser on the show."
    ],
    friction: "“Order entry — biggest time suck — new order.” For high-frequency shows, this compounds fast: shifting a full year of a 5-episode-a-week show by two days took one order-entry lead roughly three hours, because the system slows down at 35–50 edits in a row and every change has to be re-checked by eye.",
    images: ["io", "orders"],
    badges: ["Marly/QCode — Orders", "Google Docs/Forms (IO)", "Email", "Google Drive"],
    parallel: {
      label: "RUNNING ALONGSIDE ORDER ENTRY, NOT AFTER IT — ALL THREE: AD OPS",
      items: [
        { title: "Host & product onboarding", text: "Owned by Mercedes Molina. ~99% of deals offer product to the host, so a brand-specific form (sizes, storefront links, meal picks) has to be collected by hand for each one. A Brand Request Tracker exists in-system but is little-used today." },
        { title: "Ad-copy trafficking", text: "Owned by Kyle Larson. A Monday “copy audit” filters flights 3 weeks out and marks each scripted or not; a Wednesday follow-up emails every advertiser still missing copy and flips their status. Costs 2–3 hours/week; a filterable aggregate view and mail-merge send are wanted, not built." },
        { title: "Pre-approval tracking", text: "A “Client Approval Required” checkbox on the ad-plan row triggers an automated reminder to send the pre-approval — the one piece of this that's already semi-automated." }
      ]
    },
    source: "Brett Connaughton interview, Pt.1 & Pt.2",
  },
  {
    num: "7", phase: "AS NEEDED", owner: "adops", title: "Revisions & make-goods",
    body: [
      "Most revisions are tracked by downloading the relevant email thread — sometimes well over a hundred messages deep — and appending a note. Shifting a flight today means opening its detail panel, copying out the script/show-notes/revenue/impressions by hand, deleting the flight, and re-entering everything in the new week's slot — and clients that require minimum separation between reads (e.g. 3 weeks) mean moving one flight on a 35-flight order means manually redoing all of them. The ad-plan grid “starts to lag like crazy” past 10–15 minutes of this. Underdelivery make-goods use a distinct Dynamic Order, which runs against a show's back catalog instead of the original flight, since the original IO itself never gets updated."
    ],
    friction: "Drag-and-drop flight shifting is Ad Ops's single most-requested fix — “Vault could do nothing else and just do that and adops would be happy.” Separately: cancelling or editing a booked spot deletes the historical record with no audit trail today.",
    badges: ["Email", "Marly/QCode — Dynamic Order"],
    source: "Brett Connaughton interview, Pt.1 & Pt.2",
  },
  {
    num: "8", phase: "DELIVER", owner: "adops", title: "Delivery reporting & performance tracking",
    body: [
      "Downloads — audio downloads, streams, and YouTube plays folded into one number so nothing double-counts — is the metric Daylight actually sells against. Attribution runs through Podscribe, the industry-standard tool, on a refresh cycle of roughly 8–12 hours.",
      "Sales-order data and delivery-report data live in two disconnected places today: checking a campaign's health means keeping both tabs open, or exporting delivery numbers to CSV and pasting them into a spreadsheet by hand to compare against what was sold. Underdelivery has one lever today — a free make-good ad read — which is a point of real friction with the show side. Haley Chapman owns the daily proactive-reporting schedule that decides which advertiser gets reporting on which day.",
      "This is one of the clearest single ownership lines in the whole journey — per Brett: “sales doesn't really need visibility into a lot of this… they'll go in and check as needed.” Sales only re-engages reactively, and usually only when a specific show is underperforming and Thomas needs the numbers to make a case for it."
    ],
    friction: "Wanted but not built: delivery totals pulled directly into the order view, and a proactive on-track indicator that flags underdelivery risk before it's already happened.",
    images: ["podscribe", "delivery"],
    badges: ["Podscribe", "Marly — Delivery Reports", "Google Sheets (DAI tracking)"],
    source: "Brett Connaughton interview, Pt.1 & Pt.2",
  },
  {
    num: "9", phase: "REPORT", owner: "adops", title: "Client (weekly) reporting",
    body: [
      "When an agency asks for reporting — routinely, on a proactive cadence Haley Chapman schedules per client — the team pulls the current numbers, double-checks nothing looks off, and sends the report back by hand. One-off ad-hoc requests get routed to Ad Ops the same way, whether they originate from the agency or from Sales."
    ],
    badges: ["Email", "Delivery Reports"],
    source: "Brett Connaughton interview, Pt.2",
  },
];

var GAP_STAGE = {
  num: "?", phase: "DOWNSTREAM — OUT OF SCOPE FOR THIS JOURNEY", owner: "finance", title: "Invoicing & payouts",
  note: "Finance-side invoicing and show payouts sit outside a Sales/Ad Ops journey, and this pass didn't try to detail them — but this is no longer an unconfirmed future-state placeholder. Jesse Tracy's (Finance) interview confirms real current-state process here: monthly per-revenue-type invoice generation split across embedded/DAI/social/custom/usage/rewards, manual billing-destination handling, and Bill.com as where sent invoices actually live. See journeys/finance/notes.md for the full reconstruction."
};

var SALES_ONGOING = [
  { title: "Rate/CPM decisions", text: "Sets, holds, or raises CPM every Monday from 8-week trailing/forward sellout %, using custom Marly/Molly dashboards. Largely memory-driven." },
  { title: "Master List / Rate Card ownership", text: "Thomas solely owns and manually edits the Excel Rate Card weekly. “No one's allowed to touch it but me.”" },
  { title: "Renewal & win-back tracking", text: "Tracks flight end dates and cancellations from memory to time renewal outreach; wants automated cancellation/revenue-shift flags." },
  { title: "Prospecting & new-brand pricing", text: "Evaluates new-advertiser fit for a show using average-unit-rate reasoning." },
  { title: "Ad-placement doctrine", text: "Thomas's own unwritten IP, taught verbally to hosts: reads >1 min, placed ~8–10% in, ~12% apart, never past the halfway mark, as isolated “commercial islands.”" },
];

var IO_STEPS = [
  { num: "01 · Sales/Agency", title: "Origination", text: "Google Form, manual email, or the client's own template — agency contacts plus a placement/flight/rate table.", ghost: false },
  { num: "02 · Ad Ops", title: "Papering", text: "Manually transcribed into Marly/QCode, order by order, named to match a parallel Drive folder.", ghost: false },
  { num: "03 · Ad Ops", title: "Held", text: "Status marked “on hold” so revenue isn't booked before the contract is countersigned.", ghost: false },
  { num: "04 · Ad Ops", title: "Revised", text: "Changes tracked against the original email thread, not a living document. T&Cs vary enough to need manual flagging for abnormalities.", ghost: false },
  { num: "05 · Ad Ops", title: "Reconciled", text: "Once the flight runs, Podscribe delivery is checked by hand against what the IO promised.", ghost: false },
  { num: "06 · Finance, out of scope", title: "Invoiced & paid out", text: "Confirmed current-state via Finance's own interview (see journeys/finance/notes.md) — just not detailed in this Sales/Ad Ops journey.", ghost: true },
];

var QUADRANT = [
  { title: "Top-left — Ad Ops", owner: "adops", text: "The schedule/ad-plan grid shown above. The only view Ad Ops uses: “Ad ops won't use anything but really the top left.”" },
  { title: "Top-right — Sales", owner: "sales", text: "Used heavily by Thomas and “Kel.” Ad Ops doesn't touch it: “Adops does not use top right or bottom left… sales does.”" },
  { title: "Bottom-left — Sales", owner: "sales", text: "The Fill Rate table (spots filled vs. available per episode) in grid form — Sales-only, same data Ad Ops sees elsewhere as tiles." },
  { title: "Bottom-right — open question", owner: null, text: "Possibly Available Inventory. Brett wasn't sure Sales uses this one either: “I'm not sure if they do.”" },
];

async function loadFonts() {
  await figma.loadFontAsync(FONT_R);
  await figma.loadFontAsync(FONT_M);
  await figma.loadFontAsync(FONT_B);
  try { await figma.loadFontAsync(FONT_SB); } catch (e) { FONT_SB.style = "Bold"; }
  try { await figma.loadFontAsync(FONT_I); } catch (e) { FONT_I.style = FONT_R.style; }
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

// direction: "HORIZONTAL" | "VERTICAL"
// opts.fixedMain: force the primary axis (the stacking direction) to a fixed size — width for
//   HORIZONTAL, height for VERTICAL. Use this only when you actually want that behavior (e.g. a
//   horizontal row that should wrap). Leave both axes AUTO (the default) for a "hug everything,
//   let fixed-width children determine the cross size" container, which is what most stage/card
//   containers below want.
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

function ownerColors(kind) {
  if (kind === "sales") return { fg: COLOR.sales, bg: COLOR.salesBg };
  if (kind === "adops") return { fg: COLOR.adops, bg: COLOR.adopsBg };
  if (kind === "finance") return { fg: COLOR.finance, bg: COLOR.financeBg };
  return { fg: COLOR.fgMuted, bg: COLOR.mutedBg };
}

function mkOwnerTag(kind) {
  var label = kind === "sales" ? "SALES" : kind === "adops" ? "AD OPS" : kind === "finance" ? "FINANCE" : "OPEN QUESTION";
  var c = ownerColors(kind);
  var tag = autoFrame("owner-tag", "HORIZONTAL", {
    paddingLeft: 10, paddingRight: 12, paddingTop: 5, paddingBottom: 5,
    spacing: 6, cornerRadius: 999, fill: c.bg, crossAlign: "CENTER",
  });
  var dot = figma.createEllipse();
  dot.resize(7, 7);
  dot.fills = [solidPaint(c.fg)];
  tag.appendChild(dot);
  tag.appendChild(mkText(label, { font: FONT_SB, size: 11, color: c.fg, letterSpacing: 4 }));
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
  // HORIZONTAL: primary axis = width, so fixedMain here really does fix the width, which is what
  // lets layoutWrap actually wrap the badges instead of running off in one line.
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

function mkParallelGroup(group) {
  var wrap = autoFrame("parallel-wrap", "VERTICAL", {
    padding: 16, spacing: 12, stroke: COLOR.border, strokeWeight: 1, cornerRadius: 8,
    fill: COLOR.bgSubtle,
  });
  wrap.appendChild(mkText(group.label, { font: FONT_M, size: 11, color: COLOR.fgMuted, letterSpacing: 3 }));
  var innerW = CONTENT_WIDTH - 32;
  var grid = autoFrame("parallel-grid", "HORIZONTAL", { spacing: 12, fixedMain: true });
  grid.resize(innerW, grid.height);
  var cardW = Math.floor((innerW - 24) / 3);
  group.items.forEach(function (it) {
    var card = autoFrame("parallel-card", "VERTICAL", { spacing: 6 });
    card.appendChild(mkText(it.title, { font: FONT_SB, size: 13, color: COLOR.fg, width: cardW }));
    card.appendChild(mkText(it.text, { font: FONT_R, size: 12, color: COLOR.fgMuted, width: cardW, lineHeightPct: 140 }));
    grid.appendChild(card);
  });
  wrap.appendChild(grid);
  return wrap;
}

function mkQuadrant() {
  var wrap = autoFrame("quadrant-wrap", "VERTICAL", {
    padding: 16, spacing: 12, stroke: COLOR.border, strokeWeight: 1, cornerRadius: 8,
    fill: COLOR.bgSubtle,
  });
  wrap.appendChild(mkText("SAME TOOL, FOUR VIEWS, SPLIT OWNERSHIP", { font: FONT_M, size: 11, color: COLOR.fgMuted, letterSpacing: 3 }));
  var innerW = CONTENT_WIDTH - 32;
  var cellW = Math.floor((innerW - 12) / 2);
  var rows = [[QUADRANT[0], QUADRANT[1]], [QUADRANT[2], QUADRANT[3]]];
  rows.forEach(function (pair) {
    var row = autoFrame("quad-row", "HORIZONTAL", { spacing: 12, fixedMain: true });
    row.resize(innerW, row.height);
    pair.forEach(function (cell) {
      var c = ownerColors(cell.owner);
      var box = autoFrame("quad-cell", "VERTICAL", {
        padding: 12, spacing: 6, cornerRadius: 6, fill: COLOR.bg,
        stroke: cell.owner ? c.fg : COLOR.border, strokeWeight: 1,
      });
      if (!cell.owner) { try { box.dashPattern = [3, 3]; } catch (e) {} }
      box.appendChild(mkText(cell.title, { font: FONT_SB, size: 12.5, color: COLOR.fg, width: cellW - 24 }));
      box.appendChild(mkText(cell.text, { font: FONT_R, size: 11.5, color: COLOR.fgMuted, width: cellW - 24, lineHeightPct: 140 }));
      row.appendChild(box);
    });
    wrap.appendChild(row);
  });
  return wrap;
}

function mkStage(stage) {
  var row = autoFrame("stage-" + stage.num, "HORIZONTAL", { spacing: 20, crossAlign: "MIN" });

  var marker = autoFrame("marker", "HORIZONTAL", {
    stroke: COLOR.accent, strokeWeight: 2, cornerRadius: 999,
    mainAlign: "CENTER", crossAlign: "CENTER", fixedMain: true, fixedCross: true,
  });
  marker.resize(40, 40);
  var markerText = mkText(stage.num, { font: FONT_SB, size: 15, color: COLOR.fg });
  marker.appendChild(markerText);
  row.appendChild(marker);

  var card = autoFrame("card", "VERTICAL", { spacing: 10 });

  card.appendChild(mkText(stage.phase, { font: FONT_M, size: 11, color: COLOR.fgMuted, letterSpacing: 2 }));
  if (stage.owner) card.appendChild(mkOwnerTag(stage.owner));
  card.appendChild(mkText(stage.title, { font: FONT_B, size: 21, color: COLOR.fg, width: CONTENT_WIDTH }));

  stage.body.forEach(function (p) {
    card.appendChild(mkText(p, { font: FONT_R, size: 14, color: COLOR.fg, width: CONTENT_WIDTH, lineHeightPct: 148 }));
  });

  if (stage.detail) {
    var list = autoFrame("detail-list", "VERTICAL", { spacing: 8 });
    stage.detail.forEach(function (d) {
      var item = autoFrame("detail-item", "HORIZONTAL", { spacing: 8, fixedMain: true });
      item.resize(CONTENT_WIDTH, item.height);
      item.appendChild(mkText("•", { font: FONT_R, size: 14, color: COLOR.fgMuted }));
      item.appendChild(mkText(d, { font: FONT_R, size: 13.5, color: COLOR.fg, width: CONTENT_WIDTH - 20, lineHeightPct: 145 }));
      list.appendChild(item);
    });
    card.appendChild(list);
  }

  if (stage.friction) card.appendChild(mkFriction(stage.friction));
  if (stage.images) card.appendChild(mkShotsRow(stage.images));
  if (stage.quadrant) card.appendChild(mkQuadrant());
  if (stage.badges) card.appendChild(mkBadgeRow(stage.badges));
  if (stage.parallel) card.appendChild(mkParallelGroup(stage.parallel));
  if (stage.source) card.appendChild(mkSourceTag(stage.source));

  row.appendChild(card);
  return row;
}

function mkGapStage(stage) {
  var row = autoFrame("stage-gap", "HORIZONTAL", { spacing: 20, crossAlign: "MIN" });
  var marker = autoFrame("marker", "HORIZONTAL", {
    stroke: COLOR.border, strokeWeight: 2, cornerRadius: 999,
    mainAlign: "CENTER", crossAlign: "CENTER", fixedMain: true, fixedCross: true,
  });
  marker.resize(40, 40);
  try { marker.dashPattern = [3, 3]; } catch (e) {}
  marker.appendChild(mkText(stage.num, { font: FONT_SB, size: 15, color: COLOR.fgMuted }));
  row.appendChild(marker);

  var card = autoFrame("card", "VERTICAL", { spacing: 10 });
  card.appendChild(mkText(stage.phase, { font: FONT_M, size: 11, color: COLOR.fgMuted, letterSpacing: 2 }));
  if (stage.owner) card.appendChild(mkOwnerTag(stage.owner));
  card.appendChild(mkText(stage.title, { font: FONT_B, size: 21, color: COLOR.fgMuted, width: CONTENT_WIDTH }));
  var noteBox = autoFrame("gap-note", "VERTICAL", {
    padding: 14, stroke: COLOR.border, strokeWeight: 1, cornerRadius: 8,
  });
  try { noteBox.dashPattern = [4, 4]; } catch (e) {}
  noteBox.appendChild(mkText(stage.note, { font: FONT_R, size: 13, color: COLOR.fgMuted, width: CONTENT_WIDTH - 28, lineHeightPct: 145 }));
  card.appendChild(noteBox);
  row.appendChild(card);
  return row;
}

function mkIOStep(step) {
  var railColor = step.ghost ? COLOR.border : COLOR.accent;
  var stepW = 200;
  var col = autoFrame("io-step", "VERTICAL", { spacing: 8 });
  var rail = figma.createRectangle();
  rail.resize(stepW, 3);
  rail.fills = [solidPaint(railColor)];
  rail.cornerRadius = 2;
  col.appendChild(rail);
  col.appendChild(mkText(step.num, { font: FONT_M, size: 11, color: step.ghost ? COLOR.fgMuted : COLOR.accent, letterSpacing: 1 }));
  col.appendChild(mkText(step.title, { font: FONT_SB, size: 14, color: step.ghost ? COLOR.fgMuted : COLOR.fg, width: stepW }));
  col.appendChild(mkText(step.text, { font: FONT_R, size: 11.5, color: COLOR.fgMuted, width: stepW, lineHeightPct: 140 }));
  return col;
}

function mkNavSplit() {
  var wrap = autoFrame("nav-split", "HORIZONTAL", {
    padding: 24, spacing: 24, stroke: COLOR.border, strokeWeight: 1, cornerRadius: 10,
    fill: COLOR.bgSubtle, crossAlign: "MIN",
  });

  var imgCol = autoFrame("nav-split-image", "VERTICAL", { spacing: 6 });
  var chrome = autoFrame("browser-chrome", "VERTICAL", { stroke: COLOR.border, strokeWeight: 1, cornerRadius: 8 });
  chrome.appendChild(mkImageRect("navSidebar", 220));
  imgCol.appendChild(chrome);
  imgCol.appendChild(mkText(IMAGES.navSidebar.caption, { font: FONT_R, size: 11, color: COLOR.fgMuted, width: 220, lineHeightPct: 135 }));
  wrap.appendChild(imgCol);

  var copyCol = autoFrame("nav-split-copy", "VERTICAL", { spacing: 12, fixedCross: true });
  copyCol.resize(CONTENT_WIDTH - 220 - 24 - 48, copyCol.height);
  var copyW = CONTENT_WIDTH - 220 - 24 - 48;
  copyCol.appendChild(mkText("Before the steps: two teams, two nav trees — almost", { font: FONT_SB, size: 18, color: COLOR.fg, width: copyW }));
  copyCol.appendChild(mkText(
    "Marly itself models Sales and Ad Ops as separate areas of the tool, which is a useful map for the journey below — every stage carries a Sales or Ad Ops tag showing who actually does that work.",
    { font: FONT_R, size: 13.5, color: COLOR.fgMuted, width: copyW, lineHeightPct: 148 }
  ));
  copyCol.appendChild(mkText(
    "But the nav doesn't map perfectly onto who does the work. Ad Plans, Orders, and Vetting Contacts all live inside the “Sales” folder in the sidebar — yet Ad Ops runs scheduling day to day and owns vetting outright. Brett confirmed this directly when asked where the line actually sits: “Ad ops is responsible for vetting requests once sales puts together the initial list of shows from the rate card.” Nav placement is old information architecture; the tags below follow what the two teams actually said they own, not which folder a page sits in.",
    { font: FONT_R, size: 13.5, color: COLOR.fgMuted, width: copyW, lineHeightPct: 148 }
  ));
  var tagRow = autoFrame("tag-row", "HORIZONTAL", { spacing: 8, crossAlign: "CENTER" });
  tagRow.appendChild(mkOwnerTag("sales"));
  tagRow.appendChild(mkOwnerTag("adops"));
  copyCol.appendChild(tagRow);

  wrap.appendChild(copyCol);
  return wrap;
}

function mkSalesOngoing() {
  var section = autoFrame("sales-ongoing", "VERTICAL", { spacing: 16 });
  section.appendChild(mkOwnerTag("sales"));
  section.appendChild(mkText("Running underneath every deal: work that's Sales-only, all the time", { font: FONT_B, size: 24, color: COLOR.fg, width: CONTENT_WIDTH }));
  section.appendChild(mkText(
    "None of this is tied to any single RFP or IO — it's Thomas's standing weekly workload, running continuously beside whatever stage any given deal happens to be in above. Ad Ops has no role in any of it.",
    { font: FONT_R, size: 14, color: COLOR.fgMuted, width: CONTENT_WIDTH, lineHeightPct: 148 }
  ));
  var grid = autoFrame("sales-ongoing-grid", "HORIZONTAL", { spacing: 14, wrap: true, fixedMain: true });
  grid.resize(CONTENT_WIDTH, grid.height);
  var cardW = Math.floor((CONTENT_WIDTH - 28) / 3);
  SALES_ONGOING.forEach(function (it) {
    var card = autoFrame("sales-ongoing-card", "VERTICAL", {
      padding: 14, spacing: 6, cornerRadius: 8, stroke: COLOR.border, strokeWeight: 1, fill: COLOR.bg,
    });
    var leftBar = figma.createRectangle();
    // simulate the HTML's colored left border with a thin accent rectangle above the title
    leftBar.resize(24, 3);
    leftBar.fills = [solidPaint(COLOR.sales)];
    leftBar.cornerRadius = 2;
    card.appendChild(leftBar);
    card.appendChild(mkText(it.title, { font: FONT_SB, size: 13.5, color: COLOR.fg, width: cardW - 28 }));
    card.appendChild(mkText(it.text, { font: FONT_R, size: 12, color: COLOR.fgMuted, width: cardW - 28, lineHeightPct: 142 }));
    grid.appendChild(card);
  });
  section.appendChild(grid);
  section.appendChild(mkSourceTag("Thomas Mancusi (Sales) interview"));
  return section;
}

async function build() {
  await loadFonts();

  var page = figma.createPage();
  page.name = "Sales & Ad Ops Journey";
  figma.currentPage = page;

  var root = autoFrame("Sales & Ad Ops Journey", "VERTICAL", {
    padding: 64, spacing: 56, fill: COLOR.bg,
  });

  // Header
  var header = autoFrame("header", "VERTICAL", { spacing: 14 });
  header.appendChild(mkText("DAYLIGHT MEDIA · INTERNAL — CURRENT STATE", { font: FONT_SB, size: 12, color: COLOR.primary, letterSpacing: 2 }));
  header.appendChild(mkText("The Sales & Ad Ops Journey", { font: FONT_B, size: 38, color: COLOR.fg, width: CONTENT_WIDTH, lineHeightPct: 108 }));
  header.appendChild(mkText(
    "How a podcast ad buy actually moves today — from an agency's first RFP to a make-good email six months later — and exactly where the line sits between what Sales owns and what Ad Ops owns, confirmed directly in the two teams' own alignment conversation.",
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
  legendItem("Sales-owned", COLOR.sales);
  legendItem("Ad-Ops-owned", COLOR.adops);
  legendItem("Tool in use", null, COLOR.fgMuted);
  legendItem("Friction point", COLOR.destructive);
  legendItem("Source", COLOR.accent);
  header.appendChild(legendRow);
  root.appendChild(header);

  // Nav-split callout
  root.appendChild(mkNavSplit());

  // Stages
  STAGES.forEach(function (s) { root.appendChild(mkStage(s)); });
  root.appendChild(mkGapStage(GAP_STAGE));

  // Sales-only ongoing work
  root.appendChild(mkSalesOngoing());

  // IO lifecycle module
  var ioSection = autoFrame("io-lifecycle", "VERTICAL", { spacing: 20 });
  ioSection.appendChild(mkText("The IO, traced end to end", { font: FONT_B, size: 24, color: COLOR.fg, width: CONTENT_WIDTH }));
  ioSection.appendChild(mkText(
    "Where the Insertion Order's own lifecycle is actually supported by the sources — and exactly where that trail goes cold.",
    { font: FONT_R, size: 14, color: COLOR.fgMuted, width: CONTENT_WIDTH, lineHeightPct: 145 }
  ));
  var ioRow = autoFrame("io-steps", "HORIZONTAL", { spacing: 16, wrap: true });
  IO_STEPS.forEach(function (st) { ioRow.appendChild(mkIOStep(st)); });
  ioSection.appendChild(ioRow);
  root.appendChild(ioSection);

  // Naming callout
  var callout = autoFrame("naming-note", "VERTICAL", {
    padding: 18, spacing: 8, stroke: COLOR.border, strokeWeight: 1, cornerRadius: 8,
    fill: COLOR.bgSubtle,
  });
  callout.appendChild(mkText("A note on names", { font: FONT_SB, size: 16, color: COLOR.fg }));
  callout.appendChild(mkText(
    "More names keep showing up for what may be one system, several, or a front-end/back-end split: Brett says “Marley” verbally and drops “Bolt” once with no elaboration; screenshots show a “Marly” workspace inside an app branded “QCode” (app.qcodemedia.dev); Thomas (Sales) instead calls the same order/ad-plan system “Molly,” with “Bob”/“Vault” as the ad-plan front end sitting on top of it. Treat Marly/Marley/QCode/Molly/Bob/Vault/Bolt as one unresolved naming cluster — this journey uses “Marly/QCode” and “Bob/Vault” as the two most-repeated forms, not because either is confirmed as canonical.",
    { font: FONT_R, size: 13, color: COLOR.fgMuted, width: CONTENT_WIDTH - 36, lineHeightPct: 150 }
  ));
  root.appendChild(callout);

  // Methodology footer
  var footer = autoFrame("methodology", "VERTICAL", { spacing: 10 });
  footer.appendChild(mkText("Methodology & gaps", { font: FONT_SB, size: 16, color: COLOR.fg }));
  var footerItems = [
    "Built from Sales & Ad Ops Flow.pdf/.pptx, both Brett Connaughton (Ad Ops) interviews, the Thomas Mancusi (Sales) interview, Team Roles.pdf, and screenshots pulled from the combined stakeholder-interviews packet plus an earlier pass's screenshots (image bytes preserved; their original source file no longer exists under its old name — see notes.md).",
    "Every ownership tag (Sales / Ad Ops / Finance) above is sourced to a direct interview quote, not inferred from where a feature happens to sit in Marly's own navigation — the nav-split callout near the top explains why that distinction matters.",
    "This covers Sales → Ad Ops → Delivery, plus the Sales-only ongoing work that runs alongside it. Legal/contract execution is still outside what the current-state sources confirm; Finance invoicing/payouts is now current-state-confirmed (journeys/finance/notes.md) but deliberately left undetailed here as out of scope.",
    "Erin Herting (Sales) and Kyle Larson (Ad Ops) are both named as owning real work in Brett's/Thomas's accounts but haven't been interviewed themselves yet — their own accounts may add or correct detail."
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
  figma.notify("Sales & Ad Ops Journey (v2) built on a new page — fully editable.");
  figma.closePlugin();
}

build().catch(function (err) {
  console.error(err);
  figma.notify("Build failed: " + err.message, { error: true });
  figma.closePlugin();
});
