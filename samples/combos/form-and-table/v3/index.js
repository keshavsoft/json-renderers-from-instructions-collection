import columns from "./columns.json" with { type: "json" };
import initialData from "./data.json" with { type: "json" };
import bindings from "./bindings.json" with { type: "json" };
import render from "../../../../docs/dist/v3/min.js";
import { bindEvents } from "../../../../vendor/dom-primitive-bindings.min.js";
import actions, { initState } from "./actions.js";

const containerId = "dom-render-container";
const dataset = [...initialData];

// 1. Initial composite render:
// - dataList.simple (hidden background datastore providing autocomplete)
// - form.simple (vertical form)
// - table.withSearch (live table with search and row action button)
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
            type: "table.withSearch",
            options: {
                showSerial: true,
                showOptions: true
            }
        }
    ],
    classToApply: "",
    showLog: false
});

// 2. Attach list="columnName" to form inputs for native autocomplete from the rendered <datalist>
columns.forEach(col => {
    const input = document.querySelector(`#form-simple-form-id input[name="${col.columnName}"]`) ||
                  document.querySelector(`#form-simple-form-id #${col.columnName}`);
    if (input) {
        input.setAttribute("list", col.columnName);
    }
});

// 3. Initialize interactive state
initState({ dataset, columns, render });

// 4. Bind declarative events to container
bindEvents(containerId, bindings, actions);
