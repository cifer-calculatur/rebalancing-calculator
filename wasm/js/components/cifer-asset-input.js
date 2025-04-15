import {LitElement, html} from 'lit';
import styles from '../modules/commonStyles.js';
import './cifer-amount-input';

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
        this.currentValue = event.detail.value;
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
                :host {
                    line-height: 1.4;
                }

                ${styles.button}
                ${styles.input}

                span {
                    cursor: pointer;
                }

                .container {
                    align-items: center;
                    display: flex;
                    flex-wrap: wrap;
                }

                .col {
                    flex-basis: 100%;
                    margin-bottom: 8px;
                }

                @media (min-width: 600px) {
                    .container {
                        flex-wrap: nowrap;
                    }

                    .col {
                        margin-bottom: 0;
                    }

                    .col-lg-4 {
                        flex-basis: 33.3333%;
                    }

                    .col-lg-8 {
                        flex-basis: 66.6667%;
                    }

                    .col:last-child {
                        text-align: right;
                    }
                }
            </style>
            <div class="container">
                ${this.mode === 'edit' ?
                    html`
                        <div class="col col-lg-4">
                            <label>Name
                                <input type="text" @blur="${this._updateName}" value="${this.name}">
                            </label>
                        </div>
                        <div class="col col-lg-8">
                            <label for="allocation">Target Allocation</label>

                            <input id="allocation" type="number" @blur="${this._updateTargetAllocation}" value="${this.targetAllocation}"><button @click="${this._toggleMode}">✅</button><button @click=${this._dispatchRemoveEvent}>🗑</button>
                        </div>
                    ` :
                    html`
                        <div class="col col-lg-8" @click="${this._toggleMode}">
                            <strong>${this.name}</strong>
                            (Target: ${this.targetAllocation}%)
                        </div>
                        <div class="col col-lg-4">
                            <cifer-amount-input
                                @cifer-amount-input:change="${this._updateCurrentValue}"
                                .appSettings=${this.appSettings}
                                .label=${'Value'}
                                .value=${this.currentValue}
                            ></cifer-amount-input>
                        </div>
                    `
                }
            </div>
        `;
    }
}
customElements.define('cifer-asset-input', CiferAssetInput);
