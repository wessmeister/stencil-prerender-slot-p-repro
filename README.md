# Stencil prerender residue

Minimal Stencil 4.43.2 project demonstrating that `renderToString({ serializeShadowRoot: 'scoped' })` emits a `<p>` into light DOM as a slotted child of a `shadow: true` component whose template wraps `<slot/>` in `<p>`.

## Run

```bash
npm install
npm start
```

Open <http://localhost:4568>. The served HTML contains the residue inside `<repro-text>`. Stencil's runtime in modern Chrome moves it into the shadow root during hydration.
