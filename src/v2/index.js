import buildSpec from "./buildSpec.js";
import buildSingleSpec from "./buildSingleSpec.js";
import jsonToDom from "@keshavsoft/json-to-dom";
import guardFunc from "json-renderers-guard";
import registerGlobal from "./registerGlobal/index.js";

const render = (config = {}) => {
    const showLog = config?.showLog;

    // Validate input via guardFunc (default type: collection)
    guardFunc({
        ...config,
        type: config.type || "collection"
    });

    if (showLog) {
        console.log("[from-instructions-collection] input config:", {
            renderers: config.renderers,
            columns: config.columns,
            data: config.data,
            targetHtmlId: config.targetHtmlId
        });
    }

    // 1. Build composite Virtual JSON DOM from collection
    const spec = buildSpec({
        renderers: config.renderers || [],
        data: config.data || [],
        columns: config.columns || [],
        layout: config.layout || "vertical",
        showLog
    });

    if (showLog) console.log("[from-instructions-collection] generated composite spec:", spec);

    // 2. Mount to DOM via json-to-dom
    const dom = jsonToDom({
        jsonSpec: spec,
        targetHtmlId: config.targetHtmlId,
        appendPosition: config.appendPosition || "replace",
        classToApply: config.classToApply || "",
        showLog
    });

    if (showLog) console.log("[from-instructions-collection] mounted DOM element:", dom);

    return dom;
};

registerGlobal(render);

export { render, buildSpec, buildSingleSpec };
export default render;
