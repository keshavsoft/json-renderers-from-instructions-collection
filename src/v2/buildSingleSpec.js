import runInstructions from "json-renderers-run-instructions";
import runOptions from "json-renderers-run-options";
import { definitions as fallbackDefinitions, spec as fallbackSpec } from "spec-repo";

export const buildSingleSpec = ({
    definitions = fallbackDefinitions,
    spec = fallbackSpec,
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

    // Resolve base: if baseFromSpec is present, pull from spec; otherwise config.base
    const rawBase = config.baseFromSpec ? spec[config.baseFromSpec] : config.base;
    if (!rawBase) {
        throw new Error(`Base template not found for type "${type}".`);
    }

    // 1. Core Virtual DOM construction via run-instructions
    const instructionResult = runInstructions({
        single: config.single || [],
        double: config.double || [],
        rowOnColumn: config.rowOnColumn || [],
        columnOnRow: config.columnOnRow || [],
        base: structuredClone(rawBase),
        data: { columns, data },
        showLog
    });

    const base = instructionResult?.base ?? instructionResult;

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
