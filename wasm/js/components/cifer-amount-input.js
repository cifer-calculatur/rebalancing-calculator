import {LitElement, html} from 'lit';
import styles from '../modules/commonStyles.js';

export class CiferAmountInput extends LitElement {
    static properties = {
        appSettings: { type: Object },
        label: { type: String },
        value: { type: Number },
    }

    constructor() {
        super();
        this.label = '';
        this.value = 0;
    }

    _dispatchChangeEvent() {
        const event = new CustomEvent('cifer-amount-input:change', {
            bubbles: true,
            composed: true,
            detail: {
                value: this.value,
            },
        });
        this.dispatchEvent(event);
    }

    render() {
        return html`
            <style>
                :host {
                    display: block;
                }

                ${styles.input}

                div {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
            </style>
            <div>
                <label for="value">${this.label}</label>
                <span>
                    <input
                        id="value"
                        type="number"
                        @blur="${this._dispatchChangeEvent}"
                        value="${this.currentValue}"
                        step="0.01"
                    />
                    ${this.appSettings.currencySymbol}
                </span>
            </div>
        `;
    }
}
customElements.define('cifer-amount-input', CiferAmountInput);
