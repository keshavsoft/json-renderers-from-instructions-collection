import columns from "./columns.json" with { type: "json" };
import initialData from "./data.json" with { type: "json" };
import bindings from "./bindings.json" with { type: "json" };
import render from "../../../../docs/dist/v3/min.js";
import { bindEvents } from "../../../../vendor/dom-primitive-bindings.min.js";
import actions, { initState } from "./actions.js";

const containerId = "dom-render-container";
const dataset = [...initialData];

// 1. Initial composite render: Form on top + Table below
render({
    data: dataset,
    columns,
    targetHtmlId: containerId,
    appendPosition: "replace",
    renderers: [
        {
            type: "form.simple",
            options: {}
        },
        {
            type: "table.withSearch",
            options: {
                showSerial: false
            }
        }
    ],
    classToApply: "",
    showLog: false
});

// 2. Initialize interactive state
initState({ dataset, columns, render });

// 3. Bind declarative events to container
bindEvents(containerId, bindings, actions);
