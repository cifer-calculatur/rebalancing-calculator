import {css} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export default {
    button: css`
        button {
            background-color: var(--button-background);
            border: var(--button-border);
            border-radius: var(--button-border-radius);
            color: var(--font-color);
            cursor: pointer;
            font-family: var(--font-family);
            font-size: 16px;
            padding: var(--button-padding);
            text-transform: uppercase;
        }
    `,
    input: css`
        input[type="text"], input[type="number"] {
            background-color: var(--button-background);
            border: var(--button-border);
            border-radius: var(--button-border-radius);
            color: var(--font-color);
            font-family: var(--font-family);
            font-size: 16px;
            padding: var(--button-padding);
        }
        input[type="number"] {
            text-align: right;
            width: 100px;
        }
    `,
}
