import { cp, mkdir, rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const pkgDir = dirname(require.resolve('@cosmos/web-scoped/package.json'));

const fromCustomElements = resolve(pkgDir, 'lib/custom-elements');
const buildDir = fileURLToPath(new URL('../public/build', import.meta.url));
const toCustomElements = `${buildDir}/custom-elements`;

await rm(buildDir, { recursive: true, force: true });
await mkdir(toCustomElements, { recursive: true });
await cp(fromCustomElements, toCustomElements, { recursive: true });
console.log(`Copied @cosmos/web-scoped custom-elements bundle to ${toCustomElements}`);
