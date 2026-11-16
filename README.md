<div align="center">

# json-renderers-from-instructions-collection

**Declarative, Composite Multi-Renderer Orchestrator Driven by Instruction Collections**

[![npm version](https://img.shields.io/npm/v/json-renderers-from-instructions-collection.svg?style=flat-square&color=2563eb)](https://www.npmjs.com/package/json-renderers-from-instructions-collection)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](./package.json)
[![Type: Module](https://img.shields.io/badge/Module-ESM-success.svg?style=flat-square)](./package.json)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-0ea5e9.svg?style=flat-square&logo=github)](https://keshavsoft.github.io/json-renderers-from-instructions-collection/)


<p align="center">
  Render coordinated UI combinations (<b>Form + Table</b>, <b>Select + Table</b>, or <b>Full Dashboards</b>) in <b>1 single statement</b> from a shared Single-Source-of-Truth schema and dataset.
</p>

</div>

---

## 📌 Short Note: What is this & How does it work?

### What it is

`json-renderers-from-instructions-collection` is a high-level UI orchestrator. Traditional frontend UI workflows require writing separate HTML markup, manual form inputs, and table loops. This library solves that by taking **one single schema** (`columns`) and **one dataset** (`data`) to synthesize and mount multiple interacting UI controls (Forms, Tables, Dropdowns, Autocomplete DataLists) **with zero markup boilerplate**.

### How it works

1. **Contract Guard**: Validates the input collection configuration via `json-renderers-guard`.
2. **Instruction Synthesis**: Iterates over requested renderers (`form.simple`, `table.simple`, etc.) and runs declarative transformation rules (`json-renderers-run-instructions`) against `spec-repo` definitions.
3. **Feature Options**: Applies toggles such as search bars, serial numbers, and action buttons (`json-renderers-run-options`).
4. **DOM Mounting**: Wraps elements into a structured Virtual JSON DOM tree and mounts them to the target container using `@keshavsoft/json-to-dom`.
5. **Global Runtime Registry**: Automatically registers on `globalThis.ks.jsonRenderers.fromInstructionsCollection`.

---

## 📦 Installation

### Via npm:

```bash
npm install json-renderers-from-instructions-collection
```

### Via Browser ESM / CDN:

```html
<script type="module">
  import render from "./docs/dist/v1/min.js";
  // or use globalThis.ks.jsonRenderers.fromInstructionsCollection.render
</script>
```

---

```javascript
import { buildSingleSpec } from "json-renderers-from-instructions-collection";

const bodySpec = buildSingleSpec({
  type: "table.bodyOnly",
  data: filteredData,
  columns,
  options: { showSerial: true, showOptions: true },
});
```

---

## 🎛️ Supported Component Types & Options

| Type Identifier   | Description                                         | Supported Options                         |
| :---------------- | :-------------------------------------------------- | :---------------------------------------- |
| `table.simple`    | Complete data table with header, body & footer      | `showSerial`, `showSearch`, `showOptions` |
| `table.bodyOnly`  | Generates only `<tr>` body rows for partial updates | `showSerial`, `showOptions`               |
| `form.simple`     | Data entry form generated from column attributes    | `title`, `submitLabel`                    |
| `select.simple`   | Standalone `<select>` dropdown picker               | `placeholder`, `defaultOption`            |
| `dataList.simple` | HTML5 `<datalist>` suggestion element               | `listId`                                  |

---

## 📄 License

MIT © [KeshavSoft](https://github.com/keshavsoft)
