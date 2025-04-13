import {LitElement, html} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

import './cifer-asset-allocation.js';
import './cifer-result.js';

export class CiferApp extends LitElement {
    static properties = {
        _result: { state: true, type: Array },
    }

    constructor() {
        super();
        this._result = [];
    }

    _runCalculation() {
        const assetAllocation = this.shadowRoot.querySelector('cifer-asset-allocation').assetAllocation;
        const amountToInvest = parseFloat(this.shadowRoot.getElementById('amount').value);

        try {
            this._result = calculateRebalance(assetAllocation, amountToInvest);
        } catch (err) {
            // Catch potential errors during the WASM call itself
            console.error("Error calling WASM function:", err);
        }
    }

    render() {
        console.log(this._result);
        return html`
            <cifer-asset-allocation></cifer-asset-allocation>
            <label>
                Amount to invest:
                <input type="number" id="amount" value="380.00" step="0.01"/>
            </label>
            <button @click="${this._runCalculation}">Calculate</button>
            <cifer-result .result=${this._result}></cifer-result>
        `;
    }
}
customElements.define('cifer-app', CiferApp);
