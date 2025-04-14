import {LitElement, html} from 'lit';
import styles from '../modules/commonStyles.js';

import './cifer-asset-allocation.js';
import './cifer-result.js';

const defaultSettings = {
    currencySymbol: "€",
    currencyName: "EUR",
    locale: "de-DE",
};

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
        this.appSettings = defaultSettings;
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

    _removeState(e) {
        e.preventDefault();

        this.amountToInvest = .0;
        this.appSettings = defaultSettings;
        this.assetAllocation = [];
        this._result = [];

        this._dispatchChangeEvent();
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
            <style>
                ${styles.button}
                ${styles.input}
                :host {
                    background-color: #000;
                    color: var(--font-color);
                    display: block;
                    font-family: var(--font-family);
                    height: 100vh;
                    width: 100vw;
                }

                a {
                    color: color: var(--font-color);
                }

                .container {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    margin: auto;
                    max-width: 90vw;
                    padding-top: 20px;
                    width: 900px;
                }

                summary {
                    cursor: pointer;
                }
            </style>
            <div class="container">
                <h1>CiFeR - Cash Flow Rebalancing Calculator</h1>
                <details>
                    <summary>Explanation of Cash Flow Rebalancing and this tool</summary>
                    <p>This tool is designed for investors who have a portfolio with a target asset allocation. Over time, as the performance of your asset classes diverges, your actual allocation may drift away from your original plan.</p>
                    <p>Traditionally, rebalancing involves selling assets from overrepresented asset classes and using the proceeds to buy assets from underrepresented ones. However, selling assets can incur costs such as trading fees, spreads, or taxes.</p>
                    <p>Cash Flow Rebalancing offers an alternative. Instead of selling, you use only your new contributions to bring your portfolio back toward the target allocation. Each time you have new funds available to invest, use this calculator to determine how much to allocate to each asset class.</p>
                    <p>If your current allocation has deviated too far for your new investment alone to fully rebalance the portfolio, the calculator will bring you as close as possible—assuming future contributions will eventually help close the gap.</p>
                </details>
                <cifer-asset-allocation
                    @cifer-asset-allocation:change="${this._updateAssetAllocation}"
                    .appSettings=${this.appSettings}
                    .assetAllocation=${this.assetAllocation}
                ></cifer-asset-allocation>
                <fieldset>
                    <legend>Investment</legend>
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
                    >Calculate
                    </button>
                </fieldset>
                <cifer-result
                    .appSettings=${this.appSettings}
                    .result=${this._result}
                ></cifer-result>
                <details>
                    <summary>Privacy</summary>
                    <p>This web page is hosted on GitHub pages.</p>
                    <blockquote>
                        <p>When a GitHub Pages site is visited, the visitor's IP address is logged and stored for security purposes, regardless of whether the visitor has signed into GitHub or not. For more information about GitHub's security practices, see <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">GitHub Privacy Statement</a>.</p>
                    </blockquote>
                    <p>All data that you put into the calculation tool will remain in your browser. The calculation is performed on your device. The data is saved in your browser's local storage for your convenience. <a href="#" @click=${this._removeState}>Click here</a> if you wish to remove any stored data from your browser (permanently deletes your provided data!).</p>
                </details>
            </div>
        `;
    }
}
customElements.define('cifer-app', CiferApp);
