import columns from "./columns.json" with { type: "json" };
import data from "./data.json" with { type: "json" };
import bindings from "./bindings.json" with { type: "json" };
import render from "../../../../docs/dist/v3/min.js";
import { bindEvents } from "../../../../vendor/dom-primitive-bindings.min.js";
import actions from "./actions.js";

const containerId = "dom-render-container";

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

bindEvents(containerId, bindings, actions);
