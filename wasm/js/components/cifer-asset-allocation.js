import {LitElement, html} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './cifer-asset-input.js';

export class CiferAssetAllocation extends LitElement {
    static properties = {
        assetAllocation: { type: Array }
    };

    constructor() {
        super();
        this.assetAllocation = [];
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
    }

    _addAssetClass()  {
        this.assetAllocation.push({
            name: 'New Asset Class',
            targetAllocation: 0,
            currentValue: 0,
            mode: 'edit',
        });
        this.requestUpdate();
    }

    render() {
        return html`
            <fieldset>
                <legend>Asset Allocation</legend>
                <div class="assets">
                    ${this.assetAllocation.map((asset) => html`
                        <cifer-asset-input
                            @cifer-asset-input:change="${this._updateAssetAllocation}"
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
