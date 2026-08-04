# Sales & Ad Ops — persona notes

Persona-specific reconstruction. Cross-cutting system/tool/terminology facts live in `.claude/skills/daylight-journey-mapping/references/system-facts.md` instead — don't duplicate those here, link to them.

Last updated: 2026-07-18 (v2 — folded in Ad Ops Pt.2's explicit Sales/Ad Ops boundary discussion in full, Thomas Mancusi's Sales-side interview via `journeys/sales/notes.md`, and two new screenshots from the combined interviews packet. This pass adds explicit per-stage ownership tags, which the v1 journey didn't have, and restructures the stage numbering so Sales-owned and Ad-Ops-owned steps each get their own stage where the work is genuinely separable.)

## Status

- **Published artifact**: https://claude.ai/code/artifact/db1784a8-68e8-4555-99fe-d9a67fd820bb (republish with this same `url` to keep the link stable — see SKILL.md).
- **Figma plugin**: `figma-plugin/` in this folder — updated for v2 (nav-split callout with the Marly sidebar screenshot, 10 renumbered/owner-tagged stages, the Bob/Vault quadrant diagram, the Sales-only ongoing-work section, owner labels on the IO lifecycle). Syntax-checked (`node --check` on both `code.template.js` and `code.js`) but not yet execute-tested inside real Figma — an attempt to build it via the MCP `use_figma` bridge hit that connector's per-seat tool-call rate limit partway through (only the header + nav-split callout landed in a scratch file before the limit hit), so the user is running the updated local plugin themselves instead. Treat the first real run as a test — see the plugin's README for what to do if a frame looks wrong.
- **v1's known gap is now closed**: `Understanding User Needs w Product Pt. 2 (Ad Ops_ Brett)` has been read in full. It was mostly a future-state "Bob 2.0" requirements conversation, but it also contained the single most useful thing for this journey: a real meeting where Sales and Ad Ops explicitly drew their functional boundary out loud. That's reflected below and in `system-facts.md`.

## Sources this journey is built from

- `Sales & Ad Ops Flow.pdf` / `refs/Foundation/Sales & Ad Ops Flow.pptx` (same content, two exports) — the original RFP → vetting → submission flow.
- Brett Connaughton (Ad Ops), both interviews: `Understanding User Needs w Product (Ad Ops_Brett)` (Pt.1) and `Understanding User Needs w Product Pt. 2 (Ad Ops_ Brett)`.
- Thomas Mancusi (Sales) interview, via `journeys/sales/notes.md` — confirms/enriches the RFP/vetting/submission stages from the seller's side and supplies the Sales-only parallel-track content below.
- `refs/Foundation/Team Roles.pdf` — roster + department, used for who's-who. Aaron Hurting and Haley Chapman are named repeatedly in interviews but aren't on the roster table itself — treat as real people, unconfirmed level.
- The combined `[Daylight] Stakeholder Interviews.pdf` packet — two new screenshots pulled from it for this pass (Marly's full sidebar showing the Sales/Ad Ops nav split; the real Roster/Rate Card spreadsheet). The packet's other screenshots (Custom Opportunities, One Sheets, Finance nav/Payout Report) belong to other personas' journeys, not this one.
- Cross-referenced against `refs/Foundation`'s Babbel×Oxford-Road brief and OR RFP template for concrete examples.
- A prior pass's screenshots (Ad Plan/BOB grid, IO template split-screen, Orders/Spots+Dynamic Order, Podscribe dashboard, Delivery Reports table) were sourced from a "My Notes.pdf" / "Build Team Sync notes" that no longer exist under those names in `refs/`. The extracted image bytes are preserved in `journey.html` since the source can't be re-opened to double check — don't cite those exact filenames as re-checkable going forward.

## Explicit ownership model (the actual ask this pass was built to answer)

Confirmed directly in a real Sales/Ad Ops alignment meeting (Brett, Pt.2, 2026-07-17) — not inferred:

| Function | Owner | Confirmed by |
|---|---|---|
| RFP intake (client demand comes in) | **Sales** | Brett: "sales will do the RFP rate card pulling" |
| Rate card filtering (competitive-exclusivity check, previous-vetting check, criteria filter) | **Sales** | Brett Pt.2 |
| Vetting requests (sending them, logging responses) | **Ad Ops** | Brett: "Ad ops is responsible for vetting requests once sales puts together the initial list" |
| Drafting/submitting the RFP into each agency's template | **Sales** (Aaron Hurting, ~95% of the time — "half ad ops, half sales assistant") | Brett Pt.2 |
| Ad plan & scheduling | **Ad Ops** | Brett: "yeah, sales will happen before this... adops is owning scheduling" — confirmed as a direct yes |
| Order entry / papering the IO | **Ad Ops** | Brett Pt.1 + Pt.2 |
| Ad-copy trafficking | **Ad Ops** (Kyle Larson specifically) | Brett Pt.2 |
| Host/product onboarding | **Ad Ops** (Mercedes Molina specifically) | Brett Pt.1 |
| Pre-approval tracking | **Ad Ops** | Brett Pt.1 + Pt.2 |
| Revisions / flight shifts / make-goods | **Ad Ops** | Brett Pt.1 + Pt.2 |
| Delivery reporting & performance tracking | **Ad Ops** (proactive cadence owned by Haley Chapman) | Brett Pt.2 |
| Client (weekly/proactive) reporting | **Ad Ops** | Brett Pt.2: "sales doesn't really need visibility into a lot of this... they'll go in and check as needed" |
| Rate/CPM setting, Master List/Rate Card ownership, renewal & win-back, prospecting, ad-placement doctrine | **Sales only** (Thomas specifically for the Rate Card: "no one's allowed to touch it but me") | Thomas interview, via `journeys/sales/notes.md` |
| Invoicing & payouts | **Finance** (out of scope for this journey — now confirmed current-state via Jesse's interview, see `journeys/finance/notes.md`, superseding the old "only in the future-state Flex PRD" framing) | Jesse Tracy interview |

**Caveat that matters as much as the table itself:** Marly's own nav groups Ad Plans, Orders, and Vetting Contacts under a "Sales" folder in the sidebar — but that's stale information architecture, not who actually does the work. Brett confirmed directly that nav placement and functional ownership have drifted apart. Ownership tags in the journey below follow the interview quotes, not the nav structure.

**The shared ad-plan tool ("Bob"/Vault) itself is quadrant-owned, not jointly owned** — see `system-facts.md`'s Bob/Vault entry: top-left (the schedule grid) is Ad-Ops-only; top-right and bottom-left (incl. the Fill Rate table) are Sales-only (Thomas + "Kel"); bottom-right is an open question. This is worth surfacing visually since it shows the ownership split exists even inside one screen, not just across process stages.

## Process reconstruction (current state) — renumbered for v2 to give Sales/Ad Ops each their own stage where the work is genuinely separable

1. **RFP intake** — Sales. Agency sends brand/demo/requirements against a shared brief/submission template. Real example: Babbel × Oxford Road brief.
2. **Rate card filtering** — Sales. Competitive-advertiser check (exclusivity: 3 embedded spots or 3 months of DAI secures it, holds 30 days after last ad airs) → previous-vetting check → criteria filter to the RFP's demo/requirements.
3. **Vetting** — Ad Ops. Sends vetting requests for the remaining un-vetted shows Sales handed off; logs the "whys" back onto the Rate Card.
4. **Submit & get feedback** — Sales. Aaron Hurting adapts the filtered list into whichever template the agency uses (~95% of the time); client responds none/some/all.
5. **Ad plan & scheduling** — Ad Ops. Confirmed shows move into the Ad Plan ("BOB," Book of Business) — a week-over-week grid in Marly/QCode/Vault. Manual rules, no system enforcement: ~3 spots/3 weeks apart, balanced spread, midroll rotation "fair and equal," episodic category exclusivity (flagged gap). This is also the stage where the Bob/Vault quadrant-ownership split is most visible — see callout.
6. **Order entry ("papering")** — Ad Ops. The biggest time sink, per Brett directly, in both interviews. IO arrives in an inconsistent format, gets manually re-entered spot-by-spot (no bulk-select). Runs alongside (not after): host/product onboarding (Mercedes, Ad Ops), ad-copy trafficking (Kyle Larson, Ad Ops — Monday audit / Wednesday follow-up cadence, see system-facts.md), pre-approval tracking (Ad Ops).
7. **Revisions & make-goods** — Ad Ops. Tracked against the raw email thread; underdelivery make-goods use a Dynamic Order against back catalog. The Pt.2 interview added real texture here: shifting flights today means manually copying script/revenue/impressions data out, deleting the old flight, and re-entering it in the new week — for a 35-flight order with a 3-week minimum separation rule, moving one flight means manually redoing all of them, and the ad plan starts lagging badly past 10-15 edits. Drag-and-drop ("Bob 2.0") is the single most-requested Ad Ops feature. Cancellations still delete history with no audit trail.
8. **Delivery reporting & performance tracking** — Ad Ops. "Downloads" = combined streams/YouTube/audio; Podscribe is the attribution source of truth (~8-12hr refresh). Haley Chapman owns the daily proactive-reporting schedule per agency/client. Sales-order data and delivery-report data are disconnected today (two tabs, manual CSV cross-referencing). Sales gets visibility only reactively — Brett: "sales doesn't really need visibility into a lot of this... unless Thomas is really trying to get a show sold that isn't selling."
9. **Client (weekly) reporting** — Ad Ops. Manual pull + sanity check + send, on a proactive per-client schedule (Haley); one-off requests get routed to Ad Ops as needed.
10. **Gap, now resolved elsewhere**: invoicing & payouts is Finance's, and is now current-state-confirmed via Jesse Tracy's interview (`journeys/finance/notes.md`) — no longer just a future-state Flex PRD mention, but still out of scope for a Sales/Ad Ops journey.

## Sales-owned work that runs continuously, not tied to any single deal

Not part of the linear RFP→delivery spine above — these are ongoing responsibilities Thomas (Sales) described that happen in parallel, week over week, regardless of where any individual deal sits:

- **Rate/CPM decisions** — sets, holds, or raises CPM weekly (every Monday) from 8-week trailing/forward sellout %, using custom Molly/Marly dashboards. Substantially memory-driven.
- **Master List / Rate Card ownership** — Thomas solely owns and manually edits the Excel Master List (= the Roster/Rate Card) weekly. "No one's allowed to touch it but me."
- **Delivery/performance monitoring for pricing purposes** — a distinct read of Podscribe from Ad Ops's (Podscribe informs Thomas's CPM decisions, not delivery-issue resolution).
- **Renewal/win-back & churn tracking** — tracks flight end dates and cancellations from memory to time renewal outreach.
- **Prospecting/new-brand pricing** — evaluates new advertiser fit for a show using average-unit-rate reasoning.
- **Ad placement doctrine** — Thomas's own unwritten IP, taught verbally to hosts (ads >1 min, placed ~8-10% in, ~12% apart, never past the 50% mark, as isolated "commercial islands").

## IO document lifecycle (separate trace, same sources)

Origination (Sales/Agency) → Papering (Ad Ops) → Held/pending countersignature (Ad Ops, system-driven hold state) → Revised (Ad Ops, against the email thread) → Reconciled (Ad Ops, against Podscribe) → **gap for this journey's scope**: invoiced/paid out (Finance — confirmed current-state elsewhere, not detailed here).

## Open threads worth chasing in a follow-up

- Full list of order status values beyond `Booked`/`Needs Counter Sign`.
- Whether/how episodic category exclusivity could realistically be system-enforced (raised as a want in both Ad Ops interviews, nobody's described a mechanism).
- What the Bob/Vault bottom-right view is for and who (if anyone) uses it — Brett wasn't sure himself.
- Erin Herting (Sales, roster-confirmed) hasn't been interviewed yet — Thomas is currently the only direct Sales source; her account may add or correct detail on the Sales-side ownership claims above.
- Kyle Larson (Ad Ops, roster-confirmed, owns ad-copy trafficking per Brett) hasn't been interviewed himself yet either.
