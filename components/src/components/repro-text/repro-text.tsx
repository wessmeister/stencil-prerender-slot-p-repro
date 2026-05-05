import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'repro-text',
  styleUrl: 'repro-text.css',
  shadow: true,
})
export class ReproText {
  render() {
    return (
      <Host>
        <p class="repro-text"><slot /></p>
      </Host>
    );
  }
}
