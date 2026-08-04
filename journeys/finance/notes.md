# Finance — persona notes

Persona-specific reconstruction for Jesse Tracy (Finance, Level 3 on the roster — at Daylight since early 2024, scope grew from ~30 to ~100 shows). Cross-cutting system/tool/terminology facts live in `.claude/skills/daylight-journey-mapping/references/system-facts.md` — don't duplicate those here, link to them.

Last updated: 2026-07-18 (v1 — first `journey.html` built, marked WIP: single-interview persona, no cross-check yet from Legal/Product on the Bill.com or Airtable pieces).

## Status

- **Published artifact**: https://claude.ai/code/artifact/1d5e0852-800e-4f9f-8b4f-96bb67148453 (republish with this same `url` to keep the link stable).
- **Figma plugin**: `figma-plugin/` in this folder — mirrors the HTML v1 (same 9 stages, same 9 screenshots, same WIP framing). Syntax-checked (`node --check` on both `code.template.js` and `code.js`) but not yet execute-tested inside real Figma — treat the first run as a test, see the plugin's README.
- **WIP flags**: this is Jesse Tracy's account only — no second Finance stakeholder, and no Legal/Product interview yet to confirm the Bill.com handoff or the Financial Airtable's intended end-state from the builder's ("Scott's") side.

## Sources this is built from

- `Understanding User Needs w Product (Finance_ Jesse) - 2026_07_16 13_30 EDT - Notes by Gemini.pdf` (24 pages)
- Combined stakeholder-interviews packet, pp.36-40 — **9 real screenshots** pulled for this pass: a Marly/QCode "Generate Invoices" empty state; a real SPAN Report (per-show US/Intl/Premium revenue, `app.qcodemedia.dev`); the real "Last Known Position Payout Report — April 2026"; the Google Sheets "Daylight / Monetization" tab; the Financial Airtable's Monthly Reports (per-client tabs), Invoiced view, and Invoice List/Overdue view with its "Past Due Reminders" button; the real "Bubs Naturals - DIRECT" Airtable record ($556,500 total revenue / $60,000 unpaid) confirming the dual-billing workaround below; an Orders/Spots-Booked screen showing booked spot revenue Finance reconciles against. Full detail folded into [[system-facts]].
- This is the first current-state confirmation of invoicing/payouts; the sales-adops journey had previously only seen this described in a future-state "Flex PRD."

## Process reconstruction (current state)

1. **Order visibility (read-only in practice)** — Jesse can see but doesn't need write access to the orders Ad Ops enters; flags his own edit permissions as an unnecessary accidental-edit risk.
2. **Monthly invoice generation** — start of each month, generates the prior month's invoices in Marly, split by revenue type (embedded, DAI, social, custom, usage, rewards — see the Marly Finance nav in system-facts.md) rather than one combined invoice; wants combined, client-customizable invoicing instead.
3. **Billing-destination management** — selects/edits whether an order bills the advertiser or the agency; handles edge cases (e.g. a real one: Bubs Naturals wanted direct billing while its agency Podscale also wanted direct billing — Marly can't model dual/parent-child billing natively, so Jesse created a workaround duplicate "Bubs Naturals Direct" entry).
4. **Collections / past-due tracking** — monitors an invoice list/dashboard for unpaid/past-due invoices, sends (often batched) reminder emails.
5. **PDF invoice retrieval** — pulls sent-invoice PDFs from **Bill.com** (not Marly) to attach to collections follow-ups.
6. **Monthly per-show financial reporting** — Jesse's top pain point: manually populates and publishes per-show PDF reports monthly (~100 shows), sourced from Excel files an external accounting team emails in.
7. **Miscellaneous revenue tracking** — a dedicated Financial Airtable (still being built out), fed by a parsing tool ("Scott" built it) that ingests uploaded reports (e.g. a "Cloud roll" report).
8. **Internal metrics reporting (monetization sheet)** — updates a Sales+Finance-shared spreadsheet by exporting raw data out of Marly and manually pivoting in Excel (Marly/Airtable don't support pivot-table export).
9. **Broadcast-month billing reconciliation** — some clients bill on a broadcast-month cycle rather than calendar month; Marly defaults to calendar month, causing invoices to falsely show as past-due.

## Open threads

- Over-permissioned Marly access (write rights Jesse doesn't need/want).
- No native support for complex/dual billing structures.
- Invoice PDFs siloed in Bill.com instead of alongside the rest of the invoicing flow in Marly.
- Heavy manual dependency on an external accounting team's per-show Excel files.
- No pivot-table export from Marly/Airtable.
- Broadcast-month vs. calendar-month mismatch causes false past-due flags.
- The Finance Airtable / "Scott's" parsing tool is still incomplete — Jesse himself wasn't sure what part of it does.
