import {LitElement, html} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

import './cifer-asset-allocation.js';
import './cifer-result.js';

export class CiferApp extends LitElement {
    static properties = {
        amountToInvest: { type: Number },
        appSettings: { type: Object },
        assetAllocation: { type: Array },
        _result: { state: true, type: Array },
    }

    constructor() {
        super();
        this.amountToInvest = .0;
        this.assetAllocation = [];
        this.appSettings = {
            currencySymbol: "€",
            currencyName: "EUR",
            locale: "de-DE",
        };
        this._result = [];
    }

    _dispatchChangeEvent() {
        const event = new CustomEvent('cifer-app:update', {
            bubbles: true,
            composed: true,
            detail: {
                amountToInvest: this.amountToInvest,
                assetAllocation: this.assetAllocation,
                appSettings: this.appSettings,
            },
        });
        this.dispatchEvent(event);
    }

    _runCalculation() {
        const assetAllocationComponent = this.shadowRoot.querySelector('cifer-asset-allocation');
        if (!assetAllocationComponent.validate()) {
            return;
        }

        try {
            this._result = calculateRebalance(this.assetAllocation, this.amountToInvest);
        } catch (err) {
            // Catch potential errors during the WASM call itself
            console.error("Error calling WASM function:", err);
        }
    }

    _updateAmountToInvest(event) {
        this.amountToInvest = parseFloat(event.target.value);
        this._result = [];
        this._dispatchChangeEvent();
    }

    _updateAssetAllocation(event) {
        this.assetAllocation = event.detail.assetAllocation;
        this._result = [];
        this._dispatchChangeEvent();
    }

    render() {
        return html`
            <cifer-asset-allocation
                @cifer-asset-allocation:change="${this._updateAssetAllocation}"
                .appSettings=${this.appSettings}
                .assetAllocation=${this.assetAllocation}
            ></cifer-asset-allocation>
            <label>
                Amount to invest:
                <input
                    @blur=${this._updateAmountToInvest}
                    type="number"
                    value="${this.amountToInvest}"
                    step="0.01"
                />
                ${this.appSettings.currencySymbol}
            </label>
            <button
                @click="${this._runCalculation}"
            >Calculate</button>
            <cifer-result
                .appSettings=${this.appSettings}
                .result=${this._result}
            ></cifer-result>
        `;
    }
}
customElements.define('cifer-app', CiferApp);
