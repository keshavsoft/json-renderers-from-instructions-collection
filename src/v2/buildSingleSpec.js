import runInstructions from "json-renderers-run-instructions";
import runOptions from "json-renderers-run-options";
import { definitions as fallbackDefinitions } from "spec-repo";

export const buildSingleSpec = ({
    definitions = fallbackDefinitions,
    type = "table.simple",
    data = [],
    columns = [],
    options = {},
    showLog = false
} = {}) => {
    const localTypeSplit = type.split(".");
    const category = localTypeSplit[0];
    const variant = localTypeSplit[1];

    const categoryDef = definitions[category];
    const config = (variant && categoryDef?.[variant]) ? categoryDef[variant] : categoryDef;
    if (!config) {
        throw new Error(`Unknown component definition for type "${type}".`);
    }

    // 1. Core Virtual DOM construction via run-instructions
    const base = runInstructions({
        single: config.single || [],
        double: config.double || [],
        rowOnColumn: config.rowOnColumn || [],
        columnOnRow: config.columnOnRow || [],
        base: structuredClone(config.base),
        data: { columns, data },
        showLog
    });

    // 2. Options and feature enhancement via run-options
    const optionDefs = config.options || definitions[category]?.options || {};
    runOptions({
        base,
        options,
        optionDefs,
        showLog
    });

    return base;
};

export default buildSingleSpec;
