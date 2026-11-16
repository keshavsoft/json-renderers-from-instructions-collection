import columns from "./columns.json" with { type: "json" };
import data from "./data.json" with { type: "json" };
import render from "../../../../docs/dist/v2/min.js";

const containerId = "dom-render-container";

render({
    data,
    columns,
    targetHtmlId: containerId,
    appendPosition: "replace",
    renderers: [
        {
                "type": "form.simple",
                "options": {}
        }
],
    classToApply: "",
    showLog: false
});
