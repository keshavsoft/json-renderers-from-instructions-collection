const setLog = (text) => {
    let logBox = document.getElementById("selection-feedback");
    if (!logBox) {
        logBox = document.createElement("div");
        logBox.id = "selection-feedback";
        logBox.className = "alert alert-info mt-3 shadow-sm";
        document.getElementById("dom-render-container")?.prepend(logBox);
    }
    logBox.innerHTML = `<strong>Interactive Event:</strong> ${text}`;
};

export const actions = {
    onSelectChoose: (event, matchElement) => {
        setLog(`Select Dropdown [${matchElement.id}] changed to: <span class="badge bg-primary fs-6">${matchElement.value}</span>`);
    },

    onDataListInput: (event, matchElement) => {
        setLog(`DataList Autocomplete [${matchElement.name}] typed: <span class="badge bg-success fs-6">${matchElement.value}</span>`);
    }
};

export default actions;
