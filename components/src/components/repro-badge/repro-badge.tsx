import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'repro-badge',
  styleUrl: 'repro-badge.css',
  shadow: true,
})
export class ReproBadge {
  render() {
    return (
      <Host>
        <div class="repro-badge">
          <span aria-hidden="true" class="repro-badge__prefix">●</span>
          <repro-text>
            <span><slot /></span>
          </repro-text>
        </div>
      </Host>
    );
  }
}
