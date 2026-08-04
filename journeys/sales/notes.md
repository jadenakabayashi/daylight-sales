# Sales — persona notes

Persona-specific reconstruction for Thomas Mancusi (Sales, Level 4 on the roster — top salesperson, 28 years in audio, joined March 2022; grew Daylight from 4 shows/$1M revenue to 54 shows/~$61M projected). Cross-cutting system/tool/terminology facts live in `.claude/skills/daylight-journey-mapping/references/system-facts.md` — don't duplicate those here, link to them.

Last updated: 2026-07-18. No HTML artifact built yet for this persona — this note exists to ground the cross-persona task/tool table; a full journey.html hasn't been requested yet.

## Sources this is built from

- `Understanding User Needs w Product (Sales_ Thomas) - 2026_07_14 12_00 EDT - Notes by Gemini.pdf` (26 pages)
- Cross-referenced against [[system-facts]] for shared systems (Marly/Molly/Bob naming cluster, RFP flow, Rate Card/Roster)

## Process reconstruction (current state)

1. **Ad scheduling/booking** — places ads into shows via **Molly**/its sub-interface **Bob** (Thomas's own names for the order/ad-plan system — see the naming cluster in system-facts.md). Bob is shown to hosts/creators as their own ad plan; not brand-facing.
2. **IO intake/papering** — receives signed IOs by email, manually checks availability before entering. Confirms the shared "papering" process in system-facts.md.
3. **Availability/load judgment** — an unwritten mental rule (max 3 embedded ads/show/week) governs approve/decline; wants this automated with red/green status.
4. **Rate/CPM decisions** — sets, holds, or raises CPM weekly (every Monday) from 8-week trailing/forward sellout %, using custom Molly dashboards. Substantially memory-driven.
5. **Master List / Rate Card ownership** — solely owns and manually edits the Excel Master List (= the Roster/Rate Card described in system-facts.md) weekly. "No one's allowed to touch it but me."
6. **Delivery/performance monitoring** — uses Podscribe (RSS pixel, YouTube API, Spotify video) to check over/under-delivery and inform CPM decisions.
7. **Host vetting** — gets host/creator sign-off before selling any brand into a show (seller side of the shared vetting flow).
8. **RFP filtering** — manually cross-references the Master List against a client's target list (3-month exclusivity, vetting responses, genre) — currently manual copy/paste, wants automation.
9. **Renewal/win-back & churn tracking** — tracks flight end dates and cancellations from memory to time renewal outreach; wants automated cancellation/revenue-shift flags.
10. **Prospecting/new-brand pricing** — evaluates new advertiser fit for a show using average-unit-rate reasoning.
11. **Ad placement doctrine** — Thomas's own IP taught verbally to hosts (ads >1 min, placed ~8-10% in, ~12% apart, never past the 50% mark, as isolated "commercial islands"). Wants a future Podscribe-API-driven auto-scoring tool — not built.

## Sales-specific vs. shared with Ad Ops

- **Shared** (already documented in `journeys/sales-adops/notes.md`): RFP intake → competitive exclusivity check → vetting cross-reference → genre filter → email-based IO papering.
- **Sales-specific**: rate/CPM negotiation and setting, ad-load exception calls, renewal/win-back relationship management, prospecting, sole Master List ownership, the proprietary ad-placement doctrine.

## Open threads

- "Molly"/"Bob" as Thomas's names for the order system add a third naming thread to the unresolved Marly/QCode/Helix cluster — see system-facts.md.
- Wants: automated availability status, Podscribe-API placement scoring, automated cancellation/revenue-shift indicators, native (non-Excel) Rate Card, automated RFP filtering.
- Erin Herting (Sales, roster) has not been interviewed yet — may add detail Thomas didn't cover.
