import columns from "./columns.json" with { type: "json" };
import initialData from "./data.json" with { type: "json" };
import render from "../../../../docs/dist/v2/min.js";

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