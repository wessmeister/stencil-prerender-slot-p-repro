import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'repro',
  outputTargets: [
    { type: 'dist', esmLoaderPath: '../loader' },
    {
      type: 'dist-custom-elements',
      dir: './lib/custom-elements/',
      customElementsExportBehavior: 'single-export-module',
      generateTypeDeclarations: false,
      externalRuntime: false,
    },
    { type: 'dist-hydrate-script' },
  ],
};
