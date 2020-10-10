import { LitElement, html, css } from 'lit-element';
import '@material/mwc-button';

function breweryTemplate(brewery, toggleVisitedStatus) {
  return html`
    <h3>${brewery.name} (${brewery.visited ? 'visited' : 'not-visited'})</h3>
    <p>brewery type: ${brewery.type}</p>
    <p>city: ${brewery.city}</p>
    <mwc-button
      @click=${toggleVisitedStatus}
      icon="${brewery.visited ? 'delete' : 'done'}"
    >
      Mark as ${brewery.visited ? 'not visited' : 'visited'}
    </mwc-button>
  `;
}

export class MyBreweryApp extends LitElement {
  static get properties() {
    return {
      loading: { type: Boolean },
      breweries: { type: String },
      filter: { type: String },
    };
  }

  connectedCallback() {
    super.connectedCallback();

    if (!this.breweries) {
      this.fetchBreweries();
    }
  }

  async fetchBreweries() {
    this.loading = true;
    const response = await fetch('https://api.openbrewerydb.org/breweries');
    const jsonResponse = await response.json();
    this.breweries = jsonResponse;
    this.loading = false;
  }

  render() {
    if (this.loading) {
      return html`<p>Loading...</p>`;
    }

    const totalVisited = this.breweries.filter(b => b.visited).length;
    const totalNotVisited = this.breweries.length - totalVisited;
    const breweries = this.breweries.filter(brewery => {
      if (!this.filter) {
        return true;
      }
      return this.filter === 'visited' ? brewery.visited : !brewery.visited;
    });

    return html`
      <h1>Breweries App</h1>

      <h2>Breweries</h2>
      <p>(${totalVisited} visited and ${totalNotVisited} still to go)</p>

      <mwc-button @click=${this._filterNone}>Filter none</mwc-button>
      <mwc-button @click=${this._filterVisited}>Filter visited</mwc-button>
      <mwc-button @click=${this._filterNotVisited}
        >Filter not visited</mwc-button
      >

      <ul>
        ${breweries.map(
          brewery => html`
            <li>
              ${breweryTemplate(brewery, () =>
                this._toggleVisitedStatus(brewery)
              )}
              <!-- <brewery-detail
                .name=${brewery.name}
                .type=${brewery.brewery_type}
                .city=${brewery.city}
                .visited=${brewery.visited}
                @toggle-visited-status=${() =>
                this._toggleVisitedStatus(brewery)}
              ></brewery-detail> -->
            </li>
          `
        )}
      </ul>
    `;
  }

  _toggleVisitedStatus(breweryToUpdate) {
    this.breweries = this.breweries.map(brewery => {
      return brewery === breweryToUpdate
        ? { ...brewery, visited: !brewery.visited }
        : brewery;
    });
  }

  _filterNone() {
    this.filter = null;
  }

  _filterVisited() {
    this.filter = 'visited';
  }

  _filterNotVisited() {
    this.filter = 'not-visited';
  }
}
