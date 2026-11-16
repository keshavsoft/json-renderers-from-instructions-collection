# json-renderers-from-instructions-collection

> Composite multi-renderer orchestrator driven by declarative instructions and collections.

## Overview
Allows rendering multiple coordinated UI components (e.g. Form on top + Table below, or Select + Table) in **1 statement** from a single shared schema (`columns`) and dataset (`data`).

## Usage
```javascript
import render from "json-renderers-from-instructions-collection";

render({
    data,
    columns,
    targetHtmlId: "dom-render-container",
    classToApply: "",
    appendPosition: "replace",
    renderers: [
        { type: "form.simple" },
        { 
            type: "table.simple", 
            options: { showSerial: true, showOptions: true, showSearch: true } 
        }
    ]
});
```
