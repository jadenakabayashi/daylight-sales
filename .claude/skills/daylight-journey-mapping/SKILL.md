---
name: daylight-journey-mapping
description: Build or update current-state (and eventually future-state) process journey maps for Daylight Media personas/teams — Sales, Ad Ops, Finance, Content Partnerships, Product, Legal, and others as they're researched. Trigger this for requests like "map out the journey for [team/person]," "build a flow for [persona]," "what does [process] actually look like," "update the [X] journey with the new interview," or any reference to files under refs/Foundation or refs/Stakeholder Interviews — even if the user doesn't say "journey map" explicitly. Always grounds journeys in real stakeholder research (interview notes/transcripts/screenshots, foundational process docs) rather than invented workflow, and always styles the visual output using the daylight-design-system skill rather than an ad hoc palette.
---

# Daylight Journey Mapping

Reconstructs how work actually happens at Daylight Media — one persona/team at a time — from real stakeholder research, and turns that into an editable journey map (an HTML artifact, and optionally a Figma plugin that builds real editable layers, following the same pattern as the `sales-adops` journey). This is current-state UX/process research, not aspirational process design — don't fill gaps with what would be nice; fill them with what the sources actually say, and flag what they don't.

## Always start here: scan the sources fresh

Two folders hold the raw material, and **both grow over time** — new stakeholder interviews get added between sessions, so don't rely on a memory of what was there last time:

- **`refs/Foundation/`** — context on how the business/systems work generally: team roles, brand briefs, RFP templates, process-flow docs. Not persona-specific; this is shared grounding.
- **`refs/Stakeholder Interviews/`** — the actual research: interview notes, transcripts, and screenshots per person interviewed, one set of files per stakeholder/session.

Before starting or resuming any journey work, `ls` both folders to see what's actually there now, and diff that mentally against what's already reflected in `references/system-facts.md` and the relevant `journeys/<persona>/notes.md` — anything new needs to be read and folded in before you touch the journey output.

## File formats — use the bundled extractor

`refs/` mixes `.pdf`, `.pptx`, `.docx`, and `.xlsx`. Don't hand-roll extraction per file type — use `scripts/extract_ref.py`:

```
python3 .claude/skills/daylight-journey-mapping/scripts/extract_ref.py text <file>
python3 .claude/skills/daylight-journey-mapping/scripts/extract_ref.py images <file> <outdir>
python3 .claude/skills/daylight-journey-mapping/scripts/extract_ref.py pdf-render <file> <outdir> [zoom]
```

`text` works for all four formats. `images` pulls embedded screenshots out of PDFs/PPTX/DOCX (not XLSX — spreadsheets rarely embed anything worth extracting). `pdf-render` is for the specific case a PDF's real content *is* a full-page image — check the PDF's actual page count with a quick PyMuPDF `page_count` before assuming a "too large, read in ranges" warning means many real pages; it sometimes means a few pages with huge embedded images that get tiled for display. Requires `pymupdf`, `python-pptx`, `python-docx`, `openpyxl` — install once with `python3 -m pip install pymupdf python-pptx python-docx openpyxl` if missing.

## Two tiers of knowledge — don't conflate them

1. **`daylight-knowledge`'s `references/business-systems.md`** — shared, cross-persona facts: system/tool names (and their naming ambiguities), process terminology, the org roster and role levels, real concrete examples (a real client, a real order, a real template). This lives in the general `daylight-knowledge` skill now, not this one — invoke that skill (or read the file directly) to check it, and update it whenever a new fact surfaces, *regardless of which persona's interview it came from* — a lot of what's been learned about Marly/QCode, order statuses, or the RFP flow applies just as much to a Finance or Content Partnerships journey as it did to Ad Ops, and it's also useful outside journey work entirely (prototypes, general questions).
2. **`journeys/<persona-slug>/notes.md`** — persona-specific: their actual process steps, tools, pain points, quotes. This is what the journey stages are built from directly. Don't duplicate business-systems content here beyond a pointer reference — link back to it instead.

Check both before assuming something hasn't been established yet.

## Output convention: one self-contained folder per persona

```
journeys/<persona-slug>/
├── notes.md              — persona-specific reference cache (see above)
├── journey.html           — the published artifact (published via the Artifact tool)
├── template.html          — its editable HTML source (Artifact publishes compiled output; edit this, not the compiled file, then republish)
└── figma-plugin/          — optional: a local dev plugin that builds the same journey as real Figma layers
    ├── manifest.json
    ├── code.template.js    — human-readable source (edit this)
    ├── code.js             — generated: template + embedded image bytes spliced in — don't hand-edit
    └── README.md
```

`sales-adops` is the reference example for this whole convention — read its `notes.md`, `template.html`, and `figma-plugin/code.template.js` before starting a new persona, both for the pattern and because some content (shared systems, the RFP flow) will carry over directly instead of needing to be re-derived.

When publishing the HTML artifact with the Artifact tool, pass the *existing* `url` if this persona's journey has been published before (check `journeys/<persona>/notes.md` or ask) — a different file path without `url` mints a new link even for the same persona, which orphans anyone who bookmarked the old one.

The Figma plugin is optional per persona — only build one if the user actually wants an editable-in-Figma version (it's a real chunk of generator code per journey); the HTML artifact alone is a legitimate deliverable on its own.

## Always use daylight-design-system for the visual layer

Never invent a palette, type scale, or component pattern for a journey from scratch. Before styling the HTML artifact or generating Figma-plugin frames:

1. Invoke the `daylight-design-system` skill (or read its `references/library-map.md` directly) for the current confirmed tokens — colors, radius, the `data-slot` markup pattern, whatever's been captured from Storybook.
2. Use those tokens as the base. It's fine to add journey-mapping-specific structure on top (a numbered stage spine, friction callouts, source-attribution tags) since those aren't themselves design-system components — but the *colors, radius, and type* backing them should come from the design system, not be reinvented per journey.
3. If `daylight-design-system`'s captured tokens have moved on since the last journey was built (check the "last updated" note in its `library-map.md`), prefer the newer values and note the drift rather than silently keeping the old journey's palette.

This applies to both output paths — the HTML artifact's CSS custom properties and the Figma plugin's `COLOR` object should be pulling from the same source of truth.

## Building or updating a journey — the actual sequence

1. Scan `refs/Foundation/` and `refs/Stakeholder Interviews/` fresh (see above). Read/extract anything not yet reflected in `system-facts.md` or the persona's `notes.md`.
2. Update `system-facts.md` with anything cross-cutting; update (or create) `journeys/<persona-slug>/notes.md` with the persona-specific process reconstruction.
3. Pull current tokens from `daylight-design-system`.
4. Build or update `journeys/<persona-slug>/template.html`, render/verify it, publish via the Artifact tool.
5. If a Figma-editable version is wanted, build/update `journeys/<persona-slug>/figma-plugin/code.template.js` following the same content, regenerate `code.js`, syntax-check with `node --check`.
6. Say plainly what's grounded in a source vs. inferred, and flag gaps rather than papering over them (pun acknowledged) with invented process.

## Reference files

- `references/system-facts.md` — now just a pointer stub; the shared cross-persona knowledge cache (systems/tools, terminology, org roster, real examples) moved to `daylight-knowledge`'s `references/business-systems.md`.
- `references/sources.md` — what's in `refs/Foundation` and `refs/Stakeholder Interviews` as of the last pass, and notes on each file's role.
- `scripts/extract_ref.py` — the multi-format text/image extraction helper described above.
