import columns from "./columns.json" with { type: "json" };
import data from "./data.json" with { type: "json" };
import bindings from "./bindings.json" with { type: "json" };
import render from "../../../../docs/dist/v3/min.js";
import { bindEvents } from "../../../../vendor/dom-primitive-bindings.min.js";
import actions from "./actions.js";

const containerId = "dom-render-container";

// Render select dropdowns and datalists
render({
    data,
    columns,
    targetHtmlId: containerId,
    appendPosition: "replace",
    renderers: [
        {
            type: "select.simple",
            options: {}
        },
        {
            type: "dataList.simple",
            options: {}
        }
    ],
    classToApply: "",
    showLog: false
});

// Create interactive input fields hooked to the datalists for live auto-complete testing
const testInputContainer = document.createElement("div");
testInputContainer.className = "card p-3 mt-3 bg-white border-0 shadow-sm";
testInputContainer.innerHTML = `
    <h6 class="fw-bold text-secondary mb-2">Test Native Autocomplete (Inputs connected to &lt;datalist&gt;):</h6>
    <div class="row g-2">
        ${columns.map(col => `
            <div class="col-md-4">
                <label class="form-label small text-muted mb-1">${col.columnName}:</label>
                <input class="form-control" list="${col.columnName}" name="${col.columnName}" placeholder="Start typing ${col.columnName}...">
            </div>
        `).join("")}
    </div>
`;
document.getElementById(containerId)?.appendChild(testInputContainer);

bindEvents(containerId, bindings, actions);
