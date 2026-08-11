# Sales — RFP list + detail prototype

A small, self-contained functional simulation of the Valt RFPs list/detail screen — ported out of the
real `apps/valt` Next.js codebase (Sales → RFPs) into this repo's own "simple proto" convention: one static
HTML file, no build step, no backend, no Clerk/Postgres secrets required. Built after the real Valt page was
reworked so that selecting an RFP replaces the list in place (rather than opening a bottom drawer) and the
breadcrumb expands to include the open RFP's name — this prototype reproduces that exact interaction, not the
original drawer.

Last updated: 2026-08-10 (v2 — restyled to match the deployed app).

v2 — restyled the list page against a screenshot of the real deployed app (`valt-daylight-media.vercel.app/sales/proposals`)
the user shared, per an explicit "restyle to match this screenshot" ask. Changed from this proto's original
neutral-zinc/soft-pill look (copied from `sales-rfp-builder`) to: a near-black dark theme, solid/high-contrast
status pills using the same variant names as the real `proposalStatusVariant()` mapping (outline/warning/default/
success/secondary), a combined tab bar + toolbar row (Overview/Rate Card/Fill Rates/Ad Plan/Orders/**RFPs**/
Agencies/One Sheets/Kits tabs on the left, search + five filter dropdowns on the right — matching how
`PageNavSection` lays out real Valt list pages), a "New RFP" button, per-column filter dropdowns for Status/
Advertiser/Shows/Newsletters/Social Profiles (all functional, not just decorative), and small file-icon
thumbnails for the Deliverable column instead of a filename chip. All hex values here are eyeballed from the
screenshot, not sampled with a color picker or pulled from Figma/Storybook the way `sales-rfp-builder`'s tokens
were — flag anything that doesn't match if you check it against the real rendered CSS later. Sidebar icons are
still plain Unicode glyph placeholders (this repo's own established convention, see `sales-rfp-builder`
notes.md v17), not the real app's actual Lucide icon set, which wasn't inspectable from a screenshot alone.

## Status

- **Published artifact**: https://claude.ai/code/artifact/882e3171-473f-4e5d-914a-46ab8bb1daaf (republish with
  this same file path to keep the link stable, per this repo's convention).

## What this is

Entry point: sidebar → Sales → RFPs. The list is a table (Received/Submitted date, Name, Advertiser, Status,
Shows, Newsletters, Social Profiles, Deliverable, Notes). Above it, one shared row carries both the Sales
sub-nav tabs (Overview through Kits, RFPs active) and the toolbar (search + Status/Advertiser/Shows/
Newsletters/Social Profiles filter dropdowns) — mirroring the real page's `PageNavSection` layout. Clicking a
row swaps the table out for a detail view of that RFP (Overview, Submitted Shows, Deliverable, Submitted
Newsletters, Submitted Social Profiles, Notes) and the breadcrumb above it goes from "Sales › RFPs" to
"Sales › RFPs › {RFP name}" — mirroring the real app's page-based detail view exactly. "← Back to RFPs" (or
the breadcrumb) returns to the table.

**Submitted Newsletters** and **Submitted Social Profiles** are editable — matching the real app, where those
two links are app-managed (not Airtable-synced) and stay open to editing regardless of RFP status. Each is a
chip list with a "+ Add…" button that opens a small checkbox popover; checking/unchecking updates the chips
immediately. There's no persistence (a page refresh resets everything, per this repo's usual "no persistence"
prototype convention — see `sales-rfp-builder/notes.md`'s Open threads) and no server round-trip, since there's
nothing to save to.

**Submitted Newsletters** and **Submitted Social Profiles** are editable — matching the real app, where those
two links are app-managed (not Airtable-synced) and stay open to editing regardless of RFP status. Each is a
chip list with a "+ Add…" button that opens a small checkbox popover; checking/unchecking updates the chips
immediately. There's no persistence (a page refresh resets everything, per this repo's usual "no persistence"
prototype convention — see `sales-rfp-builder/notes.md`'s Open threads) and no server round-trip, since there's
nothing to save to.

## What's real vs. simulated

- **Rows 1–16's advertiser names, RFP names, statuses, dates, and show chips are real** — copied from the
  screenshot of the deployed app shared for this restyle pass (Arca Wealth Management, Bonobos, PrizePicks,
  Hostinger, Primal Queen, Nuuly, Talkiatry, Groupon, Dipsea, AG1, Instant Hydration, Pepper, NPR - The NPR
  Politics Podcast, Uncommon Goods, Ultra Pouches, Square), including "Small Town Dick Prsents: Firehouse
  Files" verbatim — that's the real data's own typo, not one introduced here. None of those 16 rows had any
  Newsletters/Social Profiles/Notes data visible in the screenshot, so those columns are genuinely empty for
  them, not simulated-and-hidden.
- **Rows 17–18 (Babbel, ZipRecruiter) are fabricated**, kept from this prototype's v1 specifically so at least
  a couple of rows have real-looking Newsletters/Social Profiles/Notes data to demo those editors against —
  don't read either as a real Daylight record. The show names they reference (The Shawn Ryan Show, Julian
  Dorey Podcast, The Daily Beast Podcast) are real (same roster as `sales-rfp-builder`); the newsletter names
  and social handles are fabricated for this proto — there's no real newsletter/social-profile roster wired in
  here the way `sales-rfp-builder`'s Newsletters tab has one.
- **Status values, labels, and pill variant/color mapping** (`not_started`→outline, `awaiting_vet_responses`→
  warning, `rfp_submitted`→default, `io_received`→success, `closed`→secondary) are real — copied from
  `apps/valt/src/lib/proposal-status.ts` in the Valt codebase, not invented.
- **The sidebar's full nav list and the Sales tab bar's 9 tabs are real** (visible in the screenshot); the
  small glyph next to each top-level nav item is a placeholder, not the app's actual icon.

## Design system

v1's tokens/structure were copied verbatim from `prototypes/sales-rfp-builder/prototype.html` (that file's own
Figma/Storybook-confirmed neutral zinc palette). v2 re-tuned the token *values* — background darkened toward
near-black, status pills switched from soft-bg-with-border to solid/high-contrast fills, tab bar + toolbar
combined into one row — to match the deployed app's screenshot instead, while keeping the same token
*structure* (light/dark/data-theme blocks, `.col-menu` popover mechanics, chip/card shapes) so it stays
consistent with `sales-rfp-builder` at the architecture level even though the exact colors now diverge. If a
future pass gets real design-system access (Figma/Storybook) for the actual shipped Valt app rather than a
screenshot, treat these hex values as provisional and confirm them properly, the way `sales-rfp-builder` did
for its own palette.

## Files

- `prototype.html` — the full interactive prototype (single self-contained file, no build step, no
  dependencies). This is what's published via the Artifact tool.

## Open threads / next steps

- Column-header sort indicators (⇕) are decorative — clicking a header doesn't actually sort. The five
  toolbar filter dropdowns (Status/Advertiser/Shows/Newsletters/Social Profiles) and the search box are real.
- No active-filter chip row / bulk row-selection / CSV export — none were visible in the source screenshot
  (nothing was filtered/selected in it), so they weren't built. Add if this needs to demo those specifically.
- The "New RFP" button is decorative (no click handler) — same reasoning as `sales-rfp-builder`'s original
  "+ New RFP" button before that flow existed.
- If this needs to plug into `sales-rfp-builder`'s "Send to Ad Ops" handoff (i.e. a submitted RFP from that
  flow showing up here), that's a real integration point worth designing next — right now the two prototypes
  are independent and don't share state or mock data.
