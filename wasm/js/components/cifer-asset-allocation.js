import {LitElement, html, nothing} from 'lit';
import styles from '../modules/commonStyles.js';
import './cifer-asset-input.js';

export class CiferAssetAllocation extends LitElement {
    static properties = {
        appSettings: { type: Object },
        assetAllocation: { type: Array },
        _showValidationResult: { state: true, type: Boolean },
    };

    constructor() {
        super();
        this.appSettings = {};
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
            const identifier = assetElement.identifier;
            categories.push({ name, targetAllocation, currentValue, mode, identifier });
        });
        this.assetAllocation = categories;
        this._dispatchChangeEvent();
    }

    _addAssetClass()  {
        this.assetAllocation.push({
            currentValue: 0,
            identifier: Math.random().toString(36).substring(2, 15),
            mode: 'edit',
            name: 'New Asset Class',
            targetAllocation: this._suggestAllocation(),
        });
        this.requestUpdate();
        this._dispatchChangeEvent();
    }

    _removeAssetClass(event) {
        const identifier = event.detail.identifier;
        this.assetAllocation = this.assetAllocation.filter((asset) => asset.identifier !== identifier);
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
            <style>
                cifer-asset-input {
                    display: block;
                    margin-bottom: 5px;
                }
                ${styles.button}
            </style>
            <fieldset>
                <legend>Asset Allocation</legend>
                <div class="assets">
                    ${this.assetAllocation.map((asset) => html`
                        <cifer-asset-input
                            @cifer-asset-input:change="${this._updateAssetAllocation}"
                            @cifer-asset-input:remove="${this._removeAssetClass}"
                            .appSettings=${this.appSettings}
                            .currentValue=${asset.currentValue}
                            .identifier=${asset.identifier}
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
