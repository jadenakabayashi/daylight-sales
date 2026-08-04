---
name: daylight-knowledge
description: The general, continually-growing Daylight Media knowledge base — business/org facts, systems and terminology, product and prototype decisions, and anything else worth remembering across sessions that isn't a persona-specific journey. Trigger this for requests like "what do we know about X," "add this to the knowledge base," "note for later," "remember that...," questions about Daylight's systems/people/terminology, or when building a prototype/feature that should be grounded in established facts rather than re-derived or guessed. Also the canonical home for cross-persona facts previously tracked in daylight-journey-mapping's system-facts.md — that skill reads from here now instead of keeping its own copy.
---

# Daylight Knowledge Base

A single, growing store of things worth remembering about Daylight Media across sessions — business/org facts, systems and terminology, product/prototype decisions, open questions — organized so it stays cheap and accurate to reference as it grows rather than turning into one giant file you have to reread every time.

## Structure: an index, plus one file per topic

```
references/
├── index.md                — table of contents: one line per topic file, what it covers, last updated
├── business-systems.md      — Daylight's systems/tools, terminology, org roster, real concrete examples
└── <topic>.md               — new topic files added as they accumulate enough content to earn one
```

**Always read `references/index.md` first.** It's kept short on purpose — one row per topic file — so you can tell which file(s) are actually relevant to the current question without loading everything. Only open the specific topic file(s) the index points you to.

## Adding new information

1. Check `index.md` for whether an existing topic file already covers this. If yes, append there — don't create a near-duplicate file.
2. If nothing fits, decide whether there's already enough loose material to justify a new topic file, or whether this is a one-off fact that can sit in a general/misc file until a pattern emerges. Don't over-fragment early — a handful of related facts can live together until they clearly need splitting.
3. When you create a new topic file, add its row to `index.md` immediately — an unindexed file is effectively invisible next session.
4. Update the "last updated" note at the top of whichever topic file changed, briefly stating what landed and why (same pattern as journey-mapping's old system-facts.md) — this lets a future pass tell what's new without diffing.
5. Prefer editing/extending existing entries over appending contradictory ones — if new information supersedes something, correct it in place and note the correction, rather than leaving both the old and new claims sitting in the file.

## Using this for prototypes and open questions

When building a prototype, mockup, or answering a question, check here first for grounding facts (real systems, terminology, people, prior decisions) the same way `daylight-journey-mapping` checks stakeholder research before inventing a process — don't invent a system name, workflow, or org fact that could instead be looked up. If something's genuinely not established yet, say so and flag it as a gap rather than guessing, and consider whether the answer, once found, belongs back in this knowledge base.

If styling anything visual (a prototype, mockup, diagram), still pull tokens from the `daylight-design-system` skill — this skill is for facts and decisions, not visual conventions.

## Relationship to other Daylight skills

- **`daylight-journey-mapping`** — persona-specific process research lives in `journeys/<persona>/notes.md`, not here. But cross-persona facts (systems, terminology, roster) that used to live in that skill's own `system-facts.md` now live here in `business-systems.md`; that skill points here instead of duplicating.
- **`daylight-design-system`** — visual/component tokens stay there. This skill is for facts and decisions, not styling.

## Reference files

- `references/index.md` — table of contents; read this first, always.
- `references/business-systems.md` — cross-persona systems/tools/terminology/roster/examples (formerly `daylight-journey-mapping/references/system-facts.md`).
