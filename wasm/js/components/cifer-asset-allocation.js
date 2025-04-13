import {LitElement, html} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './cifer-asset-input.js';

export class CiferAssetAllocation extends LitElement {
    static properties = {
        _assetAllocation: { state: true, type: Array }
    };

    constructor() {
        super();
        this._assetAllocation = [];
    }

    get assetAllocation() {
        this._updateAssetAllocation();
        return this._assetAllocation;
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
        this._assetAllocation = categories;
    }

    _addAssetClass()  {
        this._updateAssetAllocation();
        this._assetAllocation.push({
            name: 'New Asset Class',
            targetAllocation: 0,
            currentValue: 0,
            mode: 'edit',
        });
    }

    render() {
        return html`
            <fieldset>
                <legend>Asset Allocation</legend>
                <div class="assets">
                    ${this._assetAllocation.map((asset) => html`
                        <cifer-asset-input
                            name="${asset.name}"
                            target-allocation="${asset.targetAllocation}"
                            current-value="${asset.currentValue}"
                            mode="${asset.mode}"
                        />
                    `)}
                </div>
                <button @click="${this._addAssetClass}">Add Asset class</button>
            </fieldset>
        `;
    }
}
customElements.define('cifer-asset-allocation', CiferAssetAllocation);
