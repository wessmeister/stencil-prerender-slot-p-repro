import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'repro',
  outputTargets: [
    { type: 'dist', esmLoaderPath: '../loader' },
    { type: 'dist-hydrate-script' },
  ],
};
