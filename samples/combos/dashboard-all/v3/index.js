import columns from "./columns.json" with { type: "json" };
import data from "./data.json" with { type: "json" };
import bindings from "./bindings.json" with { type: "json" };
import render from "../../../../docs/dist/v3/min.js";
import { bindEvents } from "../../../../vendor/dom-primitive-bindings.min.js";
import actions, { initState } from "./actions.js";

const containerId = "dom-render-container";
const dataset = [...data];

render({
    data: dataset,
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

initState({ dataset, columns, render });
bindEvents(containerId, bindings, actions);
