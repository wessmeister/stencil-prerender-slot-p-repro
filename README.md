# Stencil prerender residue

Minimal Stencil project that demonstrates how `renderToString({ serializeShadowRoot: 'scoped' })` emits a `<p>` element into light DOM as a slotted child of a `shadow: true` component whose template wraps `<slot/>` in `<p>`.

## Setup

Two workspaces:

- `components/` — a Stencil 4.43.2 component library with two `shadow: true` components. `repro-text` renders `<p class="repro-text"><slot/></p>` and has `.repro-text { margin: 0 }` in its shadow stylesheet. `repro-badge` renders a 24px pill containing `<repro-text><span><slot/></span></repro-text>`. Builds with the production output targets `dist`, `dist-custom-elements`, and `dist-hydrate-script`.
- `consumer/` — a standalone deployable. Imports the built bundle, prerenders `index.html` via `repro-components/hydrate`, and serves the static result.

## Run

```bash
npm install
npm start
```

Open <http://localhost:4568>.

## What the prerender produces

The source is `<repro-badge>Snowboarding</repro-badge>`. After prerendering, the served HTML contains the following inside `<repro-badge>`'s scoped output:

```html
<repro-text class="sc-repro-badge sc-repro-text-h hydrated">
  <p class="repro-text sc-repro-text sc-repro-text-s">
    <span class="sc-repro-badge sc-repro-badge-s" s-sn="">Snowboarding</span>
  </p>
</repro-text>
```

That `<p>` is a copy of `repro-text`'s shadow render emitted as a light-DOM child. While the page is parsed but not yet hydrated, the global `<style sty-id="sc-repro-text">` rule `.repro-text.sc-repro-text { margin: 0 }` matches it and keeps its margin at 0.

## What hydration does

Stencil's runtime in modern Chrome moves the leftover `<p>` into `repro-text`'s shadow root during hydration and the pill renders correctly. The light DOM ends up clean.

## Why this matters

If the leftover `<p>` is not moved into the shadow root and loses its scope-suffix classes (`sc-repro-text`, `sc-repro-text-s`), the global rule no longer matches and UA `p { margin-block: 1em }` becomes the only applicable rule. That adds 16px above and below and pushes any text inside out of fixed-height containers like the pill above. This minimal project demonstrates the prerender output side. It does not reproduce the surviving-residue end state.
