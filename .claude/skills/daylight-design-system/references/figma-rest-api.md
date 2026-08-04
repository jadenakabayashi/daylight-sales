# Figma REST API — current path (no Dev Mode seat required)

This is the **primary** way this skill gets real data right now, since the project doesn't have a Figma Dev Mode seat yet (see `references/figma-mcp-tools.md` for the MCP path to switch back to once a seat exists).

Everything goes through `scripts/figma_api.py`, which wraps `api.figma.com` and reads the token from `FIGMA_TOKEN` (env var or a project-root `.env` file) — never pass the token as a literal in a command.

## One-time setup (the user does this, not you)

1. figma.com → account settings → **Security** → **Personal access tokens** → generate one. Read-only "File content" scope is enough — don't request write scopes this skill doesn't need.
2. Store it as `FIGMA_TOKEN`, either:
   - `export FIGMA_TOKEN=...` in their shell profile, or
   - a `FIGMA_TOKEN=...` line in a `.env` file in the project root (gitignore it if this becomes a git repo).
3. Verify with `python3 scripts/figma_api.py components seHpMplPQg041r9RKbv09a` — if it 403s, the token is missing/invalid; if it 200s but comes back empty, the file may have no *published* components yet (see caveat below).

## Commands

All take the fileKey `seHpMplPQg041r9RKbv09a` as the first positional arg.

| Command | Endpoint | Use for |
|---|---|---|
| `file --depth N` | `GET /v1/files/:key` | Explore structure. **Always pass `--depth`** (1 or 2) for first-pass exploration — the full, unbounded file tree for a whole design system library can be huge. Depth 1 gets you page names/ids; depth 2 gets top-level frames per page. |
| `nodes --ids a:b,c:d` | `GET /v1/files/:key/nodes` | Pull one or more specific nodes' full JSON (fills, strokes, effects, text properties, layout/auto-layout, children) once you know the node-id. This is the main source for actually building a component — read fills/typography/spacing straight off the JSON. |
| `images --ids a:b --format png` | `GET /v1/images/:key` | Rendered image of a node — equivalent to MCP's `get_screenshot`. Visual sanity check only, never the source of truth for values. |
| `components` | `GET /v1/files/:key/components` | Metadata for **published** components (name, node-id, description). Won't include components that exist in the file but were never published to a library — cross-check against what you see in `file`/`nodes` if something seems missing. |
| `component_sets` | `GET /v1/files/:key/component_sets` | Same, for component sets (variant groups). |
| `styles` | `GET /v1/files/:key/styles` | Published color/text/effect **Styles** (the older token system) — name + node-id per style. |
| `variables` | `GET /v1/files/:key/variables/local` | Figma **Variables** (the newer token system). This endpoint is Enterprise-plan-gated — expect a 403 unless Daylight is on Enterprise. If it 403s, fall back to `styles`, or to reading resolved fill/effect values straight off nodes via `nodes`, and just use those consistently (see caveat below). |

## Important caveat: tokens may only be resolvable, not named (confirmed, 2026-07)

Confirmed against the real file: Daylight uses Figma **Variables** (not just old-style Styles) for color/spacing/radius — e.g. the Button component's fill, padding, and corner radius are all `boundVariables` pointing at `VariableID:...` refs, alongside resolved numeric/color values. Effects (shadows) are still on the older Styles system and *do* resolve via the plain `styles` command (e.g. `shadow/md`).

The `variables` command currently 403s with `Invalid scope(s)... requires the file_variables:read scope` — that's a **token scope** error, not necessarily a hard plan wall. Next step to try: regenerate the personal access token at figma.com and explicitly select the "File variables: read" scope if it's offered during token creation. If that scope checkbox doesn't exist at all in the creation UI, that confirms it's plan-gated (Variables REST access is Enterprise-only) and this stays blocked regardless of token.

Until then: you can read the *resolved* color/number values on any node via `nodes` (e.g. padding 16/8px, corner radius 6, a fill color), but not the *token name* (e.g. `color/foreground/primary`) the way Dev Mode MCP's `get_variable_defs` would give you. In that case:

- Note this limitation to the user rather than pretending you resolved a token name.
- Where you can infer a stable role from context (a node literally named "Primary Button" using a fill that's reused across many primary actions), it's reasonable to name it descriptively in generated code (e.g. a CSS variable `--color-action-primary`) — just say that's an inferred name, not one read from Figma, so it can be corrected once real token names are available.

## Important lesson: never fetch a whole page/canvas node

`nodes --ids <page-id>` on a top-level page (a `CANVAS` node, e.g. the whole "Button" page) can return **multiple megabytes** of JSON (confirmed: ~4.8MB for one page) because it recurses into every instance on that page, not just the component definitions. Always drill down first:

1. `file --depth 1` to list pages, or `components`/`component_sets` to get exact node-ids for the specific component you need.
2. `nodes --ids <component-or-component-set-id>` on that specific id — this is small (tens of KB) and gives exactly the variant structure you need (e.g. a `COMPONENT_SET` node with one child `COMPONENT` per variant combination, each with its own `fills`/`padding`/`cornerRadius`/`boundVariables`).

Never call `nodes` on a whole page/canvas id to "explore" — use `file --depth N` for that instead.

## Node addressing

Node-ids look like `16237-70061` in URLs (dash form) but the API wants colon form: `16237:70061`. Convert before calling `nodes`/`images`.

## Keep library-map.md current

Same as the MCP path: whenever `file`/`nodes`/`components` turns up a page name, component, or token you didn't have cached, add it to `references/library-map.md` so the next invocation doesn't re-walk the whole file.
