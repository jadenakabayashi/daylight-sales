# Daylight Storybook — live implementation source

`https://storybook-nine-gray.vercel.app` — a running instance of the actual component library (shadcn/ui pattern: Radix UI primitives + Tailwind CSS v4, `lucide` icons). Same-origin iframe, so its DOM and stylesheets are directly readable via `javascript_tool` in the Browser tool — no reverse-engineering needed.

Confirmed 2026-07-13: 53 components / ~219 stories.

## Get the full story catalog

Storybook exposes its index as JSON:

```js
fetch('/index.json').then(r => r.json()).then(d => window.__sbIndex = d);
// then, after it resolves:
Object.keys(window.__sbIndex.entries)   // story ids, e.g. "ui-accordion--single"
```

Group by `entries[id].title` (e.g. `"UI/Accordion"`) to get the 53 component names without listing every story variant. See `references/library-map.md` for the already-captured list — only re-fetch if you suspect it's gone stale.

## Jump straight to a specific story

Two ways, both keyed by the story id (`<group>-<name>--<story>`, kebab-case, e.g. `ui-accordion--single`):

- Full UI: `https://storybook-nine-gray.vercel.app/?path=/story/ui-accordion--single`
- Bare rendered iframe (no Storybook chrome, faster to inspect): `https://storybook-nine-gray.vercel.app/iframe.html?id=ui-accordion--single&viewMode=story`

If you don't already know the exact id, open the full UI once, use `find`/`read_page` on the sidebar, or pull `/index.json` per above.

## Extract the real rendered markup

The story is rendered inside a same-origin iframe (`#storybook-preview-iframe` when viewing the full UI page; the whole document when you navigate directly to `iframe.html`). Pull its HTML directly:

```js
(function() {
  const iframe = document.querySelector('#storybook-preview-iframe') || document.querySelector('iframe');
  const doc = iframe ? iframe.contentDocument : document;
  const root = doc.querySelector('#storybook-root') || doc.body;
  return root.innerHTML;
})();
```

This gives verbatim Tailwind utility classes, `data-slot` attributes (Daylight's components consistently use `data-slot="<component>"` / `data-slot="<component>-<part>"`, e.g. `data-slot="accordion-trigger"`), Radix `data-state`/`aria-*` attributes, and icon markup — this is the actual code, not a paraphrase of it. Use it as the template for generating the component in the host project's stack, adapting only what the host's framework/build actually requires (e.g. JSX prop syntax vs. raw HTML attributes).

## Extract the CSS variable tokens

Also pulled from the same iframe's stylesheets — this is the authoritative token table (names **and** resolved values, both light and `.dark`):

```js
(function() {
  const iframe = document.querySelector('#storybook-preview-iframe') || document.querySelector('iframe');
  const doc = iframe ? iframe.contentDocument : document;
  const vars = {};
  for (const sheet of doc.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        if (rule.selectorText === ':root' || rule.selectorText === '.dark') {
          for (const prop of rule.style) {
            if (prop.startsWith('--')) vars[rule.selectorText + ' ' + prop] = rule.style.getPropertyValue(prop);
          }
        }
      }
    } catch (e) {}
  }
  return JSON.stringify(vars, null, 2);
})();
```

The full table as of 2026-07-13 is cached in `references/library-map.md` — check there first; only re-run this if you suspect the palette has changed.

**This is a better source for tokens than the Figma REST fallback** — Figma's `variables` endpoint is currently blocked on token scope (see `references/figma-rest-api.md`), so Storybook is the more reliable place to get real token *names*, not just resolved values, until that's fixed.

## What Storybook won't tell you

- Anything not yet built as a story — new/in-progress components, composed page layouts ("Blocks" in Figma) — fall back to Figma for those.
- The *design* rationale (why a spacing/color choice was made) — Figma's Documentation page is the place for that, if you need it for Step 5 inference.
