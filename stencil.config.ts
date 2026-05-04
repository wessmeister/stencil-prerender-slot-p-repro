import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'repro',
  outputTargets: [
    { type: 'dist-hydrate-script' },
    {
      type: 'www',
      serviceWorker: null,
      copy: [{ src: 'index.html', dest: 'index.html' }],
    },
  ],
};
