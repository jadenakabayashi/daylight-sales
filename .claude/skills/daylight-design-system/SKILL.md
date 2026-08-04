---
name: daylight-design-system
description: Use the Daylight Design System — its Figma library (fileKey seHpMplPQg041r9RKbv09a), the primary source of truth, with the paired Storybook (storybook-nine-gray.vercel.app) as a secondary/inference source only — whenever building, modifying, styling, or reviewing UI in this project. Trigger this for requests like "build this with our components," "match the design system," "use Daylight's colors/spacing/type scale," "check this screen against the design system," or any reference to a Figma frame/component/Storybook story by name or link — even if the user doesn't say "Figma," "Storybook," or "design system" explicitly, e.g. "make a settings page that looks like the rest of the app." Pulls real node/variant structure and Figma Variables (colors, spacing, radius) from Figma first, falling back to Storybook's rendered markup/Tailwind classes only for implementation shape Figma doesn't spell out — Storybook's own resolved values have been caught stale relative to Figma before, so Figma always wins on a conflict — instead of just eyeballing screenshots, then extends the system's own documented rules to design new elements that don't exist yet, rather than inventing arbitrary values or refusing.
---

# Daylight Design System

Daylight has **two** live sources, and **Figma is the primary one — check it first.**

- **Figma** (fileKey `seHpMplPQg041r9RKbv09a`, canonical link `https://www.figma.com/design/seHpMplPQg041r9RKbv09a/Daylight-Design-System`) — the design source **and the source of truth**. Covers the whole library: components, foundations/tokens, in-progress or not-yet-built ideas, composed page layouts ("Blocks"). The link the user first gave (`node-id=16237-70061`) is just the cover slide — treat the **whole file** as the design system, not that one node.
- **Storybook** (`https://storybook-nine-gray.vercel.app`) — a secondary/inference source. It's a running instance of the component library (Radix primitives + Tailwind) and gives real markup/Tailwind-class *shape*, but **confirmed 2026-08-03: it can be stale relative to Figma** — a prototype built from Storybook's live CSS variables carried an entire wrong color palette (a blue "slate" theme) for weeks after Figma had already moved to a neutral monochrome one, and nobody caught it until a human checked the actual Figma file. Use Storybook only to infer markup/interaction *shape* when Figma doesn't show it, or as a last resort if Figma is genuinely unreachable — **never trust its resolved token values over a fresh Figma pull.**

**Rule of thumb: Figma wins on every value.** If a component exists in Figma, pull its real values (fills, spacing, radius, variable bindings) from there first. Only fall back to Storybook's rendered markup when you need to infer *implementation shape* (exact Tailwind classes, `data-slot` structure, interaction states) that Figma's static layer tree doesn't spell out — and even then, override any color/spacing *value* Storybook suggests with whatever Figma's Variables actually say if the two disagree.

## Why this matters

Screenshots tell you what something looks like; they don't tell you what it *is* — the actual tokens, variant props, or markup a real implementation needs. This skill exists so UI work in this project is built from real data (Figma's actual Variables and node structure, Storybook's markup shape as a secondary check), not eyeballed from an image or trusted from a stale secondary source. Treat screenshots as a sanity check on a final result, never as the source of truth for values you hard-code.

## Step 1: Check Figma first

This session confirmed a working Figma Dev Mode MCP connection under tool prefix `mcp__<connector-id>__*` (e.g. `get_design_context`, `get_metadata`, `get_variable_defs`, `get_screenshot`, `search_design_system`) — **this may not persist across sessions**, so start with `ToolSearch("figma get_design_context")` / `ToolSearch("figma get_variable_defs")` to check what's actually loaded before assuming either path.

If those tools are available:
1. `get_metadata` (nodeId optional) to find the page/component you need — omit `nodeId` to list top-level pages, or use a node-id resolved from a URL the user gave.
2. **`get_variable_defs` on that node-id is the most important call for colors/spacing/radius** — it returns the actual bound Figma Variables (e.g. `base/primary`, `base/accent`, `border radius/md`) with resolved values, which is the ground truth for token values. This is what caught the stale-blue-Storybook problem — always prefer this over any cached or Storybook-sourced value when they conflict.
3. `get_design_context` for full markup/structure when you need to see how a whole component is composed (returns React+Tailwind reference code to adapt to the host project's real stack — see Step 4).
4. `get_screenshot` for a final visual sanity check only.

If Dev Mode MCP tools aren't loaded this session, fall back to the plain Figma REST API via `scripts/figma_api.py` (wraps `api.figma.com` using a personal access token in `FIGMA_TOKEN`) — see `references/figma-rest-api.md`. **As of 2026-08-03 the project's `FIGMA_TOKEN` is expired** (`Token expired` 403) — regenerate it at figma.com if the REST path is needed and MCP tools aren't available.

- If the user gives a specific Figma link or names a specific screen/component, resolve its `node-id` and pull that node directly — never guess an id.
- If asked broadly ("what components do we have," "check this against the design system"), enumerate via `get_metadata`/`file --depth 1/2` and `components`/`component_sets` rather than defaulting to the cover node.
- Check `references/library-map.md` first — a running cache of pages/components/node-ids/tokens, so you don't re-explore from scratch every time. But if live Figma data contradicts the cache, **trust the live data** and correct the cache (Step 6) — the cache itself may be a stale Storybook-sourced value from before this priority flip.
- **Never fetch a whole page/canvas node** via `nodes`/`get_metadata` without drilling down — a full page can return megabytes of JSON. Always resolve to the specific component/component-set node-id first (see `references/figma-rest-api.md`).
- `search_design_system` (if available) is unreliable for discovery in this file — it returned empty results for components confirmed to exist (e.g. "Button"). Use `get_metadata` + known node-ids instead.

## Step 2: Storybook, only for markup shape or as a fallback

Use Storybook when Figma's static layer tree doesn't make the real interactive markup/class structure obvious (e.g. Radix `data-state`/`data-slot` attributes, exact hover/focus Tailwind variants), or when Dev Mode tools and the REST API are both unavailable.

1. Open `https://storybook-nine-gray.vercel.app` in the Browser tool (or jump to a known story id).
2. Pull the full story catalog once per session via `fetch('/index.json')` (see `references/storybook.md`) — 53 components / ~219 stories as of the last check, cached in `references/library-map.md`.
3. Extract rendered DOM + CSS custom properties with `javascript_tool` (snippets in `references/storybook.md`).

**Treat any color/spacing/radius value from this step as provisional** until cross-checked against Figma's Variables (Step 1) — don't let it silently become the final answer the way it did before this priority flip.

## Step 3: Priority order for pulling implementation data

1. **Figma Variables** (`get_variable_defs`, Step 1) — the actual bound token values. This is the answer for "what color/spacing/radius is this," full stop.
2. **Figma node JSON/`get_design_context`** (Step 1) — layer structure, component composition, reference markup to adapt.
3. **Storybook rendered markup** (Step 2) — real Tailwind class *shape* and interaction-state structure when Figma doesn't spell it out. Its resolved *values* are secondary to Figma's — confirm, don't just copy.
4. **Screenshots** (Figma's `get_screenshot`/`images`, or Storybook canvas) — final visual sanity check only, never the source of values.

## Step 4: Generate code for the host project

Detect the target project's actual stack before generating anything — check `package.json`/lockfiles, existing component files, and styling approach already present in the repo you're working in. Given Daylight is shadcn/ui-based, a React host project most likely wants shadcn/ui itself (Radix primitives + Tailwind) — check for a `components.json` / `components/ui/*` setup before assuming a from-scratch component API. If this is a brand-new project with no stack signal at all, ask rather than defaulting to any framework.

Reuse Daylight's actual CSS variable names (`--background`, `--foreground`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`, `--radius`, `--chart-1..5`, `--sidebar*`, both light and `.dark` values — full table in `references/library-map.md`) rather than re-deriving or renaming them. If the host project doesn't have these defined yet, that's the first thing to set up, not something to work around with new ad hoc names.

## Step 5: When something isn't in the library yet

If the user asks for a UI element with no match in Storybook or Figma (a new variant, layout, or something combining two existing patterns), don't refuse and don't invent arbitrary values. Instead:

1. Pull the system's foundational rules — the token table (`library-map.md`), spacing/type scale (Figma's Typography/Documentation pages), naming conventions (`Variant=/State=/Size=` pattern seen across Figma component sets, `data-slot` pattern seen in Storybook markup).
2. Compose the new element from those rules and the closest existing component(s) as structural precedent (e.g. a new "warning banner" reuses the same padding/radius/type scale as the existing "info banner," recolored to `--destructive` or similar).
3. Say explicitly what you inferred and from what precedent, so the user can correct a wrong judgment call.

## Step 6: Keep the library map fresh

Both sources evolve. After discovering new structure — a Storybook story, a Figma page/component/token — update `references/library-map.md`. Don't treat it as immutable; if live data contradicts the cache, trust the live data and fix the cache.

## Reference files

- `references/storybook.md` — Storybook URL, story-id pattern, and the exact JS snippets for pulling the story catalog, rendered markup, and CSS variable tokens.
- `references/figma-rest-api.md` — Figma REST API endpoints, `figma_api.py` usage, `FIGMA_TOKEN` setup, and the token-naming caveat.
- `references/figma-mcp-tools.md` — Dev Mode MCP tool cheat sheet (`get_metadata`, `get_variable_defs`, `get_design_context`, `get_screenshot`, `search_design_system`) — confirmed working in at least one session under a dynamic `mcp__<connector-id>__*` prefix; always `ToolSearch` to check availability first, don't assume it's loaded.
- `references/library-map.md` — cached map of pages/components/node-ids/tokens from both sources, built up over time.
- `scripts/figma_api.py` — the Figma REST API wrapper script; run it directly via Bash rather than re-implementing curl calls inline.
