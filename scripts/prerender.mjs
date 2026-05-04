import { renderToString } from '../hydrate/index.mjs';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const file = fileURLToPath(new URL('../www/index.html', import.meta.url));
const source = await readFile(file, 'utf-8');
const { html } = await renderToString(source, {
  serializeShadowRoot: { default: 'declarative-shadow-dom', scoped: ['repro-text'] },
});
await writeFile(file, html, 'utf-8');
console.log(`Prerendered ${file}`);
