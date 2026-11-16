import runInstructions from "json-renderers-run-instructions";
import runOptions from "json-renderers-run-options";
import {
    definitions as fallbackDefinitions,
    spec as fallbackSpec,
    instructions as fallbackInstructions
} from "spec-repo";

export const buildSingleSpec = ({
    definitions = fallbackDefinitions,
    spec = fallbackSpec,
    instructions = fallbackInstructions,
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

    // Resolve instructions: support instructions array of keys
    let single = [...(config.single || [])];
    let double = [...(config.double || [])];
    let rowOnColumn = [...(config.rowOnColumn || [])];
    let columnOnRow = [...(config.columnOnRow || [])];

    const instructionKeys = config.instructions || config.instructionsFromTable;
    if (Array.isArray(instructionKeys) && instructions) {
        instructionKeys.forEach(key => {
            const op = instructions[key];
            if (!op) return;
            if (op.type === "columnOnRow") {
                columnOnRow.push(op);
            } else if (op.type === "rowOnColumn") {
                rowOnColumn.push(op);
            } else if (op.type === "double") {
                double.push(op);
            } else if (op.type === "single" || (!op.type && (op.sourcePath || op.templateKey))) {
                single.push(op);
            }
        });
    }

    // 1. Core Virtual DOM construction via run-instructions
    const instructionResult = runInstructions({
        single,
        double,
        rowOnColumn,
        columnOnRow,
        base: structuredClone(rawBase),
        data: { columns, data },
        showLog
    });

    const base = instructionResult?.base ?? instructionResult;

    // 2. Options and feature enhancement via run-options
    const rawOptionDefs = config.options || definitions[category]?.options || {};
    const optionDefs = {};
    for (const [optKey, optVal] of Object.entries(rawOptionDefs)) {
        if (typeof optVal === "string" && instructions?.[optVal]) {
            optionDefs[optKey] = instructions[optVal];
        } else {
            optionDefs[optKey] = optVal;
        }
    }

    runOptions({
        base,
        options,
        optionDefs,
        showLog
    });

    return base;
};

export default buildSingleSpec;
