# Interactive V5 — Table With Search (Pure baseFromSpec)

This sample demonstrates a complete `table.withSearch` architecture driven 100% by declarative `baseFromSpec` templates.

## Architecture

1. **Pure baseFromSpec**: All visual structure (the 3-part header bar with Title, Status badge, and Search input, plus the Table mount container) comes from `spec-repo` templates without runtime JSONPath injection.
2. **Clean Table Refresh**: When searching, `state.render` targets the table mount point (`#table-content-container`) with `table.simple` and `appendPosition: "replace"`, cleanly replacing the table without creating duplicate elements.
3. **No Stray Text**: Status feedback is displayed directly within the cohesive 3-part table header bar.
