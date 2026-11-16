# Interactive V3 — Table With Search

This sample demonstrates a complete `table.simple` with search and serial numbers.

## Interaction

1. Type a search term in the table search input.
2. Press Enter.
3. The action filters the original dataset.
4. The collection renderer is invoked with `table.bodyOnly` and the filtered data.
5. The generated body rows are moved into the existing `table-simple-body-id` element.

The existing table, header, footer, search input, and tbody element are preserved. Only the tbody's row children are replaced. The body-only renderer receives `showSerial: true`, so serial numbers are generated again from 1 for the filtered result.

## Architecture

- `table.simple`: initial complete table with search and serial options.
- `table.bodyOnly`: reused to generate filtered body rows.
- `bindings.json`: delegates the search input's `keydown` event to `onSearchEnter`.
- `actions.js`: filters data and coordinates the body-only render.

This sample does not change the collection renderer API or existing V1/V2 samples.
