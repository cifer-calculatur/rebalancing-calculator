const go = new Go();
WebAssembly.instantiateStreaming(fetch("build/main.wasm"), go.importObject).then((result) => {
    go.run(result.instance);
});

function deepMerge(obj1, obj2) {
    for (let key in obj2) {
        if (obj2.hasOwnProperty(key)) {
            if (obj2[key] instanceof Object && obj1[key] instanceof Object) {
                obj1[key] = deepMerge(obj1[key], obj2[key]);
            } else {
                obj1[key] = obj2[key];
            }
        }
    }
    return obj1;
}

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
    if (state.appSettings) {
        app.appSettings = deepMerge(app.appSettings, state.appSettings);
    }
});

// save state to local storage
window.addEventListener('cifer-app:update', (event) => {
    const state = event.detail;
    state.version = 1;
    localStorage.setItem('cifer-state', JSON.stringify(state));
});
