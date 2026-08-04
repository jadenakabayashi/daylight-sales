# Daylight Design System — library map

Cached facts about the Figma file (`fileKey seHpMplPQg041r9RKbv09a`) and the paired Storybook (`storybook-nine-gray.vercel.app`), built up over time so future invocations don't have to re-explore either from scratch. Everything here is **provisional** — if live data (via `scripts/figma_api.py`, Storybook, or MCP once available) disagrees with this file, trust the live data and correct this file.

Last updated: 2026-08-03, three times today:

1. A working Figma Dev Mode MCP connection exists this session under tool prefix `mcp__99c03b8b-ee8e-4572-970a-98ed9cbdc9c0__*` — `get_design_context`/`get_metadata`/`get_screenshot`/`get_variable_defs`/`search_design_system` — separate from the project's `.mcp.json` `figma-remote`/`figma-local` entries CLAUDE.md says are unreachable; re-check with `ToolSearch("figma get_design_context")` next session, this one may not persist. `search_design_system` returned empty for "Button"/"Select" even though both exist — not usable for discovery in this file; use `get_metadata`+`get_design_context`/`get_variable_defs` by node-id instead. The project's Figma REST token (`FIGMA_TOKEN`) is expired (`scripts/figma_api.py` 403s "Token expired") — needs regenerating. Confirmed real component specs for Button/DropdownMenu/Select/Checkbox/Switch pulled live from both Figma (node ids below) and Storybook — see "Confirmed component specs" section below.
2. **Priority flip, per explicit user correction: Figma is the primary source, Storybook is secondary/fallback — the opposite of what this file said in point 1 above and in SKILL.md until now.** Reason: pulling `get_variable_defs` directly on the Button/Dropdown Menu Figma components (below) revealed Figma's *actual current* palette is a neutral monochrome (zinc) — `base/primary: #171717` (near-black), no blue anywhere — while Storybook's live CSS (the "Confirmed token table" below) was still serving an entirely different, stale blue "slate" theme (`--primary: #135daa`). A prototype built by trusting Storybook's token dump over Figma carried that wrong blue palette until a human caught it by checking Figma directly. **The Storybook token table immediately below is confirmed STALE as of 2026-08-03 — do not use its color values.** The new Figma-sourced table replaces it as the actual source of truth; SKILL.md has been updated to check Figma first accordingly.
3. **The priority flip in point 2 wasn't just about color** — the user pointed directly at the Dropdown Menu node (`node-id=430-17998`) and said the styling "still isn't quite right." Re-pulling that exact node found the *spacing* (not just color) had also been taken from Storybook's generic Button/DropdownMenu stories instead of this specific component's own Figma numbers, and Figma's were bigger/roomier throughout: trigger buttons 36px/16px-padding/8px-gap (not Storybook's 32px/10px/6px), dropdown items 6px/8px padding (not 4px/6px), and `--radius-sm` is a literal Figma `2px` (not a derived `radius-4px=4px` guess). See "Confirmed component specs" below for the corrected numbers — round 1 in that section is superseded on spacing/radius as well as color now, not just color.

## Storybook — component catalog (confirmed live, 53 components / ~219 stories)

Accordion, Alert, AlertDialog, AspectRatio, Avatar, Badge, Breadcrumb, Button, ButtonGroup, Calendar, Card, Carousel, Chart, Checkbox, Collapsible, ComboBox, Command, ContextMenu, DatePicker, Dialog, Drawer, DropdownMenu, HoverCard, Input, InputGroup, InputOTP, Item, Kbd, Label, Menubar, NavigationMenu, Pagination, Popover, Progress, RadioGroup, Resizable, ScrollArea, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Sonner, Spinner, Switch, Table, Tabs, Textarea, Toggle, ToggleGroup, Tooltip, Typography.

Story id pattern: `ui-<component-lowercase>--<story-kebab>`, e.g. `ui-accordion--single`, `ui-accordion--multiple`, `ui-accordion--default-open`, `ui-alertdialog--default`, `ui-alertdialog--with-media`, `ui-alertdialog--small-size`, `ui-alert--default`, `ui-alert--destructive`, `ui-alert--with-action`, `ui-alert--title-only`. Fetch `/index.json` (see `references/storybook.md`) for the complete per-component story list — only the first few are transcribed here as examples.

Note: this list is slightly ahead of Figma's Components page — Storybook has `ButtonGroup`, `InputGroup`, `Item`, `Kbd`, `Spinner`, `Typography` as their own entries, which weren't seen as separate top-level components in the Figma "Components" page pass (they may be under "Utility Components", node `40:153`, not yet explored). Treat Storybook as ahead of Figma for what's actually implemented.

## Confirmed token table (from Figma Variables directly — current source of truth, 2026-08-03)

Pulled via `get_variable_defs` on the Button component set (`37:930` Default/`37:1477` Outline/`37:1475` Destructive) and the Dropdown Menu's Light/Dark instances (`430:17886` light, `473:11354` dark). **A neutral monochrome (zinc) palette — no blue anywhere.** Values marked *(inferred)* weren't directly returned by a queried node; they follow the confirmed background/foreground light↔dark inversion pattern (standard shadcn zinc dark-mode convention) and should be verified against a direct node query if a dark-mode Button/primary instance turns up.

| Token | Light | Dark |
|---|---|---|
| `base/background` | `#fafafa` | `#171717` |
| `base/foreground` | `#171717` | `#fafafa` |
| `base/primary` | `#171717` | `#fafafa` *(inferred)* |
| `base/primary-foreground` | `#fafafa` | `#171717` *(inferred)* |
| `base/muted` | `#f5f5f5` | `#262626` |
| `base/muted-foreground` | `#737373` | `#a1a1aa` *(inferred)* |
| `base/accent` | `#f5f5f5` | `#404040` |
| `base/border` | `#e5e5e5` | `#262626` |
| `base/input` | `#e5e5e5` | `#404040` |
| `base/popover` | `#fafafa` | `#262626` |
| `base/popover-foreground` | `#0a0a0a` | `#fafafa` |
| `base/destructive` | `#dc2626` | *(not yet pulled for dark)* |
| `base/destructive-foreground` | `#fef2f2` | *(not yet pulled for dark)* |
| `border radius/md` | `6` | (same) |
| `border radius/sm` | `2` | (same) |
| `height/h-9` | `36` | (same) |
| `spacing/2`, `spacing/4` | `8`, `16` | (same) |

No confirmed `base/ring`, `--secondary`, `--chart-*`, or `--sidebar-*` equivalents pulled yet from Figma directly — the Storybook-sourced values for those below are unconfirmed against Figma and should be re-checked before trusting for anything color-critical (`--ring` especially, since it's exactly the kind of value that turned out wrong for `--accent`).

⚠️ **Lesson from `prototypes/sales-rfp-builder` (2026-08-03, two rounds):** first, that prototype's own CSS had `--accent` set to `#0da2e7`/`#3abcf8` — Storybook's real `--ring` value, mislabeled as `--accent`. Second, and bigger: even the "corrected" values pulled from **Storybook** turned out themselves stale relative to **Figma** — Figma's actual current `base/primary` is `#171717`/`#fafafa` (monochrome), not the `#135daa` blue Storybook was still serving. **Don't trust an existing prototype/template's own `:root` variable names, and don't trust Storybook's resolved values either, without cross-checking live Figma Variables (`get_variable_defs`) first** — see the priority flip at the top of this file and in SKILL.md.

## Storybook token table (STALE as of 2026-08-03 — do not use color values from this table; kept for structural/naming reference only)

| Token | Light | Dark |
|---|---|---|
| `--background` | `#fff` | `#020817` |
| `--foreground` | `#020817` | `#f8fafc` |
| `--card` | `#fff` | `#020817` |
| `--card-foreground` | `#020817` | `#f8fafc` |
| `--popover` | `#fff` | `#020817` |
| `--popover-foreground` | `#020817` | `#f8fafc` |
| `--primary` | `#135daa` | `#135daa` |
| `--primary-foreground` | `#fff` | `#0f172a` |
| `--secondary` | `#f1f5f9` | `#1e293b` |
| `--secondary-foreground` | `#0f172a` | `#f8fafc` |
| `--muted` | `#f1f5f9` | `#1e293b` |
| `--muted-foreground` | `#64748b` | `#94a3b8` |
| `--accent` | `#f1f5f9` | `#1e293b` |
| `--accent-foreground` | `#0f172a` | `#f8fafc` |
| `--destructive` | `#ef4444` | `#7f1d1d` |
| `--destructive-foreground` | `#f8fafc` | `#f8fafc` |
| `--border` | `#e2e8f0` | `#1e293b` |
| `--input` | `#e2e8f0` | `#1e293b` |
| `--ring` | `#0da2e7` | `#3abcf8` |
| `--radius` | `.5rem` | (same) |
| `--chart-1` | `#0da2e7` | `#3abcf8` |
| `--chart-2` | `#2a9d90` | `#2eb88a` |
| `--chart-3` | `#274754` | `#e88c30` |
| `--chart-4` | `#e8c468` | `#af57db` |
| `--chart-5` | `#f4a462` | `#e23670` |
| `--sidebar` | `#fafafa` | `#020817` |
| `--sidebar-foreground` | `#3f3f46` | `#f4f4f5` |
| `--sidebar-primary` | `#0da2e7` | `#3abcf8` |
| `--sidebar-primary-foreground` | `#fff` | `#0f172a` |
| `--sidebar-accent` | `#fafafa` | `#020817` |
| `--sidebar-accent-foreground` | `#18181b` | `#f4f4f5` |
| `--sidebar-border` | `#e5e7eb` | `#27272a` |
| `--sidebar-ring` | `#0da2e7` | `#3abcf8` |

`--radius: .5rem` (8px) does match Figma's `border radius/md: 6` in spirit (Tailwind's `rounded-lg` = base `--radius` = 8px, with `rounded-md`/`rounded-sm` derived as `-2px`/`-4px` — the Figma value confirms the *derived* md/sm tier, not the base radius itself, and the two are consistent) — this one wasn't contradicted, only the color tokens were.

Naming/markup convention confirmed from rendered Accordion markup: components use `data-slot="<component>"` / `data-slot="<component>-<part>"` (e.g. `data-slot="accordion-item"`, `data-slot="accordion-trigger"`, `data-slot="accordion-trigger-icon"`), Radix `data-state`/`data-orientation`/`aria-*` attributes, and `lucide` icon components. Apply this same pattern when inferring markup for a new element (Step 5 in SKILL.md).

## Known entry point

- Title/cover slide: node `16237:70061` (page name "Cover") — this is just the file's cover, not a meaningful design element.

## Pages (top-level canvases, from `file --depth 1`)

| Page name | node-id | Notes |
|---|---|---|
| Cover | 16237:70061 | title slide, not design content |
| Documentation | 580:9181 | likely written design-system rules/guidelines — not yet explored, read this before inferring new elements per SKILL.md Step 5 |
| Icons | 1:433 | icon set |
| Assets | 43:396 | misc assets |
| Typography | 22:1400 | type scale — not yet explored in detail |
| Blocks (Official) | 477:11332 | pre-built composed layouts/sections |
| Pro Blocks (Application) 🔷 | 11002:7884 | app-oriented composed blocks |
| Pro Blocks (Landing Page) | 13020:20854 | marketing-page composed blocks |
| **Components** | 580:9180 | the actual component library — see table below for its children |
| Utility Components | 40:153 | secondary/helper components, not yet explored |

## Component set — this is a shadcn/ui-based library

The "Components" page's children are (nearly) exactly shadcn/ui's component set — Accordion, Alert, Alert Dialog, Aspect Ratio, Avatar, Badge, Breadcrumb, Button, Calendar, Card, Carousel, Chart, Chip, Checkbox, Collapsible, Combobox, Command, Context Menu, Data Table, Date Picker, Dialog, Drawer, Dropdown Menu, Form, Hover Card, Input, Input OTP, Label, Menubar, Navigation Menu, Pagination, Popover, Progress, Radio Group, Resizable, Scroll Area, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Sonner, Switch, Table, Tabs, Textarea, Toast, Toggle, Toggle Group, Tooltip, Logo.

**Implication:** if/when this design system is used in a React project, shadcn/ui (Radix UI primitives + Tailwind) is almost certainly the intended target implementation — check for a `components.json` / `components/ui/*` shadcn setup in the host project before assuming a from-scratch component API.

Each component page (e.g. "Button", node `34:6`) follows a consistent internal structure:
- A `_Docs Header` instance and a `Playground` frame (documentation/demo scaffolding — not design source)
- A `Components` section containing the actual `COMPONENT_SET` (e.g. Button's is node `37:931`), whose children are one `COMPONENT` per variant combination, named `Variant=<name>, State=<name>, Size=<name>`.

### Confirmed example: Button (node `34:6` page, component set `37:931`)

Variant/State/Size axes seen so far: `Variant=Default`, `State={Default,Hover,Disabled,Loading}`, `Size={default,icon,lg}` (likely more sizes/variants below the fold — not fully enumerated yet).

One variant instance (`37:930`, Variant=Default/State=Default/Size=default) had:
- `cornerRadius: 6`, `paddingLeft/Right: 16`, `paddingTop/Bottom: 8`, `itemSpacing: 8` — all bound to Figma **Variables** (see Tokens section below), not raw literals.
- `fills`: solid color bound to `VariableID:1:461` (resolves to rgb(0.09, 0.09, 0.09) ≈ `#171717` — likely a "foreground"/"primary" role, name not yet resolvable, see Tokens caveat).
- `styles.effect: "40:168"` → resolves via the `styles` endpoint to style name `shadow/md`.

**Operational note:** don't fetch a whole page node (e.g. `34:6`) via `nodes` — it returned ~4.8MB of JSON for just the Button page. Go straight to the specific `COMPONENT_SET`/`COMPONENT` node-id instead (see `references/figma-rest-api.md`).

## Tokens

- **Effect styles** (shadows) are on the classic Styles system and resolve fine via `styles` — e.g. `shadow/md` (node `40:169`), more under the same call.
- **Color/spacing/radius** are on Figma **Variables**, referenced via `boundVariables` → `VariableID:...` on nodes. The `variables` REST command currently 403s (`requires the file_variables:read scope`) — this may just need a token regenerated with that scope explicitly selected (untested whether the checkbox is even offered on the current plan). Until resolved, token *values* are readable per-component via `nodes`, but token *names* are not. See the caveat in `references/figma-rest-api.md`.
- No color-role table, spacing scale, or type scale has been transcribed yet — the "Documentation" and "Typography" pages (above) are the next places to look before hand-waving these in Step 5 inference.

### Color roles
_(not yet populated — see Documentation page, node 580:9181)_

### Spacing scale
_(not yet populated — see Documentation page)_

### Type scale
_(not yet populated — see Typography page, node 22:1400)_

### Other (radii, shadows/elevation, etc.)
- `shadow/md` confirmed to exist as an effect style (node `40:169`); likely siblings (`shadow/sm`, `shadow/lg`, etc.) exist under the same `styles` call — not yet enumerated.

## Naming / composition conventions

- Component variant props observed so far follow `Variant=<value>, State=<value>, Size=<value>` naming on the COMPONENT node `name` field within a COMPONENT_SET — likely consistent across all components on the "Components" page, worth confirming on a second component before assuming it's universal.

## Confirmed component specs (2026-08-03, three rounds — Figma-confirmed values win throughout)

Round 1 (below, struck through in spirit) pulled live from both sources back when this file still said "Storybook wins," and claimed the spacing/shape findings "weren't contradicted" by the later color-focused Figma Variables pull. **That claim was itself wrong** — round 3 (prompted by the user pointing directly at the Dropdown Menu node, `node-id=430-17998`) found Storybook's Button/DropdownMenu *spacing* numbers were also smaller/tighter than Figma's real ones, not just its colors. **Figma wins on every value in this section now; don't re-derive from Storybook for these five components without re-checking Figma first.**

- `--radius` is **8px** (`.5rem`), still holds — this wasn't contradicted. `--radius-md` is Figma's own literal `border-radius/md` = **6px** (matches `radius-2px`, no conflict). `--radius-sm` is Figma's own literal `border-radius/sm` = **2px** — confirmed directly and repeatedly on Button/DropdownMenu/Select nodes, **not** the earlier `radius-4px`-derived guess of 4px. Use the literal, not the formula.
- **Button-as-dropdown-trigger** (Figma node `430:17886`/`473:11354`, the Dropdown Menu's own trigger — a more direct read than the generic Button component page for this exact usage): `h-9`/**36px**, `px-4`/**16px**, `gap-2`/**8px**, `text-sm`/14px `font-medium`/500, `rounded-md`(6px, not `rounded-lg`/8px), `bg-background`, `border-input`, **`shadow/sm`** (`0 1px 2px rgba(0,0,0,.05)`, confirmed present — round 1's "no shadow" from Storybook's generic Button story was wrong for this usage).
- **DropdownMenu** (Figma node `430:17886`/`430:17991`/`473:11354`/`430:17998`): content = `bg-popover`, `rounded-md`(6px, not `rounded-lg`), `shadow/md` — precise two-layer value `0 2px 4px -1px rgba(0,0,0,.06), 0 4px 6px -1px rgba(0,0,0,.1)` (round 1's rounder Storybook approximation was close but not exact), `py-1`/4px outer padding (vertical only; each item additionally sits in its own `px-1`/4px horizontal wrapper — two-level padding in Figma's real DOM, worth replicating exactly if you're not collapsing it into one level like the prototype does). **Item = `rounded-sm`(2px, not `rounded-md`), `py-1.5 px-2`(6px/8px — round 1's Storybook-sourced 4px/6px was too tight)**, `text-sm`. Label = `text-muted-foreground text-xs font-medium`. Separator = `bg-border`, `my-1`(4px), `h-px`.
- **Select** (Figma node `345:11530`, closed-state instance `643:2018`): trigger = `h-9`/**36px** (not `h-8`/32px — Figma shows 36px directly for Select too, contradicting round 1's Storybook-sourced 32px), `border-input`, `bg-transparent` (dark: `bg-input/30`), `rounded-md`(6px), `py-2 px-3`(8px/12px, roughly uniform — not the asymmetric `pl-2.5` round 1 used). Figma's Select component only demos closed states (Default/Focus/Disabled) — **no open-listbox/item variant exists in Figma**, so the open Select content/item styling is legitimately Storybook-inferred (per the skill's actual rule: infer from Storybook only where Figma has nothing) and stays as round 1 found it: content structurally same as DropdownMenu's; item `rounded-md`(6px — Select's own item radius tier genuinely differs from DropdownMenu's `rounded-sm`, confirmed live, not an error), `py-1 pl-1.5 pr-8`(4px/6px/32px), **checkmark on the RIGHT** (`absolute right-2`), not left like stock shadcn docs.
- **Checkbox** (Storybook `ui-checkbox--checked`; no open Figma instance found): 16x16 (`size-4`), `border-input`, `rounded-[4px]` (this literal 4px is the checkbox square's own radius, a separate value from the `sm`/`md` menu-item tiers above — not contradicted, still stands). ⚠️ Live Storybook render of the "checked" story shows a transparent/unfilled box with a plain dark checkmark — the authored classes (`data-checked:bg-primary data-checked:text-primary-foreground`) don't appear to take effect live (same no-op pattern as Switch below — likely a Storybook build/Tailwind-variant issue, not intentional design). Treated the authored class *intent* as authoritative rather than the possibly-bugged live render.
- **Switch** (Figma instance `643:1984`; Storybook `ui-switch--checked`): track 32x18.4px, `rounded-full`, `border` 1px transparent (`box-sizing:border-box`). Thumb 16x16, `bg-background` always; translates `calc(100%-2px)`=14px on check. Track color `bg-input` off / `bg-primary` on — same live-render caveat as Checkbox. Not re-checked in round 3; flag if it turns out wrong too.
- `base/popover`/`base/card` are a distinct, lighter raised surface from `base/background` in dark mode (`#262626` vs `#171717`) — confirmed via direct Figma Variables, overriding an earlier Storybook-CSS-dump claim that they were flush with the page.
