# refs/ inventory

Snapshot as of 2026-07-23 (updated: Ryan Middledorf's Content Partnerships interview + an Erin Herting Sales interview landed, and the combined packet grew/reorganized — Ryan's divider is now at the front, page numbers for everyone after him shifted) — **re-`ls` both folders before relying on this list**, they grow between sessions. This file just saves re-discovering what a given file *is* once you've already opened it.

## refs/Foundation/ — shared context, not persona-specific

| File | What it is |
|---|---|
| `Team Roles.pdf` | Org roster + role/permission levels (external partner roles + internal levels 1–5). Fully transcribed into `daylight-knowledge`'s `references/business-systems.md`. |
| `Sales & Ad Ops Flow.pptx` | Same content as the original `Sales & Ad Ops Flow.pdf` used to build the sales-adops journey (RFP → vetting → submission → feedback) — a different export of the same source, not new information. Useful as a slide-native version if you need to lift the original diagram layout. |
| `Babbel x Oxford Road Brand Brief 2026.docx (1).pdf` | A real, filled-out RFP example (client Babbel) — see `system-facts.md`'s "real concrete examples" section. Good as a worked example, not a template. |
| `OR 2026 RFP Template (3).xlsx` | The blank submission template Oxford Road (a real, named client) wants filled in — far more columns than the flow doc implies (embedded vs. dynamic media, audio/video split, full demo block, exclusivity terms, pixel/ad-server compatibility). Fully described in `system-facts.md`. |

## refs/Stakeholder Interviews/ — one set per person interviewed

| File | Stakeholder | Notes |
|---|---|---|
| `Understanding User Needs w Product (Ad Ops_Brett) - ... Notes by Gemini (1).pdf` | Brett Connaughton, Ad Ops | Read, reflected in `journeys/sales-adops/notes.md`. |
| `Understanding User Needs w Product Pt. 2 (Ad Ops_ Brett) - ...pdf` | Brett Connaughton, Ad Ops | Read — mostly a future-state "Bob"/Vault requirements conversation, but added real current-state detail on flight/schedule revisions and ad-copy trafficking. Reflected in `journeys/sales-adops/notes.md`. Delivery-reporting mechanics remain under-covered (flagged as a gap in both Part 1 and Part 2). |
| `[Daylight] Stakeholder Interviews.pdf` | Combined packet | Read, now 46 pages (was 43) and reorganized — Ryan Middledorf's divider moved to the front (pp.1-2), pushing everyone else's page numbers up. Placeholder divider pages remain for people invited but still not interviewed (Kyle Larson/Ad Ops). Erin Herting (Sales) now has real content too (pp.5-8), not yet processed into any journey. Content Partnerships' screenshot count grew from 5 to 9 (see `journeys/content-partnerships/notes.md`). New facts from its screenshots are folded into `system-facts.md`. |
| `Understanding User Needs w Product (Finance_ Jesse) - ...pdf` | Jesse Tracy, Finance | Read. Reflected in `journeys/finance/notes.md`. Fills the "invoicing & payouts" current-state gap the sales-adops journey had flagged as future-state-only. |
| `Understanding User Needs w Product (Sales_ Thomas) - ...pdf` | Thomas Mancusi, Sales | Read. Reflected in `journeys/sales/notes.md`. Confirms/enriches the sales-adops journey's RFP/vetting/submission stages from the seller's side; adds rate-setting, Master List ownership, renewal/win-back, and ad-placement-doctrine tasks that are genuinely Sales-specific. |
| `Understanding User Needs w Product (Content Partnerships_ Jay) - ...pdf` | **Jay Green** (confirmed on tape — EVP Business Strategy & Partnerships; not Jay Rose) | Read. Reflected in `journeys/content-partnerships/notes.md`. |
| `_Understanding User Needs w Product (Content Partnerships_ Ryan) - 2026_07_22 14_30 EDT - Notes by Gemini.pdf` | **Ryan Middledorf**, Content Partnerships | New 2026-07-23. Read (29 pages, full transcript + Gemini summary, no embedded screenshots). Confirms Ryan owns onboarding firsthand exactly as Jay described secondhand; adds two new tasks (advertiser spot-check, access provisioning) neither previously documented. Reflected in `journeys/content-partnerships/notes.md` v2. |
| `Understanding User Needs w Product (Erin) - 2026_07_21 12_15 EDT - Notes by Gemini.pdf` | Erin Herting, Sales | New 2026-07-23. **Not yet read in full / not processed into any journey** — out of scope for the Content Partnerships update that pulled it in. Her running notes (combined packet, p.6) independently corroborate Ryan Middledorf's 48-hour vetting-turnaround figure — see `system-facts.md`. Next Sales-journey pass should start here. |

## Cross-persona deliverables

- **Cross-persona task/tool table** (`journeys/cross-persona-task-table.html`, published https://claude.ai/code/artifact/fd0685ae-3679-43bd-b4b3-dca280b02c8d) — a simple table (not a stage-spine journey) covering Sales/Ad Ops/Finance/Content Partnerships: key tasks, responsibilities, and the tools/artifacts/docs used per task. Republish with this same `url` to keep the link stable if it's updated later.
- **Finance journey** (`journeys/finance/journey.html`, published https://claude.ai/code/artifact/1d5e0852-800e-4f9f-8b4f-96bb67148453) — WIP, single-interview (Jesse Tracy) stage-spine journey with 9 real screenshots pulled from the combined packet.
- **Content Partnerships journey** (`journeys/content-partnerships/journey.html`, published https://claude.ai/code/artifact/a9a2861a-a8ea-4767-ab1b-65e716952d40) — WIP, now v2: two interviews (Jay Green, Ryan Middledorf), 10 stages, 9 real screenshots pulled from the combined packet.

## Extraction quick-reference

All of the above except the two `.pptx`/`.xlsx` files are PDFs you can read directly with the Read tool's `pages` parameter for text-heavy ones, or render/crop with `scripts/extract_ref.py` for screenshot-heavy ones (check real page count with PyMuPDF first — see SKILL.md). For `Sales & Ad Ops Flow.pptx` and `OR 2026 RFP Template (3).xlsx`, use `extract_ref.py text` — confirmed working against both.
