import {LitElement, html, nothing} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class CiferAssetInput extends LitElement {
    static properties = {
        name: { type: String },
        targetAllocation: { type: Number },
        currentValue: { type: Number },
        mode: { type: String }
    };

    constructor() {
        super();
        this.name = '';
        this.targetAllocation = 0;
        this.currentValue = 0;
        this.mode = 'default';
    }

    _updateCurrentValue(event) {
        this.currentValue = event.target.value;
    }

    _updateName(event) {
        this.name = event.target.value;
    }

    _updateTargetAllocation(event) {
        this.targetAllocation = event.target.value;
    }

    _toggleMode() {
        this.mode = this.mode === 'edit' ? 'default' : 'edit';
    }

    render() {
        return html`
            <style>
                /* Add your styles here */
            </style>
            <div>
                ${this.mode === 'edit' ?
                    html`<label>Name:
                        <input type="text" @blur="${this._updateName}" value="${this.name}">
                    </label>` :
                    html`<span><strong>${this.name}</strong></span>`
                }
                ${this.mode === 'edit' ?
                    html`<label>Target Allocation:
                        <input type="number" @blur="${this._updateTargetAllocation}" value="${this.targetAllocation}">
                    </label>` :
                    html`<span>(Target Allocation: ${this.targetAllocation})</span>`
                }
                <button @click="${this._toggleMode}">${this.mode === 'edit' ? '✔️' : '✏️'}</button>
                ${this.mode === 'default' ?
                    html`<label>Current Value:
                        <input type="number" @blur="${this._updateCurrentValue}" value="${this.currentValue}">
                    </label>` :
                    nothing
                }
            </div>
        `;
    }
}
customElements.define('cifer-asset-input', CiferAssetInput);
