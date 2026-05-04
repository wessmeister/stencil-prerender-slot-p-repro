# Stencil prerender residue: `<p>` in light DOM after scoped prerender

A minimal, production-shaped Stencil setup that demonstrates how
`renderToString({ serializeShadowRoot: 'scoped' })` emits a `<p>` into light
DOM as a slotted child of a `shadow: true` component whose template wraps
`<slot/>` in `<p>`.

Two workspaces:

- `components/` — the design-system library. Builds with `dist` +
  `dist-hydrate-script` (production output targets, no `www`, no `--dev`).
- `consumer/` — a standalone deployable. Imports the built component bundle,
  prerenders `public/index.html` via the published `repro-components/hydrate`
  package, and serves the static result.

## Components

`repro-text` — `shadow: true`, renders `<p class="repro-text"><slot/></p>`,
shadow stylesheet has `.repro-text { margin: 0 }`.

`repro-badge` — `shadow: true`, renders a 24px pill containing
`<repro-text><span><slot/></span></repro-text>`.

## Run

```bash
npm install
npm start
```

Open <http://localhost:4568>.

## What the prerender produces

`consumer/scripts/prerender.mjs` runs `renderToString` against
`consumer/public/index.html` (source: `<repro-badge>Snowboarding</repro-badge>`)
and writes the result back to the same file. The served HTML contains the
following residue inside `<repro-text>`:

```html
<repro-text class="sc-repro-badge sc-repro-text-h hydrated" c-id="1.3.1.1" s-id="2">
  <p class="repro-text sc-repro-text sc-repro-text-s" c-id="2.0.0.0">
    <span class="sc-repro-badge sc-repro-badge-s" s-sn="">Snowboarding</span>
  </p>
</repro-text>
```

That `<p>` is a copy of `repro-text`'s shadow render emitted as a light-DOM
child — the residue. While the page is parsed but not yet hydrated, the
global `<style sty-id="sc-repro-text">` rule
`.repro-text.sc-repro-text { margin: 0 }` matches it (both classes are
present) and keeps `margin: 0`.

## What hydration does in this setup

`@stencil/core` 4.43.2's lazy-loaded production runtime moves the residue
into `repro-text`'s shadow root during hydration. After hydration:

- `repro-text.shadowRoot` contains the rendered `<p>` template.
- `repro-text`'s light DOM contains only the `<span>` from `repro-badge`'s
  shadow (the slot wrapper).
- The badge renders correctly; the label sits inside the pill.

So in this minimal, shadow-DOM-correct path, the residue is cleaned up and
no visible bug surfaces.

## Why this repro exists anyway

A downstream consumer running fully prerendered + hydrated production pages
reports the same residue **surviving** hydration with the scope-suffix
classes (`sc-repro-text`, `sc-repro-text-s`) stripped. With the suffix
classes gone, the global rule no longer matches and UA
`p { margin-block: 1em }` becomes the only applicable rule on the residue,
which adds 16px above and below — pushing labels out of fixed-height
containers (e.g. a 24px pill).

We have not been able to isolate the production-runtime configuration that
preserves the residue inside this minimal Stencil project. Every
configuration tried (`renderToString` and `hydrateDocument`,
`serializeShadowRoot: 'scoped'` and `'declarative-shadow-dom'`, mixed
per-component serialization, components built with `dist` /
`dist-custom-elements` / `dist-hydrate-script`, consumer hydrating via the
published lazy `loader` bundle as in this repo) lands the residue in the
shadow root after hydration. The SSR HTML demonstrates what Stencil emits;
this repo cannot demonstrate what production observes.

## Files

```
components/
  src/components/repro-badge/{repro-badge.tsx,repro-badge.css}
  src/components/repro-text/{repro-text.tsx,repro-text.css}
  stencil.config.ts            # dist + dist-hydrate-script
  package.json                 # name: repro-components, exports loader + hydrate
consumer/
  public/index.html            # input source; overwritten by prerender
  scripts/copy-bundle.mjs      # copies repro-components/{dist,loader} to public/build/
  scripts/prerender.mjs        # renderToString({ serializeShadowRoot: 'scoped' })
  package.json                 # depends on repro-components workspace
package.json                   # workspaces orchestrator
```
