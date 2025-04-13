import {LitElement, html, nothing} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './cifer-asset-input.js';

export class CiferAssetAllocation extends LitElement {
    static properties = {
        assetAllocation: { type: Array },
        _showValidationResult: { state: true, type: Boolean },
    };

    constructor() {
        super();
        this.assetAllocation = [];
    }

    validate() {
        this._showValidationResult = true;
        return this._sumCurrentAllocation() === 100;
    }

    _dispatchChangeEvent() {
        const event = new CustomEvent('cifer-asset-allocation:change', {
            bubbles: true,
            composed: true,
            detail: {
                assetAllocation: this.assetAllocation,
            },
        });
        this.dispatchEvent(event);
    }

    _updateAssetAllocation() {
        const categories = [];
        const assetElements = this.shadowRoot.querySelectorAll('cifer-asset-input');
        assetElements.forEach((assetElement) => {
            const name = assetElement.name;
            const targetAllocation = parseFloat(assetElement.targetAllocation);
            const currentValue = parseFloat(assetElement.currentValue);
            const mode = assetElement.mode;
            categories.push({ name, targetAllocation, currentValue, mode });
        });
        this.assetAllocation = categories;
        this._dispatchChangeEvent();
    }

    _addAssetClass()  {
        this.assetAllocation.push({
            name: 'New Asset Class',
            targetAllocation: this._suggestAllocation(),
            currentValue: 0,
            mode: 'edit',
        });
        this.requestUpdate();
        this._dispatchChangeEvent();
    }

    _suggestAllocation() {
        const suggestedAllocation = 100 - this._sumCurrentAllocation();
        return Math.max(Math.min(suggestedAllocation, 80), 0);
    }

    _sumCurrentAllocation() {
        let totalAllocation = 0;
        this.assetAllocation.map((asset) => {
            totalAllocation += asset.targetAllocation;
        });
        return totalAllocation;
    }

    render() {
        return html`
            <fieldset>
                <legend>Asset Allocation</legend>
                <div class="assets">
                    ${this.assetAllocation.map((asset) => html`
                        <cifer-asset-input
                            @cifer-asset-input:change="${this._updateAssetAllocation}"
                            .currentValue=${asset.currentValue}
                            .mode=${asset.mode}
                            .name=${asset.name}
                            .targetAllocation=${asset.targetAllocation}
                        />
                    `)}
                </div>
                <button @click="${this._addAssetClass}">Add Asset class</button>
            </fieldset>
            ${(this._showValidationResult && this._sumCurrentAllocation() !== 100) ? html`
                <div>
                    <p>Allocation currently sums up to ${this._sumCurrentAllocation()}%.
                        Set to 100% to start the calculation.
                    </p>
                </div>
            ` : nothing}
        `;
    }
}
customElements.define('cifer-asset-allocation', CiferAssetAllocation);
