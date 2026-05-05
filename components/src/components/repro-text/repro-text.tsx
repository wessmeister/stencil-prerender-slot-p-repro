import { Component, Element, Prop, State, Watch, h, Host } from '@stencil/core';

@Component({
  tag: 'repro-text',
  styleUrl: 'repro-text.css',
  shadow: true,
})
export class ReproText {
  @Element() element!: HTMLElement;

  @Prop({ reflect: true }) tag: 'p' | 'span' = 'p';
  @Prop({ reflect: true }) appearance?: 'dark' | 'light';

  @State() computedAppearance: 'dark' | 'light' = 'dark';

  @Watch('appearance')
  handleAppearance(v: 'dark' | 'light') { this.computedAppearance = v; }

  componentWillLoad() {
    if (this.appearance) {
      this.computedAppearance = this.appearance;
      return;
    }
    const mode = this.element.closest('repro-mode') as HTMLReproModeElement | null;
    if (mode) {
      const v = mode.getAttribute('mode') ?? 'light';
      this.computedAppearance = v === 'light' ? 'dark' : 'light';
    }
  }

  render() {
    const Tag = this.tag;
    return (
      <Host>
        <Tag class={`repro-text repro-text--${this.computedAppearance}`}><slot /></Tag>
      </Host>
    );
  }
}
