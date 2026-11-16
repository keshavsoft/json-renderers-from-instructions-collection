import columns from "./columns.json" with { type: "json" };
import initialData from "./data.json" with { type: "json" };
import bindings from "./bindings.json" with { type: "json" };
import render from "../../../../docs/dist/v3/min.js";
import { bindEvents } from "../../../../vendor/dom-primitive-bindings.min.js";
import actions, { initState } from "./actions.js";

const containerId = "dom-render-container";
const dataset = [...initialData];

// Render all connected components together:
// 1. dataList.simple (supplies browser autocomplete options via <datalist id="columnName">)
// 2. form.simple (vertical data entry / view form)
// 3. table.withSearchAndFooter (live table with search, row actions, serial column, and input footer)
render({
    data: dataset,
    columns,
    targetHtmlId: containerId,
    appendPosition: "replace",
    renderers: [
        {
            type: "dataList.simple",
            options: {}
        },
        {
            type: "form.simple",
            options: {}
        },
        {
            type: "table.withSearchAndFooter",
            options: {
                showSerial: true,
                showOptions: true
            }
        }
    ],
    classToApply: "",
    showLog: false
});

// Attach list attributes to form inputs dynamically so they leverage the rendered <datalist> elements
columns.forEach(col => {
    const input = document.querySelector(`#form-simple-form-id #${col.columnName}`);
    if (input) {
        input.setAttribute("list", col.columnName);
    }
});

// Initialize reactive controller state
initState({ dataset, columns, render });

// Attach declarative event bindings to the root container
bindEvents(containerId, bindings, actions);
