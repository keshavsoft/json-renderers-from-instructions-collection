import buildSingleSpec from "./buildSingleSpec.js";
import {
    definitions as fallbackDefinitions,
    spec as fallbackSpec,
    instructions as fallbackInstructions
} from "spec-repo";

export const buildSpec = ({
    definitions = fallbackDefinitions,
    spec = fallbackSpec,
    instructions = fallbackInstructions,
    renderers = [],
    data = [],
    columns = [],
    showLog = false
} = {}) => {
    if (!Array.isArray(renderers) || renderers.length === 0) {
        throw new Error("renderers must be a non-empty array of renderer configurations.");
    }

    const childSpecs = renderers.map(item => {
        const rendererConfig = typeof item === "string" ? { type: item } : item;
        const loopInsideBuiltSpec = buildSingleSpec({
            definitions,
            spec,
            instructions,
            type: rendererConfig.type,
            data: rendererConfig.data || data,
            columns: rendererConfig.columns || columns,
            options: rendererConfig.options || {},
            showLog
        });

        return loopInsideBuiltSpec?.base ?? loopInsideBuiltSpec;
    });

    return childSpecs;
};

export default buildSpec;
