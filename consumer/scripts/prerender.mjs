import { createWindowFromHtml, hydrateDocument } from '@cosmos/web-scoped/hydrate/index.mjs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const sourceFile = fileURLToPath(new URL('../index.html', import.meta.url));
const outFile = fileURLToPath(new URL('../public/index.html', import.meta.url));
const source = await readFile(sourceFile, 'utf-8');

// Mirror the production rb3ca-prerender flow: jsdom-like document, hydrateDocument with
// scoped serialization and clientHydrateAnnotations.
const win = createWindowFromHtml(source, 'prerender-' + Date.now());
const doc = win.document;
await hydrateDocument(doc, {
  serializeShadowRoot: 'scoped',
  clientHydrateAnnotations: true,
});
const html = '<!doctype html>' + doc.documentElement.outerHTML;
await mkdir(fileURLToPath(new URL('../public', import.meta.url)), { recursive: true });
await writeFile(outFile, html, 'utf-8');
console.log(`Prerendered ${outFile}`);
