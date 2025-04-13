import {LitElement, html, nothing} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class CiferResult extends LitElement {
    static properties = {
        result: { type: Array }
    }

    constructor() {
        super();
        this.result = [];
    }

    render() {
        // render noting if result is empty
        if (this.result.length === 0) {
            return nothing;
        }
        return html`
            <style>
                /* Add your styles here */
            </style>
            <table>
                <thead>
                    <tr>
                        <th>Asset Class</th>
                        <th>Added</th>
                        <th>Achieved Allocation</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.result.map((asset) => html`
                        <tr>
                            <td>${asset.Name}</td>
                            <td>${asset.Investment}</td>
                            <td>${asset.AchievedAllocation}</td>
                        </tr>
                    `)}
                </tbody>
            </table>
        `;
    }
}
customElements.define('cifer-result', CiferResult);
