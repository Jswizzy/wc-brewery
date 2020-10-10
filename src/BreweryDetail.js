import { LitElement, html, css } from 'lit-element';

export class BreweryDetail extends LitElement {
  static get properties() {
    return {
      name: { type: String },
      type: { type: String },
      city: { type: String },
      visited: { type: Boolean },
    };
  }

  render() {
    return html`
      <h3>${this.name} (${this.visited ? 'visited' : 'not-visited'})</h3>
      <p>brewery type: ${this.type}</p>
      <p>city: ${this.city}</p>
      <mwc-button
        @click=${this._toggleVisitedStatus}
        icon="${this.visited ? 'delete' : 'done'}"
      >
        Mark as ${this.visited ? 'not visited' : 'visited'}
      </mwc-button>
    `;
  }

  _toggleVisitedStatus() {
    this.dispatchEvent(new CustomEvent('toggle-visited-status'));
  }
}
