# Figma Dev Mode MCP tools — cheat sheet (future upgrade path)

**Not currently usable.** This project doesn't have a Figma Dev Mode seat yet, so neither MCP server is reachable — the current source of truth is the plain REST API instead (see `references/figma-rest-api.md` and `scripts/figma_api.py`). Keep this file around for when a Dev seat is added later — at that point, prefer these MCP tools over the REST script again, since they resolve tokens/Code Connect mappings more directly.

Two possible server prefixes, depending on which is connected:
- `mcp__figma-remote__*` (https://mcp.figma.com/mcp, OAuth)
- `mcp__figma-local__*` (http://127.0.0.1:3845/mcp, Figma desktop app, Dev Mode MCP Server enabled)

Only load what you need via `ToolSearch("select:<name>,<name>")`. If a name below 404s, do a plain keyword `ToolSearch` (e.g. `"figma code connect"`) — tool names shift slightly between server versions, and this list may drift out of date. Trust what ToolSearch actually returns over this file.

## Typical tools and what they're for

| Purpose | Typical tool name(s) | Notes |
|---|---|---|
| Get a node's implementation as code | `get_code` | Give it a fileKey + node-id (or a Figma URL). Returns structured markup/props, not just visuals — this is usually the primary source for building a component. |
| Resolve design tokens | `get_variable_defs` | Returns the variable/token names and values used on a node (colors, spacing, typography, radii). Use the *names*, not raw values, when generating code, so output stays linked to the system instead of copying a snapshot of it. |
| Find an existing code mapping | `get_code_connect_map` | If the design system has Code Connect set up, this maps a Figma component straight to real source in a codebase — the most authoritative source when present. Empty/no-hit is normal for components without Code Connect configured; fall back to `get_code` + `get_variable_defs`. |
| Explore file/page/component structure | `get_metadata` or `get_design_context` | Use for "what's in this file" / "what components exist on this page" style discovery, not just the one linked node. |
| Visual sanity check | `get_screenshot` | Rendered image of a node. Useful to eyeball a result against the design, never to reverse-engineer exact values from pixels. |
| Generate/inspect design system rules | `create_design_system_rules` (if present) | Some server versions can synthesize a rules doc (naming conventions, token usage guidance) directly from the file — if available, this is a good input to Step 5 (inferring new elements) in SKILL.md, and worth mirroring into `library-map.md`. |

## Node addressing

A Figma node is addressed by `fileKey` + `node-id`. This project's fileKey is always `seHpMplPQg041r9RKbv09a`. node-ids look like `16237-70061` (dash form, as they appear in URLs) or `16237:70061` (colon form, as most tools expect) — normalize dashes to colons if a tool call fails on the URL-style id.

## If neither server is reachable

- Remote (`figma-remote`): the user needs to complete a one-time OAuth login in their browser, triggered on first real tool call. If it keeps failing, they may not have Figma Dev Mode access on their plan.
- Local (`figma-local`): needs the Figma desktop app open, "Enable Dev Mode MCP Server" turned on under Figma's Preferences menu, and (for best results) the Daylight Design System file actually open in a tab.

Tell the user which of these is likely missing rather than silently falling back to guessed values.
