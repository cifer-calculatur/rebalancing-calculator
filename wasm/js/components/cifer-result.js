import {LitElement, html, nothing} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class CiferResult extends LitElement {
    static properties = {
        appSettings: { type: Object },
        result: { type: Array }
    }

    constructor() {
        super();
        this.appSettings = {};
        this.result = [];
    }

    _formatCurrency(value) {
        return new Intl.NumberFormat(this.appSettings.locale, { style: "currency", currency: this.appSettings.currencyName }).format(value);
    }

    render() {
        // render noting if result is empty
        if (this.result.length === 0) {
            return nothing;
        }
        return html`
            <style>
                :host {
                    color: var(--font-color);
                    font-family: var(--font-family);
                }
                td, th {
                    color: var(--font-color);
                    font-family: var(--font-family);
                    padding: 5px;
                }
                td.number {
                    text-align: right;
                }
                th {
                    text-transform: uppercase;
                }
            </style>
            <fieldset>
                <legend>Result</legend>
                <table>
                    <thead>
                        <tr>
                            <th>Asset Class</th>
                            <th>Added</th>
                            <th>Achieved Allocation</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.result.map((asset) => html`
                            <tr>
                                <td>${asset.Name}</td>
                                <td class="number">${this._formatCurrency(asset.Investment)}</td>
                                <td class="number">${Math.round(asset.AchievedAllocation * 100) / 100}%</td>
                            </tr>
                        `)}
                    </tbody>
                </table>
            </fieldset>
        `;
    }
}
customElements.define('cifer-result', CiferResult);
