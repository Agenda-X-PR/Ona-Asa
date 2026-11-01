# CultureLens design system: the plaque wall

Records hang like cast panels on a pillar. The idea comes from the Benin court
plaques, which were nailed in rows to palace pillars and worked as a visual
archive. Here every record, workshop and maker is a panel whose ground is chased
with its own craft's pattern. Only the structure is borrowed (rectangular
panels, chased ground, nail heads, a dark lintel); no royal figures or specific
historical motifs are copied.

The frame carries the world: the dark lintel, the panel wall on the home page,
the chased fields and the nail heads. The reading column stays calm, with a real
reading face, real contrast and a 68ch measure.

## Colour

Tokens live in `src/index.css` as CSS variables and are exposed to Tailwind as
`bg-ground`, `text-ink` and so on. Dark mode follows the system and can be
overridden with the header toggle (stored as `data-theme` on `<html>`).

| Token | Light | Dark | Use |
|---|---|---|---|
| `--ground` | `#d8ddd3` | `#15120d` | Page ground, a verdigris-washed stone |
| `--ground-deep` | `#c8cfc3` | `#0f0d09` | Recesses: the wall behind panels, the notice strip |
| `--face` | `#eef0ea` | `#221c14` | Panel faces and form fields |
| `--ink` | `#1f1a14` | `#eee5d1` | Text and primary buttons |
| `--ink-soft` | `#4b4337` | `#b9ad94` | Secondary text (7:1 or better) |
| `--rule` | `#747c70` | `#7a6c58` | Hairlines and field borders (3:1 or better on face) |
| `--brass` | `#74490a` | `#dca84e` | Links and accent text (4.5:1 or better on every ground) |
| `--brass-fill` | `#b9842c` | `#c08f38` | Nail heads, selection, markers |
| `--patina` | `#2b6356` | `#7cc0ae` | Focus ring and status marks |
| `--alert` | `#9a2b1f` | `#ec9484` | Errors |
| `--frame` | `#231c14` | `#0b0907` | Lintel (header) and footer pillar |
| `--frame-ink` / `--frame-soft` / `--frame-accent` | `#ebdfc6` / `#b8aa8f` / `#d6a24a` | same / `#a99c82` / `#dca84e` | Text on the frame |
| `--motif` | `#6f6450` | `#a48a5c` | Chased pattern lines |

Colour strategy: restrained. Bronze, brass and patina only. Crafts are told
apart by pattern, never by colour.

## Type

- Display: **Big Shoulders Display** 600 to 800. Headings h1 to h3, panel titles,
  prices and references. Condensed and stamped, like cast lettering.
- Text: **Literata** (optical sizes) 400, 600 and 700, plus italic. Body, UI and
  forms. Both faces cover the combining marks Yorùbá needs (ọ̀, ẹ́, ṣ).
- Scale: body 17px at 1.65 line height. h1 `clamp(2.75rem, 7vw, 5.25rem)`,
  section h2 about 2rem, panel h3 1.35 to 1.6rem. Small text 0.875rem, never
  less.
- Numbers in prices, dates and references use `tabular-nums lining-nums`
  (`.tnum`).
- No all-caps labels, no eyebrow labels above headings, no monospace.

## Components

- `.plaque`: panel face, 1px border, 3px radius, top highlight, bottom shade and
  one offset shadow. Add `.nails` for the four brass nail heads. Use panels for
  things that are objects (a record, a workshop, a form, a receipt), not as a
  default container.
- `.motif-field` + `<Motif craft>`: the chased ground. Patterns in
  `src/components/Motif.tsx`: aso-oke strips, adire squares, ìlẹ̀kẹ̀ strands,
  terracotta combing, bronze leaf ground, chip-carved woodcarving, and a single
  sparse uli drawing (uli favours open space, so it does not repeat).
- `CraftFigure`: shows a photo only when it shows that craft, otherwise the
  drawn pattern, each with an honest caption.
- `Monogram`: initials on a small panel, in place of portraits nobody supplied.
- Status marks: the line's form carries the state. Solid for documented, double
  for community reviewed, dashed for under review, struck for contested. The
  word always sits beside it.
- Lists of people and workshops are ruled rows, not card grids.
- Buttons: `.btn-primary` (ink) and `.btn-quiet` (outline), 44px minimum height.
- Fields: `.field-label` above, `.field-hint` below, `.input`; radio and checkbox
  options use `.choice` inside a `fieldset` with a `legend`.
- Dialogs use the native `<dialog>` (`useModalDialog`), which locks page scroll.

## Layout

- `.page`: max 78rem, 16px side gutter on phones and 32px from 640px.
- Reading column `minmax(0, 68ch)` with an aside on wide screens.
- Grids always declare a shrinkable base column (`grid-cols-[minmax(0,1fr)]`)
  so long words never push the page wider than the phone.
- Left aligned throughout.

## Motion

- The one authored moment: on the home page the wall's patterns pour in top to
  bottom, staggered 90ms (`.pour`, clip-path, 900ms, expo ease-out).
- Responses to actions: dialogs and confirmations rise in (`.rise`, 260ms).
  Linked panels lift 2px on hover.
- `prefers-reduced-motion: reduce` removes all of it.

## Banned

Purple or blue gradients, gradient text, glass, pastel icon tiles, identical
card grids as page structure, eyebrow labels, all-caps tracking, monospace as
decoration, emoji, coloured side stripes on callouts, and photos presented as
people or places they do not show.
