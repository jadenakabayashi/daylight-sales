# Sales — RFP list + detail prototype

A small, self-contained functional simulation of the Valt RFPs list/detail screen — ported out of the
real `apps/valt` Next.js codebase (Sales → RFPs) into this repo's own "simple proto" convention: one static
HTML file, no build step, no backend, no Clerk/Postgres secrets required. Built after the real Valt page was
reworked so that selecting an RFP replaces the list in place (rather than opening a bottom drawer) and the
breadcrumb expands to include the open RFP's name — this prototype reproduces that exact interaction, not the
original drawer.

Last updated: 2026-08-10 (v1 — initial port).

## Status

- **Published artifact**: https://claude.ai/code/artifact/882e3171-473f-4e5d-914a-46ab8bb1daaf (republish with
  this same file path to keep the link stable, per this repo's convention).

## What this is

Entry point: sidebar → Sales → RFPs. The list is a table (Received/Submitted date, Name, Advertiser, Status,
Shows, Newsletters, Social Profiles, Deliverable, Notes) with a search box and a status filter — deliberately
just those two, not the full generic filter/sort/group/view engine `sales-rfp-builder/prototype.html` built for
the Rate Card table. Clicking a row swaps the table out for a detail view of that RFP (Overview, Submitted
Shows, Deliverable, Submitted Newsletters, Submitted Social Profiles, Notes) and the breadcrumb above it goes
from "Sales / RFPs" to "Sales / RFPs / {RFP name}" — mirroring the real app's page-based detail view exactly.
"← Back to RFPs" (or the breadcrumb) returns to the table.

**Submitted Newsletters** and **Submitted Social Profiles** are editable — matching the real app, where those
two links are app-managed (not Airtable-synced) and stay open to editing regardless of RFP status. Each is a
chip list with a "+ Add…" button that opens a small checkbox popover; checking/unchecking updates the chips
immediately. There's no persistence (a page refresh resets everything, per this repo's usual "no persistence"
prototype convention — see `sales-rfp-builder/notes.md`'s Open threads) and no server round-trip, since there's
nothing to save to.

## What's real vs. simulated

- **The show names are real** — pulled from the same Daylight roster already used in
  `prototypes/sales-rfp-builder` (The Shawn Ryan Show, Crime/Conspiracy/Cults/Murder, The Danny Jones Podcast,
  Woman Evolve, Inside of You with Michael Rosenbaum, Julian Dorey Podcast, The Daily Beast Podcast).
- **Everything else is fabricated for this proto**: the six RFP records themselves (names, advertisers, dates,
  status, notes, which shows/newsletters/socials are attached to which), the newsletter names, and the social
  handles. There is no real "list of past RFPs" source to pull from yet — the real Valt `proposals` table is
  the eventual source of truth for this once it's wired up, but this prototype has no backend. Don't read any
  specific advertiser/RFP pairing here as a real Daylight record.
- **Status values and their labels/lifecycle** (`not_started` → `awaiting_vet_responses` → `rfp_submitted` →
  `io_received`, plus `closed`) are real — copied from the actual enum + label mapping in
  `apps/valt/src/lib/proposal-status.ts` in the Valt codebase, not invented.

## Design system

Tokens (light/dark palette, radii, fonts) copied verbatim from `prototypes/sales-rfp-builder/prototype.html`,
which did the real Figma/Storybook fidelity work confirming this neutral zinc palette (see that file's notes.md,
v17–v26) — reusing them here keeps every prototype in this repo visually consistent rather than re-deriving
tokens from scratch. Sidebar/page-head/button/table/chip markup and classes are likewise copied from the same
file where the shape matched; the popover checklist (`.col-menu`/`.col-check-item`) reuses that file's dropdown
component for the newsletter/social-profile pickers rather than inventing a new one.

## Files

- `prototype.html` — the full interactive prototype (single self-contained file, no build step, no
  dependencies). This is what's published via the Artifact tool.

## Open threads / next steps

- No search/filter beyond name+advertiser text search and a single status dropdown — the real Valt page also
  filters by advertiser/show/newsletter/social profile. Skipped here per the "simple proto" ask; add if this
  needs to demo those filters specifically.
- No deliverable preview/thumbnail — the file chip is decorative (doesn't link anywhere real).
- If this needs to plug into `sales-rfp-builder`'s "Send to Ad Ops" handoff (i.e. a submitted RFP from that
  flow showing up here), that's a real integration point worth designing next — right now the two prototypes
  are independent and don't share state or mock data.
