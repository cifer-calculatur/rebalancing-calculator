import {LitElement, html, nothing} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import styles from '../modules/commonStyles.js';

export class CiferAssetInput extends LitElement {
    static properties = {
        appSettings: { type: Object },
        currentValue: { type: Number },
        identifier: { type: String },
        mode: { type: String },
        name: { type: String },
        targetAllocation: { type: Number },
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

    _dispatchRemoveEvent() {
        const event = new CustomEvent('cifer-asset-input:remove', {
            bubbles: true,
            composed: true,
            detail: {
                identifier: this.identifier,
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
                ${styles.button}
                ${styles.input}

                span {
                    cursor: pointer;
                }
            </style>
            <div>
                ${this.mode === 'edit' ?
                    html`
                        <label>Name:
                            <input type="text" @blur="${this._updateName}" value="${this.name}">
                        </label>
                        <label>Target Allocation:
                            <input type="number" @blur="${this._updateTargetAllocation}" value="${this.targetAllocation}">
                        </label>
                    ` :
                    html`
                        <span style="display: inline-block; width: 50%;" @click="${this._toggleMode}">
                            <strong>${this.name}</strong>
                            (Target: ${this.targetAllocation}%)
                        </span>
                    `
                }
                ${this.mode === 'edit' ?
                    html`
                        <button
                            @click="${this._toggleMode}"
                        >✔</button>
                        <button
                            @click=${this._dispatchRemoveEvent}
                        >🗑</button>
                    ` :
                    nothing
                }
                ${this.mode === 'default' ?
                    html`<label>Current Value:
                        <input type="number" @blur="${this._updateCurrentValue}" value="${this.currentValue}">
                        ${this.appSettings.currencySymbol}
                    </label>` :
                    nothing
                }
            </div>
        `;
    }
}
customElements.define('cifer-asset-input', CiferAssetInput);
