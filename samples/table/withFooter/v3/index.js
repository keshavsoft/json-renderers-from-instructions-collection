import columns from "./columns.json" with { type: "json" };
import initialData from "./data.json" with { type: "json" };
import bindings from "./bindings.json" with { type: "json" };
import render from "../../../../docs/dist/v3/min.js";
import { bindEvents } from "../../../../vendor/dom-primitive-bindings.min.js";
import actions, { initState } from "./actions.js";

const containerId = "dom-render-container";
const dataset = [...initialData];

// 1. First render: create complete table layout with search, body, and footer
render({
    data: dataset,
    columns,
    targetHtmlId: containerId,
    appendPosition: "replace",
    renderers: [
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

// 2. Initialize action state
initState({
    dataset,
    columns,
    render,
    containerId,
    options: {
        showSerial: true,
        showOptions: true
    }
});

// 3. Bind declarative events to the stable outer container
bindEvents(containerId, bindings, actions);
