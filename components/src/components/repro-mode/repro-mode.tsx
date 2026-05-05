import { Component, Prop, h } from '@stencil/core';

@Component({ tag: 'repro-mode' })
export class ReproMode {
  @Prop({ reflect: true }) mode: 'light' | 'dark' = 'light';
  render() { return <slot />; }
}
