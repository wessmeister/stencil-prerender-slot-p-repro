# Stencil prerender repro: badge label drops below pill

Two `shadow: true` components:

- `repro-text` — renders `<p class="repro-text"><slot /></p>` with `margin: 0`
  in its shadow stylesheet.
- `repro-badge` — renders a 24px pill containing
  `<repro-text><span><slot /></span></repro-text>`.

Source HTML: `<repro-badge><p>Snowboarding</p></repro-badge>`. The page is
prerendered with `renderToString({ serializeShadowRoot: 'scoped' })`.

## Run

```bash
npm install
npm start
```

Open <http://localhost:4567>.

## What you see

The pill outline sits at the top, the dot and "Snowboarding" sit ~16px below
the pill bottom.

## Why

The slotted `<p>` is projected through `repro-badge`'s slot, into
`repro-text`'s slot, and finally into `repro-text`'s shadow `<p>`. The shadow
stylesheet's `.repro-text { margin: 0 }` rule cannot reach slotted content
(no `::slotted(p)` rule). UA `p { margin-block: 1em }` is the only rule that
applies and adds 16px above and below — overflowing the 24px pill.
