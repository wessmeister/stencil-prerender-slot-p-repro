# Stencil prerender repro: badge label drops below pill

Minimal reproduction of a layout failure on prerendered pages: a `<p>` slotted
into a Stencil `shadow: true` component whose template wraps `<slot />` in a
`<p>` ends up with the UA `p { margin-block: 1em }` applied, because the shadow
stylesheet's `margin: 0` rule cannot reach slotted content.

This is the CSS mechanism behind cosmos PR
[redbullmediahouse/rbds-cosmos#4115](https://github.com/redbullmediahouse/rbds-cosmos/pull/4115).

## Run

```bash
npm install
npm start
```

Open <http://localhost:4567>.

## What you should see

A pill outline at the top of the page, with the dot and "Snowboarding" sitting
**below** the pill outline rather than inside it.

## Setup

- `@stencil/core` 4.43.2
- Two components, both `shadow: true`:
  - `repro-text` — renders `<p class="repro-text"><slot /></p>` with
    `margin: 0` in its shadow stylesheet.
  - `repro-badge` — renders a pill containing
    `<repro-text><span><slot /></span></repro-text>`.
- Source HTML: `<repro-badge><p>Snowboarding</p></repro-badge>`.
- The page is prerendered through Stencil's `renderToString` with
  `serializeShadowRoot: 'scoped'` before being served.

## Why this happens

After hydration the rendered cascade is:

```text
<repro-badge>
  shadow:
    <div class="repro-badge">
      <span class="prefix">●</span>
      <repro-text>
        shadow:
          <p class="repro-text">     ← shadow stylesheet's margin: 0 applies here
            <slot />                 ← projects light DOM child of repro-text
          </p>
        light DOM:
          <span>                     ← from repro-badge's shadow
            <slot />                 ← projects user's slot content
          </span>
      </repro-text>
    </div>
</repro-badge>
```

User content `<p>Snowboarding</p>` flows through both slots and ends up
projected inside the shadow `<p>`. The shadow stylesheet's
`.repro-text { margin: 0 }` rule lives inside repro-text's shadow root and
cannot style slotted content (no `::slotted(p)` rule). UA stylesheet
`p { margin-block: 1em }` is the only rule that applies, adding 16px above and
below. That overflows the 24px pill.

## Caveat — what this repro does NOT cover

The original cosmos bug had Stencil's scoped prerender automatically leaving a
`<p>` (a copy of cosmos-text's rendered shadow `<p>`) in light DOM as
cosmos-text's slotted child, surviving hydration. We could not reproduce that
**auto-leak** in a minimal Stencil 4.43.2 setup — the local runtime always
moves the prerender residue into the shadow root because `addStyle` uses
constructable stylesheets, leaving the shadow root empty before the
"populate shadow" block runs in `initializeClientHydrate`.

This repro instead places the `<p>` in the source HTML as user-provided slot
content. The end-state DOM and the visible bug are identical to what the
auto-leak path produces in production. The CSS mechanism (shadow stylesheet
cannot reach slotted content; UA margin wins) is the same in both cases.

## Fix in cosmos

`tag="span"` on the inner cosmos-text in cosmos-badge / cosmos-chip changes the
inner shadow template from `<p>` to `<span>`. For the auto-leak case that
makes the residue a `<span>` (no UA margin). For a user-supplied `<p>` it does
not help — but real consumers slot text into cosmos-badge, not `<p>` elements.
