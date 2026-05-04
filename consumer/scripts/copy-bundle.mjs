import { cp, mkdir, rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const pkgPath = require.resolve('repro-components/package.json');
const pkgDir = dirname(pkgPath);

const fromDist = resolve(pkgDir, 'dist');
const fromLoader = resolve(pkgDir, 'loader');
const buildDir = fileURLToPath(new URL('../public/build', import.meta.url));
const toDist = `${buildDir}/dist`;
const toLoader = `${buildDir}/loader`;

await rm(buildDir, { recursive: true, force: true });
await mkdir(toDist, { recursive: true });
await mkdir(toLoader, { recursive: true });
await cp(fromDist, toDist, { recursive: true });
await cp(fromLoader, toLoader, { recursive: true });
console.log(`Copied component bundle from ${pkgDir} to ${buildDir}/`);
