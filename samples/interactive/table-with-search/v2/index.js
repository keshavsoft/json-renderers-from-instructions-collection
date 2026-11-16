import columns from "./columns.json" with { type: "json" };
import initialData from "./data.json" with { type: "json" };
import bindings from "./bindings.json" with { type: "json" };
import render from "../../../../docs/dist/v2/min.js";
import { bindEvents } from "../../../../vendor/dom-primitive-bindings.min.js";
import actions, { initState } from "./actions.js";

const containerId = "dom-render-container";
const dataset = [...initialData];

// First render: create the complete table and its search input.
render({
    data: dataset,
    columns,
    targetHtmlId: containerId,
    appendPosition: "replace",
    renderers: [
        {
            type: "table.simple",
            options: {
                showSerial: true,
                showSearch: true
            }
        }
    ],
    classToApply: "",
    showLog: false
});

// The action reuses the collection renderer to execute table.bodyOnly.
initState({ dataset, columns, render, containerId });

// Bind once to the stable outer container. The tbody can be refreshed repeatedly.
bindEvents(containerId, bindings, actions);
