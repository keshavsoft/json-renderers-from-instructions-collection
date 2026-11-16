import columns from "./columns.json" with { type: "json" };
import data from "./data.json" with { type: "json" };
import bindings from "./bindings.json" with { type: "json" };
import render from "../../../../docs/dist/v3/min.js";
import { bindEvents } from "../../../../vendor/dom-primitive-bindings.min.js";
import actions, { initState } from "./actions.js";

const containerId = "dom-render-container";
const dataset = [...data];

// Set up layout container with select area and table area
const container = document.getElementById(containerId);
if (container) {
    container.innerHTML = `
        <div class="card p-3 mb-3 bg-white border-0 shadow-sm">
            <label class="form-label fw-bold text-secondary small">Filter Table by Dropdown:</label>
            <div id="select-area"></div>
        </div>
        <div id="table-area"></div>
    `;
}

// 1. Render select dropdowns into select-area
render({
    data: dataset,
    columns,
    targetHtmlId: "select-area",
    appendPosition: "replace",
    renderers: [
        {
            type: "select.simple",
            options: {}
        }
    ],
    classToApply: "",
    showLog: false
});

// 2. Render table into table-area
render({
    data: dataset,
    columns,
    targetHtmlId: "table-area",
    appendPosition: "replace",
    renderers: [
        {
            type: "table.simple",
            options: {
                showSerial: true,
                showOptions: true
            }
        }
    ],
    classToApply: "",
    showLog: false
});

// 3. Init state and bind declarative listeners
initState({ dataset, columns, render });
bindEvents(containerId, bindings, actions);
