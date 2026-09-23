# Case study content handoff

Use this as an isolated prompt when populating a **new** case study on this site. Do not recreate Conversational Convenience. Reuse the block system, placement habits, and working loop below. Map the new project's writing and media onto the same patterns.

## Where content lives

- Site still reads local fixtures (`SANITY_LIVE` is off in `apps/web/src/lib/server/content.ts`). Edit the project object in `apps/web/src/lib/data/fixtures.ts`.
- Put media under `apps/web/static/projects/<slug>/` and reference as `/projects/<slug>/<file>`.
- Homepage card fields (title, slug, poster, year, tags, weight, colors) are separate from the case study body. Update them only when the new project needs it.
- Project page chrome is fixed: title, tagline (`description`), scope, tags, then the poster hero, then the ordered `body` stack. Body order is page order.

## Available body blocks

| Block | Role |
| --- | --- |
| `block` (paragraph) | Narrow-column prose. First two **standalone** paragraphs in the body get large lead type automatically (`Block.svelte` uses index 0 and 1). Prefer putting the real lead inside a layout `copy` item with `lead: true` when it must sit beside an image. |
| `block` h2 / h3 | Section titles, large top padding. |
| `fullImage` | Full-bleed still. Use for process boards, wide photos that should interrupt the column. |
| `layoutBlock` | Grid of items. Ratios: `1fr`, `1/2`, `2/1`, `2/3`, `3/2`, `2/4`, `4/2`, `3/3`. On small screens items stack. |
| Layout item `image` | Still with optional `label`, `title`, `text` caption under (or `overlay`). Flags: `topPadding`, `fillHeight`, `rowSpan`, `stroke` (3pt inner red outline for “this fails / reject” frames). |
| Layout item `video` | Muted autoplay loop with poster. Same caption flags as image. |
| Layout item `copy` | Prose inside the layout grid. `paragraphs[]`, optional `heading`, `lead` (large type), `span` (span all columns under a media row). Cap width ~40rem when not spanning. |
| `videoBlock` | Full-width video. Default for ambient loops: `canScrub: false`, `seekOnScroll: false` → muted, loop, autoplay. Set width/height for aspect ratio. Poster optional but useful for large files. |
| `quoteBlock` | Large pull quote. Optional `who` / `title`. |
| `listBlock` | Numbered / labeled rows. |
| `team` | Name + role list. |
| `slideShow` | Click-through stills. |
| `spacer` | Vertical gap only. |

Components already own type size, spacing, and column locking. Do not invent new layout components for a single study unless the existing blocks cannot express the pairing.

## Placement patterns that worked

These are the useful habits from Conversational Convenience. Apply the pattern, not the 7-Eleven story.

### 1. Pair the opening claim with its proof image

Do not leave a large lead paragraph floating, then a separate media row later. Put the lead sentence and the related still in one `layoutBlock` (e.g. `2/1`: copy left, image right with a short caption). Secondary establishing images can sit alone afterward (`1fr` or a second layout).

### 2. Keep related section headings as captions on a set of frames

When three (or more) short “anti-patterns” or findings each have their own still, prefer one `layoutBlock` with `3/3` (or similar) and put each heading + paragraph in that item’s `title` / `text`. Avoid a stack of h2s each followed by one lonely image.

Use `stroke: true` when the frames are meant to read as rejected / wrong-path examples.

### 3. Sandwich full-width experiential video with dialogue

A long ambient or documentary clip needs a short paragraph before and after:

- Before: what the viewer is looking at / the real-world job.
- Video: `videoBlock`, autoplay + loop + muted, with a still poster.
- After: the design implication that follows from that experience.

Do not drop a silent full-bleed video with no surrounding copy.

### 4. Keep product demos and the copy that explains them in one layout

If three prototype videos illustrate one section, put them in a `3/3` (or similar) layout, then add `copy` items with `span: true` **in the same layout** for the follow-on paragraphs and any related h2. That way the writing does not read as a separate chapter below an orphaned video strip.

Introducing h2 + 1–2 paragraphs above the demo row is fine when those lines set up the demos. Put the “how it behaves / what to ask” dialogue under the demos, still inside the same layout when it belongs to them.

### 5. Pair “constraints / limits / honesty” copy with the closing product video

When the closing argument and a long product video both exist, put limits copy and the looping video in one layout (e.g. `1/2`: copy left, video right) instead of ending on an uncaptioned full-bleed video after a wall of text.

### 6. Prefer fewer full-bleed stills

Full-bleed images compete with video and with the hero poster. Use them for research boards or one pivotal wide photo. Drop near-duplicate crops of the same UI; pick the clearest frame.

### 7. Media hygiene

- Numbered source folders are a guide to narrative order, not a requirement to use every file.
- Skip near-duplicates (tight crops of the same screen, alternate takes of the same question UI).
- For videos: muted autoplay loops by default. Large files need a poster still. Prefer compressed H.264 when possible; huge aisle clips still work but slow the page.
- Always write alt text (even rough is fine; tighten later).
- Captions should be short: label optional, title punchy, one supporting line.

### 8. Background color shifts with scroll

The article background and text ink change as the reader scrolls through named body blocks. This is content configuration on the project, not a one-off CSS effect.

**Fields on the project** (in fixtures):

- `pageColor` — opening article background (before any stop fires). Falls back to the normal surface background if omitted.
- `colorStops` — ordered list of `{ at, color, when?, line? }`:
  - `at` — `_key` of a body block that can carry a marker (see below).
  - `color` — hex for the article background once that stop is active.
  - `when` — when the stop becomes active (default `cross`):
    - `cross` — block top passes the default scroll line (50% of the scrollport).
    - `reveal` — block bottom has entered the scrollport (whole block has appeared).
    - `enter` — block top reaches the scrollport bottom, or a custom `line` if set.
    - `center` — block midpoint passes the scroll line (or custom `line`).
    - `past` — block has fully scrolled above the top of the scrollport.
  - `line` — optional `0–1` fraction of the scrollport height used instead of the default mid line for that stop.

Stops are evaluated in array order. The last stop whose condition is met wins. Ink (`--fg`) flips between `colorLight` and `colorDark` from luminance of the active background. Transition timing lives in `PAGE_FADE` (`apps/web/src/lib/pageColor.ts`).

**Which blocks can be targets:** markers are stamped via `stopAttrs` on paragraphs (`block`), `layoutBlock`, `videoBlock`, and `quoteBlock`. The `at` value must match that block’s `_key`. Full images, lists, team, slideshow, and spacer do not emit markers today—point stops at a neighboring paragraph, layout, video, or quote instead.

**Pattern that worked** (tone arc, not specific hexes):

1. Opening `pageColor` matches the hero / brand mood (often a warm or strong accent while the poster is in view).
2. Early body → dark reading ground once the problem statement is fully on screen (`reveal` on a key paragraph).
3. Mid study → light ground when a major ambient or product beat centers (`center` + a `line` like `0.3` on a `videoBlock`).
4. Closing → return toward the opening mood when the pull quote enters (`enter` + a lower `line` like `0.8` on a `quoteBlock`).

Use few stops (two or three). Each shift should mark a real beat change (into reading, into experience, into closing argument)—not every section. Pick light backgrounds only when the media in that beat can live on light; ink will go dark automatically.

**Example shape** (keys and colors are illustrative):

```ts
pageColor: '#872C02',
colorStops: [
  { at: 'problem-graph', color: '#000000', when: 'reveal' },
  { at: 'field-video', color: '#ededed', when: 'center', line: 0.3 },
  { at: 'closing-quote', color: '#872C02', when: 'enter', line: 0.8 }
]
```

Wiring: `PortableBody` gets `stops={project.colorStops}`; the project page reads `[data-page-color]` markers on scroll and sets article `--bg` / `--fg`. Logic: `apps/web/src/lib/pageColor.ts`. Tests: `apps/web/src/lib/pageColor.test.ts`.

## Narrative shape (generic)

A case study body that felt clear, without copying topic:

1. **Open** — Claim + proof image paired.
2. **Problem / context** — Short paragraphs, maybe a second establishing image.
3. **Research / process** — Prose, then a full-bleed board or artifact.
4. **What fails** — Equal-column frames with titles as captions (stroke if “reject”).
5. **Lived context** — Dialogue, ambient video, dialogue.
6. **Concept / solution** — Section heading, setup copy, demo videos, then behavior copy under those demos in the same layout.
7. **Argument** — Pull quote + closing paragraphs.
8. **Limits + closing product** — Honesty copy paired with the final looping video.

Skip or reorder sections when the material does not support them. Do not invent sections the writing does not have.

## Working loop with the author

1. Author sends raw writing + a media folder (numbered is helpful) and any notes (“hero”, “pair with X”).
2. Agent maps an outline to blocks **before** large fixture edits when the map is ambiguous; otherwise make best-call placements and explain decisions after.
3. Agent copies media into `static/projects/<slug>/`, writes the project `body` in fixtures, updates tagline/scope/tags/type if needed.
4. Author reviews in the browser and points at DOM nodes or describes “this with that.” Agent reorders, pairs, cuts, or restyles in short rounds.
5. Prefer fixture/content changes over new components. Extend layout `copy` / caption flags only when pairing cannot be done with existing blocks.

## Implementation pointers

- Primary file: `apps/web/src/lib/data/fixtures.ts` (the project’s `body` array, plus `pageColor` / `colorStops`).
- Layout rendering: `apps/web/src/lib/components/content/LayoutBlock.svelte` (supports `copy` items).
- Media + stroke: `apps/web/src/lib/components/content/MediaItem.svelte`.
- Page background shifts: `apps/web/src/lib/pageColor.ts`, applied in `apps/web/src/routes/projects/[slug]/+page.svelte`.
- Types: `apps/web/src/lib/sanity/types.ts` (`MediaItem` includes `kind: 'copy' | 'image' | 'video'`, `stroke`, `lead`, `span`, `paragraphs`, `heading`; `PageColorStop` / `pageColor` / `colorStops` on `Project`).
- Page shell: `apps/web/src/routes/projects/[slug]/+page.svelte`.
- Sanity schemas mirror most of this for a future live CMS switch; fixtures are the source of truth until `SANITY_LIVE` is on. Layout `copy`, `stroke`, and page-color stops may exist only on the web side until Studio is updated—fine while fixtures drive the site.

## What to ask the author for a new study

- Project slug / title / tagline / scope / tags / light-or-dark colors if changing the card.
- Written draft (paste or link), unformatted is fine.
- Media folder; note which files are hero, process, fail examples, demos, closing.
- Any frames that should read as “reject” (red stroke).
- Any videos that must autoplay vs scrub (default: autoplay loop muted).
- Desired page-color arc: opening background, and which beats should shift (e.g. into dark reading, light for a field/product moment, return color on the closing quote). Hexes optional; author can point at brand tones.

## Anti-patterns to avoid

- Large lead copy disconnected from the image that proves it.
- Demo video row with all explanation parked in the next section.
- Full-bleed video with zero surrounding dialogue.
- Using every frame from a slide deck when half are crops of the same shot.
- Building new layout components for one case study when a `layoutBlock` + `copy` item would do.
- Color stops on every section, or `at` keys that do not match a marked block `_key`.
- Pointing a stop at `fullImage` / list / team / slideshow / spacer (no marker)—use a paragraph, layout, video, or quote key instead.
