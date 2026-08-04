# Vault product & engineering — internal system rebuild

Tracks the internal effort to replace the current Marly/QCode/Bob/Molly system stack (see `business-systems.md`'s naming cluster) with a new internal platform. Distinct from `business-systems.md`: that file is current-state facts as described by stakeholders in their own interviews; this file is forward-looking — decisions, roadmap, and design intent from the build team's own working sessions. Treat entries here as **in-progress/planned**, not yet-shipped current state, unless explicitly noted otherwise.

Last updated: 2026-07-27 (first entry — "Session 1 - VALT - Product & Engineering + Internal Tools," 2026-07-27, ~1h55m. Same-day follow-up pass added the exclusivity-tier breakdown below — the AG1/Momentous episodic-separation example and the Hungry Boot/Mink + mattress-company proximity-flag examples were in the source transcript but missed on the first summarization pass.)

## Source and a transcription caveat

Source: Gemini meeting notes + auto-transcript, "Session 1 - VALT - Product & Engineering + Internal Tools," 2026-07-27, 10:28 PDT. Invited: Steve Wilson, Samantha Sifantus, Scott Kawai, Kate Friant, Jade Nakabayashi, Thomas Mancusi, QCODE Office.

**Attribution caveat:** the raw transcript diarizes almost every non-Jade speaker under one label, "QCODE Office," even though the dialogue clearly involves multiple distinct people (at minimum Samantha Sifantus doing the screen-share/demo, plus Thomas, Kate, Steve, Scott all speaking in turn — referred to by name in the third person mid-conversation). So "QCODE Office said X" in this transcript does **not** reliably mean one person said it — treat per-speaker attribution within that label as unreliable; the content/decisions are still trustworthy, just not safely quotable to a specific individual unless a name is used directly. Samantha Sifantus (Product, level 5 on the roster — see `business-systems.md`) appears to be the one driving the screen-share/demo and is most likely "Sam," addressed by name repeatedly.

Also, per Gemini's own disclaimer, this is a computer-generated transcript that "might contain errors" — several terms are visibly garbled (e.g., "Phil status" = **Fill Status**, "condom partnership" = **content partnership**, "adult 2554" likely = **women 25-54** demo, "bault"/"vault" spelling inconsistent). Cross-check anything load-bearing against the actual recording before treating it as precise.

## What "VALT"/"Vault" refers to (open naming question)

The meeting title uses **"VALT"**; the transcript itself repeatedly uses lowercase **"vault"** to refer to the new unified system (e.g., "everything you need to see within your section of vault"). Whether VALT is a deliberate project-name acronym/stylization and "vault" is the same thing casually spelled, or these are two different things, is **not confirmed** — don't assume they're identical without checking. What is clear: this is the internal name for the new platform that consolidates Marly/QCode/Bob/Molly/Salesforce into one system (see naming cluster in `business-systems.md`) — this session is effectively the resolution-in-progress of that open question, not a final answer yet.

## Top-level navigation (provisional)

Inventory, Sales, Operations, Partnerships, Legal, Financial, Roster, Users — explicitly called out as provisional/subject to reorganization, not finalized. Visible to a super-admin view; may differ per role.

## Inventory: Rate Card vs. Roster (decided split)

- **Rate Card** = the renamed Master List. Auto-filtered to **active, currently-sellable** inventory only. This is the "here's what I can sell right now" view.
- **Roster** = a separate, comprehensive **historical** view — everything that's ever been in inventory or might return to it (includes off-network/inactive shows, relationship history). Explicitly there to answer "who was on it, when did they fall off" questions (Rob was cited as regularly wanting exactly this).
- Rationale for the split: keeps the Rate Card lean (no filters needed to find what's sellable today) while preserving full history elsewhere.
- Onboarding shows (e.g., a show whose first episode is a known future date) count as **active/sellable** once the date is approved, even before air — not held back until air date.
- Current rate-card data as shown in this demo is explicitly **a shell / stale snapshot**, manually synced only when needed — not live. Team flagged concern that ~33% of visible rows were shows no longer sold. Confirmed not representative of the real system's eventual behavior.

## Social/Custom reporting split (decision)

Social inventory is being **collapsed into Custom** on the back end for financial tracking (per Willie's preference), but the **front-end Master List/Rate Card can still report Social and Custom as separate line items** if needed for presentation — Annie/Content Partnerships wanted them visually separate even though they're combined financially. This is the same item listed in the meeting's official "Decisions" summary.

## Rate Card editing & versioning (decision)

- Editing permissions restricted to **designated leads: Thomas, Kate, Willie** (an expansion beyond just Thomas — see note below).
- Each edited version is saved with a version log; only the editor's own designated version becomes "current" for everyone else. Full version history/log of every save, by whom.
- Exports must remain **Excel-compatible** (not just CSV) — explicitly because ~90% of downstream work is copying between Excel files today.
- **Cross-reference:** `business-systems.md` currently documents the *current* Excel Master List as solely Thomas-owned/edited ("No one's allowed to touch it but me"). That remains true of today's manual Excel process — this Vault-side decision describes the *planned new system's* permission model (3 named leads), not a correction to the current-state fact. Don't merge the two without confirming Thomas's current sole-ownership has actually changed.

## Custom sponsorships / catalog

- Being reworked (per Kate, with Annie) into a simplified per-show "custom catalog" (product placement, presenting sponsorship, segment sponsorship, etc.), living **outside** the main Rate Card rather than as rows within it.
- Old pricing model (3x the Rate Card spot rate for custom) is being scrapped — team felt it was overpriced and suppressing adoption; a new formula based on **AUR (Average Unit Rate)** is planned instead, without a fixed multiplier (an earlier idea of a flat 3x AUR multiplier was explicitly rejected as "too high").
- AI-driven notifications planned to alert the team (e.g., Jay/Content Partnerships) when a custom request appears on an incoming RFP, to prompt coordination with the show/host.

## Fill Status / AUR / analytics tab (decision)

- **Fill Status is being removed from the Rate Card/Inventory view** and relocated to a dedicated **Analytics** tab — this is one of the meeting's official aligned decisions.
- Analytics tab will also house **AUR (Average Unit Rate)**: a forward-looking calculation (~90-day look-forward plus historical look-back, per Thomas's existing manual process) used to inform pricing/show health, not just a static number.
- Thomas's current manual method for setting AUR/pricing (paraphrased): weighs sellout percentage over both the trailing ~8 weeks and the next ~90 days (both directions), recent order velocity/trend (e.g., 4 orders one week vs. 0 the next signals a show getting hot), and communicates sellout percentage back to shows as a health signal (example cited: a show accepted at 55% sellout initially, now expects 85%).
- A "financial health status" / leadership dashboard was discussed as a separate page from day-to-day sales views — forecasting, goal attainment, revenue trends, RPM (see below) — explicitly meant for leadership (Willie/Kate-level), not cluttering operational views for individual sellers.

## Ad Plan / "Bob" consolidation (decision)

- The existing separate tools/views — the ad-plan grid Thomas/Ad Ops call **"Bob"** and a Salesforce-based workflow — are being **merged into one unified "Ad Plan" view** inside the new system. This is one of the meeting's official aligned decisions ("Delivery report and Ad plan merged").
- Ad Plan view lets a user select spots, add to an order, assign advertiser/agency/salesperson (with per-salesperson commission-line tracking), and see order history in one place.
- **Automated fair/equal rotation scheduling** planned, with manual override capability (e.g., to force first position on a spot, or reserve share-of-voice).
- **Audit logs / cancellation tracking**: explicitly on the roadmap. Current pain point cited: ~23% of booked spots get cancelled, and there's currently no tracked history of what was cancelled/moved on a given spot. This is one of Sam's assigned next steps ("Track Order Cancellations").
- **Delivery reporting integration**: pulling Podscribe impression/delivery data directly into the Ad Plan view (a hover/tooltip showing recent delivery per spot) is a stated priority. An automated weekly (Monday) health-check flagging under-delivering shows via a 30-day lookback was discussed as a future addition (not yet built) — example shows named as currently under-delivering: **Jillian Love**, **Dawn Ryan** (verify these show names against the recording; possible transcription errors).
- **Cross-show view**: identified as a real gap — the Ad Plan view is granular (one show at a time) and there's no way to monitor multiple shows/aggregate data (delivered impressions, sold CPMs) at once. Jade raised this directly; team agreed on a "collapsing" UI concept (multiple shows shown minimized/aggregated, expandable) but did not fully design it. Agreed data points needed per show for this view: delivered impressions, impressions sold-at CPM, and any special IO requirements (e.g., "must be mid-roll one," host-read requirement, exclusivity flags).
- **Role-based views**: Sales and Ad Ops will see different, purpose-built views/data on what is structurally the same underlying page (e.g., ad-copy-readiness status is Ad-Ops-relevant only; sales-relevant fields like spend/CPM/impressions would show instead for a salesperson). This is one of the meeting's official aligned decisions.
- **Automated conflict/exclusivity flagging**: planned AI-driven flags for category conflicts (e.g., two mattress companies placed too close together) and specific IO requirements (e.g., "must be mid-roll one," "100% share of voice," listed competitor exclusions). Explicitly scoped as a **later pass** (apply ML on top of the built system, not a launch blocker) and explicitly **advisory only** — the system should flag/inform, not auto-decide. This mirrors the RFP date-conflict decision below.
- **Pre-roll/post-roll handling**: most shows only have mid-rolls bookable; pre/post-roll slots exist for some shows and should be addable inline from the Ad Plan view (today requires navigating to a separate show-details page). Onboarding process will let the team set a per-show standard ad-unit allocation (e.g., "4 mid-rolls, 1 pre-roll") with manual override support everywhere.
- **Fill rate should be calculated only against the show's standard allocation**, not inflated by ad-hoc additions — e.g., if a show's standard is 4 mid-rolls and a 5th is added ad hoc, fill rate stays based on 4, not retroactively redefined as 5.
- **Programmatic/DAI vs. embedded/influencer reads**: team wants these represented separately (a separate field/count for programmatic pre-rolls vs. embedded ones), since fill rate calculations depend on knowing which slots are "real" bookable inventory vs. programmatic backfill. Long-term goal: automate ad-marker insertion/removal via the hosting platform API (megaphone or similar) rather than manual editing — e.g., auto-removing a 60-day-expired embedded ad by pointing to a different RSS enclosure. This is explicitly **phase three** (hosting/distribution/file-editing), after phase two (current focus: internal business operations).

## Competitive/category exclusivity (decisions + mechanics)

- **Official decision**: a 30-day cooldown/exclusivity period applies **only if a client purchases three or more spots simultaneously** — this refines/should be reconciled with the existing exclusivity note in `business-systems.md` ("3 embedded spots or 3 months of DAI impressions secures it; holds 30 days after last ad airs"). Buying only 1-2 spots does not trigger exclusivity today (example cited: Warby Parker running two concurrent spots with no exclusivity claim).
- 30 days is described as roughly industry-standard, though the "real" industry ask is closer to 45 days; Daylight/QCODE's own policy is 30 (framed as relatively low/generous by industry standards).
- **Integrating the competitor-exclusivity check/algorithm was named the single #1 development priority** in this session (also one of the official "Decisions" and "Next steps" items) — explicitly because of how central and manual it currently is (per Thomas: this has been done by memory/experience for 3 years with no dedicated system support).
- Mechanics discussed: uses IAB advertiser categories, but IAB categories alone are too coarse (two non-"direct" competitors can still be functionally competitive, e.g., two food-delivery-to-your-house brands). Scott Kawai is already prototyping a scraper that pulls each advertiser's own site description to refine categorization, and floated an AI-agent-assisted "is this actually competitive" judgment layer as a possible filter in Marly/Vault.
- **There isn't one uniform exclusivity rule — at least three distinct tiers came up in this session, and they aren't yet formally systematized:**
  1. **Full show-level ban** — some competitor pairs are described as flatly unable to appear on a show at all, in any episode ("some competitors can't be on the show at all"). This is the strictest tier.
  2. **Episodic-level separation (same show, different episode allowed)** — a looser tier for pairs that are competitive but not banned outright: explicitly named example is **AG1 and Momentous**, which *can* both run on the same show, just **never in the same episode**. This is a meaningfully different (softer) rule than tier 1 and the two shouldn't be conflated.
  3. **Category-adjacency proximity flag (soft/advisory)** — for brands that aren't direct competitors but are in an adjacent category, the planned UI concept is a "how close in time/spots" sensor: named example **Hungry Boot and Mink** (both food-delivery-to-your-door, not direct competitors) would trigger a **yellow** flag if placed within some not-yet-defined distance of each other. A harder case — **two mattress companies placed immediately adjacent** — would trigger a **red** flag instead of yellow. Both are explicitly meant to be advisory indicators in the UI, not automatic blocks (see the human-oversight decision below) — yellow/red is a severity signal to a human, not a rule engine that rejects placements outright.
  4. **Time-bound purchase-triggered exclusivity hold** — a separate axis from the above: once a client's purchase crosses a threshold (see the 30-day-cooldown decision above), the category is held/protected for 30 days after the client's last air date. This is about protecting a *purchasing* client's category for a time window, not about which shows/episodes a *non-purchasing or lower-volume* competitor can appear on.
  5. **Bespoke IO-level exclusivity terms** — separate from the general category system, individual client IOs can carry their own custom exclusivity language (e.g., "no other advertisers in the content," explicit named-competitor exclusions, or placement terms like "must be mid-roll one") that the system is meant to scan for and flag, on top of the general rules above.
  - None of this is fully systematized yet — tiers 1-3 in particular are still informal/manual (per Thomas: relies on his own 3 years of memory), and the session's stated goal is to get tier 3's proximity-sensor concept and tier 1/2's category-ban-vs-episodic-separation distinction into the actual exclusivity algorithm (the #1 dev priority). Treat this as the clearest documentation of the *intended* rule shape so far, not a finished spec.
- **RFP-time exclusivity check must be date-aware, not just category-aware**: the system should not filter out a show for a new RFP just because it had exclusivity in an earlier, already-expired date range (example: exclusivity held in August shouldn't block a September RFP once that window has passed). Team agreed the system should **surface this as an actionable flag/opinion** (e.g., a highlighted date with a warning), not make an automatic accept/reject decision — final call stays human. This is also captured as an official decision ("Human oversight for RFP vetting").
- **RFP process, as re-confirmed in this session** (multi-step): (1) check/remove shows where the client already has exclusivity elsewhere, (2) remove shows that already declined the brand's prior vet ("Check Previous Vetting Response"), (3) filter to fit demographics, (4) vet remaining shows for competitor conflicts. This matches (and adds date-sensitivity nuance to) the RFP flow already documented in `business-systems.md`.
- **"Test RFP" defined precisely**: essentially every RFP is a "test" in this sense — a client's short trial commitment, historically ~1 spot/month for ~3 months ("3-spot, 3-month" pattern), evaluated against the client's own success metrics before they either drop the show or expand into an annual/renewal relationship. The real signal of success, per Thomas: the client asks to come back for more (often even at a lower re-negotiated rate) — not any single internal metric.
- Distinguishing a **new RFP** vs. a **renewal/re-up ask** vs. an **annual negotiation** matters operationally (different inbound patterns) but the team explicitly decided **not** to force a rigid "revision vs. new order" data model for this — kept intentionally flexible, driven by however the client's paperwork arrives. They did want **some way to link a renewal back to its originating order/IO** to compute renewal rates later, without mandating a strict versioning scheme yet.

## RPM — new metric (introduced this session)

**RPM = "Revenue Per Thousand Millennium Impressions,"** per Thomas — despite the name, it is **not** age-segment-specific; it's revenue relative to total aggregated consumption. Definition as discussed:
- Combines **all** consumption channels for a show — audio downloads/streams, video, YouTube, newsletters, social — into one aggregate "consumption" number over a rolling period (30-day increments discussed, but Thomas pushed back that it's really a flexible time-period metric, not locked to 30/episode/week).
- Numerator is total revenue across all revenue streams (embedded + DAI + custom + social + newsletter); denominator is total consumption. Explicitly **not** meant to double-count DAI vs. embedded consumption — DAI and embedded are treated as separate revenue-producing streams measured against one shared total-consumption denominator, not summed against each other.
- Framed as a **show health indicator**, meant to live on the per-show AR (advertiser/show detail) page alongside Fill Status/AUR — this is a Thomas-owned next step ("Define RPM Metric") to formalize before it's built.
- Comparable industry concept cited: Acast's "eCPM," though Acast doesn't break it out per-show due to catalog size (~100–200k shows industry-wide vs. Daylight's ~150, ~120 of which are actively sold/non-original).

## Dashboards, notifications, mobile (decisions)

- **Personalized/modular dashboards**: users pick which modules/views to pin; dashboard becomes each person's default landing page, reducing click-depth to their most-used pages. Different roles (Sales vs. Ad Ops vs. Finance vs. Legal) need different modules — explicitly one of the official decisions ("Role-based interface views established," and separately the dashboard-personalization discussion).
- **Kate's assigned next step**: run exercises with each team to define what belongs on their dashboard and which data points matter most per role.
- **Legal-specific landing page** floated: contract-cycle calendar, fully-executed/closing/no-contract status counts — not yet built, based on limited interviews so far (Legal hasn't been formally interviewed per `business-systems.md`'s open questions).
- **Content Partnerships lifecycle automation**: automated reminders tied to test-IO milestones (e.g., after spot 2 of a 3-spot test, remind the seller to follow up before the test ends) planned, plus cataloging **why** something was cancelled (budget cut vs. performance vs. show-related) to distinguish brand behavior from show health — not yet built.
- **Notifications**: SMS, Slack, and in-app notification channels all discussed as planned/available user preference options (not all built yet).
- **Mobile**: confirmed **mobile-responsive web**, explicitly **not** a native app-store app — meaning no native push notifications. Team needs to identify which specific functions/alerts are critical enough to need on-the-go access (raised directly by Jay Green, who described being "on the ground" without desk access, unlike Thomas).
- **Advertiser/agency intelligence**: an advertiser-level dashboard pulling 18–24 months of history (past shows, running annuals, re-up candidates, competitor activity, Podscribe screenshots for visual sales-conversation use) was described as what salespeople actually want when prepping for a client call — explicitly more useful than the current per-advertiser detail page, which Thomas said he wouldn't personally use as-is.
- **Agency-advertiser relationship tracking**: a new planned data model letting one advertiser have simultaneous relationships with multiple agencies, to make spend-by-agency tracking easier.
- **Copy repository**: planned feature to assign a "lifespan" to a piece of ad copy so it auto-populates (with promo code) across applicable episodes instead of manual per-episode upload — estimated to currently cost the team ~10 hours/week of manual work (Kyle Larson's copy-audit process, per `business-systems.md`).
- **"Kits"**: a planned feature to generate shareable (optionally password-protected) public links — very early/unbuilt, just a placeholder name so far.

## Quarterly budget / invoice-vs-air-date timing

Brands with "use it or lose it" quarterly budgets need media to **actually go live** within the quarter to justify the spend against ROI — the system needs to support overriding standard invoice-date defaults so media booked appropriately can still satisfy a client's quarter-end spending deadline. No firm feature decided here, just confirmed as a real, recurring scenario the system needs to accommodate.

## Roadmap prioritization (decision)

Development sequence, explicitly confirmed: **Sales workflow first → Ad Ops → Content Partnerships → Finance** (slightly different orderings were mentioned in different parts of the meeting — the official "Decisions" list says Sales → Ad Ops → Content Partnerships → Finance, while a later recap says Sales → Partnerships → Finance without explicitly naming Ad Ops as a separate step; treat Sales-first and Finance-last as the confirmed anchor points, and double check Ad Ops's exact sequencing against the recording). **Thomas (Sales)** and **Jay Rose (Sales)** were agreed as the two personas to build/test the first workflows against — chosen specifically to allow prioritization *within* a team's workflow, since even people on the same team have very different individual needs (Thomas's are described as by far the most complex, expected to make everything after easier/faster).

## "Tammy" (internal codename)

**"Tammy" is a real internal prop label** — per this session, explicitly not a system component name, just a bit of naming/branding attached to an internal AI-assistant project, reportedly originating as a running joke about Thomas going into "Tammy mode" (an ADHD/intensity nickname from colleagues at a past company). If "Tammy" shows up elsewhere in Marly/Vault, it refers to this AI-project branding, not a separate tool.

## Analytics/Podscribe integration approach (decision)

Podscribe data currently flows into the existing system via **Airtable**, and would need to be **reimplemented directly against the Podscribe API** once the team migrates off Airtable. Decided approach: rather than ingesting and storing all Podscribe data into the new system's own Postgres database, **proxy Podscribe data directly into the UI** (functionally similar to an iframe, though not literally one) — avoids a sync/matching burden between sales-side episode records and Podscribe's own data, while still giving users (especially Thomas) the delivery intelligence they're currently getting by tabbing out to Podscribe directly. This is one of the meeting's official decisions ("Podscribe analytics display strategy").

## Next steps (owners, as stated in the meeting)

- **Sam** (most likely Samantha Sifantus): gather export-format requirements from the team → turn into standardized IO templates; compile the specific data points needed for the cross-show analytical view; facilitate an intro to an Apple distribution contact; build order-cancellation/movement tracking into audit logs.
- **Kate (Friant)**: run dashboard-module-definition exercises per team/role.
- **Thomas (Mancusi)**: formally define the RPM metric's calculation/tracking logic.
- **QCODE Office (org)**: grant Jade Nakabayashi Podscribe access (she did not have it as of this session).
- **Steve (Wilson)**: fix a calendar issue — a follow-up session had been set up as private/not inviting the team.
- **Group**: hold additional "wish list" sessions to capture Thomas's (and Jay Rose's) specific view-by-view needs; update the Rate Card to include rate floors and exclusivity metrics; hold a dedicated analytics/Podscribe-integration review session; define Content Partnerships' workflow/vetting requirements.

## Jade's contribution this session

Jade Nakabayashi shared a **Figma-based RFP-intake process map** (hand-offs, responsibilities, steps including the competitive-advertiser check) built from the team's own process description — described by the team as a cleaner, more presentable version of an internal flowchart QCODE/Sam had already sketched. Confirmed Figma access issues (a seat-swap approval delay) were resolved by escalating directly rather than waiting on the standing weekly review cadence. Worth treating this Figma map as a primary source alongside `Sales & Ad Ops Flow.pptx`/`.pdf` for the RFP flow — check with Jade for the actual Figma file link if it's needed for future journey/knowledge work.

## Open questions from this session (don't resolve by guessing)

- Is "VALT" (meeting title) the same thing as the lowercase "vault" used conversationally for the new unified system, or are they distinct? Not confirmed.
- Exact sequencing of Ad Ops in the roadmap (immediately after Sales, or bundled differently) — the meeting's summary and the live discussion didn't perfectly agree; verify against the recording if it matters for planning.
- Whether the "Jillian Love" / "Dawn Ryan" under-delivering show examples are accurate show names or transcription artifacts.
- Full resolution of the Marly/QCode/Helix/Molly/Bob/Vault/Bolt naming cluster (`business-systems.md`) — this session strongly suggests "Vault"/"VALT" is the new unifying name replacing Bob and folding in Salesforce-based workflows, but that's an inference from context, not a stated fact in the transcript.
