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

    _dispatchChangeEvent() {
        const event = new CustomEvent('cifer-asset-input:change', {
            bubbles: true,
            composed: true,
            detail: {
                name: this.name,
                targetAllocation: this.targetAllocation,
                currentValue: this.currentValue,
                mode: this.mode,
            },
        });
        this.dispatchEvent(event);
    }

    _updateCurrentValue(event) {
        this.currentValue = event.target.value;
        this._dispatchChangeEvent();
    }

    _updateName(event) {
        this.name = event.target.value;
        this._dispatchChangeEvent();
    }

    _updateTargetAllocation(event) {
        this.targetAllocation = Math.max(Math.min(event.target.value, 100), 0);
        this._dispatchChangeEvent();
    }

    _toggleMode() {
        this.mode = this.mode === 'edit' ? 'default' : 'edit';
        this._dispatchChangeEvent();
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
                    html`<span>(Target Allocation: ${this.targetAllocation}%)</span>`
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
