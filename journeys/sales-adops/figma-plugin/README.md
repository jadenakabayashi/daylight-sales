# Sales & Ad Ops Journey — Figma builder plugin

This is a local dev plugin that builds the journey map as real, editable Figma
layers (frames, text, images) in whatever file you run it from — not a static
export. It exists because Figma's APIs don't support pushing content into a
file from outside Figma itself; a plugin run from inside the desktop app is
the actual way to create editable layers programmatically.

## Setup (one time)

1. Open the **Figma desktop app** (not the browser — dev plugins only load there).
2. Open the file you want the journey added to (or any file — it creates a
   new page, so it won't touch existing content).
3. Menu (top-left icon) → **Plugins** → **Development** → **Import plugin from manifest…**
4. Point it at `manifest.json` in this folder.

## Run it

Menu → **Plugins** → **Development** → **Sales & Ad Ops Journey Builder**.

It creates a new page called **"Sales & Ad Ops Journey"** with everything on
it (v2) — the nav-split callout (with the real Marly sidebar screenshot showing
Sales vs. Ad Ops as separate nav areas), all 10 stages each tagged Sales/Ad Ops/
Finance, the Bob/Vault quadrant-ownership diagram inside the ad-plan stage, the
parallel workstreams, the "Sales-only, continuous work" section, the IO
lifecycle module (now with an owner label per step), the naming callout, and
the methodology footer — as ordinary frames and text layers you can edit,
restyle, or move like anything else you'd build by hand. It only ever adds a
new page — it never touches any existing page or content already in the file.
It takes a few seconds; you'll get a small toast notification when it's done.

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

Content mirrors [the HTML version](../journey.html) v2 —
same copy, same screenshots, same sources. `code.template.js` is the
human-readable source; `code.js` is that same file with all 7 screenshots'
base64 data spliced in (that's why it's ~545K — don't hand-edit `code.js`
directly, edit the template and regenerate: base64-encode each JPEG and
substitute it for the matching `{{IMG_...}}` placeholder in `code.template.js`,
then re-run `node --check` on both files).

I wrote and syntax-checked this v2 update but haven't run it inside real
Figma myself — same caveat as before, treat the first run as a test.
