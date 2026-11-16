import columns from "../common/columns.json" with { type: "json" };
import data from "../common/data.json" with { type: "json" };
import render from "../../../docs/dist/v2/min.js";

const targetHtmlId = "dom-render-container";

const start = () => {
    try {
        render({
            data,
            columns,
            targetHtmlId,
            appendPosition: "replace",
            renderers: [
          {
                    "type": "table.withSearch",
                    "options": {
                              "showSerial": false
                    }
          }
],
            showLog: false
        });
        
    } catch (error) {
        console.error("Render failed:", error);
        const container = document.getElementById(targetHtmlId);
        if (container) {
            container.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
        }
    }
};

start();
