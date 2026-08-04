# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

Not a software codebase in the usual sense — there's no build/lint/test pipeline. This is Daylight Media's UX research and prototyping workspace: stakeholder research, current-state process journey maps, and interactive HTML prototypes, all grounded in real source material and styled from a shared design system. The only "code" artifacts are self-contained HTML files and a couple of local Figma dev plugins.

Three project-level skills (`.claude/skills/`) encode almost all of the working process here. Read the relevant skill(s) before doing related work rather than improvising — they contain hard-won conventions this file only summarizes:

- **`daylight-knowledge`** — the cross-persona knowledge base (`references/business-systems.md`, `references/vault-product-development.md`, indexed via `references/index.md`). Read `index.md` first, then only the topic file(s) relevant to the question. This is the source of truth for Daylight's systems/tools/terminology/org roster/real examples — check it before inventing a system name or workflow fact.
- **`daylight-journey-mapping`** — building/updating current-state process journeys per persona (`journeys/<persona>/`). Always scans `Refs/Foundation/` and `Refs/Stakeholder Interviews/` fresh (both grow over time) before touching a journey, using `scripts/extract_ref.py` for text/image extraction from PDF/PPTX/DOCX/XLSX.
- **`daylight-design-system`** — the single source of visual truth (Figma fileKey `seHpMplPQg041r9RKbv09a`, Storybook at `storybook-nine-gray.vercel.app`). Storybook's rendered markup/CSS variables are authoritative for anything already built; Figma covers design intent and not-yet-built elements. Never invent a palette, radius, or type scale — pull tokens from here for any visual output (journeys, prototypes, mockups).

## Commands

There is no build, lint, or test suite. The recurring commands are:

```bash
# Extract text from a Foundation/Stakeholder Interview source (pdf/pptx/docx/xlsx)
python3 .claude/skills/daylight-journey-mapping/scripts/extract_ref.py text <file>

# Pull embedded screenshots out of a source (not xlsx)
python3 .claude/skills/daylight-journey-mapping/scripts/extract_ref.py images <file> <outdir>

# Render a PDF page to an image when its real content is a full-page image
python3 .claude/skills/daylight-journey-mapping/scripts/extract_ref.py pdf-render <file> <outdir> [zoom]

# Query the Figma REST API (Dev Mode MCP is not available on the current plan)
python3 .claude/skills/daylight-design-system/scripts/figma_api.py <command> ...

# Syntax-check a Figma plugin file after editing (never hand-edit code.js directly)
node --check journeys/<persona>/figma-plugin/code.template.js
node --check journeys/<persona>/figma-plugin/code.js
```

Dependencies for the extractor (`pymupdf`, `python-pptx`, `python-docx`, `openpyxl`) install with:
```bash
python3 -m pip install pymupdf python-pptx python-docx openpyxl
```

`FIGMA_TOKEN` (a personal access token) lives in `.env` and is required for `figma_api.py`.

## Structure

```
Refs/
├── Foundation/                 — shared grounding: team roles, brand briefs, RFP templates, process-flow docs
└── Stakeholder Interviews/     — raw research: interview notes/transcripts per stakeholder session

journeys/
├── cross-persona-task-table.html
└── <persona-slug>/              — one self-contained folder per persona (sales, sales-adops, finance, content-partnerships)
    ├── notes.md                 — persona-specific process reconstruction (tools, pain points, quotes)
    ├── template.html            — editable source for the journey (edit this, not the compiled artifact)
    ├── journey.html             — published artifact output
    └── figma-plugin/            — optional: local dev plugin that builds the same journey as real Figma layers
        ├── manifest.json
        ├── code.template.js     — human-readable source (edit this)
        └── code.js              — generated (template + embedded image bytes spliced in) — never hand-edit

prototypes/
└── <name>/                      — interactive HTML prototypes one step beyond a journey map (functional simulations, not just current-state)

.claude/skills/                  — the three project skills described above, each with its own references/ and scripts/
```

## Conventions that matter across all of this

- **Ground everything in real sources.** Journeys and prototypes are current-state reconstructions from actual stakeholder research and roster/system data, not invented "nice to have" process. When something is fabricated for demo purposes (e.g. a conflict flag with no real data backing it), mark it inline as simulated rather than passing it off as real — see `prototypes/sales-rfp-builder/notes.md` for the established pattern.
- **Two knowledge tiers, don't conflate them:** cross-persona facts (system names, terminology, org roster) belong in `daylight-knowledge/references/business-systems.md`; persona-specific process detail belongs in `journeys/<persona>/notes.md` and should link back rather than duplicate.
- **Publishing HTML artifacts:** when republishing a journey or prototype via the Artifact tool, reuse the existing `url` (recorded in the persona's `notes.md` or the prototype's `notes.md`) — a new path mints a new link and orphans anyone who bookmarked the old one.
- **`sales-adops` is the reference example** for the full journey-mapping convention (notes.md → template.html → figma-plugin). Read it before starting a new persona.
- Figma's Dev Mode MCP servers configured in `.mcp.json` (`figma-remote`/`figma-local`) are not reachable — no Dev Mode seat on the current plan. Use the REST API script instead; re-check with `ToolSearch("figma get_code")` if a seat is added later.
