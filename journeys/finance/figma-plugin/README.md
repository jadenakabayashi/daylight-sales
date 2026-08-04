# Finance Journey — Figma builder plugin

This is a local dev plugin that builds the Finance journey map as real,
editable Figma layers (frames, text, images) in whatever file you run it
from — not a static export. It exists because Figma's APIs don't support
pushing content into a file from outside Figma itself; a plugin run from
inside the desktop app is the actual way to create editable layers
programmatically.

## Setup (one time)

1. Open the **Figma desktop app** (not the browser — dev plugins only load there).
2. Open the file you want the journey added to (or any file — it creates a
   new page, so it won't touch existing content).
3. Menu (top-left icon) → **Plugins** → **Development** → **Import plugin from manifest…**
4. Point it at `manifest.json` in this folder.

## Run it

Menu → **Plugins** → **Development** → **Finance Journey Builder**.

It creates a new page called **"Finance Journey (WIP)"** with everything on
it — the WIP scope callout, all 9 stages (each tagged Finance, with a
dashed/grayed treatment on the two true gap stages that have no supporting
screenshot), the 9 real screenshots pulled from the combined stakeholder
packet, the naming callout, and the methodology footer — as ordinary frames
and text layers you can edit, restyle, or move like anything else you'd
build by hand. It only ever adds a new page — it never touches any existing
page or content already in the file. It takes a few seconds; you'll get a
small toast notification when it's done.

## If something looks off

- **Fonts**: it uses Inter (Regular/Medium/Semi Bold/Bold), which ships with
  Figma by default. If a weight fails to load in your environment, that text
  will fall back to Bold rather than error out.
- **Re-running**: running it again adds another new page rather than
  overwriting — delete the old one first if you want a clean re-run.
- I wrote and syntax-checked this code but couldn't execute it inside real
  Figma myself (no Figma desktop access from where I work) — so treat the
  first run as a test. If a specific frame looks wrong, tell me what you're
  seeing and I'll fix the generator rather than you hand-editing around it.

## Source

Content mirrors [the HTML version](../journey.html) — same copy, same
screenshots, same sources, same WIP framing (this is built from a single
interview, Jesse Tracy's). `code.template.js` is the human-readable source;
`code.js` is that same file with all 9 screenshots' base64 data spliced in
(that's why it's ~585K — don't hand-edit `code.js` directly, edit the
template and regenerate: base64-encode each JPEG and substitute it for the
matching `{{IMG_...}}` placeholder in `code.template.js`, then re-run
`node --check` on both files).
