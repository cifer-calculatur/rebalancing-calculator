const go = new Go();
WebAssembly.instantiateStreaming(fetch("build/main.wasm"), go.importObject).then((result) => {
    go.run(result.instance);
});

// set state from local storage on load
window.addEventListener('load', () => {
    const app = document.querySelector('cifer-app');
    const state = JSON.parse(localStorage.getItem('cifer-state'));
    if (state.assetAllocation) {
        app.assetAllocation = state.assetAllocation;
    }
    if (state.amountToInvest) {
        app.amountToInvest = state.amountToInvest;
    }
});

// save state to local storage
window.addEventListener('cifer-app:update', (event) => {
    const state = event.detail;
    state.version = 1;
    localStorage.setItem('cifer-state', JSON.stringify(state));
});
