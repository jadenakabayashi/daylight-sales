// Content Partnerships Journey Builder — Figma plugin (v2, WIP)
// Run via: Figma desktop -> Plugins -> Development -> Import plugin from manifest... (point at manifest.json)
// then Plugins -> Development -> Content Partnerships Journey Builder, with the target file open.
// Builds a new page with editable frames/text/images — no external network calls, all assets embedded.
// Never touches existing pages/content in the file — it only ever creates a brand-new page.
//
// Mirrors journeys/content-partnerships/template.html v2 — same copy, same sources, same WIP framing.
// v2 adds Ryan Middledorf's interview: his onboarding stage upgrades from secondhand to confirmed, plus
// two new stages (advertiser spot-check, user access/config) and 4 new real screenshots (Custom
// Opportunities, Whoop Responses, Wildmen Sponsorship Packages, a real bookings pivot). Annie Hunt's
// stage (custom packages) stays "secondhand" — she still hasn't been interviewed herself. One true gap
// stage (host detail tracking) renders dashed/grayed; other no-screenshot stages render normally but
// with an inline dashed note box instead of a screenshot row.

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
  cp: { r: 42 / 255, g: 157 / 255, b: 144 / 255 },
  cpBg: { r: 236 / 255, g: 247 / 255, b: 245 / 255 },
};

var FONT_R = { family: "Inter", style: "Regular" };
var FONT_M = { family: "Inter", style: "Medium" };
var FONT_B = { family: "Inter", style: "Bold" };
var FONT_SB = { family: "Inter", style: "Semi Bold" };

var CONTENT_WIDTH = 760;

var IMAGES = {
  oneSheetLegacy: { b64: "{{IMG_ONESHEET_LEGACY}}", w: 900, h: 645, caption: "The legacy Marly-native one-sheet output for The Shawn Ryan Show." },
  oneSheetBuilder: { b64: "{{IMG_ONESHEET_BUILDER}}", w: 900, h: 652, caption: "The builder itself: pick a podcast, generate a sheet." },
  oneSheetCanva: { b64: "{{IMG_ONESHEET_CANVA}}", w: 900, h: 652, caption: "A real finished Canva one-sheet — the production path Annie Hunt actually uses." },
  oneSheetDrive: { b64: "{{IMG_ONESHEET_DRIVE}}", w: 900, h: 652, caption: "Where finished one-sheets actually live — a Drive folder, not Marly." },
  customOpps: { b64: "{{IMG_CUSTOM_OPPS}}", w: 900, h: 768, caption: "The Custom Opportunities tracker — one row per show, dropdown status per opportunity type." },
  whoopResponses: { b64: "{{IMG_WHOOP_RESPONSES}}", w: 900, h: 399, caption: "A brand-specific pitch tracker — one advertiser, per-show approval status." },
  sponsorPackages: { b64: "{{IMG_SPONSOR_PACKAGES}}", w: 900, h: 543, caption: "The custom master sheet, confirmed real: package-level pricing with real dollar figures." },
  bookingsPivot: { b64: "{{IMG_BOOKINGS_PIVOT}}", w: 900, h: 701, caption: "The real \"7/13 Bookings\" pivot — rebuilt by hand from Marly's order data every Monday." },
};

var STAGES = [
  {
    num: "1", phase: "INTAKE", owner: "cp", ownerLabel: "CONTENT PARTNERSHIPS — RYAN MIDDLEDORF", title: "Show onboarding into Marly",
    body: [
      "Ryan owns onboarding for every new show: roughly 20-30 data points collected via a checklist plus live onboarding calls walking talent and producers through best practices and ad-sales procedures. That feeds a talent survey and a separate show survey to populate Marly before a show goes live to Sales. Both surveys carry outdated fields — Ryan: some \"don't necessarily need to be here anymore\" — and are missing newer categories like supplements and AI-ad approvals.",
      "Ryan's own fix-it list: a single \"invitation to vault\" link so producers/talent can complete every onboarding step with one sign-on instead of hunting across sources; automated 6-month update prompts instead of surveys that \"very rarely update\"; and a \"green light, red light\" signal so Jay can see at a glance when a show is fully ready to launch."
    ],
    friction: "Each survey is tied to a single email address and can't be split across collaborators — if the one person who started it can only finish half, someone else has to log in as them to complete the rest. Ryan named this directly as a process blocker, not just an inconvenience.",
    gapNote: "No screenshot for this stage — the onboarding form itself wasn't shown on screen during either interview.",
    badges: ["Marly/QCode — Onboarding", "Survey forms"],
    source: "Jay Green interview · Ryan Middledorf interview",
  },
  {
    num: "2", phase: "ONGOING", owner: "cp", title: "Vetting & partner-performance tracking",
    body: [
      "Jay tracks vetting responses and partner responsiveness at the team level; Ryan does the same per-show and supplies the number that makes it urgent: shows have 48 hours to return a vetting response before a brand's budget is typically already spoken for elsewhere — \"nine times out of 10 that money is gone.\" Ryan currently checks this by hand every other day.",
      "He also maintains a manual weekly checklist per show, cross-referencing vetting status and ad-marker completion, and wants a one-click \"generate report\" per show pulling stats/billing/approvals into one view — partly to offset Marly's own slow load times, which today force the team to keep parallel Google Sheets just to avoid losing work to a crash."
    ],
    friction: "Ryan wants an automated alert as a vet approaches or passes the 48-hour mark, with an option to auto-generate a follow-up email — while explicitly flagging the tension between automating this and preserving the personal relationship he manages with each show.",
    gapNote: "No screenshot for this stage.",
    badges: ["Marly/QCode — Vetting", "Google Sheets (parallel tracking)"],
    source: "Jay Green interview · Ryan Middledorf interview · corroborated by Erin Herting (Sales) interview",
  },
  {
    num: "3", phase: "WEEKLY — NEW THIS PASS", owner: "cp", ownerLabel: "CONTENT PARTNERSHIPS — RYAN MIDDLEDORF", title: "Advertiser spot-check & make-good verification",
    body: [
      "Every Monday, Ryan manually verifies that each advertiser's spots actually aired in their committed week and ran at least 60 seconds — the contracted minimum. A spot around 55 seconds has \"a little bit of leeway\"; one around 45 seconds triggers a make-good. He copies the underlying data out of Podscribe into Google Sheets by hand and sends the resulting report to Sales and Ad Ops."
    ],
    friction: "This looks like the same class of check Ad Ops's own delivery-reporting stage already performs against Podscribe (see journeys/sales-adops). Whether these are genuinely redundant or serve different purposes hasn't been asked on either side — flagged as an open question, not resolved here.",
    gapNote: "No screenshot for this stage — not shown on screen during the interview.",
    badges: ["Podscribe", "Google Sheets", "Email"],
    source: "Ryan Middledorf interview",
  },
  {
    num: "4", phase: "ONGOING", owner: "cp", title: "Billing & invoicing oversight",
    body: [
      "Jay monitors partner billing in Marly to spot invoicing gaps, and reports back to partners when something looks off. This is oversight, not execution — the actual invoicing work is Finance's (see journeys/finance). No update from Ryan's interview."
    ],
    gapNote: "No screenshot for this stage.",
    badges: ["Marly/QCode — Finance"],
    source: "Jay Green interview",
  },
  {
    num: "5", phase: "WEEKLY", owner: "cp", title: "Weekly booking reporting",
    body: [
      "Every Monday, Jay manually pulls the prior week's bookings out of Marly's order system into a pivot table — Show / Brand / SUM of Amount — to notify partners of closed revenue. Same manual export-and-pivot pattern Finance uses for its own monetization sheet; neither system supports pivot-table export natively."
    ],
    images: ["bookingsPivot"],
    badges: ["Marly/QCode — Orders", "Google Sheets"],
    source: "Jay Green interview · combined interviews packet",
  },
  {
    num: "6", phase: "ONGOING", owner: "secondhand", ownerLabel: "SECONDHAND — ANNIE HUNT", title: "Custom sponsorship package development",
    body: [
      "Packages beyond standard ad spots — segment sponsorships, studio/tour sponsorships, social posts, special interviews, host-specific brand asks — live entirely outside Marly, largely owned by Annie Hunt. This pass confirms it's at least three distinct real artifacts, not one: the \"Daylight Custom Opportunities\" tracker (one row per show, with richer status values than assumed in v1 — Yes/No/TBD plus \"let's get creative,\" \"open for the right brand,\" and \"limited opportunities\"); a real \"custom master sheet\" — confirmed as \"Wildmen Presenting Sponsorship Packages,\" showing actual package pricing (Exclusive Title Sponsorship at $225,000 net/3mo, Product Placement Title Sponsorship at $165,000 net/3mo); and a brand-specific pitch tracker — confirmed as \"Whoop Responses,\" logging one advertiser's per-show approval status individually."
    ],
    friction: "None of this integrates with Marly today — Jay wants the custom master sheet's rate logic and asset tracking pulled into the system directly.",
    images: ["customOpps", "sponsorPackages", "whoopResponses"],
    badges: ["Google Sheets — custom master sheet", "Google Sheets — Custom Opportunities", "Google Sheets — brand pitch trackers"],
    source: "Jay Green interview · combined interviews packet",
  },
  {
    num: "7", phase: "PER-DEAL — BEST-DOCUMENTED STAGE", owner: "cp", title: "One-sheet creation & distribution",
    body: [
      "Two parallel paths exist for the per-show marketing sheet sent to advertisers. A legacy, Marly-native builder lets anyone pick a podcast from a searchable list and auto-generate a sheet — but Jay believes it's largely unused today: \"I don't know how many sellers are actually using the Marley version anymore\" — and it can't export a PDF or paste cleanly into a deck.",
      "The actual production path runs entirely outside Marly: Annie Hunt builds one-sheets in Canva, hosted as PDFs on Google Drive. The visual layout — About the Show, Show Reach (downloads/YouTube/TikTok), The Audience (gender split, median age) — closely mirrors what the Marly builder produces, just polished and exportable."
    ],
    images: ["oneSheetLegacy", "oneSheetBuilder", "oneSheetCanva", "oneSheetDrive"],
    badges: ["Marly/QCode — One Sheets", "Canva", "Google Drive"],
    source: "Jay Green interview · combined interviews packet",
  },
  {
    num: "8", phase: "AS NEEDED", owner: "cp", title: "Ad plan updates",
    body: [
      "Any change to a show's ad plan currently requires product/\"Scott\" approval before it can go through — a bottleneck Jay flagged directly as not scalable as the show roster keeps growing. No update from Ryan's interview."
    ],
    gapNote: "No screenshot for this stage.",
    badges: ["Marly/QCode — Ad Plans"],
    source: "Jay Green interview",
  },
  {
    num: "9", phase: "PER-ORG — NEW THIS PASS", owner: "cp", ownerLabel: "CONTENT PARTNERSHIPS — RYAN MIDDLEDORF", title: "User access & configuration management",
    body: [
      "Provisioning Marley access for a newly onboarded org is fully manual and per-person. A real recent example: the Daily Beast (6 shows, roughly 15-20 people needing access) took about an hour to provision by hand. Ryan described four access tiers verbally while walking through the real product: \"Full Marley\" (everything including vetting), \"Full Marley... read only\" (everything minus vetting), \"Marley Light\" (no financials, plus vetting), and \"Marley Light with no financials\" (minus financials and vetting)."
    ],
    friction: "For each person: pick their show, set their tier, and Marly generates an invitation email — which Ryan then has to manually copy into Gmail and send, one at a time, with no bulk option.",
    gapNote: "No screenshot for this stage — not shown on screen during the interview. Whether this access model is the same system as the Admin/Manager/Editor/Analyst/Viewer table in Team Roles.pdf is unresolved — see the naming note.",
    badges: ["Marly/QCode — Access Management", "Email"],
    source: "Ryan Middledorf interview",
  },
  {
    num: "10", phase: "BACKGROUND", owner: "cp", title: "Host detail tracking",
    isGap: true,
    gapNote: "No screenshot for this stage. Granular host details — pets, birthdays, specific sponsor requests — are tracked across disparate manual documents with no unified system, the same \"no single source of truth\" pattern seen elsewhere (the Rate Card, the custom master sheet). Ryan separately wants a visual progress tracker (e.g. a completion percentage) for onboarding status per show, which points at the same underlying problem.",
    badges: ["Manual documents"],
    source: "Jay Green interview · Ryan Middledorf interview",
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

function mkOwnerTag(kind, labelOverride) {
  var isSecondhand = kind === "secondhand";
  var fg = isSecondhand ? COLOR.fgMuted : COLOR.cp;
  var bg = isSecondhand ? COLOR.mutedBg : COLOR.cpBg;
  var label = labelOverride || (isSecondhand ? "SECONDHAND" : "CONTENT PARTNERSHIPS");
  var tag = autoFrame("owner-tag", "HORIZONTAL", {
    paddingLeft: 10, paddingRight: 12, paddingTop: 5, paddingBottom: 5,
    spacing: 6, cornerRadius: 999, fill: bg, crossAlign: "CENTER",
  });
  var dot = figma.createEllipse();
  dot.resize(7, 7);
  dot.fills = [solidPaint(fg)];
  if (isSecondhand) { dot.fills = []; dot.strokes = [solidPaint(fg)]; dot.strokeWeight = 1.5; }
  tag.appendChild(dot);
  tag.appendChild(mkText(label, { font: FONT_SB, size: 11, color: fg, letterSpacing: 4 }));
  return tag;
}

function mkWipPill() {
  var tag = autoFrame("wip-pill", "HORIZONTAL", {
    paddingLeft: 9, paddingRight: 9, paddingTop: 4, paddingBottom: 4,
    spacing: 6, cornerRadius: 999, fill: COLOR.destructiveBg,
    stroke: COLOR.destructiveBorder, strokeWeight: 1, crossAlign: "CENTER",
  });
  tag.appendChild(mkText("WIP · 2 INTERVIEWS", { font: FONT_B, size: 10.5, color: COLOR.destructive, letterSpacing: 3 }));
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
  card.appendChild(mkOwnerTag(stage.owner, stage.ownerLabel));
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
  copy.appendChild(mkText("Improved since v1, still a draft", { font: FONT_SB, size: 15, color: COLOR.destructive, width: innerW }));
  copy.appendChild(mkText(
    "Ryan Middledorf — who Jay named as owning show onboarding day to day — has now been interviewed himself, confirming that stage firsthand and adding three tasks Jay never mentioned. Annie Hunt, who owns custom packages and one-sheets, still hasn't been interviewed; her work is now visually confirmed via real screenshots but still only described through Jay. Those stages keep a secondhand tag.",
    { font: FONT_R, size: 13, color: COLOR.fg, width: innerW, lineHeightPct: 145 }
  ));
  wrap.appendChild(copy);
  return wrap;
}

async function build() {
  await loadFonts();

  var page = figma.createPage();
  page.name = "Content Partnerships Journey (WIP v2)";
  figma.currentPage = page;

  var root = autoFrame("Content Partnerships Journey", "VERTICAL", {
    padding: 64, spacing: 44, fill: COLOR.bg,
  });

  // Header
  var header = autoFrame("header", "VERTICAL", { spacing: 14 });
  var eyebrowRow = autoFrame("eyebrow-row", "HORIZONTAL", { spacing: 10, crossAlign: "CENTER" });
  eyebrowRow.appendChild(mkText("DAYLIGHT MEDIA · INTERNAL — CURRENT STATE", { font: FONT_SB, size: 12, color: COLOR.primary, letterSpacing: 2 }));
  eyebrowRow.appendChild(mkWipPill());
  header.appendChild(eyebrowRow);
  header.appendChild(mkText("The Content Partnerships Journey", { font: FONT_B, size: 38, color: COLOR.fg, width: CONTENT_WIDTH, lineHeightPct: 108 }));
  header.appendChild(mkText(
    "How Daylight manages the show/partner side of the business today — onboarding, vetting, custom packages, and one-sheets — reconstructed from Jay Green (EVP, Business Strategy & Partnerships) and Ryan Middledorf, who owns show onboarding day to day and confirms much of what Jay described secondhand.",
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
  legendItem("Content Partnerships-owned", COLOR.cp);
  legendItem("Secondhand (owner not yet interviewed)", null, COLOR.fgMuted);
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
    "This journey inherits the same unresolved system-naming cluster documented in the Sales/Ad Ops journey (Marly, Marley, QCode, Molly, Bob/Vault) and uses \"Marly/QCode\" without implying either name is canonical. One name question v1 resolved: the Content Partnerships transcript's \"Annie Han\" and the org roster's \"Annie Hunt\" are confirmed as the same person. New this pass: Ryan Middledorf described a four-tier \"Full Marley / Full Marley Read Only / Marley Light / Marley Light no financials\" access model while provisioning real accounts — whether that's the same system as Team Roles.pdf's external-partner role table (Admin/Manager/Editor/Analyst/Viewer) or a separate one is a new open question, not yet resolved.",
    { font: FONT_R, size: 13, color: COLOR.fgMuted, width: CONTENT_WIDTH - 36, lineHeightPct: 150 }
  ));
  root.appendChild(callout);

  // Methodology footer
  var footer = autoFrame("methodology", "VERTICAL", { spacing: 10 });
  footer.appendChild(mkText("Methodology & gaps", { font: FONT_SB, size: 16, color: COLOR.fg }));
  var footerItems = [
    "Built from two interviews — Understanding User Needs w Product (Content Partnerships_ Jay) and Understanding User Needs w Product (Content Partnerships_ Ryan) — plus 9 screenshots pulled from the combined stakeholder-interviews packet (up from 5 in v1).",
    "Two of ten stages (3 and 9) are entirely new this pass, sourced from Ryan Middledorf's interview alone. Five of ten stages still have no supporting screenshot and are flagged individually rather than illustrated with a guess.",
    "Annie Hunt (custom packages, one-sheets) still hasn't been interviewed herself. Her work is now visually confirmed via 3 new real screenshots, but still only described secondhand through Jay.",
    "This journey doesn't yet trace how Content Partnerships' vetting/billing oversight connects to Ad Ops's vetting workflow (journeys/sales-adops) or Finance's invoicing (journeys/finance). New this pass: the spot-check stage (3) looks like it may duplicate part of Ad Ops's delivery-reporting stage — flagged, not resolved.",
    "An Erin Herting (Sales) interview landed in the same refs update but is out of scope for this journey — it independently corroborated Ryan's 48-hour vetting figure (stage 2) but is otherwise unprocessed; see system-facts.md."
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
  figma.notify("Content Partnerships Journey (WIP v2) built on a new page — fully editable.");
  figma.closePlugin();
}

build().catch(function (err) {
  console.error(err);
  figma.notify("Build failed: " + err.message, { error: true });
  figma.closePlugin();
});
