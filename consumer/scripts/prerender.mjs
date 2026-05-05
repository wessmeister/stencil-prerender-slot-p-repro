import { renderToString } from 'repro-components/hydrate';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const sourceFile = fileURLToPath(new URL('../index.html', import.meta.url));
const outFile = fileURLToPath(new URL('../public/index.html', import.meta.url));
const source = await readFile(sourceFile, 'utf-8');
const { html } = await renderToString(source, { serializeShadowRoot: 'scoped' });
await mkdir(fileURLToPath(new URL('../public', import.meta.url)), { recursive: true });
await writeFile(outFile, html, 'utf-8');
console.log(`Prerendered ${outFile}`);
